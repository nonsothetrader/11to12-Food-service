import { useState } from 'react';
import AdminLayout, { AdminTab } from './admin/AdminLayout';
import JusticeHome from './admin/JusticeHome';
import OrderManagement from './admin/OrderManagement';
import UserManagement from './admin/UserManagement';
import MenuManagement from './admin/MenuManagement';

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

export default function AdminDashboard({ onNavigateHome }: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>(() => {
    const hash = window.location.hash.replace('#/admin/', '').replace('#admin/', '').replace('#/admin', '').replace('#admin', '');
    if (hash === 'orders') return 'orders';
    if (hash === 'users') return 'users';
    if (hash === 'menu') return 'menu';
    return 'home';
  });

  const handleSelectTab = (tab: AdminTab) => {
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '/admin' : `/admin/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={handleSelectTab}
      onExitAdmin={onNavigateHome}
    >
      {currentTab === 'home' && <JusticeHome onNavigateTab={handleSelectTab} />}
      {currentTab === 'orders' && <OrderManagement />}
      {currentTab === 'users' && <UserManagement />}
      {currentTab === 'menu' && <MenuManagement />}
    </AdminLayout>
  );
}
