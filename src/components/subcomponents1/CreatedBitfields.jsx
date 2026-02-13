import { useState } from 'react';
import { useBitfield } from '../../context/BitContext';
import './CreatedBitfields.css';

const CreatedBitfields = () => {
    const { savedFields, addSavedField, removeSavedField, selection, value } = useBitfield();
    const [fieldName, setFieldName] = useState('');

    const handleSave = () => {
        if (selection.start !== null && selection.end !== null) {
            const high = Math.max(selection.start, selection.end);
            const low = Math.min(selection.start, selection.end);
            const name = fieldName.trim() || `Field [${high}:${low}]`;

            addSavedField(name, selection.start, selection.end);
            setFieldName('');
        }
    };

    const isSelectionActive = selection.start !== null && selection.end !== null;

    // ... getFieldValue ...

    return (
        <div className="created-bitfields-container">
            <h3>Created Bitfields</h3>

            <div className="add-field-form">
                <input
                    type="text"
                    placeholder="Field Name"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                />
                <button
                    onClick={handleSave}
                    disabled={!isSelectionActive}
                    className={isSelectionActive ? 'btn-highlight' : ''}
                >
                    Add Current Selection
                </button>
                {selection.start !== null && (
                    <div className="selection-preview">
                        Selection: [{Math.max(selection.start, selection.end)}:{Math.min(selection.start, selection.end)}]
                    </div>
                )}
            </div>

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
