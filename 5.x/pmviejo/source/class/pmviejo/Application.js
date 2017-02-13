/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "pmviejo"
 *
 * @asset(pmviejo/*)
 */
qx.Class.define("pmviejo.Application",
{
  extend : qx.application.Mobile,


  members :
  {

    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console.
        // Trigger a "longtap" event on the navigation bar for opening it.
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
        Remove or edit the following code to create your application.
      -------------------------------------------------------------------------
      */


      
      
      
      
      
      
      
      this.getRoot().setFontScale(1.5);
	//qx.core.Init.getApplication().getRoot().setFontScale(1.5);
	
	this.cancelarback = false;
	window.location.hash = "inicio";
	var contexto = this;
	
	this.hashChange = {widgets: {}, functions: []};
	this.apilarHashChange = qx.lang.Function.bind(function(widget, fnc) {
		if (this.hashChange.widgets[widget] == null) {
			this.hashChange.widgets[widget] = this.hashChange.functions.length;
			this.hashChange.functions.push({widget: widget, fnc: fnc});
		}
	}, this);
	
	this.desapilarHashChange = qx.lang.Function.bind(function(widget) {
		var index = this.hashChange.widgets[widget];
		if (index != null) {
			var item = this.hashChange.functions.pop();
			this.hashChange.widgets[item.widget] = null;
			item.fnc();
		}
	}, this);
	
	
	window.addEventListener("hashchange", qx.lang.Function.bind(function(e){
		if (this.cancelarback) {
			this.cancelarback = false;
			window.location.hash = "1";
			if (this.hashChange.functions.length > 0) {
				var item = this.hashChange.functions.pop();
				this.hashChange.widgets[item.widget] = null;
				item.fnc();
			}
		} else this.cancelarback = true;

		e = (typeof e !== "undefined")? e : event;
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}, this));
	
	
	var functionCalcularImportes = this.functionCalcularImportes = function(obj) {
		obj.plmasiva = obj.precio_lista + (obj.precio_lista * obj.iva / 100);
		
		obj.costo = obj.plmasiva;
		obj.costo = obj.costo - (obj.costo * obj.desc_fabrica / 100);
		obj.costo = obj.costo - (obj.costo * obj.desc_producto / 100);
		
		obj.pcf = obj.costo + (obj.costo * obj.remarc_final / 100);
		obj.pcf = obj.pcf - ((obj.pcf * obj.desc_final) / 100);
		
		obj.pcfcd = obj.pcf - ((obj.pcf * obj.bonif_final) / 100);
		
		obj.utilcf = obj.pcfcd - obj.costo;
		
		obj.pmay = obj.costo + (obj.costo * obj.remarc_mayorista / 100);
		obj.pmay = obj.pmay - ((obj.pmay * obj.desc_mayorista) / 100);
		
		obj.pmaycd = obj.pmay - ((obj.pmay * obj.bonif_mayorista) / 100);
		
		obj.utilmay = obj.pmaycd - obj.costo;
		
		obj.comision = obj.pcfcd * obj.comision_vendedor / 100;
	}
      
      
      var pageMain = this.pageMain = new elpintao_mob.comp.navpageMain();
      
      // Add the pages to the page manager.
      var manager = this.manager = new qx.ui.mobile.page.Manager(false);
	  manager.addDetail([
        pageMain
      ]);
      
      // pageMain will be shown at start
      pageMain.show();
    }
  }
});
