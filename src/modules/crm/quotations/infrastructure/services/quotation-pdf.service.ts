import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFKit = require('pdfkit');

import { type IQuotationPdfService } from '../../application/contracts/quotation-pdf-service.contract';
import { type Quotation } from '../../domain/entities/quotation.entity';

const MARGIN = 50;
const RIGHT_EDGE = 545;
const LOGO_X = MARGIN;
const LOGO_Y = 45;
const LOGO_MAX_W = 120;
const LOGO_MAX_H = 70;
const TEXT_X = 180;
const DIVIDER_1_Y = 125;
const META_Y = 140;
const DIVIDER_2_Y = 162;
const CONTENT_Y = 182;

@Injectable()
export class QuotationPdfService implements IQuotationPdfService {
  generate(quotation: Quotation, companyName: string, companyLogo: string | null): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const doc = new PDFKit({ margin: MARGIN, size: 'A4' });

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      this.renderHeader(doc, companyName, companyLogo, quotation);
      this.renderRecipient(doc, quotation);
      this.renderItemsTable(doc, quotation);
      this.renderTotals(doc, quotation);
      this.renderFooter(doc, quotation);

      doc.end();
    });
  }

  private renderHeader(
    doc: PDFKit.PDFDocument,
    companyName: string,
    companyLogo: string | null,
    quotation: Quotation,
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
      .text('QUOTATION', TEXT_X, LOGO_Y + 26, { width: RIGHT_EDGE - TEXT_X });

    doc.moveTo(MARGIN, DIVIDER_1_Y).lineTo(RIGHT_EDGE, DIVIDER_1_Y).stroke();

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(`# ${String(quotation.number).padStart(4, '0')}`, MARGIN, META_Y)
      .font('Helvetica')
      .text(`Status: ${quotation.status.toUpperCase()}`, 200, META_Y);

    if (quotation.validUntil) {
      doc.text(`Valid until: ${quotation.validUntil.toLocaleDateString()}`, 370, META_Y);
    }

    doc.moveTo(MARGIN, DIVIDER_2_Y).lineTo(RIGHT_EDGE, DIVIDER_2_Y).stroke();
    doc.y = CONTENT_Y;
  }

  private renderRecipient(doc: PDFKit.PDFDocument, quotation: Quotation): void {
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('Quotation for:', MARGIN, doc.y)
      .font('Helvetica')
      .fontSize(10)
      .text(quotation.title, MARGIN, doc.y + 4)
      .moveDown(1.5);
  }

  private renderItemsTable(doc: PDFKit.PDFDocument, quotation: Quotation): void {
    const tableTop = doc.y;
    const colDesc = MARGIN;
    const colQty = 300;
    const colPrice = 375;
    const colTotal = 460;

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Description', colDesc, tableTop)
      .text('Qty', colQty, tableTop)
      .text('Unit Price', colPrice, tableTop)
      .text('Total', colTotal, tableTop);

    doc
      .moveTo(MARGIN, tableTop + 15)
      .lineTo(RIGHT_EDGE, tableTop + 15)
      .stroke();

    let rowY = tableTop + 25;
    doc.font('Helvetica').fontSize(10);

    for (const item of quotation.items) {
      doc
        .text(item.description, colDesc, rowY, { width: 240 })
        .text(String(item.quantity), colQty, rowY)
        .text(`$${item.unitPrice.toFixed(2)}`, colPrice, rowY)
        .text(`$${item.lineTotal.toFixed(2)}`, colTotal, rowY);
      rowY += 20;
    }

    doc.moveTo(MARGIN, rowY).lineTo(RIGHT_EDGE, rowY).stroke();
    doc.y = rowY + 10;
  }

  private renderTotals(doc: PDFKit.PDFDocument, quotation: Quotation): void {
    const labelX = 370;
    const valueX = 462;

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('Subtotal:', labelX, doc.y)
      .text(`$${quotation.subtotal.toFixed(2)}`, valueX, doc.y - 10)
      .moveDown(0.5)
      .fontSize(12)
      .text('Total:', labelX, doc.y)
      .text(`$${quotation.total.toFixed(2)}`, valueX, doc.y - 12)
      .moveDown(2);
  }

  private renderFooter(doc: PDFKit.PDFDocument, quotation: Quotation): void {
    if (quotation.notes) {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Notes:', MARGIN, doc.y)
        .font('Helvetica')
        .text(quotation.notes, MARGIN, doc.y + 4);
    }
  }
}
