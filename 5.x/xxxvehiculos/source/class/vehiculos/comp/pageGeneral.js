qx.Class.define("vehiculos.comp.pageGeneral",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('General');
	this.setLayout(new qx.ui.layout.Canvas());
	//this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(e){
		//cgb.setValue(false);
	});
	
	
	var application = qx.core.Init.getApplication();
	
	
	var functionActualizarGral = this.functionActualizarGral = function(){
		var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
		rpc.callAsync(function(resultado, error, id) {
			//alert(qx.lang.Json.stringify(resultado, null, 2));
			//alert(qx.lang.Json.stringify(error, null, 2));
			
			tableModelGral.setDataAsMapArray(resultado.gral, true);
			tblGral.setAdditionalStatusBarText(resultado.statusBarText);
		}, "leer_gral");
	};
	
	

	var txtBuscar = new qx.ui.form.TextField("");
	txtBuscar.setWidth(250);
	txtBuscar.setLiveUpdate(true);
	txtBuscar.addListener("changeValue", function(e){
		var value = this.getValue().trim().toUpperCase();
		
		tblGral.setFocusedCell();
		
		if (value.length >=3) {
			var rowData;
			var rowCount = tableModelGral.getRowCount();
			
			for (var x=0; x < rowCount; x++) {
				rowData = tableModelGral.getRowData(x);
				if (rowData["vehiculo"].startsWith(value)) {
					tblGral.setFocusedCell(0, x, true);
					
					break;
				}
			}
		}
	})
	this.add(txtBuscar, {left: 40, top: 0});
	this.add(new qx.ui.basic.Label("Buscar:"), {left: 0, top: 3});
	
	
	var btnImprimir = new qx.ui.form.Button("Imprimir general...");
	btnImprimir.addListener("execute", function(e){
		window.open("services/class/comp/Impresion.php?rutina=general");
	});
	this.add(btnImprimir, {left: 500, top: 0});
	

	
	
	
	// Menu
	
	var commandVer = new qx.ui.command.Command("Enter");
	commandVer.setEnabled(false);
	commandVer.addListener("execute", function(e){
		alert(commandVer.getEnabled());
	});
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	
	var btnVer = new qx.ui.menu.Button("Ver", null, commandVer);
	menu.add(btnVer);
	menu.memorizar();
	
	

	
	//Tabla

	var tableModelGral = new qx.ui.table.model.Simple();
	tableModelGral.setColumns(["Vehículo", "Dependencia", "Entrada", "Salida", "Estado", "Asunto", "Diferido"], ["vehiculo", "dependencia", "f_ent", "f_sal", "estado", "asunto", "diferido"]);
	tableModelGral.setColumnSortable(0, false);
	tableModelGral.setColumnSortable(1, false);
	tableModelGral.setColumnSortable(2, false);
	tableModelGral.setColumnSortable(3, false);
	tableModelGral.setColumnSortable(4, false);
	tableModelGral.setColumnSortable(5, false);
	tableModelGral.setColumnSortable(6, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblGral = new componente.comp.ui.ramon.table.Table(tableModelGral, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblGral.setShowCellFocusIndicator(false);
	tblGral.toggleColumnVisibilityButtonVisible();
	//tblGral.toggleStatusBarVisible();
	tblGral.setContextMenu(menu);
	tblGral.addListener("cellDbltap", function(e){
		commandVer.execute();
	})
	
	var tableColumnModelGral = tblGral.getTableColumnModel();
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"E": "Entrada",
		"S": "Salida",
		"T": "Taller"
	});
	tableColumnModelGral.setDataCellRenderer(4, cellrendererReplace);
	
	var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
	cellrendererReplace.setReplaceMap({
		"1": "En trámite",
		"0": ""
	});
	tableColumnModelGral.setDataCellRenderer(5, cellrendererReplace);
	tableColumnModelGral.setDataCellRenderer(6, cellrendererReplace);
	
	
	var resizeBehavior = tableColumnModelGral.getBehavior();
	resizeBehavior.set(0, {width:"19%", minWidth:100});
	resizeBehavior.set(1, {width:"30%", minWidth:100});
	resizeBehavior.set(2, {width:"15%", minWidth:100});
	resizeBehavior.set(3, {width:"15%", minWidth:100});
	resizeBehavior.set(4, {width:"7%", minWidth:100});
	resizeBehavior.set(5, {width:"7%", minWidth:100});
	resizeBehavior.set(6, {width:"7%", minWidth:100});
	
	
	var selectionModelGral = tblGral.getSelectionModel();
	selectionModelGral.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelGral.addListener("changeSelection", function(e){
		var selectionEmpty = selectionModelGral.isSelectionEmpty();
		commandVer.setEnabled(! selectionEmpty);
		menu.memorizar([commandVer]);
		this.debug(commandVer.getEnabled());
	});
	
	this.add(tblGral, {left: 0, top: 30, right: 0, bottom: 0});
	
	
	
	
	
	functionActualizarGral();

		
	},
	members : 
	{

	}
});