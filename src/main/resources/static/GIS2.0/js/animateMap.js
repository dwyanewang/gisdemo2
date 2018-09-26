/*
 * 暂未写完！！！
 * @Author: Dwyanewang
 * @Date:   2018-09-12 21:06:29
 * @Last Modified by:   Dwyanewang
 * @Last Modified time: 2018-09-13 14:50:44
 */
var animateMap = (function(anim) {
  animateFeature = function(feature, fanim) {
    var style = feature.getStyle();
    var flashStyle = style || (this.getStyleFunction ? this.getStyleFunction()(feature) : null);
    if (!flashStyle) flashStyle = [];
    if (!(flashStyle instanceof Array)) flashStyle = [flashStyle];
    feature.setStyle([]);
    var event = { // Frame context
      vectorContext: null,
      frameState: null,
      start: 0,
      time: 0,
      elapsed: 0,
      extent: false,
      // Feature information
      feature: feature,
      geom: feature.getGeometry(),
      typeGeom: feature.getGeometry().getType(),
      bbox: feature.getGeometry().getExtent(),
      coord: ol.extent.getCenter(feature.getGeometry().getExtent()),
      style: flashStyle
    };
    if (!(fanim instanceof Array)) fanim = [fanim];
    for (var i = fanim.length - 1; i >= 0; i--) {
      if (fanim[i].duration === 0) fanim.splice(i, 1);
    }
    var nb = 0,
      step = 0;

    function animate(e) {
      event.vectorContext = e.vectorContext;
      event.frameState = e.frameState;
      if (!event.extent) {
        event.extent = e.frameState.extent;
        event.start = e.frameState.time;
        event.context = e.context;
      }
      event.time = e.frameState.time - event.start;
      event.elapsed = event.time / fanim[step].duration;
      if (event.elapsed > 1) event.elapsed = 1;
      // Stop animation?
      if (!fanim[step].animate(event)) {
        nb++;
        // Repeat animation
        if (nb < fanim[step].repeat_) {
          event.extent = false;
        }
        // newt step
        else if (step < fanim.length - 1) {
          fanim[step].dispatchEvent({ type: 'animationend', feature: feature });
          step++;
          nb = 0;
          event.extent = false;
        }
        // the end
        else {
          stop();
        }
      }
      // tell OL3 to continue postcompose animation
      e.frameState.animate = true;
    }
  }
  return anim;
})(window.animateMap || {});