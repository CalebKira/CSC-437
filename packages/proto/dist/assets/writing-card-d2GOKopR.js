import{i as p,O as f,x as a,r as d,b as g,n as h,c as v}from"./nav-bar-BxM_Gnch.js";var y=Object.defineProperty,o=(c,e,i,n)=>{for(var r=void 0,t=c.length-1,u;t>=0;t--)(u=c[t])&&(r=u(e,i,r)||r);return r&&y(e,i,r),r};const l=class l extends p{constructor(){super(...arguments),this.type="",this.icon="icon_logo",this.title="Writing Card",this.writings=[],this._authObserver=new f(this,"world:auth")}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{this._user=e.user,this._user!=null&&this.src!=null&&this.hydrate(this.src,this._user.username)})}hydrate(e,i){const n="http://localhost:3000/api/stories/categories/"+this.type,r=n+"/"+i;this.authorization!=!1&&(e=="personal"?fetch(r,{headers:this.authorization}).then(t=>t.json()).then(t=>{t&&(this.writings=t)}):fetch(n).then(t=>t.json()).then(t=>{t&&(this.writings=t)}))}render(){function e(i){return a`
                <a href=${"./writing.html"}>${i.storyid}</a>
            `}return this.writings||(this.writings=[]),a`
        <div class="stuff">
            <h3>
                <svg class="icon">
                    <use href="./icons/page_icons.svg#${this.icon}" />
                </svg>
                ${this.title}
            </h3>
            <ul>
                ${this.writings.map(e).map(i=>a`<li>${i}</li>`)}
            </ul>
        </div>
        `}};l.styles=[d.styles,g`
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
    `];let s=l;o([h({type:String})],s.prototype,"type");o([h({type:String})],s.prototype,"icon");o([h({type:String})],s.prototype,"title");o([h()],s.prototype,"src");o([v()],s.prototype,"writings");export{s as W};
