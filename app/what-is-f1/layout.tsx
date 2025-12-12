import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is Formula 1? | F1 Pulse - Learn About F1 Racing",
  description: "Learn about Formula 1 racing - the world's premier motorsport championship. Discover F1 history, teams, technology, and how races work.",
};

export default function WhatIsF1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

