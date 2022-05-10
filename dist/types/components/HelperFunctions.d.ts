export declare class WxmConnection {
    formBody: string[];
    urlString: string;
    errMsg: string;
    bodyParameters: {
        userName: string;
        password: string;
        grant_type: string;
    };
    access_token: string;
    survey_id: string;
    constructor();
    getStatus(): string;
    urlEncode(details: any): void;
    getAPIToken: () => Promise<void>;
    getSurveyToken(): void;
    surveyByToken(dt: object): void;
}
