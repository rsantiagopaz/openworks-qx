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
        alert("Hello World!");
      });
      
	var tknDestino = new tokenfield.Token();
	//tknDestino.setWidth(800);
	//tknDestino.setMaxWidth(500);
	tknDestino.setWidth(200);
	tknDestino.setHeight(80);
	tknDestino.setSelectionMode('multi');
	tknDestino.setSelectOnce(true);
	tknDestino.setLabelPath("descrip");
	
	// todo: should be setTypeInText, but that doesn't work
	tknDestino.setHintText("Please enter at least two letters of a country name...");
	
	/*
	 * listens for event to load data from the server. here, we
	 * do a simple mockup with a small timeout to simulate a server request
	 */
	tknDestino.addListener("loadData", function(e) {
		var data = e.getData().trim();
		var resultado = [
			{id: 1, descrip: "prueba 1"},
			{id: 2, descrip: "prueba 2"},
			{id: 3, descrip: "prueba 3"},
			{id: 4, descrip: "prueba 4"},
			{id: 5, descrip: "prueba 5"}
		]
      	if (data != "") {
			tknDestino.populateList(data, resultado);
      	}
	}, this);

	doc.add(tknDestino, {left: 100, top: 150});
    }
  }
});
