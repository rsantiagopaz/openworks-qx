qx.Class.define("sacdiag.comp.pageABMprestadores",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('ABM prestadores');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		//cboTitulo.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataPrestador;
	var rowDataPrestacion;
	
	
	
	var functionActualizarPrestador = function(id_prestador) {
		tblPrestador.blur();
		tblPrestador.setFocusedCell();
		tblPrestacion.setFocusedCell();
		
		btnEstadoPrestacion.setEnabled(false);
		menuPrestacion.memorizar([btnEstadoPrestacion]);
		
		btnAgregarPrestacion.setEnabled(false);
		tableModelPrestacion.setDataAsMapArray([], true);


		var p = {};
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));

			tableModelPrestador.setDataAsMapArray(data.result, true);
			
			if (id_prestador != null) {
				tblPrestador.blur();
				tblPrestador.buscar("organismo_area_id", id_prestador);
				tblPrestador.focus();
			}
		});
		rpc.callAsyncListeners(true, "autocompletarPrestador", p);
		
		return rpc;
	}
	
	
	var functionActualizarPrestacion = function(id_prestador_prestacion) {
		tblPrestacion.blur();
		tblPrestacion.setFocusedCell();
		
		var p = {};
		p.id_prestador = rowDataPrestador.organismo_area_id;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			//alert(qx.lang.Json.stringify(data, null, 2));
			
			tableModelPrestacion.setDataAsMapArray(data.result, true);
			
			if (id_prestador_prestacion != null) {
				tblPrestacion.blur();
				tblPrestacion.buscar("id_prestador_prestacion", id_prestador_prestacion);
				tblPrestacion.focus();
			}
		});
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			alert(qx.lang.Json.stringify(data, null, 2));
			

		});
		
		rpc.callAsyncListeners(true, "leer_prestador_prestacion", p);

		return rpc;
	}
	
	

	
	
	
	
	
	// Menu

	
	var commandAgregarPrestador = new qx.ui.command.Command("Insert");
	commandAgregarPrestador.addListener("execute", function(e){
		var win = new sacdiag.comp.windowPrestador();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarPrestador(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAgregarPrestador = new qx.ui.menu.Button("Agregar...", null, commandAgregarPrestador);
	
	
	var commandEditarPrestador = new qx.ui.command.Command("F2");
	commandEditarPrestador.setEnabled(false);
	commandEditarPrestador.addListener("execute", function(e){
		var win = new sacdiag.comp.windowPrestador(rowDataPrestador);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarPrestador(data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnEditarPrestador = new qx.ui.menu.Button("Editar...", null, commandEditarPrestador);
	
	
	var menuPrestador = new componente.comp.ui.ramon.menu.Menu();
	
	menuPrestador.add(btnAgregarPrestador);
	menuPrestador.add(btnEditarPrestador);
	menuPrestador.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrestador = new qx.ui.table.model.Simple();
	tableModelPrestador.setColumns(["Descripción", "CUIT", "Domicilio", "Teléfono", "Contacto"], ["denominacion", "cuit", "domicilio", "telefonos", "contacto"]);
	tableModelPrestador.addListener("dataChanged", function(e){
		var rowCount = tableModelPrestador.getRowCount();
		
		tblPrestador.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPrestador = new componente.comp.ui.ramon.table.Table(tableModelPrestador, custom);
	tblPrestador.setShowCellFocusIndicator(false);
	tblPrestador.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblPrestador.setContextMenu(menuPrestador);

	
	var tableColumnModelPrestador = tblPrestador.getTableColumnModel();
	
	var resizeBehaviorPrestador = tableColumnModelPrestador.getBehavior();

	resizeBehaviorPrestador.set(0, {width:"30%", minWidth:100});
	resizeBehaviorPrestador.set(1, {width:"15%", minWidth:100});
	resizeBehaviorPrestador.set(2, {width:"30%", minWidth:100});
	resizeBehaviorPrestador.set(3, {width:"15%", minWidth:100});
	resizeBehaviorPrestador.set(4, {width:"10%", minWidth:100});

	
	
	var selectionModelPrestador = tblPrestador.getSelectionModel();
	selectionModelPrestador.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestador.addListener("changeSelection", function(e){
		if (! selectionModelPrestador.isSelectionEmpty()) {
			rowDataPrestador = tableModelPrestador.getRowDataAsMap(tblPrestador.getFocusedRow());
			
			btnAgregarPrestacion.setEnabled(true);
			
			functionActualizarPrestacion();
			
			commandEditarPrestador.setEnabled(true);
		} else {
			commandEditarPrestador.setEnabled(false);
		}
		
		menuPrestador.memorizar([commandEditarPrestador]);
	});

	this.add(tblPrestador, {left: 0, top: 20, right: "53%", bottom: 0});	
	
	this.add(new qx.ui.basic.Label("Prestador"), {left: 0, top: 0});
	
	
	
	var aux = new qx.ui.layout.HBox(6);
	aux.setAlignY("middle");
	
	var composite = new qx.ui.container.Composite(aux);
	this.add(composite, {left: "53%", top: 0});
	
	composite.add(new qx.ui.basic.Label("Prestación:"));
	
	var cboPrestacion = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarPrestacion"});
	cboPrestacion.setWidth(400);
	
	var lstPrestacion = cboPrestacion.getChildControl("list");
	lstPrestacion.addListener("changeSelection", function(e){
		var data = e.getData();
		
	});
	composite.add(cboPrestacion);
	
	
	var btnAgregarPrestacion = new qx.ui.form.Button("Agregar");
	btnAgregarPrestacion.addListener("execute", function(e){
		var model = lstPrestacion.getSelection()[0].getModel();
		
		if (tblPrestacion.buscar("id_prestacion", model) == null) {
			var p = {};
			p.id_prestador = rowDataPrestador.model;
			p.id_prestacion = model;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				lstPrestacion.resetSelection();
				cboPrestacion.setValue("");
				
				var rpc = functionActualizarPrestacion(data.result);
				rpc.addListener("completed", function(e){
					cboPrestacion.focus();
				})
			});
			rpc.callAsyncListeners(true, "agregar_prestador_prestacion", p);
		}
	});
	composite.add(btnAgregarPrestacion);
	
	
	
	
	
	
	
	
	
	
	// Menu


	var radioGroup = new qx.ui.form.RadioGroup();
	
	var btnEstadoHabilitado = new qx.ui.menu.RadioButton("Habilitado");
	btnEstadoHabilitado.setValue(true);
	btnEstadoHabilitado.addListener("execute", function(e){
		rowDataPrestacion.estado = "H";
		
		tableModelPrestacion.setRowsAsMapArray([rowDataPrestacion], tblPrestacion.getFocusedRow(), true);
		
		
		var p = rowDataPrestacion;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.callAsyncListeners(true, "escribir_estado", p);
	});
	var btnEstadoSuspendido = new qx.ui.menu.RadioButton("Suspendido");
	btnEstadoSuspendido.addListener("execute", function(e){
		rowDataPrestacion.estado = "S";
		
		tableModelPrestacion.setRowsAsMapArray([rowDataPrestacion], tblPrestacion.getFocusedRow(), true);
		
		
		var p = rowDataPrestacion;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.callAsyncListeners(true, "escribir_estado", p);
	});
	
	var menuEstado = new componente.comp.ui.ramon.menu.Menu();
	menuEstado.add(btnEstadoHabilitado);
	menuEstado.add(btnEstadoSuspendido);
	
	radioGroup.add(btnEstadoHabilitado);
	radioGroup.add(btnEstadoSuspendido);
	
	
	var btnEstadoPrestacion = new qx.ui.menu.Button("Estado", null, null, menuEstado);
	btnEstadoPrestacion.setEnabled(false);
	
	
	var btnEliminarPrestacion = new qx.ui.menu.Button("Eliminar...");
	btnEliminarPrestacion.addListener("execute", function(e){

	});
	
	
	var menuPrestacion = new componente.comp.ui.ramon.menu.Menu();
	
	menuPrestacion.add(btnEstadoPrestacion);
	//menuPrestacion.addSeparator();
	//menuPrestacion.add(btnEliminarPrestacion);
	menuPrestacion.memorizar();
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Código", "Descripción", "Valor", "Estado"], ["codigo", "denominacion", "valor", "estado"]);
	tableModelPrestacion.addListener("dataChanged", function(e){
		var rowCount = tableModelPrestacion.getRowCount();
		
		tblPrestacion.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPrestacion = new componente.comp.ui.ramon.table.Table(tableModelPrestacion, custom);
	tblPrestacion.setShowCellFocusIndicator(false);
	tblPrestacion.toggleColumnVisibilityButtonVisible();
	tblPrestacion.setContextMenu(menuPrestacion);
	
	var tableColumnModelPrestacion = tblPrestacion.getTableColumnModel();
	
	var resizeBehaviorPrestacion = tableColumnModelPrestacion.getBehavior();
	resizeBehaviorPrestacion.set(0, {width:"15%", minWidth:100});
	resizeBehaviorPrestacion.set(1, {width:"65%", minWidth:100});
	resizeBehaviorPrestacion.set(2, {width:"10%", minWidth:100});
	resizeBehaviorPrestacion.set(3, {width:"10%", minWidth:100});


	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"H" : "Habilitado",
		"S" : "Suspendido"
	});
	tableColumnModelPrestacion.setDataCellRenderer(3, cellrendererReplace);
	

	
	var selectionModelPrestacion = tblPrestacion.getSelectionModel();
	selectionModelPrestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelPrestacion.addListener("changeSelection", function(e){
		if (! selectionModelPrestacion.isSelectionEmpty()) {
			rowDataPrestacion = tableModelPrestacion.getRowDataAsMap(tblPrestacion.getFocusedRow());
			
			btnEstadoHabilitado.setValue(rowDataPrestacion.estado == "H");
			btnEstadoSuspendido.setValue(rowDataPrestacion.estado == "S");
			
			btnEstadoPrestacion.setEnabled(true);
			btnEliminarPrestacion.setEnabled(true);
		} else {
			btnEstadoPrestacion.setEnabled(false);
			btnEliminarPrestacion.setEnabled(false);
		}
		
		menuPrestacion.memorizar([btnEstadoPrestacion, btnEliminarPrestacion]);
	});

	this.add(tblPrestacion, {left: "53%", top: 30, right: 0, bottom: 0});
	
	//this.add(new qx.ui.basic.Label("Prestación"), {left: "53%", top: 0});
	
	
	

	
	
	
	functionActualizarPrestador();
	
	
		
	},
	members : 
	{

	}
});