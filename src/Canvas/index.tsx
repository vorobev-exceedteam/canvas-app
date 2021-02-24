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
  // todo think about better history handling

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
    items.forEach((item) => drawObject(item));
  }, [getCanvasContext, items, selectedItems]);

  const start = useCallback(() => {
    setRerenderInterval(
      window.setInterval(() => {
        drawObjects();
      }, 17)
    );
  }, [drawObjects]);

  const save = useCallback(() => {
    CanvasItemHistory.saveState(items);
  }, [items]);

  const undo = useCallback(() => {
    const states = CanvasItemHistory.getRecentStates();
    items.forEach((item, key) => {
      const state = states?.get(key);
      if (state) {
        item.restoreState(state);
      }
    });
  }, [items]);

  useLayoutEffect(() => {
    if (clickedCord[0] && clickedCord[1]) {
      selectedItems.forEach((item) => {
        item.setClickStartingPoint(...clickedCord);
      });
    }
  }, [selectedItems, clickedCord, drawObjects]);

  const stop = useCallback(() => {
    window.clearInterval(rerenderInterval);
    drawObjects();
  }, [rerenderInterval, drawObjects]);

  const reset = useCallback(() => {
    CanvasItemHistory.cleanHistory();
    const states = CanvasItemHistory.defaultSnapshot;
    items.forEach((item, key) => {
      const state = states?.get(key);
      if (state) {
        item.restoreState(state);
      }
    });
  }, [items]);

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
    CanvasItemHistory.setDefaultSnapshot(items);
  }, []);

  const checkIfItemInLocation = useCallback(
    (event: MouseEvent, cbOnObject: Function, cbNotOnObject?: Function) => {
      const { context } = getCanvasContext();
      for (let item of items) {
        if (context.isPointInPath(item.path, event.offsetX, event.offsetY)) {
          return cbOnObject(event, item);
        }
      }
      if (cbNotOnObject) {
        cbNotOnObject(event);
      }
    },
    [items, getCanvasContext]
  );

  // const handleAddOnClick = useCallback(
  //   (event: MouseEvent) => {
  //     const { context } = getCanvasContext();
  //     for (let item of items) {
  //       if (context.isPointInPath(item.path, event.offsetX, event.offsetY)) {
  //         setSelectedItems(selectedItems.set(item.id, item));
  //       }
  //     }
  //   },
  //   [items, getCanvasContext, selectedItems]
  // );

  const startDragging = useCallback(
    (event: MouseEvent) => {
      save();
      setClickedCord([event.offsetX, event.offsetY]);
      setDraggingState(true);
      start();
    },
    [save, start]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging) {
        selectedItems.forEach((item) => {
          item.moveItem(event.offsetX, event.offsetY);
        });
      }
    },
    [isDragging, selectedItems]
  );

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.ctrlKey) {
        return checkIfItemInLocation(
          event,
          (event: MouseEvent, item: CanvasItemModel) => {
            setSelectedItems(selectedItems.set(item.id, item));
            startDragging(event);
          }
        );
      }
      checkIfItemInLocation(
        event,
        (event: MouseEvent, item: CanvasItemModel) => {
          const allItems = selectedItems.clear();
          setSelectedItems(allItems.set(item.id, item));
          startDragging(event);
        },
        () => {
          setSelectedItems(selectedItems.clear());
        }
      );
    },
    [checkIfItemInLocation, selectedItems, startDragging]
  );

  const onMouseUp = useCallback(
    () => {
      selectedItems.forEach((items) => items.clearClickStartingPoint());
      setDraggingState(false);
      stop();
      setClickedCord([0, 0]);
    },
    [selectedItems, stop]
  );

  useEffect(() => {
    const { canvas } = getCanvasContext();

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);

    return function () {
      window.clearInterval(rerenderInterval);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [getCanvasContext, onMouseDown, onMouseMove, onMouseUp, rerenderInterval]);

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
