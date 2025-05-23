export interface CertificationItem {
  name: string;
  type: string;
  description: string;
}

export interface AICertificationRecommendation {
  message: string;
  certifications: CertificationItem[];
}

export interface UseGetAICertificationRecommendationsResponse {
  data: AICertificationRecommendation | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  reset: () => void;
}
