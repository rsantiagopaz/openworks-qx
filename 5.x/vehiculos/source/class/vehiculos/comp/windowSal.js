qx.Class.define("vehiculos.comp.windowSal",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (vehiculo, rowDataEntSal)
	{
	this.base(arguments);
	
	this.set({
		caption: "Salida",
		width: 300,
		height: 250,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());

	this.addListenerOnce("appear", function(e){
		this.setCaption("Salida, " + vehiculo.nro_patente + "  " + vehiculo.marca);
		txtResp_sal.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var form = new qx.ui.form.Form();
	
	var txtResp_sal = new qx.ui.form.TextField("");
	txtResp_sal.setMinWidth(200);
	form.add(txtResp_sal, "Responsable", null, "resp_sal");
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	//var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 10);
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		var p = {};
		p.id_vehiculo = vehiculo.id_vehiculo;
		p.id_entsal = rowDataEntSal.id_entsal;
		p.resp_sal = txtResp_sal.getValue();
		p.entsal_estado = rowDataEntSal.estado;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
		rpc.addListener("completed", function(e){
			btnCancelar.execute();
			
			this.fireDataEvent("aceptado");
		}, this);
		rpc.addListener("failed", function(e){
			btnCancelar.execute();
			
			this.fireDataEvent("estado");
		}, this);
		rpc.callAsyncListeners(true, "salida_vehiculo", p);

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
		"estado": "qx.event.type.Event"
	}
});