qx.Class.define("elpintao_mob.comp.navpageNuevoPEItem",
{
  extend : qx.ui.mobile.page.NavigationPage,
  construct : function (pageBack, rowProducto, ingresos)
  {
	this.base(arguments);

	this.setTitle("Nuevo p.e.: " + rowProducto.fabrica + ", " + rowProducto.producto);
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
	this.ingresos = ingresos;
  },
  members : 
  {
    _initialize : function()
	{
  	 	this.base(arguments);
  	 	
 	 	var nfl = {};

		this.getContent().add(new qx.ui.mobile.form.Title("Colores"));
		

		var list = new qx.ui.mobile.list.List();
		
	
		var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.PedidosExt");
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
				
				presenta.descrip = resultado[x].color + " " + presenta.capacidad + " " + presenta.unidad;
				txt.setUserData("item", presenta);
				qx.bom.element.Style.set(txt.getContentElement(),"width","50px");
				if (this.ingresos[this.rowProducto.id_producto] != null && this.ingresos[this.rowProducto.id_producto].items[presenta.id_producto_item] != null) {
					txt.setValue(String(this.ingresos[this.rowProducto.id_producto].items[presenta.id_producto_item].cantidad));
				}
				
				composite3.add(lbl, {flex: 10});
				composite3.add(txt, {flex: 0});
				
				nfl[presenta.id_producto_item] = txt;
			}
			composite.add(composite2);
		}
		
		this.getContent().add(composite);
		
		var btnGuardar = new qx.ui.mobile.form.Button("Aceptar");
		btnGuardar.addListener("tap", function(e){
			var value;
			
			this.ingresos[this.rowProducto.id_producto] = {descrip: this.rowProducto.fabrica + ", " + this.rowProducto.producto};
			this.ingresos[this.rowProducto.id_producto].items = {};
			
			for (var x in nfl){
				value = parseInt(nfl[x].getValue());
				if (! isNaN(value) && value > 0) {
					this.ingresos[this.rowProducto.id_producto].items[x] = nfl[x].getUserData("item");
					this.ingresos[this.rowProducto.id_producto].items[x].cantidad = value;
				}
			}
			
			if (qx.lang.Json.stringify(this.ingresos[this.rowProducto.id_producto].items) == "{}") delete this.ingresos[this.rowProducto.id_producto];
			this.fireEvent("aceptado");
			this.fireDataEvent("back");
		}, this);
		this.getContent().add(btnGuardar);
    }
  },
  events : 
  {
	"aceptado": "qx.event.type.Event"
  }
});