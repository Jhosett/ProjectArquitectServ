import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../FireBase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

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
                unsubscribeSnapshot = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
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
