import React, { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";
import "../css/scrolltop.css";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when user scrolls down 600px
            const scrolled = window.scrollY;
            const threshold = 600;

            if (scrolled > threshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className={`scroll-to-top ${isVisible ? "show" : ""}`} onClick={scrollToTop}>
            <FaChevronUp />
        </div>
    );
};

export default ScrollToTop;
