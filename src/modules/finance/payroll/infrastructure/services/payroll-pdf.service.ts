import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFKit = require('pdfkit');

import { IPayrollPdfService } from '../../application/contracts/payroll-pdf-service.contract';
import { type PayrollEntry } from '../../domain/entities/payroll-entry.entity';

const MARGIN = 50;
const RIGHT_EDGE = 545;
const LOGO_X = MARGIN;
const LOGO_Y = 45;
const LOGO_MAX_W = 120;
const LOGO_MAX_H = 70;
const TEXT_X = 180;
const DIVIDER_1_Y = 125;
const CONTENT_Y = 150;

@Injectable()
export class PayrollPdfService implements IPayrollPdfService {
  generate(entry: PayrollEntry, companyName: string, companyLogo: string | null): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const doc = new PDFKit({ margin: MARGIN, size: 'A4' });

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      this.renderHeader(doc, companyName, companyLogo);
      this.renderDetails(doc, entry);

      doc.end();
    });
  }

  private renderHeader(
    doc: PDFKit.PDFDocument,
    companyName: string,
    companyLogo: string | null,
  ): void {
    if (companyLogo) {
      const match = companyLogo.match(/^data:image\/png;base64,(.+)$/);
      if (match) {
        doc.image(Buffer.from(match[1], 'base64'), LOGO_X, LOGO_Y, {
          fit: [LOGO_MAX_W, LOGO_MAX_H],
        });
      }
    }

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(companyName, TEXT_X, LOGO_Y, { width: RIGHT_EDGE - TEXT_X })
      .fontSize(22)
      .text('PAY STUB', TEXT_X, LOGO_Y + 26, { width: RIGHT_EDGE - TEXT_X });

    doc.moveTo(MARGIN, DIVIDER_1_Y).lineTo(RIGHT_EDGE, DIVIDER_1_Y).stroke();
    doc.y = CONTENT_Y;
  }

  private renderDetails(doc: PDFKit.PDFDocument, entry: PayrollEntry): void {
    const labelX = MARGIN;
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
      .moveTo(MARGIN, y + 5)
      .lineTo(RIGHT_EDGE, y + 5)
      .stroke();
    y += 20;

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
