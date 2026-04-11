import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import setup2 from "../../assets/fondos/setup2.jpg";
import { HiUser, HiLockClosed, HiEye, HiEyeOff, HiCreditCard, HiHashtag, HiPhone, HiMail, HiArrowLeft } from "react-icons/hi";
import { registerUser } from "../../services/authService";
import Swal from "sweetalert2";

export default function Register() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("personales");

    const [formData, setFormData] = useState({
        nombre: "",
        tipoDocumento: "Cédula de Ciudadanía",
        numeroDocumento: "",
        telefono: "",
        email: "",
        password: "",
        confirmPassword: "",
        aceptaTerminos: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const validate = (data = formData) => {
        const newErrors = {};

        if (!data.nombre.trim()) newErrors.nombre = "Campo obligatorio";
        if (!data.numeroDocumento.trim()) newErrors.numeroDocumento = "Campo obligatorio";

        if (!data.telefono.trim()) {
            newErrors.telefono = "Campo obligatorio";
        } else if (!/^\d+$/.test(data.telefono)) {
            newErrors.telefono = "Solo números permitidos";
        } else if (data.telefono.length > 10) {
            newErrors.telefono = "Máximo 10 dígitos";
        }

        if (!data.email.trim()) {
            newErrors.email = "Campo obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "Correo inválido";
        }

        if (!data.password) {
            newErrors.password = "Campo obligatorio";
        } else if (data.password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }

        if (!data.confirmPassword) {
            newErrors.confirmPassword = "Confirmación necesaria";
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        return newErrors;
    };

    const handleBlur = (e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
        setErrors(validate());
    };

    const handleChange = (e) => {
        let { name, value, type, checked } = e.target;

        if (name === "telefono") {
            value = value.replace(/\D/g, '').slice(0, 10);
        }

        const newData = {
            ...formData,
            [name]: type === "checkbox" ? checked : value
        };

        setFormData(newData);
        if (touched[name]) {
            setErrors(validate(newData));
        }
    };

    const handleNext = () => {
        setTouched(prev => ({
            ...prev, nombre: true, numeroDocumento: true, telefono: true
        }));

        const currentErrors = validate(formData);
        if (!currentErrors.nombre && !currentErrors.numeroDocumento && !currentErrors.telefono) {
            setActiveTab("cuenta");
        }
    };

    const handleBack = () => setActiveTab("personales");
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const onSubmit = async (e) => {
        e.preventDefault();

        const allTouched = Object.keys(formData).reduce((acc, key) => { acc[key] = true; return acc; }, {});
        setTouched(allTouched);

        const currentErrors = validate(formData);
        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");

            // CONEXIÓN CON FIREBASE
            // registerUser(formData) ejecuta dos operaciones en Firebase:
            // 1. createUserWithEmailAndPassword → crea el usuario en Firebase Authentication
            //    con email y contraseña. Firebase genera un UID único para ese usuario.
            // 2. setDoc → guarda los datos del perfil (nombre, teléfono, etc.) en la
            //    colección "users" de Firestore, usando el UID como ID del documento.
            //    La contraseña NUNCA se almacena en Firestore, solo en Firebase Auth.
            await registerUser(formData);

            // Alerta de éxito tras el registro exitoso en Firebase
            await Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente.',
                confirmButtonColor: '#7c3aed',
                confirmButtonText: 'Ir al login',
            });

            navigate("/login");
        } catch (error) {
            // Firebase retorna códigos de error específicos.
            // 'auth/email-already-in-use' indica que el correo ya tiene una cuenta registrada.
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage("Este correo ya está registrado.");
                Swal.fire({
                    icon: 'error',
                    title: 'Correo ya registrado',
                    text: 'Este correo ya tiene una cuenta asociada.',
                    confirmButtonColor: '#7c3aed',
                });
            } else {
                setErrorMessage("Error al registrar. Intenta de nuevo.");
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    text: 'Ocurrió un problema. Por favor intenta de nuevo.',
                    confirmButtonColor: '#7c3aed',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid =
        formData.nombre &&
        formData.numeroDocumento &&
        formData.telefono &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.aceptaTerminos &&
        Object.keys(validate(formData)).length === 0;

    return (
        <div className="flex min-h-screen w-full">
            <div
                className="hidden md:flex md:w-1/2 bg-cover bg-center"
                style={{ backgroundImage: `url(${setup2})` }}
            ></div>

            <div className="flex flex-col w-full md:w-1/2 items-center justify-center bg-gray-50 px-6 py-12">

                {/* BOTÓN VOLVER AL INICIO */}
                <div className="w-full max-w-md mb-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-700 font-medium transition-colors">
                        <HiArrowLeft className="text-xl" />
                        <span>Volver al inicio</span>
                    </Link>
                </div>

                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">
                    <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Registro</h1>

                    {/* TABS */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab("personales")}
                            className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "personales"
                                ? "border-purple-600 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <HiUser className="text-lg" />
                            Datos Personales
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "cuenta"
                                ? "border-purple-600 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <HiLockClosed className="text-lg" />
                            Cuenta
                        </button>
                    </div>

                    <form onSubmit={onSubmit} className="flex flex-col gap-4">

                        {activeTab === "personales" && (
                            <>
                                <div>
                                    <div className="relative">
                                        <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre completo"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-purple-100/50 border-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                                        />
                                    </div>
                                    {errors.nombre && touched.nombre && <p className="text-red-500 text-xs mt-1 ml-1">{errors.nombre}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <HiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                        <select
                                            name="tipoDocumento"
                                            value={formData.tipoDocumento}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-purple-100/50 border-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm appearance-none"
                                        >
                                            <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                                            <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                                            <option value="Pasaporte">Pasaporte</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <HiHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                        <input
                                            type="text"
                                            name="numeroDocumento"
                                            placeholder="Número de documento"
                                            value={formData.numeroDocumento}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-purple-100/50 border-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                                        />
                                    </div>
                                    {errors.numeroDocumento && touched.numeroDocumento && <p className="text-red-500 text-xs mt-1 ml-1">{errors.numeroDocumento}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                        <input
                                            type="tel"
                                            name="telefono"
                                            placeholder="Teléfono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-purple-100/50 border-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                                        />
                                    </div>
                                    {errors.telefono && touched.telefono && <p className="text-red-500 text-xs mt-1 ml-1">{errors.telefono}</p>}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full py-3 mt-2 rounded-xl font-semibold text-white bg-purple-700 hover:bg-purple-800 transition-all text-sm"
                                >
                                    Siguiente &rarr;
                                </button>
                            </>
                        )}

                        {activeTab === "cuenta" && (
                            <>
                                <div>
                                    <div className="relative">
                                        <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Correo electrónico"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-purple-100/50 border-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                                        />
                                    </div>
                                    {errors.email && touched.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Contraseña"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full pl-11 pr-11 py-3 rounded-xl bg-purple-100/50 border-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                                        />
                                        {showPassword
                                            ? <HiEyeOff onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-purple-500 text-lg" />
                                            : <HiEye onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-purple-500 text-lg" />
                                        }
                                    </div>
                                    {errors.password && touched.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirmar contraseña"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full pl-11 pr-11 py-3 rounded-xl bg-purple-100/50 border-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                                        />
                                    </div>
                                    {errors.confirmPassword && touched.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                                </div>

                                <div>
                                    <div className="flex items-start gap-2 mt-2">
                                        <input
                                            type="checkbox"
                                            name="aceptaTerminos"
                                            id="aceptaTerminos"
                                            checked={formData.aceptaTerminos}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="mt-1 w-4 h-4 text-purple-600 rounded bg-purple-100 border-none focus:ring-0 cursor-pointer"
                                        />
                                        <label htmlFor="aceptaTerminos" className="text-xs text-gray-700 leading-tight">
                                            Acepto los <span className="text-purple-600 font-semibold cursor-pointer hover:underline">términos y condiciones</span> y la <span className="text-purple-600 font-semibold cursor-pointer hover:underline">política de privacidad</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-2">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="w-1/3 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all text-sm flex items-center justify-center"
                                    >
                                        &larr; Atrás
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!isFormValid || isLoading}
                                        className="w-2/3 py-3 rounded-xl font-semibold transition-all text-sm flex items-center justify-center text-white disabled:bg-gray-300 disabled:cursor-not-allowed enabled:bg-purple-700 enabled:hover:bg-purple-800"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : "Registrarse"}
                                    </button>
                                </div>

                                {errorMessage && (
                                    <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm text-center">
                                        {errorMessage}
                                    </div>
                                )}
                            </>
                        )}

                        <p className="text-center text-xs text-gray-600 mt-4">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login" className="text-purple-700 font-semibold hover:underline">Iniciar sesión</Link>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
}
