import { auth, db } from '../FireBase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,  signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, fetchSignInMethodsForEmail,
linkWithCredential, sendEmailVerification, sendPasswordResetEmail} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// En este archivo se definen las funciones para el registro y login de usuarios

// registerUser crea un nuevo usuario en Firebase Auth y luego guarda sus datos en Firestore.
// La función recibe un objeto con los datos del usuario.
// Devuelve el usuario creado por Firebase Auth.
export const registerUser = async ({ nombre, tipoDocumento, numeroDocumento, telefono, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Enviar correo de verificación para proteger la contraseña ante la vinculación de cuentas
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

// loginUser autentica a un usuario con Firebase Auth.
// Recibe el correo y contraseña.
// Devuelve el usuario autenticado.
export const loginUser = async (email, pwd) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pwd);
  return userCredential.user;
};

// Cierra la sesión del usuario actual
export const logoutUser = async () => {
  await signOut(auth);
};

// Obtiene los datos del perfil de usuario desde Firestore
export const getUserProfileData = async (uid) => {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    return userDocSnap.data();
  } else {
    throw new Error('No se encontraron los datos del perfil de usuario');
  }
};

// Actualiza los datos del perfil del usuario en Firestore
export const updateUserProfileData = async (uid, data) => {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, data);
};
// Esta función se encarga de guardar en Firestore al usuario que inicia sesión con Google
// Si el usuario entra por primera vez, crea su documento
// Si ya existía, actualiza datos
const GoogleUser = async (user) => {
  // Referencia al documento del usuario usando su UID como ID
  const userRef = doc(db, 'users', user.uid);

  // Consultamos si el documento ya existe en Firestore
  const userSnap = await getDoc(userRef);

  // Datos base que vamos a guardar o actualizar
  const baseData = {
    nombre: user.displayName || '',         // Nombre que devuelve Google
    email: user.email || '',                // Correo del usuario
    provider: 'google',                     // Indicamos que viene de Google
    photoURL: user.photoURL || '',          // Foto de perfil
    updatedAt: new Date().toISOString(),    // Fecha de última actualización
  };

  // Si el usuario no existe en Firestore, creamos el documento
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      ...baseData,
      tipoDocumento: '',                    // Campos vacíos para completar luego
      numeroDocumento: '',
      createdAt: new Date().toISOString(),  // Fecha de creación
    });
  } else {
    // Si ya existe, solo actualizamos los datos base
    await updateDoc(userRef, baseData);
  }

  // Retornamos el usuario autenticado
  return user;
};

// Función pública para iniciar sesión con Google
export const loginWithGoogle = async () => {
  // Creamos una instancia del proveedor de Google
  const provider = new GoogleAuthProvider();

  // Abrimos el popup de autenticación con Google
  const result = await signInWithPopup(auth, provider);

  // Guardamos o sincronizamos el usuario en Firestore
  return await GoogleUser(result.user);
};

// Revisa si al usuario autenticado con Google le faltan datos obligatorios
export const hasMissingGoogleProfileData = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return true;

  const data = userSnap.data();

  return (
    !data?.telefono?.trim() ||
    !data?.tipoDocumento?.trim() ||
    !data?.numeroDocumento?.trim()
  );
};

// Esta función guarda Firestore al usuario autenticado con GitHub
const GithubUser = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  const baseData = {
    nombre: user.displayName || '',
    email: user.email || '',
    provider: 'github',
    photoURL: user.photoURL || '',
    updatedAt: new Date().toISOString(),
  };

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      ...baseData,
      telefono: '',
      tipoDocumento: '',
      numeroDocumento: '',
      createdAt: new Date().toISOString(),
    });
  } else {
    await updateDoc(userRef, baseData);
  }

  return user;
};

// Función pública para iniciar sesión con GitHub
export const loginWithGithub = async () => {
  const provider = new GithubAuthProvider();

  const result = await signInWithPopup(auth, provider);

  return await GithubUser(result.user);
};

// Revisa si al usuario autenticado con GitHub le faltan datos obligatorios
export const hasMissingGithubProfileData = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return true;

  const data = userSnap.data();

  return (
    !data?.telefono?.trim() ||
    !data?.tipoDocumento?.trim() ||
    !data?.numeroDocumento?.trim()
  );
};

// Esta función guarda en Firestore al usuario autenticado con Facebook
const FacebookUser = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  const baseData = {
    nombre: user.displayName || '',
    email: user.email || '',
    provider: 'facebook',
    photoURL: user.photoURL || '',
    updatedAt: new Date().toISOString(),
  };

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      ...baseData,
      telefono: '',
      tipoDocumento: '',
      numeroDocumento: '',
      createdAt: new Date().toISOString(),
    });
  } else {
    await updateDoc(userRef, baseData);
  }

  return user;
};

// Función pública para iniciar sesión con Facebook
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();

  const result = await signInWithPopup(auth, provider);

  return await FacebookUser(result.user);
};

// Revisa si al usuario autenticado con Facebook le faltan datos obligatorios
export const hasMissingFacebookProfileData = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return true;

  const data = userSnap.data();

  return (
    !data?.telefono?.trim() ||
    !data?.tipoDocumento?.trim() ||
    !data?.numeroDocumento?.trim()
  );
};
export const resetPasswordByEmail = async (email) => {
  await sendPasswordResetEmail(auth, email);
};