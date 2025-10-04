import { Injectable } from '@nestjs/common';
import { SatuSehatRequestProvider } from './satu-sehat-request.provider';
import { FormattedProvinceMasterData } from '../interfaces/provinces.interface';

@Injectable()
export class SatuSehatService {
  constructor(
    private readonly satuSehatRequestProvider: SatuSehatRequestProvider,
  ) {}

  /**
   * Get satu sehat access token
   */
  public async getAccessToken() {
    // check data in redis first
    const result = await this.satuSehatRequestProvider.getAccessToken();

    return result.access_token;
  }

  /**
   * Get satu sehat provinces list
   */
  public async getProvinces(): Promise<FormattedProvinceMasterData[]> {
    // check data in redis first

    const accessToken = await this.getAccessToken();
    const result =
      await this.satuSehatRequestProvider.getMasterDataProvinces(accessToken);

    const provincesList = result.data || [];
    const formatted = provincesList.map<FormattedProvinceMasterData>((i) => ({
      provinceCode: i.code,
      name: i.name,
    }));

    return formatted;
  }

  /**
   * Get satu sehat cities list by province code
   */
  public async getCitiesByProvinceCode(provinceCode: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const result = await this.satuSehatRequestProvider.getMasterDataCities(
      accessToken,
      provinceCode,
    );

    const citiesList = result.data || [];
    const formatted = citiesList.map((i) => ({
      cityCode: i.code,
      name: i.name,
    }));

    return formatted;
  }

  /**
   * Get satu sehat districts list by city code
   */
  public async getDistrictsByCityCode(cityCode: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const result = await this.satuSehatRequestProvider.getMasterDataDistricts(
      accessToken,
      cityCode,
    );

    const citiesList = result.data || [];
    const formatted = citiesList.map((i) => ({
      districtCode: i.code,
      name: i.name,
    }));

    return formatted;
  }

  /**
   * Get satu sehat districts list by city code
   */
  public async getSubDistrictsByDistrictCode(
    districtCode: string,
  ): Promise<any> {
    const accessToken = await this.getAccessToken();
    const result =
      await this.satuSehatRequestProvider.getMasterDataSubDistricts(
        accessToken,
        districtCode,
      );

    const citiesList = result.data || [];
    const formatted = citiesList.map((i) => ({
      subDistrictCode: i.code,
      name: i.name,
    }));

    return formatted;
  }
}
