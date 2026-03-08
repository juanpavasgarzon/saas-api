import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFKit = require('pdfkit');

import { type ITransactionPdfService } from '@modules/finance/shared/contracts/transaction-pdf-service.contract';

import { type AccountingTransaction } from '../../domain/entities/accounting-transaction.entity';

@Injectable()
export class TransactionPdfService implements ITransactionPdfService {
  generate(transaction: AccountingTransaction, companyName: string): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const doc = new PDFKit({ margin: 50, size: 'A4' });

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      this.renderHeader(doc, companyName, transaction);
      this.renderDetails(doc, transaction);

      doc.end();
    });
  }

  private renderHeader(
    doc: PDFKit.PDFDocument,
    companyName: string,
    _transaction: AccountingTransaction,
  ): void {
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
      .text('TRANSACTION RECEIPT', 50, 100)
      .fontSize(10)
      .font('Helvetica')
      .moveDown(2);
  }

  private renderDetails(doc: PDFKit.PDFDocument, transaction: AccountingTransaction): void {
    const labelX = 50;
    const valueX = 250;
    let y = doc.y;

    const rows: Array<{ label: string; value: string }> = [
      { label: 'Type:', value: transaction.type.toUpperCase() },
      { label: 'Amount:', value: `$${transaction.amount.toFixed(2)}` },
      { label: 'Description:', value: transaction.description },
      { label: 'Date:', value: transaction.date.toLocaleDateString() },
    ];

    if (transaction.reference) {
      rows.push({ label: 'Reference:', value: transaction.reference });
    }

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
  }
}
