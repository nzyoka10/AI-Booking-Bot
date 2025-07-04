import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  Wrench, 
  Star, 
  TrendingUp, 
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  LogOut,
  Phone,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardStats from '../components/DashboardStats';
import BookingsTable from '../components/BookingsTable';
import FundisTable from '../components/FundisTable';
import EarningsChart from '../components/EarningsChart';
import RecentActivity from '../components/RecentActivity';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { id: 'fundis', label: 'Fundi Management', icon: <Users className="w-5 h-5" /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'whatsapp', label: 'WhatsApp Bot', icon: <Phone className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <DashboardStats />
            <div className="grid lg:grid-cols-2 gap-6">
              <EarningsChart />
              <RecentActivity />
            </div>
          </div>
        );
      case 'bookings':
        return <BookingsTable />;
      case 'fundis':
        return <FundisTable />;
      case 'earnings':
        return <EarningsChart fullWidth={true} />;
      case 'whatsapp':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">WhatsApp Bot Management</h2>
              <Link 
                to="/whatsapp-bot"
                className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Bot Interface
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Bot Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">Status:</span>
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">Messages Today:</span>
                    <span className="font-semibold text-green-800">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">Success Rate:</span>
                    <span className="font-semibold text-green-800">94.2%</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">AI Performance</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">Response Time:</span>
                    <span className="font-semibold text-blue-800">1.2s avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">Match Accuracy:</span>
                    <span className="font-semibold text-blue-800">96.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">Bookings Converted:</span>
                    <span className="font-semibold text-blue-800">78.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b">
            <Wrench className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MtaaniFix</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                {/* <p className="font-medium text-gray-900">{user?.name}</p> */}
                <p className="font-medium text-gray-900">Admin User</p>

                {/* <p className="text-sm text-gray-500">{user?.role}</p> */}
                <p className="text-sm text-gray-500">Admin</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </h1>

              {/* <p className="text-gray-600">Welcome back, {user?.name}</p> */}
              <p className="text-gray-600">Welcome back, Admin User</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                View Website
              </Link>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;