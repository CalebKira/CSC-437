import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css.ts";
import { Auth, Observer } from "@calpoly/mustang";


export class WritingCard extends LitElement {
    @property({ type: String }) type: string = '';
    @property({ type: String }) icon = "icon_logo";
    @property({ type: String}) title = "Writing Card";
    /* defining the properties I want as attributes in custom element */
    
    @property() src?: string;
    @state() writings?: Array<Writing> = [];
    /* question mark just in case you render nothing */

    _authObserver = new Observer<Auth.Model>(this, "world:auth");
    _user?: Auth.User;

    get authorization() {
        return (
            this._user?.authenticated && {
            Authorization:
                `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
            }
        );
    }

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe((auth: Auth.Model) => {
            this._user= auth.user;
            if ((this._user != undefined) && (this.src != undefined)) {
                this.hydrate(this.src, this._user.username)
            };
        });

        if (this.src) this.hydrate(this.src, "");
        /* if there is no seen user, just run hydrate */
    }

    hydrate(src: string, user: string) {   
        if (user != ""){
            /* initial check to see if there is a user */

            if (this.authorization != false){
                /* test to see if the user is authorized */
                const userURL = "/api/stories/categories/" + this.type + "/" + user;
                /* LINKS ARE NOW CHANGED VIA PROXY IN VITE.CONFIG */

                if (src == "personal"){
                    /* double checks what kind of page it is */
                    fetch(userURL, { headers: this.authorization } )
                    .then(res => {
                        // console.log(res.status);
                        return res.json();
                    })
                    .then((json: Writing[]) => {
                        if(json) {
                            this.writings = json;
                        }
                    })
                }
                else{
                    const url = "/search/categories/" + this.type;
                    
                    fetch(url)
                    .then(res => {
                        // console.log(res.status);
                        return res.json();
                    })
                    .then((json: Writing[]) => {
                        if(json) {
                            this.writings = json;
                        }
                    })
                }
            }
            /* gives the data I need so set the state to json list */
        }
        else{
            if (src != "personal"){
                const url = "/search/categories/" + this.type;
                
                fetch(url)
                .then(res => {
                    // console.log(res.status);
                    return res.json();
                })
                .then((json: Writing[]) => {
                    if(json) {
                        this.writings = json;
                    }
                })
            }
            /* basically just checks to make sure its not on a personal page
                to just get everything from a given category */
        }
    }


    /* don't need a constructor */
    override render() {
        
        function renderWriting(d: Writing){
            const link = "./writing.html";
            /* EDIT THIS TO BE THE ACTUAL LINK LATER */

            return html`
                <a href=${link}>${d.storyid}</a>
            `
        }

        if (!this.writings){this.writings = []};

        return html`
        <div class="stuff">
            <h3>
                <svg class="icon">
                    <use href="../../icons/page_icons.svg#${this.icon}" />
                </svg>
                ${this.title}
            </h3>
            <ul>
                ${this.writings.map(renderWriting)
                    .map((d) => html`<li>${d}</li>`)
                }
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
            border: 1px solid var(--color-light-text);
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
    
        // .stuff {
        //     border: 1px solid var(--color-light-text);
        // }

        .stuff ul{
            place-items: center;
            list-style-type: none;
            padding-left: 0;
        }
    `];
    /* defining the CSS of this custom component specifically */
}


interface Writing {
    storyid: string;
    userid: string;
    category: string;
    content: string;
}
/* keep the interface outside for reference */
