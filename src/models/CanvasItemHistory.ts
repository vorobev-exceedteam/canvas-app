import CanvasItemModel from './CanvasItemModel';
import { CanvasItemState } from '../types';

class CanvasItemHistory {
  private _history: Map<string, CanvasItemState>[] = [];
  private _defaultSnapshot = new Map<string, CanvasItemState>();

  constructor(items?: CanvasItemModel[]) {
    if (items) {
      this.setDefaultSnapshot(items);
    }
  }

  saveState(items: CanvasItemModel[]) {
    const itemsStates = new Map<string, CanvasItemState>();
    items.forEach((item) => {
      itemsStates.set(item.id, item.getState());
    });
    this._history.push(itemsStates);
  }

  getRecentStates() {
    return this._history.pop();
  }

  setDefaultSnapshot(items: CanvasItemModel[]) {
    const itemsStates = new Map<string, CanvasItemState>();
    items.forEach((item) => {
      itemsStates.set(item.id, item.getState());
    });
    this._defaultSnapshot = itemsStates;
  }

  updateDefaultSnapshot(items: CanvasItemModel[]) {
    for (const item of items) {
      if (!this._defaultSnapshot.has(item.id)) {
        this._defaultSnapshot.set(item.id, item.getState());
      }
    }
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
