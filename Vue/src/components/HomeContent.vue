<script setup lang="ts">
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import {
  DxColumn,
  DxDataGrid,
  DxEditing,
  DxLookup,
  DxPaging,
} from 'devextreme-vue/data-grid';
import type {
  CellClickEvent,
  CellPreparedEvent,
  EditorPreparingEvent,
} from 'devextreme/ui/data_grid';
import { employees, states } from '../data';

let editCells: string[] = [];

function onCellPrepared(e: CellPreparedEvent) {
  if (e.rowType === 'data' && editCells.includes(`${e.rowIndex}:${e.columnIndex}`)) {
    e.cellElement.style.backgroundColor = 'lightblue';
  }
}

function onEditorPreparing(e: EditorPreparingEvent) {
  const grid = e.component;
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

function onCellClick(e: CellClickEvent) {
  if (e.event?.ctrlKey) {
    editCells.push(`${e.rowIndex}:${e.columnIndex}`);
  } else if (editCells.length) {
    editCells = [];
    e.component.repaint();
  }
}

function resetEditCells() {
  editCells = [];
}
</script>
<template>
  <div>
    <DxDataGrid
      :data-source="employees"
      key-expr="ID"
      @cell-prepared="onCellPrepared"
      @editor-preparing="onEditorPreparing"
      @cell-click="onCellClick"
      @saving="resetEditCells"
      @edit-canceled="resetEditCells"
    >
      <DxPaging :enabled="false"/>
      <DxEditing
        mode="batch"
        :allow-updating="true"
      />
      <DxColumn
        data-field="Prefix"
        caption="Title"
        :width="70"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn
        data-field="Position"
        :width="170"
      />
      <DxColumn
        data-field="StateID"
        caption="State"
        :width="125"
      >
        <DxLookup
          :data-source="states"
          display-expr="Name"
          value-expr="ID"
        />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>
