import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';

interface EarningsChartProps {
  fullWidth?: boolean;
}

const EarningsChart: React.FC<EarningsChartProps> = ({ fullWidth = false }) => {
  const monthlyData = [
    { month: 'Jan', revenue: 45000, bookings: 89, commission: 6750 },
    { month: 'Feb', revenue: 52000, bookings: 104, commission: 7800 },
    { month: 'Mar', revenue: 48000, bookings: 96, commission: 7200 },
    { month: 'Apr', revenue: 61000, bookings: 122, commission: 9150 },
    { month: 'May', revenue: 55000, bookings: 110, commission: 8250 },
    { month: 'Jun', revenue: 67000, bookings: 134, commission: 10050 },
    { month: 'Jul', revenue: 72000, bookings: 144, commission: 10800 },
    { month: 'Aug', revenue: 68000, bookings: 136, commission: 10200 },
    { month: 'Sep', revenue: 74000, bookings: 148, commission: 11100 },
    { month: 'Oct', revenue: 79000, bookings: 158, commission: 11850 },
    { month: 'Nov', revenue: 85000, bookings: 170, commission: 12750 },
    { month: 'Dec', revenue: 92000, bookings: 184, commission: 13800 }
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: 'KSh 758,000',
      change: '+23.5%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Commission Earned',
      value: 'KSh 119,700',
      change: '+18.2%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-blue-600'
    },
    {
      title: 'Total Bookings',
      value: '1,595',
      change: '+15.8%',
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-purple-600'
    },
    {
      title: 'Active Fundi\'s',
      value: '156',
      change: '+8.2%',
      icon: <Users className="w-6 h-6" />,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className={`${fullWidth ? 'col-span-full' : ''} space-y-6`}>
      {fullWidth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue & Bookings Trend</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Bookings</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#9CA3AF' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#9CA3AF' }}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? `KSh ${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Bookings'
                ]}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bookings" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Commission Earnings</h3>
          <span className="text-sm text-gray-600">15% Commission Rate</span>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#9CA3AF' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#9CA3AF' }}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`KSh ${value.toLocaleString()}`, 'Commission']}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="commission" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;