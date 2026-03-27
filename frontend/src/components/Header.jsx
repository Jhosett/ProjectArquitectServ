import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { IoStorefront, IoBookmarksSharp } from "react-icons/io5";
import { TbCategoryFilled } from "react-icons/tb";
import { FaFire } from "react-icons/fa6";

import logoAnt from '../assets/Ant.svg'

export default function Header() {

    const navigate = useNavigate();
    const location = useLocation();

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

    return (
        <div>
            <header className='w-full bg-white shadow-md p-3 sticky top-0 z-50'>
                <div className='max-w-7xl mx-auto px-4 py-3 flex justify-between items-center'>
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
                        ))
                        }
                    </nav>

                    {/* Loggeo y Registro */}
                    <div className='flex items-center gap-4'>
                        <NavLink to='/login' className='text-gray-600 hover:text-indigo-600 font-medium transition-colors'>
                            Iniciar Sesión
                        </NavLink>
                        <NavLink to='/register' className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'>
                            Registrarse
                        </NavLink>
                    </div>
                </div>
            </header>
        </div>
    )
}
