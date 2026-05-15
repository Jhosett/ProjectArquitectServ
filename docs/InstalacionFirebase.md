# Instalación y Conexión de FireBase al Proyecto
--

## Paso N°1 - Instalación de Firebase

El primer paso es la instalación de Firebase al proyecto, el cual proporciona acceso a todos los servicios de Firebase, siendo algunos ejemplos como: Auth, Firestore, Storage, etc.

Para su instalación se debe ejecutar el siguiente comando:

```bash
npm install firebase
```
--

## Paso N°2 - Creación del archivo de configuración de Firebase

En este punto se crea un archivo llamado firebaseConfig.js, en donde allí se pegan las credenciales del proyecto creado en Firebase. Estas credenciales se acceden a través de la **consola de firebase**, luego a **configuración**, después al apartado **general** del proyecto y por ultimo dirigirse a la sección de abajo donde dice **Web App**. Donde se copia el codigo mostrado allí y se plantea la siguiente configuración:

```jsx
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  ...
}

const app = initializeApp(firebaseConfig)       // boots Firebase
export const auth = getAuth(app)                // Firebase Authentication instance
export const db = getFirestore(app)             // Firestore database instance
```

Los archivos auth y db son exportados para que otros archivos dentro de la plataforma los importen para comunicarse con Firebase.
--

## Paso N°3 - Creación de la carpeta

Ahora, se centraliza toda la lógica de Firebase en el archivo authService.js, el cual permite manejar, cambiar o extender la lógica de la conexión con Firebase dentro de un mismo espacio.

### Flujo de Registro de usuarios

Para el registro de usuarios se implementan dos cosas:
- Firebase Auth almacena el **email** y la **contraseña encriptada** y se encarga de la autenticación
- Firestore almacena la información del perfil del usuario en una colección llamada **users**, a través del UID como identificador del documento de tal manera que ambos registros estén vinculados.

```jsx
export const registerUser = async ({ email, password, nombre, ... }) => {
  // Step 1 — Crea el usuario en Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const uid = userCredential.user.uid   // Firebase generates a unique ID

  // Step 2 — Guarda los datos del usuario Firestore (la contraseña nunca se almacene allí)
  await setDoc(doc(db, 'users', uid), {
    nombre, email, telefono, ...
    createdAt: new Date().toISOString()
  })
}
```

### Flujo de Inicio de Sesión de Usuarios

Para el inicio de los usuarios Firebase Auth verifica las credenciales y devuelve un objeto usuario con el **UID, email y el token de acceso**.

```jsx
export const loginUser = async (email, pwd) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pwd)
  return userCredential.user
}
```

### Paso N°4 - Conección hacia los componentes

En los archivos de Register.jsx y Login.jsx se importan y se llaman las funciones de los servicios:

**Register.jsx**

```jsx
// Register.jsx
import { registerUser } from "../../services/authService"

const onSubmit = async (e) => {
  e.preventDefault()
  await registerUser(formData)   // calls Firebase under the hood
  navigate("/login")
}
```

**Login.jsx**

```jsx
// Login.jsx
import { loginUser } from "../../services/authService"

await loginUser(loginData.email, loginData.pwd)
navigate("/")

```