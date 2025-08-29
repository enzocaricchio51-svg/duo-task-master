import { useState, useCallback, useMemo } from 'react';
import { Task, TaskFilters, TaskStatus, TaskComment } from '@/types/Task';
import { useToast } from '@/hooks/use-toast';

// Tareas de ejemplo para demostrar el sistema
const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    name: 'Diseñar el logo de la empresa',
    status: 'progress',
    description: 'Crear un logo profesional que represente la identidad de nuestra empresa. Debe incluir versiones en color y blanco/negro, y ser escalable para diferentes usos.',
    responsible: 'Yo',
    priority: 'high',
    dueDate: '2024-12-30',
    project: 'Branding',
    comments: [
      {
        id: 'c1',
        date: '15/12/2024',
        text: 'Iniciando con las primeras propuestas de concepto. Explorando estilos minimalistas.'
      }
    ],
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Configurar servidor de producción',
    status: 'pending',
    description: 'Configurar el servidor AWS EC2 para el deployment de la aplicación web. Incluye configuración SSL, dominio y base de datos.',
    responsible: 'Mi Socio',
    priority: 'high',
    dueDate: '2024-12-28',
    project: 'Infraestructura',
    comments: [],
    createdAt: '2024-12-14T09:00:00Z',
    updatedAt: '2024-12-14T09:00:00Z'
  },
  {
    id: '3',
    name: 'Revisar contratos con proveedores',
    status: 'review',
    description: 'Revisar y negociar los términos de los contratos con nuestros principales proveedores de software y servicios.',
    responsible: 'Yo',
    priority: 'medium',
    dueDate: '2024-12-25',
    project: 'Administración',
    comments: [
      {
        id: 'c2',
        date: '14/12/2024',
        text: 'Contrato con proveedor A revisado. Pendiente negociación de descuentos.'
      },
      {
        id: 'c3',
        date: '15/12/2024',
        text: 'Programada reunión para el 20/12 con el equipo legal.'
      }
    ],
    createdAt: '2024-12-13T11:00:00Z',
    updatedAt: '2024-12-15T16:00:00Z'
  },
  {
    id: '4',
    name: 'Campaña de marketing navideña',
    status: 'complete',
    description: 'Lanzar campaña promocional para las fiestas navideñas incluyendo email marketing, redes sociales y publicidad online.',
    responsible: 'Mi Socio',
    priority: 'medium',
    dueDate: '2024-12-20',
    project: 'Marketing',
    comments: [
      {
        id: 'c4',
        date: '12/12/2024',
        text: 'Campaña lanzada exitosamente. CTR inicial de 3.2%'
      }
    ],
    createdAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-20T18:00:00Z'
  },
  {
    id: '5',
    name: 'Actualizar documentación del API',
    status: 'pending',
    description: 'Actualizar la documentación técnica del API REST con los nuevos endpoints y cambios en los existentes.',
    responsible: 'Yo',
    priority: 'low',
    dueDate: '2025-01-05',
    project: 'Desarrollo',
    comments: [],
    createdAt: '2024-12-16T15:00:00Z',
    updatedAt: '2024-12-16T15:00:00Z'
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [filters, setFilters] = useState<TaskFilters>({});
  const { toast } = useToast();

  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Tarea creada",
      description: `La tarea "${newTask.name}" ha sido creada exitosamente.`,
    });
    
    return newTask;
  }, [toast]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ));
    
    toast({
      title: "Estado actualizado",
      description: "El estado de la tarea ha sido actualizado.",
    });
  }, [toast]);

  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
    
    toast({
      title: "Tarea actualizada",
      description: "La información de la tarea ha sido actualizada.",
    });
  }, [toast]);

  const addComment = useCallback((taskId: string, commentText: string) => {
    const comment: TaskComment = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('es-ES'),
      text: commentText
    };

    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            comments: [...task.comments, comment],
            updatedAt: new Date().toISOString() 
          }
        : task
    ));

    toast({
      title: "Comentario agregado",
      description: "El comentario ha sido agregado a la tarea.",
    });
  }, [toast]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Tarea eliminada",
      description: "La tarea ha sido eliminada del sistema.",
    });
  }, [toast]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status && filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false;
      }
      if (filters.responsible && filters.responsible.length > 0 && !filters.responsible.includes(task.responsible)) {
        return false;
      }
      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false;
      }
      if (filters.project && task.project.toLowerCase().indexOf(filters.project.toLowerCase()) === -1) {
        return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'progress').length,
      inReview: tasks.filter(t => t.status === 'review').length,
      completed: tasks.filter(t => t.status === 'complete').length,
      myTasks: tasks.filter(t => t.responsible === 'Yo').length,
      partnerTasks: tasks.filter(t => t.responsible === 'Mi Socio').length,
    };
  }, [tasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filters,
    setFilters,
    taskStats,
    createTask,
    updateTaskStatus,
    updateTask,
    addComment,
    deleteTask,
  };
};