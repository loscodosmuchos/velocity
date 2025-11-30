import { useState, useEffect } from 'react';
import { useGo } from '@refinedev/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Youtube, 
  FileText, 
  Tags, 
  BookOpen, 
  Search,
  Plus,
  ExternalLink 
} from 'lucide-react';

export default function KnowledgeHubPage() {
  const go = useGo();
  const [sources, setSources] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [sourcesRes, insightsRes, tagsRes, collectionsRes] = await Promise.all([
        fetch('http://localhost:3001/api/youtube/sources', { headers }),
        fetch('http://localhost:3001/api/knowledge/insights', { headers }),
        fetch('http://localhost:3001/api/knowledge/tags', { headers }),
        fetch('http://localhost:3001/api/knowledge/collections', { headers })
      ]);

      const [sourcesData, insightsData, tagsData, collectionsData] = await Promise.all([
        sourcesRes.json(),
        insightsRes.json(),
        tagsRes.json(),
        collectionsRes.json()
      ]);

      setSources(sourcesData);
      setInsights(insightsData);
      setTags(tagsData);
      setCollections(collectionsData);
    } catch (error) {
      console.error('Load data error:', error);
      toast.error('Failed to load knowledge data');
    } finally {
      setLoading(false);
    }
  };

  const filteredSources = sources.filter(s => 
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.channel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.topic_area?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInsights = insights.filter(i =>
    i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.topic_area?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Management Hub</h1>
          <p className="text-muted-foreground mt-2">
            Organize and retrieve insights from YouTube transcripts and other sources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go({ to: '/admin' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Admin Hub
          </Button>
          <Button onClick={() => go({ to: '/admin/youtube-capture' })}>
            <Youtube className="mr-2 h-4 w-4" />
            Capture Transcript
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-500" />
              YouTube Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sources.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Videos transcribed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{insights.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Extracted insights
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Tags className="h-4 w-4 text-green-500" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tags.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Knowledge tags
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{collections.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Curated collections
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="sources" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sources">Sources ({sources.length})</TabsTrigger>
          <TabsTrigger value="insights">Insights ({insights.length})</TabsTrigger>
          <TabsTrigger value="tags">Tags ({tags.length})</TabsTrigger>
          <TabsTrigger value="collections">Collections ({collections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          {loading ? (
            <Card><CardContent className="p-6">Loading sources...</CardContent></Card>
          ) : filteredSources.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Youtube className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No YouTube sources yet</p>
                <Button 
                  className="mt-4" 
                  onClick={() => go({ to: '/admin/youtube-capture' })}
                >
                  Capture First Transcript
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSources.map((source) => (
                <Card key={source.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{source.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {source.channel} • {source.duration} sec • {source.view_count?.toLocaleString()} views
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{source.topic_area || 'General'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {source.transcript?.substring(0, 200)}...
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(source.url, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Watch Video
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          const blob = new Blob([source.transcript], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `transcript_${source.video_id}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Download Transcript
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {loading ? (
            <Card><CardContent className="p-6">Loading insights...</CardContent></Card>
          ) : filteredInsights.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No insights extracted yet. Extract insights from transcripts to populate this section.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredInsights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex gap-2">
                        {insight.insight_type && (
                          <Badge variant="secondary">{insight.insight_type}</Badge>
                        )}
                        <Badge variant={insight.confidence === 'High' ? 'default' : 'outline'}>
                          {insight.confidence || 'Medium'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{insight.content}</p>
                    {insight.key_quote && (
                      <blockquote className="border-l-4 border-primary pl-4 italic text-sm text-muted-foreground">
                        "{insight.key_quote}"
                      </blockquote>
                    )}
                    {insight.topic_area && (
                      <Badge variant="outline">{insight.topic_area}</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          {loading ? (
            <Card><CardContent className="p-6">Loading tags...</CardContent></Card>
          ) : tags.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No tags created yet
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="px-3 py-1">
                      {tag.tag_name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({tag.usage_count})
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          {loading ? (
            <Card><CardContent className="p-6">Loading collections...</CardContent></Card>
          ) : collections.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No synthesis collections created yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {collections.map((collection) => (
                <Card key={collection.id}>
                  <CardHeader>
                    <CardTitle>{collection.title}</CardTitle>
                    <CardDescription>{collection.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {collection.collection_type && (
                      <Badge>{collection.collection_type}</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
