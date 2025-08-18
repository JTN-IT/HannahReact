import React, { useState, useEffect } from 'react';
import WorkNav from '../components/WorkNav';
import WorkCard from '../components/WorkCard';
import VideoPage from '../pages/VideoPage';
import { useOutletContext } from 'react-router-dom';
import './WorkPage.css';

// Import all JSON files in /content/projects/
const projectModules = import.meta.glob('../../content/projects/*.json', { eager: true });

// Convert imports to an array
const projects = Object.values(projectModules);


function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { setTopbox } = useOutletContext();


  useEffect(() => {
    setTopbox(
      <WorkNav onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />
    );
    }, [setTopbox, selectedCategory]);

  
  if (selectedCategory === "videos") {
    return (
      <div className="work">
        <VideoPage />
      </div>
    );
  }

  const filteredProjects = selectedCategory === "all"
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="work">
      {filteredProjects.map((project) => (
        <WorkCard key={project.link} project={project} />
      ))}
    </div>
  );
}

export default WorkPage;


