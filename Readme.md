<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/128583166/15.2.7%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T361032)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
<!-- default badges end -->

# DataGrid for DevExtreme - How to implement selecting multiple cells with a keyboard for batch editing 

This example illustrates how to allow an end user to select more than one cell for editing by holding the CTRL key. When the user changes the editor text, the text will be entered to all selected cells.

![DataGrid - multiple cells selected in a batch editing mode](/images/datagrid-select-multiple-cells.png)

<!-- run online -->
**[Run Online](https://codecentral.devexpress.com/t361032/)**
<!-- run online end -->

## Implementation Details

1. Create an array to store selected cells.

2. Implement the [onCellClick](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onCellClick) event handler to add a selected cell to the array when the **Ctrl** key is held. Otherwise, clear the array:

```js
onCellClick: function (e) {
    if (e.jQueryEvent.ctrlKey) {
        editCells.push(e.rowIndex + ":" + e.columnIndex);
    }
    else if (editCells.length) {
        editCells = [];
        e.component.repaint();
    }
},

```

3. Implement the [onCellPrepared](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onCellPrepared) event handler to change the style of the selected row:

```js
onCellPrepared: function (e) {
    if (e.rowType === "data" && $.inArray(e.rowIndex + ":" + e.columnIndex, editCells) >= 0) {
        e.cellElement.css("background-color", "lightblue");
    }
},

```

4. Implement the [onEditorPreparing](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onEditorPreparing) event handler to specify a text value for all selected cells when a user edits the last cell:


```js
onEditorPreparing: function (e) {
    var grid = e.component;
    if (e.parentType === "dataRow") {
        var oldOnValueChanged = e.editorOptions.onValueChanged;
        e.editorOptions.onValueChanged = function (e) {
            oldOnValueChanged.apply(this, arguments);
            for (var i = 0; i < editCells.length; i++) {
                var rowIndex = Number(editCells[i].split(":")[0]);
                var columnIndex = Number(editCells[i].split(":")[1]);
                grid.cellValue(rowIndex, columnIndex, e.value);
            }
        }
    }
},

```

5.To reset the selection when the **Save** or **Cancel** buttons are clicked, use the [onContentReady](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onContentReady) event handler:


```js
onContentReady: function (e) {
    e.element.find(".dx-datagrid-save-button").click(function (e) {
        if (editCells.length)
            editCells = [];
    });
    e.element.find(".dx-datagrid-cancel-button ").click(function (e) {
        if (editCells.length)
            editCells = [];
    });
}
```

## Files to Review

- [index.html](jQuery/Index.html)

## Documentation

- [Getting Started with DataGrid](https://js.devexpress.com/Documentation/Guide/UI_Components/DataGrid/Getting_Started_with_DataGrid/)

## More Examples

- [DataGrid for DevExtreme - Display tooltip for data cells](https://github.com/DevExpress-Examples/devextreme-datagrid-display-tooltip-for-data-cells)
- [DataGrid for DevExtreme - How to allow users select multiple cells](https://github.com/DevExpress-Examples/devextreme-datagrid-multiple-cell-selection)