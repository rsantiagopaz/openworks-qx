qx.Class.define("componente.general.ramon.ui.selectbox.SelectBox",
{
	extend : qx.ui.form.SelectBox,
	construct : function ()
	{
		this.base(arguments);
		
		this._listeners = [];
		
		var listenerId;
		
		listenerId = this.addListener("focus", function(e){
			var contextMenu = this.getContextMenu();
			
			if (contextMenu) contextMenu.restablecer();
		}, this);
		this._listeners.push({objeto: this, listenerId: listenerId});
		
		listenerId = this.addListener("blur", function(e){
			var contextMenu = this.getContextMenu();
			
			if (contextMenu) contextMenu.desactivar();
		}, this);
		this._listeners.push({objeto: this, listenerId: listenerId});

	},
	members : 
	{
		_listeners: []
	},
	destruct : function ()
	{
		for (var x in this._listeners) {
			this._listeners[x].objeto.removeListenerById(this._listeners[x].listenerId);
		}
	}
});