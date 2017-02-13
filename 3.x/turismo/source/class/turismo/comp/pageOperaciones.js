qx.Class.define("turismo.comp.pageOperaciones",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);
	
	this.setLabel("Operaciones");
	this.setLayout(new qx.ui.layout.Canvas());
	this.toggleShowCloseButton();

	this.addListener("close", function(e){
		qx.core.Init.getApplication().pageOperaciones = null;
	});
	
	
	var application = qx.core.Init.getApplication();
	
	
	//Menu contexto
	
	var menuProforma = new componente.comp.ui.ramon.menu.Menu();
	
	var btnModificarProforma = new qx.ui.menu.Button("Pagos...");
	btnModificarProforma.setEnabled(false);
	btnModificarProforma.addListener("execute", function(e) {
		var rowData = tableModelProforma.getRowDataAsMap(tblProforma.getFocusedRow());
		var win = new turismo.comp.windowPagos(rowData);
		win.addListener("aceptado", function(e){

		}, this);
		application.getRoot().add(win);
		win.center();
		win.open();
	}, this);
	
	var btnAsignarPresupuesto = this.btnAsignarPresupuesto = new qx.ui.menu.Button("Datos básicos...");
	btnAsignarPresupuesto.setEnabled(false);
	btnAsignarPresupuesto.addListener("execute", function(e) {
		var rowData = tableModelProforma.getRowDataAsMap(tblProforma.getFocusedRow());
		var win = new turismo.comp.windowPasajeros(rowData);
		win.addListener("aceptado", function(e){

		}, this);
		application.getRoot().add(win);
		win.center();
		win.open();
	}, this);
	
	menuProforma.add(btnModificarProforma);
	menuProforma.add(btnAsignarPresupuesto);
	menuProforma.memorizar();
	
	
	
	
	//Tabla

	var tableModelProforma = this.tableModelProforma = new qx.ui.table.model.Simple();
	tableModelProforma.setColumns(["Fecha", "Apellido", "Nombre"], ["fecha", "apellido", "nombre"]);

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
	
	

	var selectionModelProforma = this.selectionModelProforma = tblProforma.getSelectionModel();
	selectionModelProforma.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelProforma.addListener("changeSelection", function(){
		var bool = ! selectionModelProforma.isSelectionEmpty();
		var rowData = tableModelProforma.getRowData(tblProforma.getFocusedRow());
		
		btnModificarProforma.setEnabled(bool);
		btnAsignarPresupuesto.setEnabled(bool);
		menuProforma.memorizar([btnModificarProforma, btnAsignarPresupuesto]);
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
	
	
			var rpc = new qx.io.remote.Rpc("services/", "comp.Proforma");
			try {
				var resultado = rpc.callSync("leer_operaciones");
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			this.tableModelProforma.setDataAsMapArray(resultado, true);
			this.htmlContactar.setHtml("");
			this.htmlDatos.setHtml("");
	
	},
	members : 
	{

	}
});