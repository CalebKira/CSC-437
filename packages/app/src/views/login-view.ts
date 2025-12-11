import { define } from "@calpoly/mustang"
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { LoginFormElement } from "../auth/login-form";
import page from "../styles/page.css";
import reset from "../styles/reset.css";
// import reset from "../styles/reset.css.ts";
/* only need this for specific custom components */

export class LoginViewElement extends LitElement {
    static uses = define({
        "login-form": LoginFormElement
    });
    
    render() {
        return html`
            <h2>Login</h2>
                <!-- <a href="./index.html">My Writing</a><br> -->

                <div class="grid">
                    <h3>
                        <svg class="icon">
                            <use href="../../icons/page_icons.svg#icon_profile" />
                        </svg>
                        Login:
                        <div class="divider"></div>
                    </h3>
                    <login-form api="/auth/login">
                        <h4>User Name:
                            <input name="username" autocomplete="off"></input>
                        </h4> 
                        <h4>Password:
                            <input type="password" name="password"></input>
                        </h4>
                    </login-form>
                    <br>
                    <h4>Or did you want to
                        <a href="/app/signup">Sign up as a new user</a>?
                    </h4>
                </div>

                <br>

                <br><br><br>
                <label id="dark">
                    <input type="checkbox" autocomplete="off" id="darkmode" />
                    Light Mode
                </label>
        `;
    }

    static styles = [reset.styles, page.styles, css`
        /* MAKE SURE THIS IS SPECIFIC TO POST */

        h2{
            text-align: center;
        }

        h3{
            width: 100%;
        }

        h4{
            width: 100%;
        }

        button {
            color: var(--color-dark-text);
            background-color: var(--color-light-text);
            font-family: var(--font-body-family);
        }

        .grid input {
            background-color: var(--color-background);
            color: var(--color-light-text-2);
            width: 100%;
            font-family: var(--font-body-family);
        }

        .divider{
            border: 1px solid var(--color-light-text);
            width: 100%;
        }

        /* GRID */
        .grid {
            display: flex;
            flex-wrap: wrap;
            padding: var(--padding);
            gap: var(--flex-spacing);
            border: 1px solid var(--color-light-text);
            width: 300px;
            height: fit-content;
            margin: auto;
        }
    `    
    ]

  // more to come
}