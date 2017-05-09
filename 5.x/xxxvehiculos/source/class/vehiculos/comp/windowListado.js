qx.Class.define("vehiculos.comp.windowListado",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Listado",
		width: 300,
		height: 250,
		showMinimize: false,
		showMaximize: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		//txtResp_sal.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	

	var compositeFecha = new qx.ui.container.Composite(new qx.ui.layout.HBox(6).set({alignY: "middle"}));
	var dtfDesde = new qx.ui.form.DateField();
	var dtfHasta = new qx.ui.form.DateField();
	compositeFecha.add(new qx.ui.basic.Label("Desde:"));
	compositeFecha.add(dtfDesde);
	compositeFecha.add(new qx.ui.basic.Label("Hasta:"));
	compositeFecha.add(dtfHasta);
	
	this.add(compositeFecha, {left: 0, top: 50});
	
	
	var btnAceptar = new qx.ui.form.Button("Ver");
	btnAceptar.addListener("execute", function(e){
		var p = {};
		p.id_vehiculo = vehiculo.id_vehiculo;
		p.id_entsal = id_entsal;
		p.resp_sal = txtResp_sal.getValue();
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
		rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id) {
			btnCancelar.execute();
			
			if (error) {
				this.fireDataEvent("actualizar");
			} else {
				this.fireDataEvent("aceptado");
			
				window.open("services/class/comp/Impresion.php?rutina=salida_vehiculo&id_entsal=" + id_entsal);
			}
			
		}, this), "salida_vehiculo", p);
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cerrar");
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

	}
});