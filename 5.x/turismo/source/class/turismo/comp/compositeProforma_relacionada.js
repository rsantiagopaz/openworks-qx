qx.Class.define("turismo.comp.compositeProforma_relacionada",
{
	extend : qx.ui.container.Composite,
	construct : function (pageParent)
	{
	this.base(arguments);

	this.setLayout(new qx.ui.layout.Canvas());
	
	var application = qx.core.Init.getApplication();
	

	//Menu contexto
	
	var menuProforma = new componente.comp.ui.ramon.menu.Menu();
	
	var btnModificarProforma = new qx.ui.menu.Button("Modificar...");
	btnModificarProforma.setEnabled(false);
	btnModificarProforma.addListener("execute", function(e) {
		var rowData = tableModelProforma.getRowDataAsMap(tblProforma.getFocusedRow());
		
		var page = application.functionAbrirProforma(rowData.id_proforma);
		page.addListener("aceptado", function(e){
			var data = e.getData();
			
			application.tabviewMain.setSelection([pageParent]);
			tblProforma.focus();
			this.buscar(this.ultima_busqueda);
			tblProforma.buscar("id_proforma", data);
		}, this);
	}, this);
	
	var menuPresupuesto = new componente.comp.ui.ramon.menu.Menu();
	var btnPresupuesto = new qx.ui.menu.Button("Presupuesto", null, null, menuPresupuesto);
	
	var btnGenerarPresupuesto = this.btnGenerarPresupuesto = new qx.ui.menu.Button("Generar...");
	btnGenerarPresupuesto.setEnabled(false);
	btnGenerarPresupuesto.addListener("execute", function(e) {
		if (application.windowGenerarPresupuesto == null) {
			var rowData = tableModelProforma.getRowDataAsMap(tblProforma.getFocusedRow());
			application.windowGenerarPresupuesto = new turismo.comp.windowGenerarPresupuesto(rowData.id_proforma, rowData.json);
			application.windowGenerarPresupuesto.addListener("aceptado", function(e){
				var data = e.getData();
	
				this.buscar(this.ultima_busqueda);
				tblProforma.buscar("id_proforma", data);
			}, this);

			application.getRoot().add(application.windowGenerarPresupuesto);
			application.windowGenerarPresupuesto.center();
			application.windowGenerarPresupuesto.open();
		} else {
			application.windowGenerarPresupuesto.center();
			application.windowGenerarPresupuesto.open();
			
			dialog.Dialog.alert("La ventana de generación de presupuesto ya se está usando.", function(e){application.windowGenerarPresupuesto.focus();});
		}

	}, this);
	
	//var btnCargar = this.btnCargar = new qx.ui.menu.Button("Cargar archivo...");
	var btnCargar = new com.zenesis.qx.upload.UploadMenuButton("Cargar archivo...");
	btnCargar.setEnabled(false);
	/*
	btnCargar.addListener("execute", function(e) {
		var btnSeleccionarPresupuesto = new com.zenesis.qx.upload.UploadButton("Seleccionar...");
		//this.add(btnSeleccionarPresupuesto, {left: 370, top: 54});
		
		var uploader = new com.zenesis.qx.upload.UploadMgr(btnSeleccionarPresupuesto, "UploadMgr/server/php.php");
		//uploader.setAutoUpload(false);
		uploader.addListener("addFile", function(e) {
			var data = e.getData();
			
			//if (filePresupuesto != null) uploader.cancel(filePresupuesto);
	        //filePresupuesto = data;
	        //txtPresupuesto.setValue(filePresupuesto.getFilename());
		}, this);
		btnSeleccionarPresupuesto.execute();
	}, this);
	*/
	
	var uploader = new com.zenesis.qx.upload.UploadMgr(btnCargar, "services/UploadMgr/server/php.php");
	uploader.addListener("addFile", function(e) {
		var file = e.getData();
		
		var stateListenerId = file.addListener("changeState", function(e) {
			var state = e.getData();
	
			if (state == "uploaded") {
				var response = qx.lang.Json.parse(file.getResponse());
				if (response.success) {
					var focusedRow = tblProforma.getFocusedRow();
					var rowData = tableModelProforma.getRowData(focusedRow);
					
					var p = {};
					p.id_proforma = rowData.id_proforma;
					p.archivo = file.getFilename();
					
					var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
					try {
						var resultado = rpc.callSync("cargar_presupuesto", p);
					} catch (ex) {
						alert("Sync exception: " + ex);
					}
					
					menuProforma.hide();
					
					rowData.archivo = p.archivo;
					tableModelProforma.setRowsAsMapArray([rowData], focusedRow, true);
					//btnDescargar.setUserData("archivo", p.archivo);
					tblProforma.blur();
					tblProforma.focus();
					
				} else {
					alert(file.getResponse());
				}
			} else {
				//alert(state);
			}
	
			if (state == "uploaded" || state == "cancelled") file.removeListenerById(stateListenerId);
		}, this);
	}, this);
	
	
	var btnDescargar = this.btnDescargar = new qx.ui.menu.Button("Descargar archivo...");
	btnDescargar.setEnabled(false);
	btnDescargar.addListener("execute", function(e) {
		window.open("services/UploadMgr/uploads/" + btnDescargar.getUserData("archivo"));
	}, this);
	
	menuPresupuesto.add(btnGenerarPresupuesto);
	menuPresupuesto.addSeparator();
	menuPresupuesto.add(btnCargar);
	menuPresupuesto.add(btnDescargar);
	
	
	var btnAsignarPago = new qx.ui.menu.Button("Iniciar operación...");
	btnAsignarPago.addListener("execute", function(e) {
		var rowData = tableModelProforma.getRowDataAsMap(tblProforma.getFocusedRow());
		var win = new turismo.comp.windowPasajeros(rowData);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			if (rowData.id_operacion == null) {
				rowData.id_operacion = data;
				var win = new turismo.comp.windowPagos(rowData);
				application.getRoot().add(win);
				win.center();
				win.open();
			}
			
			this.buscar(this.ultima_busqueda);
			tblProforma.buscar("id_proforma", rowData.id_proforma);
		}, this);
		application.getRoot().add(win);
		win.center();
		win.open();
	}, this);
	
	menuProforma.add(btnModificarProforma);
	menuProforma.add(btnPresupuesto);
	menuProforma.addSeparator();
	menuProforma.add(btnAsignarPago);
	menuProforma.memorizar();
	
	
	
	
	//Tabla

	var tableModelProforma = this.tableModelProforma = new qx.ui.table.model.Simple();
	tableModelProforma.setColumns(["Fecha", "Apellido", "Nombre", "Tipo entrevista", "Usuario", "Presupuesto", "Archivo", "Operación"], ["fecha", "apellido", "nombre", "tipo_entrevista", "usuario", "presupuesto", "archivo", "operacion"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	var tblProforma = this.tblProforma = new componente.comp.ui.ramon.table.Table(tableModelProforma, custom);
	tblProforma.setShowCellFocusIndicator(false);
	tblProforma.toggleColumnVisibilityButtonVisible();
	tblProforma.toggleStatusBarVisible();
	tblProforma.setWidth(400);
	tblProforma.setHeight(200);
	tblProforma.setContextMenu(menuProforma);
	//tblProforma.edicion="";
	//tblProforma.edicion = "desplazamiento_vertical";

	
	var tableColumnModelProforma = tblProforma.getTableColumnModel();
	var resizeBehavior = tableColumnModelProforma.getBehavior();
	//resizeBehavior.set(0, {width:"20%", minWidth:100});
	//resizeBehavior.set(1, {width:"80%", minWidth:100});
	
	
	var cellrenderReplace = new qx.ui.table.cellrenderer.Replace();
	cellrenderReplace.setReplaceMap({
		"P" : "Personal",
		"T" : "Teléfono",
		"E" : "Email",
		"F" : "Facebook"
	});
	cellrenderReplace.addReversedReplaceMap();
	tableColumnModelProforma.setDataCellRenderer(3, cellrenderReplace);
	
	var cellrenderBoolean = new qx.ui.table.cellrenderer.Boolean();
	tableColumnModelProforma.setDataCellRenderer(5, cellrenderBoolean);
	tableColumnModelProforma.setDataCellRenderer(7, cellrenderBoolean);
	

	var selectionModelProforma = this.selectionModelProforma = tblProforma.getSelectionModel();
	selectionModelProforma.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelProforma.addListener("changeSelection", function(){
		var bool = ! selectionModelProforma.isSelectionEmpty();
		var rowData = tableModelProforma.getRowData(tblProforma.getFocusedRow());
		
		//alert(qx.lang.Json.stringify(rowData, null, 2));
		
		btnModificarProforma.setEnabled(bool && ! rowData.presupuesto);
		btnGenerarPresupuesto.setEnabled(! rowData.presupuesto);
		btnCargar.setEnabled(rowData.presupuesto && ! rowData.operacion);
		btnDescargar.setEnabled(rowData.archivo != "");
		btnDescargar.setUserData("archivo", rowData.archivo);
		btnAsignarPago.setEnabled(! rowData.operacion && rowData.presupuesto);
		menuProforma.memorizar([btnModificarProforma, btnGenerarPresupuesto, btnAsignarPago, btnCargar, btnDescargar]);
		
		if (bool) {
			
			htmlContactar.setHtml(rowData.contacto_html);
			htmlDatos.setHtml(rowData.datos);
		}
	});

	this.add(tblProforma, {left: 0, top: 0, right: 0, bottom: "70.3%"});
	
	
	
	var htmlContactar = this.htmlContactar = new qx.ui.embed.Html();
	htmlContactar.setOverflow("auto", "auto");
	htmlContactar.setDecorator("main");
	htmlContactar.setBackgroundColor("white");
	this.add(htmlContactar, {left: 0, top: "30.3%", right: "70.3%", bottom: 0});
	
	
	
	var htmlDatos = this.htmlDatos = new qx.ui.embed.Html();
	htmlDatos.setOverflow("auto", "auto");
	htmlDatos.setDecorator("main");
	htmlDatos.setBackgroundColor("white");
	this.add(htmlDatos, {left: "30.3%", top: "30.3%", right: 0, bottom: 0});
		
		
		
	
	
	},
	members : 
	{
		ultima_busqueda: null,
		
		buscar: function(p) {
			this.ultima_busqueda = p;
			this.tblProforma.resetSelection();
			this.tblProforma.setFocusedCell();
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Proforma");
			rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id){
				this.tableModelProforma.setDataAsMapArray(resultado, true);
				this.htmlContactar.setHtml("");
				this.htmlDatos.setHtml("");
			}, this), "buscar_proforma_relacionada", p);
		}
	}
});