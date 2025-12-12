# 🏎️ F1 Pulse

An AI-powered Formula 1 race result predictor with a beautiful, user-friendly interface. Perfect for both F1 enthusiasts and newcomers to the sport.

## Features

- 🤖 **AI-Powered Predictions**: Get instant race predictions using machine learning
- 🎨 **Beautiful UI**: Modern, intuitive interface that's easy to use
- 🚀 **Fast Performance**: Built with Next.js for optimal speed
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🌙 **Dark Mode**: Automatic dark mode support
- 🗺️ **Interactive Map**: Select races visually on a world map
- 🎯 **Custom Scenarios**: Create your own race scenarios for predictions

## Architecture

This project consists of two separate, independently deployable applications:

- **Frontend**: Next.js application (deployed to Vercel)
- **Backend**: FastAPI application (deployed to Railway/Render)

They communicate via REST API calls. See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## Project Structure

```
f1-pulse/
├── app/                    # Next.js frontend application
│   ├── page.tsx           # Main prediction interface
│   ├── components/        # React components
│   ├── utils/             # Utility functions
│   └── ...
├── backend/               # FastAPI backend (standalone)
│   ├── main.py           # FastAPI application
│   ├── F1_predict_md.py  # ML model integration
│   ├── requirements.txt  # Python dependencies
│   ├── Procfile          # Deployment config
│   ├── railway.json      # Railway config
│   ├── render.yaml       # Render config
│   └── README.md         # Backend documentation
├── public/                # Static assets
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## Getting Started

### Prerequisites

- **For Frontend**: Node.js 18+ and npm
- **For Backend**: Python 3.11+ and pip

### Frontend Setup (Next.js)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variable** (create `.env.local`):
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup (FastAPI)

See [backend/README.md](./backend/README.md) for detailed setup instructions.

**Quick start**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## How to Use

1. **Start both servers**:
   - Frontend: `npm run dev` (runs on port 3000)
   - Backend: `uvicorn main:app --reload` (runs on port 8000)

2. **Open the app** in your browser at `http://localhost:3000`

3. **Select a race** from the map or dropdown, or create a custom scenario

4. **Click "Generate Prediction"** to see AI-powered race predictions!

## API Endpoints

- `GET /` - Health check
- `GET /health` - Health check
- `POST /predict` - Get race predictions
  - Request: `{ "race_name": "Monaco Grand Prix", "circuit_name": "...", "race_date": "..." }`
  - Response: `{ "predicted_winner": "...", "top_3": [...], "confidence": 0.85, ... }`

## API Documentation

When the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Configuration

### Frontend Environment Variables

Create `.env.local` in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, set this in your deployment platform (e.g., Vercel).

### Backend Environment Variables

Set `ALLOWED_ORIGINS` to allow frontend requests:

```bash
export ALLOWED_ORIGINS="http://localhost:3000,https://your-app.vercel.app"
```

For production, set this in your deployment platform (e.g., Railway/Render).

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Leaflet
- **Backend**: FastAPI, Python 3.11+, CatBoost, FastF1, Pandas
- **Deployment**: 
  - Frontend: Vercel (or any Next.js hosting)
  - Backend: Railway, Render, or any Python hosting platform

## Development

### Frontend Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```

### Backend Development
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

See [backend/README.md](./backend/README.md) for more details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

**Quick summary**:
1. Deploy backend to Railway/Render (set `ALLOWED_ORIGINS`)
2. Deploy frontend to Vercel (set `NEXT_PUBLIC_API_URL`)
3. Both services communicate via HTTP API

## Support

For issues or questions:
- Backend: See [backend/README.md](./backend/README.md)
- Deployment: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- API docs: `http://localhost:8000/docs` (when backend is running)

---

Built with ❤️ for F1 fans and AI enthusiasts
