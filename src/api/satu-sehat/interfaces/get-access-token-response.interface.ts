export interface GetAccessTokenResponse {
  refresh_token_expires_in: string;
  api_product_list: string;
  api_product_list_json: string[];
  organization_name: string;
  'developer.email': string;
  token_type: string;
  issued_at: string;
  client_id: string;
  access_token: string;
  application_name: string;
  scope: string;
  expires_in: string;
  refresh_count: string;
  status: string;
}
