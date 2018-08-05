qx.Class.define("sacdiag.comp.rpc.Rpc",
{
	extend : componente.comp.io.ramon.rpc.Rpc,
	construct : function (url, serviceName)
	{
		this.base(arguments, url, serviceName);
		
		
		this.setTimeout(1000 * 60 * 5);
		
		this.addListener("failed", function(e){
			var data = e.getData();
			
			if (data.message == "sesion_terminada") {
				qx.core.Init.getApplication().loading.hide(true);
				
				dialog.Dialog.warning("Sesión terminada.<br/>Debe ingresar datos de autenticación.", function(e){location.reload(true);});
			}
		});
	}
});