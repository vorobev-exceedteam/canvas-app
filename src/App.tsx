import './App.scss';
import Canvas from './Canvas';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import CanvasItemHistory from './models/CanvasItemHistory';
import CanvasItemModel from './models/CanvasItemModel';
import FileSaver from 'file-saver';

function App() {
  const [items, setItems] = useState<CanvasItemModel[]>([]);
  let history = useMemo(() => new CanvasItemHistory(items), []);

  const handleImport = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e?.target) {
          console.log('loaded');
          const result = e.target.result as string;
          const newItems = CanvasItemModel.fromJSON(result);
          console.log(newItems);
          setItems([...items, ...newItems]);
          event.target.value = ''
        }
      };
      const files = event.target.files as FileList;
      console.log(files);
      reader.readAsText(files[0]);
    },
    [items]
  );

  const handleExport = useCallback(() => {
    const jsonString = JSON.stringify(items.map((item) => item.toJSONObject()));
    const blob = new Blob([jsonString], { type: 'application/json' });
    FileSaver.saveAs(blob, 'items.json');
  }, [items]);

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
      </div>
      <Canvas items={items} history={history} />
    </div>
  );
}

export default App;
