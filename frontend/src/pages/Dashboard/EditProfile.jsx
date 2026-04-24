import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { updateUserProfileData } from "../../services/authService";
import { verifyBeforeUpdateEmail, updatePassword } from "firebase/auth";
import Swal from "sweetalert2";

export default function EditProfile() {
    const { currentUser, userData, setUserData } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        tipoDocumento: "Cédula de Ciudadanía",
        numeroDocumento: "",
        telefono: "",
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const providerId = currentUser?.providerData[0]?.providerId || 'password';
    const isExternalAuth = providerId !== 'password';

    useEffect(() => {
        if (userData && currentUser) {
            setFormData({
                nombre: userData.nombre || "",
                tipoDocumento: userData.tipoDocumento || "Cédula de Ciudadanía",
                numeroDocumento: userData.numeroDocumento || "",
                telefono: userData.telefono || "",
                email: currentUser.email || "",
                password: "", // Siempre vacío por seguridad
            });
        }
    }, [userData, currentUser]);

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "telefono") value = value.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Actualizar datos en Firestore
            const profileUpdates = {
                nombre: formData.nombre,
                tipoDocumento: formData.tipoDocumento,
                numeroDocumento: formData.numeroDocumento,
                telefono: formData.telefono,
            };
            await updateUserProfileData(currentUser.uid, profileUpdates);
            
            // Actualizar estado global
            setUserData(prev => ({ ...prev, ...profileUpdates }));

            // 2. Lógicas de Auth (Solo si es proveedor de Password)
            if (!isExternalAuth) {
                // Actualizar Email con Verificación
                if (formData.email !== currentUser.email) {
                    await verifyBeforeUpdateEmail(currentUser, formData.email);
                    Swal.fire('Revisa tu bandeja', 'Se ha enviado un correo de verificación a la nueva dirección. El cambio se aplicará al confirmar.', 'info');
                }

                // Actualizar Contraseña
                if (formData.password.trim() !== "") {
                    await updatePassword(currentUser, formData.password);
                    Swal.fire('¡Éxito!', 'Contraseña actualizada correctamente.', 'success');
                }
            }

            if(formData.email === currentUser.email && formData.password.trim() === ""){
               Swal.fire('¡Éxito!', 'Información actualizada correctamente.', 'success');
            }

            navigate('/dashboard');

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Hubo un problema actualizando la información. Revisa tu conexión o vuelve a iniciar sesión si cambiaste credenciales críticas.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-3xl mx-auto px-4 py-8">
                
                <div className="mb-6">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors">
                        <HiArrowLeft className="text-xl" />
                        <span>Volver al Dashboard</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Actualiza tu información</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Nombre</label>
                            <input 
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Tipo de Documento</label>
                            <select 
                                name="tipoDocumento"
                                value={formData.tipoDocumento}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                                <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                                <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Número de Documento</label>
                            <input 
                                type="text"
                                name="numeroDocumento"
                                value={formData.numeroDocumento}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Teléfono</label>
                            <input 
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
                                Email 
                                {isExternalAuth && (
                                    <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded font-medium">
                                        Vinculado con {providerId === 'google.com' ? 'Google' : providerId === 'github.com' ? 'GitHub' : 'Proveedor Externo'}
                                    </span>
                                )}
                            </label>
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isExternalAuth}
                                className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isExternalAuth ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                            />
                            {!isExternalAuth && (
                                <p className="text-xs text-gray-500 mt-1">Si cambias el correo, se te enviará un enlace de verificación.</p>
                            )}
                        </div>

                        {!isExternalAuth && (
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1 block">Contraseña</label>
                                <input 
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mantener vacío para dejar por defecto"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : "Actualizar"}
                        </button>
                        
                    </form>
                </div>

            </div>
        </div>
    );
}
