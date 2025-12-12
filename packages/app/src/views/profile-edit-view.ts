import { define, Form, View, History } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Profile } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import page from "../styles/page.css";
import reset from "../styles/reset.css";
import post from "../styles/post.css";
// … more imports


export class ProfileEditElement extends View<Model, Msg> {
    static uses = define({
        "mu-form": Form.Element, // make sure mu-form is defined
    });

    @property()
    userid?: string;

    @state()
    get profile(): Profile | undefined {
        return this.model.profile;
    }

    constructor() {
        super("world:model");
    }

    render() {
        return html`
        <div class="grid">
            <mu-form
            .init=${this.profile}
            @mu-form:submit=${this.handleSubmit}>
            <dl>
                <dt>Name</dt>
                <dd><input name="userid"></dd>
                <dt>Pseudonym</dt>
                <dd><input name="pseudonym"></dd>
                <dt>Email</dt>
                <dd><input name="email"></dd>
            </dl>
            </mu-form>
        </div>`;
        /* I edited this to be div with class grid instead
            of main with class page */
    }
    static styles = [reset.styles, page.styles, post.styles, css`       
    `    
    ]
    
    
    handleSubmit(event: Form.SubmitEvent<Profile>) {
        this.dispatchMessage([
            "profile/save",
            {
            userid: this.userid,
            profile: event.detail
            },
            {
            onSuccess: () =>
                History.dispatch(this, "history/navigate", {
                href: `/app/profile/${this.userid}`
                }),
                /* goes back to the profile page */
            onFailure: (error: Error) =>
                console.log("ERROR:", error)
            }
        ]);
    }
}