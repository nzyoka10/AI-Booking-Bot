import React from 'react';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Star } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Bookings',
      value: '2,347',
      change: '+12.5%',
      trend: 'up',
      icon: <Calendar className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Active Fundi\'s',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Total Revenue',
      value: 'KSh 487,230',
      change: '+15.8%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'Avg Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: <Star className="w-6 h-6" />,
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600',
      green: 'bg-green-500 text-green-600',
      purple: 'bg-purple-500 text-purple-600',
      yellow: 'bg-yellow-500 text-yellow-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const colorClass = getColorClasses(stat.color);
        const [bgColor, textColor] = colorClass.split(' ');
        
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${bgColor} bg-opacity-10 p-3 rounded-lg`}>
                <div className={textColor}>
                  {stat.icon}
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;