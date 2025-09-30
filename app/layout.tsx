import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Valorant Party Finder - Find Your Perfect Squad',
  description: 'Connect with Valorant players worldwide. Find parties, create LFG requests, and build your competitive team with our professional matchmaking platform.',
  keywords: 'Valorant, Party Finder, LFG, Gaming, Matchmaking, Competitive, Riot Games',
  authors: [{ name: 'Valorant Party Finder Team' }],
  creator: 'Valorant Party Finder',
  publisher: 'Valorant Party Finder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Valorant Party Finder - Find Your Perfect Squad',
    description: 'Connect with Valorant players worldwide. Find parties, create LFG requests, and build your competitive team.',
    url: 'https://valorant-party-finder.vercel.app',
    siteName: 'Valorant Party Finder',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Valorant Party Finder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valorant Party Finder - Find Your Perfect Squad',
    description: 'Connect with Valorant players worldwide. Find parties, create LFG requests, and build your competitive team.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-valorant-dark text-valorant-light`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e2328',
              color: '#ece8e1',
              border: '1px solid #ff4655',
            },
            success: {
              iconTheme: {
                primary: '#ff4655',
                secondary: '#ece8e1',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff4655',
                secondary: '#ece8e1',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
