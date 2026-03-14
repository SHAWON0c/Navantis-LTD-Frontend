import { tailChase } from "ldrs";
import { useEffect, useState } from "react";
tailChase.register();

const Loader = ({ size = 45, speed = 2.5, color = null, visible = true }) => {
  const [show, setShow] = useState(visible);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const spinnerColor = color || (isDark ? "#86efac" : "#0f172a");

  useEffect(() => {
    if (visible) setShow(true);
    else {
      // Delay unmount to allow smooth fade+scale
      const timeout = setTimeout(() => setShow(false), 400); 
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return show ? (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 
        transition-opacity duration-400 ease-in-out
        bg-transparent dark:bg-transparent backdrop-blur-[1px] dark:backdrop-blur-none
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className={`transition-transform duration-500 ease-in-out 
          ${visible ? "scale-100" : "scale-90"}
          translate-x-0 md:translate-x-32  /* center on mobile, keep desktop offset */
        `}
      >
        <l-tail-chase size={size} speed={speed} color={spinnerColor}></l-tail-chase>
      </div>
    </div>
  ) : null;
};

export default Loader;
