import { createContext, useContext, useState } from 'react';
import * as BitMath from '../utils/bitMath';

const BitfieldContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useBitfield = () => useContext(BitfieldContext);

export const BitfieldProvider = ({ children }) => {
    const [value, setValue] = useState(0n);
    const [selection, setSelection] = useState({ start: null, end: null });
    const [isSelecting, setIsSelecting] = useState(false);

    // Actions
    const toggleBit = (index) => {
        setValue((prev) => BitMath.toggleBit(prev, index));
    };

    const updateRange = (newVal) => {
        if (selection.start === null || selection.end === null) return;
        setValue((prev) => BitMath.setRange(prev, selection.start, selection.end, newVal));
    };

    return (
        <BitfieldContext.Provider
            value={{
                value,
                setValue,
                selection,
                setSelection,
                isSelecting,
                setIsSelecting,
                toggleBit,
                updateRange,
            }}
        >
            {children}
        </BitfieldContext.Provider>
    );
};
