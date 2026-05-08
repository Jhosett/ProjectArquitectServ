# Documentación: Autenticación con Google

Este documento explica cómo está implementada la lógica de autenticación con Google en la aplicación, utilizando Firebase Auth y Cloud Firestore.

## 1. Flujo de Inicio de Sesión (`loginWithGoogle`)

La autenticación principal se encuentra en el archivo `src/services/authService.js`.

- **Proveedor:** Se utiliza `GoogleAuthProvider` nativo de Firebase.
- **Método:** Se emplea `signInWithPopup` para abrir una ventana segura de Google donde el usuario elige su cuenta.

### Parámetro Personalizado (Selector de Cuentas)
Para mejorar la experiencia en fase de desarrollo o en computadoras compartidas, se ha forzado al proveedor a mostrar siempre el selector de cuentas:
```javascript
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
```
Esto desactiva el "inicio de sesión silencioso" de Firebase, que usualmente entraría de forma automática si ya hay una sesión de Google abierta en el navegador.

## 2. Creación y Persistencia del Perfil (`GoogleUser`)

Dado que Firebase Auth solo maneja credenciales, los datos adicionales del usuario deben guardarse en una base de datos.
1. Una vez que Google devuelve el `user`, se ejecuta la función `GoogleUser(user)`.
2. Esta función revisa si el `uid` (identificador único) ya existe como documento en la colección `users` de Firestore.
3. Si no existe, crea el documento guardando el nombre, foto de perfil, y proveedor (`provider: 'google'`).
4. **Completar Perfil:** Como Google no provee datos específicos del negocio (como "Tipo de Documento" o "Teléfono"), la función `hasMissingGoogleProfileData` obliga a la UI a redirigir al usuario a una pantalla de completado de perfil antes de dejarlo acceder al Dashboard.

## 3. Agrupación de Cuentas en Registro (Account Linking)

Si un usuario ya se registró alguna vez con Google, su correo está reservado. Si posteriormente intenta registrarse en el sistema con correo tradicional usando esa misma dirección:
1. Firebase bloquea el intento devolviendo `auth/email-already-in-use`.
2. El sistema intercepta el error, verifica los métodos asociados usando `fetchSignInMethodsForEmail` y detecta `google.com`.
3. Informa al usuario y le pide que inicie sesión con Google mediante popup para confirmar su identidad.
4. Al confirmar, vincula la contraseña escrita con el perfil de Google usando `linkWithCredential(user, EmailAuthProvider.credential(...))`.

## 4. Vinculación Manual desde el Dashboard

Si un usuario se registró con correo/contraseña y quiere vincular su Google después:
- En el `Dashboard.jsx`, se llama a `linkWithPopup(currentUser, googleProvider)`.
- Si el usuario tiene sesión activa, Firebase unifica ambas formas de acceso bajo el mismo `uid` y el mismo documento de Firestore.
