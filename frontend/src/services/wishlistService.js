import { db } from '../FireBase/firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

/**
 * Agrega un producto a la lista de deseos del usuario en Firestore
 */
export const addToWishlist = async (userId, productId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      wishlist: arrayUnion(productId)
    });
    return true;
  } catch (error) {
    console.error("Error al añadir a la lista de deseos:", error);
    throw error;
  }
};

/**
 * Elimina un producto de la lista de deseos del usuario en Firestore
 */
export const removeFromWishlist = async (userId, productId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      wishlist: arrayRemove(productId)
    });
    return true;
  } catch (error) {
    console.error("Error al eliminar de la lista de deseos:", error);
    throw error;
  }
};