export type Recommendation = {
  title: string;
  reason: string;
};

export type ResolvedRecommendation = Recommendation & {
  mal_id: number | null;
};
