import { tailChase } from "ldrs";
import { useEffect, useState } from "react";
tailChase.register();

const Loader = ({
  size = 45,
  speed = 2.5,
  color = null,
  visible = true,
  fullScreen = false,
}) => {
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

  const containerClass = fullScreen
    ? `fixed inset-0 z-50 flex items-center justify-center
       transition-opacity duration-300 ease-in-out
       bg-transparent dark:bg-transparent`
    : `w-full min-h-[55vh] flex items-center justify-center
       transition-opacity duration-300 ease-in-out`;

  return show ? (
    <div className={`${containerClass} ${visible ? "opacity-100" : "opacity-0"}`}>
      <div
        className={`transition-transform duration-300 ease-in-out ${visible ? "scale-100" : "scale-95"}`}
      >
        <l-tail-chase size={size} speed={speed} color={spinnerColor}></l-tail-chase>
      </div>
    </div>
  ) : null;
};

export default Loader;
