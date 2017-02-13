/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "turismo"
 *
 * @asset(turismo/*)
 */
qx.Class.define("turismo.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
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
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */


      
      
      
      
      // Document is the application root
      var doc = this.getRoot();
      
      
	var pageProformas = this.pageProformas = null;
	var pageOperaciones = this.pageOperaciones = null;
	var windowMensajes = null;
	var windowGenerarPresupuesto = this.windowGenerarPresupuesto = null;
	
	
	var functionAbrirProforma = this.functionAbrirProforma = function(id_proforma) {
		var page = new turismo.comp.pageProforma(id_proforma);
		tabviewMain.add(page);
		tabviewMain.setSelection([page]);
		
		return page;
	}
	
	var functionEliminarCaracter = this.functionEliminarCaracter = function(value) {
		var aux = value;
		/*
		var caracteres = ".,- ";
		
		for (var x in caracteres) {
			do {
				value = aux;
				aux = value.replace(caracteres[x], "");
			} while (aux != value);
		}
		
		value = String(parseInt(value));
		
		return ((isNaN(value)) ? "" : value);
		*/
		
		for (var x in value) {
			if (isNaN(value[x]) || value[x]==" ") aux = aux.replace(value[x], "");
		}
		
		return aux;
	}
	
	var functionOracion = this.functionOracion = function(value) {
		/*
		var pos = value.indexOf(".");
		if (pos > -1) {
			value = qx.lang.String.firstUp(value.substring(0, pos + 1).trim()) + " " + functionOracion(value.substring(pos + 1).trim());
		} else {
			value = qx.lang.String.firstUp(value.trim());
		}
		
		return value.trim();
		*/
		
		var bandera = true;
		var caracteres = ".¿?¡!";
		var caracter;
		
		for (var x = 0; x < value.length; x++) {
			caracter = value[x];
			
			if (caracteres.indexOf(caracter) > -1) {
				bandera = true;
			} else if (bandera && caracter != " ") {
				value = value.substring(0, x) + caracter.toUpperCase() + value.substring(x + 1);
				bandera = false;
			}
		}
		
		return value.trim();
	}

	var contenedorMain = new qx.ui.container.Composite(new qx.ui.layout.Grow());
	var tabviewMain = this.tabviewMain = new qx.ui.tabview.TabView();
	
	contenedorMain.add(tabviewMain);
	
	
	var mnuArchivo = new qx.ui.menu.Menu();
	var btnAcercaDe = new qx.ui.menu.Button("Acerca de...");
	btnAcercaDe.addListener("execute", function(){
		var windowAcercaDe = new elpintao.comp.varios.windowAcercaDe();
		windowAcercaDe.setModal(true);
		doc.add(windowAcercaDe);
		windowAcercaDe.center();
		windowAcercaDe.open();
	});
	mnuArchivo.add(btnAcercaDe);
	
	
	var mnuEdicion = new qx.ui.menu.Menu();
	var btnProforma = new qx.ui.menu.Button("Nueva consulta");
	btnProforma.addListener("execute", function(){
		functionAbrirProforma("0");
	});
	mnuEdicion.add(btnProforma);
	
	var btnParamet = new qx.ui.menu.Button("Parámetros...");
	btnParamet.addListener("execute", function(){
		var win = new turismo.comp.windowParametros();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	//mnuEdicion.addSeparator();
	//mnuEdicion.add(btnParamet);
	

	var mnuVer = new qx.ui.menu.Menu();
	var btnProformas = new qx.ui.menu.Button("Consultas");
	btnProformas.addListener("execute", function(){
		if (this.pageProformas == null) {
			this.pageProformas = new turismo.comp.pageProformas();
			tabviewMain.add(this.pageProformas);
		}
		tabviewMain.setSelection([this.pageProformas]);
	}, this);
	mnuVer.add(btnProformas);
	
	var btnOperaciones = new qx.ui.menu.Button("Operaciones");
	btnOperaciones.addListener("execute", function(){
		if (this.pageOperaciones == null) {
			this.pageOperaciones = new turismo.comp.pageOperaciones();
			tabviewMain.add(this.pageOperaciones);
		}
		tabviewMain.setSelection([this.pageOperaciones]);
	}, this);
	mnuVer.add(btnOperaciones);
	
	  
	var mnubtnArchivo = new qx.ui.toolbar.MenuButton('Archivo');
	var mnubtnEdicion = new qx.ui.toolbar.MenuButton('Edición');
	var mnubtnVer = new qx.ui.toolbar.MenuButton('Ver');

	
	mnubtnArchivo.setMenu(mnuArchivo);
	mnubtnEdicion.setMenu(mnuEdicion);
	mnubtnVer.setMenu(mnuVer);
	  
	
	var toolbarMain = new qx.ui.toolbar.ToolBar();
	toolbarMain.add(mnubtnArchivo);
	toolbarMain.add(mnubtnEdicion);
	toolbarMain.add(mnubtnVer);
	toolbarMain.addSpacer();
	
	
	
	var btnMensajes = this.btnMensajes = new qx.ui.toolbar.Button("Mensajes");
	btnMensajes.addListener("execute", function(e){
		if (windowMensajes.isVisible()) {
			windowMensajes.getLayoutParent().getWindowManager().bringToFront(windowMensajes);
		} else {
			doc.add(windowMensajes, {left: doc.getBounds().width - windowMensajes.getWidth(), top: "7%", height: "90%"});
			windowMensajes.open();
		}
		windowMensajes.list.focus();
	});
	toolbarMain.add(btnMensajes);
	toolbarMain.addSpacer();
	
	var ttAlerta = this.ttAlerta = new qx.ui.tooltip.ToolTip("Tiene mensajes");

	
	doc.add(toolbarMain, {left: 5, top: 0, right: 5});
	doc.add(contenedorMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	windowMensajes = new turismo.comp.windowMensajes();
	
	
	var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("leer_paramet");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	var rowParamet = this.rowParamet = resultado;
	
    }
  }
});
