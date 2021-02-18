import './App.css';
import Canvas from './containers/Canvas';
import CanvasItemModel from './models/CanvasItemModel';

const rectang = new Path2D();
rectang.rect(0,0,100,100);
const circl = new Path2D();
circl.arc(50,40,50,0,2*Math.PI)

function App() {
  return (
    <div className="App">
      <Canvas
        items={[
          new CanvasItemModel(rectang),
          new CanvasItemModel(circl, 150, 150)
        ]}
      />
    </div>
  );
}


export default App;
