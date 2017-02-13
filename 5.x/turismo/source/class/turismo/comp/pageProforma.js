qx.Class.define("turismo.comp.pageProforma",
{
	extend : componente.comp.ui.ramon.page.Page,
	construct : function (id_proforma)
	{
	this.base(arguments);
	
	this.setLabel("Consulta");
	this.setLayout(new qx.ui.layout.Canvas());
	this.toggleShowCloseButton();

	this.addListenerOnce("appear", function(e){
		cboUsuario.focus();
	});
	

	var activar_actualizar = true;
	
	var functionActualizar = function() {
		if (activar_actualizar) {
			var p = {};
			p.id_proforma = id_proforma;
			p.apellido = txtApellido.getValue().trim();
			p.nombre = txtNombre.getValue().trim();
			p.contactar = tableModelContactar.getDataAsMapArray();
			
			compositeProforma_relacionada.buscar(p);
		}
	};
	
	
	
	var gpbNueva = new qx.ui.groupbox.GroupBox();
	gpbNueva.setLayout(new qx.ui.layout.Canvas());
	this.add(gpbNueva, {left: 0, top: 0, right: "50.5%", bottom: 0});
	
	
	var gpbProductos = new qx.ui.groupbox.GroupBox("Productos");
	gpbProductos.setLayout(new qx.ui.layout.Grow());
	gpbNueva.add(gpbProductos, {left: 400, top: 0, right: 0, bottom: 50});
	
	var containerScroll = new qx.ui.container.Scroll();
	gpbProductos.add(containerScroll);
	
	var containerCodigos = new qx.ui.container.Composite(new qx.ui.layout.Grid(6, 6));
	//var containerCodigos = new qx.ui.container.Composite(new qx.ui.layout.Grow());
	containerScroll.add(containerCodigos);
	
	
	
	var form = new qx.ui.form.Form();
	
	var cboUsuario = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Proforma", "autocompletarUsuario", null, 1);
	cboUsuario.setRequired(true);
	form.add(cboUsuario, "Usuario", function(value) {
		if (lstUsuario.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar usuario");
	}, "usuario", null, {grupo: 1, item: {row: 0, column: 1, colSpan: 4}});
	var lstUsuario = cboUsuario.getChildControl("list");
	form.add(lstUsuario, "", null, "id_usuario");
	
	
	var txtContrasena = new qx.ui.form.PasswordField("");
	txtContrasena.setRequired(true);
	txtContrasena.addListener("blur", function(e){
		txtContrasena.setValue(txtContrasena.getValue().trim());
	});
	form.add(txtContrasena, "Contraseña", function(value) {
		if (lstUsuario.isSelectionEmpty()) {
			if (txtContrasena.getValue() == "") throw new qx.core.ValidationError("Validation Error", "Este cuadro es obligatorio"); 
		} else {
			if (txtContrasena.getValue() != lstUsuario.getSelection()[0].getUserData("datos").password) throw new qx.core.ValidationError("Validation Error", "Contraseña incorrecta");
		}
	}, "password", null, {grupo: 1, item: {row: 0, column: 6, colSpan: 4}});
	
	var slbTipo_entrevista = new qx.ui.form.SelectBox();
	slbTipo_entrevista.add(new qx.ui.form.ListItem("Personal", null, "P"));
	slbTipo_entrevista.add(new qx.ui.form.ListItem("Teléfono", null, "T"));
	slbTipo_entrevista.add(new qx.ui.form.ListItem("Email", null, "E"));
	slbTipo_entrevista.add(new qx.ui.form.ListItem("Facebook", null, "F"));
	
	form.add(slbTipo_entrevista, "Tipo de entrevista", null, "tipo_entrevista", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 4}});
	
	
	var txtApellido = new qx.ui.form.TextField("");
	txtApellido.setRequired(true);
	txtApellido.setLiveUpdate(true);
	txtApellido.addListener("changeValue", function(e){
		if (txtApellido.getValue().trim().length == 3) functionActualizar();
	});
	txtApellido.addListener("blur", function(e){
		this.setValue(qx.lang.String.capitalize(this.getValue().trim()));
	});
	form.add(txtApellido, "Apellido", null, "apellido", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 9}});
	
	var txtNombre = new qx.ui.form.TextField("");
	txtNombre.setRequired(true);
	txtNombre.setLiveUpdate(true);
	txtNombre.addListener("changeValue", function(e){
		if (txtApellido.getValue().trim().length > 2) functionActualizar();
	});
	txtNombre.addListener("blur", function(e){
		this.setValue(qx.lang.String.capitalize(this.getValue().trim()));
	});
	form.add(txtNombre, "Nombre", null, "nombre", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 9}});
	
	
	
	
	var tknDestino = new tokenfield.Token();
	//tknDestino.setWidth(800);
	//tknDestino.setMaxWidth(500);
	tknDestino.setWidth(200);
	tknDestino.setHeight(80);
	tknDestino.setSelectionMode('multi');
	tknDestino.setSelectOnce(true);
	tknDestino.setLabelPath("descrip");
	
	// todo: should be setTypeInText, but that doesn't work
	tknDestino.setHintText("Please enter at least two letters of a country name...");
	
	/*
	 * listens for event to load data from the server. here, we
	 * do a simple mockup with a small timeout to simulate a server request
	 */
	tknDestino.addListener("loadData", function(e) {
		var data = e.getData().trim();
      	if (data != "") {
			var p = {};
			p.descrip = data;
	
			var rpc = new qx.io.remote.Rpc("services/", "comp.Proforma");
			rpc.callAsync(function(resultado, error, id){
				tknDestino.populateList(data, resultado);
			}, "leer_token_destino", p);
      	}
	}, this);

	form.add(tknDestino, "Destinos", null, null, null, {grupo: 1, item: {row: 4, column: 1, rowSpan: 4, colSpan: 9}});
	
	
	
	var tknMotivo = new tokenfield.Token();
	tknMotivo.setWidth(200);
	tknMotivo.setHeight(80);
	tknMotivo.setSelectionMode('multi');
	tknMotivo.setSelectOnce(true);
	tknMotivo.setLabelPath("descrip");
	
	// todo: should be setTypeInText, but that doesn't work
	tknMotivo.setHintText("Please enter at least two letters of a country name...");
	
	/*
	 * listens for event to load data from the server. here, we
	 * do a simple mockup with a small timeout to simulate a server request
	 */
	tknMotivo.addListener("loadData", function(e) {
		var data = e.getData().trim();
      	if (data != "") {
			var p = {};
			p.descrip = data;
	
			var rpc = new qx.io.remote.Rpc("services/", "comp.Proforma");
			rpc.callAsync(function(resultado, error, id){
				tknMotivo.populateList(data, resultado);
			}, "leer_token_motivo", p);
      	}
	}, this);

	form.add(tknMotivo, "Motivos", null, null, null, {grupo: 1, item: {row: 8, column: 1, rowSpan: 6, colSpan: 9}});
	
	
	
	
	
	
	
	
	
	var txtTiempoestimado = new qx.ui.form.TextField("");
	form.add(txtTiempoestimado, "Tiempo estimado", null, "tiempo_estimado", null, {grupo: 1, item: {row: 14, column: 1, colSpan: 9}});


	var txtCant_mayores = new qx.ui.form.Spinner();
	txtCant_mayores.getChildControl("upbutton").setVisibility("excluded");
	txtCant_mayores.getChildControl("downbutton").setVisibility("excluded");
	txtCant_mayores.setSingleStep(0);
	txtCant_mayores.setPageStep(0);
	form.add(txtCant_mayores, "Cant. mayores", null, "cant_mayores", null, {grupo: 1, item: {row: 15, column: 1, colSpan: 2}});
	
	var txtCant_menores = new qx.ui.form.Spinner();
	txtCant_menores.getChildControl("upbutton").setVisibility("excluded");
	txtCant_menores.getChildControl("downbutton").setVisibility("excluded");
	txtCant_menores.setSingleStep(0);
	txtCant_menores.setPageStep(0);
	form.add(txtCant_menores, "Cant. menores", null, "cant_menores", null, {grupo: 1, item: {row: 16, column: 1, colSpan: 2}});

	
	var txtHorario_contactar = new qx.ui.form.TextField("");
	form.add(txtHorario_contactar, "Horario contacto", null, "horario_contactar", null, {grupo: 1, item: {row: 17, column: 1, colSpan: 9}});
	
	
	
	var chk, txt;
	//var producto = ["Aéreo", "Hoteles", "Alquiler auto", "Seguros", "Cruceros", "Paquetes", "Trenes", "Traslado", "Excursiones"];
	/*
	var producto = {
				aereo : {label: "Aéreo", index: 0},
				hoteles : {label: "Hoteles", index: 1},
				alquiler : {label: "Alquiler", index: 2},
				seguros : {label: "Seguros", index: 3},
				cruceros : {label: "Cruceros", index: 4},
				paquetes : {label: "Paquetes", index: 5},
				trenes : {label: "Trenes", index: 6},
				traslado : {label: "Traslado", index: 7},
				excursiones : {label: "Excursiones", index: 8},
				servicios : {label: "Servicios", index: 9}
	};
	*/

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
	
	for (var x in producto) {
		var chk = new qx.ui.form.CheckBox(producto[x].label + ":");
		var txt = new qx.ui.form.TextArea("");
		//txt.setMaxHeight(50);
		txt.setWidth(250);
		txt.addListener("blur", function(e){
			var target = e.getTarget();
			target.setValue(target.getValue().trim());
		});
		chk.bind("value", txt, "visibility", {converter: function(data, model, source, target) {
			target.focus();
			return (data) ? "visible" : "hidden";
		}});
		form.add(chk, "", null, null, null, {grupo: 2, item: {row: parseInt(x), column: 1, colSpan: 4}});
		form.add(txt, "", null, null, null, {grupo: 2, item: {row: parseInt(x), column: 6, colSpan: 9}});
		//producto[x] = {chk: chk, txt: txt};
		
		containerCodigos.add(chk, {row: parseInt(x), column: 0});
		containerCodigos.add(txt, {row: parseInt(x), column: 1});
		
		producto[x].chk = chk;
		producto[x].txt = txt;
	}
	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	
	
	
	
	
	

	

	
	
	//var formView = new qx.ui.form.renderer.Double(form);
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 50, 50, 1);
	gpbNueva.add(formView, {left: 0, top: 20});
	
	
	
	

	
	//formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 50, 50, 2);
	//containerCodigos.add(formView);
	

	
	
	
	
	
	
	
		// Menu de contexto
	
	var commandNuevoContactar = new qx.ui.command.Command("Insert");
	commandNuevoContactar.addListener("execute", function(e) {
		tableModelContactar.addRowsAsMapArray([{tipo: "C", descrip: ""}], null, true);
		tblContactar.setFocusedCell(0, tableModelContactar.getRowCount()-1, true);
		tblContactar.startEditing();
	}, this);
	
	//this.registrarCommand(commandNuevoContactar);
	
	
		
	var menuContactar = new componente.comp.ui.ramon.menu.Menu();
	
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
	commandNuevoContactar.setEnabled(false);
	
	
	
		
		//Tabla

		var tableModelContactar = new qx.ui.table.model.Simple();
		tableModelContactar.setColumns(["Tipo", "Descripción"], ["tipo", "descrip"]);
		tableModelContactar.setEditable(true);
		tableModelContactar.addListener("dataChanged", function(e){
			functionActualizar();
		});

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
			"T" : "Teléfono"
		});
		cellrenderReplace.addReversedReplaceMap();
		tableColumnModelContactar.setDataCellRenderer(0, cellrenderReplace);
		

		var celleditorSelectBox = new qx.ui.table.celleditor.SelectBox();
		celleditorSelectBox.setListData([['Celular', null, 'C'], ['Email', null, 'E'], ['Teléfono', null, 'T']]);
		tableColumnModelContactar.setCellEditorFactory(0, celleditorSelectBox);

		

		var selectionModelContactar = tblContactar.getSelectionModel();
		selectionModelContactar.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModelContactar.addListener("changeSelection", function(){
			var bool = ! selectionModelContactar.isSelectionEmpty();
			btnEliminarContactar.setEnabled(bool);
			menuContactar.memorizar([btnEliminarContactar]);
		});
		
		

		gpbNueva.add(new qx.ui.basic.Label("Contacto:"), {left: 0, top: 420});
		gpbNueva.add(tblContactar, {left: 0, top: 440});

	

	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var btnAceptar = new qx.ui.form.Button("Guardar consulta");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			if (tableModelContactar.getRowCount() > 0) {
				dialog.Dialog.confirm("¿Desea guardar consulta?", qx.lang.Function.bind(function(e){
					if (e) {
						var model = qx.util.Serializer.toNativeObject(modelForm);
						model.id_proforma = id_proforma;
						
						model.json = {producto: {}};
						
						for (var x in producto) {
							if (producto[x].chk.getValue()) {
								model.json.producto[x] = {};
								model.json.producto[x].txt = encodeURIComponent(producto[x].txt.getValue());
							}
						}
						
						var p = {};
						p.model = model;
						
						
						p.token_destino = [];
						tknDestino.getSelection().forEach(function(item, index, arr){
							if (item.toString().substr(0, 19) == "qx.ui.form.ListItem") p.token_destino.push(qx.util.Serializer.toNativeObject(item.getModel()));
						});
						
						p.token_motivo = [];
						tknMotivo.getSelection().forEach(function(item, index, arr){
							if (item.toString().substr(0, 19) == "qx.ui.form.ListItem") p.token_motivo.push(qx.util.Serializer.toNativeObject(item.getModel()));
						});
						
						p.contactar = tableModelContactar.getDataAsMapArray();
						
						//alert(qx.lang.Json.stringify(p, null, 2));
						
						
						var rpc = new qx.io.remote.Rpc("services/", "comp.Proforma");
						try {
							var resultado = rpc.callSync("nueva_proforma", p);
						} catch (ex) {
							alert("Sync exception: " + ex);
						}
						
						this.fireDataEvent("aceptado", resultado);
				
						this.destroy();
					}
				}, this));
			} else {
				dialog.Dialog.alert("Debe agregar algún item a la tabla de contacto.", function(e){tblContactar.focus();});
			}
			
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
		

		
	}, this);
	gpbNueva.add(btnAceptar, {right: 0, bottom: 0})
	

	
	
	
	
	var gpbRelacionada = new qx.ui.groupbox.GroupBox(" Consulta relacionada ");
	gpbRelacionada.setLayout(new qx.ui.layout.Grow());
	this.add(gpbRelacionada, {left: "50%", top: 0, right: 0, bottom: 0});
	
	var compositeProforma_relacionada = new turismo.comp.compositeProforma_relacionada(this);
	gpbRelacionada.add(compositeProforma_relacionada);
	
	
	
	
	
	if (id_proforma=="0") {
		this.setLabel("Nueva consulta");
		
		var modelForm = controllerForm.createModel();
	} else {
		this.setLabel("Modificar consulta");
		
		activar_actualizar = false;
		
		var p = {id_proforma: id_proforma};
		var rpc = new qx.io.remote.Rpc("services/", "comp.Proforma");
		try {
			var resultado = rpc.callSync("leer_proforma", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		
		delete resultado.model.fecha;
		delete resultado.model.presupuesto;
		
		modelForm = qx.data.marshal.Json.createModel(resultado.model);
		controllerForm.setModel(modelForm);
		
		tableModelContactar.setDataAsMapArray(resultado.contactar, true);
		
		for (var x in resultado.destino) {
			tknDestino.addToken(resultado.destino[x], true);
		}
		
		for (var x in resultado.motivo) {
			tknMotivo.addToken(resultado.motivo[x], true);
		}
		
		for (var x in resultado.json.producto){
			producto[x].chk.setValue(true);
			producto[x].txt.setValue(decodeURIComponent(resultado.json.producto[x].txt));
		}
		
		activar_actualizar = true;
		functionActualizar();
	}
	
	

	
	cboUsuario.setTabIndex(1);
	txtContrasena.setTabIndex(2);
	slbTipo_entrevista.setTabIndex(3);
	txtApellido.setTabIndex(4);
	txtNombre.setTabIndex(5);
	tknDestino.setTabIndex(6);
	tknMotivo.setTabIndex(7);
	txtTiempoestimado.setTabIndex(8);
	txtCant_mayores.setTabIndex(9);
	txtCant_menores.setTabIndex(10);
	txtHorario_contactar.setTabIndex(11);
	tblContactar.setTabIndex(12);

	for (var x in producto) {
		producto[x].chk.setTabIndex(13 + (x * 2));
		producto[x].txt.setTabIndex(13 + (x * 2) + 1);
	}
	
	btnAceptar.setTabIndex(40);
	compositeProforma_relacionada.setTabIndex(50);
	
	
	


	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});