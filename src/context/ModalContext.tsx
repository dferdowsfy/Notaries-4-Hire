import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    isLoginOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
    isGetListedOpen: boolean;
    openGetListed: (role?: 'notary' | 'tipic') => void;
    closeGetListed: () => void;
    getListedRole: 'notary' | 'tipic';
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isGetListedOpen, setIsGetListedOpen] = useState(false);
    const [getListedRole, setGetListedRole] = useState<'notary' | 'tipic'>('notary');

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);
    const openGetListed = (role: 'notary' | 'tipic' = 'notary') => {
        setGetListedRole(role);
        setIsGetListedOpen(true);
    };
    const closeGetListed = () => setIsGetListedOpen(false);

    return (
        <ModalContext.Provider value={{
            isLoginOpen,
            openLogin,
            closeLogin,
            isGetListedOpen,
            openGetListed,
            closeGetListed,
            getListedRole
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
