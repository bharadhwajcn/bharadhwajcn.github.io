/**
  * Base class prototype for all Charts.
  */
var Chart = function() { };

/**
  * For making all user inputs to global scope.
  * @param {String} element - Name of the element to which graph is to be drawn
  * @param {Object} data    - Data for which graph is to be drawn
  * @param {Object} options - Config options that can be added to the graph.
  * @param {Array} stack    - List of keys which is to be made as stack.
  */
Chart.prototype.setValues = function(element, data, options, metaData) {

  var _this = this,
      color = CONSTANTS.DEFAULT_COLORS;

  // To check whether it is the DOM element or classname or id of the DOM element
  if (typeof element === 'object') {
    _this.element   = element;
  } else {
    _this.element = document.querySelector(element);
  }

  _this.elementClass = _this.element.className;
  _this.data         = data;
  _this.options      = options || { };

  // This is logic to set an array of colors for graphs that need multicolor
  if (metaData) {
    if (metaData.type === 'stack') {
      _this.stackList = metaData.stack || [ ];
      if (_this.options.bar && _this.options.bar.color) {
        _this.color = _this.options.bar.color;
      } else {
        _this.color = color;
      }
    } else if (metaData.type === 'multiline') {
      if (_this.options.line && _this.options.line.color) {
        _this.color = _this.options.line.color;
      } else {
        _this.color = color;
      }
    }
  }

  var margin = _this.options.margin;

  _this.margin =  {
    left   : (margin && margin.left) ? margin.left : 0,
    right  : (margin && margin.right) ? margin.right : 0,
    top    : (margin && margin.top) ? margin.top : 0,
    bottom : (margin && margin.bottom) ? margin.bottom : 0
  };

  // var excessHeight = _this.margin.bottom ;
  var axis   = _this.options.axis;
  var legend = _this.options.legend;
  if (axis && axis.xAxis && axis.xAxis.orientation) {
    var excessHeight = CONSTANTS.DEFAULT_MARGIN.BOTTOM;
  } else {
    var excessHeight = CONSTANTS.DEFAULT_MARGIN.TOP;
  }

  _this.width         = _this.element.offsetWidth;
  _this.height        = _this.element.offsetHeight;
  _this.elementHeight = _this.element.offsetHeight;

  _this.element.addEventListener('touchstart', handleTouch, false);

  function handleTouch(e) {
    e.preventDefault();
  };

};

/**
  * Creates the canvas, calculate and draw X and Y axis of the graph & add grid lines.
  */
Chart.prototype.drawChart = function() {

  var _this  = this,
      legend = _this.options.legend,
      axis   = _this.options.axis;

  if (legend && legend.show) {
    if (legend.height) {
      _this.legendHeight = legend.height;
      _this.height -= _this.legendHeight;
      _this.elementHeight -= _this.legendHeight;
    } else {
      _this.legendHeight = '45';
      _this.height -= _this.legendHeight;
      _this.elementHeight -= _this.legendHeight;
    }
  }
  _this.createCanvas();
  _this.xScales();
  _this.yScales();
  _this.addAxes();

  if (_this.options.grids) {
    _this.addGridLines(_this.options.grids);
  }

  if (axis && axis.yAxis && axis.yAxis.ticks && axis.yAxis.ticks.values) {
    _this.addHorizontalGridLines();
  }

};

/**
  * Creates the canvas under the element user mentions.
  * @return {Object} plot - Object where all elements of graph need to be attached
  */
Chart.prototype.createCanvas = function() {

  var _this  = this;

  // Removes if any svg exists before drawing
  d3.select(_this.element)
    .selectAll('svg')
    .remove();

  var svg = d3.select(_this.element)
              .append('svg')
              .attr('width', '100%')
              .attr('height', _this.elementHeight)
              .attr('class', 'qd-graph-area');

  // All elements like axis, lines, bars are to be attached to this object.
  _this.plot = svg;

};

/**
  * Calculate the max and min values of X axis from the user data.
  */
Chart.prototype.xScales = function() {

  var _this   = this,
      axis    = _this.options.axis,
      margin  = _this.margin,
      width   = _this.width,
      xExtent = _this.xExtent;

  // To set the extend at every possible orientation
  if (axis && axis.yAxis && axis.yAxis.orientation) {
    if (axis.yAxis.orientation === 'left') {
      _this.xMin = margin.left;
      _this.xMax = width - margin.right;
    } else {
      _this.xMin = margin.left;
      _this.xMax = width - margin.right;
    }
  } else {
    _this.xMin = margin.left + CONSTANTS.DEFAULT_MARGIN.LEFT;
    _this.xMax = width - margin.right;
  }

  _this.xScale = d3.scaleBand()
                   .padding(.1)
                   .range([_this.xMin, _this.xMax])
                   .domain(xExtent);
};

/**
  * Calculate the max and min values of Y axis from the user data.
  */
Chart.prototype.yScales = function() {

  var _this    = this,
      margin   = _this.margin,
      axis     = _this.options.axis,
      goalLine = _this.options.goalLine,
      height   = _this.height,
      yExtent  = _this.yExtent;

  // To set the extend at every possible orientation
  if (axis && axis.xAxis && axis.xAxis.orientation) {
    if (axis.xAxis.orientation === 'bottom') {
      _this.yMin = height - (margin.bottom + CONSTANTS.DEFAULT_MARGIN.BOTTOM);
      _this.yMax = margin.top;
    } else {
      _this.yMin = height - 1;
      _this.yMax = margin.top + CONSTANTS.DEFAULT_MARGIN.TOP;
    }
  } else {
    _this.yMin = height - (margin.bottom + CONSTANTS.DEFAULT_MARGIN.BOTTOM);
    _this.yMax = margin.top;
  }

  var yAxisTicks    = (axis && axis.yAxis && axis.yAxis.ticks)
                                ? axis.yAxis.ticks
                                : CONSTANTS.AXIS_CONFIG.Y_AXIS.ticks,
      goalLineValue = (goalLine && goalLine.value)
                                ? goalLine.value
                                : 0,
      tickValues    = (yAxisTicks.values)
                                ? yAxisTicks.values
                                : [ ];
  // To capture the tickValues if alias name is to be provided to ticks
  var ticks = [ ];
  if (typeof tickValues[0] === 'object') {
    tickValues.forEach(function(d) {
      ticks.push(d.key);
    });
  } else {
    ticks = tickValues;
  }

  yExtent[1] = d3.max([goalLineValue, yExtent[1], d3.max(ticks)]);

  // If goal value is greater than maximum yvalue, add a 10% buffer space
  if (goalLineValue === yExtent[1]) {
    yExtent[1] *= 1.1;
    tickValues.push(Math.round(yExtent[1]));
  }
  _this.yScale = d3.scaleLinear()
                   .rangeRound([_this.yMin, _this.yMax])
                   .domain(yExtent);

  //If there are no tick values, round off to a whole number
  if (tickValues.length === 0) {
    _this.yScale.nice();
  }

};

/**
  * Draws X and Y axis to the graph with the help of xScale and yScales.
  */
Chart.prototype.addAxes = function() {

  var _this   = this,
      xConfig = (_this.options.axis && _this.options.axis.xAxis)
                          ? _this.options.axis.xAxis
                          : CONSTANTS.AXIS_CONFIG.X_AXIS,
      yConfig = (_this.options.axis && _this.options.axis.yAxis)
                          ? _this.options.axis.yAxis
                          : CONSTANTS.AXIS_CONFIG.Y_AXIS;

  _this.addXAxis(xConfig);
  _this.addYAxis(yConfig);

};

/**
 * To add X axis
 * @param {object} config - X axis configuration options
 */
Chart.prototype.addXAxis = function(config) {

  var _this        = this,
      margin       = _this.margin,
      scale        = _this.xScale,
      padding      = (config && config.ticks && config.ticks.padding)
                            ? config.ticks.padding
                            : CONSTANTS.AXIS_CONFIG.X_AXIS.ticks.padding,
      firstLabel   = (config && config.firstLabel !== undefined)
                            ? config.firstLabel
                            : CONSTANTS.AXIS_CONFIG.X_AXIS.firstLabel,
      orientation  = (config && config.orientation)
                          ? config.orientation
                          : CONSTANTS.AXIS_CONFIG.X_AXIS.orientation,
      showAxisLine = (config.showAxisLine !== undefined)
                            ? config.showAxisLine
                            : CONSTANTS.AXIS_CONFIG.X_AXIS.showAxisLine;

  switch (orientation) {
    case 'top':
        var xAxis = d3.axisTop(scale)
                      .tickPadding(padding);
        xAxis = _this.checkXAxisLabels(xAxis, config);
        _this.drawXAxis(config, xAxis, _this.yMax, 'top-axis');
        break;
    default:
        var xAxis = d3.axisBottom(scale)
                      .tickPadding(padding);
        xAxis = _this.checkXAxisLabels(xAxis, config);
        _this.drawXAxis(config, xAxis, _this.yMin, 'bottom-axis');
        break;
  }

  if (!firstLabel) {
    if (_this.element.querySelector('#x-axis').children === undefined && _this.element.querySelector('#x-axis').childNodes[CONSTANTS.FIRST_CHILD] !== undefined){
      _this.element.querySelector('#x-axis')
                   .childNodes[CONSTANTS.FIRST_CHILD]
                   .remove();
    } else if (_this.element.querySelector('#x-axis').children[CONSTANTS.FIRST_CHILD] !== undefined){
      _this.element.querySelector('#x-axis')
                   .children[CONSTANTS.FIRST_CHILD]
                   .remove();
    }
  }

  if(!showAxisLine) {
    _this.element.querySelector('#x-axis path')
                 .remove();
  }

};

/**
 * To add check whether X axis has alias labels
 * @param {object} axis   - X Axis variable
 * @param {object} config - X Axis configuration options
 */
Chart.prototype.checkXAxisLabels = function(axis, config) {

  var _this = this;

  if (config.ticks && config.ticks.values) {
    var tick = config.ticks.values;
    if (typeof tick[0] === 'object') {
      var key    = [ ],
          labels = [ ];
      tick.forEach(function(d) {
        key.push(d.key);
        labels.push(d.label)
      });
    } else {
      var key    = tick,
          labels = tick;
    }
  } else {
    var key    = _this.xExtent,
        labels = _this.xExtent;
  }

  axis.tickValues(key)
      .tickFormat(function(d, i) {
        if (config && config.ticks && config.ticks.formatter)
          return config.ticks.formatter(d);
        else
          return labels[i];
      });

  return axis;
};

/**
 * To add Y axis
 * @param {object} config - Y Axis configuration options
 */

Chart.prototype.addYAxis = function(config) {
  var _this          = this,
      scale          = _this.yScale,
      ticksConfig    = config.ticks ? config.ticks : CONSTANTS.AXIS_CONFIG.Y_AXIS.ticks,
      unit           = ticksConfig.unit ? ticksConfig.unit : '',
      padding        = ticksConfig.padding
                          ? ticksConfig.padding
                          : CONSTANTS.AXIS_CONFIG.Y_AXIS.ticks.padding,
      firstLabel     = (config && config.firstLabel !== undefined)
                          ? config.firstLabel
                          : CONSTANTS.AXIS_CONFIG.Y_AXIS.firstLabel,
      orientation    = (config && config.orientation)
                          ? config.orientation
                          : CONSTANTS.AXIS_CONFIG.Y_AXIS.orientation,
      showAxisLine   = (config && config.showAxisLine !== undefined)
                          ? config.showAxisLine
                          : CONSTANTS.AXIS_CONFIG.Y_AXIS.showAxisLine;

  switch (orientation) {
    case 'right':
        var yAxis = d3.axisRight(scale)
                      .tickPadding(padding);
        yAxis = _this.checkYAxisLabels(yAxis, config, unit);
        _this.drawYAxis(config, yAxis, _this.xMax, 'right-axis');
        break;

    default:
        var yAxis = d3.axisLeft(scale)
                      .tickPadding(padding);
        yAxis = _this.checkYAxisLabels(yAxis, config, unit);
        _this.drawYAxis(config, yAxis, _this.xMin, 'left-axis');
        break;
  }

  if (!firstLabel) {
    if (_this.element.querySelector('#y-axis').children === undefined  && _this.element.querySelector('#y-axis').childNodes[CONSTANTS.FIRST_CHILD] !== undefined){
      _this.element.querySelector('#y-axis')
                   .childNodes[CONSTANTS.FIRST_CHILD]
                   .remove();
    } else if (_this.element.querySelector('#y-axis').children[CONSTANTS.FIRST_CHILD] !== undefined) {
      _this.element.querySelector('#y-axis')
                   .children[CONSTANTS.FIRST_CHILD]
                   .remove();
    }
  }

  if(!showAxisLine) {
    _this.element.querySelector('#y-axis path')
                 .remove();
  }
};

/**
 * To add check whether Y axis has alias labels
 * @param {object} axis   - Y Axis variable
 * @param {object} config - Axis configuration options
 */
Chart.prototype.checkYAxisLabels = function(axis, config, unit) {

  var _this      = this;

  var firstLabel = (config && config.firstLabel !== undefined)
                            ? config.firstLabel
                            : CONSTANTS.AXIS_CONFIG.Y_AXIS.firstLabel;

  if (config.ticks && config.ticks.values) {
    var tick = config.ticks.values;
    if (typeof tick[0] === 'object') {
      var key    = [ ],
          labels = [ ];
      tick.forEach(function(d) {
        key.push(d.key);
        labels.push(d.label)
      });
    } else {
      var key    = tick,
          labels = tick;
    }
    if (key.indexOf(_this.yExtent[0]) < 0) {
      if (firstLabel) {
        key.unshift(_this.yExtent[0]);
      } else {
        key.unshift('');
      }
      labels.unshift('');
    }
    axis.tickValues(key)
        .tickFormat(function(d, i) {
          if (config && config.ticks && config.ticks.formatter)
            return config.ticks.formatter(d) + ' ' + unit;
          else
            return labels[i] + ' ' + unit;
        });
  } else {
    axis.tickFormat(function(d) {
          if (config && config.ticks && config.ticks.formatter)
            return config.ticks.formatter(d) + ' ' + unit;
          else
            return d + ' ' + unit;
        });
  }
  return axis;
};

/**
 * To draw X axis based on user input
 * @param {object} config     - X Axis configuration options
 * @param {Object} xAxis      - X axis object to draw the axis
 * @param {Integer} topMargin - Amount the top margin needs to be shifted
 * @param {String} className  - CSS classname for X Axis
 */
Chart.prototype.drawXAxis = function(config, xAxis, topMargin, className) {

  var _this          = this,
      translateLeft  = _this.defaultMargin(),
      font_size      = (config.ticks && config.ticks.font_size)
                            ? config.ticks.font_size
                            : CONSTANTS.AXIS_CONFIG.X_AXIS.ticks.font_size;

  className = className !== undefined
                        ? 'x axis ' + className
                        : 'x axis';

  var tickPosition = {
    x : (config.ticks && config.ticks.x) ? config.ticks.x : 0,
    y : (config.ticks && config.ticks.y) ? config.ticks.y + topMargin : topMargin
  }

  _this.xAxisLabels = _this.plot.append('g')
                                .attr('class', className)
                                .attr('id', 'x-axis')
                                .attr('transform', 'translate(' + tickPosition.x + ', ' + tickPosition.y +')')
                                .call(xAxis)
                                .selectAll('.tick text')
                                .attr('font-size', font_size);

  _this.checkAxisLabelRotation(config);

};

/**
 * To check whether X axis label is to be rotated or not.
 * @param {object} config   - X Axis configuration options
 */
Chart.prototype.checkAxisLabelRotation = function(config) {

  var _this = this,
      ticks = config.ticks;
  if (ticks && ticks.rotate && ticks.rotate.angle) {
    var angle  = ticks.rotate.angle;
    var xShift = ticks.rotate.x,
        yShift = ticks.rotate.y;
    _this.rotateAxisLabel(xShift, yShift, angle);
  }

};

/**
 * To draw y axis based on user input
 * @param {object} config      - configuration options
 * @param {Object} yAxis       - y-axis object to draw the axis
 * @param {Integer} leftMargin - Amount the left margin needs to be shifted
 */
Chart.prototype.drawYAxis = function(config, yAxis, leftMargin, className) {
  var _this     = this,
      alignment = (config.ticks && config.ticks.alignment)
                                ? config.ticks.alignment
                                : CONSTANTS.AXIS_CONFIG.Y_AXIS.ticks.alignment,
      font_size = (config.ticks && config.ticks.font_size)
                                ? config.ticks.font_size
                                : CONSTANTS.AXIS_CONFIG.Y_AXIS.ticks.font_size,
      className = (className !== undefined)
                                ? 'y axis ' + className
                                : 'y axis';

  var tickPosition = {
    x : (config.ticks && config.ticks.x) ? config.ticks.x + leftMargin : leftMargin,
    y : (config.ticks && config.ticks.y) ? config.ticks.y : 0
  }

  _this.plot.append('g')
            .attr('class', className)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + tickPosition.x + ',' + tickPosition.y +')')
            .call(yAxis)
            .selectAll('.tick text')
            .attr('font-size', font_size)
            .call(_this.wrap, CONSTANTS.LABEL_WIDTH, alignment);

};

/**
  * For adding horizontal and vertical grid lines
  * @param {object} config - Grid configuration options
  */
Chart.prototype.addGridLines = function(config) {

  var _this = this,
      axis  = _this.options.axis;

  if (config.vertical && config.vertical.show) {
    _this.addVerticalGridLines(config.vertical);
  }

  if (config.horizontal && config.horizontal.show) {
    _this.addHorizontalGridLines(config.horizontal);
  }

};

/**
  * For rotating the text on x-axis
  * @param{String} xShift - The amount by which the text is to be shifted in X Axis
  * @param{String} yShift - The amount by which the text is to be shifted in Y Axis
  * @param{Integer} angle - Angle of rotation
  */
Chart.prototype.rotateAxisLabel = function(xShift, yShift, angle) {

  var _this = this,
      axis  = _this.options.axis;

  if (axis && axis.xAxis && axis.xAxis.orientation) {
    if (axis.xAxis.orientation === 'top') {
      var x = xShift || '0px',
          y = yShift || '0px';
    } else {
      var x = xShift || '0px',
          y = yShift || '0px';
    }
  } else {
    var x = xShift || '0px',
        y = yShift || '0px';
  }

  _this.xAxisLabels.attr('x', x)
                   .attr('y', y)
                   .attr('dy', '-10px')
                   .attr('dx', '15px')
                   .attr('transform', 'rotate(-' + angle + ')');

  var ticks = d3.select(_this.element)
                .node()
                .querySelectorAll('#x-axis .tick');

  for (var i = 0; i < Object.keys(ticks).length; i++) {
    ticks[i].style.textAnchor = 'end'
  }

};


/**
 * To wrap labels into lines
 * @param  {String} text      - Text to wrap
 * @param  {Integer} width    - width of each line
 * @param  {text} textAlign   - Alignment
 * @return {String}           - Svg elements
 */
Chart.prototype.wrap = function (text, width, textAlign) {
  text.each(function() {
    var word,
        text        = d3.select(this),
        words       = text.text().split(/\s+/).reverse(),
        line        = [],
        lineNumber  = 0,
        lineHeight  = CONSTANTS.LABEL_LINE_HEIGHT,
        x           = text.attr('x'),
        y           = text.attr('y'),
        dy          = parseFloat(text.attr('dy'))+ lineHeight,
        tspan       = text.text(null)
                          .append('tspan')
                          .attr('x', x)
                          .attr('y', y)
                          .attr('dy', dy + 'em')
                          .attr('text-anchor', textAlign);

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', (++lineNumber) * lineHeight + dy + 'em')
                    .attr('text-anchor', textAlign)
                    .text(word);
      }
    }
  });
};

/**
* Method to add the vertical grid lines to the chart.
* @param  {Object} config  - Vertical grid line config
**/
Chart.prototype.addVerticalGridLines = function(config) {

  var _this  = this,
      legend = _this.options.legend,
      margin = _this.margin;

  var yTranslate = _this.yMin;

  _this.plot.append('g')
            .attr('id', 'vertical-grid')
            .attr('class', 'grid vertical-grid')
            .attr('transform', 'translate(0 ,' + yTranslate + ')')
            .call(_this.verticalGridLines());


  [].forEach.call(
    _this.element.querySelectorAll('#vertical-grid line'),
    function (elt) {
        var style = '';
        if (config.color) style += 'stroke : ' + config.color + ';';
        if (config.opacity) style += 'stroke-opacity : ' + config.opacity + ';';
        elt.setAttribute('style', style);
    });

};

/**
 * Method to add the horizontal grid lines to the chart.
 * @param  {Object} config  - Horizontal grid line config
 **/
Chart.prototype.addHorizontalGridLines = function(config) {

  var _this = this;
  config = config || { };

  _this.plot.append('g')
            .attr('id', 'horizontal-grid')
            .attr('class', 'grid horizontal-grid')
            .call( _this.horizontalGridLines());

  var lineNodes = _this.element.querySelectorAll('#horizontal-grid line');
  var lineNodesLength = _this.element.querySelectorAll('#horizontal-grid line').length;

  [].forEach.call(
    lineNodes,
    function (elt, i) {
      if (!(config.skipFirst && i === 0) && !(config.skipLast && i === lineNodesLength-1)) {
        var style = '';
        if (config.color) style += 'stroke : ' + config.color + ';';
        if (config.opacity) style += 'stroke-opacity : ' + config.opacity + ';';
        elt.setAttribute('style', style);
      }
    });
};

/**
 * Method to add the horizontal goal lines at user specified height on the
 * chart.
 **/
Chart.prototype.addGoalLines = function() {

  var _this        = this,
      goalLine     = _this.options.goalLine,
      value        = goalLine.value,
      className    = goalLine.class
                        ? 'qd-goalLine-line ' + goalLine.class
                        : 'qd-goalLine-line',
      linePosition = _this.yScale(value) - _this.yMin;

  var goalElement = _this.plot.append('g')
                              .attr('class', 'qd-goalLine');

  goalElement.append('g')
             .attr('class', className)
             .attr('transform', 'translate(0, ' + linePosition + ')')
             .call( _this.goalLine());

  if (goalLine.icon) {
    var  height    = goalLine.icon.height,
         width     = goalLine.icon.width,
         url       = goalLine.icon.url,
         iconClass = goalLine.icon.class
                            ? 'qd-goalLine-image ' + iconClass
                            : 'qd-goalLine-image',
         left      = goalLine.icon.left;

      _this.getBase64Image(url, function(base64url) {
        goalElement.append('svg:image')
                   .attr('x', left - 2.5)
                   .attr('y', _this.yScale(value) - height/2 + 1)
                   .attr('width', width)
                   .attr('height', height)
                   .attr('xlink:href', base64url)
                   .attr('class', iconClass);
      });
    }
};

/**
 * To draw the tooltip if the user have opted to.
 * @param {String} type - Type of the chart
 */
Chart.prototype.checkTooltip = function(type) {

  var graph, _this = this;

  switch (type) {
    case 'bar':
      graph = CONSTANTS.BAR_CHART;
      break;
    case 'stack':
      graph = CONSTANTS.STACK_CHART;
      break;
    case 'line':
    case 'multiline':
      graph = CONSTANTS.LINE_CHART;
      break;
    case 'area':
      graph = CONSTANTS.AREA_CHART;
  }

  if (_this.options.tooltip && _this.options.tooltip.show) {
    var event = _this.options.tooltip.listener
                    ? _this.options.tooltip.listener
                    : CONSTANTS.TOOLTIP.LISTENERS;
    _this.showTooltip(_this.options.tooltip, event, graph);
  }

};

/**
 * Method to add the tooltip to the chart. On hovering above the graph
 * @param {Object} config - configuration options
 * @param {String} event  - Name of the event to which Tooltip should respond.
 * @param {Object} graph  - Graph defaults.
 **/
Chart.prototype.showTooltip = function(config, event, graph) {
  var _this = this,
      previousValue,
      triggeredEvent,
      tooltipClass =  config.class ? config.class : '';

  d3.select(_this.element)
    .selectAll('#d3-tip')
    .remove();

  var tooltip = d3.select(_this.element)
                  .append('div')
                  .attr('class', 'qd-tooltip ' + tooltipClass)
                  .attr('id', 'd3-tip');

  tooltip.node().style.position = 'absolute';
  tooltip.node().style.visibility = 'hidden';

  _this.plot.selectAll(graph.element)
            .on(event, function(d) {
              triggeredEvent = d3.event.type;
              switch (graph.type) {
                case 'bar':
                  config.xValue = d[0];
                  config.yValue = d[1];
                  break;
                case 'stack':
                  config.xValue = d.data[_this.xAxisKey];
                  config.yValue = _this.valueSum(d.data, _this.stackList);
                  config.stackData = d.data;
                  break;
                case 'line':
                  config.xValue = d[0];
                  config.yValue = d[1];
                case 'multiline':
                  config.xValue = d[0];
                  config.yValue = d[1];
                  config.line = d[2];
                  break;
              }

              if (previousValue !== d) {
                tooltip.html(config.formatter ? config.formatter() : _this.tooltipBody(config))
                tooltip.node().style.visibility = 'visible';
                tooltip.node().style.left = _this.calculatePosition('left', [config.xValue, config.yValue]);
                tooltip.node().style.top =  _this.calculatePosition('top', [config.xValue, config.yValue]);
                (d3.event.type != 'mouseover') ? previousValue = d : previousValue = '';
              }
              else {
                tooltip.node().style.visibility = 'hidden';
                previousValue = '';
              }
            })
            .on('mouseout', function() {
              if (triggeredEvent === 'mouseover') {
                tooltip.node().style.visibility = 'hidden';
              }
            });

  document.addEventListener('touchstart', function (e) {
      var touch = e.touches[0];
      if (!e.target.classList.contains(graph.class)) {
        tooltip.node().style.visibility = 'hidden';
      }
  }, false);

  document.addEventListener('click', function (e) {
      if (!e.target.classList.contains(graph.class)) {
        tooltip.node().style.visibility = 'hidden';
      }
  }, false);
};

/**
 * To calculate position of tooltip
 * @param  {string} position  - position
 * @param  {Array} d          - data
 * @return {Integer}          - position value
 */
Chart.prototype.calculatePosition = function(position, d) {

  var _this   = this,
      legend  = _this.options.legend,
      line    = _this.options.line,
      tooltip = _this.element.querySelector('#d3-tip'),
      border_left_width = parseInt(window.getComputedStyle(_this.element.querySelector('#d3-tip'), ':after')
                                         .getPropertyValue('border-left-width')),
      border_top_width  = parseInt(window.getComputedStyle(_this.element.querySelector('#d3-tip'), ':after')
                                         .getPropertyValue('border-top-width')),
      tipHeight         = (border_left_width > border_top_width)
                                          ? border_left_width
                                          : border_top_width,
      tooltipHeight     = tipHeight + tooltip.offsetHeight,
      tooltipClasses    = tooltip.classList,
      left    = _this.xScale(d[0]) + _this.shiftCalculate('x', '#d3-tip', tipHeight),
      top     = _this.element.offsetTop
                     + _this.yScale(d[1])
                     + _this.shiftCalculate('y', '#d3-tip', tipHeight)
                     - _this.margin.top;
  if (line && line.plotPoints && line.plotPoints.icon && line.plotPoints.icon.width) {
    top -= line.plotPoints.icon.width/2;
  }

  //if there is not enough space on top, move the tooltip down
  if (top - _this.element.offsetTop < 0) {
    top += (tooltipHeight + tipHeight);
    if (line && line.plotPoints && line.plotPoints.icon && line.plotPoints.icon.width) {
      top += line.plotPoints.icon.width + 2;
    }
    tooltipClasses.add('bottom');
    tooltipClasses.remove('left', 'top', 'right');
  }
  else {
    tooltipClasses.remove('bottom', 'left', 'right');
    tooltipClasses.add('top');
  }

  if ((left - _this.element.offsetLeft) < 0) {
    left += (tooltip.offsetWidth/2 + tipHeight);
    top  += (tooltipHeight/2 + tipHeight/2);
    tooltipClasses.add('right');
    tooltipClasses.remove('bottom', 'top');
  }
  else if((left + tooltip.offsetWidth) > _this.element.offsetWidth) {
    left -= (tooltip.offsetWidth/2 + tipHeight);
    top  += (tooltipHeight/2 + tipHeight/2);
    tooltipClasses.remove('bottom', 'top', 'right');
    tooltipClasses.add('left');
  }

  if (position === 'left') {
    return left + 'px';
  } else {
    if (legend && legend.position === 'top') {
      return (top + _this.legendHeight + tipHeight/2) + 'px';
    } else {
      return top + 'px';
    }
  }
};

/** Amount of shifting required in both so that tooltip appears in
  * correct co-ordinates and above the bar.
  * @param {String} axis        - Value of which axis is to be returned.
  * @param {String} element     - Tooltip element name.
  * @param {Integer} paddingVal - Padding value used in tooltip.
  * @return {Integer}           -  The amount of units to be shifted in corresponding axis.
  **/

Chart.prototype.shiftCalculate = function(axis, element, tipHeight) {

  var _this = this,
      elementWidth = _this.element.querySelector(element).offsetWidth,
      elementHeight = _this.element.querySelector(element).offsetHeight,
      xShift = _this.xScale.bandwidth()/2 - elementWidth/2,
      yShift = -(elementHeight + tipHeight);

  if (_this.margin) {
    yShift += _this.margin.top;
  }

  if (axis === 'x' || axis === 'X')
    return xShift;
  else if (axis === 'y' || axis === 'Y')
    return yShift;
};

/**
 * Formats the body for tooltip when title, X-Label and Y-Label are given.
 * @param {Object} config   - tooltip configuration options.
 * @return {String} content - Formatted HTML string for tooltip body.
 */
Chart.prototype.tooltipBody = function(config) {

  if (config.body) {
    var _this   = this;
        title   = config.body.title ? config.body.title : CONSTANTS.TOOLTIP.BODY.title,
        xLabel  = config.body.xLabel ? config.body.xLabel : CONSTANTS.TOOLTIP.BODY.xLabel,
        yLabel  = config.body.yLabel ? config.body.yLabel : CONSTANTS.TOOLTIP.BODY.yLabel,
        xValue  = config.xValue,
        yValue  = config.yValue,
        content = '';

    if (title) {
      content += '<b>' + title + '</b>';
    }
    if (xLabel) {
       content += '<br/>' + xLabel + ': ' + xValue;
    }
    if (yLabel) {
       content += '<br/>' + yLabel + ': ' + yValue;
    }
    return content;
  }

};

/**
  * For creating vertical lines.
  */
Chart.prototype.verticalGridLines = function() {

  var _this  = this,
      axis   = _this.options.axis,
      xAxis  = (axis && axis.xAxis)
                    ? axis.xAxis
                    : CONSTANTS.AXIS_CONFIG.X_AXIS,
      height = _this.yMin - _this.yMax;

  var xTick = d3.axisBottom(_this.xScale)
                .tickSize(-height)
                .tickFormat('');

  if (xAxis.ticks && xAxis.ticks.values) {
    var tick = xAxis.ticks.values;
    if (typeof tick[0] === 'object') {
      var key = [ ];
      tick.forEach(function(d) {
        key.push(d.key);
      });
    } else {
      var key = tick;
    }
    xTick.tickValues(key);
  }
  return xTick;
};

/**
  * For creating horizontal lines.
  */
Chart.prototype.horizontalGridLines = function() {

  var _this = this,
      axis  = _this.options.axis,
      yAxis = axis && axis.yAxis
                    ? _this.options.axis.yAxis
                    : CONSTANTS.AXIS_CONFIG.Y_AXIS,
      width = _this.width;

  var yTick = d3.axisLeft(_this.yScale)
                .tickSize(-width)
                .tickFormat('');

  if (yAxis.ticks && yAxis.ticks.values) {
    var tick = yAxis.ticks.values;
    if (typeof tick[0] === 'object') {
      var key = [ ];
      tick.forEach(function(d) {
        key.push(d.key);
      });
    } else {
      var key = tick;
    }
    if (key.indexOf(_this.yExtent[0]) < 0) {
      key.unshift(_this.yExtent[0]);
    }
    yTick.tickValues(key);
  }
  return yTick;
};

/**
 * For creating horizontal lines at user specified point on y-Axis.
 */
Chart.prototype.goalLine = function() {

  var _this = this,
      width = _this.width;

  return d3.axisLeft(_this.yScale)
           .tickSize(-width)
           .ticks(1)
           .tickFormat('')
};

/**
 * For automatically finding the margin.
 */
Chart.prototype.defaultMargin = function() {

  var _this  = this,
      config = _this.options.axis;

  if (config && config.yAxis && config.yAxis.orientation) {
    if (config.yAxis.orientation === 'left') {
      return CONSTANTS.DEFAULT_MARGIN.LEFT;
    } else {
      return 0;
    }
  }
  else {
    if (CONSTANTS.AXIS_CONFIG.Y_AXIS.orientation === 'left') {
      return CONSTANTS.DEFAULT_MARGIN.LEFT;
    } else {
      return 0;
    }
  }
};

/**
 * To find the sum of values in an `object` that is mentioned in `list`.
 * Eg: Object = { a : 1, b : 2, c : 5 } list = ['a', 'b'], returns 3
 * @param {Object} object - The source object whose sum of values to be found.
 * @param {Array} list - The list of key whose sum of values are to be found.
 * @return {Integer} sum - The sum of values of keys mentioned in `list`.
 */
Chart.prototype.valueSum = function(object, list) {

  var sum = 0;
  for (var elt in object) {
    if (object.hasOwnProperty(elt) && list.indexOf(elt) !== -1) {
      sum += parseFloat(object[elt]);
    }
  }
  return sum;
};

/**
 * To check whether a given string is a real number or not.
 */
Chart.prototype.isNumber =function(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
};


/**
 * To get the base64 URL of image.
 */
Chart.prototype.getBase64Image = function(url, callback) {

  var img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = url;
  img.id = 'qd-image-id';
  var div = document.createElement('div');
  div.style.display = 'none';
  div.id = 'qd-invisible-div';
  document.body.appendChild(div);

  img.onload = function () {
    div.appendChild(img);
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL('image/png');
      d3.selectAll('#qd-image-id').remove();
      d3.selectAll('#qd-invisible-div').remove();
      callback(dataURL);

  };
};

/**
 * To find elements that is in source array but not in check array.
 * Eg: Source = [1, 2, 3, 4] Check = [1, 2], Diff = [3, 4]
 * @param {Array} a - Check array.
 * @return {Array} - The elements in source array and not in check array.
 */
Array.prototype.diff = function(a) {
  return this.filter(function(i) { return a.indexOf(i) < 0; });
};

/**
 * To find unique elements from an array.
 * Eg: arr = [1, 2, 3, 4, 1, 2, 3, 1, 2, 3] arr.unique() = [1, 2, 3, 4]
 * @return {Array} - Unique elements in that array.
 */
Array.prototype.unique = function() {
  var a = [ ];
  for (var i = 0,  l = this.length; i < l; i++)
      if (a.indexOf(this[i]) === -1)
          a.push(this[i]);
  return a;
}


Array.range = function(start, stop, step) {
  var a = [ ];
  step = step || 1;
  a[0] = start;
  while (start+step <= stop) {
    a[a.length] = start+= step;
  }
  return a;
};

if (Element.prototype.remove === undefined) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

if (String.prototype.contains === undefined) {
  String.prototype.contains = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}
