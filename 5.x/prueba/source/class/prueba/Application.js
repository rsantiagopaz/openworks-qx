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

      
      
      

	var commandEscape = new qx.ui.command.Command("Escape");
	commandEscape.addListener("execute", function(e){
		if (! table.isEditing()) {
			this.debug("escape");
		}
	});




function createRandomRows(rowCount) {
  var rowData = [];
  var now = new Date().getTime();
  var dateRange = 400 * 24 * 60 * 60 * 1000; // 400 days
  var nextId = 0;
  for (var row = 0; row < rowCount; row++) {
    var date = new Date(now + Math.random() * dateRange - dateRange / 2);
    rowData.push([ nextId++, Math.random() * 10000, date, (Math.random() > 0.5) ]);
  }
  return rowData;
}


// window
var win = new qx.ui.window.Window("Table").set({
  layout : new qx.ui.layout.Grow(),
  allowClose: false,
  allowMinimize: false,
  contentPadding: 0
});
this.getRoot().add(win);
win.moveTo(30, 40);
win.open();

// table model
var tableModel = new qx.ui.table.model.Simple();
tableModel.setColumns([ "ID", "A number", "A date", "Boolean" ]);
tableModel.setData(createRandomRows(1000));

// make second column editable
tableModel.setColumnEditable(1, true);

// table
var table = new qx.ui.table.Table(tableModel).set({
  decorator: null
});
table.addListener("keypress", function(e){
	this.debug("kp2");
});


win.add(table);

var tcm = table.getTableColumnModel();

// Display a checkbox in column 3
tcm.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Boolean());

// use a different header renderer
tcm.setHeaderCellRenderer(2, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", "A date"));
      
      
      
      
    }
  }
});
