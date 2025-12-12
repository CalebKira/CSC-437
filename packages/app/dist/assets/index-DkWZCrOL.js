(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var J,De;class ht extends Error{}ht.prototype.name="InvalidTokenError";function lr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function cr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return lr(t)}catch{return atob(t)}}function gs(i,t){if(typeof i!="string")throw new ht("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new ht(`Invalid token specified: missing part #${e+1}`);let r;try{r=cr(s)}catch(n){throw new ht(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new ht(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const hr="mu:context",ee=`${hr}:change`;class ur{constructor(t,e){this._proxy=dr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class pe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ur(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ee,t),t}detach(t){this.removeEventListener(ee,t)}}function dr(i,t){return new Proxy(i,{get:(s,r,n)=>r==="then"?void 0:Reflect.get(s,r,n),set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let d=new CustomEvent(ee,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:r,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function pr(i,t){const e=ms(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function ms(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return ms(i,r.host)}class fr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function vs(i="mu:message"){return(t,...e)=>t.dispatchEvent(new fr(e,i))}class fe{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[s,...r]=e;this._context.value=s,r.forEach(n=>n.then(o=>{o.length&&this.consume(o)}))}}}const se="mu:auth:jwt",ys=class _s extends fe{constructor(t,e){super((s,r)=>this.update(s,r),t,_s.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:r,redirect:n}=t[1];return[mr(r),Qt(n)]}case"auth/signout":return[vr(e.user),Qt(this._redirectForLogin)];case"auth/redirect":return[e,Qt(this._redirectForLogin,{next:window.location.href})];default:const s=t[0];throw new Error(`Unhandled Auth message "${s}"`)}}};ys.EVENT_TYPE="auth:message";let $s=ys;const bs=vs($s.EVENT_TYPE);function Qt(i,t){return new Promise((e,s)=>{if(i){const r=window.location.href,n=new URL(i,r);t&&Object.entries(t).forEach(([o,l])=>n.searchParams.set(o,l)),console.log("Redirecting to ",i),window.location.assign(n)}e([])})}class gr extends pe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=tt.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new $s(this.context,this.redirect).attach(this)}}class X{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(se),t}}class tt extends X{constructor(t){super();const e=gs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new tt(t);return localStorage.setItem(se,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(se);return t?tt.authenticate(t):new X}}function mr(i){return{user:tt.authenticate(i),token:i}}function vr(i){return{user:i&&i.authenticated?X.deauthenticate(i):i,token:""}}function yr(i){return i&&i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function _r(i){return i.authenticated?gs(i.token||""):{}}const ge=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:tt,Provider:gr,User:X,dispatch:bs,headers:yr,payload:_r},Symbol.toStringTag,{value:"Module"}));function ws(i,t,e){const s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});i.dispatchEvent(s)}function Tt(i,t,e){const s=i.target;ws(s,t,e)}function re(i,t="*"){return i.composedPath().find(r=>{const n=r;return n.tagName&&n.matches(t)})||void 0}const $r=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:ws,originalTarget:re,relay:Tt},Symbol.toStringTag,{value:"Module"}));function me(i,...t){const e=i.map((r,n)=>n?[t[n-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const br=new DOMParser;function z(i,...t){const e=t.map(l),s=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),r=br.parseFromString(s,"text/html"),n=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Fe(a);case"bigint":case"boolean":case"number":case"symbol":return Fe(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Fe(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ft(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:n};return s;function r(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let wr=(J=class extends HTMLElement{constructor(){super(),this._state={},Ft(this).template(J.template).styles(J.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Tt(i,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var i,t;for(const e of((i=this.submitSlot)==null?void 0:i.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(i){this._state=i||{},Ar(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}get submitSlot(){var i;const t=(i=this.shadowRoot)==null?void 0:i.querySelector('slot[name="submit"]');return t||null}},J.template=z`
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
  `,J.styles=me`
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
  `,J);function Ar(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":r instanceof Date?o.value=r.toISOString().substr(0,10):o.value=r;break;default:o.value=r;break}}}return i}const Er=Object.freeze(Object.defineProperty({__proto__:null,Element:wr},Symbol.toStringTag,{value:"Module"})),As=class Es extends fe{constructor(t){super((e,s)=>this.update(e,s),t,Es.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];return xr(s,r)}case"history/redirect":{const{href:s,state:r}=t[1];return Pr(s,r)}}}};As.EVENT_TYPE="history:message";let ve=As;class qe extends pe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Sr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(!this._root||s.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ye(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ve(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function Sr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function xr(i,t={}){return history.pushState(t,"",i),{location:document.location,state:history.state}}function Pr(i,t={}){return history.replaceState(t,"",i),{location:document.location,state:history.state}}const ye=vs(ve.EVENT_TYPE),Ss=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:qe,Provider:qe,Service:ve,dispatch:ye},Symbol.toStringTag,{value:"Module"}));class D{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Be(this._provider,t);this._effects.push(r),e(r)}else pr(this._target,this._contextLabel).then(r=>{const n=new Be(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Be{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const xs=class Ps extends HTMLElement{constructor(){super(),this._state={},this._user=new X,this._authObserver=new D(this,"blazing:auth"),Ft(this).template(Ps.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Cr(r,this._state,e,this.authorization).then(n=>ot(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ot(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&We(this.src,this.authorization).then(e=>{this._state=e,ot(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&We(this.src,this.authorization).then(r=>{this._state=r,ot(r,this)});break;case"new":s&&(this._state={},ot({},this));break}}};xs.observedAttributes=["src","new","action"];xs.template=z`
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
  `;function We(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function ot(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function Cr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Cs=class ks extends fe{constructor(t,e){super(e,t,ks.EVENT_TYPE,!1)}};Cs.EVENT_TYPE="mu:message";let Os=Cs;class kr extends pe{constructor(t,e,s){super(e),this._user=new X,this._updateFn=t,this._authObserver=new D(this,s)}connectedCallback(){const t=new Os(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Or=Object.freeze(Object.defineProperty({__proto__:null,Provider:kr,Service:Os},Symbol.toStringTag,{value:"Module"}));const kt=globalThis,_e=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),Ve=new WeakMap;let Ts=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(_e&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ve.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ve.set(e,t))}return t}toString(){return this.cssText}};const Tr=i=>new Ts(typeof i=="string"?i:i+"",void 0,$e),Rr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Ts(e,i,$e)},Nr=(i,t)=>{if(_e)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=kt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ye=_e?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Tr(e)})(i):i;const{is:Mr,defineProperty:Ur,getOwnPropertyDescriptor:Lr,getOwnPropertyNames:jr,getOwnPropertySymbols:Ir,getPrototypeOf:Hr}=Object,et=globalThis,Je=et.trustedTypes,zr=Je?Je.emptyScript:"",Ke=et.reactiveElementPolyfillSupport,ut=(i,t)=>i,Rt={toAttribute(i,t){switch(t){case Boolean:i=i?zr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},be=(i,t)=>!Mr(i,t),Ge={attribute:!0,type:String,converter:Rt,reflect:!1,useDefault:!1,hasChanged:be};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),et.litPropertyMetadata??(et.litPropertyMetadata=new WeakMap);let G=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ge){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Ur(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Lr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ge}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Hr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...jr(e),...Ir(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ye(r))}else t!==void 0&&e.push(Ye(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Nr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Rt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s,r;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const l=n.getPropertyOptions(o),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((s=l.converter)==null?void 0:s.fromAttribute)!==void 0?l.converter:Rt;this._$Em=o,this[o]=a.fromAttribute(e,l.type)??((r=this._$Ej)==null?void 0:r.get(o))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??be)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[ut("elementProperties")]=new Map,G[ut("finalized")]=new Map,Ke?.({ReactiveElement:G}),(et.reactiveElementVersions??(et.reactiveElementVersions=[])).push("2.1.0");const Nt=globalThis,Mt=Nt.trustedTypes,Ze=Mt?Mt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Rs="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Ns="?"+T,Dr=`<${Ns}>`,F=document,pt=()=>F.createComment(""),ft=i=>i===null||typeof i!="object"&&typeof i!="function",we=Array.isArray,Fr=i=>we(i)||typeof i?.[Symbol.iterator]=="function",Xt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Qe=/-->/g,Xe=/>/g,L=RegExp(`>|${Xt}(?:([^\\s"'>=/]+)(${Xt}*=${Xt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ts=/'/g,es=/"/g,Ms=/^(?:script|style|textarea|title)$/i,qr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),lt=qr(1),st=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),ss=new WeakMap,I=F.createTreeWalker(F,129);function Us(i,t){if(!we(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ze!==void 0?Ze.createHTML(t):t}const Br=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=at;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===at?f[1]==="!--"?o=Qe:f[1]!==void 0?o=Xe:f[2]!==void 0?(Ms.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=r??at,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?L:f[3]==='"'?es:ts):o===es||o===ts?o=L:o===Qe||o===Xe?o=at:(o=L,r=void 0);const h=o===L&&i[l+1].startsWith("/>")?" ":"";n+=o===at?a+Dr:u>=0?(s.push(d),a.slice(0,u)+Rs+a.slice(u)+T+h):a+T+(u===-2?l:h)}return[Us(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ie=class Ls{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Br(t,e);if(this.el=Ls.createElement(d,s),I.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=I.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Rs)){const c=f[o++],h=r.getAttribute(u).split(T),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Vr:p[1]==="?"?Yr:p[1]==="@"?Jr:qt}),r.removeAttribute(u)}else u.startsWith(T)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Ms.test(r.tagName)){const u=r.textContent.split(T),c=u.length-1;if(c>0){r.textContent=Mt?Mt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],pt()),I.nextNode(),a.push({type:2,index:++n});r.append(u[c],pt())}}}else if(r.nodeType===8)if(r.data===Ns)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(T,u+1))!==-1;)a.push({type:7,index:n}),u+=T.length-1}n++}}static createElement(t,e){const s=F.createElement("template");return s.innerHTML=t,s}};function rt(i,t,e=i,s){var r,n;if(t===st)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=ft(t)?void 0:t._$litDirective$;return o?.constructor!==l&&((n=o?._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=rt(i,o._$AS(i,t.values),o,s)),t}let Wr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??F).importNode(e,!0);I.currentNode=r;let n=I.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Ae(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Kr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=I.nextNode(),o++)}return I.currentNode=F,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Ae=class js{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),ft(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Fr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ie.createElement(Us(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Wr(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=ss.get(t.strings);return e===void 0&&ss.set(t.strings,e=new ie(t)),e}k(t){we(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new js(this.O(pt()),this.O(pt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},qt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=rt(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==st,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=rt(this,l[s+a],e,a),d===st&&(d=this._$AH[a]),o||(o=!ft(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Vr=class extends qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},Yr=class extends qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},Jr=class extends qt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??$)===st)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Kr=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}};const rs=Nt.litHtmlPolyfillSupport;rs?.(ie,Ae),(Nt.litHtmlVersions??(Nt.litHtmlVersions=[])).push("3.3.0");const Gr=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const n=e?.renderBefore??null;s._$litPart$=r=new Ae(t.insertBefore(pt(),n),n,void 0,e??{})}return r._$AI(i),r};const gt=globalThis;let Q=class extends G{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Gr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}};Q._$litElement$=!0,Q.finalized=!0,(De=gt.litElementHydrateSupport)==null||De.call(gt,{LitElement:Q});const is=gt.litElementPolyfillSupport;is?.({LitElement:Q});(gt.litElementVersions??(gt.litElementVersions=[])).push("4.2.0");const Zr={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:be},Qr=(i=Zr,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function Is(i){return(t,e)=>typeof e=="object"?Qr(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}function Hs(i){return Is({...i,state:!0,attribute:!1})}function Xr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function ti(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var zs={};(function(i){var t=(function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,y,Yt){var E=y.length-1;switch(g){case 1:return new m.Root({},[y[E-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[y[E-1],y[E]]);break;case 4:case 5:this.$=y[E];break;case 6:this.$=new m.Literal({value:y[E]});break;case 7:this.$=new m.Splat({name:y[E]});break;case 8:this.$=new m.Param({name:y[E]});break;case 9:this.$=new m.Optional({},[y[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],y=this.table,Yt="",E=0,Ie=0,ir=2,He=1,nr=g.slice.call(arguments,1),_=Object.create(this.lexer),M={yy:{}};for(var Jt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Jt)&&(M.yy[Jt]=this.yy[Jt]);_.setInput(c,M.yy),M.yy.lexer=_,M.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Kt=_.yylloc;g.push(Kt);var or=_.options&&_.options.ranges;typeof M.yy.parseError=="function"?this.parseError=M.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ar=function(){var Y;return Y=_.lex()||He,typeof Y!="number"&&(Y=h.symbols_[Y]||Y),Y},w,U,x,Gt,V={},Pt,C,ze,Ct;;){if(U=p[p.length-1],this.defaultActions[U]?x=this.defaultActions[U]:((w===null||typeof w>"u")&&(w=ar()),x=y[U]&&y[U][w]),typeof x>"u"||!x.length||!x[0]){var Zt="";Ct=[];for(Pt in y[U])this.terminals_[Pt]&&Pt>ir&&Ct.push("'"+this.terminals_[Pt]+"'");_.showPosition?Zt="Parse error on line "+(E+1)+`:
`+_.showPosition()+`
Expecting `+Ct.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Zt="Parse error on line "+(E+1)+": Unexpected "+(w==He?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Zt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Kt,expected:Ct})}if(x[0]instanceof Array&&x.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+w);switch(x[0]){case 1:p.push(w),m.push(_.yytext),g.push(_.yylloc),p.push(x[1]),w=null,Ie=_.yyleng,Yt=_.yytext,E=_.yylineno,Kt=_.yylloc;break;case 2:if(C=this.productions_[x[1]][1],V.$=m[m.length-C],V._$={first_line:g[g.length-(C||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(C||1)].first_column,last_column:g[g.length-1].last_column},or&&(V._$.range=[g[g.length-(C||1)].range[0],g[g.length-1].range[1]]),Gt=this.performAction.apply(V,[Yt,Ie,E,M.yy,x[1],m,g].concat(nr)),typeof Gt<"u")return Gt;C&&(p=p.slice(0,-1*C*2),m=m.slice(0,-1*C),g=g.slice(0,-1*C)),p.push(this.productions_[x[1]][0]),m.push(V.$),g.push(V._$),ze=y[p[p.length-2]][p[p.length-1]],p.push(ze);break;case 3:return!0}}return!0}},d=(function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(p=this._input.match(this.rules[g[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=y,this.options.backtrack_lexer){if(c=this.test_match(p,g[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof ti<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(zs);function K(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Ds={Root:K("Root"),Concat:K("Concat"),Literal:K("Literal"),Splat:K("Splat"),Param:K("Param"),Optional:K("Optional")},Fs=zs.parser;Fs.yy=Ds;var ei=Fs,si=Object.keys(Ds);function ri(i){return si.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var qs=ri,ii=qs,ni=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Bs(i){this.captures=i.captures,this.re=i.re}Bs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var oi=ii({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(ni,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Bs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),ai=oi,li=qs,ci=li({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),hi=ci,ui=ei,di=ai,pi=hi;wt.prototype=Object.create(null);wt.prototype.match=function(i){var t=di.visit(this.ast),e=t.match(i);return e||!1};wt.prototype.reverse=function(i){return pi.visit(this.ast,i)};function wt(i){var t;if(this?t=this:t=Object.create(wt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ui.parse(i),t}var fi=wt,gi=fi,mi=gi;const vi=Xr(mi);var yi=Object.defineProperty,Ws=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&yi(t,e,r),r};const Vs=class extends Q{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>lt` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new vi(r.path)})),this._historyObserver=new D(this,e),this._authObserver=new D(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),lt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(bs(this,"auth/redirect"),lt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):lt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),lt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){ye(this,"history/redirect",{href:t})}};Vs.styles=Rr`
    :host,
    main {
      display: contents;
    }
  `;let Ut=Vs;Ws([Hs()],Ut.prototype,"_user");Ws([Hs()],Ut.prototype,"_match");const _i=Object.freeze(Object.defineProperty({__proto__:null,Element:Ut,Switch:Ut},Symbol.toStringTag,{value:"Module"})),Ys=class ne extends HTMLElement{constructor(){if(super(),Ft(this).template(ne.template).styles(ne.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ys.template=z` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;Ys.styles=me`
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
  `;const Js=class oe extends HTMLElement{constructor(){super(),this._array=[],Ft(this).template(oe.template).styles(oe.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ks("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{re(t,"button.add")?Tt(t,"input-array:add"):re(t,"button.remove")&&Tt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],$i(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Js.template=z`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Js.styles=me`
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
  `;function $i(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Ks(e)))}function Ks(i,t){const e=i===void 0?z`<input />`:z`<input value="${i}" />`;return z`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function At(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var bi=Object.defineProperty,wi=Object.getOwnPropertyDescriptor,Ai=(i,t,e,s)=>{for(var r=wi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&bi(t,e,r),r};class Ee extends Q{constructor(t){super(),this._pending=[],this._observer=new D(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Ai([Is()],Ee.prototype,"model");const Ot=globalThis,Se=Ot.ShadowRoot&&(Ot.ShadyCSS===void 0||Ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xe=Symbol(),ns=new WeakMap;let Gs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==xe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Se&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ns.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ns.set(e,t))}return t}toString(){return this.cssText}};const Ei=i=>new Gs(typeof i=="string"?i:i+"",void 0,xe),A=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1]),i[0]);return new Gs(e,i,xe)},Si=(i,t)=>{if(Se)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const s=document.createElement("style"),r=Ot.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},os=Se?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ei(e)})(i):i;const{is:xi,defineProperty:Pi,getOwnPropertyDescriptor:Ci,getOwnPropertyNames:ki,getOwnPropertySymbols:Oi,getPrototypeOf:Ti}=Object,Bt=globalThis,as=Bt.trustedTypes,Ri=as?as.emptyScript:"",Ni=Bt.reactiveElementPolyfillSupport,dt=(i,t)=>i,Lt={toAttribute(i,t){switch(t){case Boolean:i=i?Ri:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Pe=(i,t)=>!xi(i,t),ls={attribute:!0,type:String,converter:Lt,reflect:!1,useDefault:!1,hasChanged:Pe};Symbol.metadata??=Symbol("metadata"),Bt.litPropertyMetadata??=new WeakMap;let Z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ls){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Pi(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Ci(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ls}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=Ti(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,s=[...ki(e),...Oi(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(os(r))}else t!==void 0&&e.push(os(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Si(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(s.converter?.toAttribute!==void 0?s.converter:Lt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const n=s.getPropertyOptions(r),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Lt;this._$Em=r;const l=o.fromAttribute(e,n.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){const r=this.constructor,n=this[t];if(s??=r.getPropertyOptions(t),!((s.hasChanged??Pe)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,n]of s){const{wrapped:o}=n,l=this[r];o!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((s=>s.hostUpdate?.())),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[dt("elementProperties")]=new Map,Z[dt("finalized")]=new Map,Ni?.({ReactiveElement:Z}),(Bt.reactiveElementVersions??=[]).push("2.1.1");const Ce=globalThis,jt=Ce.trustedTypes,cs=jt?jt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Zs="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Qs="?"+R,Mi=`<${Qs}>`,q=document,mt=()=>q.createComment(""),vt=i=>i===null||typeof i!="object"&&typeof i!="function",ke=Array.isArray,Ui=i=>ke(i)||typeof i?.[Symbol.iterator]=="function",te=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,hs=/-->/g,us=/>/g,j=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ds=/'/g,ps=/"/g,Xs=/^(?:script|style|textarea|title)$/i,Li=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),v=Li(1),it=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),fs=new WeakMap,H=q.createTreeWalker(q,129);function tr(i,t){if(!ke(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return cs!==void 0?cs.createHTML(t):t}const ji=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ct?f[1]==="!--"?o=hs:f[1]!==void 0?o=us:f[2]!==void 0?(Xs.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=r??ct,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?j:f[3]==='"'?ps:ds):o===ps||o===ds?o=j:o===hs||o===us?o=ct:(o=j,r=void 0);const h=o===j&&i[l+1].startsWith("/>")?" ":"";n+=o===ct?a+Mi:u>=0?(s.push(d),a.slice(0,u)+Zs+a.slice(u)+R+h):a+R+(u===-2?l:h)}return[tr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class yt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=ji(t,e);if(this.el=yt.createElement(d,s),H.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=H.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Zs)){const c=f[o++],h=r.getAttribute(u).split(R),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Hi:p[1]==="?"?zi:p[1]==="@"?Di:Wt}),r.removeAttribute(u)}else u.startsWith(R)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Xs.test(r.tagName)){const u=r.textContent.split(R),c=u.length-1;if(c>0){r.textContent=jt?jt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],mt()),H.nextNode(),a.push({type:2,index:++n});r.append(u[c],mt())}}}else if(r.nodeType===8)if(r.data===Qs)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(R,u+1))!==-1;)a.push({type:7,index:n}),u+=R.length-1}n++}}static createElement(t,e){const s=q.createElement("template");return s.innerHTML=t,s}}function nt(i,t,e=i,s){if(t===it)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl;const n=vt(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=nt(i,r._$AS(i,t.values),r,s)),t}class Ii{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??q).importNode(e,!0);H.currentNode=r;let n=H.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Et(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Fi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=H.nextNode(),o++)}return H.currentNode=q,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),vt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==it&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ui(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=yt.createElement(tr(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const n=new Ii(r,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=fs.get(t.strings);return e===void 0&&fs.set(t.strings,e=new yt(t)),e}k(t){ke(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Et(this.O(mt()),this.O(mt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Wt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=nt(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==it,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=nt(this,l[s+a],e,a),d===it&&(d=this._$AH[a]),o||=!vt(d)||d!==this._$AH[a],d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Hi extends Wt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class zi extends Wt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Di extends Wt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??b)===it)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Fi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}}const qi=Ce.litHtmlPolyfillSupport;qi?.(yt,Et),(Ce.litHtmlVersions??=[]).push("3.3.1");const Bi=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const n=e?.renderBefore??null;s._$litPart$=r=new Et(t.insertBefore(mt(),n),n,void 0,e??{})}return r._$AI(i),r};const Oe=globalThis;class S extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Bi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return it}}S._$litElement$=!0,S.finalized=!0,Oe.litElementHydrateSupport?.({LitElement:S});const Wi=Oe.litElementPolyfillSupport;Wi?.({LitElement:S});(Oe.litElementVersions??=[]).push("4.2.1");const Vi={};function Yi(i,t,e){const[s,r,n={}]=i;switch(s){case"profile/request":{const{userid:l}=r;return t.profile?.userid===l?t:[{...t,profile:{userid:l}},Ji(r,e).then(a=>["profile/load",{userid:l,profile:a}])]}case"profile/load":{const{profile:l}=r;return{...t,profile:l}}case"profile/save":{const{userid:l}=r;return[t,Ki(r,e,n).then(a=>["profile/load",{userid:l,profile:a}])]}default:const o=s;throw new Error(`Unhandled Auth message "${o}"`)}}function Ji(i,t){return console.log(i.userid),fetch(`/profile/${i.userid}`,{headers:ge.headers(t)}).then(e=>{if(e.status===200)return e.json();throw"No Response from server"}).then(e=>{if(e)return e;throw"No JSON in response from server"})}function Ki(i,t,e){return fetch(`/profile/${i.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...ge.headers(t)},body:JSON.stringify(i.profile)}).then(s=>{if(s.status===200)return s.json();throw new Error(`Failed to save profile for ${i.userid}`)}).then(s=>{if(s)return e.onSuccess&&e.onSuccess(),s;throw new Error("No JSON in API response")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}const Gi={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:Pe},Zi=(i=Gi,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function O(i){return(t,e)=>typeof e=="object"?Zi(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}function W(i){return O({...i,state:!0,attribute:!1})}const Qi=A`
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
`,P={styles:Qi};var Xi=Object.defineProperty,er=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Xi(t,e,r),r};const Te=class Te extends S{constructor(){super(...arguments),this._authObserver=new D(this,"world:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignOutButton(){return v`
            <button
            @click=${t=>{$r.relay(t,"auth:message",["auth/signout"])}}
            >
            Sign Out
            </button>
        `}renderSignInButton(){return v`
            <a href="/app/login">
            Sign In…
            </a>
        `}src(){return`/app/profile/${this.userid}`}render(){return v`
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

            <a href="/app/personal/${this.userid}">
                <svg class="icon">
                    <use href="../../icons/page_icons.svg#icon_private" />
                </svg>
                Personal
            </a>


            <a slot="actuator" href="${this.loggedIn?this.src():"/app/login"}">
                <svg class="icon">
                    <use href="../../icons/page_icons.svg#icon_profile" />
                </svg>
                Hello, ${this.userid||"traveler"}
            </a>
            ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
        </div> <br>
        `}};Te.styles=[P.styles,A`
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
    `];let _t=Te;er([W()],_t.prototype,"loggedIn");er([W()],_t.prototype,"userid");const tn=A`
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
`,N={styles:tn},Re=class Re extends S{render(){return v`
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
        `}};Re.styles=[P.styles,N.styles,A`
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
    `];let ae=Re;var en=Object.defineProperty,St=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&en(t,e,r),r};const Ne=class Ne extends S{constructor(){super(...arguments),this.type="",this.icon="icon_logo",this.title="Writing Card",this.writings=[],this._authObserver=new D(this,"world:auth")}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this._user!=null&&this.src!=null&&this.hydrate(this.src,this._user.username)}),this.src&&this.hydrate(this.src,"")}hydrate(t,e){if(e!=""){if(this.authorization!=!1){const s="/api/stories/categories/"+this.type+"/"+e;if(t=="personal")fetch(s,{headers:this.authorization}).then(r=>r.json()).then(r=>{r&&(this.writings=r)});else{const r="/search/categories/"+this.type;fetch(r).then(n=>n.json()).then(n=>{n&&(this.writings=n)})}}}else if(t!="personal"){const s="/search/categories/"+this.type;fetch(s).then(r=>r.json()).then(r=>{r&&(this.writings=r)})}}render(){function t(e){return v`
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
        `}};Ne.styles=[P.styles,A`
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
    `];let k=Ne;St([O({type:String})],k.prototype,"type");St([O({type:String})],k.prototype,"icon");St([O({type:String})],k.prototype,"title");St([O()],k.prototype,"src");St([W()],k.prototype,"writings");const It=class It extends S{render(){return v`
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
        `}};It.uses=At({"writing-card":k}),It.styles=[P.styles,N.styles,A`
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
    `];let le=It;var sn=Object.defineProperty,Vt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&sn(t,e,r),r};const Me=class Me extends S{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}handleChange(t){const e=t.target,s=e?.name,r=e?.value,n=this.formData;switch(s){case"username":this.formData={...n,username:r};break;case"password":this.formData={...n,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this?.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}render(){return v`
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
        `}};Me.styles=[P.styles,A`

        .error:not(:empty) {
            color: var(--color-error);
            border: 1px solid var(--color-error);
            padding: var(--size-spacing-medium);
        }
    `];let B=Me;Vt([W()],B.prototype,"formData");Vt([O()],B.prototype,"api");Vt([O()],B.prototype,"redirect");Vt([W()],B.prototype,"error");const rn=A`
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
`,xt={styles:rn},Ht=class Ht extends S{render(){return v`
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
        `}};Ht.uses=At({"login-form":B}),Ht.styles=[P.styles,N.styles,xt.styles,A`

    `];let ce=Ht;const zt=class zt extends S{render(){return v`
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
        `}};zt.uses=At({"writing-card":k}),zt.styles=[P.styles,N.styles,A`
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
    `];let he=zt;const Ue=class Ue extends S{render(){return v`
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
        `}};Ue.styles=[P.styles,N.styles,xt.styles,A`
        
    `];let ue=Ue;const Le=class Le extends S{render(){return v`
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
        `}};Le.styles=[P.styles,N.styles,xt.styles,A`
        
    `];let de=Le;var nn=Object.defineProperty,on=Object.getOwnPropertyDescriptor,sr=(i,t,e,s)=>{for(var r=s>1?void 0:s?on(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&nn(t,e,r),r};const je=class je extends Ee{get profile(){return this.model.profile}constructor(){super("world:model")}render(){const{userid:t,pseudonym:e,email:s}=this.profile||{};return v`
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

                <h4>Name: <br>${t}</h4>
                

                <h4>Pseudonym: <br>${e}</h4>

                <h4>Email: <br>${s}</h4>


                <a href="/app/profile/${t}/edit">Edit</a>
            </div><br>

            <label id="dark">
                <input type="checkbox" autocomplete="off" id="darkmode" />
                Light Mode
            </label>
        `}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="userid"&&e!==s&&s&&this.dispatchMessage(["profile/request",{userid:s}])}};je.styles=[P.styles,N.styles,xt.styles,A`
            
        `];let $t=je;sr([O({attribute:"userid"})],$t.prototype,"userid",2);sr([W()],$t.prototype,"profile",1);var an=Object.defineProperty,ln=Object.getOwnPropertyDescriptor,rr=(i,t,e,s)=>{for(var r=s>1?void 0:s?ln(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&an(t,e,r),r};const Dt=class Dt extends Ee{get profile(){return this.model.profile}constructor(){super("world:model")}render(){return v`
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
        </div>`}handleSubmit(t){this.dispatchMessage(["profile/save",{userid:this.userid,profile:t.detail},{onSuccess:()=>Ss.dispatch(this,"history/navigate",{href:`/app/profile/${this.userid}`}),onFailure:e=>console.log("ERROR:",e)}])}};Dt.uses=At({"mu-form":Er.Element}),Dt.styles=[P.styles,N.styles,xt.styles,A`       
    `];let bt=Dt;rr([O()],bt.prototype,"userid",2);rr([W()],bt.prototype,"profile",1);const cn=[{path:"/app/writing/:id",view:i=>v`
        <writing-view writing-id=${i.id}></writing-view>
        `},{path:"/app/writing",view:()=>v`
        <writing-view></writing-view>
        `},{path:"/app/reading/:id",view:i=>v`
        <reading-view reading-id=${i.id}></reading-view>
        `},{path:"/app/login",view:()=>v`
        <login-view></login-view>
        `},{path:"/app/signup",view:()=>v`
        <signup-view></signup-view>
        `},{path:"/app/personal/:id",view:()=>v`
        <personal-view></personal-view>
        `},{path:"/app/profile/:id",view:i=>v`
        <profile-view userid="${i.id}"></profile-view>
        `},{path:"/app/profile/:id/edit",view:i=>v`
        <profile-edit-view userid="${i.id}"></profile-edit-view>
        `},{path:"/app/search",view:()=>v`
        <search-view></search-view>
        `},{path:"/app/post",view:()=>v`
        <post-view></post-view>
        `},{path:"/app/share",view:()=>v`
        <share-view></share-view>
        `},{path:"/app",view:()=>v`
        <home-view></home-view>
        `},{path:"/",redirect:"/app"}];At({"mu-auth":ge.Provider,"mu-history":Ss.Provider,"nav-bar":_t,"mu-store":class extends Or.Provider{constructor(){super(Yi,Vi,"world:auth")}},"mu-switch":class extends _i.Element{constructor(){super(cn,"world:history","world:auth")}},"home-view":ae,"personal-view":le,"login-view":ce,"search-view":he,"post-view":ue,"share-view":de,"profile-view":$t,"profile-edit-view":bt});
