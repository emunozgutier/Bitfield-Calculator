
import { BitfieldProvider } from './context/BitContext';
import Calculator from './components/Calculator';
import Notes from './components/Notes';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>Bitfield Calculator</h1>
      <BitfieldProvider>
        <div className="main-layout">
          <div className="calculator-column">
            <Calculator />
          </div>
          <div className="notes-column">
            <Notes />
          </div>
        </div>
      </BitfieldProvider>
    </div>
  )
}

export default App
