export interface DesignLensConfig {
  pageName: string;
  contrast?: number;
  accessibility?: number;
  colorCompliance?: number;
  typographyScore?: number;
  dataVisualization?: number;
}

export function getDesignLensMetrics(config: DesignLensConfig) {
  const overallScore = Math.round(
    ((config.contrast ?? 92) +
      (config.accessibility ?? 88) +
      (config.colorCompliance ?? 95) +
      (config.typographyScore ?? 90) +
      (config.dataVisualization ?? 85)) /
      5
  );

  return {
    pageName: config.pageName,
    contrast: config.contrast ?? 92,
    accessibility: config.accessibility ?? 88,
    colorCompliance: config.colorCompliance ?? 95,
    typographyScore: config.typographyScore ?? 90,
    dataVisualization: config.dataVisualization ?? 85,
    overallScore,
  };
}
