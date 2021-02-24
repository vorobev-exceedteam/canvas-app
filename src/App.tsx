import './App.scss';
import Canvas from './Canvas';
import mockItems from './models/MockItems';
import { useMemo } from 'react';
import CanvasItemHistory from './models/CanvasItemHistory';

function App() {
  const history = useMemo(() => new CanvasItemHistory(), []);

  return (
    <div className="App">
      <Canvas items={mockItems} history={history} />
    </div>
  );
}

export default App;
