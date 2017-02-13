qx.Class.define("turismo.comp.windowProducto",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (parametRowData, parametProducto)
	{
	this.base(arguments);
	
		this.set({
			caption: "Producto",
			width: 900,
			height: 500,
			showMinimize: false,
			showMaximize: false
		});
		
		this.setLayout(new qx.ui.layout.Canvas());
		this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		slbProducto.focus();
		if (parametProducto != null) {
			txtLocalizador.focus();
			txtLocalizador.selectAllText();
		}
	});
	
	
	
	var application = qx.core.Init.getApplication();
	
	var regexpHora = new RegExp(/^((0[0-9]|1\d|2[0-3]|[0-9])(:|.)([0-5]\d)){1}$/);
	
	
	var numberformatMontoEs = new qx.util.format.NumberFormat("es");
	numberformatMontoEs.setGroupingUsed(false);
	numberformatMontoEs.setMaximumFractionDigits(2);
	numberformatMontoEs.setMinimumFractionDigits(2);
	
	var numberformatMontoEn = new qx.util.format.NumberFormat("en");
	numberformatMontoEn.setGroupingUsed(false);
	numberformatMontoEn.setMaximumFractionDigits(2);
	numberformatMontoEn.setMinimumFractionDigits(2);
	
	
	
	
	var commandCerrar = new qx.ui.command.Command("Esc");
	commandCerrar.addListener("execute", function(e) {
		btnCancelar.execute();
	});
	this.registrarCommand(commandCerrar);
	
	
	
	var stackDatoProducto = new turismo.comp.stackDatoProducto();
	
	var formItem;
	var form = new qx.ui.form.Form();
	
	var slbProducto = new qx.ui.form.SelectBox();
	slbProducto.add(new qx.ui.form.ListItem("Aéreo", null, "0"));
	slbProducto.add(new qx.ui.form.ListItem("Hoteles", null, "1"));
	slbProducto.add(new qx.ui.form.ListItem("Autos", null, "2"));
	slbProducto.add(new qx.ui.form.ListItem("Seguros", null, "3"));
	slbProducto.add(new qx.ui.form.ListItem("Cruceros", null, "4"));
	slbProducto.add(new qx.ui.form.ListItem("Paquetes", null, "5"));
	slbProducto.add(new qx.ui.form.ListItem("Trenes", null, "6"));
	slbProducto.add(new qx.ui.form.ListItem("Traslado", null, "7"));
	slbProducto.add(new qx.ui.form.ListItem("Excursiones", null, "8"));
	slbProducto.add(new qx.ui.form.ListItem("Servicios", null, "9"));
	slbProducto.addListener("changeSelection", function(e){
		var model = e.getData()[0].getModel();

		//txtComision.setValue(application.rowParamet.comision[model]);
		if (stackDatoProducto.datos[model]) {
			stackDatoProducto.setVisibility("visible");
			stackDatoProducto.setSelection([stackDatoProducto.datos[model].stack]);
		} else {
			stackDatoProducto.setVisibility("hidden");
		}
	});
	form.add(slbProducto, "Producto", null, "producto", null, {grupo: 1, item: {row: 0, column: 1, colSpan: 4}});
	
	
	var txtLocalizador = new qx.ui.form.TextField("");
	txtLocalizador.setRequired(true);
	form.add(txtLocalizador, "Localizador", null, "localizador", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 7}});
	
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	form.add(txtDescrip, "Descripción", null, "descrip", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 7}});
	
	
	var txtFven = new qx.ui.form.DateField();
	txtFven.setRequired(true);
	txtFven.addListener("changeValue", function(e){
		//txtFven.focus();
	});
	form.add(txtFven, "Fecha venc.", null, "f_venc", null, {grupo: 1, item: {row: 4, column: 1, colSpan: 4}});
	
	var txtHven = new qx.ui.form.TextField("00:00");
	txtHven.setRequired(true);
	txtHven.setPlaceholder("00:00");
	txtHven.addListener("blur", function(e){
		var value = txtHven.getValue();
		if (regexpHora.test(value)) {
			value = qx.lang.String.pad(value, 5, "0");
			value = value.replace(".", ":");
			value = value.replace(" ", ":");
		} else {
			value = "";
		}
		txtHven.setValue(value);
	});
	form.add(txtHven, "", null, "h_venc", null, {grupo: 1, item: {row: 4, column: 6, colSpan: 2}});
	
	
	var txtPrecio = new qx.ui.form.Spinner(0, 0, 1000000);
	txtPrecio.setRequired(true);
	txtPrecio.getChildControl("upbutton").setVisibility("excluded");
	txtPrecio.getChildControl("downbutton").setVisibility("excluded");
	txtPrecio.setSingleStep(0);
	txtPrecio.setPageStep(0);
	txtPrecio.setNumberFormat(numberformatMontoEn);
	form.add(txtPrecio, "Precio", function(value) {
		if (value <= 0) throw new qx.core.ValidationError("Validation Error", "Debe ingresar valor mayor a 0");
	}, "precio", null, {grupo: 1, item: {row: 6, column: 1, colSpan: 3}});
	
	
	var txtCotiza = new qx.ui.form.Spinner(0, 0, 1000000);
	txtCotiza.getChildControl("upbutton").setVisibility("excluded");
	txtCotiza.getChildControl("downbutton").setVisibility("excluded");
	txtCotiza.setSingleStep(0);
	txtCotiza.setPageStep(0);
	txtCotiza.setNumberFormat(numberformatMontoEn);
	form.add(txtCotiza, "Cotiza", null, "cotiza", null, {grupo: 1, item: {row: 7, column: 1, colSpan: 3}});
	
	
	var txtComision = new qx.ui.form.Spinner(0, 0, 1000000);
	txtComision.getChildControl("upbutton").setVisibility("excluded");
	txtComision.getChildControl("downbutton").setVisibility("excluded");
	txtComision.setSingleStep(0);
	txtComision.setPageStep(0);
	txtComision.setNumberFormat(numberformatMontoEn);
	form.add(txtComision, "Comisión", null, "comision", null, {grupo: 1, item: {row: 8, column: 1, colSpan: 3}});
	
	var txtPercepcion = new qx.ui.form.Spinner(0, 0, 1000000);
	txtPercepcion.getChildControl("upbutton").setVisibility("excluded");
	txtPercepcion.getChildControl("downbutton").setVisibility("excluded");
	txtPercepcion.setSingleStep(0);
	txtPercepcion.setPageStep(0);
	txtPercepcion.setNumberFormat(numberformatMontoEn);
	form.add(txtPercepcion, "Percepción", null, "percepcion", null, {grupo: 1, item: {row: 10, column: 1, colSpan: 3}});
	
	var txtCGestion = new qx.ui.form.Spinner(0, 0, 1000000);
	txtCGestion.getChildControl("upbutton").setVisibility("excluded");
	txtCGestion.getChildControl("downbutton").setVisibility("excluded");
	txtCGestion.setSingleStep(0);
	txtCGestion.setPageStep(0);
	txtCGestion.setNumberFormat(numberformatMontoEn);
	form.add(txtCGestion, "Cargo gestión", null, "cargo_gestion", null, {grupo: 1, item: {row: 11, column: 1, colSpan: 3}});
	
	var txtPrecioneto = new qx.ui.form.Spinner(0, 0, 1000000);
	txtPrecioneto.setRequired(true);
	txtPrecioneto.getChildControl("upbutton").setVisibility("excluded");
	txtPrecioneto.getChildControl("downbutton").setVisibility("excluded");
	txtPrecioneto.setSingleStep(0);
	txtPrecioneto.setPageStep(0);
	txtPrecioneto.setNumberFormat(numberformatMontoEn);
	form.add(txtPrecioneto, "Precio neto", function(value) {
		if (value <= 0) throw new qx.core.ValidationError("Validation Error", "Debe ingresar valor mayor a 0");
	}, "precio_neto", null, {grupo: 1, item: {row: 12, column: 1, colSpan: 3}});
	
	var txtPolcancelacion = new qx.ui.form.TextArea("");
	form.add(txtPolcancelacion, "Pol.cancela.", null, "politica_cancela", null, {grupo: 1, item: {row: 13, column: 1, colSpan: 7}});
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	var modelForm;
	
	if (parametProducto == null) {
		//txtComision.setValue(application.rowParamet.comision["0"]);
	} else {
		slbProducto.setModelSelection([parametProducto]);
		//txtComision.setValue(application.rowParamet.comision[parametProducto]);
		slbProducto.setEnabled(false);
	}
	
	if (parametRowData == null) {
		this.setCaption("Insertar localizador");
		
		modelForm = controllerForm.createModel();
	} else {
		this.setCaption("Modificar localizador");
		
		parametRowData.h_venc = qx.lang.String.pad(String(parametRowData.f_venc.getHours()), 2, "0") + ":" + qx.lang.String.pad(String(parametRowData.f_venc.getMinutes()), 2, "0");
		
		modelForm = qx.data.marshal.Json.createModel(parametRowData);
		controllerForm.setModel(modelForm);
		
		if (stackDatoProducto.datos[parametProducto] != null) {
			modelForm = qx.data.marshal.Json.createModel(parametRowData.json);
			stackDatoProducto.datos[parametProducto].controller.setModel(modelForm);
		}
	}
	

	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 10, 20, 1);
	//formView.getLayout().getCellWidget(4, 5).setValue(" <span style='color:red'>*</span> ");
	formView.getLayout().getCellWidget(4, 5).setValue("");
	
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	
	var gpb = new qx.ui.groupbox.GroupBox("Otros datos");
	gpb.setLayout(new qx.ui.layout.Grow());
	
	gpb.add(stackDatoProducto);
	
	this.add(gpb, {left: 300, top: 0});
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var modelSelection = slbProducto.getModelSelection().getItem(0);
			
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.createModel());
			if (stackDatoProducto.datos[modelSelection]==null)
				p.otros = {};
			else
				p.otros = qx.util.Serializer.toNativeObject(stackDatoProducto.datos[modelSelection].controller.createModel());
				
			this.fireDataEvent("aceptado", p);
			
			this.destroy();
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);

	this.add(btnAceptar, {left: "30%", bottom: 0});
	this.add(btnCancelar, {right: "30%", bottom: 0});
	

	
	slbProducto.setTabIndex(1);
	txtLocalizador.setTabIndex(2);
	txtDescrip.setTabIndex(3);
	txtFven.setTabIndex(4);
	txtHven.setTabIndex(5);
	txtPrecio.setTabIndex(6);
	txtCotiza.setTabIndex(7);
	txtComision.setTabIndex(8);
	txtPercepcion.setTabIndex(9);
	txtCGestion.setTabIndex(10);
	txtPrecioneto.setTabIndex(11);
	txtPolcancelacion.setTabIndex(12);

	stackDatoProducto.arreglarTabIndex(13);

	btnAceptar.setTabIndex(90);
	btnCancelar.setTabIndex(91);

	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});