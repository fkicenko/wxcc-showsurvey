/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { LitElement } from "lit-element";
import "./components/ShowSurvey";
import ShowSurvey from "./components/ShowSurvey";
/**
 * Please give your widget a unique name. We recommend using prefix to identify the author and help avoid naming conflict. e.g. "2ring-timer-widget"
 */
export declare let agentId: string;
export { FeedbackFavoriteBtn } from "./components/FeedbackFavoriteBtn/FeedbackFavoriteBtn";
export default class WxccSurvey extends LitElement {
    showSurvey: ShowSurvey;
    agentId: string;
    teamId: string;
    orgId: string;
    static get styles(): import("lit-element").CSSResult;
    render(): import("lit-element").TemplateResult;
}
