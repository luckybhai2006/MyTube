import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/VideoCard.css";

const ChannelSuggest = ({ activeCategory, onSelectCategory }) => {
  const location = useLocation();

  // hide if current path starts with /video
  if (location.pathname.startsWith("/video")) {
    return null;
  }
  if (location.pathname.startsWith("/watch-history")) {
    return null;
  }
  const categories = [
    "All",
    "Music",
    "Gaming",
    "News",
    "Sports",
    "Movies",
    "Tech",
    "Live",
    "Fashion",
    "Education",
    "Comedy",
    "Travel",
    "Science",
    "Health",
    "Lifestyle",
    "Code With Harry",
    "Technical Thapa",
    "Sakth Londe",
  ];

  const scrollRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowPrev(el.scrollLeft > 0);
    setShowNext(el.scrollWidth > el.clientWidth + el.scrollLeft);
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  useEffect(() => {
    checkScroll();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
      checkScroll();
    };

    const el = scrollRef.current;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="suggestbar">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "1200px",
          width: "100%",
          padding: isMobile ? "0" : "0 10px", // ✅ zero padding for phones
          position: "relative",
        }}
      >
        {/* Prev Button */}
        {showPrev &&
          !isMobile && ( // ✅ Hide arrows on phones (swipe instead)
            <button
              onClick={scrollLeft}
              style={{
                position: "absolute",
                left: 0,
                zIndex: 2,
                background: "white",
                border: "none",
                cursor: "pointer",
                padding: "6px 10px",
                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                borderRadius: "50%",
              }}
            >
              ◀
            </button>
          )}

        {/* Scrollable Categories */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: isMobile ? "0 5px" : "0 20px", // ✅ start from 0px on phone
            scrollBehavior: "smooth",
            width: "100%",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                marginRight: "10px",
                padding: "8px 14px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                background: activeCategory === cat ? "#000" : "#eee",
                color: activeCategory === cat ? "#fff" : "#000",
                flexShrink: 0,
                whiteSpace: "nowrap",
                fontSize: "14px",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Next Button */}
        {showNext &&
          !isMobile && ( // ✅ Hide arrows on phones
            <button
              onClick={scrollRight}
              style={{
                position: "absolute",
                right: 0,
                zIndex: 2,
                background: "white",
                border: "none",
                cursor: "pointer",
                padding: "6px 10px",
                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                borderRadius: "50%",
              }}
            >
              ▶
            </button>
          )}
      </div>
    </div>
  );
};

export default ChannelSuggest;
