/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "vehiculos"
 *
 * @asset(vehiculos/*)
 */
qx.Class.define("vehiculos.Application",
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
	doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
	
	this.perfil = "037001";
	//this.perfil = "063001";
	
	qx.locale.Manager.getInstance().addLocale("es", {"cldr_date_format_medium": "d/M/yyyy"});
	
	var rpc = new qx.io.remote.Rpc();
	rpc.setTimeout(10000);
	rpc.setUrl("services/");
	rpc.setServiceName("comp.turnos.login");
	try
	{
		var params = new Object();
		params.version = "3.1.449";
		
		var result = rpc.callSync("Logueado", params);

		if (!result) {
			vehiculos.Application.Login("Identificacion de Usuario", "", this._InitAPP, this);
		} else {
			//alert(qx.lang.Json.stringify(result, null, 2));
			
 			//"organismo_area_id": "LAKL8",
    		//"label": "Dirección General de Informática de Salud - SERVICIOS ADMINISTRATIVOS"
			
			this._SYSusuario = result.usuario;
			this.rowOrganismo_area = result.organismo_area;
			this._InitAPP();
		}
	}
	catch (ex)
	{
		alert(ex);
	}
	
    },
    
	_InitAPP : function ()
	{
		
      // Document is the application root
	var doc = this.getRoot();
	doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
	
	
	
	var p = {};
	p.organismo_area_id = this.rowOrganismo_area.organismo_area_id;
	
	var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
	try {
		var resultado = rpc.callSync("leer_parque", p);
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	//alert(qx.lang.Json.stringify(resultado, null, 2));
	
	
	
	var numberformatMontoEs = this.numberformatMontoEs = new qx.util.format.NumberFormat("es");
	numberformatMontoEs.setGroupingUsed(true);
	numberformatMontoEs.setMaximumFractionDigits(2);
	numberformatMontoEs.setMinimumFractionDigits(2);
	
	var numberformatMontoEn = this.numberformatMontoEn = new qx.util.format.NumberFormat("en");
	numberformatMontoEn.setGroupingUsed(false);
	numberformatMontoEn.setMaximumFractionDigits(2);
	numberformatMontoEn.setMinimumFractionDigits(2);
      

	var contenedorMain = new qx.ui.container.Composite(new qx.ui.layout.Grow());
	var tabviewMain = this.tabviewMain = new qx.ui.tabview.TabView();
	
	//contenedorMain.add(tabviewMain);
	
	
	var mnuArchivo = new qx.ui.menu.Menu();
	var btnAcercaDe = new qx.ui.menu.Button("Acerca de...");
	btnAcercaDe.addListener("execute", function(){
		/*
		var windowAcercaDe = new elpintao.comp.varios.windowAcercaDe();
		windowAcercaDe.setModal(true);
		doc.add(windowAcercaDe);
		windowAcercaDe.center();
		windowAcercaDe.open();
		*/
	});
	mnuArchivo.add(btnAcercaDe);
	
	
	var mnuEdicion = new qx.ui.menu.Menu();
	
	var btnNuevoVehiculo = new qx.ui.menu.Button("Vehículos...");
	btnNuevoVehiculo.addListener("execute", function(){
		var win = new vehiculos.comp.windowVehiculo();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuEdicion.add(btnNuevoVehiculo);
	
	var btnParamet = new qx.ui.menu.Button("Parámetros...");
	btnParamet.addListener("execute", function(){
		var win = new vehiculos.comp.windowParametro();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuEdicion.addSeparator();
	mnuEdicion.add(btnParamet);
	
	var btnParque = new qx.ui.menu.Button("Parque...");
	btnParque.setEnabled(false);
	btnParque.addListener("execute", function(){
		var win = new vehiculos.comp.windowParque();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuEdicion.add(btnParque);
	

	var mnuVer = new qx.ui.menu.Menu();
	
	var btnImpGral = new qx.ui.menu.Button("Imprimir general...");
	btnImpGral.addListener("execute", function(){
		window.open("services/class/comp/Impresion.php?rutina=general");
	});
	mnuVer.add(btnImpGral);
	

	var mnuSesion = new qx.ui.menu.Menu();

	var btnCerrar = new qx.ui.menu.Button("Cerrar");
	btnCerrar.addListener("execute", function(e){
		var rpc = new qx.io.remote.Rpc("services/", "comp.turnos.login");
		var result = rpc.callSync("Logout");
		location.reload(true);
	});
	mnuSesion.add(btnCerrar);
	
	  
	var mnubtnArchivo = new qx.ui.toolbar.MenuButton('Archivo');
	var mnubtnEdicion = new qx.ui.toolbar.MenuButton('Edición');
	var mnubtnVer = new qx.ui.toolbar.MenuButton('Ver');
	var mnubtnSesion = new qx.ui.toolbar.MenuButton('Sesión');

	
	mnubtnArchivo.setMenu(mnuArchivo);
	mnubtnEdicion.setMenu(mnuEdicion);
	mnubtnVer.setMenu(mnuVer);
	mnubtnSesion.setMenu(mnuSesion);
	  
	
	var toolbarMain = new qx.ui.toolbar.ToolBar();
	toolbarMain.add(mnubtnArchivo);
	toolbarMain.add(mnubtnEdicion);
	toolbarMain.add(mnubtnVer);
	toolbarMain.add(mnubtnSesion);
	toolbarMain.addSpacer();
	
	
	
	doc.add(toolbarMain, {left: 5, top: 0, right: "50%"});
	
	doc.add(new qx.ui.basic.Label("Org/Area: " + this.rowOrganismo_area.label), {left: "51%", top: 5});
	doc.add(new qx.ui.basic.Label("Usuario: " + this._SYSusuario), {left: "51%", top: 25});
	
	//doc.add(contenedorMain, {left: 0, top: 33, right: 0, bottom: 0});
	doc.add(tabviewMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	var pageGeneral = this.pageGeneral = new vehiculos.comp.pageGeneral();
	tabviewMain.add(pageGeneral);
	tabviewMain.setSelection([pageGeneral]);
	
	var pageParticular = new vehiculos.comp.pageParticular();
	tabviewMain.add(pageParticular);
	
	var timer = qx.util.TimerManager.getInstance();
	timer.start(pageGeneral.functionActualizarGral, 30000);
	
	
	}
  },
	statics :
	{
		Login : function (title, usuario, functionClose, context)
		{
			var winLogin = new qx.ui.window.Window(title);
			winLogin.addListener("resize", winLogin.center, winLogin);
			winLogin.set({showMaximize:false, allowMaximize:false, showMinimize:false, showClose:false, modal:true, movable:false, resizable:false, showStatusbar:false});
			winLogin.setLayout(new qx.ui.layout.Basic());
			winLogin.addListenerOnce("appear", function(e){
				if ((usuario != "") && (usuario != null) && (usuario != undefined)) {
					txpPassword.focus();
				} else {
					txtUsuario.focus();
				}
			})
			
			/*
			var txtUsuario = new qx.ui.form.ow.TextField("Usuario:").set({enabled:true});
				txtUsuario.getLabel().setWidth(60);
			var txpPassword = new qx.ui.form.ow.PassField("Password:").set({enabled:true});
				txpPassword.getLabel().setWidth(60);
			var lblMSJ = new qx.ui.basic.Label("").set({rich:true, textAlign:'center', visibility:'excluded'});
			var btnIngresar = new qx.ui.form.Button("Validar Datos");
			var cmbServicios = new qx.ui.form.ow.ComboBox("Servicio:").set({visibility:'hidden'});
				cmbServicios.getLabel().setWidth(60);
				cmbServicios.getCombo().setWidth(500);
			*/
			
			var txtUsuario = new qx.ui.form.TextField("");
			var txpPassword = new qx.ui.form.PasswordField("");

			var lblMSJ = new qx.ui.basic.Label("").set({rich:true, textAlign:'center', visibility:'excluded'});
			var btnIngresar = new qx.ui.form.Button("Validar Datos");
			//var cmbServicios = new qx.ui.form.ComboBox().set({visibility:'hidden', width: 400});
			var cmbServicios = new qx.ui.form.SelectBox().set({visibility:'hidden', width: 400});

			
			if ((usuario != "") && (usuario != null) && (usuario != undefined)) {
				txtUsuario.setValue(usuario);
				txtUsuario.setEnabled(false);
			}
			
			txtUsuario.addListener("keydown", function (e) {
				if (e.getKeyIdentifier() === 'Enter') txpPassword.tabFocus();
			});
			
			txpPassword.addListener("keydown", function (e) {
				if (e.getKeyIdentifier() === 'Enter') btnIngresar.execute();
			});
			
			winLogin.add(new qx.ui.basic.Label("Usuario:"), {left:0, top:0});
			winLogin.add(txtUsuario, {left:150, top:0});
			winLogin.add(new qx.ui.basic.Label("Password:"), {left:0, top:30});
			winLogin.add(txpPassword, {left:150, top:30});
			winLogin.add(lblMSJ, {left:200, top:60});
			winLogin.add(new qx.ui.basic.Label("Servicio:"), {left:0, top:60});
			winLogin.add(cmbServicios, {left:150, top:60});
			winLogin.add(btnIngresar, {left:250, top:90});
			
			if ((usuario != "") && (usuario != null) && (usuario != undefined))	{
				var btnSalir = new qx.ui.form.Button("Salir e Ingresar con otro Usuario");
				btnSalir.addListener("execute", function (){
					location.reload(true);
				});
				
				winLogin.add(btnSalir);
			}
			
			btnIngresar.addListener("execute", function (e) {
				var rpc = new qx.io.remote.Rpc();
				rpc.setTimeout(10000);
				rpc.setUrl("services/");
				rpc.setServiceName("comp.turnos.login");
				var params = new Object();
				params.usuario = txtUsuario.getValue();
				params.password = txpPassword.getValue();
				//params.servicio = cmbServicios.getValue();
				params.servicio = "";
				try
				{
					if (btnIngresar.getLabel() != "Ingresar") {
						var result = rpc.callSync("Login", params);
						//alert(qx.lang.Json.stringify(result, null, 2));
						if (result.login == true) {
							txtUsuario.setEnabled(false);
							txpPassword.setEnabled(false);
							lblMSJ.setVisibility("excluded");
							lblMSJ.setValue("");
							cmbServicios.setVisibility("visible");
							//alert(qx.lang.Json.stringify(result));
							//cmbServicios.setNewValues(result.servicios);
							//alert(qx.lang.Json.stringify(result.servicios, null, 2));
							for (var x in result.servicios) {
								cmbServicios.add(new qx.ui.form.ListItem(result.servicios[x].label, result.servicios[x].icon, result.servicios[x]));
							}
							btnIngresar.setLabel("Ingresar");
						} else {
							if (result) {
								cmbServicios.setVisibility("hidden");
								lblMSJ.setValue("<font color='red'>Ud. no posee permisos para este Sistema.!</font>");
								lblMSJ.setVisibility("visible");
							} else {
								cmbServicios.setVisibility("hidden");
								lblMSJ.setValue("<font color='red'>Usuario y/o Password incorrecta!</font>");
								lblMSJ.setVisibility("visible");
							}
							if ((usuario != "") && (usuario != null) && (usuario != undefined)) {
								txpPassword.focus();
							} else {
								txtUsuario.focus();
							}
						}
					} else {
						//context.rowOrganismo_area = qx.util.Serializer.toNativeObject(cmbServicios.getChildControl("list").getModelSelection().getItem(0));
						context.rowOrganismo_area = qx.util.Serializer.toNativeObject(cmbServicios.getModelSelection().getItem(0));
						
						if (context.rowOrganismo_area.perfiles[qx.core.Init.getApplication().perfil] != null) {
							params.organismo_area = context.rowOrganismo_area;
							var result = rpc.callSync("Ingresar", params);
							context._SYSusuario = txtUsuario.getValue();
							
							winLogin.close();
						} else {
							dialog.Dialog.error("Ud. no tiene permisos para este sistema.", function(e){cmbServicios.focus();});
						}
					}
				} catch (ex) {
					lblMSJ.setValue("<font color='red'>Se produjo un error en el Sistema!</font>");
					alert(ex);
				}
			}, this);

			if ((functionClose != "") && (functionClose != null) && (functionClose != undefined)) {
				if (context)
					winLogin.addListener("close", functionClose, context);
				else
					winLogin.addListener("close", functionClose);
			}
			
			winLogin.open();
		}
	}
});
