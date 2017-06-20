/**
  * Used for drawing linecharts.
  * Linechart class definition.
  *
  * @param {String} element - Name of the element to which graph is to be drawn.
  * @param {Object} data - Data for which graph is to be drawn
  * @param {Object} options - Other options that can be added to the graph.
  */
var LineChart = function(element, data, options) {

  var _this = this;

  // Set all the parameter values to global scope
  _this.setValues(element, data, options, {
    type : 'line'
  });

  // Range of x and y axis values.
  _this.xExtent = _this.xExtentCalculate(_this.data);
  _this.yExtent = _this.yExtentCalculate(_this.data);

  _this.initiateDraw('line');

  // Redraw the graph when window size is altered so as to make it responsive.
  window.addEventListener('resize', function(event) {
    _this.setValues(element, data, options, {
      type : 'line'
    });
    _this.initiateDraw('line');
  });
};


// Cloning the baseclass `Chart` so as to access all its methods.
LineChart.prototype = Object.create(Chart.prototype);


/**
  * Function which finds the X Axis ticks from the data provided.
  * @return {Array} - An array which contains all x Axis ticks.
  */
LineChart.prototype.xExtentCalculate = function(data) {
  return data.map(function(d) { return d[0]; });
};

/**
  * Function which finds the range of Y Axis values from the data provided.
  * @return {Array} - An array which contains minimum and maximum value.
  */
LineChart.prototype.yExtentCalculate = function(data) {
  var yExtent = d3.extent(data, function(d) {return d[1]});
  if (yExtent[0] > 0) {
    yExtent[0] = 0;
  }
  return yExtent;
};

/**
  * Function to initiate draw by finding the base64 of plotpoint images before
  * start drawing the graph.
  * @param {String} type - type of the graph.
  */
LineChart.prototype.initiateDraw = function(type) {

  var _this      = this,
      threshold  = _this.options.threshold;

  _this.dataExist = _this.doesDataExist(_this.data);

  if (threshold && threshold.value && threshold.icon && threshold.icon.url && _this.dataExist) {
    if (threshold.icon.toBase64) {
      _this.getBase64Image(threshold.icon.url, function(base64url) {
        _this.thresholdIconUrl = base64url;
        _this.drawLineChart(type);
      })
    } else {
      _this.thresholdIconUrl = threshold.icon.url;
      _this.drawLineChart(type);
    }
  } else {
    _this.drawLineChart(type);
  }

};

/**
  * Function to draw the line chart by drawing the axis, goal lines, line
  * @param {String} type - type of the graph.
  */
LineChart.prototype.drawLineChart = function(type) {

  var _this     = this,
      line      = _this.options.line ? _this.options.line : CONSTANTS.LINE;
      threshold = _this.options.threshold;

  // Calls the base class function to draw canvas.
  _this.drawChart();

  if (_this.dataExist) {
    _this.checkGoalLine();

    //Defining the line
    _this.line = d3.line()
                   .x(function(d) { return _this.xScale(d[0]) + _this.xScale.bandwidth()/2; })
                   .y(function(d) { return _this.yScale(d[1]); })
                   .defined(function(d, i) {
                      return d[1] != null;
                      // returns true if line is defined; in this case, if y value is not null
                    })
                   .curve(d3.curveMonotoneX);

    _this.drawLine(type, _this.data, line, threshold, 'line');
    _this.checkTransition();
  }

};

/**
  * Function to draw the line of the line chart
  * @param {String} type      - type of the graph.
  * @param {Object} data      - Data to draw the line on the graph.
  * @param {Object} line      - line config of the graph.
  * @param {Object} threshold - threshold config of the graph.
  * @param {String} lineId    - ID for the line.
  */
LineChart.prototype.drawLine = function(type, data, line, threshold, lineId) {

  var _this       = this;

  var linePlot = _this.plot.append('g')
                           .attr('class', 'fc-line')
                           .attr('id', 'fc-' + lineId);

  var filteredData = _this.options.connectNull
                          ? data.filter(_this.line.defined())
                          : data;

  var strokeWidth = (line && line.width)
                          ? line.width
                          : 4;

  var className = (line && line.class)
                          ? 'fc-line-stroke ' + line.class
                          : 'fc-line-stroke';
  var color = (line && line.color)
                          ? line.color
                          : _this.color;

  linePlot.selectAll('.line')
          .data([data])
          .enter()
          .append('path')
          .attr('class', className)
          .attr('id', 'fc-path-' + lineId)
          .attr('stroke', color)
          .attr('stroke-width', strokeWidth)
          .attr('d', _this.line(filteredData))
          .attr('fill', 'none')
          .attr('clip-path', 'url(#fc-clip-' + lineId + ')');

  if (line && line.icon && line.icon.show) {
    _this.drawPlotPoints(type, linePlot, filteredData, line, threshold, lineId);
  }
  _this.clipPath = _this.plot.append('clipPath')
                             .attr('id', 'fc-clip-' + lineId)
                             .append('rect');

};

/**
  * Function to draw the plot points to the line chart
  * @param {String} type      - type of the graph.
  * @param {Object} plot      - plot to which new elements need to be added.
  * @param {Object} data      - Data to draw the line on the graph.
  * @param {Object} line       - line config of the graph.
  * @param {Object} thresholdConfig - threshold config of the graph.
  * @param {String} lineId    - ID for the line.
  */
LineChart.prototype.drawPlotPoints = function(type, plot, data, line, thresholdConfig, lineId) {

  var _this        = this,
      thresholdVal = (thresholdConfig && thresholdConfig.value)
                          ? thresholdConfig.value
                          : null,
      iconConfig   = line.icon;

  var normalIconData = data.filter(function(d) {
                          if (thresholdVal === null) {
                            if (d[1] !== null) {
                              return d;
                            }
                          } else {
                            if (d[1] !== null && d[1] < thresholdVal) {
                              return d;
                            }
                          }
                        });

  var thresholdData = data.filter(function(d) {
                              if (thresholdVal !== null && d[1] !== null && d[1] >= thresholdVal) {
                                  return d;
                              }
                            });

  if (iconConfig && iconConfig.url) {
    if (iconConfig.toBase64) {
      _this.getBase64Image(iconConfig.url, function(normalIconBase64Url) {
        _this.addImagePlotPoints(plot, normalIconData, iconConfig, normalIconBase64Url, lineId)
        _this.addImagePlotPoints(plot, thresholdData, iconConfig, _this.thresholdIconUrl, lineId)
        _this.checkTooltip(type);
      });
    } else {
      _this.addImagePlotPoints(plot, normalIconData, iconConfig, iconConfig.url, lineId)
      _this.addImagePlotPoints(plot, thresholdData, iconConfig, _this.thresholdIconUrl, lineId)
      _this.checkTooltip(type);
    }
  } else {
    _this.addColorPlotPoints(plot, normalIconData, line, iconConfig.url, lineId)
    _this.addImagePlotPoints(plot, thresholdData, iconConfig, _this.thresholdIconUrl, lineId)
    _this.checkTooltip(type);
  }

};

/**
  * Function to add the image plot points to the line chart
  * @param {Object} plot       - plot to which new elements need to be added.
  * @param {Object} data       - Data to draw the line on the graph.
  * @param {Object} line       - line config of the graph.
  * @param {String} iconUrl    - url for the icon.
  * @param {String} lineId     - ID for the line.
  */
LineChart.prototype.addImagePlotPoints = function(plot, data, iconConfig, iconUrl, lineId) {

  var _this       = this,
      currentLine = '.fc-' + lineId
      iconWidth   = iconConfig.width
                      ? iconConfig.width
                      : CONSTANTS.LINE.icon.width;

  plot.selectAll(currentLine)
      .data(data.filter(function(d) { return d[1] !== null; }))
      .enter()
      .append('svg:image')
      .attr('class', 'fc-line-point')
      .attr('x', function(d) { return _this.xScale(d[0]) + _this.xScale.bandwidth()/2 - iconWidth/2; })
      .attr('y', function(d) { return _this.yScale(d[1]) - iconWidth/2; })
      .attr('width', iconWidth)
      .attr('height', iconWidth)
      .attr('xlink:href', iconUrl)
      .attr('clip-path', 'url(#fc-clip-' + lineId + ')');

};

/**
  * Function to add the color plot points to the line chart
  * @param {Object} plot       - plot to which new elements need to be added.
  * @param {Object} data       - Data to draw the line on the graph.
  * @param {Object} iconConfig - icon config of the graph.
  * @param {String} iconUrl    - url for the icon.
  * @param {String} lineId     - ID for the line.
  */
LineChart.prototype.addColorPlotPoints = function(plot, data, line, iconUrl, lineId) {

  var _this       = this,
      iconConfig  = line.icon
      currentLine = '.fc-' + lineId
      iconWidth   = iconConfig.width
                        ? iconConfig.width
                        : CONSTANTS.LINE.icon.width,
      radius      = (line && line.width)
                        ? 1.25 * line.width
                        : 1.25 * CONSTANTS.LINE.width,
      color       = (line && line.color)
                        ? line.color
                        : _this.color;

  plot.selectAll(currentLine)
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'fc-line-point')
      .attr('cx', function(d) { return _this.xScale(d[0]) + _this.xScale.bandwidth()/2; })
      .attr('cy', function(d) { return _this.yScale(d[1]); })
      .attr('r', radius)
      .attr('stroke-width', 1)
      .attr('stroke', color)
      .attr('fill', '#fff')
      .attr('clip-path', 'url(#fc-clip-' + lineId + ')');
};

/**
  * To decide whether transition is need or not. If yes, what kind of transition
  */
LineChart.prototype.checkTransition = function() {

  var _this      = this,
      transition = _this.options.transition;

  if (transition && transition.animate) {
      var duration = (transition.duration)
                          ? transition.duration
                          : 1000;
      _this.drawLineWithAnimation(duration);
    } else {
      _this.drawLineWithoutAnimation();
    }

};

/**
  * To draw the threshold lines if the user have opted to.
  */
LineChart.prototype.checkGoalLine = function() {

  var _this = this;

  if (_this.options.goalLine && _this.options.goalLine.value) {
    _this.addGoalLines();
  }

};

/**
  * To draw the lines with animation.
  * @param {Integer} duration - Duration of the animation.
  */
LineChart.prototype.drawLineWithAnimation = function(duration) {
  var _this  = this,
      margin = _this.margin,
      height =  _this.height + margin.top + margin.bottom + CONSTANTS.DEFAULT_MARGIN.TOP;

  _this.clipPath.attr('width', 0)
                .attr('height', height)
                .transition()
                .duration(duration)
                .attr('width', _this.width)
};

/**
  * To draw the lines without animation.
  */
LineChart.prototype.drawLineWithoutAnimation = function() {
  var _this = this;

  _this.clipPath.attr('width', _this.width)
                .attr('height', _this.height);
};

/**
  * To check whether the data exist or not
  * @param {Object} data - Data to draw the graph.
  */
LineChart.prototype.doesDataExist = function(data) {
  if (data && data.length > 0) {
    return true;
  } else {
    return false;
  }
};
