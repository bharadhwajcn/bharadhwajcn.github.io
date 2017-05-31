/**
  * Used for drawing linecharts.
  * Linechart class definition.
  *
  * @param {String} element - Name of the element to which graph is to be drawn.
  * @param {Object} data - Data for which graph is to be drawn
  * @param {Object} options - Other options that can be added to the graph.
  *     {String} options.title - Title of the graph
  *     {Object} options.transition - Details about the transition.
  *       {Boolean} options.transition.animate - Whether animation needed or not.
  *       {String} options.transition.type - Type of the animation required.
  *     {Object} options.margin - Margin to the SVG canvas area.
  *       {Integer} options.margin.top - Top margin.
  *       {Integer} options.margin.bottom - Bottom margin.
  *       {Integer} options.margin.left - Left margin.
  *       {Integer} options.margin.right - Right margin.
  *     {String} options.title - Title of the graph
  *     {Integer} options.barWidth - Width of each bar of the graph
  *     {Boolean} options.tooltip - Whether tooltip is needed or not.
  */
var LineChart = function(element, data, options) {

  var _this = this;

  // Set all the parameter values to global scope
  _this.setValues(element, data, options);

  // Range of x and y axis values.
  _this.xExtent = _this.xExtentCalculate(_this.data);
  _this.yExtent = _this.yExtentCalculate(_this.data);

  _this.initiateDraw('line');

  // Redraw the graph when window size is altered so as to make it responsive.
  window.addEventListener('resize', function(event) {
    _this.setValues(element, data, options);
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
  return [0, d3.max(data, function(d) {return d[1]})];
};

LineChart.prototype.initiateDraw = function(type) {

  var _this = this,
      line  = _this.options.line;
  _this.isDataExist = _this.dataExist(type, _this.data);

  if (line && line.threshold && line.threshold.value && _this.isDataExist) {
    if (line.threshold.icon && line.threshold.icon.url) {
      _this.thresholdIcon = line.threshold.icon.url;
    } else {
      _this.thresholdIcon = './static/images/Pulse.png';
    }

    _this.getBase64Image(_this.thresholdIcon, function(base64url) {
      _this.thresholdIconUrl = base64url;
      _this.drawLineChart(type);
    })
  } else {
    _this.drawLineChart(type);
  }

};

LineChart.prototype.drawLineChart = function(type) {

  var _this  = this,
      legend = _this.options.legend;

  if (legend && legend.show && legend.position === 'top') {
    _this.checkLegend(type, _this.data)
  }

  // Calls the base class function to draw canvas.
  _this.drawChart();

  if (_this.isDataExist){
    _this.checkGoalLine();

    //Defining the line
    _this.line = d3.line()
                   .x(function(d) { return _this.xScale(d[0]) + _this.xScale.bandwidth()/2; })
                   .y(function(d) { return _this.yScale(d[1]); })
                   .defined(function(d, i) {
                      return d[1] != null;        // returns true if line is defined; in this case, if y value is not null
                    })
                   .curve(d3.curveMonotoneX);
    _this.drawLines(type, _this.data);
    _this.checkTransition();
  }

  if (legend && legend.show && legend.position === 'bottom') {
    _this.checkLegend(type, _this.data);
  }
};

LineChart.prototype.addLegend = function(type, data) {

  var _this  = this,
      legend = _this.options.legend,
      config = _this.options.line ? _this.options.line : CONSTANTS.LINE;

  var topMargin = _this.height + CONSTANTS.DEFAULT_MARGIN.TOP;

  var className   =  (legend && legend.class)
                            ? 'qd-legend ' + legend.class
                            : 'qd-legend';

  var legendSpace = _this.width/data.length;

  d3.select(_this.element)
    .selectAll('#qd-legend')
    .remove();

  var legendsCanvas = d3.select(_this.element)
                        .append('div')
                        .attr('class', className)
                        .attr('id', 'qd-legend');

  data.forEach(function(d, i) {
    if (legend) {
      if (legend.clickable[i] || (legend.clickable[i] === undefined && legend.clickable)) {
        var clickable = true;
      } else {
        var clickable = false;
      }
    } else {
      var clickable = true;
    }

    var listener = document.ontouchstart !== null ? 'click' : 'touchstart';

    var legendCanvas = legendsCanvas.append('div')
                                    .attr('id', 'legend_' + d.key.replace(/ /g,'_'))
                                    .attr('class', 'qd-legend-element')
                                    .on(listener, function() {
                                      if (clickable)
                                        return _this.removeLine(d, i);
                                    });


    legendCanvas.node().style.width = legendSpace;
    if (!clickable) {
      legendCanvas.node().style.cursor = 'default';
    }

    if (legend && legend.show) {
      if (config.plotPoints.icon && config.plotPoints.icon.url && config.plotPoints.icon.url) {
        var width = config.plotPoints.icon.width;
        var imageUrl = config.plotPoints.icon.url[i];
        _this.getBase64Image(imageUrl, function(base64url) {
          legendCanvas.append('img')
                      .attr('width', width)
                      .attr('height', width)
                      .attr('src', base64url);

          legendCanvas.append('span')
                      .text(d.key);
        });
      } else {
        var image = legendCanvas.append('div')
                                .attr('class', 'qd-legend-circle');

        image.node().style.background = _this.color[i];
        legendCanvas.append('span')
                    .attr('float', 'left')
                    .text(d.key);
      }
    }

    if (legend.subClass) {
      legendCanvas.attr('class', 'qd-legend-element ' + legend.subClass);
    }

  });
};

LineChart.prototype.drawLines = function(type, data) {

  var _this  = this,
      config = _this.options.line ? _this.options.line : CONSTANTS.LINE,
      legend = _this.options.legend,
      legendSpace = _this.width/_this.data.length;

  var className = (config && config.class)
                          ? 'line-stroke ' + config.class
                          : 'line-stroke';

  var lines = _this.plot.append('g')
                       .attr('class', 'line');

  switch (type) {

    case 'line':
      var filteredData = _this.options.connectNull ? data.filter(_this.line.defined()) : data;

      lines.selectAll('.line')
          .data([data])
          .enter()
          .append('path')
          .attr('class', className)
          .attr('stroke', 'rgb(53, 159, 209)')
          .attr('d', _this.line(filteredData))
          .attr('fill', 'none')
          .attr('clip-path', 'url(#clip)');

      if (config && config.plotPoints) {
        _this.drawPlotPoints(lines, type, config.plotPoints, filteredData);
      }
      _this.clipPath = _this.plot.append('clipPath')
                                 .attr('id', 'clip')
                                 .append('rect');
      break;

    case 'multiline':
      data.forEach(function(d, i) {

        d.value.forEach(function(elt) {
          elt.push(d.key);
        });

        var filteredData = _this.options.connectNull
                                ? d.value.filter(_this.line.defined())
                                : d.value;

        var lineId = d.key.replace(/ /g,'_');

        var line = lines.append('g')
                        .attr('class', 'line-'+i);

        line.append('path')
            .attr('class', className)
            .attr('id', 'line_' + lineId)
            .attr('stroke', _this.color[i])
            .attr('d', _this.line(filteredData))
            .attr('fill', 'none')
            .attr('clip-path', 'url(#clip)');
        if (config && config.plotPoints) {
          if (_this.thresholdIconUrl === 'data:,') {
            _this.getBase64Image(_this.thresholdIcon, function(url) {
              _this.thresholdIconUrl = url;
              _this.drawPlotPoints(line, type, config.plotPoints, filteredData, i, lineId);
            });
          } else {
            _this.drawPlotPoints(line, type, config.plotPoints, filteredData, i, lineId);
          }
        }
        if (!_this.clipPath) {
          _this.clipPath = _this.plot.append('clipPath')
                                     .attr('id', 'clip')
                                     .append('rect');
        }

      });
      break;
  }


};

LineChart.prototype.drawPlotPoints = function(plot, type, config, data, i, key) {

  var _this  = this,
      line   = _this.options.line,
      i      = i ? i : 0,
      key    = key !== undefined ? key : '1',
      data   = data ? data : _this.data,
      lineId = '.line_' + key,
      points = '.points' + i;


  if (config.icon && config.icon.url && config.icon.url) {
    if (type === 'line') { config.icon.url = [config.icon.url]; }
    var width  = _this.thresholdIconUrl
                      ? _this.options.line.threshold.icon.width
                      : config.icon.width
                              ? config.icon.width
                              : CONSTANTS.ICON.DEFAULT_WIDTH;
    _this.getBase64Image(config.icon.url[i], function(base64url) {
      plot.selectAll(lineId)
          .data(data)
          .enter()
          .append('svg:image')
          .attr('class', 'point_' + key)
          .attr('x', function(d) { return _this.xScale(d[0]) + _this.xScale.bandwidth()/2 - width/2; })
          .attr('y', function(d) { return _this.yScale(d[1]) - width/2; })
          .attr('width', width)
          .attr('height', width)
          .attr('xlink:href', function(d) {
            if (_this.thresholdIconUrl) {
              if (line && line.threshold && line.threshold.value) {
                if ((line.threshold.value).constructor === Array) {
                  var threshold = line.threshold.value[i];
                } else {
                  var threshold = line.threshold.value;
                }
              }
              if (threshold !== null && d[1] >= threshold) {
                  return _this.thresholdIconUrl;
              } else {
                return base64url;
              }
            } else {
                return base64url;
            }
          })
          .attr('clip-path', 'url(#clip)');
      _this.addTooltipPoints(plot, data, i, width);
      _this.checkTooltip(type);
    });
  } else {
    plot.selectAll(lineId)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', function() { return 'line_' + key; })
        .attr('cx', function(d) { return _this.xScale(d[0]) + _this.xScale.bandwidth()/2; })
        .attr('cy', function(d) { return _this.yScale(d[1]); })
        .attr('r', 5)
        .attr('stroke-width', 1)
        .attr('stroke', function() {
          return _this.color !== undefined
                      ? _this.color[i]
                      : 'rgb(53, 159, 209)';
        })
        .attr('fill', '#fff')
        .attr('clip-path', 'url(#clip)');

    _this.addTooltipPoints(plot, data, i);
    _this.checkTooltip(type);

  }

};

LineChart.prototype.addTooltipPoints = function(plot, data, i, width) {
  var _this = this;
  var width = width || 10;
  plot.selectAll('.points'+i)
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'points points' + i)
            .attr('cx', function(d) { return _this.xScale(d[0]) + _this.xScale.bandwidth()/2; })
            .attr('cy', function(d) { return _this.yScale(d[1]); })
            .attr('r', (width*0.75) )
            .style('cursor', 'pointer')
            .attr('fill', 'transparent')
            .attr('stroke', 'none')
            .attr('clip-path', 'url(#clip)');
};


/**
  * To decide whether transition is need or not. If yes, what kind of transition
  */
LineChart.prototype.checkTransition = function() {

  var _this = this;

  if (_this.options.transition && _this.options.transition.animate) {
      var delay = CONSTANTS.ANIMATION_DELAY;
      var animationDelay = delay[(_this.options.transition.type).toUpperCase()] || 0;
      _this.drawLineWithAnimation(animationDelay);
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
  * To draw the legend details if the user have opted to.
  */
LineChart.prototype.checkLegend = function(type, data) {

  var _this = this;
  if (_this.options.legend && _this.options.legend.show && type === 'multiline') {
    _this.addLegend(type, data)
  }
};


LineChart.prototype.drawLineWithAnimation = function(animationDelay) {
  var _this = this,
      margin = _this.margin;

  var height =  _this.height + margin.top + margin.bottom + CONSTANTS.DEFAULT_MARGIN.TOP;

  _this.clipPath.attr('width', 0)
                .attr('height', height)
                .transition()
                .delay(function(d, i) { return i*animationDelay; })
                .duration(CONSTANTS.ANIMATION_DURATION)
                .attr('width', _this.width)
};

LineChart.prototype.drawLineWithoutAnimation = function() {
  var _this = this;

  _this.clipPath.attr('width', _this.width)
                .attr('height', _this.height);
};

LineChart.prototype.removeLine = function(d, i) {
  var _this  = this,
      legend = _this.options.legend;

  var active = d.active ? false : true;
  var opacity = active ? 0.5 : 1;

  d3.select(_this.element)
    .selectAll('#legend_' + d.key.replace(/ /g,'_'))
    .style('opacity', opacity);

  if (active) {
    d3.select(_this.element)
      .selectAll('.line-' + i)
      .transition(100)
      .style('display', 'none');

    d3.select(_this.element)
      .selectAll('.points' + i)
      .style('display', 'none');
  } else {
    d3.select(_this.element)
      .selectAll('.line-' + i)
      .transition(100)
      .style('display', null);

    d3.select(_this.element)
      .selectAll('.points' + i)
      .style('display', null);
  }
  d.active = active;
  return d;
};

LineChart.prototype.dataExist = function(type, data) {
  if (data.length) {
    for (i = 0; i < data.length; i++) {
      if ((type === 'multiline' && data[i].value.length !== 0) || (type === 'line' && data.length !== 0)) {
        return true;
      }
    }
  }
  return false;
};
