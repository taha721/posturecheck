import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VideoPlayer, { PoseKeypoint } from '@/components/VideoPlayer';
import PostureMetric from '@/components/PostureMetric';
import PostureTimeline, { TimelineSegment } from '@/components/PostureTimeline';
import PostureEventsList, { PostureEvent } from '@/components/PostureEventsList';
import ThemeToggle from '@/components/ThemeToggle';
import { Activity, Clock, CheckCircle, AlertTriangle, MoveVertical, AlignVerticalJustifyCenter, UserX } from 'lucide-react';
import GitHubExport from '@/components/GitHubExport';
import { Link, useLocation } from 'wouter';
import { processVideo, ProcessedVideoData } from '@/lib/videoProcessing';
import { initializePoseDetector } from '@/lib/poseDetection';

export default function Analysis() {
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [videoData, setVideoData] = useState<ProcessedVideoData | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    const url = sessionStorage.getItem('videoUrl');
    const name = sessionStorage.getItem('videoName');
    
    if (!url) {
      setLocation('/');
      return;
    }
    
    setVideoUrl(url);
    startProcessing(url);
    
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [setLocation]);

  const startProcessing = async (url: string) => {
    try {
      await initializePoseDetector();
      
      const video = document.createElement('video');
      video.src = url;
      video.crossOrigin = 'anonymous';
      
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });
      
      setVideoDuration(video.duration);
      
      const data = await processVideo(video, (progress) => {
        setProcessingProgress(Math.round(progress * 100));
      });
      
      setVideoData(data);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 max-w-md text-center space-y-6">
          <div className="p-6 rounded-full bg-primary/10 inline-block">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Analyzing Your Posture</h2>
            <p className="text-muted-foreground">
              Processing video and detecting pose...
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              {processingProgress}%
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Error Processing Video</h2>
          <p className="text-muted-foreground mb-6">
            Unable to analyze the video. Please try again.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">PostureCheck</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              videoUrl={videoUrl}
              keypoints={videoData.keypoints}
              currentFrame={currentFrame}
              onTimeUpdate={setCurrentTime}
              onFrameChange={setCurrentFrame}
              qualities={videoData.qualities}
              onVideoRef={setVideoElement}
            />

            <PostureTimeline
              segments={videoData.segments}
              duration={videoDuration}
              currentTime={currentTime}
              onSeek={(time) => {
                if (videoElement) {
                  videoElement.currentTime = time;
                }
                setCurrentTime(time);
              }}
            />
          </div>

          <div className="space-y-6">
            <PostureMetric
              icon={Clock}
              label="Session Time"
              value={formatTime(videoData.statistics.totalDuration)}
              subtitle="Minutes analyzed"
              color="default"
            />
            <PostureMetric
              icon={CheckCircle}
              label="Good Posture"
              value={`${videoData.statistics.goodPosturePercent}%`}
              subtitle="of valid frames"
              color="good"
            />
            <PostureMetric
              icon={AlertTriangle}
              label="Poor Posture"
              value={`${videoData.statistics.poorPosturePercent}%`}
              subtitle="needs improvement"
              color="poor"
            />
            <PostureMetric
              icon={MoveVertical}
              label="Head Forward"
              value={`${videoData.statistics.headForwardCount}x`}
              subtitle={`${videoData.statistics.headForwardMinutes} min total`}
              color="warning"
            />
            <PostureMetric
              icon={AlignVerticalJustifyCenter}
              label="Back Slouching"
              value={`${videoData.statistics.backSlouchingCount}x`}
              subtitle={`${videoData.statistics.backSlouchingMinutes} min total`}
              color="warning"
            />
            <PostureMetric
              icon={UserX}
              label="No Pose Detected"
              value={`${videoData.statistics.noPoseDetectedFrames}`}
              subtitle={`frames (excluded from %)`}
              color="default"
            />

            <GitHubExport />
          </div>
        </div>

        <div className="mt-6">
          <PostureEventsList events={videoData.events} />
        </div>
      </main>
    </div>
  );
}
