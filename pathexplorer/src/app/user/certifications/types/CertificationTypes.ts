
export interface CertificationItem {
  name: string;
  type: string;
  description: string;
  url: string;
}

export interface Certification {
  name: string;
  type: string;
  description: string;
  certification_date: string;
  expiration_date: string;
  certification_id: string;
  status: string;
  url?: string;
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
