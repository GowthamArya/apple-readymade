"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GameContextProps {
    isGameOpen: boolean;
    openGame: () => void;
    closeGame: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [isGameOpen, setIsGameOpen] = useState(false);

    const openGame = () => setIsGameOpen(true);
    const closeGame = () => setIsGameOpen(false);

    return (
        <GameContext.Provider value={{ isGameOpen, openGame, closeGame }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
};
