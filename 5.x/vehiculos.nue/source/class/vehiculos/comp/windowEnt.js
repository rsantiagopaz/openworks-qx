qx.Class.define("vehiculos.comp.windowEnt",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Entrada",
		width: 400,
		height: 350,
		showMinimize: false,
		showMaximize: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		this.setCaption("Entrada, " + application.vehiculo.nro_patente + "  " + application.vehiculo.marca);
		txtResp_ent.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var form = new qx.ui.form.Form();
	
	var lst = new qx.ui.form.List();
	lst.setMaxHeight(100);
	form.add(lst, "Reparación", null, "reparacion", null, {grupo: 1, item: {row: 0, column: 1, colSpan: 11}});
	
	var txtResp_ent = new qx.ui.form.TextField("");
	form.add(txtResp_ent, "Responsable", null, "resp_ent", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 11}});
	
	var txtObserva_ent = new qx.ui.form.TextArea("");
	form.add(txtObserva_ent, "Observaciones", null, "observa_ent", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 11, rowSpan: 15}});
	

	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 20, 20, 1);
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		var p = {};
		p.id_vehiculo = application.vehiculo.id_vehiculo;
		p.resp_ent = txtResp_ent.getValue();
		p.observa = txtObserva_ent.getValue();
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
		rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id) {
			btnCancelar.execute();
			
			this.fireDataEvent("aceptado", resultado);
		}, this), "entrada_vehiculo", p);
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
		"aceptado": "qx.event.type.Event"
	}
});