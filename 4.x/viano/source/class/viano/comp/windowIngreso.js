qx.Class.define("viano.comp.windowIngreso",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Ingreso",
		width: 800,
		height: 650,
		showMinimize: false,
		showMaximize: true
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		cboLugar.focus();
	});
		
		

	var cboLugar = new qx.ui.form.SelectBox();

	var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("leer_ingreso_lugar");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	for (var x in resultado) {
		cboLugar.add(new qx.ui.form.ListItem(resultado[x].descrip, null, resultado[x].id_ingreso_lugar));
	}

	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setWidth(500);
	txtDescrip.setInvalidMessage("Debe ingresar descripción");
	txtDescrip.addListener("blur", function(e){
		txtDescrip.setValue(txtDescrip.getValue().trim());
	})
	
	var gpb = new qx.ui.groupbox.GroupBox("Items");
	gpb.setLayout(new qx.ui.layout.Canvas());
	gpb.setWidth(710);
	gpb.setHeight(350);
	
	var cboProducto = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Parametros", "autocompletarProducto");
	cboProducto.setWidth(300);
	cboProducto.setInvalidMessage("Debe seleccionar un producto");
	var lstFinanciador = cboProducto.getChildControl("list");
	
	var txtLote = new qx.ui.form.TextField("");
	txtLote.setWidth(130);
	txtLote.setInvalidMessage("Debe ingresar lote");
	txtLote.addListener("blur", function(e){
		txtLote.setValue(txtLote.getValue().trim());
	})
	
	var dtfF_vencimiento = new qx.ui.form.DateField();
	dtfF_vencimiento.setWidth(100);
	dtfF_vencimiento.setInvalidMessage("Debe ingresar fecha de vencimiento");
	dtfF_vencimiento.addListener("focusin", function(e) {
		window.setTimeout(function(){
			dtfF_vencimiento.getChildControl("textfield").selectAllText();
		}, 0);
	});
	
	var txtCantidad = new qx.ui.form.Spinner(1, 1, 1000);
	txtCantidad.setWidth(80);
	
	var btnAgregar = new qx.ui.form.Button("Agregar");
	btnAgregar.addListener("execute", function(e){
		var bandera = true;
		cboProducto.setValid(true);
		txtLote.setValid(true);
		dtfF_vencimiento.setValid(true);
		
		if (dtfF_vencimiento.getValue()==null) {
			bandera = false;
			dtfF_vencimiento.setValid(false);
			dtfF_vencimiento.focus();
		}
		if (txtLote.getValue()=="") {
			bandera = false;
			txtLote.setValid(false);
			txtLote.focus();
		}
		if (lstFinanciador.isSelectionEmpty()) {
			bandera = false;
			cboProducto.setValid(false);
			cboProducto.focus();
		}
		
		if (bandera) {
			var selection = lstFinanciador.getSelection()[0];
			tableModelItems.addRowsAsMapArray([{id_producto: selection.getModel(), descrip: selection.getLabel(), lote: txtLote.getValue(), f_vencimiento: dtfF_vencimiento.getValue(), cantidad: txtCantidad.getValue()}], null, true);
			tblItems.setFocusedCell(0, tableModelItems.getRowCount()-1, true);
			
			txtLote.setValue("");
			dtfF_vencimiento.setValue(new Date());
			dtfF_vencimiento.setValue(null);
			txtCantidad.setValue(1);
			cboProducto.focus();
		}
	});
	

	var aux;
	var composite = new qx.ui.container.Composite(new qx.ui.layout.HBox(2));
	
	aux = new qx.ui.container.Composite(new qx.ui.layout.VBox());
	aux.add(new qx.ui.basic.Label(" Producto"));
	aux.add(cboProducto);
	composite.add(aux, {width: "56%"});
	
	aux = new qx.ui.container.Composite(new qx.ui.layout.VBox());
	aux.add(new qx.ui.basic.Label(" Lote"));
	aux.add(txtLote);
	composite.add(aux, {width: "20%"});
	
	aux = new qx.ui.container.Composite(new qx.ui.layout.VBox());
	aux.add(new qx.ui.basic.Label(" F.vencimiento"));
	aux.add(dtfF_vencimiento);
	composite.add(aux, {width: "14%"});
	
	aux = new qx.ui.container.Composite(new qx.ui.layout.VBox());
	aux.add(new qx.ui.basic.Label(" Cantidad"));
	aux.add(txtCantidad);
	composite.add(aux, {width: "10%"});
	
	gpb.add(composite, {left: 0, top: 0, right: 0});
	
	
	//gpb.add(cboProducto, {left: 0, top: 2});
	//gpb.add(txtLote, {left: 305, top: 2});
	//gpb.add(dtfF_vencimiento, {left: 440, top: 2});
	//gpb.add(txtCantidad, {left: 545, top: 2});
	gpb.add(btnAgregar, {right: 0, top: 40});
	
	
	
	
	
	
	
	
	var commandEliminar = new qx.ui.core.Command("Del");
	commandEliminar.setEnabled(false);
	commandEliminar.addListener("execute", function(e){
		tblItems.blur();
		var focusedRow = tblItems.getFocusedRow();
		tblItems.setFocusedCell();
		tableModelItems.removeRows(focusedRow, 1);
		var rowCount = tableModelItems.getRowCount();
		if (rowCount > 0) {
			tblItems.setFocusedCell(0, ((focusedRow > rowCount - 1) ? rowCount - 1 : focusedRow), true);
			tblItems.focus();
		} else {
			cboProducto.focus();
		}
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnCambiar = new qx.ui.menu.Button("Eliminar", null, commandEliminar);
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
		//Tabla

		var tableModelItems = new qx.ui.table.model.Simple();
		tableModelItems.setColumns(["Producto", "Lote", "F.vencimiento", "Cantidad"], ["descrip", "lote", "f_vencimiento", "cantidad"]);
		//tableModel.setEditable(true);
		//tableModel.setColumnEditable(0, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tblItems = new componente.comp.ui.ramon.table.Table(tableModelItems, custom);
		tblItems.setWidth(630);
		tblItems.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		tblItems.setShowCellFocusIndicator(false);
		tblItems.toggleColumnVisibilityButtonVisible();
		tblItems.toggleStatusBarVisible();
		
		var tableColumnModel = tblItems.getTableColumnModel();
		var resizeBehavior = tableColumnModel.getBehavior();
		resizeBehavior.set(0, {width: "56%", minWidth:100});
		resizeBehavior.set(1, {width: "20%", minWidth:100});
		resizeBehavior.set(2, {width: "14%", minWidth:100});
		resizeBehavior.set(3, {width: "10%", minWidth:100});
		
		var celleditorDate = new qx.ui.table.cellrenderer.Date();
		celleditorDate.setDateFormat(new qx.util.format.DateFormat("dd/MM/yyyy"));
		tableColumnModel.setDataCellRenderer(2, celleditorDate);
		
		
		var selectionModel = tblItems.getSelectionModel();
		selectionModel.addListener("changeSelection", function(){
			var bool = (selectionModel.getSelectedCount() > 0);
			commandEliminar.setEnabled(bool);
			menu.memorizar([commandEliminar]);
		});
		

		tblItems.setContextMenu(menu);

		gpb.add(tblItems, {left: 0, top: 73, right: 0, bottom: 0});
	
	
	
	
	
	this.add(new qx.ui.basic.Label("Origen: "), {left: 0, top: 5});
	this.add(cboLugar, {left: 70, top: 0});
	this.add(new qx.ui.basic.Label("Detalle: "), {left: 0, top: 35});
	this.add(txtDescrip, {left: 70, top: 30});
	this.add(gpb, {left: 0, top: 70, right: 0, bottom: 35});
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		txtDescrip.setValid(true);
		
		if (txtDescrip.getValue()=="") {
			txtDescrip.setValid(false);
			txtDescrip.focus();
		} else if (tableModelItems.getRowCount()==0) {
			dialog.Dialog.warning("Debe agregar algún item a la tabla de items", function(e){cboProducto.focus();});
		} else {
			var p = {};
			p.id_ingreso_lugar = cboLugar.getModelSelection().getItem(0);
			p.descrip = txtDescrip.getValue();
			p.items = tableModelItems.getDataAsMapArray();
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
			try {
				var resultado = rpc.callSync("grabar_ingreso", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			btnCancelar.execute();
		}
	});
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "35%", bottom: 0});
	this.add(btnCancelar, {right: "35%", bottom: 0});
	
	
	cboLugar.setTabIndex(1);
	txtDescrip.setTabIndex(2);
	cboProducto.setTabIndex(3);
	txtLote.setTabIndex(4);
	dtfF_vencimiento.setTabIndex(5);
	txtCantidad.setTabIndex(6);
	btnAgregar.setTabIndex(7);
	tblItems.setTabIndex(8);
	btnAceptar.setTabIndex(9);
	btnCancelar.setTabIndex(10);
		
		
	},
	members : 
	{

	}
});