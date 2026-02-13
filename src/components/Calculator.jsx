import { useBitfield } from '../context/BitContext';
import BitDisplay from './subcomponents1/BitDisplay';
import Keypad from './subcomponents1/Keypad';
import './Calculator.css'; // We might need new CSS or reuse ValueDisplay styles here

const Calculator = () => {
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

    const { bitWidth, setBitWidth } = useBitfield();

    return (
        <div className="d-flex flex-column gap-3 h-100">
            <div className="card bg-secondary text-white border-0 shadow-sm flex-shrink-0">
                <div className="card-header border-bottom border-dark d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Bit Display</span>
                    <div className="btn-group btn-group-sm">
                        {[64, 32, 16].map(width => (
                            <button
                                key={width}
                                className={`btn ${bitWidth === width ? 'btn-primary' : 'btn-dark'}`}
                                onClick={() => setBitWidth(width)}
                            >
                                {width}-bit
                            </button>
                        ))}
                    </div>
                </div>
                <div className="card-body p-3">
                    <BitDisplay />
                </div>
            </div>

            <div className="card bg-secondary text-white border-0 shadow-sm flex-grow-1 overflow-hidden">
                <div className="card-body p-3 h-100 d-flex flex-column">
                    <Keypad />
                </div>
            </div>
        </div>
    );
}

export default Calculator;
