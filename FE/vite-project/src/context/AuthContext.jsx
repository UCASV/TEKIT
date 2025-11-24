import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { Alert, Spinner } from 'react-bootstrap'; // Importar Alert y Spinner

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initializationError, setInitializationError] = useState(null);

    useEffect(() => {
        try {
            //Verificar si hay un usuario almacenado
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
        } catch (e) {
            //Capturar cualquier error inesperado durante la inicialización
            console.error('Error fatal durante la inicialización de AuthProvider:', e);
            setInitializationError('Error crítico de inicialización. Por favor, limpia el almacenamiento local (localStorage) y recarga la página.');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfile = async (data) => {
        try {
            // Llamar a la API de actualización
            await authService.updateProfile(data); 

            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            return currentUser;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        hasRole: (roleId) => user && user.rol_id === roleId
    };

    //Muestra error Crítico de inicialización
    if (initializationError) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <Alert variant="danger" className="p-4 shadow">
                    <h4 className="alert-heading">❌ Error Crítico</h4>
                    <p>{initializationError}</p>
                    <hr />
                    <p className="mb-0">
                        Sigue los pasos en la sección 2 para resolverlo.
                    </p>
                </Alert>
            </div>
        );
    }
    
    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};