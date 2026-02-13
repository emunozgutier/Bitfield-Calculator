import { useBitfieldStore } from '../../store/useBitfieldStore';
import './CreatedBitfields.css';

const CreatedBitfields = () => {
    const { savedFields, removeSavedField, value } = useBitfieldStore();

    const getFieldValue = (start, end) => {
        try {
            if (typeof start !== 'number' || typeof end !== 'number') return { hex: 'Err', dec: 'Err' };
            const high = Math.max(start, end);
            const low = Math.min(start, end);
            const mask = (1n << BigInt(high - low + 1)) - 1n;
            const shifedValue = (value >> BigInt(low)) & mask;
            return {
                hex: '0x' + shifedValue.toString(16).toUpperCase(),
                dec: shifedValue.toString(10)
            };
        } catch (e) {
            console.error("Error calculating value", e);
            return { hex: '0x0', dec: '0' };
        }
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
                                <div className="bitfield-header">
                                    <span className="bitfield-name">{field.name}</span>
                                    <span className="bitfield-range">[{field.end}:{field.start}]</span>
                                    <button
                                        className="delete-btn"
                                        onClick={() => removeSavedField(field.id)}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="bitfield-values">
                                    <span className="hex">{val.hex}</span>
                                    <span className="dec">{val.dec}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CreatedBitfields;
