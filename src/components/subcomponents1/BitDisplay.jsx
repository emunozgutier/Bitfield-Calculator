import { useState } from 'react';
import { useBitfieldStore } from '../../store/useBitfieldStore';
import './BitDisplay.css';

const BitDisplay = () => {
    const { value, toggleBit, selection, setSelection, bitWidth } = useBitfieldStore();
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

    // We need to group bits by 4.
    // And render them.
    // We can use a different layout strategy. Flex-wrap with margins?
    // Or grid with specific gaps.

    const renderBits = () => {
        const rows = [];
        // bitWidth from store

        for (let rowBase = bitWidth - 1; rowBase >= 0; rowBase -= 16) {
            const rowGroups = [];
            for (let i = rowBase; i > rowBase - 16; i -= 4) {
                if (i < 0) break;

                const groupBits = [];
                for (let j = 0; j < 4; j++) {
                    const bitIndex = i - j;
                    if (bitIndex < 0) break;

                    const isSet = (value & (1n << BigInt(bitIndex))) !== 0n;
                    let isSelected = false;
                    if (selection.start !== null && selection.end !== null) {
                        const high = Math.max(selection.start, selection.end);
                        const low = Math.min(selection.start, selection.end);
                        isSelected = bitIndex >= low && bitIndex <= high;
                    }

                    groupBits.push(
                        <div
                            key={bitIndex}
                            className={`bit ${isSet ? 'on' : 'off'} ${isSelected ? 'selected' : ''}`}
                            onMouseDown={() => handleMouseDown(bitIndex)}
                            onMouseEnter={() => handleMouseEnter(bitIndex)}
                            onMouseUp={handleMouseUp}
                            onClick={() => {
                                if (selection.start === selection.end) {
                                    toggleBit(bitIndex);
                                }
                            }}
                            title={`Bit ${bitIndex}`}
                        >
                            <div className="bit-index">{bitIndex}</div>
                            <div className="bit-value">{isSet ? 1 : 0}</div>
                        </div>
                    );
                }
                rowGroups.push(
                    <div key={`group-${i}`} className="bit-group">
                        {groupBits}
                    </div>
                );
            }
            rows.push(
                <div key={`row-${rowBase}`} className="bit-row">
                    {rowGroups}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="bit-display-wrapper" onMouseLeave={handleMouseUp}>
            <div className="bit-display-container">
                {renderBits()}
            </div>
        </div>
    );
};

export default BitDisplay;
