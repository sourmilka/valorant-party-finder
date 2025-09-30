import Link from 'next/link';
import { Github, Twitter, Mail, Shield, Users, Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Browse Parties', href: '/parties' },
      { name: 'LFG Requests', href: '/lfg' },
      { name: 'Create Party', href: '/create-party' },
      { name: 'Post LFG', href: '/create-lfg' },
    ],
    community: [
      { name: 'About Us', href: '/about' },
      { name: 'FAQ', href: '/about#faq' },
      { name: 'Safety', href: '/about#safety' },
      { name: 'Rules', href: '/about#rules' },
    ],
    support: [
      { name: 'Contact', href: '/contact' },
      { name: 'Report Issue', href: '/report' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  const features = [
    { icon: <Zap className="w-5 h-5" />, text: 'Real-time Updates' },
    { icon: <Shield className="w-5 h-5" />, text: 'Safe & Secure' },
    { icon: <Users className="w-5 h-5" />, text: 'Global Community' },
  ];

  return (
    <footer className="bg-valorant-dark border-t border-valorant-red/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-valorant-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-white">
                Valorant Party Finder
              </span>
            </Link>
            <p className="text-valorant-light/80 mb-6 max-w-sm">
              Connect with Valorant players worldwide. Find parties, create LFG requests, 
              and build your competitive team with our professional matchmaking platform.
            </p>
            
            {/* Features */}
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-valorant-light/80">
                  {feature.icon}
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-valorant-light/80 hover:text-valorant-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-valorant-light/80 hover:text-valorant-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-valorant-light/80 hover:text-valorant-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-valorant-light/60 text-sm">
              © {currentYear} Valorant Party Finder. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-valorant-light/60 hover:text-valorant-red transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-valorant-light/60 hover:text-valorant-red transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@valorantpartyfinder.com"
                className="text-valorant-light/60 hover:text-valorant-red transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-4 text-center text-valorant-light/60 text-xs">
            <p>
              This website is not affiliated with Riot Games, Inc. Valorant is a trademark of Riot Games, Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
