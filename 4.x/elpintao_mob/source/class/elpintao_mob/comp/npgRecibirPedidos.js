/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 */
qx.Class.define("elpintao_mob.comp.npgRecibirPedidos",
{
  //extend : qx.ui.mobile.page.NavigationPage,
  //extend : elpintao_mob.comp.Toolbar2,
  extend : elpintao_mob.comp.Tab,

  construct : function()
  {
    this.base(arguments);
    
    this.setTitle("Recibir pedidos externos");
    //this.setShowBackButton(true);
    //this.setBackButtonText("Back");
    this.application = qx.core.Init.getApplication();
  },


  members :
  {
    __form: null,
    
    
	actualizar : function()
	{
		var rpc = new qx.io.remote.Rpc("services/", "comp.PedidosExt");
		rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id) {
			//alert(qx.lang.Json.stringify(resultado, null, 2));
	
			this.list.setModel(new qx.data.Array(resultado));
		}, this), "leer_externos");
	},


    // overridden
    _initialize: function() {
		this.base(arguments);

		var list = this.list = new qx.ui.mobile.list.List({
			configureItem : function(item, data, row) {
				item.setTitle(data.fecha + ", " + data.fabrica);
				item.setSubtitle((data.recibido) ? "Recibido: " + data.fecha_recibido : "");
				item.setSelectable(true);
				item.setShowArrow(true);
			}
		});
		list.addListener("changeSelection", function(e) {
			var item = list.getModel().getItem(e.getData());
			var page;
			
			if (item.recibido) {
				//page = new elpintao_mob.comp.navpageRecibido(item);
			} else {
				page = new elpintao_mob.comp.npgRecibir(item);
			}
			
			this.application.manager.addDetail(page);
			this.application.routing.onGet("/recibir_pedido/recibir", this.application._show, page);
			//page.show();
			this.application.routing.executeGet("/recibir_pedido/recibir");
		}, this);
		
		
	    //this.getContent().add(new qx.ui.mobile.form.Group([new qx.ui.mobile.form.Title("Pedidos externos"), list]));
	    this.getContent().add(list);
		
		this.actualizar();
    },


    /**
     * Event handler for <code>tap</code> on the login button.
     */
    _onButtonTap: function() {
      // use form validation
      if (this.__form.validate()) {
        qx.core.Init.getApplication().getRouting().executeGet("/overview");
      }
    }
  }
 
});