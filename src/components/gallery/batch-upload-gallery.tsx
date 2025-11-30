/**
 * BATCH UPLOAD GALLERY
 * Reusable gallery module for portals with batch upload capability
 * 
 * Use in: Contractor Portal, Vendor Portal, Employee Portal
 * Features:
 * - Single file OR batch upload (drag & drop multiple)
 * - Thumbnail grid view
 * - File type detection
 * - Share/workspace posting
 * - AI analysis integration
 */

import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Upload, FileText, Image, Video, FileSpreadsheet, File,
  X, Check, Trash2, Download, Share2, Eye, FolderOpen,
  Grid, List, Search, Filter, MoreHorizontal, Loader2,
  Cloud, CloudUpload, Users, Lock, Globe, Building2,
  CheckCircle2, AlertCircle, Clock, Sparkles, Brain
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface GalleryFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'spreadsheet' | 'document' | 'other';
  mimeType: string;
  size: number;
  url?: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress?: number;
  visibility: 'private' | 'shared' | 'workspace' | 'public';
  workspace?: string;
  tags?: string[];
  aiAnalyzed?: boolean;
}

export interface BatchUploadGalleryProps {
  portalType: 'contractor' | 'vendor' | 'employee' | 'admin';
  userId?: number;
  workspaceId?: string;
  allowedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  showAIActions?: boolean;
  onUpload?: (files: GalleryFile[]) => void;
  onDelete?: (fileId: string) => void;
  onShare?: (fileId: string, visibility: GalleryFile['visibility']) => void;
}

const FILE_TYPE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  image: Image,
  video: Video,
  spreadsheet: FileSpreadsheet,
  document: FileText,
  other: File,
};

const FILE_TYPE_COLORS: Record<string, string> = {
  pdf: 'bg-red-500/20 text-red-400 border-red-500/30',
  image: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  video: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  spreadsheet: 'bg-green-500/20 text-green-400 border-green-500/30',
  document: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  other: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const VISIBILITY_OPTIONS = [
  { value: 'private', label: 'Private', icon: Lock, description: 'Only you can see' },
  { value: 'shared', label: 'Shared', icon: Users, description: 'Share with specific people' },
  { value: 'workspace', label: 'Workspace', icon: Building2, description: 'Visible to workspace members' },
  { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can view' },
];

function detectFileType(file: File): GalleryFile['type'] {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.includes('pdf')) return 'pdf';
  if (mime.includes('spreadsheet') || mime.includes('excel') || name.endsWith('.xlsx') || name.endsWith('.csv')) return 'spreadsheet';
  if (mime.includes('document') || mime.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return 'document';
  return 'other';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileCard({ 
  file, 
  isSelected,
  onSelect,
  onView,
  onDelete,
  onShare 
}: { 
  file: GalleryFile;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onView: (file: GalleryFile) => void;
  onDelete: (id: string) => void;
  onShare: (file: GalleryFile) => void;
}) {
  const Icon = FILE_TYPE_ICONS[file.type] || File;
  const colorClass = FILE_TYPE_COLORS[file.type] || FILE_TYPE_COLORS.other;
  
  return (
    <Card className={cn(
      "relative group cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-slate-600",
      isSelected && "ring-2 ring-blue-500",
      file.status === 'uploading' && "opacity-70"
    )}>
      <div 
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.stopPropagation(); onSelect(file.id); }}
      >
        <Checkbox checked={isSelected} />
      </div>
      
      <CardContent className="p-3" onClick={() => onView(file)}>
        <div className="aspect-square rounded-lg bg-slate-800/50 flex items-center justify-center mb-3 relative overflow-hidden">
          {file.thumbnailUrl ? (
            <img 
              src={file.thumbnailUrl} 
              alt={file.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon className={cn("h-12 w-12", FILE_TYPE_COLORS[file.type]?.split(' ')[1])} />
          )}
          
          {file.status === 'uploading' && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400 mx-auto mb-2" />
                <Progress value={file.progress} className="w-20 h-1" />
                <span className="text-xs text-slate-400 mt-1">{file.progress}%</span>
              </div>
            </div>
          )}
          
          {file.aiAnalyzed && (
            <Badge className="absolute top-2 right-2 bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
              <Brain className="h-3 w-3 mr-1" />
              AI
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-200 truncate" title={file.name}>
            {file.name}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{formatFileSize(file.size)}</span>
            <Badge variant="outline" className={cn("text-xs", colorClass)}>
              {file.type}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onView(file); }}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onShare(file); }}>
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BatchUploadGallery({
  portalType,
  userId,
  workspaceId,
  allowedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xlsx', '.csv'],
  maxFileSize = 10 * 1024 * 1024,
  maxFiles = 20,
  showAIActions = true,
  onUpload,
  onDelete,
  onShare,
}: BatchUploadGalleryProps) {
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadVisibility, setUploadVisibility] = useState<GalleryFile['visibility']>('private');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const filteredFiles = files.filter(f => {
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType !== 'all' && f.type !== filterType) return false;
    return true;
  });
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const processFiles = useCallback((fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    
    if (files.length + filesArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const validFiles = filesArray.filter(file => {
      if (file.size > maxFileSize) {
        toast.error(`${file.name} exceeds ${formatFileSize(maxFileSize)} limit`);
        return false;
      }
      return true;
    });
    
    setPendingFiles(validFiles);
    setIsUploadDialogOpen(true);
  }, [files.length, maxFiles, maxFileSize]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);
  
  const handleConfirmUpload = useCallback(() => {
    const newFiles: GalleryFile[] = pendingFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      type: detectFileType(file),
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId?.toString() || 'current-user',
      status: 'uploading' as const,
      progress: 0,
      visibility: uploadVisibility,
      workspace: workspaceId,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setIsUploadDialogOpen(false);
    setPendingFiles([]);
    
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id && f.status === 'uploading') {
            const newProgress = (f.progress || 0) + Math.random() * 20;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, status: 'ready' as const, progress: 100 };
            }
            return { ...f, progress: Math.min(newProgress, 95) };
          }
          return f;
        }));
      }, 200 + index * 100);
    });
    
    toast.success(`Uploading ${pendingFiles.length} file(s)...`);
    onUpload?.(newFiles);
  }, [pendingFiles, uploadVisibility, userId, workspaceId, onUpload]);
  
  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  
  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredFiles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFiles.map(f => f.id)));
    }
  }, [filteredFiles, selectedIds.size]);
  
  const handleDeleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.info("File deleted");
    onDelete?.(id);
  }, [onDelete]);
  
  const handleBulkDelete = useCallback(() => {
    setFiles(prev => prev.filter(f => !selectedIds.has(f.id)));
    selectedIds.forEach(id => onDelete?.(id));
    setSelectedIds(new Set());
    toast.info(`${selectedIds.size} files deleted`);
  }, [selectedIds, onDelete]);
  
  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
          isDragging 
            ? "border-blue-500 bg-blue-500/10" 
            : "border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <CloudUpload className={cn(
          "h-12 w-12 mx-auto mb-4 transition-colors",
          isDragging ? "text-blue-400" : "text-slate-500"
        )} />
        
        <p className="text-slate-300 mb-2">
          Drag & drop files here, or{' '}
          <button 
            className="text-blue-400 hover:underline"
            onClick={() => fileInputRef.current?.click()}
          >
            browse
          </button>
        </p>
        
        <p className="text-xs text-slate-500">
          Upload single or multiple files (up to {maxFiles} files, max {formatFileSize(maxFileSize)} each)
        </p>
        
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline" className="bg-slate-800 border-slate-700 text-xs">
            <Image className="h-3 w-3 mr-1" />
            Images
          </Badge>
          <Badge variant="outline" className="bg-slate-800 border-slate-700 text-xs">
            <FileText className="h-3 w-3 mr-1" />
            PDFs
          </Badge>
          <Badge variant="outline" className="bg-slate-800 border-slate-700 text-xs">
            <FileSpreadsheet className="h-3 w-3 mr-1" />
            Spreadsheets
          </Badge>
          <Badge variant="outline" className="bg-slate-800 border-slate-700 text-xs">
            <File className="h-3 w-3 mr-1" />
            Documents
          </Badge>
        </div>
      </div>
      
      {files.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search files..."
                  className="pl-9 bg-slate-800 border-slate-700 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDFs</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border border-slate-700 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 rounded-r-none", viewMode === 'grid' && "bg-slate-700")}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 rounded-l-none", viewMode === 'list' && "bg-slate-700")}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedIds.size > 0 && (
                <>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {selectedIds.size} selected
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedIds.size === filteredFiles.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
          
          <div className={cn(
            "gap-4",
            viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
              : "space-y-2"
          )}>
            {filteredFiles.map(file => (
              <FileCard
                key={file.id}
                file={file}
                isSelected={selectedIds.has(file.id)}
                onSelect={handleSelect}
                onView={() => {}}
                onDelete={handleDeleteFile}
                onShare={() => {}}
              />
            ))}
          </div>
        </>
      )}
      
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              Upload {pendingFiles.length} File{pendingFiles.length > 1 ? 's' : ''}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Visibility</Label>
              <div className="grid grid-cols-2 gap-2">
                {VISIBILITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setUploadVisibility(opt.value as GalleryFile['visibility'])}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                      uploadVisibility === opt.value
                        ? "bg-blue-600/20 border-blue-500/50 text-blue-200"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    )}
                  >
                    <opt.icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs opacity-70">{opt.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <Separator className="bg-slate-700" />
            
            <div className="space-y-2">
              <Label className="text-slate-300">Files to Upload</Label>
              <ScrollArea className="h-40 rounded-md border border-slate-700 p-2">
                <div className="space-y-2">
                  {pendingFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-slate-800">
                      {React.createElement(FILE_TYPE_ICONS[detectFileType(file)] || File, {
                        className: "h-5 w-5 text-slate-400"
                      })}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-500 hover:text-red-400"
                        onClick={() => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleConfirmUpload}
              disabled={pendingFiles.length === 0}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload {pendingFiles.length} File{pendingFiles.length > 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
