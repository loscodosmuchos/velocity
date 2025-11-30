import { useState } from 'react';
import { useGo } from '@refinedev/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Download, FileText, Youtube } from 'lucide-react';

export default function YouTubeCaptureP

() {
  const go = useGo();
  const [url, setUrl] = useState('');
  const [topicArea, setTopicArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const topicAreas = [
    'Procurement',
    'Talent Acquisition',
    'HR Technology',
    'Finance',
    'Project Management',
    'VMS',
    'Marketing',
    'Other'
  ];

  const handleExtract = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/youtube/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url, topicArea })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract transcript');
      }

      setResult(data);
      toast.success(data.message);
      
      // Save transcript to file in attached_assets/transcripts/
      const videoId = data.source.video_id;
      const filename = `transcript_${videoId}_${Date.now()}.txt`;
      
      // Create download link
      const blob = new Blob([data.source.transcript], { type: 'text/plain' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(downloadUrl);
      
      toast.success(`Transcript saved as ${filename}`);
      
    } catch (error: any) {
      console.error('Extract error:', error);
      toast.error(error.message || 'Failed to extract transcript');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTranscript = () => {
    if (!result?.source?.transcript) return;
    
    const blob = new Blob([result.source.transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${result.source.video_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">YouTube Transcript Capture</h1>
          <p className="text-muted-foreground mt-2">
            Extract and save YouTube video transcripts for knowledge management
          </p>
        </div>
        <Button variant="outline" onClick={() => go({ to: '/admin/knowledge-hub' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Knowledge Hub
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            Extract Transcript
          </CardTitle>
          <CardDescription>
            Enter a YouTube URL to extract the video transcript and metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">YouTube URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Supports youtube.com/watch, youtu.be, and youtube.com/embed URLs
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic Area (Optional)</Label>
            <Select value={topicArea} onValueChange={setTopicArea} disabled={loading}>
              <SelectTrigger id="topic">
                <SelectValue placeholder="Select topic area" />
              </SelectTrigger>
              <SelectContent>
                {topicAreas.map(topic => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleExtract} 
            disabled={loading || !url.trim()}
            className="w-full"
          >
            {loading ? 'Extracting...' : 'Extract Transcript'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Extraction Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Video Title</Label>
                <p className="font-medium">{result.source.title}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Channel</Label>
                <p className="font-medium">{result.source.channel}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Duration</Label>
                <p className="font-medium">{result.source.duration} seconds</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Views</Label>
                <p className="font-medium">{result.source.view_count?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Word Count</Label>
                <p className="font-medium">{result.wordCount?.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Transcript Length</Label>
                <p className="font-medium">{result.transcriptLength?.toLocaleString()} characters</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Transcript Preview</Label>
              <Textarea
                value={result.source.transcript?.substring(0, 500) + '...'}
                readOnly
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownloadTranscript} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Full Transcript
              </Button>
              <Button 
                onClick={() => go({ to: `/admin/knowledge-hub?sourceId=${result.source.id}` })}
              >
                Extract Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
