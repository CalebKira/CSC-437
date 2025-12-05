import { html, css, LitElement } from "lit";
import reset from "./styles/reset.css.ts";

export class NavBar extends LitElement {
/* don't need a cconstructor */
    override render() {
        /* FUTURE: add a reference to the home page here */
        return html`
        <div class="header">
            <a id="logo" href="">
                <svg class="icon">
                    <use href="./icons/page_icons.svg#icon_logo" />
                </svg>
                World Builder
            </a>
            
            <a href="./categories.html">
                <svg class="icon">
                    <use href="./icons/page_icons.svg#icon_search" />
                </svg>
                Search
            </a>

            <a href="./index.html">
                <svg class="icon">
                    <use href="./icons/page_icons.svg#icon_profile" />
                </svg>
                Personal
            </a>
        </div> <br>
        `;
    }
    /* using a slot to hold the links to all the characters */

    static styles = [reset.styles, css`
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
    
        div.header{
            display: flex;
            background-color: var(--color-background);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        div.header a{
            font-family: var(--font-header-family);
            font-size: var(--nav-other-font-size);
            margin: var(--nav-spacing);
        }

        #logo{
            /* the margin right makes only the logo left */
            margin-right: auto; 
            font-size: var(--nav-logo-font-size);
        }
    `];
    }