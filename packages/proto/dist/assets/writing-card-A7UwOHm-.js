import{i as u,O as f,x as a,r as g,b as d,n as h,c as y}from"./nav-bar-BxM_Gnch.js";var v=Object.defineProperty,n=(c,e,i,o)=>{for(var t=void 0,r=c.length-1,p;r>=0;r--)(p=c[r])&&(t=p(e,i,t)||t);return t&&v(e,i,t),t};const l=class l extends u{constructor(){super(...arguments),this.type="",this.icon="icon_logo",this.title="Writing Card",this.writings=[],this._authObserver=new f(this,"world:auth")}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{this._user=e.user,this._user!=null&&this.src!=null&&this.hydrate(this.src,this._user.username)}),this.src&&this.hydrate(this.src,"")}hydrate(e,i){if(i!=""){if(this.authorization!=!1){const o="http://localhost:3000/api/stories/categories/"+this.type+"/"+i;if(e=="personal")fetch(o,{headers:this.authorization}).then(t=>t.json()).then(t=>{t&&(this.writings=t)});else{const t="http://localhost:3000/search/categories/"+this.type;fetch(t).then(r=>r.json()).then(r=>{r&&(this.writings=r)})}}}else if(e!="personal"){const o="http://localhost:3000/search/categories/"+this.type;fetch(o).then(t=>t.json()).then(t=>{t&&(this.writings=t)})}}render(){function e(i){return a`
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
        `}};l.styles=[g.styles,d`
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
    `];let s=l;n([h({type:String})],s.prototype,"type");n([h({type:String})],s.prototype,"icon");n([h({type:String})],s.prototype,"title");n([h()],s.prototype,"src");n([y()],s.prototype,"writings");export{s as W};
