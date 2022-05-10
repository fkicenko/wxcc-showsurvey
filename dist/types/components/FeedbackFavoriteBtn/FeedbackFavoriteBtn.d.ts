import "@momentum-ui/web-components";
import { LitElement } from "lit-element";
export declare namespace FeedbackFavoriteBtn {
    /**
     * @element agentx-wc-feedback-favorite-btn
     * @fires favorite-clicked
     */
    class Element extends LitElement {
        isFavorite: boolean;
        npsSelected: number;
        private handleStarKeyDown;
        private handleFeedbackStarUpdate;
        static get styles(): import("lit-element").CSSResult;
        render(): import("lit-element").TemplateResult;
    }
}
