qx.Class.define("prodiase_est.comp.pageParametros",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);

	this.setLabel('Parámetros');
	this.setLayout(new qx.ui.layout.Canvas());
	//this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(e){
		cgb.setValue(false);
	});
	
	
	var application = qx.core.Init.getApplication();
	



	
	var functionSeleccion = function() {
		chkSinos.setEnabled(rbtFinanciador.isValue());
		chkFecha.setEnabled(rbtFinanciador.isValue() || rbtProducto.isValue() || (cgb.getValue() && (rbtFinanciador2.isValue() || rbtProducto2.isValue())));
		lblDesde.setEnabled(chkFecha.getEnabled() && chkFecha.getValue());
		dtfDesde.setEnabled(chkFecha.getEnabled() && chkFecha.getValue());
		lblHasta.setEnabled(chkFecha.getEnabled() && chkFecha.getValue());
		dtfHasta.setEnabled(chkFecha.getEnabled() && chkFecha.getValue());
	};

	
	
	var gpb = new qx.ui.groupbox.GroupBox("Gráficos básicos");
	var cgb = new qx.ui.groupbox.CheckGroupBox("Variable");
	
	var rbtFinanciador = new qx.ui.form.RadioButton("Obra social");
	var chkSinos = new qx.ui.form.CheckBox("Incluir 'sin OS'");
	var rbtProducto = new qx.ui.form.RadioButton("Producto");
	var rbtMedico = new qx.ui.form.RadioButton("Médico");
	var rbtEtareo = new qx.ui.form.RadioButton("Grupo etáreo");
	var rbtSexo = new qx.ui.form.RadioButton("Sexo");
	
	var chkFecha = new qx.ui.form.CheckBox("Fecha");
	var lblDesde = new qx.ui.basic.Label("desde");
	var dtfDesde = new qx.ui.form.DateField();
	var lblHasta = new qx.ui.basic.Label("hasta");
	var dtfHasta = new qx.ui.form.DateField();
	
	var rbtFinanciador2 = new qx.ui.form.RadioButton("Obra social");
	var cboFinanciador = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Parametros", "autocompletarFinanciador");
	var lstFinanciador = cboFinanciador.getChildControl("list");
	var rbtProducto2 = new qx.ui.form.RadioButton("Producto");
	var cboProducto = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Parametros", "autocompletarProducto");
	var lstProducto = cboProducto.getChildControl("list");
	var rbtMedico2 = new qx.ui.form.RadioButton("Médico");
	var cboMedico = new componente.comp.ui.ramon.combobox.ComboBoxAuto("services/", "comp.Parametros", "autocompletarMedico");
	var lstMedico = cboMedico.getChildControl("list");
	var rbtEtareo2 = new qx.ui.form.RadioButton("Grupo etáreo");
	var cboEtareo = new qx.ui.form.SelectBox();
	var rbtSexo2 = new qx.ui.form.RadioButton("Sexo");
	var cboSexo = new qx.ui.form.SelectBox();
	

	
	
	
	
	
	
	
	gpb.setLayout(new qx.ui.layout.Basic());
	gpb.setWidth(220);
	gpb.setHeight(185);
	
	

	cgb.setLayout(new qx.ui.layout.Basic());
	cgb.setWidth(545);
	cgb.setHeight(185);
	cgb.addListener("changeValue", function(e){
		var data = e.getData();
		
		rbtFinanciador2.setEnabled(data && ! rbtFinanciador.isValue());
		rbtProducto2.setEnabled(data && ! rbtProducto.isValue());
		rbtMedico2.setEnabled(data && ! rbtMedico.isValue());
		rbtEtareo2.setEnabled(data && ! rbtEtareo.isValue());
		rbtSexo2.setEnabled(data && ! rbtSexo.isValue());
		
		cboFinanciador.setEnabled(data && rbtFinanciador2.isValue());
		cboProducto.setEnabled(data && rbtProducto2.isValue());
		cboMedico.setEnabled(data && rbtMedico2.isValue());
		cboEtareo.setEnabled(data && rbtEtareo2.isValue());
		cboSexo.setEnabled(data && rbtSexo2.isValue());
		
		functionSeleccion();
	});
	
	
	
	
	
	
	rbtFinanciador.setModel(1);
	rbtFinanciador.addListener("changeValue", function(e){
		if (rbtFinanciador.isValue()) {
			if (rbtFinanciador2.isValue()) rbtProducto2.setValue(true);
			if (cgb.getValue()) rbtFinanciador2.setEnabled(false);
		} else {
			if (cgb.getValue()) rbtFinanciador2.setEnabled(true);
		}
	});
	
	rbtProducto.setModel(2);
	rbtProducto.addListener("changeValue", function(e){
		if (rbtProducto.isValue()) {
			if (rbtProducto2.isValue()) rbtFinanciador2.setValue(true);
			if (cgb.getValue()) rbtProducto2.setEnabled(false);
		} else {
			if (cgb.getValue()) rbtProducto2.setEnabled(true);
		}
	});
	
	rbtMedico.setModel(3);
	rbtMedico.addListener("changeValue", function(e){
		if (rbtMedico.isValue()) {
			if (rbtMedico2.isValue()) rbtProducto2.setValue(true);
			if (cgb.getValue()) rbtMedico2.setEnabled(false);
		} else {
			if (cgb.getValue()) rbtMedico2.setEnabled(true);
		}
	});
	rbtEtareo.setModel(4);
	rbtEtareo.addListener("changeValue", function(e){
		if (rbtEtareo.isValue()) {
			if (rbtEtareo2.isValue()) rbtMedico2.setValue(true);
			if (cgb.getValue()) rbtEtareo2.setEnabled(false);
		} else {
			if (cgb.getValue()) rbtEtareo2.setEnabled(true);
		}
	});
	rbtSexo.setModel(5);
	rbtSexo.addListener("changeValue", function(e){
		if (rbtSexo.isValue()) {
			if (rbtSexo2.isValue()) rbtEtareo2.setValue(true);
			if (cgb.getValue()) rbtSexo2.setEnabled(false);
		} else {
			if (cgb.getValue()) rbtSexo2.setEnabled(true);
		}
	});

	
	
	chkFecha.addListener("changeValue", function(e){
		functionSeleccion();
	});
	var aux = new Date();
	dtfDesde.setValue(aux);
	dtfHasta.setValue(aux);


	
	
	rbtFinanciador2.setModel(1);
	rbtFinanciador2.addListener("changeValue", function(e){
		if (cgb.getValue()) cboFinanciador.setEnabled(rbtFinanciador2.isValue());
	});
	
	cboFinanciador.setWidth(400);
	
	rbtProducto2.setModel(2);
	rbtProducto2.setValue(true);
	rbtProducto2.addListener("changeValue", function(e){
		if (cgb.getValue()) cboProducto.setEnabled(rbtProducto2.isValue());
	});
	
	cboProducto.setWidth(400);
	
	rbtMedico2.setModel(3);
	rbtMedico2.addListener("changeValue", function(e){
		if (cgb.getValue()) cboMedico.setEnabled(rbtMedico2.isValue());
	});
	
	cboMedico.setWidth(400);
	
	rbtEtareo2.setModel(4);
	rbtEtareo2.addListener("changeValue", function(e){
		if (cgb.getValue()) cboEtareo.setEnabled(rbtEtareo2.isValue());
	});
	
	cboEtareo.add(new qx.ui.form.ListItem("0 - 15 años", null, "0 AND 15"));
	cboEtareo.add(new qx.ui.form.ListItem("16 - 25 años", null, "16 AND 25"));
	cboEtareo.add(new qx.ui.form.ListItem("26 - 30 años", null, "26 AND 30"));
	cboEtareo.add(new qx.ui.form.ListItem("31 - 45 años", null, "31 AND 45"));
	cboEtareo.add(new qx.ui.form.ListItem("46 - 60 años", null, "46 AND 60"));
	cboEtareo.add(new qx.ui.form.ListItem("61 - 75 años", null, "61 AND 75"));
	cboEtareo.add(new qx.ui.form.ListItem("76 - 90 años", null, "76 AND 90"));
	cboEtareo.add(new qx.ui.form.ListItem("91 - 105 años", null, "91 AND 105"));
	
	rbtSexo2.setModel(5);
	rbtSexo2.addListener("changeValue", function(e){
		if (cgb.getValue()) cboSexo.setEnabled(rbtSexo2.isValue());
	});
	
	cboSexo.add(new qx.ui.form.ListItem("Femenino", null, "F"));
	cboSexo.add(new qx.ui.form.ListItem("Masculino", null, "M"));
	
	
	var mgr = new qx.ui.form.RadioGroup();
	mgr.add(rbtFinanciador, rbtProducto, rbtMedico, rbtEtareo, rbtSexo);
	mgr.addListener("changeSelection", function(e){
		functionSeleccion();
	});
	
	var mgr2 = new qx.ui.form.RadioGroup();
	mgr2.add(rbtFinanciador2, rbtProducto2, rbtMedico2, rbtEtareo2, rbtSexo2);
	mgr2.addListener("changeSelection", function(e){
		functionSeleccion();
	});
	

	gpb.add(rbtFinanciador, {left: 0, top: 4});
	gpb.add(chkSinos, {left: 100, top: 4});
	gpb.add(rbtProducto, {left: 0, top: 34});
	gpb.add(rbtMedico, {left: 0, top: 64});
	gpb.add(rbtEtareo, {left: 0, top: 94});
	gpb.add(rbtSexo, {left: 0, top: 124});

	this.add(chkFecha, {left: 12, top: 214});
	this.add(lblDesde, {left: 85, top: 214});
	this.add(lblHasta, {left: 265, top: 214});
	this.add(dtfDesde, {left: 120, top: 210});
	this.add(dtfHasta, {left: 300, top: 210});

	cgb.add(rbtFinanciador2, {left: 0, top: 4});
	cgb.add(cboFinanciador, {left: 120, top: 0});
	cgb.add(rbtProducto2, {left: 0, top: 34});
	//rbtProducto2.setValue(true);
	cgb.add(cboProducto, {left: 120, top: 30});
	cgb.add(rbtMedico2, {left: 0, top: 64});
	cgb.add(cboMedico, {left: 120, top: 60});
	cgb.add(rbtEtareo2, {left: 0, top: 94});
	cgb.add(cboEtareo, {left: 120, top: 89});
	cgb.add(rbtSexo2, {left: 0, top: 124});
	cgb.add(cboSexo, {left: 120, top: 119});
	
	
	this.add(gpb, {left: 0, top: 0});
	this.add(cgb, {left: 250, top: 0});
	
	
	var rbtTorta = new qx.ui.form.RadioButton("Torta");
	rbtTorta.setModel("torta");
	var rbtBarras = new qx.ui.form.RadioButton("Barras");
	rbtBarras.setModel("barras");
	
	var mgr3 = new qx.ui.form.RadioGroup();
	mgr3.add(rbtTorta, rbtBarras);
	
	this.add(rbtTorta, {left: 580, top: 214});
	this.add(rbtBarras, {left: 640, top: 214});
	
	var btnGenerar = new qx.ui.form.Button("Generar gráfico")
	btnGenerar.addListener("execute", function(e){
		var bandera = true;
		cboProducto.setValid(true);
		cboMedico.setValid(true);
		dtfDesde.setValid(true);
		dtfHasta.setValid(true);

		if (chkFecha.getEnabled() && chkFecha.getValue() && dtfHasta.getValue() == null) {
			bandera = false;
			dtfHasta.setInvalidMessage("Debe ingresar una fecha correcta");
			dtfHasta.setValid(false);
			dtfHasta.focus();
		}
		if (chkFecha.getEnabled() && chkFecha.getValue() && dtfDesde.getValue() == null) {
			bandera = false;
			dtfDesde.setInvalidMessage("Debe ingresar una fecha correcta");
			dtfDesde.setValid(false);
			dtfDesde.focus();
		}
		if (cgb.getValue() && rbtMedico2.getValue() && lstMedico.isSelectionEmpty()) {
			bandera = false;
			cboMedico.setInvalidMessage("Debe seleccionar un médico");
			cboMedico.setValid(false);
			cboMedico.focus();
		}
		if (cgb.getValue() && rbtProducto2.getValue() && lstProducto.isSelectionEmpty()) {
			bandera = false;
			cboProducto.setInvalidMessage("Debe seleccionar un producto");
			cboProducto.setValid(false);
			cboProducto.focus();
		}

		if (bandera) {
			var root = application.getRoot();
			var bounds = root.getBounds();
			var imageLoading = new qx.ui.basic.Image("prodiase_est/loading66.gif");
	
			root.block();
			imageLoading.setBackgroundColor("#FFFFFF");
			imageLoading.setDecorator("main");
			root.add(imageLoading, {left: parseInt(bounds.width / 2 - 33), top: parseInt(bounds.height / 2 - 33)});
	
			
			var p = {};
			p.basico = {opcion: mgr.getModelSelection().getItem(0), sinos: chkSinos.isValue()};
			p.grafico = mgr3.getModelSelection().getItem(0);
			
			p.pageLabel = mgr.getSelection()[0].getLabel();
			
			p.title = new Date();
			p.title = p.title.toJSON().substr(0, 10);
			p.title+= " - " + p.pageLabel;
					
			if (cgb.getValue()) {
				var opcionVariable = mgr2.getModelSelection().getItem(0);
				p.variable = {opcion: opcionVariable};
				var selection;
				if (opcionVariable == 1) {
					if (lstFinanciador.isSelectionEmpty()) {
						p.variable.model = null;
						p.variable.descrip = "sin OS";
					} else {
						selection = lstFinanciador.getSelection()[0];
						p.variable.model = selection.getModel();
						p.variable.descrip = selection.getLabel();
					}
				} else if (opcionVariable == 2) {
					selection = lstProducto.getSelection()[0];
					p.variable.model = selection.getModel();
					p.variable.descrip = selection.getLabel();
				} else if (opcionVariable == 3) {
					selection = lstMedico.getSelection()[0];
					p.variable.model = selection.getModel();
					p.variable.descrip = selection.getLabel();
				} else if (opcionVariable == 4) {
					selection = cboEtareo.getSelection()[0];
					p.variable.model = selection.getModel();
					p.variable.descrip = selection.getLabel();
				} else if (opcionVariable == 5) {
					selection = cboSexo.getSelection()[0];
					p.variable.model = selection.getModel();
					p.variable.descrip = selection.getLabel();
				}
				
				p.title+= " x " + mgr2.getSelection()[0].getLabel() + ": " + p.variable.descrip.trim();
				p.pageLabel+= " x " + mgr2.getSelection()[0].getLabel();
			}
			
			if (chkFecha.getEnabled() && chkFecha.isValue()) {
				p.fecha = {desde: dtfDesde.getValue().toJSON().substr(0, 10), hasta: dtfHasta.getValue().toJSON().substr(0, 10)};
				p.title+= " (período " + p.fecha.desde + " - " + p.fecha.hasta + ")";
			}
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
			rpc.callAsync(function(resultado, error, id) {
				p.resultado = resultado;
				
				//alert(qx.lang.Json.stringify(p, null, 2));
				
				imageLoading.destroy();
				root.unblock();		
			
				if ((p.grafico == "torta" && p.resultado.dataSeries[0].length > 0) || (p.grafico == "barras" && p.resultado.dataSeries.length > 0)) {
					
					//alert(qx.lang.Json.stringify(p, null, 2));
					
					var pagePlot = new prodiase_est.comp.pagePlot(p);
					application.tabviewMain.add(pagePlot);
					application.tabviewMain.setSelection([pagePlot]);				
				} else {
					dialog.Dialog.alert("No se encuentran datos para el criterio seleccionado.");
				}
			}, "leer_datos", p);
		}
	});
	this.add(btnGenerar, {left: 700, top: 210});
	
	


		
	},
	members : 
	{

	}
});