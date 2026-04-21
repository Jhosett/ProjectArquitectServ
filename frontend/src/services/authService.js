import { auth, db } from '../FireBase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// En este archivo se definen las funciones para el registro y login de usuarios

// registerUser crea un nuevo usuario en Firebase Auth y luego guarda sus datos en Firestore.
// La función recibe un objeto con los datos del usuario.
// Devuelve el usuario creado por Firebase Auth.
export const registerUser = async ({ nombre, tipoDocumento, numeroDocumento, telefono, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

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