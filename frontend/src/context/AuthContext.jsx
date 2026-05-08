import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../FireBase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeSnapshot = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                unsubscribeSnapshot = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        // Sincronizar email: Si el usuario verificó su nuevo correo, auth tendrá el nuevo correo.
                        // Comprobamos si el correo en Firestore está desactualizado y lo parcheamos automáticamente.
                        if (data.email && data.email !== user.email && user.email) {
                            try {
                                await updateDoc(doc(db, 'users', user.uid), { email: user.email });
                                data.email = user.email; // actualizamos localmente el objeto para este render
                            } catch (e) {
                                console.error("Error sincronizando email con Firestore:", e);
                            }
                        }

                        setUserData(data);
                    } else {
                        setUserData(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error obteniendo datos del usuario:", error);
                    setUserData(null);
                    setLoading(false);
                });
            } else {
                setUserData(null);
                setLoading(false);
                if (unsubscribeSnapshot) unsubscribeSnapshot();
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    const value = {
        currentUser,
        userData,
        setUserData, // para poder actualizar el estado global después de un EditProfile
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
