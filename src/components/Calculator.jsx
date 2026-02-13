import { useState } from 'react';
import { useBitfieldStore } from '../store/useBitfieldStore';
import BitDisplay from './subcomponents1/BitDisplay';
import Keypad from './subcomponents1/Keypad';
import './Calculator.css';

const Calculator = () => {
    const { bitWidth, setBitWidth, selection, addSavedField } = useBitfieldStore();
    const [fieldName, setFieldName] = useState('');

    const handleSave = () => {
        try {
            if (selection.start !== null && selection.end !== null) {
                const high = Math.max(selection.start, selection.end);
                const low = Math.min(selection.start, selection.end);
                const name = fieldName.trim() || `Field [${high}:${low}]`;

                addSavedField(name, selection.start, selection.end);
                setFieldName('');
            }
        } catch (error) {
            console.error("Failed to save field:", error);
        }
    };

    const isSelectionActive = selection.start !== null && selection.end !== null;

    return (
        <div className="d-flex flex-column gap-3 h-100 overflow-hidden">
            <div className="card bg-secondary text-white border-0 shadow-sm flex-shrink-0" style={{ minHeight: 0 }}>
                <div className="card-header border-bottom border-dark d-flex justify-content-between align-items-center flex-shrink-0">
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
                <div className="card-body p-2 overflow-auto">
                    <BitDisplay />
                </div>
                <div className="card-footer bg-dark border-top border-secondary p-2 d-flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={!isSelectionActive}
                        className={`btn btn-sm w-100 ${isSelectionActive ? 'btn-success fw-bold' : 'btn-secondary'}`}
                    >
                        Add Current Selection
                    </button>
                </div>
            </div>

            <div className="card bg-secondary text-white border-0 shadow-sm flex-grow-1 overflow-hidden">
                <div className="card-body p-2 h-100 d-flex flex-column">
                    <Keypad />
                </div>
            </div>
        </div>
    );
}

export default Calculator;
