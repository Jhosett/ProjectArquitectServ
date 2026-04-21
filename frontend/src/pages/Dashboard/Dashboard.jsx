import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePencilAlt, HiOutlinePlusSm, HiOutlineHeart, HiLogout } from 'react-icons/hi';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaBolt } from 'react-icons/fa6';
import { logoutUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { currentUser, userData, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return null;

    // Se asume providerId para lógica futura, pero aquí mostramos la vista general.
    const providerId = currentUser?.providerData[0]?.providerId || 'password';

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Saludo y bienvenida */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido, {userData?.nombre || 'Usuario'}!</h1>
                        <p className="text-gray-500">Aquí puedes ver y gestionar tu información personal</p>
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
                                <p className="font-medium text-gray-800">{userData?.nombre || 'No definido'}</p>
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
                                <p className="font-medium text-gray-800">{currentUser?.email}</p>
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
                                <p className="font-medium text-gray-800 capitalize">{providerId === 'password' ? 'Correo' : 'Proveedor Externo'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Estado de la Cuenta:</p>
                                <p className="font-medium text-green-600 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Activa
                                </p>
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
                </div>

            </div>
        </div>
    );
}
