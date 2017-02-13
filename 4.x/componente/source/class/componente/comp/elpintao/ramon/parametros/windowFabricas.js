qx.Class.define("componente.comp.elpintao.ramon.parametros.windowFabricas",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

		this.set({
			caption: "Fábricas",
			width: 400,
			height: 400,
			showMinimize: false,
			showMaximize: false
		});
		this.setLayout(new qx.ui.layout.Canvas());
		

	componente.comp.elpintao.ramon.Rutinas.crear_obj_base(["objFabrica"]);
		
	var application = qx.core.Init.getApplication();
		

	var commandAgregar = new qx.ui.core.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		btnAceptar.setEnabled(true);
		tableModel.addRowsAsMapArray([{id_fabrica: "0", descrip: "Nueva fábrica", desc_fabrica: 0, alta: true, modificado: false, eliminado: false}], null, true);
		tbl.setFocusedCell(0, tableModel.getRowCount()-1, true);
		tbl.startEditing();
	});
	var commandEditar = new qx.ui.core.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tbl.startEditing();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar fábrica", null, commandAgregar);
	var btnCambiar = new qx.ui.menu.Button("Editar", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
		//Tabla

		var tableModel = new qx.ui.table.model.Filtered();
		tableModel.setColumns(["Descripción", "Descuento"], ["descrip", "desc_fabrica"]);
		tableModel.setColumnEditable(0, true);
		tableModel.setColumnEditable(1, false);

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
		//resizeBehavior.set(0, {width:"60%", minWidth:100});
		//resizeBehavior.set(1, {width:"20%", minWidth:100});
		//resizeBehavior.set(2, {width:"20%", minWidth:100});
		tableColumnModel.getCellEditorFactory(0).setValidationFunction(function(newValue, oldValue){
			newValue = newValue.trim();
			if (newValue=="") return oldValue; else return newValue;
		});
		
		var aux = new qx.ui.table.celleditor.TextField();
		aux.setValidationFunction(function(newValue, oldValue){
			newValue = newValue.trim();
			if (newValue=="") return oldValue;
			else if (isNaN(newValue)) return oldValue; else return newValue;
		});
		tableColumnModel.setCellEditorFactory(1, aux);
		
		
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
			if (original.id_fabrica=="1") {
				tableModel.setValueById("descrip", focusedRow, original.descrip);
			} else {
				var actual = tableModel.getRowDataAsMap(focusedRow);
				original.descrip = actual.descrip;
				original.desc_fabrica = actual.desc_fabrica;
				original.modificado = true;
				tableModel.setRowsAsMapArray([original], focusedRow, true);
				btnAceptar.setEnabled(true);
			}
		});
		
		
		
		
		

		var commandEscape = new qx.ui.core.Command("Escape");
		this.registrarCommand(commandEscape);
		commandEscape.setEnabled(false);
		commandEscape.addListener("execute", function(e){
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
				var rpc = new qx.io.remote.Rpc("../../services/", "comp.elpintao.ramon.Parametros");
				try {
					var resultado = rpc.callSync("escribir_fabrica", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				application.objFabrica.store.reload();
			}
			btnCancelar.fireEvent("execute");
		}, this);

		var btnCancelar = new qx.ui.form.Button("Cancelar");
		btnCancelar.addListener("execute", function(e){
			this.destroy();
		}, this);
		
		this.add(btnAceptar, {left: 80, bottom: 0});
		this.add(btnCancelar, {left: 220, bottom: 0});
		

		
		var json = qx.util.Serializer.toJson(application.objFabrica.store.getModel());
//		tableModel.setDataAsMapArray(qx.util.Json.parse(json), true);
		tableModel.setDataAsMapArray(qx.lang.Json.parse(json), true);


		if (tableModel.getRowCount() > 0) tbl.setFocusedCell(0, 0, true);
		

		this.addListenerOnce("appear", function(){
			tbl.focus();
		});
	
		
		
	},
	members : 
	{

	}
});