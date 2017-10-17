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

var grid = new qx.ui.layout.Grid(6, 6);
grid.setColumnFlex(0, 1);
grid.setColumnFlex(1, 1);
grid.setColumnFlex(2, 1);
grid.setColumnFlex(3, 1);
grid.setColumnFlex(4, 1);
grid.setColumnFlex(5, 1);
grid.setColumnFlex(6, 1);

grid.setRowFlex(1, 1);

// window
var win = new qx.ui.window.Window("Table").set({
  layout : grid,
  allowClose: false,
  allowMinimize: false,
  width: 600,
  height: 600,
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
var table = new componente.comp.ui.ramon.table.Table(tableModel).set({
  decorator: null
});
table.addListener("keypress", function(e){
	this.debug("kp2");
});


win.add(table, {row: 1, column: 0, colSpan: 7});

win.add(new qx.ui.form.Button("Button 1"), {row: 0, column: 0});
win.add(new qx.ui.form.Button("Button 2 Button 2"), {row: 0, column: 1});
win.add(new qx.ui.form.Button("Button 3"), {row: 0, column: 4});
win.add(new qx.ui.form.Button("Button 4 Button 4"), {row: 0, column: 6});

var tcm = table.getTableColumnModel();

// Display a checkbox in column 3
tcm.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Boolean());

// use a different header renderer
tcm.setHeaderCellRenderer(2, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", "A date"));
      
      
      
      
    }
  }
});
