qx.Class.define("elpintao.comp.deposito.pagePedidosSuc",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);
	
	this.setLabel('Pedidos de sucursal');
	this.setLayout(new qx.ui.layout.Canvas());
	this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(e){
		tblPedido.focus();
		slbSucursal.focus();
	});
	

	var application = qx.core.Init.getApplication();
	var contexto = this;
	var rowDataAcumulado = null;
	var arrayControl = [];
	var enviosAsignados = 0;
	
	
	var functionValidarEnvio = function() {
		enviosAsignados = 0;
		for (var x = 0; x < tableModelAcumulado.getRowCount(); x++) {
			if (tableModelAcumulado.getValueById("enviar", x) > 0) enviosAsignados+= 1;
		}
		menutblAcumulado.memorizarEnabled([btnGenerarRemitos], (enviosAsignados > 0));
		
		var rowCount = tableModelAcumulado.getRowCount();
		if (rowCount > 0) tblAcumulado.setAdditionalStatusBarText(rowCount + " item/s - Envios asignados: " + enviosAsignados); else tblAcumulado.setAdditionalStatusBarText(" ");
	}
	
	
	var slbSucursal = new qx.ui.form.SelectBox();
	slbSucursal.addListener("changeSelection", function(e){
		var rpc = new qx.io.remote.Rpc("services/", "comp.PedidosSuc");
		rpc.callAsync(function(resultado, error, id) {
			tblPedido.setFocusedCell();
			tableModelAcumulado.setDataAsMapArray([], true);
			tableModelDetalle.setDataAsMapArray([], true);
			tableModelSucursales.setDataAsMapArray([], true);
			tableModelPedido.setDataAsMapArray(resultado, true, true)
			//if (tableModelPedido.getRowCount() > 0) tblPedido.setFocusedCell(1, 0, true);
			if (resultado.length > 0) {
				tblPedido.setFocusedCell(0, 0, true);
				
				menutblPedido.memorizarEnabled([commandSeleccionar, btnImprimir], true);
			} else {
				menutblPedido.memorizarEnabled([commandSeleccionar, btnImprimir], false);
			}
		}, "leer_pedido", e.getData()[0].getModel());
	});
	this.add(slbSucursal, {left:0 , top: 20, right: "75%"});
	

	//Menu de contexto Pedido
	
	var commandSeleccionar = new qx.ui.core.Command("Space");
	commandSeleccionar.addListener("execute", function() {
		var focusedRowPedido = tblPedido.getFocusedRow();
		var rowDataPedido = tableModelPedido.getRowData(focusedRowPedido);
		
		var bool = ! tableModelPedido.getValueById("seleccionado", focusedRowPedido);
		if (bool) arrayControl.push(true); else arrayControl.pop();
		
		var detalle = rowDataPedido.detalle;
		var buscarRowAcumulado = {indice: null};
		for (var x in detalle) {
			var auxrowDataAcumulado = tblAcumulado.buscar("id_producto_item", detalle[x].id_producto_item, false, 0, buscarRowAcumulado);
			if (auxrowDataAcumulado != null && auxrowDataAcumulado.adicional) {
				tableModelAcumulado.removeRows(buscarRowAcumulado.indice, 1);
				
				buscarRowAcumulado = {indice: null};
				auxrowDataAcumulado = tblAcumulado.buscar("id_producto_item", detalle[x].id_producto_item, false, 0, buscarRowAcumulado);
			}
			
			if (auxrowDataAcumulado==null) {
				if (bool) {
					//auxrowDataAcumulado = qx.lang.Object.clone(detalle[x]);
					auxrowDataAcumulado = qx.lang.Json.parse(qx.lang.Json.stringify(detalle[x]));
					tableModelAcumulado.addRowsAsMapArray([auxrowDataAcumulado], null, true);
					buscarRowAcumulado.indice = tableModelAcumulado.getRowCount() - 1;
				}
			} else {
				//focusedRowAcumulado = tblAcumulado.getFocusedRow();
				if (bool) {
					auxrowDataAcumulado.cantidad = auxrowDataAcumulado.cantidad + detalle[x].cantidad;
				} else {
					auxrowDataAcumulado.cantidad = auxrowDataAcumulado.cantidad - detalle[x].cantidad;
				}
				tblAcumulado.setFocusedCell();
				tableModelSucursales.setDataAsMapArray([], true);
			}
			
			var stock = auxrowDataAcumulado.stock;
			var indiceStock = null;
			var deposito = 0;
			var sucursales = 0;
			for (var y in stock) {
				if (stock[y].id_sucursal == application.rowParamet.id_sucursal_deposito) {
					indiceStock = y;
					deposito+= stock[y].enviar;
				} else {
					sucursales+= stock[y].enviar;
				}
			}
			
			//alert(qx.lang.Json.stringify(stock, null, 2));
			
			if (stock[indiceStock].stock >= auxrowDataAcumulado.cantidad - sucursales) {
				stock[indiceStock].enviar = auxrowDataAcumulado.cantidad - sucursales;
				if (stock[indiceStock].enviar < 0) stock[indiceStock].enviar = 0;
			} else {
				stock[indiceStock].enviar = stock[indiceStock].stock;
				if (stock[indiceStock].enviar < 0) stock[indiceStock].enviar = 0;
			}
			auxrowDataAcumulado.enviar = stock[indiceStock].enviar + sucursales;
			
			tableModelAcumulado.setRowsAsMapArray([auxrowDataAcumulado], buscarRowAcumulado.indice, true);
			if (auxrowDataAcumulado.cantidad == 0) {
				tableModelAcumulado.removeRows(buscarRowAcumulado.indice, 1);
			}
		}
		
		
		if (arrayControl.length == 0) tableModelAcumulado.setDataAsMapArray([], true);
		
		if (tableModelAcumulado.getRowCount() > 0) {
			tblAcumulado.setFocusedCell(0, 0, true);
			menutblAcumulado.memorizarEnabled([commandAgregar, btnImprimir2], true);
		} else {
			tblAcumulado.setFocusedCell();
			menutblAcumulado.memorizarEnabled([commandAgregar, btnImprimir2], false);
		}

		tableModelPedido.setValueById("seleccionado", focusedRowPedido, bool);
		rowDataPedido.seleccionado = bool;
		functionValidarEnvio();
		//tblAcumulado.focus();
		//tblPedido.focus();
	});
	
	var menutblPedido = new componente.comp.ui.ramon.menu.Menu();
	var btnSeleccionar = new qx.ui.menu.Button("Seleccionar si/no", null, commandSeleccionar);

	var btnImprimir = new qx.ui.menu.Button("Imprimir");
	btnImprimir.setEnabled(false);
	btnImprimir.addListener("execute", function(e){
		var rowData = tableModelPedido.getRowData(tblPedido.getFocusedRow());
		window.open("services/class/comp/Impresion.php?rutina=imprimir_pedido_interno&tipo=deposito&id=" + rowData.id_pedido_suc);
	});
	
	menutblPedido.add(btnSeleccionar);
	menutblPedido.addSeparator();
	menutblPedido.add(btnImprimir);
	menutblPedido.memorizar();
	commandSeleccionar.setEnabled(false);

		
	
	//Tabla

	var tableModelPedido = new qx.ui.table.model.Simple();
	tableModelPedido.setColumns(["", "Fecha", "Fábrica"], ["seleccionado", "fecha", "fabrica"]);
	//tableModelPedido.setColumns(["Fecha", "Fábrica"], ["fecha", "id_fabrica"]);
	//tableModelPedido.setEditable(true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPedido = new componente.comp.ui.ramon.table.Table(tableModelPedido, custom);
	tblPedido.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblPedido.setShowCellFocusIndicator(false);
	tblPedido.toggleColumnVisibilityButtonVisible();
	tblPedido.toggleStatusBarVisible();
	
	tblPedido.addListener("cellDbltap", function(e){
		commandSeleccionar.execute();
	});
	
	
	var tableColumnModelPedido = tblPedido.getTableColumnModel();
	//tableColumnModelPedido.setColumnWidth(0, 30);
	//tableColumnModelPedido.setColumnWidth(1, 65);
	
	// Obtain the behavior object to manipulate

	var resizeBehavior = tableColumnModelPedido.getBehavior();
	resizeBehavior.set(0, {width:"10%", minWidth:100});
	resizeBehavior.set(1, {width:"35%", minWidth:100});
	resizeBehavior.set(2, {width:"55%", minWidth:100});

	
	var cellrenderer = new qx.ui.table.cellrenderer.Boolean();
	tableColumnModelPedido.setDataCellRenderer(0, cellrenderer);

	var selectionModelPedido = tblPedido.getSelectionModel();

	selectionModelPedido.addListener("changeSelection", function(e){
		if (! selectionModelPedido.isSelectionEmpty()) {
			var rowData = tableModelPedido.getRowData(tblPedido.getFocusedRow());
			tblDetalle.setFocusedCell();
			tableModelDetalle.setDataAsMapArray(rowData.detalle, true);
		}
	});

	tblPedido.setContextMenu(menutblPedido);
	

	this.add(tblPedido, {left:0 , top: 50, right: "75%", bottom: "50%"});
	
	this.add(new qx.ui.basic.Label("Pedidos:"), {left:0 , top: 0});
	


	
	
	

	//Tabla

	var tableModelDetalle = new qx.ui.table.model.Simple();
	tableModelDetalle.setColumns(["Fábrica", "Producto", "Capacidad", "U", "Color", "Cantidad"], ["fabrica", "producto", "capacidad", "unidad", "color", "cantidad"]);
	tableModelDetalle.addListener("dataChanged", function(e){
		var rowCount = tableModelDetalle.getRowCount();
		if (rowCount > 0) tblDetalle.setAdditionalStatusBarText(rowCount + " item/s"); else tblDetalle.setAdditionalStatusBarText(" ");
	});
	
	//tableModelDetalle.setEditable(true);
	//tableModelDetalle.setColumnEditable(4, true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblDetalle = new componente.comp.ui.ramon.table.Table(tableModelDetalle, custom);
	tblDetalle.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	//tblDetalle.toggleColumnVisibilityButtonVisible();
	tblDetalle.setShowCellFocusIndicator(false);
	tblDetalle.toggleColumnVisibilityButtonVisible();
	//tblDetalle.toggleStatusBarVisible();
	tblDetalle.setAdditionalStatusBarText(" ");
	
	var tableColumnModelDetalle = tblDetalle.getTableColumnModel();
	//tableColumnModelDetalle.setColumnVisible(7, false);
	

	


      // Obtain the behavior object to manipulate

		var resizeBehavior = tableColumnModelDetalle.getBehavior();
		resizeBehavior.set(0, {width:"9%", minWidth:100});
		resizeBehavior.set(1, {width:"42%", minWidth:100});
		resizeBehavior.set(2, {width:"9%", minWidth:100});
		resizeBehavior.set(3, {width:"4%", minWidth:100});
		resizeBehavior.set(4, {width:"15%", minWidth:100});
		resizeBehavior.set(5, {width:"8%", minWidth:100});

		
	
	var selectionModelDetalle = tblDetalle.getSelectionModel();

	
	
	this.add(tblDetalle, {left:"25.5%", top: 20, right: 0, bottom: "50%"});
	
	//this.add(tblPedido, {left:0 , top: 20, right: 0, height: "40%"});
	
	this.add(new qx.ui.basic.Label("Detalle:"), {left: "25.5%", top: 0});
	

	

	
	
	
	var commandEnviar = new qx.ui.core.Command("Enter");
	commandEnviar.setEnabled(false);
	commandEnviar.addListener("execute", function(e) {
		var popup = new elpintao.comp.deposito.popupStock(rowDataAcumulado);
		popup.addListener("disappear", function(e){
			tableModelAcumulado.setRowsAsMapArray([rowDataAcumulado], tblAcumulado.getFocusedRow(), true);
			functionValidarEnvio();
			tblAcumulado.focus();
		});
		
		popup.setPosition("top-right");
		popup.placeToWidget(tblAcumulado);
		
		//popup.placeToPoint({left: 550, top: 350});
		popup.show();
	});
	
	var commandAgregar = new qx.ui.core.Command("Insert");
	commandAgregar.setEnabled(false);
	commandAgregar.addListener("execute", function(e) {
		//alert(qx.lang.Json.stringify(rowDataAcumulado, null, 1));
		windowProducto.center();
		windowProducto.open();
	});
	
	
	var commandEliminar = new qx.ui.core.Command("Del");
	commandEliminar.setEnabled(false);
	commandEliminar.addListener("execute", function(e) {
		tblAcumulado.blur();
		tableModelAcumulado.removeRows(tblAcumulado.getFocusedRow(), 1);
		tblAcumulado.setFocusedCell(0, 0, true)
		tblAcumulado.focus();
	});
	
	var menutblAcumulado = new componente.comp.ui.ramon.menu.Menu();

	var btnEnviar = new qx.ui.menu.Button("Asignar envíos...", null, commandEnviar);
	var btnAgregar = new qx.ui.menu.Button("Agregar ítems adicionales...", null, commandAgregar);
	var btnEliminar = new qx.ui.menu.Button("Eliminar ítem adicional", null, commandEliminar);
	var btnImprimir2 = new qx.ui.menu.Button("Imprimir");
	btnImprimir2.setEnabled(false);
	btnImprimir2.addListener("execute", function(e){
		var p, rowDataAsMap, indice;
		
		for (var x = 0; x < tableModelAcumulado.getRowCount(); x++) {
			rowDataAsMap = tableModelAcumulado.getRowDataAsMap(x);
			indice = qx.lang.String.stripTags(rowDataAsMap.producto);
			indice = indice + rowDataAsMap.fabrica + rowDataAsMap.color + rowDataAsMap.unidad + qx.lang.String.pad(String(rowDataAsMap.capacidad), 11, " ");
			p = {key: indice, value: rowDataAsMap};
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.PedidosSuc");
			try {
				var resultado = rpc.callSync("cargar_pi_gral", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
		}
		
		window.open("services/class/comp/Impresion.php?rutina=imprimir_pi_gral");
	});
	var btnGenerarRemitos = new qx.ui.menu.Button("Generar remitos");
	btnGenerarRemitos.setEnabled(false);
	btnGenerarRemitos.addListener("execute", function(e){
		dialog.Dialog.confirm("Desea generar los remitos correspondientes a los " + enviosAsignados + " item/s con envíos asignados?", function(e){
			if (e) {
				var objSeleccionado = {id_pedido_int: [], id_pedido_suc: []};
				var dataAsMapArray = tableModelPedido.getDataAsMapArray();
				
				for (var x in dataAsMapArray) {
					if (dataAsMapArray[x].seleccionado) {
						objSeleccionado.id_pedido_int.push(dataAsMapArray[x].id_pedido_int);
						objSeleccionado.id_pedido_suc.push(dataAsMapArray[x].id_pedido_suc)
					}
				}
				
				var p = {};
				p.id_sucursal = slbSucursal.getModelSelection().getItem(0);
				p.seleccionado = objSeleccionado;
				//p.detalle = tableModelAcumulado.getDataAsMapArray();
				
				
				var aux = tableModelAcumulado.getDataAsMapArray();
				p.detalle = [];
				for (var x in aux) {
					p.detalle[x] = {id_producto_item: aux[x].id_producto_item, stock: []};

					for (var y in aux[x].stock) {
						if (aux[x].stock[y].enviar > 0) {
							p.detalle[x].stock.push({id_sucursal: aux[x].stock[y].id_sucursal, enviar: aux[x].stock[y].enviar});
						}
					}
				}
				
				var rpc = new qx.io.remote.Rpc("services/", "comp.PedidosSuc");
				try {
					var resultado = rpc.callSync("grabar_remitos", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				slbSucursal.fireDataEvent("changeSelection", slbSucursal.getSelection());
				application.functionTransmitir();
			}
		});
	});
	menutblAcumulado.add(btnEnviar);
	menutblAcumulado.addSeparator();
	menutblAcumulado.add(btnAgregar);
	menutblAcumulado.add(btnEliminar);
	menutblAcumulado.add(btnImprimir2);
	menutblAcumulado.addSeparator();
	menutblAcumulado.add(btnGenerarRemitos);
	menutblAcumulado.memorizar();
	
	
	
	
	
	
	//Tabla

	var tableModelAcumulado = new qx.ui.table.model.Simple();
	tableModelAcumulado.setColumns(["Fábrica", "Producto", "Capacidad", "U", "Color", "Cantidad", "Enviar"], ["fabrica", "producto", "capacidad", "unidad", "color", "cantidad", "enviar"]);
	tableModelAcumulado.addListener("dataChanged", function(e){
		var rowCount = tableModelAcumulado.getRowCount();
		if (rowCount > 0) tblAcumulado.setAdditionalStatusBarText(rowCount + " item/s - Envios asignados: " + enviosAsignados); else tblAcumulado.setAdditionalStatusBarText(" ");
	});
	
	//tableModelDetalle.setEditable(true);
	//tableModelDetalle.setColumnEditable(4, true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblAcumulado = new componente.comp.ui.ramon.table.Table(tableModelAcumulado, custom);
	tblAcumulado.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	//tblDetalle.toggleColumnVisibilityButtonVisible();
	tblAcumulado.setShowCellFocusIndicator(false);
	tblAcumulado.toggleColumnVisibilityButtonVisible();
	//tblAcumulado.toggleStatusBarVisible();
	tblAcumulado.setAdditionalStatusBarText(" ");
	
	tblAcumulado.addListener("cellDbltap", function(e){
		commandEnviar.execute();
	});
	
	var tableColumnModelAcumulado = tblAcumulado.getTableColumnModel();
	//tableColumnModelDetalle.setColumnVisible(7, false);
	
	var cellrendererHTML = new qx.ui.table.cellrenderer.Html();
	tableColumnModelAcumulado.setDataCellRenderer(1, cellrendererHTML);
	

	


      // Obtain the behavior object to manipulate

		var resizeBehavior = tableColumnModelAcumulado.getBehavior();
		resizeBehavior.set(0, {width:"9%", minWidth:100});
		resizeBehavior.set(1, {width:"42%", minWidth:100});
		resizeBehavior.set(2, {width:"9%", minWidth:100});
		resizeBehavior.set(3, {width:"4%", minWidth:100});
		resizeBehavior.set(4, {width:"15%", minWidth:100});
		resizeBehavior.set(5, {width:"8%", minWidth:100});
		resizeBehavior.set(6, {width:"8%", minWidth:100});

		
	
	var selectionModelAcumulado = tblAcumulado.getSelectionModel();

	selectionModelAcumulado.addListener("changeSelection", function(e){
		if (selectionModelAcumulado.isSelectionEmpty()) {
			commandEnviar.setEnabled(false);
			commandEliminar.setEnabled(false);
			//rowDataAcumulado = null;
		} else {
			var focusedRow = tblAcumulado.getFocusedRow();
			
			commandEnviar.setEnabled(true);
			
			rowDataAcumulado = tableModelAcumulado.getRowData(focusedRow);
			commandEliminar.setEnabled(rowDataAcumulado.adicional);
			tableModelSucursales.setDataAsMapArray(rowDataAcumulado.stock, true);
		}
		menutblAcumulado.memorizar([commandEnviar, commandEliminar]);
	});

	tblAcumulado.setContextMenu(menutblAcumulado);
	
	this.add(tblAcumulado, {left:"25.5%", top: "52%", right: 0, bottom: 0});
	

	
	
	
	//Tabla

	var tableModelSucursales = new qx.ui.table.model.Simple();
	tableModelSucursales.setColumns(["Sucursal", "Stock", "Enviar"], ["sucursal_descrip", "stock", "enviar"]);
	
	//tableModelDetalle.setEditable(true);
	//tableModelDetalle.setColumnEditable(4, true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblSucursales = new componente.comp.ui.ramon.table.Table(tableModelSucursales, custom);
	tblSucursales.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	//tblDetalle.toggleColumnVisibilityButtonVisible();
	tblSucursales.setShowCellFocusIndicator(false);
	tblSucursales.toggleColumnVisibilityButtonVisible();
	tblSucursales.toggleStatusBarVisible();
	
	//var tableColumnModelDetalle = tblSucursales.getTableColumnModel();
	//tableColumnModelDetalle.setColumnVisible(7, false);
	
      // Obtain the behavior object to manipulate

		//var resizeBehavior = tableColumnModelDetalle.getBehavior();
		//resizeBehavior.set(0, {width:"9%", minWidth:100});
		//resizeBehavior.set(1, {width:"42%", minWidth:100});
		//resizeBehavior.set(2, {width:"9%", minWidth:100});

		
	//var selectionModelDetalle = tblSucursales.getSelectionModel();

	
	
	this.add(tblSucursales, {left:0, top: "52%", right: "75%", bottom: 0});
	
	
	

	for (var x in application.arraySucursales) {
		slbSucursal.add(new qx.ui.form.ListItem(application.arraySucursales[x].descrip, null, application.arraySucursales[x].id_sucursal))
	}


	slbSucursal.setTabIndex(1);
	tblPedido.setTabIndex(2);
	tblDetalle.setTabIndex(3);
	tblAcumulado.setTabIndex(4);
	tblSucursales.setTabIndex(5);

	
	
	
	var windowProducto = new elpintao.comp.pedidos.windowProducto("Agregar items detalle", true);
	windowProducto.id_fabrica = "1";
	windowProducto.addListener("aceptado", function(e){
		var tableModel = e.getData();
	
		tblAcumulado.blur();
		
		var rowData;
		var rowBuscado;
		for (var x = 0; x < tableModel.getRowCount(); x++) {
			rowData = tableModel.getRowData(x);
			if (rowData.cantidad > 0) {
				rowBuscado = tblAcumulado.buscar("id_producto_item", rowData.id_producto_item);
				if (rowBuscado == null) {
					var p = {id_sucursal: slbSucursal.getModelSelection().getItem(0), id_producto_item: rowData.id_producto_item};
					var rpc = new qx.io.remote.Rpc("services/", "comp.PedidosSuc");
					try {
						var resultado = rpc.callSync("leer_stock", p);
					} catch (ex) {
						alert("Sync exception: " + ex);
					}
					
					rowData.producto = '<font color="#339900">' + rowData.producto + '</font>';
					rowData.stock = resultado;
					rowData.adicional = true;
					
					for (var y in rowData.stock) {
						if (rowData.stock[y].id_sucursal == application.rowParamet.id_sucursal_deposito) {
							if (rowData.stock[y].stock >= rowData.cantidad) rowData.stock[y].enviar = rowData.cantidad; else rowData.stock[y].enviar = rowData.stock[y].stock;
							if (rowData.stock[y].enviar < 0) rowData.stock[y].enviar = 0;
							rowData.enviar = rowData.stock[y].enviar;
							
							break;
						}
					}
					
					tableModelAcumulado.addRowsAsMapArray([rowData], null, true);
					tblAcumulado.setFocusedCell(0, tableModelAcumulado.getRowCount() - 1, true)
				}
			}
		}
	}, this);
	
	windowProducto.addListener("disappear", function(e){
		tblAcumulado.focus();
	});
	
	windowProducto.setModal(true);
	application.getRoot().add(windowProducto);
	
	
	
	},
	members : 
	{

	}
});