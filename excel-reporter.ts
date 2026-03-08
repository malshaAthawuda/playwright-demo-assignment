import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as ExcelJS from 'exceljs';
import * as path from 'path';

class ExcelReporter implements Reporter {
    private workbook: ExcelJS.Workbook;
    private worksheet: ExcelJS.Worksheet;

    constructor(options: { outputFile?: string } = {}) {
        this.workbook = new ExcelJS.Workbook();
        this.worksheet = this.workbook.addWorksheet('Test Results');

        this.worksheet.columns = [
            { header: 'Test Title', key: 'title', width: 40 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Duration (ms)', key: 'duration', width: 15 },
            { header: 'Errors', key: 'errors', width: 60 },
        ];
    }

    onTestEnd(test: TestCase, result: TestResult) {
        let displayStatus = result.status as string;
        const outcome = test.outcome();

        if (outcome === 'expected' || outcome === 'flaky') {
            displayStatus = 'passed';
        } else if (outcome === 'unexpected') {
            displayStatus = 'failed';
        } else if (outcome === 'skipped') {
            displayStatus = 'skipped';
        }

        this.worksheet.addRow({
            title: test.title,
            status: displayStatus,
            duration: result.duration,
            errors: result.errors.map(e => e.message).join('\n')
        });
    }

    async onEnd(result: FullResult) {
        const filePath = path.join(process.cwd(), 'test-results.xlsx');
        await this.workbook.xlsx.writeFile(filePath);
        console.log(`Excel report saved to ${filePath}`);
    }
}

export default ExcelReporter;
