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


	var tableModel = new qx.ui.table.model.Simple();
	tableModel.setColumns(["Reparación", "Costo", "Cantidad", "Total"], ["reparacion", "costo", "cantidad", "total"]);
	tableModel.setEditable(true);

	var tbl = new prueba.comp.TableModified(tableModel);
	//var tbl = new qx.ui.table.Table(tableModel);


	doc.add(tbl, {left: 10, top: 10});
	
	
	var a = [
		{reparacion: "repa 01", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 02", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 03", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 04", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 05", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 06", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 07", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 08", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 09", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 10", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 11", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 12", costo: 0.0, cantidad: 0, total: 0.0},
		{reparacion: "repa 13", costo: 0.0, cantidad: 0, total: 0.0}
	];
	
	tableModel.setDataAsMapArray(a, true);


    }
  }
});
