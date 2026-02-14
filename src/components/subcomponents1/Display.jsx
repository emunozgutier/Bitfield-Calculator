import React from 'react';
import './Display.css';

const Display = ({ value, bitWidth, type = 'main' }) => {
    // Ensure value is a BigInt
    const safeValue = typeof value === 'bigint' ? value : BigInt(value || 0);

    const formatHex = (val) => {
        let hex = val.toString(16).toUpperCase();
        // Add padding if bitWidth is provided, but mostly just standard 0x
        // If we want fixed width based on bitWidth, we can padStart.
        // For now, let's keep it simple '0x...'
        // If bitWidth is provided, we can calculate expected hex chars.
        if (bitWidth) {
            const hexLength = Math.ceil(bitWidth / 4);
            hex = hex.padStart(hexLength, '0');
        }
        return `0x${hex}`;
    };

    const formatDec = (val) => {
        return val.toString(10);
    };

    const hexValue = formatHex(safeValue);
    const decValue = formatDec(safeValue);

    return (
        <div className={`display-container display-${type}`}>
            <div className="display-section" title="Hexadecimal">
                <span className="display-label">HEX</span>
                <span className="display-value">{hexValue}</span>
            </div>
            <div className="display-section" title="Decimal">
                <span className="display-label">DEC</span>
                <span className="display-value">{decValue}</span>
            </div>
        </div>
    );
};

export default Display;
