export type TextureType = 
  | 'carbon-fiber'
  | 'brushed-metal'
  | 'diamond-plate'
  | 'holographic'
  | 'glass'
  | 'matte'
  | 'leather'
  | 'titanium'
  | 'gold-foil'
  | 'circuit-board'
  | 'honeycomb'
  | 'racing-stripe';

export interface TextureConfig {
  id: TextureType;
  name: string;
  description: string;
  css: string;
  unlockRequirement?: {
    type: 'level' | 'training' | 'activity' | 'achievement';
    threshold: number;
    description: string;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  preview?: string;
}

export const TEXTURES: Record<TextureType, TextureConfig> = {
  'matte': {
    id: 'matte',
    name: 'Matte',
    description: 'Clean, professional matte finish',
    css: '',
    rarity: 'common'
  },
  'carbon-fiber': {
    id: 'carbon-fiber',
    name: 'Carbon Fiber',
    description: 'High-performance racing aesthetic',
    css: `background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.1) 2px,
      rgba(0,0,0,0.1) 4px
    )`,
    rarity: 'common'
  },
  'brushed-metal': {
    id: 'brushed-metal',
    name: 'Brushed Metal',
    description: 'Industrial brushed steel texture',
    css: `background-image: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.1) 25%,
      rgba(255,255,255,0) 50%,
      rgba(255,255,255,0.1) 75%,
      rgba(255,255,255,0) 100%
    )`,
    rarity: 'uncommon',
    unlockRequirement: {
      type: 'activity',
      threshold: 50,
      description: 'Complete 50 actions in the system'
    }
  },
  'diamond-plate': {
    id: 'diamond-plate',
    name: 'Diamond Plate',
    description: 'Industrial diamond pattern',
    css: `background-image: 
      linear-gradient(30deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
      linear-gradient(150deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
      linear-gradient(30deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
      linear-gradient(150deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1));
    background-size: 20px 35px;
    background-position: 0 0, 0 0, 10px 17px, 10px 17px`,
    rarity: 'uncommon',
    unlockRequirement: {
      type: 'training',
      threshold: 3,
      description: 'Complete 3 training modules'
    }
  },
  'glass': {
    id: 'glass',
    name: 'Glass',
    description: 'Translucent glass effect with reflections',
    css: `background-image: linear-gradient(
      135deg,
      rgba(255,255,255,0.25) 0%,
      rgba(255,255,255,0.1) 25%,
      rgba(255,255,255,0) 50%,
      rgba(0,0,0,0.1) 75%,
      rgba(0,0,0,0.2) 100%
    )`,
    rarity: 'rare',
    unlockRequirement: {
      type: 'level',
      threshold: 5,
      description: 'Reach Level 5'
    }
  },
  'leather': {
    id: 'leather',
    name: 'Premium Leather',
    description: 'Luxury leather texture',
    css: `background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
    rarity: 'rare',
    unlockRequirement: {
      type: 'activity',
      threshold: 100,
      description: 'Complete 100 actions in the system'
    }
  },
  'titanium': {
    id: 'titanium',
    name: 'Titanium',
    description: 'Aerospace-grade titanium finish',
    css: `background-image: 
      radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.2) 0%, transparent 50%),
      linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)`,
    rarity: 'epic',
    unlockRequirement: {
      type: 'level',
      threshold: 10,
      description: 'Reach Level 10'
    }
  },
  'holographic': {
    id: 'holographic',
    name: 'Holographic',
    description: 'Shifting rainbow holographic effect',
    css: `background-image: linear-gradient(
      135deg,
      rgba(255,0,0,0.1) 0%,
      rgba(255,154,0,0.1) 10%,
      rgba(208,222,33,0.1) 20%,
      rgba(79,220,74,0.1) 30%,
      rgba(63,218,216,0.1) 40%,
      rgba(47,201,226,0.1) 50%,
      rgba(28,127,238,0.1) 60%,
      rgba(95,21,242,0.1) 70%,
      rgba(186,12,248,0.1) 80%,
      rgba(251,7,217,0.1) 90%,
      rgba(255,0,0,0.1) 100%
    )`,
    rarity: 'epic',
    unlockRequirement: {
      type: 'achievement',
      threshold: 1,
      description: 'Unlock the "Power User" achievement'
    }
  },
  'gold-foil': {
    id: 'gold-foil',
    name: 'Gold Foil',
    description: 'Luxurious gold foil accent',
    css: `background-image: 
      linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 50%, rgba(255,215,0,0.2) 100%),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,215,0,0.05) 2px, rgba(255,215,0,0.05) 4px)`,
    rarity: 'legendary',
    unlockRequirement: {
      type: 'level',
      threshold: 25,
      description: 'Reach Level 25'
    }
  },
  'circuit-board': {
    id: 'circuit-board',
    name: 'Circuit Board',
    description: 'Tech-inspired circuit pattern',
    css: `background-image: 
      linear-gradient(90deg, rgba(0,255,0,0.05) 1px, transparent 1px),
      linear-gradient(rgba(0,255,0,0.05) 1px, transparent 1px);
    background-size: 8px 8px`,
    rarity: 'rare',
    unlockRequirement: {
      type: 'training',
      threshold: 5,
      description: 'Complete 5 training modules'
    }
  },
  'honeycomb': {
    id: 'honeycomb',
    name: 'Honeycomb',
    description: 'Geometric honeycomb pattern',
    css: `background-image: 
      radial-gradient(circle farthest-side at 0% 50%, rgba(255,255,255,0) 23.5%, rgba(255,255,255,0.1) 24%, rgba(255,255,255,0.1) 27%, rgba(255,255,255,0) 27.5%),
      radial-gradient(circle farthest-side at 0% 50%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.05) 35.5%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 40.5%);
    background-size: 10px 20px`,
    rarity: 'uncommon',
    unlockRequirement: {
      type: 'activity',
      threshold: 25,
      description: 'Complete 25 actions in the system'
    }
  },
  'racing-stripe': {
    id: 'racing-stripe',
    name: 'Racing Stripe',
    description: 'Motorsport-inspired racing stripes',
    css: `background-image: 
      linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.15) 45%, transparent 45%, transparent 55%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.15) 60%, transparent 60%)`,
    rarity: 'legendary',
    unlockRequirement: {
      type: 'achievement',
      threshold: 1,
      description: 'Complete the "Speed Demon" achievement'
    }
  }
};

export const RARITY_COLORS: Record<TextureConfig['rarity'], { border: string; glow: string; label: string }> = {
  common: { border: 'border-gray-400', glow: '', label: 'text-gray-500' },
  uncommon: { border: 'border-green-500', glow: 'shadow-green-500/20', label: 'text-green-500' },
  rare: { border: 'border-blue-500', glow: 'shadow-blue-500/30', label: 'text-blue-500' },
  epic: { border: 'border-purple-500', glow: 'shadow-purple-500/40', label: 'text-purple-500' },
  legendary: { border: 'border-amber-500', glow: 'shadow-amber-500/50', label: 'text-amber-500' }
};

export function getUnlockedTextures(userStats: { 
  level: number; 
  trainingCompleted: number; 
  actionsCompleted: number;
  achievements: string[];
}): TextureType[] {
  return Object.entries(TEXTURES)
    .filter(([_, config]) => {
      if (!config.unlockRequirement) return true;
      
      const { type, threshold } = config.unlockRequirement;
      switch (type) {
        case 'level':
          return userStats.level >= threshold;
        case 'training':
          return userStats.trainingCompleted >= threshold;
        case 'activity':
          return userStats.actionsCompleted >= threshold;
        case 'achievement':
          return userStats.achievements.length >= threshold;
        default:
          return false;
      }
    })
    .map(([id]) => id as TextureType);
}

export function getTextureProgress(
  textureId: TextureType, 
  userStats: { level: number; trainingCompleted: number; actionsCompleted: number; achievements: string[] }
): { unlocked: boolean; progress: number; requirement?: string } {
  const texture = TEXTURES[textureId];
  
  if (!texture.unlockRequirement) {
    return { unlocked: true, progress: 100 };
  }

  const { type, threshold, description } = texture.unlockRequirement;
  let current = 0;
  
  switch (type) {
    case 'level':
      current = userStats.level;
      break;
    case 'training':
      current = userStats.trainingCompleted;
      break;
    case 'activity':
      current = userStats.actionsCompleted;
      break;
    case 'achievement':
      current = userStats.achievements.length;
      break;
  }

  const progress = Math.min(100, (current / threshold) * 100);
  return {
    unlocked: current >= threshold,
    progress,
    requirement: description
  };
}
