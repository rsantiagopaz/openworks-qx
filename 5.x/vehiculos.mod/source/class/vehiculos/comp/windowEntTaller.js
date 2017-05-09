qx.Class.define("vehiculos.comp.windowEntTaller",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (id_entsal)
	{
	this.base(arguments);
	
	this.set({
		caption: "Entrada a taller",
		width: 800,
		height: 400,
		showMinimize: false,
		showMaximize: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		this.setCaption("Entrada a taller, " + application.vehiculo.nro_patente + "  " + application.vehiculo.marca);
		cboTaller.focus();
	}, this);
	
	
	var application = qx.core.Init.getApplication();
	
	
	
	var commandEliminar = new qx.ui.command.Command("Del");
	commandEliminar.setEnabled(false);
	commandEliminar.addListener("execute", function(e){
		var item = lstTipo_reparacion.getSelection()[0];
		var index = lstTipo_reparacion.indexOf(item);
		lstTipo_reparacion.removeAt(index);
		
		var children = lstTipo_reparacion.getChildren();
		if (children.length > 0) lstTipo_reparacion.setSelection([children[((index == children.length) ? index -1 : index)]]);
	});
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnEliminar = new qx.ui.menu.Button("Eliminar", null, commandEliminar);
	menu.add(btnEliminar);
	menu.memorizar();
	
	
	
	
	
	
	
	var form = new qx.ui.form.Form();
	
	
	var cboReparacion = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarTipoReparacion"});
	var lstReparacion = cboReparacion.getChildControl("list");
	lstReparacion.addListener("changeSelection", function(e){

	});
	form.add(cboReparacion, "Tipo reparación", null, "id_tipo_reparacion", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 11}});
	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
		var item;
		if (! lstReparacion.isSelectionEmpty()) {
			var item = lstReparacion.getSelection()[0];
			var bandera = true;
			var children = lstTipo_reparacion.getChildren();
			for (var x in children) {
				if (children[x].getModel() == item.getModel()) {
					bandera = false;
					break;
				}
			}
			if (bandera) lstTipo_reparacion.add(item);
			lstTipo_reparacion.getModelSelection().removeAll();
			lstTipo_reparacion.getModelSelection().push(item.getModel());
			
			lstReparacion.removeAll();
			cboReparacion.setValue("");
		}
		
		cboReparacion.focus();
	});
	form.addButton(btnAgregar, {grupo: 1, item: {row: 2, column: 1}})
	
	var lstTipo_reparacion = new componente.comp.ui.ramon.list.List();
	lstTipo_reparacion.setMaxHeight(100);
	lstTipo_reparacion.setContextMenu(menu);
	lstTipo_reparacion.addListener("changeSelection", function(e){
		var isSelectionEmpty = lstTipo_reparacion.isSelectionEmpty();
		
		menu.memorizarEnabled([commandEliminar], ! isSelectionEmpty);
		if (qx.ui.core.FocusHandler.getInstance().getFocusedWidget() === lstTipo_reparacion) commandEliminar.setEnabled(! isSelectionEmpty);
	});
	form.add(lstTipo_reparacion, "Reparaciones", null, "tipo_reparacion", null, {grupo: 1, item: {row: 6, column: 1, colSpan: 11}});
	
	
	var txtObserva = new qx.ui.form.TextArea("");
	form.add(txtObserva, "Observaciones", null, "observa", null, {grupo: 1, item: {row: 7, column: 1, colSpan: 11}});
	
	var cboTaller = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarTaller"});
	cboTaller.setRequired(true);
	var lstTaller = cboTaller.getChildControl("list");
	form.add(cboTaller, "Taller", function(value) {
		if (lstTaller.isSelectionEmpty()) throw new qx.core.ValidationError("Validation Error", "Debe seleccionar taller");
	}, "cod_razon_social", null, {grupo: 1, item: {row: 8, column: 1, colSpan: 11}});
	

	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 20, 20, 1);
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.id_vehiculo = application.vehiculo.id_vehiculo;
			p.id_entsal = id_entsal;
			p.cod_razon_social = lstTaller.getModelSelection().getItem(0);
			p.observa = txtObserva.getValue();
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
			rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id) {
				//alert(qx.lang.Json.stringify(resultado, null, 2));
				//alert(qx.lang.Json.stringify(error, null, 2));
				
				this.fireDataEvent("aceptado", resultado);
				
				btnCancelar.execute();
			}, this), "entrada_taller", p);
		} else {
			form.getValidationManager().getInvalidFormItems()[0].focus();
		}
	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});