import { useBitfield } from '../context/BitContext';
import './ValueDisplay.css';

const ValueDisplay = () => {
    const { value, selection } = useBitfield();

    const formatHex = (val) => {
        return '0x' + val.toString(16).toUpperCase();
    };

    const formatDec = (val) => {
        return val.toString(10);
    };

    let selectedValue = null;
    let rangeText = '';

    if (selection.start !== null && selection.end !== null) {
        const high = Math.max(selection.start, selection.end);
        const low = Math.min(selection.start, selection.end);
        selectedValue = (value >> BigInt(low)) & ((1n << BigInt(high - low + 1)) - 1n);
        rangeText = `[${high}:${low}]`;
    }

    return (
        <div className="value-display">
            <div className="value-group main-value">
                <label>Full Value (64-bit)</label>
                <div className="display-box hex">{formatHex(value)}</div>
                <div className="display-box dec">{formatDec(value)}</div>
            </div>

            {selectedValue !== null && (
                <div className="value-group selection-value">
                    <label>Selection {rangeText}</label>
                    <div className="display-box hex">{formatHex(selectedValue)}</div>
                    <div className="display-box dec">{formatDec(selectedValue)}</div>
                </div>
            )}
        </div>
    );
};

export default ValueDisplay;
