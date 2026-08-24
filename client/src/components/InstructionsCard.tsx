import { Card } from '@/components/ui/card';
import { Camera, Video, Upload } from 'lucide-react';

export default function InstructionsCard() {
  const steps = [
    {
      icon: Camera,
      title: 'Position Your Camera',
      description: 'Set up your camera to capture a side-profile view of you sitting at your desk',
    },
    {
      icon: Video,
      title: 'Record Your Session',
      description: 'Record yourself working for at least 30 seconds to get meaningful posture data',
    },
    {
      icon: Upload,
      title: 'Upload & Analyze',
      description: 'Upload your video and get instant feedback with visual posture tracking',
    },
  ];

  return (
    <Card className="p-8" data-testid="instructions-card">
      <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex flex-col items-start gap-3" data-testid={`step-${index + 1}`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  {index + 1}
                </div>
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
