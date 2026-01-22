import api from './api';

export const authService = {
  // Register new investor
  register: async (email: string, password: string, confirmPassword: string) => {
    const response = await api.post('/auth/register', { email, password, confirmPassword });
    return response.data;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    const response = await api.post('/auth/change-password', { 
      currentPassword, 
      newPassword, 
      confirmPassword 
    });
    return response.data;
  },

  // Get profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const adminService = {
  // Create manager
  createManager: async (email: string, temporaryPassword: string) => {
    const response = await api.post('/admin/managers', { email, temporaryPassword });
    return response.data;
  },

  // Get pending investors
  getPendingInvestors: async () => {
    const response = await api.get('/admin/investors/pending');
    return response.data;
  },

  // Verify investor
  verifyInvestor: async (investorId: number) => {
    const response = await api.put(`/admin/investors/${investorId}/verify`);
    return response.data;
  },

  // Reject investor
  rejectInvestor: async (investorId: number, reason: string) => {
    const response = await api.put(`/admin/investors/${investorId}/reject`, { reason });
    return response.data;
  },

  // Get all users
  getAllUsers: async (filters?: { role?: string; status?: string }) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },

  // Get sale recommendations
  getSaleRecommendations: async (status?: string) => {
    const response = await api.get('/admin/sale-recommendations', { params: { status } });
    return response.data;
  },

  // Approve sale recommendation
  approveSaleRecommendation: async (recommendationId: number) => {
    const response = await api.put(`/admin/sale-recommendations/${recommendationId}/approve`);
    return response.data;
  },

  // Reject sale recommendation
  rejectSaleRecommendation: async (recommendationId: number, reason: string) => {
    const response = await api.put(`/admin/sale-recommendations/${recommendationId}/reject`, { reason });
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};

export const managerService = {
  // Add animal
  addAnimal: async (animalData: any) => {
    const response = await api.post('/manager/animals', animalData);
    return response.data;
  },

  // Update animal
  updateAnimal: async (animalId: number, updates: any) => {
    const response = await api.put(`/manager/animals/${animalId}`, updates);
    return response.data;
  },

  // Get all animals
  getAllAnimals: async (filters?: { status?: string; type?: string; district?: string }) => {
    const response = await api.get('/manager/animals', { params: filters });
    return response.data;
  },

  // Get animal by ID
  getAnimalById: async (animalId: number) => {
    const response = await api.get(`/manager/animals/${animalId}`);
    return response.data;
  },

  // Update market price
  updateMarketPrice: async (district: string, animalType: string, pricePerKg: number) => {
    const response = await api.post('/manager/market-prices', { district, animalType, pricePerKg });
    return response.data;
  },

  // Get market prices
  getMarketPrices: async (filters?: { district?: string; animalType?: string }) => {
    const response = await api.get('/manager/market-prices', { params: filters });
    return response.data;
  },

  // Record sale
  recordSale: async (saleData: any) => {
    const response = await api.post('/manager/sales', saleData);
    return response.data;
  },

  // Get dashboard
  getManagerDashboard: async () => {
    const response = await api.get('/manager/dashboard');
    return response.data;
  },
};

export const investorService = {
  // Get portfolio
  getPortfolio: async () => {
    const response = await api.get('/investor/portfolio');
    return response.data;
  },

  // Create investment
  createInvestment: async (amount: number, maturityPeriod: number) => {
    const response = await api.post('/investor/investments', { amount, maturityPeriod });
    return response.data;
  },

  // Get investment details
  getInvestmentDetails: async (investmentId: number) => {
    const response = await api.get(`/investor/investments/${investmentId}`);
    return response.data;
  },

  // List investment for resale
  listForResale: async (investmentId: number, askPrice: number) => {
    const response = await api.post('/investor/resale/list', { investmentId, askPrice });
    return response.data;
  },

  // Get resale listings
  getResaleListings: async () => {
    const response = await api.get('/investor/resale/listings');
    return response.data;
  },

  // Place bid
  placeBid: async (resaleId: number, bidPrice: number) => {
    const response = await api.post('/investor/resale/bid', { resaleId, bidPrice });
    return response.data;
  },

  // Accept bid
  acceptBid: async (bidId: number) => {
    const response = await api.post('/investor/resale/accept-bid', { bidId });
    return response.data;
  },

  // Get dashboard
  getInvestorDashboard: async () => {
    const response = await api.get('/investor/dashboard');
    return response.data;
  },
};

export const saleService = {
  // Generate sale recommendation
  generateRecommendation: async (requiredCash: number) => {
    const response = await api.post('/sales/generate', { requiredCash });
    return response.data;
  },

  // Preview recommendation
  previewRecommendation: async (requiredCash: number) => {
    const response = await api.post('/sales/preview', { requiredCash });
    return response.data;
  },

  // Check maturing investments
  checkMaturing: async () => {
    const response = await api.get('/sales/check-maturing');
    return response.data;
  },
};
