import { useState } from "react";
import { Link } from "react-router-dom";
import setup1 from "../../assets/fondos/setup1.jpg";
import { HiMail, HiArrowLeft, HiCheckCircle } from "react-icons/hi";

export default function ForgotPage() {
    const [email, setEmail] = useState("");
    const [touched, setTouched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    // Validación
    const emailError = !email
        ? "El correo es obligatorio"
        : !/\S+@\S+\.\S+/.test(email)
            ? "Correo inválido"
            : "";

    const isFormValid = email && !emailError;

    const handleBlur = () => setTouched(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(true);
        if (!isFormValid) return;

        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1800));
        setIsLoading(false);

        setModalData({ email });
        setShowModal(true);
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* IMAGEN LATERAL */}
            <div
                className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${setup1})` }}
            >
                <div className="absolute inset-0 bg-purple-900/40 flex flex-col items-center justify-center px-10 text-white">
                    <h2 className="text-4xl font-extrabold mb-3 drop-shadow-lg text-center">¿Olvidaste tu contraseña?</h2>
                    <p className="text-white/80 text-center text-lg max-w-xs">
                        No te preocupes, te enviamos un enlace para recuperarla en segundos.
                    </p>
                </div>
            </div>

            {/* FORMULARIO */}
            <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 px-6 py-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">

                    {/* Botón volver */}
                    <Link
                        to="/login"
                        className="flex items-center gap-1 text-purple-600 text-sm hover:underline mb-6"
                    >
                        <HiArrowLeft /> Volver al inicio de sesión
                    </Link>

                    <h1 className="text-3xl font-bold text-purple-700 mb-2 text-center">Recuperar Cuenta</h1>
                    <p className="text-gray-400 text-sm text-center mb-8">
                        Ingresa tu correo y te enviaremos el enlace de recuperación.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="tucorreo@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={handleBlur}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                                />
                            </div>
                            {touched && emailError && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>
                            )}
                        </div>

                        {/* BOTÓN */}
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${!isFormValid || isLoading
                                    ? "bg-purple-300 cursor-not-allowed"
                                    : "bg-purple-700 hover:bg-purple-800 hover:shadow-md"
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                "Enviar enlace de recuperación"
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            ¿Recordaste tu contraseña?{" "}
                            <Link to="/login" className="text-purple-700 font-semibold hover:underline">
                                Inicia sesión
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
                        <HiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Correo enviado!</h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Se ha enviado el enlace de recuperación a:
                        </p>
                        <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-6">
                            <p className="text-purple-700 font-semibold text-sm break-all">{modalData.email}</p>
                        </div>
                        <Link
                            to="/reset-password"
                            className="block w-full py-3 rounded-xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition text-center"
                        >
                            Continuar
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}