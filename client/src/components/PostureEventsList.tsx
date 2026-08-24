import { Card } from '@/components/ui/card';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface PostureEvent {
  timestamp: number;
  type: 'good' | 'poor';
  duration: number;
  description: string;
}

interface PostureEventsListProps {
  events: PostureEvent[];
}

export default function PostureEventsList({ events }: PostureEventsListProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="p-6" data-testid="posture-events-list">
      <h3 className="text-lg font-semibold mb-4">Posture Events</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-accent hover-elevate"
            data-testid={`event-${index}`}
          >
            <div className={`p-2 rounded-lg ${
              event.type === 'good' ? 'bg-posture-good/20' : 'bg-posture-poor/20'
            }`}>
              {event.type === 'good' ? (
                <CheckCircle2 className="w-4 h-4 text-posture-good" />
              ) : (
                <AlertCircle className="w-4 h-4 text-posture-poor" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-mono text-muted-foreground">
                  {formatTime(event.timestamp)}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {formatDuration(event.duration)}
                </span>
              </div>
              <p className="text-sm">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
