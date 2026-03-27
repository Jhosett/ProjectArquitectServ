import { useState } from "react";
import { Link } from "react-router-dom";
import setup1 from "../../assets/fondos/setup1.jpg";
import { HiUser, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Login() {

  const [loginData, setLoginData] = useState({
    email: "",
    pwd: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    <div className="flex min-h-screen w-full">

      {/* IMAGEN */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${setup1})` }}
      ></div>

      {/* FORMULARIO */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 px-6 py-12">
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
                  : <HiEye    onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-purple-500 text-lg" />
                }
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right -mt-2">
              <a href="#" className="text-purple-600 text-xs hover:underline">¿Olvidaste tu contraseña?</a>
            </div>

            {/* BOTÓN LOGIN */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                !isFormValid || isLoading
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