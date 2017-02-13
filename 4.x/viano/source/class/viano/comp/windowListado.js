qx.Class.define("viano.comp.windowListado",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Listado",
		width: 500,
		height: 200,
		allowGrowX: false,
		allowGrowY: false,
		allowMaximize: false,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		
	});
		
		

	var rbt1 = new qx.ui.form.RadioButton("Consumo x Producto");
	var rbt2 = new qx.ui.form.RadioButton("Stock");
	var rbt3 = new qx.ui.form.RadioButton("Producto en falta");
	
	var mgr = new qx.ui.form.RadioGroup();
	mgr.add(rbt1, rbt2, rbt3);
	mgr.addListener("changeSelection", function(e){
		
	});
	
	
	this.add(rbt1, {left: 0, top: 0});
	this.add(rbt2, {left: 0, top: 30});
	this.add(rbt3, {left: 0, top: 60});
	
	var dtfDesde = new componente.comp.ui.ramon.datefield.DateField();
	dtfDesde.setValue(new Date);
	dtfDesde.setWidth(100);
	dtfDesde.setInvalidMessage("Debe ingresar una fecha válida");
	var dtfHasta = new componente.comp.ui.ramon.datefield.DateField();
	dtfHasta.setValue(new Date);
	dtfHasta.setWidth(100);
	dtfHasta.setInvalidMessage("Debe ingresar una fecha válida");
	
	this.add(new qx.ui.basic.Label("Desde:"), {left: 150, top: 0});
	this.add(dtfDesde, {left: 200, top: 0});
	this.add(new qx.ui.basic.Label("Hasta:"), {left: 320, top: 0});
	this.add(dtfHasta, {left: 370, top: 0});
	
	rbt1.bind("value", dtfDesde, "enabled");
	rbt1.bind("value", dtfHasta, "enabled");
		


		
	var btnAceptar = new qx.ui.form.Button("Ver");
	btnAceptar.addListener("execute", function(e){
		dtfDesde.setValid(true);
		dtfHasta.setValid(true);
		
		if (rbt1.getValue()) {
			var bandera = true;

			if (dtfDesde.getValue() == null) {
				bandera = false;
				dtfDesde.setValid(false);
				dtfDesde.focus();
			} else if (dtfHasta.getValue() == null) {
				bandera = false;
				dtfHasta.setValid(false);
				dtfHasta.focus();
			}

			if (bandera) window.open("services/class/comp/Impresion.php?rutina=consumo_producto&desde=" + dtfDesde.getValue().toJSON().substr(0, 10) + " 00:00:00&hasta=" + dtfHasta.getValue().toJSON().substr(0, 10) + " 23:59:59");
		} else if (rbt2.getValue()) {
			window.open("services/class/comp/Impresion.php?rutina=stock");
		} else if (rbt3.getValue()) {
			window.open("services/class/comp/Impresion.php?rutina=producto_falta");
		}
	}, this);

	var btnCancelar = new qx.ui.form.Button("Cerrar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "35%", bottom: 0});
	this.add(btnCancelar, {right: "35%", bottom: 0});
		
		
		
		
		

	
		
		
	},
	members : 
	{

	}
});