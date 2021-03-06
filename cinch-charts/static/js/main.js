var CONSTANTS = {
    DEFAULT_MARGIN: {
      LEFT: 15,
      BOTTOM: 30,
      RIGHT: 15,
      TOP: 15
    },
    ORIENTATION_MARGIN: {
      LEFT: 35,
      BOTTOM: 30,
      RIGHT: 35,
      TOP: 22
    },
    BAR: {
      color: "#4682B4",
      curve: !1,
      opacity: 1,
      padding: .05
    },
    STACKED_BAR: {
      color: ["#CDDC39", "#4CAF50", "#009688", "#00BCD4", "#2196F3", "#3F51B5", "#673AB7"],
      curve: !1,
      opacity: 1,
      padding: .05
    },
    LINE: {
      color: "#4682B4",
      width: 4,
      opacity: 1,
      icon: {
        show: !0,
        width: 10
      }
    },
    MULTI_LINE: {
      color: ["#CDDC39", "#4CAF50", "#009688", "#00BCD4", "#2196F3", "#3F51B5", "#673AB7"],
      width: 4,
      opacity: 1,
      icon: {
        width: 10
      }
    },
    AREA: {
      color: "#4584F1",
      opacity: 1,
      padding: .05,
      icon: {
        show: !0,
        width: 5
      }
    },
    LABEL_WIDTH: 35,
    LABEL_LINE_HEIGHT: .3,
    ICON: {
      DEFAULT_WIDTH: 10,
      DEFAULT_HEIGHT: 10
    },
    DEFAULT_BAR_RADIUS: 0,
    BAR_CHART: {
      type: "bar",
      element: ".fc-bar",
      class: "fc-bar"
    },
    STACK_CHART: {
      type: "stackedBar",
      element: ".fc-stacked-bar",
      class: "fc-stacked-bar"
    },
    LINE_CHART: {
      type: "line",
      element: ".fc-line-point",
      class: "fc-line-point"
    },
    AREA_CHART: {
      type: "area",
      element: ".fc-area-point",
      class: "fc-area-point"
    },
    FIRST_CHILD: 1,
    AXIS_CONFIG: {
      X_AXIS: {
        orientation: "bottom",
        firstLabel: !0,
        ticks: {
          fontSize: "13px",
          alignment: "middle",
          padding: 5
        },
        showAxisLine: !0
      },
      Y_AXIS: {
        orientation: "left",
        ticks: {
          fontSize: "13px",
          padding: 5,
          alignment: "end"
        },
        firstLabel: !0,
        showAxisLine: !0
      }
    },
    TOOLTIP: {
      LISTENERS: "mouseover click touchstart",
      BODY: {
        title: "Title",
        xLabel: "X value",
        yLabel: "Y value"
      }
    }
  },
  Chart = function() {};
Chart.prototype.setValues = function(t, e, a, i) {
  var n = this;
  if ("object" == typeof t ? n.element = t : "#" !== t[0] && "." !== t[0] || (n.element = document.querySelector(t)), n.elementClass = n.element.className, n.data = e, n.options = a || {}, i) switch (i.type) {
    case "bar":
      o = n.options.bar;
      n.color = o && o.color ? o.color : CONSTANTS.BAR.color;
      break;
    case "stackedBar":
      var o = n.options.bar;
      n.stackList = i.stack || [], n.color = o && o.color ? o.color : CONSTANTS.STACKED_BAR.color;
      break;
    case "line":
      r = n.options.line;
      n.color = r && r.color ? r.color : CONSTANTS.LINE.color;
      break;
    case "multiLine":
      var r = n.options.line;
      n.color = r && r.color ? r.color : CONSTANTS.MULTI_LINE.color
  }
  var l = n.options.margin;
  n.margin = {
    left: l && l.left ? l.left : 0,
    right: l && l.right ? l.right : 0,
    top: l && l.top ? l.top : 0,
    bottom: l && l.bottom ? l.bottom : 0
  };
  var s = n.options.axis;
  n.options.legend;
  if (s && s.xAxis && s.xAxis.orientation) CONSTANTS.DEFAULT_MARGIN.BOTTOM;
  else CONSTANTS.DEFAULT_MARGIN.TOP;
  var c = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    d = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  n.width = 0 === n.element.offsetWidth ? c : n.element.offsetWidth, n.height = 0 === n.element.offsetHeight ? d : n.element.offsetHeight, n.elementHeight = 0 === n.element.offsetHeight ? d : n.element.offsetHeight, n.element.addEventListener("touchstart", function(t) {
    t.defaultPrevented()
  }, !1)
}, Chart.prototype.drawChart = function() {
  var t = this,
    e = t.options.legend;
  t.options.axis;
  e && e.show && (e.height ? (t.legendHeight = e.height, t.height -= t.legendHeight, t.elementHeight -= t.legendHeight) : (t.legendHeight = 45, t.height -= t.legendHeight, t.elementHeight -= t.legendHeight)), t.createCanvas(), t.xScales(), t.yScales(), t.addAxes(), t.options.grids && t.addGridLines(t.options.grids)
}, Chart.prototype.createCanvas = function() {
  var t = this;
  d3.select(t.element).selectAll("svg").remove(), t.plot = d3.select(t.element).append("svg").attr("width", "100%").attr("height", t.elementHeight).attr("class", "fc-graph-area")
}, Chart.prototype.xScales = function() {
  var t = this,
    e = t.options.axis,
    a = t.options.bar,
    i = t.margin,
    n = t.width,
    o = t.xExtent,
    r = a && a.padding ? parseFloat(a.padding) : CONSTANTS.BAR.padding;
  e && e.yAxis && e.yAxis.orientation ? "left" === e.yAxis.orientation ? (t.xMin = i.left + CONSTANTS.DEFAULT_MARGIN.LEFT + CONSTANTS.ORIENTATION_MARGIN.LEFT, t.xMax = n - (i.right + CONSTANTS.DEFAULT_MARGIN.LEFT)) : (t.xMin = i.left + CONSTANTS.DEFAULT_MARGIN.LEFT, t.xMax = n - (i.right + CONSTANTS.DEFAULT_MARGIN.RIGHT + CONSTANTS.ORIENTATION_MARGIN.RIGHT)) : (t.xMin = i.left + CONSTANTS.DEFAULT_MARGIN.LEFT + CONSTANTS.ORIENTATION_MARGIN.LEFT, t.xMax = n - (i.right + CONSTANTS.DEFAULT_MARGIN.RIGHT)), t.xScale = d3.scaleBand().padding(r).range([t.xMin, t.xMax]).domain(o)
}, Chart.prototype.yScales = function() {
  var t = this,
    e = t.margin,
    a = t.options.axis,
    i = t.options.goalLine,
    n = t.height,
    o = t.yExtent;
  a && a.xAxis && a.xAxis.orientation ? "bottom" === a.xAxis.orientation ? (t.yMin = n - (e.bottom + CONSTANTS.DEFAULT_MARGIN.BOTTOM), t.yMax = CONSTANTS.DEFAULT_MARGIN.TOP + e.top) : (t.yMin = n - (e.bottom + CONSTANTS.DEFAULT_MARGIN.BOTTOM), t.yMax = e.top + CONSTANTS.DEFAULT_MARGIN.TOP + CONSTANTS.ORIENTATION_MARGIN.TOP) : (t.yMin = n - (e.bottom + CONSTANTS.DEFAULT_MARGIN.BOTTOM), t.yMax = CONSTANTS.DEFAULT_MARGIN.TOP + e.top);
  var r = a && a.yAxis && a.yAxis.ticks ? a.yAxis.ticks : CONSTANTS.AXIS_CONFIG.Y_AXIS.ticks,
    l = i && i.value ? i.value : 0,
    s = r.values ? r.values : [],
    c = [];
  "object" == typeof s[0] ? s.forEach(function(t) {
    c.push(t.value)
  }) : c = s, o[1] = d3.max([l, o[1], d3.max(c)]), l === o[1] && (o[1] *= 1.1, s.push(Math.round(o[1]))), t.yScale = d3.scaleLinear().rangeRound([t.yMin, t.yMax]).domain(o), 0 === s.length && t.yScale.nice()
}, Chart.prototype.addAxes = function() {
  var t = this,
    e = t.options.axis,
    a = e && e.xAxis ? t.options.axis.xAxis : {},
    i = e && e.yAxis ? t.options.axis.yAxis : {};
  t.addXAxis(a), t.addYAxis(i)
}, Chart.prototype.addXAxis = function(t) {
  var e = this,
    a = (e.margin, e.xScale),
    i = t && t.ticks && t.ticks.padding ? t.ticks.padding : CONSTANTS.AXIS_CONFIG.X_AXIS.ticks.padding,
    n = t && void 0 !== t.firstLabel ? t.firstLabel : CONSTANTS.AXIS_CONFIG.X_AXIS.firstLabel,
    o = t && t.orientation ? t.orientation : CONSTANTS.AXIS_CONFIG.X_AXIS.orientation,
    r = t && void 0 !== t.showAxisLine ? t.showAxisLine : CONSTANTS.AXIS_CONFIG.X_AXIS.showAxisLine;
  switch (o) {
    case "top":
      l = d3.axisTop(a).tickPadding(i);
      l = e.checkXAxisLabels(l, t), e.drawXAxis(t, l, e.yMax);
      break;
    default:
      var l = d3.axisBottom(a).tickPadding(i);
      l = e.checkXAxisLabels(l, t), e.drawXAxis(t, l, e.yMin)
  }
  n || (void 0 === e.element.querySelector("#x-axis").children && void 0 !== e.element.querySelector("#x-axis").childNodes[CONSTANTS.FIRST_CHILD] ? e.element.querySelector("#x-axis").childNodes[CONSTANTS.FIRST_CHILD].remove() : void 0 !== e.element.querySelector("#x-axis").children[CONSTANTS.FIRST_CHILD] && e.element.querySelector("#x-axis").children[CONSTANTS.FIRST_CHILD].remove()), r || e.element.querySelector("#x-axis path").remove()
}, Chart.prototype.checkXAxisLabels = function(t, e) {
  var a = this;
  if (e.ticks && e.ticks.values) {
    var i = e.ticks.values;
    if ("object" == typeof i[0]) {
      var n = [],
        o = [];
      i.forEach(function(t) {
        n.push(t.value), o.push(t.label)
      })
    } else var n = i,
      o = i
  } else var n = a.xExtent,
    o = a.xExtent;
  return t.tickValues(n).tickFormat(function(t, a) {
    return e && e.ticks && e.ticks.formatter ? e.ticks.formatter(t) : o[a]
  }), t
}, Chart.prototype.addYAxis = function(t) {
  var e = this,
    a = e.yScale,
    i = t.ticks ? t.ticks : CONSTANTS.AXIS_CONFIG.Y_AXIS.ticks,
    n = t && void 0 !== t.firstLabel ? t.firstLabel : CONSTANTS.AXIS_CONFIG.Y_AXIS.firstLabel,
    o = t && t.orientation ? t.orientation : CONSTANTS.AXIS_CONFIG.Y_AXIS.orientation,
    r = i.padding ? i.padding : "left" === o ? 5 : 30,
    l = t && void 0 !== t.showAxisLine ? t.showAxisLine : CONSTANTS.AXIS_CONFIG.Y_AXIS.showAxisLine;
  switch (o) {
    case "right":
      s = d3.axisRight(a).tickPadding(r);
      s = e.checkYAxisLabels(s, t), e.drawYAxis(t, s, e.xMax);
      break;
    default:
      var s = d3.axisLeft(a).tickPadding(r);
      s = e.checkYAxisLabels(s, t), e.drawYAxis(t, s, e.xMin)
  }
  n || (void 0 === e.element.querySelector("#y-axis").children && void 0 !== e.element.querySelector("#y-axis").childNodes[CONSTANTS.FIRST_CHILD] ? e.element.querySelector("#y-axis").childNodes[CONSTANTS.FIRST_CHILD].remove() : void 0 !== e.element.querySelector("#y-axis").children[CONSTANTS.FIRST_CHILD] && e.element.querySelector("#y-axis").children[CONSTANTS.FIRST_CHILD].remove()), l || (e.element.querySelector("#y-axis path").remove(), d3.select("#y-axis").selectAll("line").remove())
}, Chart.prototype.checkYAxisLabels = function(t, e) {
  var a = this;
  e && void 0 !== e.firstLabel ? e.firstLabel : CONSTANTS.AXIS_CONFIG.Y_AXIS.firstLabel;
  if (e.ticks && e.ticks.values) {
    var i = e.ticks.values;
    if ("object" == typeof i[0]) {
      var n = [],
        o = [];
      i.indexOf(a.yExtent[0]) < 0 && i.unshift({
        value: a.yExtent[0],
        label: a.yExtent[0]
      }), i.forEach(function(t) {
        n.push(t.value), o.push(t.label)
      })
    } else {
      i.indexOf(a.yExtent[0]) < 0 && i.unshift(a.yExtent[0]);
      var n = i,
        o = i
    }
    t.tickValues(n).tickFormat(function(t, a) {
      return e && e.ticks && e.ticks.formatter ? e.ticks.formatter(t) : o[a]
    })
  } else t.tickFormat(function(t) {
    return e && e.ticks && e.ticks.formatter ? e.ticks.formatter(t) : t
  });
  return t
}, Chart.prototype.drawXAxis = function(t, e, a) {
  var i = this,
    n = (i.defaultMargin(), t.ticks && t.ticks.fontSize ? t.ticks.fontSize : CONSTANTS.AXIS_CONFIG.X_AXIS.ticks.fontSize);
  i.xAxisLabels = i.plot.append("g").attr("class", "fc-axis fc-x-axis").attr("id", "x-axis").attr("transform", "translate(0," + a + ")").call(e).selectAll(".tick text").attr("font-size", n), i.checkAxisLabelAlteration(t, "x")
}, Chart.prototype.checkAxisLabelAlteration = function(t, e) {
  var a = this,
    i = t.ticks;
  if (i && i.position) {
    var n = i.position.angle || 0,
      o = i.position.x || "0",
      r = i.position.y || "0";
    a.alterAxisLabel(e, o, r, n)
  }
}, Chart.prototype.drawYAxis = function(t, e, a) {
  var i = this,
    n = (i.margin, t.ticks && t.ticks.alignment ? t.ticks.alignment : CONSTANTS.AXIS_CONFIG.Y_AXIS.ticks.alignment),
    o = t.ticks && t.ticks.fontSize ? t.ticks.fontSize : CONSTANTS.AXIS_CONFIG.Y_AXIS.ticks.fontSize;
  i.yAxisLabels = i.plot.append("g").attr("class", "fc-axis fc-y-axis").attr("id", "y-axis").attr("transform", "translate(" + a + ", 0)").call(e).selectAll(".tick text").attr("font-size", o).call(i.wrap, CONSTANTS.LABEL_WIDTH, n), i.checkAxisLabelAlteration(t, "y")
}, Chart.prototype.addGridLines = function(t) {
  var e = this;
  e.options.axis;
  t.vertical && t.vertical.show && e.addVerticalGridLines(t.vertical), t.horizontal && t.horizontal.show && e.addHorizontalGridLines(t.horizontal)
}, Chart.prototype.alterAxisLabel = function(t, e, a, i) {
  var n = this;
  t = "x" === t || "X" === t ? n.xAxisLabels : n.yAxisLabels, 0 === i ? t.attr("transform", "translate(" + e + "," + a + ")") : 0 === e && 0 === a ? t.attr("transform", "rotate(-" + i + ")") : t.attr("transform", "rotate(-" + i + "), translate(" + e + "," + a + ")")
}, Chart.prototype.wrap = function(t, e, a) {
  t.each(function() {
    for (var t, i = d3.select(this), n = i.text().split(/\s+/).reverse(), o = [], r = 0, l = CONSTANTS.LABEL_LINE_HEIGHT, s = i.attr("x"), c = i.attr("y"), d = parseFloat(i.attr("dy")) + l, h = i.text(null).append("tspan").attr("x", s).attr("y", c).attr("dy", d + "em").attr("text-anchor", a); t = n.pop();) o.push(t), h.text(o.join(" ")), h.node().getComputedTextLength() > e && (o.pop(), h.text(o.join(" ")), o = [t], h = i.append("tspan").attr("x", s).attr("y", c).attr("dy", ++r * l + d + "em").attr("text-anchor", a).text(t))
  })
}, Chart.prototype.addVerticalGridLines = function(t) {
  var e = this,
    a = (e.options.legend, e.options.axis),
    i = (e.margin, a && a.xAxis && a.xAxis.orientation && a.xAxis.orientation, e.yMin);
  e.plot.append("g").attr("id", "vertical-grid").attr("class", "fc-grid vertical-grid").attr("transform", "translate(0 ," + i + ")").call(e.verticalGridLines()), [].forEach.call(e.element.querySelectorAll("#vertical-grid line"), function(e) {
    var a = "";
    t.color && (a += "stroke : " + t.color + ";"), t.opacity && (a += "stroke-opacity : " + t.opacity + ";"), e.setAttribute("style", a)
  })
}, Chart.prototype.addHorizontalGridLines = function(t) {
  var e = this,
    a = e.margin,
    i = e.options.axis,
    n = i && i.yAxis && void 0 !== i.yAxis.showAxisLine ? i.yAxis.showAxisLine : CONSTANTS.AXIS_CONFIG.Y_AXIS.showAxisLine,
    o = i && i.yAxis && i.yAxis.orientation ? i.yAxis.orientation : CONSTANTS.AXIS_CONFIG.Y_AXIS.orientation,
    r = n ? "left" === o ? CONSTANTS.ORIENTATION_MARGIN.LEFT + CONSTANTS.DEFAULT_MARGIN.LEFT + a.left : CONSTANTS.DEFAULT_MARGIN.LEFT + a.left : 0;
  e.plot.append("g").attr("id", "horizontal-grid").attr("class", "fc-grid horizontal-grid").attr("transform", "translate(" + r + ",0)").call(e.horizontalGridLines());
  var l = e.element.querySelectorAll("#horizontal-grid g"),
    s = l.length;
  [].forEach.call(l, function(e, a) {
    var i = "";
    t.color && (i += "stroke : " + t.color + ";"), t.opacity && (i += "stroke-opacity : " + t.opacity + ";"), e.querySelector("line").setAttribute("style", i)
  }), t.skipFirst && l[0].remove(), t.skipLast && l[s - 1].remove()
}, Chart.prototype.addGoalLines = function() {
  var t = this,
    e = t.options.goalLine,
    a = t.margin,
    i = t.options.axis,
    n = i && i.yAxis && void 0 !== i.yAxis.showAxisLine ? i.yAxis.showAxisLine : CONSTANTS.AXIS_CONFIG.Y_AXIS.showAxisLine,
    o = i && i.yAxis && i.yAxis.orientation ? i.yAxis.orientation : CONSTANTS.AXIS_CONFIG.Y_AXIS.orientation,
    r = e.value,
    l = e.class ? "fc-goalLine-line " + e.class : "fc-goalLine-line",
    s = n ? "left" === o ? CONSTANTS.ORIENTATION_MARGIN.LEFT + CONSTANTS.DEFAULT_MARGIN.LEFT + a.left : CONSTANTS.DEFAULT_MARGIN.LEFT + a.left : 0,
    c = t.yScale(r) - t.yMin,
    d = t.plot.append("g").attr("class", "fc-goalLine");
  if (d.append("g").attr("class", l).attr("transform", "translate(" + s + ", " + c + ")").call(t.goalLine()), e.icon) {
    var h = e.icon.height,
      p = e.icon.width,
      u = e.icon.url,
      f = e.icon.class ? "qd-goalLine-image " + f : "qd-goalLine-image",
      y = e.icon.left ? e.icon.left + a.left - 2.5 : a.left - 2.5;
    n && "left" === o && (y += CONSTANTS.ORIENTATION_MARGIN.LEFT + CONSTANTS.DEFAULT_MARGIN.LEFT), e.icon.toBase64 ? t.getBase64Image(u, function(e) {
      d.append("svg:image").attr("x", y).attr("y", t.yScale(r) - h / 2 + 1).attr("width", p).attr("height", h).attr("xlink:href", e).attr("class", f)
    }) : d.append("svg:image").attr("x", y).attr("y", t.yScale(r) - h / 2 + 1).attr("width", p).attr("height", h).attr("xlink:href", u).attr("class", f)
  }
}, Chart.prototype.checkTooltip = function(t) {
  var e, a = this;
  switch (t) {
    case "bar":
      e = CONSTANTS.BAR_CHART;
      break;
    case "stackedBar":
      e = CONSTANTS.STACK_CHART;
      break;
    case "line":
    case "multiLine":
      e = CONSTANTS.LINE_CHART;
      break;
    case "area":
      e = CONSTANTS.AREA_CHART
  }
  if (a.options.tooltip && a.options.tooltip.show) {
    var i = a.options.tooltip.listener ? a.options.tooltip.listener : CONSTANTS.TOOLTIP.LISTENERS;
    a.showTooltip(a.options.tooltip, i, e)
  }
}, Chart.prototype.showTooltip = function(t, e, a) {
  var i, n, o = this,
    r = t.class ? t.class : "";
  d3.select(o.element).selectAll("#fc-tooltip").remove();
  var l = d3.select(o.element).append("div").attr("class", "fc-tooltip " + r).attr("id", "fc-tooltip");
  l.node().style.position = "absolute", l.node().style.visibility = "hidden", o.plot.selectAll(a.element).on(e, function(e) {
    switch (n = d3.event.type, a.type) {
      case "bar":
      case "line":
      case "area":
        t.xValue = e[0], t.yValue = e[1];
        break;
      case "stackedBar":
        t.xValue = e.data[o.xAxisKey], t.yValue = o.valueSum(e.data, o.stackList), t.stackData = e.data;
        break;
      case "multiline":
        t.xValue = e[0], t.yValue = e[1], t.line = e[2]
    }
    i !== e ? (l.html(t.formatter ? t.formatter() : o.tooltipBody(t)), l.node().style.visibility = "visible", l.node().style.left = o.calculatePosition("left", [t.xValue, t.yValue]), l.node().style.top = o.calculatePosition("top", [t.xValue, t.yValue]), i = "mouseover" != d3.event.type ? e : "") : (l.node().style.visibility = "hidden", i = "")
  }).on("mouseout", function() {
    "mouseover" === n && (l.node().style.visibility = "hidden")
  }), document.addEventListener("touchstart", function(t) {
    t.touches[0];
    t.target.classList.contains(a.class) || (l.node().style.visibility = "hidden")
  }, !1), document.addEventListener("click", function(t) {
    t.target.classList.contains(a.class) || (l.node().style.visibility = "hidden")
  }, !1)
}, Chart.prototype.calculatePosition = function(t, e) {
  var a = this,
    i = a.options.legend,
    n = a.options.line,
    o = a.element.querySelector("#fc-tooltip"),
    r = parseInt(window.getComputedStyle(a.element.querySelector("#fc-tooltip"), ":after").getPropertyValue("border-left-width")),
    l = parseInt(window.getComputedStyle(a.element.querySelector("#fc-tooltip"), ":after").getPropertyValue("border-top-width")),
    s = r > l ? r : l,
    c = s + o.offsetHeight,
    d = o.classList,
    h = a.xScale(e[0]) + a.shiftCalculate("x", "#fc-tooltip", s),
    p = a.element.offsetTop + a.yScale(e[1]) + a.shiftCalculate("y", "#fc-tooltip", s) - a.margin.top;
  return n && n.plotPoints && n.plotPoints.icon && n.plotPoints.icon.width && (p -= n.plotPoints.icon.width / 2), p - a.element.offsetTop < 0 ? (p += c + s, n && n.plotPoints && n.plotPoints.icon && n.plotPoints.icon.width && (p += n.plotPoints.icon.width + 2), d.add("bottom"), d.remove("left", "top", "right")) : (d.remove("bottom", "left", "right"), d.add("top")), h - a.element.offsetLeft < 0 ? (h += o.offsetWidth / 2 + s, p += c / 2 + s / 2, d.add("right"), d.remove("bottom", "top")) : h + o.offsetWidth > a.element.offsetWidth && (h -= o.offsetWidth / 2 + s, p += c / 2 + s / 2, d.remove("bottom", "top", "right"), d.add("left")), "left" === t ? h + "px" : i && "top" === i.position ? p + a.legendHeight + s / 2 + "px" : p + "px"
}, Chart.prototype.shiftCalculate = function(t, e, a) {
  var i = this,
    n = i.element.querySelector(e).offsetWidth,
    o = i.element.querySelector(e).offsetHeight,
    r = i.xScale.bandwidth() / 2 - n / 2,
    l = -(o + a);
  return i.margin && (l += i.margin.top), "x" === t || "X" === t ? r : "y" === t || "Y" === t ? l : void 0
}, Chart.prototype.tooltipBody = function(t) {
  if (t.body) {
    return title = t.body.title ? t.body.title : CONSTANTS.TOOLTIP.BODY.title, xLabel = t.body.xLabel ? t.body.xLabel : CONSTANTS.TOOLTIP.BODY.xLabel, yLabel = t.body.yLabel ? t.body.yLabel : CONSTANTS.TOOLTIP.BODY.yLabel, xValue = t.xValue, yValue = t.yValue, content = "", title && (content += "<b>" + title + "</b>"), xLabel && (content += "<br/>" + xLabel + ": " + xValue), yLabel && (content += "<br/>" + yLabel + ": " + yValue), content
  }
}, Chart.prototype.verticalGridLines = function() {
  var t = this,
    e = t.options.grids,
    a = (t.options.axis, t.yMin - t.yMax),
    i = d3.axisBottom(t.xScale).tickSize(-a).tickFormat("");
  if (e && e.vertical && e.vertical.values) {
    var n = e.vertical.values;
    if ("object" == typeof n[0]) {
      o = [];
      n.forEach(function(t) {
        o.push(t.key)
      })
    } else var o = n;
    i.tickValues(o)
  }
  return i
}, Chart.prototype.horizontalGridLines = function() {
  var t = this,
    e = t.options.axis,
    a = t.options.grids,
    i = e && e.xAxis && e.xAxis.showAxisLine ? t.width - (CONSTANTS.DEFAULT_MARGIN.LEFT + CONSTANTS.DEFAULT_MARGIN.RIGHT + t.margin.left) : t.width,
    n = e && e.yAxis && e.yAxis.orientation ? e.yAxis.orientation : "left";
  e && e.xAxis && e.xAxis.showAxisLine && (i -= "left" === n ? CONSTANTS.ORIENTATION_MARGIN.LEFT : CONSTANTS.ORIENTATION_MARGIN.RIGHT);
  var o = d3.axisLeft(t.yScale).tickSize(-i).tickFormat("");
  if (a && a.horizontal && a.horizontal.values) {
    var r = a.horizontal.values;
    r.indexOf(t.yExtent[0]) < 0 && r.unshift(t.yExtent[0]), o.tickValues(r)
  }
  return o
}, Chart.prototype.goalLine = function() {
  var t = this,
    e = t.options.axis,
    a = e && e.xAxis && e.xAxis.showAxisLine ? t.width - (CONSTANTS.DEFAULT_MARGIN.LEFT + CONSTANTS.DEFAULT_MARGIN.RIGHT + t.margin.left) : t.width,
    i = e && e.yAxis && e.yAxis.orientation ? e.yAxis.orientation : "left";
  return e && e.xAxis && e.xAxis.showAxisLine && (a -= "left" === i ? CONSTANTS.ORIENTATION_MARGIN.LEFT : CONSTANTS.ORIENTATION_MARGIN.RIGHT), d3.axisLeft(t.yScale).tickSize(-a).ticks(1).tickFormat("")
}, Chart.prototype.defaultMargin = function() {
  var t = this.options.axis;
  return t && t.yAxis && t.yAxis.orientation ? "left" === t.yAxis.orientation ? CONSTANTS.DEFAULT_MARGIN.LEFT : 0 : "left" === CONSTANTS.AXIS_CONFIG.Y_AXIS.orientation ? CONSTANTS.DEFAULT_MARGIN.LEFT : 0
}, Chart.prototype.valueSum = function(t, e) {
  var a = 0;
  for (var i in t) t.hasOwnProperty(i) && -1 !== e.indexOf(i) && (a += parseFloat(t[i]));
  return a
}, Chart.prototype.isNumber = function(t) {
  var e;
  return !isNaN(t) && (0 | (e = parseFloat(t))) === e
}, Chart.prototype.getBase64Image = function(t, e) {
  var a = new Image;
  a.setAttribute("crossOrigin", "anonymous"), a.src = t, a.id = "qd-image-id";
  var i = document.createElement("div");
  i.style.display = "none", i.id = "qd-invisible-div", document.body.appendChild(i), a.onload = function() {
    i.appendChild(a);
    var t = document.createElement("canvas");
    t.width = a.width, t.height = a.height, t.getContext("2d").drawImage(a, 0, 0);
    var n = t.toDataURL("image/png");
    d3.selectAll("#qd-image-id").remove(), d3.selectAll("#qd-invisible-div").remove(), e(n)
  }
}, Array.prototype.diff = function(t) {
  return this.filter(function(e) {
    return t.indexOf(e) < 0
  })
}, Array.prototype.unique = function() {
  for (var t = [], e = 0, a = this.length; e < a; e++) - 1 === t.indexOf(this[e]) && t.push(this[e]);
  return t
}, Array.range = function(t, e, a) {
  var i = [];
  for (a = a || 1, i[0] = t; t + a <= e;) i[i.length] = t += a;
  return i
}, void 0 === String.prototype.contains && (String.prototype.contains = function() {
  return -1 !== String.prototype.indexOf.apply(this, arguments)
});
var BarChart = function(t, e, a) {
  var i = this;
  i.setValues(t, e, a, {
    type: "bar"
  }), i.xExtent = i.xExtentCalculate(i.data), i.yExtent = i.yExtentCalculate(i.data), i.drawBarChart("bar"), window.addEventListener("resize", function(n) {
    i.setValues(t, e, a, {
      type: "bar"
    }), i.drawBarChart("bar")
  })
};
BarChart.prototype = Object.create(Chart.prototype), BarChart.prototype.xExtentCalculate = function(t) {
  return t.map(function(t) {
    return t[0]
  })
}, BarChart.prototype.yExtentCalculate = function(t) {
  var e = d3.extent(t, function(t) {
    return t[1]
  });
  return e[0] > 0 && (e[0] = 0), e
}, BarChart.prototype.drawBarChart = function(t) {
  var e = this,
    a = e.margin;
  e.drawChart(), e.plot.append("clipPath").attr("id", "bar-clip").append("rect").attr("x", 0).attr("y", 0).attr("width", e.width).attr("height", e.height - (a.bottom + CONSTANTS.DEFAULT_MARGIN.BOTTOM)), e.checkGoalLine(), e.createBars(t, e.data), e.checkTransition(), e.checkTooltip(t)
}, BarChart.prototype.createBars = function(t, e) {
  var a = this;
  a.margin, a.options.bar ? a.options.bar : CONSTANTS.BAR;
  switch (t) {
    case "bar":
      i = a.plot.append("g").attr("class", "fc-bars ");
      a.bar = i.selectAll("bar").data(e).enter().append("path").attr("class", "fc-bar").attr("fill", a.color);
      break;
    case "stackedBar":
      var i = a.plot.append("g").attr("class", "fc-stacked-bars");
      a.groups = i.selectAll("g.stack").data(a.stack_data).enter().append("g").style("fill", function(t, e) {
        return a.color[e]
      }), a.rect = a.groups.selectAll("path").data(function(t) {
        return t
      }).enter().append("path").attr("class", "fc-stacked-bar")
  }
}, BarChart.prototype.checkTransition = function() {
  var t = this,
    e = t.options.transition,
    a = t.calculateBarwidth();
  if (e && e.animate) {
    var i = e.delay ? e.delay : 0,
      n = e.duration ? e.duration : 1e3;
    t.drawBarsWithAnimation(a, i, n)
  } else t.drawBarsWithoutAnimation(a)
}, BarChart.prototype.checkGoalLine = function() {
  var t = this;
  t.options.goalLine && t.options.goalLine.value && t.addGoalLines()
}, BarChart.prototype.calculateBarwidth = function() {
  var t = this,
    e = t.options.bar,
    a = e && e.width ? e.width : t.xScale.bandwidth();
  return a = a > t.xScale.bandwidth() ? t.xScale.bandwidth() : a
}, BarChart.prototype.drawBarsWithAnimation = function(t, e, a) {
  var i = this,
    n = i.options.bar,
    o = i.barCentering(t, i.xScale.bandwidth()),
    r = n && n.opacity ? n.opacity : CONSTANTS.BAR.opacity;
  i.bar.attr("d", function(e) {
    var a = i.xScale(e[0]) + o;
    return i.drawRoundedRectangle(e, a, i.yMin, t, 0, 0)
  }).attr("clip-path", "url(#bar-clip)").transition().delay(function(t, a) {
    return a * e
  }).duration(a).attr("d", function(e) {
    return i.drawBar(e, o, t)
  }).attr("opacity", r)
}, BarChart.prototype.drawBarsWithoutAnimation = function(t) {
  var e = this,
    a = e.options.bar,
    i = a && a.opacity ? a.opacity : CONSTANTS.BAR.opacity,
    n = e.barCentering(t, e.xScale.bandwidth());
  e.bar.attr("d", function(a) {
    return e.drawBar(a, n, t)
  }).attr("clip-path", "url(#bar-clip)").attr("opacity", i)
}, BarChart.prototype.drawRoundedRectangle = function(t, e, a, i, n, o) {
  return "M" + (e + o) + " " + a + "h" + (i - 2 * o) + "a" + o + " " + o + " 0 0 1 " + o + " " + o + "v" + (n - 2 * o) + "v" + o + "h" + -o + "h" + (2 * o - i) + "h" + -o + "v" + -o + "v" + (2 * o - n) + "a" + o + " " + o + " 0 0 1 " + o + " " + -o + "z"
}, BarChart.prototype.drawBar = function(t, e, a) {
  var i, n, o, r, l = this,
    s = l.options.bar;
  return r = s && s.curve ? a / 2 : 0, i = l.xScale(t[0]) + e, n = l.yScale(t[1]), o = l.yMin - l.yScale(t[1]), l.drawRoundedRectangle(t, i, n, a, o, r)
}, BarChart.prototype.barCentering = function(t) {
  var e = this;
  return t < e.xScale.bandwidth() ? (e.xScale.bandwidth() - t) / 2 : 0
};
var LineChart = function(t, e, a) {
  var i = this;
  i.setValues(t, e, a, {
    type: "line"
  }), i.xExtent = i.xExtentCalculate(i.data), i.yExtent = i.yExtentCalculate(i.data), i.initiateDraw("line"), window.addEventListener("resize", function(n) {
    i.setValues(t, e, a, {
      type: "line"
    }), i.initiateDraw("line")
  })
};
LineChart.prototype = Object.create(Chart.prototype), LineChart.prototype.xExtentCalculate = function(t) {
  return t.map(function(t) {
    return t[0]
  })
}, LineChart.prototype.yExtentCalculate = function(t) {
  var e = d3.extent(t, function(t) {
    return t[1]
  });
  return e[0] > 0 && (e[0] = 0), e
}, LineChart.prototype.initiateDraw = function(t) {
  var e = this,
    a = e.options.threshold;
  e.dataExist = e.doesDataExist(e.data), a && a.value && a.icon && a.icon.url && e.dataExist ? a.icon.toBase64 ? e.getBase64Image(a.icon.url, function(a) {
    e.thresholdIconUrl = a, e.drawLineChart(t)
  }) : (e.thresholdIconUrl = a.icon.url, e.drawLineChart(t)) : e.drawLineChart(t)
}, LineChart.prototype.drawLineChart = function(t) {
  var e = this,
    a = e.options.line ? e.options.line : CONSTANTS.LINE;
  threshold = e.options.threshold, connectNull = e.options.connectNull, e.drawChart(), e.dataExist && (e.checkGoalLine(), e.line = d3.line().x(function(t) {
    return e.xScale(t[0]) + e.xScale.bandwidth() / 2
  }).y(function(t) {
    return e.yScale(t[1])
  }).defined(function(t, e) {
    return null != t[1]
  }).curve(d3.curveMonotoneX), e.drawLine(t, e.data, a, threshold, connectNull, "line"), e.checkTransition())
}, LineChart.prototype.drawLine = function(t, e, a, i, n, o) {
  var r = this,
    l = r.plot.append("g").attr("class", "fc-line").attr("id", "fc-" + o),
    s = n ? e.filter(r.line.defined()) : e,
    c = a && a.width ? a.width : 4,
    d = a && a.class ? "fc-line-stroke " + a.class : "fc-line-stroke",
    h = a && a.color ? a.color : r.color;
  l.selectAll(".line").data([e]).enter().append("path").attr("class", d).attr("id", "fc-path-" + o).attr("stroke", h).attr("stroke-width", c).attr("d", r.line(s)).attr("fill", "none").attr("clip-path", "url(#fc-clip-" + o + ")"), a && a.icon && a.icon.show && r.drawPlotPoints(t, l, s, a, i, o), r.clipPath = r.plot.append("clipPath").attr("id", "fc-clip-" + o).append("rect")
}, LineChart.prototype.drawPlotPoints = function(t, e, a, i, n, o) {
  var r = this,
    l = n && n.value ? n.value : null,
    s = i.icon,
    c = a.filter(function(t) {
      if (null === l) {
        if (null !== t[1]) return t
      } else if (null !== t[1] && t[1] < l) return t
    }),
    d = a.filter(function(t) {
      if (null !== l && null !== t[1] && t[1] >= l) return t
    });
  s && s.url ? s.toBase64 ? r.getBase64Image(s.url, function(a) {
    r.addImagePlotPoints(e, c, s, a, o), r.addImagePlotPoints(e, d, s, r.thresholdIconUrl, o), r.checkTooltip(t)
  }) : (r.addImagePlotPoints(e, c, s, s.url, o), r.addImagePlotPoints(e, d, s, r.thresholdIconUrl, o), r.checkTooltip(t)) : (r.addColorPlotPoints(e, c, i, s.url, o), r.addImagePlotPoints(e, d, s, r.thresholdIconUrl, o), r.checkTooltip(t))
}, LineChart.prototype.addImagePlotPoints = function(t, e, a, i, n) {
  var o = this,
    r = ".fc-" + n;
  iconWidth = a.width ? a.width : CONSTANTS.LINE.icon.width, t.selectAll(r).data(e.filter(function(t) {
    return null !== t[1]
  })).enter().append("svg:image").attr("class", "fc-line-point").attr("x", function(t) {
    return o.xScale(t[0]) + o.xScale.bandwidth() / 2 - iconWidth / 2
  }).attr("y", function(t) {
    return o.yScale(t[1]) - iconWidth / 2
  }).attr("width", iconWidth).attr("height", iconWidth).attr("xlink:href", i).attr("clip-path", "url(#fc-clip-" + n + ")")
}, LineChart.prototype.addColorPlotPoints = function(t, e, a, i, n) {
  var o = this,
    r = a.icon;
  currentLine = ".fc-" + n, iconWidth = r.width ? r.width : CONSTANTS.LINE.icon.width, radius = a && a.width ? 1.25 * a.width : 1.25 * CONSTANTS.LINE.width, color = a && a.color ? a.color : o.color, t.selectAll(currentLine).data(e).enter().append("circle").attr("class", "fc-line-point").attr("cx", function(t) {
    return o.xScale(t[0]) + o.xScale.bandwidth() / 2
  }).attr("cy", function(t) {
    return o.yScale(t[1])
  }).attr("r", radius).attr("stroke-width", 1).attr("stroke", color).attr("fill", "#fff").attr("clip-path", "url(#fc-clip-" + n + ")")
}, LineChart.prototype.checkTransition = function() {
  var t = this,
    e = t.options.transition;
  if (e && e.animate) {
    var a = e.duration ? e.duration : 1e3;
    t.drawLineWithAnimation(a)
  } else t.drawLineWithoutAnimation()
}, LineChart.prototype.checkGoalLine = function() {
  var t = this;
  t.options.goalLine && t.options.goalLine.value && t.addGoalLines()
}, LineChart.prototype.drawLineWithAnimation = function(t) {
  var e = this,
    a = e.margin,
    i = e.height + a.top + a.bottom + CONSTANTS.DEFAULT_MARGIN.TOP;
  e.clipPath.attr("width", 0).attr("height", i).transition().duration(t).attr("width", e.width)
}, LineChart.prototype.drawLineWithoutAnimation = function() {
  var t = this;
  t.clipPath.attr("width", t.width).attr("height", t.height)
}, LineChart.prototype.doesDataExist = function(t) {
  return !!(t && t.length > 0)
};
var AreaChart = function(t, e, a) {
  var i = this;
  i.setValues(t, e, a, {
    type: "area"
  }), i.xExtent = i.xExtentCalculate(i.data), i.yExtent = i.yExtentCalculate(i.data), i.drawAreaChart("area"), window.addEventListener("resize", function(n) {
    i.setValues(t, e, a, {
      type: "area"
    }), i.drawAreaChart("area")
  })
};
AreaChart.prototype = Object.create(Chart.prototype), AreaChart.prototype.xExtentCalculate = function(t) {
  return t.map(function(t) {
    return t[0]
  })
}, AreaChart.prototype.yExtentCalculate = function(t) {
  return [0, d3.max(t, function(t) {
    return t[1]
  })]
}, AreaChart.prototype.drawAreaChart = function(t) {
  var e = this;
  e.margin;
  e.drawChart(), e.drawArea(e.data), e.checkAreaTransition(), e.checkGoalLine()
}, AreaChart.prototype.checkAreaTransition = function() {
  var t = this,
    e = t.options.transition;
  if (e && e.animate) {
    var a = e.duration ? e.duration : 1e3;
    t.drawAreaWithAnimation(a)
  } else t.drawAreaWithoutAnimation()
}, AreaChart.prototype.checkGoalLine = function() {
  var t = this;
  t.options.goalLine && t.options.goalLine.value && t.addGoalLines()
}, AreaChart.prototype.drawArea = function(t) {
  var e = this,
    a = e.margin,
    i = e.options.area,
    n = a.left + e.xScale.bandwidth() / 2,
    o = i && i.color ? i.color : CONSTANTS.AREA.color,
    r = i && i.opacity ? i.opacity : CONSTANTS.AREA.opacity,
    l = d3.area().x(function(t) {
      return e.xScale(t[0])
    }).y1(function(t) {
      return e.yScale(t[1])
    }).y0(e.yScale(e.yExtent[0]));
  e.clipPath = e.plot.append("clipPath").attr("id", "fc-area-clip").append("rect");
  var s = e.plot.append("g").attr("class", "fc-area");
  s.append("path").datum(t).attr("class", "fc-area-path").attr("transform", "translate(" + n + ", 0)").attr("fill", o).attr("opacity", r).attr("clip-path", "url(#fc-area-clip)").attr("d", l), i && i.icon && i.icon.show && e.drawPlotPoints(s, i, t)
}, AreaChart.prototype.drawPlotPoints = function(t, e, a) {
  var i = this,
    n = e.icon;
  e.color ? e.color : CONSTANTS.AREA.color;
  n && n.url ? n.toBase64 ? i.getBase64Image(n.url, function(e) {
    i.addImagePlotPoints(t, a, n, e), i.checkTooltip("area")
  }) : (i.addImagePlotPoints(t, a, n, n.url), i.checkTooltip("area")) : (i.addColorPlotPoints(t, a, e), i.checkTooltip("area"))
}, AreaChart.prototype.addImagePlotPoints = function(t, e, a, i) {
  var n = this,
    o = a.width ? a.width : CONSTANTS.LINE.icon.width;
  t.selectAll(".fc-area").data(e).enter().append("svg:image").attr("class", "fc-area-point").attr("x", function(t) {
    return n.xScale(t[0]) + n.xScale.bandwidth() / 2 - o / 2
  }).attr("y", function(t) {
    return n.yScale(t[1]) - o / 2
  }).attr("width", o).attr("height", o).attr("xlink:href", i).attr("clip-path", "url(#fc-area-clip)")
}, AreaChart.prototype.addColorPlotPoints = function(t, e, a) {
  var i = this,
    n = a.icon;
  iconWidth = n.width ? n.width : CONSTANTS.AREA.icon.width, color = a && a.color ? a.color : i.color, t.selectAll(".fc-area").data(e).enter().append("circle").attr("class", "fc-area-point").attr("cx", function(t) {
    return i.xScale(t[0]) + i.xScale.bandwidth() / 2
  }).attr("cy", function(t) {
    return i.yScale(t[1]) + iconWidth / 4
  }).attr("r", iconWidth / 2).attr("stroke-width", 1).attr("stroke", color).attr("fill", "#fff").attr("clip-path", "url(#fc-area-clip)")
}, AreaChart.prototype.drawAreaWithAnimation = function(t) {
  var e = this;
  e.clipPath.attr("width", 0).attr("height", e.height).transition().duration(t).attr("width", e.width)
}, AreaChart.prototype.drawAreaWithoutAnimation = function() {
  var t = this;
  t.clipPath.attr("width", t.width).attr("height", t.height)
};
var MultiLineChart = function(t, e, a) {
  var i = this;
  i.setValues(t, e, a, {
    type: "multiLine"
  }), i.xExtent = i.xExtentCalculate(i.data), i.yExtent = i.yExtentCalculate(i.data), i.initiateDraw("multiLine"), window.addEventListener("resize", function(n) {
    i.setValues(t, e, a), i.initiateDraw("multiLine")
  })
};
MultiLineChart.prototype = Object.create(LineChart.prototype), MultiLineChart.prototype.xExtentCalculate = function(t) {
  return this.flattenArray(t).map(function(t) {
    return t[0]
  }).unique()
}, MultiLineChart.prototype.yExtentCalculate = function(t) {
  var e = this,
    a = d3.extent(e.flattenArray(t).map(function(t) {
      return t[1]
    }));
  return a[0] > 0 && (a[0] = 0), a
}, MultiLineChart.prototype.drawLineChart = function(t) {
  var e = this,
    a = e.options.line ? e.options.line : {};
  legend = e.options.legend, threshold = e.options.threshold ? e.options.threshold : {}, transition = e.options.transition, legend && legend.show && "top" === legend.position && e.checkLegend(t, e.data), e.drawChart(), e.dataExist && (e.checkGoalLine(), e.line = d3.line().x(function(t) {
    return e.xScale(t[0]) + e.xScale.bandwidth() / 2
  }).y(function(t) {
    return e.yScale(t[1])
  }).defined(function(t, e) {
    return null != t[1]
  }).curve(d3.curveMonotoneX), transition && transition.delay && transition.delay > 0 ? e.drawMultiLinesWithDelay(t, e.data, a, threshold, transition.delay, 0) : e.drawMultiLinesWithoutDelay(t, e.data, a, threshold, 0)), legend && legend.show && "bottom" === legend.position && e.checkLegend(t, e.data)
}, MultiLineChart.prototype.drawMultiLinesWithDelay = function(t, e, a, i, n, o) {
  var r = this,
    l = r.options.connectNull,
    s = r.getLineConfig(a, o),
    c = r.getThresholdConfig(i, o),
    d = "line-" + String(o + 1);
  r.drawLine(t, e[o].value, s, c, l[o], d), r.checkTransition(), ++o < e.length && setTimeout(function() {
    r.drawMultiLinesWithDelay(t, e, a, i, n, o)
  }, n)
}, MultiLineChart.prototype.drawMultiLinesWithoutDelay = function(t, e, a, i) {
  var n = this;
  e.forEach(function(e, o) {
    var r = n.getLineConfig(a, o),
      l = n.getThresholdConfig(i, o),
      s = "line-" + String(o + 1);
    n.drawLine(t, e.value, r, l, s), n.checkTransition()
  })
}, MultiLineChart.prototype.getLineConfig = function(t, e) {
  var a = this,
    i = {
      icon: {}
    };
  return i.color = a.color[e], i.width = t && t.width ? t.width instanceof Array ? void 0 !== t.width[e] ? t.width[e] : CONSTANTS.MULTI_LINE.width : t.width : CONSTANTS.MULTI_LINE.width, i.icon.show = !!(t && t.icon && t.icon.show) && (t.icon.show instanceof Array ? void 0 !== t.icon.show[e] && t.icon.show[e] : t.icon.show), i.icon.url = t && t.icon && t.icon.url ? t.icon.url instanceof Array ? t.icon.url[e] : t.icon.url : null, i.icon.toBase64 = !!(t && t.icon && t.icon.toBase64) && (t.icon.toBase64 instanceof Array ? void 0 !== t.icon.toBase64[e] && t.icon.toBase64[e] : t.icon.toBase64), i.icon.width = t && t.icon && t.icon.width ? t.icon.width instanceof Array ? void 0 !== t.icon.width[e] ? t.icon.width[e] : CONSTANTS.MULTI_LINE.icon.width : t.icon.width : CONSTANTS.MULTI_LINE.icon.width, i
}, MultiLineChart.prototype.getThresholdConfig = function(t, e) {
  var a = {
    icon: {}
  };
  return a.value = t && t.value ? t.value instanceof Array ? t.value[e] : t.value : null, a.icon.url = t && t.icon && t.icon.url ? t.icon.url instanceof Array ? t.icon.url[e] : t.icon.url : null, a.icon.toBase64 = !!(t && t.icon && t.icon.toBase64) && (t.icon.toBase64 instanceof Array ? void 0 !== t.icon.toBase64[e] && t.icon.toBase64[e] : t.icon.toBase64), a
}, MultiLineChart.prototype.checkLegend = function(t, e) {
  var a = this;
  a.options.legend && a.options.legend.show && a.addLegend(t, e)
}, MultiLineChart.prototype.addLegend = function(t, e) {
  var a = this,
    i = a.options.line,
    n = a.options.legend,
    o = n && n.class ? "fc-legend " + n.class : "fc-legend",
    r = a.width / e.length;
  d3.select(a.element).selectAll("#fc-legend").remove();
  var l = d3.select(a.element).append("div").attr("class", o).attr("id", "fc-legend");
  e.forEach(function(t, e) {
    var o = a.checkClickable(n, e),
      s = null !== document.ontouchstart ? "click" : "touchstart";
    t.active = !0;
    var c = l.append("div").attr("id", "fc-legend-" + String(e + 1)).attr("class", "fc-legend-element").on(s, function() {
      if (o) return a.toggleVisibility(t, e)
    });
    if (c.node().style.width = r, o || (c.node().style.cursor = "default"), n && n.show)
      if (i.icon && i.icon.url && i.icon.url[e]) {
        var d = i.icon.url[e];
        a.getBase64Image(d, function(e) {
          c.append("img").attr("src", e), c.append("span").text(t.key)
        })
      } else c.append("div").attr("class", "fc-legend-circle").node().style.background = a.color[e], c.append("span").attr("float", "left").text(t.key)
  })
}, MultiLineChart.prototype.checkClickable = function(t, e) {
  return !(!t || !(t.clickable[e] || void 0 === t.clickable[e] && t.clickable))
}, MultiLineChart.prototype.toggleVisibility = function(t, e) {
  var a = this;
  a.options.legend;
  return t.active ? (d3.select(a.element).selectAll("#fc-line-" + String(e + 1)).transition(100).style("display", "none"), d3.select(a.element).selectAll("#fc-legend-" + String(e + 1)).transition(100).style("opacity", .5)) : (d3.select(a.element).selectAll("#fc-line-" + String(e + 1)).transition(100).style("display", null), d3.select(a.element).selectAll("#fc-legend-" + String(e + 1)).transition(100).style("opacity", 1)), t.active = !t.active, t
}, MultiLineChart.prototype.flattenArray = function(t) {
  var e = [];
  return t.forEach(function(t) {
    e.push(t.value)
  }), [].concat.apply([], e)
}, MultiLineChart.prototype.doesDataExist = function(t) {
  if (t && t.length > 0)
    for (i = 0; i < t.length; i++)
      if (t[i].value.length > 0) return !0;
  return !1
};
var PieChart = function(t, e, a) {
  var i = this;
  i.setValues(t, e, a), i.drawPieChart(), window.addEventListener("resize", function(n) {
    i.setValues(t, e, a), i.drawPieChart()
  })
};
PieChart.prototype.setValues = function(t, e, a) {
  var i = this;
  i.options = a || {}, i.data = e;
  var n = i.options.margin;
  i.getElement(t), i.margin = {
    left: n && n.left ? n.left : 0,
    right: n && n.right ? n.right : 0,
    top: n && n.top ? n.top : 0,
    bottom: n && n.bottom ? n.bottom : 0
  }, i.setCanvasBoundary()
}, PieChart.prototype.getElement = function(t) {
  var e = this;
  "object" == typeof t ? e.element = t : "#" !== t[0] && "." !== t[0] || (e.element = document.querySelector(t)), e.elementClass = e.element.className
}, PieChart.prototype.setCanvasBoundary = function() {
  var t = this,
    e = t.margin,
    a = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    i = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  t.width = 0 === t.element.offsetWidth ? a : t.element.offsetWidth, t.height = 0 === t.element.offsetHeight ? i : t.element.offsetHeight, t.options.legend && t.options.legend.show && (t.width -= 100), t.canvasHeight = t.height - (e.top + e.bottom), t.canvasWidth = t.width - (e.left + e.right)
}, PieChart.prototype.setColorPattern = function() {
  var t = this.options.pie;
  return t && t.color && Array.isArray(t.color) ? d3.scaleOrdinal().range(t.color) : d3.scaleOrdinal(d3.schemeCategory20c)
}, PieChart.prototype.createCanvas = function() {
  var t = this;
  d3.select(t.element).selectAll("svg").remove(), t.plot = d3.select(t.element).append("svg").attr("width", t.width).attr("height", t.height).attr("class", "fc-graph-area")
}, PieChart.prototype.createArc = function() {
  var t = this,
    e = t.options.pie,
    a = Math.PI / 180,
    i = e && e.radius && e.radius < Math.min(t.canvasHeight, t.canvasWidth) / 2 ? e.radius : Math.min(t.canvasHeight, t.canvasWidth) / 2,
    n = e && e.chart && e.chart.type && ("DOUGHNUT" === e.chart.type.toUpperCase() || "DONUT" === e.chart.type.toUpperCase()) ? e.chart.width ? i - e.chart.width : .75 * i : 0,
    o = e && e.cornerRadius ? e.cornerRadius : 0,
    r = e && e.padding ? e.padding * a : 0;
  return d3.arc().innerRadius(n).outerRadius(i).cornerRadius(o).padAngle(r)
}, PieChart.prototype.createPie = function() {
  var t = this.options.pie,
    e = Math.PI / 180,
    a = t && t.curve ? t.curve * e : 2 * Math.PI,
    i = t && t.startAngle ? t.startAngle * e : 0;
  return d3.pie().value(function(t) {
    return t[1]
  }).startAngle(i).endAngle(i + a).sort(null)
}, PieChart.prototype.drawPieChart = function() {
  var t = this,
    e = t.margin,
    a = t.options.legend,
    i = t.options.transition,
    a = t.options.legend,
    n = t.createArc(),
    o = t.createPie(),
    r = t.setColorPattern(),
    l = a && a.show ? "left" === a.position ? t.canvasWidth / 2 + e.left + 100 : "center" === a.position ? t.canvasWidth / 2 : t.canvasWidth / 2 + e.left - 50 : t.canvasWidth / 2 + e.left - 50,
    s = t.canvasHeight / 2 + e.top;
  o && o.radius && o.radius < Math.min(t.canvasHeight, t.canvasWidth) / 2 ? o.radius : Math.min(t.canvasHeight, t.canvasWidth);
  t.createCanvas();
  var c = t.plot.append("g").attr("class", "fc-pie-chart").attr("transform", "translate(" + l + "," + s + ")");
  t.pieChartPlot = c.selectAll("path").data(o(t.data)).enter().append("path").attr("class", "fc-pie").attr("d", n).attr("fill", function(t) {
    return r(t.data[0])
  }), i && i.animate && t.animateDraw(n), t.checkTooltip(), a && a.show && t.showLegend()
}, PieChart.prototype.animateDraw = function(t) {
  var e = this,
    a = e.options.transition,
    i = a && a.duration ? a.duration : 1e3;
  e.pieChartPlot.transition().ease(d3.easeExp).duration(i).attrTween("d", function(e) {
    var a = d3.interpolate({
      startAngle: 0,
      endAngle: 0
    }, e);
    return function(e) {
      return t(a(e))
    }
  })
}, PieChart.prototype.checkTooltip = function() {
  var t = this;
  if (t.options.tooltip && t.options.tooltip.show) {
    var e = t.options.tooltip.listener ? t.options.tooltip.listener : "mousemove";
    t.showTooltip(t.options.tooltip, e)
  }
}, PieChart.prototype.showTooltip = function(t, e) {
  var a, i, n = this,
    o = t.class ? "fc-tooltip " + t.class : "fc-tooltip";
  d3.select(n.element).selectAll("#fc-tooltip").remove();
  var r = d3.select(n.element).append("div").attr("class", o).attr("id", "fc-tooltip");
  r.node().style.position = "absolute", r.node().style.display = "none", n.pieChartPlot.on(e, function(e) {
    i = d3.event.type, t.xValue = e.data[0], t.yValue = e.data[1], a !== e ? (r.node().style.display = "block", r.html(t.formatter ? t.formatter() : n.tooltipBody(t)), r.style("top", d3.event.layerY + 10 + "px").style("left", d3.event.layerX + 10 + "px"), a = "mouseover" != d3.event.type ? e : "") : (r.node().style.display = "none", a = "")
  }).on("mouseout", function() {
    "mouseover" === i && (r.node().style.display = "none")
  }), document.addEventListener("touchstart", function(t) {
    t.touches[0];
    t.target.classList.contains("fc-pie") || (r.node().style.display = "none")
  }, !1), document.addEventListener("click", function(t) {
    t.target.classList.contains("fc-pie") || (r.node().style.display = "none")
  }, !1)
}, PieChart.prototype.tooltipBody = function(t) {
  return title = t.body && t.body.title ? t.body.title : "Title", xLabel = t.body && t.body.xLabel ? t.body.xLabel : "X ", yLabel = t.body && t.body.yLabel ? t.body.yLabel : "Y ", xValue = t.xValue, yValue = t.yValue, content = "", title && (content += "<b>" + title + "</b>"), xLabel && (content += "<br/>" + xLabel + ": " + xValue), yLabel && (content += "<br/>" + yLabel + ": " + yValue), content
}, PieChart.prototype.showLegend = function() {
  var t = this,
    e = t.options.legend,
    a = t.options.pie,
    i = t.setColorPattern();
  switch (e.position) {
    case "right":
      n = t.canvasWidth - 50;
      break;
    case "left":
      n = t.margin.left + 70;
      break;
    case "center":
      if (a && a.chart && ("DOUGHNUT" === a.chart.type.toUpperCase() || "DONUT" === a.chart.type.toUpperCase())) n = t.canvasWidth / 2;
      else n = t.canvasWidth - 50;
      break;
    default:
      var n = t.canvasWidth - 50
  }
  var o = t.canvasHeight / 3;
  (e = t.plot.append("g").attr("class", "fc-legend").attr("transform", "translate(" + n + "," + o + ")").selectAll(".fc-legend-item").data(t.data).enter().append("g").attr("class", "fc-legend-element").attr("transform", function(t, e) {
    return "translate(-36," + (23 * e - 5) + ")"
  })).append("rect").attr("width", 18).attr("height", 18).style("fill", i).style("stroke", i), e.append("text").attr("x", 23).attr("y", 13).text(function(t) {
    return t[0]
  })
};
var StackedBarChart = function(t, e, a, i) {
  var n = this;
  n.setValues(t, e, i, {
    type: "stackedBar",
    stack: a
  }), n.createStack(), n.xExtent = n.xExtentCalculate(n.data), n.yExtent = n.yExtentCalculate(n.data), n.drawBarChart("stackedBar"), window.addEventListener("resize", function(o) {
    n.setValues(t, e, i, {
      type: "stackedBar",
      stack: a
    }), n.drawBarChart("stackedBar")
  })
};
StackedBarChart.prototype = Object.create(BarChart.prototype), StackedBarChart.prototype.createStack = function() {
  var t = this,
    e = t.options.bar;
  t.stack = d3.stack().keys(t.stackList).order(d3.stackOrderNone).offset(d3.stackOffsetNone), t.stack_data = t.stack(t.data), e && e.curve && e.curve.show && "ALL" === e.curve.bars.toUpperCase() && (t.stack_data.reverse().forEach(function(t) {
    for (var e = t.length, a = 0; a < e; a++) t[a][0] = 0
  }), t.color.reverse()), t.xAxisKey = Object.keys(t.data[0]).diff(t.stackList)[0]
}, StackedBarChart.prototype.xExtentCalculate = function(t) {
  var e = this;
  return Object.keys(t).map(function(a) {
    return t[a][e.xAxisKey]
  })
}, StackedBarChart.prototype.yExtentCalculate = function(t) {
  var e = this,
    a = d3.extent(t.map(function(t) {
      return e.valueSum(t, e.stackList)
    }));
  return a[0] > 0 && (a[0] = 0), a
}, StackedBarChart.prototype.drawBarsWithAnimation = function(t, e, a) {
  var i = this,
    n = i.barCentering(t, i.xScale.bandwidth());
  i.rect.attr("d", function(e) {
    var a = n + i.xScale(e.data[i.xAxisKey]),
      o = i.yMin;
    return i.drawRoundedRectangle(e, a, o, t, 0, 0)
  }).attr("clip-path", "url(#bar-clip)").transition().delay(function(t, a) {
    return a * e
  }).duration(a).attr("d", function(e) {
    return i.drawBar(e, n, t)
  })
}, StackedBarChart.prototype.drawBarsWithoutAnimation = function(t) {
  var e = this,
    a = e.barCentering(t, e.xScale.bandwidth());
  e.rect.attr("d", function(i) {
    return e.drawBar(i, a, t)
  }).attr("clip-path", "url(#bar-clip)")
}, StackedBarChart.prototype.drawBar = function(t, e, a) {
  var i = this,
    n = i.options.bar;
  if (n && n.curve && n.curve.show) o = a / 2;
  else var o = 0;
  var r = e + i.xScale(t.data[i.xAxisKey]),
    l = i.valueSum(t.data, i.stackList);
  if (isNaN(t[1])) {
    s = i.yScale(t[0]);
    height = 0
  } else {
    var s = i.yScale(t[1]);
    height = i.yScale(t[0]) - i.yScale(t[1])
  }
  return n && n.curve && n.curve.show && "ALL" === n.curve.bars.toUpperCase() ? i.drawRoundedRectangle(t, r, s, a, height, o) : l === t[1] ? i.drawRoundedRectangle(t, r, s, a, height, o) : i.drawRoundedRectangle(t, r, s, a, height, 0)
};