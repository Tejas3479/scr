'use client'

import { useState } from 'react'

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      id: 1,
      question: 'How do I start farming on FarmQuest?',
      answer: 'Create an account, complete the "Plant Your First Crop" mission, and you\'re ready to go! Follow the in-app tutorials to learn the basics of farming and gamification.'
    },
    {
      id: 2,
      question: 'How can I earn more XP?',
      answer: 'You can earn XP by completing missions, harvesting crops, connecting with experts, and participating in community activities. Check the Missions tab for all available ways to earn rewards.'
    },
    {
      id: 3,
      question: 'What are FarmTokens used for?',
      answer: 'FarmTokens are the in-game currency used to purchase seeds, tools, and unlock premium features. Earn them by completing missions and achieving farming milestones.'
    },
    {
      id: 4,
      question: 'How do I connect with an agricultural expert?',
      answer: 'Visit the Chat section to connect with verified agricultural experts. They can provide personalized advice about sustainable farming practices, crop selection, and more.'
    },
    {
      id: 5,
      question: 'Can I play with friends?',
      answer: 'Yes! Join the community, add friends, and compete on leaderboards. You can also collaborate on shared farming projects and complete community challenges together.'
    },
    {
      id: 6,
      question: 'Is my data secure?',
      answer: 'We take data security seriously. All user data is encrypted and stored securely. We follow industry-standard security practices to protect your information.'
    }
  ]

  const resources = [
    { icon: '📚', title: 'Getting Started Guide', description: 'Learn the basics of FarmQuest' },
    { icon: '🎥', title: 'Video Tutorials', description: 'Step-by-step farming guides' },
    { icon: '📖', title: 'Farming Tips', description: 'Best practices for sustainable farming' },
    { icon: '🌍', title: 'Sustainability', description: 'Environmental impact information' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-2">Help & Support</h1>
          <p className="text-emerald-300/70">Find answers to common questions and get expert support</p>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-emerald-600/30 to-green-600/30 backdrop-blur-xl border border-emerald-500/50 text-emerald-300 rounded-2xl p-8 mb-12 hover:border-emerald-400/70 transition-all shadow-lg shadow-emerald-500/10">
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">⚡ Need immediate help?</h2>
          <p className="mb-6 text-emerald-300/80">Our support team is here to assist you 24/7!</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
              📧 Email Support
            </button>
            <button className="bg-slate-700/50 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400/70 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-slate-700/80">
              💬 Live Chat
            </button>
            <button className="bg-slate-700/50 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400/70 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-slate-700/80">
              📞 Call Us
            </button>
          </div>
        </div>

        {/* Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">📚 Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-6 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{resource.icon}</div>
                <h3 className="font-bold text-emerald-400 mb-2">{resource.title}</h3>
                <p className="text-sm text-emerald-300/70">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-xl overflow-hidden hover:border-emerald-400/50 transition-all">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                >
                  <h3 className="font-semibold text-emerald-400 text-left">{faq.question}</h3>
                  <div className={`text-2xl transition-transform duration-300 text-emerald-400 ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 py-4 bg-slate-700/30 border-t border-emerald-500/30">
                    <p className="text-emerald-300/80">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Community */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-400/50 transition-all">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">👥 Join Our Community</h2>
          <p className="text-emerald-300/70 mb-6">Connect with other farmers, share tips, and grow together!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-400 font-semibold py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              🌐 Visit Community Forum
            </button>
            <button className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-400 font-semibold py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              📱 Join Discord Server
            </button>
            <button className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-400 font-semibold py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              🐦 Follow on Social Media
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
