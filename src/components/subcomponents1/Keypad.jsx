import { useState, useEffect, useCallback } from 'react';
import { useBitfieldStore } from '../../store/useBitfieldStore';
import './Keypad.css';

const Keypad = () => {
    const { selection, setValue, value } = useBitfieldStore();
    const [input, setInput] = useState('');
    const [inputMode, setInputMode] = useState('HEX'); // 'HEX' or 'DEC'

    const parseInput = (valStr, mode) => {
        try {
            if (valStr.startsWith('0d')) return BigInt(valStr.substring(2));
            if (valStr.startsWith('0x')) return BigInt(valStr);
            if (valStr.startsWith('0b')) return BigInt(valStr); // Support binary just in case

            if (mode === 'DEC') {
                return BigInt(valStr);
            } else {
                // HEX mode default
                return BigInt('0x' + valStr);
            }
        } catch (e) {
            return null;
        }
    };

    const executeCommand = useCallback(() => {
        if (!input) return;

        let val = parseInput(input.toLowerCase(), inputMode);

        if (val !== null) {
            setValue(val);
            setInput('');
        } else {
            console.error("Invalid input");
        }
    }, [input, inputMode, setValue]);

    const handlePress = useCallback((key) => {
        if (key === 'CLEAR') {
            setInput('');
        } else if (key === 'BACK') {
            setInput(prev => prev.slice(0, -1));
        } else if (key === 'ENTER') {
            executeCommand();
        } else if (key === 'HEX') {
            setInputMode('HEX');
            setInput('');
        } else if (key === 'DEC') {
            setInputMode('DEC');
            setInput('');
        } else {
            setInput(prev => prev + key);
        }
    }, [executeCommand]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();
            if (/[0-9]/.test(key)) {
                setInput(prev => prev + key);
            } else if (/[A-F]/.test(key)) {
                if (inputMode === 'HEX') {
                    setInput(prev => prev + key);
                }
            } else if (key === 'ENTER') {
                handlePress('ENTER');
            } else if (key === 'BACKSPACE') {
                handlePress('BACK');
            } else if (key === 'X') {
                if (inputMode === 'HEX') setInput(prev => prev + 'x');
            } else if (key === 'D') {
                setInput(prev => prev + 'd');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePress, inputMode]);

    const getDisplayValues = () => {
        // If user is typing, show input in main line, and parsed value in other?
        // Or just show input.
        // User said: "on the calculator dispaly it should show hex in one line and decimal in the other."
        // If input is empty, show current value in both.
        // If input is active, show input and ... ?

        if (input) {
            // Show input being typed
            return {
                primary: input,
                secondary: '...', // Or try to preview parse?
                primaryLabel: inputMode
            };
        } else {
            return {
                primary: '0x' + value.toString(16).toUpperCase(),
                secondary: value.toString(10),
                primaryLabel: 'HEX',
                secondaryLabel: 'DEC'
            };
        }
    };

    const display = getDisplayValues();

    return (
        <div className="keypad-container">
            <div className="display-area">
                <div className="display-line primary">
                    <span className="label">{display.primaryLabel}</span>
                    <span className="value">{display.primary}</span>
                </div>
                {/* Only show secondary if not typing or we want to show preview? 
                     User request: "show hex in one line and decimal in the other" implies always.
                     But if typing 'A', we don't know dec yet unless we parse on fly. 
                     For now let's just show current value in secondary if input is empty.
                     If input is present, maybe hide secondary or show 'Typing...'
                 */}
                {!input && (
                    <div className="display-line secondary">
                        <span className="label">{display.secondaryLabel}</span>
                        <span className="value">{display.secondary}</span>
                    </div>
                )}
            </div>

            <div className="keys-grid">
                <button
                    className={`mode-btn ${inputMode === 'HEX' ? 'active' : ''}`}
                    onClick={() => handlePress('HEX')}
                >
                    HEX
                </button>
                <button
                    className={`mode-btn ${inputMode === 'DEC' ? 'active' : ''}`}
                    onClick={() => handlePress('DEC')}
                >
                    DEC
                </button>
                <button onClick={() => handlePress('CLEAR')}>CLEAR</button>
                <button onClick={() => handlePress('BACK')}>BACK</button>

                {['D', 'E', 'F'].map(k => (
                    <button
                        key={k}
                        onClick={() => handlePress(k)}
                        disabled={inputMode === 'DEC'}
                        className={inputMode === 'DEC' ? 'btn-disabled' : ''}
                    >
                        {k}
                    </button>
                ))}
                <button onClick={() => handlePress('0d')}>0d</button>

                {['A', 'B', 'C'].map(k => (
                    <button
                        key={k}
                        onClick={() => handlePress(k)}
                        disabled={inputMode === 'DEC'}
                        className={inputMode === 'DEC' ? 'btn-disabled' : ''}
                    >
                        {k}
                    </button>
                ))}
                <button onClick={() => handlePress('0x')}>0x</button>

                {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map(k => (
                    <button key={k} onClick={() => handlePress(k)}>{k}</button>
                ))}

                <button className="enter-key" onClick={() => handlePress('ENTER')}>ENTER</button>
            </div>
            <div className="help-text">
                Mode: {inputMode}. Type value and press ENTER.
            </div>
        </div>
    );
};

export default Keypad;
