import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


//Páginas
import Home from './pages/Home'
import Login from './pages/Authentication/Login'
import ForgotPage from './pages/Authentication/Forgotpage'
import ResetPage from './pages/Authentication/ResetPage'
import Register from './pages/Authentication/Register'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/forgot-password' element={<ForgotPage />} />
        <Route path='/reset-password' element={<ResetPage />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
