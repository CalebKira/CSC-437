import {
    Auth,
    define,
    History,
    Switch,
    Store
} from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./message.ts";
import { Model, init } from "./model.ts";
import update from "./update.ts";
import { NavBar } from "./components/nav-bar";
import { HomeViewElement } from "./views/home-view";
import { PersonalViewElement } from "./views/personal-view";
import { LoginViewElement } from "./views/login-view";
import { SearchViewElement } from "./views/search-view";
import { PostViewElement } from "./views/post-view";
import { ShareViewElement } from "./views/share-view";

const routes = [
    {
        path: "/app/writing/:id",
        view: (params: Switch.Params) => html`
        <writing-view writing-id=${params.id}></writing-view>
        `
    }, /* writing/ editing page (writing.html) */

    {
        path: "/app/writing",
        view: (params: Switch.Params) => html`
        <writing-view writing-id=${params.id}></writing-view>
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
        path: "/app/personal",
        view: () => html`
        <personal-view></personal-view>
        `
    }, /* personal writing page (index.html) */

    {
        path: "/app/profile",
        view: () => html`
        <profile-view></profile-view>
        `
    }, /* profile  page */

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
})