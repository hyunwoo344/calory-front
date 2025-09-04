import axios, { AxiosResponse } from 'axios';
import { FoodItem, FoodAnalysis, ApiResponse, AnalyzeRequest } from '@/types';

// API 베이스 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API 응답: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API 응답 오류:', error);
    if (error.response?.status === 500) {
      console.error('서버 오류가 발생했습니다.');
    } else if (error.response?.status === 404) {
      console.error('요청한 리소스를 찾을 수 없습니다.');
    }
    return Promise.reject(error);
  }
);

// API 서비스 클래스
export class FoodAnalyzerAPI {
  
  // 서버 상태 확인
  static async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await apiClient.get('/health/');
      return response.data;
    } catch (error) {
      console.error('Health check 실패:', error);
      throw error;
    }
  }

  // 음식 목록 조회
  static async getFoods(): Promise<ApiResponse<FoodItem[]>> {
    try {
      const response: AxiosResponse<ApiResponse<FoodItem[]>> = await apiClient.get('/foods/');
      return response.data;
    } catch (error) {
      console.error('음식 목록 조회 실패:', error);
      throw error;
    }
  }

  // 음식 이미지 분석
  static async analyzeFood(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<FoodAnalysis>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response: AxiosResponse<ApiResponse<FoodAnalysis>> = await apiClient.post(
        '/analyze/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              onProgress(progress);
            }
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('음식 분석 실패:', error);
      throw error;
    }
  }

  // 분석 기록 조회
  static async getAnalysisHistory(): Promise<ApiResponse<FoodAnalysis[]>> {
    try {
      const response: AxiosResponse<ApiResponse<FoodAnalysis[]>> = await apiClient.get('/analysis/history/');
      return response.data;
    } catch (error) {
      console.error('분석 기록 조회 실패:', error);
      throw error;
    }
  }

  // 특정 분석 결과 조회
  static async getAnalysis(analysisId: number): Promise<ApiResponse<FoodAnalysis>> {
    try {
      const response: AxiosResponse<ApiResponse<FoodAnalysis>> = await apiClient.get(`/analysis/${analysisId}/`);
      return response.data;
    } catch (error) {
      console.error('분석 결과 조회 실패:', error);
      throw error;
    }
  }
}

export default FoodAnalyzerAPI;
