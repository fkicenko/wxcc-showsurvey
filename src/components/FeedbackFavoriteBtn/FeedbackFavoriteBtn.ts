/* eslint-disable @typescript-eslint/no-explicit-any */
import "@momentum-ui/web-components";
import { customElement, html, LitElement, property } from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import app from "../../assets/styles/localisation/app.json";
import style from "../showSurvey.scss";
import { checkIfSpaceOrEnterKeydown } from "../../Utils";

export namespace FeedbackFavoriteBtn {
  /**
   * @element agentx-wc-feedback-favorite-btn
   * @fires favorite-clicked
   */
  @customElement("agentx-wc-feedback-favorite-btn")
  export class Element extends LitElement {
    @property({ type: Boolean, reflect: true }) isFavorite = false;
    @property({ type: Number, reflect: true }) npsSelected = 0;

    private handleStarKeyDown = (event: KeyboardEvent) => {
      if (checkIfSpaceOrEnterKeydown(event.code)) {
        this.handleFeedbackStarUpdate(event);
      }
    };

    private handleFeedbackStarUpdate(event: CustomEvent | KeyboardEvent) {
      //event.stopPropagation();
      
      var cTarget = event.composedPath();
      var target = (cTarget[0] as unknown) as HTMLInputElement;
      var eElm = this.shadowRoot?.getElementById(target.id);
      let i:number = 1;
      var setFavorite = "icon-favorite-filled_28";
      var notFavorite = "icon-favorite_28";
      let ix:number = parseInt(target.id);
      this.npsSelected = ix;
      console.log("npsSelected: " + this.npsSelected);
      
      // Set all the favorites
      while(i >= 1 && i < (ix+1)) {
          var ixElm = this.shadowRoot?.getElementById(i.toString());
          ixElm?.setAttribute('name', setFavorite);
          ixElm?.setAttribute('class', 'favorite');
          i++;
      }
      // Set remaining to non-favorite
      while(i <= 5) {
          var ixElm = this.shadowRoot?.getElementById(i.toString());
          ixElm?.setAttribute('name', notFavorite);
          ixElm?.setAttribute('class', 'feedback-favorite-btn');
          i++;
      }
      this.dispatchEvent(
        new CustomEvent("favorite-clicked", {
          bubbles: true,
          composed: true,
          detail: {
            isFavorite: !this.isFavorite,
            npsSelected: this.npsSelected
          },
        })
      );
    }

    static get styles() {
      return style;
    }

    render() {
      return html`
        <md-tooltip
          message="Poor"
          placement="top"
        >
        <md-button id="1" color="color-none" size="40" circle aria-label="1 star rating"
          @click=${(event: CustomEvent) => this.handleFeedbackStarUpdate(event)}
          @keydown=${(event: KeyboardEvent) => this.handleStarKeyDown(event)}  
        >
          <md-icon
            class="feedback-favorite-btn ${classMap({favorite: this.isFavorite})}"
            aria-label="${this.isFavorite ? `${app.notes.removeFavorites}` : `${app.notes.addToFavorites}`}"
            id="1"
            name="${this.isFavorite ? "icon-favorite-filled_28" : "icon-favorite_28"}"
          ></md-icon>  
        </md-button>
      </md-tooltip> 
      <md-tooltip
          message="Fair"
          placement="top"
      > 
        <md-button id="2" color="color-none" size="40" circle aria-label="2 star rating"
          @click=${(event: CustomEvent) => this.handleFeedbackStarUpdate(event)}
          @keydown=${(event: KeyboardEvent) => this.handleStarKeyDown(event)}  
        >  
          <md-icon
            class="feedback-favorite-btn ${classMap({favorite: this.isFavorite})}"
            aria-label="${this.isFavorite ? `${app.notes.removeFavorites}` : `${app.notes.addToFavorites}`}"
            id="2"
            name="${this.isFavorite ? "icon-favorite-filled_28" : "icon-favorite_28"}"
           ></md-icon>
        </md-button>
      </md-tooltip>
      <md-tooltip
          message="Average"
          placement="top"
      >
        <md-button id="3" color="color-none" size="40" circle aria-label="3 star rating"
          @click=${(event: CustomEvent) => this.handleFeedbackStarUpdate(event)}
          @keydown=${(event: KeyboardEvent) => this.handleStarKeyDown(event)}  
        >
          <md-icon
            class="feedback-favorite-btn ${classMap({favorite: this.isFavorite})}"
            aria-label="${this.isFavorite ? `${app.notes.removeFavorites}` : `${app.notes.addToFavorites}`}"
            id="3"
            name="${this.isFavorite ? "icon-favorite-filled_28" : "icon-favorite_28"}"
            ></md-icon>
        </md-button>
      </md-tooltip>  
      <md-tooltip
          message="Good"
          placement="top"
      >
        <md-button id="4" color="color-none" size="40" circle aria-label="4 star rating"
          @click=${(event: CustomEvent) => this.handleFeedbackStarUpdate(event)}
          @keydown=${(event: KeyboardEvent) => this.handleStarKeyDown(event)}  
        >
          <md-icon
            class="feedback-favorite-btn ${classMap({favorite: this.isFavorite})}"
            aria-label="${this.isFavorite ? `${app.notes.removeFavorites}` : `${app.notes.addToFavorites}`}"
            id="4"
            name="${this.isFavorite ? "icon-favorite-filled_28" : "icon-favorite_28"}"
            ></md-icon>
        </md-button>
      </md-tooltip>  
      <md-tooltip
          message="Excellent"
          placement="top"
      >
        <md-button id="5" color="color-none" size="40" circle aria-label="5 star rating"
          @click=${(event: CustomEvent) => this.handleFeedbackStarUpdate(event)}
          @keydown=${(event: KeyboardEvent) => this.handleStarKeyDown(event)}  
        >
          <md-icon
            class="feedback-favorite-btn ${classMap({favorite: this.isFavorite})}"
            aria-label="${this.isFavorite ? `${app.notes.removeFavorites}` : `${app.notes.addToFavorites}`}"
            id="5"
            name="${this.isFavorite ? "icon-favorite-filled_28" : "icon-favorite_28"}"
            ></md-icon>
        </md-button>
      </md-tooltip>
      `;
    }
  }
}
