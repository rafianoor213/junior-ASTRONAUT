import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Junior Astronaut Mission Trainer | NASA Space Apps Challenge',
  description: 'An interactive 2D playable space survival and training browser game built for the NASA Space Apps Challenge. Master astronaut training, survive on the Moon, and return safely to Earth.',
  keywords: ['NASA Space Apps Challenge', 'Junior Astronaut', 'Moon Survival Game', 'Next.js Space Game', 'STEM Space Trainer'],
  authors: [{ name: 'Junior Astronaut Developer Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
