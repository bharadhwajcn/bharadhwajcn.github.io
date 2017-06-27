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
    color: '#4682B4',
    curve: false,
    opacity : 1,
    padding : .05
  },
  STACKED_BAR: {
    color: ['#CDDC39', '#4CAF50', '#009688', '#00BCD4', '#2196F3', '#3F51B5', '#673AB7'],
    curve: false,
    opacity : 1,
    padding : .05
  },
  LINE: {
    color: '#4682B4',
    width: 4,
    opacity : 1,
    icon : {
      show : true,
      width : 10
    }
  },
  MULTI_LINE: {
    color: ['#CDDC39', '#4CAF50', '#009688', '#00BCD4', '#2196F3', '#3F51B5', '#673AB7'],
    width: 4,
    opacity : 1,
    icon : {
      width : 10
    }
  },
  AREA: {
    color: '#4584F1',
    opacity : 1,
    padding : .05,
    icon : {
      show : true,
      width : 5
    }
  },
  LABEL_WIDTH: 35,
  LABEL_LINE_HEIGHT: .3,
  ICON: {
    DEFAULT_WIDTH : 10,
    DEFAULT_HEIGHT: 10
  },

  DEFAULT_BAR_RADIUS: 0,
  BAR_CHART : {
    type : 'bar',
    element : '.fc-bar',
    class: 'fc-bar'
  },
  STACK_CHART : {
    type : 'stackedBar',
    element : '.fc-stacked-bar',
    class: 'fc-stacked-bar'
  },
  LINE_CHART : {
    type : 'line',
    element : '.fc-line-point',
    class: 'fc-line-point'
  },
  AREA_CHART : {
    type : 'area',
    element : '.fc-area-point',
    class: 'fc-area-point'
  },
  FIRST_CHILD: 1,
  AXIS_CONFIG: {
    X_AXIS: {
      orientation: 'bottom',
      firstLabel: true,
      ticks: {
        fontSize: '13px',
        alignment: 'middle',
        padding: 5
      },
      showAxisLine: true
    },
    Y_AXIS: {
      orientation: 'left',
      ticks: {
        fontSize: '13px',
        padding: 5,
        alignment: 'end'
      },
      firstLabel: true,
      showAxisLine: true
    }
  },
  TOOLTIP: {
    LISTENERS: 'mouseover click touchstart',
    BODY: {
      title : 'Title',
      xLabel : 'X value',
      yLabel : 'Y value'
    }
  }
};
