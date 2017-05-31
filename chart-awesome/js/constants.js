const CONSTANTS = {
  DEFAULT_COLORS : ['#CDDC39', '#4CAF50', '#009688', '#00BCD4', '#2196F3', '#3F51B5', '#673AB7'],
  ANIMATION_DURATION : 2000,
  ANIMATION_DELAY : {
    ALLATONCE : 0,
    ONEBYONE : 250
  },
  LABEL_WIDTH: 35,
  LABEL_LINE_HEIGHT: 1.1,
  ICON: {
    DEFAULT_WIDTH : 10,
    DEFAULT_HEIGHT: 10
  },
  DEFAULT_MARGIN: {
    LEFT: 27,
    BOTTOM: 30,
    RIGHT: 27,
    TOP: 30
  },
  DEFAULT_BAR_RADIUS: 0,
  BAR_CHART : {
    type : 'bar',
    element : '.bar',
    class: 'bar'
  },
  STACK_CHART : {
    type : 'stack',
    element : '.bars',
    class: 'bars'
  },
  LINE_CHART : {
    type : 'line',
    element : '.points',
    class: 'points'
  },
  AREA_CHART : {
    type : 'line',
    element : '.points',
    class: 'points'
  },
  FIRST_CHILD: 1,
  BAR: {
    curve: false,
    color: '#4682b4'
  },
  AXIS_CONFIG: {
    X_AXIS: {
      orientation: 'bottom',
      firstLabel: true,
      ticks: {
        font_size: 12,
        alignment: 'middle',
        padding: 5
      },
      showAxisLine: true
    },
    Y_AXIS: {
      orientation: 'left',
      ticks: {
        font_size: '1rem',
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
  },
  THRESHOLD: { }
};
