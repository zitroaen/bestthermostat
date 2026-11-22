var fe=globalThis,ve=fe.ShadowRoot&&(fe.ShadyCSS===void 0||fe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,He=Symbol(),lt=new WeakMap,ee=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==He)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(ve&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=lt.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&lt.set(e,n))}return n}toString(){return this.cssText}},dt=a=>new ee(typeof a=="string"?a:a+"",void 0,He),y=(a,...n)=>{let e=a.length===1?a[0]:n.reduce((t,i,s)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+a[s+1],a[0]);return new ee(e,a,He)},ct=(a,n)=>{if(ve)a.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=fe.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,a.appendChild(t)}},Ue=ve?a=>a:a=>a instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return dt(e)})(a):a;var{is:Ut,defineProperty:Vt,getOwnPropertyDescriptor:Gt,getOwnPropertyNames:Wt,getOwnPropertySymbols:It,getPrototypeOf:jt}=Object,xe=globalThis,pt=xe.trustedTypes,Bt=pt?pt.emptyScript:"",Zt=xe.reactiveElementPolyfillSupport,te=(a,n)=>a,Ve={toAttribute(a,n){switch(n){case Boolean:a=a?Bt:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,n){let e=a;switch(n){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},ut=(a,n)=>!Ut(a,n),ht={attribute:!0,type:String,converter:Ve,reflect:!1,useDefault:!1,hasChanged:ut};Symbol.metadata??=Symbol("metadata"),xe.litPropertyMetadata??=new WeakMap;var C=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=ht){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&Vt(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:s}=Gt(this.prototype,n)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let r=i?.call(this);s?.call(this,o),this.requestUpdate(n,r,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??ht}static _$Ei(){if(this.hasOwnProperty(te("elementProperties")))return;let n=jt(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(te("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(te("properties"))){let e=this.properties,t=[...Wt(e),...It(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(Ue(i))}else n!==void 0&&e.push(Ue(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ct(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let s=(t.converter?.toAttribute!==void 0?t.converter:Ve).toAttribute(e,t.type);this._$Em=n,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let s=t.getPropertyOptions(i),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Ve;this._$Em=i;let r=o.fromAttribute(e,s.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(n,e,t,i=!1,s){if(n!==void 0){let o=this.constructor;if(i===!1&&(s=this[n]),t??=o.getPropertyOptions(n),!((t.hasChanged??ut)(s,e)||t.useDefault&&t.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:s},o){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??e??this[n]),s!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,s]of t){let{wrapped:o}=s,r=this[i];o!==!0||this._$AL.has(i)||r===void 0||this.C(i,void 0,s,r)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[te("elementProperties")]=new Map,C[te("finalized")]=new Map,Zt?.({ReactiveElement:C}),(xe.reactiveElementVersions??=[]).push("2.1.2");var Ke=globalThis,mt=a=>a,we=Ke.trustedTypes,_t=we?we.createPolicy("lit-html",{createHTML:a=>a}):void 0,wt="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,yt="?"+P,Kt=`<${yt}>`,V=document,ne=()=>V.createComment(""),se=a=>a===null||typeof a!="object"&&typeof a!="function",Fe=Array.isArray,Ft=a=>Fe(a)||typeof a?.[Symbol.iterator]=="function",Ge=`[ 	
\f\r]`,ie=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,gt=/-->/g,bt=/>/g,H=RegExp(`>|${Ge}(?:([^\\s"'>=/]+)(${Ge}*=${Ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ft=/'/g,vt=/"/g,$t=/^(?:script|style|textarea|title)$/i,qe=a=>(n,...e)=>({_$litType$:a,strings:n,values:e}),l=qe(1),mi=qe(2),_i=qe(3),G=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),xt=new WeakMap,U=V.createTreeWalker(V,129);function kt(a,n){if(!Fe(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return _t!==void 0?_t.createHTML(n):n}var qt=(a,n)=>{let e=a.length-1,t=[],i,s=n===2?"<svg>":n===3?"<math>":"",o=ie;for(let r=0;r<e;r++){let d=a[r],c,h,u=-1,m=0;for(;m<d.length&&(o.lastIndex=m,h=o.exec(d),h!==null);)m=o.lastIndex,o===ie?h[1]==="!--"?o=gt:h[1]!==void 0?o=bt:h[2]!==void 0?($t.test(h[2])&&(i=RegExp("</"+h[2],"g")),o=H):h[3]!==void 0&&(o=H):o===H?h[0]===">"?(o=i??ie,u=-1):h[1]===void 0?u=-2:(u=o.lastIndex-h[2].length,c=h[1],o=h[3]===void 0?H:h[3]==='"'?vt:ft):o===vt||o===ft?o=H:o===gt||o===bt?o=ie:(o=H,i=void 0);let _=o===H&&a[r+1].startsWith("/>")?" ":"";s+=o===ie?d+Kt:u>=0?(t.push(c),d.slice(0,u)+wt+d.slice(u)+P+_):d+P+(u===-2?r:_)}return[kt(a,s+(a[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},ae=class a{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let s=0,o=0,r=n.length-1,d=this.parts,[c,h]=qt(n,e);if(this.el=a.createElement(c,t),U.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=U.nextNode())!==null&&d.length<r;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(wt)){let m=h[o++],_=i.getAttribute(u).split(P),w=/([.?@])?(.*)/.exec(m);d.push({type:1,index:s,name:w[2],strings:_,ctor:w[1]==="."?Ie:w[1]==="?"?je:w[1]==="@"?Be:Z}),i.removeAttribute(u)}else u.startsWith(P)&&(d.push({type:6,index:s}),i.removeAttribute(u));if($t.test(i.tagName)){let u=i.textContent.split(P),m=u.length-1;if(m>0){i.textContent=we?we.emptyScript:"";for(let _=0;_<m;_++)i.append(u[_],ne()),U.nextNode(),d.push({type:2,index:++s});i.append(u[m],ne())}}}else if(i.nodeType===8)if(i.data===yt)d.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)d.push({type:7,index:s}),u+=P.length-1}s++}}static createElement(n,e){let t=V.createElement("template");return t.innerHTML=n,t}};function B(a,n,e=a,t){if(n===G)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,s=se(n)?void 0:n._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(a),i._$AT(a,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=B(a,i._$AS(a,n.values),i,t)),n}var We=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??V).importNode(e,!0);U.currentNode=i;let s=U.nextNode(),o=0,r=0,d=t[0];for(;d!==void 0;){if(o===d.index){let c;d.type===2?c=new oe(s,s.nextSibling,this,n):d.type===1?c=new d.ctor(s,d.name,d.strings,this,n):d.type===6&&(c=new Ze(s,this,n)),this._$AV.push(c),d=t[++r]}o!==d?.index&&(s=U.nextNode(),o++)}return U.currentNode=V,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},oe=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=B(this,n,e),se(n)?n===p||n==null||n===""?(this._$AH!==p&&this._$AR(),this._$AH=p):n!==this._$AH&&n!==G&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Ft(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==p&&se(this._$AH)?this._$AA.nextSibling.data=n:this.T(V.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=ae.createElement(kt(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new We(i,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(n){let e=xt.get(n.strings);return e===void 0&&xt.set(n.strings,e=new ae(n)),e}k(n){Fe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let s of n)i===e.length?e.push(t=new a(this.O(ne()),this.O(ne()),this,this.options)):t=e[i],t._$AI(s),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=mt(n).nextSibling;mt(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,s){this.type=1,this._$AH=p,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=s,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(n,e=this,t,i){let s=this.strings,o=!1;if(s===void 0)n=B(this,n,e,0),o=!se(n)||n!==this._$AH&&n!==G,o&&(this._$AH=n);else{let r=n,d,c;for(n=s[0],d=0;d<s.length-1;d++)c=B(this,r[t+d],e,d),c===G&&(c=this._$AH[d]),o||=!se(c)||c!==this._$AH[d],c===p?n=p:n!==p&&(n+=(c??"")+s[d+1]),this._$AH[d]=c}o&&!i&&this.j(n)}j(n){n===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Ie=class extends Z{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===p?void 0:n}},je=class extends Z{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==p)}},Be=class extends Z{constructor(n,e,t,i,s){super(n,e,t,i,s),this.type=5}_$AI(n,e=this){if((n=B(this,n,e,0)??p)===G)return;let t=this._$AH,i=n===p&&t!==p||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,s=n!==p&&(t===p||i);i&&this.element.removeEventListener(this.name,this,t),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Ze=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){B(this,n)}};var Yt=Ke.litHtmlPolyfillSupport;Yt?.(ae,oe),(Ke.litHtmlVersions??=[]).push("3.3.3");var St=(a,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let s=e?.renderBefore??null;t._$litPart$=i=new oe(n.insertBefore(ne(),s),s,void 0,e??{})}return i._$AI(a),i};var Ye=globalThis,v=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=St(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};v._$litElement$=!0,v.finalized=!0,Ye.litElementHydrateSupport?.({LitElement:v});var Jt=Ye.litElementPolyfillSupport;Jt?.({LitElement:v});(Ye.litElementVersions??=[]).push("4.2.2");var Rt="bestthermostat",f=["mon","tue","wed","thu","fri","sat","sun"],K,W,Dt,Je,Xe=!1,N,$e=0,F=new Set,Qe=new Set,Et=[2,5,10,30];function ye(a,n){return JSON.stringify(a)===JSON.stringify(n)}function Xt(a,n){if(!a)return n;let e=new Map(a.rooms.map(t=>[t.entry_id,t]));return{...n,rooms:n.rooms.map(t=>{let i=e.get(t.entry_id);return i&&ye(i,t)?i:t}),variables:ye(a.variables,n.variables)?a.variables:n.variables,global_schedules:ye(a.global_schedules,n.global_schedules)?a.global_schedules:n.global_schedules,override:ye(a.override,n.override)?a.override:n.override}}function At(a){Xe!==a&&(Xe=a,Qe.forEach(n=>n(a)))}function Qt(){if(N!==void 0||F.size===0)return;let a=Et[Math.min($e,Et.length-1)];$e+=1,N=window.setTimeout(()=>{N=void 0,F.size&&Je&&Ct(Je)},a*1e3)}function Ct(a){Dt=a.connection;let n=a.connection.subscribeMessage(e=>{$e=0,At(!1),K=Xt(K,e);let t=K;F.forEach(i=>i(t))},{type:`${Rt}/subscribe`}).catch(e=>(console.warn("Best Thermostat: subscription failed, retrying",e),W===n&&(W=void 0),At(!0),Qt(),()=>{}));W=n}function ke(a,n,e){return F.add(n),e&&(Qe.add(e),Xe&&e(!0)),Je=a,K&&n(K),(!W&&N===void 0||Dt!==a.connection)&&(window.clearTimeout(N),N=void 0,Ct(a)),()=>{if(F.delete(n),e&&Qe.delete(e),F.size===0){if(window.clearTimeout(N),N=void 0,$e=0,W){let t=W;W=void 0,t.then(i=>i())}K=void 0}}}function E(a,n,e={}){return a.callWS({type:`${Rt}/${n}`,...e})}function Se(a,n){if(!(!a||!n))return a.rooms.find(e=>e.climate_entity_id===n||e.entry_id===n)}var A=y`
  :host {
    --bt-radius: var(--ha-card-border-radius, 16px);
    --bt-chip-radius: 18px;
    --bt-gap: 12px;
    --bt-muted: var(--secondary-text-color);
    --bt-surface: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    --bt-heat: var(--state-climate-heat-color, #ff8100);
    --bt-accent: var(--primary-color);
    font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, inherit));
  }
  button {
    font: inherit;
    color: inherit;
    border: none;
    background: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .chips.scroll {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 14px;
    border-radius: var(--bt-chip-radius);
    background: var(--bt-surface);
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;
  }
  .chip[aria-pressed="true"] {
    background: var(--bt-accent);
    color: var(--text-primary-color, #fff);
  }
  .chip:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .round {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--bt-surface);
    font-size: 26px;
    line-height: 1;
    flex: none;
  }
  .round:active,
  .chip:active {
    filter: brightness(0.92);
  }
  .muted {
    color: var(--bt-muted);
  }
  .primary-btn {
    min-height: 40px;
    padding: 0 18px;
    border-radius: 20px;
    background: var(--bt-accent);
    color: var(--text-primary-color, #fff);
    font-weight: 500;
  }
  .primary-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .text-btn {
    min-height: 40px;
    padding: 0 14px;
    border-radius: 20px;
    color: var(--bt-accent);
    font-weight: 500;
  }
  .text-btn:disabled {
    opacity: 0.4;
  }
  input[type="text"],
  input[type="number"] {
    font: inherit;
    color: var(--primary-text-color);
    background: var(--bt-surface);
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 8px 10px;
    min-height: 24px;
    width: 100%;
    box-sizing: border-box;
  }
  input:focus {
    outline: none;
    border-color: var(--bt-accent);
  }
  .error {
    color: var(--error-color, #db4437);
    font-size: 13px;
  }
`,Ee=y`
      :host {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-text-color);
      }
      .backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
      }
      .dialog {
        position: relative;
        display: flex;
        flex-direction: column;
        width: min(520px, 100vw);
        max-height: min(760px, 100dvh);
        background: var(--card-background-color, var(--primary-background-color));
        border-radius: var(--bt-radius);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }
      @media (max-width: 600px) {
        .dialog {
          width: 100vw;
          height: 100dvh;
          max-height: none;
          border-radius: 0;
        }
      }
      header,
      footer {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        padding-left: max(16px, env(safe-area-inset-left));
        padding-right: max(16px, env(safe-area-inset-right));
      }
      header {
        border-bottom: 1px solid var(--divider-color);
        padding-top: max(12px, env(safe-area-inset-top));
      }
      footer {
        justify-content: flex-end;
        border-top: 1px solid var(--divider-color);
        padding-bottom: max(12px, env(safe-area-inset-bottom));
      }
      .h-title {
        flex: 1;
      }
      .h-name {
        font-weight: 600;
        font-size: 17px;
      }
      .h-sub {
        font-size: 13px;
      }
      .content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .label {
        font-size: 13px;
        font-weight: 600;
        color: var(--bt-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .label .muted {
        text-transform: none;
        font-weight: 400;
      }
`;var R=15,x=1440;function L(a){let[n,e]=a.split(":").map(Number);return n*60+e}function D(a){let n=Math.floor(a/60),e=a%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function et(a){return Math.round(a/R)*R}function z(a,n){return a.variable!==void 0?n.find(e=>e.id===a.variable)?.value:a.temperature}function re(a,n){if(a.variable!==void 0){let e=n.find(t=>t.id===a.variable);return e?e.name:a.variable}return g(a.temperature)}function g(a,n=!0){if(a==null||Number.isNaN(a))return"\u2013";let e=(Math.round(a*2)/2).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1});return n?`${e} \xB0C`:e}var I=[[12,[90,140,220]],[16,[120,180,235]],[18,[150,210,200]],[19.5,[250,215,110]],[21,[255,175,85]],[23,[250,125,70]],[26,[225,75,60]]];function $(a){if(a===void 0)return"var(--disabled-color, #9e9e9e)";if(a<=I[0][0])return`rgb(${I[0][1].join(",")})`;for(let n=1;n<I.length;n++){let[e,t]=I[n];if(a<=e){let[i,s]=I[n-1],o=(a-i)/(e-i);return`rgb(${s.map((r,d)=>Math.round(r+(t[d]-r)*o)).join(",")})`}}return`rgb(${I[I.length-1][1].join(",")})`}function le(a){return JSON.parse(JSON.stringify(a))}function q(a,n){return JSON.stringify(a)===JSON.stringify(n)}function O(a){return a.map((n,e)=>({start:L(n.start),end:e+1<a.length?L(a[e+1].start):x,slot:n}))}function De(a,n){let e=new Intl.DateTimeFormat("en-US",{timeZone:n,weekday:"short",hour:"2-digit",minute:"2-digit",year:"numeric",month:"2-digit",day:"2-digit",hourCycle:"h23"}).formatToParts(a),t=s=>e.find(o=>o.type===s)?.value??"";return{day:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].indexOf(t("weekday")),minutes:Number(t("hour"))*60+Number(t("minute")),ymd:`${t("year")}-${t("month")}-${t("day")}`}}function tt(a){return a?.config?.time_zone||void 0}function ei(a){return a?.locale?.time_zone==="server"?tt(a):void 0}function Ce(a){return De(new Date,tt(a)).minutes}function Y(a){return f[De(new Date,tt(a)).day]}function k(a,n){if(!a)return"";let e=new Date(a),t=n.locale?.language||n.language,i=ei(n),s=e.toLocaleTimeString(t,{hour:"2-digit",minute:"2-digit",timeZone:i});if(De(e,i).ymd===De(new Date,i).ymd)return s;let o=(e.getTime()-Date.now())/864e5;return o>-1&&o<6?`${e.toLocaleDateString(t,{weekday:"short",timeZone:i})} ${s}`:`${e.toLocaleDateString(t,{weekday:"short",day:"numeric",month:"short",timeZone:i})} ${s}`}var zt={de:{auto:"Auto",heat:"Manuell",off:"Aus",schedule:"Zeitplan",schedules:"Zeitpl\xE4ne",edit:"Wochenplan bearbeiten",schedule_paused:"pausiert",period:"Zeitraum",period_until:"bis",period_open:"bis auf Weiteres",period_planned:"Geplant",period_from:"ab",period_end:"Beenden",period_delete:"L\xF6schen",period_plan:"Zeitraum planen",period_edit:"Zeitraum bearbeiten",period_less:"weniger anzeigen",period_what:"Was soll gelten?",period_start:"Beginn",period_end_label:"Ende",period_now:"Jetzt",period_at:"Zeitpunkt",period_title:"Titel",period_title_hint:"z. B. Besuch von Oma",period_invalid:"Bitte g\xFCltigen Beginn und ein Ende in der Zukunft nach dem Beginn w\xE4hlen.",period_more:"weitere geplant",optional:"optional",prio_title:"Priorit\xE4ten",prio_short:"Priorit\xE4t",week_plan:"Wochenplan",new_version:"Neue Version der Karte verf\xFCgbar.",reload:"Neu laden",then:"dann",copy_to_rooms:"In andere R\xE4ume kopieren",copy_rooms_hint:"\u201E{name}\u201C wird in die gew\xE4hlten R\xE4ume kopiert. Gibt es dort schon einen gleichnamigen Zeitplan, wird er ersetzt.",will_replace:"wird ersetzt",will_create:"wird neu angelegt",all_rooms:"Alle R\xE4ume",copied_to:"Kopiert nach:",copy_unsaved:"Es wird der gespeicherte Stand kopiert, nicht deine ungespeicherten \xC4nderungen. Fortfahren?",battery:"Batterie",battery_low:"schwach",battery_ok:"OK",more:"Mehr",not_active:"Dieser Zeitplan ist gerade nicht aktiv.",unsaved_short:"Ungespeicherte \xC4nderungen",manage_variables:"Variablen verwalten",delete_schedule:"Zeitplan l\xF6schen",edit_short:"Bearbeiten",from:"Von",to:"Bis",days_long:["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],weekend:"Wochenende",copy_day_short:"Tag kopieren",add:"Hinzuf\xFCgen",cancel:"Abbrechen",ok:"OK",swipe_hint:"Zum \xC4ndern waagerecht wischen",today:"Heute",period_plural:"Zeitr\xE4ume",period_planned_n:"geplant",heating_summary:"heizen",of:"von",rooms_word:"R\xE4umen",other_floor:"Weitere",open_details:"Details",prio_hand:"\xC4nderung von Hand",prio_room:"Raum",prio_inactive:"aus",prio_none:"keine",until:"bis",next:"N\xE4chster Wechsel",src_override:"Globaler Override",src_off:"Frostschutz",src_manual:"Manuell",src_hand:"Ge\xE4ndert",src_schedule:"Zeitplan",heating:"Heizt",idle:"Bereit",save:"Speichern",discard:"Verwerfen",close:"Schlie\xDFen",new_schedule:"Neuer Zeitplan",rename:"Umbenennen",duplicate:"Duplizieren",delete:"L\xF6schen",activate:"Aktivieren",active:"Aktiv",split:"Teilen",copy_day:"Tag kopieren auf \u2026",copy:"Kopieren",workdays:"Mo\u2013Fr",all_days:"Alle",fixed:"Fest",variables:"Variablen",add_variable:"Variable hinzuf\xFCgen",name:"Name",value:"Wert",unsaved:"Ungespeicherte \xC4nderungen verwerfen?",confirm_delete:"Zeitplan wirklich l\xF6schen?",tap_hint:"Abschnitt antippen zum Bearbeiten, Grenzen ziehen zum Verschieben.",days:["Mo","Di","Mi","Do","Fr","Sa","So"],unreachable:"Best Thermostat ist nicht erreichbar. Neuer Versuch l\xE4uft \u2026",not_found:"Raum nicht gefunden. Bitte in der Kartenkonfiguration einen Best-Thermostat-Raum w\xE4hlen.",loading:"Lade \u2026",override:"Globaler Override",override_also:"Gilt auch f\xFCr",override_not_applied:"Override gilt hier nicht",rooms:"R\xE4ume",variables_note:"Variablen gelten f\xFCr alle R\xE4ume und werden sofort gespeichert.",global_schedules:"Zeitpl\xE4ne",global_schedule:"Globaler Zeitplan",global_hint:"Globale Zeitpl\xE4ne gibt es nur einmal. \xC4nderungen gelten in allen R\xE4umen, die sie nutzen.",global_none:"Noch keine globalen Zeitpl\xE4ne. Lege einen neuen an oder mache unten einen eigenen Zeitplan eines Raums global.",global_new:"Neuer globaler Zeitplan",global_active_in:"Aktiv in",global_active_none:"nirgends aktiv",global_offered:"Ausw\xE4hlbar in",global_all_rooms:"allen R\xE4umen",global_n_rooms:"{n} R\xE4umen",global_no_rooms:"keinem Raum",global_periods_in:"In Zeitr\xE4umen von",visibility:"Ausw\xE4hlbar in \u2026",visibility_hint:"Nur in diesen R\xE4umen steht der Zeitplan zur Auswahl. Zeitr\xE4ume k\xF6nnen ihn in jedem Raum nutzen.",assign:"Zuweisen \u2026",assign_hint:"Der Zeitplan wird in den gew\xE4hlten R\xE4umen aktiviert.",assign_action:"Aktivieren",make_global:"Global machen \u2026",make_global_hint:"\u201E{name}\u201C wird ein globaler Zeitplan. R\xE4ume mit gleichem Ablauf k\xF6nnen ihn statt ihrer eigenen Kopie nutzen:",make_global_none:"Kein anderer Raum hat einen eigenen Zeitplan mit gleichem Ablauf.",make_global_all:"In allen R\xE4umen ausw\xE4hlbar",make_global_action:"Global machen",local_copy:"Lokale Kopie",confirm_delete_global:"\u201E{name}\u201C wirklich l\xF6schen?",confirm_delete_global_used:"\u201E{name}\u201C ist aktiv in: {rooms}. Diese R\xE4ume werden ausgeschaltet (Frostschutz).",confirm_delete_global_periods:"Zeitr\xE4ume mit diesem Zeitplan werden gel\xF6scht.",deleted_switched_off:"Ausgeschaltet:",labels:"Labels",select_rooms:"R\xE4ume",group_scope:"Gilt f\xFCr",group_all:"Alle {n} R\xE4ume",group_here:"Nur hier",group_rooms:"Gemeinsam geplant f\xFCr",need_rooms:"Bitte mindestens einen Raum w\xE4hlen.",edit_week:"Wochenplan bearbeiten",global_section:"Globale Zeitpl\xE4ne",own_section:"Eigene Zeitpl\xE4ne der R\xE4ume",own_hint:"Gelten nur im jeweiligen Raum. \u201EGlobal machen\u201C teilt einen Plan mit anderen R\xE4umen.",not_deletable_active:"Der aktive Zeitplan kann nicht gel\xF6scht werden.",history:"Verlauf und Details",hand_label:"Am Thermostat",hand_label_long:"\xC4nderung direkt am Thermostat",hand_manual:"Manuell",hand_until:"Bis Wechsel",hand_ignore:"Ignorieren",hand_manual_long:"Raum auf Manuell umschalten",hand_until_long:"Bis zum n\xE4chsten Zeitplan-Wechsel beibehalten",hand_ignore_long:"Ignorieren und Zeitplan wiederherstellen"},en:{auto:"Auto",heat:"Manual",off:"Off",schedule:"Schedule",schedules:"Schedules",edit:"Edit weekly plan",schedule_paused:"paused",period:"Period",period_until:"until",period_open:"until cancelled",period_planned:"Planned",period_from:"from",period_end:"End",period_delete:"Delete",period_plan:"Plan period",period_edit:"Edit period",period_less:"show less",period_what:"What should apply?",period_start:"Start",period_end_label:"End",period_now:"Now",period_at:"At",period_title:"Title",period_title_hint:"e.g. Grandma visiting",period_invalid:"Please choose a valid start and an end in the future after the start.",period_more:"more planned",optional:"optional",prio_title:"Priorities",prio_short:"Priority",week_plan:"Weekly plan",new_version:"A new version of the card is available.",reload:"Reload",then:"then",copy_to_rooms:"Copy to other rooms",copy_rooms_hint:'"{name}" is copied to the selected rooms. An existing schedule with the same name is replaced.',will_replace:"will be replaced",will_create:"will be created",all_rooms:"All rooms",copied_to:"Copied to:",copy_unsaved:"The saved version is copied, not your unsaved changes. Continue?",battery:"Battery",battery_low:"low",battery_ok:"OK",more:"More",not_active:"This schedule is currently not active.",unsaved_short:"Unsaved changes",manage_variables:"Manage variables",delete_schedule:"Delete schedule",edit_short:"Edit",from:"From",to:"To",days_long:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],weekend:"Weekend",copy_day_short:"Copy day",add:"Add",cancel:"Cancel",ok:"OK",swipe_hint:"Swipe horizontally to change",today:"Today",period_plural:"Periods",period_planned_n:"planned",heating_summary:"heating",of:"of",rooms_word:"rooms",other_floor:"Other",open_details:"Details",prio_hand:"Hand change",prio_room:"Room",prio_inactive:"off",prio_none:"none",until:"until",next:"Next change",src_override:"Global override",src_off:"Frost protection",src_manual:"Manual",src_hand:"Changed",src_schedule:"Schedule",heating:"Heating",idle:"Idle",save:"Save",discard:"Discard",close:"Close",new_schedule:"New schedule",rename:"Rename",duplicate:"Duplicate",delete:"Delete",activate:"Activate",active:"Active",split:"Split",copy_day:"Copy day to \u2026",copy:"Copy",workdays:"Mon\u2013Fri",all_days:"All",fixed:"Fixed",variables:"Variables",add_variable:"Add variable",name:"Name",value:"Value",unsaved:"Discard unsaved changes?",confirm_delete:"Really delete this schedule?",tap_hint:"Tap a block to edit it, drag the borders to move them.",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],unreachable:"Cannot reach Best Thermostat. Retrying \u2026",not_found:"Room not found. Please select a Best Thermostat room in the card configuration.",loading:"Loading \u2026",override:"Global override",override_also:"Also applies to",override_not_applied:"override not applied here",rooms:"Rooms",variables_note:"Variables apply to all rooms and are saved immediately.",global_schedules:"Schedules",global_schedule:"Global schedule",global_hint:"Global schedules exist only once. Changes apply to every room that uses them.",global_none:"No global schedules yet. Create one or make one of the rooms' own schedules below global.",global_new:"New global schedule",global_active_in:"Active in",global_active_none:"not active anywhere",global_offered:"Offered in",global_all_rooms:"all rooms",global_n_rooms:"{n} rooms",global_no_rooms:"no room",global_periods_in:"In periods of",visibility:"Offered in \u2026",visibility_hint:"Only these rooms offer the schedule for selection. Periods can use it in any room.",assign:"Assign \u2026",assign_hint:"The schedule is activated in the selected rooms.",assign_action:"Activate",make_global:"Make global \u2026",make_global_hint:'"{name}" becomes a global schedule. Rooms with the same plan can use it instead of their own copy:',make_global_none:"No other room has an own schedule with the same plan.",make_global_all:"Offer in all rooms",make_global_action:"Make global",local_copy:"Local copy",confirm_delete_global:'Really delete "{name}"?',confirm_delete_global_used:'"{name}" is active in: {rooms}. These rooms will be switched off (frost protection).',confirm_delete_global_periods:"Periods using this schedule will be deleted.",deleted_switched_off:"Switched off:",labels:"Labels",select_rooms:"Rooms",group_scope:"Applies to",group_all:"All {n} rooms",group_here:"Only here",group_rooms:"Planned together for",need_rooms:"Please choose at least one room.",edit_week:"Edit weekly plan",global_section:"Global schedules",own_section:"Own schedules of the rooms",own_hint:'Apply only in their room. "Make global" shares a schedule with other rooms.',not_deletable_active:"The active schedule cannot be deleted.",history:"History and details",hand_label:"On thermostat",hand_label_long:"Change made on a thermostat",hand_manual:"Manual",hand_until:"Until next",hand_ignore:"Ignore",hand_manual_long:"Switch the room to manual mode",hand_until_long:"Keep until the next slot",hand_ignore_long:"Ignore and restore the schedule"}};function b(a){return(a?.locale?.language||a?.language||"en").slice(0,2)==="de"?zt.de:zt.en}function S(a,n){customElements.get(a)||customElements.define(a,n)}function ze(a,n,e){if(!(!a||a===n))return{text:e.new_version,action:e.reload}}function Tt(a,n){let e=[];for(let t=a;t<=n;t+=1)e.push(`${$(t)} ${((t-a)/(n-a)*100).toFixed(1)}%`);return`linear-gradient(to right, ${e.join(", ")})`}var Ae=new Set,Re;function Mt(a){return Ae.add(a),Re===void 0&&(Re=window.setInterval(()=>Ae.forEach(n=>n()),6e4)),()=>{Ae.delete(a),Ae.size||(window.clearInterval(Re),Re=void 0)}}function Te(a,n){return!a||!n||a.connection!==n.connection||a.language!==n.language||a.locale?.language!==n.locale?.language}function T(a){return a?.limits??{min:4,max:35,step:.5}}function de(a,n,e){return Math.min(e,Math.max(n,Math.round(a*2)/2))}function Pt(a,n){return a.schedules.find(e=>e.id===n)?.name??n}function it(a){return a.schedules.filter(n=>!n.hidden)}function Me(a){return a.area?.icon?a.area.icon:a.override_active?"mdi:home-export-outline":a.period?"mdi:calendar-star":a.mode==="off"?"mdi:radiator-off":a.mode==="heat"||a.target_source==="hand"?"mdi:hand-back-right":"mdi:radiator"}function nt(a){return a.target_source==="schedule"&&!a.period&&!a.override_active}function Nt(a){let n=a.filter(i=>nt(i)&&i.next_change);if(n.length<2)return;let e=n[0];return n.every(i=>i.next_change===e.next_change&&i.next_temperature===e.next_temperature)?{time:e.next_change,temp:e.next_temperature}:void 0}function Pe(a,n,e,t=!1){if(a.override_active)return n.src_override;if(a.target_source==="hand"&&a.hand_until)return`${n.src_hand} \xB7 ${n.until} ${k(a.hand_until,e)}`;if(a.period){let s=a.period.end?`${n.period_until} ${k(a.period.end,e)}`:n.period_open;return`${a.period.title} \xB7 ${s}`}if(a.mode==="off")return n.src_off;if(a.mode==="heat")return n.src_manual;let i=Pt(a,a.active_schedule);return a.next_change&&!t?`${i} \xB7 ${k(a.next_change,e)} \u2192 ${g(a.next_temperature)}`:i}function Lt(a,n,e,t){let i=n.override,s=a.override_active?1:a.target_source==="hand"?2:a.period?3:4,o=a.base_mode==="off"?`${e.src_off} \xB7 ${g(a.frost_temperature)}`:a.base_mode==="heat"?`${e.heat} \xB7 ${g(a.base_manual_temperature)}`:`${e.auto} \xB7 ${Pt(a,a.base_schedule)}`;return{layers:[{n:1,icon:"mdi:home-export-outline",name:e.override,value:i.active?a.override_active?g(i.value):`${g(i.value)} \xB7 ${e.override_not_applied}`:e.prio_inactive},{n:2,icon:"mdi:hand-back-right",name:e.prio_hand,value:a.target_source==="hand"&&a.hand_until?`${g(a.target_temperature)} \xB7 ${e.until} ${k(a.hand_until,t)}`:ti(a,e,t)||e.prio_none},{n:3,icon:"mdi:calendar-star",name:e.period,value:a.period?`${a.period.title} \xB7 ${a.period.end?`${e.period_until} ${k(a.period.end,t)}`:e.period_open}`:e.prio_none},{n:4,icon:"mdi:radiator",name:e.prio_room,value:o}],winner:s}}function ce(a){let n=Date.now();return(a.periods??[]).filter(e=>new Date(e.start).getTime()>n).sort((e,t)=>new Date(e.start).getTime()-new Date(t.start).getTime())}function pe(a){let n=a.batteries??[];if(!n.length)return;let e=n.filter(s=>s.level!=null),t=n.some(s=>s.low);return{level:e.length?Math.min(...e.map(s=>s.level)):null,low:t}}function st(a,n){return a==null?n?"mdi:battery-alert-variant-outline":"mdi:battery":a<=10?"mdi:battery-alert-variant-outline":a>=95?"mdi:battery":`mdi:battery-${Math.max(10,Math.floor(a/10)*10)}`}function ti(a,n,e){return(a.trv_deviations??[]).map(t=>[t.name,g(t.temperature),t.until?`${n.until} ${k(t.until,e)}`:""].filter(Boolean).join(" \xB7 ")).join(", ")}function Ne(a,n){if("touches"in a){ii(a,n);return}if(a.pointerType==="touch"||a.pointerType==="mouse"&&a.button!==0)return;let e=a.clientX,t=a.pointerId,i=!1,s=0,o=c=>{if(c.pointerId!==t)return;let h=c.clientX-e;if(!i&&Math.abs(h)<10)return;i=!0,c.preventDefault();let u=Math.round(h/24);u!==s?(s=u,n.onStep(u)):u===0&&n.onStep(0)},r=c=>{c.pointerId===t&&(d(),n.onEnd(i))},d=()=>{window.removeEventListener("pointermove",o),window.removeEventListener("pointerup",r),window.removeEventListener("pointercancel",r)};window.addEventListener("pointermove",o),window.addEventListener("pointerup",r),window.addEventListener("pointercancel",r)}function ii(a,n){let e=a.changedTouches[0];if(!e)return;let t=e.identifier,i=e.clientX,s=e.clientY,o="undecided",r=0,d=m=>Array.from(m.changedTouches).find(_=>_.identifier===t),c=m=>{let _=d(m);if(!_)return;let w=_.clientX-i,j=_.clientY-s;if(o==="undecided"){if(Math.abs(w)<10&&Math.abs(j)<10)return;if(o=Math.abs(w)>Math.abs(j)?"swipe":"scroll",o==="scroll"){u();return}n.onStep(0)}m.preventDefault();let M=Math.round(w/24);M!==r&&(r=M,n.onStep(M))},h=m=>{d(m)&&(u(),o!=="scroll"&&n.onEnd(o==="swipe"))},u=()=>{window.removeEventListener("touchmove",c),window.removeEventListener("touchend",h),window.removeEventListener("touchcancel",h)};window.addEventListener("touchmove",c,{passive:!1}),window.addEventListener("touchend",h),window.addEventListener("touchcancel",h)}var J="0.10.1";var he=class extends v{constructor(){super(...arguments);this._vars=!1;this._menu=!1;this._busy=!1;this._newVarName="";this._newVarValue=20;this._nameValue="";this._onKey=e=>{e.key==="Escape"&&this._close()};this._onWindowMove=e=>{this._drag&&(e.preventDefault(),this._dragMove(e))};this._onWindowUp=()=>{this._dragEnd(),window.removeEventListener("pointermove",this._onWindowMove),window.removeEventListener("pointerup",this._onWindowUp),window.removeEventListener("pointercancel",this._onWindowUp)}}get _t(){return b(this.hass)}get _server(){return this.room?.schedules.find(e=>e.id===this._sid)?.week}get _globalMode(){return!this.room?.entry_id}_isGlobal(e=this._sid){return!!this.room?.schedules.find(t=>t.id===e)?.global}get _dirty(){return!!this._draft&&!!this._server&&!q(this._draft,this._server)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey),document.documentElement.style.overflow="hidden"}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey),document.documentElement.style.overflow=""}willUpdate(e){if(this.room){if(!this._sid){let t=this.initial&&this.room.schedules.some(i=>i.id===this.initial);this._sid=t?this.initial:this.room.active_schedule}(e.has("room")||!this._draft)&&this._server&&(!this._draft||!this._dirtyAgainst(e))&&(this._draft=le(this._server))}}_dirtyAgainst(e){let i=e.get("room")?.schedules.find(s=>s.id===this._sid)?.week;return!!i&&!!this._draft&&!q(this._draft,i)}_close(){this._dirty&&!confirm(this._t.unsaved)||this.dispatchEvent(new CustomEvent("close"))}async _call(e,t){if(this.hass){this._busy=!0,this._error=void 0;try{return await E(this.hass,e,t)}catch(i){this._error=i?.message??String(i);return}finally{this._busy=!1}}}_selectSchedule(e){e!==this._sid&&(this._dirty&&!confirm(this._t.unsaved)||(this._sid=e,this._draft=this._server?le(this._server):void 0,this._sel=void 0,this._copy=void 0))}_startName(e){if(e==="new"&&this._dirty){if(!confirm(this._t.unsaved))return;this._discard()}let t=this.room?.schedules.find(i=>i.id===this._sid)?.name??"";this._sel=void 0,this._vars=!1,this._error=void 0,this._nameAction=e,this._nameValue=e==="rename"?t:e==="duplicate"?`${t} 2`:""}async _submitName(){let e=this._nameValue.trim();if(!e||!this.room||!this._nameAction)return;let t=this.room.entry_id;if(this._nameAction==="rename")this._isGlobal()?await this._call("global_schedule/rename",{schedule_id:this._sid,name:e}):await this._call("schedule/rename",{entry_id:t,schedule_id:this._sid,name:e});else{let i=this._nameAction==="duplicate"&&this._dirty?this._draft:void 0,s=this._globalMode?await this._call("global_schedule/create",{name:e,copy_from:this._sid}):await this._call("schedule/create",{entry_id:t,name:e,copy_from:this._sid});s&&i&&(this._globalMode?await this._call("global_schedule/save",{schedule_id:s.id,week:i}):await this._call("schedule/save",{entry_id:t,schedule_id:s.id,week:i})),s&&(this._sid=s.id,this._draft=void 0)}this._error||(this._nameAction=void 0)}async _delete(){if(!this.room)return;let e=this._t;if(this._isGlobal()){let i=this.snap?.global_schedules?.find(d=>d.id===this._sid);if(!i)return;let s=i.active.map(d=>this.snap?.rooms.find(c=>c.entry_id===d)?.name??"?").join(", "),o=i.active.length?e.confirm_delete_global_used.replace("{name}",i.name).replace("{rooms}",s):e.confirm_delete_global.replace("{name}",i.name);if(i.periods.length&&(o+=`
${e.confirm_delete_global_periods}`),!confirm(o))return;if(await this._call("global_schedule/delete",{schedule_id:this._sid})){let d=this.room.schedules.filter(c=>c.id!==this._sid&&!c.hidden);this._sid=this._globalMode?d[0]?.id:void 0,this._draft=void 0,this._globalMode&&!d.length&&this.dispatchEvent(new CustomEvent("close"))}return}if(!confirm(e.confirm_delete))return;await this._call("schedule/delete",{entry_id:this.room.entry_id,schedule_id:this._sid})&&(this._sid=this.room.active_schedule,this._draft=void 0)}_activate(){this.room&&this._call("schedule/activate",{entry_id:this.room.entry_id,schedule_id:this._sid})}async _save(){if(!this.room||!this._draft)return;(this._isGlobal()?await this._call("global_schedule/save",{schedule_id:this._sid,week:this._draft}):await this._call("schedule/save",{entry_id:this.room.entry_id,schedule_id:this._sid,week:this._draft}))&&(this._sel=void 0)}_discard(){this._server&&(this._draft=le(this._server)),this._sel=void 0,this._copy=void 0}_mutate(e){if(!this._draft)return;let t=le(this._draft);e(t),this._draft=t}_slot(e){return this._draft?.[f[e.day]]?.[e.idx]}_setTemp(e){let t=this._sel;if(!t)return;let i=this.snap?.variables??[];this._mutate(s=>{let o=s[f[t.day]][t.idx],r=z(o,i)??20,{min:d,max:c}=T(this.snap),h=de(r+e,d,c);s[f[t.day]][t.idx]={start:o.start,temperature:h}})}_setVariable(e){let t=this._sel;if(!t)return;let i=this.snap?.variables??[];this._mutate(s=>{let o=s[f[t.day]][t.idx];s[f[t.day]][t.idx]=e===void 0?{start:o.start,temperature:z(o,i)??20}:{start:o.start,variable:e}})}_split(){let e=this._sel;if(!e||!this._draft)return;let t=O(this._draft[f[e.day]])[e.idx],i=et((t.start+t.end)/2);i<=t.start||i>=t.end||(this._mutate(s=>{let o=s[f[e.day]];o.splice(e.idx+1,0,{...o[e.idx],start:D(i)})}),this._sel={day:e.day,idx:e.idx+1})}_remove(){let e=this._sel;!e||!this._draft||this._draft[f[e.day]].length<2||(this._mutate(i=>{let s=i[f[e.day]];e.idx===0?(s.splice(1,1,{...s[1],start:"00:00"}),s.splice(0,1)):s.splice(e.idx,1)}),this._sel={day:e.day,idx:Math.max(0,e.idx-1)})}_toggleCopy(e){let t=new Set(this._copy);t.has(e)?t.delete(e):t.add(e),this._copy=t}_applyCopy(){let e=this._sel;if(!e||!this._copy)return;let t=[...this._copy].filter(i=>i!==e.day);this._mutate(i=>{for(let s of t)i[f[s]]=JSON.parse(JSON.stringify(i[f[e.day]]))}),this._copy=void 0}_dragStart(e,t,i){e.preventDefault(),e.stopPropagation();let s=e.currentTarget;try{s.setPointerCapture(e.pointerId)}catch{}this._drag={day:t,idx:i,bar:s.parentElement},window.addEventListener("pointermove",this._onWindowMove),window.addEventListener("pointerup",this._onWindowUp),window.addEventListener("pointercancel",this._onWindowUp)}_dragMove(e){let t=this._drag;if(!t||!this._draft)return;let i=t.bar.getBoundingClientRect(),s=(e.clientX-i.left)/i.width*x,o=this._draft[f[t.day]],r=L(o[t.idx-1].start)+R,d=(t.idx+1<o.length?L(o[t.idx+1].start):x)-R,c=D(Math.min(d,Math.max(r,et(s))));c!==o[t.idx].start&&this._mutate(h=>{h[f[t.day]][t.idx]={...h[f[t.day]][t.idx],start:c}})}_dragEnd(){this._drag=void 0}_varStep(e,t,i){let{min:s,max:o}=T(this.snap),r=de(t+i,s,o);this._call("variable/update",{variable_id:e,value:r})}async _addVar(){let e=this._newVarName.trim();if(!e)return;await this._call("variable/create",{name:e,value:this._newVarValue})&&(this._newVarName="",this.requestUpdate())}_deleteVar(e){this._call("variable/delete",{variable_id:e})}_shift(e,t){let i=this._sel;if(!i||!this._draft)return;let s=this._draft[f[i.day]],o=e==="start"?i.idx:i.idx+1;if(o<=0||o>=s.length)return;let r=L(s[o-1].start)+R,d=(o+1<s.length?L(s[o+1].start):x)-R,c=Math.min(d,Math.max(r,L(s[o].start)+t));D(c)!==s[o].start&&this._mutate(h=>{h[f[i.day]][o]={...h[f[i.day]][o],start:D(c)}})}_select(e,t){this._sel={day:e,idx:t},this._copy=void 0,this._menu=!1}render(){if(!this.room||!this._draft)return p;let e=this._t,t=this.room,i=t.schedules.find(r=>r.id===this._sid),s=this._globalMode||i?.id===t.active_schedule,o=!!this._sel||this._vars||!!this._nameAction||!!this._copyRooms||!!this._mkGlobal;return l`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          <button class="icon-btn" @click=${this._close} aria-label=${e.close}>
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <div class="h-title">
            <div class="h-name">${e.week_plan}</div>
            <div class="muted h-sub">${t.name}</div>
          </div>
          <button class="icon-btn" aria-label=${e.more} @click=${()=>this._menu=!this._menu}>
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
          ${this._menu?this._renderMenu(t):p}
        </header>

        <div class="content ${o?"sheet-open":""} ${this._dirty?"dirty":""}"
          @click=${()=>this._menu=!1}>
          <div class="seg" role="tablist">
            ${t.schedules.filter(r=>!r.hidden||r.id===this._sid).map(r=>l`<button role="tab" aria-selected=${r.id===this._sid}
                  @click=${()=>this._selectSchedule(r.id)}>
                  ${r.global&&!this._globalMode?l`<ha-icon class="globe" icon="mdi:earth" title=${this._t.global_schedule}></ha-icon>`:p}${r.name}${r.id===t.active_schedule&&!this._globalMode?l`<i class="active-dot"></i>`:p}
                </button>`)}
            <button class="plus" aria-label=${e.new_schedule} @click=${()=>this._startName("new")}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>

          ${i?.global&&!this._globalMode?l`<div class="notice global">
                <ha-icon icon="mdi:earth"></ha-icon><span>${e.global_hint}</span>
              </div>`:p}
          ${i&&!s?l`<div class="notice">
                <span>${e.not_active}</span>
                <button class="text-btn" @click=${this._activate}>${e.activate}</button>
              </div>`:p}

          <div class="week">
            <div class="ruler muted">
              <span></span>
              <div>${[0,6,12,18,24].map(r=>l`<span style="left:${r/24*100}%">${r}</span>`)}</div>
            </div>
            ${f.map((r,d)=>this._renderDay(r,d))}
          </div>
          ${this._renderLegend()}
          <div class="muted hint">${e.tap_hint}</div>
          ${this._error?l`<div class="error">${this._error}</div>`:p}
        </div>

        ${this._sel?this._renderSlotSheet(this._sel):p}
        ${this._vars?this._renderVariablesSheet():p}
        ${this._nameAction?this._renderNameSheet():p}
        ${this._copyRooms?this._renderCopyRoomsSheet():p}
        ${this._mkGlobal?this._renderMakeGlobalSheet():p}

        ${this._dirty&&!o?l`<div class="savebar">
              <span class="grow">${e.unsaved_short}</span>
              <button class="text-btn light" ?disabled=${this._busy} @click=${this._discard}>
                ${e.discard}
              </button>
              <button class="primary-btn" ?disabled=${this._busy} @click=${this._save}>${e.save}</button>
            </div>`:p}
      </div>
    `}_renderMenu(e){let t=this._t,i=this._isGlobal(),s=i||this._sid!==e.base_schedule&&e.schedules.filter(r=>!r.hidden).length>1,o=(r,d,c,h="",u=!1)=>l`<button class="menu-item ${h}" ?disabled=${u} @click=${()=>{this._menu=!1,c()}}><ha-icon icon=${r}></ha-icon>${d}</button>`;return l`<div class="menu" role="menu">
      ${o("mdi:pencil-outline",t.rename,()=>this._startName("rename"))}
      ${o("mdi:content-copy",i&&!this._globalMode?t.local_copy:t.duplicate,()=>this._startName("duplicate"))}
      ${this._globalMode||i?p:l`${o("mdi:earth",t.make_global,()=>this._startMakeGlobal())}
          ${o("mdi:home-export-outline",t.copy_to_rooms,()=>{this._sel=void 0,this._vars=!1,this._info=void 0,this._copyRooms=new Set},"",(this.snap?.rooms.length??0)<2)}`}
      ${o("mdi:thermometer-lines",t.manage_variables,()=>{this._sel=void 0,this._vars=!0})}
      <div class="menu-sep"></div>
      ${o("mdi:delete-outline",t.delete_schedule,()=>this._delete(),"danger",!s)}
    </div>`}_renderLegend(){let e=this._t,t=this.snap?.variables??[],i=new Set;for(let o of Object.values(this._draft??{}))for(let r of o)r.variable&&i.add(r.variable);let s=t.filter(o=>i.has(o.id));return l`<div class="legend">
      ${(s.length?s:t).map(o=>l`<span><i class="sw" style="background:${$(o.value)}"></i>${o.name}
          <b>${g(o.value,!1)}°</b></span>`)}
      <button class="text-btn small" @click=${()=>{this._sel=void 0,this._vars=!0}}>${e.edit_short}</button>
    </div>`}_renderDay(e,t){let i=this.snap?.variables??[],s=O(this._draft[e]),o=e===Y(this.hass);return l`<div class="day ${this._sel?.day===t?"active":""}">
      <span class="day-label ${o?"today":""}">${this._t.days[t]}</span>
      <div class="bar">
        ${s.map((r,d)=>{let c=z(r.slot,i),h=(r.end-r.start)/x*100,u=this._sel?.day===t&&this._sel.idx===d;return l`<button class="seg-b ${u?"selected":""} ${r.slot.variable?"var":""}"
            style="left:${r.start/x*100}%;width:${h}%;background:${$(c)}"
            title="${D(r.start)}–${D(r.end%x)} · ${re(r.slot,i)}"
            @click=${m=>{m.stopPropagation(),this._select(t,d)}}>
            ${h>8?l`<span>${r.slot.variable?re(r.slot,i):`${g(c,!1)}\xB0`}</span>`:p}
          </button>`})}
        <div class="hours"></div>
        ${o?l`<div class="now" style="left:${Ce(this.hass)/x*100}%"></div>`:p}
        ${s.slice(1).map((r,d)=>{let c=this._drag?.day===t&&this._drag.idx===d+1;return l`<div class="handle ${c?"dragging":""}"
            style="left:${r.start/x*100}%"
            @pointerdown=${h=>this._dragStart(h,t,d+1)}>
            <span></span><i class="knob"></i>
            ${c?l`<div class="time-tip">${D(r.start)}</div>`:p}
          </div>`})}
      </div>
    </div>`}_sheet(e,t,i){return l`<div class="scrim" @click=${i}></div>
      <div class="sheet" role="dialog">
        <div class="grab"></div>
        <div class="sheet-head">
          <span class="sheet-title">${e}</span>
          <button class="icon-btn small" aria-label=${this._t.close} @click=${i}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${t}
      </div>`}_renderSlotSheet(e){let t=this._t,i=this.snap?.variables??[],s=this._slot(e);if(!s)return p;let o=this._draft[f[e.day]],r=O(o)[e.idx],d=z(s,i),c=(u,m,_,w)=>l`<div class="time ${w?"":"fixed"}">
        <div><small>${u}</small><b>${m}</b></div>
        ${w?l`<div class="st">
              <button class="round tiny" @click=${()=>this._shift(_,-R)}>−</button>
              <button class="round tiny" @click=${()=>this._shift(_,R)}>+</button>
            </div>`:p}
      </div>`,h=l`
      <div class="times">
        ${c(t.from,D(r.start),"start",e.idx>0)}
        ${c(t.to,r.end===x?"24:00":D(r.end),"end",e.idx+1<o.length)}
      </div>
      <div class="chips">
        <button class="chip" aria-pressed=${s.variable===void 0}
          @click=${()=>this._setVariable(void 0)}>${t.fixed}</button>
        ${i.map(u=>l`<button class="chip" aria-pressed=${s.variable===u.id}
            @click=${()=>this._setVariable(u.id)}>
            <i class="sw" style="background:${$(u.value)}"></i>${u.name}
          </button>`)}
      </div>
      <div class="temp-row">
        <button class="round" @click=${()=>this._setTemp(-.5)}>−</button>
        <span class="temp-val">${g(d)}</span>
        <button class="round" @click=${()=>this._setTemp(.5)}>+</button>
      </div>
      ${this._copy?l`<div class="copy">
            <div class="muted small-text">${t.copy_day}</div>
            <div class="chips">
              ${t.days.map((u,m)=>l`<button class="chip" ?disabled=${m===e.day}
                  aria-pressed=${this._copy.has(m)} @click=${()=>this._toggleCopy(m)}>${u}</button>`)}
            </div>
            <div class="chips">
              <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4])}>${t.workdays}</button>
              <button class="chip" @click=${()=>this._copy=new Set([5,6])}>${t.weekend}</button>
              <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4,5,6])}>${t.all_days}</button>
              <span class="grow"></span>
              <button class="primary-btn" ?disabled=${![...this._copy].some(u=>u!==e.day)}
                @click=${this._applyCopy}>${t.copy}</button>
            </div>
          </div>`:p}
      <div class="acts">
        <button ?disabled=${r.end-r.start<2*R} @click=${this._split}>
          <ha-icon icon="mdi:call-split"></ha-icon>${t.split}
        </button>
        <button aria-pressed=${!!this._copy} @click=${()=>this._copy=this._copy?void 0:new Set}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t.copy_day_short}
        </button>
        <button ?disabled=${o.length<2} @click=${this._remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
        </button>
      </div>`;return this._sheet(t.days_long[e.day],h,()=>{this._sel=void 0,this._copy=void 0})}_renderVariablesSheet(){let e=this._t,t=this.snap?.variables??[],i=l`
      <div class="var-list">
        ${t.map(s=>l`<div class="var-row">
            <i class="sw" style="background:${$(s.value)}"></i>
            <span class="grow">${s.name}</span>
            <button class="round tiny" @click=${()=>this._varStep(s.id,s.value,-.5)}>−</button>
            <span class="var-val">${g(s.value)}</span>
            <button class="round tiny" @click=${()=>this._varStep(s.id,s.value,.5)}>+</button>
            <button class="icon-btn small" aria-label=${e.delete} @click=${()=>this._deleteVar(s.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>`)}
      </div>
      <div class="var-add">
        <input type="text" placeholder=${e.name} .value=${this._newVarName}
          @input=${s=>this._newVarName=s.target.value} />
        <input type="number" class="num" min=${T(this.snap).min} max=${T(this.snap).max} step="0.5" .value=${String(this._newVarValue)}
          @input=${s=>this._newVarValue=Number(s.target.value)} />
        <button class="primary-btn" @click=${this._addVar}>${e.add}</button>
      </div>
      <div class="muted small-text">${e.variables_note}</div>
      ${this._error?l`<div class="error">${this._error}</div>`:p}`;return this._sheet(e.variables,i,()=>this._vars=!1)}async _copyToRooms(){if(!this.room||!this._copyRooms?.size||this._dirty&&!confirm(this._t.copy_unsaved))return;let e=await this._call("schedule/copy_to_rooms",{entry_id:this.room.entry_id,schedule_id:this._sid,targets:[...this._copyRooms]});if(e){let t=[...e.created??[],...e.replaced??[]].join(", ");this._info=`${this._t.copied_to} ${t}`,this._copyRooms=new Set}}_renderCopyRoomsSheet(){let e=this._t,t=this.room?.schedules.find(r=>r.id===this._sid)?.name??"",i=(this.snap?.rooms??[]).filter(r=>r.entry_id!==this.room?.entry_id),s=r=>{let d=new Set(this._copyRooms);d.has(r)?d.delete(r):d.add(r),this._copyRooms=d},o=l`
      <div class="muted small-text">${e.copy_rooms_hint.replace("{name}",t)}</div>
      <div class="room-list">
        ${i.map(r=>{let d=this._copyRooms.has(r.entry_id),c=r.schedules.some(h=>h.name.toLowerCase()===t.toLowerCase());return l`<button class="room-pick ${d?"on":""}" @click=${()=>s(r.entry_id)}>
            <ha-icon icon=${d?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
            <span class="grow">${r.name}${r.floor?l` <span class="muted">· ${r.floor.name}</span>`:p}</span>
            <span class="muted small-text">${c?e.will_replace:e.will_create}</span>
          </button>`})}
      </div>
      ${this._info?l`<div class="info">${this._info}</div>`:p}
      ${this._error?l`<div class="error">${this._error}</div>`:p}
      <div class="sheet-actions">
        <button class="text-btn" @click=${()=>this._copyRooms=new Set(i.map(r=>r.entry_id))}>
          ${e.all_rooms}
        </button>
        <span class="grow"></span>
        <button class="primary-btn" ?disabled=${!this._copyRooms.size||this._busy} @click=${this._copyToRooms}>
          ${e.copy}
        </button>
      </div>`;return this._sheet(`${e.copy_to_rooms}: ${t}`,o,()=>{this._copyRooms=void 0,this._info=void 0})}_identical(){let e=this._server;if(!e||!this.room)return[];let t=[];for(let i of this.snap?.rooms??[]){if(i.entry_id===this.room.entry_id)continue;let s=i.schedules.find(o=>!o.global&&q(o.week,e));s&&t.push({room:i,id:s.id,name:s.name})}return t}_startMakeGlobal(){this._sel=void 0,this._vars=!1,this._error=void 0,this._mkGlobal={sel:new Set(this._identical().map(e=>e.room.entry_id)),all:!1}}async _makeGlobal(){if(!this.room||!this._mkGlobal||this._dirty&&!confirm(this._t.copy_unsaved))return;let e=this._identical().filter(i=>this._mkGlobal.sel.has(i.room.entry_id)).map(i=>({entry_id:i.room.entry_id,schedule_id:i.id})),t=await this._call("schedule/make_global",{entry_id:this.room.entry_id,schedule_id:this._sid,merge:e,all_rooms:this._mkGlobal.all});t&&(this._mkGlobal=void 0,this._sid=t.id,this._draft=void 0)}_renderMakeGlobalSheet(){let e=this._t,t=this._mkGlobal,i=this.room?.schedules.find(d=>d.id===this._sid)?.name??"",s=this._identical(),o=d=>{let c=new Set(t.sel);c.has(d)?c.delete(d):c.add(d),this._mkGlobal={...t,sel:c}},r=l`
      <div class="muted small-text">${e.make_global_hint.replace("{name}",i)}</div>
      <div class="room-list">
        ${s.length?s.map(d=>{let c=t.sel.has(d.room.entry_id);return l`<button class="room-pick ${c?"on":""}" @click=${()=>o(d.room.entry_id)}>
                <ha-icon icon=${c?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
                <span class="grow">${d.room.name}</span>
                <span class="muted small-text">${d.name}</span>
              </button>`}):l`<div class="muted small-text">${e.make_global_none}</div>`}
      </div>
      <button class="room-pick ${t.all?"on":""}" @click=${()=>this._mkGlobal={...t,all:!t.all}}>
        <ha-icon icon=${t.all?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
        <span class="grow">${e.make_global_all}</span>
      </button>
      ${this._error?l`<div class="error">${this._error}</div>`:p}
      <div class="sheet-actions">
        <button class="text-btn" @click=${()=>this._mkGlobal=void 0}>${e.cancel}</button>
        <span class="grow"></span>
        <button class="primary-btn" ?disabled=${this._busy} @click=${this._makeGlobal}>${e.make_global_action}</button>
      </div>`;return this._sheet(`${e.make_global_action}: ${i}`,r,()=>this._mkGlobal=void 0)}_renderNameSheet(){let e=this._t,t=this._nameAction==="rename"?e.rename:this._nameAction==="duplicate"?e.duplicate:e.new_schedule,i=l`
      <input type="text" .value=${this._nameValue} placeholder=${e.name} aria-label=${t}
        @input=${s=>this._nameValue=s.target.value}
        @keydown=${s=>s.key==="Enter"&&this._submitName()} />
      ${this._error?l`<div class="error">${this._error}</div>`:p}
      <div class="sheet-actions">
        <button class="text-btn" @click=${()=>this._nameAction=void 0}>${e.cancel}</button>
        <button class="primary-btn" ?disabled=${!this._nameValue.trim()||this._busy} @click=${this._submitName}>
          ${e.ok}
        </button>
      </div>`;return this._sheet(t,i,()=>this._nameAction=void 0)}};he.properties={hass:{attribute:!1},snap:{attribute:!1},room:{attribute:!1},initial:{attribute:!1},_sid:{state:!0},_draft:{state:!0},_sel:{state:!0},_copy:{state:!0},_vars:{state:!0},_error:{state:!0},_nameAction:{state:!0},_nameValue:{state:!0},_busy:{state:!0},_drag:{state:!0},_menu:{state:!0},_copyRooms:{state:!0},_mkGlobal:{state:!0},_info:{state:!0}},he.styles=[A,y`
      :host {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-text-color);
      }
      .backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
      }
      .dialog {
        position: relative;
        display: flex;
        flex-direction: column;
        width: min(760px, 100vw);
        height: min(860px, 100dvh);
        background: var(--card-background-color, var(--primary-background-color));
        border-radius: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }
      @media (max-width: 600px) {
        .dialog {
          width: 100vw;
          height: 100dvh;
          border-radius: 0;
        }
      }
      header {
        position: relative;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 10px 8px 6px;
        padding-top: max(10px, env(safe-area-inset-top));
        padding-left: max(8px, env(safe-area-inset-left));
        padding-right: max(8px, env(safe-area-inset-right));
      }
      .icon-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
      }
      .icon-btn:hover {
        background: var(--bt-surface);
      }
      .icon-btn ha-icon {
        --mdc-icon-size: 24px;
      }
      .icon-btn.small {
        width: 32px;
        height: 32px;
      }
      .icon-btn.small ha-icon {
        --mdc-icon-size: 20px;
      }
      .h-title {
        flex: 1;
        min-width: 0;
      }
      .h-name {
        font-weight: 600;
        font-size: 18px;
      }
      .h-sub {
        font-size: 13px;
      }
      .menu {
        position: absolute;
        right: 12px;
        top: calc(100% - 4px);
        z-index: 5;
        min-width: 220px;
        padding: 6px 0;
        border-radius: 14px;
        background: var(--card-background-color, #fff);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
      }
      .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        text-align: left;
        font-size: 15px;
      }
      .menu-item:hover {
        background: var(--bt-surface);
      }
      .menu-item ha-icon {
        --mdc-icon-size: 20px;
        color: var(--bt-muted);
      }
      .menu-item:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .menu-item.danger,
      .menu-item.danger ha-icon {
        color: var(--error-color, #db4437);
      }
      .menu-sep {
        height: 1px;
        margin: 4px 0;
        background: var(--divider-color);
      }
      .content {
        flex: 1;
        overflow-y: auto;
        padding: 8px 16px 24px;
        padding-left: max(16px, env(safe-area-inset-left));
        padding-right: max(16px, env(safe-area-inset-right));
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .content.dirty {
        padding-bottom: 96px;
      }
      .content.sheet-open {
        padding-bottom: 380px;
      }
      .content > * {
        flex-shrink: 0;
      }
      .seg {
        display: flex;
        gap: 2px;
        padding: 3px;
        border-radius: 12px;
        background: var(--bt-surface);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .seg button {
        flex: 1 0 auto;
        min-height: 36px;
        padding: 0 14px;
        border-radius: 9px;
        font-size: 14px;
        font-weight: 500;
        color: var(--bt-muted);
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .seg button[aria-selected="true"] {
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
      }
      .seg .plus {
        flex: 0 0 40px;
        padding: 0;
      }
      .seg .plus ha-icon {
        --mdc-icon-size: 20px;
      }
      .active-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--success-color, #3bb273);
        margin-left: 6px;
      }
      .notice.global {
        justify-content: flex-start;
        padding: 8px 12px;
        background: color-mix(in srgb, var(--bt-accent) 12%, transparent);
      }
      .notice.global ha-icon {
        --mdc-icon-size: 18px;
        color: var(--bt-accent);
        flex: none;
      }
      .globe {
        --mdc-icon-size: 15px;
        margin-right: 4px;
        opacity: 0.75;
      }
      .notice {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 4px 4px 4px 12px;
        border-radius: 12px;
        font-size: 13px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 14%, transparent);
      }
      .week {
        display: flex;
        flex-direction: column;
        gap: 8px;
        user-select: none;
        -webkit-user-select: none;
      }
      .ruler,
      .day {
        display: grid;
        grid-template-columns: 30px 1fr;
        align-items: center;
      }
      .ruler > div {
        position: relative;
        height: 14px;
        font-size: 11px;
      }
      .ruler > div span {
        position: absolute;
        transform: translateX(-50%);
      }
      .ruler > div span:first-child {
        transform: none;
      }
      .ruler > div span:last-child {
        transform: translateX(-100%);
      }
      .day-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--bt-muted);
      }
      .day-label.today {
        color: var(--bt-accent);
        font-weight: 700;
      }
      .day.active .day-label {
        color: var(--primary-text-color);
      }
      .bar {
        position: relative;
        height: 38px;
        border-radius: 10px;
        background: var(--bt-surface);
        touch-action: pan-y;
      }
      .seg-b {
        position: absolute;
        top: 0;
        bottom: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        font-size: 11.5px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.66);
        border-right: 2px solid var(--card-background-color, #fff);
        box-sizing: border-box;
      }
      .seg-b:first-of-type {
        border-radius: 10px 0 0 10px;
      }
      .seg-b:last-of-type {
        border-radius: 0 10px 10px 0;
        border-right: none;
      }
      .seg-b span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 4px;
      }
      .seg-b.selected {
        box-shadow: inset 0 0 0 2.5px var(--primary-text-color);
        border-radius: 8px;
        z-index: 1;
      }
      .hours {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: repeating-linear-gradient(
          to right,
          transparent 0,
          transparent calc(25% - 1px),
          color-mix(in srgb, var(--card-background-color, #fff) 45%, transparent) calc(25% - 1px),
          color-mix(in srgb, var(--card-background-color, #fff) 45%, transparent) 25%
        );
      }
      .now {
        position: absolute;
        top: -3px;
        bottom: -3px;
        width: 2px;
        margin-left: -1px;
        background: var(--primary-text-color);
        pointer-events: none;
        z-index: 2;
      }
      .handle {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 28px;
        margin-left: -14px;
        z-index: 3;
        cursor: ew-resize;
        touch-action: none;
        display: flex;
        justify-content: center;
      }
      .handle span {
        width: 2px;
        height: 100%;
        border-radius: 1px;
        background: var(--primary-text-color);
        opacity: 0.35;
      }
      .handle .knob {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 18px;
        transform: translate(-50%, -50%);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        border: 1.5px solid color-mix(in srgb, var(--primary-text-color) 45%, transparent);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
        transition: transform 0.12s;
      }
      .handle:hover span,
      .handle.dragging span {
        opacity: 0.9;
      }
      .handle:hover .knob,
      .handle.dragging .knob {
        border-color: var(--primary-text-color);
        transform: translate(-50%, -50%) scale(1.15);
      }
      .time-tip {
        position: absolute;
        bottom: calc(100% + 6px);
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 8px;
        border-radius: 8px;
        background: var(--primary-text-color);
        color: var(--card-background-color, #fff);
        font-size: 13px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 14px;
        padding-left: 30px;
        font-size: 13px;
        color: var(--bt-muted);
      }
      .legend b {
        color: var(--primary-text-color);
        font-weight: 500;
      }
      .sw {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 3px;
        margin-right: 6px;
        vertical-align: -1px;
        flex: none;
      }
      .text-btn.small {
        min-height: 28px;
        padding: 0 6px;
        font-size: 13px;
      }
      .hint,
      .small-text {
        font-size: 12px;
      }
      .grow {
        flex: 1;
      }
      /* bottom sheet */
      .scrim {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.18);
        z-index: 6;
      }
      .sheet {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 7;
        max-height: 80%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 8px 16px max(18px, env(safe-area-inset-bottom));
        border-radius: 22px 22px 0 0;
        background: var(--card-background-color, #fff);
        box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.18);
        animation: up 0.18s ease-out;
      }
      @keyframes up {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
      }
      .grab {
        width: 36px;
        height: 4px;
        border-radius: 2px;
        margin: 0 auto;
        background: var(--divider-color);
      }
      .sheet-head {
        display: flex;
        align-items: center;
      }
      .sheet-title {
        flex: 1;
        font-size: 17px;
        font-weight: 600;
      }
      .times {
        display: flex;
        gap: 10px;
      }
      .time {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 8px 8px 12px;
        border-radius: 12px;
        background: var(--bt-surface);
      }
      .time small {
        display: block;
        font-size: 11px;
        color: var(--bt-muted);
      }
      .time b {
        font-size: 18px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .time.fixed b {
        color: var(--bt-muted);
      }
      .st {
        display: flex;
        gap: 4px;
      }
      .round.tiny {
        width: 30px;
        height: 30px;
        font-size: 18px;
        background: var(--card-background-color, #fff);
      }
      .chips .chip {
        min-height: 34px;
      }
      .chip .sw {
        margin-right: 0;
      }
      .temp-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
      }
      .temp-val {
        font-size: 26px;
        font-weight: 500;
        min-width: 110px;
        text-align: center;
      }
      .copy {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .copy .chip {
        background: var(--card-background-color, #fff);
      }
      .copy .chip[aria-pressed="true"] {
        background: var(--bt-accent);
      }
      .acts {
        display: flex;
        justify-content: space-around;
        padding-top: 8px;
        border-top: 1px solid var(--divider-color);
      }
      .acts button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 6px 10px;
        border-radius: 10px;
        font-size: 12px;
        color: var(--bt-muted);
      }
      .acts button ha-icon {
        --mdc-icon-size: 22px;
        color: var(--primary-text-color);
      }
      .acts button[aria-pressed="true"] {
        background: var(--bt-surface);
      }
      .acts button:disabled {
        opacity: 0.35;
      }
      .var-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .var-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 4px 6px 10px;
        border-radius: 12px;
        background: var(--bt-surface);
        font-size: 15px;
      }
      .var-val {
        min-width: 64px;
        text-align: center;
      }
      .var-add {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .var-add input[type="text"] {
        flex: 1;
      }
      .var-add input.num {
        width: 80px;
      }
      .room-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .room-pick {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        padding: 0 10px;
        border-radius: 12px;
        background: var(--bt-surface);
        text-align: left;
        width: 100%;
        font-size: 15px;
      }
      .room-pick ha-icon {
        --mdc-icon-size: 22px;
        color: var(--bt-muted);
      }
      .room-pick.on ha-icon {
        color: var(--bt-accent);
      }
      .info {
        font-size: 13px;
        padding: 8px 12px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--success-color, #3bb273) 15%, transparent);
      }
      .sheet-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      /* unsaved changes */
      .savebar {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: max(14px, env(safe-area-inset-bottom));
        z-index: 4;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 8px 8px 16px;
        border-radius: 16px;
        background: #1f2328;
        color: #fff;
        font-size: 14px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        animation: up 0.18s ease-out;
      }
      .text-btn.light {
        color: #c8ccd4;
      }
    `];S("bt-week-editor",he);var ue=class extends v{constructor(){super(...arguments);this.rooms=[];this.selected=new Set}_emit(e){this.dispatchEvent(new CustomEvent("change",{detail:e}))}_toggle(e){let t=new Set(this.selected);t.has(e)?t.delete(e):t.add(e),this._emit(t)}_labels(){let e=new Map;for(let t of this.rooms)for(let i of t.labels??[])e.set(i.id,i);return[...e.values()].sort((t,i)=>t.name.localeCompare(i.name))}_toggleLabel(e){let t=this.rooms.filter(o=>o.labels?.some(r=>r.id===e.id)).map(o=>o.entry_id),i=new Set(this.selected),s=t.every(o=>i.has(o));for(let o of t)s?i.delete(o):i.add(o);this._emit(i)}render(){let e=b(this.hass),t=this._labels(),i=this.rooms.length>0&&this.rooms.every(s=>this.selected.has(s.entry_id));return l`
      <div class="chips">
        <button class="chip" aria-pressed=${i}
          @click=${()=>this._emit(i?new Set:new Set(this.rooms.map(s=>s.entry_id)))}>
          <ha-icon icon="mdi:home-outline"></ha-icon>${e.all_rooms}
        </button>
        ${t.map(s=>{let o=this.rooms.filter(d=>d.labels?.some(c=>c.id===s.id)),r=o.length>0&&o.every(d=>this.selected.has(d.entry_id));return l`<button class="chip" aria-pressed=${r} @click=${()=>this._toggleLabel(s)}>
            <ha-icon icon=${s.icon||"mdi:label-outline"}></ha-icon>${s.name}
          </button>`})}
      </div>
      <div class="list">
        ${this.rooms.map(s=>{let o=this.selected.has(s.entry_id),r=this.notes?.[s.entry_id];return l`<button class="pick ${o?"on":""}" role="checkbox" aria-checked=${o}
            @click=${()=>this._toggle(s.entry_id)}>
            <ha-icon icon=${o?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
            <span class="grow">${s.name}${s.floor?l` <span class="muted">· ${s.floor.name}</span>`:p}</span>
            ${r?l`<span class="muted note">${r}</span>`:p}
          </button>`})}
      </div>
    `}};ue.properties={hass:{attribute:!1},rooms:{attribute:!1},selected:{attribute:!1},notes:{attribute:!1}},ue.styles=[A,y`
      :host {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .chip ha-icon {
        --mdc-icon-size: 18px;
      }
      .list {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .pick {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        padding: 0 8px;
        border-radius: 10px;
        text-align: left;
      }
      .pick:hover {
        background: var(--bt-surface);
      }
      .pick.on ha-icon {
        color: var(--bt-accent);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .note {
        font-size: 13px;
      }
    `];S("bt-room-picker",ue);function me(a){let n=e=>String(e).padStart(2,"0");return`${a.getFullYear()}-${n(a.getMonth()+1)}-${n(a.getDate())}T${n(a.getHours())}:${n(a.getMinutes())}`}function Ot(a){let n=new Date;return n.setMinutes(0,0,0),n.setHours(n.getHours()+a),n}var _e=class extends v{constructor(){super(...arguments);this._rooms=new Set;this._scope="group";this._initialized=!1;this._temp=21;this._startNow=!1;this._start=me(Ot(1));this._openEnd=!1;this._end=me(Ot(25));this._title="";this._busy=!1;this._onKey=e=>{e.key==="Escape"&&this._close()}}get _t(){return b(this.hass)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey)}get _group(){return!this.room}get _groupRooms(){let e=this.period?.group;return!e||!this.snap?[]:this.snap.rooms.filter(t=>t.periods.some(i=>i.group===e))}get _schedules(){return this._group||this.period?.group&&this._scope==="group"&&this._groupRooms.length>1?(this.snap?.global_schedules??[]).map(e=>({id:e.id,name:e.name,week:e.week,global:!0})):(this.room?.schedules??[]).filter(e=>!e.hidden||e.id===this.period?.schedule)}willUpdate(){if(!this._initialized&&this._group&&this.snap){this._initialized=!0;let e=this.snap.global_schedules?.[0];this._what=e?{kind:"schedule",id:e.id}:{kind:"mode",mode:"off"},this._temp=21}if(!this._initialized&&this.room&&this.period){this._initialized=!0;let e=this.period;e.schedule?this._what={kind:"schedule",id:e.schedule}:this._what={kind:"mode",mode:e.mode??"off"},e.temperature!=null&&(this._temp=e.temperature),this._startNow=!1,this._start=me(new Date(e.start)),this._openEnd=!e.end,e.end&&(this._end=me(new Date(e.end))),this._title=e.summary??""}if(!this._what&&this.room){let e=this.room.schedules.find(t=>t.id!==this.room.base_schedule&&!t.hidden);this._what=e?{kind:"schedule",id:e.id}:{kind:"mode",mode:"off"},this._temp=Math.round((this.room.target_temperature??21)*2)/2}}_close(){this.dispatchEvent(new CustomEvent("close"))}get _valid(){let e=this._t;if(this._group&&!this._rooms.size)return e.need_rooms;let t=this._startNow?new Date:new Date(this._start);if(!this._startNow&&Number.isNaN(t.getTime()))return e.period_invalid;if(!this._openEnd){let i=new Date(this._end);if(Number.isNaN(i.getTime())||i<=t||i<=new Date)return e.period_invalid}}async _save(){if(!this.hass||!this._what||!this.room&&!this._group)return;let e=!!this.period?.group&&this._scope==="group"&&this._groupRooms.length>1,t=this.room?e?{group:this.period.group}:{entry_id:this.room.entry_id}:{entry_ids:[...this._rooms]};this._what.kind==="schedule"?t.schedule_id=this._what.id:(t.mode=this._what.mode,this._what.mode==="heat"&&(t.temperature=this._temp));let i=!!this.period;this._startNow?i&&(t.start=me(new Date)):t.start=this._start,this._openEnd?i&&(t.open_end=!0):t.end=this._end,i?(e||(t.period_id=this.period.id),t.summary=this._title.trim()):this._title.trim()&&(t.summary=this._title.trim());let s=i?e?"period/update_group":"period/update":this._group?"period/add_group":"period/add";this._busy=!0,this._error=void 0;try{await E(this.hass,s,t),this._close()}catch(o){this._error=o?.message??String(o)}finally{this._busy=!1}}async _delete(){if(!(!this.hass||!this.room||!this.period)){this._busy=!0;try{this.period.group&&this._scope==="group"&&this._groupRooms.length>1?await E(this.hass,"period/cancel_group",{group:this.period.group}):await E(this.hass,"period/cancel",{entry_id:this.room.entry_id,period_id:this.period.id}),this._close()}catch(e){this._error=e?.message??String(e)}finally{this._busy=!1}}}_isWhat(e){let t=this._what;return!t||t.kind!==e.kind?!1:t.kind==="schedule"?t.id===e.id:t.mode===e.mode}render(){if(!this.room&&!(this._group&&this.snap))return p;let e=this._t,t=this.room,i=this._valid,s=this._groupRooms,o=t?.min_temp??this.snap?.limits?.min??4,r=t?.max_temp??this.snap?.limits?.max??35,d=[["heat",e.heat],["off",e.off]];return l`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          <div class="h-title">
            <div class="h-name">${this.period?e.period_edit:e.period_plan}</div>
            <div class="muted h-sub">${t?t.name:e.select_rooms}</div>
          </div>
          <button class="round small" @click=${this._close} aria-label=${e.close}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <div class="content">
          ${this._group?l`<section>
                <div class="label">${e.select_rooms}</div>
                <bt-room-picker .hass=${this.hass} .rooms=${this.snap.rooms} .selected=${this._rooms}
                  @change=${c=>this._rooms=c.detail}></bt-room-picker>
              </section>`:p}
          ${s.length>1?l`<section>
                <div class="label">${e.group_scope}</div>
                <div class="chips">
                  <button class="chip" aria-pressed=${this._scope==="group"} @click=${()=>this._scope="group"}>
                    <ha-icon icon="mdi:home-group"></ha-icon>${e.group_all.replace("{n}",String(s.length))}
                  </button>
                  <button class="chip" aria-pressed=${this._scope==="room"} @click=${()=>this._scope="room"}>
                    <ha-icon icon="mdi:home-outline"></ha-icon>${e.group_here}
                  </button>
                </div>
                <div class="muted small">${e.group_rooms}: ${s.map(c=>c.name).join(", ")}</div>
              </section>`:p}
          <section>
            <div class="label">${e.period_what}</div>
            <div class="chips">
              ${this._schedules.map(c=>l`<button class="chip" aria-pressed=${this._isWhat({kind:"schedule",id:c.id})}
                  @click=${()=>this._what={kind:"schedule",id:c.id}}>
                  <ha-icon icon=${c.global?"mdi:earth":"mdi:calendar-clock"}></ha-icon>${c.name}
                </button>`)}
              ${d.map(([c,h])=>l`<button class="chip" aria-pressed=${this._isWhat({kind:"mode",mode:c})}
                  @click=${()=>this._what={kind:"mode",mode:c}}>
                  <ha-icon icon=${c==="off"?"mdi:snowflake":"mdi:hand-back-right"}></ha-icon>${h}
                </button>`)}
            </div>
            ${this._what?.kind==="mode"&&this._what.mode==="heat"?l`<div class="temp-row">
                  <button class="round" @click=${()=>this._temp=Math.max(o,this._temp-.5)}>−</button>
                  <span class="temp-val">${g(this._temp)}</span>
                  <button class="round" @click=${()=>this._temp=Math.min(r,this._temp+.5)}>+</button>
                </div>`:p}
          </section>

          <section>
            <div class="label">${e.period_start}</div>
            <div class="chips">
              <button class="chip" aria-pressed=${this._startNow} @click=${()=>this._startNow=!0}>
                ${e.period_now}
              </button>
              <button class="chip" aria-pressed=${!this._startNow} @click=${()=>this._startNow=!1}>
                ${e.period_at}
              </button>
            </div>
            ${this._startNow?p:l`<input type="datetime-local" step="900" .value=${this._start}
                  @input=${c=>this._start=c.target.value} />`}
          </section>

          <section>
            <div class="label">${e.period_end_label}</div>
            <div class="chips">
              <button class="chip" aria-pressed=${this._openEnd} @click=${()=>this._openEnd=!0}>
                ${e.period_open}
              </button>
              <button class="chip" aria-pressed=${!this._openEnd} @click=${()=>this._openEnd=!1}>
                ${e.period_at}
              </button>
            </div>
            ${this._openEnd?p:l`<input type="datetime-local" step="900" .value=${this._end}
                  @input=${c=>this._end=c.target.value} />`}
          </section>

          <section>
            <div class="label">${e.period_title} <span class="muted">(${e.optional})</span></div>
            <input type="text" .value=${this._title} placeholder=${e.period_title_hint}
              @input=${c=>this._title=c.target.value} />
          </section>
          ${this._error?l`<div class="error">${this._error}</div>`:p}
          ${i&&!this._error?l`<div class="muted small">${i}</div>`:p}
        </div>
        <footer>
          ${this.period?l`<button class="text-btn danger" ?disabled=${this._busy} @click=${this._delete}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>${this.period&&t?.period?.id===this.period.id?e.period_end:e.period_delete}
              </button>`:p}
          <span class="spacer"></span>
          <button class="text-btn" @click=${this._close}>${e.close}</button>
          <button class="primary-btn" ?disabled=${!!i||this._busy} @click=${this._save}>
            ${this.period?e.save:e.period_plan}
          </button>
        </footer>
      </div>
    `}};_e.properties={hass:{attribute:!1},room:{attribute:!1},period:{attribute:!1},snap:{attribute:!1},_what:{state:!0},_rooms:{state:!0},_scope:{state:!0},_temp:{state:!0},_startNow:{state:!0},_start:{state:!0},_openEnd:{state:!0},_end:{state:!0},_title:{state:!0},_error:{state:!0},_busy:{state:!0}},_e.styles=[A,Ee,y`
      .chip ha-icon,
      .round ha-icon {
        --mdc-icon-size: 18px;
      }
      .round.small {
        width: 36px;
        height: 36px;
      }
      .temp-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
      }
      .temp-val {
        font-size: 26px;
        min-width: 110px;
        text-align: center;
      }
      input[type="datetime-local"] {
        font: inherit;
        color: var(--primary-text-color);
        background: var(--bt-surface);
        border: 1px solid transparent;
        border-radius: 10px;
        padding: 10px;
        color-scheme: light dark;
      }
      .small {
        font-size: 13px;
      }
      .spacer {
        flex: 1;
      }
      .danger {
        color: var(--error-color, #db4437);
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .danger ha-icon {
        --mdc-icon-size: 18px;
      }
    `];S("bt-period-dialog",_e);var X=class extends v{constructor(){super(...arguments);this._editing=!1;this._planning=!1;this._allPeriods=!1;this._batOpen=!1;this._unreachable=!1}static getConfigElement(){return document.createElement("bestthermostat-card-editor")}static getStubConfig(e){return{entity:Object.values(e.states).find(i=>i.entity_id.startsWith("climate.")&&i.attributes.room_id)?.entity_id??""}}setConfig(e){this._config={show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0,show_hand_change:!0,show_battery:!0,show_header:!0,...e}}set config(e){e!==this._rawConfig&&(this._rawConfig=e,this.setConfig(e))}getCardSize(){return this._config?.compact?3:6}getGridOptions(){return this._config?.compact?{columns:6,rows:4,min_columns:4,min_rows:3}:{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),this._untick=Mt(()=>this.requestUpdate()),this.hass&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,this._untick?.(),this._untick=void 0,this._editor?.remove(),this._editor=void 0,this._editing=!1,this._planner?.remove(),this._planner=void 0,this._planning=!1}shouldUpdate(e){if(e.size===0||this._editing||this._planning)return!0;for(let t of e.keys())if(t==="hass"){if(Te(e.get("hass"),this.hass))return!0}else if(t==="_snap"){let i=e.get("_snap"),s=this._snap;if(!i||!s||i.version!==s.version||i.variables!==s.variables||i.override!==s.override||Se(i,this._config?.entity)!==Se(s,this._config?.entity))return!0}else return!0;return e.has("hass")&&!this._unsub&&this.isConnected&&this._subscribe(),!1}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&this._subscribe()}updated(){let e=this._room;this._editing&&e&&this.hass?(this._editor||(this._editor=document.createElement("bt-week-editor"),this._editor.addEventListener("close",()=>this._editing=!1),document.body.appendChild(this._editor)),this._editor.hass=this.hass,this._editor.snap=this._snap,this._editor.room=e):this._editor&&(this._editor.remove(),this._editor=void 0),this._planning&&e&&this.hass?(this._planner||(this._planner=document.createElement("bt-period-dialog"),this._planner.addEventListener("close",()=>{this._planning=!1,this._editPeriod=void 0}),document.body.appendChild(this._planner)),this._planner.hass=this.hass,this._planner.snap=this._snap,this._planner.room=e,this._planner.period=this._editPeriod):this._planner&&(this._planner.remove(),this._planner=void 0)}_subscribe(){this.hass&&(this._unsub=ke(this.hass,e=>this._snap=e,e=>this._unreachable=e))}get _room(){return Se(this._snap,this._config?.entity)}async _call(e,t){if(this.hass)try{this._error=void 0,await E(this.hass,e,t)}catch(i){this._error=i?.message??String(i)}}_clampTemp(e,t){return Math.min(e.max_temp,Math.max(e.min_temp,Math.round(t*2)/2))}_swipeStart(e,t){let i=this._pending??t.target_temperature??20;Ne(e,{onStep:s=>{this._swipe||(this._swipe={moved:!0});let o=this._clampTemp(t,i+s*.5);o!==this._pending&&(this._pending=o,window.clearTimeout(this._debounce),navigator.vibrate?.(5))},onEnd:s=>{this._swipe=void 0,s&&(this._pending!==void 0&&this._pending!==t.target_temperature?this._step(t,0):this._pending=void 0)}})}_step(e,t){let i=this._pending??e.target_temperature??20,s=this._clampTemp(e,i+t);this._pending=s,window.clearTimeout(this._debounce),this._debounce=window.setTimeout(async()=>{await this._call("room/temperature",{entry_id:e.entry_id,temperature:s}),this._pending=void 0},700)}_mode(e,t){this._call("room/mode",{entry_id:e.entry_id,mode:t})}_schedule(e,t){this._call("schedule/activate",{entry_id:e.entry_id,schedule_id:t})}_moreInfo(e){e.climate_entity_id&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.climate_entity_id},bubbles:!0,composed:!0}))}_openPeriod(e){this._editPeriod=e,this._planning=!0}_toggle(e){this._section=this._section===e?void 0:e}_renderUpdate(){let e=ze(this._snap?.version,J,b(this.hass));return e?l`<div class="update"><span>${e.text}</span>
          <button class="text-btn" @click=${()=>location.reload()}>${e.action}</button></div>`:p}render(){if(!this._config||!this.hass)return p;let e=b(this.hass);if(!this._snap)return l`<ha-card><div class="msg">${this._unreachable?e.unreachable:e.loading}</div></ha-card>`;let t=this._room;if(!t)return l`<ha-card><div class="msg">${e.not_found}</div></ha-card>`;let i=this._config,s=t.hvac_action==="heating",o=this._pending??t.target_temperature,r=i.name||t.name,d=[i.show_floor===!1?"":t.floor?.name,Pe(t,e,this.hass),s?e.heating:""].filter(Boolean).join(" \xB7 ");return l`
      <ha-card class="${i.compact?"compact":""} ${i.embedded?"embedded":""}">
        ${i.embedded?p:this._renderUpdate()}
        ${i.show_header===!1?p:l`<div class="head">
          <button class="icon ${s?"heating":""} ${t.mode==="off"?"off":""}"
            @click=${()=>this._moreInfo(t)}
            aria-label=${r}>
            <ha-icon icon=${Me(t)}></ha-icon>
          </button>
          <div class="title">
            <div class="name">${r}</div>
            <div class="sub muted">${d}</div>
          </div>
          ${i.show_battery?this._batteryChip(t):p}
          ${i.show_editor&&!(i.show_timeline&&!i.compact)?this._pencil():p}
        </div>`}
        ${i.show_header===!1&&i.show_battery&&pe(t)?l`<div class="bat-line">${this._batteryChip(t)}</div>`:p}
        ${this._batOpen&&i.show_battery?this._batteryPanel(t):p}

        <div class="hero">
          <button class="current" title=${e.history} aria-label=${e.history}
            @click=${()=>this._moreInfo(t)}>
            <span class="big">${g(t.current_temperature,!1)}</span><span class="unit">°C</span>
          </button>
          <div class="ctl">
            <button class="round" @click=${()=>this._step(t,-.5)} aria-label="-0.5">−</button>
            <div class="target ${this._swipe?.moved?"swiping":""}" title=${e.swipe_hint}
              @pointerdown=${c=>this._swipeStart(c,t)}
              @touchstart=${c=>this._swipeStart(c,t)}>
              <div class="tv" style="--c:${$(o??void 0)}">${g(o,!1)}°</div>
              <div class="muted src">${[t.target_variable,e[`src_${t.target_source}`]].filter(Boolean).join(" \xB7 ")}</div>
            </div>
            <button class="round" @click=${()=>this._step(t,.5)} aria-label="+0.5">+</button>
          </div>
        </div>

        ${i.show_modes?this._renderModes(t):p}
        ${i.show_timeline&&!i.compact?this._renderTimeline(t):p}
        ${i.show_schedules&&it(t).length>1?this._renderScheduleChoice(t):p}
        ${i.compact?p:this._renderList(t)}
        ${this._error?l`<div class="error">${this._error}</div>`:p}
      </ha-card>
    `}_batteryChip(e){let t=e.batteries??[],i=pe(e);if(!i)return p;let s=t.filter(d=>d.level!=null).map(d=>Math.round(d.level)),o=s.length?s.length<=3?`${s.join(" \xB7 ")} %`:`${Math.min(...s)} %`:"",r=b(this.hass);return l`<button class="bat-chip ${i.low?"low":""}" aria-expanded=${this._batOpen}
      title=${r.battery} @click=${()=>this._batOpen=!this._batOpen}>
      <ha-icon icon=${st(i.level,i.low)}></ha-icon>${o}
    </button>`}_batteryPanel(e){let t=b(this.hass);return l`<div class="bat-panel">
      ${(e.batteries??[]).map(i=>l`<button class="bat ${i.low?"low":""}" ?disabled=${!i.device_id}
          @click=${()=>i.device_id&&this._navigate(`/config/devices/device/${i.device_id}`)}>
          <ha-icon icon=${st(i.level,i.low)}></ha-icon>
          <span class="grow">${i.name}</span>
          <span class="bat-val">${i.level!=null?`${Math.round(i.level)} %`:i.low?t.battery_low:t.battery_ok}</span>
          ${i.device_id?l`<ha-icon class="go" icon="mdi:chevron-right"></ha-icon>`:p}
        </button>`)}
    </div>`}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_pencil(){let e=b(this.hass);return l`<button class="pencil" title=${e.edit} aria-label=${e.edit}
      @click=${()=>this._editing=!0}>
      <ha-icon icon="mdi:pencil"></ha-icon>
    </button>`}_renderModes(e){let t=b(this.hass),i=[["auto",t.auto],["heat",t.heat],["off",t.off]];return l`<div class="seg accent" role="tablist">
      ${i.map(([s,o])=>l`<button role="tab" aria-selected=${e.mode===s}
          @click=${()=>this._mode(e,s)}>${o}</button>`)}
    </div>`}_renderScheduleChoice(e){return l`<div class="seg" role="tablist">
      ${it(e).map(t=>l`<button role="tab" aria-selected=${t.id===e.active_schedule}
          title=${t.global?b(this.hass).global_schedule:""}
          @click=${()=>this._schedule(e,t.id)}>${t.global?l`<ha-icon class="globe" icon="mdi:earth"></ha-icon>`:p}${t.name}</button>`)}
    </div>`}_renderTimeline(e){let t=b(this.hass),i=e.schedules.find(h=>h.id===e.active_schedule);if(!i)return p;let s=this._snap.variables,o=i.week?.[Y(this.hass)]??i.week?.[f[0]];if(!o?.length)return p;let r=O(o),d=Ce(this.hass),c=e.mode!=="auto"||e.override_active;return l`<div class="timeline ${c?"paused":""}">
      <div class="cap muted">
        <span>${t.today} · ${i.name}${c?` \xB7 ${t.schedule_paused}`:""}</span>
        ${this._config.show_editor?this._pencil():p}
      </div>
      <div class="bar">
        ${r.map(h=>{let u=z(h.slot,s);return l`<div class="seg-t"
            title="${re(h.slot,s)}"
            style="left:${h.start/x*100}%;width:${(h.end-h.start)/x*100}%;background:${$(u)}"></div>`})}
        <div class="now" style="left:${d/x*100}%"></div>
      </div>
      <div class="ticks muted"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`}_row(e,t,i,s,o){let r=s!==void 0&&this._section===s,d=s!==void 0||o!==void 0;return l`<button class="row ${r?"open":""}" ?disabled=${!d}
      @click=${()=>s?this._toggle(s):o?.()}>
      <ha-icon icon=${e}></ha-icon>
      <span class="row-label">${t}</span>
      <span class="row-value">${i}</span>
      ${d?l`<ha-icon class="chev" icon=${r?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>`:p}
    </button>`}_renderList(e){let t=this._config,i=b(this.hass),s=this.hass,o=ce(e),r=e.period?e.period.title:o.length?`${o.length} ${i.period_planned_n}`:i.prio_none,d=Lt(e,this._snap,i,s),c=d.layers.find(h=>h.n===d.winner);return l`<div class="list">
      ${t.show_periods?l`${this._row("mdi:calendar-star",i.period_plural,r,"periods")}
          ${this._section==="periods"?l`<div class="detail">${this._renderPeriods(e)}</div>`:p}`:p}
      ${t.show_priorities?l`${this._row("mdi:layers-triple-outline",i.prio_short,c.name,"prio")}
          ${this._section==="prio"?l`<div class="detail">${this._renderPriorities(d)}</div>`:p}`:p}
      ${t.show_hand_change&&e.hand_change?this._renderHandChange(e):p}
    </div>`}_renderHandChange(e){let t=b(this.hass),i=[["manual",t.hand_manual,t.hand_manual_long],["until_next_slot",t.hand_until,t.hand_until_long],["ignore",t.hand_ignore,t.hand_ignore_long]];return l`<div class="row hand">
      <ha-icon icon="mdi:hand-back-right-outline"></ha-icon>
      <span class="row-label" title=${t.hand_label_long}>${t.hand_label}</span>
      <div class="seg accent small" role="tablist" aria-label=${t.hand_label_long}>
        ${i.map(([s,o,r])=>l`<button role="tab" aria-selected=${e.hand_change===s} title=${r}
            @click=${()=>this._call("room/hand_change",{entry_id:e.entry_id,hand_change:s})}>
            ${o}
          </button>`)}
      </div>
    </div>`}_renderPriorities(e){return l`<div class="prio">
      ${e.layers.map(t=>l`<div class="prio-row ${t.n===e.winner?"win":t.n<e.winner?"idle":"below"}">
          <span class="prio-n">${t.n}</span>
          <span class="prio-name">${t.name}</span>
          <span class="prio-val">${t.value}</span>
        </div>`)}
    </div>`}_renderPeriods(e){let t=b(this.hass),i=this.hass,s=e.period,o=ce(e),r=this._allPeriods?o:o.slice(0,3),d=h=>`${k(h.start,i)} \u2013 ${h.end?k(h.end,i):t.period_open}`,c=(h,u)=>l`<div class="period ${u?"active":""}">
      <button class="period-text" @click=${()=>this._openPeriod(h)}>
        <span class="period-title">${h.group?l`<ha-icon class="group-icon" icon="mdi:home-group" title=${t.group_rooms}></ha-icon>`:p}${h.title}</span>
        <span class="muted period-when">${u?h.end?`${t.period_until} ${k(h.end,i)}`:t.period_open:d(h)}</span>
      </button>
      <button class="text-btn small" @click=${()=>this._call("period/cancel",{entry_id:e.entry_id,period_id:h.id})}>
        ${u?t.period_end:t.period_delete}
      </button>
    </div>`;return l`<div class="periods">
      ${s?c(s,!0):p}
      ${r.map(h=>c(h,!1))}
      ${o.length>3?l`<button class="text-btn small" @click=${()=>this._allPeriods=!this._allPeriods}>
            ${this._allPeriods?t.period_less:`+${o.length-r.length} ${t.period_more}`}
          </button>`:p}
      <button class="text-btn plan" @click=${()=>{this._editPeriod=void 0,this._planning=!0}}>
        <ha-icon icon="mdi:calendar-plus"></ha-icon> ${t.period_plan}
      </button>
    </div>`}};X.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_pending:{state:!0},_editing:{state:!0},_planning:{state:!0},_editPeriod:{state:!0},_allPeriods:{state:!0},_section:{state:!0},_batOpen:{state:!0},_swipe:{state:!0},_error:{state:!0},_unreachable:{state:!0}},X.styles=[A,y`
      .globe {
        --mdc-icon-size: 14px;
        margin-right: 4px;
        opacity: 0.6;
        vertical-align: -2px;
      }
      .group-icon {
        --mdc-icon-size: 15px;
        margin-right: 4px;
        opacity: 0.7;
        vertical-align: -2px;
      }
      ha-card {
        /* The layout follows the card's own width (e.g. two cards side by side). */
        container-type: inline-size;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow: hidden;
        height: 100%;
        box-sizing: border-box;
      }
      .update {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 6px 6px 12px;
        border-radius: 12px;
        font-size: 13px;
        background: color-mix(in srgb, var(--bt-accent) 14%, transparent);
      }
      .update span {
        flex: 1;
      }
      .msg {
        padding: 8px;
      }
      ha-card.embedded {
        --ha-card-background: transparent;
        --ha-card-box-shadow: none;
        --ha-card-border-width: 0;
        background: transparent;
        box-shadow: none;
        border: none;
        padding: 0;
        height: auto;
        overflow: visible;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bt-surface);
        color: var(--bt-muted);
        flex: none;
      }
      .icon.off {
        opacity: 0.55;
      }
      .icon.heating {
        background: color-mix(in srgb, var(--bt-heat) 18%, transparent);
        color: var(--bt-heat);
      }
      .title {
        flex: 1;
        min-width: 0;
      }
      .name {
        font-weight: 600;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sub {
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .hero {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
      }
      .current {
        padding: 0;
        text-align: left;
        border-radius: 8px;
      }
      .current:focus-visible {
        outline: 2px solid var(--bt-accent);
      }
      .ctl {
        margin-left: auto;
      }
      /* Narrow card: −/+ below the current temperature, using the full width. */
      @container (max-width: 330px) {
        .ctl {
          width: 100%;
          justify-content: space-between;
        }
        .target {
          flex: 1;
        }
      }
      /* Narrow card: the hand change switch gets its own line. */
      @container (max-width: 400px) {
        .row.hand {
          flex-wrap: wrap;
          row-gap: 6px;
          padding-top: 8px;
          padding-bottom: 8px;
        }
        .row.hand .seg.small {
          flex: 1 1 100%;
        }
        .row.hand .seg.small button {
          flex: 1 1 0;
          padding: 0 4px;
        }
      }
      .big {
        font-size: 52px;
        font-weight: 300;
        line-height: 1;
        letter-spacing: -0.02em;
      }
      .unit {
        font-size: 16px;
        color: var(--bt-muted);
        margin-left: 2px;
      }
      .ctl {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .ctl .round {
        width: 40px;
        height: 40px;
        font-size: 20px;
      }
      .target {
        text-align: center;
        min-width: 72px;
        padding: 4px 6px;
        border-radius: 12px;
        touch-action: pan-y;
        user-select: none;
        -webkit-user-select: none;
        cursor: ew-resize;
        transition: background 0.15s;
      }
      .target.swiping {
        background: var(--bt-surface);
      }
      .target.swiping .tv {
        color: var(--bt-accent);
      }
      .tv {
        font-size: 24px;
        font-weight: 500;
        line-height: 1.1;
      }
      .tv::after {
        content: "";
        display: block;
        width: 22px;
        height: 3px;
        border-radius: 2px;
        margin: 3px auto 0;
        background: var(--c);
      }
      .src {
        font-size: 11px;
      }
      .seg {
        display: flex;
        gap: 2px;
        padding: 3px;
        border-radius: 12px;
        background: var(--bt-surface);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .seg button {
        flex: 1 0 auto;
        min-height: 34px;
        padding: 0 12px;
        border-radius: 9px;
        font-size: 14px;
        font-weight: 500;
        color: var(--bt-muted);
        white-space: nowrap;
      }
      .seg button[aria-selected="true"] {
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
      }
      .seg.accent button[aria-selected="true"] {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
        box-shadow: none;
      }
      .timeline .cap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 6px;
        min-height: 28px;
      }
      .pencil {
        width: 32px;
        height: 32px;
        margin: -4px -6px -4px 0;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--bt-muted);
        flex: none;
      }
      .pencil:hover {
        background: var(--bt-surface);
        color: var(--primary-text-color);
      }
      .pencil ha-icon {
        --mdc-icon-size: 18px;
      }
      .timeline .cap {
        margin-bottom: 2px;
      }
      .timeline .bar {
        position: relative;
        height: 6px;
        border-radius: 3px;
        overflow: hidden;
        background: var(--bt-surface);
      }
      .timeline.paused .bar {
        opacity: 0.45;
      }
      .seg-t {
        position: absolute;
        top: 0;
        bottom: 0;
      }
      .now {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        margin-left: -1px;
        background: var(--primary-text-color);
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 10.5px;
        margin-top: 4px;
      }
      .list {
        display: flex;
        flex-direction: column;
        margin: -4px -4px -8px;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 46px;
        padding: 0 4px;
        border-top: 1px solid var(--divider-color);
        text-align: left;
        width: 100%;
        font-size: 14px;
      }
      .row.hand {
        gap: 10px;
      }
      .row.hand .row-label {
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
      .seg.small {
        flex: none;
        padding: 2px;
        border-radius: 9px;
      }
      .seg.small button {
        min-height: 26px;
        padding: 0 8px;
        border-radius: 7px;
        font-size: 12px;
      }
      .row:disabled {
        cursor: default;
        opacity: 1;
      }
      .row > ha-icon {
        --mdc-icon-size: 20px;
        color: var(--bt-muted);
      }
      .row-label {
        flex: 1;
        color: var(--bt-muted);
        white-space: nowrap;
      }
      .row-value {
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }
      .row .chev {
        --mdc-icon-size: 18px;
        margin-left: -6px;
      }
      .row.open .row-label {
        color: var(--primary-text-color);
      }
      .detail {
        padding: 2px 4px 12px 36px;
      }
      .low {
        color: var(--error-color, #db4437);
        font-weight: 500;
      }
      .bat-chip {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        min-height: 28px;
        padding: 0 8px 0 4px;
        border-radius: 14px;
        font-size: 12.5px;
        font-variant-numeric: tabular-nums;
        color: var(--bt-muted);
        flex: none;
        white-space: nowrap;
      }
      .bat-chip:hover,
      .bat-chip[aria-expanded="true"] {
        background: var(--bt-surface);
      }
      .bat-chip ha-icon {
        --mdc-icon-size: 18px;
      }
      .bat-chip.low {
        color: var(--error-color, #db4437);
        font-weight: 500;
      }
      .bat-line {
        display: flex;
        justify-content: flex-end;
        margin-bottom: -10px;
      }
      .bat-panel {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 6px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .bat {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 38px;
        padding: 0 6px 0 8px;
        border-radius: 10px;
        font-size: 14px;
        text-align: left;
        width: 100%;
      }
      .bat:hover:not(:disabled) {
        background: var(--card-background-color, #fff);
      }
      .bat:disabled {
        opacity: 1;
        cursor: default;
      }
      .bat-val {
        font-variant-numeric: tabular-nums;
      }
      .bat .go {
        --mdc-icon-size: 18px;
        color: var(--bt-muted);
      }
      .bat ha-icon {
        --mdc-icon-size: 18px;
        color: var(--bt-muted);
      }
      .bat.low,
      .bat.low ha-icon {
        color: var(--error-color, #db4437);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .prio {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .prio-row {
        display: grid;
        grid-template-columns: 20px auto 1fr;
        align-items: center;
        gap: 8px;
        padding: 5px 8px;
        border-radius: 9px;
        font-size: 13px;
      }
      .prio-n {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        background: var(--bt-surface);
      }
      .prio-name {
        white-space: nowrap;
      }
      .prio-val {
        text-align: right;
        color: var(--bt-muted);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .prio-row.win {
        background: var(--bt-surface);
      }
      .prio-row.win .prio-n {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .prio-row.win .prio-name,
      .prio-row.win .prio-val {
        color: var(--primary-text-color);
        font-weight: 500;
      }
      .prio-row.below {
        opacity: 0.5;
      }
      .periods {
        display: flex;
        flex-direction: column;
        gap: 2px;
        align-items: stretch;
      }
      .period {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 4px 4px 10px;
        border-radius: 10px;
      }
      .period.active {
        background: color-mix(in srgb, var(--bt-accent) 12%, transparent);
      }
      .period-text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        padding: 4px 0;
      }
      .period-title {
        font-size: 14px;
        font-weight: 500;
      }
      .period-when {
        font-size: 12px;
      }
      .text-btn.small {
        min-height: 32px;
        font-size: 13px;
        padding: 0 10px;
        align-self: flex-start;
      }
      .period .text-btn.small {
        align-self: center;
      }
      .plan {
        align-self: flex-start;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding-left: 6px;
      }
      .plan ha-icon {
        --mdc-icon-size: 18px;
      }
      /* Compact: small square wall displays */
      ha-card.compact {
        padding: 12px;
        gap: 12px;
        justify-content: space-between;
      }
      ha-card.compact .big {
        font-size: 44px;
      }
      ha-card.compact .ctl .round {
        width: 52px;
        height: 52px;
        font-size: 26px;
      }
      ha-card.compact .tv {
        font-size: 28px;
      }
      ha-card.compact .seg button {
        min-height: 44px;
      }
    `];var ni={entity:{de:"Raum",en:"Room"},name:{de:"Name (optional)",en:"Name (optional)"},compact:{de:"Kompaktmodus (Wanddisplay)",en:"Compact mode (wall display)"},show_modes:{de:"Modi anzeigen",en:"Show modes"},show_schedules:{de:"Zeitpl\xE4ne anzeigen",en:"Show schedules"},show_timeline:{de:"Zeitleiste heute anzeigen",en:"Show today's timeline"},show_editor:{de:"Stift f\xFCr Wocheneditor",en:"Pencil for weekly editor"},show_periods:{de:"Zeitr\xE4ume anzeigen und planen",en:"Show and plan periods"},show_priorities:{de:"Priorit\xE4ten anzeigen",en:"Show priorities"},show_hand_change:{de:"Verhalten bei \xC4nderung am Thermostat anzeigen",en:"Show behaviour for changes on the thermostat"},show_battery:{de:"Batteriesymbol anzeigen",en:"Show battery indicator"},title:{de:"Titel",en:"Title"},show_override:{de:"Globalen Override anzeigen",en:"Show global override"},show_variables:{de:"Variablen anzeigen",en:"Show variables"},show_actions:{de:"Zeitpl\xE4ne und Gruppen-Zeitr\xE4ume anzeigen",en:"Show schedules and group periods"},group_by_floor:{de:"Nach Stockwerk gruppieren",en:"Group by floor"},layout:{de:"Darstellung",en:"Layout"},show_summary:{de:"Zusammenfassung anzeigen",en:"Show summary"},room:{de:"R\xE4ume (gilt f\xFCr alle)",en:"Rooms (applies to all)"},exclude_rooms:{de:"R\xE4ume ausblenden",en:"Hide rooms"}},si=[{name:"entity",required:!0,selector:{entity:{filter:{domain:"climate",integration:"bestthermostat"}}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"compact",selector:{boolean:{}}},{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}},{name:"show_hand_change",selector:{boolean:{}}},{name:"show_battery",selector:{boolean:{}}}]}],ai=[{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}},{name:"show_hand_change",selector:{boolean:{}}},{name:"show_battery",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}}];function oi(a){return[{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"box",options:[{value:"list",label:a?"Liste (Raum zum Aufklappen)":"List (tap to expand)"},{value:"tiles",label:a?"Kacheln (alle R\xE4ume offen)":"Tiles (all rooms open)"}]}}},{type:"grid",name:"",schema:[{name:"show_summary",selector:{boolean:{}}},{name:"show_override",selector:{boolean:{}}},{name:"show_variables",selector:{boolean:{}}},{name:"show_actions",selector:{boolean:{}}},{name:"group_by_floor",selector:{boolean:{}}}]},{type:"expandable",name:"room",title:a?"R\xE4ume (gilt f\xFCr alle)":"Rooms (applies to all)",schema:[{type:"grid",name:"",schema:ai}]},{name:"exclude_rooms",selector:{entity:{multiple:!0,filter:{domain:"climate",integration:"bestthermostat"}}}}]}var ge=class extends v{constructor(){super(...arguments);this._label=e=>{let t=(this.hass?.locale?.language||this.hass?.language||"en").startsWith("de")?"de":"en";return ni[e.name]?.[t]??e.name}}setConfig(e){let t=this.defaults,i=e;this._config={...t,...i,...t.room?{room:{...t.room,...i.room??{}}}:{}}}_changed(e){let t=e.detail.value;this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?p:l`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};ge.properties={hass:{attribute:!1},_config:{state:!0}};var at=class extends ge{constructor(){super(...arguments);this.defaults={compact:!1,show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0,show_hand_change:!0,show_battery:!0}}get schema(){return si}},ot=class extends ge{constructor(){super(...arguments);this.defaults={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,show_actions:!0,group_by_floor:!0,room:{show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_hand_change:!0,show_battery:!0,show_editor:!0,compact:!1}}}get schema(){let e=this.hass?.locale?.language||this.hass?.language||"en";return oi(e.startsWith("de"))}};S("bestthermostat-card-editor",at);S("bestthermostat-overview-card-editor",ot);function ri(a,n,e){return{entry_id:"",name:n,climate_entity_id:null,trvs:[],mode:"auto",manual_temperature:20,frost_temperature:5,target_temperature:null,target_source:"schedule",target_variable:null,current_temperature:null,hvac_action:null,min_temp:a.limits?.min??4,max_temp:a.limits?.max??35,active_schedule:e,base_schedule:e,base_mode:"auto",base_manual_temperature:20,area:null,floor:null,period:null,periods:[],hand_until:null,override_active:!1,next_change:null,next_temperature:null,schedules:(a.global_schedules??[]).map(t=>({id:t.id,name:t.name,week:t.week,global:!0}))}}var be=class extends v{constructor(){super(...arguments);this._page={kind:"list"};this._busy=!1;this._onKey=e=>{e.key==="Escape"&&!this._editor&&this._back()}}get _t(){return b(this.hass)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey),this._editor?.remove(),this._editor=void 0}_back(){this._page.kind!=="list"?(this._page={kind:"list"},this._error=void 0):this.dispatchEvent(new CustomEvent("close"))}updated(){if(this._editing&&this.snap&&this.hass){let{entry_id:e,id:t}=this._editing,i=e?this.snap.rooms.find(s=>s.entry_id===e):ri(this.snap,this._t.global_schedules,t);if(!i){this._editing=void 0;return}this._editor||(this._editor=document.createElement("bt-week-editor"),this._editor.addEventListener("close",()=>this._editing=void 0),document.body.appendChild(this._editor)),this._editor.hass=this.hass,this._editor.snap=this.snap,this._editor.initial=t,this._editor.room=i}else this._editor&&(this._editor.remove(),this._editor=void 0)}async _call(e,t){if(this.hass){this._busy=!0,this._error=void 0;try{return await E(this.hass,e,t)}catch(i){this._error=i?.message??String(i);return}finally{this._busy=!1}}}_roomName(e){return this.snap?.rooms.find(t=>t.entry_id===e)?.name??"?"}_names(e){return e.map(t=>this._roomName(t)).join(", ")}async _delete(e){let t=this._t,i=e.active.length?t.confirm_delete_global_used.replace("{name}",e.name).replace("{rooms}",this._names(e.active)):t.confirm_delete_global.replace("{name}",e.name);if(e.periods.length&&(i+=`
${t.confirm_delete_global_periods}`),!confirm(i))return;let s=await this._call("global_schedule/delete",{schedule_id:e.id});s&&(this._info=s.switched_off.length?`${t.deleted_switched_off} ${s.switched_off.join(", ")}`:void 0)}async _submitName(){let e=this._page;if(e.kind!=="name"||!e.value.trim())return;let t=e.value.trim();if(e.mode==="rename"){(e.entry_id?await this._call("schedule/rename",{entry_id:e.entry_id,schedule_id:e.id,name:t}):await this._call("global_schedule/rename",{schedule_id:e.id,name:t}))&&(this._page={kind:"list"});return}let i=await this._call("global_schedule/create",{name:t});i&&(this._page={kind:"list"},this._editing={entry_id:"",id:i.id})}async _deleteOwn(e,t){confirm(`${e.name}: ${t.name}
${this._t.confirm_delete}`)&&await this._call("schedule/delete",{entry_id:e.entry_id,schedule_id:t.id})}_identical(e,t){let i=[];for(let s of this.snap?.rooms??[]){if(s.entry_id===e)continue;let o=s.schedules.find(r=>!r.global&&q(r.week,t));o&&i.push({room:s,id:o.id,name:o.name})}return i}_startMakeGlobal(e,t){let i=new Set(this._identical(e.entry_id,t.week).map(s=>s.room.entry_id));this._error=void 0,this._page={kind:"make_global",entry_id:e.entry_id,id:t.id,sel:i,all:!1}}async _makeGlobal(){let e=this._page;if(e.kind!=="make_global")return;let t=this.snap?.rooms.find(r=>r.entry_id===e.entry_id),i=t?.schedules.find(r=>r.id===e.id);if(!t||!i)return;let s=this._identical(t.entry_id,i.week).filter(r=>e.sel.has(r.room.entry_id)).map(r=>({entry_id:r.room.entry_id,schedule_id:r.id}));await this._call("schedule/make_global",{entry_id:t.entry_id,schedule_id:i.id,merge:s,all_rooms:e.all})&&(this._page={kind:"list"})}_pageName(e){if(e.kind==="list"||!("id"in e)||!e.id)return"";let t="entry_id"in e?e.entry_id:"";if(t){let i=this.snap?.rooms.find(o=>o.entry_id===t),s=i?.schedules.find(o=>o.id===e.id);return i&&s?`${i.name} \xB7 ${s.name}`:""}return this.snap?.global_schedules?.find(i=>i.id===e.id)?.name??""}async _applyRooms(){let e=this._page;if(e.kind!=="rooms"||!this.snap)return;let t;if(e.mode==="visibility"){let i=this.snap.rooms.every(s=>e.sel.has(s.entry_id));t=await this._call("global_schedule/rooms",{schedule_id:e.id,rooms:i?null:[...e.sel]})}else t=await this._call("global_schedule/assign",{schedule_id:e.id,entry_ids:[...e.sel]});t&&(this._page={kind:"list"})}render(){if(!this.snap)return p;let e=this._t,t=this._page,i=t.kind==="rooms"?t.mode==="visibility"?e.visibility:e.assign:t.kind==="name"?t.mode==="new"?e.global_new:e.rename:t.kind==="make_global"?e.make_global_action:e.global_schedules,s=this._pageName(t);return l`
      <div class="backdrop" @click=${()=>this.dispatchEvent(new CustomEvent("close"))}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          ${t.kind!=="list"?l`<button class="round small" aria-label=${e.close} @click=${()=>this._back()}>
                <ha-icon icon="mdi:chevron-left"></ha-icon>
              </button>`:p}
          <div class="h-title">
            <div class="h-name">${i}</div>
            ${s?l`<div class="muted h-sub">${s}</div>`:p}
          </div>
          <button class="round small" aria-label=${e.close} @click=${()=>this.dispatchEvent(new CustomEvent("close"))}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <div class="content">
          ${t.kind==="list"?this._renderList():t.kind==="rooms"?this._renderRooms(t):t.kind==="make_global"?this._renderMakeGlobal(t):this._renderName(t)}
          ${this._info&&t.kind==="list"?l`<div class="info">${this._info}</div>`:p}
          ${this._error?l`<div class="error">${this._error}</div>`:p}
        </div>
        <footer>${this._renderFooter()}</footer>
      </div>
    `}_renderFooter(){let e=this._t,t=this._page;if(t.kind==="list")return l`<button class="text-btn" @click=${()=>this._page={kind:"name",mode:"new",entry_id:"",value:""}}>
          <ha-icon icon="mdi:plus"></ha-icon>${e.global_new}
        </button>
        <span class="spacer"></span>
        <button class="text-btn" @click=${()=>this.dispatchEvent(new CustomEvent("close"))}>${e.close}</button>`;if(t.kind==="make_global")return l`<span class="spacer"></span>
        <button class="text-btn" @click=${()=>this._back()}>${e.cancel}</button>
        <button class="primary-btn" ?disabled=${this._busy} @click=${this._makeGlobal}>${e.make_global_action}</button>`;if(t.kind==="rooms"){let i=this._busy||t.mode==="assign"&&!t.sel.size;return l`<span class="spacer"></span>
        <button class="text-btn" @click=${()=>this._back()}>${e.cancel}</button>
        <button class="primary-btn" ?disabled=${i} @click=${this._applyRooms}>
          ${t.mode==="assign"?e.assign_action:e.save}
        </button>`}return l`<span class="spacer"></span>
      <button class="text-btn" @click=${()=>this._back()}>${e.cancel}</button>
      <button class="primary-btn" ?disabled=${this._busy||!t.value.trim()} @click=${this._submitName}>${e.ok}</button>`}_renderList(){let e=this._t,t=this.snap.global_schedules??[],i=this.snap.rooms.map(o=>o.entry_id),s=this.snap.rooms.filter(o=>o.schedules.some(r=>!r.global));return l`
      <div class="section-title"><ha-icon icon="mdi:earth"></ha-icon>${e.global_section}</div>
      <div class="muted small">${t.length?e.global_hint:e.global_none}</div>
      ${t.map(o=>{let r=o.rooms===null?e.global_all_rooms:o.rooms.length===0?e.global_no_rooms:o.rooms.length<=3?this._names(o.rooms):e.global_n_rooms.replace("{n}",String(o.rooms.length));return l`<div class="item">
          <div class="item-head">
            <ha-icon icon="mdi:earth"></ha-icon>
            <span class="item-name">${o.name}</span>
            <button class="icon-btn" aria-label=${e.edit_week} title=${e.edit_week}
              @click=${()=>this._editing={entry_id:"",id:o.id}}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>
            </button>
          </div>
          ${this._renderPreview(o)}
          <div class="facts small">
            <div><span class="muted">${e.global_active_in}:</span>
              ${o.active.length?this._names(o.active):l`<span class="muted">${e.global_active_none}</span>`}</div>
            <div><span class="muted">${e.global_offered}:</span> ${r}</div>
            ${o.periods.length?l`<div><span class="muted">${e.global_periods_in}:</span> ${this._names(o.periods)}</div>`:p}
          </div>
          <div class="actions">
            <button class="chip" @click=${()=>this._page={kind:"rooms",mode:"assign",id:o.id,sel:new Set(o.active)}}>
              <ha-icon icon="mdi:home-import-outline"></ha-icon>${e.assign}
            </button>
            <button class="chip" @click=${()=>this._page={kind:"rooms",mode:"visibility",id:o.id,sel:new Set(o.rooms??i)}}>
              <ha-icon icon="mdi:eye-outline"></ha-icon>${e.visibility}
            </button>
            <button class="chip" @click=${()=>this._page={kind:"name",mode:"rename",entry_id:"",id:o.id,value:o.name}}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${e.rename}
            </button>
            <button class="chip danger" ?disabled=${this._busy} @click=${()=>this._delete(o)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${e.delete}
            </button>
          </div>
        </div>`})}
      ${s.length?l`<div class="section-title"><ha-icon icon="mdi:home-outline"></ha-icon>${e.own_section}</div>
            <div class="muted small">${e.own_hint}</div>
            ${s.map(o=>this._renderRoomSchedules(o))}`:p}
    `}_renderRoomSchedules(e){let t=this._t,i=e.schedules.filter(s=>!s.global);return l`<div class="item">
      <div class="item-head">
        <span class="item-name">${e.name}</span>
        ${e.floor?l`<span class="muted small">${e.floor.name}</span>`:p}
      </div>
      ${i.map(s=>{let o=s.id===e.base_schedule;return l`<div class="own">
          <div class="own-head">
            <span class="own-name">${s.name}</span>
            ${o?l`<span class="badge">${t.active}</span>`:p}
            <span class="spacer"></span>
            <button class="icon-btn" aria-label=${t.edit_week} title=${t.edit_week}
              @click=${()=>this._editing={entry_id:e.entry_id,id:s.id}}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>
            </button>
          </div>
          ${this._renderPreview(s)}
          <div class="actions">
            <button class="chip" @click=${()=>this._startMakeGlobal(e,s)}>
              <ha-icon icon="mdi:earth"></ha-icon>${t.make_global}
            </button>
            <button class="chip" @click=${()=>this._page={kind:"name",mode:"rename",entry_id:e.entry_id,id:s.id,value:s.name}}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${t.rename}
            </button>
            <button class="chip danger" ?disabled=${this._busy||o} title=${o?t.not_deletable_active:""}
              @click=${()=>this._deleteOwn(e,s)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
            </button>
          </div>
        </div>`})}
    </div>`}_renderMakeGlobal(e){let t=this._t,i=this.snap.rooms.find(d=>d.entry_id===e.entry_id),s=i?.schedules.find(d=>d.id===e.id);if(!i||!s)return p;let o=this._identical(i.entry_id,s.week),r=d=>{let c=new Set(e.sel);c.has(d)?c.delete(d):c.add(d),this._page={...e,sel:c}};return l`
      <div class="muted small">${t.make_global_hint.replace("{name}",s.name)}</div>
      <div class="picks">
        ${o.length?o.map(d=>{let c=e.sel.has(d.room.entry_id);return l`<button class="pick" role="checkbox" aria-checked=${c} @click=${()=>r(d.room.entry_id)}>
                <ha-icon icon=${c?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
                <span class="grow">${d.room.name}</span>
                <span class="muted small">${d.name}</span>
              </button>`}):l`<div class="muted small">${t.make_global_none}</div>`}
      </div>
      <button class="pick" role="checkbox" aria-checked=${e.all} @click=${()=>this._page={...e,all:!e.all}}>
        <ha-icon icon=${e.all?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
        <span class="grow">${t.make_global_all}</span>
      </button>
    `}_renderPreview(e){let t=this.snap.variables,i=e.week[Y(this.hass)]??e.week[f[0]];return l`<div class="preview">
      ${O(i).map(s=>l`<i style="left:${s.start/x*100}%;width:${(s.end-s.start)/x*100}%;
          background:${$(z(s.slot,t))}"></i>`)}
    </div>`}_renderRooms(e){let t=this._t,i=this.snap.global_schedules?.find(o=>o.id===e.id),s={};for(let o of i?.active??[])s[o]=t.active;return l`
      <div class="muted small">${e.mode==="visibility"?t.visibility_hint:t.assign_hint}</div>
      <bt-room-picker .hass=${this.hass} .rooms=${this.snap.rooms} .selected=${e.sel} .notes=${s}
        @change=${o=>this._page={...e,sel:o.detail}}></bt-room-picker>
    `}_renderName(e){let t=this._t;return l`<input type="text" .value=${e.value} placeholder=${t.name} aria-label=${t.name}
      @input=${i=>this._page={...e,value:i.target.value}}
      @keydown=${i=>i.key==="Enter"&&this._submitName()} />`}};be.properties={hass:{attribute:!1},snap:{attribute:!1},_page:{state:!0},_error:{state:!0},_info:{state:!0},_busy:{state:!0},_editing:{state:!0}},be.styles=[A,Ee,y`
      .small {
        font-size: 13px;
      }
      .spacer {
        flex: 1;
      }
      .round.small {
        width: 36px;
        height: 36px;
      }
      .round ha-icon,
      .chip ha-icon,
      .text-btn ha-icon {
        --mdc-icon-size: 18px;
      }
      .text-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
      .icon-btn:hover {
        background: var(--bt-surface);
      }
      .item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid var(--divider-color);
      }
      .item-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .item-head > ha-icon {
        color: var(--bt-accent);
        --mdc-icon-size: 20px;
      }
      .item-name {
        flex: 1;
        font-weight: 600;
      }
      .preview {
        position: relative;
        height: 10px;
        border-radius: 5px;
        overflow: hidden;
        background: var(--bt-surface);
      }
      .preview i {
        position: absolute;
        top: 0;
        bottom: 0;
      }
      .facts {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .actions .chip {
        min-height: 32px;
        padding: 0 10px;
        font-size: 13px;
      }
      .chip.danger {
        color: var(--error-color, #db4437);
      }
      .info {
        font-size: 13px;
        color: var(--bt-accent);
      }
      .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 4px;
        font-size: 13px;
        font-weight: 600;
        color: var(--bt-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .section-title ha-icon {
        --mdc-icon-size: 16px;
      }
      .own {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding-top: 8px;
        border-top: 1px solid var(--divider-color);
      }
      .own-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .own-name {
        font-weight: 500;
      }
      .badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--success-color, #43a047) 18%, transparent);
        color: var(--success-color, #43a047);
      }
      .picks {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .pick {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        padding: 0 8px;
        border-radius: 10px;
        text-align: left;
      }
      .pick:hover {
        background: var(--bt-surface);
      }
      .pick[aria-checked="true"] ha-icon {
        color: var(--bt-accent);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
    `];S("bt-schedule-manager",be);var Ht="bestthermostat.collapsedFloors",li={show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_hand_change:!0,show_editor:!0,show_battery:!0,compact:!1},Q=class extends v{constructor(){super(...arguments);this._ovOpen=!1;this._varsOpen=!1;this._unreachable=!1;this._managing=!1;this._planning=!1;this._cardConfigs=new Map;this._collapsed=this._loadCollapsed();this._pending=new Map;this._timers=new Map;this._swipeConsumed=!1}static getConfigElement(){return document.createElement("bestthermostat-overview-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,show_actions:!0,show_periods:!0,group_by_floor:!0,...e,room:{...li,...e.show_periods===!1?{show_periods:!1}:{},...e.room??{}}},this._cardConfigs.clear()}_cardConfig(e,t){let i=`${e.entry_id}:${t}`,s=this._cardConfigs.get(i);return s||(s={type:"custom:bestthermostat-card",entity:e.climate_entity_id??e.entry_id,embedded:!0,show_header:t,show_floor:!this._config.group_by_floor,...this._config.room},this._cardConfigs.set(i,s)),s}getCardSize(){return 2+(this._snap?.rooms.length??2)}_subscribe(){this._unsub=ke(this.hass,e=>this._snap=e,e=>this._unreachable=e)}connectedCallback(){super.connectedCallback(),this.hass&&this._subscribe()}shouldUpdate(e){return e.size===1&&e.has("hass")?(!this._unsub&&this.hass&&this.isConnected&&this._subscribe(),Te(e.get("hass"),this.hass)):!0}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,this._manager?.remove(),this._manager=void 0,this._managing=!1,this._planner?.remove(),this._planner=void 0,this._planning=!1}updated(){this._managing&&this.hass&&this._snap?(this._manager||(this._manager=document.createElement("bt-schedule-manager"),this._manager.addEventListener("close",()=>this._managing=!1),document.body.appendChild(this._manager)),this._manager.hass=this.hass,this._manager.snap=this._snap):this._manager&&(this._manager.remove(),this._manager=void 0),this._planning&&this.hass&&this._snap?(this._planner||(this._planner=document.createElement("bt-period-dialog"),this._planner.addEventListener("close",()=>this._planning=!1),document.body.appendChild(this._planner)),this._planner.hass=this.hass,this._planner.snap=this._snap):this._planner&&(this._planner.remove(),this._planner=void 0)}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&this._subscribe()}async _call(e,t){try{this._error=void 0,await E(this.hass,e,t)}catch(i){this._error=i?.message??String(i)}}_stepPending(e,t,i){let{min:s,max:o}=T(this._snap),r=de(t,s,o);this._pending.set(e,r),this.requestUpdate(),window.clearTimeout(this._timers.get(e)),this._timers.set(e,window.setTimeout(async()=>{await i(r),this._pending.delete(e),this.requestUpdate()},600))}_swipeStart(e,t,i,s,o,r){let d=this._pending.get(t)??i;Ne(e,{onStep:c=>{this._swipe={key:t,moved:!0};let h=Math.min(o,Math.max(s,Math.round((d+c*.5)*2)/2));h!==this._pending.get(t)&&(this._pending.set(t,h),window.clearTimeout(this._timers.get(t)),navigator.vibrate?.(5)),this.requestUpdate()},onEnd:async c=>{if(this._swipe=void 0,!c)return;this._swipeConsumed=!0,window.setTimeout(()=>this._swipeConsumed=!1,0);let h=this._pending.get(t);this.requestUpdate(),h!==void 0&&(await r(h),this._pending.delete(t),this.requestUpdate())}})}_swipeRoom(e,t){this._swipeStart(e,`room:${t.entry_id}`,t.target_temperature??20,t.min_temp,t.max_temp,i=>this._call("room/temperature",{entry_id:t.entry_id,temperature:i}))}_swipeOverride(e,t){let{min:i,max:s}=T(this._snap);this._swipeStart(e,"override",t??16,i,s,o=>this._call("override/set",{temperature:o}))}_consumeSwipe(){let e=this._swipeConsumed;return this._swipeConsumed=!1,e}_varStep(e,t,i){let s=`var:${e}`;this._stepPending(s,(this._pending.get(s)??t)+i,o=>this._call("variable/update",{variable_id:e,value:o}))}_loadCollapsed(){try{return new Set(JSON.parse(localStorage.getItem(Ht)||"[]"))}catch{return new Set}}_toggleFloor(e){let t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t;try{localStorage.setItem(Ht,JSON.stringify([...t]))}catch{}this.requestUpdate()}_floorIconNo(e){return e==null?"0":e<0?"negative-1":e>3?"3":String(e)}_heatingCount(e){return e.filter(t=>t.hvac_action==="heating").length}_renderTile(e){return l`<div class="tile">
      <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!0)}></bestthermostat-card>
    </div>`}_groups(e){if(!this._config?.group_by_floor||!e.some(i=>i.floor))return[{floor:null,rooms:e}];let t=new Map;for(let i of e){let s=i.floor?.id??"";t.has(s)||t.set(s,{floor:i.floor,rooms:[]}),t.get(s).rooms.push(i)}return[...t.values()].sort((i,s)=>{if(!i.floor)return 1;if(!s.floor)return-1;let o=i.floor.level??999,r=s.floor.level??999;return o!==r?o-r:i.floor.name.localeCompare(s.floor.name)})}_renderUpdate(){let e=ze(this._snap?.version,J,b(this.hass));return e?l`<div class="update"><span>${e.text}</span>
          <button class="text-btn" @click=${()=>location.reload()}>${e.action}</button></div>`:p}render(){if(!this._config||!this.hass)return p;let e=b(this.hass),t=this._snap;if(!t)return l`<ha-card><div class="pad">${this._unreachable?e.unreachable:e.loading}</div></ha-card>`;let i=t.rooms.filter(_=>_.hvac_action==="heating").length,s=t.rooms.map(_=>_.current_temperature).filter(_=>_!=null),o=s.length?s.reduce((_,w)=>_+w,0)/s.length:null,r=new Set(this._config.exclude_rooms??[]),d=t.rooms.filter(_=>!r.has(_.climate_entity_id??"")&&!r.has(_.entry_id)),c=this._groups(d),h=c.length>1||c[0]?.floor,u=this._config.layout==="tiles",m=this._config.title??e.rooms;return l`<ha-card>
      <div class="pad col">
        ${this._renderUpdate()}
        ${m||this._config.show_summary?l`<div>
              ${m?l`<div class="title">${m}</div>`:p}
              ${this._config.show_summary?l`<div class="muted summary">
                    ${i} ${e.of} ${t.rooms.length} ${e.rooms_word} ${e.heating_summary}${o!=null?l` · Ø ${g(o)}`:p}
                  </div>`:p}
            </div>`:p}
        <div class="top">
          ${this._config.show_override?this._renderOverride():p}
          ${this._config.show_variables&&t.variables.length?this._renderVariables():p}
          ${this._config.show_actions?l`<div class="actions">
                <button class="mini act" @click=${()=>this._managing=!0}>
                  <ha-icon icon="mdi:calendar-multiple"></ha-icon>${e.global_schedules}
                </button>
                <button class="mini act" @click=${()=>this._planning=!0}>
                  <ha-icon icon="mdi:calendar-plus"></ha-icon>${e.period_plan}
                </button>
              </div>`:p}
        </div>
        <div class="rooms">
          ${c.map(_=>{let w=_.floor?.id??"_other",j=h&&this._collapsed.has(w),M=h?Nt(_.rooms):void 0;return l`${h?l`<button class="floor" aria-expanded=${!j} @click=${()=>this._toggleFloor(w)}>
                      <ha-icon icon=${_.floor?.icon||"mdi:home-floor-"+this._floorIconNo(_.floor?.level)}></ha-icon>
                      <span>${_.floor?.name??e.other_floor}</span>
                      ${this._heatingCount(_.rooms)?l`<span class="floor-heat">· ${this._heatingCount(_.rooms)} ${e.heating_summary}</span>`:p}
                      <span class="floor-next">${M?`${e.until} ${k(M.time,this.hass)}, ${e.then} ${g(M.temp,!1)}\xB0`:""}</span>
                      <ha-icon class="floor-chev" icon=${j?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>
                    </button>`:p}
                ${j?p:l`<div class="grid ${u?"tiles":""}">
                      ${_.rooms.map(Oe=>u?this._renderTile(Oe):this._renderRoom(Oe,!!M&&nt(Oe)))}
                    </div>`}`})}
        </div>
        ${this._error?l`<div class="error">${this._error}</div>`:p}
      </div>
    </ha-card>`}_renderOverride(){let e=b(this.hass),t=this._snap.override,i=this._ovOpen,s=this._pending.get("override")??t.value,o=r=>this._stepPending("override",(s??16)+r,d=>this._call("override/set",{temperature:d}));return l`<div class="box ${t.active?"on":""}">
      <div class="box-head">
        <span class="box-label">
          <ha-icon icon="mdi:home-export-outline"></ha-icon>
          <span>${e.override}</span>
        </span>
        <button class="value-btn swipeable ${i?"open":""} ${this._swipe?.key==="override"&&this._swipe.moved?"swiping":""}"
          title=${e.swipe_hint}
          @pointerdown=${r=>this._swipeOverride(r,s)}
          @touchstart=${r=>this._swipeOverride(r,s)}
          @click=${()=>{this._consumeSwipe()||(this._ovOpen=!this._ovOpen)}}
          aria-expanded=${i}>
          ${g(s)}
          <ha-icon icon=${i?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        <button class="switch ${t.active?"on":""}" role="switch" aria-checked=${t.active}
          aria-label=${e.override} @click=${()=>this._call("override/set",{active:!t.active})}>
          <span></span>
        </button>
      </div>
      ${i?l`<div class="box-body">
            ${this._renderOverrideSlider(s,o)}
            <div class="also">
              <span class="muted">${e.override_also}</span>
              ${[["include_manual",t.include_manual,e.heat],["include_off",t.include_off,e.off]].map(([r,d,c])=>l`<button class="mini ${d?"on":""}"
                  @click=${()=>this._call("override/set",{[r]:!d})}>${c}</button>`)}
            </div>
          </div>`:p}
    </div>`}_renderOverrideSlider(e,t){let i=b(this.hass),s=this._snap.override,o=[...this._snap.variables].sort((m,_)=>m.value-_.value),r=e??16,{min:d,max:c}=T(this._snap),h=[];for(let m=Math.ceil(d/5)*5;m<=c;m+=5)h.push(m);let u=m=>(Math.min(c,Math.max(d,m))-d)/(c-d)*100;return l`<div class="ov-slider" style="--thumb:${$(r)}">
      <div class="ov-value">
        <button class="round small" aria-label="-0.5" @click=${()=>t(-.5)}>−</button>
        <span class="big-val swipeable ${this._swipe?.key==="override"&&this._swipe.moved?"swiping":""}"
          title=${i.swipe_hint}
          @pointerdown=${m=>this._swipeOverride(m,e)}
          @touchstart=${m=>this._swipeOverride(m,e)}>
          ${g(r,!1)}<small>°C</small>
        </span>
        <button class="round small" aria-label="+0.5" @click=${()=>t(.5)}>+</button>
      </div>
      <div class="track">
        <input type="range" min=${d} max=${c} step="0.5" .value=${String(r)}
          aria-label=${i.override}
          style="background:${Tt(d,c)}"
          @input=${m=>{this._pending.set("override",Number(m.target.value)),window.clearTimeout(this._timers.get("override")),this.requestUpdate()}}
          @change=${async m=>{let _=Number(m.target.value);await this._call("override/set",{temperature:_}),this._pending.delete("override"),this.requestUpdate()}} />
        ${o.map(m=>l`<i class="tick" style="left:${u(m.value)}%" title=${m.name}></i>`)}
      </div>
      <div class="scale muted">${h.map(m=>l`<span style="left:${u(m)}%">${m}°</span>`)}</div>
      ${o.length?l`<div class="quick">
            ${o.map(m=>l`<button class="mini q ${s.variable===m.id?"on":""}"
                @click=${()=>this._call("override/set",{variable:m.id})}>
                <span class="dot" style="background:${$(m.value)}"></span>${m.name}
                <b>${g(m.value,!1)}°</b>
              </button>`)}
          </div>`:p}
    </div>`}_renderVariables(){let e=b(this.hass),t=this._snap.variables;return l`<div>
      <button class="vars-line" @click=${()=>this._varsOpen=!this._varsOpen}>
        <span class="vars-text">
          ${t.map((i,s)=>l`${s?l`<span class="sep">·</span>`:p}<span>${i.name}
                <b>${g(i.value,!1)}°</b></span>`)}
        </span>
        <ha-icon icon=${this._varsOpen?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>
      </button>
      ${this._varsOpen?l`<div class="var-list">
            ${t.map(i=>l`<div class="var-row">
                <span class="dot" style="background:${$(i.value)}"></span>
                <span class="grow">${i.name}</span>
                <button class="round small" @click=${()=>this._varStep(i.id,i.value,-.5)}>−</button>
                <span class="val">${g(this._pending.get(`var:${i.id}`)??i.value)}</span>
                <button class="round small" @click=${()=>this._varStep(i.id,i.value,.5)}>+</button>
              </div>`)}
            <div class="muted hint">${e.variables_note}</div>
          </div>`:p}
    </div>`}_renderRoom(e,t=!1){let i=b(this.hass),s=this.hass,o=e.hvac_action==="heating",r=this._open===e.entry_id,d=this._config?.room?.show_periods?ce(e)[0]:void 0;return l`<div class="room-block ${r?"open":""}">
      <button class="room" @click=${()=>{this._consumeSwipe()||(this._open=r?void 0:e.entry_id)}}>
        <span class="icon ${o?"heating":""} ${e.mode==="off"?"off":""}">
          <ha-icon icon=${Me(e)}></ha-icon>
        </span>
        <span class="grow left">
          <span class="name">${e.name}${this._config?.room?.show_battery&&pe(e)?.low?l`<ha-icon class="bat-low" icon="mdi:battery-alert-variant-outline"
                title=${i.battery_low}></ha-icon>`:p}</span>
          <span class="muted sub">${Pe(e,i,s,t)}</span>
          ${d?l`<span class="muted sub planned">
                <ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${d.title} · ${i.period_from}
                ${k(d.start,s)}
              </span>`:p}
        </span>
        <span class="temps swipeable ${this._swipe?.key===`room:${e.entry_id}`&&this._swipe.moved?"swiping":""}"
          title=${i.swipe_hint}
          @pointerdown=${c=>this._swipeRoom(c,e)}
          @touchstart=${c=>this._swipeRoom(c,e)}>
          <span class="cur">${g(e.current_temperature,!1)}°</span>
          ${this._pending.has(`room:${e.entry_id}`)?l`<span class="tgt live">→ ${g(this._pending.get(`room:${e.entry_id}`),!1)}°</span>`:e.current_temperature==null||e.target_temperature==null||Math.abs(e.current_temperature-e.target_temperature)>=.5?l`<span class="muted tgt">→ ${g(e.target_temperature,!1)}°</span>`:p}
        </span>
      </button>
      ${r?l`<div class="detail">
            <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!1)}></bestthermostat-card>
          </div>`:p}
    </div>`}};Q.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_error:{state:!0},_open:{state:!0},_ovOpen:{state:!0},_varsOpen:{state:!0},_unreachable:{state:!0},_managing:{state:!0},_planning:{state:!0}},Q.styles=[A,y`
      .update {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 6px 6px 12px;
        border-radius: 12px;
        font-size: 13px;
        background: color-mix(in srgb, var(--bt-accent) 14%, transparent);
      }
      .update span {
        flex: 1;
      }
      .pad {
        padding: 16px;
        container-type: inline-size;
      }
      .top {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      @container (min-width: 620px) {
        .top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: start;
        }
        .top .vars-line {
          min-height: 48px;
        }
        .top .actions {
          grid-column: 1 / -1;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          align-items: start;
          gap: 8px;
        }
        .grid .room-block,
        .grid .room-block + .room-block {
          border: none;
          border-radius: 14px;
          background: var(--bt-surface);
        }
        .grid .room {
          padding: 10px 12px;
        }
        .grid .icon {
          background: var(--card-background-color, #fff);
        }
        .grid .controls {
          margin: 0 10px 10px;
          background: var(--card-background-color, #fff);
        }
        .grid .controls .seg {
          background: var(--bt-surface);
        }
        .grid .controls .seg button[aria-selected="true"] {
          background: var(--card-background-color, #fff);
        }
        .grid .controls .seg.accent button[aria-selected="true"] {
          background: var(--bt-accent);
        }
        .grid .controls .round.small {
          background: var(--bt-surface);
        }
        .floor {
          margin-top: 16px;
        }
      }
      .col {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .title {
        font-size: 18px;
        font-weight: 600;
      }
      .summary {
        font-size: 13px;
        margin-top: 2px;
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .box {
        border-radius: 14px;
        background: var(--bt-surface);
        padding: 4px 6px 4px 12px;
      }
      .box.on {
        background: color-mix(in srgb, var(--bt-accent) 14%, transparent);
      }
      .box-head {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 40px;
      }
      .box-label {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        text-align: left;
        font-size: 14px;
      }
      .value-btn {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        min-height: 30px;
        padding: 0 6px 0 10px;
        border-radius: 15px;
        background: var(--card-background-color, #fff);
        font-size: 14px;
        font-weight: 500;
      }
      .value-btn ha-icon {
        --mdc-icon-size: 18px;
        color: var(--bt-muted);
      }
      .box-label ha-icon {
        --mdc-icon-size: 20px;
        color: var(--bt-muted);
      }
      .box-body {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 4px 6px 10px 0;
      }
      .ov-slider {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 12px 12px 10px;
        border-radius: 14px;
        background: var(--card-background-color, #fff);
      }
      .ov-value {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ov-value .round.small {
        background: var(--bt-surface);
      }
      .big-val {
        font-size: 30px;
        font-weight: 400;
        letter-spacing: -0.01em;
        font-variant-numeric: tabular-nums;
        padding: 0 10px;
      }
      .big-val small {
        font-size: 14px;
        color: var(--bt-muted);
        margin-left: 2px;
      }
      .track {
        position: relative;
        padding: 10px 0 4px;
      }
      .track input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        display: block;
        width: 100%;
        height: 10px;
        margin: 0;
        border-radius: 5px;
        outline: none;
        cursor: pointer;
      }
      .track input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #fff;
        border: 5px solid var(--thumb);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
        cursor: grab;
        position: relative;
        z-index: 2;
      }
      .track input[type="range"]:active::-webkit-slider-thumb {
        cursor: grabbing;
        transform: scale(1.08);
      }
      .track input[type="range"]::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        border: 5px solid var(--thumb);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
        cursor: grab;
      }
      .track input[type="range"]::-moz-range-track {
        background: transparent;
      }
      .track input[type="range"]:focus-visible::-webkit-slider-thumb {
        outline: 2px solid var(--bt-accent);
        outline-offset: 2px;
      }
      .tick {
        position: absolute;
        top: 12px;
        width: 2px;
        height: 6px;
        margin-left: -1px;
        border-radius: 1px;
        background: rgba(255, 255, 255, 0.9);
        pointer-events: none;
      }
      .scale {
        position: relative;
        height: 14px;
        font-size: 11px;
        margin: 0 10px; /* the slider thumb never reaches the very edges */
      }
      .scale span {
        position: absolute;
        transform: translateX(-50%);
      }
      .quick {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding-top: 4px;
      }
      .mini.q {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: var(--bt-surface);
        color: var(--primary-text-color);
      }
      .mini.q b {
        font-weight: 600;
      }
      .mini.q.on {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .switch {
        width: 40px;
        height: 24px;
        border-radius: 12px;
        background: var(--disabled-color, #bdbdbd);
        position: relative;
        flex: none;
        margin-right: 4px;
        transition: background 0.15s;
      }
      .switch span {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        transition: left 0.15s;
      }
      .switch.on {
        background: var(--bt-accent);
      }
      .switch.on span {
        left: 19px;
      }
      .stepper {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .stepper.wide {
        justify-content: space-between;
      }
      .round.small {
        width: 34px;
        height: 34px;
        font-size: 20px;
        background: var(--card-background-color, #fff);
      }
      .val {
        min-width: 64px;
        text-align: center;
        font-size: 15px;
      }
      .also {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
      }
      .mini {
        min-height: 28px;
        padding: 0 10px;
        border-radius: 14px;
        font-size: 13px;
        background: var(--card-background-color, #fff);
        color: var(--bt-muted);
      }
      .mini.on {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .mini.act {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 32px;
        padding: 0 12px;
        border-radius: 16px;
        background: var(--bt-surface);
        color: var(--primary-text-color);
      }
      .mini.act ha-icon {
        --mdc-icon-size: 16px;
        color: var(--bt-muted);
      }
      .vars-line {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        text-align: left;
        font-size: 13px;
        color: var(--bt-muted);
        padding: 0 4px;
      }
      .vars-line ha-icon {
        --mdc-icon-size: 18px;
      }
      .vars-text {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 2px 6px;
      }
      .vars-text b {
        color: var(--primary-text-color);
        font-weight: 500;
      }
      .var-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 8px;
        padding: 8px 10px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .var-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex: none;
      }
      .hint {
        font-size: 12px;
      }
      .rooms {
        display: flex;
        flex-direction: column;
      }
      .floor {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--bt-muted);
        margin: 12px 4px 2px;
        width: calc(100% - 8px);
        padding: 4px 0;
        text-align: left;
      }
      .floor ha-icon {
        --mdc-icon-size: 16px;
      }
      .swipeable {
        touch-action: pan-y;
        user-select: none;
        -webkit-user-select: none;
        cursor: ew-resize;
        border-radius: 10px;
        transition: background 0.15s;
      }
      .temps.swipeable {
        padding: 2px 6px;
        margin: -2px -6px;
      }
      .swiping {
        background: var(--bt-surface);
      }
      .swiping .tgt,
      .tgt.live,
      .val.swiping,
      .value-btn.swiping {
        color: var(--bt-accent);
      }
      .val.swipeable {
        padding: 4px 0;
      }
      .floor-next {
        margin-left: auto;
        text-transform: none;
        letter-spacing: 0;
        font-weight: 500;
        white-space: nowrap;
      }
      .floor-chev {
        --mdc-icon-size: 18px;
        margin-left: 2px;
      }
      .icon.off {
        opacity: 0.55;
      }
      .floor-heat {
        color: var(--bt-heat);
        text-transform: none;
        letter-spacing: 0;
        font-weight: 500;
      }
      .detail {
        margin: 0 0 12px;
        padding: 12px;
        border-radius: 16px;
        border: 1px solid var(--divider-color);
      }
      .grid.tiles {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        align-items: start;
        gap: 10px;
      }
      .tile {
        padding: 14px;
        border-radius: 18px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color, #fff);
      }
      .floor:first-child {
        margin-top: 0;
      }
      .room-block + .room-block {
        border-top: 1px solid var(--divider-color);
      }
      .floor + .room-block {
        border-top: none;
      }
      .room {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 4px;
        width: 100%;
        text-align: left;
      }
      .icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bt-surface);
        color: var(--bt-muted);
        flex: none;
      }
      .icon ha-icon {
        --mdc-icon-size: 20px;
      }
      .icon.heating {
        background: color-mix(in srgb, var(--bt-heat) 18%, transparent);
        color: var(--bt-heat);
      }
      .left,
      .temps {
        display: flex;
        flex-direction: column;
      }
      .temps {
        align-items: flex-end;
      }
      .name {
        font-weight: 500;
      }
      .sub {
        font-size: 12.5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .bat-low {
        --mdc-icon-size: 16px;
        color: var(--error-color, #db4437);
        margin-left: 4px;
        vertical-align: -2px;
      }
      .planned {
        display: inline-flex;
        align-items: center;
        gap: 3px;
      }
      .planned ha-icon {
        --mdc-icon-size: 13px;
      }
      .cur {
        font-size: 18px;
        font-weight: 500;
      }
      .tgt {
        font-size: 12px;
      }
      .controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 0 0 10px 48px;
        padding: 10px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .seg {
        display: flex;
        gap: 2px;
        padding: 3px;
        border-radius: 11px;
        background: var(--card-background-color, #fff);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .seg button {
        flex: 1 0 auto;
        min-height: 32px;
        padding: 0 10px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        color: var(--bt-muted);
        white-space: nowrap;
      }
      .seg button[aria-selected="true"] {
        background: var(--bt-surface);
        color: var(--primary-text-color);
      }
      .seg.accent button[aria-selected="true"] {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .details {
        align-self: flex-end;
        min-height: 30px;
        font-size: 13px;
      }
    `];S("bestthermostat-card",X);S("bestthermostat-overview-card",Q);var Le=window;Le.customCards=Le.customCards||[];var rt=(document.documentElement.lang||navigator.language||"").startsWith("de"),di=[{type:"bestthermostat-card",name:"Best Thermostat",description:rt?"Raumthermostat mit Zeitpl\xE4nen und Wocheneditor":"Room thermostat with schedules and weekly editor",preview:!0,documentationURL:"https://github.com/zitroaen/bestthermostat"},{type:"bestthermostat-overview-card",name:rt?"Best Thermostat \xDCbersicht":"Best Thermostat Overview",description:rt?"Alle R\xE4ume, globaler Override und Variablen":"All rooms, global override and variables",preview:!0}];for(let a of di)Le.customCards.some(n=>n?.type===a.type)||Le.customCards.push(a);console.info(`%c BEST-THERMOSTAT %c ${J} `,"background:#ff8100;color:#fff","");
