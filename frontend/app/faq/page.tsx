import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      question: 'Is my contribution guaranteed?',
      answer:
        'No. All values displayed are estimates based on operational models. Actual outcomes may vary due to market and production conditions.',
    },
    {
      question: 'Can I withdraw my capital anytime?',
      answer:
        'Direct withdrawal before cycle completion is not supported. This ensures operational stability across pooled assets.',
    },
    {
      question: 'What if I need to exit early?',
      answer:
        'Early exit is possible through the internal ownership transfer mechanism, subject to availability and platform rules.',
    },
    {
      question: 'Who controls the production and sale decisions?',
      answer:
        'All operational, production, and liquidation decisions are centrally managed by the platform to ensure sustainability and risk mitigation.',
    },
    {
      question: 'Is this a financial investment or savings scheme?',
      answer:
        'No. Participation represents involvement in managed production cycles, not a financial deposit or security.',
    },
    {
      question: 'What happens if a cycle underperforms?',
      answer:
        'In such cases, outcomes are adjusted according to actual operational results. Risk mitigation strategies may be applied when feasible.',
    },
    {
      question: 'How transparent is the system?',
      answer:
        'Participants can view status updates, estimated values, and cycle timelines through the dashboard. All operations are logged for audit purposes.',
    },
    {
      question: 'How are estimated values calculated?',
      answer:
        'Estimated values are derived from historical market data, growth trends, and operational assumptions. They are indicative only and not guaranteed.',
    },
    {
      question: 'What is the internal resale mechanism?',
      answer:
        'The internal resale mechanism allows ownership transfer prior to maturity through platform-managed matching. This is the only early exit option available.',
    },
    {
      question: 'Who can participate in AgroInvest?',
      answer:
        'Anyone can register an account. However, all accounts must undergo admin verification before activation and participation.',
    },
    {
      question: 'What are the cycle durations available?',
      answer:
        'AgroInvest offers 6-month and 12-month production cycles, each with different estimated growth multipliers based on historical data.',
    },
    {
      question: 'How is risk managed?',
      answer:
        'Risk is managed through physical asset diversification, centralized decision control, and loss absorption at company level. There is no leverage or margin exposure.',
    },
  ];

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
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-800">
              How It Works
            </Link>
            <Link href="/faq" className="text-blue-600 font-medium">
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
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl opacity-90">
            Clear answers to common questions about AgroInvest
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Q{index + 1}: {faq.question}
              </h3>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
          <p className="text-gray-700 mb-6">
            Our team is here to help. Contact us for more information about AgroInvest.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Get Started Today
          </Link>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-3">Important Notice</h3>
          <p className="text-sm text-yellow-800 leading-relaxed">
            AgroInvest operates as an operational management and participation platform focused on agro-based 
            production activities. The platform does not function as a bank, financial institution, or public 
            investment scheme. All activities are conducted through asset-backed operational cycles with 
            centralized management oversight.
          </p>
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
