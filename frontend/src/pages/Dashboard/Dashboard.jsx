import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePencilAlt, HiOutlineHeart, HiLogout, HiX } from 'react-icons/hi';
import { MdOutlineInventory2 } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaBolt } from 'react-icons/fa6';
import { FaGoogle, FaGithub, FaFacebookF } from 'react-icons/fa';
import { logoutUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { linkWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import Swal from 'sweetalert2';

export default function Dashboard() {
    const { currentUser, userData, loading } = useAuth();
    const navigate = useNavigate();
    const [photoModal, setPhotoModal] = useState(false);
    const photoSrc = userData?.photoURL || currentUser?.photoURL || null;

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleLinkAccount = async (providerName) => {
        try {
            let provider;
            let providerDisplayName = '';
            if (providerName === 'google.com') {
                provider = new GoogleAuthProvider();
                providerDisplayName = 'Google';
            } else if (providerName === 'github.com') {
                provider = new GithubAuthProvider();
                providerDisplayName = 'GitHub';
            } else if (providerName === 'facebook.com') {
                provider = new FacebookAuthProvider();
                providerDisplayName = 'Facebook';
            }
            
            await linkWithPopup(currentUser, provider);
            
            await Swal.fire({
                icon: 'success',
                title: '¡Cuenta vinculada!',
                text: `Se ha vinculado tu cuenta de ${providerDisplayName} exitosamente.`,
                confirmButtonColor: '#7c3aed'
            });
            // Recargamos para que currentUser re-evalúe su providerData e imprima los nuevos badges
            window.location.reload();
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/credential-already-in-use') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de vinculación',
                    text: 'Esta cuenta ya está vinculada a otro usuario diferente.',
                    confirmButtonColor: '#7c3aed'
                });
            } else if (error.code === 'auth/popup-closed-by-user') {
                // El usuario cerró la ventana, no hacemos nada
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo vincular la cuenta. Intenta de nuevo.',
                    confirmButtonColor: '#7c3aed'
                });
            }
        }
    };

    if (loading) return null;

    // Obtenemos todos los proveedores vinculados (sin repetir)
    const linkedProviders = currentUser?.providerData?.map(p => p.providerId) || ['password'];
    const uniqueProviders = [...new Set(linkedProviders)];

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Modal foto ampliada */}
                {photoModal && photoSrc && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setPhotoModal(false)}
                    >
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={photoSrc}
                                alt="Foto de perfil ampliada"
                                className="max-w-xs sm:max-w-sm md:max-w-md rounded-2xl shadow-2xl border-4 border-white"
                            />
                            <button
                                onClick={() => setPhotoModal(false)}
                                className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition"
                            >
                                <HiX className="text-gray-700 text-lg" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Saludo y bienvenida */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="flex items-center gap-6">
                        {/* Foto de perfil con opción de ampliar */}
                        <div className="relative group shrink-0">
                            {photoSrc ? (
                                <img
                                    src={photoSrc}
                                    alt="Foto de perfil"
                                    className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-50">
                                    <span className="text-3xl font-bold text-indigo-400">
                                        {(userData?.nombre || currentUser?.displayName || 'U')[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                            {/* Overlay de ampliar — solo si hay foto */}
                            {photoSrc && (
                                <button
                                    onClick={() => setPhotoModal(true)}
                                    className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <span className="text-white text-xs font-semibold">Ver</span>
                                </button>
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido, {userData?.nombre || currentUser?.displayName || 'Usuario'}!</h1>
                            <p className="text-gray-500">Aquí puedes ver y gestionar tu información personal</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                        <HiLogout className="text-xl" /> Cerrar Sesión
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <HiOutlineIdentification className="text-2xl text-gray-700" />
                    <h2 className="text-xl font-bold text-gray-800">Información Personal</h2>
                </div>

                {/* Tarjetas de Información */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    {/* Datos Básicos */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-gray-600 font-semibold mb-6 border-b border-gray-100 pb-3">
                            <HiOutlineIdentification className="text-lg" />
                            <h3>Datos Básicos</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Nombre Completo:</p>
                                <p className="font-medium text-gray-800">{userData?.nombre || currentUser?.displayName || 'No definido'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tipo de Documento:</p>
                                <p className="font-medium text-gray-800">{userData?.tipoDocumento || 'No definido'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Número de Documento:</p>
                                <p className="font-medium text-gray-800">{userData?.numeroDocumento || 'No definido'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información de Contacto */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-gray-600 font-semibold mb-6 border-b border-gray-100 pb-3">
                            <HiOutlineMail className="text-lg" />
                            <h3>Información de Contacto</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Correo Electrónico:</p>
                                <p className={`font-medium ${currentUser?.email ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                    {currentUser?.email || 'No proporcionado'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Teléfono:</p>
                                <p className="font-medium text-gray-800">{userData?.telefono || 'No definido'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información de la Cuenta */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-gray-600 font-semibold mb-6 border-b border-gray-100 pb-3">
                            <IoSettingsOutline className="text-lg" />
                            <h3>Información de la Cuenta</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">ID de Usuario:</p>
                                <p className="font-medium text-gray-800 text-xs truncate" title={currentUser?.uid}>#{currentUser?.uid}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Vinculado con:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {uniqueProviders.map((prov) => {
                                        let name = 'Desconocido';
                                        let bgColor = 'bg-gray-100 text-gray-700';
                                        
                                        if (prov === 'password') { 
                                            name = 'Correo'; 
                                            bgColor = 'bg-purple-100 text-purple-700 border border-purple-200'; 
                                        } else if (prov === 'google.com') { 
                                            name = 'Google'; 
                                            bgColor = 'bg-red-50 text-red-600 border border-red-200'; 
                                        } else if (prov === 'github.com') { 
                                            name = 'GitHub'; 
                                            bgColor = 'bg-gray-800 text-white border border-gray-900'; 
                                        } else if (prov === 'facebook.com') { 
                                            name = 'Facebook'; 
                                            bgColor = 'bg-blue-50 text-blue-600 border border-blue-200'; 
                                        }
                                        
                                        return (
                                            <span key={prov} className={`px-2 py-1 rounded-md text-xs font-semibold shadow-sm ${bgColor}`}>
                                                {name}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Estado de la Cuenta:</p>
                                <p className="font-medium text-green-600 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Activa
                                </p>
                            </div>
                        </div>

                        {/* Controles para Vincular Cuentas */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500 mb-3">Vincular nuevos métodos:</p>
                            <div className="flex flex-wrap gap-2">
                                {!uniqueProviders.includes('google.com') && (
                                    <button onClick={() => handleLinkAccount('google.com')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition shadow-sm hover:shadow">
                                        <FaGoogle /> Google
                                    </button>
                                )}
                                {!uniqueProviders.includes('github.com') && (
                                    <button onClick={() => handleLinkAccount('github.com')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-50 text-gray-800 border border-gray-300 hover:bg-gray-100 transition shadow-sm hover:shadow">
                                        <FaGithub /> GitHub
                                    </button>
                                )}
                                {!uniqueProviders.includes('facebook.com') && (
                                    <button onClick={() => handleLinkAccount('facebook.com')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition shadow-sm hover:shadow">
                                        <FaFacebookF /> Facebook
                                    </button>
                                )}
                                {uniqueProviders.includes('google.com') && uniqueProviders.includes('github.com') && uniqueProviders.includes('facebook.com') && (
                                    <p className="text-xs text-green-600 italic">¡Todas las cuentas conectadas!</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Acciones Rápidas */}
                <div className="flex items-center gap-2 mb-6">
                    <FaBolt className="text-2xl text-gray-700" />
                    <h2 className="text-xl font-bold text-gray-800">Acciones Rápidas</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/dashboard/edit" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:shadow-md text-gray-600 hover:text-indigo-600 transition-all cursor-pointer">
                        <HiOutlinePencilAlt className="text-3xl text-emerald-500" />
                        <span className="font-medium">Editar Perfil</span>
                    </Link>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:shadow-md text-gray-600 hover:text-indigo-600 transition-all cursor-pointer">
                        <HiOutlineHeart className="text-3xl text-emerald-500" />
                        <span className="font-medium">Lista de Deseos</span>
                    </div>
                    {userData?.isAdmin && (
                        <Link to="/dashboard/products" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:shadow-md text-gray-600 hover:text-indigo-600 transition-all cursor-pointer">
                            <MdOutlineInventory2 className="text-3xl text-indigo-500" />
                            <span className="font-medium">Gestionar Productos</span>
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}
