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

    return (
        <div className="calculator-container">
            <BitDisplay />

            <Keypad />
        </div>
    );
}

export default Calculator;
