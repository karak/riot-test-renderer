import { simulate } from 'simulate-event';
import each from 'lodash/each';
import eventTypes from './eventTypes';

export type FireEvent = <T extends {}>(
  target: EventTarget,
  options?: T
) => boolean;

export interface SimulateType {
  /** All of the supported event types */
  eventTypes: ReadonlyArray<string>;

  /*
   * Event functions are bellow.
   * They are must begenerated from eventTypes.
   */
  beforeprint: FireEvent;
  afterprint: FireEvent;
  beforeunload: FireEvent;
  abort: FireEvent;
  error: FireEvent;
  change: FireEvent;
  submit: FireEvent;
  reset: FireEvent;
  cached: FireEvent;
  canplay: FireEvent;
  canplaythrough: FireEvent;
  chargingchange: FireEvent;
  chargingtimechange: FireEvent;
  checking: FireEvent;
  close: FireEvent;
  downloading: FireEvent;
  durationchange: FireEvent;
  emptied: FireEvent;
  ended: FireEvent;
  fullscreenchange: FireEvent;
  fullscreenerror: FireEvent;
  invalid: FireEvent;
  levelchange: FireEvent;
  loadeddata: FireEvent;
  loadedmetadata: FireEvent;
  noupdate: FireEvent;
  obsolete: FireEvent;
  offline: FireEvent;
  online: FireEvent;
  open: FireEvent;
  orientationchange: FireEvent;
  pause: FireEvent;
  pointerlockchange: FireEvent;
  pointerlockerror: FireEvent;
  copy: FireEvent;
  cut: FireEvent;
  paste: FireEvent;
  play: FireEvent;
  playing: FireEvent;
  ratechange: FireEvent;
  readystatechange: FireEvent;
  seeked: FireEvent;
  seeking: FireEvent;
  stalled: FireEvent;
  success: FireEvent;
  suspend: FireEvent;
  timeupdate: FireEvent;
  updateready: FireEvent;
  visibilitychange: FireEvent;
  volumechange: FireEvent;
  waiting: FireEvent;
  load: FireEvent;
  unload: FireEvent;
  resize: FireEvent;
  scroll: FireEvent;
  select: FireEvent;
  drag: FireEvent;
  dragenter: FireEvent;
  dragleave: FireEvent;
  dragover: FireEvent;
  dragstart: FireEvent;
  dragend: FireEvent;
  drop: FireEvent;
  touchcancel: FireEvent;
  touchend: FireEvent;
  touchenter: FireEvent;
  touchleave: FireEvent;
  touchmove: FireEvent;
  touchstart: FireEvent;
  blur: FireEvent;
  focus: FireEvent;
  focusin: FireEvent;
  focusout: FireEvent;
  input: FireEvent;
  show: FireEvent;
  click: FireEvent;
  dblclick: FireEvent;
  mouseenter: FireEvent;
  mouseleave: FireEvent;
  mousedown: FireEvent;
  mouseup: FireEvent;
  mouseover: FireEvent;
  mousemove: FireEvent;
  mouseout: FireEvent;
  contextmenu: FireEvent;
  wheel: FireEvent;
  message: FireEvent;
  storage: FireEvent;
  timeout: FireEvent;
  keydown: FireEvent;
  keypress: FireEvent;
  keyup: FireEvent;
  progress: FireEvent;
  loadend: FireEvent;
  loadstart: FireEvent;
  popstate: FireEvent;
  hashchange: FireEvent;
  transitionend: FireEvent;
  compositionend: FireEvent;
  compositionstart: FireEvent;
  compositionupdate: FireEvent;
  pagehide: FireEvent;
  pageshow: FireEvent;
}

function SimulateConstructor(this: { [type: string]: FireEvent }) {
  each(eventTypes, (type: string) => {
    this[type] = function<T>(target: EventTarget, options: T) {
      return simulate(target, type, options);
    };
  });
}

/** An event simulation module */
const Simulate: SimulateType = new (SimulateConstructor as any)();
Simulate.eventTypes = eventTypes.concat(); // clone

export default Simulate;
