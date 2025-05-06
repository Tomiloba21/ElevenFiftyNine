import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import AuthPage from "./pages/AuthPage"
import CheckoutPage from "./pages/CheckoutPage"
import ProductAdminPage from "./pages/admin/ProductAdminPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import { UserManagementPage } from "./pages/UserManagement"
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import { CartProvider } from './context/CartContext'
import { Nav } from './components/Nav'
import CustomerOrderTracking from './pages/CustomOrderTracking'
import { OrderProvider } from './context/OrderContext'
import AdminOrderPage from './pages/admin/AdminOrderPage'
import AdminOrderStats from './pages/admin/AdminOrderStat'



function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <BrowserRouter>
          <Nav /> {/* Move Nav inside BrowserRouter but outside Routes */}
          <Routes>
            <Route path="/admin/product" element={<ProductAdminPage />} />
            <Route path='/admin/orders' element={<AdminOrderPage />} />
            <Route path='/orders/:id' element={<AdminOrderStats orders={[]} />} />
            <Route path="/orders" element={<CustomerOrderTracking />} />
            <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/account" element={<UserManagementPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/products" element={<ProductsPage/>} />
            <Route path="/products/:id" element={<ProductPage/>} />
            <Route path="/checkout" element={<CheckoutPage/>} />
          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </CartProvider>
  );
}
export default App;