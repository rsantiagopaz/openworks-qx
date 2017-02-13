qx.Class.define("viano.comp.windowProductos",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Productos",
		width: 600,
		height: 400,
		showMinimize: false,
		showMaximize: true
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		tbl.focus();
	});
		
		

	var commandAgregar = new qx.ui.core.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		btnAceptar.setEnabled(true);
		tableModel.addRowsAsMapArray([{id_producto: "0", descrip: "Nuevo producto", pto_reposicion: 0, alta: true}], null, true);
		tbl.setFocusedCell(0, tableModel.getRowCount()-1, true);
		tbl.startEditing();
	});
	var commandEditar = new qx.ui.core.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tbl.startEditing();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar producto", null, commandAgregar);
	var btnCambiar = new qx.ui.menu.Button("Editar", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
		//Tabla

		var tableModel = new qx.ui.table.model.Filtered();
		tableModel.setColumns(["Descripción", "Pto.repos."], ["descrip", "pto_reposicion"]);
		tableModel.setEditable(true);
		//tableModel.setColumnEditable(0, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		tbl.setShowCellFocusIndicator(true);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleStatusBarVisible();
		
		var tableColumnModel = tbl.getTableColumnModel();
		var resizeBehavior = tableColumnModel.getBehavior();
		resizeBehavior.set(0, {width:"80%", minWidth: 100});
		resizeBehavior.set(1, {width:"20%", minWidth: 100});
		
		var celleditorTexto = new qx.ui.table.celleditor.TextField();
		celleditorTexto.setValidationFunction(function(newValue, oldValue){
			newValue = newValue.trim();
			if (newValue=="") return oldValue; else return newValue;
		});
		tableColumnModel.setCellEditorFactory(0, celleditorTexto);
		
		var celleditorNumber = new qx.ui.table.celleditor.TextField();
		celleditorNumber.setValidationFunction(function(newValue, oldValue){
			newValue = newValue.trim();
			if (newValue == "") return oldValue;
			else if (isNaN(newValue)) return oldValue; else return String((parseInt(newValue) < 0) ? 0 : parseInt(newValue));
		});
		tableColumnModel.setCellEditorFactory(1, celleditorNumber);
		

		
		var selectionModel = tbl.getSelectionModel();
		selectionModel.addListener("changeSelection", function(){
			var bool = (selectionModel.getSelectedCount() > 0);
			commandEditar.setEnabled(bool);
			menu.memorizar([commandEditar]);
		});
		
		
		
		
		

		tbl.setContextMenu(menu);

		
		
		this.add(tbl, {left: 0, top: 0, right: 0, bottom: 35});
		
		tbl.addListener("dataEdited", function(e){
			var focusedRow = tbl.getFocusedRow();
			var original = tableModel.getRowData(focusedRow);
			var actual = tableModel.getRowDataAsMap(focusedRow);
			original.descrip = actual.descrip;
			original.pto_reposicion = actual.pto_reposicion;
			original.modificado = true;
			tableModel.setRowsAsMapArray([original], focusedRow, true);
			btnAceptar.setEnabled(true);
		});
		
		
		
		
		

		var commandEsc = new qx.ui.core.Command("Esc");
		this.registrarCommand(commandEsc);
		commandEsc.addListener("execute", function(e){
			if (!tbl.isEditing()) btnCancelar.fireEvent("execute");
		});
		
		var btnAceptar = new qx.ui.form.Button("Aceptar");
		btnAceptar.setEnabled(false);
		btnAceptar.addListener("execute", function(e){
			var enviar = false;
			var cambios = {altas: [], modificados: []};
			for (var i=0; i < tableModel.getRowCount(); i++) {
				var row = tableModel.getRowData(i);
				if (row.alta) {
					cambios.altas.push(row);
					enviar = true;
				} else if (row.modificado) {
					cambios.modificados.push(row);
					enviar = true;
				}
			}
			if (enviar) {
				var p = {};
				p.cambios = cambios;

				var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
				try {
					var resultado = rpc.callSync("escribir_productos", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}

				
				//appMain.objMoneda.store.reload();
			}
			btnCancelar.fireEvent("execute");
		}, this);

		var btnCancelar = new qx.ui.form.Button("Cancelar");
		btnCancelar.addListener("execute", function(e){
			this.destroy();
		}, this);
		
		this.add(btnAceptar, {left: "35%", bottom: 0});
		this.add(btnCancelar, {right: "35%", bottom: 0});
		
		
		
		
	
		
		
		
		
		

		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		try {
			var resultado = rpc.callSync("leer_productos");
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		//var json = qx.util.Serializer.toJson(appMain.objMoneda.store.getModel());

		tableModel.setDataAsMapArray(resultado, true);

		if (tableModel.getRowCount() > 0) tbl.setFocusedCell(0, 0, true);
		

	
		
		
	},
	members : 
	{

	}
});