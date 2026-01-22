import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function HowItWorksPage() {
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
            <Link href="/about" className="text-gray-600 hover:text-gray-800">
              About
            </Link>
            <Link href="/how-it-works" className="text-blue-600 font-medium">
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
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How AgroInvest Works</h1>
          <p className="text-xl opacity-90">
            A simple, transparent process from participation to value realization
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6 flex-1">
              <h2 className="text-2xl font-bold mb-3">Create Account & Verification</h2>
              <p className="text-gray-700 mb-3">
                Participants create an account and complete verification through our secure process.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Simple registration form</li>
                <li>✓ Identity verification by admin</li>
                <li>✓ Account activation upon approval</li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6 flex-1">
              <h2 className="text-2xl font-bold mb-3">Choose Production Cycle</h2>
              <p className="text-gray-700 mb-3">
                Contributions are pooled into structured production cycles with defined timelines.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ 6-month or 12-month cycles available</li>
                <li>✓ View estimated value projections</li>
                <li>✓ Accept risk disclosure before proceeding</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6 flex-1">
              <h2 className="text-2xl font-bold mb-3">Track Your Participation</h2>
              <p className="text-gray-700 mb-3">
                Value is tracked through estimation models based on historical data and operational progress.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Real-time dashboard access</li>
                <li>✓ Estimated value updates (not guaranteed)</li>
                <li>✓ Production cycle status tracking</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                4
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6 flex-1">
              <h2 className="text-2xl font-bold mb-3">Asset Maturity</h2>
              <p className="text-gray-700 mb-3">
                Assets mature within defined timelines based on production planning and growth cycles.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Pre-maturity planning (-30 days)</li>
                <li>✓ System-generated sale recommendations</li>
                <li>✓ Admin approval for all sales</li>
              </ul>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                5
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6 flex-1">
              <h2 className="text-2xl font-bold mb-3">Centralized Liquidation</h2>
              <p className="text-gray-700 mb-3">
                Liquidation is executed centrally to meet maturity obligations and optimize outcomes.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Strategic timing by management</li>
                <li>✓ Controlled asset deployment</li>
                <li>✓ Actual vs estimated tracking</li>
              </ul>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                6
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6 flex-1">
              <h2 className="text-2xl font-bold mb-3">Value Reflection</h2>
              <p className="text-gray-700 mb-3">
                Value is reflected back to participant portfolios based on actual sale outcomes.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Portfolio value updates</li>
                <li>✓ Cycle completion summary</li>
                <li>✓ Transparent outcome reporting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">Early Exit Option</h3>
            <p className="text-sm text-yellow-800 mb-2">
              Early withdrawal of contributed capital is restricted to maintain operational stability.
            </p>
            <p className="text-sm text-yellow-800">
              However, ownership transfer is enabled through an internal resale mechanism 
              prior to maturity.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Why Centralized Control?</h3>
            <p className="text-sm text-blue-800">
              All production and sale decisions are centrally managed to ensure operational 
              sustainability, risk mitigation, and alignment with long-term production cycles.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-gray-100 border border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Important Disclaimer</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Values shown are indicative estimates and may vary based on market and operational conditions. 
            Participation represents involvement in managed production cycles, not a financial deposit or security. 
            By participating, users acknowledge and accept the operational nature of the platform.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700"
          >
            <FiCheckCircle /> Start Your Journey
          </Link>
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
