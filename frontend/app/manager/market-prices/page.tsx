'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface MarketPrice {
  id: number;
  animalType: string;
  district: string;
  pricePerKg: number;
  recordedAt: string;
}

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    animalType: '',
    district: '',
    pricePerKg: '',
  });
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/manager/market-prices', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPrices(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: MarketPrice[]) => {
    const grouped: any = {};
    data.forEach((price) => {
      const key = `${price.animalType}-${price.district}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(price.pricePerKg);
    });

    const statsData: any = {};
    Object.keys(grouped).forEach((key) => {
      const prices = grouped[key];
      const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
      const latest = prices[0];
      const trend = latest > avg ? 'up' : latest < avg ? 'down' : 'stable';
      statsData[key] = { avg, latest, trend };
    });

    setStats(statsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/manager/market-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          animalType: formData.animalType,
          district: formData.district,
          pricePerKg: parseFloat(formData.pricePerKg),
        }),
      });

      if (res.ok) {
        await fetchPrices();
        setShowForm(false);
        setFormData({
          animalType: '',
          district: '',
          pricePerKg: '',
        });
      }
    } catch (error) {
      console.error('Error saving price:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading market prices...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Market Prices</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Update Price'}
        </button>
      </div>

      {/* Price Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.keys(stats).slice(0, 6).map((key) => {
          const [animalType, district] = key.split('-');
          const stat = stats[key];
          return (
            <div key={key} className="bg-white shadow rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold capitalize">{animalType}</h3>
                  <p className="text-sm text-gray-500">{district}</p>
                </div>
                <div className="text-2xl">
                  {stat.trend === 'up' ? (
                    <FiTrendingUp className="text-green-600" />
                  ) : stat.trend === 'down' ? (
                    <FiTrendingDown className="text-red-600" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-gray-600">Latest:</span>{' '}
                  <span className="font-semibold">৳ {stat.latest.toFixed(2)}/kg</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Avg:</span>{' '}
                  <span className="font-semibold">৳ {stat.avg.toFixed(2)}/kg</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="bg-white shadow rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Update Market Price</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Animal Type</label>
              <select
                value={formData.animalType}
                onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Type</option>
                <option value="cow">Cow</option>
                <option value="goat">Goat</option>
                <option value="sheep">Sheep</option>
                <option value="buffalo">Buffalo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
                placeholder="e.g., Dhaka, Chittagong"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price per KG (৳)</label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="col-span-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Save Price
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Price History Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h2 className="font-semibold">Price History</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Animal Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium">District</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Price per KG</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {prices.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No price records found. Click "Update Price" to add one.
                </td>
              </tr>
            ) : (
              prices.map((price) => (
                <tr key={price.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {new Date(price.recordedAt).toLocaleDateString()} {new Date(price.recordedAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{price.animalType}</td>
                  <td className="px-4 py-3 text-sm">{price.district}</td>
                  <td className="px-4 py-3 text-sm font-semibold">৳ {price.pricePerKg.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Market prices are recorded for internal tracking and estimation purposes. 
          Actual kg prices are never displayed to investors. Only safe estimated values are shown.
        </p>
      </div>
    </div>
  );
}
