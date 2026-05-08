import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import setup1 from "../../assets/fondos/setup1.jpg";
import { HiUser, HiLockClosed, HiEye, HiEyeOff, HiArrowLeft } from "react-icons/hi";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// Función de login definida en authService.js.
// Internamente llama a Firebase Auth para verificar las credenciales del usuario.
import {
  loginUser, loginWithGoogle, hasMissingGoogleProfileData, loginWithGithub,
  hasMissingGithubProfileData
} from "../../services/authService";
import { auth } from "../../FireBase/firebaseConfig";
import { fetchSignInMethodsForEmail, linkWithCredential, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();

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

      // CONEXIÓN CON FIREBASE
      // loginUser llama a signInWithEmailAndPassword en Firebase Auth.
      // Firebase verifica las credenciales y retorna el usuario autenticado con su UID y token.
      // Si las credenciales son incorrectas, lanza un error con un código específico.
      await loginUser(loginData.email, loginData.pwd);

      // Alerta de éxito tras la autenticación exitosa en Firebase
      await Swal.fire({
        icon: 'success',
        title: '¡Sesión iniciada!',
        text: 'Bienvenido de nuevo.',
        confirmButtonColor: '#7c3aed',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");

    } catch (error) {
      // 'auth/invalid-credential' es el código que Firebase retorna
      // cuando el correo no existe o la contraseña es incorrecta.
      if (error.code === 'auth/invalid-credential') {
        setErrorMessage("Correo o contraseña incorrectos.");
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'El correo o la contraseña son incorrectos.',
          confirmButtonColor: '#7c3aed',
        });
      } else {
        setErrorMessage("Error al iniciar sesión. Intenta de nuevo.");
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'Ocurrió un problema. Por favor intenta de nuevo.',
          confirmButtonColor: '#7c3aed',
        });
      }

    } finally {

      setIsLoading(false);

    }

  };

  // Función para manejar el error cuando el correo ya existe con otro método
  const handleExistingAccount = async (error) => {
    try {
      const email = error.customData?.email || error.email; 
      
      let methods = [];
      try {
        methods = await fetchSignInMethodsForEmail(auth, email);
      } catch (e) {
        console.warn("fetchSignInMethodsForEmail falló:", e);
      }
      
      let methodToUse = methods[0];
      let providerName = "otro método";

      if (methodToUse === "password") providerName = "Correo y Contraseña";
      else if (methodToUse === "google.com") providerName = "Google";
      else if (methodToUse === "github.com") providerName = "GitHub";
      else if (methodToUse === "facebook.com") providerName = "Facebook";

      if (methodToUse) {
        Swal.fire({
          icon: "info",
          title: "Cuenta ya registrada",
          text: `El correo ${email} ya está registrado con ${providerName}. Por favor, haz clic en el botón de ${providerName} para iniciar sesión.`,
          confirmButtonColor: "#7c3aed",
          confirmButtonText: "Entendido"
        });
      } else {
         Swal.fire({
          icon: "info",
          title: "Cuenta ya registrada",
          text: `Ese correo ya está asociado a otra cuenta. Por favor, inicia sesión con el método que usaste originalmente (Google, GitHub o Contraseña).`,
          confirmButtonColor: "#7c3aed",
          confirmButtonText: "Entendido"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Esta función maneja el inicio de sesión con Google desde el botón
  const handleGoogleLogin = async () => {
    try {
      // Activamos estado de carga para bloquear acciones repetidas
      setIsLoading(true);

      // Limpiamos cualquier error anterior
      setErrorMessage("");

      // Ejecutamos el login con Google y obtenemos el usuario autenticado
      const user = await loginWithGoogle();

      // Revisamos si le faltan datos obligatorios en Firestore
      const hasMissingData = await hasMissingGoogleProfileData(user.uid);

      // Si faltan datos, lo mandamos a completar perfil
      if (hasMissingData) {
        navigate("/complete-google-profile");
      } else {
        // Si ya está completo, entra normalmente
        navigate("/");
      }
      // Mostramos alerta de éxito
      await Swal.fire({
        icon: "success",
        title: "¡Sesión iniciada con Google!",
        text: "Bienvenido.",
        confirmButtonColor: "#7c3aed",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error(error);

      if (error.code === "auth/account-exists-with-different-credential") {
        await handleAccountLinking(error, 'google');
      } else if (error.code === "auth/popup-closed-by-user") {
        setErrorMessage("Se cerró la ventana de Google antes de completar el inicio de sesión.");
      } else {
        setErrorMessage("No se pudo iniciar sesión con Google.");
        Swal.fire({
          icon: "error",
          title: "Error con Google",
          text: "No fue posible iniciar sesión con Google.",
          confirmButtonColor: "#7c3aed",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Esta función maneja el inicio de sesión con GitHub
  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const user = await loginWithGithub();
      const hasMissingData = await hasMissingGithubProfileData(user.uid);

      await Swal.fire({
        icon: "success",
        title: "¡Sesión iniciada con GitHub!",
        text: "Bienvenido.",
        confirmButtonColor: "#7c3aed",
        timer: 1500,
        showConfirmButton: false,
      });

      if (hasMissingData) {
        navigate("/complete-google-profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      if (error.code === "auth/account-exists-with-different-credential") {
        await handleAccountLinking(error, 'github');
      } else if (error.code === "auth/popup-closed-by-user") {
        setErrorMessage("Se cerró la ventana de GitHub antes de completar el inicio de sesión.");
      } else {
        setErrorMessage("No se pudo iniciar sesión con GitHub.");
        Swal.fire({
          icon: "error",
          title: "Error con GitHub",
          text: "No fue posible iniciar sesión con GitHub.",
          confirmButtonColor: "#7c3aed",
        });
      }
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
                <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:-translate-y-1 transition shadow-xl">
                  <FcGoogle />

                </button>
                <button type="button" onClick={handleGithubLogin} disabled={isLoading} className="w-11 h-11 rounded-full bg-gray-800 text-white flex items-center justify-center hover:-translate-y-1 transition shadow-xl">
                  <FaGithub />
                </button>
                <button type="button" className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center hover:-translate-y-1 transition shadow-xl">
                  <FaFacebookF />
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>

    </div>

  );


}