import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, DollarSign, BookOpen, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { iconButtonVariants } from '../utils/motionVariants';

const Layout = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { path: '/roteiro', icon: Calendar, label: 'Roteiro' },
    { path: '/financeiro', icon: DollarSign, label: 'Financeiro' },
    { path: '/historia', icon: BookOpen, label: 'História' }
  ];

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sand-300 sticky top-0 z-50">
        <div className="container-mobile">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-ocean to-aqua rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-dark">Viagem Colaborativa</h1>
                <p className="text-xs text-sand-500">{user?.displayName || user?.email}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    location.pathname === path
                      ? 'bg-ocean text-white'
                      : 'text-dark-100 hover:bg-sand-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all ml-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-sand-200 transition-all"
              variants={iconButtonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-dark" />
              ) : (
                <Menu className="w-6 h-6 text-dark" />
              )}
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav 
                className="md:hidden py-4 border-t border-sand-300"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {navItems.map(({ path, icon: Icon, label }, index) => (
                  <motion.div
                    key={path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to={path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${
                        location.pathname === path
                          ? 'bg-ocean text-white'
                          : 'text-dark-100 hover:bg-sand-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                    </Link>
                  </motion.div>
                ))}
                <motion.button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05, duration: 0.2 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </motion.button>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container-mobile py-6">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden bg-white border-t border-sand-300 sticky bottom-0 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                location.pathname === path
                  ? 'text-ocean'
                  : 'text-sand-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
