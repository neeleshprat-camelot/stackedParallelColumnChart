define([], function() {
	var previewData = {
		cross: {
			"data": {
				"analysisAxis": [{
					"index": 1,
					"data": [{
						"type": "Dimension",
						"name": "Year (TD)",
						"values": ["2016", "2016", "2016", "2016", "2016", "2016", "2016", "2016", "2016", "2016", "2016", "2016", "2017"]
					}, {
						"type": "Dimension",
						"name": "Time Division",
						"values": [".YTD", ".YTD", ".YTD", ".YTD", ".YTD", ".YTD", "FC+3", "FC+3", "FC+3", "FC+6", "FC+6", "FC+6", "FC+6"]
					}, {
						"type": "Dimension",
						"name": "Month (TD) (2)",
						"values": ["April", "Februar", "Januar", "Juni", "Mai", "März", "August", "Juli", "Septeber", "Dezember", "November",
							"Oktober", "Januar"
						]
					}]
				}],
				"measureValuesGroup": [{
					"index": 1,
					"data": [{
						"type": "Measure",
						"name": "Capacity",
						"values": [
							[4057.775, 3902.649, 2971.575, 4250.675, 3090.7, 3524.35, 4122.05, 3976.35, 4322.7, 4363.1, 4490.1, 4165, 4165]
						]
					}]
				}, {
					"index": 2,
					"data": [{
						"type": "Measure",
						"name": "Forecast (excl. Opp.)",
						"values": [
							[2963.267, 2865.148, 2286.356, 2859.279, 2560.216, 2905.04, 2716, 2424, 2725, 2743, 2835, 2778, 2778]
						]
					}, {
						"type": "Measure",
						"name": "Opportunities",
						"values": [
							[0, 0, 0, 0, 0, 0, 822.303, 473.566, 964.858, 1513.019, 1566.644, 1874.048, 1874.048]
						]
					}]
				}]
			},
			"bindings": [{
				"feed": "camelot.viz.ext.stackedparallelcolumnchart.PlotModule.DS1",
				"source": [{
					"type": "analysisAxis",
					"index": 1
				}]
			}, {
				"feed": "camelot.viz.ext.stackedparallelcolumnchart.PlotModule.MS1",
				"source": [{
					"type": "measureValuesGroup",
					"index": 1
				}]
			}, {
				"feed": "camelot.viz.ext.stackedparallelcolumnchart.PlotModule.MS2",
				"source": [{
					"type": "measureValuesGroup",
					"index": 2
				}]
			}]
		},
		flat: {
			"metadata": {
				"dimensions": [{
					"name": "Year (TD)",
					"value": "{Year (TD)}"
				}, {
					"name": "Time Division",
					"value": "{Time Division}"
				}, {
					"name": "Month (TD) (2)",
					"value": "{Month (TD) (2)}"
				}],
				"measures": [{
					"name": "Capacity",
					"value": "{Capacity}"
				}, {
					"name": "Forecast (excl. Opp.)",
					"value": "{Forecast (excl. Opp.)}"
				}, {
					"name": "Opportunities",
					"value": "{Opportunities}"
				}],
				"data": {
					"path": "/data"
				}
			},
			"feedItems": [{
				"uid": "camelot.viz.ext.stackedparallelcolumnchart.PlotModule.DS1",
				"type": "Dimension",
				"values": ["Year (TD)", "Time Division", "Month (TD) (2)"]
			}, {
				"uid": "camelot.viz.ext.stackedparallelcolumnchart.PlotModule.MS1",
				"type": "Measure",
				"values": ["Capacity"]
			}, {
				"uid": "camelot.viz.ext.stackedparallelcolumnchart.PlotModule.MS2",
				"type": "Measure",
				"values": ["Forecast (excl. Opp.)", "Opportunities"]
			}],
			"data": {
				"data": [{
					"Time Division": ".YTD",
					"Month (TD) (2)": "April",
					"Year (TD)": "2016",
					"Capacity": 4057.775,
					"Forecast (excl. Opp.)": 2963.267,
					"Opportunities": 0
				}, {
					"Time Division": ".YTD",
					"Month (TD) (2)": "Februar",
					"Year (TD)": "2016",
					"Capacity": 3902.649,
					"Forecast (excl. Opp.)": 2865.148,
					"Opportunities": 0
				}, {
					"Time Division": ".YTD",
					"Month (TD) (2)": "Januar",
					"Year (TD)": "2016",
					"Capacity": 2971.575,
					"Forecast (excl. Opp.)": 2286.356,
					"Opportunities": 0
				}, {
					"Time Division": ".YTD",
					"Month (TD) (2)": "Juni",
					"Year (TD)": "2016",
					"Capacity": 4250.675,
					"Forecast (excl. Opp.)": 2859.279,
					"Opportunities": 0
				}, {
					"Time Division": ".YTD",
					"Month (TD) (2)": "Mai",
					"Year (TD)": "2016",
					"Capacity": 3090.7,
					"Forecast (excl. Opp.)": 2560.216,
					"Opportunities": 0
				}, {
					"Time Division": ".YTD",
					"Month (TD) (2)": "März",
					"Year (TD)": "2016",
					"Capacity": 3524.35,
					"Forecast (excl. Opp.)": 2905.04,
					"Opportunities": 0
				}, {
					"Time Division": "FC+3",
					"Month (TD) (2)": "August",
					"Year (TD)": "2016",
					"Capacity": 4122.05,
					"Forecast (excl. Opp.)": 2716,
					"Opportunities": 822.303
				}, {
					"Time Division": "FC+3",
					"Month (TD) (2)": "Juli",
					"Year (TD)": "2016",
					"Capacity": 3976.35,
					"Forecast (excl. Opp.)": 2424,
					"Opportunities": 473.566
				}, {
					"Time Division": "FC+3",
					"Month (TD) (2)": "Septeber",
					"Year (TD)": "2016",
					"Capacity": 4322.7,
					"Forecast (excl. Opp.)": 2725,
					"Opportunities": 964.858
				}, {
					"Time Division": "FC+6",
					"Month (TD) (2)": "Dezember",
					"Year (TD)": "2016",
					"Capacity": 4363.1,
					"Forecast (excl. Opp.)": 2743,
					"Opportunities": 1513.019
				}, {
					"Time Division": "FC+6",
					"Month (TD) (2)": "November",
					"Year (TD)": "2016",
					"Capacity": 4490.1,
					"Forecast (excl. Opp.)": 2835,
					"Opportunities": 1566.644
				}, {
					"Time Division": "FC+6",
					"Month (TD) (2)": "Oktober",
					"Year (TD)": "2016",
					"Capacity": 4165,
					"Forecast (excl. Opp.)": 2778,
					"Opportunities": 1874.048
				}, {
					"Time Division": "FC+6",
					"Month (TD) (2)": "Januar",
					"Year (TD)": "2017",
					"Capacity": 4165,
					"Forecast (excl. Opp.)": 2778,
					"Opportunities": 1874.048
				}]
			}
		}
	};
	return previewData;
});