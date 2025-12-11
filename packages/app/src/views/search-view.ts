import { define } from "@calpoly/mustang"
import { css, html, LitElement } from "lit";
// import { property, state } from "lit/decorators.js";
import { WritingCard } from "../components/writing-card";
import page from "../styles/page.css";
import reset from "../styles/reset.css";
// import reset from "../styles/reset.css.ts";
/* only need this for specific custom components */

export class SearchViewElement extends LitElement {
    static uses = define({
        "writing-card": WritingCard
    });


    
    render() {
        return html`
            <h2>Public Writing</h2>

                <div class="grid">

                    <writing-card icon="icon_character" title="Popular Characters" type="character" class="characters" src="./data/characters.json">
                    </writing-card>

                    <writing-card icon="icon_setting" title="Popular Settings" type="setting" class="settings" src="./data/settings.json">
                    </writing-card>

                    <writing-card icon="icon_plot" title="Popular Plots" type="plot" class="plots" src="./data/plots.json">
                    </writing-card>

                    <writing-card icon="icon_worldbuild" title="Popular Worlds" type="world" class="worlds" src="./data/worlds.json">
                    </writing-card>

                </div><br>

                <label id="dark">
                    <input type="checkbox" autocomplete="off" id="darkmode" />
                    Light Mode
                </label>
        `;
    }

    static styles = [reset.styles, page.styles, css`
        /* MAKE SURE THIS IS SPECIFIC TO CATEGORIES */

        /* GRID */
        .grid {
            --col-num: 4;
            
            display: grid;
            grid-template-columns: repeat(var(--col-num), 1fr);
            gap: var(--grid-spacing);
            padding: var(--padding);
        }

        .characters, .settings, .plots, .worlds {
            border: 1px solid var(--color-light-text);
            grid-column: span 1;
        }

        /* .characters ul, .settings ul, .plots ul, .worlds ul{
            place-items: center;
            list-style-type: none;
            padding-left: 0;
        } */


        @media screen and (max-width: 75rem) {
            .grid {
                --col-num: 3;
            }
        }

        @media screen and (max-width: 55rem) {
            .grid {
                --col-num: 2;
            }
        }

        @media screen and (max-width: 35rem) {
            .grid {
                --col-num: 1;
            }
        }
    `    
    ]

  // more to come
}