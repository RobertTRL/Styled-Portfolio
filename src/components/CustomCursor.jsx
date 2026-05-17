import { useEffect, useRef, useState } from "react";
import "../styles/customcursor.css";
 
import cursorDefault    from "../assets/arrowhead-rounded-outline.svg";
import cursorNotAllowed from "../assets/not-allowed.svg";
import cursorText       from "../assets/v2.svg";
import cursorClick      from "../assets/icons8-hand-cursor.svg";
 
const CURSOR_IMAGES = {
  default:    cursorDefault,
  notAllowed: cursorNotAllowed,
  text:       cursorText,
  click:      cursorClick,
};
 
// ─── Automatic cursor state detection ───────────────────────────────────────
function detectCursorState(el) {
  // Manual override via data-cursor always wins
  const manual = el.closest("[data-cursor]");
  if (manual) return manual.dataset.cursor;
 
  // Not-allowed: disabled elements
  if (
    el.matches(":disabled") ||
    el.closest(":disabled") ||
    el.getAttribute("aria-disabled") === "true" ||
    el.closest("[aria-disabled='true']")
  ) return "notAllowed";
 
  // Text cursor: editable inputs and contenteditable
  if (
    el.matches(
      "input[type='text'], input[type='email'], input[type='password'], " +
      "input[type='search'], input[type='url'], input[type='number'], textarea"
    ) ||
    el.closest("[contenteditable='true']")
  ) return "text";
 
  // Walk up to find a clickable ancestor
  // NOTE: label excluded here so standalone labels get the text cursor
  const clickable = el.closest(
    "button, a, input, select, [role='button'], [role='link'], [tabindex]"
  );
 
  // Text cursor: readable text elements NOT inside something clickable
  // NOTE: span intentionally excluded — used inside almost every UI component
  if (!clickable && el.matches("p, h1, h2, h3, h4, h5, h6, li, blockquote, label"))
    return "text";
 
  return "default";
}
// ────────────────────────────────────────────────────────────────────────────
 
export default function CustomCursor({ isDark = false }) {
  const cursorRef  = useRef(null);
  const isDragging = useRef(false);
 
  const [cursorState, setCursorState] = useState("default");
  const [visible, setVisible]         = useState(false);
 
  const stateRef = useRef(cursorState);
  useEffect(() => { stateRef.current = cursorState; }, [cursorState]);
 
  useEffect(() => {
    if ("ontouchstart" in window) return;
 
    const onMove = (e) => {
      window._cursorX = e.clientX;
      window._cursorY = e.clientY;
      cursorRef.current.style.transform =
        `translate(${e.clientX}px, ${e.clientY}px)`;
      if (!visible) setVisible(true);
    };
 
    const onMouseEnter = () => setVisible(true);
    const onMouseLeave = () => setVisible(false);
 
    const onMouseOver = (e) => {
      if (isDragging.current) return;
      setCursorState(detectCursorState(e.target));
    };
 
    const onMouseDown = () => {
      isDragging.current = true;
      setCursorState(prev => prev === "notAllowed" ? "notAllowed" : "click");
    };
 
    const onMouseUp = () => {
      isDragging.current = false;
      const hovered = document.elementFromPoint(
        window._cursorX ?? 0,
        window._cursorY ?? 0
      );
      setCursorState(hovered ? detectCursorState(hovered) : "default");
    };
 
    window.addEventListener("mousemove",    onMove);
    window.addEventListener("mouseover",    onMouseOver);
    window.addEventListener("mousedown",    onMouseDown);
    window.addEventListener("mouseup",      onMouseUp);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
 
    return () => {
      window.removeEventListener("mousemove",    onMove);
      window.removeEventListener("mouseover",    onMouseOver);
      window.removeEventListener("mousedown",    onMouseDown);
      window.removeEventListener("mouseup",      onMouseUp);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);
 
  if ("ontouchstart" in window) return null;
 
  // Only apply the dark filter to text and click cursors
  const applyDarkFilter = isDark && (cursorState === "text" || cursorState === "click");
 
  return (
    <div
      ref={cursorRef}
      className={[
        "custom-cursor",
        `custom-cursor--${cursorState}`,
        visible   ? "custom-cursor--visible" : "",
        isDark    ? "custom-cursor--dark"    : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <img
        src={CURSOR_IMAGES[cursorState]}
        className={[
          "custom-cursor__img",
          applyDarkFilter ? "custom-cursor__img--white" : "",
        ].join(" ")}
        alt=""
        draggable={false}
      />
    </div>
  );
}