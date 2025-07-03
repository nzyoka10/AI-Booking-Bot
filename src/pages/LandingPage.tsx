import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Zap, 
  Car, 
  Smartphone, 
  Star, 
  Shield, 
  Clock, 
  MapPin,
  Phone,
  CheckCircle,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';

const LandingPage = () => {
  const services = [
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Plumbing",
      description: "Professional plumbers for all your water and drainage needs",
      color: "bg-blue-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Electrical",
      description: "Licensed electricians for installations and repairs",
      color: "bg-yellow-500"
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Mechanics",
      description: "Expert mechanics for vehicle repairs and maintenance",
      color: "bg-red-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "ICT Services",
      description: "Tech support, installations, and IT solutions",
      color: "bg-purple-500"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Professionals",
      description: "All fundi's are vetted and background-checked"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Availability",
      description: "Book services anytime via WhatsApp"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location-Based Matching",
      description: "AI matches you with nearby professionals"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Quality Guaranteed",
      description: "Rated professionals with quality assurance"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Verified Fundi's", icon: <Users className="w-6 h-6" /> },
    { number: "50,000+", label: "Jobs Completed", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "4.8/5", label: "Average Rating", icon: <Star className="w-6 h-6" /> },
    { number: "47", label: "Counties Covered", icon: <MapPin className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wrench className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MtaaniFix</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">KE</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Book Skilled Workers
                <span className="text-yellow-400"> Via WhatsApp</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                AI-powered platform connecting you with verified professionals across Kenya. 
                From plumbers to electricians, get the job done right, fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://wa.me/254714930919?text=Hello%20MtaaniFix%2C%20I%20would%20like%20assistance%20with%20booking%20a%20fundi%20for%20a%20service.%20Please%20let%20me%20know%20the%20next%20steps..."
                  alt="Book via WhatsApp" 
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Book via WhatsApp
                </a>
                <Link 
                  to="/whatsapp-bot"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Try Demo Bot
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp Bot</h3>
                    <p className="text-sm text-blue-100">AI-Powered Assistant</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm">"I need a plumber in Westlands"</p>
                  </div>
                  <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm">🔧 Found 3 verified plumbers nearby! John (4.9⭐) is available now. Shall I book?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Services Available
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From emergency repairs to planned installations, our verified professionals 
              are ready to help with quality workmanship guaranteed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`${service.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Book Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose MtaaniFix?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing how Kenyans find and book skilled workers with 
              AI-powered matching and seamless WhatsApp integration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of satisfied customers who trust MtaaniFix for their home and business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/25471493019?text=Hi%20MtaaniFix,%20I%20need%20help%20booking%20a%20fundi"
              className="inline-flex items-center justify-center bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Start Booking Now
            </a>
            <Link 
              to="/admin"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              View Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">MtaaniFix</span>
              </div>
              <p className="text-gray-400">
                Connecting Kenyans with trusted skilled workers through AI-powered WhatsApp booking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Plumbing</li>
                <li>Electrical</li>
                <li>Mechanics</li>
                <li>ICT Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+254 700 000 000</li>
                <li>hello@mtaanifix.ke</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MtaaniFix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;