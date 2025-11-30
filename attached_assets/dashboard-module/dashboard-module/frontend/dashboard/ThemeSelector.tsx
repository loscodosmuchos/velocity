import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ThemeToken } from "@shared/schema";

interface ThemeSelectorProps {
  selectedThemeId: number | undefined;
  onThemeChange: (themeId: number) => void;
  currentLayoutId?: number;
  userId?: string;
}

export function ThemeSelector({ 
  selectedThemeId, 
  onThemeChange,
  currentLayoutId,
  userId = "default-user"
}: ThemeSelectorProps) {
  const { toast } = useToast();
  
  const { data: themes = [] } = useQuery<ThemeToken[]>({
    queryKey: ['/api/dashboard/themes'],
  });

  // Mutation to persist theme to server
  const switchTheme = useMutation({
    mutationFn: async (themeId: number) => {
      if (currentLayoutId) {
        const response = await apiRequest("PUT", `/api/dashboard/layouts/${currentLayoutId}`, {
          themeId,
        });
        return await response.json();
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/layouts'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Theme Switch Failed",
        description: error.message || "Failed to save theme preference",
        variant: "destructive",
      });
    },
  });

  const handleThemeChange = (value: string) => {
    const themeId = parseInt(value);
    onThemeChange(themeId);
    
    // Persist to server if we have a layout to attach it to
    if (currentLayoutId) {
      switchTheme.mutate(themeId);
    }
  };

  return (
    <Select
      value={selectedThemeId?.toString()}
      onValueChange={handleThemeChange}
    >
      <SelectTrigger className="w-48" data-testid="select-theme">
        <Palette className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme) => (
          <SelectItem 
            key={theme.id} 
            value={theme.id!.toString()}
            data-testid={`theme-option-${theme.id}`}
          >
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
