# Documentación: Autenticación con Facebook

Este documento detalla la implementación de la autenticación con Facebook en la aplicación, haciendo uso de Firebase Auth y los requerimientos de la plataforma Meta for Developers.

## 1. Configuración Externa (Meta for Developers)

A diferencia de Google, Facebook requiere una configuración de entorno más estricta:

1. **Creación de la App:** Se debe registrar una App en Meta for Developers y obtener el `App ID` y `App Secret`.
2. **Activación en Firebase:** Estos códigos se introducen en la consola de Firebase -> Authentication -> Sign-in methods -> Facebook. El interruptor principal de Facebook debe estar en **Habilitado**.
3. **URL de Redirección (OAuth):** Se debe tomar la URL de retorno proporcionada por Firebase y pegarla en el panel de Facebook bajo "Configuración de Inicio de sesión de Facebook".
4. **Permiso de Correo (Scope):** Por defecto, las aplicaciones nuevas de Facebook bloquean el acceso al correo del usuario. Se debe ingresar a "Casos de Uso" -> "Autenticación" y agregar expresamente el permiso `email`. Sin esto, Firebase devolverá el error *Invalid Scopes*.
5. **Modo Desarrollo vs En Vivo:** Mientras la app esté en "Desarrollo", solo los desarrolladores o "Probadores" (Testers) añadidos manualmente podrán loguearse. Para ponerla pública ("En Vivo"), Facebook exige subir un ícono y URLs de Política de Privacidad y Eliminación de datos.

## 2. Flujo de Inicio de Sesión (`loginWithFacebook`)

La lógica central reside en `src/services/authService.js`.

- **Proveedor:** Se usa `FacebookAuthProvider`.
- **Método:** Se emplea `signInWithPopup`.

### Parámetro Personalizado (Reautenticación)
Para evitar que Facebook loguee al usuario de forma silenciosa e instantánea usando las cookies del navegador (lo cual dificulta probar diferentes cuentas), se añadió:
```javascript
const provider = new FacebookAuthProvider();
provider.setCustomParameters({ auth_type: 'reauthenticate' });
```
Esto fuerza a la pantalla de Facebook a preguntar al usuario si desea continuar con la cuenta abierta o cambiar a una diferente.

## 3. Manejo de Errores Específicos de Facebook

En el componente `Login.jsx` se manejan los siguientes estados:
- **`auth/account-exists-with-different-credential`**: Ocurre si el usuario intenta entrar con Facebook, pero ese correo ya pertenece a una cuenta registrada originalmente con otro método (Google/Correo). Se muestra una alerta indicándole con qué método debe entrar.
- **`auth/popup-closed-by-user`**: Ocurre si el usuario cierra manualmente la ventana flotante de Facebook antes de terminar.
- **Falta de correo (`currentUser.email === null`)**: Si el usuario rechaza dar acceso a su correo en la ventana de Facebook o se registró solo con teléfono en la plataforma de Meta, el email llegará nulo. El Dashboard y Firebase lo manejan guardándolo como cadena vacía o mostrando "No proporcionado".

## 4. Agrupación y Vinculación (Account Linking)

- Funciona exactamente igual que con Google.
- Si un usuario se registra de forma nativa e intenta luego vincular su Facebook en el Dashboard (`Dashboard.jsx`), se lanza `linkWithPopup(currentUser, facebookProvider)`. El proveedor se invoca con la regla de `reauthenticate` para garantizar que sea la cuenta de Facebook que el usuario desea asociar.
