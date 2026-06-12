import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Employee, Service, State } from './app.service';

@Component({
    selector: 'app-root',
    imports: [DxDataGridModule],
    providers: [Service],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  employees: Employee[];

  states: State[];

  private editCells: string[] = [];

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.states = service.getStates();
  }

  onCellPrepared(e: DxDataGridTypes.CellPreparedEvent): void {
    if (e.rowType === 'data' && this.editCells.includes(`${e.rowIndex}:${e.columnIndex}`)) {
      e.cellElement.style.backgroundColor = 'lightblue';
    }
  }

  onEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent): void {
    const grid = e.component;
    const { editCells } = this;
    if (e.parentType === 'dataRow') {
      const oldOnValueChanged = e.editorOptions.onValueChanged;
      e.editorOptions.onValueChanged = function onValueChanged(
        this: unknown,
        args: { value: unknown },
      ) {
        oldOnValueChanged.apply(this, [args]);
        editCells.forEach((cell) => {
          const [rowIndex, columnIndex] = cell.split(':').map(Number);
          grid.cellValue(rowIndex, columnIndex, args.value);
        });
      };
    }
  }

  onCellClick(e: DxDataGridTypes.CellClickEvent): void {
    if (e.event?.ctrlKey) {
      this.editCells.push(`${e.rowIndex}:${e.columnIndex}`);
    } else if (this.editCells.length) {
      this.editCells.length = 0;
      e.component.repaint();
    }
  }

  resetEditCells(): void {
    this.editCells.length = 0;
  }
}
