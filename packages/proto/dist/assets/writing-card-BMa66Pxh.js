import{i as f,x as a,r as g,a as d}from"./nav-bar-t5fDndNx.js";import{n as l,r as u}from"./state-UR3Q4FwZ.js";var y=Object.defineProperty,n=(p,s,e,c)=>{for(var i=void 0,o=p.length-1,t;o>=0;o--)(t=p[o])&&(i=t(s,e,i)||i);return i&&y(s,e,i),i};const h=class h extends f{constructor(){super(...arguments),this.type="",this.icon="icon_logo",this.title="Writing Card",this.writings=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src,this.type)}hydrate(s,e){const c="Caleb Kira",i="http://localhost:3000/api/stories/categories/"+e,o=i+"/"+c;s=="personal"?fetch(o).then(t=>(console.log(t.status),t.json())).then(t=>{t&&(this.writings=t)}):fetch(i).then(t=>(console.log(t.status),t.json())).then(t=>{t&&(this.writings=t)})}render(){function s(e){return a`
                <a href=${"./writing.html"}>${e.storyid}</a>
            `}return this.writings||(this.writings=[]),a`
        <div class="stuff">
            <h3>
                <svg class="icon">
                    <use href="./icons/page_icons.svg#${this.icon}" />
                </svg>
                ${this.title}
            </h3>
            <ul>
                ${this.writings.map(s).map(e=>a`<li>${e}</li>`)}
            </ul>
        </div>
        `}};h.styles=[g.styles,d`
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
    `];let r=h;n([l({type:String})],r.prototype,"type");n([l({type:String})],r.prototype,"icon");n([l({type:String})],r.prototype,"title");n([l()],r.prototype,"src");n([u()],r.prototype,"writings");export{r as W};
