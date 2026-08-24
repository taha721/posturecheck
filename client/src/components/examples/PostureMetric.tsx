import PostureMetric from '../PostureMetric';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PostureMetricExample() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <PostureMetric
        icon={Clock}
        label="Session Time"
        value="24:35"
        subtitle="Minutes analyzed"
        color="default"
      />
      <PostureMetric
        icon={CheckCircle}
        label="Good Posture"
        value="72%"
        subtitle="of total time"
        color="good"
      />
      <PostureMetric
        icon={AlertTriangle}
        label="Poor Posture"
        value="28%"
        subtitle="needs improvement"
        color="poor"
      />
    </div>
  );
}
