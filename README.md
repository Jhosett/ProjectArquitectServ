# BugSolutions — Plataforma Web
---

## 📋 Descripción del Proyecto

**BugSolutions** es una aplicación web desarrollada como solución digital para la empresa del mismo nombre, dedicada a la venta de componentes de computadores y a la prestación de servicios técnicos de mantenimiento.

El propósito del proyecto es brindarle a este negocio un espacio virtual desde el cual pueda ofrecer sus productos y servicios a través de una plataforma moderna, intuitiva y accesible para sus clientes.


---

## 👥 Integrantes del Equipo

| Nombre | Rol |
|---|---|
| Juan Carlos Melo Pérez | Desarrollador Frontend |
| Darwin Jhosett Bermúdez Romero | Desarrollador Frontend |
| Ángel Andrés Boada Salazar | Desarrollador Frontend |

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Descripción |
|---|---|
| [React 18](https://react.dev/) | Biblioteca principal para construcción de interfaces |
| [Vite](https://vitejs.dev/) | Herramienta de build y servidor de desarrollo |
| [React Router DOM v6](https://reactrouter.com/) | Navegación entre vistas (SPA) |
| [Tailwind CSS](https://tailwindcss.com/) | Framework de estilos utilitarios |
| [React Icons](https://react-icons.github.io/react-icons/) | Librería de iconos (HeroIcons, FontAwesome, etc.) |

---

## 📁 Estructura del Proyecto

```
frontend/
├── public/
├── src/
│   ├── assets/
│   │   ├── banners/          # Imágenes de banners promocionales
│   │   ├── fondos/           # Imágenes de fondo (setup1.jpg, etc.)
│   │   └── Ant.svg           # Logo de la empresa
│   ├── components/
│   │   ├── Carrusel.jsx      # Carrusel de slides en la página principal
│   │   ├── Footer.jsx        # Pie de página con links, contacto y redes
│   │   ├── Header.jsx        # Barra de navegación principal
│   │   └── PromoBanner.jsx   # Sección de banners promocionales por categoría
│   ├── pages/
│   │   ├── Authentication/
│   │   │   ├── Login.jsx       # Vista de inicio de sesión
│   │   │   ├── ForgotPage.jsx  # Vista de recuperación de contraseña
│   │   │   └── ResetPage.jsx   # Vista de restablecimiento de contraseña
│   │   └── Home.jsx            # Página principal
│   ├── App.css
│   ├── App.jsx               # Configuración de rutas principal
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Rutas de la Aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Home` | Página principal con carrusel y banners |
| `/login` | `Login` | Inicio de sesión |
| `/forgot-password` | `ForgotPage` | Recuperación de contraseña |
| `/reset-password` | `ResetPage` | Restablecimiento de contraseña |

---

## ▶️ Instrucciones de Ejecución Local

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior
- [Git](https://git-scm.com/)

### Pasos

**1. Clonar el repositorio**
```bash
git clone [https://github.com/tu-usuario/bugsolutions.git](https://github.com/Jhosett/ProjectArquitectServ.git)
cd ProjectArquitectServ
```

**2. Ir a la carpeta del frontend**
```bash
cd frontend
```

**3. Instalar las dependencias**
```bash
npm install
```

**4. Iniciar el servidor de desarrollo**
```bash
npm run dev
```

**5. Abrir en el navegador**
```
http://localhost:5173
```

---

##Funcionalidades Implementadas

- **Página principal** con carrusel automático y banners promocionales por categoría
- **Header** con navegación y accesos a login/registro
- **Footer** con redes sociales, métodos de pago e información de contacto
- **Login** con validación de email y contraseña, toggle de visibilidad y login social
- **ForgotPage** con validación de correo y modal de confirmación con datos del formulario
- **ResetPage** con validación de contraseña, indicador de fortaleza, confirmación de contraseña y modal con datos del formulario

---
## Formularios Controlados con useState

Todos los formularios de la aplicación están implementados como **formularios controlados** en React. Esto significa que el valor de cada campo está vinculado directamente a un estado local mediante `useState`, lo que permite a React tener control total sobre los datos en todo momento.
```jsx
// Ejemplo tomado de Login.jsx
const [loginData, setLoginData] = useState({ email: "", pwd: "" });

const handleChange = (e) => {
  const { name, value } = e.target;
  setLoginData({ ...loginData, [name]: value });
};

<input
  name="email"
  value={loginData.email}
  onChange={handleChange}
/>
```

Este patrón se aplicó en las vistas **Login**,**RegisterPage**, **ForgotPage** y **ResetPage**, permitiendo realizar validaciones en tiempo real, mostrar mensajes de error y controlar el estado del botón de envío.

## 📄 Licencia

Proyecto académico desarrollado para la asignatura de Arquitectura Orientada a Servicios.
