'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { investorService, authService } from '@/lib/services';
import { FaDollarSign, FaCalendar, FaCheckCircle } from 'react-icons/fa';

export default function CreateInvestment() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    amount: '',
    maturityPeriod: 12,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'investor') {
      router.push('/login');
      return;
    }
    if (!currentUser.isVerified) {
      router.push('/investor/dashboard');
      return;
    }
    setUser(currentUser);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const calculateReturn = () => {
    const amount = parseFloat(formData.amount) || 0;
    const rate = formData.maturityPeriod === 6 ? 0.10 : 0.15;
    return amount * rate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (amount < 1000) {
        setError('Minimum investment amount is ৳1,000');
        setLoading(false);
        return;
      }

      await investorService.createInvestment(amount, formData.maturityPeriod);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout userRole="investor" userName={user?.email}>
        <div className="max-w-2xl mx-auto mt-12">
          <div className="card text-center">
            <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Investment Created!</h2>
            <p className="text-gray-600 mb-6">
              Your investment has been successfully created and is now active.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/investor/portfolio')}
                className="btn-primary"
              >
                View Portfolio
              </button>
              <button
                onClick={() => setSuccess(false)}
                className="btn-secondary"
              >
                Make Another Investment
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="investor" userName={user?.email}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Make New Investment</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FaDollarSign className="inline mr-2" />
                Investment Amount (৳)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input-field"
                placeholder="Minimum ৳1,000"
                min="1000"
                step="100"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Minimum: ৳1,000</p>
            </div>

            {/* Maturity Period */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FaCalendar className="inline mr-2" />
                Maturity Period
              </label>
              <select
                name="maturityPeriod"
                value={formData.maturityPeriod}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value={6}>6 Months (10% return)</option>
                <option value={12}>12 Months (15% return)</option>
              </select>
            </div>

            {/* Estimated Return */}
            {formData.amount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">Investment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Amount:</span>
                    <span className="font-bold">৳{parseFloat(formData.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maturity Period:</span>
                    <span className="font-bold">{formData.maturityPeriod} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Return:</span>
                    <span className="font-bold text-green-600">
                      ৳{calculateReturn().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-medium">Total at Maturity:</span>
                    <span className="font-bold text-lg text-green-600">
                      ৳{(parseFloat(formData.amount) + calculateReturn()).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Creating Investment...' : 'Create Investment'}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-bold text-blue-900 mb-2">Important Information</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Returns are estimated based on historical data</li>
            <li>Actual returns may vary based on market conditions</li>
            <li>You can list your investment for resale before maturity</li>
            <li>Funds are pooled for organized livestock production</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
