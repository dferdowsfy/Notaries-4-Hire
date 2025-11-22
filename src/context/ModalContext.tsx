import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    isLoginOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
    isGetListedOpen: boolean;
    openGetListed: () => void;
    closeGetListed: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isGetListedOpen, setIsGetListedOpen] = useState(false);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);
    const openGetListed = () => setIsGetListedOpen(true);
    const closeGetListed = () => setIsGetListedOpen(false);

    return (
        <ModalContext.Provider value={{
            isLoginOpen,
            openLogin,
            closeLogin,
            isGetListedOpen,
            openGetListed,
            closeGetListed
        }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
