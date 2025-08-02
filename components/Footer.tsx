
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12 py-4 border-t border-slate-800">
      <div className="container mx-auto text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} EV Battery Intelligence. A Predictive Digital Twin Prototype.</p>
        <p className="mt-1">Powered by React, Tailwind CSS, and Google Gemini.</p>
      </div>
    </footer>
  );
};

export default Footer;
