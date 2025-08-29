import { useState } from 'react';
import { Task, TaskStatus } from '@/types/Task';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { CommentDialog } from './CommentDialog';
import { Button } from '@/components/ui/button';
import { Plus, FileText, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const TaskManager = () => {
  const {
    tasks,
    allTasks,
    filters,
    setFilters,
    taskStats,
    createTask,
    updateTaskStatus,
    updateTask,
    addComment,
    deleteTask,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [commentTaskId, setCommentTaskId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    createTask(taskData);
    setShowForm(false);
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
  };

  const handleAddComment = (taskId: string, comment: string) => {
    addComment(taskId, comment);
    setCommentTaskId(null);
  };

  const handleDeleteTask = () => {
    if (deleteTaskId) {
      deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  const commentTask = allTasks.find(t => t.id === commentTaskId);
  const deleteTask_obj = allTasks.find(t => t.id === deleteTaskId);

  if (showForm || editingTask) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <TaskForm
            task={editingTask || undefined}
            onSubmit={editingTask ? handleEditTask : handleCreateTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            isEdit={!!editingTask}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-card-foreground">Task Manager</h1>
            <p className="text-muted-foreground">
              Centro de control de tareas para ti y tu socio
            </p>
          </div>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="self-start md:self-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-card-foreground">{taskStats.total}</div>
              <div className="text-sm text-muted-foreground">Total de Tareas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-status-progress" />
              <div className="text-2xl font-bold text-card-foreground">{taskStats.inProgress}</div>
              <div className="text-sm text-muted-foreground">En Proceso</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-card-foreground">{taskStats.myTasks}</div>
              <div className="text-sm text-muted-foreground">Mis Tareas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-2xl font-bold text-card-foreground">{taskStats.completed}</div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <TaskFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
          taskStats={taskStats}
        />

        {/* Tasks Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-card-foreground">
              {tasks.length === allTasks.length 
                ? `Todas las Tareas (${tasks.length})`
                : `Tareas Filtradas (${tasks.length} de ${allTasks.length})`
              }
            </h2>
          </div>

          {tasks.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                {allTasks.length === 0 ? 'No hay tareas creadas' : 'No hay tareas que coincidan con los filtros'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {allTasks.length === 0 
                  ? 'Comienza creando tu primera tarea para organizar el trabajo.'
                  : 'Intenta ajustar los filtros o crear una nueva tarea.'
                }
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Tarea
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={setEditingTask}
                  onDelete={setDeleteTaskId}
                  onAddComment={setCommentTaskId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Comment Dialog */}
        {commentTask && (
          <CommentDialog
            task={commentTask}
            isOpen={!!commentTaskId}
            onClose={() => setCommentTaskId(null)}
            onAddComment={(comment) => handleAddComment(commentTask.id, comment)}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas eliminar la tarea "{deleteTask_obj?.name}"? 
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};