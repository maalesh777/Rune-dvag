import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-slate-500 mt-12 border-t border-slate-300/70">
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="font-montserrat font-bold text-slate-600">Rune Kämper - DVAG Vermögensberater</p>
        <p className="text-sm mt-2">&copy; {new Date().getFullYear()} Alle Rechte vorbehalten.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Impressum wird in Kürze hinzugefügt.'); }} className="hover:text-blue-600 transition-colors">Impressum</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Datenschutzinformationen werden in Kürze hinzugefügt.'); }} className="hover:text-blue-600 transition-colors">Datenschutz</a>
        </div>
      </div>
    </footer>
  );
};