'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiCheckCircle } from 'react-icons/fi';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError('New password must be different from old password');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiLock className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Change Password</h1>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-green-800">
              <FiCheckCircle className="text-xl" />
              <div>
                <p className="font-semibold">Password changed successfully!</p>
                <p className="text-sm">Redirecting...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                value={formData.oldPassword}
                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                required
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your current password"
                disabled={loading || success}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password (min 6 characters)"
                disabled={loading || success}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Re-enter new password"
                disabled={loading || success}
              />
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
            <h3 className="text-sm font-semibold mb-2">Password Requirements:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Minimum 6 characters</li>
              <li>• Must be different from current password</li>
              <li>• Use a strong, unique password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
