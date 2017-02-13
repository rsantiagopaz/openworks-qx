qx.Class.define("turismo.comp.windowPasajeros",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (rowParamet)
	{
	this.base(arguments);
	
		this.set({
			caption: "Datos básicos de operación",
			width: 850,
			height: 660,
			showMinimize: false,
			showMaximize: false
		});
		
		this.setLayout(new qx.ui.layout.Canvas());
		this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		cboUsuario.focus();
	});
	
	
	
	var application = qx.core.Init.getApplication();
	
	var controllerForm1;
	var modelForm1;
	
	
	var form1 = new qx.ui.form.Form();
	var form2 = new qx.ui.form.Form();
	var resetter = new qx.ui.form.Resetter();
	
	var cboUsuario = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Proforma", "autocompletarUsuario", null, 1);
	cboUsuario.setRequired(true);
	form2.add(cboUsuario, "Usuario", function(value) {
		if (lstUsuario.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar usuario");
	}, "usuario", null, {grupo: 1, item: {row: 0, column: 1, colSpan: 4}});
	var lstUsuario = cboUsuario.getChildControl("list");
	form2.add(lstUsuario, "", null, "id_usuario");
	
	var txtContrasena = new qx.ui.form.PasswordField("");
	txtContrasena.setRequired(true);
	txtContrasena.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form2.add(txtContrasena, "Contraseña", function(value) {
		if (lstUsuario.isSelectionEmpty()) {
			if (txtContrasena.getValue() == "") throw new qx.core.ValidationError("Validation Error", "Este cuadro es obligatorio"); 
		} else {
			if (txtContrasena.getValue() != lstUsuario.getSelection()[0].getUserData("datos").password) throw new qx.core.ValidationError("Validation Error", "Contraseña incorrecta");
		}
	}, "password", null, {grupo: 1, item: {row: 0, column: 6, colSpan: 4}});
	
	
	var txtCant_mayores = new qx.ui.form.Spinner();
	txtCant_mayores.getChildControl("upbutton").setVisibility("excluded");
	txtCant_mayores.getChildControl("downbutton").setVisibility("excluded");
	txtCant_mayores.setSingleStep(0);
	txtCant_mayores.setPageStep(0);
	form2.add(txtCant_mayores, "Cant. mayores", null, "cant_mayores", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 2}});
	
	var txtCant_menores = new qx.ui.form.Spinner();
	txtCant_menores.getChildControl("upbutton").setVisibility("excluded");
	txtCant_menores.getChildControl("downbutton").setVisibility("excluded");
	txtCant_menores.setSingleStep(0);
	txtCant_menores.setPageStep(0);
	form2.add(txtCant_menores, "Cant. menores", null, "cant_menores", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 2}});
	
	
	var cboCliente = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Proforma", "autocompletarCliente");
	cboCliente.setWidth(275);
	//form1.add(cboCliente, "Buscar", null, "buscar", null, {grupo: 2, item: {row: 0, column: 1, colSpan: 9}});
	//resetter.add(cboCliente);
	
	var lstCliente = cboCliente.getChildControl("list");
	lstCliente.addListener("changeSelection", function(e){
		var datos;

		tblContactar.setFocusedCell();
		
		if (lstCliente.isSelectionEmpty()) {
			gpbCliente.setLegend("Nuevo cliente");
			
			txtFecha_nac.setValue(new Date);
			txtFecha_ven.setValue(new Date);
			resetter.reset();
			
			modelForm1 = controllerForm1.createModel(true);
			datos = qx.util.Serializer.toNativeObject(modelForm1);
			datos.id_cliente = "0";
			
			tableModelContactar.setDataAsMapArray([], true);
		} else {
			gpbCliente.setLegend("Modificar cliente");
			datos = lstCliente.getSelection()[0].getUserData("datos");
			//datos.buscar = cboCliente.getValue();
			//datos.id_cliente = lstCliente.getModelSelection().getItem(0);
			//alert(qx.lang.Json.stringify(datos, null, 2));
			
			tableModelContactar.setDataAsMapArray(datos.contacto, true);
			tblContactar.setFocusedCell(0, tableModelContactar.getRowCount() - 1, true);
		}

		modelForm1 = qx.data.marshal.Json.createModel(datos, true);
		controllerForm1.setModel(modelForm1);
	})
	//form1.add(lstCliente, "", null, "id_cliente");
	//resetter.add(lstCliente);
	
	
	var txtApellido = new qx.ui.form.TextField("");
	txtApellido.setRequired(true);
	txtApellido.addListener("blur", function(e){
		this.setValue(qx.lang.String.capitalize(this.getValue().trim()));
	});
	form1.add(txtApellido, "Apellido", null, "apellido", null, {grupo: 2, item: {row: 0, column: 1, colSpan: 9}});
	resetter.add(txtApellido);
	
	var txtNombre = new qx.ui.form.TextField("");
	txtNombre.setRequired(true);
	txtNombre.addListener("blur", function(e){
		this.setValue(qx.lang.String.capitalize(this.getValue().trim()));
	});
	form1.add(txtNombre, "Nombre", null, "nombre", null, {grupo: 2, item: {row: 1, column: 1, colSpan: 9}});
	resetter.add(txtNombre);
	
	var txtDni = new qx.ui.form.TextField("");
	txtDni.setRequired(true);
	txtDni.addListener("blur", function(e){
		this.setValue(application.functionEliminarCaracter(this.getValue()));
	});
	form1.add(txtDni, "D.N.I.", null, "dni", null, {grupo: 2, item: {row: 2, column: 1, colSpan: 4}});
	resetter.add(txtDni);
	
	var txtCuit = new qx.ui.form.TextField("");
	txtCuit.addListener("blur", function(e){
		this.setValue(application.functionEliminarCaracter(this.getValue()));
	});
	form1.add(txtCuit, "CUIT/CUIL", null, "cuit", null, {grupo: 2, item: {row: 2, column: 6, colSpan: 4}});
	resetter.add(txtCuit);
	
	var txtFecha_nac = new qx.ui.form.DateField();
	txtFecha_nac.setRequired(true);
	txtFecha_nac.addListener("focus", function(e){
		txtFecha_nac.getChildControl("textfield").selectAllText();
	})
	form1.add(txtFecha_nac, "Fecha nac.", null, "fecha_nac", null, {grupo: 2, item: {row: 3, column: 1, colSpan: 4}});
	resetter.add(txtFecha_nac);
	
	var txtNropasaporte = new qx.ui.form.TextField("");
	form1.add(txtNropasaporte, "Nro.pasaporte", null, "nro_pasaporte", null, {grupo: 2, item: {row: 4, column: 1, colSpan: 4}});
	resetter.add(txtNropasaporte);
	
	var txtFecha_ven = new qx.ui.form.DateField();
	txtFecha_ven.addListener("focus", function(e){
		txtFecha_ven.getChildControl("textfield").selectAllText();
	})
	form1.add(txtFecha_ven, "Fecha venc.", null, "fecha_venc", null, {grupo: 2, item: {row: 4, column: 6, colSpan: 4}});
	resetter.add(txtFecha_ven);
	
	var txtDomicilio = new qx.ui.form.TextField("");
	txtDomicilio.setRequired(true);
	txtDomicilio.addListener("blur", function(e){
		this.setValue(application.functionOracion(this.getValue()));
	});
	form1.add(txtDomicilio, "Domicilio", null, "domicilio", null, {grupo: 2, item: {row: 5, column: 1, colSpan: 9}});
	resetter.add(txtDomicilio);
	
	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
		if (form1.validate()) {
			var nativeObject = qx.util.Serializer.toNativeObject(modelForm1);
			nativeObject.contacto = tableModelContactar.getDataAsMapArray();
			
			if (nativeObject.id_cliente == "0") {
				tableModelPasajero.addRowsAsMapArray([nativeObject], null, true);
				tblPasajero.setFocusedCell(0, tableModelPasajero.getRowCount() - 1, true);
				
				resetter.reset();
			} else {
				var aux = tblPasajero.buscar("id_cliente", nativeObject.id_cliente);
				if (aux == null) {
					tableModelPasajero.addRowsAsMapArray([nativeObject], null, true);
					tblPasajero.setFocusedCell(0, tableModelPasajero.getRowCount() - 1, true);
					
				} else {
					tableModelPasajero.setRowsAsMapArray([nativeObject], tblPasajero.getFocusedRow(), true)
				}
				
				cboCliente.setValue("");
				lstCliente.removeAll();
			}
			
			tblContactar.setFocusedCell();
			tableModelContactar.setDataAsMapArray([], true);
			
			cboCliente.focus();
		} else {
			form1.getValidationManager().getInvalidFormItems()[0].focus();
		}
	});
	form1.addButton(btnAgregar, {grupo: 2, item: {row: 6, column: 6, colSpan: 4}});
	

	
	
	
	controllerForm1 = new qx.data.controller.Form(null, form1);
	modelForm1 = controllerForm1.createModel(true);
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form2, 12, 25, 1);
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	var gpbCliente = new qx.ui.groupbox.GroupBox(" Nuevo cliente ");
	gpbCliente.setLayout(new qx.ui.layout.Canvas());
	
	
	
	
	
	
	
		// Menu de contexto
	
	var menuContactar = new componente.comp.ui.ramon.menu.Menu();
	
	var commandNuevoContactar = new qx.ui.core.Command("Insert");
	commandNuevoContactar.addListener("execute", function(e) {
		tableModelContactar.addRowsAsMapArray([{tipo: "C", descrip: ""}], null, true);
		tblContactar.setFocusedCell(0, tableModelContactar.getRowCount()-1, true);
		tblContactar.startEditing();
	}, this);
	

	var btnNuevoContactar = new qx.ui.menu.Button("Insertar", null, commandNuevoContactar);
	var btnEliminarContactar = new qx.ui.menu.Button("Eliminar");
	btnEliminarContactar.setEnabled(false);
	btnEliminarContactar.addListener("execute", function(e) {
		tblContactar.blur();
		var focusedRow = tblContactar.getFocusedRow();
		tblContactar.setFocusedCell();
		tableModelContactar.removeRows(focusedRow, 1);
		var rowCount = tableModelContactar.getRowCount();
		if (rowCount > 0) tblContactar.setFocusedCell(0, ((focusedRow > rowCount - 1) ? rowCount - 1 : focusedRow), true);
		tblContactar.focus();
	}, this);
	
	menuContactar.add(btnNuevoContactar);
	menuContactar.add(btnEliminarContactar);
	menuContactar.memorizar();
	
	
		//Tabla

		var tableModelContactar = new qx.ui.table.model.Simple();
		tableModelContactar.setColumns(["Tipo", "Contacto"], ["tipo", "descrip"]);
		tableModelContactar.setEditable(true);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		var tblContactar = new componente.comp.ui.ramon.table.Table(tableModelContactar, custom);
		tblContactar.setShowCellFocusIndicator(true);
		tblContactar.toggleColumnVisibilityButtonVisible();
		tblContactar.toggleStatusBarVisible();
		tblContactar.setContextMenu(menuContactar);
		tblContactar.setWidth(250);
		tblContactar.setHeight(150);
		//tblContactar.edicion="";
		//tblContactar.edicion = "desplazamiento_vertical";
		
		
		tblContactar.addListener("dataEdited", function(e){
			var data = e.getData();
			if (data.col == 1) {
				var rowData = tableModelContactar.getRowDataAsMap(data.row);
				rowData.descrip = rowData.descrip.trim();
				tableModelContactar.setRowsAsMapArray([rowData], data.row, true);
			}
		});

		
		var tableColumnModelContactar = tblContactar.getTableColumnModel();
		var resizeBehavior = tableColumnModelContactar.getBehavior();
		resizeBehavior.set(0, {width:"30%", minWidth:100});
		resizeBehavior.set(1, {width:"70%", minWidth:100});
		
		
		var cellrenderReplace = new qx.ui.table.cellrenderer.Replace();
		cellrenderReplace.setReplaceMap({
			"C" : "Celular",
			"E" : "Email",
			"T" : "Telefono"
		});
		cellrenderReplace.addReversedReplaceMap();
		tableColumnModelContactar.setDataCellRenderer(0, cellrenderReplace);
		

		var celleditorSelectBox = new qx.ui.table.celleditor.SelectBox();
		celleditorSelectBox.setListData([['Celular', null, 'C'], ['Email', null, 'E'], ['Telefono', null, 'T']]);
		tableColumnModelContactar.setCellEditorFactory(0, celleditorSelectBox);

		

		var selectionModelContactar = tblContactar.getSelectionModel();
		selectionModelContactar.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModelContactar.addListener("changeSelection", function(){
			var bool = ! selectionModelContactar.isSelectionEmpty();
			btnEliminarContactar.setEnabled(bool);
			menuContactar.memorizar([btnEliminarContactar]);
		});
		
		

		gpbCliente.add(tblContactar, {left: 400, top: 40, bottom: 0});
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form1, 12, 25, 2);
	gpbCliente.add(formView, {left: 0, top: 40});
	
	gpbCliente.add(new qx.ui.basic.Label("Buscar:"), {left: 0, top: 3});
	gpbCliente.add(cboCliente, {left: 84, top: 0});
	
	var lblLinea = new qx.ui.basic.Label("<hr>");
	lblLinea.setRich(true);
	lblLinea.setWidth(360);
	gpbCliente.add(lblLinea, {left: 0, top: 22});
	
	this.add(gpbCliente, {left: 0, top: 100});
	
	
	
	lstCliente.fireDataEvent("changeSelection", []);


	
	
	
	
	
		// Menu de contexto
	
	var menuPasajero = new componente.comp.ui.ramon.menu.Menu();
	
	var btnEliminarPasajero = new qx.ui.menu.Button("Eliminar");
	btnEliminarPasajero.setEnabled(false);
	btnEliminarPasajero.addListener("execute", function(e) {
		tblPasajero.blur();
		var focusedRow = tblPasajero.getFocusedRow();
		tblPasajero.setFocusedCell();
		tableModelPasajero.removeRows(focusedRow, 1);
		var rowCount = tableModelPasajero.getRowCount();
		if (rowCount > 0) tblPasajero.setFocusedCell(0, ((focusedRow > rowCount - 1) ? rowCount - 1 : focusedRow), true);
		tblPasajero.focus();
	}, this);
	
	menuPasajero.add(btnEliminarPasajero);
	menuPasajero.memorizar();
	
		//Tabla

		var tableModelPasajero = new qx.ui.table.model.Simple();
		tableModelPasajero.setColumns(["Apellido", "Nombre", "D.N.I.", "CUIT/CUIL", "Fecha nac.", "Nro.pasaporte", "Fecha venc.", "Domicilio"], ["apellido", "nombre", "dni", "cuit", "fecha_nac", "nro_pasaporte", "fecha_venc", "domicilio"]);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		var tblPasajero = new componente.comp.ui.ramon.table.Table(tableModelPasajero, custom);
		tblPasajero.setShowCellFocusIndicator(false);
		tblPasajero.toggleColumnVisibilityButtonVisible();
		tblPasajero.toggleStatusBarVisible();
		tblPasajero.setContextMenu(menuPasajero);
		tblPasajero.setHeight(180);

		
		var tableColumnModelPasajero = tblPasajero.getTableColumnModel();
		var resizeBehavior = tableColumnModelPasajero.getBehavior();
		//resizeBehavior.set(0, {width:"30%", minWidth:100});
		//resizeBehavior.set(1, {width:"70%", minWidth:100});
		

		var selectionModelPasajero = tblPasajero.getSelectionModel();
		selectionModelPasajero.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModelPasajero.addListener("changeSelection", function(){
			var bool = ! selectionModelPasajero.isSelectionEmpty();
			btnEliminarPasajero.setEnabled(bool);
			menuPasajero.memorizar([btnEliminarPasajero]);
		});

		this.add(tblPasajero, {left: 0, bottom: 40, right: 0});
	
	
	
	

	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (tableModelPasajero.getRowCount() == 0) {
			dialog.Dialog.warning("Debe agregar algún cliente a la tabla de pasajeros.", function(e){tblPasajero.focus();});
		} else if (form2.validate()) {
			var p = {};
			p.id_proforma = rowParamet.id_proforma;
			p.id_operacion = rowParamet.id_operacion;
			p.id_usuario = lstUsuario.getModelSelection().getItem(0);
			p.cant_mayores = txtCant_mayores.getValue();
			p.cant_menores = txtCant_menores.getValue();
			p.model = tableModelPasajero.getDataAsMapArray();
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
			rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id){
				this.fireDataEvent("aceptado", resultado);
			
				this.destroy();				
			}, this), "escribir_operacion", p);
		} else {
			form2.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);

	this.add(btnAceptar, {left: "35%", bottom: 0});
	this.add(btnCancelar, {right: "35%", bottom: 0});
	
	
	if (rowParamet.id_operacion == null) {
		txtApellido.setValue(rowParamet.apellido);
		txtNombre.setValue(rowParamet.nombre);
		txtCant_mayores.setValue(rowParamet.cant_mayores);
		txtCant_menores.setValue(rowParamet.cant_menores);
		for (var x in rowParamet.contacto) {
			tableModelContactar.addRowsAsMapArray([rowParamet.contacto[x]], null, true);
			tblContactar.setFocusedCell(0, tableModelContactar.getRowCount() - 1, true);
		}
	} else {
		var p = {};
		p.id_operacion = rowParamet.id_operacion;
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
		try {
			var resultado = rpc.callSync("leer_datos_operacion_basicos", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		
		txtCant_mayores.setValue(resultado.model.cant_mayores);
		txtCant_menores.setValue(resultado.model.cant_menores);
		tableModelPasajero.setDataAsMapArray(resultado.pasajero, true);
	}
	
	

	cboUsuario.setTabIndex(1);
	txtContrasena.setTabIndex(2);
	txtCant_mayores.setTabIndex(3);
	txtCant_menores.setTabIndex(4);
	cboCliente.setTabIndex(5);
	txtApellido.setTabIndex(6);
	txtNombre.setTabIndex(7);
	txtDni.setTabIndex(8);
	txtCuit.setTabIndex(9);
	txtFecha_nac.setTabIndex(10);
	txtNropasaporte.setTabIndex(11);
	txtFecha_ven.setTabIndex(12);
	txtDomicilio.setTabIndex(13);
	tblContactar.setTabIndex(14);
	btnAgregar.setTabIndex(15);
	tblPasajero.setTabIndex(16);
	btnAceptar.setTabIndex(17);
	btnCancelar.setTabIndex(18);

	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});