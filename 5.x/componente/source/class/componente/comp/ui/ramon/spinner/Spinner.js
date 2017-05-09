qx.Class.define("componente.comp.ui.ramon.spinner.Spinner",
{
	extend : qx.ui.form.Spinner,
	construct : function (min, value, max)
	{
		this.base(arguments, min, value, max);
		
		var listenerId;
		
		listenerId = this.addListener("focus", function(e){
			this.getChildControl("textfield").selectAllText();
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