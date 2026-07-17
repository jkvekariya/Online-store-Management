import React from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";

const PagebodyHeader = ({title}) => {
  return (
    <>
      <div className="b-header-bg">
        <div className="page-title">
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
    </>
  );
};

export default PagebodyHeader;
