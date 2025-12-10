import{f as d,u as g,i as y,x as u,r as v,a as m}from"./nav-bar-DSuI490Z.js";const w={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:d},b=(i=w,s,e)=>{const{kind:n,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),n==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),n==="accessor"){const{name:t}=e;return{set(a){const p=s.get.call(this);s.set.call(this,a),this.requestUpdate(t,p,i)},init(a){return a!==void 0&&this.C(t,void 0,i,a),a}}}if(n==="setter"){const{name:t}=e;return function(a){const p=this[t];s.call(this,a),this.requestUpdate(t,p,i)}}throw Error("Unsupported decorator location: "+n)};function c(i){return(s,e)=>typeof e=="object"?b(i,s,e):((n,r,o)=>{const t=r.hasOwnProperty(o);return r.constructor.createProperty(o,n),t?Object.getOwnPropertyDescriptor(r,o):void 0})(i,s,e)}function x(i){return c({...i,state:!0,attribute:!1})}var $=Object.defineProperty,h=(i,s,e,n)=>{for(var r=void 0,o=i.length-1,t;o>=0;o--)(t=i[o])&&(r=t(s,e,r)||r);return r&&$(s,e,r),r};const f=class f extends y{constructor(){super(...arguments),this.type="",this.icon="icon_logo",this.title="Writing Card",this.writings=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src,this.type)}hydrate(s,e){const n="Caleb Kira",r="http://localhost:3000/api/stories/categories/"+e,o=r+"/"+n;s=="personal"?fetch(o).then(t=>(console.log(t.status),t.json())).then(t=>{t&&(this.writings=t)}):fetch(r).then(t=>(console.log(t.status),t.json())).then(t=>{t&&(this.writings=t)})}render(){function s(e){return u`
                <a href=${"./writing.html"}>${e.storyid}</a>
            `}return this.writings||(this.writings=[]),u`
        <div class="stuff">
            <h3>
                <svg class="icon">
                    <use href="./icons/page_icons.svg#${this.icon}" />
                </svg>
                ${this.title}
            </h3>
            <ul>
                ${this.writings.map(s).map(e=>u`<li>${e}</li>`)}
            </ul>
        </div>
        `}};f.styles=[v.styles,m`
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
    `];let l=f;h([c({type:String})],l.prototype,"type");h([c({type:String})],l.prototype,"icon");h([c({type:String})],l.prototype,"title");h([c()],l.prototype,"src");h([x()],l.prototype,"writings");export{l as W};
