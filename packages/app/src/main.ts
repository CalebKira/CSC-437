import {
    Auth,
    define,
    History,
    Switch,
    Store
} from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages.ts";
import { Model, init } from "./model.ts";
import update from "./update.ts";
import { NavBar } from "./components/nav-bar";
import { HomeViewElement } from "./views/home-view";
import { PersonalViewElement } from "./views/personal-view";
import { LoginViewElement } from "./views/login-view";
import { SearchViewElement } from "./views/search-view";
import { PostViewElement } from "./views/post-view";
import { ShareViewElement } from "./views/share-view";
import { ProfileViewElement } from "./views/profile-view.ts";
import { ProfileEditElement } from "./views/profile-edit-view.ts";

const routes = [
    {
        path: "/app/writing/:id",
        view: (params: Switch.Params) => html`
        <writing-view writing-id=${params.id}></writing-view>
        `
    }, /* writing/ editing page (writing.html) */

    {
        path: "/app/writing",
        view: () => html`
        <writing-view></writing-view>
        `
    }, /* writing create page, like a menu create */
    
    {
        path: "/app/reading/:id",
        view: (params: Switch.Params) => html`
        <reading-view reading-id=${params.id}></reading-view>
        `
    }, /* reading some file page */

    {
        path: "/app/login",
        view: () => html`
        <login-view></login-view>
        `
    }, /* login page (login.html) */

    {
        path: "/app/signup",
        view: () => html`
        <signup-view></signup-view>
        `
    }, /* signup page */

    {
        path: "/app/personal/:id",
        view: () => html`
        <personal-view></personal-view>
        `
    }, /* personal writing page (index.html) */

    {
        path: "/app/profile/:id",
        view: (params: Switch.Params) => html`
        <profile-view userid="${params.id}"></profile-view>
        `
        /* OHH THE PARAMS JUST CHECK THE LINK AND YOU CAN CHANGE THE LINK
            TO HAVE THE ID OR WHATEVER IT IS */
    }, /* profile page */

    {
        path: "/app/profile/:id/edit",
        view: (params: Switch.Params) => html`
        <profile-edit-view userid="${params.id}"></profile-edit-view>
        `
    }, /* profile edit page */

    {
        path: "/app/search",
        view: () => html`
        <search-view></search-view>
        `
    }, /* public search page (categories.html) */

    {
        path: "/app/post",
        view: () => html`
        <post-view></post-view>
        `
    }, /* post page (post.html) */

    {
        path: "/app/share",
        view: () => html`
        <share-view></share-view>
        `
    }, /* share page (share.html) */

    {
        path: "/app",
        view: () => html`
        <home-view></home-view>
        `
    }, /* home into page (home.html) */

    {
        path: "/",
        redirect: "/app"
    } /* just redirecting to the app */
];

define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "nav-bar": NavBar,
    "mu-store": class AppStore
        extends Store.Provider<Model, Msg>
    {
        constructor() {
        super(update, init, "world:auth");
        }
    },
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "world:history", "world:auth");
        }
    },
    "home-view": HomeViewElement,
    "personal-view": PersonalViewElement,
    "login-view": LoginViewElement,
    "search-view": SearchViewElement,
    "post-view": PostViewElement,
    "share-view": ShareViewElement,
    "profile-view": ProfileViewElement,
    "profile-edit-view": ProfileEditElement,
})