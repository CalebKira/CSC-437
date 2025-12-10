import{i as d,x as p,r as l,a as f,d as b,b as g,N as v}from"./nav-bar-t5fDndNx.js";import{r as u,n as m}from"./state-UR3Q4FwZ.js";var y=Object.defineProperty,i=(h,r,t,o)=>{for(var e=void 0,s=h.length-1,c;s>=0;s--)(c=h[s])&&(e=c(r,t,e)||e);return e&&y(r,t,e),e};const n=class n extends d{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}handleChange(r){const t=r.target,o=t?.name,e=t?.value,s=this.formData;switch(o){case"username":this.formData={...s,username:e};break;case"password":this.formData={...s,password:e};break}}handleSubmit(r){r.preventDefault(),this.canSubmit&&fetch(this?.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==200)throw"Login failed";return t.json()}).then(t=>{const{token:o}=t,e=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:o,redirect:this.redirect}]});console.log("dispatching message",e),this.dispatchEvent(e)}).catch(t=>{console.log(t),this.error=t.toString()})}render(){return p`
        <form
            @change=${r=>this.handleChange(r)}
            @submit=${r=>this.handleSubmit(r)}
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
        `}};n.styles=[l.styles,f`

        .error:not(:empty) {
            color: var(--color-error);
            border: 1px solid var(--color-error);
            padding: var(--size-spacing-medium);
        }
    `];let a=n;i([u()],a.prototype,"formData");i([m()],a.prototype,"api");i([m()],a.prototype,"redirect");i([u()],a.prototype,"error");b({"nav-bar":v,"mu-auth":g.Provider,"login-form":a});
