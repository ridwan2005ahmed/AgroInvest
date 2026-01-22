'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { authService, saleService } from '@/lib/services';
import { FaChartLine, FaCalculator, FaInfoCircle } from 'react-icons/fa';

export default function GenerateSaleRecommendation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [requiredCash, setRequiredCash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recommendation, setRecommendation] = useState<any>(null);
  const [mode, setMode] = useState<'preview' | 'generate'>('preview');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'manager')) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, []);

  const handlePreview = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    setMode('preview');

    try {
      const amount = parseFloat(requiredCash);
      if (!amount || amount <= 0) {
        setError('Please enter a valid cash amount');
        setLoading(false);
        return;
      }

      const response = await saleService.previewRecommendation(amount);
      setRecommendation(response.recommendation);
      setSuccess('Preview generated successfully');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    setMode('generate');

    try {
      const amount = parseFloat(requiredCash);
      if (!amount || amount <= 0) {
        setError('Please enter a valid cash amount');
        setLoading(false);
        return;
      }

      const response = await saleService.generateRecommendation(amount);
      setRecommendation(response.recommendation);
      setSuccess('Sale recommendation generated and saved! Waiting for admin approval.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate recommendation');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <DashboardLayout userRole={user?.role || 'manager'} userName={user?.email}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <FaChartLine className="mr-3" />
          Generate Sale Recommendation
        </h1>

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

        {/* Input Section */}
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <FaCalculator className="text-green-600 text-2xl mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Enter Cash Requirement</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Required Cash Amount (৳)
              </label>
              <input
                type="number"
                value={requiredCash}
                onChange={(e) => setRequiredCash(e.target.value)}
                className="input-field"
                placeholder="Enter amount in Taka"
                min="1"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                The system will recommend which animals to sell to meet this cash requirement
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>How it works:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Algorithm analyzes all active animals</li>
                <li>Selects animals with lowest growth potential first</li>
                <li>Minimizes future profit loss</li>
                <li>Provides transparent explanation for each selection</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                disabled={loading}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && mode === 'preview' ? 'Generating Preview...' : '👁️ Preview'}
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && mode === 'generate' ? 'Generating...' : '✓ Generate & Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation Result */}
        {recommendation && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {mode === 'preview' ? 'Preview' : 'Generated'} Recommendation
              </h2>
              {mode === 'generate' && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Pending Admin Approval
                </span>
              )}
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Required Cash</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(recommendation.requiredCash || parseFloat(requiredCash))}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Expected Sale Value</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(recommendation.totalExpectedSale)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Animals Selected</p>
                <p className="text-2xl font-bold text-purple-700">
                  {recommendation.selectedAnimals?.length || 0}
                </p>
              </div>
            </div>

            {/* Status Message */}
            {recommendation.message && (
              <div className={`p-4 rounded-lg mb-6 ${
                recommendation.message.includes('sufficient')
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <FaInfoCircle className={`inline mr-2 ${
                  recommendation.message.includes('sufficient')
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`} />
                <span className="text-gray-700">{recommendation.message}</span>
              </div>
            )}

            {/* Selected Animals Table */}
            {recommendation.selectedAnimals && recommendation.selectedAnimals.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Animals to Sell:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Animal Code</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-right">Weight (kg)</th>
                        <th className="px-4 py-3 text-left">District</th>
                        <th className="px-4 py-3 text-right">Current Value</th>
                        <th className="px-4 py-3 text-right">Future Value</th>
                        <th className="px-4 py-3 text-right">Sale Value</th>
                        <th className="px-4 py-3 text-right">Growth Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recommendation.selectedAnimals.map((animal: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{animal.animalCode}</td>
                          <td className="px-4 py-3 capitalize">{animal.type}</td>
                          <td className="px-4 py-3 text-right">{animal.currentWeight}</td>
                          <td className="px-4 py-3">{animal.district}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(animal.currentValue)}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(animal.futureValue)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-green-700">
                            {formatCurrency(animal.saleValue)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {animal.growthScore.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold">
                        <td colSpan={6} className="px-4 py-3 text-right">Total:</td>
                        <td className="px-4 py-3 text-right text-green-700">
                          {formatCurrency(recommendation.totalExpectedSale)}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Explanation */}
            {recommendation.explanation && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Algorithm Explanation:</h3>
                <p className="text-sm text-gray-600">{recommendation.explanation}</p>
              </div>
            )}

            {/* Actions */}
            {mode === 'generate' && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => router.push(user?.role === 'admin' ? '/admin/recommendations' : '/manager/dashboard')}
                  className="btn-primary"
                >
                  View All Recommendations
                </button>
                <button
                  onClick={() => {
                    setRecommendation(null);
                    setRequiredCash('');
                    setSuccess('');
                  }}
                  className="btn-secondary"
                >
                  Generate Another
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
