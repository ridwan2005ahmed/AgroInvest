'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { investorService, authService } from '@/lib/services';
import { FaDollarSign, FaChartLine, FaExchangeAlt, FaClock } from 'react-icons/fa';

export default function InvestorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'investor') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [portfolioRes, dashboardRes] = await Promise.all([
        investorService.getPortfolio(),
        investorService.getInvestorDashboard(),
      ]);
      setPortfolio(portfolioRes.portfolio);
      setDashboard(dashboardRes.dashboard);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Safe estimation formula: NEVER show kg prices
  const estimateValue = (amount: number, durationMonths: number) => {
    const growthRate = durationMonths === 12 ? 1.35 : 1.18;
    const riskBuffer = 0.05;
    return amount * growthRate * (1 - riskBuffer);
  };

  if (loading) {
    return (
      <DashboardLayout userRole="investor" userName={user?.email}>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  // Check verification status
  if (user && !user.isVerified) {
    return (
      <DashboardLayout userRole="investor" userName={user.email}>
        <div className="max-w-2xl mx-auto mt-12">
          <div className="card text-center">
            <FaClock className="text-yellow-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Account Pending Verification
            </h2>
            <p className="text-gray-600 mb-6">
              Your account is currently pending admin approval. You will be able to invest
              once your account is verified.
            </p>
            <p className="text-sm text-gray-500">
              This usually takes 24-48 hours. You will receive an email notification once approved.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="investor" userName={user?.email}>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Investor Dashboard</h1>
        <p className="text-sm text-gray-500 mb-8">
          Values shown are indicative estimates and may vary based on market and operational conditions.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Contribution"
            value={`৳${parseFloat(portfolio?.totalInvested || 0).toLocaleString()}`}
            icon={<FaDollarSign className="text-2xl" />}
            color="blue"
            subtitle="Amount currently allocated within active production cycles"
          />
          <StatCard
            title="Estimated Value (12M)"
            value={`৳${estimateValue(parseFloat(portfolio?.totalInvested || 0), 12).toLocaleString()}`}
            icon={<FaChartLine className="text-2xl" />}
            color="green"
            subtitle="Projected value based on historical trends and operational assumptions"
          />
          <StatCard
            title="Ownership Share"
            value={`${((parseFloat(portfolio?.totalInvested || 0) / 1000000) * 100).toFixed(2)}%`}
            icon={<FaExchangeAlt className="text-2xl" />}
            color="purple"
            subtitle="Your proportional participation within pooled assets"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600">Status</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">Active</p>
            <p className="text-xs text-gray-500 mt-1">Current cycle status</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600">Active Investments</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {portfolio?.investmentCount || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">ongoing cycles</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600">Internal Resale Option</h3>
            <p className="text-sm text-gray-700 mt-1">
              Allows ownership transfer prior to maturity through internal matching
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/investor/invest')}
              className="btn-primary"
            >
              Make New Investment
            </button>
            <button
              onClick={() => router.push('/investor/portfolio')}
              className="btn-secondary"
            >
              View Portfolio
            </button>
            <button
              onClick={() => router.push('/investor/marketplace')}
              className="btn-secondary"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
