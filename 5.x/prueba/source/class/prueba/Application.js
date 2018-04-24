/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "prueba"
 *
 * @asset(prueba/*)
 */
qx.Class.define("prueba.Application",
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

      // Create a button
      var button1 = new qx.ui.form.Button("First Button", "prueba/test.png");

      // Document is the application root
      var doc = this.getRoot();

      // Add button to document at fixed coordinates
      doc.add(button1, {left: 100, top: 50});

      // Add an event listener
      button1.addListener("execute", function(e) {
      	
        var rpc = new qx.io.remote.Rpc("services/", "comp.Prueba");
		rpc.addListener("completed", function(e){
			var data = e.getData();
			
			alert("completed");
		});
		rpc.addListener("failed", function(e){
			var data = e.getData();
			
			alert(qx.lang.Json.stringify(data, null, 2));
		});
		rpc.addListener("aborted", function(e){
			var data = e.getData();
			
			alert(qx.lang.Json.stringify(data, null, 2));
		});
		
		rpc.callAsyncListeners(false, "leer_datos");
      });
    }
  }
});
