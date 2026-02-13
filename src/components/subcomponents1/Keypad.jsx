import { useState, useEffect, useCallback } from 'react';
import { useBitfield } from '../../context/BitContext';
import './Keypad.css';

const Keypad = () => {
    const { selection, updateRange, setValue } = useBitfield();
    const [input, setInput] = useState('');

    // Define executeCommand first or inside useCallback?
    // It depends on state.

    const executeCommand = useCallback(() => {
        if (!input) return;

        let val = 0n;
        let valStr = input.toLowerCase();

        try {
            if (valStr.startsWith('0d')) {
                val = BigInt(valStr.substring(2));
            } else if (valStr.startsWith('0x')) {
                val = BigInt(valStr);
            } else {
                // Default to hex if valid, else dec? Or just assuming hex for a programmer calc?
                // User said "0d9" specifically. So maybe default is Hex?
                // Let's assume Hex if it has A-F, otherwise ambiguous...
                // Actually, standard is usually: 0x for hex, 0b for binary, otherwise decimal.
                // But in many programmer calcs, you are in "Hex mode" or "Dec mode".
                // Let's try to parse as Hex if it matches hex range, but standard BigInt constructor handles 0x.
                // If I just type "F", BigInt("F") throws. BigInt("0xF") works.
                // So if it's just hex digits, I should probably prepend 0x if I assume hex.
                // But the user said "0d9". So they are explicit.
                // If they type just "9", is it dec or hex? 9 is same in both.
                // If they type "10", is it ten or sixteen?
                // Let's support explicit prefixes '0d', '0x', '0b'.
                // If no prefix, let's treat as Hex if it contains A-F, else...
                // Let's just treat standard BigInt parsing.
                // If the user types "FF", `BigInt("FF")` fails.
                // Let's check if it's valid hex and prepend 0x?

                if (/^[0-9]+$/.test(valStr)) {
                    val = BigInt(valStr); // Treat as decimal by default if all digits?
                    // Or maybe the user wants hex default.
                    // Let's stick to explicit prefixes for now or simple decimal default.
                    // Actually, usually programmer calcs default to the current view mode.
                    // I'll stick to: must use 0x for hex, 0d for dec, or just numbers for dec.
                } else {
                    // Try adding 0x
                    val = BigInt('0x' + valStr);
                }
            }

            if (selection.start !== null && selection.end !== null) {
                updateRange(val);
                setInput('');
            } else {
                // Set whole value?
                setValue(val);
                setInput('');
            }

        } catch (e) {
            console.error("Invalid input", e);
            // Shake effect or error state?
            // For now just ignore
        }
    }, [input, selection, updateRange, setValue]);

    const handlePress = useCallback((key) => {
        if (key === 'CLEAR') {
            setInput('');
        } else if (key === 'BACK') {
            setInput(prev => prev.slice(0, -1));
        } else if (key === 'ENTER') {
            executeCommand();
        } else {
            setInput(prev => prev + key);
        }
    }, [executeCommand]); // executeCommand changes when input changes, so this is fine.

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();
            if (/[0-9A-F]/.test(key) && key.length === 1) {
                setInput(prev => prev + key);
            } else if (key === 'ENTER') {
                handlePress('ENTER');
            } else if (key === 'BACKSPACE') {
                handlePress('BACK');
            } else if (key === 'X') {
                setInput(prev => prev + 'x'); // Allow typing 0x
            } else if (key === 'D') {
                setInput(prev => prev + 'd'); // Allow typing 0d
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePress]);
    // Actually handlePress depends on state if I called it directly, but I'm setting state.
    // executeCommand depends on state 'input' and 'selection'.
    // So the effect needs to access current input.
    // The easiest way is to use a ref or just let the effect depend on input.

    // Correction: handlePress calls executeCommand which uses 'input'. 
    // If I bind handleKeyDown, it closes over 'input'.
    // So I need 'input' in dependency array.

    // Better: split the key handler to not rely on closure for 'input' state setter, 
    // but ENTER needs current input.
    // I will rewrite this to use a ref for input or just clean dependencies.

    return (
        <div className="keypad-container">
            <div className="input-display">{input || 'Ready...'}</div>
            <div className="keys-grid">
                {['D', 'E', 'F', 'CLEAR'].map(k => <button key={k} onClick={() => handlePress(k)}>{k}</button>)}
                {['A', 'B', 'C', 'BACK'].map(k => <button key={k} onClick={() => handlePress(k)}>{k}</button>)}
                {['7', '8', '9', '0d'].map(k => <button key={k} onClick={() => handlePress(k)}>{k}</button>)}
                {['4', '5', '6', '0x'].map(k => <button key={k} onClick={() => handlePress(k)}>{k}</button>)}
                {['1', '2', '3', 'ENTER'].map(k => <button key={k} className={k === 'ENTER' ? 'enter-key' : ''} onClick={() => handlePress(k)}>{k}</button>)}
                {['0', '', '', ''].map((k, i) => k ? <button key={k} className="zero-key" onClick={() => handlePress(k)}>{k}</button> : <div key={i}></div>)}
            </div>
            <div className="help-text">
                Tip: Select bits above, then type value (e.g., "0d9", "0xFF", "12") and pressing ENTER.
            </div>
        </div>
    );
};

export default Keypad;
