export interface GetProvincesMasterDataResponse {
  status: number;
  error: boolean;
  message: string;
  data:
    | {
        code: string;
        parent_code: string;
        bps_code: string;
        name: string;
      }[]
    | null;
}

export interface FormattedProvinceMasterData {
  provinceCode: string;
  name: string;
}
