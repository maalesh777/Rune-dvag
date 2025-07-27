import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { MenuIcon } from './MenuIcon';
import { XIcon } from './XIcon';
import { auth } from './firebase';

interface HeaderProps {
  isLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  const activeLinkStyle = { color: '#2563eb', fontWeight: '600', textShadow: '0 0 8px rgba(59,130,246,0.5)' };
  const navLinkClass = "hover:text-blue-600 transition-colors duration-300 text-slate-700 font-medium";

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
    const mobileClass = isMobile ? "block text-2xl py-4 text-center" : "";

    const handleLogoutClick = async () => {
      closeMenu();
      try {
        await auth.signOut();
        navigate('/login');
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    };

    return (
      <>
        <NavLink to="/" className={`${navLinkClass} ${mobileClass}`} style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={closeMenu}>Empfehlung</NavLink>
        <NavLink to="/about" className={`${navLinkClass} ${mobileClass}`} style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={closeMenu}>Über Mich</NavLink>
        <NavLink to="/booking" className={`${navLinkClass} ${mobileClass}`} style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={closeMenu}>Termin Buchen</NavLink>
        {isLoggedIn ? (
          <>
            <NavLink to="/admin/dashboard" className={`${navLinkClass} ${mobileClass}`} style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={closeMenu}>Dashboard</NavLink>
            <div className={isMobile ? 'mt-6 text-center' : ''}>
                <Button onClick={handleLogoutClick} variant="accent" className="!px-4 !py-2">Logout</Button>
            </div>
          </>
        ) : (
           <NavLink to="/login" className={`${navLinkClass} ${mobileClass}`} style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={closeMenu}>Admin Login</NavLink>
        )}
      </>
    );
  };

  return (
    <>
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled ? 'bg-white/40 backdrop-blur-lg shadow-lg border-white/50' : 'bg-transparent border-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <NavLink to="/" className="text-xl md:text-2xl font-bold font-montserrat tracking-wider text-slate-800" onClick={closeMenu}>
            Rune Kämper <span className="text-amber-500 font-handwriting text-3xl ml-1">DVAG</span>
          </NavLink>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="text-slate-800 focus:outline-none">
              <MenuIcon className="h-7 w-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-slate-100/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-slide-in-right md:hidden">
          <button onClick={closeMenu} className="absolute top-6 right-6 text-slate-800 focus:outline-none">
            <XIcon className="h-8 w-8" />
          </button>
          <nav className="flex flex-col items-center space-y-8">
            <NavLinks isMobile={true} />
          </nav>
        </div>
      )}
    </>
  );
};