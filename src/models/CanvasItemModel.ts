import { CanvasItemJSONElement, CanvasItemState } from '../types';
import uuidv4 from '../utills/uuidv4';

class CanvasItemModel {
  private _xLoc: number;
  private _yLoc: number;
  private _scale: number = 1;
  private _path: Path2D;
  private readonly _color: string;
  private readonly _id: string;
  private _dClickX: number = 0;
  private _dClickY: number = 0;
  private readonly _svg: string;

  constructor(svg: string, x: number = 0, y: number = 0, color = 'black') {
    this._path = new Path2D(svg);
    this._svg = svg;
    this._xLoc = x;
    this._yLoc = y;
    this._color = color;
    this._movePath();
    this._id = uuidv4();
  }

  get id(): string {
    return this._id;
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

  private _movePath(x?: number, y?: number) {
    const transformMatrix = new DOMMatrix();
    transformMatrix.e = typeof x !== 'undefined' ? x - this._xLoc : this._xLoc;
    transformMatrix.f = typeof y !== 'undefined' ? y - this._yLoc : this._yLoc;
    transformMatrix.e -= this._dClickX;
    transformMatrix.f -= this._dClickY;
    const path = new Path2D();
    path.addPath(this._path, transformMatrix);
    this._path = path;
  }

  setClickStartingPoint(x: number, y: number) {
    this._dClickX = x - this._xLoc;
    this._dClickY = y - this._yLoc;
  }

  clearClickStartingPoint() {
    this._dClickX = 0;
    this._dClickY = 0;
  }

  moveItem(x: number, y: number) {
    this._movePath(x, y);
    this._xLoc = x - this._dClickX;
    this._yLoc = y - this._dClickY;
  }

  toJSONObject() {
    return {
      svg: this._svg,
      xLoc: this._xLoc,
      yLoc: this._yLoc,
      color: this._color
    };
  }

  static fromJSON(json: string) {
    const items = JSON.parse(json);
    return items.map((item: CanvasItemJSONElement) =>
        new CanvasItemModel(item.svg, item.xLoc, item.yLoc, item.color)
    );
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
