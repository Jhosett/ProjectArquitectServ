import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import setup1 from "../../assets/fondos/setup1.jpg";
import { HiUser, HiLockClosed, HiEye, HiEyeOff, HiArrowLeft } from "react-icons/hi";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    pwd: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("demo_registered_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLoginData({
          email: parsed.email || "",
          pwd: parsed.pwd || ""
        });
      } catch (e) {}
    }
  }, []);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const validate = () => {

    const newErrors = {};

    if (!loginData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!loginData.pwd) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (loginData.pwd.length < 6) {
      newErrors.password = "La contraseña debe tener mínimo 6 caracteres";
    }

    return newErrors;
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value
    });

  };

  const handleBlur = (e) => {

    const { name } = e.target;

    setTouched({
      ...touched,
      [name]: true
    });

    setErrors(validate());

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e) => {

    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {

      setIsLoading(true);
      setErrorMessage("");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Login:", loginData);

      setShowSuccessAlert(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch {

      setErrorMessage("Error al iniciar sesión");

    } finally {

      setIsLoading(false);

    }

  };

  const isFormValid =
    loginData.email &&
    loginData.pwd &&
    Object.keys(validate()).length === 0;

  return (
    <div className="flex min-h-screen w-full relative">

      {/* ALERTA CUSTOM */}
      {showSuccessAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl transform scale-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¡Sesión iniciada!</h2>
            <p className="text-sm text-gray-500">Serás redirigido en un momento...</p>
          </div>
        </div>
      )}

      {/* IMAGEN */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${setup1})` }}
      ></div>

      {/* FORMULARIO */}
      <div className="flex flex-col w-full md:w-1/2 items-center justify-center bg-gray-50 px-6 py-12">

        {/* BOTÓN VOLVER AL INICIO */}
        <div className="w-full max-w-md mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-700 font-medium transition-colors">
            <HiArrowLeft className="text-xl" />
            <span>Volver al inicio</span>
          </Link>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">

          <h1 className="text-3xl font-bold text-purple-700 mb-2 text-center">Bienvenido</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Inicia sesión en tu cuenta</p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">

            {/* EMAIL */}
            <div>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={loginData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="pwd"
                  placeholder="Contraseña"
                  value={loginData.pwd}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                />
                {showPassword
                  ? <HiEyeOff onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-purple-500 text-lg" />
                  : <HiEye onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-purple-500 text-lg" />
                }
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right -mt-2">
              <Link to="/forgot-password" className="text-purple-600 text-xs hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
            {/* BOTÓN LOGIN */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${!isFormValid || isLoading
                  ? "bg-purple-300 cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-800 hover:shadow-md"
                }`}
            >
              {!isLoading ? "Iniciar Sesión" : (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>

            {/* ERROR LOGIN */}
            {errorMessage && (
              <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm text-center">
                {errorMessage}
              </div>
            )}

            {/* REGISTER */}
            <p className="text-center text-sm text-gray-500">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-purple-700 font-semibold hover:underline">Regístrate</Link>
            </p>

            {/* SOCIAL LOGIN */}
            <div className="mt-2">
              <div className="relative flex items-center justify-center mb-4">
                <div className="absolute left-0 right-0 h-px bg-gray-200"></div>
                <span className="relative bg-white px-3 text-gray-400 text-xs">O inicia sesión con</span>
              </div>
              <div className="flex justify-center gap-3">
                <button type="button" className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center hover:-translate-y-1 transition shadow-sm">
                  <FaGoogle />
                </button>
                <button type="button" className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center hover:-translate-y-1 transition shadow-sm">
                  <FaFacebookF />
                </button>
                <button type="button" className="w-11 h-11 rounded-full bg-sky-500 text-white flex items-center justify-center hover:-translate-y-1 transition shadow-sm">
                  <FaTwitter />
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}