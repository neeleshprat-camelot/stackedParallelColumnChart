define([], function() {
	var previewData = {
		cross: {
			"data": {
				"analysisAxis": [{
					"index": 1,
					"data": [{
						"type": "Dimension",
						"name": "Year (TD)",
						"values": ["2016", "2016", "2016"]
					}, {
						"type": "Dimension",
						"name": "Time Division",
						"values": [".YTD", "FC+3", "FC+6"]
					}]
				}],
				"measureValuesGroup": [{
					"index": 1,
					"data": [{
						"type": "Measure",
						"name": "Capacity",
						"values": [
							[21932.775, 11006.05, 9220.1]
						]
					}]
				}, {
					"index": 2,
					"data": [{
						"type": "Measure",
						"name": "Forecast (excl. Opp.)",
						"values": [
							[2963.267, 2265.75, 1008.75]
						]
					}, {
						"type": "Measure",
						"name": "Opportunities",
						"values": [
							[0, 631.184, 1362.566]
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
					"name": "Month (TD)",
					"value": "{Month (TD)}"
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
				"values": ["Year (TD)", "Time Division", "Month (TD)"]
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
					"Month (TD)": "April",
					"Time Division": ".YTD",
					"Year (TD)": "2016",
					"Capacity": 3932.775,
					"Forecast (excl. Opp.)": 2963.267,
					"Opportunities": 0
				}, {
					"Month (TD)": "August",
					"Time Division": "FC+3",
					"Year (TD)": "2016",
					"Capacity": 4006.05,
					"Forecast (excl. Opp.)": 2265.75,
					"Opportunities": 631.184
				}, {
					"Month (TD)": "Dezember",
					"Time Division": "FC+6",
					"Year (TD)": "2016",
					"Capacity": 4220.1,
					"Forecast (excl. Opp.)": 1008.75,
					"Opportunities": 1362.566
				}, {
					"Month (TD)": "Februar",
					"Time Division": ".YTD",
					"Year (TD)": "2016",
					"Capacity": 3840.149,
					"Forecast (excl. Opp.)": 2865.148,
					"Opportunities": 0
				}, {
					"Month (TD)": "Januar",
					"Time Division": ".YTD",
					"Year (TD)": "2016",
					"Capacity": 2971.575,
					"Forecast (excl. Opp.)": 2286.356,
					"Opportunities": 0
				}, {
					"Month (TD)": "Juli",
					"Time Division": "FC+3",
					"Year (TD)": "2016",
					"Capacity": 3843.85,
					"Forecast (excl. Opp.)": 2841.175,
					"Opportunities": 326.364
				}, {
					"Month (TD)": "Juni",
					"Time Division": ".YTD",
					"Year (TD)": "2016",
					"Capacity": 4040.175,
					"Forecast (excl. Opp.)": 2859.279,
					"Opportunities": 16
				}, {
					"Month (TD)": "Mai",
					"Time Division": ".YTD",
					"Year (TD)": "2016",
					"Capacity": 2986.2,
					"Forecast (excl. Opp.)": 2560.216,
					"Opportunities": 0
				}, {
					"Month (TD)": "März",
					"Time Division": ".YTD",
					"Year (TD)": "2016",
					"Capacity": 3392.35,
					"Forecast (excl. Opp.)": 2905.04,
					"Opportunities": 0
				}, {
					"Month (TD)": "November",
					"Time Division": "FC+6",
					"Year (TD)": "2016",
					"Capacity": 4347.1,
					"Forecast (excl. Opp.)": 1147.75,
					"Opportunities": 1460.607
				}, {
					"Month (TD)": "Oktober",
					"Time Division": "FC+6",
					"Year (TD)": "2016",
					"Capacity": 4053,
					"Forecast (excl. Opp.)": 1347.25,
					"Opportunities": 1824.761
				}, {
					"Month (TD)": "Septeber",
					"Time Division": "FC+3",
					"Year (TD)": "2016",
					"Capacity": 4181.95,
					"Forecast (excl. Opp.)": 1763.5,
					"Opportunities": 957.905
				}]
			}
		}
	};
	return previewData;
});