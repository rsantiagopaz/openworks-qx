qx.Class.define("turismo.comp.stackDatoProducto",
{
	extend : qx.ui.container.Stack,
	construct : function ()
	{
	this.base(arguments);


	
	var datos = this.datos = {};
	var tabOrder = this.tabOrder = [];
	
	var formItem;
	var form;
	var formView;
	
	datos["0"] = {};
	form = new qx.ui.form.Form();
	
	formItem = new qx.ui.form.SelectBox();
	formItem.add(new qx.ui.form.ListItem("Mayorista 1"));
	formItem.add(new qx.ui.form.ListItem("Mayorista 2"));
	formItem.add(new qx.ui.form.ListItem("Mayorista 3"));
	//form.add(formItem, "Operador", null, "mayorista", null, {grupo: 0, item: {row: 0, column: 1, colSpan: 4}});
	tabOrder.push(formItem);
	
	formItem = new qx.ui.form.SelectBox();
	formItem.add(new qx.ui.form.ListItem("Linea aerea 1"));
	formItem.add(new qx.ui.form.ListItem("Linea aerea 2"));
	formItem.add(new qx.ui.form.ListItem("Linea aerea 3"));
	//form.add(formItem, "Operador", null, "linea_aerea", null, {grupo: 0, item: {row: 1, column: 1, colSpan: 4}});
	tabOrder.push(formItem);
	
	
	
	var txtIdaOrigen = new qx.ui.form.TextField("");
	form.add(txtIdaOrigen, "Origen", null, "ida_origen", null, {grupo: 0, item: {row: 2, column: 5, colSpan: 2}});
	tabOrder.push(txtIdaOrigen);
	
	var txtIdaTramos = new qx.ui.form.TextField("");
	form.add(txtIdaTramos, "Tramos", null, "ida_tramos", null, {grupo: 0, item: {row: 2, column: 8, colSpan: 2}});
	tabOrder.push(txtIdaTramos);
	
	var txtIdaDestino = new qx.ui.form.TextField("");
	form.add(txtIdaDestino, "Destino", null, "ida_destino", null, {grupo: 0, item: {row: 2, column: 11, colSpan: 2}});
	tabOrder.push(txtIdaDestino);
	
	var txtIdaDuracion = new qx.ui.form.TextField("");
	form.add(txtIdaDuracion, "Duración", null, "ida_duracion", null, {grupo: 0, item: {row: 2, column: 14, colSpan: 2}});
	tabOrder.push(txtIdaDuracion);
	

	
	var chkVuelta = new qx.ui.form.CheckBox("Vuelta");
	form.add(chkVuelta, "", null, "vuelta", null, {grupo: 0, item: {row: 3, column: 1, colSpan: 3}});
	tabOrder.push(chkVuelta);
	
	var txtVueltaOrigen = new qx.ui.form.TextField("");
	form.add(txtVueltaOrigen, "Origen", null, "vuelta_origen", null, {grupo: 0, item: {row: 3, column: 5, colSpan: 2}});
	tabOrder.push(txtVueltaOrigen);
	
	var txtVueltaTramos = new qx.ui.form.TextField("");
	form.add(txtVueltaTramos, "Tramos", null, "vuelta_tramos", null, {grupo: 0, item: {row: 3, column: 8, colSpan: 2}});
	tabOrder.push(txtVueltaTramos);
	
	var txtVueltaDestino = new qx.ui.form.TextField("");
	form.add(txtVueltaDestino, "Destino", null, "vuelta_destino", null, {grupo: 0, item: {row: 3, column: 11, colSpan: 2}});
	tabOrder.push(txtVueltaDestino);
	
	var txtVueltaDuracion = new qx.ui.form.TextField("");
	form.add(txtVueltaDuracion, "Duración", null, "vuelta_duracion", null, {grupo: 0, item: {row: 3, column: 14, colSpan: 2}});
	tabOrder.push(txtVueltaDuracion);
	
	
	chkVuelta.bind("value", txtVueltaOrigen, "enabled");
	chkVuelta.bind("value", txtVueltaTramos, "enabled");
	chkVuelta.bind("value", txtVueltaDestino, "enabled");
	chkVuelta.bind("value", txtVueltaDuracion, "enabled");
	
	chkVuelta.setValue(true);
		
		
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Dolar tomado", null, "dolar_tomado", null, {grupo: 0, item: {row: 4, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Precio dolares", null, "precio_dolares", null, {grupo: 0, item: {row: 5, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Comisión", null, "comision", null, {grupo: 0, item: {row: 6, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Total", null, "total", null, {grupo: 0, item: {row: 7, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	
	formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 10, 20, 0);
	formView._add(new qx.ui.basic.Label("Ida"), {row: 2, column: 1});
		
	datos["0"].stack = formView;
	datos["0"].form = form;
	datos["0"].controller = new qx.data.controller.Form(null, form);
	
	this.add(formView);
	
	
	
	
	
	datos["1"] = {};
	form = new qx.ui.form.Form();
	
	var formItem = new qx.ui.form.TextField("");
	form.add(formItem, "Hotel", null, "hotel", null, {grupo: 0, item: {row: 0, column: 1, colSpan: 5}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.TextField("");
	form.add(formItem, "Estrellas", null, "estrellas", null, {grupo: 0, item: {row: 0, column: 7, colSpan: 2}});
	tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	form.add(formItem, "Cant.habitac.", null, "cant_habitac", null, {grupo: 0, item: {row: 0, column: 10, colSpan: 2}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.DateField();
	form.add(formItem, "Check-in", null, "check_in", null, {grupo: 0, item: {row: 1, column: 1, colSpan: 3}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.DateField();
	form.add(formItem, "Check-out", null, "check_out", null, {grupo: 0, item: {row: 1, column: 5, colSpan: 3}});
	tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	form.add(formItem, "Cant.noches", null, "cant_noches", null, {grupo: 0, item: {row: 2, column: 1, colSpan: 2}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.CheckBox();
	form.add(formItem, "Desayuno", null, "desayuno", null, {grupo: 0, item: {row: 2, column: 4, colSpan: 2}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.TextField("");
	form.add(formItem, "Otros", null, "otros", null, {grupo: 0, item: {row: 3, column: 1, colSpan: 4}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.TextField("");
	form.add(formItem, "Operator", null, "operator", null, {grupo: 0, item: {row: 3, column: 6, colSpan: 2}});
	tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Dolar tomado", null, "dolar_tomado", null, {grupo: 0, item: {row: 4, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Precio dolares", null, "precio_dolares", null, {grupo: 0, item: {row: 5, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Comisión", null, "comision", null, {grupo: 0, item: {row: 6, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Total", null, "total", null, {grupo: 0, item: {row: 7, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);

	
	formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 10, 20, 0);
		
	datos["1"].stack = formView;
	datos["1"].form = form;
	datos["1"].controller = new qx.data.controller.Form(null, form);
	
	this.add(formView);
	

	
	
	
	datos["2"] = {};
	form = new qx.ui.form.Form();
	
	var formItem = new qx.ui.form.TextField("");
	form.add(formItem, "Operador", null, "operador", null, {grupo: 0, item: {row: 0, column: 1, colSpan: 4}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.TextField("");
	form.add(formItem, "Empresa", null, "empresa", null, {grupo: 0, item: {row: 1, column: 1, colSpan: 4}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.DateField();
	form.add(formItem, "F.recogida", null, "f_recogida", null, {grupo: 0, item: {row: 2, column: 1, colSpan: 4}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.DateField();
	form.add(formItem, "F.devolución", null, "f_devolucion", null, {grupo: 0, item: {row: 2, column: 6, colSpan: 4}});
	tabOrder.push(formItem);
	
	formItem = new qx.ui.form.SelectBox();
	formItem.add(new qx.ui.form.ListItem("Economy"));
	formItem.add(new qx.ui.form.ListItem("Mini"));
	formItem.add(new qx.ui.form.ListItem("Compact"));
	formItem.add(new qx.ui.form.ListItem("Intermediate"));
	form.add(formItem, "Categoría", null, "categoria", null, {grupo: 0, item: {row: 3, column: 1, colSpan: 4}});
	tabOrder.push(formItem);
	
	var formItem = new qx.ui.form.TextField("");
	form.add(formItem, "Descripción", null, "descrip", null, {grupo: 0, item: {row: 3, column: 6, colSpan: 4}});
	tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Dolar tomado", null, "dolar_tomado", null, {grupo: 0, item: {row: 4, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Precio dolares", null, "precio_dolares", null, {grupo: 0, item: {row: 5, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Comisión", null, "comision", null, {grupo: 0, item: {row: 6, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);
	
	formItem = new qx.ui.form.Spinner();
	formItem.getChildControl("upbutton").setVisibility("excluded");
	formItem.getChildControl("downbutton").setVisibility("excluded");
	formItem.setSingleStep(0);
	formItem.setPageStep(0);
	//form.add(formItem, "Total", null, "total", null, {grupo: 0, item: {row: 7, column: 1, colSpan: 2}});
	//tabOrder.push(formItem);

	
	formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 10, 20, 0);
		
	datos["2"].stack = formView;
	datos["2"].form = form;
	datos["2"].controller = new qx.data.controller.Form(null, form);
	
	this.add(formView);
	
	
	},
	members : 
	{
		arreglarTabIndex: function(value) {
			for (var x in this.tabOrder) {
				this.tabOrder[x].setTabIndex(value);
				value+= 1;
			}
		}
	}
});