/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Agent } from "http";
import {
  html,
  LitElement,
  customElement,
  internalProperty,
  property,
  query,
} from "lit-element";
import { Desktop } from "@wxcc-desktop/sdk";
import styles from "./showSurvey.scss";
import {
  ESC_KEY_CODE,
  SURVEY_CONTENT_CHARACTER_LIMIT,
  LEAVE_FEEBACK_BELOW,
  ENTER_KEY_CODE,
  SPACE_KEY_CODE,
  TYPE_FEEDBACK_HERE,
} from "../constants";
import { checkIfSpaceOrEnterKeydown, getTimestampInLocale, getTimeNow, showLocalStorage } from "../Utils";
import { EventEmitter } from "stream";
const Axios = require("Axios");
const {
  config,
  i18n,
  actions,
  agentContact,
  agentStateInfo,
  dialer,
  logger,
  screenpop,
  shortcutKey,
} = Desktop;
import { WxmConnection } from "./HelperFunctions";
import { SurveyGeneration } from "./SurveyGeneration";

interface MenuElement extends HTMLElement {
  isOpen: boolean;
}
@customElement("show-survey")
export default class ShowSurvey extends LitElement {

  @property({ type: Boolean }) darkTheme = true;
  @property({ type: Boolean }) lumos = false;
  @property({ type: Boolean }) isOpen = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String, attribute: "placement" }) menuOverlayPlacement ="bottom";
  @property({ type: Boolean }) showArrow = false;
  @property({ type: Boolean }) isError = false;
  @property({ type: String, attribute: "size" }) menuOverlaySize = "large";
  @property({ type: String, attribute: "maxHeight" }) maxHeight = "";
  @property({ type: String, attribute: "customWidth" }) customWidth = "";
  @property({ type: Boolean, reflect: true }) isClicked = false;
  @property({ type: String }) access_token = '';
  @property({ type: String }) survey_id = "";
  @property({ type: Array }) formBody: Array<string> = [];
  @property({ type: String }) urlString = "";
  
  @property({ type: String, attribute: "value" }) feedback = "";
  @property({ type: Boolean }) isConnected = false;
  @property({ type: Number }) npsSelected = 0;
  @property({ type: String }) connError = "Sorry, This connection is not available: ";
  @property({ type: String }) agentId = "";
  @property({ type: String }) teamId = "";
  @property({ type: String }) orgId = "";
  @property({ type: String, reflect: true }) connected = "true";

  @query(".container") container!: HTMLElement;
  @query("md-menu-overlay") survey!: MenuElement | undefined;
  // Axios Functions for WxM
  wxm: any = "";
  // Survey Configurations
  surveyConf: any = ""; 
  // Survey Class
  surveyConfig: any = "";
  // Survey Prefills
  prefillData: any = "";
  // Connection Error Messages
  errMsg: any = "";
  // Survey Duration  
  timeStart: number = 0;
  timeEnd: number = 0;
  // Last Survey by this Agent (4 Hr Minimum between Surveys)
  lastSurvey: number = 0;

  static get observedAttributes() {
    return ['connected'];
  }

  attributeChangedCallback(attrName : string, oldVal : string, newVal : string) {
    if(attrName === "connected") {
      console.log("Attribute Changed: " + newVal);
    }
  }
  constructor() {
    // Always call super first in constructor
    super();
    console.log("Constructor Called! " + this.agentId);
    this.init();
    this.wxm = new WxmConnection();
    
  }
  connectedCallback(): void {
    super.connectedCallback();
    console.log("Callback has happened");
    console.log("Agent Id: " + this.agentId + "Team Id: " + this.teamId + " Org Id: " + this.orgId);
    this.surveyConfig = new SurveyGeneration(this.agentId, this.teamId, this.orgId, this.survey_id);
    this.surveyConf = JSON.parse(this.surveyConfig.getSurveyConfig());
    this.prefillData = JSON.parse(this.surveyConfig.getPrefills());
    if(localStorage.getItem("token") == null || localStorage.getItem("surveyId") == null) {
      this.wxm.getAPIToken();
      console.log("Connection: " + this.connected);
    }
  }
  
  async init() {
    await Desktop.config.init();
  }
  static get styles() {
    return styles;
  }
  

  private handleFeedbackDetailsUpdate(name: string, value: any, selected: Number) {
    console.log("Handling Details: " + name + " Details: " + value + " Selected: " + selected);
    this.imgFunction(selected);
  }
  
  closeSurvey = () => {
    this.survey ? (this.survey.isOpen = false) : null;
    this.survey!.removeAttribute("style");
  };
    
  // Network Error: Log to console and Widget
  private showConnectionError(errorMsg: object) {
    this.requestUpdate();
    this.isError = true;
    var q = this.shadowRoot?.getElementById("comments");
    q!.innerHTML = this.connError + errorMsg;
    console.log(this.connError + errorMsg);
    
  }
  // Manipulate Stars to show selection based on 'Mouse' Event
  private imgFunction(selected: Number) {
    console.log("Got STAR: " + selected);
    this.surveyConf.responses[0].valueId = selected;
  }
  
  private checkForKeyDown = (event: KeyboardEvent, handleAction: any) => {
    if (checkIfSpaceOrEnterKeydown(event.code)) {
      if (event.code === ENTER_KEY_CODE || event.code === SPACE_KEY_CODE) {
        console.log("Checking for key down: " + event.code);
        handleAction(event);
      }
    }
  };
  private handleStarSelection = (event: KeyboardEvent | any) => {
    console.log("Star selected: " + event.target.npsSelected);
    this.surveyConfig.responses[0].valueId = event.target.npsSelected;
    
  };
  private feedbackDetailsUpdate(name: string, value: any) {
    this.feedback = value;
  }
  // Assemble the data to pass to WxM
  private postSurvey(a: string) {
    console.log("Post Survey: " + a);
    var fb = this.shadowRoot?.getElementById("feedback");
    console.log("feedback: " + fb?.getAttribute("value"));
    var myFeedback = fb?.getAttribute("value");
    var responseDateTimeValue = new Date();
    var responses1 = [];
    
    // Add the first questions answers
    var res = {
      questionId: this.surveyConf.responses[0].questionId,
      questionText: this.surveyConf.responses[0].questionText,
      textInput:
        this.surveyConf.responses[0].questionType == "Text"
          ? this.surveyConf.responses[0].valueId
          : null,
      numberInput:
        this.surveyConf.responses[0].questionType == "Number"
          ? parseInt(this.surveyConf.responses[0].valueId)
          : null,
    };
    responses1.push(res);
    responses1.push(this.prefillData.prefill1);
    responses1.push(this.prefillData.prefill2);
    responses1.push(this.prefillData.prefill3);
    
    // Add the feedback
    var res2 = {
      questionId: this.surveyConf.responses[4].questionId,
      questionText: this.surveyConf.responses[4].questionText,
      textInput:
        this.surveyConf.responses[4].questionType == "Text"
          ? myFeedback
          : null,
      numberInput:
        this.surveyConf.responses[4].questionType == "Number"
          ? parseInt(this.surveyConf.responses[4].valueId)
          : null,
    };
    responses1.push(res2);
    // adding the responses to post survey API
    var object = {
      id: null,
      locationId: null,
      nps: 0,
      responseDateTime: responseDateTimeValue,
      responseDuration: ((getTimeNow() - this.timeStart) / 1000),
      responses: responses1,
      surveyClient: "JS-Web",
      user: "cctmedemo",
    };
    localStorage.setItem("surveyDuration", getTimeNow().toString());
    this.wxm.surveyByToken(object);
    this.closeSurvey();
  }

  render() {
    console.log("Rendering: " + this.isError);
    if (this.isError) {
      return html`
        <md-theme class="theme-toggle" id="menu-overlay" ?darkTheme=${false} ?lumos=${true}> 
          <md-menu-overlay
            style="margin: 10rem"
            placement=${"bottom"}
            size=${"large"}
            max-height=${""}
            custom-width=${""}
            ?is-open=${false}
            ?show-arrow=${false}
            ?disabled=${false}
            @menu-overlay-open=${(e: String) => {this.openSurvey(e);}}
            @menu-overlay-close=${(e: any) => {console.log("closed");}}
          >
          <md-icon>slot="menu-trigger" variant="primary" name="add-poll_14"></md-icon>
            <div style="padding:1.25rem ; width: 100%;">
                <div style="text-align: center">
                  <p id="no-connection" class="no-connection" style="margin-bottom: .5rem">${this.surveyConf.responses[0].questionText}</p>
                    <div id="preloader" class="loader">
                    </div>
              </div>  
          </md-menu-overlay>      
        </md-theme>
     `;
    } else {
      return html`
      <md-theme class="theme-toggle" id="menu-overlay" ?darkTheme=${false} ?lumos=${true}> 
      <md-menu-overlay
            id="menu-overlay"
            class="menu-overlay"
            style="margin: 10rem"
            placement=${"bottom"}
            size=${"large"}
            max-height=${"323px"}
            custom-width=${"368px"}
            ?is-open=${false}
            ?show-arrow=${false}
            ?disabled=${false}
            @menu-overlay-open=${(e: String) => {
              this.openSurvey(e);
            }}
            @menu-overlay-close=${(e: any) => {
              console.log("closed");
            }}
          >
            <!-- <md-icon slot="menu-trigger" variant="primary" name="like_16"></md-icon> -->
            <md-tooltip slot="menu-trigger" placement="bottom" message="Desktop Survey">
              <span>
                <md-icon slot="menu-trigger" variant="primary" name="like_16"></md-icon>
              </span>
            </md-tooltip>
               <div style="padding:1.00rem ; width: 100%; margin-top: 0px">
                  <div style="text-align: center; margin-top: 5px;">
                    <!-- Possible remove the above 2 div's -->
                    <p id="header-title" class="header-title" >${this.surveyConf.responses[0].questionText}</p>
                  </div>
                  <div id="main-page" class="login">
                    <div class="scroll-wrapper" style="max-height: 330px;">
                      <div class="outer-div" data-question-type="Star-5">
                        <div class="ng-star-inserted">
                          <div class="outer-div1" theme='dark' dir="auto">
                            <div class="inner-div">
                              <div class="blocks" id="rating"> 
                                <agentx-wc-feedback-favorite-btn
                                  .isFavorite=${false}
                                  .npsSelected=${this.npsSelected}
                                  @favorite-clicked=${(event: CustomEvent) => this.handleFeedbackDetailsUpdate("favorite", true, event.detail.npsSelected)}  
                                  @keypress=${(event: KeyboardEvent) => this.checkForKeyDown(event, this.handleStarSelection)}
                                ></agentx-wc-feedback-favorite-btn>
                              </div> <!-- End of Blocks -->
                            </div> <!-- End of Inner Div -->
                          </div> <!-- End of Outer Div 1 -->
                        </div> <!-- End of ng-star-inserted -->
                      </div> <!-- End of Outer Div -->
                      <!-- Feedback Question ID: 5eb122910bcbdc1798d2be53  -->
                      <p id="comments" class="comment" style="margin-bottom: .5rem">${LEAVE_FEEBACK_BELOW}</p>
                      <div
                        class="feedback-editor-wrapper"
                        style="border-left-color: "
                      >
                      <md-input
                          class="feedback-editor-content-input"
                          id="feedback"
                          value=${this.feedback}
                          multiline
                          autofocus
                          containerSize="large-12"
                          maxLength=${SURVEY_CONTENT_CHARACTER_LIMIT}
                          placeholder=${TYPE_FEEDBACK_HERE}
                          @input-change=${(event: CustomEvent) => this.feedbackDetailsUpdate("content", event.detail.value.trim())}
                        ></md-input>
                        <div class="feedback-editor-footer">
                          <!-- <span class="word-count">                                           Word Count:</span> -->
                          <span class="feedback-char-counter" >${`${this.feedback.length}/${SURVEY_CONTENT_CHARACTER_LIMIT}`}</span>
                        </div>
                      </div> <!-- End of Feedback Editor Wrapper -->
                    <div class="form__group">
                        <md-button color="blue" id="submit-survey" @click=${(e: MouseEvent) => this.postSurvey("document.getElementById('feedback').value")}><span>Submit</span>
                        </md-button>
                    </div>  
                  </div> <!-- End of Main Page -->
                </div>  <!-- End of First Div -->
          </md-menu-overlay>
      </md-theme>
    `;
    }
  }
  openSurvey(e: String) {
    console.log("Opened Survey!");
    // Initialize and get our Tokens
    if (!this.wxm.errMsg || !this.isConnected || this.access_token === '') {
      console.log("Connected....");
      showLocalStorage();
      this.timeStart = getTimeNow();
      var surveyTime: string | null = localStorage.getItem("surveyDuration");
      console.log("Submission Time: " + new Date(this.timeStart));
      if((this.timeStart - parseInt(surveyTime? surveyTime : "") < this.timeStart / (60*60*1000))) {
        console.log("Error: Multiple Surveys attempted within 4 hrs.");
        this.closeSurvey();
      }
      return;
    }
    else {
      this.isConnected = true; 
      console.log("Sending to Connection Error!")
      this.showConnectionError(this.wxm.errMsg);
    } 
    console.log("Connected Already!");
  }
}
