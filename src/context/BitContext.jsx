import { createContext, useContext, useState } from 'react';
import * as BitMath from '../utils/bitMath';

const BitfieldContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useBitfield = () => useContext(BitfieldContext);

export const BitfieldProvider = ({ children }) => {
    const [value, setValue] = useState(0n);
    const [selection, setSelection] = useState({ start: null, end: null });
    const [isSelecting, setIsSelecting] = useState(false);
    const [history, setHistory] = useState([]);
    const [savedFields, setSavedFields] = useState([]);

    // Actions
    const toggleBit = (index) => {
        setValue((prev) => {
            const newValue = BitMath.toggleBit(prev, index);
            addToHistory(newValue, `Toggle Bit ${index}`);
            return newValue;
        });
    };

    const updateRange = (newVal) => {
        if (selection.start === null || selection.end === null) return;
        setValue((prev) => {
            const newValue = BitMath.setRange(prev, selection.start, selection.end, newVal);
            addToHistory(newValue, `Update Range [${Math.max(selection.start, selection.end)}:${Math.min(selection.start, selection.end)}]`);
            return newValue;
        });
    };

    const addToHistory = (val, operation) => {
        setHistory((prev) => [{ timestamp: Date.now(), value: val, operation }, ...prev].slice(0, 50));
    };

    const addSavedField = (name, start, end) => {
        setSavedFields((prev) => [...prev, { id: Date.now(), name, start: Math.min(start, end), end: Math.max(start, end) }]);
    };

    const removeSavedField = (id) => {
        setSavedFields((prev) => prev.filter((field) => field.id !== id));
    };

    const setBitfieldValue = (val, operation = "Manual Set") => {
        setValue(val);
        addToHistory(val, operation);
    }

    return (
        <BitfieldContext.Provider
            value={{
                value,
                setValue: setBitfieldValue,
                selection,
                setSelection,
                isSelecting,
                setIsSelecting,
                toggleBit,
                updateRange,
                history,
                savedFields,
                addSavedField,
                removeSavedField
            }}
        >
            {children}
        </BitfieldContext.Provider>
    );
};
