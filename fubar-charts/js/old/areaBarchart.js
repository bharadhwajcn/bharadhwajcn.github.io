/**
  * Used for drawing AreaBarCharts.
  * AreaBarchart class definition.
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
var AreaBarChart = function(element, data, options) {

  var _this = this;

  // Set all the parameter values to global scope
  _this.setValues(element, data, options);

  // Range of x and y axis values.
  _this.xExtent = _this.xExtentCalculate(_this.data);
  _this.yExtent = _this.yExtentCalculate(_this.data);

  _this.drawAreaBarChart('area');

  // Redraw the graph when window size is altered so as to make it responsive.
  window.addEventListener('resize', function(event) {
    _this.setValues(element, data, options);
    _this.drawAreaBarChart('area');
  });

}

// Cloning the baseclass `Chart` so as to access all its methods.
AreaBarChart.prototype = Object.create(AreaChart.prototype);
AreaBarChart.prototype = Object.assign(AreaBarChart.prototype, BarChart.prototype);


/**
  * Function which finds the X Axis ticks from the data provided.
  * @return {Array} - An array which contains all x Axis ticks.
  */
AreaBarChart.prototype.xExtentCalculate = function(data) {
  var dataGroup = [ ];
  data.forEach(function(d) { dataGroup.push(d.x); });
  return dataGroup;
};

/**
  * Function which finds the range of Y Axis values from the data provided.
  * @return {Array} - An array which contains minimum and maximum value.
  */
AreaBarChart.prototype.yExtentCalculate = function(data) {
  return [0, d3.max([
              d3.max(data, function(d) { return d.bar; }),
              d3.max(data, function(d) { return d.area; })
          ])];
};


AreaBarChart.prototype.drawAreaBarChart = function(type) {
    var _this  = this,
        margin = _this.margin;

  // Calls the base class function to draw canvas.
  _this.drawChart();

  _this.drawAreaChart();
  _this.drawBarChart();

};


AreaBarChart.prototype.drawAreaChart = function() {

  var _this    = this,
      areaData = [];

  _this.data.forEach(function(d) { areaData.push([d.x, d.area]); });
  _this.drawArea(areaData);
  _this.checkAreaTransition();

};

AreaBarChart.prototype.drawBarChart = function() {

  var _this   = this,
      barData = [];
  _this.data.forEach(function(d) { barData.push([d.x, d.bar]); });

  _this.createBars('bar', barData);
  _this.checkTransition();
  _this.checkTooltip('bar');
  _this.checkGoalLine();

};
