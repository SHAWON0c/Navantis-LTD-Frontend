import { tailChase } from "ldrs";
import { useEffect, useState } from "react";
tailChase.register();

const Loader = ({ size = 45, speed = 2.5, color = "black", visible = true }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) setShow(true);
    else {
      // Delay unmount to allow smooth fade+scale
      const timeout = setTimeout(() => setShow(false), 400); 
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  return show ? (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 
        transition-opacity duration-400 ease-in-out
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className={`transition-transform duration-500 ease-in-out 
          ${visible ? "scale-100" : "scale-90"}
          translate-x-32  /* shift 20px right */
        `}
      >
        <l-tail-chase size={size} speed={speed} color={color}></l-tail-chase>
      </div>
    </div>
  ) : null;
};

export default Loader;
