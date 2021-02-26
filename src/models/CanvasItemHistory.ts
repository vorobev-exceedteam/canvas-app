import CanvasItemModel from './CanvasItemModel';
import { CanvasItemState } from '../types';
import { Map } from 'immutable';

class CanvasItemHistory {
  private _history: Map<string, CanvasItemState>[] = [];
  private _defaultSnapshot = Map<string, CanvasItemState>().asMutable();

  constructor(items?: Map<string, CanvasItemModel>) {
    if (items) {
      this.setDefaultSnapshot(items);
    }
  }

  saveState(items: Map<string, CanvasItemModel>) {
    const itemsStates = Map<string, CanvasItemState>().asMutable();
    for (const id of Array.from(items.keys())) {
      const item = items.get(id);
      if (item) {
        itemsStates.set(id, item.getState());
      }
    }
    this._history.push(itemsStates);
  }

  getRecentStates() {
    return this._history.pop();
  }

  setDefaultSnapshot(items: Map<string, CanvasItemModel>) {
    const itemsStates = Map<string, CanvasItemState>().asMutable();
    for (const id of Array.from(items.keys())) {
      const item = items.get(id);
      if (item) {
        itemsStates.set(id, item.getState());
      }
    }
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

  clearDefaultSnapshot() {
    this._defaultSnapshot.clear();
  }

  cleanHistory() {
    this._history = [];
  }

  isHistoryEmpty() {
    return !this._history.length;
  }
}

export default CanvasItemHistory;
