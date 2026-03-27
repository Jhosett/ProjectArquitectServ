import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ForgotPage from './pages/Authentication/ForgotPage'

//Páginas
import Home from './pages/Home'
import Login from './pages/Authentication/Login'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/forgot-password' element={<ForgotPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
