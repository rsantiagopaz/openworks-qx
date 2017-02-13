qx.Class.define("turismo.comp.windowParametros",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
		this.set({
			caption: "Parámetros",
			width: 400,
			height: 300,
			showMinimize: false,
			showMaximize: false
		});
		
		this.setLayout(new qx.ui.layout.Canvas());
		this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){

	});
	
	var application = qx.core.Init.getApplication();
	
	var numberformatMonto = new qx.util.format.NumberFormat("es");
	numberformatMonto.setMaximumFractionDigits(2);
	numberformatMonto.setMinimumFractionDigits(2);
	
	var producto = {
		"0" : {label: "Aéreo"},
		"1" : {label: "Hoteles"},
		"2" : {label: "Autos"},
		"3" : {label: "Seguros"},
		"4" : {label: "Cruceros"},
		"5" : {label: "Paquetes"},
		"6" : {label: "Trenes"},
		"7" : {label: "Traslado"},
		"8" : {label: "Excursiones"},
		"9" : {label: "Servicios"}
	};
	
	
	var functionGrabar = function() {
		var p = {comision: {}};
		
		var data = tableModelComision.getDataAsMapArray();
		for (var x in data) {
			p.comision[data[x].id] = data[x].comision;
		}

		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
		rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id){
			
		}, this), "grabar_paramet", p);
	}

	
		// Menu de contexto
	
	var menuComision = new componente.comp.ui.ramon.menu.Menu();
	
	var commandComisionEditar = new qx.ui.command.Command("Enter");
	commandComisionEditar.setEnabled(false);
	commandComisionEditar.addListener("execute", function(e) {
		tblComision.setFocusedCell(1, tblComision.getFocusedRow(), true);
		tblComision.startEditing();
	});

	var btnComisionEditar = new qx.ui.menu.Button("Editar", null, commandComisionEditar);
	
	menuComision.add(btnComisionEditar);
	menuComision.memorizar();
	
	
	//Tabla

	var tableModelComision = new qx.ui.table.model.Simple();
	tableModelComision.setColumns(["Producto", "Comisión"], ["producto", "comision"]);
	tableModelComision.setColumnEditable(1, true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	var tblComision = new componente.comp.ui.ramon.table.Table(tableModelComision, custom);
	tblComision.setShowCellFocusIndicator(true);
	tblComision.toggleColumnVisibilityButtonVisible();
	tblComision.toggleStatusBarVisible();
	tblComision.setContextMenu(menuComision);
	tblComision.setHeight(224);
	
	tblComision.addListener("dataEdited", function(e){
		functionGrabar();
	});

	
	var tableColumnModelComision = tblComision.getTableColumnModel();
	var resizeBehaviorComision = tableColumnModelComision.getBehavior();
	//resizeBehaviorComision.set(0, {width:"30%", minWidth:100});
	//resizeBehaviorComision.set(1, {width:"70%", minWidth:100});
	
	var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
	cellrendererNumber.setNumberFormat(numberformatMonto);
	tableColumnModelComision.setDataCellRenderer(1, cellrendererNumber);
	
	var celleditorNumber = new qx.ui.table.celleditor.TextField();
	celleditorNumber.setValidationFunction(function(newValue, oldValue){
		newValue = newValue.trim();
		if (newValue == "") return oldValue;
		else if (isNaN(newValue)) return oldValue; else return newValue;
	});
	tableColumnModelComision.setCellEditorFactory(1, celleditorNumber);
	
	var selectionModelComision = tblComision.getSelectionModel();
	selectionModelComision.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelComision.addListener("changeSelection", function(){
		var bool = ! selectionModelComision.isSelectionEmpty();
		commandComisionEditar.setEnabled(bool);
		menuComision.memorizar([commandComisionEditar]);
	});

	this.add(tblComision, {left: 0, top: 0});
	
	
	
	var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("leer_paramet");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	for (var x in resultado.comision) {
		tableModelComision.addRowsAsMapArray([{id: x, producto: producto[x].label, comision: resultado.comision[x]}], null, true);
	}
	
	tblComision.setFocusedCell(1, 0, true);
	
	
	},
	members : 
	{

	}
});