import { useState } from 'react';
import { Task, TaskStatus, TaskPriority, TaskResponsible, TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '@/types/Task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export const TaskForm = ({ task, onSubmit, onCancel, isEdit = false }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    responsible: task?.responsible || 'Yo' as TaskResponsible,
    priority: task?.priority || 'medium' as TaskPriority,
    status: task?.status || 'pending' as TaskStatus,
    project: task?.project || '',
    dueDate: task?.dueDate || format(new Date(), 'yyyy-MM-dd')
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : new Date()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.project.trim()) {
      return;
    }

    onSubmit({
      ...formData,
      dueDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        dueDate: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          {isEdit ? 'Editar Tarea' : 'Nueva Tarea'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nombre de la Tarea <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Diseñar el logo de la empresa"
              className="w-full"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe los detalles específicos sobre lo que se debe hacer, objetivos y cualquier dato relevante..."
              rows={4}
              className="w-full resize-none"
              required
            />
          </div>

          {/* Grid de campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Responsable */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Responsable</Label>
              <Select 
                value={formData.responsible} 
                onValueChange={(value: TaskResponsible) => 
                  setFormData(prev => ({ ...prev, responsible: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yo">Yo</SelectItem>
                  <SelectItem value="Mi Socio">Mi Socio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prioridad */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Prioridad</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: TaskPriority) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_PRIORITY_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{config.emoji}</span>
                        <span>{config.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estado (solo si es edición) */}
            {isEdit && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Estado</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: TaskStatus) => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TASK_STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span>{config.emoji}</span>
                          <span>{config.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Proyecto */}
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium">
                Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                placeholder="Ej: Marketing, Desarrollo, Cliente X"
                required
              />
            </div>
          </div>

          {/* Fecha límite */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Fecha Límite</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {isEdit ? 'Actualizar Tarea' : 'Crear Tarea'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};