qx.Class.define("pediatra.comp.varios.tableParamed",
{
  extend : componente.comp.ui.ramon.table.Table,
  construct : function ()
  {
	this.base(arguments);
	
	var application = qx.core.Init.getApplication();
	
	
	
		
	//Menu de contexto
	
	var commandAgregar = new qx.ui.core.Command("Insert");
	commandAgregar.addListener("execute", function(e){

	}, this);
		
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar parámetro...", null, commandAgregar);

	var commandEliminar = new qx.ui.core.Command("Del");
	commandEliminar.setEnabled(false);
	commandEliminar.addListener("execute", function(e){

	}, this);
		
	var btnEliminar = new qx.ui.menu.Button("Eliminar parámetro...", null, commandEliminar);
	
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnEliminar);
	menu.memorizar();
	
	
	
	//Tabla
	var tableModel = new qx.ui.table.model.Simple();
	tableModel.setColumns(["Descripción", "Tipo", "Código"], ["descrip", "tipo", "codigo"]);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
	//tbl.setShowCellFocusIndicator(true);
	tbl.toggleColumnVisibilityButtonVisible();
	alert("dfd");
	tbl.toggleStatusBarVisible();
	tbl.setContextMenu(menu);
	
	var tableColumnModel = tbl.getTableColumnModel();
	var resizeBehavior = tableColumnModel.getBehavior();
	resizeBehavior.set(0, {width:"60%", minWidth: 100});
	resizeBehavior.set(1, {width:"20%", minWidth: 100});
	resizeBehavior.set(2, {width:"20%", minWidth: 100});
	
	var selectionModel = tbl.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(){
		var bool = (! selectionModel.isSelectionEmpty());
		commandEliminar.setEnabled(bool);
		menu.memorizar([commandEliminar]);
	});

	tbl.setContextMenu(menu);
	
		
		
	},
	members : 
	{

	}
});