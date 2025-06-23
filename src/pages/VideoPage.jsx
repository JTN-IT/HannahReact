import React from "react";
import videos from "../data/videos.js";

const VideoPage = () => (
  <div className="work">
    <div className="card-container">
      {videos.map((vid, i) => (
        <div className="greencontainer workcard-video" key={i}>
          <div className={`image${vid.type === "link" ? " unavailable" : ""}`}>
            {vid.type === "embed" ? (
              <iframe
                width="100%"
                height="auto"
                style={{ aspectRatio: "16/9", border: "none" }}
                src={vid.src}
                allowFullScreen
                loading="lazy"
                title="YouTube video"
              />
            ) : (
              <a
                href={vid.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={vid.img} alt="Watch on YouTube" />
                <span className="play-button" aria-hidden="true"></span>
              </a>
            )}
          </div>
          <div className="text">
            <p>
              {/* Render newlines as <br /> */}
              {vid.desc.split('\n').map((line, idx) =>
                <React.Fragment key={idx}>
                  {line}
                  {idx < vid.desc.split('\n').length - 1 && <br />}
                </React.Fragment>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default VideoPage;

