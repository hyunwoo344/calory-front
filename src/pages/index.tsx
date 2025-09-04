import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { FoodAnalyzerAPI } from '@/services/api';
import { FoodAnalysis, UploadState } from '@/types';
import { 
  CameraIcon, 
  PhotoIcon, 
  ArrowUpTrayIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0
  });
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 파일 드롭 처리
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 이미지 미리보기 설정
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setAnalysisResult(null);

    // 업로드 상태 초기화
    setUploadState({
      uploading: true,
      progress: 0,
      error: undefined
    });

    try {
      // 음식 분석 API 호출
      const result = await FoodAnalyzerAPI.analyzeFood(
        file,
        (progress) => {
          setUploadState(prev => ({
            ...prev,
            progress
          }));
        }
      );

      if (result.success && result.data) {
        setAnalysisResult(result.data);
        toast.success('음식 분석이 완료되었습니다!');
      } else {
        throw new Error(result.message || '분석에 실패했습니다.');
      }

    } catch (error) {
      console.error('분석 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      
      setUploadState(prev => ({
        ...prev,
        error: errorMessage
      }));
    } finally {
      setUploadState(prev => ({
        ...prev,
        uploading: false
      }));
    }
  }, []);

  // 드롭존 설정
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const formatConfidence = (confidence: number): string => {
    return `${Math.round(confidence * 100)}%`;
  };

  const formatNutrition = (value: number): string => {
    return value < 1 ? `${(value * 1000).toFixed(0)}mg` : `${value.toFixed(1)}g`;
  };

  return (
    <>
      <Head>
        <title>Calory - AI 음식 칼로리 분석</title>
        <meta name="description" content="AI를 활용한 음식 사진 칼로리 분석 서비스" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 헤더 */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🥗 Calory
              </h1>
              <p className="ml-4 text-gray-600">
                AI 기반 음식 칼로리 분석
              </p>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* 업로드 섹션 */}
          <div className="card mb-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                음식 사진을 업로드하세요
              </h2>
              <p className="text-gray-600">
                AI가 음식을 인식하고 칼로리를 계산해드립니다
              </p>
            </div>

            {/* 드롭존 */}
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
            >
              <input {...getInputProps()} />
              
              {uploadState.uploading ? (
                <div className="flex flex-col items-center">
                  <div className="spinner mb-4"></div>
                  <p className="text-lg font-medium text-gray-900">
                    분석 중... {uploadState.progress}%
                  </p>
                  <div className="w-64 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-primary-500 transition-all duration-300 ease-out"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? '파일을 놓아주세요' : '클릭하거나 드래그하여 업로드'}
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, WEBP (최대 10MB)
                  </p>
                </div>
              )}

              {uploadState.error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{uploadState.error}</p>
                </div>
              )}
            </div>
          </div>

          {/* 분석 결과 */}
          {selectedImage && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 업로드된 이미지 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  업로드된 이미지
                </h3>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={selectedImage}
                    alt="업로드된 음식 이미지"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* 분석 결과 */}
              {analysisResult && (
                <div className="card animation-slide-up">
                  <div className="flex items-center mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      분석 결과
                    </h3>
                  </div>

                  {/* 음식명 & 신뢰도 */}
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {analysisResult.predicted_food.name}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <InformationCircleIcon className="h-4 w-4 mr-1" />
                      신뢰도: {formatConfidence(analysisResult.confidence)}
                    </div>
                  </div>

                  {/* 칼로리 정보 */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-primary-700 mb-1">추정 칼로리</p>
                      <p className="text-3xl font-bold text-primary-900">
                        {Math.round(analysisResult.estimated_calories)} kcal
                      </p>
                      <p className="text-sm text-primary-600">
                        ({analysisResult.estimated_weight.toFixed(0)}g 기준)
                      </p>
                    </div>
                  </div>

                  {/* 영양소 정보 */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900">영양소 정보 (100g당)</h5>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">단백질</span>
                        <span className="text-sm font-medium">
                          {formatNutrition(analysisResult.predicted_food.protein)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">탄수화물</span>
                        <span className="text-sm font-medium">
                          {formatNutrition(analysisResult.predicted_food.carbohydrates)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">지방</span>
                        <span className="text-sm font-medium">
                          {formatNutrition(analysisResult.predicted_food.fat)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">식이섬유</span>
                        <span className="text-sm font-medium">
                          {formatNutrition(analysisResult.predicted_food.fiber)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">나트륨</span>
                        <span className="text-sm font-medium">
                          {formatNutrition(analysisResult.predicted_food.sodium)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 사용법 안내 */}
          {!selectedImage && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                사용 방법
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    1
                  </span>
                  <p>음식 사진을 위 영역에 드래그하거나 클릭해서 업로드하세요</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    2
                  </span>
                  <p>AI가 자동으로 음식을 인식하고 칼로리를 계산합니다</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    3
                  </span>
                  <p>상세한 영양소 정보를 확인할 수 있습니다</p>
                </div>
              </div>
            </div>
          )}
          
        </main>
      </div>
    </>
  );
}
