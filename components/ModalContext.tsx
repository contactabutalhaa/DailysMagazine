'use client';

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isNewsletterOpen: boolean;
  openNewsletter: () => void;
  closeNewsletter: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openNewsletter = () => setIsNewsletterOpen(true);
  const closeNewsletter = () => setIsNewsletterOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isSearchOpen,
        openSearch,
        closeSearch,
        isNewsletterOpen,
        openNewsletter,
        closeNewsletter,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
}
