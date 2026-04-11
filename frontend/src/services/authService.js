import { auth, db } from '../FireBase/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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

export const loginUser = async (email, pwd) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pwd);
  return userCredential.user;
};