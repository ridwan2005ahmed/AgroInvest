'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { authService, adminService } from '@/lib/services';
import { FaUserTie, FaCheckCircle } from 'react-icons/fa';

export default function CreateManager() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    temporaryPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdManager, setCreatedManager] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    setFormData({ 
      ...formData, 
      temporaryPassword: password,
      confirmPassword: password
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.temporaryPassword || !formData.confirmPassword) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      if (formData.temporaryPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.temporaryPassword.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const response = await adminService.createManager(formData.email, formData.temporaryPassword);
      
      setCreatedManager({
        email: formData.email,
        password: formData.temporaryPassword
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create manager account');
    } finally {
      setLoading(false);
    }
  };

  if (success && createdManager) {
    return (
      <DashboardLayout userRole="admin" userName={user?.email}>
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Manager Account Created Successfully!
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-4">
                ⚠️ Please save these credentials securely. The manager will be forced to change their password on first login.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-mono font-bold text-gray-800">{createdManager.email}</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-xs text-gray-500 mb-1">Temporary Password</p>
                  <p className="font-mono font-bold text-gray-800">{createdManager.password}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setCreatedManager(null);
                  setFormData({
                    email: '',
                    temporaryPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="w-full btn-primary"
              >
                Create Another Manager
              </button>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="w-full btn-secondary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin" userName={user?.email}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-green-600 hover:text-green-700 flex items-center"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <FaUserTie className="text-green-600 text-4xl mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Create Manager Account</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="manager@example.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Manager will use this email to login
              </p>
            </div>

            {/* Temporary Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Temporary Password
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="temporaryPassword"
                  value={formData.temporaryPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter temporary password"
                  required
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="btn-secondary whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Manager will be forced to change this on first login
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="text"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm password"
                required
              />
            </div>

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> After creation, the manager will:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Receive login credentials (you must share them manually)</li>
                <li>Be forced to change password on first login</li>
                <li>Have access to livestock and market price management</li>
                <li>NOT be able to create other users or approve investors</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Manager Account...' : 'Create Manager Account'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
