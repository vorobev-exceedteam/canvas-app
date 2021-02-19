import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import './styles.scss';
import CanvasItemModel from '../../models/CanvasItemModel';
import CanvasItemHistory from '../../models/CanvasItemHistory';

interface CanvasProps extends HTMLAttributes<HTMLCanvasElement> {
  items: CanvasItemModel[];
}

function Canvas({ items, ...rest }: CanvasProps): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<CanvasItemModel | null>(
    null
  );
  const [clickedCord, setClickedCord] = useState<[number, number]>([0, 0]);
  const [canvasItems, setItems] = useState<CanvasItemModel[]>(items || []); // todo is it really needed?
  const [rerenderInterval, setRerenderInterval] = useState<number>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCanvasContext = useCallback(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    return { canvas, context };
  }, [canvasRef]);

  const drawObjects = useCallback(() => {
    const { context, canvas } = getCanvasContext();

    function drawObject(object: CanvasItemModel): void {
      context.beginPath();
      context.fill(object.path);
      context.closePath();
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvasItems.forEach((item) => drawObject(item));
  }, [canvasItems, getCanvasContext]);

  const start = useCallback(() => {
    setRerenderInterval(
      window.setInterval(() => {
        drawObjects();
      }, 17)
    );
  }, [drawObjects]);

  const save = useCallback(() => {
    CanvasItemHistory.saveState(canvasItems);
  }, [canvasItems]);

  const undo = useCallback(() => {
    const states = CanvasItemHistory.getRecentStates();
    canvasItems.forEach((item, key) => {
      const state = states?.get(key);
      if (state) {
        item.restoreState(state);
      }
    });
  }, [canvasItems]);

  const stop = useCallback(() => {
    window.clearInterval(rerenderInterval);
  }, [rerenderInterval]);

  const reset = useCallback(()=>{
    const states = CanvasItemHistory.defaultSnapshot;
    canvasItems.forEach((item, key) => {
      const state = states?.get(key);
      if (state) {
        item.restoreState(state);
      }
    });
  }, [canvasItems])

  const handleUndo = useCallback(() => {
    undo();
    drawObjects();
  }, [drawObjects, undo]);

  const handleReset = useCallback(()=>{
    reset()
    drawObjects()
  }, [drawObjects, reset])

  useEffect(() => {
    drawObjects();
    CanvasItemHistory.setDefaultSnapshot(canvasItems);
  }, [])

  useEffect(() => {
    const { canvas, context } = getCanvasContext();

    function onMouseMove(event: MouseEvent) {

      if (selectedItem) {
        selectedItem.moveItem(event.offsetX, event.offsetY, ...clickedCord);
      }
    }

    function onMouseDown(event: MouseEvent) {
      for (let item of canvasItems) {
        if (context.isPointInPath(item.path, event.offsetX, event.offsetY)) {
          save();
          setClickedCord([
            event.offsetX - item.xLoc,
            event.offsetY - item.yLoc
          ]);
          setSelectedItem(item);
          start();
          break;
        }
      }
    }

    function onMouseUp(event: MouseEvent) {
      stop();
      setSelectedItem(null);
      setClickedCord([0, 0]);
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);

    return function () {
      window.clearInterval(rerenderInterval);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [
    canvasItems,
    clickedCord,
    drawObjects,
    getCanvasContext,
    rerenderInterval,
    save,
    selectedItem,
    setSelectedItem,
    start,
    stop
  ]);

  return (
    <>
      <div className={'canvas-container'}>
        <canvas height={700} width={700} ref={canvasRef} {...rest} />
      </div>
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleReset}>Reset</button>
      <button>Import</button>
      <button>Export</button>
    </>
  );
}

export default Canvas;
