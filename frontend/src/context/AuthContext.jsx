import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../FireBase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfileData } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    const profileData = await getUserProfileData(user.uid);
                    setUserData(profileData);
                } catch (error) {
                    console.error("Error obteniendo datos del usuario:", error);
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
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
