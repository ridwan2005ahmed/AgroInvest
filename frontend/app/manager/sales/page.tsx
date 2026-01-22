'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface SaleExecution {
  id: number;
  saleRecommendationId: number;
  animalId: number;
  actualWeight: number;
  actualPricePerKg: number;
  totalSaleValue: number;
  executedAt: string;
  animalType?: string;
  estimatedValue?: number;
}

export default function SalesPage() {
  const [sales, setSales] = useState<SaleExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    saleRecommendationId: '',
    animalId: '',
    actualWeight: '',
    actualPricePerKg: '',
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/manager/sales', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSales(data);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const actualWeight = parseFloat(formData.actualWeight);
      const actualPricePerKg = parseFloat(formData.actualPricePerKg);
      const totalSaleValue = actualWeight * actualPricePerKg;

      const res = await fetch('http://localhost:5000/api/manager/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          saleRecommendationId: parseInt(formData.saleRecommendationId),
          animalId: parseInt(formData.animalId),
          actualWeight,
          actualPricePerKg,
          totalSaleValue,
        }),
      });

      if (res.ok) {
        await fetchSales();
        setShowForm(false);
        setFormData({
          saleRecommendationId: '',
          animalId: '',
          actualWeight: '',
          actualPricePerKg: '',
        });
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to record sale');
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('Error recording sale execution');
    }
  };

  const calculateTotalSale = () => {
    const weight = parseFloat(formData.actualWeight) || 0;
    const price = parseFloat(formData.actualPricePerKg) || 0;
    return (weight * price).toFixed(2);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading sales...</div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalSalesValue = sales.reduce((sum, sale) => sum + sale.totalSaleValue, 0);
  const avgSaleValue = sales.length > 0 ? totalSalesValue / sales.length : 0;
  const performanceData = sales.filter(s => s.estimatedValue).map(s => ({
    actual: s.totalSaleValue,
    estimated: s.estimatedValue || 0,
    diff: s.totalSaleValue - (s.estimatedValue || 0)
  }));
  const avgPerformance = performanceData.length > 0 
    ? performanceData.reduce((sum, p) => sum + p.diff, 0) / performanceData.length 
    : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales Recording</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? 'Cancel' : 'Record Sale'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-600 mb-1">Total Sales Count</h3>
          <p className="text-2xl font-bold">{sales.length}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-600 mb-1">Total Sales Value</h3>
          <p className="text-2xl font-bold">৳ {totalSalesValue.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-600 mb-1">Avg Performance vs Estimate</h3>
          <p className={`text-2xl font-bold ${avgPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {avgPerformance >= 0 ? '+' : ''}৳ {avgPerformance.toFixed(0)}
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Record Sale Execution</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sale Recommendation ID</label>
                <input
                  type="number"
                  value={formData.saleRecommendationId}
                  onChange={(e) => setFormData({ ...formData, saleRecommendationId: e.target.value })}
                  required
                  placeholder="Enter recommendation ID"
                  className="w-full border rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">From approved sale recommendations</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Animal ID</label>
                <input
                  type="number"
                  value={formData.animalId}
                  onChange={(e) => setFormData({ ...formData, animalId: e.target.value })}
                  required
                  placeholder="Enter animal ID"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Actual Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.actualWeight}
                  onChange={(e) => setFormData({ ...formData, actualWeight: e.target.value })}
                  required
                  placeholder="Measured weight at sale"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Actual Price per KG (৳)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.actualPricePerKg}
                  onChange={(e) => setFormData({ ...formData, actualPricePerKg: e.target.value })}
                  required
                  placeholder="Market price achieved"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {formData.actualWeight && formData.actualPricePerKg && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-800">
                  <strong>Calculated Total Sale Value:</strong> ৳ {calculateTotalSale()}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    saleRecommendationId: '',
                    animalId: '',
                    actualWeight: '',
                    actualPricePerKg: '',
                  });
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Record Sale
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sales History Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h2 className="font-semibold">Sales History</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Recommendation ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Animal ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Weight (kg)</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Price/KG</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total Value</th>
              <th className="px-4 py-3 text-left text-sm font-medium">vs Estimate</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No sales recorded yet. Click "Record Sale" to add one.
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                const diff = sale.estimatedValue ? sale.totalSaleValue - sale.estimatedValue : null;
                return (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{sale.id}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(sale.executedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">{sale.saleRecommendationId}</td>
                    <td className="px-4 py-3 text-sm">{sale.animalId}</td>
                    <td className="px-4 py-3 text-sm">{sale.actualWeight.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">৳ {sale.actualPricePerKg.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      ৳ {sale.totalSaleValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {diff !== null ? (
                        <span className={diff >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {diff >= 0 ? <FiCheckCircle className="inline mr-1" /> : <FiAlertCircle className="inline mr-1" />}
                          {diff >= 0 ? '+' : ''}৳ {diff.toFixed(0)}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Sale executions are final and logged in the audit trail. 
          Ensure all values are accurate before recording.
        </p>
      </div>
    </div>
  );
}
