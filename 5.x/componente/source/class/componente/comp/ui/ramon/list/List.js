qx.Class.define("componente.comp.ui.ramon.list.List",
{
	extend : qx.ui.form.List,
	construct : function (horizontal)
	{
		this.base(arguments, horizontal);
		
		var listenerId;
		
		listenerId = this.addListener("changeContextMenu", function(e){
			this._contextMenu = e.getData();
		}, this);
		this.registrarListener(this, listenerId);
		
		listenerId = this.addListener("focus", function(e){
			if (this._contextMenu) this._contextMenu.restablecer();
		}, this);
		this.registrarListener(this, listenerId);
		
		listenerId = this.addListener("blur", function(e){
			if (this._contextMenu) this._contextMenu.desactivar();
		}, this);
		this.registrarListener(this, listenerId);
	},
	
	members : 
	{
		_contextMenu: null,
		_listeners: [],
		
		registrarListener : function (objeto, listenerId)
		{
			this._listeners.push({objeto: objeto, listenerId: listenerId});
		}
	},
	destruct : function ()
	{
		for (var i in this._listeners) this._listeners[i].objeto.removeListenerById(this._listeners[i].listenerId);
	}
});