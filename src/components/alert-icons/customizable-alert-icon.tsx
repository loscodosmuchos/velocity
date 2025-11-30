import { useNavigate } from 'react-router';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { AlertIconConfig, SIZE_CONFIG, CornerBadgeConfig, CornerPosition, IconStyleConfig } from './types';
import { TEXTURES, TextureType } from './textures';

interface CustomizableAlertIconProps {
  config: AlertIconConfig;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const BORDER_RADIUS_MAP = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full'
};

const CornerBadge = ({ 
  config, 
  position, 
  sizeConfig 
}: { 
  config: CornerBadgeConfig; 
  position: CornerPosition;
  sizeConfig: typeof SIZE_CONFIG['md'];
}) => {
  if (!config.enabled) return null;

  const positionClasses: Record<CornerPosition, string> = {
    'top-left': '-top-1 -left-1',
    'top-right': '-top-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
    'bottom-right': '-bottom-1 -right-1'
  };

  const IconComponent = config.icon;

  return (
    <div 
      className={cn(
        'absolute rounded-full p-0.5 flex items-center justify-center z-10 shadow-md',
        positionClasses[position],
        config.backgroundColor || 'bg-white/90',
        config.animate && 'animate-bounce',
        config.pulse && 'animate-pulse',
        config.glow && 'ring-2 ring-white/50'
      )}
      style={config.glow ? { boxShadow: `0 0 8px 2px ${config.iconColor || 'rgba(255,255,255,0.5)'}` } : undefined}
    >
      {IconComponent && (
        <IconComponent 
          className={sizeConfig.badge} 
          style={{ color: config.iconColor || config.textColor }}
        />
      )}
      {config.content && !IconComponent && (
        <span 
          className={cn(sizeConfig.text, 'font-bold px-0.5')}
          style={{ color: config.textColor }}
        >
          {config.content}
        </span>
      )}
    </div>
  );
};

const CenterIcon = ({
  Icon,
  style,
  sizeConfig,
  defaultColor
}: {
  Icon: any;
  style?: IconStyleConfig;
  sizeConfig: typeof SIZE_CONFIG['md'];
  defaultColor?: string;
}) => {
  const iconSizeMap = {
    sm: 'h-4 w-4',
    md: sizeConfig.icon,
    lg: 'h-7 w-7'
  };

  const iconSize = style?.size ? iconSizeMap[style.size] : sizeConfig.icon;

  return (
    <div 
      className={cn(
        'flex items-center justify-center',
        style?.backgroundColor && 'p-1.5 rounded-lg',
        style?.animate && 'animate-pulse',
        style?.glow && 'relative'
      )}
      style={{
        backgroundColor: style?.backgroundColor,
        ...(style?.glow && style?.glowColor ? {
          boxShadow: `0 0 12px 4px ${style.glowColor}`
        } : {})
      }}
    >
      <Icon 
        className={iconSize}
        style={{ color: style?.color || defaultColor }}
      />
    </div>
  );
};

export function CustomizableAlertIcon({ 
  config, 
  onClick, 
  className,
  disabled = false
}: CustomizableAlertIconProps) {
  const navigate = useNavigate();
  const size = config.size || 'md';
  const sizeConfig = SIZE_CONFIG[size];
  const IconComponent = config.centerIcon;
  const borderRadius = BORDER_RADIUS_MAP[config.borderRadius || 'xl'];

  const texture = config.texture ? TEXTURES[config.texture] : null;

  const handleClick = () => {
    if (disabled) return;
    
    if (onClick) {
      onClick();
    } else if (config.navigation?.path) {
      const path = config.navigation.params 
        ? Object.entries(config.navigation.params).reduce(
            (p, [key, value]) => p.replace(`:${key}`, value),
            config.navigation.path
          )
        : config.navigation.path;
      navigate(path);
    }
  };

  const isClickable = config.clickable !== false && (onClick || config.navigation?.path);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            onClick={handleClick}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(e) => {
              if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                handleClick();
              }
            }}
            className={cn(
              'relative border-2 shadow-lg transition-all duration-200',
              sizeConfig.cube,
              borderRadius,
              config.theme.background,
              config.theme.border,
              config.theme.glow,
              isClickable && !disabled && [
                'cursor-pointer',
                'hover:scale-110 hover:shadow-2xl',
                config.theme.backgroundHover
              ],
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            style={texture?.css ? { ...parseTextureCSS(texture.css) } : undefined}
            data-alert-id={config.id}
            data-alert-category={config.category}
            data-alert-severity={config.severity}
            data-alert-texture={config.texture}
          >
            {texture && (
              <div 
                className={cn('absolute inset-0 pointer-events-none', borderRadius)}
                style={parseTextureCSS(texture.css)}
              />
            )}

            <div className={cn(
              'absolute inset-0 flex flex-col items-center justify-center',
              config.theme.text
            )}>
              <CenterIcon 
                Icon={IconComponent}
                style={config.centerIconStyle}
                sizeConfig={sizeConfig}
              />
              
              {config.centerContent && (
                <div className={cn(
                  'font-bold truncate max-w-full bg-black/20 rounded mt-0.5 px-1.5 py-0.5',
                  sizeConfig.text
                )}>
                  {config.centerContent}
                </div>
              )}
            </div>

            {Object.entries(config.corners).map(([position, badgeConfig]) => (
              badgeConfig && (
                <CornerBadge 
                  key={position}
                  config={badgeConfig}
                  position={position as CornerPosition}
                  sizeConfig={sizeConfig}
                />
              )
            ))}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="max-w-md p-0 bg-white border-2 shadow-2xl rounded-lg overflow-hidden"
          sideOffset={8}
        >
          <div className={cn(
            'p-3 flex items-center justify-between',
            config.theme.background,
            config.theme.text
          )}>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{config.tooltip.title}</h4>
                <p className="text-xs opacity-90">{config.category.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold uppercase">
                {config.severity}
              </div>
              {config.texture && (
                <div className="text-[10px] opacity-75">
                  {TEXTURES[config.texture]?.name}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {config.tooltip.description}
            </p>

            {config.tooltip.actionLabel && isClickable && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-3 rounded-lg">
                <p className="text-xs font-medium text-blue-900">
                  Click to {config.tooltip.actionLabel}
                </p>
              </div>
            )}

            {config.tooltip.showTimestamp && (
              <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2 mt-2">
                <span className="font-medium">
                  {new Date().toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })}
                </span>
                <span className="text-gray-400">
                  Alert ID: {config.id}
                </span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function parseTextureCSS(cssString: string): React.CSSProperties {
  if (!cssString) return {};
  
  const properties: React.CSSProperties = {};
  const declarations = cssString.split(';').filter(Boolean);
  
  declarations.forEach(declaration => {
    const colonIndex = declaration.indexOf(':');
    if (colonIndex === -1) return;
    
    const property = declaration.slice(0, colonIndex).trim();
    const value = declaration.slice(colonIndex + 1).trim();
    
    const camelCase = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    (properties as any)[camelCase] = value;
  });
  
  return properties;
}

export function AlertIconGroup({ 
  configs, 
  className,
  emptyMessage = 'No alerts'
}: { 
  configs: AlertIconConfig[];
  className?: string;
  emptyMessage?: string;
}) {
  if (configs.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className={cn(
      'flex items-center gap-2.5 flex-wrap bg-gradient-to-r from-slate-50/50 to-gray-50/50 p-2 rounded-lg border border-slate-200',
      className
    )}>
      {configs.map(config => (
        <CustomizableAlertIcon key={config.id} config={config} />
      ))}
    </div>
  );
}

export function AlertIconPreview({
  texture,
  severity,
  locked = false,
  onSelect
}: {
  texture: TextureType;
  severity: 'critical' | 'warning' | 'info' | 'success' | 'neutral';
  locked?: boolean;
  onSelect?: () => void;
}) {
  const textureConfig = TEXTURES[texture];
  const { SEVERITY_THEMES } = require('./types');
  const theme = SEVERITY_THEMES[severity];
  
  return (
    <div 
      className={cn(
        'relative w-16 h-16 rounded-xl border-2 shadow-lg transition-all duration-200',
        theme.background,
        theme.border,
        locked ? 'opacity-40 grayscale' : 'cursor-pointer hover:scale-110'
      )}
      style={textureConfig?.css ? parseTextureCSS(textureConfig.css) : undefined}
      onClick={locked ? undefined : onSelect}
    >
      {textureConfig && (
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={parseTextureCSS(textureConfig.css)}
        />
      )}
      <div className={cn(
        'absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80'
      )}>
        {textureConfig?.name}
      </div>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
          <span className="text-white text-lg">🔒</span>
        </div>
      )}
    </div>
  );
}
