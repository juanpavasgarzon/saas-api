import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFKit = require('pdfkit');

import { ISalePdfService } from '../../application/contracts/sale-pdf-service.contract';
import { type Sale } from '../../domain/entities/sale.entity';

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
export class SalePdfService implements ISalePdfService {
  generate(sale: Sale, companyName: string, companyLogo: string | null): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const doc = new PDFKit({ margin: MARGIN, size: 'A4' });

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
      .text('SALE ORDER', TEXT_X, LOGO_Y + 26, { width: RIGHT_EDGE - TEXT_X });

    doc.moveTo(MARGIN, DIVIDER_1_Y).lineTo(RIGHT_EDGE, DIVIDER_1_Y).stroke();

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(`# ${String(sale.number).padStart(4, '0')}`, MARGIN, META_Y)
      .font('Helvetica')
      .text(`Status: ${sale.status.toUpperCase()}`, 200, META_Y);

    doc.moveTo(MARGIN, DIVIDER_2_Y).lineTo(RIGHT_EDGE, DIVIDER_2_Y).stroke();
    doc.y = CONTENT_Y;
  }

  private renderItemsTable(doc: PDFKit.PDFDocument, sale: Sale): void {
    const tableTop = doc.y;
    const colDesc = MARGIN;
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
      .moveTo(MARGIN, tableTop + 15)
      .lineTo(RIGHT_EDGE, tableTop + 15)
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

    doc.moveTo(MARGIN, rowY).lineTo(RIGHT_EDGE, rowY).stroke();
    doc.y = rowY + 10;
  }

  private renderTotals(doc: PDFKit.PDFDocument, sale: Sale): void {
    const labelX = 370;
    const valueX = 462;

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('Subtotal:', labelX, doc.y)
      .text(`$${sale.subtotal.toFixed(2)}`, valueX, doc.y - 10)
      .moveDown(0.5)
      .fontSize(12)
      .text('Total:', labelX, doc.y)
      .text(`$${sale.total.toFixed(2)}`, valueX, doc.y - 12)
      .moveDown(2);
  }

  private renderFooter(doc: PDFKit.PDFDocument, sale: Sale): void {
    if (sale.notes) {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Notes:', MARGIN, doc.y)
        .font('Helvetica')
        .text(sale.notes, MARGIN, doc.y + 4);
    }
  }
}
