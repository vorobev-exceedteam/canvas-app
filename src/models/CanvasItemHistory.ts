import CanvasItemModel from './CanvasItemModel';
import { CanvasItemState } from '../types';

class CanvasItemHistory {
  private _history: Map<number, CanvasItemState>[] = [];
  private _defaultSnapshot: Map<number, CanvasItemState> = new Map<
    number,
    CanvasItemState
  >();

  saveState(items: CanvasItemModel[]) {
    const itemsStates = new Map<number, CanvasItemState>();
    items.forEach((item, key) => {
      itemsStates.set(key, item.getState());
    });
    this._history.push(itemsStates);
  }

  getRecentStates() {
    return this._history.pop();
  }

  setDefaultSnapshot(items: CanvasItemModel[]) {
    const itemsStates = new Map<number, CanvasItemState>();
    items.forEach((item, key) => {
      itemsStates.set(key, item.getState());
    });
    this._defaultSnapshot = itemsStates;
  }

  get defaultSnapshot() {
    return this._defaultSnapshot;
  }

  cleanHistory() {
    this._history = [];
  }

  isHistoryEmpty() {
    return !this._history.length;
  }
}

export default CanvasItemHistory;
