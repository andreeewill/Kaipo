import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { ReferenceService } from '../providers/reference.service';
import { GetCitiesDto } from '../dtos/get-cities.dto';

import { GetDistrictsDto } from '../dtos/get-districts.dto';
import { GetSubDistrictsDto } from '../dtos/get-subdistricts.dto';

@Controller('reference')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get('/provinces')
  @ApiOperation({ summary: 'Get list of provinces' })
  public async provinces() {
    const result = await this.referenceService.getAllProvinces();
    return result;
  }

  @Get('/cities')
  @ApiOperation({ summary: 'Get list of cities based on province code' })
  public async cities(@Query() query: GetCitiesDto) {
    const result = await this.referenceService.getCitiesByProvinceCode(
      query.provinceCode,
    );
    return result;
  }

  @Get('/districts')
  @ApiOperation({ summary: 'Get list of districts based on city code' })
  public async districts(@Query() query: GetDistrictsDto) {
    const result = await this.referenceService.getDistrictsByCityCode(
      query.cityCode,
    );
    return result;
  }

  @Get('/sub-districts')
  @ApiOperation({ summary: 'Get list of sub districts based on district code' })
  public async subDistricts(@Query() query: GetSubDistrictsDto) {
    const result = await this.referenceService.getSubDistrictsByDistrictCode(
      query.districtCode,
    );
    return result;
  }
}
