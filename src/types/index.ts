// 음식 정보 타입
export interface FoodItem {
  id: number;
  name: string;
  calories_per_100g: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sodium: number;
  created_at: string;
  updated_at: string;
}

// 음식 분석 결과 타입
export interface FoodAnalysis {
  id: number;
  image_url: string;
  predicted_food: FoodItem;
  confidence: number;
  estimated_weight: number;
  estimated_calories: number;
  analysis_time: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
  errors?: Record<string, string[]>;
}

// 음식 분석 요청 타입
export interface AnalyzeRequest {
  image: File;
}

// 영양소 정보 타입
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sodium: number;
  weight: number;
}

// UI 상태 타입
export interface UploadState {
  uploading: boolean;
  progress: number;
  error?: string;
}

// 분석 결과 요약 타입
export interface AnalysisSummary {
  foodName: string;
  calories: number;
  confidence: number;
  weight: number;
  nutritionBreakdown: {
    protein: { value: number; percentage: number };
    carbs: { value: number; percentage: number };
    fat: { value: number; percentage: number };
  };
}
