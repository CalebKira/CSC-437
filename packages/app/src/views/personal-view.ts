import { define } from "@calpoly/mustang"
import { css, html, LitElement } from "lit";
import { WritingCard } from "../components/writing-card";
// import { property, state } from "lit/decorators.js";
import page from "../styles/page.css";
import reset from "../styles/reset.css";
// import reset from "../styles/reset.css.ts";
/* only need this for specific custom components */

export class PersonalViewElement extends LitElement {
    static uses = define({
        "writing-card": WritingCard
    });


    
    render() {
        return html`
            <h2 class="page-title">My Writing</h2>

                <!-- Be in grid form -->
                <div class="grid">

                    <!-- Side Bar -->
                    <div class="sidebar">
                        <a href="/app/post">
                            <svg class="icon">
                                <use href="../../icons/page_icons.svg#icon_post" />
                            </svg>
                            Post
                        </a><br>

                        <a href="/app/share">
                            <svg class="icon">
                                <use href="../../icons/page_icons.svg#icon_share" />
                            </svg>
                            Share
                        </a><br>

                        <a href="/app/writing">
                            <svg class="icon">
                                <use href="../../icons/page_icons.svg#icon_personal" />
                            </svg>
                            Create
                        </a>
                    </div>

                    <!-- All the rest of the cards -->
                    <!-- <div class="characters">
                        <h3>
                            <svg class="icon">
                                <use href="./icons/page_icons.svg#icon_character" />
                            </svg>
                            Characters
                        </h3>
                        <ul>
                            <li><a href="./writing.html">Character 1</a></li>
                            <li><a href="./writing.html">Character 2</a></li>
                            <li><a href="./writing.html">Character 3</a></li>
                        </ul>
                    </div> -->

                    <writing-card icon="icon_character" title="Characters" type="character" class="characters" src="personal">
                        <!-- defining type for the internal css and class for grid external stuff -->
                        <!-- <li><a href="./writing.html">Character 1</a></li>
                        <li><a href="./writing.html">Character 2</a></li>
                        <li><a href="./writing.html">Character 3</a></li> -->
                    </writing-card>

                    <writing-card icon="icon_setting" title="Settings" type="setting" class="settings" src="personal">
                    </writing-card>

                    <writing-card icon="icon_plot" title="Plots" type="plot" class="plots" src="personal">
                    </writing-card>

                    <writing-card icon="icon_worldbuild" title="Worlds" type="world" class="worlds" src="personal">
                    </writing-card>
                    <!-- make this so t doesn't have the title in the attributes -->

                </div><br>

                <label id="dark">
                    <input type="checkbox" autocomplete="off" id="darkmode" />
                    Light Mode
                </label>
        `;
    }

    static styles = [reset.styles, page.styles, css`
        /* Index page organization */

        /* GRID */
        .grid {
            display: grid;
            grid-template-columns: 2fr 2fr 2fr 2fr 1fr;
            grid-template-areas: 
                "characters settings plots worlds sidebar";
            gap: var(--grid-spacing);
            padding: var(--padding);
        }

        .characters, .settings, .plots, .worlds {
            border: 1px solid var(--color-light-text);
        }

        /* .characters ul, .settings ul, .plots ul, .worlds ul{
            place-items: center;
            list-style-type: none;
            padding-left: 0;
        } */

        .characters {
            grid-area: characters;
        }
        .settings {
            grid-area: settings;
        }
        .plots {
            grid-area: plots;
        }
        .worlds {
            grid-area: worlds;
        }

        .sidebar a{
            grid-area: sidebar;
            font-family: var(--font-header-family);
        }


        /* checking the size and organizing the look depending */
        @media screen and (max-width: 60rem) {
            .grid {
                display: grid;
                grid-template-columns: 2fr 2fr 2fr 1fr;
                grid-template-areas: 
                    "characters settings plots sidebar"
                    "worlds worlds worlds sidebar";
                    /* hardcoded because of the side bar */
                gap: var(--grid-spacing);
                padding: var(--padding);
            }
        }

        @media screen and (max-width: 45rem) {
            .grid {
                display: grid;
                grid-template-columns: 2fr 2fr 1fr;
                grid-template-areas: 
                    "characters settings sidebar"
                    "plots worlds sidebar";
                gap: var(--grid-spacing);
                padding: var(--padding);
            }
        }

        @media screen and (max-width: 35rem) {
            .grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                grid-template-areas: 
                    "characters sidebar"
                    "settings sidebar"
                    "plots sidebar"
                    "worlds sidebar";
                gap: var(--grid-spacing);
                padding: var(--padding);
            }
        }

        @media screen and (max-width: 30rem) {
            .grid {
                display: grid;
                grid-template-columns: 2fr;
                grid-template-areas: 
                    "sidebar"
                    "characters"
                    "settings"
                    "plots"
                    "worlds";
                gap: var(--grid-spacing);
                padding: var(--padding);
            }
        }
    `    
    ]

  // more to come
}