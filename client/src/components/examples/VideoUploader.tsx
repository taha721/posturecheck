import VideoUploader from '../VideoUploader';

export default function VideoUploaderExample() {
  return (
    <VideoUploader
      onVideoSelect={(file) => console.log('Video selected:', file.name)}
    />
  );
}
