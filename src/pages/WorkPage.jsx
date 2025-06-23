import React, { useState } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import WorkNav from '../components/WorkNav';
import WorkCard from '../components/WorkCard';
import projects from '../data/projects';


function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // If "videos" is selected, show VideoPage and nothing else in <main>
  if (selectedCategory === "videos") {
    return (
      <section className="work-section">
        <WorkNav onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
        <main>
          <VideoPage />
        </main>
      </section>
    );
  }

  const filteredProjects = selectedCategory === "all"
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section className="work-section">
      <WorkNav onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      <div className="work">
        {filteredProjects.map((project) => (
          <WorkCard
            key={project.link}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}

export default WorkPage;