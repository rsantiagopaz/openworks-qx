qx.Class.define("componente.comp.ui.ramon.table.Table",
{
	extend : qx.ui.table.Table,
	construct : function (tableModel, custom)
	{
		this.base(arguments, tableModel, custom);
		
		var listenerId;
		
		//var decoration = new qx.ui.decoration.Single(1, "solid", "border-focused");
		var decoration = new qx.ui.decoration.Decorator();
		decoration.setWidth(1, 1, 1, 1);
		decoration.setStyle("solid", "solid", "solid", "solid");
		decoration.setColor("border-focused", "border-focused", "border-focused", "border-focused");
		
		listenerId = this.addListener("changeContextMenu", function(e){
			this._contextMenu = e.getData();
		}, this);
		this._listeners.push({objeto: this, listenerId: listenerId});
		
		listenerId = this.addListener("changeTableModel", function(e){
			tableModel = e.getData();
		});
		this._listeners.push({objeto: this, listenerId: listenerId});
		
		listenerId = this.addListener("focus", function(e){
			this.setDecorator(decoration);
			if (this.modo=="especial") {
				if (tableModel.getRowCount() > 0) {
					var focusedRow = this.getFocusedRow();
					if (focusedRow != null) this.getSelectionModel().setSelectionInterval(focusedRow, focusedRow);
				}
			}
			if (this._contextMenu) this._contextMenu.restablecer();
		}, this);
		this._listeners.push({objeto: this, listenerId: listenerId});
		
		listenerId = this.addListener("blur", function(e){
			this.resetDecorator();
			if (this.modo=="especial") this.resetSelection();
			if (this._contextMenu) {
				window.setTimeout(function(){
					if (this._contextMenu) this._contextMenu.desactivar();
				}.bind(this), 50);
			}
		}, this);
		this._listeners.push({objeto: this, listenerId: listenerId});
	},
	members : 
	{
		edicion: "edicion_horizontal",
		modo: "especial",
		
		_listeners: [],
		_contextMenu: null,
		
		buscar: function(key, data, seleccionar, columna, resultado)
		{
			var rowData = null;
			var tableModel = this.getTableModel();
			var rowCount = tableModel.getRowCount();
			if (seleccionar == null) seleccionar = true;
			if (seleccionar) this.setFocusedCell();
			if (columna == null) columna = 0;
			for (var x = 0; x < rowCount; x++) {
				rowData = tableModel.getRowData(x);
				if (rowData[key] == data) {
					if (resultado != null) {
						resultado.indice = x;
						resultado.row = rowData;
					}
					
					if (seleccionar) this.setFocusedCell(columna, x, true);
					break;
				} else {
					rowData = null;
				}
			}
			return rowData;
		},
		
    _updateStatusBar : function()
    {
      if (this.getStatusBarVisible())
      {
        var text = this.getAdditionalStatusBarText();

        if (text) {
          this.getChildControl("statusbar").setValue(text);
        }
      }
    },
		
    _onKeyPress : function(evt)
    {
      if (!this.getEnabled()) {
        return;
      }

      // No editing mode
      var oldFocusedRow = this.getFocusedRow();
      var consumed = true;

      // Handle keys that are independent from the modifiers
      var identifier = evt.getKeyIdentifier();

      if (this.isEditing())
      {
        // Editing mode
        if (evt.getModifiers() == 0)
        {
          switch(identifier)
          {
			case "Enter":
			  this.stopEditing();
			  if (this.edicion=="edicion_vertical") {
			      var oldFocusedRow = this.getFocusedRow();
			      this.moveFocusedCell(0, 1);
			
			      if (this.getFocusedRow() != oldFocusedRow) {
			        consumed = this.startEditing();
			      }
			  } else if (this.edicion=="edicion_horizontal") {
			      var oldFocusedCol = this.getFocusedColumn();
			      this.moveFocusedCell(1, 0);
			
			      if (this.getFocusedColumn() != oldFocusedCol) {
			        consumed = this.startEditing();
			      }
			  } else if (this.edicion=="desplazamiento_vertical") {
			      var oldFocusedRow = this.getFocusedRow();
			      this.moveFocusedCell(0, 1);
			      
			  } else if (this.edicion=="desplazamiento_horizontal") {
			      var oldFocusedCol = this.getFocusedColumn();
			      this.moveFocusedCell(1, 0);

			  } else {
			  	
			  }
			
			  break;

            case "Escape":
              this.cancelEditing();
              this.focus();
              break;

            default:
              consumed = false;
              break;
          }
        }

      }
      else
      {
        // No editing mode
        if (evt.isCtrlPressed())
        {
          // Handle keys that depend on modifiers
          consumed = true;

          switch(identifier)
          {
            case "A": // Ctrl + A
              var rowCount = this.getTableModel().getRowCount();

              if (rowCount > 0) {
                this.getSelectionModel().setSelectionInterval(0, rowCount - 1);
              }

              break;

            default:
              consumed = false;
              break;
          }
        }
        else
        {
          // Handle keys that are independent from the modifiers
          switch(identifier)
          {
            case "Space":
              this.getSelectionManager().handleSelectKeyDown(this.getFocusedRow(), evt);
              break;

            case "F2":
            case "Enter":
              this.startEditing();
              consumed = true;
              break;

            case "Home":
              this.setFocusedCell(this.getFocusedColumn(), 0, true);
              break;

            case "End":
              var rowCount = this.getTableModel().getRowCount();
              this.setFocusedCell(this.getFocusedColumn(), rowCount - 1, true);
              break;

            case "Left":
              this.moveFocusedCell(-1, 0);
              break;

            case "Right":
              this.moveFocusedCell(1, 0);
              break;

            case "Up":
              this.moveFocusedCell(0, -1);
              break;

            case "Down":
              this.moveFocusedCell(0, 1);
              break;

            case "PageUp":
            case "PageDown":
              var scroller = this.getPaneScroller(0);
              var pane = scroller.getTablePane();
              var rowHeight = this.getRowHeight();
              var direction = (identifier == "PageUp") ? -1 : 1;
              rowCount = pane.getVisibleRowCount() - 1;
              scroller.setScrollY(scroller.getScrollY() + direction * rowCount * rowHeight);
              this.moveFocusedCell(0, direction * rowCount);
              break;

            default:
              consumed = false;
          }
        }
      }

      if (oldFocusedRow != this.getFocusedRow() &&
          this.getRowFocusChangeModifiesSelection())
      {
        // The focus moved -> Let the selection manager handle this event
        this.getSelectionManager().handleMoveKeyDown(this.getFocusedRow(), evt);
      }

      if (consumed)
      {
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
	},
	destruct : function ()
	{
		for (var x in this._listeners) {
			this._listeners[x].objeto.removeListenerById(this._listeners[x].listenerId);
		}
	}
});