qx.Class.define("elpintao_mob.comp.navpageMain",
{
  extend : qx.ui.mobile.page.NavigationPage,
  construct : function ()
  {
	this.base(arguments);

	this.addListener("appear", function(e){
		this.application.hashChange = {widgets: {}, functions: []};
	}, this)
	
	this.application = qx.core.Init.getApplication();
  },
  members : 
  {
	_initialize : function()
	{
		
	this.base(arguments);
	
	this.setTitle("Página principal");
	
    var btnPE = new qx.ui.mobile.form.Button("Pedidos externos");
    btnPE.addListener("tap", function(e) {
		var pageMainPE = new elpintao_mob.comp.navpageMainPE(this);
		this.application.manager.addDetail(pageMainPE);
		pageMainPE.show();
    }, this);
    
    var btnStock = new qx.ui.mobile.form.Button("Adicionar stock");
    btnStock.addListener("tap", function(e) {
		var pageStock = new elpintao_mob.comp.navpageStock(this);
		this.application.manager.addDetail(pageStock);
		pageStock.show();
    }, this);
    
    this.getContent().add(new qx.ui.mobile.form.Group([btnPE, btnStock]));
	}
  }
});