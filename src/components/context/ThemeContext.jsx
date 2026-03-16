import React, { createContext, useEffect, useState } from "react";

// Create Theme Context
const ThemeContext = createContext({
    theme: "light",
    toggleTheme: () => {},
});

// Helper: get initial theme
const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    return "light";
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;

        // Remove existing theme classes
        root.classList.remove("light", "dark");
        // Add current theme class
        root.classList.add(theme);

        // Save to localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;