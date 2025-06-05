import { PartialType } from '@nestjs/mapped-types';
import { CreateIntelbraDto } from './create-intelbra.dto';

export class UpdateIntelbraDto extends PartialType(CreateIntelbraDto) {}
