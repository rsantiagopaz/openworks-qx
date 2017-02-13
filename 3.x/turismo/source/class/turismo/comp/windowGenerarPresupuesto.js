qx.Class.define("turismo.comp.windowGenerarPresupuesto",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (id_proforma, json)
	{
	this.base(arguments);
	
		this.set({
			caption: "Generar presupuesto",
			width: 1200,
			height: 700,
			showMinimize: false,
			showMaximize: false
		});
		
		this.setLayout(new qx.ui.layout.Canvas());
		this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		cboUsuario.focus();
	});
	
	this.addListener("close", function(e){
		application.windowGenerarPresupuesto = null;
		this.destroy();
	});
	
	
	var application = qx.core.Init.getApplication();
	var tblFocus;
	var filePresupuesto = null;
	var numberformatMonto = new qx.util.format.NumberFormat("es");
	numberformatMonto.setMaximumFractionDigits(2);
	numberformatMonto.setMinimumFractionDigits(2);
	
	
	
	var functionGrabar = qx.lang.Function.bind(function(bandera) {
		if (bandera) {
			var blocker = new qx.ui.core.Blocker(this.getChildrenContainer());
			blocker.set({color: "#bfbfbf", opacity: 0.4});
			blocker.block();
			var element = blocker.getBlockerElement();
			var imageLoading = new qx.html.Element("img", {backgroundColor: "#FFFFFF", position: "absolute", top: parseInt(element.getStyle("height")) / 2 + "px", left: parseInt(element.getStyle("width")) / 2 + "px"}, {src: "resource/turismo/loading66.gif", border: "1"});
			element.add(imageLoading);
			
			var functionGrabar2 = qx.lang.Function.bind(function() {
				for (var x in json.producto) {
					//json.producto[x].cod = encodeURIComponent(producto[x].cod.getValue());
					json.producto[x].cod = producto[x].cod.getTableModel().getDataAsMapArray();
				}
				
				var p = {};
				p.id_proforma = id_proforma;
				p.model = qx.util.Serializer.toNativeObject(modelForm);
				p.model.json = json;
				
				//alert(qx.lang.Json.stringify(p, null, 2));
				
				var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Proforma");
				try {
					var resultado = rpc.callSync("generar_presupuesto", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				blocker.unblock();
				
				this.fireDataEvent("aceptado", id_proforma);
	
				application.windowGenerarPresupuesto = null;
				
				this.destroy();
			}, this);
			
			
			
			
			if (filePresupuesto == null) {
				functionGrabar2();
				
			} else {
				var stateListenerId = filePresupuesto.addListener("changeState", function(e) {
					var state = e.getData();
			
					if (state == "uploaded") {
						var response = qx.lang.Json.parse(filePresupuesto.getResponse());
						if (response.success) {
							functionGrabar2();
						} else {
							alert(filePresupuesto.getResponse());
						}
					} else {
						//alert(state);
					}
			
					if (state == "uploaded" || state == "cancelled") filePresupuesto.removeListenerById(stateListenerId);
				}, this);
				
				uploader.setAutoUpload(true);
			}
		}
	}, this);
	
	
	var functionGrabar2 = qx.lang.Function.bind(function() {

	}, this);
	
	
	
	
	var gpbNueva = new qx.ui.groupbox.GroupBox(" Localizadores ");
	gpbNueva.setLayout(new qx.ui.layout.Grow());
	this.add(gpbNueva, {left: 0, top: 90, right: 0, bottom: 0});
	
	var containerScroll = new qx.ui.container.Scroll();
	gpbNueva.add(containerScroll);
	
	var containerCodigos = new qx.ui.container.Composite(new qx.ui.layout.Grid(6, 6));
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
	
	var txtPFDolar = new qx.ui.form.Spinner();
	txtPFDolar.setNumberFormat(numberformatMonto);
	txtPFDolar.getChildControl("upbutton").setVisibility("excluded");
	txtPFDolar.getChildControl("downbutton").setVisibility("excluded");
	txtPFDolar.setSingleStep(0);
	txtPFDolar.setPageStep(0);
	form.add(txtPFDolar, "P.F.Dolar", null, "pfdolar", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 4}});
	
	var txtCotdolar = new qx.ui.form.Spinner();
	txtCotdolar.setNumberFormat(numberformatMonto);
	txtCotdolar.getChildControl("upbutton").setVisibility("excluded");
	txtCotdolar.getChildControl("downbutton").setVisibility("excluded");
	txtCotdolar.setSingleStep(0);
	txtCotdolar.setPageStep(0);
	form.add(txtCotdolar, "Cotiza.", null, "cotdolar", null, {grupo: 1, item: {row: 1, column: 6, colSpan: 4}});
	
	var txtPresupuesto = new qx.ui.form.TextField("");
	//txtPresupuesto.setRequired(true);
	txtPresupuesto.setReadOnly(true);
	form.add(txtPresupuesto, "Presupuesto", null, "archivo", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 9}});
	

	
	
	
	
	/*
	var fileSelector = document.createElement('input');
	fileSelector.setAttribute('type', 'file');
	fileSelector.addEventListener("change", function(e){
		txtPresupuesto.setValue(fileSelector.files[0].name);
	});
	
	
	var btnSeleccionarPresupuesto = new qx.ui.form.Button("Seleccionar...");
	btnSeleccionarPresupuesto.addListener("execute", function(e){
 		fileSelector.click();
	})
	*/
	
	var btnSeleccionarPresupuesto = new com.zenesis.qx.upload.UploadButton("Seleccionar...");
	this.add(btnSeleccionarPresupuesto, {left: 370, top: 54});
	
	
	var uploader = new com.zenesis.qx.upload.UploadMgr(btnSeleccionarPresupuesto, "UploadMgr/server/php.php");
	uploader.setAutoUpload(false);
	uploader.addListener("addFile", function(e) {
		var data = e.getData();
		
		if (filePresupuesto != null) uploader.cancel(filePresupuesto);
        filePresupuesto = data;
        txtPresupuesto.setValue(filePresupuesto.getFilename());
	}, this);
	
	
	
	
	
		// Menu de contexto
	
	var menuContactar = new componente.comp.ui.ramon.menu.Menu();
	
	var commandNuevoContactar = new qx.ui.core.Command("Insert");
	commandNuevoContactar.setEnabled(false);
	commandNuevoContactar.addListener("execute", function(e) {
		var win = new turismo.comp.windowProducto(null, tblFocus.getUserData("model"));
		win.addListener("aceptado", function(e){
			var data = e.getData();
			data.model.f_venc.setHours(parseInt(data.model.h_venc.substr(0, 2)), parseInt(data.model.h_venc.substr(3, 2)));
			//alert(qx.lang.Json.stringify(data, null, 2));
			data.model.json = data.otros;
			var tableModel = tblFocus.getTableModel();
			tableModel.addRowsAsMapArray([data.model], null, true);
			tblFocus.setFocusedCell(0, tableModel.getRowCount() - 1, true);
			tblFocus.focus();
		});
		
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnNuevoContactar = new qx.ui.menu.Button("Insertar localizador...", null, commandNuevoContactar);
	
	var commandModificarContactar = new qx.ui.core.Command("Enter");
	commandModificarContactar.setEnabled(false);
	commandModificarContactar.addListener("execute", function(e) {
		var focusedRow = tblFocus.getFocusedRow();
		var rowData = tblFocus.getTableModel().getRowDataAsMap(focusedRow);
		
		//alert(qx.lang.Json.stringify(rowData, null, 2));

		var win = new turismo.comp.windowProducto(rowData, tblFocus.getUserData("model"));
		win.addListener("aceptado", function(e){
			var data = e.getData();
			data.model.f_venc.setHours(parseInt(data.model.h_venc.substr(0, 2)), parseInt(data.model.h_venc.substr(3, 2)));
			//alert(qx.lang.Json.stringify(data, null, 2));
			data.model.json = data.otros;
			var tableModel = tblFocus.getTableModel();
			tableModel.setRowsAsMapArray([data.model], focusedRow, true);
			tblFocus.focus();
		});
		
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var btnModificarContactar = new qx.ui.menu.Button("Modificar localizador...", null, commandModificarContactar);
	
	var btnEliminarContactar = new qx.ui.menu.Button("Eliminar");
	btnEliminarContactar.setEnabled(false);
	btnEliminarContactar.addListener("execute", function(e) {
		var tbl = tblFocus;
		var tableModel = tbl.getTableModel();
		var focusedRow = tbl.getFocusedRow();
		tbl.blur();
		tbl.setFocusedCell();
		tableModel.removeRows(focusedRow, 1);
		var rowCount = tableModel.getRowCount();
		if (rowCount > 0) tbl.setFocusedCell(0, ((focusedRow > rowCount - 1) ? rowCount - 1 : focusedRow), true);
		tbl.focus();
	});
	
	menuContactar.add(btnNuevoContactar);
	menuContactar.add(btnModificarContactar);
	menuContactar.addSeparator();
	menuContactar.add(btnEliminarContactar);
	menuContactar.memorizar();
	
	
	var decoration = new qx.ui.decoration.Decorator();
	decoration.setWidth(1, 1, 1, 1);
	decoration.setStyle("solid", "solid", "solid", "solid");
	decoration.setColor("border-focused", "border-focused", "border-focused", "border-focused");
	
	
	
	var txt;
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
	var contador = 0;
	for (var x in json.producto) {
		var txt = new qx.ui.form.TextArea(decodeURIComponent(json.producto[x].txt));
		txt.setWidth(220);
		txt.setReadOnly(true);
		containerCodigos.add(new qx.ui.basic.Label(producto[x].label + ":"), {row: contador, column: 0});
		containerCodigos.add(txt, {row: contador, column: 1});
		//form.add(txt, producto[x].label, null, "dummy", null, {grupo: 2, item: {row: contador + 3, column: 1, colSpan: 11}});
		producto[x].txt = txt;
		
		/*
		var txt = new qx.ui.form.TextArea("");
		txt.setMaxHeight(60);
		txt.addListener("blur", function(e){
			var target = e.getTarget();
			target.setValue(target.getValue().trim());
		});
		form.add(txt, "", null, null, null, {grupo: 2, item: {row: contador + 3, column: 13, colSpan: 11}});
		producto[x].cod = txt;
		*/
		
		
		
		
		

	
	
	
		
		//Tabla
		
		var tableModel = new qx.ui.table.model.Simple();
		tableModel.setColumns(["Localizador", "Descripción", "Venc.", "Precio", "Cotiza", "Comisión"], ["localizador", "descrip", "f_venc", "precio", "cotiza", "comision"]);
		tableModel.setColumnSortable(0, false);
		tableModel.setColumnSortable(1, false);
		tableModel.setColumnSortable(2, false);
		tableModel.setColumnSortable(3, false);
		tableModel.setColumnSortable(4, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};

		var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.setWidth(830);
		tbl.setHeight(150);
		tbl.setUserData("model", x);
		tbl.setShowCellFocusIndicator(false);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleStatusBarVisible();
		tbl.setContextMenu(menuContactar);
		tbl.modo="comun";
		
		
		
		tbl.addListener("cellDblclick", function(e){
			commandModificarContactar.execute();
		});
		
		tbl.addListener("focus", function(e){
			tblFocus = this;
						
			tblFocus.setDecorator(decoration);
			
			commandNuevoContactar.setEnabled(true);
			
			var tableModel = tblFocus.getTableModel();
			if (tableModel.getRowCount() > 0) {
				var focusedRow = tblFocus.getFocusedRow();
				if (focusedRow != null) {
					tblFocus.getSelectionModel().setSelectionInterval(focusedRow, focusedRow);
				}
			}
		});
		
		tbl.addListener("blur", function(e){
			tblFocus.resetDecorator();
			tblFocus.resetSelection();
			
			commandNuevoContactar.setEnabled(false);
		});
		
		tbl.addListener("dataEdited", function(e){
			/*
			var data = e.getData();
			if (data.col == 1) {
				var rowData = tableModelContactar.getRowDataAsMap(data.row);
				rowData.descrip = rowData.descrip.trim();
				tableModelContactar.setRowsAsMapArray([rowData], data.row, true);
			}
			*/
		});

		
		var tableColumnModel = tbl.getTableColumnModel();
		var resizeBehavior = tableColumnModel.getBehavior();
		resizeBehavior.set(0, {width:"20%", minWidth:100});
		resizeBehavior.set(1, {width:"34%", minWidth:100});
		resizeBehavior.set(2, {width:"13%", minWidth:100});
		resizeBehavior.set(3, {width:"11%", minWidth:100});
		resizeBehavior.set(4, {width:"11%", minWidth:100});
		resizeBehavior.set(5, {width:"11%", minWidth:100});
		
		
		var cellrendererNumber = new qx.ui.table.cellrenderer.Number();
		cellrendererNumber.setNumberFormat(numberformatMonto);
		tableColumnModel.setDataCellRenderer(3, cellrendererNumber);
		tableColumnModel.setDataCellRenderer(4, cellrendererNumber);
		tableColumnModel.setDataCellRenderer(5, cellrendererNumber);
		
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/y HH:mm"));
		tableColumnModel.setDataCellRenderer(2, cellrendererDate);

		
		var celleditorString = new qx.ui.table.celleditor.TextField();
		celleditorString.setValidationFunction(function(newValue, oldValue){
			return newValue.trim();
		});
		tableColumnModel.setCellEditorFactory(0, celleditorString);
		tableColumnModel.setCellEditorFactory(1, celleditorString);
		
		
		var celleditorNumber = new qx.ui.table.celleditor.TextField();
		celleditorNumber.setValidationFunction(function(newValue, oldValue){
			newValue = newValue.trim();
			if (newValue == "") return oldValue;
			else if (isNaN(newValue)) return oldValue; else return newValue;
		});

		tableColumnModel.setCellEditorFactory(3, celleditorNumber);
		tableColumnModel.setCellEditorFactory(4, celleditorNumber);
		tableColumnModel.setCellEditorFactory(5, celleditorNumber);
		

		var selectionModel = tbl.getSelectionModel();
		selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModel.addListener("changeSelection", function(){
			var bool = ! this.isSelectionEmpty();
			commandModificarContactar.setEnabled(bool);
			btnEliminarContactar.setEnabled(bool);
		});
		
		

		//gpbNueva.add(new qx.ui.basic.Label("Contactar por:"), {left: 0, top: 420});
		containerCodigos.add(tbl, {row: contador, column: 3});
		
		producto[x].cod = tbl;
		
		
		contador = contador + 1;
	}
	
	
	
	var btnAceptar = new qx.ui.form.Button("Generar presupuesto");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var bandera = true;
			for (var x in json.producto) {
				if (producto[x].cod.getTableModel().getRowCount() == 0) {
					bandera = false;
					break;
				}
			}
			if (! bandera) {
				(new dialog.Confirm({
				        "message"   : "Hay productos sin localizador asignado. Desea continuar?",
				        "callback"  : functionGrabar,
				        "context"   : this,
				        "image"     : "icon/48/status/dialog-warning.png"
				})).show();
			} else {
				functionGrabar(bandera);
			}
		} else {
			try {
				form.getValidationManager().getInvalidFormItems()[0].focus();
			} catch (ex) {
				btnSeleccionarPresupuesto.focus();
			}
		}
	}, this);

	//form.addButton(btnAceptar, {grupo: 2, item: {row: 12, column: 1, colSpan: 3}});
	this.add(btnAceptar, {right: 0, top: 27});
	
	var controllerForm = new qx.data.controller.Form(null, form);
	var modelForm = controllerForm.createModel();
	
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 1);
	this.add(formView, {left: 0, top: 0});
	//var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 2);
	//this.add(formView, {left: 0, top: 90});
	//this.add(new qx.ui.basic.Label("Códigos:"), {left: 370, top: 90});
	
	
	cboUsuario.setTabIndex(1);
	txtContrasena.setTabIndex(2);
	txtPFDolar.setTabIndex(3);
	txtCotdolar.setTabIndex(4);
	txtPresupuesto.setTabIndex(5);
	btnSeleccionarPresupuesto.setTabIndex(6);
	
	

	var contador = 0;
	for (var x in json.producto) {
		producto[x].txt.setTabIndex(contador + 7);
		producto[x].cod.setTabIndex(contador + 8);
		
		contador = contador + 2
	}
	
	btnAceptar.setTabIndex(40);
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});