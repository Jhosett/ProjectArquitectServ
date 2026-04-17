import { auth, db } from '../FireBase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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