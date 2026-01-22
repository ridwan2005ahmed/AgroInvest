import Link from 'next/link';

export default function PrivacyPage() {
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
            <Link href="/faq" className="text-gray-600 hover:text-gray-800">
              FAQ
            </Link>
            <Link href="/privacy" className="text-blue-600 font-medium">
              Privacy
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-800">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl opacity-90">
            How we protect and handle your data
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white shadow rounded-lg p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              AgroInvest values user privacy and data protection. This policy outlines how we collect, 
              use, and protect your personal information.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
            <p className="text-gray-700 mb-3">
              We collect only necessary information to operate the platform, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Account identification details (name, email, phone)</li>
              <li>Contact information for communication purposes</li>
              <li>Transaction records related to platform activity</li>
              <li>Usage data to improve platform functionality</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">How We Use Your Data</h3>
            <p className="text-gray-700 mb-3">User data is used solely for:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Account verification and activation</li>
              <li>Operational communication regarding cycles and updates</li>
              <li>Platform functionality improvement and optimization</li>
              <li>Compliance with legal and regulatory requirements</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Data Sharing</h3>
            <p className="text-gray-700 leading-relaxed">
              We do not sell or share personal data with third parties except when legally required 
              or operationally necessary (e.g., payment processing, regulatory compliance). 
              All third-party services used are vetted for security and privacy standards.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Data Security</h3>
            <p className="text-gray-700 leading-relaxed">
              All reasonable measures are taken to protect user information from unauthorized access, 
              disclosure, alteration, or destruction. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure password storage (bcrypt hashing)</li>
              <li>Access control and role-based permissions</li>
              <li>Regular security audits and monitoring</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Your Rights</h3>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Access your personal data stored on the platform</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account (subject to operational constraints)</li>
              <li>Withdraw consent for non-essential data processing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Cookies and Tracking</h3>
            <p className="text-gray-700 leading-relaxed">
              AgroInvest uses minimal cookies for authentication and session management. We do not use 
              third-party tracking cookies or advertising networks. Essential cookies are required 
              for platform functionality.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Data Retention</h3>
            <p className="text-gray-700 leading-relaxed">
              User data is retained for as long as necessary to provide platform services and comply 
              with legal obligations. Transaction records and audit logs are retained for regulatory 
              compliance purposes.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Updates to This Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              This privacy policy may be updated periodically to reflect changes in our practices or 
              legal requirements. Users will be notified of significant changes through platform 
              announcements or email.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Consent</h3>
            <p className="text-gray-700 leading-relaxed">
              By using the platform, users consent to this privacy policy and the collection, use, 
              and processing of their data as described herein.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded p-6">
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p className="text-sm text-gray-700">
              If you have questions about this privacy policy or how your data is handled, 
              please contact our support team through the platform.
            </p>
          </div>
        </div>

        {/* Regulatory Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Regulatory Notice</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            AgroInvest operates as an operational management and participation platform focused on agro-based 
            production activities. The platform does not function as a bank, financial institution, or public 
            investment scheme. All activities are conducted through asset-backed operational cycles with 
            centralized management oversight.
          </p>
          <p className="text-sm text-blue-800 leading-relaxed mt-3">
            Participation does not constitute a deposit, security, or guaranteed financial product under 
            prevailing regulations. AgroInvest remains committed to transparency, responsible operations, and 
            compliance with applicable local laws.
          </p>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last Updated: January 2026
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
