import { useState } from 'react';
import VideoPlayer, { PoseKeypoint } from '../VideoPlayer';

export default function VideoPlayerExample() {
  const [currentFrame, setCurrentFrame] = useState(0);

  const mockKeypoints: PoseKeypoint[][] = Array(100).fill(null).map(() => [
    { x: 0.5, y: 0.2, confidence: 0.9, name: 'nose' },
    { x: 0.48, y: 0.18, confidence: 0.9, name: 'left_eye' },
    { x: 0.52, y: 0.18, confidence: 0.9, name: 'right_eye' },
    { x: 0.45, y: 0.17, confidence: 0.8, name: 'left_ear' },
    { x: 0.55, y: 0.17, confidence: 0.8, name: 'right_ear' },
    { x: 0.4, y: 0.35, confidence: 0.9, name: 'left_shoulder' },
    { x: 0.6, y: 0.35, confidence: 0.9, name: 'right_shoulder' },
    { x: 0.35, y: 0.5, confidence: 0.85, name: 'left_elbow' },
    { x: 0.65, y: 0.5, confidence: 0.85, name: 'right_elbow' },
    { x: 0.3, y: 0.65, confidence: 0.8, name: 'left_wrist' },
    { x: 0.7, y: 0.65, confidence: 0.8, name: 'right_wrist' },
    { x: 0.42, y: 0.6, confidence: 0.9, name: 'left_hip' },
    { x: 0.58, y: 0.6, confidence: 0.9, name: 'right_hip' },
    { x: 0.4, y: 0.8, confidence: 0.85, name: 'left_knee' },
    { x: 0.6, y: 0.8, confidence: 0.85, name: 'right_knee' },
    { x: 0.38, y: 0.95, confidence: 0.8, name: 'left_ankle' },
    { x: 0.62, y: 0.95, confidence: 0.8, name: 'right_ankle' },
  ]);

  return (
    <VideoPlayer
      videoUrl="data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAAhtZGF0AAAA"
      keypoints={mockKeypoints}
      currentFrame={currentFrame}
      onTimeUpdate={(time) => console.log('Time:', time)}
      onFrameChange={setCurrentFrame}
    />
  );
}
