qx.Class.define("componente.general.ramon.ui.datefield.DateField",
{
	extend : qx.ui.form.DateField,
	construct : function ()
	{
		this.base(arguments);
		
		var listenerId;
		
		listenerId = this.addListener("focusin", function(e){
			var contexto = this;
			window.setTimeout(function(){
				contexto.getChildControl("textfield").selectAllText();
			}, 0);
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