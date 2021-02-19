import { CanvasItemState } from '../types';

class CanvasItemModel {
  private _xLoc: number;
  private _yLoc: number;
  private _scale: number = 1;
  private _path: Path2D;
  private readonly _color: string;

  constructor(path: Path2D, x: number = 0, y: number = 0, color = 'black') {
    this._path = path;
    this._xLoc = x;
    this._yLoc = y;
    this._color = color;
    this._movePath();
  }

  get color(): string {
    return this._color;
  }

  get path(): Path2D {
    return this._path;
  }

  get scale(): number {
    return this._scale;
  }


  get xLoc(): number {
    return this._xLoc;
  }

  get yLoc(): number {
    return this._yLoc;
  }

  private _movePath(
    x?: number,
    y?: number,
    dClickedX?: number,
    dClickedY?: number
  ) {
    const transformMatrix = new DOMMatrix();
    transformMatrix.e = typeof x !== 'undefined' ? x - this._xLoc : this._xLoc;
    transformMatrix.f = typeof y !== 'undefined' ? y - this._yLoc : this._yLoc;
    if (dClickedX) {
      transformMatrix.e -= dClickedX;
    }
    if (dClickedY) {
      transformMatrix.f -= dClickedY;
    }
    const path = new Path2D();
    path.addPath(this._path, transformMatrix);
    this._path = path;
  }

  moveItem(x: number, y: number, dClickedX: number, dClickedY: number) {
    this._movePath(x, y, dClickedX, dClickedY);
    this._xLoc = x - dClickedX;
    this._yLoc = y - dClickedY;
  }

  getState() {
    return { xLoc: this._xLoc, yLoc: this._yLoc };
  }

  restoreState(state: CanvasItemState) {
    this._movePath(state.xLoc, state.yLoc);
    this._xLoc = state.xLoc;
    this._yLoc = state.yLoc;
  }
}

export default CanvasItemModel;
