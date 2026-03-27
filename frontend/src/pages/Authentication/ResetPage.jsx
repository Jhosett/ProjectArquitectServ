import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import setup1 from "../../assets/fondos/setup1.jpg";
import { HiLockClosed, HiEye, HiEyeOff, HiArrowLeft, HiCheckCircle, HiShieldCheck } from "react-icons/hi";

export default function ResetPage() {
  const [searchParams] = useSearchParams();
  // En un proyecto real obtendrías el token de la URL: searchParams.get("token")
  const token = searchParams.get("token") || "demo-token-123";

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Validaciones
  const validate = () => {
    const errors = {};
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      errors.password = "Mínimo 6 caracteres";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }
    return errors;
  };

  const errors = validate();
  const isFormValid =
    formData.password &&
    formData.confirmPassword &&
    Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!isFormValid) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsLoading(false);
    setShowModal(true);
  };

  // Indicador de fortaleza de contraseña
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    if (pwd.length < 6) return { level: 1, label: "Muy débil", color: "bg-red-400" };
    if (pwd.length < 8) return { level: 2, label: "Débil", color: "bg-orange-400" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { level: 4, label: "Fuerte", color: "bg-green-500" };
    return { level: 3, label: "Moderada", color: "bg-yellow-400" };
  };

  const strength = getStrength(formData.password);

  return (
    <div className="flex min-h-screen w-full">
      {/* IMAGEN LATERAL */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${setup1})` }}
      >
        <div className="absolute inset-0 bg-purple-900/40 flex flex-col items-center justify-center px-10 text-white">
          <HiShieldCheck className="text-7xl mb-4 drop-shadow-lg text-purple-200" />
          <h2 className="text-4xl font-extrabold mb-3 drop-shadow-lg text-center">Nueva Contraseña</h2>
          <p className="text-white/80 text-center text-lg max-w-xs">
            Elige una contraseña segura para proteger tu cuenta en BugSolutions.
          </p>
        </div>
      </div>

      {/* FORMULARIO */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">

          {/* Botón volver */}
          <Link
            to="/forgot-password"
            className="flex items-center gap-1 text-purple-600 text-sm hover:underline mb-6"
          >
            <HiArrowLeft /> Volver a recuperación
          </Link>

          <h1 className="text-3xl font-bold text-purple-700 mb-2 text-center">Restablecer Contraseña</h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            Crea una nueva contraseña segura para tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* NUEVA CONTRASEÑA */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nueva contraseña</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                />
                {showPassword
                  ? <HiEyeOff onClick={() => setShowPassword(false)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-purple-500 text-lg" />
                  : <HiEye    onClick={() => setShowPassword(true)}  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-purple-500 text-lg" />
                }
              </div>

              {/* Indicador de fortaleza */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          bar <= strength.level ? strength.color : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ml-1 font-medium ${
                    strength.level <= 1 ? "text-red-400" :
                    strength.level === 2 ? "text-orange-400" :
                    strength.level === 3 ? "text-yellow-500" : "text-green-500"
                  }`}>
                    Contraseña {strength.label}
                  </p>
                </div>
              )}

              {touched.password && errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Confirmar contraseña</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                />
                {showConfirm
                  ? <HiEyeOff onClick={() => setShowConfirm(false)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-purple-500 text-lg" />
                  : <HiEye    onClick={() => setShowConfirm(true)}  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-purple-500 text-lg" />
                }
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>
              )}
              {/* Confirmación visual de que coinciden */}
              {formData.confirmPassword && !errors.confirmPassword && (
                <p className="text-green-500 text-xs mt-1 ml-1 flex items-center gap-1">
                  <HiCheckCircle /> Las contraseñas coinciden
                </p>
              )}
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all mt-1 ${
                !isFormValid || isLoading
                  ? "bg-purple-300 cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-800 hover:shadow-md"
              }`}
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                "Restablecer contraseña"
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <HiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Contraseña actualizada!</h2>
            <p className="text-gray-500 text-sm mb-4">
              Tu contraseña fue restablecida correctamente.
            </p>

            <Link
              to="/login"
              className="block w-full py-3 rounded-xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition text-center"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}