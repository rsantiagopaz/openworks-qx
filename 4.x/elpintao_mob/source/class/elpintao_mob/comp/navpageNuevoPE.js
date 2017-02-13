qx.Class.define("elpintao_mob.comp.navpageNuevoPE",
{
  extend : qx.ui.mobile.page.NavigationPage,
  construct : function ()
  {
	this.base(arguments);

	this.setTitle("Nuevo pedido externo");

	this.application = qx.core.Init.getApplication();
  },
  members : 
  {
    _initialize : function()
	{
  	 	this.base(arguments);
  	 	
	this.addListenerOnce("appear", function() {
		var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.PedidosExt");
		rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id){
			if (resultado != null) {
				for (var x in this.fabrica) {
					if (this.fabrica[x].id_fabrica == resultado.id_fabrica) {
						this.slbFabrica.setSelection(parseInt(x));
						break;
					}
				}
				ingresos = resultado.ingresos;
				
				var p = {descrip: "", id_fabrica: resultado.id_fabrica};
				this.functionLeer_producto(p);
			}
		}, this), "leer_backup");
	}, this);
  	 	
 	 	
	var contexto = this;
	var ingresos = {};
	var bandera_cod_barra = false;
	var id_fabrica;
	var busyIndicator = null;
	var busypopup = null;
	var timerId = null;
	var rpcLeer_producto = null;
	
	this.functionLeer_producto = qx.lang.Function.bind(function(p) {
		if (busypopup == null) {
			busyIndicator = new qx.ui.mobile.dialog.BusyIndicator("Cargando...");
			busypopup = new qx.ui.mobile.dialog.Popup(busyIndicator);
			busypopup.show();
		}
		
        var timer = qx.util.TimerManager.getInstance();
        // check for the old listener
        if (timerId !== null) {
          // stop the old one
          timer.stop(timerId);
          if (rpcLeer_producto != null) rpcLeer_producto.abort(rpcLeer_producto);
          timerId = null;
        }
        // start a new listener to update the controller
		timerId = timer.start(function() {
			if (p.descrip.length < 3) p.descrip = "";
				
			rpcLeer_producto = new qx.io.remote.Rpc("services/", "elpintao_mob.Productos");
			rpcLeer_producto.addListener("completed", function(e){
				var resultado = e.getData().result;
				for (var x in resultado) resultado[x].mobile = {};
				
				list.setModel(new qx.data.Array(resultado));
				
				if (busypopup != null) busypopup.destroy();
				busypopup = null;
				rpcLeer_producto = null;
			});
			rpcLeer_producto.callAsyncListeners(true, "buscar_productos", p);
		
			timerId = null;
		}, 0, this, null, 200);
	}, this);

	
	
	
	
    var btnOpciones = new qx.ui.mobile.form.Button("Opciones");
    btnOpciones.addListener("tap", function() {
		dialogMenu.show();
    });
    
    this.getContent().add(new qx.ui.mobile.form.Group([btnOpciones]));
    
    var dialogMenu = this.dialogMenu = new qx.ui.mobile.dialog.Menu(new qx.data.Array(["Resumen pedido..."]), btnOpciones);
    dialogMenu.setTitle("Opciones");
    dialogMenu.addListener("changeSelection", function(e){
    	var data = e.getData();
    	dialogMenu.hide();
    	dialogMenu.setSelectedIndex(null);
    	if (data.index==0) {
			if (qx.lang.Json.stringify(ingresos) == "{}") {
				var dialogAlert = qx.ui.mobile.dialog.Manager.getInstance().alert("Atención", "Debe ingresar pedido en algún item.", function(index){
					this.application.desapilarHashChange(dialogAlert);
				}, this, "Aceptar");
				this.application.apilarHashChange(dialogAlert, qx.lang.Function.bind(function(){
					this.hide();
				}, dialogAlert));
				
				/*
				var dialogDialog = new qx.ui.mobile.dialog.Popup(new qx.ui.mobile.basic.Label());
				dialogDialog.setModal(true);
				dialogDialog.setTitle("No se ingresó ningun pedido.");
				
			    dialogDialog.addListener("appear", function(e){
					this.application.apilarHashChange(dialogDialog, qx.lang.Function.bind(function(){
						this.hide();
						this.destroy();
					}, dialogDialog));
				}, this);
				dialogDialog.show();
				*/
			} else {
				var npGenerado = new elpintao_mob.comp.navpageGenerado(ingresos, this);
				this.application.manager.addDetail(npGenerado);
				npGenerado.show();
			}    		
    	}
	}, this);
	
	
	
	 	var form = new qx.ui.mobile.form.Form();
		var slbFabrica = this.slbFabrica = new qx.ui.mobile.form.SelectBox();
		slbFabrica.addListener("changeSelection", function(e){
			var data = e.getData();

			ingresos = {};
			
			id_fabrica = this.fabrica[data.index].id_fabrica;
	
			var p = {descrip: txtFiltrar.getValue().trim(), id_fabrica: id_fabrica};
		
			this.functionLeer_producto(p);
		}, this);
		form.add(slbFabrica, "Fábrica:");
		
		
		
		var txtFiltrar = new qx.ui.mobile.form.TextField("");
		txtFiltrar.setLiveUpdate(true);
		txtFiltrar.addListener("keypress", function(e){
			var keyIdentifier = e.getKeyIdentifier();
			if (keyIdentifier == "Enter") {
				bandera_cod_barra = true;
				txtFiltrar.fireDataEvent("changeValue");
			}
		});
		txtFiltrar.addListener("changeValue", function(e){
			var texto = txtFiltrar.getValue().trim();

			if (texto.length >= 3 || texto.length == 0) {
				var p = {id_fabrica: id_fabrica};
				if (bandera_cod_barra) {
					p.cod_barra = texto;
				} else {
					p.descrip = texto;
				}
				
				this.functionLeer_producto(p);
			}

			bandera_cod_barra = false;
		}, this);
		form.add(txtFiltrar, "Filtrar:");
		
		var r = new qx.ui.mobile.form.renderer.Single(form);
		r.addCssClass("group");
	
		this.getContent().add(r);
		this.getContent().add(new qx.ui.mobile.form.Title("Productos"));
		
		var list = this.list = new qx.ui.mobile.list.List({
			configureItem : function(item, data, row) {
				item.setTitle(data.producto);
				if (qx.lang.Json.stringify(ingresos[data.id_producto]) == null) data.mobile.subtitle = ""; else data.mobile.subtitle = "Cargado";
				item.setSubtitle(data.mobile.subtitle);
				item.setSelectable(true);
				item.setShowArrow(true);
			}
		});
		list.addListener("changeSelection", function(e) {
			var data = e.getData();
			var item = list.getModel().getItem(data);
			
			var page = new elpintao_mob.comp.navpageNuevoPEItem(this, item, ingresos);
			page.addListener("aceptado", function(e){
				var p = {id_fabrica: id_fabrica, ingresos: ingresos};
				
				var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.PedidosExt");
				rpc.callAsync(function(resultado, error, id){

				}, "escribir_backup", p);
				
				var model = list.getModel();
				list.resetModel();
				list.setModel(model);
			});
			this.application.manager.addDetail(page);
			page.show();
		}, this);
		
		
		this.getContent().add(list);
		
		var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.Parametros");
		try {
			var resultado = rpc.callSync("leer_fabrica");
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		
		this.fabrica = resultado;
		var aux = [];
		for (var x in resultado) aux.push(resultado[x].descrip);
		slbFabrica.setModel(new qx.data.Array(aux));

    }
  }
});