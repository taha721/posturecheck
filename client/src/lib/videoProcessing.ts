import { detectPose, analyzePosture, convertKeypointsToFormat, PostureAnalysis } from './poseDetection';
import { PoseKeypoint } from '@/components/VideoPlayer';
import { TimelineSegment } from '@/components/PostureTimeline';
import { PostureEvent } from '@/components/PostureEventsList';

export interface ProcessedVideoData {
  keypoints: PoseKeypoint[][];
  segments: TimelineSegment[];
  events: PostureEvent[];
  statistics: {
    totalDuration: number;
    goodPosturePercent: number;
    poorPosturePercent: number;
    warningPosturePercent: number;
    headForwardCount: number;
    headForwardMinutes: number;
    backSlouchingCount: number;
    backSlouchingMinutes: number;
    noPoseDetectedFrames: number;
    validFrames: number;
  };
  qualities: ('good' | 'warning' | 'poor')[];
}

export async function processVideo(
  videoElement: HTMLVideoElement,
  onProgress?: (progress: number) => void
): Promise<ProcessedVideoData> {
  const duration = videoElement.duration;
  
  if (!duration || duration === 0) {
    throw new Error('Invalid video duration');
  }
  
  const fps = 30;
  const totalFrames = Math.floor(duration * fps);
  
  const allKeypoints: PoseKeypoint[][] = [];
  const analyses: PostureAnalysis[] = [];
  
  for (let i = 0; i < totalFrames; i++) {
    const time = i / fps;
    
    if (time > duration) break;
    
    videoElement.currentTime = time;
    
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Seek timeout')), 1000);
        videoElement.onseeked = () => {
          clearTimeout(timeout);
          resolve(null);
        };
      });
    } catch (error) {
      console.warn(`Seek failed at ${time}s`);
      allKeypoints.push([]);
      analyses.push({
        quality: 'warning',
        neckAngle: 0,
        backAngle: 0,
        details: 'Unable to process frame',
        headForward: false,
        backSlouchng: false,
        noPoseDetected: true
      });
      continue;
    }
    
    try {
      const keypoints = await detectPose(videoElement);
      
      if (keypoints.length === 0) {
        allKeypoints.push([]);
        analyses.push({
          quality: 'warning',
          neckAngle: 0,
          backAngle: 0,
          details: 'No pose detected',
          headForward: false,
          backSlouchng: false,
          noPoseDetected: true
        });
      } else {
        const converted = convertKeypointsToFormat(
          keypoints, 
          videoElement.videoWidth, 
          videoElement.videoHeight
        );
        allKeypoints.push(converted);
        
        const analysis = analyzePosture(keypoints);
        analyses.push(analysis);
      }
    } catch (error) {
      console.warn(`Pose detection failed at ${time}s:`, error);
      allKeypoints.push([]);
      analyses.push({
        quality: 'warning',
        neckAngle: 0,
        backAngle: 0,
        details: 'Detection error',
        headForward: false,
        backSlouchng: false,
        noPoseDetected: true
      });
    }
    
    if (onProgress) {
      onProgress((i + 1) / totalFrames);
    }
  }
  
  const segments = generateSegments(analyses, duration, fps);
  const events = generateEvents(analyses, fps);
  const statistics = calculateStatistics(analyses, duration);
  
  return {
    keypoints: allKeypoints,
    segments,
    events,
    statistics,
    qualities: analyses.map(a => a.quality)
  };
}

function generateSegments(analyses: PostureAnalysis[], duration: number, fps: number): TimelineSegment[] {
  const segments: TimelineSegment[] = [];
  let currentQuality = analyses[0]?.quality || 'good';
  let currentStart = 0;
  
  for (let i = 1; i < analyses.length; i++) {
    if (analyses[i].quality !== currentQuality) {
      segments.push({
        start: currentStart,
        end: i / fps,
        quality: currentQuality
      });
      currentQuality = analyses[i].quality;
      currentStart = i / fps;
    }
  }
  
  segments.push({
    start: currentStart,
    end: duration,
    quality: currentQuality
  });
  
  return segments;
}

function generateEvents(analyses: PostureAnalysis[], fps: number): PostureEvent[] {
  const events: PostureEvent[] = [];
  let currentQuality = analyses[0]?.quality || 'good';
  let currentStart = 0;
  let currentDetails = analyses[0]?.details || '';
  
  for (let i = 1; i < analyses.length; i++) {
    if (analyses[i].quality !== currentQuality || analyses[i].details !== currentDetails) {
      const duration = (i - currentStart) / fps;
      
      events.push({
        timestamp: currentStart / fps,
        type: currentQuality === 'poor' ? 'poor' : 'good',
        duration,
        description: currentDetails
      });
      
      currentQuality = analyses[i].quality;
      currentStart = i;
      currentDetails = analyses[i].details;
    }
  }
  
  const duration = (analyses.length - currentStart) / fps;
  events.push({
    timestamp: currentStart / fps,
    type: currentQuality === 'poor' ? 'poor' : 'good',
    duration,
    description: currentDetails
  });
  
  return events;
}

function calculateStatistics(analyses: PostureAnalysis[], duration: number) {
  const counts = {
    good: 0,
    warning: 0,
    poor: 0
  };
  
  let noPoseDetectedFrames = 0;
  let headForwardFrames = 0;
  let backSlouchingFrames = 0;
  let headForwardOccurrences = 0;
  let backSlouchingOccurrences = 0;
  let wasHeadForward = false;
  let wasBackSlouchng = false;
  
  analyses.forEach(analysis => {
    if (analysis.noPoseDetected) {
      noPoseDetectedFrames++;
    } else {
      counts[analysis.quality]++;
    }
    
    if (analysis.headForward) {
      headForwardFrames++;
      if (!wasHeadForward) {
        headForwardOccurrences++;
        wasHeadForward = true;
      }
    } else {
      wasHeadForward = false;
    }
    
    if (analysis.backSlouchng) {
      backSlouchingFrames++;
      if (!wasBackSlouchng) {
        backSlouchingOccurrences++;
        wasBackSlouchng = true;
      }
    } else {
      wasBackSlouchng = false;
    }
  });
  
  const total = analyses.length;
  const validFrames = total - noPoseDetectedFrames;
  const fps = 30;
  
  const goodPercent = validFrames > 0 ? Math.round((counts.good / validFrames) * 100) : 0;
  const warningPercent = validFrames > 0 ? Math.round((counts.warning / validFrames) * 100) : 0;
  const poorPercent = validFrames > 0 ? Math.round((counts.poor / validFrames) * 100) : 0;
  
  return {
    totalDuration: duration,
    goodPosturePercent: goodPercent,
    warningPosturePercent: warningPercent,
    poorPosturePercent: poorPercent,
    headForwardCount: headForwardOccurrences,
    headForwardMinutes: parseFloat((headForwardFrames / fps / 60).toFixed(2)),
    backSlouchingCount: backSlouchingOccurrences,
    backSlouchingMinutes: parseFloat((backSlouchingFrames / fps / 60).toFixed(2)),
    noPoseDetectedFrames,
    validFrames
  };
}
