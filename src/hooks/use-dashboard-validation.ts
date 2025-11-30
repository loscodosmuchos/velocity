import { useEffect, useCallback, useState, useMemo } from 'react';
import { 
  dashboardAssetValidator, 
  DashboardAsset, 
  ValidationResult,
  validateNavigationBeforeUse 
} from '@/services/dashboard-asset-validator';
import { alertIconRegistry } from '@/components/alert-icons';

interface UseDashboardValidationOptions {
  validateOnMount?: boolean;
  validateOnChange?: boolean;
  throwOnError?: boolean;
  logWarnings?: boolean;
}

export function useDashboardValidation(
  dashboardId: string,
  assets: DashboardAsset[],
  options: UseDashboardValidationOptions = {}
) {
  const {
    validateOnMount = true,
    validateOnChange = true,
    throwOnError = false,
    logWarnings = true
  } = options;

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(() => {
    setIsValidating(true);
    
    dashboardAssetValidator.registerDashboard(dashboardId, assets);
    const result = dashboardAssetValidator.validateDashboard(dashboardId);
    
    setValidationResult(result);
    setIsValidating(false);

    if (!result.valid) {
      const errorMessage = `Dashboard "${dashboardId}" validation failed with ${result.summary.errors} errors`;
      
      if (throwOnError) {
        throw new Error(errorMessage);
      }
      
      console.error(`[DashboardValidation] ${errorMessage}`);
      result.issues.filter(i => i.type === 'error').forEach(issue => {
        console.error(`  [${issue.category}] ${issue.message}`);
      });
    }

    if (logWarnings && result.summary.warnings > 0) {
      console.warn(`[DashboardValidation] Dashboard "${dashboardId}" has ${result.summary.warnings} warnings`);
      result.issues.filter(i => i.type === 'warning').forEach(issue => {
        console.warn(`  [${issue.category}] ${issue.message}`);
      });
    }

    return result;
  }, [dashboardId, assets, throwOnError, logWarnings]);

  useEffect(() => {
    if (validateOnMount) {
      validate();
    }
    
    return () => {
      dashboardAssetValidator.unregisterDashboard(dashboardId);
    };
  }, []);

  useEffect(() => {
    if (validateOnChange && assets.length > 0) {
      validate();
    }
  }, [assets, validateOnChange, validate]);

  const isValid = validationResult?.valid ?? true;
  const errors = validationResult?.issues.filter(i => i.type === 'error') ?? [];
  const warnings = validationResult?.issues.filter(i => i.type === 'warning') ?? [];

  return {
    isValid,
    isValidating,
    errors,
    warnings,
    validationResult,
    validate,
    getHistory: () => dashboardAssetValidator.getValidationHistory(dashboardId)
  };
}

interface RefineGoOptions {
  to?: string;
  query?: Record<string, string>;
  hash?: string;
  options?: {
    keepQuery?: boolean;
    keepHash?: boolean;
  };
  type?: 'push' | 'replace' | 'path';
}

export function useValidatedNavigation() {
  const createSafeNavigator = useCallback((go: (options: RefineGoOptions) => void | string) => {
    return (path: string, componentName: string = 'unknown', additionalOptions?: Omit<RefineGoOptions, 'to'>) => {
      if (validateNavigationBeforeUse(path, componentName)) {
        go({ to: path, ...additionalOptions });
      } else {
        console.error(`[SafeNavigation] Blocked navigation to invalid path: ${path}`);
      }
    };
  }, []);

  const isPathValid = useCallback((path: string): boolean => {
    return dashboardAssetValidator.isRouteValid(path);
  }, []);

  const validatePath = useCallback((path: string, componentName: string = 'unknown'): { valid: boolean; issue?: string } => {
    const issue = dashboardAssetValidator.validateNavigation(path, componentName);
    return {
      valid: issue === null,
      issue: issue?.message
    };
  }, []);

  return {
    createSafeNavigator,
    isPathValid,
    validatePath
  };
}

export function useAlertIconRegistry() {
  const [icons, setIcons] = useState(alertIconRegistry.getAll());

  useEffect(() => {
    const unsubscribe = alertIconRegistry.subscribe(() => {
      setIcons(alertIconRegistry.getAll());
    });
    return unsubscribe;
  }, []);

  const getIcon = useCallback((id: string) => {
    return alertIconRegistry.get(id);
  }, []);

  const registerIcon = useCallback((config: Parameters<typeof alertIconRegistry.register>[0]) => {
    alertIconRegistry.register(config);
  }, []);

  const getBySeverity = useCallback((severity: Parameters<typeof alertIconRegistry.getBySeverity>[0]) => {
    return alertIconRegistry.getBySeverity(severity);
  }, []);

  const getByCategory = useCallback((category: Parameters<typeof alertIconRegistry.getByCategory>[0]) => {
    return alertIconRegistry.getByCategory(category);
  }, []);

  return {
    icons,
    getIcon,
    registerIcon,
    getBySeverity,
    getByCategory,
    createCustomIcon: alertIconRegistry.createCustomIcon.bind(alertIconRegistry),
    exportConfig: alertIconRegistry.exportConfig.bind(alertIconRegistry)
  };
}

export function createDashboardAssets(elements: Array<{
  id: string;
  type: DashboardAsset['type'];
  name: string;
  location: string;
  navigation?: string;
  dataQuery?: string;
  dependencies?: string[];
}>): DashboardAsset[] {
  return elements.map(el => ({
    id: el.id,
    type: el.type,
    name: el.name,
    location: el.location,
    navigation: el.navigation ? { path: el.navigation } : undefined,
    dataSource: el.dataQuery ? { type: 'query' as const, source: el.dataQuery } : undefined,
    dependencies: el.dependencies
  }));
}
