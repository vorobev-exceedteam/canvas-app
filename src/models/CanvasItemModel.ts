class CanvasItemModel {
  private _xLoc: number;
  private _yLoc: number;
  private _scale: number = 1;
  private _path: Path2D;

  constructor(path: Path2D, x: number = 0, y: number = 0) {
    this._path = path;
    this._xLoc = x;
    this._yLoc = y;
    this._movePath();
  }

  get path(): Path2D {
    return this._path;
  }

  get scale(): number {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = value;
  }

  get xLoc(): number {
    return this._xLoc;
  }

  set xLoc(value: number) {
    this._xLoc = value;
  }

  get yLoc(): number {
    return this._yLoc;
  }

  set yLoc(value: number) {
    this._yLoc = value;
  }

  private _movePath(x?: number, y?: number) {
    const transformMatrix = new DOMMatrix();
    console.log('moving to ')
    transformMatrix.e = x ? x - this._xLoc : this._xLoc;
    transformMatrix.f = y ? y - this._yLoc : this._yLoc;
    const path = new Path2D();
    path.addPath(this._path, transformMatrix);
    this._path = path;
  }

  moveItem(x: number, y: number) {
    console.log('moving: ', x, y);
    this._movePath(x, y);
    this._xLoc = x;
    this._yLoc = y;
  }

  isLocationInsideObject() {
    // todo
  }
}

export default CanvasItemModel;
