qx.Class.define("elpintao_mob.comp.navpageRecibir",
{
  extend : qx.ui.mobile.page.NavigationPage,
  construct : function (pedido, pageBack)
  {
	this.base(arguments);

	this.setTitle("Recibir pedido - " + pedido.fecha + ", " + pedido.fabrica);
	this.setShowBackButton(true);
	this.setBackButtonText("Atras");
	this.addListener("appear", function() {
		this.application.apilarHashChange(this, qx.lang.Function.bind(function(){
			this.dialogMenu.hide();
			pageBack.show({reverse:true});
		}, this));
	}, this);
	this.addListener("back", function(e) {
		this.application.desapilarHashChange(this);
	}, this);
	
	this.application = qx.core.Init.getApplication();
	this.pedido = pedido;
  },
  members : 
  {
	_initialize : function()
	{
		
	this.base(arguments);
	
    var btnOpciones = new qx.ui.mobile.form.Button("Opciones");
    btnOpciones.addListener("tap", function() {
		dialogMenu.show();
    });
    
    this.getContent().add(new qx.ui.mobile.form.Group([btnOpciones]));
    
    var dialogMenu = this.dialogMenu = new qx.ui.mobile.dialog.Menu(new qx.data.Array(["Agregar item...", "Guardar"]), btnOpciones);
    dialogMenu.setTitle("Opciones");
    dialogMenu.addListener("changeSelection", function(e){
    	var data = e.getData();
    	dialogMenu.hide();
    	dialogMenu.setSelectedIndex(null);
    	if (data.index==0) {

    	} else if (data.index==1) {
			var item;
			var model = list.getModel();
			var bandera = false;
			var p = {};
			p.id_pedido_ext = this.pedido.id_pedido_ext;
			p.detalle = [];
			
			for (var x = 0; x < model.length; x++) {
				item = model.getItem(x);
				if (item.total > 0) {
					p.detalle.push(item);
					bandera = true;
				}
			}
	
			if (bandera) {
				var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.PedidosExt");
				try {
					var resultado = rpc.callSync("recibir_pedido", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				this.application.pageMainPE.actualizar();
				this.fireDataEvent("back");
			} else {
				var dialogAlert = qx.ui.mobile.dialog.Manager.getInstance().alert("Atención", "Debe ingresar alguna cantidad recibida.", function(index){
					this.application.desapilarHashChange(dialogAlert);
				}, this, "Aceptar");
				this.application.apilarHashChange(dialogAlert, qx.lang.Function.bind(function(){
					this.hide();
				}, dialogAlert));
			}
    	}
	}, this);
	
	

    this.getContent().add(new qx.ui.mobile.form.Title("Detalle"));
	
	var list = this.list = new qx.ui.mobile.list.List({
		configureItem : function(item, data, row) {
			item.setTitle(data.producto + ", " + data.color + ", " + data.capacidad + " " + data.unidad);
			item.setSubtitle("Cantidad: " + data.cantidad + ", Total: " + data.total);
			item.setSelectable(true);
			item.setShowArrow(true);
		}
	});
	list.addListener("changeSelection", function(e) {
		var data = e.getData();
		var item = list.getModel().getItem(data);
		
		var composite = new qx.ui.mobile.container.Composite();
		
		var form = new qx.ui.mobile.form.Form();
		var txtCantidad = new qx.ui.mobile.form.NumberField("");
		form.add(txtCantidad, "Ingresar:");
		var r = new qx.ui.mobile.form.renderer.Single(form);
		r.addCssClass("group");
		qx.bom.element.Style.set(r.getContentElement(),"color","black");
		composite.add(r);
		
		var btnAceptar = new qx.ui.mobile.form.Button("Aceptar");
		btnAceptar.addListener("tap", function(e){
			var value = txtCantidad.getValue().trim();
			if (value!="" && !isNaN(value)) item.total = item.total + parseInt(value);
			if (item.total < 0) item.total = 0;

			list.getModel().removeAt(data);
			list.getModel().insertAt(data, item);
			
			this.application.desapilarHashChange(dialog);
		}, this);
		composite.add(btnAceptar);
		
		var dialog = new qx.ui.mobile.dialog.Popup(composite);
		dialog.setModal(true);
		dialog.setTitle(" " + item.producto + ", " + item.color + ", " + item.capacidad + " " + item.unidad + " ");
		dialog.addListenerOnce("appear", function(e){
			txtCantidad.focus();
		})
		dialog.show();
		this.application.apilarHashChange(dialog, qx.lang.Function.bind(function(){
			this.hide();
			this.destroy();
		}, dialog));
	}, this);
	
	this.getContent().add(list);
	
	for (var x in this.pedido.detalle) this.pedido.detalle[x].total = 0;
	list.setModel(new qx.data.Array(this.pedido.detalle));
	
	
	}
  }
});