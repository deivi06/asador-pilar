import { Outlet, useLocation } from 'react-router-dom';
import TopBar from '../components/client/TopBar';
import ClientNav from '../components/client/ClientNav';
import Footer from '../components/client/Footer';
import CartFab from '../components/client/CartFab';
import WhatsAppFab from '../components/client/WhatsAppFab';

export default function ClientLayout() {
  const location = useLocation();
  const isConfirmation = location.pathname.startsWith('/confirmacion');

  return (
    <div className="flex min-h-screen flex-col bg-papel">
      {!isConfirmation && <TopBar />}
      {!isConfirmation && <ClientNav />}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {!isConfirmation && <CartFab />}
      {!isConfirmation && <WhatsAppFab />}
    </div>
  );
}
