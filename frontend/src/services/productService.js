import { db } from '../FireBase/firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Colecciones en Firestore
const PRODUCTS_COLLECTION = 'products';
const INVOICES_COLLECTION = 'invoices';

/**
 * Obtiene todos los productos de Firestore.
 */
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Normaliza el campo de imagen: productos del JSON usan 'imagenURL',
      // productos creados desde AddProducts usan 'imagen'
      let imagenURL = data.imagenURL || data.imagen || '';
      
      // Corregir URLs rotas dinámicamente con las imágenes solicitadas por el usuario
      if (doc.id === 'prod_02' || doc.id === 'prod_03') { // Ratones a imagen del Logitech G502
        imagenURL = 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80';
      } else if (doc.id === 'prod_19' || doc.id === 'prod_20') { // Sillas gamer
        imagenURL = 'https://images.unsplash.com/photo-1770195483917-b3bb444b7a29?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      } else if (doc.id === 'prod_21') { // Elgato Stream Deck
        imagenURL = 'https://m.media-amazon.com/images/I/61kmUcPNlBL._AC_UF894,1000_QL80_.jpg';
      } else if (doc.id === 'prod_22') { // Razer Kiyo Pro
        imagenURL = 'https://www.muycomputer.com/wp-content/uploads/2023/05/Razer-Kiyo-Pro-Ultra-Principal.jpg';
      } else if (doc.id === 'prod_23') { // Combo Redragon S101 Harpe
        imagenURL = 'https://redragon.es/content/uploads/2021/05/S101-BA_Combo.jpg';
      }

      // Normaliza la categoría para coincidir con los filtros de la tienda
      let categoria = (data.categoria || '').toLowerCase().trim();
      if (categoria === 'monitores') categoria = 'pantallas';
      if (categoria === 'combos') categoria = 'combos-perifericos';

      return {
        id: doc.id,
        ...data,
        imagenURL,
        categoria
      };
    });
  } catch (error) {
    console.error('Error al obtener productos desde Firestore:', error);
    throw error;
  }
};

/**
 * Crea una factura simulada en Firestore.
 * @param {Object} invoiceData Datos de la factura (cliente, items, total, etc.)
 */
export const createInvoice = async (invoiceData) => {
  try {
    const docRef = await addDoc(collection(db, INVOICES_COLLECTION), {
      ...invoiceData,
      fecha: new Date().toISOString()
    });
    return {
      id: docRef.id,
      ...invoiceData
    };
  } catch (error) {
    console.error('Error al crear la factura en Firestore:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de facturas generadas
 */
export const getInvoices = async () => {
  try {
    const q = query(collection(db, INVOICES_COLLECTION), orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener facturas desde Firestore:', error);
    throw error;
  }
};
