/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { LitElement } from "lit-element";
interface MenuElement extends HTMLElement {
    isOpen: boolean;
}
export default class ShowSurvey extends LitElement {
    darkTheme: boolean;
    lumos: boolean;
    isOpen: boolean;
    disabled: boolean;
    menuOverlayPlacement: string;
    showArrow: boolean;
    isError: boolean;
    menuOverlaySize: string;
    maxHeight: string;
    customWidth: string;
    isClicked: boolean;
    access_token: string;
    survey_id: string;
    formBody: Array<string>;
    urlString: string;
    feedback: string;
    isConnected: boolean;
    npsSelected: number;
    connError: string;
    agentId: string;
    teamId: string;
    orgId: string;
    container: HTMLElement;
    survey: MenuElement | undefined;
    wxm: any;
    surveyConf: any;
    surveyConfig: any;
    prefillData: any;
    constructor();
    connectedCallback(): void;
    init(): Promise<void>;
    static get styles(): import("lit-element").CSSResult;
    private handleFeedbackDetailsUpdate;
    closeSurvey: () => void;
    private showConnectionError;
    private imgFunction;
    private checkForKeyDown;
    private handleStarSelection;
    private feedbackDetailsUpdate;
    private postSurvey;
    render(): import("lit-element").TemplateResult;
    openSurvey(e: String): void;
}
export {};
