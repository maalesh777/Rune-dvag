
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ReferralForm } from './ReferralForm';
import { About } from './About';
import { Booking } from './Booking';
import { Login } from './Login';
import { AdminDashboard } from './AdminDashboard';
import { auth } from './firebase';
import { User } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header isLoggedIn={isLoggedIn} />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
                <div className="max-w-2xl mx-auto">
                    <ReferralForm />
                </div>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <Login />} />
            
            {/* Protected Admin Route */}
            <Route 
              path="/admin/dashboard" 
              element={
                isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" replace />
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
