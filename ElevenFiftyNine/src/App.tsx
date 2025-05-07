import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
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
import AuthRedirectHandler from './context/AuthRedirectHandler'
import ProtectedRoute from './context/ProtectedRoute'
import AuthService from './context/Authservice';


// Component to check if user is admin and redirect if needed


const AdminRestrictedRoute = ({ element } : any) => {
  const user = AuthService.getCurrentUser();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  
  // If admin, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/product" replace />;
  }
  
  // Not admin, allow access
  return element;
};

function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <BrowserRouter>
          <AuthRedirectHandler>
            <Nav />
            <Routes>
              {/* Public routes */}
              <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              
              {/* Product detail - restricted for admins */}
              <Route 
                path="/products/:id" 
                element={<AdminRestrictedRoute element={<ProductPage />} />} 
              />
              
              {/* Admin routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/admin/product" element={<ProductAdminPage />} />
                <Route path="/admin/orders" element={<AdminOrderPage />} />
                <Route path="/orders/:id" element={<AdminOrderStats orders={[]} />} />
              </Route>
              
              {/* Customer routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']} />}>
                <Route path="/orders" element={<CustomerOrderTracking />} />
                <Route path='/account' element={<UserManagementPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/cart" element={<CartPage />} />
              </Route>
            </Routes>
          </AuthRedirectHandler>
        </BrowserRouter>
      </OrderProvider>
    </CartProvider>
  );
}

export default App;