import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-[#92003A] text-white flex items-center justify-center shadow-xl animate-pulse mb-4">
          <Sparkles className="w-8 h-8 text-[#FFE185] animate-spin" />
        </div>
        <div className="font-heading font-black text-xl text-[#92003A]">
          Be Conscious
        </div>
        <p className="text-xs font-bold text-brand-muted tracking-wider uppercase mt-1">
          Verifying Authenticated Session...
        </p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and preserve requested destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
