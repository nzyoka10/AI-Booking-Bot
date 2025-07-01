import React, { useState } from 'react';
import { Search, Filter, Eye, MapPin, Clock, User, Phone, Star } from 'lucide-react';

const BookingsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const bookings = [
    {
      id: 'BK001234',
      customer: 'Jane Doe',
      customerPhone: '+254 712 345 678',
      fundi: 'John Mwangi',
      fundiPhone: '+254 701 234 567',
      service: 'Plumbing',
      description: 'Kitchen sink repair',
      location: 'Westlands, Nairobi',
      scheduledTime: '2024-01-15 14:00',
      status: 'completed',
      amount: 2500,
      rating: 4.8,
      createdAt: '2024-01-15 10:30'
    },
    {
      id: 'BK001235',
      customer: 'Mike Johnson',
      customerPhone: '+254 722 456 789',
      fundi: 'Grace Wanjiku',
      fundiPhone: '+254 733 567 890',
      service: 'Electrical',
      description: 'Power outlet installation',
      location: 'Kilimani, Nairobi',
      scheduledTime: '2024-01-15 16:30',
      status: 'in-progress',
      amount: 3200,
      rating: null,
      createdAt: '2024-01-15 12:15'
    },
    {
      id: 'BK001236',
      customer: 'Sarah Wilson',
      customerPhone: '+254 734 567 890',
      fundi: 'David Kamau',
      fundiPhone: '+254 745 678 901',
      service: 'Mechanics',
      description: 'Car engine diagnosis',
      location: 'Karen, Nairobi',
      scheduledTime: '2024-01-16 09:00',
      status: 'scheduled',
      amount: 4500,
      rating: null,
      createdAt: '2024-01-15 15:45'
    },
    {
      id: 'BK001237',
      customer: 'Robert Smith',
      customerPhone: '+254 756 789 012',
      fundi: 'Mary Njeri',
      fundiPhone: '+254 767 890 123',
      service: 'ICT Support',
      description: 'Network setup',
      location: 'CBD, Nairobi',
      scheduledTime: '2024-01-15 11:00',
      status: 'cancelled',
      amount: 1800,
      rating: null,
      createdAt: '2024-01-15 08:20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'scheduled':
        return '📅';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.fundi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fundi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">#{booking.id}</div>
                    <div className="text-gray-500 flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(booking.scheduledTime).toLocaleString()}
                    </div>
                    <div className="text-gray-500 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.location}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{booking.customer}</div>
                    <div className="text-gray-500 flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      {booking.customerPhone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{booking.fundi}</div>
                    <div className="text-gray-500 flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      {booking.fundiPhone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{booking.service}</div>
                    <div className="text-gray-500">{booking.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    <span className="mr-1">{getStatusIcon(booking.status)}</span>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('-', ' ')}
                  </span>
                  {booking.rating && (
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{booking.rating}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  KSh {booking.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No bookings found matching your criteria.</div>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;