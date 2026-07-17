import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import "../css/pagebodyheader.css"

const PagebodyHeader = forwardRef(({ title }, ref) => {
  return (
    <div className="page-header-bg" ref={ref}>
      <div className="page-main-title">
        <h2>{title}</h2>
        <div className="ul-links">
          <ul>
            <li id="home-link">
              <Link to="/">Home</Link>
            </li>
            <li>
              <MdKeyboardArrowRight />
            </li>
            <li>
              <Link to="">{title}</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
});

PagebodyHeader.displayName = "PagebodyHeader";

export default PagebodyHeader;
