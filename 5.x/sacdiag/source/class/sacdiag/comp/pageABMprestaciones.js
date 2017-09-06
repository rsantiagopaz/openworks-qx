qx.Class.define("sacdiag.comp.pageABMprestaciones",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('ABM prestaciones');
	this.toggleShowCloseButton();
	this.setLayout(new qx.ui.layout.Canvas());
	
	this.addListenerOnce("appear", function(e){
		//cboTitulo.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	
	var rowDataTipo_prestacion;
	
	
	
	var functionActualizarTipoPrestacion = function(id_tipo_prestacion) {
		btnAgregarPrestacion.setEnabled(false);
		
		var p = {};
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			tableModelTipo_prestacion.setDataAsMapArray(data.result, true);
			
			if (id_tipo_prestacion != null) {
				tblTipo_prestacion.buscar("id_tipo_prestacion", id_tipo_prestacion);
			}
		});
		rpc.callAsyncListeners(true, "leer_tipo_prestacion", p);
		
		return rpc;
	}
	
	
	var functionActualizarPrestacion = function(id_prestacion) {
		var p = {};
		p.id_tipo_prestacion = rowDataTipo_prestacion.id_tipo_prestacion;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			tableModelPrestacion.setDataAsMapArray(data.result, true);
			
			if (id_prestacion != null) {
				tblPrestacion.buscar("id_prestacion", id_prestacion);
			}
		});
		rpc.callAsyncListeners(true, "leer_prestacion", p);

		return rpc;
	}
	
	

	
	
	
	
	
	// Menu

	
	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var win = new sacdiag.comp.windowTipo_prestacion();
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarVehiculo(vehiculo.id_vehiculo, data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnAgregar = new qx.ui.menu.Button("Agregar...", null, commandAgregar);
	
	
	var commandEditar = new qx.ui.command.Command("F2");
	//commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		var win = new sacdiag.comp.windowTipo_prestacion(rowDataTipo_prestacion);
		win.setModal(true);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizarVehiculo(vehiculo.id_vehiculo, data);
		});
		
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnEditar = new qx.ui.menu.Button("Editar...", null, commandEditar);
	
	
	var menuTipo_prestacion = new componente.comp.ui.ramon.menu.Menu();
	
	menuTipo_prestacion.add(btnAgregar);
	menuTipo_prestacion.add(btnEditar);
	menuTipo_prestacion.memorizar();
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelTipo_prestacion = new qx.ui.table.model.Simple();
	tableModelTipo_prestacion.setColumns(["Descripción"], ["denominacion"]);
	tableModelTipo_prestacion.addListener("dataChanged", function(e){
		var rowCount = tableModelTipo_prestacion.getRowCount();
		
		tblTipo_prestacion.setAdditionalStatusBarText(rowCount + ((rowCount == 1) ? " item" : " items"));
	});

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblTipo_prestacion = new componente.comp.ui.ramon.table.Table(tableModelTipo_prestacion, custom);
	tblTipo_prestacion.setShowCellFocusIndicator(false);
	tblTipo_prestacion.toggleColumnVisibilityButtonVisible();
	//tbl.setRowHeight(45);
	tblTipo_prestacion.setContextMenu(menuTipo_prestacion);
	tblTipo_prestacion.addListener("cellDbltap", function(e){
		if (e.getColumn() == 0) {

		}
	});
	
	var tableColumnModelTipo_prestacion = tblTipo_prestacion.getTableColumnModel();
	
	var resizeBehaviorTipo_prestacion = tableColumnModelTipo_prestacion.getBehavior();
	/*
	resizeBehavior.set(0, {width:"3%", minWidth:100});
	resizeBehavior.set(1, {width:"5%", minWidth:100});
	resizeBehavior.set(2, {width:"5%", minWidth:100});
	resizeBehavior.set(3, {width:"21%", minWidth:100});
	resizeBehavior.set(4, {width:"5%", minWidth:100});
	resizeBehavior.set(5, {width:"21%", minWidth:100});
	resizeBehavior.set(6, {width:"5%", minWidth:100});
	resizeBehavior.set(7, {width:"5%", minWidth:100});
	resizeBehavior.set(8, {width:"21%", minWidth:100});
	resizeBehavior.set(9, {width:"4%", minWidth:100});
	resizeBehavior.set(10, {width:"5%", minWidth:100});

	
	
	var cellrendererBoolean = new qx.ui.table.cellrenderer.Boolean();
	cellrendererBoolean.setDefaultCellStyle("display: table-cell; vertical-align: middle; position: relative;");
	tableColumnModel.setDataCellRenderer(0, cellrendererBoolean);
	
	var cellrendererDate = new defineMultiLineCellDate();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/y"));
	tableColumnModel.setDataCellRenderer(1, cellrendererDate);
	
	var cellrenderer = new defineMultiLineCellHtml();
	tableColumnModel.setDataCellRenderer(2, cellrenderer);
	tableColumnModel.setDataCellRenderer(3, cellrenderer);
	tableColumnModel.setDataCellRenderer(4, cellrenderer);
	tableColumnModel.setDataCellRenderer(5, cellrenderer);
	tableColumnModel.setDataCellRenderer(6, cellrenderer);
	tableColumnModel.setDataCellRenderer(7, cellrenderer);
	tableColumnModel.setDataCellRenderer(8, cellrenderer);
	tableColumnModel.setDataCellRenderer(9, cellrenderer);
	tableColumnModel.setDataCellRenderer(10, cellrenderer);
	*/
	
	
	var selectionModelTipo_prestacion = tblTipo_prestacion.getSelectionModel();
	selectionModelTipo_prestacion.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModelTipo_prestacion.addListener("changeSelection", function(e){
		if (! selectionModelTipo_prestacion.isSelectionEmpty()) {
			rowDataTipo_prestacion = tableModelTipo_prestacion.getRowDataAsMap(tblTipo_prestacion.getFocusedRow());
			
			btnAgregarPrestacion.setEnabled(true);
			
			functionActualizarPrestacion();
		}
	});

	this.add(tblTipo_prestacion, {left: 0, top: 0, right: "53%", bottom: 200});	
	
	
	
	var gbxTipo_prestacion = new qx.ui.groupbox.GroupBox("Agregar tipo prestación")
	gbxTipo_prestacion.setLayout(new qx.ui.layout.Basic());
	this.add(gbxTipo_prestacion, {left: 0, right: "53%", bottom: 0});
	
	var formTipo_prestacion = new qx.ui.form.Form();
	
	var txtDescripTipo_prestacion = new qx.ui.form.TextField();
	txtDescripTipo_prestacion.setRequired(true);
	txtDescripTipo_prestacion.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	formTipo_prestacion.add(txtDescripTipo_prestacion, "Descripción", null, "denominacion");
	
	var btnAgregarTipo_prestacion = new qx.ui.form.Button("Agregar");
	btnAgregarTipo_prestacion.addListener("execute", function(e){
		if (formTipo_prestacion.validate()) {
			var p = {};
			p.denominacion = txtDescripTipo_prestacion.getValue();
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
			rpc.addListener("completed", function(e){
				var data = e.getData();
				
				var rpc = functionActualizarTipoPrestacion(data.result);
				rpc.addListener("completed", function(e){
					txtDescripTipo_prestacion.setValue("");
					tblTipo_prestacion.focus();
					txtDescripTipo_prestacion.focus();
				});
			});
			rpc.addListener("failed", function(e){
				var data = e.getData();
				
				tblTipo_prestacion.buscar("id_tipo_prestacion", data.code);
				//alert(qx.lang.Json.stringify(data, null, 2));
			});
			
			rpc.callAsyncListeners(true, "escribir_tipo_prestacion", p);
		} else {
			formTipo_prestacion.getValidationManager().getInvalidFormItems()[0].focus();
		}
	});
	formTipo_prestacion.addButton(btnAgregarTipo_prestacion);
	
	
	var formRenderer = new qx.ui.form.renderer.Single(formTipo_prestacion);
	
	
	gbxTipo_prestacion.add(formRenderer);
	
	
	
	
	
	
	
	
	
	//Tabla
	
	
	var tableModelPrestacion = new qx.ui.table.model.Simple();
	tableModelPrestacion.setColumns(["Código", "Descripción", "Valor"], ["codigo", "descripcion", "valor"]);
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
	//tbl.setRowHeight(45);
	tblPrestacion.addListener("cellDbltap", function(e){
		if (e.getColumn() == 0) {

		}
	});
	
	var tableColumnModelPrestacion = tblPrestacion.getTableColumnModel();
	
	var resizeBehaviorPrestacion = tableColumnModelPrestacion.getBehavior();
	/*
	resizeBehavior.set(0, {width:"3%", minWidth:100});
	resizeBehavior.set(1, {width:"5%", minWidth:100});
	resizeBehavior.set(2, {width:"5%", minWidth:100});
	resizeBehavior.set(3, {width:"21%", minWidth:100});
	resizeBehavior.set(4, {width:"5%", minWidth:100});
	resizeBehavior.set(5, {width:"21%", minWidth:100});
	resizeBehavior.set(6, {width:"5%", minWidth:100});
	resizeBehavior.set(7, {width:"5%", minWidth:100});
	resizeBehavior.set(8, {width:"21%", minWidth:100});
	resizeBehavior.set(9, {width:"4%", minWidth:100});
	resizeBehavior.set(10, {width:"5%", minWidth:100});

	
	
	var cellrendererBoolean = new qx.ui.table.cellrenderer.Boolean();
	cellrendererBoolean.setDefaultCellStyle("display: table-cell; vertical-align: middle; position: relative;");
	tableColumnModel.setDataCellRenderer(0, cellrendererBoolean);
	
	var cellrendererDate = new defineMultiLineCellDate();
	cellrendererDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/y"));
	tableColumnModel.setDataCellRenderer(1, cellrendererDate);
	
	var cellrenderer = new defineMultiLineCellHtml();
	tableColumnModel.setDataCellRenderer(2, cellrenderer);
	tableColumnModel.setDataCellRenderer(3, cellrenderer);
	tableColumnModel.setDataCellRenderer(4, cellrenderer);
	tableColumnModel.setDataCellRenderer(5, cellrenderer);
	tableColumnModel.setDataCellRenderer(6, cellrenderer);
	tableColumnModel.setDataCellRenderer(7, cellrenderer);
	tableColumnModel.setDataCellRenderer(8, cellrenderer);
	tableColumnModel.setDataCellRenderer(9, cellrenderer);
	tableColumnModel.setDataCellRenderer(10, cellrenderer);
	*/
	
	
	var selectionModel = tblPrestacion.getSelectionModel();
	selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	selectionModel.addListener("changeSelection", function(e){
		//btnAddUno.setEnabled(! selectionModel.isSelectionEmpty());
	});

	this.add(tblPrestacion, {left: "53%", top: 0, right: 0, bottom: 200});
	
	
	
	var gbxPrestacion = new qx.ui.groupbox.GroupBox("Agregar prestación")
	gbxPrestacion.setLayout(new qx.ui.layout.Basic());
	this.add(gbxPrestacion, {left: "53%", right: 0, bottom: 0});
	
	
	var formPrestacion = new qx.ui.form.Form();
	
	var txtCodigo = new qx.ui.form.TextField();
	txtCodigo.setRequired(true);
	formPrestacion.add(txtCodigo, "Código", null, "codigo");
	
	var txtDescripPrestacion = new qx.ui.form.TextField();
	txtDescripPrestacion.setRequired(true);
	formPrestacion.add(txtDescripPrestacion, "Descripción", null, "descripcion");
	
	var txtValor = new qx.ui.form.Spinner();
	formPrestacion.add(txtValor, "Valor", null, "valor");
	
	
	
	
	var btnAgregarPrestacion = new qx.ui.form.Button("Agregar");
	btnAgregarPrestacion.addListener("execute", function(e){
		if (formPrestacion.validate()) {
			var p = {};
			p.id_tipo_prestacion = rowDataTipo_prestacion.id_tipo_prestacion;
			p.codigo = txtCodigo.getValue();
			p.descripcion = txtDescripPrestacion.getValue();
			p.valor = txtValor.getValue();
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
			rpc.callAsync(function(resultado, error, id){
				var rpc = functionActualizarPrestacion(resultado);
				rpc.addListener("completed", function(e){
					txtCodigo.setValue("");
					txtDescripPrestacion.setValue("")
					txtValor.setValue(0);
					
					tblPrestacion.focus();
					txtCodigo.focus();
				});
			}, "escribir_prestacion", p);
		} else {
			formPrestacion.getValidationManager().getInvalidFormItems()[0].focus();
		}
	});
	
	formPrestacion.addButton(btnAgregarPrestacion);
	
	var formRenderer = new qx.ui.form.renderer.Single(formPrestacion);
	
	gbxPrestacion.add(formRenderer);
	
	
	
	functionActualizarTipoPrestacion();
	
	
		
	},
	members : 
	{

	}
});