import React from 'react';
import { Clock, User, CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'booking_completed',
      title: 'Booking Completed',
      description: 'John Mwangi completed plumbing service for Jane Doe',
      customer: 'Jane Doe',
      fundi: 'John Mwangi',
      amount: 2500,
      rating: 4.8,
      timestamp: '2 minutes ago',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    },
    {
      id: 2,
      type: 'new_booking',
      title: 'New Booking',
      description: 'Sarah Wilson booked David Kamau for car repair',
      customer: 'Sarah Wilson',
      fundi: 'David Kamau',
      amount: 4500,
      timestamp: '15 minutes ago',
      icon: <User className="w-5 h-5 text-blue-600" />
    },
    {
      id: 3,
      type: 'fundi_joined',
      title: 'New Fundi Registered',
      description: 'Mary Njeri joined as ICT Support specialist',
      fundi: 'Mary Njeri',
      service: 'ICT Support',
      timestamp: '1 hour ago',
      icon: <User className="w-5 h-5 text-purple-600" />
    },
    {
      id: 4,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      description: 'Robert Smith cancelled electrical service booking',
      customer: 'Robert Smith',
      fundi: 'Grace Wanjiku',
      timestamp: '2 hours ago',
      icon: <XCircle className="w-5 h-5 text-red-600" />
    },
    {
      id: 5,
      type: 'high_rating',
      title: 'Excellent Rating',
      description: 'John Mwangi received 5-star rating from customer',
      fundi: 'John Mwangi',
      rating: 5.0,
      timestamp: '3 hours ago',
      icon: <Star className="w-5 h-5 text-yellow-600" />
    },
    {
      id: 6,
      type: 'payment_received',
      title: 'Payment Processed',
      description: 'Payment of KSh 3,200 processed for electrical work',
      amount: 3200,
      commission: 480,
      timestamp: '4 hours ago',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking_completed':
      case 'payment_received':
        return 'bg-green-50 border-green-200';
      case 'new_booking':
      case 'fundi_joined':
        return 'bg-blue-50 border-blue-200';
      case 'booking_cancelled':
        return 'bg-red-50 border-red-200';
      case 'high_rating':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`p-4 rounded-lg border ${getActivityColor(activity.type)} transition-colors hover:shadow-sm`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    {activity.customer && (
                      <span>Customer: {activity.customer}</span>
                    )}
                    {activity.fundi && (
                      <span>Fundi: {activity.fundi}</span>
                    )}
                    {activity.service && (
                      <span>Service: {activity.service}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {activity.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="font-medium">{activity.rating}</span>
                      </div>
                    )}
                    {activity.amount && (
                      <span className="font-medium text-green-600">
                        KSh {activity.amount.toLocaleString()}
                        {activity.commission && (
                          <span className="text-gray-500 ml-1">
                            (KSh {activity.commission} commission)
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;