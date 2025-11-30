import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette } from "lucide-react";
import type { ThemeToken } from "../../types/dashboard";

interface ThemeSelectorProps {
  selectedThemeId: number | undefined;
  onThemeChange: (themeId: number) => void;
  currentLayoutId?: number;
}

export function ThemeSelector({ 
  selectedThemeId, 
  onThemeChange,
}: ThemeSelectorProps) {
  const { data: themes = [] } = useQuery<ThemeToken[]>({
    queryKey: ['dashboard', 'themes'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/themes');
      if (!response.ok) throw new Error('Failed to fetch themes');
      return response.json();
    },
  });

  const handleThemeChange = (value: string) => {
    const themeId = parseInt(value);
    onThemeChange(themeId);
  };

  return (
    <Select
      value={selectedThemeId?.toString()}
      onValueChange={handleThemeChange}
    >
      <SelectTrigger className="w-48">
        <Palette className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme: ThemeToken) => (
          <SelectItem 
            key={theme.id} 
            value={theme.id!.toString()}
          >
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
