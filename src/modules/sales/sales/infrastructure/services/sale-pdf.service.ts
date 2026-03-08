import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFKit = require('pdfkit');

import { type ISalePdfService } from '@modules/sales/shared/contracts/sale-pdf-service.contract';

import { type Sale } from '../../domain/entities/sale.entity';

@Injectable()
export class SalePdfService implements ISalePdfService {
  generate(sale: Sale, companyName: string, companyLogo: string | null): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const doc = new PDFKit({ margin: 50, size: 'A4' });

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      this.renderHeader(doc, companyName, companyLogo, sale);
      this.renderItemsTable(doc, sale);
      this.renderTotals(doc, sale);
      this.renderFooter(doc, sale);

      doc.end();
    });
  }

  private renderHeader(
    doc: PDFKit.PDFDocument,
    companyName: string,
    companyLogo: string | null,
    sale: Sale,
  ): void {
    if (companyLogo && companyLogo.startsWith('data:image/')) {
      const base64Data = companyLogo.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');
      doc.image(imageBuffer, 50, 45, { width: 80 });
    }

    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(companyName, 140, 45)
      .fontSize(10)
      .font('Helvetica')
      .moveDown();

    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('SALE ORDER', 50, 130)
      .fontSize(10)
      .font('Helvetica')
      .text(`# ${String(sale.number).padStart(4, '0')}`, 50, 160)
      .text(`Status: ${sale.status.toUpperCase()}`, 50, 175);

    doc.moveDown(4);
  }

  private renderItemsTable(doc: PDFKit.PDFDocument, sale: Sale): void {
    const tableTop = doc.y;
    const colDesc = 50;
    const colQty = 270;
    const colUnit = 320;
    const colPrice = 390;
    const colTotal = 465;

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Description', colDesc, tableTop)
      .text('Qty', colQty, tableTop)
      .text('Unit', colUnit, tableTop)
      .text('Unit Price', colPrice, tableTop)
      .text('Total', colTotal, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(545, tableTop + 15)
      .stroke();

    let rowY = tableTop + 25;
    doc.font('Helvetica').fontSize(10);

    for (const item of sale.items) {
      doc
        .text(item.description, colDesc, rowY, { width: 210 })
        .text(String(item.quantity), colQty, rowY)
        .text(item.unit, colUnit, rowY)
        .text(`$${item.unitPrice.toFixed(2)}`, colPrice, rowY)
        .text(`$${item.lineTotal.toFixed(2)}`, colTotal, rowY);

      rowY += 20;
    }

    doc.moveTo(50, rowY).lineTo(545, rowY).stroke();
    doc.y = rowY + 10;
  }

  private renderTotals(doc: PDFKit.PDFDocument, sale: Sale): void {
    const labelX = 380;
    const valueX = 460;

    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('Subtotal:', labelX, doc.y)
      .text(`$${sale.subtotal.toFixed(2)}`, valueX, doc.y - 11)
      .moveDown(0.5)
      .fontSize(13)
      .text('Total:', labelX, doc.y)
      .text(`$${sale.total.toFixed(2)}`, valueX, doc.y - 13)
      .moveDown(2);
  }

  private renderFooter(doc: PDFKit.PDFDocument, sale: Sale): void {
    if (sale.notes) {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Notes:', 50, doc.y)
        .font('Helvetica')
        .text(sale.notes, 50, doc.y + 5);
    }
  }
}
