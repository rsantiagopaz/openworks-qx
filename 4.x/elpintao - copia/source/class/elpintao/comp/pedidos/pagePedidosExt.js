qx.Class.define("elpintao.comp.pedidos.pagePedidosExt",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);
	
	this.setLabel('Pedidos externos');
	this.setLayout(new qx.ui.layout.Canvas());
	this.toggleShowCloseButton();
	
	

	
	
	var application = qx.core.Init.getApplication();
	var contexto = this;
	var id_fabrica = "1";
	var internos = [];
	var numberformatMonto = new qx.util.format.NumberFormat("es");
	numberformatMonto.setMaximumFractionDigits(2);
	numberformatMonto.setMinimumFractionDigits(2);
	
	var functionActualizar = this.functionActualizar = function(){
		var p = {};
		p.id_fabrica = id_fabrica;
		var rpc = new qx.io.remote.Rpc("services/", "comp.PedidosExt");
		try {
			var resultado = rpc.callSync("leer_pedido", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		
		internos = resultado.internos;
		tableModelPedidoInt.setDataAsMapArray(internos, true);
		if (tableModelPedidoInt.getRowCount() > 0) tblPedidoInt.setFocusedCell(9, 0, true); else tblPedidoInt.setFocusedCell();
		tableModelPedidoExt.setDataAsMapArray(resultado.externos, true, true)
		//if (tableModelPedidoExt.getRowCount() > 0) tblPedidoExt.setFocusedCell(1, 0, true);
		functionCalcularTotales(tableModelPedidoInt, tableModelTotalesInt);
		
		tblPedidoExt.focus();
	};
	
	var functionCalcularTotales = function(tableModelD, tableModelT) {
		var rowDataAsMapDetalle, rowDataDetalle;
		var rowDataAsMapTotales, rowDataTotales;
		var bandera;
		
		tableModelT.setDataAsMapArray([{descrip: "P.lis.", total: 0}, {descrip: "P.lis.+IVA", total: 0}], true);
		
		for (var i = 0; i < tableModelD.getRowCount(); i++) {
			rowDataAsMapDetalle = tableModelD.getRowDataAsMap(i);
			rowDataDetalle = tableModelD.getRowData(i);
			
			if (rowDataAsMapDetalle.cantidad > 0) {
				rowDataAsMapTotales = tableModelT.getRowDataAsMap(0);
				tableModelT.setValueById("total", 0, rowDataAsMapTotales.total + (rowDataAsMapDetalle.cantidad * rowDataAsMapDetalle.precio_lista));
				rowDataAsMapTotales = tableModelT.getRowDataAsMap(1);
				tableModelT.setValueById("total", 1, rowDataAsMapTotales.total + (rowDataAsMapDetalle.cantidad * rowDataAsMapDetalle.plmasiva));
				bandera = true;
				for (var x = 2; x < tableModelT.getRowCount(); x++) {
					rowDataAsMapTotales = tableModelT.getRowDataAsMap(x);
					rowDataTotales = tableModelT.getRowData(x);
					if (rowDataDetalle.id_unidad == rowDataTotales.id_unidad) {
						tableModelT.setValueById("total", x, tableModelT.getValueById("total", x) + (rowDataAsMapDetalle.cantidad * rowDataAsMapDetalle.capacidad));
						bandera = false;
						break;
					}
				}
				if (bandera) {
					tableModelT.addRowsAsMapArray([{id_unidad: rowDataDetalle.id_unidad, descrip: rowDataAsMapDetalle.unidad, total: rowDataAsMapDetalle.cantidad * rowDataAsMapDetalle.capacidad}], null, true);
				}
			}
		}
	}
	
	
	var stack1 = new qx.ui.container.Stack();
	var composite1 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	var composite2 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	composite2.addListenerOnce("appear", function(e){
		var children = slbFabrica.getChildren();
		for (var x in children) {
			if (children[x].getModel().get("id_fabrica")=="1") {
				slbFabrica.setSelection([children[x]]);
				break;
			}
		}
	});
	stack1.add(composite1);
	stack1.add(composite2);
	
	var stack2 = new qx.ui.container.Stack();
	var composite3 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	var composite4 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	stack2.add(composite3);
	stack2.add(composite4);


	
	
	//Menu de contexto
	
/*
	var commandNuevoDetalle = new qx.ui.core.Command("Insert");
	commandNuevoDetalle.addListener("execute", function(){
		windowProducto.id_fabrica = slbFabrica.getModelSelection().getItem(0).get("id_fabrica");
		windowProducto.center();
		windowProducto.open();
	});
*/	
	var commandEditar = new qx.ui.core.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e) {
		tblPedidoInt.setFocusedCell(9, tblPedidoInt.getFocusedRow(), true);
		tblPedidoInt.startEditing();
	});
	
	var menutblPedidoInt = new componente.comp.ui.ramon.menu.Menu();
	//var btnNuevoDetalle = new qx.ui.menu.Button("Agregar item...", null, commandNuevoDetalle);
	var btnEditar = new qx.ui.menu.Button("Editar", null, commandEditar);
	var btnGenerarPedExt = new qx.ui.menu.Button("Generar pedido externo...");
	btnGenerarPedExt.setEnabled(false);
	btnGenerarPedExt.addListener("execute", function(e){
		var win = new elpintao.comp.pedidos.windowPedExt("Generar pedido externo - " + slbFabrica.getSelection()[0].getLabel());
		win.addListener("aceptado", function(e){
			var p = {};
			p.model = e.getData();
			p.id_fabrica = id_fabrica;
			p.detalle = tableModelPedidoInt.getDataAsMapArray();
			
			//alert(qx.lang.Json.stringify(p, null, 2));
	
			var rpc = new qx.io.remote.Rpc("services/", "comp.PedidosExt");
			try {
				var resultado = rpc.callSync("alta_pedido_ext", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			txtFiltrar.setValue("");
			tgbPedidos.setValue(false);

			rb1.fireEvent("execute");
			functionActualizar();
			//tblPedidoExt.focus();
			
			//btnInicializar.fireEvent("execute");
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});

	//menutblPedidoInt.add(btnNuevoDetalle);
	menutblPedidoInt.add(btnEditar);
	menutblPedidoInt.addSeparator();
	menutblPedidoInt.add(btnGenerarPedExt);
	menutblPedidoInt.memorizar();
	
	
	
		
	
	//Tabla

	var tableModelPedidoInt = new qx.ui.table.model.Simple();
	tableModelPedidoInt.setColumns(["Fábrica", "Producto", "Capacidad", "U", "Color", "Acumulado", "Stock", "St.suc.", "Vendido", "Cantidad"], ["fabrica", "producto", "capacidad", "unidad", "color", "acumulado", "stock", "stock_suc", "vendido", "cantidad"]);
	//tableModelPedido.setColumns(["Fecha", "Fábrica"], ["fecha", "id_fabrica"]);
	//tableModelPedido.setEditable(true);
	tableModelPedidoInt.setColumnEditable(9, true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPedidoInt = new componente.comp.ui.ramon.table.Table(tableModelPedidoInt, custom);
	tblPedidoInt.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblPedidoInt.setShowCellFocusIndicator(true);
	tblPedidoInt.toggleColumnVisibilityButtonVisible();
	tblPedidoInt.toggleStatusBarVisible();
	tblPedidoInt.edicion="desplazamiento_vertical";
	
	
	var tableColumnModelPedidoInt = tblPedidoInt.getTableColumnModel();
	//tableColumnModelPedido.setColumnWidth(0, 65);
	//tableColumnModelPedido.setColumnWidth(1, 65);
	
		var resizeBehavior = tableColumnModelPedidoInt.getBehavior();
		resizeBehavior.set(0, {width:"10%", minWidth:100});
		resizeBehavior.set(1, {width:"30%", minWidth:100});
		resizeBehavior.set(2, {width:"6%", minWidth:100});
		resizeBehavior.set(3, {width:"2.5%", minWidth:100});
		resizeBehavior.set(4, {width:"18%", minWidth:100});
		resizeBehavior.set(5, {width:"6%", minWidth:100});

		
	var celleditorNumber = new qx.ui.table.celleditor.TextField();
	celleditorNumber.setValidationFunction(function(newValue, oldValue){
		newValue = newValue.trim();
		if (newValue=="") return oldValue;
		else if (isNaN(newValue)) return oldValue; else if (parseFloat(newValue) < 0) return oldValue; else return newValue;
	});
	tableColumnModelPedidoInt.setCellEditorFactory(9, celleditorNumber);
	
	
	tblPedidoInt.setContextMenu(menutblPedidoInt);

	var selectionModelPedidoInt = tblPedidoInt.getSelectionModel();

	selectionModelPedidoInt.addListener("changeSelection", function(e){
		//commandEditar.setEnabled(! selectionModelPedidoInt.isSelectionEmpty() && ! tgbPedidos.getValue());
		if (selectionModelPedidoInt.isSelectionEmpty()) {
			commandEditar.setEnabled(false);
		} else {
			commandEditar.setEnabled(true && ! tgbPedidos.getValue());
			var rowData = tableModelPedidoInt.getRowData(tblPedidoInt.getFocusedRow());
			tableModelDetallePedInt.setDataAsMapArray(rowData.detallePedInt);
			tableModelDetalleStock.setDataAsMapArray(rowData.detalleStock);
		}
		menutblPedidoInt.memorizar([commandEditar]);
	});
	
	tblPedidoInt.addListener("cellDbltap", function(e) {
		commandEditar.fireDataEvent("execute");
	});
	
	tblPedidoInt.addListener("dataEdited", function(e){
		var data = e.getData();
		if (data.value != data.oldValue) {
			var rowData = tableModelPedidoInt.getRowData(data.row);
			rowData.cantidad = data.value;
			functionCalcularTotales(tableModelPedidoInt, tableModelTotalesInt);
		}
	});

	composite2.add(tblPedidoInt, {left:0 , top: 31, right: 0, bottom: "30.5%"});
	//composite1.add(new qx.ui.basic.Label("Pedidos:"), {left:0 , top: 0});
	
	

	composite2.add(new qx.ui.basic.Label("Fábrica: "), {left: 320 , top: 7});
	
	var menuFabrica = new componente.comp.ui.ramon.menu.Menu();
	var btnABMFabrica = new qx.ui.menu.Button("ABM fábricas...");
	btnABMFabrica.addListener("execute", function(e){
		var win = new componente.comp.elpintao.ramon.parametros.windowFabricas();
		win.addListener("disappear", function(e){slbFabrica.focus();});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();	
	});
	menuFabrica.add(btnABMFabrica);
	menuFabrica.memorizar();
	btnABMFabrica.setEnabled(false);
	var slbFabrica = this.slbFabrica = new componente.comp.ui.ramon.selectbox.SelectBox();
	slbFabrica.setWidth(170);
	slbFabrica.setContextMenu(menuFabrica);
	var controllerFabrica = new qx.data.controller.List(null, slbFabrica, "descrip");
	application.objFabrica.store.bind("model", controllerFabrica, "model");
	composite2.add(slbFabrica, {left: 370 , top: 3});
	slbFabrica.addListener("changeSelection", function(e){
		id_fabrica = slbFabrica.getModelSelection().getItem(0).get("id_fabrica");
		if (id_fabrica=="1") {
			tblPedidoInt.setFocusedCell();
			internos = [];
			tableModelPedidoInt.setDataAsMapArray(internos, true);
		} else {
			functionActualizar();
		}
		txtFiltrar.setValue("");
		//chkPedidos.setValue(false);
	});
	
	
	composite2.add(new qx.ui.basic.Label("Filtrar: "), {left: 570 , top: 7});
	var txtFiltrar = new qx.ui.form.TextField("");
	txtFiltrar.setLiveUpdate(true);
	txtFiltrar.setWidth(280);
	txtFiltrar.addListener("changeValue", function(e){
		var bandera;
		var split;
		
		tblPedidoInt.setFocusedCell();
		var filtrar = txtFiltrar.getValue().trim().toLowerCase();
		if (filtrar=="") {
			tableModelPedidoInt.setDataAsMapArray(internos, true);
		} else {
			split = filtrar.split(" ");
			tableModelPedidoInt.setDataAsMapArray([], true);
			for (var x = 0; x < internos.length; x++) {
				bandera = true;
				for (var y = 0; y < split.length; y++) {
					if (split[y]!="") {
						if (internos[x].busqueda.toLowerCase().indexOf(split[y]) == -1) {
							bandera = false;
							break;
						}
					}
				}
				if (bandera) tableModelPedidoInt.addRowsAsMapArray([internos[x]], null, true);
			}
			if (tableModelPedidoInt.getRowCount() > 0) tblPedidoInt.setFocusedCell(9, 0, true);
		}
	});
	composite2.add(txtFiltrar, {left: 610 , top: 3});
	

	var tgbPedidos = new qx.ui.form.ToggleButton("Ver editados");
	tgbPedidos.addListener("changeValue", function(e){
		tblPedidoInt.setFocusedCell();
		if (e.getData()) {
			tableModelPedidoInt.setColumnEditable(9, false);
	
			slbFabrica.setEnabled(false);
			txtFiltrar.setEnabled(false);
			tableModelPedidoInt.setDataAsMapArray([], true);
			for (var x = 0; x < internos.length; x++) {
				if (internos[x].cantidad > 0) tableModelPedidoInt.addRowsAsMapArray([internos[x]], null, true);
			}
			btnGenerarPedExt.setEnabled(tableModelPedidoInt.getRowCount() > 0);
		} else {
			tableModelPedidoInt.setColumnEditable(9, true);
			
			slbFabrica.setEnabled(true);
			txtFiltrar.setEnabled(true);
			btnGenerarPedExt.setEnabled(false);
			txtFiltrar.fireDataEvent("changeValue");
		}
		menutblPedidoInt.memorizar([btnGenerarPedExt]);
		if (tableModelPedidoInt.getRowCount() > 0) tblPedidoInt.setFocusedCell(9, 0, true);
	});
	composite2.add(tgbPedidos, {right: 0 , top: 3});
	
	var chkPedidos = new qx.ui.form.CheckBox("Ver pedidos");
	//composite2.add(chkPedidos, {right: 0 , top: 7});
	
	
	var windowProducto = new elpintao.comp.pedidos.windowProducto("Agregar items");
	windowProducto.setModal(true);
	windowProducto.addListener("aceptado", function(e){
		var tableModel = e.getData();
		var rowData;
		var rowBuscado;
		for (var x = 0; x < tableModel.getRowCount(); x++) {
			rowData = tableModel.getRowData(x);
			if (rowData.cantidad > 0) {
				rowBuscado = tblPedidoInt.buscar("id_producto_item", rowData.id_producto_item, true, 9);
				if (rowBuscado == null) {
					rowData.detalle = [];
					tableModelPedidoInt.addRowsAsMapArray([rowData], null, true);
					tblPedidoInt.buscar("id_producto_item", rowData.id_producto_item, true, 9);
				} else {
					rowBuscado.cantidad = rowBuscado.cantidad + rowData.cantidad;
					tableModelPedidoInt.setRowsAsMapArray([rowBuscado], tblPedidoInt.getFocusedRow(), true, false);
				}
				functionCalcularTotales(tableModelPedidoInt, tableModelTotalesInt);
				btnGenerarPedExt.setEnabled(tableModelTotalesInt.getRowCount() > 2);
				menutblPedidoInt.memorizar([btnGenerarPedExt]);
			}
		}
		tblPedidoInt.focus();
	}, this);
	
	windowProducto.addListener("disappear", function(e){
		tblPedidoInt.focus();
	});
	
	application.getRoot().add(windowProducto);
	
	
	
	
	
	
	
	

	
	
	//Tabla

	var tableModelTotalesInt = new qx.ui.table.model.Simple();
	tableModelTotalesInt.setColumns(["", "Total"], ["descrip", "total"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblTotalesInt = new componente.comp.ui.ramon.table.Table(tableModelTotalesInt, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblTotalesInt.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblTotalesInt.setShowCellFocusIndicator(false);
	tblTotalesInt.toggleColumnVisibilityButtonVisible();
	tblTotalesInt.toggleStatusBarVisible();
	
	var tableColumnModelTotalesInt = tblTotalesInt.getTableColumnModel();
	
	var renderer = new qx.ui.table.cellrenderer.Number();
	renderer.setNumberFormat(numberformatMonto);
	tableColumnModelTotalesInt.setDataCellRenderer(1, renderer);
	
	composite2.add(tblTotalesInt, {left: "85%", top: "70%", right: 0, bottom: 0});
	
	
	//Tabla

	var tableModelDetallePedInt = new qx.ui.table.model.Simple();
	tableModelDetallePedInt.setColumns(["Sucursal", "Cantidad"], ["descrip", "cantidad"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblDetallePedInt = new componente.comp.ui.ramon.table.Table(tableModelDetallePedInt, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblDetallePedInt.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblDetallePedInt.setShowCellFocusIndicator(false);
	tblDetallePedInt.toggleColumnVisibilityButtonVisible();
	tblDetallePedInt.toggleStatusBarVisible();
	
	composite2.add(tblDetallePedInt, {left: 0, top: "74%", bottom: 0});
	composite2.add(new qx.ui.basic.Label("Detalle pedidos int."), {left: 0, top: "71%"});
	
	
	//Tabla

	var tableModelDetalleStock = new qx.ui.table.model.Simple();
	tableModelDetalleStock.setColumns(["Sucursal", "Stock"], ["descrip", "stock"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblDetalleStock = new componente.comp.ui.ramon.table.Table(tableModelDetalleStock, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblDetalleStock.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblDetalleStock.setShowCellFocusIndicator(false);
	tblDetalleStock.toggleColumnVisibilityButtonVisible();
	tblDetalleStock.toggleStatusBarVisible();
	
	composite2.add(tblDetalleStock, {left: 230, top: "74%", bottom: 0});
	composite2.add(new qx.ui.basic.Label("Detalle stock"), {left: 230, top: "71%"});
	

	functionCalcularTotales(tableModelPedidoInt, tableModelTotalesInt);
	
	
	
		var toolbar1 = new qx.ui.toolbar.ToolBar();
		var rb1 = new qx.ui.toolbar.RadioButton(" Pedidos externos actuales ");
		var rb2 = new qx.ui.toolbar.RadioButton(" Pedidos internos acumulados ");
		rb1.addListener("execute", function(){stack1.setSelection([composite1]);});
		rb2.addListener("execute", function(){stack1.setSelection([composite2]);});
		toolbar1.add(rb1);
		toolbar1.add(rb2);
		var radioGroup1 = new qx.ui.form.RadioGroup(rb1, rb2);
		this.add(stack1, {left: 0, top: 0, right: 0, bottom: 0});
		this.add(toolbar1, {left: 0, top: 0});
		
		


		
		
	var menutblPedidoExt = new componente.comp.ui.ramon.menu.Menu();
	var btnRecibirPedExt = new qx.ui.menu.Button("Recibir pedido externo...");
	btnRecibirPedExt.setEnabled(false);
	btnRecibirPedExt.addListener("execute", function(e) {
		var rowData = tableModelPedidoExt.getRowData(tblPedidoExt.getFocusedRow());
		if (! rowData.recibido) {
			var parametro = {};
			parametro.id_pedido_ext = rowData.id_pedido_ext;
			parametro.id_fabrica = rowData.id_fabrica;
			parametro.label = "Pedido externo: " + rowData.fecha + " - " + rowData.fabrica;
			parametro.detalle = rowData.detalle;
			application.functionPuntearPedidoExt(parametro);
		}
	});
	
	var btnImprimir = new qx.ui.menu.Button("Imprimir");
	btnImprimir.setEnabled(false);
	btnImprimir.addListener("execute", function(e) {
		var rowData = tableModelPedidoExt.getRowData(tblPedidoExt.getFocusedRow());
		window.open("services/class/comp/Impresion.php?rutina=imprimir_pedext&id_pedido_ext=" + rowData.id_pedido_ext);
	});
	menutblPedidoExt.add(btnRecibirPedExt);
	menutblPedidoExt.add(btnImprimir);
	menutblPedidoExt.memorizar();
		
		

	//Tabla

	var tableModelPedidoExt = new qx.ui.table.model.Simple();
	tableModelPedidoExt.setColumns(["Fecha", "Fábrica", "Recibido", "Teléfono", "E-mail", "Transporte", "Domic.entrega"], ["fecha", "fabrica", "fecha_recibido", "telefono", "email", "transporte", "domicilio"]);
	//tableModelPedido.setColumns(["Fecha", "Fábrica"], ["fecha", "id_fabrica"]);
	//tableModelPedido.setEditable(true);
	

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPedidoExt = new componente.comp.ui.ramon.table.Table(tableModelPedidoExt, custom);
	tblPedidoExt.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblPedidoExt.setShowCellFocusIndicator(false);
	tblPedidoExt.toggleColumnVisibilityButtonVisible();
	tblPedidoExt.toggleStatusBarVisible();
	
	
	var tableColumnModelPedidoExt = tblPedidoExt.getTableColumnModel();
	//tableColumnModelPedido.setColumnWidth(0, 65);
	//tableColumnModelPedido.setColumnWidth(1, 65);
	
	tblPedidoExt.setContextMenu(menutblPedidoExt);

	

	var selectionModelPedidoExt = tblPedidoExt.getSelectionModel();

	selectionModelPedidoExt.addListener("changeSelection", function(e){
		if (selectionModelPedidoExt.isSelectionEmpty()) {
			btnRecibirPedExt.setEnabled(false);
			btnImprimir.setEnabled(false);
		} else {
			btnImprimir.setEnabled(true);
			var rowData = tableModelPedidoExt.getRowData(tblPedidoExt.getFocusedRow());
			tableModelDetalleExt.setDataAsMapArray(rowData.detalle, true);
			tableModelDetalleRec.setDataAsMapArray(rowData.recibidos, true);
			functionCalcularTotales(tableModelDetalleExt, tableModelTotalesExt);
			
			btnRecibirPedExt.setEnabled(! rowData.recibido);
		}
		menutblPedidoExt.memorizar([btnRecibirPedExt, btnImprimir]);
	});

	composite1.add(tblPedidoExt, {left:0 , top: 31, right: 0, bottom: "54%"});
	
	
	//Tabla
	
	var tableModelDetalleExt = new qx.ui.table.model.Simple();
	tableModelDetalleExt.setColumns(["Producto", "Color", "Capacidad", "U", "P.lis.", "P.lis.+IVA", "Cantidad"], ["producto", "color", "capacidad", "unidad", "precio_lista", "plmasiva", "cantidad"]);
	
	//tableModelDetalle.setEditable(true);
	//tableModelDetalle.setColumnEditable(4, true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblDetalleExt = new componente.comp.ui.ramon.table.Table(tableModelDetalleExt, custom);
	tblDetalleExt.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblDetalleExt.setShowCellFocusIndicator(false);
	tblDetalleExt.toggleColumnVisibilityButtonVisible();
	tblDetalleExt.toggleStatusBarVisible();
	
	var tableColumnModelDetalleExt = tblDetalleExt.getTableColumnModel();
	//tableColumnModelDetalle.setColumnVisible(7, false);
	

      // Obtain the behavior object to manipulate

		var resizeBehavior = tableColumnModelDetalleExt.getBehavior();
		resizeBehavior.set(0, {width:"47%", minWidth:100});
		resizeBehavior.set(1, {width:"18%", minWidth:100});
		resizeBehavior.set(2, {width:"7%", minWidth:100});
		resizeBehavior.set(3, {width:"3%", minWidth:100});
		resizeBehavior.set(4, {width:"7%", minWidth:100});
		resizeBehavior.set(5, {width:"8%", minWidth:100});
		resizeBehavior.set(6, {width:"7%", minWidth:100});
		
		
		var renderer = new qx.ui.table.cellrenderer.Number();
		renderer.setNumberFormat(numberformatMonto);
		tableColumnModelDetalleExt.setDataCellRenderer(4, renderer);
		tableColumnModelDetalleExt.setDataCellRenderer(5, renderer);

		
	
	var selectionModelDetalleExt = tblDetalleExt.getSelectionModel();
	selectionModelDetalleExt.addListener("changeSelection", function(e){

	});
	
	
	composite3.add(tblDetalleExt, {left:0, top: 0, right: "15.5%", bottom: 0});
	
	//this.add(tblPedido, {left:0 , top: 20, right: 0, height: "40%"});
	
	//composite1.add(new qx.ui.basic.Label("Detalle:"), {left: 0, top: "47%"});
	
	
	
	//Tabla

	var tableModelTotalesExt = new qx.ui.table.model.Simple();
	tableModelTotalesExt.setColumns(["", "Total"], ["descrip", "total"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblTotalesExt = new componente.comp.ui.ramon.table.Table(tableModelTotalesExt, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblTotalesExt.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblTotalesExt.setShowCellFocusIndicator(false);
	tblTotalesExt.toggleColumnVisibilityButtonVisible();
	tblTotalesExt.toggleStatusBarVisible();
	
	var tableColumnModelTotalesExt = tblTotalesExt.getTableColumnModel();
	
	var renderer = new qx.ui.table.cellrenderer.Number();
	renderer.setNumberFormat(numberformatMonto);
	tableColumnModelTotalesExt.setDataCellRenderer(1, renderer);
	
	composite3.add(tblTotalesExt, {left: "85%", top: 0, right: 0, bottom: 0});
	
	
	

	
	
	
		var toolbar2 = new qx.ui.toolbar.ToolBar();
		var rb3 = new qx.ui.toolbar.RadioButton(" Detalle pedidos ");
		var rb4 = new qx.ui.toolbar.RadioButton(" Detalle recibidos ");
		rb3.addListener("execute", function(){stack2.setSelection([composite3]);});
		rb4.addListener("execute", function(){stack2.setSelection([composite4]);});
		toolbar2.add(rb3);
		toolbar2.add(rb4);
		var radioGroup2 = new qx.ui.form.RadioGroup(rb3, rb4);
		composite1.add(toolbar2, {left: 0, top: "46%"});
		composite1.add(stack2, {left: 0, top: "52%", right: 0, bottom: 0});
	
	
	
	

	var tableModelDetalleRec = new qx.ui.table.model.Simple();
	tableModelDetalleRec.setColumns(["Producto", "Color", "Capacidad", "U", "Cantidad"], ["producto", "color", "capacidad", "unidad", "cantidad"]);
	
	//tableModelDetalle.setEditable(true);
	//tableModelDetalle.setColumnEditable(4, true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblDetalleRec = new componente.comp.ui.ramon.table.Table(tableModelDetalleRec, custom);
	tblDetalleRec.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblDetalleRec.setShowCellFocusIndicator(false);
	tblDetalleRec.toggleColumnVisibilityButtonVisible();
	tblDetalleRec.toggleStatusBarVisible();
	
	var tableColumnModelDetalleRec = tblDetalleRec.getTableColumnModel();
	//tableColumnModelDetalle.setColumnVisible(7, false);
	
      // Obtain the behavior object to manipulate

		var resizeBehavior = tableColumnModelDetalleRec.getBehavior();
		resizeBehavior.set(0, {width:"47%", minWidth:100});
		resizeBehavior.set(1, {width:"18%", minWidth:100});
		resizeBehavior.set(2, {width:"7%", minWidth:100});
		resizeBehavior.set(3, {width:"3%", minWidth:100});
		resizeBehavior.set(4, {width:"7%", minWidth:100});

		
	composite4.add(tblDetalleRec, {left:0, top: 0, right: "15.5%", bottom: 0});
		
		
		

	
	
	
	functionCalcularTotales(tableModelDetalleExt, tableModelTotalesExt);

	
	functionActualizar();
	internos = [];
	tableModelPedidoInt.setDataAsMapArray(internos, true);
	

	this.addListenerOnce("appear", function(e){
		tblPedidoInt.focus();
	});
	
	},
	members : 
	{

	}
});