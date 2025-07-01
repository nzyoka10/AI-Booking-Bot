import React, { useState } from 'react';
import { Search, Star, MapPin, Phone, Eye, Edit, MoreVertical } from 'lucide-react';

const FundisTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');

  const fundis = [
    {
      id: 1,
      name: 'John Mwangi',
      phone: '+254 701 234 567',
      email: 'john.mwangi@email.com',
      service: 'Plumbing',
      specialties: ['Kitchen Plumbing', 'Bathroom Repairs', 'Pipe Installation'],
      location: 'Westlands, Nairobi',
      rating: 4.9,
      totalJobs: 187,
      completedJobs: 182,
      earnings: 125000,
      joinDate: '2023-03-15',
      status: 'active',
      availability: 'available',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: 2,
      name: 'Grace Wanjiku',
      phone: '+254 733 567 890',
      email: 'grace.wanjiku@email.com',
      service: 'Electrical',
      specialties: ['Wiring', 'Solar Installation', 'Electrical Repairs'],
      location: 'Kilimani, Nairobi',
      rating: 4.8,
      totalJobs: 156,
      completedJobs: 151,
      earnings: 98000,
      joinDate: '2023-05-20',
      status: 'active',
      availability: 'busy',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: 3,
      name: 'David Kamau',
      phone: '+254 745 678 901',
      email: 'david.kamau@email.com',
      service: 'Mechanics',
      specialties: ['Engine Repair', 'Brake Systems', 'Transmission'],
      location: 'Karen, Nairobi',
      rating: 4.7,
      totalJobs: 143,
      completedJobs: 138,
      earnings: 110000,
      joinDate: '2023-02-10',
      status: 'active',
      availability: 'available',
      image: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: 4,
      name: 'Mary Njeri',
      phone: '+254 767 890 123',
      email: 'mary.njeri@email.com',
      service: 'ICT Support',
      specialties: ['Network Setup', 'Computer Repair', 'Software Installation'],
      location: 'CBD, Nairobi',
      rating: 4.6,
      totalJobs: 89,
      completedJobs: 85,
      earnings: 67000,
      joinDate: '2023-07-08',
      status: 'active',
      availability: 'available',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: 5,
      name: 'Peter Ochieng',
      phone: '+254 789 012 345',
      email: 'peter.ochieng@email.com',
      service: 'Plumbing',
      specialties: ['Drainage Systems', 'Water Heater Repair'],
      location: 'Parklands, Nairobi',
      rating: 4.5,
      totalJobs: 67,
      completedJobs: 63,
      earnings: 45000,
      joinDate: '2023-09-12',
      status: 'suspended',
      availability: 'unavailable',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFundis = fundis.filter(fundi => {
    const matchesSearch = fundi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fundi.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fundi.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === 'all' || fundi.service.toLowerCase() === serviceFilter.toLowerCase();
    return matchesSearch && matchesService;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Fundi Management</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search fundi's..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Services</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="mechanics">Mechanics</option>
              <option value="ict support">ICT Support</option>
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
                Fundi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service & Specialties
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Earnings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFundis.map((fundi) => (
              <tr key={fundi.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      src={fundi.image} 
                      alt={fundi.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{fundi.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {fundi.phone}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {fundi.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 mb-1">{fundi.service}</div>
                    <div className="text-gray-500">
                      {fundi.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                          {specialty}
                        </span>
                      ))}
                      {fundi.specialties.length > 2 && (
                        <span className="text-xs text-gray-500">+{fundi.specialties.length - 2} more</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="flex items-center mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">{fundi.rating}</span>
                      <span className="text-gray-500 ml-1">rating</span>
                    </div>
                    <div className="text-gray-500">
                      {fundi.completedJobs}/{fundi.totalJobs} jobs completed
                    </div>
                    <div className="text-green-600 text-xs font-medium">
                      {Math.round((fundi.completedJobs / fundi.totalJobs) * 100)}% success rate
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fundi.status)}`}>
                      {fundi.status.charAt(0).toUpperCase() + fundi.status.slice(1)}
                    </span>
                    <br />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(fundi.availability)}`}>
                      {fundi.availability.charAt(0).toUpperCase() + fundi.availability.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      KSh {fundi.earnings.toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Total earnings
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredFundis.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No fundi's found matching your criteria.</div>
        </div>
      )}
    </div>
  );
};

export default FundisTable;