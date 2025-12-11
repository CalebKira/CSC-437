import { define } from "@calpoly/mustang"
import { css, html, LitElement } from "lit";
import { LoginFormElement } from "../auth/login-form";
// import { property, state } from "lit/decorators.js";
import page from "../styles/page.css";
import reset from "../styles/reset.css";
import post from "../styles/post.css";
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

    static styles = [reset.styles, page.styles, post.styles, css`

    `    
    ]

  // more to come
}