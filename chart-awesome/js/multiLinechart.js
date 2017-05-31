/**
  * Used for drawing Multilinecharts.
  * MultiLinechart class definition.
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
var MultiLineChart = function(element, data, options) {

  var _this = this;

  if (options && options.axis && options.axis.xAxis && options.axis.xAxis.ticks && options.axis.xAxis.ticks.type) {
    var xAxis = options.axis.xAxis;
    if (xAxis.ticks.type === 'number') {
      data.forEach(function(d, i) {
        d.value.sort(function(a, b) { return (parseFloat(a[0]) > parseFloat(b[0])) ? 1 : -1; });
      });
    } else if (xAxis.ticks.type === 'string' && xAxis.ticks.ordering) {
      var order = xAxis.ticks.ordering;
      data.forEach(function(d, i) {
        d.value.sort(function(a, b) { return order.indexOf(a[0]) > order.indexOf(b[0]) ? 1 : -1; });
      });
    }

  }

  // Set all the parameter values to global scope
  _this.setValues(element, data, options, { type : 'multiline' });

  // Range of x and y axis values.
  _this.xExtent = _this.xExtentCalculate(_this.data);
  _this.yExtent = _this.yExtentCalculate(_this.data);

  _this.initiateDraw('multiline');

  // Redraw the graph when window size is altered so as to make it responsive.
  window.addEventListener('resize', function(event) {
    _this.setValues(element, data, options);
    _this.initiateDraw('multiline');
  });

}

// Cloning the baseclass `Chart` so as to access all its methods.
MultiLineChart.prototype = Object.create(LineChart.prototype);


/**
  * Function which finds the X Axis ticks from the data provided.
  * @return {Array} - An array which contains all x Axis ticks.
  */
MultiLineChart.prototype.xExtentCalculate = function(data) {

  var _this  = this;
  var axisConfig = _this.options.axis;
  // Future me, this may not make any sense in future, but it's here
  // for the purpose of drawing vertical grid lines. Don't re write it.
  if (axisConfig && axisConfig.xAxis && axisConfig.xAxis.ticks) {
    if (axisConfig.xAxis.ticks.type === 'number') {
      if (axisConfig.xAxis.ticks.range) {
        var xValues = axisConfig.xAxis.ticks.range;
        return Array.range(xValues.start, xValues.stop, 1)
      } else if (axisConfig.xAxis.ticks.values) {
        var xValues = d3.extent(axisConfig.xAxis.ticks.values);
        return Array.range(xValues[0], xValues[1], 1)
      }
    } else {
      if (axisConfig.xAxis.ticks.ordering) {
        return axisConfig.xAxis.ticks.ordering;
      } else {
        var values = _this.flattenArray(data).map(function(d) { return d[0]; });
        return values.unique();
      }
    }
  } else {
    var values = _this.flattenArray(data).map(function(d) { return d[0]; });
    return values.unique();
  }

};

/**
  * Function which finds the range of Y Axis values from the data provided.
  * @return {Array} - An array which contains minimum and maximum value.
  */
MultiLineChart.prototype.yExtentCalculate = function(data) {
  var _this = this;
  return [0, d3.max(_this.flattenArray(data).map(function(d) { return d[1]; }))];
};


MultiLineChart.prototype.flattenArray = function(array) {
  var data = [ ];
  array.forEach(function(d) { data.push(d.value); });
  return [].concat.apply([], data);
};
