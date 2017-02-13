qx.Class.define("elpintao_mob.comp.navpageStock",
{
  extend : qx.ui.mobile.page.NavigationPage,
  construct : function (pageBack)
  {
	this.base(arguments);

	this.setTitle("Adicionar stock");
	this.setShowBackButton(true);
	this.setBackButtonText("Atras");
	this.addListener("appear", function() {
		this.application.apilarHashChange(this, qx.lang.Function.bind(function(){
			pageBack.show({reverse:true});
		}, this));
	}, this);

	this.addListener("back", function() {
		this.application.desapilarHashChange(this);
	}, this);
	
	this.application = qx.core.Init.getApplication();
  },
  members : 
  {
    _initialize : function()
	{
  	 	this.base(arguments);
  	 	
 	 	
	var contexto = this;
	var bandera_cod_barra = false;
	var id_fabrica;
	var ingresos = {};
	var busquedaActual = null;
	var busquedaSiguiente = null;
	
	this.functionLeer_producto = qx.lang.Function.bind(function(p) {
		if (busquedaActual == null) {
			busquedaActual == p;
			var busyIndicator = new qx.ui.mobile.dialog.BusyIndicator("Cargando...");
			var busypopup = new qx.ui.mobile.dialog.Popup(busyIndicator);
			busypopup.show();
			
			if (p.descrip.length < 3) p.descrip = "";
			
			var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.Productos");
			rpc.setTimeout(1000 * 60);
			rpc.callAsync(function(resultado, error, id){
				list.setModel(new qx.data.Array(resultado));
				
				busypopup.destroy();
				
				busquedaActual = null;
				if (busquedaSiguiente != null) {
					var aux = busquedaSiguiente;
					busquedaSiguiente = null;
					this.functionLeer_producto(aux);
				}
			}, "buscar_productos", p);
		} else busquedaSiguiente = p;
	}, this)

	
	
	 	var form = new qx.ui.mobile.form.Form();
		var slbFabrica = this.slbFabrica = new qx.ui.mobile.form.SelectBox();
		slbFabrica.addListener("changeSelection", function(e){
			var data = e.getData();

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
	
		//this.addAfterNavigationBar(r);
		
		//this.addAfterNavigationBar(new qx.ui.mobile.form.Title("Productos"));
		
		this.getContent().add(r);
		this.getContent().add(new qx.ui.mobile.form.Title("Productos"));
		
		var list = new qx.ui.mobile.list.List({
			configureItem : function(item, data, row) {
				//alert(qx.lang.Json.stringify(data, null, 2));
				item.setTitle(data.producto);
				item.setSelectable(true);
				item.setShowArrow(true);
				//items[row].item = item;
				//item.getChildren()[1].getChildren()[1].setValue("sub titulo");
			}
		});
		list.addListener("changeSelection", function(e) {
			var data = e.getData();
			
			var pageStock = new elpintao_mob.comp.navpageStockItem(this, list.getModel().getItem(data));
			this.application.manager.addDetail(pageStock);
			pageStock.show();
		}, this);
		
		
		this.getContent().add(list);
		//alert(this.getContent().getLayoutParent());
		//this.getContent().getLayoutParent().setLayoutProperties({flex:3});
		
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