import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";


export class WritingCard extends LitElement {
    @property({ type: String }) type?: string;
    @property({ type: String }) icon = "icon_logo";
    @property({ type: String}) title = "Writing Card";
    /* defining the properties I want as attributes in custom element */
    
    /* don't need a cconstructor */
    override render() {
        return html`
        <div class="${this.type}">
            <h3>
                <svg class="icon">
                    <use href="./icons/page_icons.svg#${this.icon}" />
                </svg>
                ${this.title}
            </h3>
            <ul>
                <slot></slot>
            </ul>
        </div>
        `;
    }
    /* using a slot to hold the links to all the characters */

    static styles = [reset.styles, css`
        h3 {
            background-color: var(--color-h3);
            font-family: var(--font-header-family);
            font-weight: 500;
        }

        a {
            color: var(--color-link);
            text-decoration: none;
        }

        svg.icon {
            display: inline;
            height: 2em;
            width: 2em;
            vertical-align: top;
            color: inherit;
            fill: currentColor;
        }
    
        .characters, .settings, .plots, .worlds {
            border: 1px solid var(--color-light-text);
        }

        .characters ul, .settings ul, .plots ul, .worlds ul{
            place-items: center;
            list-style-type: none;
            padding-left: 0;
        }
    `];
    /* defining the CSS of this custom component specifically */
}