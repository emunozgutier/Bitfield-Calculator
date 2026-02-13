import { useBitfield } from '../../context/BitContext';
import './History.css';

const History = () => {
    const { history, setValue } = useBitfield();

    const formatHex = (val) => '0x' + val.toString(16).toUpperCase();

    return (
        <div className="history-container">
            <h3>History</h3>
            <div className="history-list">
                {history.length === 0 ? (
                    <div className="empty-state">No history yet</div>
                ) : (
                    history.map((item, index) => (
                        <div key={index} className="history-item" onClick={() => setValue(item.value, "Restore History")}>
                            <div className="history-op">{item.operation}</div>
                            <div className="history-val">{formatHex(item.value)}</div>
                            <div className="history-time">{new Date(item.timestamp).toLocaleTimeString()}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default History;
