import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
// import reset from "../styles/reset.css.ts";
/* only need this for specific custom components */

export class HomeViewElement extends LitElement {
    render() {
        return html`
            <h1>Welcome to World Builder</h1> 
            <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

            <h1><a href="/app/search">Search</a> Other Worlds</h1>
            <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

            <h1>Create <a href="/app/personal">Personal</a> Universes</h1>
            <br><br><br><br><br><br><br><br><br><br><br><br>

            <br>
            
            <label id="dark">
                <input type="checkbox" autocomplete="off" id="darkmode" />
                Light Mode
            </label>
        `;
    }

    static styles = [css`
        h1{
            background-color: var(--color-h1);
            font-family: var(--font-header-family);
            font-weight: 900;
            padding-left: var(--padding);
            font-size: 10em;
        }

        .flex {
            display: flex;
            flex-wrap: wrap;
            gap: calc(var(--flex-spacing) * 10);
            padding: var(--padding);
            height: fit-content;
            margin: auto;
        }
    `    
    ]

  // more to come
}