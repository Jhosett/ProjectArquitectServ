import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Páginas
import Home from './pages/Home'
import Login from './pages/Authentication/Login'
import ForgotPage from './pages/Authentication/ForgotPage'
import ResetPage from './pages/Authentication/ResetPage'
import Register from './pages/Authentication/Register'

// Nuevas Páginas y Componentes
import Dashboard from './pages/Dashboard/Dashboard'
import EditProfile from './pages/Dashboard/EditProfile'
import ProtectedRoute from './components/ProtectedRoute'
import CompleteGoogleProfile from './pages/Authentication/CompleteGoogleProfile'
import AdminPanel from './pages/AdminPanel'
import Tienda from './pages/Tienda'
import AddProducts from './pages/Dashboard/AddProducts'
import AdminRoute from './components/AdminRoute'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/tienda' element={<Tienda />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/forgot-password' element={<ForgotPage />} />
        <Route path='/reset-password' element={<ResetPage />} />
        <Route path='/register' element={<Register />} />

        <Route path="/complete-google-profile" element={ <ProtectedRoute><CompleteGoogleProfile /></ProtectedRoute>} /> {/* completar perfil de google si faltan datos obligatorios */}

        {/* Rutas Privadas */}
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/dashboard/edit' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path='/dashboard/products' element={<ProtectedRoute><AddProducts /></ProtectedRoute>} />
        <Route path='/admin' element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
