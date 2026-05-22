import { useEffect, useRef, useState } from "react";
import "../styles/customcursor.css";

import cursorDefault    from "../assets/default-cursor.svg";
import cursorNotAllowed from "../assets/not-allowed.svg";
import cursorText       from "../assets/v2.svg";
import cursorClick      from "../assets/icons8-hand-cursor.svg";

const CURSOR_IMAGES = {
  default:    cursorDefault,
  notAllowed: cursorNotAllowed,
  text:       cursorText,
  click:      cursorClick,
};

function detectCursorState(el) {
  const manual = el.closest("[data-cursor]");
  if (manual) return manual.dataset.cursor;

  if (
    el.matches(":disabled") ||
    el.closest(":disabled") ||
    el.getAttribute("aria-disabled") === "true" ||
    el.closest("[aria-disabled='true']")
  ) return "notAllowed";

  if (
    el.matches(
      "input[type='text'], input[type='email'], input[type='password'], " +
      "input[type='search'], input[type='url'], input[type='number'], textarea"
    ) ||
    el.closest("[contenteditable='true']")
  ) return "text";

  const clickable = el.closest(
    "button, a, input, select, [role='button'], [role='link'], [tabindex]"
  );

  if (!clickable && el.matches("p, h1, h2, h3, h4, h5, h6, li, blockquote, label"))
    return "text";

  return "default";
}

export default function CustomCursor({ isDark = false }) {
  // FIX: mql is stored in a ref so it is created once, not on every render.
  // Previously `const mql = window.matchMedia(...)` ran on every render,
  // leaking a new MediaQueryList each time and causing stale listener refs.
  const mqlRef = useRef(null);
  if (mqlRef.current === null) {
    mqlRef.current = window.matchMedia("(any-pointer: fine)");
  }

  const [hasPointer, setHasPointer] = useState(() => mqlRef.current.matches);

  // FIX: listener now correctly references the stable mqlRef.current object.
  useEffect(() => {
    const mql     = mqlRef.current;
    const handler = (e) => setHasPointer(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const cursorRef  = useRef(null);
  const isDragging = useRef(false);

  const [cursorState, setCursorState] = useState("default");
  const [visible, setVisible]         = useState(false);

  const stateRef = useRef(cursorState);
  useEffect(() => { stateRef.current = cursorState; }, [cursorState]);

  useEffect(() => {
    if (!hasPointer) return;

    const onMove = (e) => {
      window._cursorX = e.clientX;
      window._cursorY = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (!visible) setVisible(true);
    };

    const onMouseEnter = () => setVisible(true);
    const onMouseLeave = () => setVisible(false);

    const onMouseOver = (e) => {
      const targetState = detectCursorState(e.target);
      if (isDragging.current && stateRef.current !== "text" && targetState !== "text") return;
      setCursorState(targetState);
    };

    const onMouseDown = (e) => {
      isDragging.current = true;
      const initialTargetState = detectCursorState(e.target);
      if (initialTargetState === "notAllowed" || initialTargetState === "text") {
        setCursorState(initialTargetState);
      } else {
        setCursorState("click");
      }
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
  }, [hasPointer]);

  if (!hasPointer) return null;

  const applyDarkFilter = isDark && (cursorState === "text" || cursorState === "click");

  return (
    <div
      ref={cursorRef}
      className={[
        "custom-cursor",
        `custom-cursor--${cursorState}`,
        visible  ? "custom-cursor--visible" : "",
        isDark   ? "custom-cursor--dark"    : "",
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