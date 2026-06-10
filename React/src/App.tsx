import { useCallback, useRef } from 'react';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DataGrid, {
  Column,
  Editing,
  Lookup,
  Paging,
} from 'devextreme-react/data-grid';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import { employees, states } from './data';

function App(): JSX.Element {
  const editCellsRef = useRef<string[]>([]);

  const onCellPrepared = useCallback((e: DataGridTypes.CellPreparedEvent) => {
    if (e.rowType === 'data' && editCellsRef.current.includes(`${e.rowIndex}:${e.columnIndex}`)) {
      e.cellElement.style.backgroundColor = 'lightblue';
    }
  }, []);

  const onEditorPreparing = useCallback((e: DataGridTypes.EditorPreparingEvent) => {
    const grid = e.component;
    if (e.parentType === 'dataRow') {
      const oldOnValueChanged = e.editorOptions.onValueChanged;
      e.editorOptions.onValueChanged = function onValueChanged(
        this: unknown,
        args: { value: unknown },
      ) {
        oldOnValueChanged.apply(this, [args]);
        editCellsRef.current.forEach((cell) => {
          const [rowIndex, columnIndex] = cell.split(':').map(Number);
          grid.cellValue(rowIndex, columnIndex, args.value);
        });
      };
    }
  }, []);

  const onCellClick = useCallback((e: DataGridTypes.CellClickEvent) => {
    if (e.event?.ctrlKey) {
      editCellsRef.current.push(`${e.rowIndex}:${e.columnIndex}`);
    } else if (editCellsRef.current.length) {
      editCellsRef.current = [];
      e.component.repaint();
    }
  }, []);

  const resetEditCells = useCallback(() => {
    editCellsRef.current = [];
  }, []);

  return (
    <div className="main">
      <DataGrid
        dataSource={employees}
        keyExpr="ID"
        onCellPrepared={onCellPrepared}
        onEditorPreparing={onEditorPreparing}
        onCellClick={onCellClick}
        onSaving={resetEditCells}
        onEditCanceled={resetEditCells}
      >
        <Paging enabled={false} />
        <Editing mode="batch" allowUpdating={true} />
        <Column dataField="Prefix" caption="Title" width={70} />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="Position" width={170} />
        <Column dataField="StateID" caption="State" width={125}>
          <Lookup dataSource={states} displayExpr="Name" valueExpr="ID" />
        </Column>
      </DataGrid>
    </div>
  );
}

export default App;
