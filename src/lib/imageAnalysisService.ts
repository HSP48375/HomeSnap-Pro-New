
import { supabase } from './supabase';

export interface ImageAnalysisRequest {
  imageUrl: string;
  analysisTypes?: string[];
}

export interface ImageAnalysisResult {
  imageUrl: string;
  scene_type: string;
  time_of_day: string;
  clutter_score: number;
  detected_objects: string[];
  confidence: number;
  analysis_id: string;
  created_at: string;
}

class ImageAnalysisService {
  private static instance: ImageAnalysisService;
  private analysisCache: Record<string, ImageAnalysisResult> = {};
  
  private constructor() {}
  
  public static getInstance(): ImageAnalysisService {
    if (!ImageAnalysisService.instance) {
      ImageAnalysisService.instance = new ImageAnalysisService();
    }
    return ImageAnalysisService.instance;
  }
  
  public async analyzeImage(imageUrl: string, forceRefresh = false): Promise<ImageAnalysisResult> {
    // Check cache first
    if (!forceRefresh && this.analysisCache[imageUrl]) {
      return this.analysisCache[imageUrl];
    }
    
    try {
      // Check if we already have analysis for this image in the database
      const { data: existingAnalysis, error: lookupError } = await supabase
        .from('image_analysis')
        .select('*')
        .eq('image_url', imageUrl)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (!lookupError && existingAnalysis && !forceRefresh) {
        this.analysisCache[imageUrl] = existingAnalysis;
        return existingAnalysis;
      }
      
      // If we don't have existing analysis, request a new one
      const { data: requestData, error: requestError } = await supabase.functions.invoke('analyze-image', {
        body: { imageUrl, analysisTypes: ['scene', 'objects', 'quality'] }
      });
      
      if (requestError) throw requestError;
      
      // Store the analysis result in the database
      const { data: storedData, error: storeError } = await supabase
        .from('image_analysis')
        .insert({
          image_url: imageUrl,
          scene_type: requestData.scene_type,
          time_of_day: requestData.time_of_day,
          clutter_score: requestData.clutter_score,
          detected_objects: requestData.detected_objects,
          confidence: requestData.confidence,
          raw_response: requestData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (storeError) throw storeError;
      
      this.analysisCache[imageUrl] = storedData;
      return storedData;
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      // Return a default analysis result if we fail
      return {
        imageUrl,
        scene_type: 'unknown',
        time_of_day: 'unknown',
        clutter_score: 0,
        detected_objects: [],
        confidence: 0,
        analysis_id: 'error',
        created_at: new Date().toISOString()
      };
    }
  }
  
  public async batchAnalyzeImages(imageUrls: string[]): Promise<Record<string, ImageAnalysisResult>> {
    const results: Record<string, ImageAnalysisResult> = {};
    
    // Process in batches of 5 to avoid overloading the API
    const batchSize = 5;
    for (let i = 0; i < imageUrls.length; i += batchSize) {
      const batch = imageUrls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => this.analyzeImage(url).catch(err => {
          console.error(`Error analyzing image ${url}:`, err);
          return {
            imageUrl: url,
            scene_type: 'error',
            time_of_day: 'unknown',
            clutter_score: 0,
            detected_objects: [],
            confidence: 0,
            analysis_id: 'error',
            created_at: new Date().toISOString()
          };
        }))
      );
      
      batchResults.forEach((result, index) => {
        results[batch[index]] = result;
      });
    }
    
    return results;
  }
  
  public clearCache(): void {
    this.analysisCache = {};
  }
}

// Export a singleton instance
export const imageAnalysisService = ImageAnalysisService.getInstance();
