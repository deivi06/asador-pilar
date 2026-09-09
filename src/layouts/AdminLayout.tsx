import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import MobileNav from '../components/admin/MobileNav';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50 font-sans">
      <Sidebar />
      <div className="flex-1">
        <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
