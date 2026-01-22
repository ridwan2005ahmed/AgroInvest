'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { adminService, authService } from '@/lib/services';
import { FaUsers, FaBoxes, FaDollarSign, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.stats);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin" userName={user?.email}>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin" userName={user?.email}>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Investors"
            value={stats?.pendingInvestors || 0}
            icon={<FaClock className="text-2xl" />}
            color="yellow"
          />
          <StatCard
            title="Total Investments"
            value={`৳${parseFloat(stats?.investments?.total_amount || 0).toFixed(0)}`}
            icon={<FaDollarSign className="text-2xl" />}
            color="green"
            subtitle={`${stats?.investments?.total_count || 0} investments`}
          />
          <StatCard
            title="Active Animals"
            value={stats?.animals?.active_count || 0}
            icon={<FaBoxes className="text-2xl" />}
            color="blue"
            subtitle={`${stats?.animals?.total_count || 0} total`}
          />
          <StatCard
            title="Pending Recommendations"
            value={stats?.pendingRecommendations || 0}
            icon={<FaExclamationTriangle className="text-2xl" />}
            color="red"
          />
        </div>

        {/* User Breakdown */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">User Statistics</h3>
            <div className="space-y-3">
              {stats?.users?.map((userStat: any) => (
                <div key={userStat.role} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{userStat.role}s</span>
                  <span className="font-bold text-gray-800">{userStat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Investment Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active</span>
                <span className="font-bold text-green-600">
                  {stats?.investments?.active_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-gray-800">
                  ৳{parseFloat(stats?.investments?.total_amount || 0).toFixed(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Animal Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active</span>
                <span className="font-bold text-green-600">
                  {stats?.animals?.active_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sold</span>
                <span className="font-bold text-blue-600">
                  {stats?.animals?.sold_count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-gray-800">
                  {stats?.animals?.total_count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/investors')}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <FaClock />
              <span>Verify Investors</span>
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <FaUsers />
              <span>Manage Users</span>
            </button>
            <button
              onClick={() => router.push('/admin/recommendations')}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <FaCheckCircle />
              <span>Recommendations</span>
            </button>
            <button
              onClick={() => router.push('/admin/create-manager')}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <FaUsers />
              <span>Create Manager</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
