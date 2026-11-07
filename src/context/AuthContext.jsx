import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { supabaseService } from '../services/supabaseService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState({
    dietary_preferences: [],
    allergen_preferences: []
  });
  const [loading, setLoading] = useState(true);

  // Initialize Auth state & listen to changes
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (!isSupabaseConfigured()) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        // 1. Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) console.error('Error getting initial session:', error);

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
        }

        if (initialSession?.user) {
          // 2. Fetch profile and preferences
          const [profileRes, prefRes] = await Promise.all([
            supabaseService.getProfile(initialSession.user.id),
            supabaseService.getPreferences(initialSession.user.id)
          ]);

          if (mounted) {
            if (profileRes.data) setProfile(profileRes.data);
            if (prefRes.data) setPreferences(prefRes.data);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    // 3. Set up Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Load profile and preferences on sign in
          const [profileRes, prefRes] = await Promise.all([
            supabaseService.getProfile(currentSession.user.id),
            supabaseService.getPreferences(currentSession.user.id)
          ]);

          if (profileRes.data) setProfile(profileRes.data);
          if (prefRes.data) setPreferences(prefRes.data);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setPreferences({ dietary_preferences: [], allergen_preferences: [] });
        } else if (event === 'USER_UPDATED' && currentSession?.user) {
          const profileRes = await supabaseService.getProfile(currentSession.user.id);
          if (profileRes.data) setProfile(profileRes.data);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Auth Operations
  const signInWithEmail = async (credentials) => {
    return await supabaseService.signInWithEmail(credentials);
  };

  const signUpWithEmail = async (userData) => {
    return await supabaseService.signUpWithEmail(userData);
  };

  const signInWithGoogle = async () => {
    return await supabaseService.signInWithGoogle();
  };

  const signOut = async () => {
    const res = await supabaseService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    return res;
  };

  const resetPassword = async (email) => {
    return await supabaseService.resetPasswordForEmail(email);
  };

  const updatePassword = async (newPassword) => {
    return await supabaseService.updatePassword(newPassword);
  };

  const updateProfile = async (updates) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };
    const res = await supabaseService.updateProfile(user.id, updates);
    if (res.data) setProfile(res.data);
    return res;
  };

  const updatePreferences = async (newPrefs) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };
    const res = await supabaseService.savePreferences(user.id, newPrefs);
    if (res.data) setPreferences(res.data);
    return res;
  };

  const value = {
    user,
    session,
    profile,
    preferences,
    loading,
    isConfigured: isSupabaseConfigured(),
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    updatePreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
