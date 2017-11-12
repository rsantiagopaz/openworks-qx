qx.Class.define("sacdiag.comp.windowABMprestadores",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Nuevo prestador",
		width: 440,
		height: 500,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		lstChofer.fireDataEvent("changeSelection", []);
		cboChofer.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	
	var cboChofer = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Chofer", methodName: "autocompletarChoferCompleto"});
	cboChofer.setWidth(250);
	var lstChofer = cboChofer.getChildControl("list");
	lstChofer.addListener("changeSelection", function(e){
		var datos, modelForm;
		
		txtApenom.setValid(true);
		
		if (lstChofer.isSelectionEmpty()) {
			this.setCaption("Nuevo prestador");
			
			datos = {id_chofer: "0", dni: "", apenom: "", email: "", telefono: "", cboDependencia: "", organismo_area_id: null, licencia_oficial: "S", id_tipo: "1", id_categoria: "1", f_emision: null, f_vencimiento: null};
		} else {
			this.setCaption("Modificar prestador");
			datos = lstChofer.getSelection()[0].getUserData("datos");
			datos.chofer.cboDependencia = "";
			
			if (datos.cboDependencia == null) {
				cboDependencia.removeAll();
				cboDependencia.setValue("");
			} else {
				cboDependencia.add(new qx.ui.form.ListItem(datos.cboDependencia.label, null, datos.cboDependencia.model));
			}
			
			datos = datos.chofer;
		}
		
		modelForm = qx.data.marshal.Json.createModel(datos, true);
		controllerForm.setModel(modelForm);
	}, this);
	
	this.add(new qx.ui.basic.Label("Buscar:"), {left: 0, top: 3});
	this.add(cboChofer, {left: 84, top: 0});
	cboChofer.setTabIndex(1);
	
	var lblLinea = new qx.ui.basic.Label("<hr>");
	lblLinea.setRich(true);
	lblLinea.setWidth(500);
	this.add(lblLinea, {left: 0, top: 22, right: 0});
	
	
	
	
	
	
	var form = new qx.ui.form.Form();
	
	var txtApenom = new qx.ui.form.TextField();
	txtApenom.setRequired(true);
	txtApenom.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	form.add(txtApenom, "Ape.y Nom.", null, "apenom", null, {item: {row: 2, column: 1, colSpan: 10}});

	
	aux = new qx.ui.form.TextField();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	form.add(aux, "E-mail", null, "email", null, {item: {row: 3, column: 1, colSpan: 6}});
	
	
	aux = new qx.ui.form.TextField();
	aux.addListener("blur", function(e){
		var value = this.getValue();
		this.setValue((value == null) ? "" : value.trim());
	});
	form.add(aux, "Teléfono", null, "telefono", null, {item: {row: 4, column: 1, colSpan: 6}});
	
	
	
	



	

	var controllerForm = new qx.data.controller.Form(null, form);
	//modelForm = controllerForm.createModel(true);
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 30, 30);
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 45});
	
	
	
	var validationManager = form.getValidationManager();
	validationManager.setValidator(new qx.ui.form.validation.AsyncValidator(
		function(items, validator) {
			if (validationManager.getInvalidFormItems().length == 0){
				var p = {};
				p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
	
				var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Chofer");
				rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id) {
					if (error == null) {
						validator.setValid(true);
					} else {
						if (error.message == "personal") {
							txtDni.setInvalidMessage("DNI ingresado no es parte de personal");
							txtDni.setValid(false);
						} else if (error.message == "dni") {
							txtDni.setInvalidMessage("DNI duplicado");
							txtDni.setValid(false);
						} else if (error.message == "apenom") {
							txtApenom.setInvalidMessage("Ape.y Nom duplicado");
							txtApenom.setValid(false);
						}
						
						validator.setValid(false);
					}
				}, this), "alta_modifica_chofer", p);
			} else validator.setValid(false);
		}
	));
	
	validationManager.addListener("complete", function(e){
		if (validationManager.getValid()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.getModel());
			
			if (p.model.id_chofer == "0") {
				lstChofer.fireDataEvent("changeSelection", []);
				txtDni.focus();
			} else {
				cboChofer.setValue("");
				lstChofer.removeAll();
				cboChofer.focus();
			}
		} else {
			validationManager.getInvalidFormItems()[0].focus();
		}
	});
	
	
	
	var btnAceptar = new qx.ui.form.Button("Grabar");
	btnAceptar.addListener("execute", function(e){
		form.validate();
	});
	
	var btnCancelar = new qx.ui.form.Button("Cerrar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "25%", bottom: 0});
	this.add(btnCancelar, {right: "25%", bottom: 0});
	
	btnAceptar.setTabIndex(20);
	btnCancelar.setTabIndex(21);
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});