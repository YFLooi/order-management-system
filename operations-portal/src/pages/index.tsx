import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Landing from "../components/landing/landing";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { locale } = router;
  const { query, isReady } = useRouter();

  useEffect(() => {
    //Unable to use react-responsive here. It causes an "Expected <div> in <div>" error on hydration
    //Identifies viewport size
    //Component is remounted each time the window is resized. That's why this works in detecting viewport size!
    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();

    return function cleanup() {
      //Each time the window is resized, the DOM is re-rendered. This ensures event listeners do NOT stack up
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  const [isTabletOrMobileDevice, setIsTabletOrMobileDevice] = useState(false);
  const [windowWidth, setWindowWidth] = useState(undefined);
  const [windowHeight, setWindowHeight] = useState(undefined);

  const updateWindowDimensions = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);

    if (window.innerWidth <= 768) {
      setIsTabletOrMobileDevice(true);
    } else {
      setIsTabletOrMobileDevice(false);
    }
  };

  return (
    <>
      <Landing
        isTabletOrMobileDevice={isTabletOrMobileDevice}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
      />
    </>
  );
}
