import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFKit = require('pdfkit');

import { type IPayrollPdfService } from '@modules/finance/shared/contracts/payroll-pdf-service.contract';

import { type PayrollEntry } from '../../domain/entities/payroll-entry.entity';

@Injectable()
export class PayrollPdfService implements IPayrollPdfService {
  generate(entry: PayrollEntry, companyName: string): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const doc = new PDFKit({ margin: 50, size: 'A4' });

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      this.renderHeader(doc, companyName, entry);
      this.renderDetails(doc, entry);

      doc.end();
    });
  }

  private renderHeader(doc: PDFKit.PDFDocument, companyName: string, _entry: PayrollEntry): void {
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(companyName, 50, 45)
      .fontSize(10)
      .font('Helvetica')
      .moveDown();

    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('PAY STUB', 50, 100)
      .fontSize(10)
      .font('Helvetica')
      .moveDown(2);
  }

  private renderDetails(doc: PDFKit.PDFDocument, entry: PayrollEntry): void {
    const labelX = 50;
    const valueX = 250;
    let y = doc.y;

    const rows: Array<{ label: string; value: string }> = [
      { label: 'Employee ID:', value: entry.employeeId },
      { label: 'Period:', value: entry.period },
      { label: 'Status:', value: entry.status.toUpperCase() },
      { label: 'Days Worked:', value: String(entry.daysWorked) },
      { label: 'Base Salary:', value: `$${entry.baseSalary.toFixed(2)}` },
      { label: 'Bonuses:', value: `$${entry.bonuses.toFixed(2)}` },
      { label: 'Deductions:', value: `$${entry.deductions.toFixed(2)}` },
    ];

    doc
      .moveTo(50, y - 5)
      .lineTo(545, y - 5)
      .stroke();

    for (const row of rows) {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(row.label, labelX, y)
        .font('Helvetica')
        .text(row.value, valueX, y);
      y += 22;
    }

    doc
      .moveTo(50, y + 5)
      .lineTo(545, y + 5)
      .stroke();

    y += 15;

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Net Pay:', labelX, y)
      .text(`$${entry.netPay.toFixed(2)}`, valueX, y);

    if (entry.paidAt) {
      y += 25;
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Paid on: ${entry.paidAt.toLocaleDateString()}`, labelX, y);
    }
  }
}
