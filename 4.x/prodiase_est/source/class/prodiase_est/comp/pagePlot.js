qx.Class.define("prodiase_est.comp.pagePlot",
{
	extend : qx.ui.tabview.Page,
	construct : function (paramet)
	{
	this.base(arguments);

	this.setLabel(paramet.pageLabel);
	this.setLayout(new qx.ui.layout.Grow());
	this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(e){
		//cgb.setValue(false);
	});
	



	/*
		var plot = new qxjqplot.Plot(
                [ [4, 25, 13, 22, 14, 17, 15] ],
                {
                    title:'Dragable and Trend Line Example',
                    seriesDefaults: {
                        isDragable: true,
                        trendline: {
                            show: true
                        }
                    }
                },
                ['dragable','trendline']
        );
	*/
	

	var plot;
	
	if (paramet.grafico == "torta") {
		var options = function($jqplot){return{
		    title: paramet.title,
		    seriesDefaults:{renderer: $jqplot.PieRenderer, rendererOptions: {showDataLabels: true, dataLabelThreshold: 1, dataLabelFormatString: '%.1f%%'}},
		    legend: {show: true}
		 }};
		var plugins = ['pieRenderer'];
		
		plot = new qxjqplot.Plot(paramet.resultado.dataSeries, options, plugins);

	} else {
		var options = function($jqplot){return{
		    title: paramet.title,
		    seriesDefaults:{renderer: $jqplot.BarRenderer, pointLabels: {show: true}},
			series: paramet.resultado.series,
		    legend: {show: true},
			axes:{
				xaxis:{
					renderer: $.jqplot.CategoryAxisRenderer,
					ticks: [""]
				},
				yaxis: {
					tickOptions: {
						formatString: "%'d"
					}
				}
			}
		 }};
		var plugins = ['barRenderer', 'categoryAxisRenderer', 'pointLabels'];
		
		plot = new qxjqplot.Plot(paramet.resultado.dataSeries, options, plugins);
		
	}

	
	this.add(plot);

		
	},
	members : 
	{

	}
});