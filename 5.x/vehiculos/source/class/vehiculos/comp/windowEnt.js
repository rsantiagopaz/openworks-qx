qx.Class.define("vehiculos.comp.windowEnt",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Entrada",
		width: 400,
		height: 400,
		showMinimize: false,
		showMaximize: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		this.setCaption("Entrada, " + application.vehiculo.nro_patente + "  " + application.vehiculo.marca);
		cboReparacion.focus();
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
	
	var txtObserva_ent = new qx.ui.form.TextArea("");
	txtObserva_ent.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtObserva_ent, "Observaciones", null, "observa_ent", null, {grupo: 1, item: {row: 7, column: 1, colSpan: 11}});
	
	var txtResp_ent = new qx.ui.form.TextField("");
	form.add(txtResp_ent, "Responsable", null, "resp_ent", null, {grupo: 1, item: {row: 8, column: 1, colSpan: 11}});
	

	
	form.getValidationManager().setValidator(function(items) {
		var bandera = true;
		
		if (lstTipo_reparacion.isSelectionEmpty() && txtObserva_ent.getValue()=="") {
			lstTipo_reparacion.setInvalidMessage("Debe ingresar observaciones y/o reparaciones")
			txtObserva_ent.setInvalidMessage("Debe ingresar observaciones y/o reparaciones")
			lstTipo_reparacion.setValid(false);
			txtObserva_ent.setValid(false);
			
			bandera = false;
		}
		
		return bandera;
	});
	

	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 20, 20, 1);
	//var formView = new qx.ui.form.renderer.Single(form);
	this.add(formView, {left: 0, top: 0});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			var p = {};
			p.id_vehiculo = application.vehiculo.id_vehiculo;
			p.resp_ent = txtResp_ent.getValue();
			p.observa = txtObserva_ent.getValue();
			p.tipo_reparacion = [];
			
			var children = lstTipo_reparacion.getChildren();
			for (var x in children) {
				p.tipo_reparacion.push(children[x].getModel());
			}
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Vehiculo");
			rpc.callAsync(qx.lang.Function.bind(function(resultado, error, id) {
				btnCancelar.execute();
				
				this.fireDataEvent("aceptado", resultado);
			}, this), "entrada_vehiculo", p);
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
	
	
	
	cboReparacion.setTabIndex(1);
	btnAgregar.setTabIndex(2);
	lstTipo_reparacion.setTabIndex(3);
	txtObserva_ent.setTabIndex(4);
	txtResp_ent.setTabIndex(5);
	btnAceptar.setTabIndex(6);
	btnCancelar.setTabIndex(7);
	
	
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});