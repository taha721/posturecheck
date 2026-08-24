import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PostureMetricProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  color?: 'good' | 'warning' | 'poor' | 'default';
}

export default function PostureMetric({ 
  icon: Icon, 
  label, 
  value, 
  subtitle,
  color = 'default' 
}: PostureMetricProps) {
  const colorClasses = {
    good: 'text-posture-good',
    warning: 'text-posture-warning',
    poor: 'text-posture-poor',
    default: 'text-foreground'
  };

  return (
    <Card className="p-6" data-testid={`metric-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-accent">
          <Icon className="w-6 h-6 text-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-4xl font-bold tabular-nums ${colorClasses[color]}`} data-testid={`value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
