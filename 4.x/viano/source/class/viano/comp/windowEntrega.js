qx.Class.define("viano.comp.windowEntrega",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Entrega",
		width: 800,
		height: 650,
		showMinimize: false,
		showMaximize: true
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		cboLugar.focus();
	});
	
	
	
	var timerId = null;
	var rpcLeer_producto = null;
		
		

	var cboLugar = new qx.ui.form.SelectBox();

	var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("leer_entrega_lugar");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	for (var x in resultado) {
		cboLugar.add(new qx.ui.form.ListItem(resultado[x].descrip, null, resultado[x].id_entrega_lugar));
	}
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setWidth(500);
	txtDescrip.addListener("blur", function(e){
		txtDescrip.setValue(txtDescrip.getValue().trim());
	})

	
	var gpb = new qx.ui.groupbox.GroupBox("Items");
	gpb.setLayout(new qx.ui.layout.Canvas());
	//gpb.setWidth(710);
	//gpb.setHeight(350);
	
	var txtProducto = new qx.ui.form.TextField("");
	//txtProducto.setWidth(300);
	txtProducto.setLiveUpdate(true);
	
	txtProducto.addListener("keypress", function(e){
		var keyIdentifier = e.getKeyIdentifier();
		if (keyIdentifier == "Down") {
			if (tableModel.getRowCount() > 0) tbl.focus();
		}
	});
	
	txtProducto.addListener("changeValue", function(e){
		var texto = txtProducto.getValue().trim();
		
		if (texto.length == 0) {
			tbl.setFocusedCell();
			tableModel.setDataAsMapArray([], true);
		} else if (texto.length >= 3) {
			var p = {texto: texto};
	        var timer = qx.util.TimerManager.getInstance();
	        // check for the old listener
	        if (timerId != null) {
	          // stop the old one
	          timer.stop(timerId);
	          if (rpcLeer_producto != null) rpcLeer_producto.abort(rpcLeer_producto);
	          timerId = null;
	        }
	        // start a new listener to update the controller
			timerId = timer.start(function() {
				rpcLeer_producto = new qx.io.remote.Rpc("services/", "comp.Parametros");
				rpcLeer_producto.addListener("completed", function(e){
					var resultado = e.getData().result;
					var f;
					
					for (var x in resultado) {
						f = resultado[x].f_vencimiento;
						resultado[x].f_vencimiento = new Date(Number(f.substr(0, 4)), Number(f.substr(5, 2)) - 1, Number(f.substr(8, 2)));
					}
					
					tbl.setFocusedCell();
					tableModel.setDataAsMapArray(resultado, true);
					if (resultado.length > 0) tbl.setFocusedCell(4, 0, true);

					rpcLeer_producto = null;
					timerId = null;
				});
				
				rpcLeer_producto.callAsyncListeners(true, "buscar_producto", p);
				
			}, 0, this, null, 200);
		}
	}, this);
	
	
	
	
	//Menu contexto
	
	var commandEditar = new qx.ui.core.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tbl.setFocusedCell(4, tbl.getFocusedRow(), true);
		tbl.startEditing();
	});
	
	
	var menuBuscar = new componente.comp.ui.ramon.menu.Menu();
	var btnEditar = new qx.ui.menu.Button("Editar", null, commandEditar);
	menuBuscar.add(btnEditar);
	menuBuscar.memorizar();

	
	//Tabla

	var tableModel = new qx.ui.table.model.Simple();
	tableModel.setColumns(["Producto", "Lote", "F.vencimiento", "Stock", "Entregar"], ["descrip", "lote", "f_vencimiento", "stock", "entregar"]);
	//tableModel.setEditable(true);
	tableModel.setColumnEditable(4, true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
	//tbl.setWidth("20%");
	//tbl.setHeight(100);
	tbl.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	//tbl.setShowCellFocusIndicator(false);
	tbl.toggleColumnVisibilityButtonVisible();
	tbl.toggleStatusBarVisible();
	tbl.edicion = "desplazamiento_vertical";

	tbl.addListener("cellDbltap", function(e){
		commandEditar.execute();
	});

	
	var tableColumnModel = tbl.getTableColumnModel();
	var resizeBehavior = tableColumnModel.getBehavior();
	resizeBehavior.set(0, {width: "51%", minWidth: 100});
	resizeBehavior.set(1, {width: "15%", minWidth: 100});
	resizeBehavior.set(2, {width: "14%", minWidth: 100});
	resizeBehavior.set(3, {width: "10%"});
	resizeBehavior.set(4, {width: "10%"});
	
	var celleditorDate = new qx.ui.table.cellrenderer.Date();
	celleditorDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/yyyy"));
	tableColumnModel.setDataCellRenderer(2, celleditorDate);
	
	var celleditorNumber = new qx.ui.table.celleditor.TextField();
	celleditorNumber.setValidationFunction(function(newValue, oldValue){
		newValue = newValue.trim();
		if (newValue == "") return oldValue;
		else if (isNaN(newValue)) return oldValue; else return String((parseInt(newValue) < 0) ? 0 : parseInt(newValue));
	});
	tableColumnModel.setCellEditorFactory(4, celleditorNumber);
	
	
	var selectionModel = tbl.getSelectionModel();
	selectionModel.addListener("changeSelection", function(){
		var bool = (selectionModel.getSelectedCount() > 0);
		commandEditar.setEnabled(bool);
		menuBuscar.memorizar([commandEditar]);
	});
	

	tbl.setContextMenu(menuBuscar);

	gpb.add(tbl, {left: 0, right: 0, top: 30, height: "25%"});
	
	
	
	
	
	
	
	
	

	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
		var bandera = false;
		var buscar = {};
		var row, f;
		var dataAsMapArray = tableModel.getDataAsMapArray();
		for (var x in dataAsMapArray) {
			if (dataAsMapArray[x].entregar > 0) {
				bandera = true;
				if (tblItems.buscar("id_stock", dataAsMapArray[x].id_stock, true, 0, buscar) == null) {
					row = qx.lang.Json.parse(qx.lang.Json.stringify(dataAsMapArray[x]));
					f = row.f_vencimiento;
					row.f_vencimiento = new Date(Number(f.substr(0, 4)), Number(f.substr(5, 2)) - 1, Number(f.substr(8, 2)));
					
					tableModelItems.addRowsAsMapArray([row], null, true);
					tblItems.setFocusedCell(0, tableModelItems.getRowCount() - 1, true);					
				} else {
					tableModelItems.setValueById("stock", buscar.indice, dataAsMapArray[x].stock);
					tableModelItems.setValueById("entregar", buscar.indice, tableModelItems.getValueById("entregar", buscar.indice) + dataAsMapArray[x].entregar);
				}
			}
		}
		
		if (bandera) {
			txtProducto.setValue("");
			txtProducto.focus();
		}
	});
	
	
	var composite = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));
	composite.add(txtProducto, {width: "51%"});
	
	gpb.add(composite, {left: 0, top: 0, right: 0});
	gpb.add(btnAgregar, {right: 0, bottom: "62%"});
	
	
	
	
	
	
	//Menu contexto
	
	var commandEliminar = new qx.ui.core.Command("Del");
	commandEliminar.setEnabled(false);
	commandEliminar.addListener("execute", function(e){
		tblItems.blur();
		var focusedRow = tblItems.getFocusedRow();
		tblItems.setFocusedCell();
		tableModelItems.removeRows(focusedRow, 1);
		var rowCount = tableModelItems.getRowCount();
		if (rowCount > 0) {
			tblItems.setFocusedCell(0, ((focusedRow > rowCount - 1) ? rowCount - 1 : focusedRow), true);
			tblItems.focus();
		} else {
			txtProducto.focus();
		}
	});
	
	
	var menuItems = new componente.comp.ui.ramon.menu.Menu();
	var btnEliminar = new qx.ui.menu.Button("Eliminar", null, commandEliminar);
	menuItems.add(btnEliminar);
	menuItems.memorizar();

	
	//Tabla

	var tableModelItems = new qx.ui.table.model.Simple();
	tableModelItems.setColumns(["Producto", "Lote", "F.vencimiento", "Stock", "Entregar"], ["descrip", "lote", "f_vencimiento", "stock", "entregar"]);
	//tableModel.setEditable(true);
	//tableModel.setColumnEditable(0, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblItems = new componente.comp.ui.ramon.table.Table(tableModelItems, custom);
	//tblItems.setWidth("20%");
	//tblItems.setHeight(100);
	tblItems.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblItems.setShowCellFocusIndicator(false);
	tblItems.toggleColumnVisibilityButtonVisible();
	tblItems.toggleStatusBarVisible();
	
	var tableColumnModel = tblItems.getTableColumnModel();
	var resizeBehavior = tableColumnModel.getBehavior();
	resizeBehavior.set(0, {width: "51%", minWidth:100});
	resizeBehavior.set(1, {width: "15%", minWidth:100});
	resizeBehavior.set(2, {width: "14%", minWidth:100});
	resizeBehavior.set(3, {width: "10%"});
	resizeBehavior.set(4, {width: "10%"});
	
	var celleditorDate = new qx.ui.table.cellrenderer.Date();
	celleditorDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/yyyy"));
	tableColumnModel.setDataCellRenderer(2, celleditorDate);
	
	
	var selectionModelItems = tblItems.getSelectionModel();
	selectionModelItems.addListener("changeSelection", function(){
		var bool = (selectionModelItems.getSelectedCount() > 0);
		commandEliminar.setEnabled(bool);
		menuItems.memorizar([commandEliminar]);
	});
	

	tblItems.setContextMenu(menuItems);

	gpb.add(tblItems, {left: 0, right: 0, bottom: 0, height: "61%"});
	
	
	
	
	
	this.add(new qx.ui.basic.Label("Destino: "), {left: 0, top: 5});
	this.add(cboLugar, {left: 70, top: 0});
	this.add(new qx.ui.basic.Label("Detalle: "), {left: 0, top: 35});
	this.add(txtDescrip, {left: 70, top: 30});
	this.add(gpb, {left: 0, top: 70, right: 0, bottom: 35});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		//alert(qx.lang.Json.stringify(tableModelItems.getDataAsMapArray(), null, 2));
		//return;

		if (tableModelItems.getRowCount()==0) {
			dialog.Dialog.warning("Debe agregar algún item a la tabla de items", function(e){txtProducto.focus();});
		} else {
			var bandera = true;
			
			var dataAsMapArray = tableModelItems.getDataAsMapArray();
			for (var x in dataAsMapArray) {
				if (dataAsMapArray[x].entregar > dataAsMapArray[x].stock) {
					tblItems.setFocusedCell(0, x, true);
					dialog.Dialog.warning("La cantidad a entregar del item seleccionado excede el stock disponible", function(e){tblItems.focus();});
					bandera = false;
					break;
				}
			}
			
			if (bandera) {
				var p = {};
				p.id_entrega_lugar = cboLugar.getModelSelection().getItem(0);
				p.descrip = txtDescrip.getValue();
				p.items = dataAsMapArray;
				
				var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
				try {
					var resultado = rpc.callSync("grabar_entrega", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				window.open("services/class/comp/Impresion.php?rutina=comprobante_entrega&id_entrega=" + resultado);
				
				btnCancelar.execute();
			}
		}
	});
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "35%", bottom: 0});
	this.add(btnCancelar, {right: "35%", bottom: 0});
	
	
	cboLugar.setTabIndex(1);
	txtDescrip.setTabIndex(2);
	txtProducto.setTabIndex(3);
	tbl.setTabIndex(4);
	btnAgregar.setTabIndex(5);
	tblItems.setTabIndex(6);
	btnAceptar.setTabIndex(7);
	btnCancelar.setTabIndex(8);
		
		
	},
	members : 
	{

	}
});