import './App.scss';
import Canvas from './Canvas';
import mockItems from './models/MockItems';

function App() {
  return (
    <div className="App">
      <Canvas
        items={mockItems}
      />
    </div>
  );
}

export default App;
