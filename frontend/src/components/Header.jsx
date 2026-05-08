import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { IoStorefront, IoBookmarksSharp } from "react-icons/io5";
import { TbCategoryFilled } from "react-icons/tb";
import { FaFire } from "react-icons/fa6";
import { HiUserCircle } from "react-icons/hi";

import logoAnt from '../assets/Ant.svg';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';

export default function Header() {

    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, userData, loading } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navLinks = [
        { name: 'Tienda', path: '/tienda', icon: <IoStorefront /> },
        { name: 'Categorías', path: '/categorias', icon: <TbCategoryFilled /> },
        { name: 'Marcas', path: '/marcas', icon: <IoBookmarksSharp /> },
        { name: 'Ofertas', path: '/ofertas', icon: <FaFire /> },
    ];

    // Función para manejar el clic en el logo
    const handleLogoClick = () => {
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/');
            setDropdownOpen(false);
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    return (
        <div>
            <header className='w-full bg-white shadow-md p-3 sticky top-0 z-50'>
                <div className='max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative'>
                    {/* Logo y el nombre de la empresa */}
                    <div className='flex items-center gap-2 cursor-pointer' onClick={handleLogoClick}>
                        <img src={logoAnt} alt="Logo" className='w-8 h-8' />
                        <span className='text-xl font-bold text-gray-800'>BugSolutions</span>
                    </div>

                    {/* Barra de navegación */}
                    <nav className='flex items-center gap-6'>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name} to={link.path}
                                className='flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors group'
                            >
                                <nav className='text-xl group-hover:scale-110 transition-transform'>
                                    {link.icon}
                                </nav>
                                <nav>{link.name}</nav>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Loggeo y Registro / Usuario Logueado */}
                    <div className='flex items-center gap-4'>
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : currentUser ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full hover:shadow-sm transition-shadow focus:outline-none"
                                >
                                    <HiUserCircle className="text-2xl text-indigo-600" />
                                    <div className="flex flex-col items-start leading-tight">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {userData?.nombre || currentUser?.displayName || 'Usuario'}
                                        </span>
                                        <span className="text-xs text-gray-500">{currentUser.email}</span>
                                    </div>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                                        <NavLink 
                                            to="/dashboard" 
                                            onClick={() => setDropdownOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                        >
                                            Mi Dashboard
                                        </NavLink>

                                        {/* Solo visible si el usuario tiene isAdmin: true en Firestore */}
                                        {userData?.isAdmin && (
                                            <NavLink
                                                to="/admin"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2 text-sm text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
                                            >
                                                Panel de Admin
                                            </NavLink>
                                        )}

                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <NavLink to='/login' className='text-gray-600 hover:text-indigo-600 font-medium transition-colors'>
                                    Iniciar Sesión
                                </NavLink>
                                <NavLink to='/register' className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'>
                                    Registrarse
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </div>
    );

}
