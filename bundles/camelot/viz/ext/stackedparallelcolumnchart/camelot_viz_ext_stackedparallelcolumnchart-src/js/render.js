define("camelot_viz_ext_stackedparallelcolumnchart-src/js/render", [], function() {
	/*
	 * This function is a drawing function; you should put all your drawing logic in it.
	 * it's called in moduleFunc.prototype.render
	 * @param {Object} data - proceessed dataset, check dataMapping.js
	 * @param {Object} container - the target d3.selection element of plot area
	 * @example
	 *   container size:     this.width() or this.height()
	 *   chart properties:   this.properties()
	 *   dimensions info:    data.meta.dimensions()
	 *   measures info:      data.meta.measures()
	 */
	var render = function(data, container) {

		/* -----------------------------------------------------------------Data Preparation-------------------------------------------------------------------------- */

		//get dimensions and measures from the metadata
		var dset = data.meta.dimensions('X Axis');
		var mset1 = data.meta.measures('Y Axis 1');
		var mset2 = data.meta.measures('Y Axis 2');

		var csvData = data;

		var dimName1 = dset[0];
		var dimName2 = dset[1];
		var dimName3 = dset[2];

		var monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni",
			"Juli", "August", "Septeber", "Oktober", "November", "Dezember"
		];
		var timeDivision = [".YTD", "FC+3", "FC+6"];

		function yearComparator(propYear) {
			return function(a, b) {
				return a[propYear] - b[propYear];
			};
		}

		function monthComparator(propYear, propTD, propMonth) {
			return function(a, b) {
				if (timeDivision.indexOf(a[propTD]) < timeDivision.indexOf(b[propTD])) {
					return -1;
				} else if (timeDivision.indexOf(a[propTD]) > timeDivision.indexOf(b[propTD])) {
					return 1;
				} else {
					var monthA = monthNames.indexOf(a[propMonth]);
					var dateA = new Date(a[propYear], monthA, 1);
					var monthB = monthNames.indexOf(b[propMonth]);
					var dateB = new Date(b[propYear], monthB, 1);
					return dateA - dateB; //sort by date ascending
				}
			};
		}

		function tdComparator(propYear, propTD) {
			return function(a, b) {
				if (a[propYear] < b[propYear] && timeDivision.indexOf(a[propTD]) < timeDivision.indexOf(b[propTD])) {
					return -1;
				} else {
					return 1;
				}
			};
		}

		var sortFunction;
		//sort data based on the available dimensions
		if (dimName3) {
			sortFunction = monthComparator(dimName1, dimName2, dimName3);
			csvData.sort(sortFunction);
		} else if (dimName2) {
			sortFunction = tdComparator(dimName1, dimName2);
			csvData.sort(sortFunction);
		} else {
			sortFunction = yearComparator(dimName1);
			csvData.sort(sortFunction);
		}

		/* --------------------------------------------------------------End of Data Preparation------------------------------------------------------------------- */

		/* --------------------------------------------------------------------Plot Area-------------------------------------------------------------------------- */

		//define default margin with some standard top, bottom, right, left values
		var defaultMargin = {
			top: 20,
			right: 20,
			bottom: 20,
			left: 20
		};

		//derive width and height from the default margin values
		var visWidth = this.width() - defaultMargin.left - defaultMargin.right;
		var visHeight = this.height() - defaultMargin.top - defaultMargin.bottom;
		var colorPalette = this.colorPalette();

		//remove any older svg element from the selection
		container.selectAll('svg').remove();

		//create a new svg element and a canvas 'g' with its weight and height attributes
		//this svg element contains plotArea + title + legend
		var vis = container.append('svg').attr('width', visWidth).attr('height', visWidth)
			.append('g').attr('class', 'camelot_viz_ext_stackedparallelcolumnchart_vis').attr('width', visWidth).attr('height', visWidth);

		var visMargin = {
			top: 20,
			bottom: 20,
			right: 100,
			left: 20
		};

		//define the width and height of the vis elements plotArea + title + legend
		var plotAreaWidth = visWidth - visMargin.right - visMargin.left;
		var plotAreaHeight = visHeight - visMargin.top - visMargin.bottom;

		var legendWidth = visWidth - plotAreaWidth;
		var legendHeight = visHeight - visMargin.top;

		var titleWidth = visWidth;
		var titleHeight = visMargin.top;

		//create respectice group elements for each vis element, assign them widht and height, and place them
		var visLegend = vis.append("g")
			.attr('class', 'camelot_viz_ext_stackedparallelcolumnchart_visLegend')
			.attr("width", legendWidth)
			.attr("height", legendHeight)
			.attr("transform", "translate(" + visWidth - visMargin.right + "," + visMargin.top + ")");

		var visTitle = vis.append("g")
			.attr('class', 'camelot_viz_ext_stackedparallelcolumnchart_visTitle')
			.attr("width", titleWidth)
			.attr("height", titleHeight)
			.attr("transform", "translate(" + 0 + "," + 0 + ")");

		var visPlotArea = vis.append("g")
			.attr('class', 'camelot_viz_ext_stackedparallelcolumnchart_visPlotArea')
			.attr("width", plotAreaWidth)
			.attr("height", plotAreaHeight)
			.attr("transform", "translate(" + visMargin.left + "," + visMargin.top + ")");

		//Y Axis
		//define a Y Axis scale
		var yAxisLabelMargin = 20;
		var xAxisLabelsHeight = 60;
		var yAxisRange = plotAreaHeight - xAxisLabelsHeight;
		var yAxisScale = d3.scale.linear().rangeRound([yAxisRange, 0]);
		//get the max value from all the measures
		var max = d3.max(csvData, function(d) {
			return d3.max(mset1, function(m) {
				return d[m];
			}, mset2, function(m) {
				return d[m];
			});
		});
		//assign domain with 20% for extra spacing
		yAxisScale.domain([0, max * 1.20]);

		//Y Axis Line
		var visPlotArea_Yaxis = visPlotArea
			.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis")
			.attr("transform", "translate(" + yAxisLabelMargin + "," + 0 + ")");
		visPlotArea_Yaxis.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Line")
			.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", yAxisRange);

		var numberOfTicks = max * 1.20 / yAxisScale(1000);
		var ticks = [];
		for (var i = 0; i < numberOfTicks; i++) {
			var tick = {
				id: i + 1,
				label: (i + 1).toString() + "k"
			};
			ticks.push(tick);
		}

		//Y Axis Grid Lines
		var visYAxisGridLine = visPlotArea_Yaxis.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_GridLines");
		visYAxisGridLine.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_GridLine_Line")
			.data(ticks)
			.enter().append("line")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_GridLine_Line")
			.attr("x1", 0)
			.attr("y1", function(d) {
				return yAxisScale(d.id * 1000);
			})
			.attr("x2", plotAreaWidth)
			.attr("y2", function(d) {
				return yAxisScale(d.id * 1000);
			});

		//Y Axis Ticks
		var visYAxisTicks = visPlotArea_Yaxis.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Ticks");
		visYAxisTicks.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Ticks_Line")
			.data(ticks)
			.enter().append("line")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Ticks_Line")
			.attr("x1", 0)
			.attr("y1", function(d) {
				return yAxisScale(d.id * 1000);
			})
			.attr("x2", -5)
			.attr("y2", function(d) {
				return yAxisScale(d.id * 1000);
			});

		//Y Axis Tick Labels
		var visYAxisLabels = visPlotArea_Yaxis.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Labels");
		visYAxisLabels.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Labels_Text")
			.data(ticks)
			.enter().append("text")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Labels_Text")
			.attr("x", 0 - 20)
			.attr("y", function(d) {
				return yAxisScale(d.id * 1000);
			})
			.text(function(d) {
				return d.label;
			});

		//X Axis
		//define X Axis scale

		var xAxisScaleLowestDim = d3.scale.ordinal()
			.rangeRoundBands([0, plotAreaWidth]);
		xAxisScaleLowestDim.domain(csvData.map(function(d) {
			// return d[dset[0]] + d[dset[1]] +  d[dset[2]] ;
			var cd = '';
			for (var j = 0; j < dset.length; j++) {
				cd = cd + d[dset[j]];
			}
			return cd;
		}));

		//X Axis Line
		var visPlotArea_Xaxis = visPlotArea
			.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis")
			.attr("transform", "translate(" + 20 + "," + 0 + ")");
		visPlotArea_Xaxis.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Line")
			.append("line")
			.attr("x1", 0)
			.attr("y1", plotAreaHeight - xAxisLabelsHeight)
			.attr("x2", plotAreaWidth)
			.attr("y2", plotAreaHeight - xAxisLabelsHeight);

		//X Axis Ticks
		var visXAxisTicks = visPlotArea_Yaxis.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks");
		//first tick
		visXAxisTicks
			.append("line")
			.attr("x1", 0)
			.attr("y1", plotAreaHeight - xAxisLabelsHeight)
			.attr("x2", 0)
			.attr("y2", plotAreaHeight);

		//ticks for the lowest dimension
		var visXAxisTicksLowestDim = visXAxisTicks.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks_LowestDim");
		visXAxisTicksLowestDim.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks_LowestDim")
			.data(csvData)
			.enter().append("line")
			.attr("x1", function(d) {
				var cd = '';
				for (var j = 0; j < dset.length; j++) {
					cd = cd + d[dset[j]];
				}
				return xAxisScaleLowestDim(cd) + xAxisScaleLowestDim.rangeBand();
			})
			.attr("y1", plotAreaHeight - xAxisLabelsHeight)
			.attr("x2", function(d) {
				var cd = '';
				for (var j = 0; j < dset.length; j++) {
					cd = cd + d[dset[j]];
				}
				return xAxisScaleLowestDim(cd) + xAxisScaleLowestDim.rangeBand();
			})
			.attr("y2", plotAreaHeight - (xAxisLabelsHeight - 5));

		//find the string pixel length
		var pixelLength = function(str) {
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext("2d");
			ctx.font = "10px 'Open Sans', Arial, Helvetica, sans-serif";
			return ctx.measureText(str).width;
		};

		//labels for the lowest dimension
		var visXAxisLabelsLowestDim = visPlotArea_Xaxis.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Labels");
		visXAxisLabelsLowestDim.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Labels_Text")
			.data(csvData)
			.enter().append("text")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Labels_Text")
			.attr("x", function(d) {
				var cd = '';
				for (var j = 0; j < dset.length; j++) {
					cd = cd + d[dset[j]];
				}
				// return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand()) / 4);
				var width = pixelLength(d[dset[dset.length - 1]]);
				return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand() - width) / 2);
				//return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand() - (d[dset[dset.length - 1]].length * 10)) / 2);
			})
			.attr("y", plotAreaHeight - (xAxisLabelsHeight - 20))
			.text(function(d) {
				return d[dset[dset.length - 1]];
			});

		//ticks and labels for all the lower dimensions
		for (var j = 0; j < dset.length - 1; j++) {
			var dimensions = [];
			var dimCount = [];
			var dimLabels = [];

			csvData.forEach(function(d) {
				var cd = '';
				var label = '';
				for (var l = 0; l <= j; l++) {
					cd = cd + d[dset[l]];
					label = d[dset[j]];
				}
				var index = dimensions.indexOf(cd);
				if (index <= -1) {
					dimensions.push(cd);
					if (dimCount.length > 0) {
						dimCount.push(1 + dimCount[dimCount.length - 1]);
					} else {
						dimCount.push(1);
					}
					dimLabels.push(label);
				} else {
					dimCount[index] = dimCount[index] + 1;
				}
			});

			var tickHeightVar = 0,
				labelHeightVar = 0;
			if (j == 0) {
				tickHeightVar = xAxisLabelsHeight - 60;
				labelHeightVar = xAxisLabelsHeight - 60;
			} else {
				tickHeightVar = xAxisLabelsHeight - 40;
				labelHeightVar = xAxisLabelsHeight - 40;
			}

			var dimInfoArr = [];
			dimCount.forEach(function(d) {

				var dimInfo = {};
				dimInfo.dimensions = dimensions[dimCount.indexOf(d)];
				if (dimCount.indexOf(d) > 0) {
					dimInfo.dimCount = dimCount[dimCount.indexOf(d)] - dimCount[dimCount.indexOf(d) - 1];
				} else {
					dimInfo.dimCount = dimCount[dimCount.indexOf(d)];
				}
				dimInfo.dimCountPrev = dimCount[dimCount.indexOf(d) - 1];
				dimInfo.dimLabels = dimLabels[dimCount.indexOf(d)];

				dimInfoArr.push(dimInfo);
			});

			var visXAxisTicksDim = visXAxisTicks.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks");
			visXAxisTicksDim.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks_Dim")
				.data(dimCount)
				.enter().append("line")
				.attr("x1", function(d) {
					return xAxisScaleLowestDim.rangeBand() * d;
				})
				.attr("y1", plotAreaHeight - xAxisLabelsHeight)
				.attr("x2", function(d) {
					return xAxisScaleLowestDim.rangeBand() * d;
				})
				.attr("y2", plotAreaHeight - tickHeightVar);

			var visXAxisLabels = visPlotArea_Xaxis.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Labels");
			visXAxisLabels.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Labels_Text")
				.data(dimInfoArr)
				.enter().append("text")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Labels_Text")
				.attr("x", function(d) {
					var width = pixelLength(d.dimLabels);
					if (d.dimCountPrev) {
						return (xAxisScaleLowestDim.rangeBand() * d.dimCountPrev) + (((xAxisScaleLowestDim.rangeBand() * d.dimCount) - width) / 2);
					} else {
						return ((xAxisScaleLowestDim.rangeBand() * d.dimCount) - width) / 2;
					}
				})
				.attr("y", plotAreaHeight - labelHeightVar)
				.text(function(d) {
					return d.dimLabels;
				});
		}

		/*------------------------------------------------------------Bars-------------------------------------------------------------------------- */
		
		//for measure set 1
		mset1.forEach(function(d, index) {
			var measName = mset1[index];
			var measNamesPrev = [];
			for (var i = 0; i < index; i++) {
				measNamesPrev.push(mset1[i]);
			}
			visPlotArea.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Bars")
				.data(csvData)
				.enter().append("rect")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Bars")
				.attr("height", function(d) {
					return plotAreaHeight - xAxisLabelsHeight - yAxisScale(d[measName]);
				})
				.attr("width", xAxisScaleLowestDim.rangeBand() / 4)
				.attr("x", function(d) {
					var cd = '';
					for (var j = 0; j < dset.length; j++) {
						cd = cd + d[dset[j]];
					}
					return xAxisScaleLowestDim(cd) + (xAxisScaleLowestDim.rangeBand() / 4) + yAxisLabelMargin;
				})
				.attr("y", function(d) {
					var axisCorr = 0;
					for (var i = 0; i < measNamesPrev.length; i++) {
						axisCorr = axisCorr + d[measNamesPrev[i]];
					}
					return yAxisScale(d[measName] + axisCorr);
				})
				.attr("fill", function(d) {
					if (d[dset[1]] == ".YTD") {
						return "#595959";
					} else {
						return "#005284";
					}
				})
				.append("title")
				.text(function(d) {
					return measName + ": " + d[measName];
				});
		});

		//for measure set 2
		mset2.forEach(function(d, index) {
			var measName = mset2[index];
			var measNamesPrev = [];
			for (var i = 0; i < index; i++) {
				measNamesPrev.push(mset2[i]);
			}
			visPlotArea.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Bars")
				.data(csvData)
				.enter().append("rect")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Bars")
				.attr("height", function(d) {
					return plotAreaHeight - xAxisLabelsHeight - yAxisScale(d[measName]);
				})
				.attr("width", xAxisScaleLowestDim.rangeBand() / 4)
				.attr("x", function(d) {
					var cd = '';
					for (var j = 0; j < dset.length; j++) {
						cd = cd + d[dset[j]];
					}
					return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand() / 4) * 2) + yAxisLabelMargin;
				})
				.attr("y", function(d) {
					var axisCorr = 0;
					for (var i = 0; i < measNamesPrev.length; i++) {
						axisCorr = axisCorr + d[measNamesPrev[i]];
					}
					return yAxisScale(d[measName] + axisCorr);
				})
				.attr("fill", function(d) {
					if (index == 0) {
						if (d[dset[1]] == ".YTD") {
							return "#B1B3B4";
						} else {
							return "#79CCFF";
						}
					} else {
						if (d[dset[1]] == ".YTD") {
							return "#ff0000";
						} else {
							return "#006DB0";
						}
					}
				})
				.append("title")
				.text(function(d) {
					return measName + ": " + d[measName];
				});
		});

		/*-------------------------------------------------------------End of Bars-------------------------------------------------------------------------- */

		/* -------------------------------------------------------------End of Plot Area-------------------------------------------------------------------------- */

	};

	return render;
});

/* Commented code
				var yAxis = d3.svg.axis()
				.scale(yAxisScale)
				.orient("left")
				.tickFormat(d3.format(".1s"))
				.tickSize(1);
			
			visPlotArea.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis")
			.call(yAxis); 
			
			var xAxisScaleTest = d3.scale.ordinal()
				.rangeRoundBands([0, plotAreaWidth]);
			xAxisScaleTest.domain(csvData.map(function(d) {
					return d[dset[2]];
				})
			);
				
			var xAxisTest = d3.svg.axis()
				.scale(xAxisScaleTest)
				.orient("bottom")
				.tickFormat(d3.format(".1s"))
				.tickSize(1);
			
			visPlotArea.append("g")
			.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis")
			.attr("transform", "translate(" + 20 + "," + 0 + ")")
			.call(xAxisTest);
			
			
				var xAxisScaleDim3 = d3.scale.ordinal()
				.rangeRoundBands([0, plotAreaWidth]);
			xAxisScaleDim3.domain(csvData.map(function(d) {
					// return d[dset[0]] + d[dset[1]] +  d[dset[2]] ;
					var cd = '';
					for(var j = 0; j < dset.length; j++) {
						cd = cd + d[dset[j]];
					}	
					return cd;
				}));
			
			var xAxisScaleDim2 = d3.scale.ordinal()
				.rangeRoundBands([0, plotAreaWidth]);
			xAxisScaleDim2.domain(csvData.map(function(d) {
					return d[dset[0]] + d[dset[1]] ;
				}));
				
			var xAxisScaleDim1 = d3.scale.ordinal()
				.rangeRoundBands([0, plotAreaWidth]);
			xAxisScaleDim1.domain(csvData.map(function(d) {
					return d[dset[0]];
				}));
				
				/*
			//ticks for the second dimension
			var visXAxisTicksDim2 = visXAxisTicks.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks_Dim2");
			visXAxisTicksDim2.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks_Dim2")
				.data(csvData)
				.enter().append("line")
				.attr("x1", function(d) {
					return xAxisScaleDim2(d[dset[0]] + d[dset[1]]) + xAxisScaleDim2.rangeBand();
					// return xAxisScaleDim2.rangeBand() * 6;
				})
				.attr("y1", plotAreaHeight - xAxisLabelsHeight)
				.attr("x2", function(d) {
					return xAxisScaleDim2(d[dset[0]] + d[dset[1]]) + xAxisScaleDim2.rangeBand();
					// return xAxisScaleDim2.rangeBand() * 6;
				})
				.attr("y2", plotAreaHeight - (xAxisLabelsHeight - 50));
			
			
			//ticks for the first dimension
			var visXAxisTicksDim1 = visXAxisTicks.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks_Dim1");
			visXAxisTicksDim1.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks_Dim1")
				.data(csvData)
				.enter().append("line")
				.attr("x1", function(d) {
					return xAxisScaleDim1(d[dset[0]]) + xAxisScaleDim1.rangeBand();
				})
				.attr("y1", plotAreaHeight - xAxisLabelsHeight)
				.attr("x2", function(d) {
					return xAxisScaleDim1(d[dset[0]]) + xAxisScaleDim1.rangeBand();
				})
				.attr("y2", plotAreaHeight);
			*/