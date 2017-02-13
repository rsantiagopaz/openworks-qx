qx.Class.define("viano.comp.pageEntrega",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel("Entrega");
	this.setLayout(new qx.ui.layout.Canvas());
	this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(e){
		tbl.focus();
	});
	

	
	
	//Tabla
	var tableModel = new qx.ui.table.model.Simple();
	tableModel.setColumns(["Fecha", "Destino", "Detalle"], ["fecha", "lugar", "descrip"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
	tbl.toggleShowCellFocusIndicator();
	tbl.toggleColumnVisibilityButtonVisible();
	tbl.toggleStatusBarVisible();
	
	var tableColumnModel = tbl.getTableColumnModel();
	var resizeBehavior = tableColumnModel.getBehavior();
	resizeBehavior.set(0, {width:"10%", minWidth: 100});
	resizeBehavior.set(1, {width:"20%", minWidth: 100});
	resizeBehavior.set(2, {width:"70%", minWidth: 100});
	
	var selectionModel = tbl.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(){
		if (! selectionModel.isSelectionEmpty()) {
			var rowData = tableModel.getRowDataAsMap(tbl.getFocusedRow());

			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
			rpc.callAsync(function(resultado, error, id) {
				tblItem.setFocusedCell();
				tableModelItem.setDataAsMapArray(resultado, true);
			}, "leer_entrega_item", {id_entrega: rowData.id_entrega});
		}
	});

	this.add(tbl, {left: 0, top: 0, right: 0, bottom: "50.5%"});
	
	
	
	
	
	//Tabla
	var tableModelItem = new qx.ui.table.model.Simple();
	tableModelItem.setColumns(["Producto", "Lote", "F.vencimiento", "Cantidad"], ["descrip", "lote", "f_vencimiento", "cantidad"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblItem = new componente.comp.ui.ramon.table.Table(tableModelItem, custom);
	tblItem.toggleShowCellFocusIndicator();
	tblItem.toggleColumnVisibilityButtonVisible();
	tblItem.toggleStatusBarVisible();
	
	var tableColumnModel = tblItem.getTableColumnModel();
	var resizeBehavior = tableColumnModel.getBehavior();
	resizeBehavior.set(0, {width:"60%", minWidth: 100});
	resizeBehavior.set(1, {width:"20%", minWidth: 100});
	resizeBehavior.set(2, {width:"10%", minWidth: 100});
	resizeBehavior.set(3, {width:"10%", minWidth: 100});
	
	var selectionModelItem = tblItem.getSelectionModel();
	selectionModelItem.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelItem.addListener("changeSelection", function(){
		var bool = ! selectionModelItem.isSelectionEmpty();
	});

	this.add(tblItem, {left: 0, top: "50.5%", right: 0, bottom: 0});
	
	
	

	
	
	var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("leer_entrega");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	tableModel.setDataAsMapArray(resultado, true);
	if (resultado.length > 0) tbl.setFocusedCell(0, 0, true);



		
	},
	members : 
	{

	}
});