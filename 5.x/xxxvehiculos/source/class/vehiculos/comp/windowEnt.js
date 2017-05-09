qx.Class.define("vehiculos.comp.windowEnt",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (vehiculo)
	{
	this.base(arguments);
	
	this.set({
		caption: "Entrada",
		width: 400,
		height: 300,
		showMinimize: false,
		showMaximize: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		this.setCaption("Entrada, " + vehiculo.nro_patente + "  " + vehiculo.marca);
		txtResp_ent.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var form = new qx.ui.form.Form();
	
	var txtResp_ent = new qx.ui.form.TextField("");
	form.add(txtResp_ent, "Responsable", null, "resp_ent", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 11}});
	
	var txtKilo = new qx.ui.form.Spinner(0, 0, 1000000);
	//txtKilo.setRequired(true);
	//txtKilo.setWidth(80);
	txtKilo.setNumberFormat(application.numberformatEntero);
	txtKilo.getChildControl("upbutton").setVisibility("excluded");
	txtKilo.getChildControl("downbutton").setVisibility("excluded");
	txtKilo.setSingleStep(0);
	txtKilo.setPageStep(0);
	form.add(txtKilo, "Kilometraje", null, "kilo", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 4}});
	
	var txtObserva_ent = new qx.ui.form.TextArea("");
	txtObserva_ent.setRequired(true);
	txtObserva_ent.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	});
	form.add(txtObserva_ent, "Observaciones", null, "observa_ent", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 11, rowSpan: 15}});
	

	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 20, 20, 1);
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.id_vehiculo = vehiculo.id_vehiculo;
			p.resp_ent = txtResp_ent.getValue();
			p.kilo = txtKilo.getValue();
			p.observa = txtObserva_ent.getValue();
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
			rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id) {
				btnCancelar.execute();
				
				if (error) {
					this.fireDataEvent("actualizar");
				} else {
					this.fireDataEvent("aceptado", resultado);
				}
			}, this), "entrada_vehiculo", p);
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event",
		"actualizar": "qx.event.type.Event"
	}
});