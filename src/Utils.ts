import { Desktop } from "@wxcc-desktop/sdk";
import {  ENTER_KEY_CODE, SPACE_KEY_CODE } from "./constants";
import { agentId } from "./index";

const logger = Desktop.logger.createLogger("show-survey");

export const getTimestampInDateLocale = (timestamp: number): string => {
  const ts = new Date(timestamp);
  return `${ts.getDate()}/${ts.getMonth() + 1}/${ts.getFullYear()}`;
};

export const getTimestampInLocale = (timestamp: number): string => {
  if (getTimestampInDateLocale(timestamp) === getTimestampInDateLocale(Date.now())) {
    const ts = new Date(timestamp);
    return ts.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
  }
  return getTimestampInDateLocale(timestamp);
};
export const getTimeNow = () : number => {
  var rightNow : number = new Date().getTime();
  return rightNow;
}
export const showLocalStorage = () : void => {
  var i;
  console.log("local storage");
  console.log("Token: " + localStorage.getItem("token"));
  console.log("Survey Id: " + localStorage.getItem("surveyId"));
  var lsNormalTime = localStorage.getItem("surveyDuration");
  console.log("Last Survey Submitted: " + new Date(parseInt(lsNormalTime? lsNormalTime : "")))
  
}
const checkForAgentId = () => {
  if (!agentId) {
    logger.error("[Notes Widget] AgentId missing. Cannot fetch/update Notes");
    return false;
  }
  return true;
};


export const checkIfSpaceOrEnterKeydown = (keyCode: string): boolean => {
  if (keyCode === ENTER_KEY_CODE || keyCode === SPACE_KEY_CODE) {
    return true;
  }
  return false;
};
