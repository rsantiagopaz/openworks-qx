/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * Mobile page responsible for showing the different showcases.
 */
qx.Class.define("elpintao_mob.comp.Overview",
{
  extend : qx.ui.mobile.page.NavigationPage,
  //extend : elpintao_mob.comp.Toolbar,

  construct : function()
  {
    this.base(arguments);
    this.setTitle("Principal");
  },


  events :
  {
    /** The page to show */
    "show" : "qx.event.type.Data"
  },


  members :
  {
    // overridden
    _initialize : function()
    {
      this.base(arguments);
      
      var contexto = this;
      

	
	
	
      
      var list = new qx.ui.mobile.list.List({
        configureItem : function(item, data, row) {
          item.setTitle(data.title);
          item.setSubtitle(data.subtitle);
          item.setShowArrow(true);
        },
        
        configureGroupItem: function(item, data, group) {
          item.setTitle(data.title);
          item.setSelectable(false);
        },
        
        group: function(data, row) {
          var title = data.group;

          return {
            title: title
          };
        }
      });
      

      
		/*
		var pageNuevoPE = new elpintao_mob.comp.navpageNuevoPE(this);
   		this.application.manager.addDetail(pageNuevoPE);
   		pageNuevoPE.show();
   		*/

      var data = [
		{title: "Recibir", subtitle: null, path: "recibir_pedidos", group: "Pedidos externos"},
		{title: "Nuevo", subtitle: null, path: "form", group: "Pedidos externos"},
		{title: "Adicionar", subtitle: null, path: "list", group: "Stock"}
		
		

      ];

      list.setModel(new qx.data.Array(data));
      list.addListener("changeSelection", function(evt) {
        var path = data[evt.getData()].path;
        qx.core.Init.getApplication().getRouting().executeGet("/"+path);
      }, this);

      this.getContent().add(list);
      
      /*
	var toolbar = new qx.ui.mobile.toolbar.ToolBar();
	this.add(toolbar);
	
      var searchBtn = new qx.ui.mobile.toolbar.Button("Search");
      var goBackBtn = new qx.ui.mobile.toolbar.Button("Back");
      var loadButton = new qx.ui.mobile.toolbar.Button("load");
      var deleteButton = new qx.ui.mobile.toolbar.Button("Delete");

      toolbar.add(searchBtn);
      toolbar.add(goBackBtn);
      toolbar.add(loadButton);
      toolbar.add(deleteButton);
      */

    }
  }
});
