import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Profile } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import page from "../styles/page.css";
import reset from "../styles/reset.css";
import post from "../styles/post.css";


export class ProfileViewElement extends View<Model, Msg> {
    @property({attribute: "userid"})
    userid?: string;

    @state()
    get profile(): Profile | undefined {
        return this.model.profile;
    }

    constructor() {
        super("world:model");
    }



    render() {
        const {
            userid,
            pseudonym,
            email
        } = this.profile || {};

        return html`
            <h2>Post</h2>
            <!-- <a href="./index.html">My Writing</a><br> -->


            <div class="grid">
                <h3>
                    <svg class="icon">
                        <use href="../../icons/page_icons.svg#icon_profile" />
                    </svg>
                    Profile Details:
                    <div class="divider"></div>
                </h3>

                <h4>Name: <br>${userid}</h4>
                

                <h4>Pseudonym: <br>${pseudonym}</h4>

                <h4>Email: <br>${email}</h4>


                <a href="/app/profile/edit/${userid}">Edit</a>
            </div><br>

            <label id="dark">
                <input type="checkbox" autocomplete="off" id="darkmode" />
                Light Mode
            </label>
        `;
    }
    static styles = [reset.styles, page.styles, post.styles, css`
            
        `    
    ]

    // etc
    attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
        ) {

        super.attributeChangedCallback(name, oldValue, newValue);
        if (
            name === "userid" &&
            oldValue !== newValue &&
            newValue
        ) {
            this.dispatchMessage([
            "profile/request",
            { userid: newValue }
            ]);
        }
        /* this is what makes the update and tracks when something
            changes in the profile */
    }
}
