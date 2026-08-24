import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Github, ExternalLink, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface GitHubUser {
  login: string;
  avatarUrl: string;
}

interface ExportResult {
  repoUrl: string;
  filesPushed: number;
  errors?: string[];
}

export default function GitHubExport() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [repoName, setRepoName] = useState('posturecheck');
  const [description, setDescription] = useState('PostureCheck - AI posture analysis app');
  const [isPrivate, setIsPrivate] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/github/user')
      .then(r => r.json())
      .then(data => {
        if (data.login) setUser(data);
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/github/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoName, description, isPrivate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Export failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loadingUser) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-6">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Connecting to GitHub...</span>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-6">
          <AlertTriangle className="w-4 h-4 text-posture-warning" />
          <span className="text-sm text-muted-foreground">GitHub connection unavailable.</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="github-export-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Github className="w-5 h-5" />
          Export to GitHub
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">@{user.login}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {result ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-md bg-posture-good/10">
              <CheckCircle className="w-5 h-5 text-posture-good mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-posture-good">Exported successfully</p>
                <p className="text-xs text-muted-foreground">{result.filesPushed} files pushed</p>
              </div>
            </div>
            {result.errors && result.errors.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {result.errors.length} file(s) skipped (binary or too large)
              </p>
            )}
            <Button asChild className="w-full gap-2" data-testid="button-view-repo">
              <a href={result.repoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                View on GitHub
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setResult(null)}
              data-testid="button-export-again"
            >
              Export again
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="repo-name">Repository name</Label>
              <Input
                id="repo-name"
                value={repoName}
                onChange={e => setRepoName(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                placeholder="posturecheck"
                data-testid="input-repo-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-description">Description</Label>
              <Input
                id="repo-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional description"
                data-testid="input-repo-description"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="private-toggle" className="text-sm">Private repository</Label>
              <Switch
                id="private-toggle"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                data-testid="toggle-private"
              />
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-posture-poor/10">
                <AlertTriangle className="w-4 h-4 text-posture-poor mt-0.5 shrink-0" />
                <p className="text-xs text-posture-poor">{error}</p>
              </div>
            )}
            <Button
              className="w-full gap-2"
              onClick={handleExport}
              disabled={exporting || !repoName}
              data-testid="button-export-github"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Github className="w-4 h-4" />
                  Push to GitHub
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
