import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PawPrint, Lock, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminUser: User | null;
  isAdminVerified: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  adminUser,
  isAdminVerified,
  onLogout,
  onLoginClick,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-2 cursor-pointer group"
            id="nav-logo"
          >
            <div className="bg-amber-600 text-white p-2 rounded-xl group-hover:bg-amber-500 transition-colors duration-300">
              <PawPrint className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-stone-900">
              Paws &amp; Claws <span className="text-amber-600">Shop</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleTabChange(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-amber-800' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 bg-amber-50 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Auth Button / Admin Status */}
          <div className="hidden md:flex items-center gap-3">
            {adminUser ? (
              <div className="flex items-center gap-3 bg-stone-100 pl-3 pr-2 py-1.5 rounded-xl border border-stone-200">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-stone-800 flex items-center gap-1">
                    {isAdminVerified ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Shop Admin
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                        Unverified
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-stone-500 max-w-[120px] truncate">
                    {adminUser.email}
                  </span>
                </div>
                
                {/* Admin Panel Nav Button */}
                <button
                  id="nav-btn-admin-panel"
                  onClick={() => handleTabChange('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'admin' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
                  }`}
                >
                  Dashboard
                </button>

                <button
                  id="nav-btn-logout"
                  onClick={onLogout}
                  className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-btn-admin-login"
                onClick={() => handleTabChange('admin')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-100 text-amber-800'
                    : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                Admin Portal
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {adminUser && activeTab !== 'admin' && (
              <button
                onClick={() => handleTabChange('admin')}
                className="p-1 px-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold"
              >
                Dashboard
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-stone-200 bg-white"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-mobile-${item.id}`}
                  onClick={() => handleTabChange(item.id)}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-amber-50 text-amber-800'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-stone-200 my-2 pt-2">
                {adminUser ? (
                  <div className="px-3 py-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-stone-500 truncate">{adminUser.email}</span>
                    </div>
                    <button
                      id="nav-mobile-admin"
                      onClick={() => handleTabChange('admin')}
                      className="w-full text-center py-2 bg-amber-600 text-white rounded-lg font-semibold text-sm"
                    >
                      Admin Dashboard
                    </button>
                    <button
                      id="nav-mobile-logout"
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full border border-red-200 text-red-600 hover:bg-red-50 text-center py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    id="nav-mobile-login"
                    onClick={() => handleTabChange('admin')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-base font-medium text-stone-700 bg-stone-50 border border-stone-200"
                  >
                    <Lock className="h-4 w-4" />
                    Admin Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
