qx.Class.define("componente.comp.ui.ramon.image.Loading",
{
	extend : qx.ui.basic.Image,
	construct : function (source)
	{
		this.base(arguments, source);
		
		
		this._contador = 0;

		var application = qx.core.Init.getApplication();
		
		var bounds = application.getRoot().getBounds();
		this.setVisibility("hidden");
		this.setBackgroundColor("#FFFFFF");
		this.setDecorator("main");
		application.getRoot().add(this, {left: parseInt(bounds.width / 2 - 33), top: parseInt(bounds.height / 2 - 33)});
		
		this.addListenerOnce("appear", function(e){
			this.setZIndex(30000);
		});
	},
	members : 
	{
		_contador: null,
		
		show: function() {
			if (this._contador == 0) this.setVisibility("visible");
			
			this._contador+= 1;
		},
		
		hide: function(bandera) {
			if (bandera) this._contador = 0;
			else if (this._contador > 0) this._contador-= 1;
			
			if (this._contador == 0) this.setVisibility("hidden");
		}
	},
	destruct : function ()
	{
		//this.removeListenerById(this._listenerFocus);
		//this.removeListenerById(this._listenerBlur);
		//this.removeListenerById(this._listenerChangeContextMenu);
	}
});