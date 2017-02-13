qx.Class.define("elpintao_mob.comp.navpageRecibido",
{
  extend : qx.ui.mobile.page.NavigationPage,
  construct : function (pedido)
  {
	this.base(arguments);

	this.setTitle("Pedido recibido " + pedido.fecha_recibido);
	this.setShowBackButton(true);
	this.setBackButtonText("Atras");
	
    this.addListener("appear", function(e){
		this.application.apilarHashChange(this, qx.lang.Function.bind(function(){
			this.application.pageMainPE.show({reverse:true});
		}, this));
	}, this);
	this.addListener("back", function(e) {
		this.application.desapilarHashChange(this);
	}, this);
	
	this.application = qx.core.Init.getApplication();
	this.pedido = pedido;

  },
  members : 
  {
	_initialize : function()
	{
	this.base(arguments);
	
	var html = '<table border="1" width="100%" cellpadding="40"><tr><th>Producto</th><th>Cantidad</th></tr>';
	for (var x in this.pedido.detalle) {
		html += '<tr><td>' + this.pedido.fabrica + ", " + this.pedido.detalle[x].producto + ", " + this.pedido.detalle[x].color + ", " + this.pedido.detalle[x].capacidad + " " + this.pedido.detalle[x].unidad + '</td><td align="right">' + this.pedido.detalle[x].cantidad + '</td></tr>';
	}
	html += '</table>';
	
	var lbl = new qx.ui.mobile.embed.Html(html);
	
	var group = new qx.ui.mobile.form.Group([new qx.ui.mobile.form.Title("Detalle pedidos"), lbl]);
	this.getContent().add(group);
	
	
	var html = '<table border="1" width="100%" cellpadding="40"><tr><th>Producto</th><th>Cantidad</th></tr>';
	for (var x in this.pedido.recibidos) {
		html += '<tr><td>' + this.pedido.fabrica + ", " + this.pedido.recibidos[x].producto + ", " + this.pedido.recibidos[x].color + ", " + this.pedido.recibidos[x].capacidad + " " + this.pedido.recibidos[x].unidad + '</td><td align="right">' + this.pedido.recibidos[x].cantidad + '</td></tr>';
	}
	html += '</table>';
	
	var lbl = new qx.ui.mobile.embed.Html(html);
	
	var group = new qx.ui.mobile.form.Group([new qx.ui.mobile.form.Title("Detalle recibidos"), lbl]);
	this.getContent().add(group);
	}
  }
});