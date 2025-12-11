(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var W,Ue;class lt extends Error{}lt.prototype.name="InvalidTokenError";function Zs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Qs(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Zs(t)}catch{return atob(t)}}function ls(r,t){if(typeof r!="string")throw new lt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new lt(`Invalid token specified: missing part #${e+1}`);let i;try{i=Qs(s)}catch(n){throw new lt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new lt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Xs="mu:context",Zt=`${Xs}:change`;class ti{constructor(t,e){this._proxy=ei(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class cs extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ti(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Zt,t),t}detach(t){this.removeEventListener(Zt,t)}}function ei(r,t){return new Proxy(r,{get:(s,i,n)=>i==="then"?void 0:Reflect.get(s,i,n),set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(Zt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function si(r,t){const e=hs(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function hs(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return hs(r,i.host)}class ii extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function us(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ii(e,r))}class ce{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[s,...i]=e;this._context.value=s,i.forEach(n=>n.then(o=>{o.length&&this.consume(o)}))}}}const Qt="mu:auth:jwt",ds=class ps extends ce{constructor(t,e){super((s,i)=>this.update(s,i),t,ps.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:i,redirect:n}=t[1];return[ni(i),Kt(n)]}case"auth/signout":return[oi(e.user),Kt(this._redirectForLogin)];case"auth/redirect":return[e,Kt(this._redirectForLogin,{next:window.location.href})];default:const s=t[0];throw new Error(`Unhandled Auth message "${s}"`)}}};ds.EVENT_TYPE="auth:message";let fs=ds;const gs=us(fs.EVENT_TYPE);function Kt(r,t){return new Promise((e,s)=>{if(r){const i=window.location.href,n=new URL(r,i);t&&Object.entries(t).forEach(([o,l])=>n.searchParams.set(o,l)),console.log("Redirecting to ",r),window.location.assign(n)}e([])})}class ri extends cs{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=G.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new fs(this.context,this.redirect).attach(this)}}class ut{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Qt),t}}class G extends ut{constructor(t){super();const e=ls(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new G(t);return localStorage.setItem(Qt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Qt);return t?G.authenticate(t):new ut}}function ni(r){return{user:G.authenticate(r),token:r}}function oi(r){return{user:r&&r.authenticated?ut.deauthenticate(r):r,token:""}}function ai(r){return r&&r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function li(r){return r.authenticated?ls(r.token||""):{}}const ci=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:G,Provider:ri,User:ut,dispatch:gs,headers:ai,payload:li},Symbol.toStringTag,{value:"Module"}));function ms(r,t,e){const s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});r.dispatchEvent(s)}function Pt(r,t,e){const s=r.target;ms(s,t,e)}function Xt(r,t="*"){return r.composedPath().find(i=>{const n=i;return n.tagName&&n.matches(t)})||void 0}const hi=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:ms,originalTarget:Xt,relay:Pt},Symbol.toStringTag,{value:"Module"}));function he(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ui=new DOMParser;function H(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=ui.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Me(a);case"bigint":case"boolean":case"number":case"symbol":return Me(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Me(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function It(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}W=class extends HTMLElement{constructor(){super(),this._state={},It(this).template(W.template).styles(W.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Pt(r,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var r,t;for(const e of((r=this.submitSlot)==null?void 0:r.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(r){this._state=r||{},di(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}get submitSlot(){var r;const t=(r=this.shadowRoot)==null?void 0:r.querySelector('slot[name="submit"]');return t||null}},W.template=H`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,W.styles=he`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function di(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":i instanceof Date?o.value=i.toISOString().substr(0,10):o.value=i;break;default:o.value=i;break}}}return r}const vs=class ys extends ce{constructor(t){super((e,s)=>this.update(e,s),t,ys.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];return fi(s,i)}case"history/redirect":{const{href:s,state:i}=t[1];return gi(s,i)}}}};vs.EVENT_TYPE="history:message";let ue=vs;class Le extends cs{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=pi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(!this._root||s.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),de(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ue(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function pi(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function fi(r,t={}){return history.pushState(t,"",r),{location:document.location,state:history.state}}function gi(r,t={}){return history.replaceState(t,"",r),{location:document.location,state:history.state}}const de=us(ue.EVENT_TYPE),mi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Le,Provider:Le,Service:ue,dispatch:de},Symbol.toStringTag,{value:"Module"}));class Z{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Ie(this._provider,t);this._effects.push(i),e(i)}else si(this._target,this._contextLabel).then(i=>{const n=new Ie(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ie{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const _s=class $s extends HTMLElement{constructor(){super(),this._state={},this._user=new ut,this._authObserver=new Z(this,"blazing:auth"),It(this).template($s.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;vi(i,this._state,e,this.authorization).then(n=>rt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},rt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&He(this.src,this.authorization).then(e=>{this._state=e,rt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&He(this.src,this.authorization).then(i=>{this._state=i,rt(i,this)});break;case"new":s&&(this._state={},rt({},this));break}}};_s.observedAttributes=["src","new","action"];_s.template=H`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function He(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function rt(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function vi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const yi=class bs extends ce{constructor(t,e){super(e,t,bs.EVENT_TYPE,!1)}};yi.EVENT_TYPE="mu:message";const St=globalThis,pe=St.ShadowRoot&&(St.ShadyCSS===void 0||St.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),je=new WeakMap;let ws=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=je.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&je.set(e,t))}return t}toString(){return this.cssText}};const _i=r=>new ws(typeof r=="string"?r:r+"",void 0,fe),$i=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ws(e,r,fe)},bi=(r,t)=>{if(pe)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=St.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ze=pe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return _i(e)})(r):r;const{is:wi,defineProperty:Ai,getOwnPropertyDescriptor:Ei,getOwnPropertyNames:Si,getOwnPropertySymbols:xi,getPrototypeOf:Pi}=Object,Q=globalThis,De=Q.trustedTypes,Ci=De?De.emptyScript:"",Fe=Q.reactiveElementPolyfillSupport,ct=(r,t)=>r,Ct={toAttribute(r,t){switch(t){case Boolean:r=r?Ci:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ge=(r,t)=>!wi(r,t),Be={attribute:!0,type:String,converter:Ct,reflect:!1,useDefault:!1,hasChanged:ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Q.litPropertyMetadata??(Q.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Ai(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Ei(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){const l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=Pi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,s=[...Si(e),...xi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(ze(i))}else t!==void 0&&e.push(ze(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Ct).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s,i;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const l=n.getPropertyOptions(o),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((s=l.converter)==null?void 0:s.fromAttribute)!==void 0?l.converter:Ct;this._$Em=o,this[o]=a.fromAttribute(e,l.type)??((i=this._$Ej)==null?void 0:i.get(o))??null,this._$Em=null}}requestUpdate(t,e,s){var i;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??ge)(o,e)||s.useDefault&&s.reflect&&o===((i=this._$Ej)==null?void 0:i.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ct("elementProperties")]=new Map,Y[ct("finalized")]=new Map,Fe?.({ReactiveElement:Y}),(Q.reactiveElementVersions??(Q.reactiveElementVersions=[])).push("2.1.0");const kt=globalThis,Ot=kt.trustedTypes,qe=Ot?Ot.createPolicy("lit-html",{createHTML:r=>r}):void 0,As="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,Es="?"+O,ki=`<${Es}>`,j=document,dt=()=>j.createComment(""),pt=r=>r===null||typeof r!="object"&&typeof r!="function",me=Array.isArray,Oi=r=>me(r)||typeof r?.[Symbol.iterator]=="function",Jt=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,We=/-->/g,Ve=/>/g,U=RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Ke=/"/g,Ss=/^(?:script|style|textarea|title)$/i,Ti=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ot=Ti(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Je=new WeakMap,L=j.createTreeWalker(j,129);function xs(r,t){if(!me(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(t):t}const Ri=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=nt;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===nt?f[1]==="!--"?o=We:f[1]!==void 0?o=Ve:f[2]!==void 0?(Ss.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=i??nt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?U:f[3]==='"'?Ke:Ye):o===Ke||o===Ye?o=U:o===We||o===Ve?o=nt:(o=U,i=void 0);const h=o===U&&r[l+1].startsWith("/>")?" ":"";n+=o===nt?a+ki:u>=0?(s.push(d),a.slice(0,u)+As+a.slice(u)+O+h):a+O+(u===-2?l:h)}return[xs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let te=class Ps{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ri(t,e);if(this.el=Ps.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(As)){const c=f[o++],h=i.getAttribute(u).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ui:p[1]==="?"?Mi:p[1]==="@"?Li:Ht}),i.removeAttribute(u)}else u.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Ss.test(i.tagName)){const u=i.textContent.split(O),c=u.length-1;if(c>0){i.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],dt()),L.nextNode(),a.push({type:2,index:++n});i.append(u[c],dt())}}}else if(i.nodeType===8)if(i.data===Es)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(O,u+1))!==-1;)a.push({type:7,index:n}),u+=O.length-1}n++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}};function tt(r,t,e=r,s){var i,n;if(t===X)return t;let o=s!==void 0?(i=e._$Co)==null?void 0:i[s]:e._$Cl;const l=pt(t)?void 0:t._$litDirective$;return o?.constructor!==l&&((n=o?._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=tt(r,o._$AS(r,t.values),o,s)),t}let Ni=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??j).importNode(e,!0);L.currentNode=i;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new ve(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Ii(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=L.nextNode(),o++)}return L.currentNode=j,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},ve=class Cs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),pt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Oi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=te.createElement(xs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Ni(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Je.get(t.strings);return e===void 0&&Je.set(t.strings,e=new te(t)),e}k(t){me(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Cs(this.O(dt()),this.O(dt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Ht=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!pt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=tt(this,l[s+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!pt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ui=class extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},Mi=class extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},Li=class extends Ht{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??$)===X)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Ii=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}};const Ge=kt.litHtmlPolyfillSupport;Ge?.(te,ve),(kt.litHtmlVersions??(kt.litHtmlVersions=[])).push("3.3.0");const Hi=(r,t,e)=>{const s=e?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const n=e?.renderBefore??null;s._$litPart$=i=new ve(t.insertBefore(dt(),n),n,void 0,e??{})}return i._$AI(r),i};const ft=globalThis;let J=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Hi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}};J._$litElement$=!0,J.finalized=!0,(Ue=ft.litElementHydrateSupport)==null||Ue.call(ft,{LitElement:J});const Ze=ft.litElementPolyfillSupport;Ze?.({LitElement:J});(ft.litElementVersions??(ft.litElementVersions=[])).push("4.2.0");const ji={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ge},zi=(r=ji,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function ks(r){return(t,e)=>typeof e=="object"?zi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}function Os(r){return ks({...r,state:!0,attribute:!1})}function Di(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Fi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ts={};(function(r){var t=(function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,y,Bt){var A=y.length-1;switch(g){case 1:return new m.Root({},[y[A-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new m.Literal({value:y[A]});break;case 7:this.$=new m.Splat({name:y[A]});break;case 8:this.$=new m.Param({name:y[A]});break;case 9:this.$=new m.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],y=this.table,Bt="",A=0,Te=0,Ys=2,Re=1,Ks=g.slice.call(arguments,1),_=Object.create(this.lexer),R={yy:{}};for(var qt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,qt)&&(R.yy[qt]=this.yy[qt]);_.setInput(c,R.yy),R.yy.lexer=_,R.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Wt=_.yylloc;g.push(Wt);var Js=_.options&&_.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Gs=function(){var q;return q=_.lex()||Re,typeof q!="number"&&(q=h.symbols_[q]||q),q},w,N,S,Vt,B={},At,P,Ne,Et;;){if(N=p[p.length-1],this.defaultActions[N]?S=this.defaultActions[N]:((w===null||typeof w>"u")&&(w=Gs()),S=y[N]&&y[N][w]),typeof S>"u"||!S.length||!S[0]){var Yt="";Et=[];for(At in y[N])this.terminals_[At]&&At>Ys&&Et.push("'"+this.terminals_[At]+"'");_.showPosition?Yt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+Et.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Yt="Parse error on line "+(A+1)+": Unexpected "+(w==Re?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Yt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Wt,expected:Et})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+w);switch(S[0]){case 1:p.push(w),m.push(_.yytext),g.push(_.yylloc),p.push(S[1]),w=null,Te=_.yyleng,Bt=_.yytext,A=_.yylineno,Wt=_.yylloc;break;case 2:if(P=this.productions_[S[1]][1],B.$=m[m.length-P],B._$={first_line:g[g.length-(P||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(P||1)].first_column,last_column:g[g.length-1].last_column},Js&&(B._$.range=[g[g.length-(P||1)].range[0],g[g.length-1].range[1]]),Vt=this.performAction.apply(B,[Bt,Te,A,R.yy,S[1],m,g].concat(Ks)),typeof Vt<"u")return Vt;P&&(p=p.slice(0,-1*P*2),m=m.slice(0,-1*P),g=g.slice(0,-1*P)),p.push(this.productions_[S[1]][0]),m.push(B.$),g.push(B._$),Ne=y[p[p.length-2]][p[p.length-1]],p.push(Ne);break;case 3:return!0}}return!0}},d=(function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(p=this._input.match(this.rules[g[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=y,this.options.backtrack_lexer){if(c=this.test_match(p,g[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof Fi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ts);function V(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Rs={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},Ns=Ts.parser;Ns.yy=Rs;var Bi=Ns,qi=Object.keys(Rs);function Wi(r){return qi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Us=Wi,Vi=Us,Yi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ms(r){this.captures=r.captures,this.re=r.re}Ms.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Ki=Vi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Yi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ms({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Ji=Ki,Gi=Us,Zi=Gi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Qi=Zi,Xi=Bi,tr=Ji,er=Qi;_t.prototype=Object.create(null);_t.prototype.match=function(r){var t=tr.visit(this.ast),e=t.match(r);return e||!1};_t.prototype.reverse=function(r){return er.visit(this.ast,r)};function _t(r){var t;if(this?t=this:t=Object.create(_t.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Xi.parse(r),t}var sr=_t,ir=sr,rr=ir;const nr=Di(rr);var or=Object.defineProperty,Ls=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&or(t,e,i),i};const Is=class extends J{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ot` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new nr(i.path)})),this._historyObserver=new Z(this,e),this._authObserver=new Z(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ot` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(gs(this,"auth/redirect"),ot` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ot` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ot` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){de(this,"history/redirect",{href:t})}};Is.styles=$i`
    :host,
    main {
      display: contents;
    }
  `;let Tt=Is;Ls([Os()],Tt.prototype,"_user");Ls([Os()],Tt.prototype,"_match");const ar=Object.freeze(Object.defineProperty({__proto__:null,Element:Tt,Switch:Tt},Symbol.toStringTag,{value:"Module"})),Hs=class ee extends HTMLElement{constructor(){if(super(),It(this).template(ee.template).styles(ee.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Hs.template=H` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;Hs.styles=he`
    :host {
      position: relative;
    }
    #is-shown {
      display: none;
    }
    #panel {
      display: none;

      position: absolute;
      right: 0;
      margin-top: var(--size-spacing-small);
      width: max-content;
      padding: var(--size-spacing-small);
      border-radius: var(--size-radius-small);
      background: var(--color-background-card);
      color: var(--color-text);
      box-shadow: var(--shadow-popover);
    }
    :host([open]) #panel {
      display: block;
    }
  `;const js=class se extends HTMLElement{constructor(){super(),this._array=[],It(this).template(se.template).styles(se.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(zs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Xt(t,"button.add")?Pt(t,"input-array:add"):Xt(t,"button.remove")&&Pt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],lr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};js.template=H`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;js.styles=he`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function lr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(zs(e)))}function zs(r,t){const e=r===void 0?H`<input />`:H`<input value="${r}" />`;return H`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function jt(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var cr=Object.defineProperty,hr=Object.getOwnPropertyDescriptor,ur=(r,t,e,s)=>{for(var i=hr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&cr(t,e,i),i};class dr extends J{constructor(t){super(),this._pending=[],this._observer=new Z(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}ur([ks()],dr.prototype,"model");const xt=globalThis,ye=xt.ShadowRoot&&(xt.ShadyCSS===void 0||xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_e=Symbol(),Qe=new WeakMap;let Ds=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==_e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ye&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Qe.set(e,t))}return t}toString(){return this.cssText}};const pr=r=>new Ds(typeof r=="string"?r:r+"",void 0,_e),x=(r,...t)=>{const e=r.length===1?r[0]:t.reduce(((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1]),r[0]);return new Ds(e,r,_e)},fr=(r,t)=>{if(ye)r.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const s=document.createElement("style"),i=xt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Xe=ye?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return pr(e)})(r):r;const{is:gr,defineProperty:mr,getOwnPropertyDescriptor:vr,getOwnPropertyNames:yr,getOwnPropertySymbols:_r,getPrototypeOf:$r}=Object,zt=globalThis,ts=zt.trustedTypes,br=ts?ts.emptyScript:"",wr=zt.reactiveElementPolyfillSupport,ht=(r,t)=>r,Rt={toAttribute(r,t){switch(t){case Boolean:r=r?br:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},$e=(r,t)=>!gr(r,t),es={attribute:!0,type:String,converter:Rt,reflect:!1,useDefault:!1,hasChanged:$e};Symbol.metadata??=Symbol("metadata"),zt.litPropertyMetadata??=new WeakMap;let K=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=es){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&mr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=vr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){const l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??es}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=$r(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,s=[...yr(e),..._r(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Xe(i))}else t!==void 0&&e.push(Xe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fr(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const n=(s.converter?.toAttribute!==void 0?s.converter:Rt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Rt;this._$Em=i;const l=o.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){const i=this.constructor,n=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??$e)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((s=>s.hostUpdate?.())),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[ht("elementProperties")]=new Map,K[ht("finalized")]=new Map,wr?.({ReactiveElement:K}),(zt.reactiveElementVersions??=[]).push("2.1.1");const be=globalThis,Nt=be.trustedTypes,ss=Nt?Nt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Fs="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Bs="?"+T,Ar=`<${Bs}>`,z=document,gt=()=>z.createComment(""),mt=r=>r===null||typeof r!="object"&&typeof r!="function",we=Array.isArray,Er=r=>we(r)||typeof r?.[Symbol.iterator]=="function",Gt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,is=/-->/g,rs=/>/g,M=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ns=/'/g,os=/"/g,qs=/^(?:script|style|textarea|title)$/i,Sr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),v=Sr(1),et=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),as=new WeakMap,I=z.createTreeWalker(z,129);function Ws(r,t){if(!we(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ss!==void 0?ss.createHTML(t):t}const xr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=at;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===at?f[1]==="!--"?o=is:f[1]!==void 0?o=rs:f[2]!==void 0?(qs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=M):f[3]!==void 0&&(o=M):o===M?f[0]===">"?(o=i??at,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?M:f[3]==='"'?os:ns):o===os||o===ns?o=M:o===is||o===rs?o=at:(o=M,i=void 0);const h=o===M&&r[l+1].startsWith("/>")?" ":"";n+=o===at?a+Ar:u>=0?(s.push(d),a.slice(0,u)+Fs+a.slice(u)+T+h):a+T+(u===-2?l:h)}return[Ws(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class vt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=xr(t,e);if(this.el=vt.createElement(d,s),I.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=I.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Fs)){const c=f[o++],h=i.getAttribute(u).split(T),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Cr:p[1]==="?"?kr:p[1]==="@"?Or:Dt}),i.removeAttribute(u)}else u.startsWith(T)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(qs.test(i.tagName)){const u=i.textContent.split(T),c=u.length-1;if(c>0){i.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],gt()),I.nextNode(),a.push({type:2,index:++n});i.append(u[c],gt())}}}else if(i.nodeType===8)if(i.data===Bs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(T,u+1))!==-1;)a.push({type:7,index:n}),u+=T.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function st(r,t,e=r,s){if(t===et)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl;const n=mt(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=st(r,i._$AS(r,t.values),i,s)),t}class Pr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);I.currentNode=i;let n=I.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new $t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Tr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=I.nextNode(),o++)}return I.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class $t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),mt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Er(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=vt.createElement(Ws(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const n=new Pr(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=as.get(t.strings);return e===void 0&&as.set(t.strings,e=new vt(t)),e}k(t){we(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new $t(this.O(gt()),this.O(gt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=st(this,t,e,0),o=!mt(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=st(this,l[s+a],e,a),d===et&&(d=this._$AH[a]),o||=!mt(d)||d!==this._$AH[a],d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Cr extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class kr extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Or extends Dt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??b)===et)return;const s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Tr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const Rr=be.litHtmlPolyfillSupport;Rr?.(vt,$t),(be.litHtmlVersions??=[]).push("3.3.1");const Nr=(r,t,e)=>{const s=e?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const n=e?.renderBefore??null;s._$litPart$=i=new $t(t.insertBefore(gt(),n),n,void 0,e??{})}return i._$AI(r),i};const Ae=globalThis;class E extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nr(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return et}}E._$litElement$=!0,E.finalized=!0,Ae.litElementHydrateSupport?.({LitElement:E});const Ur=Ae.litElementPolyfillSupport;Ur?.({LitElement:E});(Ae.litElementVersions??=[]).push("4.2.1");const Mr={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:$e},Lr=(r=Mr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function F(r){return(t,e)=>typeof e=="object"?Lr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}function bt(r){return F({...r,state:!0,attribute:!1})}const Ir=x`
    * {
        margin: 0;
        box-sizing: border-box;
    }
    body {
        line-height: 1.5;
    }
    img {
        max-width: 100%;
    }
`,k={styles:Ir};var Hr=Object.defineProperty,Vs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Hr(t,e,i),i};const Se=class Se extends E{constructor(){super(...arguments),this._authObserver=new Z(this,"world:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username):(this.loggedIn=!1,this.userid=void 0),console.log(this.userid)})}renderSignOutButton(){return v`
            <button
            @click=${t=>{hi.relay(t,"auth:message",["auth/signout"])}}
            >
            Sign Out
            </button>
        `}renderSignInButton(){return v`
            <a href="/app/login">
            Sign In…
            </a>
        `}render(){return v`
        <div class="header">
            <a id="logo" href="/app">
                <svg class="icon">
                    <use href="../../icons/page_icons.svg#icon_logo" />
                </svg>
                World Builder
            </a>

            <a href="/app/search">
                <svg class="icon">
                    <use href="../../icons/page_icons.svg#icon_search" />
                </svg>
                Search
            </a>

            <a href="/app/personal">
                <svg class="icon">
                    <use href="../../icons/page_icons.svg#icon_private" />
                </svg>
                Personal
            </a>


            <a slot="actuator">
                <svg class="icon">
                    <use href="../../icons/page_icons.svg#icon_profile" />
                </svg>
                Hello, ${this.userid||"traveler"}
            </a>
            ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
        </div> <br>
        `}};Se.styles=[k.styles,x`
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
    `];let yt=Se;Vs([bt()],yt.prototype,"loggedIn");Vs([bt()],yt.prototype,"userid");const jr=x`
    /* Overall page heirarchy */

    body {
        background-color: var(--color-background);
        color: var(--color-light-text);
        font-family: var(--font-body-family);
        font-weight: var(--font-body-weight);
    }


    h2{
        background-color: var(--color-h2);
        font-family: var(--font-header-family);
        font-weight: 700;
        padding-left: var(--padding);
        /* padding because this is always the title */
    }

    h3 {
        background-color: var(--color-h3);
        font-family: var(--font-header-family);
        font-weight: 500;
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


    /* NAV BAR */
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

    #dark {
        font-family: var(--font-header-family);
        font-size: var(--nav-other-font-size);
        color: var(--color-link);
        padding-left: var(--padding);
    }
`,it={styles:jr},xe=class xe extends E{render(){return v`
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
        `}};xe.styles=[k.styles,it.styles,x`
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
    `];let ie=xe;var zr=Object.defineProperty,wt=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&zr(t,e,i),i};const Pe=class Pe extends E{constructor(){super(...arguments),this.type="",this.icon="icon_logo",this.title="Writing Card",this.writings=[],this._authObserver=new Z(this,"world:auth")}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this._user!=null&&this.src!=null&&this.hydrate(this.src,this._user.username)}),this.src&&this.hydrate(this.src,"")}hydrate(t,e){if(e!=""){if(this.authorization!=!1){const s="/api/stories/categories/"+this.type+"/"+e;if(t=="personal")fetch(s,{headers:this.authorization}).then(i=>i.json()).then(i=>{i&&(this.writings=i)});else{const i="/search/categories/"+this.type;fetch(i).then(n=>n.json()).then(n=>{n&&(this.writings=n)})}}}else if(t!="personal"){const s="/search/categories/"+this.type;fetch(s).then(i=>i.json()).then(i=>{i&&(this.writings=i)})}}render(){function t(e){return v`
                <a href=${"./writing.html"}>${e.storyid}</a>
            `}return this.writings||(this.writings=[]),v`
        <div class="stuff">
            <h3>
                <svg class="icon">
                    <use href="../../icons/page_icons.svg#${this.icon}" />
                </svg>
                ${this.title}
            </h3>
            <ul>
                ${this.writings.map(t).map(e=>v`<li>${e}</li>`)}
            </ul>
        </div>
        `}};Pe.styles=[k.styles,x`
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
    `];let C=Pe;wt([F({type:String})],C.prototype,"type");wt([F({type:String})],C.prototype,"icon");wt([F({type:String})],C.prototype,"title");wt([F()],C.prototype,"src");wt([bt()],C.prototype,"writings");const Ut=class Ut extends E{render(){return v`
            <h2 class="page-title">My Writing</h2>

                <!-- Be in grid form -->
                <div class="grid">

                    <!-- Side Bar -->
                    <div class="sidebar">
                        <a href="/app/post">
                            <svg class="icon">
                                <use href="../../icons/page_icons.svg#icon_post" />
                            </svg>
                            Post
                        </a><br>

                        <a href="/app/share">
                            <svg class="icon">
                                <use href="../../icons/page_icons.svg#icon_share" />
                            </svg>
                            Share
                        </a><br>

                        <a href="/app/writing">
                            <svg class="icon">
                                <use href="../../icons/page_icons.svg#icon_personal" />
                            </svg>
                            Create
                        </a>
                    </div>

                    <!-- All the rest of the cards -->
                    <!-- <div class="characters">
                        <h3>
                            <svg class="icon">
                                <use href="./icons/page_icons.svg#icon_character" />
                            </svg>
                            Characters
                        </h3>
                        <ul>
                            <li><a href="./writing.html">Character 1</a></li>
                            <li><a href="./writing.html">Character 2</a></li>
                            <li><a href="./writing.html">Character 3</a></li>
                        </ul>
                    </div> -->

                    <writing-card icon="icon_character" title="Characters" type="character" class="characters" src="personal">
                        <!-- defining type for the internal css and class for grid external stuff -->
                        <!-- <li><a href="./writing.html">Character 1</a></li>
                        <li><a href="./writing.html">Character 2</a></li>
                        <li><a href="./writing.html">Character 3</a></li> -->
                    </writing-card>

                    <writing-card icon="icon_setting" title="Settings" type="setting" class="settings" src="personal">
                    </writing-card>

                    <writing-card icon="icon_plot" title="Plots" type="plot" class="plots" src="personal">
                    </writing-card>

                    <writing-card icon="icon_worldbuild" title="Worlds" type="world" class="worlds" src="personal">
                    </writing-card>
                    <!-- make this so t doesn't have the title in the attributes -->

                </div><br>

                <label id="dark">
                    <input type="checkbox" autocomplete="off" id="darkmode" />
                    Light Mode
                </label>
        `}};Ut.uses=jt({"writing-card":C}),Ut.styles=[k.styles,it.styles,x`
        /* Index page organization */

        /* GRID */
        .grid {
            display: grid;
            grid-template-columns: 2fr 2fr 2fr 2fr 1fr;
            grid-template-areas: 
                "characters settings plots worlds sidebar";
            gap: var(--grid-spacing);
            padding: var(--padding);
        }

        .characters, .settings, .plots, .worlds {
            border: 1px solid var(--color-light-text);
        }

        /* .characters ul, .settings ul, .plots ul, .worlds ul{
            place-items: center;
            list-style-type: none;
            padding-left: 0;
        } */

        .characters {
            grid-area: characters;
        }
        .settings {
            grid-area: settings;
        }
        .plots {
            grid-area: plots;
        }
        .worlds {
            grid-area: worlds;
        }

        .sidebar a{
            grid-area: sidebar;
            font-family: var(--font-header-family);
        }


        /* checking the size and organizing the look depending */
        @media screen and (max-width: 60rem) {
            .grid {
                display: grid;
                grid-template-columns: 2fr 2fr 2fr 1fr;
                grid-template-areas: 
                    "characters settings plots sidebar"
                    "worlds worlds worlds sidebar";
                    /* hardcoded because of the side bar */
                gap: var(--grid-spacing);
                padding: var(--padding);
            }
        }

        @media screen and (max-width: 45rem) {
            .grid {
                display: grid;
                grid-template-columns: 2fr 2fr 1fr;
                grid-template-areas: 
                    "characters settings sidebar"
                    "plots worlds sidebar";
                gap: var(--grid-spacing);
                padding: var(--padding);
            }
        }

        @media screen and (max-width: 35rem) {
            .grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                grid-template-areas: 
                    "characters sidebar"
                    "settings sidebar"
                    "plots sidebar"
                    "worlds sidebar";
                gap: var(--grid-spacing);
                padding: var(--padding);
            }
        }

        @media screen and (max-width: 30rem) {
            .grid {
                display: grid;
                grid-template-columns: 2fr;
                grid-template-areas: 
                    "sidebar"
                    "characters"
                    "settings"
                    "plots"
                    "worlds";
                gap: var(--grid-spacing);
                padding: var(--padding);
            }
        }
    `];let re=Ut;var Dr=Object.defineProperty,Ft=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Dr(t,e,i),i};const Ce=class Ce extends E{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}handleChange(t){const e=t.target,s=e?.name,i=e?.value,n=this.formData;switch(s){case"username":this.formData={...n,username:i};break;case"password":this.formData={...n,password:i};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this?.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:s}=e,i=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",i),this.dispatchEvent(i)}).catch(e=>{console.log(e),this.error=e.toString()})}render(){return v`
        <form
            @change=${t=>this.handleChange(t)}
            @submit=${t=>this.handleSubmit(t)}
        >
            <slot></slot>
            <slot name="button">
            <button
                ?disabled=${!this.canSubmit}
                type="submit">
                Login
            </button>
            </slot>
            <p class="error">${this.error}</p>
        </form>
        `}};Ce.styles=[k.styles,x`

        .error:not(:empty) {
            color: var(--color-error);
            border: 1px solid var(--color-error);
            padding: var(--size-spacing-medium);
        }
    `];let D=Ce;Ft([bt()],D.prototype,"formData");Ft([F()],D.prototype,"api");Ft([F()],D.prototype,"redirect");Ft([bt()],D.prototype,"error");const Fr=x`
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

    select {
        background-color: var(--color-background);
        color: var(--color-light-text-2);
        font-family: var(--font-body-family);
        width: 100%;
    }

    select option{
        background-color: var(--color-background);
        color: var(--color-light-text-2);
    }

    textarea {
        background-color: var(--color-background);
        color: var(--color-light-text-2);
        width: 100%;
        resize: none;
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
`,Ee={styles:Fr},Mt=class Mt extends E{render(){return v`
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
        `}};Mt.uses=jt({"login-form":D}),Mt.styles=[k.styles,it.styles,Ee.styles,x`

    `];let ne=Mt;const Lt=class Lt extends E{render(){return v`
            <h2>Public Writing</h2>

                <div class="grid">

                    <writing-card icon="icon_character" title="Popular Characters" type="character" class="characters" src="./data/characters.json">
                    </writing-card>

                    <writing-card icon="icon_setting" title="Popular Settings" type="setting" class="settings" src="./data/settings.json">
                    </writing-card>

                    <writing-card icon="icon_plot" title="Popular Plots" type="plot" class="plots" src="./data/plots.json">
                    </writing-card>

                    <writing-card icon="icon_worldbuild" title="Popular Worlds" type="world" class="worlds" src="./data/worlds.json">
                    </writing-card>

                </div><br>

                <label id="dark">
                    <input type="checkbox" autocomplete="off" id="darkmode" />
                    Light Mode
                </label>
        `}};Lt.uses=jt({"writing-card":C}),Lt.styles=[k.styles,it.styles,x`
        /* MAKE SURE THIS IS SPECIFIC TO CATEGORIES */

        /* GRID */
        .grid {
            --col-num: 4;
            
            display: grid;
            grid-template-columns: repeat(var(--col-num), 1fr);
            gap: var(--grid-spacing);
            padding: var(--padding);
        }

        .characters, .settings, .plots, .worlds {
            border: 1px solid var(--color-light-text);
            grid-column: span 1;
        }

        /* .characters ul, .settings ul, .plots ul, .worlds ul{
            place-items: center;
            list-style-type: none;
            padding-left: 0;
        } */


        @media screen and (max-width: 75rem) {
            .grid {
                --col-num: 3;
            }
        }

        @media screen and (max-width: 55rem) {
            .grid {
                --col-num: 2;
            }
        }

        @media screen and (max-width: 35rem) {
            .grid {
                --col-num: 1;
            }
        }
    `];let oe=Lt;const ke=class ke extends E{render(){return v`
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
        `}};ke.styles=[k.styles,it.styles,Ee.styles,x`
        
    `];let ae=ke;const Oe=class Oe extends E{render(){return v`
            <h2>Share</h2>

            <div class="grid">
                <h3>
                    <svg class="icon">
                        <use href="../../icons/page_icons.svg#icon_share" />
                    </svg>
                    Share Details:
                    <div class="divider"></div>
                </h3>

                <h4>Friend:
                    <select>
                    <option value="Friend 1">Friend 1</option>
                    <option value="Friend 2">Friend 2</option>
                    <option value="Friend 3">Friend 3</option>
                    <option value="Friend 4">Friend 4</option>
                </select>
                </h4>

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

                <h4>Write a Comment:
                    <textarea placeholder="Write comment here"></textarea>
                </h4>

                <button>Share!</button>
            </div><br>
            
            <label id="dark">
                <input type="checkbox" autocomplete="off" id="darkmode" />
                Light Mode
            </label>
        `}};Oe.styles=[k.styles,it.styles,Ee.styles,x`
        
    `];let le=Oe;const Br=[{path:"/app/writing/:id",view:r=>v`
        <writing-view writing-id=${r.id}></writing-view>
        `},{path:"/app/writing",view:r=>v`
        <writing-view writing-id=${r.id}></writing-view>
        `},{path:"/app/reading/:id",view:r=>v`
        <reading-view reading-id=${r.id}></reading-view>
        `},{path:"/app/login",view:()=>v`
        <login-view></login-view>
        `},{path:"/app/signup",view:()=>v`
        <signup-view></signup-view>
        `},{path:"/app/personal",view:()=>v`
        <personal-view></personal-view>
        `},{path:"/app/profile",view:()=>v`
        <profile-view></profile-view>
        `},{path:"/app/search",view:()=>v`
        <search-view></search-view>
        `},{path:"/app/post",view:()=>v`
        <post-view></post-view>
        `},{path:"/app/share",view:()=>v`
        <share-view></share-view>
        `},{path:"/app",view:()=>v`
        <home-view></home-view>
        `},{path:"/",redirect:"/app"}];jt({"mu-auth":ci.Provider,"mu-history":mi.Provider,"nav-bar":yt,"mu-switch":class extends ar.Element{constructor(){super(Br,"world:history","world:auth")}},"home-view":ie,"personal-view":re,"login-view":ne,"search-view":oe,"post-view":ae,"share-view":le});
