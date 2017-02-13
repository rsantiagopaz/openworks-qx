qx.Class.define("turismo.comp.windowMensajes",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);
		
		this.set({
			caption: "Mensajes",
			width: 400,
			showMinimize: false,
			showMaximize: false
		});
		
	this.addListenerOnce("appear", function(e){
		list.focus();
	}, this);
		
  this.setLayout(new qx.ui.layout.Grow());
  this.setResizable(false, false, false, false);
  
  
  var application = qx.core.Init.getApplication();
  


  var commandEscape = new qx.ui.command.Command("Escape");
  commandEscape.addListener("execute", function(e){
  	this.hide();
  }, this);
  this.registrarCommand(commandEscape);
  commandEscape.setEnabled(false);



  

	var commandVerMensaje = new qx.ui.command.Command("Enter");
	commandVerMensaje.setEnabled(false);
	commandVerMensaje.addListener("execute", function(e) {

	}, this);
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	
	var btnVerMensaje = new qx.ui.menu.Button("Ver mensaje...", null, commandVerMensaje); 
	
	
	var btnEliminar = new qx.ui.menu.Button("Eliminar mensaje");
	btnEliminar.setEnabled(false);
	btnEliminar.addListener("execute", function(e){
		dialog.Dialog.confirm("Desea eliminar el mensaje seleccionado?", function(e){
			if (e) {
				var p = {id_mensaje: list.getModelSelection().getItem(0).get("id_mensaje")};

				var rpc = new qx.io.remote.Rpc("../../services/", "comp.elpintao.ramon.Productos");
				try {
					var resultado = rpc.callSync("eliminar_mensaje", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				store.reload();
			}
		});
	});
	menu.add(btnVerMensaje);
	menu.addSeparator();
	menu.add(btnEliminar);
	menu.memorizar();
  
  
  
  // create and add the list
  var list = this.list = new componente.comp.ui.ramon.list.List();
  list.setSelectionMode("one");
  list.setContextMenu(menu);
  list.addListener("changeSelection", function(e){
  	var bool = ! list.isSelectionEmpty();
  	menu.memorizarEnabled([commandVerMensaje, btnEliminar], bool);
  });
  list.addListener("dblclick", function(e){
	commandVerMensaje.execute();
  });
  this.add(list);

  // create the controller
  var controller = new qx.data.controller.List(null, list);
  // set the delegate
  controller.setDelegate({configureItem: function(item) {
	item.setRich(true);
  }});

  // set the name for the label property
  controller.setLabelPath("descrip");


  // fetch some data from Twitter
  var url = "services/class/comp/Stores.php?rutina=leer_mensaje";
  var store = new qx.data.store.Json();
  store.addListener("loaded", function(e){
  	var data = e.getData();
  	
  	if (data.getLength() > 0) {
  		application.btnMensajes.setLabel("Mensajes (" + data.getLength() + ")");
  		application.ttAlerta.placeToWidget(application.btnMensajes);
  		application.ttAlerta.show();
  	} else application.btnMensajes.setLabel("Mensajes");
  	
  	list.setSelectionMode("single");
  	list.setSelectionMode("one");
  }, this);

  // connect the store and the controller
  
  
  
  
	var timerTransmision = new qx.event.Timer(1000 * 30);
	//var timerTransmision = this.timerTransmision = new qx.event.Timer(10000);
	timerTransmision.addListener("interval", function(e){
		store.reload();
	});
	timerTransmision.start();
	
	store.bind("model", controller, "model");
	store.setUrl(url);
  
  
  },

  members : {

  }
});
