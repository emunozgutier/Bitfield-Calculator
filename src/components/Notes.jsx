import History from './subcomponents1/History';
import CreatedBitfields from './subcomponents1/CreatedBitfields';
import './Notes.css';

const Notes = () => {
    return (
        <div className="notes-container">
            <div className="notes-section">
                <History />
            </div>
            <div className="notes-section">
                <CreatedBitfields />
            </div>
        </div>
    );
};

export default Notes;
