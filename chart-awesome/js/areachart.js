/**
  * Used for drawing Areacharts.
  * Areachart class definition.
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
var AreaChart = function(element, data, options) {

  var _this = this;

  // Set all the parameter values to global scope
  _this.setValues(element, data, options);

  // Range of x and y axis values.
  _this.xExtent = _this.xExtentCalculate(_this.data);
  _this.yExtent = _this.yExtentCalculate(_this.data);

  _this.drawAreaChart('area');

  // Redraw the graph when window size is altered so as to make it responsive.
  window.addEventListener('resize', function(event) {
    _this.setValues(element, data, options);
    _this.drawAreaChart('area');
  });

}

// Cloning the baseclass `Chart` so as to access all its methods.
AreaChart.prototype = Object.create(Chart.prototype);


/**
  * Function which finds the X Axis ticks from the data provided.
  * @return {Array} - An array which contains all x Axis ticks.
  */
AreaChart.prototype.xExtentCalculate = function(data) {
  return data.map(function(d) { return d[0]; });
};

/**
  * Function which finds the range of Y Axis values from the data provided.
  * @return {Array} - An array which contains minimum and maximum value.
  */
AreaChart.prototype.yExtentCalculate = function(data) {
  return [0, d3.max(data, function(d) { return d[1]; })];
};


AreaChart.prototype.drawAreaChart = function(type) {
    var _this  = this,
        margin = _this.margin;

  // Calls the base class function to draw canvas.
  _this.drawChart();

  _this.drawArea(_this.data);
  _this.checkAreaTransition();
  _this.checkGoalLine();
  _this.checkTooltip(type);


};





/**
  * To decide whether transition is need or not. If yes, what kind of transition
  */
AreaChart.prototype.checkAreaTransition = function() {

  var _this      = this,
      transition = _this.options.transition;

  if (transition && transition.animate) {
    var a = CONSTANTS.ANIMATION_DELAY;
    var animationDelay = a[(_this.options.transition.type).toUpperCase()] || 0;
    _this.drawAreaWithAnimation(animationDelay);
  } else {
    _this.drawAreaWithoutAnimation();
  }

};

/**
  * To draw the goal lines if the user have opted to.
  */
AreaChart.prototype.checkGoalLine = function() {

  var _this = this;

  if (_this.options.goalLine && _this.options.goalLine.value) {
    _this.addGoalLines();
  }

};



AreaChart.prototype.drawArea = function(data) {
  var _this  = this,
      margin = _this.margin,
      config = _this.options.area;

  var xTranslate =  margin.left + _this.xScale.bandwidth()/2 ;// +  _this.xScale.bandwidth()/100; //CONSTANTS.DEFAULT_MARGIN.LEFT + margin.left + 20; //+ _this.xScale.bandwidth()/2;
  // var xTranslate = _this.areaCentering() +  _this.xScale.bandwidth()/42; //CONSTANTS.DEFAULT_MARGIN.LEFT + margin.left + 20; //+ _this.xScale.bandwidth()/2;

  var color   = (config && config.color) ? config.color : '#B8D551';
  var opacity = (config && config.opacity) ? config.opacity : 1;

  var area = d3.area()
               .x(function(d) { return _this.xScale(d[0]); })
               .y1(function(d) { return _this.yScale(d[1]); })
               .y0(_this.yScale(0));

  _this.clipPath = _this.plot.append('clipPath')
                             .attr('id', 'clip')
                             .append('rect');

  _this.plot.append('path')
            .datum(data)
            .attr('transform', 'translate(' + xTranslate + ', 0)')
            .attr('fill', color)
            .attr('opacity', opacity)
            .attr('clip-path', 'url(#clip)')
            .attr('d', area);


  if (config && config.points) {
    _this.drawPlotPoints(config, data);
  }


};


AreaChart.prototype.drawPlotPoints = function(config, data) {
  var _this  = this,
      pointConfig = config.plotPoints;

  var color = config.color ? config.color : '#B8D551';

  if (pointConfig && pointConfig.icon && pointConfig.icon.url && pointConfig.icon.url) {

    var width  = pointConfig.icon.width ? pointConfig.icon.width : CONSTANTS.ICON.DEFAULT_WIDTH;
    _this.plot.selectAll('area')
              .data(data)
              .enter()
              .append('svg:image')
              .attr('class', 'points')
              .attr('x', function(d) { return _this.xScale(d[0]) + _this.margin.left + _this.xScale.bandwidth()/2 - width/2; })
              .attr('y', function(d) { return _this.yScale(d[1]) - width/2; })
              .attr('width', pointConfig.icon.width)
              .attr('height', pointConfig.icon.width)
              .attr('xlink:href', pointConfig.icon.url)
              .attr('clip-path', 'url(#clip)');

  } else {
    _this.plot.selectAll('area')
              .data(data)
              .enter()
              .append('circle')
              .attr('class', 'points')
              .attr('cx', function(d) { return _this.xScale(d[0]) + _this.margin.left + _this.xScale.bandwidth()/2; })
              .attr('cy', function(d) { return _this.yScale(d[1]); })
              .attr('r', 4)
              .attr('stroke', color)
              .attr('fill', '#fff')
              .attr('clip-path', 'url(#clip)');
  }

};


AreaChart.prototype.drawAreaWithAnimation = function(animationDelay) {

  var _this = this;

  _this.clipPath.attr('width', 0)
                .attr('height', _this.height)
                .transition()
                .delay(function(d, i) { return i*animationDelay; })
                .duration(CONSTANTS.ANIMATION_DURATION)
                .attr('width', _this.width);

};

AreaChart.prototype.drawAreaWithoutAnimation = function() {

  var _this = this;

  _this.clipPath.attr('width', _this.width)
                .attr('height', _this.height);

};

AreaChart.prototype.areaCentering = function(barWidth) {
    var _this  = this,
      margin = _this.options.margin,
      config = _this.options.area;

  if ((CONSTANTS.DEFAULT_MARGIN.LEFT + margin.left + 20) <  _this.xScale.bandwidth())
    return (_this.xScale.bandwidth()-(CONSTANTS.DEFAULT_MARGIN.LEFT + margin.left + 20))/2;
  else
    return 0;
};
