'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { authService, adminService } from '@/lib/services';
import { FaChartBar, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

export default function SaleRecommendations() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadRecommendations();
  }, [selectedStatus]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSaleRecommendations(selectedStatus);
      setRecommendations(response.recommendations || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recommendationId: number) => {
    if (!confirm('Are you sure you want to approve this sale recommendation? This will mark selected animals as sold.')) {
      return;
    }

    try {
      await adminService.approveSaleRecommendation(recommendationId);
      setSuccess('Sale recommendation approved successfully');
      loadRecommendations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to approve recommendation');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleReject = async (recommendationId: number) => {
    const reason = prompt('Enter rejection reason (optional):');
    
    try {
      await adminService.rejectSaleRecommendation(recommendationId, reason || 'Not specified');
      setSuccess('Sale recommendation rejected');
      loadRecommendations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject recommendation');
      setTimeout(() => setError(''), 5000);
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaChartBar className="mr-3" />
            Sale Recommendations
          </h1>
        </div>

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

        {/* Status Filter */}
        <div className="card mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedStatus('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setSelectedStatus('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setSelectedStatus('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Recommendations List */}
        {recommendations.length === 0 ? (
          <div className="card text-center py-12">
            <FaInfoCircle className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-600">No {selectedStatus} recommendations found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((rec) => {
              const details = typeof rec.recommendation_details === 'string' 
                ? JSON.parse(rec.recommendation_details) 
                : rec.recommendation_details;

              return (
                <div key={rec.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Recommendation #{rec.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(rec.created_at).toLocaleString()}
                      </p>
                      {rec.reviewed_at && (
                        <p className="text-sm text-gray-500">
                          Reviewed: {new Date(rec.reviewed_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(rec.status)}`}>
                      {rec.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Required Cash</p>
                      <p className="text-xl font-bold text-blue-700">
                        {formatCurrency(rec.required_cash)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Expected Sale Value</p>
                      <p className="text-xl font-bold text-green-700">
                        {formatCurrency(rec.total_sale_value)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Animals to Sell</p>
                      <p className="text-xl font-bold text-purple-700">
                        {rec.animal_count}
                      </p>
                    </div>
                  </div>

                  {/* Selected Animals */}
                  {details?.selectedAnimals && details.selectedAnimals.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Selected Animals:</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left">Animal Code</th>
                              <th className="px-4 py-2 text-left">Type</th>
                              <th className="px-4 py-2 text-left">Weight (kg)</th>
                              <th className="px-4 py-2 text-left">District</th>
                              <th className="px-4 py-2 text-right">Sale Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {details.selectedAnimals.map((animal: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{animal.animalCode}</td>
                                <td className="px-4 py-2 capitalize">{animal.type}</td>
                                <td className="px-4 py-2">{animal.currentWeight}</td>
                                <td className="px-4 py-2">{animal.district}</td>
                                <td className="px-4 py-2 text-right font-semibold">
                                  {formatCurrency(animal.saleValue)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  {details?.explanation && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Explanation:</h4>
                      <p className="text-sm text-gray-600">{details.explanation}</p>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {rec.status === 'rejected' && rec.rejection_reason && (
                    <div className="bg-red-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-red-700 mb-2">Rejection Reason:</h4>
                      <p className="text-sm text-red-600">{rec.rejection_reason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {rec.status === 'pending' && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleApprove(rec.id)}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FaCheck /> Approve & Execute Sale
                      </button>
                      <button
                        onClick={() => handleReject(rec.id)}
                        className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
