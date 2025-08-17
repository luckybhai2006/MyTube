import React from "react";
import { useLoader } from "../context/loaderContext";

const loaderStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "4px",
  width: "0%",
  backgroundColor: "red",
  zIndex: 9999,
  transition: "width 0.3s",
};

const Loader = () => {
  const { loading } = useLoader();

  return (
    <div
      style={{
        ...loaderStyle,
        width: loading ? "100%" : "0%",
      }}
    />
  );
};

export default Loader;
