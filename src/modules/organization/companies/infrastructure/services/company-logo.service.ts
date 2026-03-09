import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

import { type ICompanyLogoService } from '@modules/organization/companies/application/contracts/company-logo-service.contract';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const LOGO_RESIZE_OPTS = { width: 400, height: 160, fit: 'inside' as const };
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export class CompanyLogoService implements ICompanyLogoService {
  async prepareLogoBase64(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Logo file is required');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only PNG, JPG and WebP images are allowed');
    }

    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('Logo file must be smaller than 2 MB');
    }

    const processed = await sharp(file.buffer).trim().resize(LOGO_RESIZE_OPTS).png().toBuffer();
    return `data:image/png;base64,${processed.toString('base64')}`;
  }
}
