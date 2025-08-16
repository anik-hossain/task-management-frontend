import { FC, useState, lazy, Suspense } from "react";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectCardSkeleton from "@/components/skeletons/ProjectCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetProjectsQuery } from "@/store/services/projectApi";
import { Project } from "@/types/global";

// Lazy load the modal (heaviest, only used when opened)
const ProjectModal = lazy(() => import("@/components/projects/ProjectModal"));

export const ProjectsPage: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const { user } = useAuth();

  const { data: projects = [], isLoading } = useGetProjectsQuery();

  const handleAdd = () => setModalOpen(true);

  const handleEdit = (project: Project) => {
    setProject(project);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        {user && ["admin", "manager"].includes(user?.role) && (
          <Button onClick={handleAdd}>New Project</Button>
        )}
      </div>

      {!projects.length && !isLoading && (
        <p className="px-3 py-2 text-center text-gray-500 mt-20">
          No new Projects
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}

        {projects?.map((project) => (
          <div key={project.id}>
            <ProjectCard project={project} onEdit={handleEdit} />
          </div>
        ))}
      </div>

      {modalOpen && (
        <Suspense fallback={null}>
          <ProjectModal
            isOpen={modalOpen}
            setIsOpen={() => setModalOpen(false)}
            project={project}
            setProject={() => setProject(null)}
          />
        </Suspense>
      )}
    </div>
  );
};
