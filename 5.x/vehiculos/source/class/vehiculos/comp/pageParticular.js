qx.Class.define("vehiculos.comp.pageParticular",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Particular');
	this.setLayout(new qx.ui.layout.Grow());
	//this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(e){
		//cgb.setValue(false);
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var desktop = new qx.ui.window.Desktop();
	this.add(desktop);
	
	var compositeGral = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	desktop.add(compositeGral, {edge: 0});
	
	var blocker = new qx.ui.core.Blocker(compositeGral);
	blocker.set({color: '#bfbfbf', opacity: 0.4});
	
	var buscar_id_movimiento;
	
	
	var functionActualizarVehiculo = function(id_vehiculo, id_entsal, id_movimiento){
		tableModelEntsal.setDataAsMapArray([], true);
		tableModelMovimiento.setDataAsMapArray([], true);
		tableModelSal.setDataAsMapArray([], true);
		
		lstReparacion1.removeAll();
		controllerFormInfoEntsal.resetModel();
		controllerFormInfoMovimiento.resetModel();
		controllerFormInfoSal.resetModel();
		
		btnEnt.setEnabled(false);
		btnSal.setEnabled(false);
		btnEntTaller.setEnabled(false);
		btnSalTaller.setEnabled(false);
		btnAsunto.setEnabled(false);
		btnEliminarEntTaller.setEnabled(false);
		
		btnInfoVehiculo.setEnabled(false);
		btnHistorial.setEnabled(false);
		
		if (id_vehiculo != null) {
			var p = {};
			p.id_vehiculo = id_vehiculo;
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
			rpc.callAsync(function(resultado, error, id) {
				application.vehiculo = resultado;
				controllerFormInfoVehiculo.setModel(qx.data.marshal.Json.createModel(application.vehiculo));
				
				btnInfoVehiculo.setEnabled(true);
				btnHistorial.setEnabled(true);
				btnEnt.setEnabled(application.vehiculo.estado == "S");
				
				functionActualizarEntSal(id_entsal, id_movimiento);
			
			}, "leer_vehiculo", p);
		}
	};
	
	var functionActualizarEntSal = function(id_entsal, id_movimiento){
		
		application.pageGeneral.functionActualizarGral();
		lstReparacion1.removeAll();
		controllerFormInfoEntsal.resetModel();
				
		buscar_id_movimiento = id_movimiento;
		
		var p = {};
		p.id_vehiculo = application.vehiculo.id_vehiculo;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
		rpc.callAsync(function(resultado, error, id) {
			tblEntsal.setFocusedCell();
			tableModelEntsal.setDataAsMapArray(resultado, true);
			
			if (id_entsal != null) {
				tblEntsal.buscar("id_entsal", id_entsal);
				tblEntsal.focus();
			}
		}, "leer_entsal", p);
	};
	
	
	var functionActualizarMovimiento = function(id_movimiento){
		
		application.pageGeneral.functionActualizarGral();
		controllerFormInfoMovimiento.resetModel();
		controllerFormInfoSal.resetModel();
		
		var p = {};
		p.id_entsal = rowDataEntSal.id_entsal;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
		rpc.callAsync(function(resultado, error, id) {
			tblMovimiento.setFocusedCell();
			tableModelMovimiento.setDataAsMapArray(resultado, true);
				
			if (id_movimiento != null) {
				tblMovimiento.buscar("id_movimiento", id_movimiento);
				tblMovimiento.focus();
			}
		}, "leer_movimiento", p);
	};
	
	
	
	var rowDataEntSal;
	var rowDataMovimiento;
	var popupInfo = new vehiculos.comp.popupInfo();
	

	
	

	var gbxEntsal = new qx.ui.groupbox.GroupBox("");
	gbxEntsal.setLayout(new qx.ui.layout.Canvas());
	compositeGral.add(gbxEntsal, {left: 0, top: 0, right: "16%", bottom: "66.5%"});
	
	var composite = new qx.ui.container.Composite(new qx.ui.layout.HBox(6).set({alignY: "middle"}));
	gbxEntsal.add(composite, {left: 0, top: 0});
	
	var cboVehiculo = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Vehiculo", methodName: "autocompletarVehiculo"});
	cboVehiculo.setWidth(175);
	var lstVehiculo = cboVehiculo.getChildControl("list");
	lstVehiculo.addListener("changeSelection", function(e){
		if (lstVehiculo.isSelectionEmpty()) {
			functionActualizarVehiculo();
		} else {
			functionActualizarVehiculo(lstVehiculo.getModelSelection().getItem(0));
		}
	});
	
	composite.add(new qx.ui.basic.Label(("Vehículo:")));
	composite.add(cboVehiculo);
	
	
	var btnInfoVehiculo = new qx.ui.form.Button("Info...");
	btnInfoVehiculo.setEnabled(false);
	btnInfoVehiculo.addListener("execute", function(e){
		popupInfo.placeToWidget(btnInfoVehiculo);
		popupInfo.mostrar(formViewVehiculo);
	});
	composite.add(btnInfoVehiculo);
	
	
	var btnHistorial = new qx.ui.form.Button("Historial...");
	btnHistorial.setEnabled(false);
	btnHistorial.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=historial&id_vehiculo=" + application.vehiculo.id_vehiculo);
	});
	composite.add(btnHistorial);
	
	
	
	
	var composite = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
	gbxEntsal.add(composite, {top: 0, right: 0});
	
	var btnEnt = new qx.ui.form.Button("Entrada...");
	btnEnt.setEnabled(false);
	btnEnt.addListener("execute", function(e){
		var win = new vehiculos.comp.windowEnt();
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarVehiculo(lstVehiculo.getModelSelection().getItem(0), data);
		});
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	});
	
	composite.add(btnEnt);
	
	var btnSal = new qx.ui.form.Button("Salida...");
	btnSal.setEnabled(false);
	btnSal.addListener("execute", function(e){
		var win = new vehiculos.comp.windowSal(rowDataEntSal.id_entsal);
		win.addListener("aceptado", function(e){
			functionActualizarVehiculo(lstVehiculo.getModelSelection().getItem(0), rowDataEntSal.id_entsal);
		});
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	}, this);
	
	composite.add(btnSal);
	

	
	
	//Tabla

	var tableModelEntsal = new qx.ui.table.model.Simple();
	tableModelEntsal.setColumns(["Entrada", "Salida", "Total"], ["f_ent", "f_sal", "total"]);
	tableModelEntsal.setColumnSortable(0, false);
	tableModelEntsal.setColumnSortable(1, false);
	tableModelEntsal.setColumnSortable(2, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblEntsal = new componente.comp.ui.ramon.table.Table(tableModelEntsal, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblEntsal.setShowCellFocusIndicator(false);
	tblEntsal.toggleColumnVisibilityButtonVisible();
	tblEntsal.toggleStatusBarVisible();
	
	var tableColumnModelEntsal = tblEntsal.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelEntsal.setDataCellRenderer(2, cellrendererNumber);
	
	var selectionModelEntsal = tblEntsal.getSelectionModel();
	selectionModelEntsal.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelEntsal.addListener("changeSelection", function(e){
		if (! selectionModelEntsal.isSelectionEmpty()) {
			rowDataEntSal = tableModelEntsal.getRowData(tblEntsal.getFocusedRow());
			
			btnSal.setEnabled(rowDataEntSal.estado == "E");
			btnEntTaller.setEnabled(rowDataEntSal.estado != "S");
			
			lstReparacion1.removeAll();
			var tipo_reparacion = rowDataEntSal.tipo_reparacion
			for (var x in tipo_reparacion) {
				lstReparacion1.add(new qx.ui.form.ListItem(tipo_reparacion[x].descrip, null, tipo_reparacion[x].id_tipo_reparacion));
			}
			
			controllerFormInfoEntsal.setModel(qx.data.marshal.Json.createModel(rowDataEntSal));

			tblMovimiento.setFocusedCell();
			tableModelSal.setDataAsMapArray([], true);
			functionActualizarMovimiento(buscar_id_movimiento);
			
			buscar_id_movimiento = null;
		}
	});
	
	gbxEntsal.add(tblEntsal, {left: 0, top: 30, right: 0, bottom: 0});
	
	

	
	

	
	var aux;
	
	var formInfoVehiculo = new qx.ui.form.Form();
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Nro.patente", null, "nro_patente");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Marca", null, "marca");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Tipo", null, "tipo");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Modelo", null, "modelo");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Nro.motor", null, "nro_motor");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Nro.chasis", null, "nro_chasis");
	
	aux = new qx.ui.form.TextArea();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Observaciones", null, "observa");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Dependencia", null, "dependencia");
	
	aux = new qx.ui.form.Spinner(0, 0, 1000000);
	aux.setEditable(false);
	aux.setFocusable(false);
	aux.setNumberFormat(application.numberformatMontoEs);
	aux.getChildControl("upbutton").setVisibility("excluded");
	aux.getChildControl("downbutton").setVisibility("excluded");
	aux.setSingleStep(0);
	aux.setPageStep(0);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoVehiculo.add(aux, "Total", null, "total");
	
	var controllerFormInfoVehiculo = new qx.data.controller.Form(null, formInfoVehiculo);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewVehiculo = new qx.ui.form.renderer.Single(formInfoVehiculo);
	
	
	
	
	//var p = new qx.ui.form.VirtualComboBox();

	
	
	var formInfoEntsal = new qx.ui.form.Form();
	
	var lstReparacion1 = new qx.ui.form.List();
	lstReparacion1.setMaxHeight(75);
	lstReparacion1.setDecorator("main");
	lstReparacion1.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(lstReparacion1, "Reparac.", null, "reparaciones");
	
	aux = new qx.ui.form.TextArea();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Obs.", null, "observa");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Us. ent.", null, "id_usuario_ent");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Resp. ent.", null, "resp_ent");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Us. sal.", null, "id_usuario_sal");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoEntsal.add(aux, "Resp. sal.", null, "resp_sal");
	
	var controllerFormInfoEntsal = new qx.data.controller.Form(null, formInfoEntsal);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewEntsal = new qx.ui.form.renderer.Single(formInfoEntsal);
	
	
	var gbxInfoEntsal = new qx.ui.groupbox.GroupBox("");
	gbxInfoEntsal.setLayout(new qx.ui.layout.Grow());
	aux = new qx.ui.container.Scroll(formViewEntsal);
	gbxInfoEntsal.add(aux);
	compositeGral.add(gbxInfoEntsal, {left: "84.5%", top: 0, right: 0, bottom: "66.5%"});
	
	
	
	
	
	var formInfoMovimiento = new qx.ui.form.Form();
	
	aux = new qx.ui.form.TextArea();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoMovimiento.add(aux, "Observaciones", null, "observa");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoMovimiento.add(aux, "Usuario ent.", null, "id_usuario_ent");
	
	aux = new qx.ui.form.TextField();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoMovimiento.add(aux, "Usuario sal.", null, "id_usuario_sal");
	
	var controllerFormInfoMovimiento = new qx.data.controller.Form(null, formInfoMovimiento);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewMovimiento = new qx.ui.form.renderer.Single(formInfoMovimiento);
	
	
	var gbxInfoMovimiento = new qx.ui.groupbox.GroupBox("");
	gbxInfoMovimiento.setLayout(new qx.ui.layout.Basic());
	gbxInfoMovimiento.add(formViewMovimiento);
	//compositeGral.add(gbxMovimiento, {left: 0, top: "33.5%", right: "16%", bottom: "33.5%"});
	compositeGral.add(gbxInfoMovimiento, {left: "84.5%", top: "33.5%", right: 0, bottom: "33.5%"});
	
	
	
	
	
	var formInfoSal = new qx.ui.form.Form();
	
	aux = new qx.ui.form.TextArea();
	aux.setReadOnly(true);
	aux.setDecorator("main");
	aux.setBackgroundColor("#ffffc0");
	formInfoSal.add(aux, "Observaciones", null, "observa");
	
	var controllerFormInfoSal = new qx.data.controller.Form(null, formInfoSal);
	//modelForm = controllerFormInfoVehiculo.createModel(true);
	
	var formViewSal = new qx.ui.form.renderer.Single(formInfoSal);
	
	
	var gbxInfoSal = new qx.ui.groupbox.GroupBox("");
	gbxInfoSal.setLayout(new qx.ui.layout.Basic());
	gbxInfoSal.add(formViewSal);
	//compositeGral.add(gbxMovimiento, {left: 0, top: "33.5%", right: "16%", bottom: "33.5%"});
	compositeGral.add(gbxInfoSal, {left: "84.5%", top: "66.5%", right: 0, bottom: 0});
	
	
	
	
	
	
	
	
	var gbxMovimiento = new qx.ui.groupbox.GroupBox("Movimientos");
	gbxMovimiento.setLayout(new qx.ui.layout.Canvas());
	compositeGral.add(gbxMovimiento, {left: 0, top: "33.5%", right: "16%", bottom: "33.5%"});
	
	
	//Tabla

	var tableModelMovimiento = new qx.ui.table.model.Simple();
	tableModelMovimiento.setColumns(["Taller", "Entrada", "Salida", "Asunto", "Total"], ["taller", "f_ent", "f_sal", "documentacion_id", "total"]);
	tableModelMovimiento.setColumnSortable(0, false);
	tableModelMovimiento.setColumnSortable(1, false);
	tableModelMovimiento.setColumnSortable(2, false);
	tableModelMovimiento.setColumnSortable(3, false);
	tableModelMovimiento.setColumnSortable(4, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblMovimiento = new componente.comp.ui.ramon.table.Table(tableModelMovimiento, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblMovimiento.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblMovimiento.setShowCellFocusIndicator(false);
	tblMovimiento.toggleColumnVisibilityButtonVisible();
	tblMovimiento.toggleStatusBarVisible();
	
	var tableColumnModelMovimiento = tblMovimiento.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelMovimiento.setDataCellRenderer(4, cellrendererNumber);
	
	var resizeBehavior = tableColumnModelMovimiento.getBehavior();
	resizeBehavior.set(0, {width:"38%", minWidth:100});
	resizeBehavior.set(1, {width:"20%", minWidth:100});
	resizeBehavior.set(2, {width:"20%", minWidth:100});
	resizeBehavior.set(3, {width:"10%", minWidth:100});
	resizeBehavior.set(4, {width:"12%", minWidth:100});
	
	var selectionModelMovimiento = tblMovimiento.getSelectionModel();
	selectionModelMovimiento.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelMovimiento.addListener("changeSelection", function(e){
		if (! selectionModelMovimiento.isSelectionEmpty()) {
			rowDataMovimiento = tableModelMovimiento.getRowData(tblMovimiento.getFocusedRow());
			
			btnAsunto.setEnabled(rowDataMovimiento.estado == "S" && rowDataMovimiento.documentacion_id == null);
			btnEliminarEntTaller.setEnabled(rowDataMovimiento.documentacion_id == null);
			btnSalTaller.setEnabled(rowDataMovimiento.estado == "E");
			
			controllerFormInfoMovimiento.setModel(qx.data.marshal.Json.createModel(rowDataMovimiento));
			
			controllerFormInfoSal.resetModel();
			
			var p = {};
			p.id_movimiento = rowDataMovimiento.id_movimiento;
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
			rpc.callAsync(function(resultado, error, id) {
				tblSal.setFocusedCell();
				tableModelSal.setDataAsMapArray(resultado, true);
			}, "leer_reparacion", p);
		}
	});
	
	gbxMovimiento.add(tblMovimiento, {left: 0, top: 30, right: 0, bottom: 0});
	
	
	
	var composite = new qx.ui.container.Composite(new qx.ui.layout.HBox(6));
	gbxMovimiento.add(composite, {top: 0, right: 0});
	
	var btnAsunto = new qx.ui.form.Button("Asunto...");
	btnAsunto.setEnabled(false);
	btnAsunto.addListener("execute", function(e){
		var win = new vehiculos.comp.windowAsunto(rowDataMovimiento.id_movimiento);
		win.addListener("aceptado", function(e){
			functionActualizarMovimiento(rowDataMovimiento.id_movimiento);
		});
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	});
	gbxMovimiento.add(btnAsunto, {left: 0, top: 0});
	
	var btnEliminarEntTaller = new qx.ui.form.Button("Eliminar...");
	btnEliminarEntTaller.setEnabled(false);
	btnEliminarEntTaller.addListener("execute", function(e){
		/*
		dialog.Dialog.confirm("¿Desea eliminar el movimiento seleccionado?", qx.lang.Function.bind(function(e){
			if (e) {

			}
		}, this));
		*/
		
		(new dialog.Confirm({
		        "message"   : "Desea eliminar el movimiento seleccionado?",
		        "callback"  : function(e){
		        
		        				},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	}, this);
	gbxMovimiento.add(btnEliminarEntTaller, {left: "15%", top: 0});
	
	var btnEntTaller = new qx.ui.form.Button("Entrada a taller...");
	btnEntTaller.setEnabled(false);
	btnEntTaller.addListener("execute", function(e){
		var win = new vehiculos.comp.windowEntTaller(rowDataEntSal.id_entsal);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarEntSal(rowDataEntSal.id_entsal, data);
			
			window.setTimeout(function(){
				window.open("services/class/comp/Impresion.php?rutina=entrada_taller&id_entsal=" + rowDataEntSal.id_entsal + "&id_movimiento=" + data);
			}, 200)
		})
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	});
	
	composite.add(btnEntTaller);

	var btnSalTaller = new qx.ui.form.Button("Salida de taller...");
	btnSalTaller.setEnabled(false);
	btnSalTaller.addListener("execute", function(e){
		var win = new vehiculos.comp.windowSalTaller(rowDataMovimiento.id_movimiento);
		win.addListener("aceptado", function(e){
			functionActualizarVehiculo(lstVehiculo.getModelSelection().getItem(0), rowDataEntSal.id_entsal, rowDataMovimiento.id_movimiento);
		});
		win.addListener("close", function(e){
			blocker.unblock();
		});
		desktop.add(win);
		blocker.block();
		win.center();
		win.open();
	});
	
	composite.add(btnSalTaller);
	
	
	
	var gbxSal = new qx.ui.groupbox.GroupBox(" Reparaciones ");
	gbxSal.setLayout(new qx.ui.layout.Canvas());
	compositeGral.add(gbxSal, {left: 0, top: "66.5%", right: "16%", bottom: 0});
	
	
	
	//Tabla

	var tableModelSal = new qx.ui.table.model.Simple();
	tableModelSal.setColumns(["Reparación", "Costo", "Cantidad", "Total"], ["reparacion", "costo", "cantidad", "total"]);
	tableModelSal.setColumnSortable(0, false);
	tableModelSal.setColumnSortable(1, false);
	tableModelSal.setColumnSortable(2, false);
	tableModelSal.setColumnSortable(3, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblSal = new componente.comp.ui.ramon.table.Table(tableModelSal, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblSal.setShowCellFocusIndicator(false);
	tblSal.toggleColumnVisibilityButtonVisible();
	tblSal.toggleStatusBarVisible();
	
	var tableColumnModelSal = tblSal.getTableColumnModel();
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(application.numberformatMontoEs);
	tableColumnModelSal.setDataCellRenderer(1, cellrendererNumber);
	tableColumnModelSal.setDataCellRenderer(3, cellrendererNumber);
	
	var resizeBehavior = tableColumnModelSal.getBehavior();
	resizeBehavior.set(0, {width:"55%", minWidth:100});
	resizeBehavior.set(1, {width:"15%", minWidth:100});
	resizeBehavior.set(2, {width:"15%", minWidth:100});
	resizeBehavior.set(3, {width:"15%", minWidth:100});
	
	var selectionModelSal = tblSal.getSelectionModel();
	selectionModelSal.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelSal.addListener("changeSelection", function(e){
		if (! selectionModelSal.isSelectionEmpty()) {
			rowDataSal = tableModelSal.getRowData(tblSal.getFocusedRow());
			
			controllerFormInfoSal.setModel(qx.data.marshal.Json.createModel(rowDataSal));
		}
	});
	
	gbxSal.add(tblSal, {left: 0, top: 0, right: 0, bottom: 0});
	
		
	},
	members : 
	{

	}
});