
export class SurveyGeneration {
    agentId: string = "";
    teamId: string = "";
    orgId: string = "";
    surveyConfig: Object = "";
    surveyId: string = "";
    prefill: Object = "";

    constructor(agentId: string, teamId: string, orgId: string, surveyId: string) {

        this.agentId = agentId;
        this.teamId = teamId;
        this.orgId = orgId;
        this.surveyId = surveyId;
    }

    //Create all the prefills in JSON
    getPrefills() {
    
        this.prefill =
            {
            prefill1 : {
                numberInput : "null",
                questionId : "5ec5525d55cec311b4284326",
                questionText : "Please enter your name",
                textInput : this.agentId
            },
            //Team Name
            prefill2 : {
                numberInput : "null",
                questionId : "62615574d01a7e7a9283e11a",
                questionText : "Please enter your team name",
                textInput : this.teamId 
            },
            //Org Id
            prefill3 : {
                numberInput : "null",
                questionId : "626a6e56d01a7e7a92855cfc",
                questionText : "Please enter your Organization Id",
                textInput : this.orgId
            }
        }
        return JSON.stringify(this.prefill);
    }
    getSurveyConfig() {
        this.surveyConfig = {
            baseURL: "https://api.getcloudcherry.com",
            SurveyToken: this.surveyId, 
        
            responses: [
                {
                    id: "text2",
                    questionId: "62288ae40b43de3ecfb34112",
                    questionText:
                    "How would you rate your experience with the desktop today?",
                    questionType: "Number",
                    valueId: "nps-value",
                },
                {
                    id: "text3",
                    questionId: "5ec5525d55cec311b4284326",
                    questionText: "Please enter your name",
                    questionType: "Text",
                    valueId: "comments",
                },
                {
                    id: "text5",
                    questionId: "62615574d01a7e7a9283e11a",
                    questionText: "Enter your Team Name",
                    questionType: "Text",
                    valueId: "teamId",
                },
                {
                    id: "text6",
                    questionId: "626a6e56d01a7e7a92855cfc",
                    questionText: "Enter your Organization Id",
                    questionType: "Text",
                    valueId: "orgId",
                },
                {
                    id: "text4",
                    questionId: "5eb122910bcbdc1798d2be53",
                    questionText: "Place Desktop Feedback here",
                    questionType: "Text",
                    valueId: "feedback",
                },
            ]
        }
        return JSON.stringify(this.surveyConfig);
    }
    
}