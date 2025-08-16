import { ProjectCard } from '@/components/projects/ProjectCard';
import ProjectModal from '@/components/projects/ProjectModal';
import ProjectCardSkeleton from '@/components/skeletons/ProjectCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useGetProjectsQuery } from '@/store/services/projectApi';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth()

  const { data: projects = [], isLoading } = useGetProjectsQuery();

  const handleAdd = () => {
    setModalOpen(true);
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        {user && ['admin', 'manager'].includes(user?.role) && <Button onClick={handleAdd}>New Project</Button>}
      </div>

      {!projects.length && !isLoading && <p className="px-3 py-2 text-center text-gray-500 mt-20">
        No new Projects
      </p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 3 }).map((_, index) => <ProjectCardSkeleton key={index} />)}
        {projects?.map((project) => (
          <div key={project.id} onClick={() => handleProjectClick(project.id)}>
            <ProjectCard project={project} onEdit={() => { }} />
          </div>
        ))}
      </div>

      <ProjectModal
        isOpen={modalOpen}
        setIsOpen={() => setModalOpen(false)}
      />
    </div>
  );
};
