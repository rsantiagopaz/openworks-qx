qx.Class.define("turismo.comp.pageProformas",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);
	
	this.setLabel("Consultas");
	this.setLayout(new qx.ui.layout.Grow());
	this.toggleShowCloseButton();

	this.addListener("close", function(e){
		qx.core.Init.getApplication().pageProformas = null;
	});
	
	
	var compositeProforma_relacionada = new turismo.comp.compositeProforma_relacionada(this);
	this.add(compositeProforma_relacionada);
	compositeProforma_relacionada.buscar();
	
	},
	members : 
	{

	}
});