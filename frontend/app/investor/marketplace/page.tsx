'use client';

import { useState, useEffect } from 'react';
import { FiShoppingCart, FiTrendingUp, FiClock } from 'react-icons/fi';

interface ResaleListing {
  id: number;
  investmentId: number;
  sellerId: number;
  sellerName: string;
  askingPrice: number;
  ownershipPercentage: number;
  originalInvestment: number;
  estimatedValue: number;
  maturityDate: string;
  status: string;
  createdAt: string;
  bidCount?: number;
}

interface Bid {
  id: number;
  resaleId: number;
  bidderId: number;
  bidderName: string;
  bidAmount: number;
  status: string;
  createdAt: string;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<ResaleListing[]>([]);
  const [myListings, setMyListings] = useState<ResaleListing[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-listings' | 'my-bids'>('browse');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBidForm, setShowBidForm] = useState<number | null>(null);
  const [createFormData, setCreateFormData] = useState({
    investmentId: '',
    askingPrice: '',
  });
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (activeTab === 'browse') {
        const res = await fetch('http://localhost:5000/api/investor/resale/listings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // Handle both array and object with listings property
          const listingsData = Array.isArray(data) ? data : (data.listings || []);
          setListings(listingsData);
        } else {
          setListings([]);
        }
      } else if (activeTab === 'my-listings') {
        const res = await fetch('http://localhost:5000/api/investor/resale/my-listings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const listingsData = Array.isArray(data) ? data : (data.listings || []);
          setMyListings(listingsData);
        } else {
          setMyListings([]);
        }
      } else if (activeTab === 'my-bids') {
        const res = await fetch('http://localhost:5000/api/investor/resale/my-bids', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const bidsData = Array.isArray(data) ? data : (data.bids || []);
          setMyBids(bidsData);
        } else {
          setMyBids([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Reset states on error
      setListings([]);
      setMyListings([]);
      setMyBids([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/investor/resale/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          investmentId: parseInt(createFormData.investmentId),
          askPrice: parseFloat(createFormData.askingPrice),
        }),
      });

      if (res.ok) {
        setShowCreateForm(false);
        setCreateFormData({ investmentId: '', askingPrice: '' });
        setActiveTab('my-listings');
        await fetchData();
        alert('Listing created successfully!');
      } else {
        const error = await res.json();
        alert(error.message || error.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Error creating listing');
    }
  };

  const handlePlaceBid = async (resaleId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/investor/resale/bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resaleId,
          bidAmount: parseFloat(bidAmount),
        }),
      });

      if (res.ok) {
        setShowBidForm(null);
        setBidAmount('');
        await fetchData();
        alert('Bid placed successfully!');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to place bid');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Error placing bid');
    }
  };

  const handleAcceptBid = async (bidId: number) => {
    if (!confirm('Accept this bid and transfer ownership?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/investor/resale/accept-bid/${bidId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await fetchData();
        alert('Bid accepted! Ownership transferred.');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to accept bid');
      }
    } catch (error) {
      console.error('Error accepting bid:', error);
      alert('Error accepting bid');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Internal Marketplace</h1>
        {activeTab === 'browse' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showCreateForm ? 'Cancel' : 'List My Investment'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'browse'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Browse Listings
        </button>
        <button
          onClick={() => setActiveTab('my-listings')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'my-listings'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          My Listings
        </button>
        <button
          onClick={() => setActiveTab('my-bids')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'my-bids'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          My Bids
        </button>
      </div>

      {/* Create Listing Form */}
      {showCreateForm && activeTab === 'browse' && (
        <div className="bg-white shadow rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">List Investment for Resale</h2>
          <form onSubmit={handleCreateListing} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Investment ID</label>
                <input
                  type="number"
                  value={createFormData.investmentId}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, investmentId: e.target.value })
                  }
                  required
                  placeholder="Your investment ID"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Asking Price (৳)</label>
                <input
                  type="number"
                  step="0.01"
                  value={createFormData.askingPrice}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, askingPrice: e.target.value })
                  }
                  required
                  placeholder="Your asking price"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create Listing
              </button>
            </div>
          </form>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            <strong>Note:</strong> Early withdrawal is not permitted. Internal resale is the only way 
            to transfer ownership before maturity.
          </div>
        </div>
      )}

      {/* Browse Listings */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No active listings available.
            </div>
          ) : (
            listings.map((listing) => (
              <div key={listing.id} className="bg-white shadow rounded p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Investment #{listing.investmentId}</h3>
                    <p className="text-sm text-gray-500">by {listing.sellerName}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {listing.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Asking Price:</span>
                    <span className="font-semibold">৳ {listing.askingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ownership:</span>
                    <span className="font-semibold">{listing.ownershipPercentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Value:</span>
                    <span className="font-semibold">৳ {listing.estimatedValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Maturity:</span>
                    <span className="font-semibold">
                      {new Date(listing.maturityDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {showBidForm === listing.id ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.01"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Your bid amount"
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowBidForm(null)}
                        className="flex-1 bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handlePlaceBid(listing.id)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        Submit Bid
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowBidForm(listing.id)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
                  >
                    <FiShoppingCart /> Place Bid
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* My Listings */}
      {activeTab === 'my-listings' && (
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Investment ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Asking Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Ownership</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Bids</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {myListings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    You haven't listed any investments yet.
                  </td>
                </tr>
              ) : (
                myListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{listing.id}</td>
                    <td className="px-4 py-3 text-sm">{listing.investmentId}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      ৳ {listing.askingPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">{listing.ownershipPercentage}%</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          listing.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{listing.bidCount || 0}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* My Bids */}
      {activeTab === 'my-bids' && (
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Listing ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Seller</th>
                <th className="px-4 py-3 text-left text-sm font-medium">My Bid</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Placed At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {myBids.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    You haven't placed any bids yet.
                  </td>
                </tr>
              ) : (
                myBids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{bid.id}</td>
                    <td className="px-4 py-3 text-sm">{bid.resaleId}</td>
                    <td className="px-4 py-3 text-sm">{bid.bidderName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      ৳ {bid.bidAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          bid.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : bid.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {bid.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(bid.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Information Banner */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">Internal Resale Mechanism</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Early withdrawal is not permitted</li>
          <li>• Internal resale is the only way to transfer ownership before maturity</li>
          <li>• All transactions are logged and monitored</li>
          <li>• Company retains authority over final ownership transfers</li>
        </ul>
      </div>
    </div>
  );
}
