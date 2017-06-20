/**
  * Used for drawing Stacked Barcharts.
  * Stacked Barchart class definition.
  *
  * @param {String} element - Name of the element to which graph is to be drawn.
  * @param {Object} data - Data for which graph is to be drawn
  * @param {Array} stack - List of json Keys that forms the stack
  * @param {Object} options - Other options that can be added to the graph.
  */
var StackedBarChart = function(element, data, stack, options) {

  var _this = this;

  _this.setValues(element, data, options, {
    type : 'stackedBar',
    stack : stack
  });

  _this.createStack();

  // Range of x and y axis values.
  _this.xExtent = _this.xExtentCalculate(_this.data);
  _this.yExtent = _this.yExtentCalculate(_this.data);

  _this.drawBarChart('stackedBar');

  // Redraw the graph when window size is altered so as to make it responsive.
  window.addEventListener('resize', function(event) {
    _this.setValues(element, data, options, {
      type : 'stackedBar',
      stack : stack
    });
    _this.drawBarChart('stackedBar');
  });

};


// Cloning the baseclass `BarChart` so as to access all its methods.
StackedBarChart.prototype = Object.create(BarChart.prototype);


/**
  * To create the array to draw stacked graph from the given user data
  */
StackedBarChart.prototype.createStack = function() {

  var _this = this,
      bar   = _this.options.bar;

  // Creating `stack` data structure
  _this.stack = d3.stack()
                  .keys(_this.stackList)
                  .order(d3.stackOrderNone)
                  .offset(d3.stackOffsetNone);

  // Converting user data to d3 stack form.
  _this.stack_data =  _this.stack(_this.data);
  if (bar && bar.curve && bar.curve.show && bar.curve.bars.toUpperCase() === 'ALL') {
    _this.stack_data.reverse().forEach(function(data) {
      var len = data.length;
      for (var i = 0; i < len; i++) {
        data[i][0] = 0;
      }
    });
  }


  // Getting the x-Axis tick values from the data
  _this.xAxisKey = Object.keys(_this.data[0]).diff(_this.stackList)[0];

};

/**
  * Function which finds the X Axis ticks from the data provided.
  * @return {Array} - An array which contains all x Axis ticks.
  */
StackedBarChart.prototype.xExtentCalculate = function(data) {

  var _this = this;

  return Object.keys(data)
               .map(function (key) {
                  return data[key][_this.xAxisKey];
                });
};

/**
  * Function which finds the range of Y Axis values from the data provided.
  * @return {Array} - An array which contains minimum and maximum value.
  */
StackedBarChart.prototype.yExtentCalculate = function(data) {

  var _this = this;
  var yExtent =  d3.extent(data.map(function(d) { return _this.valueSum(d, _this.stackList); }));
  if (yExtent[0] > 0) {
    yExtent[0] = 0;
  }
  return yExtent;

};

/**
  * Draws bars in a Barchart with animation.
  * @param {Integer} barWidth - User defined width of each bar.
  * @param {Integer} animationDelay - Delay after which each bars are drawn(in ms)
  */
StackedBarChart.prototype.drawBarsWithAnimation = function(barWidth, animationDelay, duration) {

  var _this  = this,
      xShift = _this.barCentering(barWidth, _this.xScale.bandwidth());

  _this.rect.attr('d', function(d) {
              var x = xShift + _this.xScale(d.data[_this.xAxisKey]),
                  y = _this.yMin;
              return _this.drawRoundedRectangle(d, x, y, barWidth, 0, 0);
            })
            .attr('clip-path', 'url(#bar-clip)')
            .transition()
            .delay(function(d, i) { return i*animationDelay; })
            .duration(duration)
            .attr('d', function(d) {
              return _this.drawBar(d, xShift, barWidth);
            });
};

/**
  * Draws bars in a Barchart without animation.
  * @param {Integer} barWidth - User defined width of each bar.
  */
StackedBarChart.prototype.drawBarsWithoutAnimation = function(barWidth) {

  var _this  = this,
      xShift = _this.barCentering(barWidth, _this.xScale.bandwidth());

  _this.rect.attr('d', function(d) {
              return _this.drawBar(d, xShift, barWidth);
            })
            .attr('clip-path', 'url(#bar-clip)');
};

/**
  * To draw the stacked graph with curved end at the top.
  * @param {Object} d - Data
  * @param {Integer} margin - margin amount to be shifted
  * @param {Integer} barWidth - Width of each bar
  */
StackedBarChart.prototype.drawBar = function(d, margin, barWidth) {

  var _this = this,
      bar   = _this.options.bar;

  if (bar && bar.curve && bar.curve.show) {
    var radius = barWidth/2;
  } else {
    var radius = 0;
  }

  var x = margin + _this.xScale(d.data[_this.xAxisKey]);
  var totalheight = _this.valueSum(d.data, _this.stackList);

  if (isNaN(d[1])) {
    var y  = _this.yScale(d[0]);
    height = 0;
  } else {
    var y  = _this.yScale(d[1]);
    height = _this.yScale(d[0]) - _this.yScale(d[1]);
  }
  if (bar && bar.curve && bar.curve.show && bar.curve.bars.toUpperCase() === 'ALL') {
    return _this.drawRoundedRectangle(d, x, y, barWidth, height, radius);
  } else {
    if (totalheight === d[1]) {
      return _this.drawRoundedRectangle(d, x, y, barWidth, height, radius);
    } else {
      return _this.drawRoundedRectangle(d, x, y, barWidth, height, 0);
    }
  }
};
