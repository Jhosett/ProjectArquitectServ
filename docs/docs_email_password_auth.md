# Documentación: Autenticación con Email y Contraseña

Este documento explica cómo está implementada la lógica de autenticación con correo electrónico y contraseña en la aplicación, utilizando Firebase Auth y Cloud Firestore.

---

## 1. Registro de Usuario (`registerUser`)

La lógica de registro se encuentra en `src/services/authService.js`.

- **Método:** Se utiliza `createUserWithEmailAndPassword` de Firebase Auth.
- **Verificación:** Al crear la cuenta, se envía automáticamente un correo de verificación con `sendEmailVerification`.

### Proceso completo

```javascript
export const registerUser = async ({ nombre, tipoDocumento, numeroDocumento, telefono, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await sendEmailVerification(userCredential.user);

  await setDoc(doc(db, 'users', uid), {
    nombre,
    tipoDocumento,
    numeroDocumento,
    telefono,
    email,
    createdAt: new Date().toISOString(),
  });

  return userCredential.user;
};
```

### Pasos que ocurren al registrarse

1. Firebase Auth crea el usuario con email y contraseña. La contraseña se almacena de forma segura (hasheada) por Firebase — **nunca se guarda en Firestore**.
2. Firebase genera un `uid` único para ese usuario.
3. Se envía un correo de verificación a la dirección proporcionada.
4. Se crea un documento en la colección `users` de Firestore usando el `uid` como ID del documento, guardando los datos del perfil.

### Validaciones previas (formulario)

Antes de llamar a `registerUser`, el formulario en `Register.jsx` valida:

| Campo | Regla |
|---|---|
| Nombre | Obligatorio |
| Número de documento | Obligatorio |
| Teléfono | Solo números, máximo 10 dígitos |
| Email | Formato válido (`\S+@\S+\.\S+`) |
| Contraseña | Mínimo 6 caracteres (requerido también por Firebase) |
| Confirmar contraseña | Debe coincidir con la contraseña |
| Términos y condiciones | Debe estar marcado |

---

## 2. Inicio de Sesión (`loginUser`)

- **Método:** Se utiliza `signInWithEmailAndPassword` de Firebase Auth.
- **Sesión:** Al autenticarse correctamente, se registra la sesión en la subcolección `sessions` de Firestore.

```javascript
export const loginUser = async (email, pwd) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pwd);
  const user = userCredential.user;

  await addDoc(collection(db, 'users', user.uid, 'sessions'), {
    loginAt: new Date().toISOString(),
    logoutAt: null,
    provider: 'email',
    status: 'active',
  });

  return user;
};
```

### Registro de sesión en Firestore

Cada vez que el usuario inicia sesión, se crea un documento en `users/{uid}/sessions` con:

| Campo | Valor |
|---|---|
| `loginAt` | Fecha y hora de entrada (ISO string) |
| `logoutAt` | `null` (se actualiza al cerrar sesión) |
| `provider` | `'email'` |
| `status` | `'active'` |

### Manejo de errores en Login

Firebase retorna códigos de error específicos que se muestran al usuario:

| Código Firebase | Mensaje mostrado |
|---|---|
| `auth/invalid-credential` | Correo o contraseña incorrectos |
| Otros | Error al iniciar sesión. Intenta de nuevo |

---

## 3. Cierre de Sesión (`logoutUser`)

Al cerrar sesión, se actualiza el documento de sesión activa en Firestore antes de ejecutar el `signOut`:

```javascript
export const logoutUser = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      const sessionsRef = collection(db, 'users', user.uid, 'sessions');
      const q = query(sessionsRef, where('status', '==', 'active'));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const sorted = snap.docs.sort((a, b) =>
          new Date(b.data().loginAt) - new Date(a.data().loginAt)
        );
        await updateDoc(sorted[0].ref, {
          logoutAt: new Date().toISOString(),
          status: 'finalized',
        });
      }
    } catch (error) {
      console.error('Error al registrar logout en Firestore:', error);
    }
  }

  await signOut(auth);
};
```

> El `signOut` siempre se ejecuta aunque falle la actualización en Firestore, gracias al `try/catch` separado.

---

## 4. Recuperación de Contraseña (`resetPasswordByEmail`)

Si el usuario olvidó su contraseña, puede solicitar un enlace de recuperación desde `ForgotPage.jsx`:

```javascript
export const resetPasswordByEmail = async (email) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/reset-password`,
    handleCodeInApp: false,
  };
  await sendPasswordResetEmail(auth, email, actionCodeSettings);
};
```

Firebase envía un correo con un enlace que redirige a `/reset-password`, donde el usuario puede establecer una nueva contraseña usando `confirmPasswordReset`.

---

## 5. Actualización de Perfil (`EditProfile`)

Desde `EditProfile.jsx`, el usuario puede actualizar sus datos. La lógica distingue entre usuarios de email/contraseña y usuarios de proveedores externos:

### Datos de Firestore (todos los usuarios)
- Nombre, tipo de documento, número de documento, teléfono, foto de perfil (URL).
- Se actualizan con `updateUserProfileData(uid, data)` → `updateDoc` en Firestore.

### Solo usuarios de email/contraseña
- **Email:** Se usa `verifyBeforeUpdateEmail` — Firebase envía un correo de verificación a la nueva dirección. El cambio solo se aplica al confirmar.
- **Contraseña:** Se usa `updatePassword`. Si el campo se deja vacío, no se modifica.

---

## 6. Vinculación con Otros Proveedores

Si un usuario registrado con email/contraseña quiere vincular su cuenta de Google, GitHub o Facebook:

- Desde `Dashboard.jsx` se llama a `linkWithPopup(currentUser, provider)`.
- Firebase unifica ambas formas de acceso bajo el mismo `uid` y el mismo documento de Firestore.
- Si la cuenta del proveedor ya está vinculada a otro usuario diferente, Firebase lanza `auth/credential-already-in-use`.

---

## 7. Estructura en Firestore

### Colección `users`

```
users/
└── {uid}/
    ├── nombre
    ├── tipoDocumento
    ├── numeroDocumento
    ├── telefono
    ├── email
    ├── photoURL
    ├── createdAt
    └── sessions/
        └── {sessionId}/
            ├── loginAt
            ├── logoutAt
            ├── provider
            └── status
```

> La contraseña **nunca** se almacena en Firestore. Firebase Auth la gestiona de forma segura de manera interna.
