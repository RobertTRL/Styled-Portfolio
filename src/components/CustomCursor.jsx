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
  const mqlRef = useRef(null);
  if (mqlRef.current === null) {
    mqlRef.current = window.matchMedia("(any-pointer: fine)");
  }

  const [hasPointer, setHasPointer] = useState(() => mqlRef.current.matches);

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

  // ISSUE-06 FIX: Track visibility in a ref so onMove can skip setState
  // when the cursor is already visible (which is true for 99.9% of mousemove events).
  // Before: setVisible(current => current || true) ran the React scheduler
  //         on every mousemove at 60-120 Hz for the entire page lifetime.
  // After:  setState is called exactly once (false → true) and once on leave (true → false).
  const visibleRef = useRef(false);

  const stateRef = useRef(cursorState);
  useEffect(() => { stateRef.current = cursorState; }, [cursorState]);

  // FIX: Replace window._cursorX / window._cursorY globals with a ref.
  // Global pollution on window is unnecessary — a ref scoped to this component
  // is cleaner and avoids accidental collisions with third-party scripts.
  const cursorPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!hasPointer) return;

    const onMove = (e) => {
      // Always update position ref immediately (no state, no re-render).
      cursorPosRef.current.x = e.clientX;
      cursorPosRef.current.y = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // ISSUE-06 FIX: Only call setState on the first move (false → true).
      // All subsequent moves are swallowed here — zero scheduler pressure.
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const onMouseEnter = () => {
      // Keep ref and state in sync when cursor re-enters the document.
      visibleRef.current = true;
      setVisible(true);
    };

    const onMouseLeave = () => {
      // Reset ref on leave so the next onMove re-triggers the true → visible transition.
      visibleRef.current = false;
      setVisible(false);
    };

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
      const { x, y } = cursorPosRef.current;
      const hovered = document.elementFromPoint(x, y);
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