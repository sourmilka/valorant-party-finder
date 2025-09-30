'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Target, 
  Trophy,
  Clock,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

export default function AboutPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Updates',
      description: 'Live party feeds with instant notifications when new opportunities arise.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safe & Secure',
      description: 'Built-in moderation and reporting system to ensure a positive community.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Community',
      description: 'Connect with players from all regions and skill levels worldwide.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Smart Matching',
      description: 'Advanced filtering to find the perfect teammates for your playstyle.',
    },
  ];

  const faqs = [
    {
      question: 'How does Valorant Party Finder work?',
      answer: 'Valorant Party Finder is a web platform that helps players find teammates for Valorant games. You can either create party invitations with your party code or post LFG (Looking for Group) requests to find other players to team up with.',
    },
    {
      question: 'Is this website affiliated with Riot Games?',
      answer: 'No, Valorant Party Finder is an independent community platform. We are not affiliated with Riot Games, Inc. Valorant is a trademark of Riot Games, Inc.',
    },
    {
      question: 'How do I get my party code in Valorant?',
      answer: 'To get your party code in Valorant: 1) Open Valorant and go to the Social tab, 2) Click on "Party" to create or join a party, 3) Click "Invite Code" to generate your party code, 4) Copy the code and paste it in our create party form.',
    },
    {
      question: 'How long do party invitations last?',
      answer: 'Party invitations automatically expire after 30 minutes to keep the listings fresh and active. LFG requests expire after 1 hour. You can always create new invitations or requests if needed.',
    },
    {
      question: 'Is it safe to share my party code?',
      answer: 'Yes, party codes are designed to be shared and are safe to use. They only allow players to join your party and don\'t provide access to your account or personal information. Always be cautious when playing with strangers and report any inappropriate behavior.',
    },
    {
      question: 'Can I filter parties by rank and region?',
      answer: 'Yes! You can filter parties by rank, region, game mode, party size, and more. Use the filter options on the browse pages to find exactly what you\'re looking for.',
    },
    {
      question: 'What if I encounter toxic players?',
      answer: 'We have a reporting system in place. If you encounter toxic or inappropriate behavior, you can report the user and our moderation team will review the case. We\'re committed to maintaining a positive community.',
    },
    {
      question: 'Is the service free?',
      answer: 'Yes, the core features of Valorant Party Finder are completely free to use. We may introduce premium features in the future, but the basic party finding functionality will always remain free.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '12,345', icon: <Users className="w-5 h-5" /> },
    { label: 'Successful Matches', value: '8,901', icon: <Trophy className="w-5 h-5" /> },
    { label: 'Global Regions', value: '6', icon: <Globe className="w-5 h-5" /> },
    { label: 'Avg. Match Time', value: '5 min', icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-valorant-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Valorant Party Finder
          </h1>
          <p className="text-valorant-light/80 text-lg max-w-3xl mx-auto">
            The ultimate platform for connecting Valorant players worldwide. 
            Find your perfect squad and dominate the battlefield together.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-16"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-valorant-light/80 text-lg leading-relaxed max-w-4xl mx-auto">
              Valorant Party Finder was created to solve the common problem of finding compatible teammates in Valorant. 
              We believe that great games are made with great teammates, and our platform makes it easy to connect 
              with players who share your playstyle, rank, and goals. Whether you're looking for a competitive ranked 
              team or just want to have fun with new friends, we've got you covered.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Valorant Party Finder?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card text-center hover:border-valorant-red/50 transition-all duration-300"
              >
                <div className="text-valorant-red mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-valorant-light/80">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Community Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card text-center"
              >
                <div className="flex justify-center mb-3 text-valorant-red">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-valorant-light/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="text-xl font-semibold text-white mb-3">Create or Browse</h3>
              <p className="text-valorant-light/80">
                Create a party invitation with your party code or browse existing parties to find the perfect match.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="text-xl font-semibold text-white mb-3">Connect</h3>
              <p className="text-valorant-light/80">
                Copy party codes or usernames and connect with players in Valorant to start your game.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="text-xl font-semibold text-white mb-3">Play Together</h3>
              <p className="text-valorant-light/80">
                Enjoy playing with your new teammates and build lasting gaming friendships.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Safety */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Safety & Security
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 text-valorant-red mr-2" />
                Community Guidelines
              </h3>
              <ul className="space-y-2 text-valorant-light/80">
                <li>• Be respectful and inclusive to all players</li>
                <li>• Provide accurate information about your rank and availability</li>
                <li>• Use appropriate language and avoid toxicity</li>
                <li>• Report any inappropriate behavior immediately</li>
                <li>• Follow Valorant's terms of service</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <MessageSquare className="w-6 h-6 text-valorant-red mr-2" />
                Reporting System
              </h3>
              <p className="text-valorant-light/80 mb-4">
                We have a comprehensive reporting system to maintain a positive community environment.
              </p>
              <ul className="space-y-2 text-valorant-light/80">
                <li>• Report toxic or inappropriate behavior</li>
                <li>• Flag spam or fake listings</li>
                <li>• Block users who violate guidelines</li>
                <li>• Our moderation team reviews all reports</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full text-left flex items-center justify-between"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <HelpCircle className="w-5 h-5 text-valorant-red mr-3" />
                    {faq.question}
                  </h3>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-valorant-red" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-valorant-light/60" />
                  )}
                </button>
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-700"
                  >
                    <p className="text-valorant-light/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-valorant-light/80 mb-6">
              Have questions, suggestions, or need help? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@valorantpartyfinder.com"
                className="btn-primary"
              >
                Contact Support
              </a>
              <a
                href="https://discord.gg/valorantpartyfinder"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Join Discord
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
