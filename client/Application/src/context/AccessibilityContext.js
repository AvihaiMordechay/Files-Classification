import { createContext, useContext, useState } from 'react';

const FontScaleContext = createContext({ scaleFactor: 0, setScaleFactor: () => { } });

export const FontScaleProvider = ({ children }) => {
    const [scaleFactor, setScaleFactor] = useState(0);

    return (
        <FontScaleContext.Provider value={{ scaleFactor, setScaleFactor }}>
            {children}
        </FontScaleContext.Provider>
    );
};

export const useFontScale = () => useContext(FontScaleContext);