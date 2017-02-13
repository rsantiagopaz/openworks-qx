qx.Class.define("turismo.comp.windowPago",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (totalSeleccionado, tipo)
	{
	this.base(arguments);
	
		this.set({
			caption: ((tipo == "C") ? "Pago cliente" : "Pago proveedor"),
			width: 500,
			height: 350,
			showMinimize: false,
			showMaximize: false
		});
		
		this.setLayout(new qx.ui.layout.Canvas());
		this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		cboUsuario.focus();
	});
	
	
	
	var application = qx.core.Init.getApplication();
	
	
	var numberformatMontoEs = new qx.util.format.NumberFormat("es");
	numberformatMontoEs.setGroupingUsed(false);
	numberformatMontoEs.setMaximumFractionDigits(2);
	numberformatMontoEs.setMinimumFractionDigits(2);
	
	var numberformatMontoEn = new qx.util.format.NumberFormat("en");
	numberformatMontoEn.setGroupingUsed(false);
	numberformatMontoEn.setMaximumFractionDigits(2);
	numberformatMontoEn.setMinimumFractionDigits(2);
	
	
	
	var commandCerrar = new qx.ui.core.Command("Esc");
	commandCerrar.addListener("execute", function(e) {
		btnCancelar.execute();
	});
	this.registrarCommand(commandCerrar);
	
	
	
	
	this.add(new qx.ui.basic.Label("Total seleccionado: " + numberformatMontoEs.format(totalSeleccionado)), {left: 0, top: 0});
	
	var form = new qx.ui.form.Form();
	
	var cboUsuario = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Proforma", "autocompletarUsuario", null, 1);
	cboUsuario.setRequired(true);
	form.add(cboUsuario, "Usuario", function(value) {
		if (lstUsuario.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar usuario");
	}, "usuario", null, {grupo: 10, item: {row: 0, column: 1, colSpan: 4}});
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
	}, "password", null, {grupo: 10, item: {row: 0, column: 6, colSpan: 4}});
	
	
	var txtImporte = new qx.ui.form.Spinner(0, 0, 1000000);
	txtImporte.getChildControl("upbutton").setVisibility("excluded");
	txtImporte.getChildControl("downbutton").setVisibility("excluded");
	txtImporte.setSingleStep(0);
	txtImporte.setPageStep(0);
	txtImporte.setRequired(true);
	txtImporte.setNumberFormat(numberformatMontoEn);
	txtImporte.addListener("focus", function(e){
		txtImporte.getChildControl("textfield").selectAllText();
	})
	form.add(txtImporte, "Importe", function(value) {
		if (txtImporte.getValue() <= 0) {
			throw new qx.core.ValidationError("Validation Error", "Debe ingresar importe");
		} else if (txtImporte.getValue() > totalSeleccionado) {
			throw new qx.core.ValidationError("Validation Error", "El importe no debe superar el Total seleccionado");
		}
	}, "importe", null, {grupo: 10, item: {row: 2, column: 1, colSpan: 4}});
	
	
	
	var slbPago = new qx.ui.form.SelectBox();
	slbPago.add(new qx.ui.form.ListItem("Efectivo", null, "E"));
	slbPago.add(new qx.ui.form.ListItem("Tarjeta crédito", null, "C"));
	slbPago.add(new qx.ui.form.ListItem("Tarjeta débito", null, "D"));
	slbPago.add(new qx.ui.form.ListItem("Cheque", null, "Q"));
	slbPago.add(new qx.ui.form.ListItem("Transferencia", null, "T"));
	slbPago.addListener("changeSelection", function(e){
		var model = e.getData()[0].getModel();
		gpb.setVisibility((model == "E") ? "hidden" : "visible");
		gpb.setLegend(e.getData()[0].getLabel());
		if (model == "E") {
			stack.setSelection([stack.getChildren()[0]]);	
		} else if (model == "C" || model == "D") {
			stack.setSelection([stack.getChildren()[1]]);
		} else if (model == "Q") {
			stack.setSelection([stack.getChildren()[2]]);
		} else if (model == "T") {
			stack.setSelection([stack.getChildren()[3]]);
		}
	})
	form.add(slbPago, "Tipo pago", null, "tipo_pago", null, {grupo: 10, item: {row: 3, column: 1, colSpan: 4}});
	
	

	var txtTarjeta = new qx.ui.form.TextField("");
	form.add(txtTarjeta, "Nombre", null, "tarjeta_nombre", null, {grupo: 2, item: {row: 0, column: 1, colSpan: 7}});
	
	var txtCant_cuotas = new qx.ui.form.Spinner();
	txtCant_cuotas.getChildControl("upbutton").setVisibility("excluded");
	txtCant_cuotas.getChildControl("downbutton").setVisibility("excluded");
	txtCant_cuotas.setSingleStep(0);
	txtCant_cuotas.setPageStep(0);
	form.add(txtCant_cuotas, "Cant.cuotas", null, "tarjeta_cant_cuotas", null, {grupo: 2, item: {row: 1, column: 1, colSpan: 4}});
	
	var txtNro_cupon = new qx.ui.form.TextField("");
	form.add(txtNro_cupon, "Nro.cupón", null, "tarjeta_nro_cupon", null, {grupo: 2, item: {row: 2, column: 1, colSpan: 4}});
	
	var txtNro_autorizacion = new qx.ui.form.TextField("");
	form.add(txtNro_autorizacion, "Nro.autorizacion", null, "tarjeta_nro_autorizacion", null, {grupo: 2, item: {row: 3, column: 1, colSpan: 4}});
	
	var txtChequenro = new qx.ui.form.TextField("");
	form.add(txtChequenro, "Nro.", null, "cheque_nro", null, {grupo: 3, item: {row: 0, column: 1, colSpan: 4}});
	
	var txtFecha_cobro = new qx.ui.form.DateField();
	txtFecha_cobro.setValue(new Date);
	form.add(txtFecha_cobro, "Fecha cobro", null, "cheque_fecha_cobro", null, {grupo: 3, item: {row: 1, column: 1, colSpan: 4}});
	
	
	var txtBanco = new qx.ui.form.TextField("");
	form.add(txtBanco, "Banco", null, "transferencia_banco", null, {grupo: 4, item: {row: 0, column: 1, colSpan: 7}});
	
	var txtNro_operacion = new qx.ui.form.TextField("");
	form.add(txtNro_operacion, "Nro.operacion", null, "transferencia_nro_operacion", null, {grupo: 4, item: {row: 1, column: 1, colSpan: 4}});
	

	
	
	
	var controllerForm = new qx.data.controller.Form(null, form);
	//var modelForm = controllerForm.createModel();
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 10);
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 40});
	
	
	var gpb = new qx.ui.groupbox.GroupBox();
	gpb.setLayout(new qx.ui.layout.Grow());
	gpb.setVisibility("hidden");
	this.add(gpb, {left: 200, top: 95});
	
	var stack = new qx.ui.container.Stack();
	gpb.add(stack);
	
	
	formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 1);
	stack.add(formView);
	
	formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 2);
	stack.add(formView);
	
	formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 3);
	stack.add(formView);
	
	formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 4);
	stack.add(formView);
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var model = qx.util.Serializer.toNativeObject(controllerForm.createModel());
			this.fireDataEvent("aceptado", model);
			
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
	

	
	cboUsuario.setTabIndex(1);
	txtContrasena.setTabIndex(2);
	//slbTipo.setTabIndex(3);
	txtImporte.setTabIndex(4);
	slbPago.setTabIndex(5);
	txtTarjeta.setTabIndex(6);
	txtCant_cuotas.setTabIndex(7);
	txtNro_cupon.setTabIndex(8);
	txtNro_autorizacion.setTabIndex(9);
	txtChequenro.setTabIndex(10);
	txtFecha_cobro.setTabIndex(11);
	txtBanco.setTabIndex(12);
	txtNro_operacion.setTabIndex(13);
	btnAceptar.setTabIndex(16);
	btnCancelar.setTabIndex(17);

	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});