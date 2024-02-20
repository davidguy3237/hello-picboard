import { useEffect, useState } from "react";

export default function useIsWindowSmall() {
  const [isWindowSmall, setIsWindowSmall] = useState(false);

  const onResize = () => {
    window.innerWidth < 768 ? setIsWindowSmall(true) : setIsWindowSmall(false);
  };

  useEffect(() => {
    onResize();

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isWindowSmall;
}

// Got this hook from https://stackoverflow.com/questions/73774206/set-window-innerwidth-in-useeffect-in-next-js
