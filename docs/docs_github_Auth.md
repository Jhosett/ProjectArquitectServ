# Documentación: Autenticación con GitHub

Este documento explica cómo está implementada la lógica de autenticación con GitHub en la aplicación, utilizando Firebase Auth y Cloud Firestore.

## 1. Flujo de Inicio de Sesión (`loginWithGithub`)

La autenticación principal se encuentra en el archivo `src/services/authService.js`.

- **Proveedor:** Se utiliza `GithubAuthProvider` nativo de Firebase.
- **Método:** Se emplea `signInWithPopup` para abrir una ventana segura de GitHub donde el usuario autoriza el acceso con su cuenta.

### Configuración del Proveedor

Para iniciar sesión con GitHub, se crea una instancia del proveedor de Firebase:

\`\`\`javascript
const provider = new GithubAuthProvider();
\`\`\`

Opcionalmente, se pueden solicitar permisos adicionales si la aplicación los necesita:

\`\`\`javascript
provider.addScope('read:user');
provider.addScope('user:email');
\`\`\`

Esto permite acceder a información básica del perfil y, cuando GitHub lo permite, al correo electrónico del usuario.

> A diferencia de Google, GitHub no siempre devuelve un correo público. Si el usuario tiene su email privado en GitHub, Firebase puede no recibirlo directamente, por lo que es importante validar este dato en la lógica de perfil.

## 2. Creación y Persistencia del Perfil (`GithubUser`)

Dado que Firebase Auth solo maneja credenciales, los datos adicionales del usuario deben guardarse en una base de datos.

1. Una vez que GitHub devuelve el `user`, se ejecuta la función `GithubUser(user)`.
2. Esta función revisa si el `uid` ya existe como documento en la colección `users` de Firestore.
3. Si no existe, crea el documento guardando datos como nombre, foto de perfil, correo si está disponible, y proveedor:

\`\`\`javascript
provider: 'github'
\`\`\`

4. **Completar Perfil:** Como GitHub no provee datos específicos del negocio, como “Tipo de Documento”, “Teléfono” u otros campos internos, la función `hasMissingGithubProfileData` obliga a la UI a redirigir al usuario a una pantalla de completado de perfil antes de dejarlo acceder al Dashboard.

Ejemplo general:

\`\`\`javascript
const GithubUser = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      provider: 'github',
      createdAt: new Date()
    });
  }
};
\`\`\`

## 3. Agrupación de Cuentas en Registro `(Account Linking)`

Si un usuario ya se registró alguna vez con GitHub, su correo queda asociado a ese proveedor. Si posteriormente intenta registrarse en el sistema con correo tradicional usando esa misma dirección:

1. Firebase bloquea el intento devolviendo:

\`\`\`javascript
auth/email-already-in-use
\`\`\`

2. El sistema intercepta el error.
3. Verifica los métodos asociados usando:

\`\`\`javascript
fetchSignInMethodsForEmail(auth, email)
\`\`\`

4. Si detecta que el método asociado es:

\`\`\`javascript
github.com
\`\`\`

5. Informa al usuario y le pide que inicie sesión con GitHub mediante popup para confirmar su identidad.
6. Al confirmar, vincula la contraseña escrita con el perfil de GitHub usando:

\`\`\`javascript
linkWithCredential(
  user,
  EmailAuthProvider.credential(email, password)
);
\`\`\`

De esta forma, el usuario podrá acceder en adelante tanto con GitHub como con correo y contraseña, manteniendo el mismo `uid` y el mismo documento en Firestore.

## 4. Vinculación Manual desde el Dashboard

Si un usuario se registró con correo/contraseña y quiere vincular su cuenta de GitHub después:

- En el `Dashboard.jsx`, se llama a:

\`\`\`javascript
const githubProvider = new GithubAuthProvider();

await linkWithPopup(currentUser, githubProvider);
\`\`\`

- Si el usuario tiene sesión activa, Firebase unifica ambas formas de acceso bajo el mismo `uid`.
- El documento de Firestore se mantiene como el perfil principal del usuario.
- Opcionalmente, se puede actualizar el documento agregando GitHub como proveedor vinculado:

\`\`\`javascript
await updateDoc(doc(db, 'users', currentUser.uid), {
  githubLinked: true,
  providers: arrayUnion('github')
});
\`\`\`

## 5. Consideraciones Importantes

### Correo privado en GitHub

GitHub permite que los usuarios oculten su correo. Por eso, `user.email` puede venir vacío o como `null`.

En ese caso, la aplicación debe redirigir al usuario a completar su correo manualmente dentro del flujo de completar perfil.

### Error por credencial ya usada

Si una cuenta de GitHub ya está vinculada a otro usuario de Firebase, puede aparecer el error:

\`\`\`javascript
auth/credential-already-in-use
\`\`\`

En ese caso, el sistema debe informar que esa cuenta de GitHub ya pertenece a otro perfil.

### Error por proveedor ya vinculado

Si el usuario intenta vincular GitHub cuando ya lo tiene asociado, Firebase puede devolver:

\`\`\`javascript
auth/provider-already-linked
\`\`\`

En este caso, se puede mostrar un mensaje indicando que la cuenta ya está vinculada.

## 6. Resumen del Flujo

1. El usuario selecciona “Continuar con GitHub”.
2. Firebase abre el popup de autorización de GitHub.
3. GitHub devuelve la credencial.
4. Firebase crea o autentica al usuario.
5. Se ejecuta `GithubUser(user)` para crear o validar su perfil en Firestore.
6. Si faltan datos obligatorios, se redirige a completar perfil.
7. Si el perfil está completo, se permite el acceso al Dashboard.
8. Si el usuario desea vincular GitHub manualmente, se usa `linkWithPopup` desde el Dashboard.