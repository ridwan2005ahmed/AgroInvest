'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/services';
import { FaHome, FaChartBar, FaUsers, FaSignOutAlt, FaBoxes, FaDollarSign, FaExchangeAlt, FaKey, FaFileAlt } from 'react-icons/fa';

interface NavbarProps {
  userRole: 'admin' | 'manager' | 'investor';
  userName?: string;
}

export default function Navbar({ userRole, userName }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { href: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
          { href: '/admin/users', icon: FaUsers, label: 'Users' },
          { href: '/admin/investors', icon: FaUsers, label: 'Pending Investors' },
          { href: '/admin/recommendations', icon: FaFileAlt, label: 'Sale Recommendations' },
          { href: '/admin/create-manager', icon: FaUsers, label: 'Create Manager' },
        ];
      case 'manager':
        return [
          { href: '/manager/dashboard', icon: FaHome, label: 'Dashboard' },
          { href: '/manager/animals', icon: FaBoxes, label: 'Animals' },
          { href: '/manager/market-prices', icon: FaDollarSign, label: 'Market Prices' },
          { href: '/manager/sales', icon: FaExchangeAlt, label: 'Sales' },
          { href: '/manager/generate-sale', icon: FaFileAlt, label: 'Generate Sale' },
        ];
      case 'investor':
        return [
          { href: '/investor/dashboard', icon: FaHome, label: 'Dashboard' },
          { href: '/investor/portfolio', icon: FaChartBar, label: 'Portfolio' },
          { href: '/investor/invest', icon: FaDollarSign, label: 'Invest' },
          { href: '/investor/marketplace', icon: FaExchangeAlt, label: 'Marketplace' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 576 512">
              <path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path>
            </svg>
            <h1 className="text-xl font-bold text-blue-600">AgroInvest</h1>
          </div>
            <span className="text-sm text-gray-500 capitalize">({userRole})</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
            <Link
              href="/change-password"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaKey />
              <span>Change Password</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden md:block">{userName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
