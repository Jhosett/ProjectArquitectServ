import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserProfileData, updateUserProfileData } from "../../services/authService";
import Swal from "sweetalert2";
import { HiPhone, HiCreditCard, HiHashtag, HiUser } from "react-icons/hi";

export default function CompleteGoogleProfile() {
  const { currentUser, setUserData } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    tipoDocumento: "Cédula de Ciudadanía",
    numeroDocumento: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;

      try {
        setIsFetchingProfile(true);

        const data = await getUserProfileData(currentUser.uid);
        setProfileData(data);

        setFormData({
          nombre: data.nombre || "",
          telefono: data.telefono || "",
          tipoDocumento: data.tipoDocumento || "Cédula de Ciudadanía",
          numeroDocumento: data.numeroDocumento || "",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del perfil.",
          confirmButtonColor: "#7c3aed",
        });
      } finally {
        setIsFetchingProfile(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  const needsNombre = !profileData?.nombre?.trim();
  const needsTelefono = !profileData?.telefono?.trim();
  const needsTipoDocumento = !profileData?.tipoDocumento?.trim();
  const needsNumeroDocumento = !profileData?.numeroDocumento?.trim();

  useEffect(() => {
    if (
      profileData &&
      profileData.nombre?.trim() &&
      profileData.telefono?.trim() &&
      profileData.tipoDocumento?.trim() &&
      profileData.numeroDocumento?.trim()
    ) {
      navigate("/");
    }
  }, [profileData, navigate]);

  const validate = (data = formData) => {
    const newErrors = {};

    if (needsNombre && !data.nombre.trim()) {
      newErrors.nombre = "Campo obligatorio";
    }

    if (needsTelefono) {
      if (!data.telefono.trim()) {
        newErrors.telefono = "Campo obligatorio";
      } else if (!/^\d+$/.test(data.telefono)) {
        newErrors.telefono = "Solo números permitidos";
      } else if (data.telefono.length > 10) {
        newErrors.telefono = "Máximo 10 dígitos";
      }
    }

    if (needsNumeroDocumento && !data.numeroDocumento.trim()) {
      newErrors.numeroDocumento = "Campo obligatorio";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "telefono") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    const newData = {
      ...formData,
      [name]: value,
    };

    setFormData(newData);

    if (touched[name]) {
      setErrors(validate(newData));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors(validate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      Swal.fire({
        icon: "error",
        title: "Sesión no disponible",
        text: "Debes iniciar sesión nuevamente.",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    const allTouched = {};
    if (needsNombre) allTouched.nombre = true;
    if (needsTelefono) allTouched.telefono = true;
    if (needsTipoDocumento) allTouched.tipoDocumento = true;
    if (needsNumeroDocumento) allTouched.numeroDocumento = true;

    setTouched(allTouched);

    const currentErrors = validate(formData);

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    try {
      setIsLoading(true);

      const updates = {};

      if (needsNombre) updates.nombre = formData.nombre;
      if (needsTelefono) updates.telefono = formData.telefono;
      if (needsTipoDocumento) updates.tipoDocumento = formData.tipoDocumento;
      if (needsNumeroDocumento) updates.numeroDocumento = formData.numeroDocumento;

      await updateUserProfileData(currentUser.uid, updates);

      const mergedData = {
        ...profileData,
        ...updates,
      };

      setProfileData(mergedData);

      if (setUserData) {
        setUserData((prev) => ({
          ...prev,
          ...updates,
        }));
      }

      await Swal.fire({
        icon: "success",
        title: "¡Perfil completado!",
        text: "Tu información fue guardada correctamente.",
        confirmButtonColor: "#7c3aed",
      });

      navigate("/");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la información.",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser || isFetchingProfile) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">
        <h1 className="text-3xl font-bold text-purple-700 mb-2 text-center">
          Completa tu perfil
        </h1>

        <p className="text-gray-400 text-sm text-center mb-8">
          Completa únicamente los datos que faltan para continuar.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {needsNombre && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg" />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingresa tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                />
              </div>
              {errors.nombre && touched.nombre && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.nombre}</p>
              )}
            </div>
          )}

          {needsTelefono && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Teléfono
              </label>
              <div className="relative">
                <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg" />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Ingresa tu teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                />
              </div>
              {errors.telefono && touched.telefono && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.telefono}</p>
              )}
            </div>
          )}

          {needsTipoDocumento && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tipo de documento
              </label>
              <div className="relative">
                <HiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg z-10" />
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm appearance-none"
                >
                  <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                  <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
            </div>
          )}

          {needsNumeroDocumento && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Número de documento
              </label>
              <div className="relative">
                <HiHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg" />
                <input
                  type="text"
                  name="numeroDocumento"
                  placeholder="Ingresa tu número de documento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                />
              </div>
              {errors.numeroDocumento && touched.numeroDocumento && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.numeroDocumento}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-purple-700 hover:bg-purple-800 transition-all disabled:bg-purple-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Guardando..." : "Guardar y continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}