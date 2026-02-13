import { BitfieldProvider } from './context/BitContext';
import BitDisplay from './components/BitDisplay';
import ValueDisplay from './components/ValueDisplay';
import Keypad from './components/Keypad';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>Bitfield Calculator</h1>
      <BitfieldProvider>
        <div className="calculator-layout">
          <BitDisplay />
          <div className="controls-area">
            <ValueDisplay />
            <Keypad />
          </div>
        </div>
      </BitfieldProvider>
    </div>
  )
}

export default App
