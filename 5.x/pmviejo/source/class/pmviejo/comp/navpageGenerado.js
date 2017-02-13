qx.Class.define("elpintao_mob.comp.navpageGenerado",
{
  extend : qx.ui.mobile.page.NavigationPage,
  construct : function (ingresos, pageBack)
  {
	this.base(arguments);

	this.setTitle("Resumen pedido");
	this.setShowBackButton(true);
	this.setBackButtonText("Atras");
	this.addListener("appear", function() {
		this.application.apilarHashChange(this, qx.lang.Function.bind(function(){
			this.dialogMenu.hide();
			pageBack.show({reverse:true});
		}, this));
	}, this);
	this.addListener("back", function() {
		this.application.desapilarHashChange(this);
	}, this);
	
	this.ingresos = ingresos;
	
	this.application = qx.core.Init.getApplication();
	this.pageBack = pageBack;
  },
  members : 
  {
	_initialize : function()
	{
	this.base(arguments);
	
	var detalle;
	
    var btnOpciones = new qx.ui.mobile.form.Button("Opciones");
    btnOpciones.addListener("tap", function() {
		dialogMenu.show();
    });
    
    this.getContent().add(new qx.ui.mobile.form.Group([btnOpciones]));
    
    var dialogMenu = this.dialogMenu = new qx.ui.mobile.dialog.Menu(new qx.data.Array(["Generar"]), btnOpciones);
    dialogMenu.setTitle("Opciones");
    dialogMenu.addListener("changeSelection", function(e){
    	var data = e.getData();
    	dialogMenu.hide();
    	dialogMenu.setSelectedIndex(null);
    	if (data.index==0) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(controllerForm.createModel(true));
			p.model.id_transporte = this.transporte[slbTransporte.getSelection()].id_transporte;
			p.id_fabrica = detalle[0].id_fabrica;
			p.detalle = detalle;
			
			var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.PedidosExt");
			try {
				var resultado = rpc.callSync("alta_pedido_ext", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			this.application.pageMainPE.actualizar();
			this.application.desapilarHashChange(this);
			this.application.desapilarHashChange(this.pageBack);
    	}
	}, this);
	
    this.getContent().add(new qx.ui.mobile.form.Title("Datos"));
	
	
	
    
	var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.Parametros");
	try {
		var resultado = rpc.callSync("leer_transporte");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	this.transporte = resultado;
	
	
	var form = new qx.ui.mobile.form.Form();
	
	var txtTelefono = new qx.ui.mobile.form.TextField("");
	form.add(txtTelefono, "Teléfono", null, "telefono");

	var txtEmail = new qx.ui.mobile.form.TextField("");
	form.add(txtEmail, "E-mail", null, "email");

	var txtDomEntrega = new qx.ui.mobile.form.TextField("");
	form.add(txtDomEntrega, "Dom.entrega", null, "domicilio");

	var slbTransporte = new qx.ui.mobile.form.SelectBox();
	slbTransporte.setModel(new qx.data.Array([]));
	for (var x in this.transporte) slbTransporte.getModel().push(this.transporte[x].descrip);
	slbTransporte.setSelection(0);
	form.add(slbTransporte, "Transporte", null, "id_transporte")
	

	this.getContent().add(new qx.ui.mobile.form.renderer.Single(form));
	
	var controllerForm = new qx.data.controller.Form(null, form);

	this.getContent().add(new qx.ui.mobile.form.Title("Detalle"));
	
	var rpc = new qx.io.remote.Rpc("services/", "elpintao_mob.PedidosExt");
	try {
		var resultado = rpc.callSync("leer_generado", {ingresos: this.ingresos});
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
	detalle = resultado;
	
	var h = '<table border="1" width="100%" cellpadding="40"><tr><th>Producto</th><th>Cantidad</th></tr>';
	for (var x in detalle) {
		h += '<tr><td>' + detalle[x].fabrica + ", " + detalle[x].producto + " " + detalle[x].color + " " + detalle[x].capacidad + " " + detalle[x].unidad + '</td><td align="right">' + detalle[x].cantidad + '</td></tr>';
	}
	h += '</table>';

	
	var lbl = new qx.ui.mobile.embed.Html(h);
	
	var group = new qx.ui.mobile.form.Group([lbl]);
	this.getContent().add(group);
	}
  }
});