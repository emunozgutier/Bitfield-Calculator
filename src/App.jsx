
import { BitfieldProvider } from './context/BitContext';
import Calculator from './components/Calculator';
import Notes from './components/Notes';
import './App.css';

function App() {
  return (
    <div className="container-fluid h-100 d-flex flex-column p-0">
      <header className="row flex-shrink-0 bg-dark text-white p-3 m-0 border-bottom border-secondary">
        <div className="col">
          <h1 className="h3 m-0">Bitfield Calculator</h1>
        </div>
      </header>
      <BitfieldProvider>
        <div className="row flex-grow-1 m-0 overflow-hidden">
          <div className="col-md-6 col-lg-5 p-3 d-flex flex-column border-end border-secondary bg-dark h-100 overflow-hidden">
            <Calculator />
          </div>
          <div className="col-md-6 col-lg-7 p-3 h-100 overflow-auto bg-dark">
            <Notes />
          </div>
        </div>
      </BitfieldProvider>
    </div>
  )
}

export default App
