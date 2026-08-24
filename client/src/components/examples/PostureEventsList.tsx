import PostureEventsList, { PostureEvent } from '../PostureEventsList';

export default function PostureEventsListExample() {
  const events: PostureEvent[] = [
    { timestamp: 0, type: 'good', duration: 125, description: 'Excellent posture maintained' },
    { timestamp: 125, type: 'poor', duration: 45, description: 'Head leaning forward detected' },
    { timestamp: 170, type: 'good', duration: 85, description: 'Posture corrected' },
    { timestamp: 255, type: 'poor', duration: 30, description: 'Slouching detected' },
    { timestamp: 285, type: 'good', duration: 95, description: 'Good alignment restored' },
  ];

  return <PostureEventsList events={events} />;
}
