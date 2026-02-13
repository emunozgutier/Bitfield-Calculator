import { create } from 'zustand';
import * as BitMath from '../utils/bitMath';

export const useBitfieldStore = create((set) => ({
    value: 0n,
    bitWidth: 64,
    selection: { start: null, end: null },
    isSelecting: false,
    savedFields: [],

    setValue: (val) => set((state) => {
        const mask = (1n << BigInt(state.bitWidth)) - 1n;
        return { value: val & mask };
    }),

    setBitWidth: (width) => set((state) => {
        const mask = (1n << BigInt(width)) - 1n;
        return {
            bitWidth: width,
            value: state.value & mask
        };
    }),

    setSelection: (selection) => set({ selection }),

    setIsSelecting: (isSelecting) => set({ isSelecting }),

    toggleBit: (index) => set((state) => {
        if (index >= state.bitWidth) return state;
        return { value: BitMath.toggleBit(state.value, index) };
    }),

    updateRange: (newVal) => set((state) => {
        if (state.selection.start === null || state.selection.end === null) return state;
        return {
            value: BitMath.setRange(state.value, state.selection.start, state.selection.end, newVal)
        };
    }),

    addSavedField: (name, start, end) => set((state) => ({
        savedFields: [...state.savedFields, {
            id: Date.now(),
            name,
            start: Math.min(start, end),
            end: Math.max(start, end)
        }]
    })),

    removeSavedField: (id) => set((state) => ({
        savedFields: state.savedFields.filter((field) => field.id !== id)
    })),
}));
