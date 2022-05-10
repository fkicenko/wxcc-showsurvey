export declare class SurveyGeneration {
    agentId: string;
    teamId: string;
    orgId: string;
    surveyConfig: Object;
    surveyId: string;
    prefill: Object;
    constructor(agentId: string, teamId: string, orgId: string, surveyId: string);
    getPrefills(): string;
    getSurveyConfig(): string;
}
