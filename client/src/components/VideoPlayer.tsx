import { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface PoseKeypoint {
  x: number;
  y: number;
  confidence: number;
  name: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  keypoints: PoseKeypoint[][];
  currentFrame: number;
  onTimeUpdate: (time: number) => void;
  onFrameChange: (frame: number) => void;
  qualities?: ('good' | 'warning' | 'poor')[];
  onVideoRef?: (ref: HTMLVideoElement) => void;
}

export default function VideoPlayer({ 
  videoUrl, 
  keypoints, 
  currentFrame,
  onTimeUpdate,
  onFrameChange,
  qualities,
  onVideoRef
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current && onVideoRef) {
      onVideoRef(videoRef.current);
    }
  }, [onVideoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeUpdate(video.currentTime);
      const fps = 30;
      const frame = Math.floor(video.currentTime * fps);
      onFrameChange(frame);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onTimeUpdate, onFrameChange]);

  useEffect(() => {
    drawSkeleton();
  }, [currentFrame, keypoints, qualities]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const drawSkeleton = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const clampedFrame = Math.min(currentFrame, keypoints.length - 1);
    const points = keypoints[clampedFrame];
    if (!points || points.length === 0) return;

    const connections = [
      ['nose', 'left_eye'],
      ['nose', 'right_eye'],
      ['left_eye', 'left_ear'],
      ['right_eye', 'right_ear'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['right_shoulder', 'right_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'],
      ['right_knee', 'right_ankle'],
    ];

    const getPoint = (name: string) => points.find(p => p.name === name);

    const quality = qualities?.[clampedFrame] || 'good';
    
    const lineColor = quality === 'good' ? '#10b981' : quality === 'warning' ? '#eab308' : '#ef4444';
    const pointColor = quality === 'good' ? '#10b981' : quality === 'warning' ? '#eab308' : '#ef4444';

    connections.forEach(([start, end]) => {
      const p1 = getPoint(start);
      const p2 = getPoint(end);
      
      if (p1 && p2 && p1.confidence > 0.3 && p2.confidence > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
        ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 8;
        ctx.shadowColor = lineColor;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    points.forEach(point => {
      if (point.confidence > 0.3) {
        ctx.beginPath();
        ctx.arc(
          point.x * canvas.width,
          point.y * canvas.height,
          6,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = pointColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  return (
    <Card className="overflow-hidden" data-testid="video-player">
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full"
          data-testid="video-element"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          data-testid="canvas-skeleton"
        />
      </div>
      
      <div className="p-4 bg-card border-t">
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            onClick={togglePlay}
            data-testid="button-play-pause"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="flex-1 text-sm text-muted-foreground">
            Frame: <span className="font-mono" data-testid="text-current-frame">{currentFrame}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
