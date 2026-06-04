import React, { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./components/landingPage"
import RegisterPage from "./components/registerPage"
import LoginPage from "./components/LoginPage"
import ProfilePage from "./components/ProfilePage"
import PassChange from "./components/passChange"
import DashBoard from "./components/DashBoard"
import AddProduct from "./components/AddProduct"
import EditProduct from "./components/EditProduct"
import AllProducts from "./components/AllProducts"
import ViewProduct from "./components/ViewProduct"
import Messages from "./components/Messages"
import ContactPage from "./components/ContactPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthLayout from "./components/AuthLayout"

function App() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <ProfilePage />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/passchange"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <PassChange />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <DashBoard />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/addproduct"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <AddProduct />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editproduct/:id"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <EditProduct />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/allproducts"
          element={
            <ProtectedRoute>
              <AuthLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
                <AllProducts searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <ViewProduct />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <Messages />
              </AuthLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  )
}

export default App