import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import './styles.scss';
import CanvasItemModel from '../models/CanvasItemModel';
import CanvasItemHistory from '../models/CanvasItemHistory';
import 'normalize.css';
import { Map } from 'immutable';

interface CanvasProps extends HTMLAttributes<HTMLCanvasElement> {
  items: CanvasItemModel[];
}

function Canvas({ items, ...rest }: CanvasProps): JSX.Element {
  const [selectedItems, setSelectedItems] = useState<
    Map<string, CanvasItemModel>
  >(Map<string, CanvasItemModel>());
  const [clickedCord, setClickedCord] = useState<[number, number]>([0, 0]);
  const [isDragging, setDraggingState] = useState<boolean>(false);
  const [rerenderInterval, setRerenderInterval] = useState<number>();

  const [canvasItems, setCanvasItems] = useState<CanvasItemModel[]>(
    items || []
  );

  useEffect(() => {
    setCanvasItems(items);
  }, [items]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCanvasContext = useCallback(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    return { canvas, context };
  }, [canvasRef]);

  const drawObjects = useCallback(() => {
    const { context, canvas } = getCanvasContext();

    const drawObject = (object: CanvasItemModel): void => {
      context.beginPath();
      context.fillStyle = object.color;
      context.shadowColor = object.color;
      context.shadowBlur = selectedItems.has(object.id) ? 16 : 0;
      context.fill(object.path);
      context.closePath();
    };

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvasItems.forEach((item) => drawObject(item));
  }, [getCanvasContext, canvasItems, selectedItems]);

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

  useLayoutEffect(() => {
    if (clickedCord[0] && clickedCord[1]) {
      selectedItems.forEach((item) => {
        item.setClickStartingPoint(...clickedCord);
      });
    }
  }, [selectedItems, clickedCord]);

  const stop = useCallback(() => {
    window.clearInterval(rerenderInterval);
    drawObjects();
  }, [rerenderInterval, drawObjects]);

  const reset = useCallback(() => {
    CanvasItemHistory.cleanHistory();
    const states = CanvasItemHistory.defaultSnapshot;
    canvasItems.forEach((item, key) => {
      const state = states?.get(key);
      if (state) {
        item.restoreState(state);
      }
    });
  }, [canvasItems]);

  const handleUndo = useCallback(() => {
    undo();
    drawObjects();
  }, [drawObjects, undo]);

  const handleReset = useCallback(() => {
    reset();
    drawObjects();
  }, [drawObjects, reset]);

  useEffect(() => {
    drawObjects();
    CanvasItemHistory.setDefaultSnapshot(canvasItems);
  }, []);

  const checkIfItemInLocation = useCallback(
    (event: MouseEvent, cbOnObject: Function, cbNotOnObject?: Function) => {
      const { context } = getCanvasContext();
      for (let item of canvasItems) {
        if (context.isPointInPath(item.path, event.offsetX, event.offsetY)) {
          return cbOnObject(event, item);
        }
      }
      if (cbNotOnObject) {
        cbNotOnObject(event);
      }
    },
    [canvasItems, getCanvasContext]
  );

  const handleAddOnClick = useCallback(
    (event: MouseEvent) => {
      const { context } = getCanvasContext();
      for (let item of canvasItems) {
        if (context.isPointInPath(item.path, event.offsetX, event.offsetY)) {
          setSelectedItems(selectedItems.set(item.id, item));
        }
      }
    },
    [canvasItems, getCanvasContext, selectedItems]
  );

  const startDragging = useCallback(
    (event: MouseEvent) => {
      save();
      setClickedCord([event.offsetX, event.offsetY]);
      setDraggingState(true);
      start();
    },
    [save, start]
  );



  useEffect(() => {
    const { canvas } = getCanvasContext();

    function onMouseMove(event: MouseEvent) {
      if (isDragging) {
        selectedItems.forEach((item) => {
          item.moveItem(event.offsetX, event.offsetY);
        });
      }
    }

    function onMouseDown(event: MouseEvent) {
      if (event.ctrlKey) {
        return checkIfItemInLocation(
          event,
          (event: MouseEvent, item: CanvasItemModel) => {
            setSelectedItems(selectedItems.set(item.id, item));
            startDragging(event)
          }
        );
      }
      checkIfItemInLocation(
        event,
        (event: MouseEvent, item: CanvasItemModel) => {
          const allItems = selectedItems.clear()
          setSelectedItems(allItems.set(item.id, item));
          startDragging(event)
        },
        () => {
          setSelectedItems(selectedItems.clear());
          drawObjects();
        }
      );
    }

    function onMouseUp(event: MouseEvent) {
      selectedItems.forEach((items) => items.clearClickStartingPoint());
      setDraggingState(false);
      stop();
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
    selectedItems,
    setSelectedItems,
    start,
    stop,
    isDragging,
    handleAddOnClick
  ]);

  return (
    <>
      <div className={'canvas-container'}>
        <canvas height={700} width={700} ref={canvasRef} {...rest} />
      </div>
      <div className={'buttons-container'}>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </>
  );
}

export default Canvas;
