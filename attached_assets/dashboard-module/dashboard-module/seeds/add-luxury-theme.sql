-- Add Luxury Gold Dark theme to existing dashboard installation
-- Run this after installing the dashboard module to add the fourth theme

INSERT INTO theme_tokens (name, description, tokens, is_public)
VALUES (
  'Luxury Gold Dark',
  'Sophisticated dark theme with gold accents and Damascus steel texture',
  '{
    "colors": {
      "primary": {"h": 43, "s": 100, "l": 62},
      "secondary": {"h": 30, "s": 20, "l": 40},
      "accent": {"h": 43, "s": 100, "l": 62},
      "neutral": {"h": 20, "s": 12, "l": 13},
      "success": {"h": 142, "s": 71, "l": 45},
      "warning": {"h": 43, "s": 100, "l": 62},
      "error": {"h": 0, "s": 84, "l": 60}
    },
    "spacing": {
      "base": 4,
      "scale": 1.618
    },
    "typography": {
      "fontFamily": "Inter, sans-serif",
      "scale": "golden-ratio",
      "baseSize": 15
    },
    "borderRadius": {
      "sm": 6,
      "md": 10,
      "lg": 14
    }
  }'::jsonb,
  true
);
