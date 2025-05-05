import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import AuthPage from "./pages/AuthPage"
import AddToCartPage from "./pages/AddToCartPage"
import CheckoutPage from "./pages/CheckoutPage"
import ProductAdminPage from "./pages/admin/ProductAdminPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import { UserManagementPage } from "./pages/UserManagement"
import ProductPage from './pages/ProductPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/product" element={<ProductAdminPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account" element={<UserManagementPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage/>} />
          <Route path="/products/:id" element={<ProductPage/>} />
          <Route path="/cart" element={<AddToCartPage />} />
          <Route path="/checkout" element={<CheckoutPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App