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



      // Document is the application root
      var doc = this.getRoot();
      
      var form = new qx.ui.form.Form();
      
      var dtf = new qx.ui.form.DateField();
      form.add(dtf, "Fecha", null, "fecha");
      
      var button = new qx.ui.form.Button("Ver");
      button.addListener("execute", function(e) {
        alert(dtf.getValue().toString());
      });
      form.addButton(button);
      
      doc.add(new qx.ui.form.renderer.Single(form), {left: 10, top: 10});
      
      var controller = new qx.data.controller.Form(null, form);
      controller.createModel(true);
      
    }
  }
});
