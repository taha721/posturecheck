import { useState } from 'react';
import { Card } from '@/components/ui/card';

export interface TimelineSegment {
  start: number;
  end: number;
  quality: 'good' | 'warning' | 'poor';
}

interface PostureTimelineProps {
  segments: TimelineSegment[];
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function PostureTimeline({ 
  segments, 
  duration, 
  currentTime, 
  onSeek 
}: PostureTimelineProps) {
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    onSeek(time);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const getSegmentColor = (quality: 'good' | 'warning' | 'poor') => {
    switch (quality) {
      case 'good': return 'bg-posture-good';
      case 'warning': return 'bg-posture-warning';
      case 'poor': return 'bg-posture-poor';
    }
  };

  return (
    <Card className="p-6" data-testid="posture-timeline">
      <h3 className="text-lg font-semibold mb-4">Posture Timeline</h3>
      
      <div className="space-y-4">
        <div
          className="relative h-16 bg-muted rounded-lg cursor-pointer overflow-hidden"
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          data-testid="timeline-track"
        >
          {segments.map((segment, index) => {
            const left = (segment.start / duration) * 100;
            const width = ((segment.end - segment.start) / duration) * 100;
            return (
              <div
                key={index}
                className={`absolute top-0 h-full ${getSegmentColor(segment.quality)} opacity-80`}
                style={{ left: `${left}%`, width: `${width}%` }}
                data-testid={`segment-${segment.quality}-${index}`}
              />
            );
          })}
          
          <div
            className="absolute top-0 w-1 h-full bg-primary z-10"
            style={{ left: `${(currentTime / duration) * 100}%` }}
            data-testid="timeline-playhead"
          >
            <div className="absolute -top-1 -left-2 w-5 h-5 rounded-full bg-primary border-2 border-background" />
          </div>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground font-mono">
          <span data-testid="text-current-time">{formatTime(currentTime)}</span>
          <span data-testid="text-total-duration">{formatTime(duration)}</span>
        </div>

        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-posture-good" />
            <span>Good Posture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-posture-warning" />
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-posture-poor" />
            <span>Poor Posture</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
