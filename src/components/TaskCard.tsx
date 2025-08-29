import { Task, TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG, TaskStatus } from '@/types/Task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MessageSquare, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAddComment: (taskId: string) => void;
}

export const TaskCard = ({ task, onStatusChange, onEdit, onDelete, onAddComment }: TaskCardProps) => {
  const statusConfig = TASK_STATUS_CONFIG[task.status];
  const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
  
  const dueDateObj = new Date(task.dueDate);
  const isOverdue = dueDateObj < new Date() && task.status !== 'complete';
  const isDueSoon = dueDateObj < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && task.status !== 'complete';

  return (
    <Card className="task-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-card-foreground">{task.name}</h3>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">Vencida</Badge>
            )}
            {isDueSoon && !isOverdue && (
              <Badge className="bg-priority-medium text-priority-medium-foreground text-xs">Próxima</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`status-badge bg-${statusConfig.color} text-${statusConfig.color}-foreground`}>
              <span>{statusConfig.emoji}</span>
              <span>{statusConfig.label}</span>
            </div>
            
            <div className={`priority-badge bg-${priorityConfig.color} text-${priorityConfig.color}-foreground`}>
              <span>{priorityConfig.emoji}</span>
              <span>{priorityConfig.label}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
            {Object.entries(TASK_STATUS_CONFIG).map(([status, config]) => (
              <DropdownMenuItem 
                key={status}
                onClick={() => onStatusChange(task.id, status as TaskStatus)}
                className="flex items-center gap-2"
              >
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(task)} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddComment(task.id)} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Agregar Comentario
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)} 
              className="flex items-center gap-2 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-medium text-sm text-muted-foreground mb-1">Descripción:</h4>
        <p className="text-card-foreground text-sm leading-relaxed">{task.description}</p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Responsable:</span>
          <span className="font-medium text-card-foreground">{task.responsible}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Fecha:</span>
          <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-card-foreground'}`}>
            {format(dueDateObj, 'dd/MM/yyyy', { locale: es })}
          </span>
        </div>
      </div>

      {/* Project */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-muted-foreground text-sm">Proyecto: </span>
          <Badge variant="secondary" className="text-xs">{task.project}</Badge>
        </div>
        
        {task.comments.length > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">{task.comments.length}</span>
          </div>
        )}
      </div>

      {/* Comments Preview */}
      {task.comments.length > 0 && (
        <div className="pt-2 border-t border-card-border">
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Comentarios:</h5>
          <div className="space-y-1">
            {task.comments.slice(-2).map((comment) => (
              <div key={comment.id} className="text-xs bg-muted p-2 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{comment.date}</span>
                </div>
                <p className="text-muted-foreground">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};