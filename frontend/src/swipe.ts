// Horizontal swipe gesture that works with mouse, pen and touch (incl. iOS).
//
// Touch is handled with touch events: as soon as a movement is clearly
// horizontal the gesture belongs to us (and page scrolling is prevented);
// a vertical movement is left to the browser for scrolling. Mouse and pen use
// pointer events on the window so the drag never gets lost.

export const SWIPE_STEP = 24; // px per 0.5 °C
const THRESHOLD = 10;

export interface SwipeHandlers {
  /** Called whenever the number of steps (relative to the start) changes. */
  onStep(steps: number): void;
  /** Called at the end; ``moved`` is false for a simple tap. */
  onEnd(moved: boolean): void;
}

export function startSwipe(ev: PointerEvent | TouchEvent, h: SwipeHandlers): void {
  if ("touches" in ev) {
    startTouch(ev, h);
    return;
  }
  // touch pointers are handled by the touchstart listener
  if (ev.pointerType === "touch") return;
  if (ev.pointerType === "mouse" && ev.button !== 0) return;
  const x0 = ev.clientX;
  const id = ev.pointerId;
  let moved = false;
  let last = 0;
  const move = (e: PointerEvent) => {
    if (e.pointerId !== id) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    moved = true;
    e.preventDefault();
    const steps = Math.round(dx / SWIPE_STEP);
    if (steps !== last) {
      last = steps;
      h.onStep(steps);
    } else if (steps === 0) {
      h.onStep(0);
    }
  };
  const end = (e: PointerEvent) => {
    if (e.pointerId !== id) return;
    cleanup();
    h.onEnd(moved);
  };
  const cleanup = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    window.removeEventListener("pointercancel", end);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
}

function startTouch(ev: TouchEvent, h: SwipeHandlers): void {
  const touch = ev.changedTouches[0];
  if (!touch) return;
  const id = touch.identifier;
  const x0 = touch.clientX;
  const y0 = touch.clientY;
  let state: "undecided" | "swipe" | "scroll" = "undecided";
  let last = 0;
  const find = (e: TouchEvent) => Array.from(e.changedTouches).find((t) => t.identifier === id);
  const move = (e: TouchEvent) => {
    const t = find(e);
    if (!t) return;
    const dx = t.clientX - x0;
    const dy = t.clientY - y0;
    if (state === "undecided") {
      if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
      state = Math.abs(dx) > Math.abs(dy) ? "swipe" : "scroll";
      if (state === "scroll") {
        cleanup();
        return;
      }
      h.onStep(0);
    }
    e.preventDefault(); // keep the page from scrolling sideways/vertically
    const steps = Math.round(dx / SWIPE_STEP);
    if (steps !== last) {
      last = steps;
      h.onStep(steps);
    }
  };
  const end = (e: TouchEvent) => {
    if (!find(e)) return;
    cleanup();
    if (state !== "scroll") h.onEnd(state === "swipe");
  };
  const cleanup = () => {
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", end);
    window.removeEventListener("touchcancel", end);
  };
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", end);
  window.addEventListener("touchcancel", end);
}
