import { Project } from '@/types/global';
import getBadgeColor from '@/utils/getStatusBadgeClass';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDeleteProjectMutation } from '@/store/services/projectApi';

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
}

const ProjectCard: React.FC<Props> = ({ project, onEdit }) => {
  const navigate = useNavigate();
  const [projectDelete] = useDeleteProjectMutation()

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleProjectDelete = (id: number) => {
    projectDelete(id)
  }

  return (
    <div className="border rounded-lg p-4 shadow-xs hover:shadow transition cursor-pointer">
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
      <div className='border-t pt-4 mt-2 flex justify-end gap-2'>
        <Button variant="destructive" className='cursor-pointer' onClick={(() => handleProjectDelete(project.id))}>Delete</Button>
        <Button variant="outline" className='cursor-pointer' onClick={() => onEdit(project)}>Edit</Button>
        <Button variant="outline" className='cursor-pointer' onClick={() => handleProjectClick(project.id)}>View</Button>
      </div>
    </div>
  );
};

export default ProjectCard;
