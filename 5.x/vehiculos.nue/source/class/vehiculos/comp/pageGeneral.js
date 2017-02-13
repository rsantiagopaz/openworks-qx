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
	
	


	
	//Tabla

	var tableModelGral = new qx.ui.table.model.Simple();
	tableModelGral.setColumns(["Vehículo", "Dependencia", "Entrada", "Salida", "Estado", "Asunto"], ["vehiculo", "dependencia", "f_ent", "f_sal", "estado", "asunto"]);
	tableModelGral.setColumnSortable(0, false);
	tableModelGral.setColumnSortable(1, false);
	tableModelGral.setColumnSortable(2, false);
	tableModelGral.setColumnSortable(3, false);
	tableModelGral.setColumnSortable(4, false);
	tableModelGral.setColumnSortable(5, false);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblGral = new componente.comp.ui.ramon.table.Table(tableModelGral, custom);
	//tblTotales.toggleShowCellFocusIndicator();
	tblGral.setShowCellFocusIndicator(false);
	tblGral.toggleColumnVisibilityButtonVisible();
	//tblGral.toggleStatusBarVisible();
	
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
	
	
	var resizeBehavior = tableColumnModelGral.getBehavior();
	resizeBehavior.set(0, {width:"20%", minWidth:100});
	resizeBehavior.set(1, {width:"30%", minWidth:100});
	resizeBehavior.set(2, {width:"15%", minWidth:100});
	resizeBehavior.set(3, {width:"15%", minWidth:100});
	resizeBehavior.set(4, {width:"10%", minWidth:100});
	resizeBehavior.set(5, {width:"10%", minWidth:100});
	
	
	var selectionModelEntsal = tblGral.getSelectionModel();
	selectionModelEntsal.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelEntsal.addListener("changeSelection", function(e){
		if (! selectionModelEntsal.isSelectionEmpty()) {

		}
	});
	
	this.add(tblGral, {left: 0, top: 0, right: 0, bottom: 0});
	
	
	
	
	
	functionActualizarGral();

		
	},
	members : 
	{

	}
});