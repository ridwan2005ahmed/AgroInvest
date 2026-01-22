'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface Animal {
  id: number;
  animalType: string;
  currentWeight: number;
  healthScore: number;
  location: string;
  status: string;
  purchaseDate: string;
  purchasePrice: number;
}

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    animalType: '',
    currentWeight: '',
    healthScore: '',
    location: '',
    status: 'healthy',
    purchaseDate: '',
    purchasePrice: '',
  });

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/manager/animals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAnimals(data);
      }
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `http://localhost:5000/api/manager/animals/${editingId}`
        : 'http://localhost:5000/api/manager/animals';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          animalType: formData.animalType,
          currentWeight: parseFloat(formData.currentWeight),
          healthScore: parseInt(formData.healthScore),
          location: formData.location,
          status: formData.status,
          purchaseDate: formData.purchaseDate,
          purchasePrice: parseFloat(formData.purchasePrice),
        }),
      });

      if (res.ok) {
        await fetchAnimals();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          animalType: '',
          currentWeight: '',
          healthScore: '',
          location: '',
          status: 'healthy',
          purchaseDate: '',
          purchasePrice: '',
        });
      }
    } catch (error) {
      console.error('Error saving animal:', error);
    }
  };

  const handleEdit = (animal: Animal) => {
    setEditingId(animal.id);
    setFormData({
      animalType: animal.animalType,
      currentWeight: animal.currentWeight.toString(),
      healthScore: animal.healthScore.toString(),
      location: animal.location,
      status: animal.status,
      purchaseDate: animal.purchaseDate.split('T')[0],
      purchasePrice: animal.purchasePrice.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this animal?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/manager/animals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await fetchAnimals();
      }
    } catch (error) {
      console.error('Error deleting animal:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading animals...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Animals Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              animalType: '',
              currentWeight: '',
              healthScore: '',
              location: '',
              status: 'healthy',
              purchaseDate: '',
              purchasePrice: '',
            });
          }}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <FiPlus /> Add Animal
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Animal' : 'Add New Animal'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.currentWeight}
                onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Health Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.healthScore}
                onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location/District</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="healthy">Healthy</option>
                <option value="sick">Sick</option>
                <option value="recovered">Recovered</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Purchase Price (৳)</label>
              <input
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="col-span-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingId ? 'Update' : 'Add'} Animal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Weight (kg)</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Health</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Purchase Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Purchase Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {animals.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No animals found. Click "Add Animal" to get started.
                </td>
              </tr>
            ) : (
              animals.map((animal) => (
                <tr key={animal.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{animal.id}</td>
                  <td className="px-4 py-3 text-sm capitalize">{animal.animalType}</td>
                  <td className="px-4 py-3 text-sm">{animal.currentWeight.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">{animal.healthScore}/10</td>
                  <td className="px-4 py-3 text-sm">{animal.location}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        animal.status === 'healthy'
                          ? 'bg-green-100 text-green-800'
                          : animal.status === 'sick'
                          ? 'bg-red-100 text-red-800'
                          : animal.status === 'sold'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {animal.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(animal.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">৳ {animal.purchasePrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(animal)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(animal.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
