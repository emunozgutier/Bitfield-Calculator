
import Calculator from './components/Calculator';
import Notes from './components/Notes';
import './App.css';

function App() {
  return (
    <div className="container-fluid vh-100 p-3 bg-dark text-white overflow-hidden">
      <div className="row h-100 g-3">
        <div className="col-12 col-custom-70 h-100 overflow-hidden">
          <Calculator />
        </div>
        <div className="col-12 col-custom-30 h-100 overflow-hidden">
          <Notes />
        </div>
      </div>
    </div>
  );
}

export default App
