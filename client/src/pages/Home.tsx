import { useState } from 'react';
import { useLocation } from 'wouter';
import VideoUploader from '@/components/VideoUploader';
import InstructionsCard from '@/components/InstructionsCard';
import ThemeToggle from '@/components/ThemeToggle';
import GitHubExport from '@/components/GitHubExport';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setLocation] = useLocation();

  const handleVideoSelect = (file: File) => {
    console.log('Video selected:', file.name);
    setSelectedFile(file);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      const videoUrl = URL.createObjectURL(selectedFile);
      sessionStorage.setItem('videoUrl', videoUrl);
      sessionStorage.setItem('videoName', selectedFile.name);
      setLocation('/analysis');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">PostureCheck</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Analyze Your Sitting Posture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload a side-profile video and get real-time posture analysis with visual feedback.
              See exactly when your posture changes with green and red skeletal tracking.
            </p>
          </div>

          <InstructionsCard />

          <div className="max-w-2xl mx-auto">
            <VideoUploader onVideoSelect={handleVideoSelect} />
            {selectedFile && (
              <div className="text-center mt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
                <Button 
                  onClick={handleAnalyze}
                  size="lg"
                  data-testid="button-analyze-video"
                >
                  Analyze Posture
                </Button>
              </div>
            )}
          </div>

          <div className="max-w-md mx-auto">
            <GitHubExport />
          </div>
        </div>
      </main>
    </div>
  );
}
