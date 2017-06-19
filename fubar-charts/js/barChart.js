/**
  * Used for drawing barcharts.
  * Barchart class definition.
  *
  * @param {String} element - Name of the element to which graph is to be drawn.
  * @param {Object} data - Data for which graph is to be drawn
  * @param {Object} options - Other options that can be added to the graph.
  */
var BarChart = function(element, data, options) {

  var _this = this;

  // Set all the parameter values to global scope
  _this.setValues(element, data, options, {
    type : 'bar'
  });

  // Range of x and y axis values.
  _this.xExtent = _this.xExtentCalculate(_this.data);
  _this.yExtent = _this.yExtentCalculate(_this.data);

  _this.drawBarChart('bar');

  // Redraw the graph when window size is altered so as to make it responsive.
  window.addEventListener('resize', function(event) {
    _this.setValues(element, data, options, {
      type : 'bar'
    });
    _this.drawBarChart('bar');
  });

};


// Cloning the baseclass `Chart` so as to access all its methods.
BarChart.prototype = Object.create(Chart.prototype);

/**
  * Function which finds the X Axis ticks from the data provided.
  * @return {Array} - An array which contains all x Axis ticks.
  */
BarChart.prototype.xExtentCalculate = function(data) {
  return data.map(function(d) { return d[0]; });
};

/**
  * Function which finds the range of Y Axis values from the data provided.
  * @return {Array} - An array which contains minimum and maximum value.
  */
BarChart.prototype.yExtentCalculate = function(data) {
  var yExtent = d3.extent(data, function(d) { return d[1]; });
  if (yExtent[0] > 0) {
    yExtent[0] = 0;
  }
  return yExtent;
};

/**
  * Draws Barchart according to user input.
  * @param {Integer} barWidth - User defined width of each bar.
  */
BarChart.prototype.drawBarChart = function(type) {

  var _this  = this,
      margin = _this.margin;

  // Calls the base class function to draw canvas.
  _this.drawChart();

  // Display svg only in the graph area.
  _this.plot.append('clipPath')
            .attr('id', 'bar-clip')
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', _this.width)
            .attr('height', _this.height - (margin.bottom + CONSTANTS.DEFAULT_MARGIN.BOTTOM));

  _this.checkGoalLine();
  _this.createBars(type, _this.data);
  _this.checkTransition();
  _this.checkTooltip(type);

};

/**
  * Create the element for bars checking whether it is normal or stacked graph.
  * @param {String} type - Type of the graph (stack/bar)
  */
BarChart.prototype.createBars = function(type, data) {

  var _this  = this,
      margin = _this.margin,
      bar    = _this.options.bar ? _this.options.bar : CONSTANTS.BAR;

  switch (type) {
    case 'bar':
      var barPlot = _this.plot.append('g')
                              .attr('class', 'fc-bars ');

      _this.bar = barPlot.selectAll('bar')
                          .data(data)
                          .enter()
                          .append('path')
                          .attr('class', 'fc-bar')
                          .attr('fill', _this.color);
      break;
    case 'stackedBar':
      var barPlot = _this.plot.append('g')
                            .attr('class', 'fc-stacked-bars');

      _this.groups = barPlot.selectAll('g.stack')
                               .data(_this.stack_data)
                               .enter()
                               .append('g')
                               .style('fill', function(d, i) { return _this.color[i]; });

      _this.rect = _this.groups.selectAll('path')
                               .data(function(d) { return d; })
                               .enter()
                               .append('path')
                               .attr('class', 'fc-stacked-bar');
      break;
  }
};

/**
  * To decide whether transition is need or not. If yes, what kind of transition
  */
BarChart.prototype.checkTransition = function() {

  var _this      = this,
      transition = _this.options.transition,
      barWidth   = _this.calculateBarwidth();

  if (transition && transition.animate) {
    var animationDelay = (transition.delay)
                            ? transition.delay
                            : 0,
        duration       = (transition.duration)
                            ? transition.duration
                            : 1000;
    _this.drawBarsWithAnimation(barWidth, animationDelay, duration);
  } else {
    _this.drawBarsWithoutAnimation(barWidth);
  }

};

/**
  * To draw the goal lines if the user have opted to.
  */
BarChart.prototype.checkGoalLine = function() {
  var _this = this;
  if (_this.options.goalLine && _this.options.goalLine.value) {
    _this.addGoalLines();
  }
};

/**
  * Calculates the responsive bar width for the graph.
  */
BarChart.prototype.calculateBarwidth = function() {
  var _this = this,
      bar   = _this.options.bar;

  var barWidth = (bar && bar.width)
                      ? bar.width
                      : _this.xScale.bandwidth();

  barWidth = (barWidth > _this.xScale.bandwidth())
                      ? _this.xScale.bandwidth()
                      : barWidth;

  return barWidth;
};

/**
  * Draws bars in a Barchart with animation.
  * @param {Integer} barWidth - User defined width of each bar.
  * @param {Integer} animationDelay - Delay after which each bars are drawn(in ms)
  */
BarChart.prototype.drawBarsWithAnimation = function(barWidth, animationDelay, duration) {

  var _this   = this,
      bar     = _this.options.bar,
      radius  = barWidth/2,
      xShift  = _this.barCentering(barWidth, _this.xScale.bandwidth()),
      opacity = (bar && bar.opacity)
                      ? bar.opacity
                      : CONSTANTS.BAR.opacity;

  _this.bar.attr('d', function(d) {
            var x = _this.xScale(d[0]) + xShift;
            return _this.drawRoundedRectangle(d, x, _this.yMin, barWidth, 0, 0);
          })
          .attr('clip-path', 'url(#bar-clip)')
          .transition()
          .delay(function(d, i) { return i*animationDelay; })
          .duration(duration)
          .attr('d', function(d) {
            return _this.drawBar(d, xShift, barWidth)
          })
          .attr('opacity', opacity);

};


/**
  * Draws bars in a Barchart without animation.
  * @param {Integer} barWidth - User defined width of each bar.
  */
BarChart.prototype.drawBarsWithoutAnimation = function(barWidth) {

  var _this   = this,
      bar     = _this.options.bar,
      radius  = barWidth/2,
      opacity = (bar && bar.opacity)
                      ? bar.opacity
                      : CONSTANTS.BAR.opacity,
      xShift  = _this.barCentering(barWidth, _this.xScale.bandwidth());

  _this.bar.attr('d', function(d) {
              return _this.drawBar(d, xShift, barWidth);
            })
            .attr('clip-path', 'url(#bar-clip)')
            .attr('opacity', opacity);

};

/**
 * Draws rounded rectangle bars
 * @param  {Integer} d        - data
 * @param  {Integer} y        - Y-axis coordinate
 * @param  {Integer} barWidth - width of each bar
 * @param  {Integer} height   - height of each bar
 * @param  {Integer} radius   - radius of curve
 * @return {string}           - path of svg element
 */
BarChart.prototype.drawRoundedRectangle = function (d, x, y, width, height, radius) {

  return 'M' + (x + radius) + ' ' + y
          + 'h' + (width - 2*radius)
          + 'a' + radius + ' ' + radius + ' '+ 0 + ' ' + 0 + ' ' + 1 + ' ' + radius + ' ' + radius
          + 'v' + (height - 2*radius)
          + 'v' + radius
          + 'h' + -radius
          + 'h' + (2*radius - width)
          + 'h' + -radius
          + 'v' + -radius
          + 'v' + (2*radius - height)
          + 'a' + radius + ' ' + radius + ' '+ 0 + ' ' + 0 + ' ' + 1 + ' ' + radius + ' ' + -radius
          + 'z';

};

/**
  * To draw the bar with curved end at the top.
  * @param {Object} d - Data
  * @param {Integer} margin - margin amount to be shifted
  * @param {Integer} barWidth - Width of each bar
  */
BarChart.prototype.drawBar = function(d, margin, barWidth) {

  var _this = this,
      bar   = _this.options.bar;
  var x, y, height, radius;
  radius = (bar && bar.curve) ? barWidth/2 : 0;
  x      = _this.xScale(d[0]) + margin,
  y      = _this.yScale(d[1]),
  height = _this.yMin - _this.yScale(d[1]);

  return _this.drawRoundedRectangle(d, x, y, barWidth, height, radius);
};

/**
  * To find how much more length is to be shifted on X axis when user defines
  * the widht of the bar in chart.
  * @param {Integer} barWidth - User defined bar width for the chart.
  * @return {Integer} - The amount of units in the X axis that needs to be shifted.
  */
BarChart.prototype.barCentering = function(barWidth) {
  var _this = this;
  if (barWidth <  _this.xScale.bandwidth())
    return (_this.xScale.bandwidth()-barWidth)/2;
  else
    return 0;
};
