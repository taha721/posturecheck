import { useState } from 'react';
import PostureTimeline, { TimelineSegment } from '../PostureTimeline';

export default function PostureTimelineExample() {
  const [currentTime, setCurrentTime] = useState(45);

  const segments: TimelineSegment[] = [
    { start: 0, end: 30, quality: 'good' },
    { start: 30, end: 50, quality: 'warning' },
    { start: 50, end: 75, quality: 'poor' },
    { start: 75, end: 120, quality: 'good' },
  ];

  return (
    <PostureTimeline
      segments={segments}
      duration={120}
      currentTime={currentTime}
      onSeek={(time) => {
        console.log('Seeking to:', time);
        setCurrentTime(time);
      }}
    />
  );
}
