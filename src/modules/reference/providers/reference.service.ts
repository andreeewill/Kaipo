import { Injectable } from '@nestjs/common';
import { SatuSehatService } from 'src/api/satu-sehat/providers/satu-sehat.service';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class ReferenceService {
  constructor(
    private readonly logger: AppLogger,

    private readonly satuSehatService: SatuSehatService,
  ) {}

  public async getAllProvinces() {
    const provinces = await this.satuSehatService.getProvinces();
    return provinces;
  }

  public async getCitiesByProvinceCode(provinceCode: string) {
    const cities =
      await this.satuSehatService.getCitiesByProvinceCode(provinceCode);
    return cities;
  }

  public async getDistrictsByCityCode(cityCode: string) {
    const districts =
      await this.satuSehatService.getDistrictsByCityCode(cityCode);
    return districts;
  }

  public async getSubDistrictsByDistrictCode(districtCode: string) {
    const subDistricts =
      await this.satuSehatService.getSubDistrictsByDistrictCode(districtCode);
    return subDistricts;
  }
}
