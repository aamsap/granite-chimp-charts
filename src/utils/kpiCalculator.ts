// KPI calculation utilities for efficient data processing
import { KPIData } from '@/types';

export interface CalculatedKPI {
  id: string;
  name: string;
  description: string;
  type: 'sum' | 'average' | 'count' | 'max' | 'min';
  column: string;
  category: 'financial' | 'statistical' | 'categorical';
  value: string | number;
  formattedValue: string;
  isValid: boolean;
}

export class KPICalculator {
  /**
   * Calculate KPI values from raw data efficiently
   */
  static calculateKPIs(kpis: KPIData[], rawData: any[]): CalculatedKPI[] {
    if (!rawData || rawData.length === 0) {
      return kpis.map(kpi => ({
        ...kpi,
        value: 'N/A',
        formattedValue: 'N/A',
        isValid: false
      }));
    }

    return kpis.map(kpi => {
      const calculated = this.calculateSingleKPI(kpi, rawData);
      return {
        ...kpi,
        ...calculated
      };
    });
  }

  /**
   * Calculate a single KPI value
   */
  private static calculateSingleKPI(kpi: KPIData, rawData: any[]): {
    value: string | number;
    formattedValue: string;
    isValid: boolean;
  } {
    try {
      const column = kpi.column;
      
      // Extract and clean values from the column
      const values = rawData
        .map(row => {
          const val = row[column];
          if (val === null || val === undefined || val === '') return null;
          
          // Convert string numbers to numbers
          if (typeof val === 'string') {
            const num = parseFloat(val);
            return isNaN(num) ? null : num;
          }
          
          return typeof val === 'number' ? val : null;
        })
        .filter(val => val !== null) as number[];

      if (values.length === 0) {
        return {
          value: 'N/A',
          formattedValue: 'N/A',
          isValid: false
        };
      }

      let calculatedValue: number;
      let formattedValue: string;

      switch (kpi.type) {
        case 'sum':
          calculatedValue = values.reduce((a, b) => a + b, 0);
          formattedValue = this.formatNumber(calculatedValue, 2);
          break;
          
        case 'average':
          calculatedValue = values.reduce((a, b) => a + b, 0) / values.length;
          formattedValue = this.formatNumber(calculatedValue, 2);
          break;
          
        case 'count':
          calculatedValue = values.length;
          formattedValue = calculatedValue.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });
          break;
          
        case 'max':
          calculatedValue = Math.max(...values);
          formattedValue = this.formatNumber(calculatedValue, 2);
          break;
          
        case 'min':
          calculatedValue = Math.min(...values);
          formattedValue = this.formatNumber(calculatedValue, 2);
          break;
          
        default:
          return {
            value: 'N/A',
            formattedValue: 'N/A',
            isValid: false
          };
      }

      return {
        value: calculatedValue,
        formattedValue,
        isValid: true
      };

    } catch (error) {
      console.error(`Error calculating KPI ${kpi.name}:`, error);
      return {
        value: 'Error',
        formattedValue: 'Error',
        isValid: false
      };
    }
  }

  /**
   * Format numbers with appropriate precision and locale
   * All numeric values are limited to maximum 2 decimal places
   */
  private static formatNumber(value: number, decimals: number = 0): string {
    // Always limit to maximum 2 decimal places
    const maxDecimals = Math.min(decimals, 2);
    
    if (maxDecimals > 0) {
      return value.toFixed(maxDecimals);
    }
    
    // For large numbers, use locale formatting with 2 decimal max
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    
    // For smaller numbers, limit to 2 decimal places
    return value.toFixed(2);
  }

  /**
   * Get top KPIs by importance/relevance
   */
  static getTopKPIs(calculatedKPIs: CalculatedKPI[], limit: number = 4): CalculatedKPI[] {
    return calculatedKPIs
      .filter(kpi => kpi.isValid)
      .sort((a, b) => {
        // Prioritize financial KPIs
        if (a.category === 'financial' && b.category !== 'financial') return -1;
        if (b.category === 'financial' && a.category !== 'financial') return 1;
        
        // Then by type priority (sum > average > count > max > min)
        const typePriority = { sum: 5, average: 4, count: 3, max: 2, min: 1 };
        return typePriority[b.type] - typePriority[a.type];
      })
      .slice(0, limit);
  }

  /**
   * Validate data quality for KPI calculation
   */
  static validateDataQuality(rawData: any[], kpis: KPIData[]): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!rawData || rawData.length === 0) {
      issues.push('No data available');
      return { isValid: false, issues, recommendations };
    }

    // Check for missing columns
    const requiredColumns = [...new Set(kpis.map(kpi => kpi.column))];
    const availableColumns = Object.keys(rawData[0] || {});
    
    const missingColumns = requiredColumns.filter(col => !availableColumns.includes(col));
    if (missingColumns.length > 0) {
      issues.push(`Missing columns: ${missingColumns.join(', ')}`);
    }

    // Check data quality for each KPI column
    kpis.forEach(kpi => {
      const column = kpi.column;
      if (!availableColumns.includes(column)) return;

      const values = rawData.map(row => row[column]);
      const nullCount = values.filter(val => val === null || val === undefined || val === '').length;
      const nullPercentage = (nullCount / values.length) * 100;

      if (nullPercentage > 20) {
        issues.push(`Column '${column}' has ${nullPercentage.toFixed(1)}% missing values`);
        recommendations.push(`Consider cleaning data for column '${column}'`);
      }

      // Check for numeric data quality
      if (['sum', 'average', 'max', 'min'].includes(kpi.type)) {
        const numericValues = values.filter(val => {
          if (typeof val === 'number') return !isNaN(val);
          if (typeof val === 'string') return !isNaN(parseFloat(val));
          return false;
        });

        if (numericValues.length < values.length * 0.8) {
          issues.push(`Column '${column}' has poor numeric data quality`);
          recommendations.push(`Ensure '${column}' contains numeric values`);
        }
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }
}
