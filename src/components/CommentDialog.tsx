import { useState } from 'react';
import { Task } from '@/types/Task';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Calendar } from 'lucide-react';

interface CommentDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (comment: string) => void;
}

export const CommentDialog = ({ task, isOpen, onClose, onAddComment }: CommentDialogProps) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleClose = () => {
    setNewComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentarios - {task.name}
          </DialogTitle>
          <DialogDescription>
            Agrega actualizaciones, preguntas o impedimentos para esta tarea.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Comments */}
          {task.comments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Comentarios Anteriores</h4>
              <ScrollArea className="h-48 w-full">
                <div className="space-y-3 pr-4">
                  {task.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="bg-muted p-3 rounded-lg border-l-4 border-primary"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>{comment.date}</span>
                      </div>
                      <p className="text-sm text-card-foreground leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {task.comments.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aún no hay comentarios para esta tarea</p>
            </div>
          )}

          {/* New Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="new-comment" className="text-sm font-medium">
                Nuevo Comentario
              </Label>
              <Textarea
                id="new-comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario aquí... Ej: Actualización del progreso, pregunta sobre requisitos, impedimento encontrado, etc."
                rows={3}
                className="mt-1 resize-none"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cerrar
              </Button>
              <Button 
                type="submit" 
                disabled={!newComment.trim()}
                className="min-w-[120px]"
              >
                Agregar Comentario
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
