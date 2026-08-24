import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';

export interface PostureAnalysis {
  quality: 'good' | 'warning' | 'poor';
  neckAngle: number;
  backAngle: number;
  details: string;
  headForward: boolean;
  backSlouchng: boolean;
  noPoseDetected: boolean;
}

let detector: poseDetection.PoseDetector | null = null;

export async function initializePoseDetector() {
  if (detector) return detector;
  
  await tf.ready();
  await tf.setBackend('webgl');
  
  const model = poseDetection.SupportedModels.MoveNet;
  detector = await poseDetection.createDetector(model, {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  });
  
  return detector;
}

export async function detectPose(video: HTMLVideoElement) {
  if (!detector) {
    detector = await initializePoseDetector();
  }
  
  const poses = await detector.estimatePoses(video);
  return poses[0]?.keypoints || [];
}

function calculateAngle(p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }): number {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180 / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

export function analyzePosture(keypoints: poseDetection.Keypoint[]): PostureAnalysis {
  const getPoint = (name: string) => keypoints.find(kp => kp.name === name);
  
  const nose = getPoint('nose');
  const leftShoulder = getPoint('left_shoulder');
  const rightShoulder = getPoint('right_shoulder');
  const leftHip = getPoint('left_hip');
  const rightHip = getPoint('right_hip');
  const leftEar = getPoint('left_ear');
  const rightEar = getPoint('right_ear');
  
  const MIN_CONFIDENCE = 0.3;
  
  if (!nose || !nose.score || nose.score < MIN_CONFIDENCE || 
      !leftShoulder || !leftShoulder.score || leftShoulder.score < MIN_CONFIDENCE || 
      !rightShoulder || !rightShoulder.score || rightShoulder.score < MIN_CONFIDENCE || 
      !leftHip || !leftHip.score || leftHip.score < MIN_CONFIDENCE || 
      !rightHip || !rightHip.score || rightHip.score < MIN_CONFIDENCE) {
    return {
      quality: 'warning',
      neckAngle: 0,
      backAngle: 0,
      details: 'Unable to detect all key points',
      headForward: false,
      backSlouchng: false,
      noPoseDetected: true
    };
  }
  
  const shoulder = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2
  };
  
  const hip = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2
  };
  
  const head = leftEar && rightEar && leftEar.score && rightEar.score && 
                leftEar.score >= MIN_CONFIDENCE && rightEar.score >= MIN_CONFIDENCE
    ? { x: (leftEar.x + rightEar.x) / 2, y: (leftEar.y + rightEar.y) / 2 }
    : nose;
  
  const shoulderHipDistance = Math.sqrt(
    Math.pow(shoulder.x - hip.x, 2) + Math.pow(shoulder.y - hip.y, 2)
  );
  
  const verticalOffset = shoulderHipDistance * 0.3;
  const vertical = { x: shoulder.x, y: shoulder.y - verticalOffset };
  
  const neckAngle = calculateAngle(vertical, shoulder, head);
  const backAngle = calculateAngle(vertical, shoulder, hip);
  
  let quality: 'good' | 'warning' | 'poor' = 'good';
  let details = 'Good posture maintained';
  const headForward = neckAngle > 20;
  const backSlouchng = backAngle > 15;
  
  if (neckAngle > 30 || backAngle > 25) {
    quality = 'poor';
    if (neckAngle > 30 && backAngle > 25) {
      details = 'Head forward and back slouching';
    } else if (neckAngle > 30) {
      details = 'Head leaning forward - poor posture';
    } else {
      details = 'Back slouching detected';
    }
  } else if (neckAngle > 20 || backAngle > 15) {
    quality = 'warning';
    if (headForward && backSlouchng) {
      details = 'Slight head forward and back slouching';
    } else if (headForward) {
      details = 'Head slightly forward';
    } else {
      details = 'Back slightly slouched';
    }
  }
  
  return {
    quality,
    neckAngle,
    backAngle,
    details,
    headForward,
    backSlouchng,
    noPoseDetected: false
  };
}

export function convertKeypointsToFormat(keypoints: poseDetection.Keypoint[], videoWidth: number, videoHeight: number) {
  return keypoints.map(kp => ({
    x: kp.x / videoWidth,
    y: kp.y / videoHeight,
    confidence: kp.score || 0,
    name: kp.name || ''
  }));
}
