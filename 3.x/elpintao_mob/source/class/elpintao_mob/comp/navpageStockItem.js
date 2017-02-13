qx.Class.define("elpintao_mob.comp.navpageStockItem",
{
  extend : qx.ui.mobile.page.NavigationPage,
  construct : function (pageBack, rowProducto)
  {
	this.base(arguments);

	this.setTitle("Adicionar stock: " + rowProducto.fabrica + ", " + rowProducto.producto);
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
	this.rowProducto = rowProducto;
  },
  members : 
  {
    _initialize : function()
	{
  	 	this.base(arguments);
  	 	
 	 	var ingresos = {};
 	 	var codbarra = {};

 	 	
 	 	
		var form = new qx.ui.mobile.form.Form();
	 	
		var tbtEditar = new qx.ui.mobile.form.ToggleButton(false," Stock "," Cod.barra ");
		tbtEditar.setValue(true);
		tbtEditar.addListener("changeValue", function(e) {
			var data = e.getData();
			for (var x in ingresos) {
				ingresos[x].setVisibility((data) ? "visible" : "excluded");
			}
			for (var x in codbarra) {
				codbarra[x].setVisibility((data) ? "excluded" : "visible");
			}
		}, this);
		
		form.add(tbtEditar, "Editar: ");
		this.getContent().add(new qx.ui.mobile.form.renderer.Single(form));
		
 	 	this.getContent().add(new qx.ui.mobile.form.Title("Colores"));
		

		//var list = new qx.ui.mobile.list.List();
	
		var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.Productos");
		try {
			var resultado = rpc.callSync("buscar_producto_item", {id_producto: this.rowProducto.id_producto});
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		
		var composite, composite2, composite3, lbl, txt;
		var presenta;
		
		composite = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.VBox());
		composite.addCssClass("list");
		
		for (var x in resultado) {
			lbl = new qx.ui.mobile.basic.Label(resultado[x].color);
			composite2 = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox());
			composite2.addCssClass("list-item");
			composite2.add(lbl, {flex: 1});
			
			composite3 = new qx.ui.mobile.container.Composite(new qx.ui.mobile.layout.HBox("right"));
			composite2.add(composite3, {flex: 10});
			
			for (var y in resultado[x].presenta) {
				lbl = new qx.ui.mobile.basic.Label("12");
				lbl.setVisibility("hidden");
				composite3.add(lbl, {flex: 10});
				
				presenta = resultado[x].presenta[y];
				lbl = new qx.ui.mobile.basic.Label(presenta.capacidad + " " + presenta.unidad + " :");
				txt = new qx.ui.mobile.form.NumberField("");
				qx.bom.element.Style.set(txt.getContentElement(),"width","50px");
				
				composite3.add(lbl, {flex: 10});
				composite3.add(txt, {flex: 0});
								
				ingresos[presenta.id_producto_item] = txt;
				
				txt = new qx.ui.mobile.form.NumberField("");
				txt.setVisibility("excluded");
				qx.bom.element.Style.set(txt.getContentElement(),"width","120px");
				composite3.add(txt, {flex: 0});
				codbarra[presenta.id_producto_item] = txt;
			}
			composite.add(composite2);
		}
		
		this.getContent().add(composite);
		
		var btnGuardar = new qx.ui.mobile.form.Button("Guardar");
		btnGuardar.addListener("tap", function(e){
			var busyIndicator = new qx.ui.mobile.dialog.BusyIndicator("Procesando...");
			var busypopup = new qx.ui.mobile.dialog.Popup(busyIndicator);
			busypopup.show();
			
			var value;
			
			var p = {};
			p.ingresos = [];
			p.codbarra = [];
			
			for (var x in ingresos){
				value = parseInt(ingresos[x].getValue());
				if (! isNaN(value)) p.ingresos.push({id_producto_item: x, adicionar: value});
			}
			
			for (var x in codbarra){
				value = parseInt(codbarra[x].getValue());
				if (! isNaN(value)) p.codbarra.push({id_producto_item: x, cod_barra: value});
			}
			
			var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.Productos");
			try {
				var resultado = rpc.callSync("asignar_stock", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			this.fireDataEvent("back");
			
			busypopup.destroy();
		}, this);
		this.getContent().add(btnGuardar);
    }
  }
});