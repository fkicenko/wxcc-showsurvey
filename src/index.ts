/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  html,
  LitElement,
  customElement,
  css,
  property,
  query,
} from "lit-element";
import "./components/ShowSurvey";
import ShowSurvey from "./components/ShowSurvey";
/**
 * Please give your widget a unique name. We recommend using prefix to identify the author and help avoid naming conflict. e.g. "2ring-timer-widget"
 */
export let agentId = "";
export { FeedbackFavoriteBtn } from "./components/FeedbackFavoriteBtn/FeedbackFavoriteBtn";
@customElement("wxcc-survey")
export default class WxccSurvey extends LitElement {
  @query("show-survey") showSurvey!: ShowSurvey;
  @property({ type: String }) agentId = "";
  @property({ type: String }) teamId = "";
  @property({ type: String }) orgId = "";

  static get styles() {
    return css`
      :host {
        height: 100%;
        overflow: auto;
      }
    `;
  }

  render() {
    return html`
      <show-survey
        .agentId="${this.agentId}"
        .teamId="${this.teamId}"
        .orgId="${this.orgId}"
      ></show-survey>
    `;
  }
}
