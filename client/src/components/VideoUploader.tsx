import { useCallback, useState } from 'react';
import { Upload, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
}

export default function VideoUploader({ onVideoSelect }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      onVideoSelect(file);
    }
  }, [onVideoSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoSelect(file);
    }
  }, [onVideoSelect]);

  return (
    <Card
      className={`p-12 border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="video-uploader"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="p-6 rounded-full bg-primary/10">
          <Upload className="w-12 h-12 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Upload Your Video</h3>
          <p className="text-muted-foreground max-w-md">
            Drag and drop a side-profile video of you sitting at your desk, or click to browse
          </p>
        </div>

        <div>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileInput}
            className="hidden"
            id="video-upload"
            data-testid="input-video-file"
          />
          <label htmlFor="video-upload">
            <Button asChild>
              <span data-testid="button-browse-video">
                <Video className="w-4 h-4 mr-2" />
                Browse Files
              </span>
            </Button>
          </label>
        </div>

        <p className="text-sm text-muted-foreground">
          Supported formats: MP4, WebM, MOV
        </p>
      </div>
    </Card>
  );
}
