import { createContext, useContext, useState } from 'react';
import * as BitMath from '../utils/bitMath';

const BitfieldContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useBitfield = () => useContext(BitfieldContext);

export const BitfieldProvider = ({ children }) => {
    const [value, setValue] = useState(0n);
    const [bitWidth, setBitWidth] = useState(64);
    const [selection, setSelection] = useState({ start: null, end: null });
    const [isSelecting, setIsSelecting] = useState(false);
    const [savedFields, setSavedFields] = useState([]);

    // Actions
    const toggleBit = (index) => {
        if (index >= bitWidth) return;
        setValue((prev) => {
            return BitMath.toggleBit(prev, index);
        });
    };

    const updateRange = (newVal) => {
        if (selection.start === null || selection.end === null) return;
        setValue((prev) => {
            return BitMath.setRange(prev, selection.start, selection.end, newVal);
        });
    };

    const addSavedField = (name, start, end) => {
        setSavedFields((prev) => [...prev, { id: Date.now(), name, start: Math.min(start, end), end: Math.max(start, end) }]);
    };

    const removeSavedField = (id) => {
        setSavedFields((prev) => prev.filter((field) => field.id !== id));
    };

    const setBitfieldValue = (val) => {
        // Mask value to bitWidth
        let mask = (1n << BigInt(bitWidth)) - 1n;
        setValue(val & mask);
    }

    const setWidth = (width) => {
        setBitWidth(width);
        // Trim value if needed
        setValue(prev => prev & ((1n << BigInt(width)) - 1n));
    }

    return (
        <BitfieldContext.Provider
            value={{
                value,
                setValue: setBitfieldValue,
                bitWidth,
                setBitWidth: setWidth,
                selection,
                setSelection,
                isSelecting,
                setIsSelecting,
                toggleBit,
                updateRange,
                savedFields,
                addSavedField,
                removeSavedField
            }}
        >
            {children}
        </BitfieldContext.Provider>
    );
};
