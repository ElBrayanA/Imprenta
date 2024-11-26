import React, { createContext, useContext, useState } from 'react';

// Crear un contexto para el usuario
const UserContext = createContext();

// Hook personalizado para acceder al contexto
export const useUser = () => {
    return useContext(UserContext);
};

// Proveedor del contexto para envolver tu aplicación
export const UserProvider = ({ children }) => {
    const [User, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ User, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
