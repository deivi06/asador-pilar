import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './state/AppContext';
import { AdminAuthProvider } from './state/AdminAuthContext';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import RequireAdminAuth from './components/admin/RequireAdminAuth';

import HomePage from './pages/client/HomePage';
import MenuPage from './pages/client/MenuPage';
import ProductDetailPage from './pages/client/ProductDetailPage';
import CartPage from './pages/client/CartPage';
import CheckoutPage from './pages/client/CheckoutPage';
import ConfirmationPage from './pages/client/ConfirmationPage';
import SchedulePage from './pages/client/SchedulePage';
import ContactPage from './pages/client/ContactPage';
import MyOrderPage from './pages/client/MyOrderPage';
import LegalNoticePage from './pages/client/LegalNoticePage';
import PrivacyPolicyPage from './pages/client/PrivacyPolicyPage';
import CookiesPolicyPage from './pages/client/CookiesPolicyPage';

import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import OrdersPage from './pages/admin/OrdersPage';
import NewOrderPage from './pages/admin/NewOrderPage';
import ProductsPage from './pages/admin/ProductsPage';
import StockPage from './pages/admin/StockPage';
import StockHistoryPage from './pages/admin/StockHistoryPage';
import SchedulesPage from './pages/admin/SchedulesPage';
import SalesPage from './pages/admin/SalesPage';
import SettingsPage from './pages/admin/SettingsPage';
import MessagesPage from './pages/admin/MessagesPage';

export default function App() {
  return (
    <AppProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ClientLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/carta" element={<MenuPage />} />
              <Route path="/carta/:productId" element={<ProductDetailPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/pedido" element={<CheckoutPage />} />
              <Route path="/confirmacion" element={<ConfirmationPage />} />
              <Route path="/horario" element={<SchedulePage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/mi-pedido" element={<MyOrderPage />} />
              <Route path="/aviso-legal" element={<LegalNoticePage />} />
              <Route path="/politica-de-privacidad" element={<PrivacyPolicyPage />} />
              <Route path="/politica-de-cookies" element={<CookiesPolicyPage />} />
            </Route>

            <Route path="/admin/login" element={<LoginPage />} />

            <Route path="/admin" element={<RequireAdminAuth />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="pedidos" element={<OrdersPage />} />
                <Route path="pedidos/nuevo" element={<NewOrderPage />} />
                <Route path="productos" element={<ProductsPage />} />
                <Route path="stock" element={<StockPage />} />
                <Route path="stock/historial" element={<StockHistoryPage />} />
                <Route path="horarios" element={<SchedulesPage />} />
                <Route path="ventas" element={<SalesPage />} />
                <Route path="mensajes" element={<MessagesPage />} />
                <Route path="configuracion" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </AppProvider>
  );
}
