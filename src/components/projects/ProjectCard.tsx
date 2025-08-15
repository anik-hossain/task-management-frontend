import { Project } from '@/types/global';
import getBadgeColor from '@/utils/getStatusBadgeClass';

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
}

export const ProjectCard: React.FC<Props> = ({ project, onEdit }) => {
  return (
    <div className="border rounded-lg p-4 shadow-xs hover:shadow transition cursor-pointer" onClick={() => onEdit(project)}>
      <h2 className="font-bold text-lg">{project.name}</h2>
      <p className="text-gray-600 mt-1">{project.description}</p>
      <div className="flex justify-between items-center mt-3">
        <span className={`px-2 py-0.5 font-medium capitalize text-xs rounded ${getBadgeColor(project.status)}`}>
          {project.status}
        </span>
        <span className="text-sm text-gray-500">
          {project.startDate} - {project.endDate}
        </span>
      </div>
    </div>
  );
};