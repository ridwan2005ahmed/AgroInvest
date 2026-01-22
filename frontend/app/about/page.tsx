import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 576 512">
              <path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path>
            </svg>
            <span className="text-2xl font-bold text-blue-600">AgroInvest</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/about" className="text-blue-600 font-medium">
              About
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-800">
              How It Works
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-800">
              FAQ
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-800">
              Privacy
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-800">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About AgroInvest</h1>
          <p className="text-xl opacity-90">
            Building structured agro value through community participation
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white shadow rounded-lg p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              AgroInvest is building a structured pathway for community participation in organized agro production.
              We align pooled capital with managed rural operations to create sustainable value through 
              disciplined execution and transparent estimation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our approach focuses on long-term production cycles, centralized decision control, and responsible 
              risk management—bridging the gap between participation and real economic activity.
            </p>
            <p className="text-gray-700 leading-relaxed">
              AgroInvest does not promote speculative activity. We operate through structured production planning, 
              controlled asset deployment, and measured liquidation strategies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold mb-2">Structured Participation</h3>
                <p className="text-gray-600 text-sm">
                  We enable people to participate in organized production cycles backed by real assets 
                  and controlled execution.
                </p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold mb-2">Transparent Estimation</h3>
                <p className="text-gray-600 text-sm">
                  Value tracking through estimation models based on historical data—not speculation.
                </p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold mb-2">Centralized Control</h3>
                <p className="text-gray-600 text-sm">
                  All operational, production, and liquidation decisions are centrally managed for 
                  sustainability.
                </p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold mb-2">Risk Management</h3>
                <p className="text-gray-600 text-sm">
                  Physical asset diversification with loss absorption at company level—no leverage exposure.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Market Opportunity</h2>
            <p className="text-gray-700 leading-relaxed">
              Rural production combined with urban capital remains largely unstructured. 
              We are building the missing operational layer to connect these two vital components 
              of the economy.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Our Commitment</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>✓ Transparent operations and estimation</li>
              <li>✓ Responsible risk management</li>
              <li>✓ Compliance with local regulations</li>
              <li>✓ Sustainable value creation</li>
            </ul>
          </div>

          <div className="text-center pt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Get Started <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm opacity-75">
            © 2026 AgroInvest. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/how-it-works" className="hover:underline">
              How It Works
            </Link>
            <Link href="/faq" className="hover:underline">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
