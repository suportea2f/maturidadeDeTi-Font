export interface IDashboardData {
  generalKPIs: {
    totalEvaluations: number;
    evaluationsInProgress: number;
    evaluationsFinished: number;
  };
  participationKPIs: {
    totalParticipantsInvited: number;
    totalParticipantsFinished: number;
    completionRate: number;
  };
  maturityKPIs: {
    averageScore: number;
    maturityLevelDistribution: {
      [level: string]: number;
    };
  };
} 