/**
 * BatchOrchestrator
 * 
 * Manages complex batch execution workflows:
 * - Parallel item processing with configurable concurrency
 * - Status transitions and progress tracking
 * - Multi-lens analysis integration
 * - Error handling and retry logic
 * 
 * Used by POST /api/batches/:id/run endpoint
 */

class BatchOrchestrator {
  constructor(pool, options = {}) {
    this.pool = pool;
    this.maxParallel = options.maxParallel || 5;
    this.activeBatches = new Map();
  }

  /**
   * Run a batch with parallel item processing
   * @param {string} batchId - UUID of the batch to run
   * @param {object} options - Execution options (maxParallel, lenses, etc.)
   * @returns {Promise<object>} - Batch execution result
   */
  async run(batchId, options = {}) {
    const client = await this.pool.connect();
    
    try {
      // 1. Validate batch exists and is in valid state
      const batchResult = await client.query(
        'SELECT * FROM generation_batches WHERE id = $1',
        [batchId]
      );

      if (batchResult.rows.length === 0) {
        throw new Error(`Batch ${batchId} not found`);
      }

      const batch = batchResult.rows[0];

      if (batch.status === 'running') {
        throw new Error(`Batch ${batchId} is already running`);
      }

      if (batch.status === 'completed') {
        throw new Error(`Batch ${batchId} is already completed. Create a new batch to re-run.`);
      }

      // 2. Update batch status to 'running'
      await client.query(
        'UPDATE generation_batches SET status = $1, started_at = NOW(), updated_at = NOW() WHERE id = $2',
        ['running', batchId]
      );

      // 3. Fetch all pending items
      const itemsResult = await client.query(
        'SELECT * FROM generation_batch_items WHERE batch_id = $1 AND status = $2 ORDER BY item_order ASC',
        [batchId, 'pending']
      );

      const items = itemsResult.rows;

      if (items.length === 0) {
        // No items to process
        await client.query(
          'UPDATE generation_batches SET status = $1, completed_at = NOW() WHERE id = $2',
          ['completed', batchId]
        );
        return { batchId, status: 'completed', itemsProcessed: 0 };
      }

      // 4. Process items in parallel (up to maxParallel)
      const maxParallel = options.maxParallel || this.maxParallel;
      const results = await this.processItemsInParallel(items, batch, maxParallel);

      // 5. Update batch status to 'completed' or 'failed'
      const allCompleted = results.every(r => r.status === 'completed');
      const finalStatus = allCompleted ? 'completed' : 'failed';

      await client.query(
        'UPDATE generation_batches SET status = $1, completed_at = NOW() WHERE id = $2',
        [finalStatus, batchId]
      );

      return {
        batchId,
        status: finalStatus,
        itemsProcessed: results.length,
        results,
      };

    } finally {
      client.release();
    }
  }

  /**
   * Process batch items in parallel with concurrency limit
   */
  async processItemsInParallel(items, batch, maxParallel) {
    const results = [];
    
    // Process items in chunks of maxParallel
    for (let i = 0; i < items.length; i += maxParallel) {
      const chunk = items.slice(i, i + maxParallel);
      const chunkResults = await Promise.allSettled(
        chunk.map(item => this.processItem(item, batch))
      );
      
      results.push(...chunkResults.map((r, idx) => {
        if (r.status === 'fulfilled') {
          return r.value;
        } else {
          return {
            itemId: chunk[idx].id,
            status: 'failed',
            error: r.reason.message,
          };
        }
      }));
    }
    
    return results;
  }

  /**
   * Process a single batch item
   */
  async processItem(item, batch) {
    const startTime = Date.now();
    const client = await this.pool.connect();

    try {
      // 1. Update item status to 'running'
      await client.query(
        'UPDATE generation_batch_items SET status = $1, started_at = NOW() WHERE id = $2',
        ['running', item.id]
      );

      // 2. Execute analysis based on batch type
      const result = await this.executeAnalysis(item, batch);

      // 3. Store findings in generation_batch_findings
      if (result.findings && result.findings.length > 0) {
        for (const finding of result.findings) {
          await client.query(
            `INSERT INTO generation_batch_findings 
            (batch_item_id, lens_name, lens_perspective, findings, detected_issues, missed_issues, accuracy_score, severity_breakdown, evidence, recommendations)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              item.id,
              finding.lensName,
              finding.lensPerspective,
              JSON.stringify(finding.findings || []),
              finding.detectedIssues || 0,
              finding.missedIssues || 0,
              finding.accuracyScore || null,
              JSON.stringify(finding.severityBreakdown || { critical: 0, high: 0, medium: 0, low: 0 }),
              JSON.stringify(finding.evidence || []),
              JSON.stringify(finding.recommendations || []),
            ]
          );
        }
      }

      // 4. Update item status to 'completed'
      const executionTime = Date.now() - startTime;
      await client.query(
        'UPDATE generation_batch_items SET status = $1, result = $2, execution_time_ms = $3, completed_at = NOW() WHERE id = $4',
        ['completed', JSON.stringify(result), executionTime, item.id]
      );

      return {
        itemId: item.id,
        status: 'completed',
        executionTime,
        result,
      };

    } catch (error) {
      // Update item status to 'failed'
      const executionTime = Date.now() - startTime;
      await client.query(
        'UPDATE generation_batch_items SET status = $1, error_message = $2, execution_time_ms = $3, completed_at = NOW() WHERE id = $4',
        ['failed', error.message, executionTime, item.id]
      );

      throw error;

    } finally {
      client.release();
    }
  }

  /**
   * Execute analysis for a specific batch type
   * 
   * This is where multi-lens analysis integration happens.
   * Currently returns mock data - will be connected to real analyzers.
   */
  async executeAnalysis(item, batch) {
    const { batch_type } = batch;
    const itemConfig = item.item_config;

    // Mock analysis results for demonstration
    // TODO: Connect to real contract analyzer, compliance checker, etc.
    
    const mockFindings = [];

    // Legal lens
    if (itemConfig.lenses?.includes('legal')) {
      mockFindings.push({
        lensName: 'legal',
        lensPerspective: 'Legal Counsel',
        findings: [
          {
            category: 'Liability Coverage',
            severity: 'high',
            description: 'Certificate of Insurance missing or expired',
            location: 'Section 4.2',
          },
        ],
        detectedIssues: 1,
        missedIssues: 0,
        accuracyScore: 98.5,
        severityBreakdown: { critical: 0, high: 1, medium: 0, low: 0 },
        evidence: ['Missing COI attachment'],
        recommendations: ['Request updated insurance certificate within 5 business days'],
      });
    }

    // Financial lens
    if (itemConfig.lenses?.includes('financial')) {
      mockFindings.push({
        lensName: 'financial',
        lensPerspective: 'Finance Controller',
        findings: [
          {
            category: 'Budget Variance',
            severity: 'medium',
            description: 'Invoice amount exceeds PO budget by 8%',
            location: 'Line item 3',
          },
        ],
        detectedIssues: 1,
        missedIssues: 0,
        accuracyScore: 97.2,
        severityBreakdown: { critical: 0, high: 0, medium: 1, low: 0 },
        evidence: ['PO budget: $10,000', 'Invoice total: $10,800'],
        recommendations: ['Require budget amendment approval before payment'],
      });
    }

    // Technical lens
    if (itemConfig.lenses?.includes('technical')) {
      mockFindings.push({
        lensName: 'technical',
        lensPerspective: 'IT Director',
        findings: [
          {
            category: 'Data Completeness',
            severity: 'low',
            description: 'Contractor email missing',
            location: 'Contact information',
          },
        ],
        detectedIssues: 1,
        missedIssues: 0,
        accuracyScore: 95.8,
        severityBreakdown: { critical: 0, high: 0, medium: 0, low: 1 },
        evidence: ['Email field empty'],
        recommendations: ['Request email address for automated notifications'],
      });
    }

    // Risk lens
    if (itemConfig.lenses?.includes('risk')) {
      mockFindings.push({
        lensName: 'risk',
        lensPerspective: 'CISO',
        findings: [
          {
            category: 'Compliance Gap',
            severity: 'critical',
            description: 'Background check verification missing',
            location: 'Onboarding checklist',
          },
        ],
        detectedIssues: 1,
        missedIssues: 0,
        accuracyScore: 96.3,
        severityBreakdown: { critical: 1, high: 0, medium: 0, low: 0 },
        evidence: ['No background check completion date'],
        recommendations: ['Block contractor activation until background check verified'],
      });
    }

    // Simulate processing time (100-500ms)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));

    return {
      batchType: batch_type,
      itemOrder: item.item_order,
      findings: mockFindings,
      summary: {
        totalIssues: mockFindings.reduce((sum, f) => sum + f.detectedIssues, 0),
        overallAccuracy: mockFindings.length > 0 
          ? mockFindings.reduce((sum, f) => sum + (f.accuracyScore || 0), 0) / mockFindings.length
          : 0,
      },
    };
  }

  /**
   * Get batch progress/status
   */
  async getProgress(batchId) {
    const result = await this.pool.query(
      `SELECT 
        b.*,
        COUNT(i.id) as total_items,
        COUNT(CASE WHEN i.status = 'completed' THEN 1 END) as completed_items,
        COUNT(CASE WHEN i.status = 'failed' THEN 1 END) as failed_items,
        COUNT(CASE WHEN i.status = 'running' THEN 1 END) as running_items
      FROM generation_batches b
      LEFT JOIN generation_batch_items i ON b.id = i.batch_id
      WHERE b.id = $1
      GROUP BY b.id`,
      [batchId]
    );

    if (result.rows.length === 0) {
      throw new Error(`Batch ${batchId} not found`);
    }

    const batch = result.rows[0];
    const progress = batch.total_items > 0 
      ? Math.round((batch.completed_items / batch.total_items) * 100)
      : 0;

    return {
      batchId: batch.id,
      batchName: batch.batch_name,
      status: batch.status,
      progress,
      totalItems: parseInt(batch.total_items),
      completedItems: parseInt(batch.completed_items),
      failedItems: parseInt(batch.failed_items),
      runningItems: parseInt(batch.running_items),
      startedAt: batch.started_at,
      completedAt: batch.completed_at,
    };
  }
}

module.exports = BatchOrchestrator;
