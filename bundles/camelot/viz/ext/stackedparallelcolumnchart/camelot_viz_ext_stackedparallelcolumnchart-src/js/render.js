define("camelot_viz_ext_stackedparallelcolumnchart-src/js/render", ["camelot_viz_ext_stackedparallelcolumnchart-src/js/utils/util"],
	function(util) {
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

			//get the max of sum of the measure sets value from the entire dataset
			var maxMsetSum = d3.max(csvData, function(d) {
				return d3.max([d3.sum(mset1, function(m) {
					return d[m];
				}), d3.sum(mset2, function(m) {
					return d[m];
				})]);
			});

			//get the 75% of average of the first measure set across the first dimension
			var sum = d3.sum(csvData, function(d) {
				return d3.sum(mset1, function(m) {
					return d[m];
				});
			});
			var capacityKpi = sum / csvData.length * 0.75;

			var sortFunction;
			//sort data based on the available dimensions
			if (dimName3) {
				sortFunction = util.monthComparator(dimName1, dimName2, dimName3);
				csvData.sort(sortFunction);
			} else if (dimName2) {
				sortFunction = util.tdComparator(dimName1, dimName2);
				csvData.sort(sortFunction);
			} else {
				sortFunction = util.yearComparator(dimName1);
				csvData.sort(sortFunction);
			}

			/* --------------------------------------------------------------End of Data Preparation------------------------------------------------------------------- */

			/* --------------------------------------------------------------------Plot Area-------------------------------------------------------------------------- */

			var properties = this.properties();
			var gridLinesVisibility = properties.gridline && (properties.gridline.visible != null) ? properties.gridline.visible : true;
			var legendVisibility = properties.legend && (properties.legend.visible != null) ? properties.legend.visible : true;
			var yAxisLineVisibility = properties.yAxisLine && (properties.yAxisLine.visible != null) ? properties.yAxisLine.visible : true;
			var yAxisLabelVisible = properties.yAxisLabel && (properties.yAxisLabel.visible != null) ? properties.yAxisLabel.visible : true;

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

			//remove any older svg element from the selection
			container.selectAll('svg').remove();

			//create a new svg element and a canvas 'g' with its weight and height attributes
			//this svg element contains plotArea + title + legend
			var vis = container.append('svg').attr('width', visWidth).attr('height', visWidth)
				.append('g').attr('class', 'camelot_viz_ext_stackedparallelcolumnchart_vis').attr('width', visWidth).attr('height', visWidth);

			var visMargin = {
				top: 20,
				bottom: 20,
				right: legendVisibility ? 200 : 20,
				left: 50
			};

			//define the width and height of the vis elements plotArea + title + legend
			var plotAreaWidth = visWidth - visMargin.right - visMargin.left;
			var plotAreaHeight = visHeight - visMargin.top - visMargin.bottom;

			//create respectice group elements for each vis element, assign them widht and height, and place them

			var visPlotArea = vis.append("g")
				.attr('class', 'camelot_viz_ext_stackedparallelcolumnchart_visPlotArea')
				.attr("width", plotAreaWidth)
				.attr("height", plotAreaHeight)
				.attr("transform", "translate(" + (visMargin.left + defaultMargin.left) + "," + (visMargin.top + defaultMargin.top) + ")");

			//Y Axis
			//define a Y Axis scale
			var xAxisLabelsHeight = 60;
			var yAxisRange = plotAreaHeight - xAxisLabelsHeight;
			var yAxisScale = d3.scale.linear().rangeRound([yAxisRange, 0]);

			//assign domain with 20% for extra spacing
			yAxisScale.domain([0, maxMsetSum * 1.20]);

			//Y Axis Line
			var visPlotArea_Yaxis = visPlotArea
				.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis")
				.attr("transform", "translate(" + 0 + "," + 0 + ")");
			if (yAxisLineVisibility) {
				visPlotArea_Yaxis.append("g")
					.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Line")
					.append("line")
					.attr("x1", 0)
					.attr("y1", 0)
					.attr("x2", 0)
					.attr("y2", yAxisRange);
			}

			var numberOfTicks = 5;
			var tDist = ((maxMsetSum / numberOfTicks) / 1000).toFixed(0) * 1000;
			var ticks = [];
			for (var i = 0; i < numberOfTicks; i++) {
				var tick = {
					id: (i + 1) * tDist,
					label: ((i + 1) * tDist / 1000).toString() + "k"
				};
				ticks.push(tick);
			}

			//Y Axis Grid Lines
			if (gridLinesVisibility) {
				var visYAxisGridLine = visPlotArea_Yaxis.append("g")
					.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_GridLines");
				visYAxisGridLine.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_GridLine_Line")
					.data(ticks)
					.enter().append("line")
					.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_GridLine_Line")
					.attr("x1", 0)
					.attr("y1", function(d) {
						return yAxisScale(d.id);
					})
					.attr("x2", plotAreaWidth)
					.attr("y2", function(d) {
						return yAxisScale(d.id);
					});
			}

			//Y Axis Ticks
			var visYAxisTicks = visPlotArea_Yaxis.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Ticks");
			visYAxisTicks.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Ticks_Line")
				.data(ticks)
				.enter().append("line")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Ticks_Line")
				.attr("x1", 0)
				.attr("y1", function(d) {
					return yAxisScale(d.id);
				})
				.attr("x2", -5)
				.attr("y2", function(d) {
					return yAxisScale(d.id);
				});

			//Y Axis Tick Labels
			var visYAxisLabels = visPlotArea_Yaxis.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Labels");
			visYAxisLabels.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Labels_Text")
				.data(ticks)
				.enter().append("text")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_Labels_Text")
				.attr("x", 0 - 30)
				.attr("y", function(d) {
					return yAxisScale(d.id);
				})
				.text(function(d) {
					return d.label;
				});

			if (yAxisLabelVisible) {
				//Y Axis Main Label
				var mainLabelText = "";
				for (var i = 0; i < d3.max([mset1.length, mset2.length]); i++) {
					if (i < mset1.length) {
						if (util.pixelLength(mainLabelText + mset1[i]) < (plotAreaHeight - xAxisLabelsHeight - 20)) {
							mainLabelText = (mainLabelText.length === 0) ? mset1[i] : mainLabelText + " & " + mset1[i];
						} else {
							mainLabelText = mainLabelText + "...";
							break;
						}
					}
					if (i < mset2.length) {
						if (util.pixelLength(mainLabelText + mset2[i]) < (plotAreaHeight - xAxisLabelsHeight - 20)) {
							mainLabelText = (mainLabelText.length === 0) ? mset2[i] : mainLabelText + " & " + mset2[i];
						} else {
							mainLabelText = mainLabelText + "...";
							break;
						}
					}
				}

				var visYAxisMainLabel = visPlotArea_Yaxis.append("g")
					.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Yaxis_MainLabel");
				visYAxisMainLabel.append("text")
					.attr("x", -(plotAreaHeight / 1.60))
					.attr("y", -50)
					.text(mainLabelText)
					.attr("transform", "rotate(-90)");
			}

			//X Axis
			//define X Axis scale

			var xAxisScaleLowestDim = d3.scale.ordinal()
				.rangeRoundBands([0, plotAreaWidth]);
			xAxisScaleLowestDim.domain(csvData.map(function(d) {
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
				.attr("transform", "translate(" + 0 + "," + (plotAreaHeight - xAxisLabelsHeight) + ")");
			visPlotArea_Xaxis.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Line")
				.append("line")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", plotAreaWidth)
				.attr("y2", 0);

			//X Axis Ticks
			var visXAxisTicks = visPlotArea_Xaxis.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks");
			//first tick
			visXAxisTicks
				.append("line")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 0)
				.attr("y2", xAxisLabelsHeight);

			//ticks for the lowest dimension
			var visXAxisTicksLowestDim = visXAxisTicks.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks_LowestDim");
			visXAxisTicksLowestDim.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Ticks_LowestDim")
				.data(csvData)
				.enter().append("line")
				.attr("x1", function(d, i) {
					// var cd = '';
					// for (var j = 0; j < dset.length; j++) {
					// 	cd = cd + d[dset[j]];
					// }
					// return xAxisScaleLowestDim(cd) + xAxisScaleLowestDim.rangeBand();
					return i * xAxisScaleLowestDim.rangeBand();
				})
				.attr("y1", 0)
				.attr("x2", function(d, i) {
					// var cd = '';
					// for (var j = 0; j < dset.length; j++) {
					// 	cd = cd + d[dset[j]];
					// }
					// return xAxisScaleLowestDim(cd) + xAxisScaleLowestDim.rangeBand();
					return i * xAxisScaleLowestDim.rangeBand();
				})
				.attr("y2", 5);

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
					var width = util.pixelLength(d[dset[dset.length - 1]]);
					return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand() - width) / 2);
					//return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand() - (d[dset[dset.length - 1]].length * 10)) / 2);
				})
				.attr("y", (xAxisLabelsHeight - 40))
				.text(function(d) {
					return d[dset[dset.length - 1]];
				});

			//ticks and labels for all the higher dimensions
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
					tickHeightVar = 60;
					labelHeightVar = xAxisLabelsHeight;
				} else {
					tickHeightVar = 40;
					labelHeightVar = xAxisLabelsHeight - 20;
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
					.attr("y1", 0)
					.attr("x2", function(d) {
						return xAxisScaleLowestDim.rangeBand() * d;
					})
					.attr("y2", tickHeightVar);

				var visXAxisLabels = visPlotArea_Xaxis.append("g")
					.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Labels");
				visXAxisLabels.selectAll("camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Labels_Text")
					.data(dimInfoArr)
					.enter().append("text")
					.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Xaxis_Labels_Text")
					.attr("x", function(d) {
						var width = util.pixelLength(d.dimLabels);
						if (d.dimCountPrev) {
							return (xAxisScaleLowestDim.rangeBand() * d.dimCountPrev) + (((xAxisScaleLowestDim.rangeBand() * d.dimCount) - width) / 2);
						} else {
							return ((xAxisScaleLowestDim.rangeBand() * d.dimCount) - width) / 2;
						}
					})
					.attr("y", labelHeightVar)
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
						return xAxisScaleLowestDim(cd) + (xAxisScaleLowestDim.rangeBand() / 4);
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
						return measName + ": " + parseFloat(d[measName]).toFixed(2);
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
						return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand() / 4) * 2);
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
								return "#000000";
							} else {
								return "#006DB0";
							}
						}
					})
					.append("title")
					.text(function(d) {
						return measName + ": " + parseFloat(d[measName]).toFixed(2);
					});
			});

			//75% utilization line
			var kpiLabel = "75% of avg. yearly Capacity: ";
			visPlotArea.append("g")
				.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visPlotArea_Utilization_RefLine")
				.attr("transform", "translate(" + 0 + "," + 0 + ")")
				.append("line")
				.attr("x1", 0)
				.attr("y1", yAxisScale(capacityKpi))
				.attr("x2", plotAreaWidth)
				.attr("y2", yAxisScale(capacityKpi))
				.append("title")
				.text(kpiLabel + parseFloat(capacityKpi).toFixed(2));

			/*-------------------------------------------------------------End of Bars-------------------------------------------------------------------------- */

			/*----------------------------------------------------------------Legend---------------------------------------------------------------------------- */

			if (legendVisibility === true) {
				var legendElements = [];
				mset1.forEach(function(d) {
					var legendElement = {
						legendColor: "#595959",
						legendText: d + " (Actual)"
					};
					legendElements.push(legendElement);

					legendElement = {
						legendColor: "#005284",
						legendText: d + " (Future)"
					};
					legendElements.push(legendElement);
				});

				mset2.forEach(function(d, index) {
					if (index == 0) {
						var legendElement = {
							legendColor: "#B1B3B4",
							legendText: d + " (Actual)"
						};
						legendElements.push(legendElement);

						legendElement = {
							legendColor: "#79CCFF",
							legendText: d + " (Future)"
						};
						legendElements.push(legendElement);
					} else {
						var legendElement = {
							legendColor: "#006DB0",
							legendText: d
						};
						legendElements.push(legendElement);
					}
				});

				var legendWidth = visWidth - plotAreaWidth;
				var legendHeight = visHeight / 2 - visMargin.top;

				var visLegend = vis.append("g")
					.attr('class', 'camelot_viz_ext_stackedparallelcolumnchart_visLegend')
					.attr("width", legendWidth)
					.attr("height", legendHeight)
					.attr("transform", "translate(" + (defaultMargin.left + visMargin.left + 20 + plotAreaWidth) + "," + (visMargin.top +
							defaultMargin.top) +
						")");

				var legendElementWidth = (plotAreaHeight / 50 > 5) ? 10 : 5;
				var xDistBetweenElements = legendElementWidth / 2;
				var legendElementHeight = legendElementWidth;
				var yDistBetweenElements = legendElementWidth;

				var legendTextSize = (legendElementHeight >= 10) ? legendElementHeight : 10;

				var legend = visLegend
					.selectAll(".camelot_viz_ext_stackedparallelcolumnchart_visLegend_legend")
					.data(legendElements)
					.enter().append("g")
					.attr("class", "camelot_viz_ext_stackedparallelcolumnchart_visLegend_legend")
					.attr("transform", function(d, i) {
						return "translate(0," + (i * (legendElementHeight + yDistBetweenElements)) + ")";
					});

				legend.append("rect")
					.attr("x", 0)
					.attr("height", legendElementWidth)
					.attr("width", legendElementHeight)
					.attr("fill", function(d) {
						return d.legendColor;
					});

				legend.append("text")
					.attr("x", legendElementWidth + xDistBetweenElements)
					.attr("y", 0 + legendElementHeight)
					.text(function(d) {
						return d.legendText;
					})
					.attr("font-size", legendTextSize);

				legendElements = [];
				//add legend element for the capacity KPI
				var legendElement = {
					legendColor: "#79CCFF",
					legendText: "75% of avg. yearly eff. Capacity"
				};
				legendElements.push(legendElement);
				var kpiLegend = "75% of avg. yearly eff. Capacity ";

				visLegend.append("line")
					.attr("x1", 0)
					.attr("y1", 5 * (legendElementHeight + yDistBetweenElements) + legendElementHeight / 2)
					.attr("x2", legendElementWidth)
					.attr("y2", 5 * (legendElementHeight + yDistBetweenElements) + legendElementHeight / 2);
				// visLegend.append("g")
				// 	.attr("transform", "translate(" + (legendElementWidth + xDistBetweenElements) + "," + ((5 * (legendElementHeight +
				// 		yDistBetweenElements)) + legendElementHeight) + ")")
				// 	.append("html")
				// 	.text("test" + "test");
				visLegend.append("text")
					.attr("x", legendElementWidth + xDistBetweenElements)
					.attr("y", (5 * (legendElementHeight + yDistBetweenElements)) + legendElementHeight)
					.text(kpiLegend)
					.attr("font-size", legendTextSize);
			}

			/*-------------------------------------------------------------End of Legend------------------------------------------------------------------------ */

			/* -------------------------------------------------------------End of Plot Area-------------------------------------------------------------------------- */

		};

		return render;
	});