import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";
import { Auth, Observer, Events } from "@calpoly/mustang";

export class NavBar extends LitElement {
/* don't need a cconstructor */
    _authObserver = new Observer<Auth.Model>(this, "world:auth");

    @state()
    loggedIn = false;

    @state()
    userid?: string;


    connectedCallback() {
        super.connectedCallback();
        
        this._authObserver.observe((auth: Auth.Model) => {
        const { user } = auth;

        if (user && user.authenticated ) {
            this.loggedIn = true;
            this.userid = user.username;
        } else {
            this.loggedIn = false;
            this.userid = undefined;
        }
        
        console.log(this.userid);
        /* So cool! it changes the state values and checks if there has 
            ever been a login and reloads the page */
        });
    }

    renderSignOutButton() {
        return html`
            <button
            @click=${(e: UIEvent) => {
                Events.relay(e, "auth:message", ["auth/signout"])
            }}
            >
            Sign Out
            </button>
        `;
    }

    renderSignInButton() {
        return html`
            <a href="/login.html">
            Sign In…
            </a>
        `;
    }
    /* determines between the sign in and signout conditionally in the html below */

    override render() {
        /* FUTURE: add a reference to the home page here */
        return html`
        <div class="header">
            <a id="logo" href="./home.html">
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
                    <use href="./icons/page_icons.svg#icon_private" />
                </svg>
                Personal
            </a>


            <a slot="actuator">
                <svg class="icon">
                    <use href="./icons/page_icons.svg#icon_profile" />
                </svg>
                Hello, ${this.userid || "traveler"}
            </a>
            ${this.loggedIn ?
                this.renderSignOutButton() :
                this.renderSignInButton()
            }
        </div> <br>
        `;
    }
    /* using a slot to hold the links to all the characters */

    static styles = [reset.styles, css`
        a {
            color: var(--color-link);
            text-decoration: none;
        }
        
        button {
            color: var(--color-link);
            background-color: var(--color-background);
            font-family: var(--font-header-family);
            width: 80px;
            height: 40px;
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