import { useState } from 'react';
import { useBitfield } from '../../context/BitContext';
import './BitDisplay.css';

const BitDisplay = () => {
    const { value, toggleBit, selection, setSelection } = useBitfield();
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);

    const handleMouseDown = (index) => {
        setIsDragging(true);
        setDragStart(index);
        setSelection({ start: index, end: index });
    };

    const handleMouseEnter = (index) => {
        if (isDragging) {
            setSelection({ start: dragStart, end: index });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
    };

    const handleBitClick = (index) => {
        // If it was a drag, we don't toggle. If it was a simple click (start===end), we toggle?
        // Actually, the user wants to select ranges. 
        // Let's separate selection from toggling. 
        // Maybe double click to toggle? Or just click to toggle if no drag.
        // For now, let's just handle selection. The user said "select/highlight them and then type".
        // Toggling might be a secondary action or via a button.
        // But a standard calculator allows clicking bits to toggle.
        // Let's say: Click = toggle AND select single bit. Drag = select range.
        if (dragStart === index) {
            toggleBit(index);
        }
    }

    const renderBits = () => {
        const bits = [];
        for (let i = 63; i >= 0; i--) {
            const isSet = (value & (1n << BigInt(i))) !== 0n;

            let isSelected = false;
            if (selection.start !== null && selection.end !== null) {
                const high = Math.max(selection.start, selection.end);
                const low = Math.min(selection.start, selection.end);
                isSelected = i >= low && i <= high;
            }

            bits.push(
                <div
                    key={i}
                    className={`bit ${isSet ? 'on' : 'off'} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleBitClick(i)}
                    onMouseDown={() => handleMouseDown(i)}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseUp={handleMouseUp}
                    title={`Bit ${i}`}
                >
                    <div className="bit-index">{i}</div>
                    <div className="bit-value">{isSet ? 1 : 0}</div>
                </div>
            );
        }
        return bits;
    };

    return (
        <div className="bit-display-container" onMouseLeave={handleMouseUp}>
            {renderBits()}
        </div>
    );
};

export default BitDisplay;
