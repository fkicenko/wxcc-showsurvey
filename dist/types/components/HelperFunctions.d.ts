export declare class WxmConnection {
    formBody: string[];
    urlString: string;
    bodyParameters: {
        userName: string;
        password: string;
        grant_type: string;
    };
    access_token: string;
    survey_id: string;
    constructor();
    private urlEncode;
    getAPIToken(): void;
    getSurveyToken(): void;
    surveyByToken(dt: object): void;
}
