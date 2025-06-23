import React, { useState } from "react";
import GreenBox from "./GreenBox";
import './WorkCard.css'
import ReactMarkdown from 'react-markdown';

export default function WorkCard({ project }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = (e) => {
    e.stopPropagation();
    setShowModal(false);
  };

  return (
    <>
      <div className="card-container" onClick={handleOpen} style={{ cursor: 'pointer' }}>
        <GreenBox>
          <div className="image">
            <img src={project.imageSrc} alt={project.title} />
          </div>
          <div className="text">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p className="click-more">Click me to see more!</p>
          </div>
        </GreenBox>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}>&times;</button>
            <h2>{project.title}</h2>
            <div className="workdetailcontent">
              {project.details && project.details.map((item, idx) => {
                if (item.type === "text") {
                  return <ReactMarkdown key={idx}>{item.value}</ReactMarkdown>;
                } else if (item.type === "image") {
                  return <img key={idx} src={item.value} alt={`${project.title} detail ${idx+1}`} />;
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}