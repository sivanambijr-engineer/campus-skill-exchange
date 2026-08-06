import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { SwapRequestModal } from './components/SwapRequestModal';
import { AddSkillModal } from './components/AddSkillModal';
import { ReviewModal } from './components/ReviewModal';

import { Marketplace } from './pages/Marketplace';
import { AIMatches } from './pages/AIMatches';
import { Dashboard } from './pages/Dashboard';
import { ChatHub } from './pages/ChatHub';
import { Profile } from './pages/Profile';

export function App() {
  const { activeTab } = useApp();

  const renderTab = () => {
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace />;
      case 'aimatches':
        return <AIMatches />;
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatHub />;
      case 'profile':
        return <Profile />;
      default:
        return <Marketplace />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-900 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Top Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTab()}
      </main>

      {/* Modals & Overlays */}
      <SwapRequestModal />
      <AddSkillModal />
      <ReviewModal />

      {/* Global Notifications Toast */}
      <Toast />

      {/* Global Footer */}
      <Footer />

    </div>
  );
}

export default App;
