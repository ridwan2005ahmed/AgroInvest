'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { investorService, authService } from '@/lib/services';
import { FaDollarSign, FaChartLine } from 'react-icons/fa';

export default function InvestorPortfolio() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'investor') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await investorService.getPortfolio();
      setPortfolio(response.portfolio);
      setInvestments(response.investments);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="investor" userName={user?.email}>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="investor" userName={user?.email}>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Portfolio</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invested</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  ৳{parseFloat(portfolio?.totalInvested || 0).toFixed(0)}
                </h3>
              </div>
              <FaDollarSign className="text-3xl text-blue-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Value</p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">
                  ৳{parseFloat(portfolio?.totalCurrentValue || 0).toFixed(0)}
                </h3>
              </div>
              <FaChartLine className="text-3xl text-green-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estimated Profit</p>
                <h3 className="text-2xl font-bold text-purple-600 mt-1">
                  ৳{parseFloat(portfolio?.estimatedProfit || 0).toFixed(0)}
                </h3>
              </div>
              <FaChartLine className="text-3xl text-purple-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {portfolio?.profitPercentage}%
                </h3>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
        </div>

        {/* Investments List */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">All Investments</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Investment ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Maturity Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Created</th>
                </tr>
              </thead>
              <tbody>
                {investments.length > 0 ? (
                  investments.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">#{inv.id}</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-800">
                        ৳{parseFloat(inv.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(inv.maturity_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          inv.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                      No investments yet. Start investing today!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push('/investor/invest')}
            className="btn-primary"
          >
            Make New Investment
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
