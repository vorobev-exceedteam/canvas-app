import './App.scss';
import Canvas from './Canvas';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import CanvasItemHistory from './models/CanvasItemHistory';
import CanvasItemModel from './models/CanvasItemModel';
import FileSaver from 'file-saver';
import createMockItems from './models/MockItems';
import { Map } from 'immutable';
import { CanvasItemState } from './types';

function App() {
  // const loadDefaultState = useCallback(() => {
  //   const itemsString = localStorage.getItem('defaultState');
  //   const items = Map<string, CanvasItemModel>().asMutable();
  //   if (itemsString) {
  //     const itemsStates = JSON.parse(itemsString) as CanvasItemState[];
  //     console.log(itemsStates);
  //     itemsStates.forEach((itemState) => {
  //       const item = CanvasItemModel.restoreItem(itemState);
  //       items.set(item.id, item);
  //     });
  //   }
  //   return items.asImmutable();
  // }, []);

  const defaultState = useMemo(() => {
    const itemsString = localStorage.getItem('defaultState');
    const items = Map<string, CanvasItemModel>().asMutable();
    if (itemsString) {
      const itemsStates = JSON.parse(itemsString) as CanvasItemState[];
      console.log(itemsStates);
      itemsStates.forEach((itemState) => {
        const item = CanvasItemModel.restoreItem(itemState);
        items.set(item.id, item);
      });
    }
    return items.asImmutable();
  }, [])

  const [items, setItems] = useState<Map<string, CanvasItemModel>>(
    defaultState
  );
  const [selectedItems, setSelectedItems] = useState<
    Map<string, CanvasItemModel>
  >(Map<string, CanvasItemModel>());
  const history = useMemo(() => new CanvasItemHistory(items), []);

  const handleImport = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e?.target) {
          const result = e.target.result as string;
          const states = JSON.parse(result) as CanvasItemState[];
          history.saveState(items)
          const newItems = states.map((state) =>
            CanvasItemModel.restoreItem(state)
          );
          const newMap = items.asMutable();
          newItems.forEach((item) => newMap.set(item.id, item));
          setItems(newMap.asImmutable());
          event.target.value = '';
        }
      };
      const files = event.target.files as FileList;
      console.log(files);
      reader.readAsText(files[0]);
    },
    [history, items]
  );

  const handleExport = useCallback(() => {
    const selectedItemsArr = Array.from(selectedItems.values());

    const jsonString = JSON.stringify(
      selectedItemsArr.map((item) => item.getState())
    );
    const blob = new Blob([jsonString], { type: 'application/json' });
    FileSaver.saveAs(blob, 'items.json');
  }, [selectedItems]);

  const handleExportAll = useCallback(() => {
    const jsonString = JSON.stringify(items.map((item) => item.getState()));
    const blob = new Blob([jsonString], { type: 'application/json' });
    FileSaver.saveAs(blob, 'items.json');
  }, [items]);

  const addDefaultFigures = useCallback(() => {
    const mockItems = createMockItems();
    const newItems = items.asMutable();
    mockItems.forEach((item) => newItems.set(item.id, item));
    setItems(newItems.asImmutable());
  }, [items]);

  const saveDefaultState = useCallback(() => {
    const itemsString = JSON.stringify(
      Array.from(items.values()).map((item) => item.getState())
    );
    history.setDefaultSnapshot(items)
    localStorage.setItem('defaultState', itemsString);
  }, [history, items]);

  const clearDefaultState = useCallback(() => {
    localStorage.removeItem('defaultState');
  }, []);

  const deleteCb = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete' && !selectedItems.isEmpty()) {
        history.saveState(items);
        setItems(items.deleteAll(selectedItems.keys()));
        setSelectedItems(selectedItems.clear());
      }
    },
    [history, items, selectedItems]
  );

  useEffect(() => {
    window.addEventListener('keypress', deleteCb);
    return () => window.removeEventListener('keypress', deleteCb);
  }, [deleteCb]);

  return (
    <div className="App">
      <div className={'import-export-container'}>
        <div>
          <label htmlFor={'import-item'} className="ctrl-button">
            Import
          </label>
          <input
            id={'import-item'}
            type={'file'}
            className={'display-none'}
            onChange={handleImport}
          />
        </div>
        <button onClick={handleExport} className={'ctrl-button'}>
          Export
        </button>
        <button onClick={handleExportAll} className={'ctrl-button'}>
          Export All
        </button>
      </div>
      <Canvas
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        items={items}
        setItems={setItems}
        history={history}
      />
      <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
        <button className={'ctrl-button'} onClick={addDefaultFigures}>
          Add Default Figures
        </button>
        <button onClick={saveDefaultState} className={'ctrl-button'}>
          Save As Default
        </button>
        <button onClick={clearDefaultState} className={'ctrl-button'}>
          Clear Default
        </button>
      </div>
    </div>
  );
}

export default App;
