/**
  * Used for drawing Areacharts.
  * Areachart class definition.
  *
  * @param {String} element - Name of the element to which graph is to be drawn.
  * @param {Object} data - Data for which graph is to be drawn
  * @param {Object} options - Other options that can be added to the graph.
  */
var AreaChart = function(element, data, options) {

  var _this = this;

  // Set all the parameter values to global scope
  _this.setValues(element, data, options, {
    type : 'area'
  });

  // Range of x and y axis values.
  _this.xExtent = _this.xExtentCalculate(_this.data);
  _this.yExtent = _this.yExtentCalculate(_this.data);

  _this.drawAreaChart('area');

  // Redraw the graph when window size is altered so as to make it responsive.
  window.addEventListener('resize', function(event) {
    _this.setValues(element, data, options, {
      type : 'area'
    });
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


};


/**
  * To decide whether transition is need or not. If yes, what kind of transition
  */
AreaChart.prototype.checkAreaTransition = function() {

  var _this      = this,
      transition = _this.options.transition;

  if (transition && transition.animate) {
    var duration = (transition.duration)
                        ? transition.duration
                        : 1000;
    _this.drawAreaWithAnimation(duration);
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
  var _this      = this,
      margin     = _this.margin,
      areaConfig = _this.options.area,
      xTranslate = margin.left + _this.xScale.bandwidth()/2,
      color      = areaConfig && areaConfig.color ? areaConfig.color : CONSTANTS.AREA.color,
      opacity    = areaConfig && areaConfig.opacity ? areaConfig.opacity : CONSTANTS.AREA.opacity;

  var area = d3.area()
               .x(function(d) { return _this.xScale(d[0]); })
               .y1(function(d) { return _this.yScale(d[1]); })
               .y0(_this.yScale(_this.yExtent[0]));

  _this.clipPath = _this.plot.append('clipPath')
                             .attr('id', 'fc-area-clip')
                             .append('rect');

  var areaPlot = _this.plot.append('g')
                           .attr('class', 'fc-area');

  areaPlot.append('path')
          .datum(data)
          .attr('class', 'fc-area-path')
          .attr('transform', 'translate(' + xTranslate + ', 0)')
          .attr('fill', color)
          .attr('opacity', opacity)
          .attr('clip-path', 'url(#fc-area-clip)')
          .attr('d', area);


  if (areaConfig && areaConfig.icon && areaConfig.icon.show) {
    _this.drawPlotPoints(areaPlot, areaConfig, data);
  }

};


AreaChart.prototype.drawPlotPoints = function(plot, area, data) {
  var _this = this,
      icon  = area.icon,
      color = area.color ? area.color : CONSTANTS.AREA.color;

  if (icon && icon.url) {
    if (icon.toBase64) {
      _this.getBase64Image(icon.url, function(base64url) {
        _this.addImagePlotPoints(plot, data, icon, base64url);
        _this.checkTooltip('area');
      });
    } else {
      _this.addImagePlotPoints(plot, data, icon, icon.url);
      _this.checkTooltip('area');
    }
  } else {
    _this.addColorPlotPoints(plot, data, area);
    _this.checkTooltip('area');
  }

};

/**
  * Function to add the image plot points to the line chart
  * @param {Object} plot       - plot to which new elements need to be added.
  * @param {Object} data       - Data to draw the line on the graph.
  * @param {Object} iconConfig - icon config of the graph.
  * @param {String} iconUrl    - url for the icon.
  */
AreaChart.prototype.addImagePlotPoints = function(plot, data, iconConfig, iconUrl) {
  var _this     = this,
      iconWidth = iconConfig.width
                      ? iconConfig.width
                      : CONSTANTS.LINE.icon.width;

  plot.selectAll('.fc-area')
      .data(data)
      .enter()
      .append('svg:image')
      .attr('class', 'fc-area-point')
      .attr('x', function(d) { return _this.xScale(d[0]) + _this.xScale.bandwidth()/2 - iconWidth/2; })
      .attr('y', function(d) { return _this.yScale(d[1]) - iconWidth/2; })
      .attr('width', iconWidth)
      .attr('height', iconWidth)
      .attr('xlink:href', iconUrl)
      .attr('clip-path', 'url(#fc-area-clip)');

};

/**
  * Function to add the color plot points to the line chart
  * @param {Object} plot - plot to which new elements need to be added.
  * @param {Object} data - Data to draw the line on the graph.
  * @param {Object} area - area config of the graph.
  */
AreaChart.prototype.addColorPlotPoints = function(plot, data, area) {
  var _this      = this,
      iconConfig = area.icon
      iconWidth  = iconConfig.width
                        ? iconConfig.width
                        : CONSTANTS.AREA.icon.width,
      color      = (area && area.color)
                        ? area.color
                        : _this.color;

  plot.selectAll('.fc-area')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'fc-area-point')
      .attr('cx', function(d) { return _this.xScale(d[0]) + _this.xScale.bandwidth()/2; })
      .attr('cy', function(d) { return _this.yScale(d[1]) + iconWidth/4; })
      .attr('r', iconWidth/2)
      .attr('stroke-width', 1)
      .attr('stroke', color)
      .attr('fill', '#fff')
      .attr('clip-path', 'url(#fc-area-clip)');
};



AreaChart.prototype.drawAreaWithAnimation = function(duration) {
  var _this = this;

  _this.clipPath.attr('width', 0)
                .attr('height', _this.height)
                .transition()
                .duration(duration)
                .attr('width', _this.width);

};

AreaChart.prototype.drawAreaWithoutAnimation = function() {
  var _this = this;

  _this.clipPath.attr('width', _this.width)
                .attr('height', _this.height);

};
