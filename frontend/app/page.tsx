'use client';

import Link from 'next/link';
import { FaLeaf, FaChartLine, FaShieldAlt, FaUsers, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 576 512">
              <path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path>
            </svg>
            <h1 className="text-2xl font-bold text-blue-600">AgroInvest</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              About
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">
              How It Works
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600 font-medium">
              FAQ
            </Link>
          </nav>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
          Structured Participation.<br />
          Real Production.<br />
          Measured Growth.
        </h2>
        <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
          A managed platform aligning pooled capital with structured agro operations.
        </p>
        <p className="text-sm text-gray-500 mb-8 max-w-2xl mx-auto">
          Building the missing operational layer between rural production and urban capital.
        </p>
        <div className="space-x-4">
          <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700">
            Start Participating <FaArrowRight />
          </Link>
          <Link href="/how-it-works" className="inline-flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50">
            Learn How It Works
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">
          Why AgroInvest Wins
        </h3>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <FaUsers className="text-blue-600 text-5xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">Low Entry Barrier</h4>
            <p className="text-gray-600">
              Small and large contributions welcome—pooled for structured deployment
            </p>
          </div>
          
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <FaShieldAlt className="text-blue-600 text-5xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">No Forced Exit</h4>
            <p className="text-gray-600">
              Contributions locked until maturity—ensuring operational stability
            </p>
          </div>
          
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <FaChartLine className="text-blue-600 text-5xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">Controlled Liquidation</h4>
            <p className="text-gray-600">
              Centralized sale decisions optimize outcomes and timing
            </p>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <FaUsers className="text-blue-600 text-5xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">Transparent Estimation</h4>
            <p className="text-gray-600">
              Value tracking based on historical data—not speculation
            </p>
          </div>
        </div>
      </section>

      {/* Risk Management Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">
          How We Manage Risk
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h4 className="font-bold text-lg mb-2">Physical Asset Diversification</h4>
            <p className="text-gray-600 text-sm">
              Assets spread across multiple locations and types
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-lg mb-2">Centralized Decisions</h4>
            <p className="text-gray-600 text-sm">
              Professional management controls all sales
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-lg mb-2">Loss Absorption</h4>
            <p className="text-gray-600 text-sm">
              Company-level buffer protects principal
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="bg-gray-100 border-y border-gray-300 py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h4 className="font-semibold mb-2">Important Disclosure</h4>
          <p className="text-sm text-gray-700">
            Investment returns displayed are estimates derived from historical market data, growth trends, 
            and operational assumptions. Actual returns may vary. Early withdrawal is not permitted. 
            Ownership transfer before maturity is available only through the internal resale mechanism.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold mb-2">6-12</h4>
              <p className="text-blue-200">Month Cycles Available</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">Centralized</h4>
              <p className="text-blue-200">Sale Execution Control</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">100%</h4>
              <p className="text-blue-200">Transparent Estimation</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-blue-900 mb-4">
          How AgroInvest Works
        </h3>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          A simple, transparent process from participation to value realization
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h4 className="font-bold mb-2">Register & Verify</h4>
            <p className="text-gray-600 text-sm">Create account and complete admin verification</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h4 className="font-bold mb-2">Participate</h4>
            <p className="text-gray-600 text-sm">Contributions pooled into structured cycles</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h4 className="font-bold mb-2">Track & Mature</h4>
            <p className="text-gray-600 text-sm">Value tracked through estimation models</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/how-it-works" className="text-blue-600 hover:underline font-medium">
            View Detailed Process →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
            Join AgroInvest and participate in structured agro production cycles.
          </p>
          <Link href="/register" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path>
                </svg>
                <span className="text-xl font-bold">AgroInvest</span>
              </div>
              <p className="text-gray-400 text-sm">
                Building structured pathways for community participation in organized agro production.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="/about" className="block text-gray-400 hover:text-white">About Us</Link>
                <Link href="/how-it-works" className="block text-gray-400 hover:text-white">How It Works</Link>
                <Link href="/faq" className="block text-gray-400 hover:text-white">FAQ</Link>
                <Link href="/privacy" className="block text-gray-400 hover:text-white">Privacy Policy</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Get Started</h4>
              <div className="space-y-2 text-sm">
                <Link href="/register" className="block text-gray-400 hover:text-white">Create Account</Link>
                <Link href="/login" className="block text-gray-400 hover:text-white">Login</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p className="mb-2">© 2026 AgroInvest. All rights reserved.</p>
            <p className="text-sm">
              AgroInvest operates as an operational management platform. Not a financial institution.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
