qx.Class.define("vehiculos.comp.windowSal",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (id_entsal)
	{
	this.base(arguments);
	
	this.set({
		caption: "Salida",
		width: 300,
		height: 250,
		showMinimize: false,
		showMaximize: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		this.setCaption("Salida, " + application.vehiculo.nro_patente + "  " + application.vehiculo.marca);
		txtResp_sal.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	var form = new qx.ui.form.Form();
	
	var txtResp_sal = new qx.ui.form.TextField("");
	form.add(txtResp_sal, "Responsable", null, "resp_sal");
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	//var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 12, 25, 10);
	var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		var p = {};
		p.id_vehiculo = application.vehiculo.id_vehiculo;
		p.id_entsal = id_entsal;
		p.resp_sal = txtResp_sal.getValue();
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
		rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id) {
			this.fireDataEvent("aceptado");
			
			window.open("services/class/comp/Impresion.php?rutina=salida_vehiculo&id_entsal=" + id_entsal);
			
			btnCancelar.execute();
		}, this), "salida_vehiculo", p);
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