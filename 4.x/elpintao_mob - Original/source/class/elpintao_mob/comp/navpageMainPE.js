qx.Class.define("elpintao_mob.comp.navpageMainPE",
{
  extend : qx.ui.mobile.page.NavigationPage,
  construct : function (pageBack)
  {
	this.base(arguments);
	
	this.setShowBackButton(true);
	this.setBackButtonText("Atras");
	this.addListener("appear", function() {
		this.application.apilarHashChange(this, qx.lang.Function.bind(function(){
			this.dialogMenu.hide();
			pageBack.show({reverse:true});
		}, this));
	}, this);

	this.addListener("back", function() {
		this.application.desapilarHashChange(this);
	}, this);
	
	this.application = qx.core.Init.getApplication();
	this.application.pageMainPE = this;
  },
  members : 
  {
	actualizar : function()
	{
		var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.PedidosExt");
		try {
			var resultado = rpc.callSync("leer_externos");
		} catch (ex) {
			alert("Sync exception: " + ex);
		}

		this.list.setModel(new qx.data.Array(resultado));
	},
	_initialize : function()
	{
		
	this.base(arguments);
	
	this.setTitle("Pedidos externos");
	
    var btnOpciones = new qx.ui.mobile.form.Button("Opciones");
    btnOpciones.addListener("tap", function(e) {
		dialogMenu.show();
    });
    
    this.getContent().add(new qx.ui.mobile.form.Group([btnOpciones]));
    
    var dialogMenu = this.dialogMenu = new qx.ui.mobile.dialog.Menu(new qx.data.Array(["Nuevo pedido externo..."]), btnOpciones);
    dialogMenu.setTitle("Opciones");
    dialogMenu.addListener("changeSelection", function(e){
    	var data = e.getData();
    	dialogMenu.hide();
    	dialogMenu.setSelectedIndex(null);
    	if (data.index==0) {
    		var pageNuevoPE = new elpintao_mob.comp.navpageNuevoPE(this);
    		this.application.manager.addDetail(pageNuevoPE);
    		pageNuevoPE.show();
    	}
	}, this);
	
    
    
    
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
		if (item.recibido) {
			var page = new elpintao_mob.comp.navpageRecibido(item, this);
			page.addListener("disappear", function(e){
				this.destroy();
			});
			this.application.manager.addDetail(page);
			page.show();
		} else {
			var page = new elpintao_mob.comp.navpageRecibir(item, this);
			page.addListener("disappear", function(e){
				this.destroy();
			});
			this.application.manager.addDetail(page);
			page.show();
		}
	}, this);
	
	
    this.getContent().add(new qx.ui.mobile.form.Group([new qx.ui.mobile.form.Title("Pedidos externos"), list]));
	
	this.actualizar();
	}
  }
});