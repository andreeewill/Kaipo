export interface GetDiagnosisRecommendation {
  recommendations: {
    diagnosis: string;
    icd10: string;
    reasoning: string;
  }[];
  summary: string;
}
