import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import satuSehatConfig from 'src/config/satu-sehat.config';
import { GetAccessTokenResponse } from '../interfaces/get-access-token-response.interface';
import { RequestError } from 'src/common/errors/request.error';
import { GetProvincesMasterDataResponse } from '../interfaces/provinces.interface';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class SatuSehatRequestProvider {
  constructor(
    @Inject(satuSehatConfig.KEY)
    private readonly satuSehatConf: ConfigType<typeof satuSehatConfig>,

    private readonly httpService: HttpService,

    private readonly logger: AppLogger,
  ) {}

  /**
   * Get Satu Sehat Access Token. The access token is valid for 5 minutes.
   * @see https://satusehat.kemkes.go.id/platform/docs/id/api-catalogue/authentication
   */
  public async getAccessToken(): Promise<GetAccessTokenResponse> {
    const start = Date.now();

    try {
      const { baseUrl, clientId, clientSecret } = this.satuSehatConf;
      const url = new URL(`${baseUrl}/oauth2/v1/accesstoken`);

      url.searchParams.append('grant_type', 'client_credentials');

      const result = await firstValueFrom(
        this.httpService.post<GetAccessTokenResponse>(
          url.href,
          {
            client_id: clientId,
            client_secret: clientSecret,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      this.logger.log(
        `Fetched access token success in ${Date.now() - start}ms`,
      );

      return result.data;
    } catch (error) {
      this.logger.error(
        `Failed to get access token in ${Date.now() - start}ms`,
      );

      throw new RequestError({
        error,
        message: 'Failed to get satu sehat access token',
      });
    }
  }

  /**
   * Get provinces list from master data
   * @param accessToken
   */
  public async getMasterDataProvinces(
    accessToken: string,
  ): Promise<GetProvincesMasterDataResponse> {
    try {
      const url = new URL(
        `${this.satuSehatConf.baseUrl}/masterdata/v1/provinces`,
      );

      const result = await firstValueFrom(
        this.httpService.get<GetProvincesMasterDataResponse>(url.href, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return result.data;
    } catch (error) {
      throw new RequestError({
        error,
        message: 'Failed to get provinces list from master data',
      });
    }
  }

  /**
   * Get cities list from master data
   * @param accessToken
   * @param provinceCode
   */
  public async getMasterDataCities(accessToken: string, provinceCode: string) {
    try {
      const url = new URL(`${this.satuSehatConf.baseUrl}/masterdata/v1/cities`);

      url.searchParams.append('province_codes', provinceCode);

      const result = await firstValueFrom(
        this.httpService.get<GetProvincesMasterDataResponse>(url.href, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return result.data;
    } catch (error) {
      throw new RequestError({
        error,
        message: 'Failed to get cities list from master data',
      });
    }
  }

  /**
   * Get districts list from master data
   * @param accessToken
   * @param cityCode
   */
  public async getMasterDataDistricts(accessToken: string, cityCode: string) {
    try {
      const url = new URL(
        `${this.satuSehatConf.baseUrl}/masterdata/v1/districts`,
      );

      url.searchParams.append('city_codes', cityCode);

      const result = await firstValueFrom(
        this.httpService.get<GetProvincesMasterDataResponse>(url.href, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return result.data;
    } catch (error) {
      throw new RequestError({
        error,
        message: 'Failed to get districts list from master data',
      });
    }
  }
  /**
   * Get sub-districts list from master data
   * @param accessToken
   * @param districtCode
   */
  public async getMasterDataSubDistricts(
    accessToken: string,
    districtCode: string,
  ) {
    try {
      const url = new URL(
        `${this.satuSehatConf.baseUrl}/masterdata/v1/sub-districts`,
      );

      url.searchParams.append('district_codes', districtCode);

      const result = await firstValueFrom(
        this.httpService.get<GetProvincesMasterDataResponse>(url.href, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return result.data;
    } catch (error) {
      throw new RequestError({
        error,
        message: 'Failed to get sub-districts list from master data',
      });
    }
  }
}
