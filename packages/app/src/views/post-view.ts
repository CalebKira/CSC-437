import { css, html, LitElement } from "lit";
// import { property, state } from "lit/decorators.js";
import page from "../styles/page.css";
import reset from "../styles/reset.css";
import post from "../styles/post.css";
// import reset from "../styles/reset.css.ts";
/* only need this for specific custom components */

export class PostViewElement extends LitElement {
    
    /* MAKE THIS CONNECT TO ACTUAL DATA LATER */

    render() {
        return html`
            <h2>Post</h2>
            <!-- <a href="./index.html">My Writing</a><br> -->


            <div class="grid">
                <h3>
                    <svg class="icon">
                        <use href="../../icons/page_icons.svg#icon_post" />
                    </svg>
                    Post Details:
                    <div class="divider"></div>
                </h3>

                <h4>Category:
                    <select>
                    <option value="Characters">Character</option>
                    <option value="Settings">Setting</option>
                    <option value="Plots">Plot</option>
                    <option value="Worlds">World</option>
                </select>
                </h4>
                

                <h4>File:
                    <select>
                    <option value="Character 1">Character 1</option>
                    <option value="Character 2">Character 2</option>
                    <option value="Character 3">Character 3</option>
                    <option value="Character 4">Character 4</option>
                </select>
                
                </h4>

                <h4>Write a Caption:
                    <textarea placeholder="Write caption here"></textarea>
                </h4>


                <button>Post!</button>
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

  // more to come
}