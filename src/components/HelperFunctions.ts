import ShowSurvey from "./ShowSurvey";

const Axios = require("Axios");

export class WxmConnection {
  formBody: string[] = [];
  urlString: string = "";
  errMsg: string = "";

  bodyParameters= {
    userName: "cctmedemoadmin",
    password: "cR@ZY!123",
    grant_type: "password",
  };
  access_token: string = "";
  survey_id: string = "";

  constructor() {
    return this;
  }
  public getStatus() {
    return this.errMsg;
  }
  public urlEncode(details: any) {
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        this.formBody.push(encodedKey + "=" + encodedValue);
      }
      this.urlString = this.formBody.join("&");
  }

  public getAPIToken = async () => {
    // Encode the body
    this.urlEncode(this.bodyParameters);
    // Set the header
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    };
    console.log("About to Await...");
    await Axios.post("https://api.getcloudcherry.com/api/LoginToken", this.urlString, config)
      .then((res: any) => {
          console.log("RESPONSE ==== : ", res.data.access_token);
          this.access_token = res.data.access_token;
          localStorage.setItem('token',this.access_token);
          this.getSurveyToken();
         
      })
      .catch((err: any) => {
          this.errMsg = err;
          console.log("In getAPIToken: " + err);
          
      });
  }
  public getSurveyToken() {
    console.log("Token: " + this.access_token);

    const dt = {
      data: {
        user: "cctmedemoadmin",
        note: "WxCC Agent Survey",
        validTill: "null",
        validUses: -1,
        location: "62288ae40b43de3ecfb34112",
      },
    };
    const config = {
      headers: { Authorization: `Bearer ${this.access_token}` },
    };
    Axios.post("https://api.getcloudcherry.com/api/SurveyToken", dt, config)
      .then((res: any) => {
        console.log("RESPONSE ==== : ", res.data.id);
        this.survey_id = res.data.id;
        localStorage.setItem("surveyId", this.survey_id);
        this.errMsg = "Connected";
        return true;
      })
      .catch((err: any) => {
        this.errMsg = err;
        return false;
      });
  }
  // Submit the Survey Results
  public surveyByToken(dt: object) {
    console.log("Submitting: " + dt);
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    Axios.post(
      "https://api.getcloudcherry.com/api/SurveyByToken/" + localStorage.getItem("surveyId"), //this.survey_id,
      dt,
      config
    )
      .then((res: any) => {
        console.log("RESPONSE ==== : ", res.data.id);
        this.survey_id = res.data.id;
        this.errMsg = "Connected";
      })
      .catch((err: any) => {
        this.errMsg = err;
      });
  }
}


