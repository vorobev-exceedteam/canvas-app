import { HTMLAttributes, useLayoutEffect, useRef, useState } from 'react';
import './styles.scss';
import CanvasItemModel from '../../models/CanvasItemModel';

interface CanvasProps extends HTMLAttributes<HTMLCanvasElement> {
  items: CanvasItemModel[];
}

function Canvas({ items, ...rest }: CanvasProps): JSX.Element {
  const [selectedItem, setSelectedItem] = useState<CanvasItemModel|null>(null);
  const [canvasItems, setItems] = useState<CanvasItemModel[]>(items || []);
  const [dragging, setDragging] = useState<boolean>(false)

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    function drawObject(
      object: CanvasItemModel,
    ): void {
      console.log('draw')
      context.beginPath();
      console.log('coord: ', object.xLoc, object.yLoc)
      context.fill(object.path);
      context.closePath();
    }

    const rerenderInterval = setInterval(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvasItems.forEach((item) => drawObject(item));
    }, 17);

    function onMouseMove(event: MouseEvent) {
      console.log(selectedItem)
      if (selectedItem) {
        selectedItem.moveItem(event.offsetX, event.offsetY)
      }
    }

    function onMouseDown(event: MouseEvent) {
      for (let item of canvasItems) {
        if(context.isPointInPath(item.path, event.offsetX, event.offsetY)) {
          setSelectedItem(item);
          break;
        }
      }
    }
    function onMouseUp(event: MouseEvent) {
      console.log('up mouse')
      setSelectedItem(null);
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mousemove', onMouseMove)

    return function () {
      clearInterval(rerenderInterval);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('mousemove', onMouseMove)
    };
  }, [canvasItems, selectedItem, setSelectedItem, ]);






  // function onMouseDownHandler(
  //   event: MouseEvent,
  //   ctx: CanvasRenderingContext2D
  // ) {
  // }

  // function clickHandler(event: any) {
  //   const canvas = canvasRef.current as HTMLCanvasElement;
  //   const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  //   canvasItems.forEach((item) => {});
  // }

  return (
    <div className={'canvas-container'}>
      <canvas height={700} width={700} ref={canvasRef} {...rest} />
    </div>
  );
}

export default Canvas;
