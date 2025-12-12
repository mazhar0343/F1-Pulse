import fastf1
import pandas as pd
import numpy as np
from catboost import CatBoostRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class F1Predictor:
    def __init__(self):
        self.model = CatBoostRegressor(
            iterations=800,
            learning_rate=0.05,
            depth=8,
            loss_function='MAE',
        )

    def get_schedule(self, year):
        try:
            schedule = fastf1.get_event_schedule(year)
            races = schedule[schedule['EventFormat'] != 'testing']
            return races[['RoundNumber', 'EventName', 'EventDate', 'Location']].to_dict('records')
        except Exception as e:
            print(f"Error fetching schedule: {e}")
            return []

    def _get_qualifying_metrics(self, year, round_num):
        try:
            session = fastf1.get_session(year, round_num, 'Q')
            session.load(telemetry=False, weather=False, messages=False)

            if session.results.empty:
                return None

            results = session.results.copy()

            def get_best_time(row):
                times = [row.get('Q3'), row.get('Q2'), row.get('Q1')]
                valid_times = [t for t in times if pd.notnull(t)]
                return min(valid_times) if valid_times else pd.NaT

            results['BestQualiTime'] = results.apply(get_best_time, axis=1)
            results = results.dropna(subset=['BestQualiTime'])

            if results.empty:
                return None

            pole_time = results['BestQualiTime'].min()
            results['Q_Delta'] = (results['BestQualiTime'] - pole_time).dt.total_seconds()
            results['GridPosition'] = results['Position']

            team_strength = results.groupby('TeamName')['GridPosition'].transform('mean')
            results['TeamStrength'] = team_strength

            return results[['Abbreviation', 'TeamName', 'GridPosition', 'Q_Delta', 'TeamStrength']]

        except Exception as e:
            return None

    def _get_recent_form(self, year, current_round, window=3):
        if current_round <= 1:
            return {}

        start_round = max(1, current_round - window)
        previous_results = []

        print(f"Fetching recent form data (Rounds {start_round}-{current_round - 1})...")

        for r in range(start_round, current_round):
            try:
                session = fastf1.get_session(year, r, 'R')
                session.load(telemetry=False, weather=False, messages=False)
                res = session.results
                finished = res[res['Status'].isin(['Finished', '+1 Lap', '+2 Laps', '+3 Laps'])]
                previous_results.append(finished[['Abbreviation', 'Position']])
            except Exception:
                continue

        if not previous_results:
            return {}

        all_prev = pd.concat(previous_results)
        form = all_prev.groupby('Abbreviation')['Position'].mean().to_dict()
        return form

    def build_dataset(self, years, limit_races=None):
        print(f"Building training dataset from {years}...")
        all_race_data = []

        for year in years:
            try:
                schedule = fastf1.get_event_schedule(year)
                races = schedule[schedule['EventFormat'] != 'testing']
            except:
                continue

            if limit_races:
                races = races.tail(limit_races)

            for _, race in races.iterrows():
                if race['EventDate'] > pd.Timestamp.now():
                    continue

                round_num = race['RoundNumber']

                q_df = self._get_qualifying_metrics(year, round_num)
                if q_df is None: continue

                try:
                    r_session = fastf1.get_session(year, round_num, 'R')
                    r_session.load(telemetry=False, weather=False, messages=False)
                    if r_session.results.empty: continue
                except:
                    continue

                r_results = r_session.results[['Abbreviation', 'Position', 'Status']]

                merged = pd.merge(q_df, r_results, on='Abbreviation', how='inner')

                for _, row in merged.iterrows():

                    status = str(row['Status'])
                    is_dnf = status not in ['Finished', '+1 Lap', '+2 Laps', '+3 Laps', '+4 Laps']

                    try:
                        finish_pos = float(row['Position'])
                    except (ValueError, TypeError):
                        finish_pos = np.nan

                    all_race_data.append({
                        'Year': year,
                        'Round': round_num,
                        'Grid': row['GridPosition'],
                        'TeamStrength': row['TeamStrength'],
                        'Q_Delta': row['Q_Delta'],
                        'Driver': row['Abbreviation'],
                        'Team': row['TeamName'],
                        'Finish': finish_pos,
                        'Is_DNF': is_dnf
                    })

        df = pd.DataFrame(all_race_data)

        if df.empty:
            return df

        df.sort_values(by=['Year', 'Round'], inplace=True)

        df['Form_Last3'] = df.groupby('Driver')['Finish'].transform(
            lambda x: x.shift(1).rolling(window=3, min_periods=1).mean()
        )

        df['Form_Last3'] = df['Form_Last3'].fillna(df['Grid'])

        clean_df = df[df['Is_DNF'] == False].dropna(subset=['Finish'])

        print(f"Processed {len(clean_df)} valid race entries for training.")
        return clean_df

    def train(self, target_year):
        years = [target_year - 1, target_year]

        df = self.build_dataset(years)

        if df.empty:
            raise ValueError("Not enough data to train.")

        X = df[['Grid', 'TeamStrength', 'Q_Delta', 'Driver', 'Team', 'Form_Last3']]
        y = df['Finish']

        cat_features_indices = ['Driver', 'Team']

        split_idx = int(len(df) * 0.90)
        X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
        y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

        print("\nTraining Model...")
        self.model.fit(
            X_train, y_train,
            cat_features=cat_features_indices,
            eval_set=(X_test, y_test),
            use_best_model=True,
            early_stopping_rounds=50,
            verbose=False
        )

        print("\n--- Model Evaluation (Validation Set) ---")
        preds = self.model.predict(X_test)

        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)

        print(f"Mean Absolute Error (MAE): {mae:.2f} positions")
        print(f"Root Mean Squared Error:   {rmse:.2f}")
        print(f"R² Score (Accuracy):       {r2:.2f}")
        print("-" * 40)

        print("\n--- Feature Importance ---")
        try:
            importance = self.model.get_feature_importance()
            feat_names = X.columns
            feat_imp = pd.DataFrame({'Feature': feat_names, 'Importance': importance})
            feat_imp = feat_imp.sort_values(by='Importance', ascending=False)

            for _, row in feat_imp.iterrows():
                print(f"{row['Feature']:<15}: {row['Importance']:.2f}%")
        except:
            print("Could not retrieve feature importance.")

    def predict_race(self, year, round_num):
        print(f"\n--- Predicting {year} Round {round_num} ---")


        q_df = self._get_qualifying_metrics(year, round_num)
        if q_df is None:
            print("Qualifying data unavailable.")
            return None

        form_dict = self._get_recent_form(year, round_num)

        X_pred = q_df[['GridPosition', 'TeamStrength', 'Q_Delta', 'Abbreviation', 'TeamName']].copy()
        X_pred.columns = ['Grid', 'TeamStrength', 'Q_Delta', 'Driver', 'Team']

        X_pred['Form_Last3'] = X_pred['Driver'].map(form_dict)
        X_pred['Form_Last3'] = X_pred['Form_Last3'].fillna(X_pred['Grid'])

        predictions = self.model.predict(X_pred)

        results = []
        for pred, (_, row) in zip(predictions, X_pred.iterrows()):
            results.append({
                'Driver': row['Driver'],
                'Team': row['Team'],
                'Start': row['Grid'],
                'Score': pred
            })

        results.sort(key=lambda x: x['Score'])

        for i, res in enumerate(results):
            res['Pred_Pos'] = i + 1

        return results


def main():
    predictor = F1Predictor()

    while True:
        try:
            year_input = input("Enter Year (2023-2025): ")
            year = int(year_input)
            if 2023 <= year <= 2025: break
            print("Please enter a valid year.")
        except ValueError:
            pass

    schedule = predictor.get_schedule(year)
    if not schedule: return

    print(f"\n--- {year} Season Schedule ---")
    for race in schedule:
        print(f"Round {race['RoundNumber']}: {race['EventName']}")

    while True:
        try:
            r_input = input("\nEnter Round Number: ")
            target_round = int(r_input)
            race_info = next((r for r in schedule if r['RoundNumber'] == target_round), None)
            if race_info: break
        except ValueError:
            pass

    if race_info['EventDate'] > pd.Timestamp.now():
        print(f"\nFuture Race selected. Note: Prediction requires Qualifying data to exist.")

    predictor.train(year)

    results = predictor.predict_race(year, target_round)

    if results:
        print(f"\n{'Pos':<4} {'Driver':<8} {'Team':<15} {'Start':<5} {'Score':<18}")
        print("-" * 60)
        for res in results:
            print(
                f"{res['Pred_Pos']:<4} {res['Driver']:<8} {res['Team'][:15]:<15} {res['Start']:<5} {res['Score']:.2f}")


if __name__ == "__main__":
    main()