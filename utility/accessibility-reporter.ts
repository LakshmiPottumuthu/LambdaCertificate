import * as fs from 'fs';
import * as path from 'path';

export interface ViolationReport {
    pageName: string;
    pageUrl: string;
    timestamp: string;
    violations: any[];
    seriousCriticalCount: number;
}

export class AccessibilityReporter {
    private tempFilePath: string;

    constructor() {
        this.tempFilePath = path.join(process.cwd(), 'accessibility-reports', 'violations-temp.json');
    }

    /**
     * Add a violation report to the temporary storage
     */
    addReport(report: ViolationReport): void {
        const reportDir = path.dirname(this.tempFilePath);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        let allViolations: ViolationReport[] = [];
        if (fs.existsSync(this.tempFilePath)) {
            try {
                const content = fs.readFileSync(this.tempFilePath, 'utf-8');
                allViolations = JSON.parse(content);
            } catch (error) {
                console.log('Creating new violations file...');
                allViolations = [];
            }
        }

        allViolations.push(report);
        fs.writeFileSync(this.tempFilePath, JSON.stringify(allViolations, null, 2));
    }

    /**
     * Clear the temporary violations file
     */
    clearTempFile(): void {
        if (fs.existsSync(this.tempFilePath)) {
            fs.unlinkSync(this.tempFilePath);
            console.log('🧹 Cleared previous violations temp file');
        }
    }

    /**
     * Generate consolidated HTML report from all collected violations
     */
    generateHtmlReport(): string | undefined {
        if (!fs.existsSync(this.tempFilePath)) {
            console.log('No violations file found, skipping report generation');
            return undefined;
        }

        const content = fs.readFileSync(this.tempFilePath, 'utf-8');
        const violations: ViolationReport[] = JSON.parse(content);
        const reportDir = path.join(process.cwd(), 'accessibility-reports');

        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(reportDir, `accessibility-report-${timestamp}.html`);

        const totalViolations = violations.reduce((sum, report) => sum + report.violations.length, 0);
        const totalSeriousCritical = violations.reduce((sum, report) => sum + report.seriousCriticalCount, 0);

        console.log(`\n📊 Generating consolidated accessibility report with ${violations.length} pages tested...`);

        const html = this.buildHtmlContent(violations, totalViolations, totalSeriousCritical);

        fs.writeFileSync(reportPath, html, 'utf-8');
        console.log(`\n📊 Accessibility report saved: ${reportPath}`);
        console.log(`🔗 Open in browser: file://${reportPath.replace(/\\/g, '/')}`);

        return reportPath;
    }

    /**
     * Delete the temporary violations file after report generation
     */
    cleanupTempFile(): void {
        if (fs.existsSync(this.tempFilePath)) {
            fs.unlinkSync(this.tempFilePath);
        }
    }

    /**
     * Build the HTML content for the accessibility report
     */
    private buildHtmlContent(
        violations: ViolationReport[],
        totalViolations: number,
        totalSeriousCritical: number
    ): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Test Report</title>
    <style>
        ${this.getStyles()}
    </style>
</head>
<body>
    <div class="container">
        ${this.buildHeader()}
        ${this.buildSummary(violations, totalViolations, totalSeriousCritical)}
        ${violations.map((report) => this.buildPageSection(report)).join('')}
        ${this.buildFooter()}
    </div>
</body>
</html>`;
    }

    private getStyles(): string {
        return `
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5rem; }
        .header .subtitle { margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1rem; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #007bff; margin: 0; }
        .stat-label { color: #6c757d; font-size: 0.9rem; margin: 5px 0 0 0; }
        .critical { border-left-color: #dc3545; }
        .critical .stat-number { color: #dc3545; }
        .serious { border-left-color: #fd7e14; }
        .serious .stat-number { color: #fd7e14; }
        .page-section { margin: 20px 30px; }
        .page-title { font-size: 1.5rem; margin: 20px 0 10px 0; color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .violation { background: #fff; border: 1px solid #dee2e6; border-radius: 6px; margin: 15px 0; overflow: hidden; }
        .violation-header { padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #dee2e6; }
        .violation-title { font-weight: bold; margin: 0 0 5px 0; }
        .violation-impact { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
        .impact-critical { background: #dc3545; color: white; }
        .impact-serious { background: #fd7e14; color: white; }
        .impact-moderate { background: #ffc107; color: #212529; }
        .impact-minor { background: #6c757d; color: white; }
        .violation-body { padding: 20px; }
        .violation-description { margin: 0 0 15px 0; color: #495057; line-height: 1.5; }
        .violation-help { background: #e7f3ff; padding: 12px 15px; border-radius: 4px; margin: 10px 0; border-left: 3px solid #007bff; }
        .help-link { color: #007bff; text-decoration: none; font-weight: 500; }
        .help-link:hover { text-decoration: underline; }
        .nodes-count { color: #6c757d; font-size: 0.9rem; margin: 10px 0; }
        .element-list { margin: 10px 0; }
        .element-item { background: #f8f9fa; padding: 8px 12px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #007bff; font-family: 'Monaco', 'Consolas', monospace; font-size: 0.85rem; }
        .element-selector { color: #e83e8c; font-weight: bold; }
        .no-violations { text-align: center; padding: 40px; color: #28a745; font-size: 1.2rem; }
        .timestamp { text-align: center; padding: 20px; color: #6c757d; border-top: 1px solid #eee; }
        `;
    }

    private buildHeader(): string {
        return `
        <div class="header">
            <h1>🔍 Accessibility Test Report</h1>
            <p class="subtitle">WCAG 2.1 AA Compliance Analysis</p>
        </div>`;
    }

    private buildSummary(violations: ViolationReport[], totalViolations: number, totalSeriousCritical: number): string {
        return `
        <div class="summary">
            <div class="stat-card">
                <p class="stat-number">${violations.length}</p>
                <p class="stat-label">Pages Tested</p>
            </div>
            <div class="stat-card">
                <p class="stat-number">${totalViolations}</p>
                <p class="stat-label">Total Violations</p>
            </div>
            <div class="stat-card critical">
                <p class="stat-number">${totalSeriousCritical}</p>
                <p class="stat-label">Serious/Critical Issues</p>
            </div>
            <div class="stat-card serious">
                <p class="stat-number">${violations.filter((r) => r.violations.length > 0).length}</p>
                <p class="stat-label">Pages with Issues</p>
            </div>
        </div>`;
    }

    private buildPageSection(report: ViolationReport): string {
        return `
            <div class="page-section">
                <h2 class="page-title">📄 ${report.pageName}</h2>
                <p style="color: #6c757d; margin: 0 0 20px 0;">
                    <strong>URL:</strong> ${report.pageUrl} | 
                    <strong>Tested:</strong> ${new Date(report.timestamp).toLocaleString()}
                </p>
                
                ${
                    report.violations.length === 0
                        ? '<div class="no-violations">✅ No accessibility violations found!</div>'
                        : report.violations.map((violation) => this.buildViolation(violation)).join('')
                }
            </div>`;
    }

    private buildViolation(violation: any): string {
        return `
                        <div class="violation">
                            <div class="violation-header">
                                <h3 class="violation-title">${violation.id}</h3>
                                <span class="violation-impact impact-${violation.impact}">${violation.impact}</span>
                            </div>
                            <div class="violation-body">
                                <p class="violation-description">${violation.description}</p>
                                <div class="violation-help">
                                    <strong>How to fix:</strong> ${violation.help}
                                    <br><a href="${violation.helpUrl}" class="help-link" target="_blank">Learn more →</a>
                                </div>
                                <p class="nodes-count">
                                    <strong>Affected elements:</strong> ${violation.nodes.length} element${violation.nodes.length !== 1 ? 's' : ''}
                                </p>
                                <div class="element-list">
                                    ${violation.nodes.map((node: any) => this.buildElement(node)).join('')}
                                </div>
                            </div>
                        </div>`;
    }

    private buildElement(node: any): string {
        return `
                                        <div class="element-item">
                                            <span class="element-selector">${Array.isArray(node.target) ? node.target.join(', ') : node.target}</span>
                                            ${node.failureSummary ? `<br><small style="color: #6c757d;">${node.failureSummary.replace(/\n/g, '<br>')}</small>` : ''}
                                        </div>`;
    }

    private buildFooter(): string {
        return `
        <div class="timestamp">
            Report generated on ${new Date().toLocaleString()}
        </div>`;
    }
}
