import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Send, Phone, ArrowLeft, MapPin, Star, Clock, CheckCircle } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'booking' | 'fundi-list';
  data?: any;
}

const WhatsAppBot = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: 'Hello! 👋 Welcome to MtaaniFix — your trusted partner in finding verified fundis near you. What service can I assist you with today?',
    sender: 'bot',
    timestamp: new Date(),
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fundis = {
    plumbing: [
      {
        id: 1,
        name: 'John Mwangi',
        service: 'Plumbing',
        rating: 4.9,
        location: 'Westlands',
        distance: '2.1 km',
        availability: 'Available now',
        price: 'KSh 1,500/hour',
        image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg'
      },
      {
        id: 2,
        name: 'Grace Wanjiku',
        service: 'Plumbing',
        rating: 4.8,
        location: 'Kilimani',
        distance: '3.5 km',
        availability: 'Available in 30 mins',
        price: 'KSh 1,200/hour',
        image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg'
      },
      {
        id: 3,
        name: 'David Kamau',
        service: 'Plumbing',
        rating: 4.7,
        location: 'Parklands',
        distance: '4.2 km',
        availability: 'Available in 1 hour',
        price: 'KSh 1,800/hour',
        image: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg'
      }
    ],
    electrical: [
      {
        id: 4,
        name: 'Lucy Nduta',
        service: 'Electrical',
        rating: 4.8,
        location: 'CBD',
        distance: '2.0 km',
        availability: 'Available now',
        price: 'KSh 1,600/hour',
        image: 'https://images.pexels.com/photos/103573/pexels-photo-103573.jpeg'
      },
      {
        id: 5,
        name: 'James Otieno',
        service: 'Electrical',
        rating: 4.7,
        location: 'Ngong Road',
        distance: '3.2 km',
        availability: 'Available in 1 hour',
        price: 'KSh 1,750/hour',
        image: 'https://images.pexels.com/photos/2965260/pexels-photo-2965260.jpeg'
      }
    ],
    mechanic: [
      {
        id: 6,
        name: 'Moses Kariuki',
        service: 'Mechanic',
        rating: 4.6,
        location: 'Langata',
        distance: '6.2 km',
        availability: 'Available tomorrow',
        price: 'KSh 2,500/hour',
        image: 'https://images.pexels.com/photos/380731/pexels-photo-380731.jpeg'
      },
      {
        id: 7,
        name: 'Ann Achieng',
        service: 'Mechanic',
        rating: 4.5,
        location: 'Embakasi',
        distance: '5.0 km',
        availability: 'Available today afternoon',
        price: 'KSh 2,000/hour',
        image: 'https://images.pexels.com/photos/8972668/pexels-photo-8972668.jpeg'
      }
    ]
  };


  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const simulateTyping = () => new Promise(resolve => { setIsTyping(true); setTimeout(() => { setIsTyping(false); resolve(true); }, 1500); });

  const saveBooking = async (fundi: any) => {
    const { data, error } = await supabase.from('bookings').insert([{
      fundi_name: fundi.name,
      service: fundi.service,
      location: fundi.location,
      price: fundi.price,
      created_at: new Date().toISOString(),
    }]);
    if (error) console.error('Supabase insert error:', error);
    return data;
  };

  const processMessage = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    await simulateTyping();

    const responseTemplates = {
      plumberIntro: `🔧 Absolutely! Here are some highly-rated plumbers near you who are ready to assist.`,
      electricianIntro: `⚡ Excellent choice. Take a look at our top-rated electricians available around you.`,
      mechanicIntro: `🚗 No worries! These mechanics come highly recommended and can fix your vehicle in no time.`,
      bookingConfirm: (name: string) => `✅ Great decision! ${name} has been successfully booked for your service request.`,
      priceInfo: ` 💰 Here’s a breakdown of our standard hourly rates:\n• Plumbing: KSh 1,200 - 2,000\n• Electrical: KSh 1,500 - 2,500\n• Mechanics: KSh 1,000 - 3,000\n• ICT Support: KSh 800 - 1,500\nNo hidden costs — guaranteed!`,
      defaultInfo: `🛠️ I can assist with:\n• 🔧 Plumbing\n• ⚡ Electrical\n• 🚗 Mechanics\n• 💻 ICT Support\nLet me know what you need help with.`
    };

    if (lowerMessage.includes('plumb')) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), text: responseTemplates.plumberIntro, sender: 'bot', timestamp: new Date(), type: 'fundi-list', data: { fundis: fundis.plumbing }
      }]);
    } else if (lowerMessage.includes('electric')) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), text: responseTemplates.electricianIntro, sender: 'bot', timestamp: new Date(), type: 'fundi-list', data: { fundis: fundis.electrical }
      }]);
    } else if (lowerMessage.includes('mechanic')) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), text: responseTemplates.mechanicIntro, sender: 'bot', timestamp: new Date(), type: 'fundi-list', data: { fundis: fundis.mechanic }
      }]);
    } else if (lowerMessage.includes('book')) {
      const allFundis = [...fundis.plumbing, ...fundis.electrical, ...fundis.mechanic];
      const fundi = allFundis.find(f => lowerMessage.includes(f.name.toLowerCase().split(' ')[0]));
      if (fundi) {
        await saveBooking(fundi);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: responseTemplates.bookingConfirm(fundi.name),
          sender: 'bot',
          timestamp: new Date(),
          type: 'booking',
          data: {
            fundi,
            bookingId: `BK${Math.floor(Math.random() * 1000000)}`,
            estimatedArrival: '15-30 minutes'
          }
        }]);
      }
    } else if (lowerMessage.includes('price')) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), text: responseTemplates.priceInfo, sender: 'bot', timestamp: new Date()
      }]);
    } else {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), text: responseTemplates.defaultInfo, sender: 'bot', timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), text: inputMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    await processMessage(currentMessage);
  };

  const handleBookFundi = async (fundi: any) => {
    const userMessage: Message = { id: Date.now().toString(), text: `Book ${fundi.name}`, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    await processMessage(`book ${fundi.name}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'fundi-list' && message.data?.fundis) {
      return (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          {message.data.fundis.map((fundi: any) => (
            <div key={fundi.id} className="border-b last:border-b-0 pb-4 last:pb-0 mb-4 last:mb-0">
              <div className="flex items-start space-x-3">
                <img 
                  src={fundi.image} 
                  alt={fundi.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{fundi.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{fundi.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{fundi.location} • {fundi.distance}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{fundi.availability}</span>
                    </div>
                    <div className="font-medium text-green-600">{fundi.price}</div>
                  </div>
                  <button
                    onClick={() => handleBookFundi(fundi)}
                    className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (message.type === 'booking' && message.data) {
      return (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Booking Confirmed!</span>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Booking ID:</strong> {message.data.bookingId}</div>
            <div><strong>Fundi:</strong> {message.data.fundi.name}</div>
            <div><strong>Service:</strong> {message.data.fundi.service}</div>
            <div><strong>Estimated Arrival:</strong> {message.data.estimatedArrival}</div>
            <div><strong>Rate:</strong> {message.data.fundi.price}</div>
          </div>
          <div className="mt-3 p-3 bg-white rounded border text-sm">
            📱 You'll receive SMS updates and the fundi's contact details shortly. Payment will be processed after service completion.
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg p-3 shadow-sm max-w-sm">
        <p className="text-gray-800 whitespace-pre-line">{message.text}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center space-x-3">
        <Link to="/admin" className="p-1 hover:bg-green-700 rounded transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Phone className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold">MtaaniFix Bot</h1>
          <p className="text-sm text-green-100">AI Assistant • Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${
              message.sender === 'user' 
                ? 'bg-green-500 text-white rounded-lg p-3' 
                : ''
            }`}>
              {message.sender === 'user' ? (
                <p>{message.text}</p>
              ) : (
                <>
                  {renderMessage(message)}
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button 
            onClick={() => setInputMessage('I need a plumber in Westlands')}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            🔧 Plumber
          </button>
          <button 
            onClick={() => setInputMessage('I need an electrician')}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            ⚡ Electrician
          </button>
          <button 
            onClick={() => setInputMessage('My car needs repair')}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            🚗 Mechanic
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBot;