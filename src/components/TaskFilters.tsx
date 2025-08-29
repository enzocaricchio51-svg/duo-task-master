import { TaskFilters as TTaskFilters, TaskStatus, TaskResponsible, TaskPriority, TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '@/types/Task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface TaskFiltersProps {
  filters: TTaskFilters;
  onFiltersChange: (filters: TTaskFilters) => void;
  taskStats: {
    total: number;
    pending: number;
    inProgress: number;
    inReview: number;
    completed: number;
    myTasks: number;
    partnerTasks: number;
  };
}

export const TaskFilters = ({ filters, onFiltersChange, taskStats }: TaskFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleStatus = (status: TaskStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const toggleResponsible = (responsible: TaskResponsible) => {
    const currentResponsible = filters.responsible || [];
    const newResponsible = currentResponsible.includes(responsible)
      ? currentResponsible.filter(r => r !== responsible)
      : [...currentResponsible, responsible];
    
    onFiltersChange({
      ...filters,
      responsible: newResponsible.length > 0 ? newResponsible : undefined
    });
  };

  const togglePriority = (priority: TaskPriority) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    onFiltersChange({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setIsOpen(false);
  };

  const hasActiveFilters = Boolean(
    filters.status?.length || 
    filters.responsible?.length || 
    filters.priority?.length || 
    filters.project
  );

  // Filtros rápidos comunes
  const quickFilters = [
    {
      label: 'Mis Tareas',
      count: taskStats.myTasks,
      onClick: () => onFiltersChange({ ...filters, responsible: ['Yo'] })
    },
    {
      label: 'Pendientes',
      count: taskStats.pending + taskStats.inProgress + taskStats.inReview,
      onClick: () => onFiltersChange({ ...filters, status: ['pending', 'progress', 'review'] })
    },
    {
      label: 'En Proceso',
      count: taskStats.inProgress,
      onClick: () => onFiltersChange({ ...filters, status: ['progress'] })
    },
    {
      label: 'Completadas',
      count: taskStats.completed,
      onClick: () => onFiltersChange({ ...filters, status: ['complete'] })
    }
  ];

  return (
    <div className="space-y-4">
      {/* Estadísticas y filtros rápidos */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Panel de Control</h3>
              <Badge variant="secondary">{taskStats.total} tareas</Badge>
            </div>
            
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={filter.onClick}
                className="justify-between h-auto p-3"
              >
                <span className="text-sm">{filter.label}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros avanzados */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtros Avanzados</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  Activos
                </Badge>
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Búsqueda por proyecto */}
              <div className="space-y-2">
                <Label htmlFor="project-search" className="text-sm font-medium">
                  Buscar por Proyecto
                </Label>
                <Input
                  id="project-search"
                  placeholder="Ej: Marketing, Desarrollo..."
                  value={filters.project || ''}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    project: e.target.value || undefined
                  })}
                />
              </div>

              {/* Estados */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Estados</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TASK_STATUS_CONFIG).map(([status, config]) => {
                    const isSelected = filters.status?.includes(status as TaskStatus);
                    return (
                      <Button
                        key={status}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleStatus(status as TaskStatus)}
                        className="text-xs"
                      >
                        <span className="mr-1">{config.emoji}</span>
                        {config.label}
                        {isSelected && <X className="ml-1 h-3 w-3" />}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Responsables */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Responsables</Label>
                <div className="flex gap-2">
                  {(['Yo', 'Mi Socio'] as TaskResponsible[]).map((responsible) => {
                    const isSelected = filters.responsible?.includes(responsible);
                    return (
                      <Button
                        key={responsible}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleResponsible(responsible)}
                        className="text-xs"
                      >
                        {responsible}
                        {isSelected && <X className="ml-1 h-3 w-3" />}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Prioridades */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Prioridades</Label>
                <div className="flex gap-2">
                  {Object.entries(TASK_PRIORITY_CONFIG).map(([priority, config]) => {
                    const isSelected = filters.priority?.includes(priority as TaskPriority);
                    return (
                      <Button
                        key={priority}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePriority(priority as TaskPriority)}
                        className="text-xs"
                      >
                        <span className="mr-1">{config.emoji}</span>
                        {config.label}
                        {isSelected && <X className="ml-1 h-3 w-3" />}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};