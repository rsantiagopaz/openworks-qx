qx.Class.define("componente.comp.ui.ramon.tree.VirtualTree",
{
	extend : qx.ui.tree.VirtualTree,
	construct : function (model, labelPath, childProperty)
	{
		this.base(arguments, model, labelPath, childProperty);
		
		this._listenerFocus = this.addListener("focus", function(e){
			if (this._contextMenu) this._contextMenu.restablecer();
		});
		
		this._listenerBlur = this.addListener("blur", function(e){
			if (this._contextMenu) this._contextMenu.desactivar();
		});

		this._listenerChangeContextMenu = this.addListener("changeContextMenu", function(e){
			this._contextMenu = e.getData();
		});

	},
	members : 
	{
		_listenerFocus: null,
		_listenerBlur: null,
		_listenerChangeContextMenu: null,
		_contextMenu: null
	},
	destruct : function ()
	{
		this.removeListenerById(this._listenerFocus);
		this.removeListenerById(this._listenerBlur);
		this.removeListenerById(this._listenerChangeContextMenu);
	}
});