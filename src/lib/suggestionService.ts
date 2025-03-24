
import { supabase } from './supabase';
import { imageAnalysisService } from './imageAnalysisService';
import { trackEvent } from './analytics';

export interface SuggestionRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggerType: string;
  triggerThreshold: number;
  weight: number;
  conditions: Record<string, any>;
  actions: Array<{ type: string; payload: any }>;
}

export interface Suggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  ctaText: string;
  ctaAction: string;
  ctaPayload: any;
  imageUrl?: string;
  priority: number;
  discountCode?: string;
  discountAmount?: number;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

interface ImageAnalysisResult {
  emptyRoom: boolean;
  cluttered: boolean;
  exterior: boolean;
  isEveningShot: boolean;
  detectedObjects: string[];
  confidence: Record<string, number>;
}

export class SuggestionService {
  private static instance: SuggestionService;
  private suggestionsCache: Record<string, SuggestionRule[]> = {};
  private abTestSegment: string | null = null;

  private constructor() {
    // Initialize A/B test segment
    this.initializeAbTestSegment();
  }

  public static getInstance(): SuggestionService {
    if (!SuggestionService.instance) {
      SuggestionService.instance = new SuggestionService();
    }
    return SuggestionService.instance;
  }

  private async initializeAbTestSegment(): Promise<void> {
    // Assign the user to an A/B test segment
    const userId = supabase.auth.currentUser?.id;
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('ab_test_segments')
        .select('segment')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        this.abTestSegment = data.segment;
      } else {
        // Assign the user to a random segment (A, B, or C)
        const segments = ['A', 'B', 'C'];
        const randomSegment = segments[Math.floor(Math.random() * segments.length)];
        
        await supabase
          .from('ab_test_segments')
          .insert({
            user_id: userId,
            segment: randomSegment,
            created_at: new Date().toISOString()
          });
          
        this.abTestSegment = randomSegment;
      }
    } catch (error) {
      console.error('Error initializing A/B test segment:', error);
    }
  }
  
  // Get suggestion rules, with caching
  private async getSuggestionRules(): Promise<SuggestionRule[]> {
    const cacheKey = 'all';
    
    // Return cached rules if they exist and are less than 5 minutes old
    const cachedRules = this.suggestionsCache[cacheKey];
    const cacheTime = JSON.parse(localStorage.getItem('suggestionRulesCacheTime') || '0');
    const now = Date.now();
    
    if (cachedRules && (now - cacheTime < 5 * 60 * 1000)) {
      return cachedRules;
    }
    
    try {
      const { data, error } = await supabase
        .from('suggestion_rules')
        .select('*')
        .eq('enabled', true)
        .order('priority', { ascending: false });
        
      if (error) throw error;
      
      this.suggestionsCache[cacheKey] = data || [];
      localStorage.setItem('suggestionRulesCacheTime', JSON.now().toString());
      
      return data || [];
    } catch (error) {
      console.error('Error fetching suggestion rules:', error);
      return cachedRules || [];
    }
  }
  
  // Generate suggestions based on uploaded images
  public async getSuggestionsForImages(
    imageUrls: string[], 
    propertyType?: string
  ): Promise<Suggestion[]> {
    if (!imageUrls.length) return [];
    
    const suggestions: Suggestion[] = [];
    
    try {
      // 1. Analyze images
      const analysisResults: ImageAnalysisResult[] = await Promise.all(
        imageUrls.map(url => this.analyzeImage(url))
      );
      
      // 2. Get active suggestion rules
      const rules = await this.getSuggestionRules();
      
      // 3. Check each rule against analysis results
      for (const rule of rules) {
        if (!rule.enabled) continue;
        
        // Apply A/B test variations if applicable
        if (rule.abTest && this.abTestSegment) {
          const abVariation = rule.abTest[this.abTestSegment];
          if (abVariation) {
            rule.conditions = { ...rule.conditions, ...abVariation.conditions };
            rule.actions = abVariation.actions || rule.actions;
          }
        }
        
        let matchesFound = 0;
        let totalConfidence = 0;
        
        // Check how many images match this rule's conditions
        for (const result of analysisResults) {
          if (this.matchesConditions(result, rule.conditions, propertyType)) {
            matchesFound++;
            totalConfidence += this.calculateConfidence(result, rule.conditions);
          }
        }
        
        // If enough matches found, generate a suggestion
        if (matchesFound >= rule.triggerThreshold) {
          const avgConfidence = matchesFound > 0 ? totalConfidence / matchesFound : 0;
          
          if (avgConfidence >= 0.7) { // Confidence threshold
            const suggestion = this.createSuggestion(rule, avgConfidence);
            if (suggestion) {
              suggestions.push(suggestion);
              
              // Track for analytics
              trackEvent('suggestion_generated', {
                suggestion_type: rule.name,
                confidence: avgConfidence,
                image_count: imageUrls.length,
                matches_found: matchesFound,
                ab_test_segment: this.abTestSegment,
              });
            }
          }
        }
      }
      
      // Sort by priority and limit to top 3
      return suggestions
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 3);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }
  
  // Analyze an image using the imageAnalysisService
  private async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    try {
      const analysis = await imageAnalysisService.analyzeImage(imageUrl);
      
      return {
        emptyRoom: analysis.scene_type === 'empty_room' && analysis.confidence > 0.7,
        cluttered: analysis.clutter_score > 0.6,
        exterior: analysis.scene_type === 'exterior' && analysis.confidence > 0.7,
        isEveningShot: analysis.time_of_day === 'evening' && analysis.confidence > 0.7,
        detectedObjects: analysis.detected_objects || [],
        confidence: {
          emptyRoom: analysis.scene_type === 'empty_room' ? analysis.confidence : 0,
          cluttered: analysis.clutter_score || 0,
          exterior: analysis.scene_type === 'exterior' ? analysis.confidence : 0,
          isEveningShot: analysis.time_of_day === 'evening' ? analysis.confidence : 0,
        }
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      return {
        emptyRoom: false,
        cluttered: false,
        exterior: false,
        isEveningShot: false,
        detectedObjects: [],
        confidence: {}
      };
    }
  }
  
  // Check if analysis results match rule conditions
  private matchesConditions(
    result: ImageAnalysisResult, 
    conditions: Record<string, any>,
    propertyType?: string
  ): boolean {
    // Simple condition matching
    if (conditions.emptyRoom && !result.emptyRoom) return false;
    if (conditions.cluttered && !result.cluttered) return false;
    if (conditions.exterior && !result.exterior) return false;
    if (conditions.isEveningShot && !result.isEveningShot) return false;
    
    // Property type matching
    if (conditions.propertyType && propertyType && 
        conditions.propertyType !== propertyType) {
      return false;
    }
    
    // Object detection matching
    if (conditions.requiredObjects && conditions.requiredObjects.length > 0) {
      const hasAllRequired = conditions.requiredObjects.every(obj => 
        result.detectedObjects.includes(obj)
      );
      if (!hasAllRequired) return false;
    }
    
    return true;
  }
  
  // Calculate confidence score based on matching conditions
  private calculateConfidence(
    result: ImageAnalysisResult, 
    conditions: Record<string, any>
  ): number {
    let totalScore = 0;
    let scoreCount = 0;
    
    if (conditions.emptyRoom) {
      totalScore += result.confidence.emptyRoom || 0;
      scoreCount++;
    }
    
    if (conditions.cluttered) {
      totalScore += result.confidence.cluttered || 0;
      scoreCount++;
    }
    
    if (conditions.exterior) {
      totalScore += result.confidence.exterior || 0;
      scoreCount++;
    }
    
    if (conditions.isEveningShot) {
      totalScore += result.confidence.isEveningShot || 0;
      scoreCount++;
    }
    
    return scoreCount > 0 ? totalScore / scoreCount : 0;
  }
  
  // Create a suggestion from a rule
  private createSuggestion(rule: SuggestionRule, confidence: number): Suggestion | null {
    try {
      // Get the first action (typically we just have one per rule)
      const action = rule.actions[0];
      if (!action) return null;
      
      // Generate a unique ID for this suggestion
      const id = `${rule.id}_${Date.now()}`;
      
      return {
        id,
        type: rule.name,
        title: action.payload.title,
        description: action.payload.description,
        ctaText: action.payload.ctaText,
        ctaAction: action.type,
        ctaPayload: action.payload,
        imageUrl: action.payload.imageUrl,
        priority: rule.weight * confidence, // Priority is based on rule weight and confidence
        discountCode: action.payload.discountCode,
        discountAmount: action.payload.discountAmount,
        expiresAt: action.payload.expiresAt,
        metadata: {
          ruleId: rule.id,
          confidence,
          abTestSegment: this.abTestSegment,
        }
      };
    } catch (error) {
      console.error('Error creating suggestion:', error);
      return null;
    }
  }
  
  // Record when a user interacts with a suggestion
  public async trackSuggestionInteraction(
    suggestionId: string, 
    action: 'view' | 'click' | 'dismiss',
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('suggestion_interactions')
        .insert({
          suggestion_id: suggestionId,
          user_id: supabase.auth.currentUser?.id,
          action,
          metadata,
          created_at: new Date().toISOString()
        });
        
      // Track for analytics
      trackEvent('suggestion_interaction', {
        suggestion_id: suggestionId,
        action,
        ...metadata
      });
    } catch (error) {
      console.error('Error tracking suggestion interaction:', error);
    }
  }
}

// Export a singleton instance
export const suggestionService = SuggestionService.getInstance();
