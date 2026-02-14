import Display from './Display';
import { useBitfieldStore } from '../../store/useBitfieldStore';
import './CreatedBitfields.css';

const CreatedBitfields = () => {
    const { savedFields, removeSavedField, updateSavedField, value, bitWidth } = useBitfieldStore();

    const getFieldValue = (start, end) => {
        try {
            if (typeof start !== 'number' || typeof end !== 'number') return 0n;
            const high = Math.max(start, end);
            const low = Math.min(start, end);
            const mask = (1n << BigInt(high - low + 1)) - 1n;
            const shifedValue = (value >> BigInt(low)) & mask;
            return shifedValue;
        } catch (e) {
            console.error("Error calculating value", e);
            return 0n;
        }
    };



    const increment = (field, type) => {
        const currentVal = field[type];
        if (currentVal >= bitWidth - 1) return;
        updateSavedField(field.id, { [type]: currentVal + 1 });
    };

    const decrement = (field, type) => {
        const currentVal = field[type];
        if (currentVal <= 0) return;
        updateSavedField(field.id, { [type]: currentVal - 1 });
    };

    return (
        <div className="created-bitfields-container">
            <h3>Created Bitfields</h3>

            <div className="fields-list">
                {savedFields.length === 0 ? (
                    <div className="empty-state">No saved fields</div>
                ) : (
                    savedFields.map((field) => {
                        const val = getFieldValue(field.start, field.end);
                        return (
                            <div key={field.id} className="bitfield-item">
                                <span className="bitfield-name" title={field.name}>{field.name}</span>

                                <div className="bitfield-controls">
                                    <div className="control-group">
                                        <label>Start</label>
                                        <div className="control-inputs">
                                            <button onClick={() => increment(field, 'start')}>▲</button>
                                            <span>{field.start}</span>
                                            <button onClick={() => decrement(field, 'start')}>▼</button>
                                        </div>
                                    </div>
                                    <div className="control-group">
                                        <label>End</label>
                                        <div className="control-inputs">
                                            <button onClick={() => increment(field, 'end')}>▲</button>
                                            <span>{field.end}</span>
                                            <button onClick={() => decrement(field, 'end')}>▼</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bitfield-value">
                                    <Display value={val} type="compact" />
                                </div>

                                <button
                                    className="delete-btn"
                                    onClick={() => removeSavedField(field.id)}
                                    title="Delete field"
                                >
                                    &times;
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};


export default CreatedBitfields;
