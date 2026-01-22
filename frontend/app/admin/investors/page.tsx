'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { adminService, authService } from '@/lib/services';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function PendingInvestors() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadInvestors();
  }, []);

  const loadInvestors = async () => {
    try {
      const response = await adminService.getPendingInvestors();
      setInvestors(response.investors);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load investors');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (investorId: number) => {
    try {
      await adminService.verifyInvestor(investorId);
      setSuccess('Investor verified successfully');
      loadInvestors();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify investor');
    }
  };

  const handleReject = async (investorId: number) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await adminService.rejectInvestor(investorId, reason || 'Not specified');
      setSuccess('Investor rejected');
      loadInvestors();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject investor');
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Pending Investor Accounts</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="card">
          {investors.length === 0 ? (
            <div className="text-center py-12">
              <FaClock className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500">No pending investor accounts</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Registration Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investors.map((investor) => (
                    <tr key={investor.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium">{investor.email}</td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          {investor.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(investor.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerify(investor.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                          >
                            <FaCheckCircle />
                            <span>Verify</span>
                          </button>
                          <button
                            onClick={() => handleReject(investor.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                          >
                            <FaTimesCircle />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
