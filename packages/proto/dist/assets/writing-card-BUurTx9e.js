import{f as g,u as f,i as y,x as u,r as v,a as m}from"./nav-bar-DSuI490Z.js";const w={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:g},b=(e=w,r,t)=>{const{kind:n,metadata:i}=t;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),n==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(t.name,e),n==="accessor"){const{name:o}=t;return{set(a){const p=r.get.call(this);r.set.call(this,a),this.requestUpdate(o,p,e)},init(a){return a!==void 0&&this.C(o,void 0,e,a),a}}}if(n==="setter"){const{name:o}=t;return function(a){const p=this[o];r.call(this,a),this.requestUpdate(o,p,e)}}throw Error("Unsupported decorator location: "+n)};function c(e){return(r,t)=>typeof t=="object"?b(e,r,t):((n,i,s)=>{const o=i.hasOwnProperty(s);return i.constructor.createProperty(s,n),o?Object.getOwnPropertyDescriptor(i,s):void 0})(e,r,t)}function $(e){return c({...e,state:!0,attribute:!1})}var x=Object.defineProperty,h=(e,r,t,n)=>{for(var i=void 0,s=e.length-1,o;s>=0;s--)(o=e[s])&&(i=o(r,t,i)||i);return i&&x(r,t,i),i};const d=class d extends y{constructor(){super(...arguments),this.icon="icon_logo",this.title="Writing Card",this.writings=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}hydrate(r){fetch(r).then(t=>t.json()).then(t=>{t&&(this.writings=t)})}render(){function r(t){return u`
                <a href=${t.link}>${t.name}</a>
            `}return this.writings||(this.writings=[]),u`
        <div class="${this.type}">
            <h3>
                <svg class="icon">
                    <use href="./icons/page_icons.svg#${this.icon}" />
                </svg>
                ${this.title}
            </h3>
            <ul>
                ${this.writings.map(r).map(t=>u`<li>${t}</li>`)}
            </ul>
        </div>
        `}};d.styles=[v.styles,m`
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
    
        .characters, .settings, .plots, .worlds {
            border: 1px solid var(--color-light-text);
        }

        .characters ul, .settings ul, .plots ul, .worlds ul{
            place-items: center;
            list-style-type: none;
            padding-left: 0;
        }
    `];let l=d;h([c({type:String})],l.prototype,"type");h([c({type:String})],l.prototype,"icon");h([c({type:String})],l.prototype,"title");h([c()],l.prototype,"src");h([$()],l.prototype,"writings");export{l as W};
