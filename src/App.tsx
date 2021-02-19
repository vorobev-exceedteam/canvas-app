import './App.scss';
import Canvas from './Canvas';
import CanvasItemModel from './models/CanvasItemModel';

const rectang1 = new Path2D();
rectang1.rect(0, 0, 100, 100);
const circl1 = new Path2D();
circl1.arc(50, 40, 50, 0, 2 * Math.PI);
const circl2 = new Path2D();
circl2.arc(0, 0, 70, 0, 2 * Math.PI);
const eleps = new Path2D();
eleps.ellipse(0, 0, 30, 70, Math.PI / 4, 0, 2 * Math.PI);
function App() {
  return (
    <div className="App">
      <Canvas
        items={[
          new CanvasItemModel(rectang1, 0, 0, 'red'),
          new CanvasItemModel(circl1, 150, 150),
          new CanvasItemModel(circl2, 200, 350, 'green'),
          new CanvasItemModel(circl1, 10, 410, 'blue'),
          new CanvasItemModel(eleps, 400, 400, 'orange')
        ]}
      />
    </div>
  );
}

export default App;
