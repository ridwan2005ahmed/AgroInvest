'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { managerService, authService } from '@/lib/services';
import { FaBoxes, FaDollarSign, FaChartLine } from 'react-icons/fa';

export default function ManagerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'manager') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await managerService.getManagerDashboard();
      setStats(response.stats);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="manager" userName={user?.email}>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="manager" userName={user?.email}>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manager Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Animals"
            value={stats?.animals?.total || 0}
            icon={<FaBoxes className="text-2xl" />}
            color="blue"
            subtitle={`${stats?.animals?.active || 0} active`}
          />
          <StatCard
            title="Animals Sold"
            value={stats?.animals?.sold || 0}
            icon={<FaDollarSign className="text-2xl" />}
            color="green"
          />
          <StatCard
            title="Total Weight"
            value={`${parseFloat(stats?.animals?.total_weight || 0).toFixed(0)} kg`}
            icon={<FaChartLine className="text-2xl" />}
            color="purple"
          />
        </div>

        {/* Recent Sales */}
        <div className="card mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Animal Code</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Sale Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentSales?.length > 0 ? (
                  stats.recentSales.map((sale: any) => (
                    <tr key={sale.id} className="border-b">
                      <td className="px-4 py-3 text-sm">{sale.animal_code}</td>
                      <td className="px-4 py-3 text-sm capitalize">{sale.type}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        ৳{parseFloat(sale.sale_price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(sale.sold_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No sales recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/manager/animals')}
              className="btn-primary"
            >
              Manage Animals
            </button>
            <button
              onClick={() => router.push('/manager/market-prices')}
              className="btn-secondary"
            >
              Update Market Prices
            </button>
            <button
              onClick={() => router.push('/manager/generate-sale')}
              className="btn-primary"
            >
              Generate Sale Recommendation
            </button>
            <button
              onClick={() => router.push('/manager/sales')}
              className="btn-secondary"
            >
              Record Sale
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
