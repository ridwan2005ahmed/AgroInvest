'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { authService, adminService } from '@/lib/services';
import { FaUsers, FaFilter, FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';

export default function AllUsers() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminService.getAllUsers(
        filters.role || filters.status ? filters : undefined
      );
      setUsers(response.users);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setLoading(true);
    loadUsers();
  };

  const clearFilters = () => {
    setFilters({ role: '', status: '' });
    setLoading(true);
    loadUsers();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="text-red-600" />;
      case 'manager':
        return <FaUserTie className="text-blue-600" />;
      case 'investor':
        return <FaUser className="text-green-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: any = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      investor: 'bg-green-100 text-green-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
            <FaUsers className="mr-3" />
            All Users
          </h1>
          <button
            onClick={() => router.push('/admin/create-manager')}
            className="btn-primary"
          >
            + Create Manager
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center">
              <FaFilter className="text-gray-500 mr-2" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="input-field max-w-xs"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="investor">Investor</option>
            </select>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input-field max-w-xs"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <button onClick={applyFilters} className="btn-primary">
              Apply
            </button>
            <button onClick={clearFilters} className="btn-secondary">
              Clear
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Password Reset
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-3">{getRoleIcon(u.role)}</div>
                          <div className="text-sm font-medium text-gray-900">
                            {u.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(u.status)}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.is_verified ? (
                          <span className="text-green-600">✓ Yes</span>
                        ) : (
                          <span className="text-red-600">✗ No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.force_password_reset ? (
                          <span className="text-yellow-600">Required</span>
                        ) : (
                          <span className="text-gray-400">Not Required</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Total Users: <strong>{users.length}</strong>
        </div>
      </div>
    </DashboardLayout>
  );
}
