import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  email: string;
  role: 'admin' | 'fundi' | 'customer';
  profile: {
    id: string;
    full_name: string;
    phone?: string;
    location?: string;
    avatar_url?: string;
  };
  fundiProfile?: {
    id: string;
    specialties: string[];
    hourly_rate: number;
    rating: number;
    availability: 'available' | 'busy' | 'unavailable';
    verification_status: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      let fundiProfile = null;
      if (profile.role === 'fundi') {
        // Get fundi-specific data
        const { data: fundi, error: fundiError } = await supabase
          .from('fundis')
          .select('*')
          .eq('profile_id', profile.id)
          .single();

        if (!fundiError && fundi) {
          fundiProfile = fundi;
        }
      }

      const userData: User = {
        id: userId,
        email: profile.email,
        role: profile.role,
        profile: {
          id: profile.id,
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          avatar_url: profile.avatar_url,
        },
        fundiProfile
      };

      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            email,
            full_name: userData.name,
            phone: userData.phone,
            role: userData.role,
            location: userData.location || null,
          })
          .select()
          .single();

        if (profileError) throw profileError;

        // If user is a fundi, create fundi profile
        if (userData.role === 'fundi') {
          const { error: fundiError } = await supabase
            .from('fundis')
            .insert({
              profile_id: profile.id,
              specialties: userData.specialties || [],
              hourly_rate: userData.hourly_rate || 0,
              experience_years: userData.experience_years || 0,
              bio: userData.bio || '',
              location: userData.location || '',
            });

          if (fundiError) throw fundiError;
        }

        await fetchUserProfile(authData.user.id);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const updateProfile = async (profileData: any) => {
    if (!user) throw new Error('No user logged in');

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          location: profileData.location,
          avatar_url: profileData.avatar_url,
        })
        .eq('id', user.profile.id);

      if (profileError) throw profileError;

      // Update fundi profile if user is a fundi
      if (user.role === 'fundi' && user.fundiProfile) {
        const { error: fundiError } = await supabase
          .from('fundis')
          .update({
            specialties: profileData.specialties,
            hourly_rate: profileData.hourly_rate,
            bio: profileData.bio,
            availability: profileData.availability,
          })
          .eq('id', user.fundiProfile.id);

        if (fundiError) throw fundiError;
      }

      // Refresh user data
      await fetchUserProfile(user.id);
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};