import React from 'react';
import { NavLink } from "react-router-dom";

function WorkNav({ onCategorySelect, selectedCategory }) {
  return (
    <nav className="navwork">
      <ul>
        <li
          className={selectedCategory === "all" ? "active-link" : ""}
          onClick={() => onCategorySelect("all")}
          style={{ cursor: "pointer" }}
        >
          ALL
        </li>
        <li
          className={selectedCategory === "creations" ? "active-link" : ""}
          onClick={() => onCategorySelect("creations")}
          style={{ cursor: "pointer" }}
        >
          CREATIONS
        </li>
        <li
          className={selectedCategory === "performance" ? "active-link" : ""}
          onClick={() => onCategorySelect("performance")}
          style={{ cursor: "pointer" }}
        >
          PERFORMANCE
        </li>
        <li
          className={selectedCategory === "collaboration" ? "active-link" : ""}
          onClick={() => onCategorySelect("collaboration")}
          style={{ cursor: "pointer" }}
        >
          COLLABORATION
        </li>
        
        <li
          className={selectedCategory === "videos" ? "active-link" : ""}
          onClick={() => onCategorySelect("videos")}
          style={{ cursor: "pointer" }}
        >
          VIDEOS
        </li>
      </ul>
    </nav>
  );
}

export default WorkNav;