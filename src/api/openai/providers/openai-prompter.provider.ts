import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenaiPrompterProvider {
  // constructor() {}

  public getPromptTemplateForRMEDiagnosis(
    anamnesis: string,
    examination: string,
  ): string {
    const prompt = `
      Kamu adalah asisten dokter gigi yang membantu memberikan rekomendasi diagnosis dan kode ICD-10.
      Berdasarkan data di bawah ini, berikan 1–3 kemungkinan diagnosis yang relevan dan kode ICD-10-nya.

      Format output:
      [
        {
          "diagnosis": "teks",
          "icd10": "<kode ICD-10> - <nama ICD-10 dalam bahasa inggris>",
          "reasoning": "penjelasan singkat kenapa diagnosis ini cocok"
        }
      ]

      Petunjuk:
      1. Buat banyak kemungkinan diagnosis (2-4) diurutkan berdasarkan kemungkinan/relavansi. Jika kamu yakin hanya 1 diagnosis yang mungkin, berikan hanya 1
      2. Pertimbangkan diagnosis diferensial berdasarkan gejala dan temuan klinis
      3. Kode ICD-10 harus akurat dan dari database resmi yang disediakan
      4. Tangani format yang berantakan (tanda titik, jeda baris, spasi) dengan baik
      5. Kembalikan hanya format JSON yang valid

      Pendekatan diagnosa:
      - Analisa temuan klinis (clinical examination) dengan teliti
      - Korelasikan dengan temuan pemeriksaan klinis
      - Pertimbangkan beberapa kemungkinan berdasarkan bukti yang disajikan
      - Urutkan rekomendasi berdasarkan probabilitas/kemungkinan
      - Berikan kode ICD-10 yang sesuai untuk setiap diagnosis

      Contoh (berdasarkan dataset):
      Pasien datang dengan keluhan gigi ngilu ketika minum dan terkena dingin → Pulpitis reversible (K04.01)
      Pasien datang dengan pipi kanan bengkak, nyeri tekan → Abses periapikal odontogenik (K04.7)

      Sekarang gunakan format yang sama untuk data ini:

      Anamnesa: ${anamnesis}
      Klinis: ${examination}
    `;

    return prompt;
  }
}
