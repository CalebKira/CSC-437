import{f as u,u as g,i as f,x as v,r as y,a as m,d as b,N as w}from"./nav-bar-BG7AcoGY.js";const P={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:u},x=(e=P,i,r)=>{const{kind:n,metadata:t}=r;let o=globalThis.litPropertyMetadata.get(t);if(o===void 0&&globalThis.litPropertyMetadata.set(t,o=new Map),n==="setter"&&((e=Object.create(e)).wrapped=!0),o.set(r.name,e),n==="accessor"){const{name:s}=r;return{set(a){const c=i.get.call(this);i.set.call(this,a),this.requestUpdate(s,c,e)},init(a){return a!==void 0&&this.C(s,void 0,e,a),a}}}if(n==="setter"){const{name:s}=r;return function(a){const c=this[s];i.call(this,a),this.requestUpdate(s,c,e)}}throw Error("Unsupported decorator location: "+n)};function p(e){return(i,r)=>typeof r=="object"?x(e,i,r):((n,t,o)=>{const s=t.hasOwnProperty(o);return t.constructor.createProperty(o,n),s?Object.getOwnPropertyDescriptor(t,o):void 0})(e,i,r)}var O=Object.defineProperty,d=(e,i,r,n)=>{for(var t=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(t=s(i,r,t)||t);return t&&O(i,r,t),t};const h=class h extends f{constructor(){super(...arguments),this.icon="icon_logo",this.title="Writing Card"}render(){return v`
        <div class="${this.type}">
            <h3>
                <svg class="icon">
                    <use href="./icons/page_icons.svg#${this.icon}" />
                </svg>
                ${this.title}
            </h3>
            <ul>
                <slot></slot>
            </ul>
        </div>
        `}};h.styles=[y.styles,m`
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
    
        .characters, .settings, .plots, .worlds {
            border: 1px solid var(--color-light-text);
        }

        .characters ul, .settings ul, .plots ul, .worlds ul{
            place-items: center;
            list-style-type: none;
            padding-left: 0;
        }
    `];let l=h;d([p({type:String})],l.prototype,"type");d([p({type:String})],l.prototype,"icon");d([p({type:String})],l.prototype,"title");b({"writing-card":l,"nav-bar":w});
