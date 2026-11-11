var re=globalThis,ae=re.ShadowRoot&&(re.ShadyCSS===void 0||re.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),Oe=new WeakMap,B=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(ae&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=Oe.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&Oe.set(e,i))}return i}toString(){return this.cssText}},He=n=>new B(typeof n=="string"?n:n+"",void 0,ge),$=(n,...i)=>{let e=n.length===1?n[0]:i.reduce((t,s,r)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new B(e,n,ge)},Le=(n,i)=>{if(ae)n.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),s=re.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,n.appendChild(t)}},be=ae?n=>n:n=>n instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return He(e)})(n):n;var{is:ot,defineProperty:dt,getOwnPropertyDescriptor:lt,getOwnPropertyNames:ct,getOwnPropertySymbols:pt,getPrototypeOf:ht}=Object,oe=globalThis,Ve=oe.trustedTypes,ut=Ve?Ve.emptyScript:"",mt=oe.reactiveElementPolyfillSupport,K=(n,i)=>n,ve={toAttribute(n,i){switch(i){case Boolean:n=n?ut:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,i){let e=n;switch(i){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},We=(n,i)=>!ot(n,i),Ue={attribute:!0,type:String,converter:ve,reflect:!1,useDefault:!1,hasChanged:We};Symbol.metadata??=Symbol("metadata"),oe.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=Ue){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(i,t,e);s!==void 0&&dt(this.prototype,i,s)}}static getPropertyDescriptor(i,e,t){let{get:s,set:r}=lt(this.prototype,i)??{get(){return this[e]},set(a){this[e]=a}};return{get:s,set(a){let d=s?.call(this);r?.call(this,a),this.requestUpdate(i,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??Ue}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;let i=ht(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){let e=this.properties,t=[...ct(e),...pt(e)];for(let s of t)this.createProperty(s,e[s])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let s of t)e.unshift(be(s))}else i!==void 0&&e.push(be(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Le(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,t);if(s!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:ve).toAttribute(e,t.type);this._$Em=i,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(i,e){let t=this.constructor,s=t._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let r=t.getPropertyOptions(s),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:ve;this._$Em=s;let d=a.fromAttribute(e,r.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(i,e,t,s=!1,r){if(i!==void 0){let a=this.constructor;if(s===!1&&(r=this[i]),t??=a.getPropertyOptions(i),!((t.hasChanged??We)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(i)&&!this.hasAttribute(a._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:s,wrapped:r},a){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,a??e??this[i]),r!==!0||a!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,r]of t){let{wrapped:a}=r,d=this[s];a!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,r,d)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[K("elementProperties")]=new Map,E[K("finalized")]=new Map,mt?.({ReactiveElement:E}),(oe.reactiveElementVersions??=[]).push("2.1.2");var Ae=globalThis,Ie=n=>n,de=Ae.trustedTypes,je=de?de.createPolicy("lit-html",{createHTML:n=>n}):void 0,qe="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Je="?"+C,ft=`<${Je}>`,T=document,Z=()=>T.createComment(""),G=n=>n===null||typeof n!="object"&&typeof n!="function",Ee=Array.isArray,_t=n=>Ee(n)||typeof n?.[Symbol.iterator]=="function",xe=`[ 	
\f\r]`,F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Be=/-->/g,Ke=/>/g,M=RegExp(`>|${xe}(?:([^\\s"'>=/]+)(${xe}*=${xe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fe=/'/g,Ze=/"/g,Ye=/^(?:script|style|textarea|title)$/i,De=n=>(i,...e)=>({_$litType$:n,strings:i,values:e}),o=De(1),Mt=De(2),Pt=De(3),N=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),Ge=new WeakMap,P=T.createTreeWalker(T,129);function Xe(n,i){if(!Ee(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return je!==void 0?je.createHTML(i):i}var gt=(n,i)=>{let e=n.length-1,t=[],s,r=i===2?"<svg>":i===3?"<math>":"",a=F;for(let d=0;d<e;d++){let c=n[d],h,p,u=-1,g=0;for(;g<c.length&&(a.lastIndex=g,p=a.exec(c),p!==null);)g=a.lastIndex,a===F?p[1]==="!--"?a=Be:p[1]!==void 0?a=Ke:p[2]!==void 0?(Ye.test(p[2])&&(s=RegExp("</"+p[2],"g")),a=M):p[3]!==void 0&&(a=M):a===M?p[0]===">"?(a=s??F,u=-1):p[1]===void 0?u=-2:(u=a.lastIndex-p[2].length,h=p[1],a=p[3]===void 0?M:p[3]==='"'?Ze:Fe):a===Ze||a===Fe?a=M:a===Be||a===Ke?a=F:(a=M,s=void 0);let m=a===M&&n[d+1].startsWith("/>")?" ":"";r+=a===F?c+ft:u>=0?(t.push(h),c.slice(0,u)+qe+c.slice(u)+C+m):c+C+(u===-2?d:m)}return[Xe(n,r+(n[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},q=class n{constructor({strings:i,_$litType$:e},t){let s;this.parts=[];let r=0,a=0,d=i.length-1,c=this.parts,[h,p]=gt(i,e);if(this.el=n.createElement(h,t),P.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=P.nextNode())!==null&&c.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(qe)){let g=p[a++],m=s.getAttribute(u).split(C),y=/([.?@])?(.*)/.exec(g);c.push({type:1,index:r,name:y[2],strings:m,ctor:y[1]==="."?we:y[1]==="?"?$e:y[1]==="@"?ke:V}),s.removeAttribute(u)}else u.startsWith(C)&&(c.push({type:6,index:r}),s.removeAttribute(u));if(Ye.test(s.tagName)){let u=s.textContent.split(C),g=u.length-1;if(g>0){s.textContent=de?de.emptyScript:"";for(let m=0;m<g;m++)s.append(u[m],Z()),P.nextNode(),c.push({type:2,index:++r});s.append(u[g],Z())}}}else if(s.nodeType===8)if(s.data===Je)c.push({type:2,index:r});else{let u=-1;for(;(u=s.data.indexOf(C,u+1))!==-1;)c.push({type:7,index:r}),u+=C.length-1}r++}}static createElement(i,e){let t=T.createElement("template");return t.innerHTML=i,t}};function L(n,i,e=n,t){if(i===N)return i;let s=t!==void 0?e._$Co?.[t]:e._$Cl,r=G(i)?void 0:i._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(i=L(n,s._$AS(n,i.values),s,t)),i}var ye=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,s=(i?.creationScope??T).importNode(e,!0);P.currentNode=s;let r=P.nextNode(),a=0,d=0,c=t[0];for(;c!==void 0;){if(a===c.index){let h;c.type===2?h=new J(r,r.nextSibling,this,i):c.type===1?h=new c.ctor(r,c.name,c.strings,this,i):c.type===6&&(h=new Se(r,this,i)),this._$AV.push(h),c=t[++d]}a!==c?.index&&(r=P.nextNode(),a++)}return P.currentNode=T,s}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},J=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,s){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=L(this,i,e),G(i)?i===l||i==null||i===""?(this._$AH!==l&&this._$AR(),this._$AH=l):i!==this._$AH&&i!==N&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):_t(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==l&&G(this._$AH)?this._$AA.nextSibling.data=i:this.T(T.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,s=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=q.createElement(Xe(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new ye(s,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(i){let e=Ge.get(i.strings);return e===void 0&&Ge.set(i.strings,e=new q(i)),e}k(i){Ee(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let r of i)s===e.length?e.push(t=new n(this.O(Z()),this.O(Z()),this,this.options)):t=e[s],t._$AI(r),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=Ie(i).nextSibling;Ie(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},V=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,s,r){this.type=1,this._$AH=l,this._$AN=void 0,this.element=i,this.name=e,this._$AM=s,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=l}_$AI(i,e=this,t,s){let r=this.strings,a=!1;if(r===void 0)i=L(this,i,e,0),a=!G(i)||i!==this._$AH&&i!==N,a&&(this._$AH=i);else{let d=i,c,h;for(i=r[0],c=0;c<r.length-1;c++)h=L(this,d[t+c],e,c),h===N&&(h=this._$AH[c]),a||=!G(h)||h!==this._$AH[c],h===l?i=l:i!==l&&(i+=(h??"")+r[c+1]),this._$AH[c]=h}a&&!s&&this.j(i)}j(i){i===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},we=class extends V{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===l?void 0:i}},$e=class extends V{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==l)}},ke=class extends V{constructor(i,e,t,s,r){super(i,e,t,s,r),this.type=5}_$AI(i,e=this){if((i=L(this,i,e,0)??l)===N)return;let t=this._$AH,s=i===l&&t!==l||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,r=i!==l&&(t===l||s);s&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Se=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){L(this,i)}};var bt=Ae.litHtmlPolyfillSupport;bt?.(q,J),(Ae.litHtmlVersions??=[]).push("3.3.3");var Qe=(n,i,e)=>{let t=e?.renderBefore??i,s=t._$litPart$;if(s===void 0){let r=e?.renderBefore??null;t._$litPart$=s=new J(i.insertBefore(Z(),r),r,void 0,e??{})}return s._$AI(n),s};var Ce=globalThis,v=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=Qe(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return N}};v._$litElement$=!0,v.finalized=!0,Ce.litElementHydrateSupport?.({LitElement:v});var vt=Ce.litElementPolyfillSupport;vt?.({LitElement:v});(Ce.litElementVersions??=[]).push("4.2.2");var tt="bestthermostat",_=["mon","tue","wed","thu","fri","sat","sun"],le,U,et,ce=new Set;function Y(n,i){return ce.add(i),le&&i(le),(!U||et!==n.connection)&&(et=n.connection,U=n.connection.subscribeMessage(e=>{le=e,ce.forEach(t=>t(e))},{type:`${tt}/subscribe`}).catch(e=>(console.error("Best Thermostat: subscription failed",e),U=void 0,()=>{}))),()=>{if(ce.delete(i),ce.size===0&&U){let e=U;U=void 0,le=void 0,e.then(t=>t())}}}function D(n,i,e={}){return n.callWS({type:`${tt}/${i}`,...e})}function it(n,i){if(!(!n||!i))return n.rooms.find(e=>e.climate_entity_id===i||e.entry_id===i)}var z=$`
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
`;var k=15,x=1440;function R(n){let[i,e]=n.split(":").map(Number);return i*60+e}function S(n){let i=Math.floor(n/60),e=n%60;return`${String(i).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function ze(n){return Math.round(n/k)*k}function H(n,i){return n.variable!==void 0?i.find(e=>e.id===n.variable)?.value:n.temperature}function X(n,i){if(n.variable!==void 0){let e=i.find(t=>t.id===n.variable);return e?e.name:n.variable}return f(n.temperature)}function f(n,i=!0){if(n==null||Number.isNaN(n))return"\u2013";let e=(Math.round(n*2)/2).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1});return i?`${e} \xB0C`:e}var O=[[12,[90,140,220]],[16,[120,180,235]],[18,[150,210,200]],[19.5,[250,215,110]],[21,[255,175,85]],[23,[250,125,70]],[26,[225,75,60]]];function A(n){if(n===void 0)return"var(--disabled-color, #9e9e9e)";if(n<=O[0][0])return`rgb(${O[0][1].join(",")})`;for(let i=1;i<O.length;i++){let[e,t]=O[i];if(n<=e){let[s,r]=O[i-1],a=(n-s)/(e-s);return`rgb(${r.map((d,c)=>Math.round(d+(t[c]-d)*a)).join(",")})`}}return`rgb(${O[O.length-1][1].join(",")})`}function Q(n){return JSON.parse(JSON.stringify(n))}function Re(n,i){return JSON.stringify(n)===JSON.stringify(i)}function W(n){return n.map((i,e)=>({start:R(i.start),end:e+1<n.length?R(n[e+1].start):x,slot:i}))}function pe(){let n=new Date;return n.getHours()*60+n.getMinutes()}function he(){return _[(new Date().getDay()+6)%7]}function w(n,i){if(!n)return"";let e=new Date(n),t=i.locale?.language||i.language,s=new Date,r=e.toLocaleTimeString(t,{hour:"2-digit",minute:"2-digit"});return e.toDateString()===s.toDateString()?r:`${e.toLocaleDateString(t,{weekday:"short"})} ${r}`}var st={de:{auto:"Auto",heat:"Manuell",off:"Aus",schedule:"Zeitplan",schedules:"Zeitpl\xE4ne",edit:"Wochenplan bearbeiten",schedule_paused:"pausiert",period:"Zeitraum",period_until:"bis",period_open:"bis auf Weiteres",period_planned:"Geplant",period_from:"ab",period_end:"Beenden",period_delete:"L\xF6schen",period_plan:"Zeitraum planen",period_edit:"Zeitraum bearbeiten",period_less:"weniger anzeigen",period_what:"Was soll gelten?",period_start:"Beginn",period_end_label:"Ende",period_now:"Jetzt",period_at:"Zeitpunkt",period_title:"Titel",period_title_hint:"z. B. Besuch von Oma",period_invalid:"Bitte g\xFCltigen Beginn und ein Ende in der Zukunft nach dem Beginn w\xE4hlen.",period_more:"weitere geplant",optional:"optional",prio_title:"Priorit\xE4ten",prio_short:"Priorit\xE4t",week_plan:"Wochenplan",battery:"Batterie",battery_low:"schwach",battery_ok:"OK",more:"Mehr",not_active:"Dieser Zeitplan ist gerade nicht aktiv.",unsaved_short:"Ungespeicherte \xC4nderungen",manage_variables:"Variablen verwalten",delete_schedule:"Zeitplan l\xF6schen",edit_short:"Bearbeiten",from:"Von",to:"Bis",days_long:["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],weekend:"Wochenende",copy_day_short:"Tag kopieren",add:"Hinzuf\xFCgen",cancel:"Abbrechen",ok:"OK",swipe_hint:"Zum \xC4ndern waagerecht wischen",today:"Heute",period_plural:"Zeitr\xE4ume",period_planned_n:"geplant",heating_summary:"heizen",of:"von",rooms_word:"R\xE4umen",other_floor:"Weitere",open_details:"Details",prio_hand:"\xC4nderung von Hand",prio_room:"Raum",prio_inactive:"aus",prio_none:"keine",until:"bis",next:"N\xE4chster Wechsel",src_override:"Globaler Override",src_off:"Frostschutz",src_manual:"Manuell",src_hand:"Ge\xE4ndert",src_schedule:"Zeitplan",heating:"Heizt",idle:"Bereit",save:"Speichern",discard:"Verwerfen",close:"Schlie\xDFen",new_schedule:"Neuer Zeitplan",rename:"Umbenennen",duplicate:"Duplizieren",delete:"L\xF6schen",activate:"Aktivieren",active:"Aktiv",split:"Teilen",copy_day:"Tag kopieren auf \u2026",copy:"Kopieren",workdays:"Mo\u2013Fr",all_days:"Alle",fixed:"Fest",variables:"Variablen",add_variable:"Variable hinzuf\xFCgen",name:"Name",value:"Wert",unsaved:"Ungespeicherte \xC4nderungen verwerfen?",confirm_delete:"Zeitplan wirklich l\xF6schen?",tap_hint:"Abschnitt antippen zum Bearbeiten, Grenzen ziehen zum Verschieben.",days:["Mo","Di","Mi","Do","Fr","Sa","So"],not_found:"Raum nicht gefunden. Bitte in der Kartenkonfiguration einen Best-Thermostat-Raum w\xE4hlen.",loading:"Lade \u2026",override:"Globaler Override",override_also:"Gilt auch f\xFCr",override_not_applied:"Override gilt hier nicht",rooms:"R\xE4ume",variables_note:"Variablen gelten f\xFCr alle R\xE4ume und werden sofort gespeichert."},en:{auto:"Auto",heat:"Manual",off:"Off",schedule:"Schedule",schedules:"Schedules",edit:"Edit weekly plan",schedule_paused:"paused",period:"Period",period_until:"until",period_open:"until cancelled",period_planned:"Planned",period_from:"from",period_end:"End",period_delete:"Delete",period_plan:"Plan period",period_edit:"Edit period",period_less:"show less",period_what:"What should apply?",period_start:"Start",period_end_label:"End",period_now:"Now",period_at:"At",period_title:"Title",period_title_hint:"e.g. Grandma visiting",period_invalid:"Please choose a valid start and an end in the future after the start.",period_more:"more planned",optional:"optional",prio_title:"Priorities",prio_short:"Priority",week_plan:"Weekly plan",battery:"Battery",battery_low:"low",battery_ok:"OK",more:"More",not_active:"This schedule is currently not active.",unsaved_short:"Unsaved changes",manage_variables:"Manage variables",delete_schedule:"Delete schedule",edit_short:"Edit",from:"From",to:"To",days_long:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],weekend:"Weekend",copy_day_short:"Copy day",add:"Add",cancel:"Cancel",ok:"OK",swipe_hint:"Swipe horizontally to change",today:"Today",period_plural:"Periods",period_planned_n:"planned",heating_summary:"heating",of:"of",rooms_word:"rooms",other_floor:"Other",open_details:"Details",prio_hand:"Hand change",prio_room:"Room",prio_inactive:"off",prio_none:"none",until:"until",next:"Next change",src_override:"Global override",src_off:"Frost protection",src_manual:"Manual",src_hand:"Changed",src_schedule:"Schedule",heating:"Heating",idle:"Idle",save:"Save",discard:"Discard",close:"Close",new_schedule:"New schedule",rename:"Rename",duplicate:"Duplicate",delete:"Delete",activate:"Activate",active:"Active",split:"Split",copy_day:"Copy day to \u2026",copy:"Copy",workdays:"Mon\u2013Fri",all_days:"All",fixed:"Fixed",variables:"Variables",add_variable:"Add variable",name:"Name",value:"Value",unsaved:"Discard unsaved changes?",confirm_delete:"Really delete this schedule?",tap_hint:"Tap a block to edit it, drag the borders to move them.",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],not_found:"Room not found. Please select a Best Thermostat room in the card configuration.",loading:"Loading \u2026",override:"Global override",override_also:"Also applies to",override_not_applied:"override not applied here",rooms:"Rooms",variables_note:"Variables apply to all rooms and are saved immediately."}};function b(n){return(n?.locale?.language||n?.language||"en").slice(0,2)==="de"?st.de:st.en}function nt(n,i){return n.schedules.find(e=>e.id===i)?.name??i}function ue(n){return n.override_active?"mdi:home-export-outline":n.period?"mdi:calendar-star":n.mode==="off"?"mdi:radiator-off":n.mode==="heat"||n.target_source==="hand"?"mdi:hand-back-right":"mdi:radiator"}function me(n,i,e){if(n.override_active)return i.src_override;if(n.target_source==="hand"&&n.hand_until)return`${i.src_hand} \xB7 ${i.until} ${w(n.hand_until,e)}`;if(n.period){let s=n.period.end?`${i.period_until} ${w(n.period.end,e)}`:i.period_open;return`${n.period.title} \xB7 ${s}`}if(n.mode==="off")return i.src_off;if(n.mode==="heat")return i.src_manual;let t=nt(n,n.active_schedule);return n.next_change?`${t} \xB7 ${w(n.next_change,e)} \u2192 ${f(n.next_temperature)}`:t}function rt(n,i,e,t){let s=i.override,r=n.override_active?1:n.target_source==="hand"?2:n.period?3:4,a=n.base_mode==="off"?`${e.src_off} \xB7 ${f(n.frost_temperature)}`:n.base_mode==="heat"?`${e.heat} \xB7 ${f(n.base_manual_temperature)}`:`${e.auto} \xB7 ${nt(n,n.base_schedule)}`;return{layers:[{n:1,icon:"mdi:home-export-outline",name:e.override,value:s.active?n.override_active?f(s.value):`${f(s.value)} \xB7 ${e.override_not_applied}`:e.prio_inactive},{n:2,icon:"mdi:hand-back-right",name:e.prio_hand,value:n.target_source==="hand"&&n.hand_until?`${f(n.target_temperature)} \xB7 ${e.until} ${w(n.hand_until,t)}`:e.prio_none},{n:3,icon:"mdi:calendar-star",name:e.period,value:n.period?`${n.period.title} \xB7 ${n.period.end?`${e.period_until} ${w(n.period.end,t)}`:e.period_open}`:e.prio_none},{n:4,icon:"mdi:radiator",name:e.prio_room,value:a}],winner:r}}function ee(n){let i=Date.now();return(n.periods??[]).filter(e=>new Date(e.start).getTime()>i).sort((e,t)=>new Date(e.start).getTime()-new Date(t.start).getTime())}function fe(n){let i=n.batteries??[];if(!i.length)return;let e=i.filter(r=>r.level!=null),t=i.some(r=>r.low);return{level:e.length?Math.min(...e.map(r=>r.level)):null,low:t}}function Me(n,i){return n==null?i?"mdi:battery-alert-variant-outline":"mdi:battery":n<=10?"mdi:battery-alert-variant-outline":n>=95?"mdi:battery":`mdi:battery-${Math.max(10,Math.floor(n/10)*10)}`}var te=class extends v{constructor(){super(...arguments);this._vars=!1;this._menu=!1;this._busy=!1;this._newVarName="";this._newVarValue=20;this._nameValue="";this._onKey=e=>{e.key==="Escape"&&this._close()}}get _t(){return b(this.hass)}get _server(){return this.room?.schedules.find(e=>e.id===this._sid)?.week}get _dirty(){return!!this._draft&&!!this._server&&!Re(this._draft,this._server)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey),document.documentElement.style.overflow="hidden"}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey),document.documentElement.style.overflow=""}willUpdate(e){this.room&&(this._sid||(this._sid=this.room.active_schedule),(e.has("room")||!this._draft)&&this._server&&(!this._draft||!this._dirtyAgainst(e))&&(this._draft=Q(this._server)))}_dirtyAgainst(e){let s=e.get("room")?.schedules.find(r=>r.id===this._sid)?.week;return!!s&&!!this._draft&&!Re(this._draft,s)}_close(){this._dirty&&!confirm(this._t.unsaved)||this.dispatchEvent(new CustomEvent("close"))}async _call(e,t){if(this.hass){this._busy=!0,this._error=void 0;try{return await D(this.hass,e,t)}catch(s){this._error=s?.message??String(s);return}finally{this._busy=!1}}}_selectSchedule(e){e!==this._sid&&(this._dirty&&!confirm(this._t.unsaved)||(this._sid=e,this._draft=this._server?Q(this._server):void 0,this._sel=void 0,this._copy=void 0))}_startName(e){let t=this.room?.schedules.find(s=>s.id===this._sid)?.name??"";this._sel=void 0,this._vars=!1,this._error=void 0,this._nameAction=e,this._nameValue=e==="rename"?t:e==="duplicate"?`${t} 2`:""}async _submitName(){let e=this._nameValue.trim();if(!e||!this.room||!this._nameAction)return;let t=this.room.entry_id;if(this._nameAction==="rename")await this._call("schedule/rename",{entry_id:t,schedule_id:this._sid,name:e});else{let s=await this._call("schedule/create",{entry_id:t,name:e,copy_from:this._sid});s&&(this._sid=s.id,this._draft=void 0)}this._error||(this._nameAction=void 0)}async _delete(){if(!this.room||!confirm(this._t.confirm_delete))return;await this._call("schedule/delete",{entry_id:this.room.entry_id,schedule_id:this._sid})&&(this._sid=this.room.active_schedule,this._draft=void 0)}_activate(){this.room&&this._call("schedule/activate",{entry_id:this.room.entry_id,schedule_id:this._sid})}async _save(){if(!this.room||!this._draft)return;await this._call("schedule/save",{entry_id:this.room.entry_id,schedule_id:this._sid,week:this._draft})&&(this._sel=void 0)}_discard(){this._server&&(this._draft=Q(this._server)),this._sel=void 0,this._copy=void 0}_mutate(e){if(!this._draft)return;let t=Q(this._draft);e(t),this._draft=t}_slot(e){return this._draft?.[_[e.day]]?.[e.idx]}_setTemp(e){let t=this._sel;if(!t)return;let s=this.snap?.variables??[];this._mutate(r=>{let a=r[_[t.day]][t.idx],d=H(a,s)??20,c=Math.min(30,Math.max(5,Math.round((d+e)*2)/2));r[_[t.day]][t.idx]={start:a.start,temperature:c}})}_setVariable(e){let t=this._sel;if(!t)return;let s=this.snap?.variables??[];this._mutate(r=>{let a=r[_[t.day]][t.idx];r[_[t.day]][t.idx]=e===void 0?{start:a.start,temperature:H(a,s)??20}:{start:a.start,variable:e}})}_split(){let e=this._sel;if(!e||!this._draft)return;let t=W(this._draft[_[e.day]])[e.idx],s=ze((t.start+t.end)/2);s<=t.start||s>=t.end||(this._mutate(r=>{let a=r[_[e.day]];a.splice(e.idx+1,0,{...a[e.idx],start:S(s)})}),this._sel={day:e.day,idx:e.idx+1})}_remove(){let e=this._sel;!e||!this._draft||this._draft[_[e.day]].length<2||(this._mutate(s=>{let r=s[_[e.day]];e.idx===0?(r.splice(1,1,{...r[1],start:"00:00"}),r.splice(0,1)):r.splice(e.idx,1)}),this._sel={day:e.day,idx:Math.max(0,e.idx-1)})}_toggleCopy(e){let t=new Set(this._copy);t.has(e)?t.delete(e):t.add(e),this._copy=t}_applyCopy(){let e=this._sel;if(!e||!this._copy)return;let t=[...this._copy].filter(s=>s!==e.day);this._mutate(s=>{for(let r of t)s[_[r]]=JSON.parse(JSON.stringify(s[_[e.day]]))}),this._copy=void 0}_dragStart(e,t,s){e.preventDefault(),e.stopPropagation();let r=e.currentTarget;r.setPointerCapture(e.pointerId),this._drag={day:t,idx:s,bar:r.parentElement}}_dragMove(e){let t=this._drag;if(!t||!this._draft)return;let s=t.bar.getBoundingClientRect(),r=(e.clientX-s.left)/s.width*x,a=this._draft[_[t.day]],d=R(a[t.idx-1].start)+k,c=(t.idx+1<a.length?R(a[t.idx+1].start):x)-k,h=S(Math.min(c,Math.max(d,ze(r))));h!==a[t.idx].start&&this._mutate(p=>{p[_[t.day]][t.idx]={...p[_[t.day]][t.idx],start:h}})}_dragEnd(){this._drag=void 0}_varStep(e,t,s){let r=Math.min(30,Math.max(5,Math.round((t+s)*2)/2));this._call("variable/update",{variable_id:e,value:r})}async _addVar(){let e=this._newVarName.trim();if(!e)return;await this._call("variable/create",{name:e,value:this._newVarValue})&&(this._newVarName="",this.requestUpdate())}_deleteVar(e){this._call("variable/delete",{variable_id:e})}_shift(e,t){let s=this._sel;if(!s||!this._draft)return;let r=this._draft[_[s.day]],a=e==="start"?s.idx:s.idx+1;if(a<=0||a>=r.length)return;let d=R(r[a-1].start)+k,c=(a+1<r.length?R(r[a+1].start):x)-k,h=Math.min(c,Math.max(d,R(r[a].start)+t));S(h)!==r[a].start&&this._mutate(p=>{p[_[s.day]][a]={...p[_[s.day]][a],start:S(h)}})}_select(e,t){this._sel={day:e,idx:t},this._copy=void 0,this._menu=!1}render(){if(!this.room||!this._draft)return l;let e=this._t,t=this.room,s=t.schedules.find(d=>d.id===this._sid),r=s?.id===t.active_schedule,a=!!this._sel||this._vars||!!this._nameAction;return o`
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
          ${this._menu?this._renderMenu(t):l}
        </header>

        <div class="content ${a?"sheet-open":""} ${this._dirty?"dirty":""}"
          @click=${()=>this._menu=!1}>
          <div class="seg" role="tablist">
            ${t.schedules.map(d=>o`<button role="tab" aria-selected=${d.id===this._sid}
                @click=${()=>this._selectSchedule(d.id)}>
                ${d.name}${d.id===t.active_schedule?o`<i class="active-dot"></i>`:l}
              </button>`)}
            <button class="plus" aria-label=${e.new_schedule} @click=${()=>this._startName("new")}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>

          ${s&&!r?o`<div class="notice">
                <span>${e.not_active}</span>
                <button class="text-btn" @click=${this._activate}>${e.activate}</button>
              </div>`:l}

          <div class="week">
            <div class="ruler muted">
              <span></span>
              <div>${[0,6,12,18,24].map(d=>o`<span style="left:${d/24*100}%">${d}</span>`)}</div>
            </div>
            ${_.map((d,c)=>this._renderDay(d,c))}
          </div>
          ${this._renderLegend()}
          <div class="muted hint">${e.tap_hint}</div>
          ${this._error?o`<div class="error">${this._error}</div>`:l}
        </div>

        ${this._sel?this._renderSlotSheet(this._sel):l}
        ${this._vars?this._renderVariablesSheet():l}
        ${this._nameAction?this._renderNameSheet():l}

        ${this._dirty&&!a?o`<div class="savebar">
              <span class="grow">${e.unsaved_short}</span>
              <button class="text-btn light" ?disabled=${this._busy} @click=${this._discard}>
                ${e.discard}
              </button>
              <button class="primary-btn" ?disabled=${this._busy} @click=${this._save}>${e.save}</button>
            </div>`:l}
      </div>
    `}_renderMenu(e){let t=this._t,s=this._sid!==e.base_schedule&&e.schedules.length>1,r=(a,d,c,h="",p=!1)=>o`<button class="menu-item ${h}" ?disabled=${p} @click=${()=>{this._menu=!1,c()}}><ha-icon icon=${a}></ha-icon>${d}</button>`;return o`<div class="menu" role="menu">
      ${r("mdi:pencil-outline",t.rename,()=>this._startName("rename"))}
      ${r("mdi:content-copy",t.duplicate,()=>this._startName("duplicate"))}
      ${r("mdi:thermometer-lines",t.manage_variables,()=>{this._sel=void 0,this._vars=!0})}
      <div class="menu-sep"></div>
      ${r("mdi:delete-outline",t.delete_schedule,()=>this._delete(),"danger",!s)}
    </div>`}_renderLegend(){let e=this._t,t=this.snap?.variables??[],s=new Set;for(let a of Object.values(this._draft??{}))for(let d of a)d.variable&&s.add(d.variable);let r=t.filter(a=>s.has(a.id));return o`<div class="legend">
      ${(r.length?r:t).map(a=>o`<span><i class="sw" style="background:${A(a.value)}"></i>${a.name}
          <b>${f(a.value,!1)}°</b></span>`)}
      <button class="text-btn small" @click=${()=>{this._sel=void 0,this._vars=!0}}>${e.edit_short}</button>
    </div>`}_renderDay(e,t){let s=this.snap?.variables??[],r=W(this._draft[e]),a=e===he();return o`<div class="day ${this._sel?.day===t?"active":""}">
      <span class="day-label ${a?"today":""}">${this._t.days[t]}</span>
      <div class="bar" @pointermove=${this._dragMove} @pointerup=${this._dragEnd}
        @pointercancel=${this._dragEnd}>
        ${r.map((d,c)=>{let h=H(d.slot,s),p=(d.end-d.start)/x*100,u=this._sel?.day===t&&this._sel.idx===c;return o`<button class="seg-b ${u?"selected":""} ${d.slot.variable?"var":""}"
            style="left:${d.start/x*100}%;width:${p}%;background:${A(h)}"
            title="${S(d.start)}–${S(d.end%x)} · ${X(d.slot,s)}"
            @click=${g=>{g.stopPropagation(),this._select(t,c)}}>
            ${p>8?o`<span>${d.slot.variable?X(d.slot,s):`${f(h,!1)}\xB0`}</span>`:l}
          </button>`})}
        <div class="hours"></div>
        ${a?o`<div class="now" style="left:${pe()/x*100}%"></div>`:l}
        ${r.slice(1).map((d,c)=>{let h=this._drag?.day===t&&this._drag.idx===c+1;return o`<div class="handle ${h?"dragging":""}"
            style="left:${d.start/x*100}%"
            @pointerdown=${p=>this._dragStart(p,t,c+1)}>
            <span></span>
            ${h?o`<div class="time-tip">${S(d.start)}</div>`:l}
          </div>`})}
      </div>
    </div>`}_sheet(e,t,s){return o`<div class="scrim" @click=${s}></div>
      <div class="sheet" role="dialog">
        <div class="grab"></div>
        <div class="sheet-head">
          <span class="sheet-title">${e}</span>
          <button class="icon-btn small" aria-label=${this._t.close} @click=${s}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${t}
      </div>`}_renderSlotSheet(e){let t=this._t,s=this.snap?.variables??[],r=this._slot(e);if(!r)return l;let a=this._draft[_[e.day]],d=W(a)[e.idx],c=H(r,s),h=(u,g,m,y)=>o`<div class="time ${y?"":"fixed"}">
        <div><small>${u}</small><b>${g}</b></div>
        ${y?o`<div class="st">
              <button class="round tiny" @click=${()=>this._shift(m,-k)}>−</button>
              <button class="round tiny" @click=${()=>this._shift(m,k)}>+</button>
            </div>`:l}
      </div>`,p=o`
      <div class="times">
        ${h(t.from,S(d.start),"start",e.idx>0)}
        ${h(t.to,d.end===x?"24:00":S(d.end),"end",e.idx+1<a.length)}
      </div>
      <div class="chips">
        <button class="chip" aria-pressed=${r.variable===void 0}
          @click=${()=>this._setVariable(void 0)}>${t.fixed}</button>
        ${s.map(u=>o`<button class="chip" aria-pressed=${r.variable===u.id}
            @click=${()=>this._setVariable(u.id)}>
            <i class="sw" style="background:${A(u.value)}"></i>${u.name}
          </button>`)}
      </div>
      <div class="temp-row">
        <button class="round" @click=${()=>this._setTemp(-.5)}>−</button>
        <span class="temp-val">${f(c)}</span>
        <button class="round" @click=${()=>this._setTemp(.5)}>+</button>
      </div>
      ${this._copy?o`<div class="copy">
            <div class="muted small-text">${t.copy_day}</div>
            <div class="chips">
              ${t.days.map((u,g)=>o`<button class="chip" ?disabled=${g===e.day}
                  aria-pressed=${this._copy.has(g)} @click=${()=>this._toggleCopy(g)}>${u}</button>`)}
            </div>
            <div class="chips">
              <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4])}>${t.workdays}</button>
              <button class="chip" @click=${()=>this._copy=new Set([5,6])}>${t.weekend}</button>
              <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4,5,6])}>${t.all_days}</button>
              <span class="grow"></span>
              <button class="primary-btn" ?disabled=${![...this._copy].some(u=>u!==e.day)}
                @click=${this._applyCopy}>${t.copy}</button>
            </div>
          </div>`:l}
      <div class="acts">
        <button ?disabled=${d.end-d.start<2*k} @click=${this._split}>
          <ha-icon icon="mdi:call-split"></ha-icon>${t.split}
        </button>
        <button aria-pressed=${!!this._copy} @click=${()=>this._copy=this._copy?void 0:new Set}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t.copy_day_short}
        </button>
        <button ?disabled=${a.length<2} @click=${this._remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
        </button>
      </div>`;return this._sheet(t.days_long[e.day],p,()=>{this._sel=void 0,this._copy=void 0})}_renderVariablesSheet(){let e=this._t,t=this.snap?.variables??[],s=o`
      <div class="var-list">
        ${t.map(r=>o`<div class="var-row">
            <i class="sw" style="background:${A(r.value)}"></i>
            <span class="grow">${r.name}</span>
            <button class="round tiny" @click=${()=>this._varStep(r.id,r.value,-.5)}>−</button>
            <span class="var-val">${f(r.value)}</span>
            <button class="round tiny" @click=${()=>this._varStep(r.id,r.value,.5)}>+</button>
            <button class="icon-btn small" aria-label=${e.delete} @click=${()=>this._deleteVar(r.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>`)}
      </div>
      <div class="var-add">
        <input type="text" placeholder=${e.name} .value=${this._newVarName}
          @input=${r=>this._newVarName=r.target.value} />
        <input type="number" class="num" min="5" max="30" step="0.5" .value=${String(this._newVarValue)}
          @input=${r=>this._newVarValue=Number(r.target.value)} />
        <button class="primary-btn" @click=${this._addVar}>${e.add}</button>
      </div>
      <div class="muted small-text">${e.variables_note}</div>
      ${this._error?o`<div class="error">${this._error}</div>`:l}`;return this._sheet(e.variables,s,()=>this._vars=!1)}_renderNameSheet(){let e=this._t,t=this._nameAction==="rename"?e.rename:this._nameAction==="duplicate"?e.duplicate:e.new_schedule,s=o`
      <input type="text" .value=${this._nameValue} placeholder=${e.name} aria-label=${t}
        @input=${r=>this._nameValue=r.target.value}
        @keydown=${r=>r.key==="Enter"&&this._submitName()} />
      ${this._error?o`<div class="error">${this._error}</div>`:l}
      <div class="sheet-actions">
        <button class="text-btn" @click=${()=>this._nameAction=void 0}>${e.cancel}</button>
        <button class="primary-btn" ?disabled=${!this._nameValue.trim()||this._busy} @click=${this._submitName}>
          ${e.ok}
        </button>
      </div>`;return this._sheet(t,s,()=>this._nameAction=void 0)}};te.properties={hass:{attribute:!1},snap:{attribute:!1},room:{attribute:!1},_sid:{state:!0},_draft:{state:!0},_sel:{state:!0},_copy:{state:!0},_vars:{state:!0},_error:{state:!0},_nameAction:{state:!0},_busy:{state:!0},_drag:{state:!0},_menu:{state:!0}},te.styles=[z,$`
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
        width: 3px;
        height: 100%;
        border-radius: 2px;
        background: var(--primary-text-color);
        opacity: 0.35;
      }
      .handle:hover span,
      .handle.dragging span {
        opacity: 1;
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
    `];customElements.define("bt-week-editor",te);function ie(n){let i=e=>String(e).padStart(2,"0");return`${n.getFullYear()}-${i(n.getMonth()+1)}-${i(n.getDate())}T${i(n.getHours())}:${i(n.getMinutes())}`}function at(n){let i=new Date;return i.setMinutes(0,0,0),i.setHours(i.getHours()+n),i}var se=class extends v{constructor(){super(...arguments);this._initialized=!1;this._temp=21;this._startNow=!1;this._start=ie(at(1));this._openEnd=!1;this._end=ie(at(25));this._title="";this._busy=!1;this._onKey=e=>{e.key==="Escape"&&this._close()}}get _t(){return b(this.hass)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey)}willUpdate(){if(!this._initialized&&this.room&&this.period){this._initialized=!0;let e=this.period;e.schedule?this._what={kind:"schedule",id:e.schedule}:this._what={kind:"mode",mode:e.mode??"off"},e.temperature!=null&&(this._temp=e.temperature),this._startNow=!1,this._start=ie(new Date(e.start)),this._openEnd=!e.end,e.end&&(this._end=ie(new Date(e.end))),this._title=e.summary??""}if(!this._what&&this.room){let e=this.room.schedules.find(t=>t.id!==this.room.base_schedule);this._what=e?{kind:"schedule",id:e.id}:{kind:"mode",mode:"off"},this._temp=Math.round((this.room.target_temperature??21)*2)/2}}_close(){this.dispatchEvent(new CustomEvent("close"))}get _valid(){let e=this._t,t=this._startNow?new Date:new Date(this._start);if(!this._startNow&&Number.isNaN(t.getTime()))return e.period_invalid;if(!this._openEnd){let s=new Date(this._end);if(Number.isNaN(s.getTime())||s<=t||s<=new Date)return e.period_invalid}}async _save(){if(!this.hass||!this.room||!this._what)return;let e={entry_id:this.room.entry_id};this._what.kind==="schedule"?e.schedule_id=this._what.id:(e.mode=this._what.mode,this._what.mode==="heat"&&(e.temperature=this._temp));let t=!!this.period;this._startNow?t&&(e.start=ie(new Date)):e.start=this._start,this._openEnd?t&&(e.open_end=!0):e.end=this._end,t?(e.period_id=this.period.id,e.summary=this._title.trim()):this._title.trim()&&(e.summary=this._title.trim()),this._busy=!0,this._error=void 0;try{await D(this.hass,t?"period/update":"period/add",e),this._close()}catch(s){this._error=s?.message??String(s)}finally{this._busy=!1}}async _delete(){if(!(!this.hass||!this.room||!this.period)){this._busy=!0;try{await D(this.hass,"period/cancel",{entry_id:this.room.entry_id,period_id:this.period.id}),this._close()}catch(e){this._error=e?.message??String(e)}finally{this._busy=!1}}}_isWhat(e){let t=this._what;return!t||t.kind!==e.kind?!1:t.kind==="schedule"?t.id===e.id:t.mode===e.mode}render(){if(!this.room)return l;let e=this._t,t=this.room,s=this._valid,r=[["heat",e.heat],["off",e.off]];return o`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          <div class="h-title">
            <div class="h-name">${this.period?e.period_edit:e.period_plan}</div>
            <div class="muted h-sub">${t.name}</div>
          </div>
          <button class="round small" @click=${this._close} aria-label=${e.close}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <div class="content">
          <section>
            <div class="label">${e.period_what}</div>
            <div class="chips">
              ${t.schedules.map(a=>o`<button class="chip" aria-pressed=${this._isWhat({kind:"schedule",id:a.id})}
                  @click=${()=>this._what={kind:"schedule",id:a.id}}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${a.name}
                </button>`)}
              ${r.map(([a,d])=>o`<button class="chip" aria-pressed=${this._isWhat({kind:"mode",mode:a})}
                  @click=${()=>this._what={kind:"mode",mode:a}}>
                  <ha-icon icon=${a==="off"?"mdi:snowflake":"mdi:hand-back-right"}></ha-icon>${d}
                </button>`)}
            </div>
            ${this._what?.kind==="mode"&&this._what.mode==="heat"?o`<div class="temp-row">
                  <button class="round" @click=${()=>this._temp=Math.max(5,this._temp-.5)}>−</button>
                  <span class="temp-val">${f(this._temp)}</span>
                  <button class="round" @click=${()=>this._temp=Math.min(30,this._temp+.5)}>+</button>
                </div>`:l}
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
            ${this._startNow?l:o`<input type="datetime-local" step="900" .value=${this._start}
                  @input=${a=>this._start=a.target.value} />`}
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
            ${this._openEnd?l:o`<input type="datetime-local" step="900" .value=${this._end}
                  @input=${a=>this._end=a.target.value} />`}
          </section>

          <section>
            <div class="label">${e.period_title} <span class="muted">(${e.optional})</span></div>
            <input type="text" .value=${this._title} placeholder=${e.period_title_hint}
              @input=${a=>this._title=a.target.value} />
          </section>
          ${this._error?o`<div class="error">${this._error}</div>`:l}
          ${s&&!this._error?o`<div class="muted small">${s}</div>`:l}
        </div>
        <footer>
          ${this.period?o`<button class="text-btn danger" ?disabled=${this._busy} @click=${this._delete}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>${this.period&&this.room?.period?.id===this.period.id?e.period_end:e.period_delete}
              </button>`:l}
          <span class="spacer"></span>
          <button class="text-btn" @click=${this._close}>${e.close}</button>
          <button class="primary-btn" ?disabled=${!!s||this._busy} @click=${this._save}>
            ${this.period?e.save:e.period_plan}
          </button>
        </footer>
      </div>
    `}};se.properties={hass:{attribute:!1},room:{attribute:!1},period:{attribute:!1},_what:{state:!0},_temp:{state:!0},_startNow:{state:!0},_start:{state:!0},_openEnd:{state:!0},_end:{state:!0},_title:{state:!0},_error:{state:!0},_busy:{state:!0}},se.styles=[z,$`
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
    `];customElements.define("bt-period-dialog",se);var xt=24,I=class extends v{constructor(){super(...arguments);this._editing=!1;this._planning=!1;this._allPeriods=!1}static getConfigElement(){return document.createElement("bestthermostat-card-editor")}static getStubConfig(e){return{entity:Object.values(e.states).find(s=>s.entity_id.startsWith("climate.")&&s.attributes.room_id)?.entity_id??""}}setConfig(e){this._config={show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0,show_battery:!0,show_header:!0,...e}}set config(e){this.setConfig(e)}getCardSize(){return this._config?.compact?3:6}getGridOptions(){return this._config?.compact?{columns:6,rows:4,min_columns:4,min_rows:3}:{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),this._tick=window.setInterval(()=>this.requestUpdate(),6e4),this.hass&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,window.clearInterval(this._tick),this._editor?.remove(),this._editor=void 0,this._editing=!1,this._planner?.remove(),this._planner=void 0,this._planning=!1}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&this._subscribe()}updated(){let e=this._room;this._editing&&e&&this.hass?(this._editor||(this._editor=document.createElement("bt-week-editor"),this._editor.addEventListener("close",()=>this._editing=!1),document.body.appendChild(this._editor)),this._editor.hass=this.hass,this._editor.snap=this._snap,this._editor.room=e):this._editor&&(this._editor.remove(),this._editor=void 0),this._planning&&e&&this.hass?(this._planner||(this._planner=document.createElement("bt-period-dialog"),this._planner.addEventListener("close",()=>{this._planning=!1,this._editPeriod=void 0}),document.body.appendChild(this._planner)),this._planner.hass=this.hass,this._planner.room=e,this._planner.period=this._editPeriod):this._planner&&(this._planner.remove(),this._planner=void 0)}_subscribe(){this.hass&&(this._unsub=Y(this.hass,e=>this._snap=e))}get _room(){return it(this._snap,this._config?.entity)}async _call(e,t){if(this.hass)try{this._error=void 0,await D(this.hass,e,t)}catch(s){this._error=s?.message??String(s)}}_clampTemp(e,t){return Math.min(e.max_temp,Math.max(e.min_temp,Math.round(t*2)/2))}_swipeStart(e,t){e.pointerType==="mouse"&&e.button!==0||(this._swipe={x:e.clientX,start:this._pending??t.target_temperature??20,moved:!1,id:e.pointerId})}_swipeMove(e,t){let s=this._swipe;if(!s||s.id!==e.pointerId)return;let r=e.clientX-s.x;if(!s.moved){if(Math.abs(r)<10)return;s.moved=!0,e.currentTarget.setPointerCapture(e.pointerId),this.requestUpdate()}let a=this._clampTemp(t,s.start+Math.round(r/xt)*.5);a!==this._pending&&(this._pending=a,window.clearTimeout(this._debounce),navigator.vibrate?.(5))}_swipeEnd(e,t){let s=this._swipe;this._swipe=void 0,!(!s||!s.moved||s.id!==e.pointerId)&&(this._pending!==void 0&&this._pending!==t.target_temperature?this._step(t,0):this._pending=void 0)}_step(e,t){let s=this._pending??e.target_temperature??20,r=this._clampTemp(e,s+t);this._pending=r,window.clearTimeout(this._debounce),this._debounce=window.setTimeout(async()=>{await this._call("room/temperature",{entry_id:e.entry_id,temperature:r}),this._pending=void 0},700)}_mode(e,t){this._call("room/mode",{entry_id:e.entry_id,mode:t})}_schedule(e,t){this._call("schedule/activate",{entry_id:e.entry_id,schedule_id:t})}_moreInfo(e){e.climate_entity_id&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.climate_entity_id},bubbles:!0,composed:!0}))}_openPeriod(e){this._editPeriod=e,this._planning=!0}_toggle(e){this._section=this._section===e?void 0:e}render(){if(!this._config||!this.hass)return l;let e=b(this.hass);if(!this._snap)return o`<ha-card><div class="msg">${e.loading}</div></ha-card>`;let t=this._room;if(!t)return o`<ha-card><div class="msg">${e.not_found}</div></ha-card>`;let s=this._config,r=t.hvac_action==="heating",a=this._pending??t.target_temperature,d=s.name||t.name,c=[s.show_floor===!1?"":t.floor?.name,me(t,e,this.hass),r?e.heating:""].filter(Boolean).join(" \xB7 ");return o`
      <ha-card class="${s.compact?"compact":""} ${s.embedded?"embedded":""}">
        ${s.show_header===!1?l:o`<div class="head">
          <button class="icon ${r?"heating":""}" @click=${()=>this._moreInfo(t)}
            aria-label=${d}>
            <ha-icon icon=${ue(t)}></ha-icon>
          </button>
          <div class="title">
            <div class="name">${d}</div>
            <div class="sub muted">${c}</div>
          </div>
          ${s.show_editor&&!(s.show_timeline&&!s.compact)?this._pencil():l}
        </div>`}

        <div class="hero">
          <div class="current">
            <span class="big">${f(t.current_temperature,!1)}</span><span class="unit">°C</span>
          </div>
          <div class="ctl">
            <button class="round" @click=${()=>this._step(t,-.5)} aria-label="-0.5">−</button>
            <div class="target ${this._swipe?.moved?"swiping":""}" title=${e.swipe_hint}
              @pointerdown=${h=>this._swipeStart(h,t)}
              @pointermove=${h=>this._swipeMove(h,t)}
              @pointerup=${h=>this._swipeEnd(h,t)}
              @pointercancel=${()=>this._swipe=void 0}>
              <div class="tv" style="--c:${A(a??void 0)}">${f(a,!1)}°</div>
              <div class="muted src">${[t.target_variable,e[`src_${t.target_source}`]].filter(Boolean).join(" \xB7 ")}</div>
            </div>
            <button class="round" @click=${()=>this._step(t,.5)} aria-label="+0.5">+</button>
          </div>
        </div>

        ${s.show_modes?this._renderModes(t):l}
        ${s.show_timeline&&!s.compact?this._renderTimeline(t):l}
        ${s.show_schedules&&t.schedules.length>1?this._renderScheduleChoice(t):l}
        ${s.compact?l:this._renderList(t)}
        ${this._error?o`<div class="error">${this._error}</div>`:l}
      </ha-card>
    `}_pencil(){let e=b(this.hass);return o`<button class="pencil" title=${e.edit} aria-label=${e.edit}
      @click=${()=>this._editing=!0}>
      <ha-icon icon="mdi:pencil"></ha-icon>
    </button>`}_renderModes(e){let t=b(this.hass),s=[["auto",t.auto],["heat",t.heat],["off",t.off]];return o`<div class="seg accent" role="tablist">
      ${s.map(([r,a])=>o`<button role="tab" aria-selected=${e.mode===r}
          @click=${()=>this._mode(e,r)}>${a}</button>`)}
    </div>`}_renderScheduleChoice(e){return o`<div class="seg" role="tablist">
      ${e.schedules.map(t=>o`<button role="tab" aria-selected=${t.id===e.active_schedule}
          @click=${()=>this._schedule(e,t.id)}>${t.name}</button>`)}
    </div>`}_renderTimeline(e){let t=b(this.hass),s=e.schedules.find(p=>p.id===e.active_schedule);if(!s)return l;let r=this._snap.variables,a=s.week?.[he()]??s.week?.[_[0]];if(!a?.length)return l;let d=W(a),c=pe(),h=e.mode!=="auto"||e.override_active;return o`<div class="timeline ${h?"paused":""}">
      <div class="cap muted">
        <span>${t.today} · ${s.name}${h?` \xB7 ${t.schedule_paused}`:""}</span>
        ${this._config.show_editor?this._pencil():l}
      </div>
      <div class="bar">
        ${d.map(p=>{let u=H(p.slot,r);return o`<div class="seg-t"
            title="${X(p.slot,r)}"
            style="left:${p.start/x*100}%;width:${(p.end-p.start)/x*100}%;background:${A(u)}"></div>`})}
        <div class="now" style="left:${c/x*100}%"></div>
      </div>
      <div class="ticks muted"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`}_row(e,t,s,r,a){let d=r!==void 0&&this._section===r,c=r!==void 0||a!==void 0;return o`<button class="row ${d?"open":""}" ?disabled=${!c}
      @click=${()=>r?this._toggle(r):a?.()}>
      <ha-icon icon=${e}></ha-icon>
      <span class="row-label">${t}</span>
      <span class="row-value">${s}</span>
      ${c?o`<ha-icon class="chev" icon=${d?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>`:l}
    </button>`}_renderList(e){let t=this._config,s=b(this.hass),r=this.hass,a=ee(e),d=e.period?e.period.title:a.length?`${a.length} ${s.period_planned_n}`:s.prio_none,c=rt(e,this._snap,s,r),h=c.layers.find(p=>p.n===c.winner);return o`<div class="list">
      ${t.show_periods?o`${this._row("mdi:calendar-star",s.period_plural,d,"periods")}
          ${this._section==="periods"?o`<div class="detail">${this._renderPeriods(e)}</div>`:l}`:l}
      ${t.show_priorities?o`${this._row("mdi:layers-triple-outline",s.prio_short,h.name,"prio")}
          ${this._section==="prio"?o`<div class="detail">${this._renderPriorities(c)}</div>`:l}`:l}
      ${t.show_battery?this._renderBatteryRow(e):l}
    </div>`}_renderBatteryRow(e){let t=b(this.hass),s=fe(e);if(!s)return l;let r=o`<span class=${s.low?"low":""}>${s.level!=null?`${Math.round(s.level)} %`:s.low?t.battery_low:t.battery_ok}</span>`;return o`${this._row(Me(s.level,s.low),t.battery,r,"battery")}
      ${this._section==="battery"?o`<div class="detail batteries">
            ${(e.batteries??[]).map(a=>o`<div class="bat ${a.low?"low":""}">
                <ha-icon icon=${Me(a.level,a.low)}></ha-icon>
                <span class="grow">${a.name}</span>
                <span>${a.level!=null?`${Math.round(a.level)} %`:a.low?t.battery_low:t.battery_ok}</span>
              </div>`)}
          </div>`:l}`}_renderPriorities(e){return o`<div class="prio">
      ${e.layers.map(t=>o`<div class="prio-row ${t.n===e.winner?"win":t.n<e.winner?"idle":"below"}">
          <span class="prio-n">${t.n}</span>
          <span class="prio-name">${t.name}</span>
          <span class="prio-val">${t.value}</span>
        </div>`)}
    </div>`}_renderPeriods(e){let t=b(this.hass),s=this.hass,r=e.period,a=ee(e),d=this._allPeriods?a:a.slice(0,3),c=p=>`${w(p.start,s)} \u2013 ${p.end?w(p.end,s):t.period_open}`,h=(p,u)=>o`<div class="period ${u?"active":""}">
      <button class="period-text" @click=${()=>this._openPeriod(p)}>
        <span class="period-title">${p.title}</span>
        <span class="muted period-when">${u?p.end?`${t.period_until} ${w(p.end,s)}`:t.period_open:c(p)}</span>
      </button>
      <button class="text-btn small" @click=${()=>this._call("period/cancel",{entry_id:e.entry_id,period_id:p.id})}>
        ${u?t.period_end:t.period_delete}
      </button>
    </div>`;return o`<div class="periods">
      ${r?h(r,!0):l}
      ${d.map(p=>h(p,!1))}
      ${a.length>3?o`<button class="text-btn small" @click=${()=>this._allPeriods=!this._allPeriods}>
            ${this._allPeriods?t.period_less:`+${a.length-d.length} ${t.period_more}`}
          </button>`:l}
      <button class="text-btn plan" @click=${()=>{this._editPeriod=void 0,this._planning=!0}}>
        <ha-icon icon="mdi:calendar-plus"></ha-icon> ${t.period_plan}
      </button>
    </div>`}};I.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_pending:{state:!0},_editing:{state:!0},_planning:{state:!0},_editPeriod:{state:!0},_allPeriods:{state:!0},_section:{state:!0},_swipe:{state:!0},_error:{state:!0}},I.styles=[z,$`
      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow: hidden;
        height: 100%;
        box-sizing: border-box;
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
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
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
      .batteries {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .bat {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
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
    `];var yt={entity:{de:"Raum",en:"Room"},name:{de:"Name (optional)",en:"Name (optional)"},compact:{de:"Kompaktmodus (Wanddisplay)",en:"Compact mode (wall display)"},show_modes:{de:"Modi anzeigen",en:"Show modes"},show_schedules:{de:"Zeitpl\xE4ne anzeigen",en:"Show schedules"},show_timeline:{de:"Zeitleiste heute anzeigen",en:"Show today's timeline"},show_editor:{de:"Stift f\xFCr Wocheneditor",en:"Pencil for weekly editor"},show_periods:{de:"Zeitr\xE4ume anzeigen und planen",en:"Show and plan periods"},show_priorities:{de:"Priorit\xE4ten anzeigen",en:"Show priorities"},show_battery:{de:"Batteriestand anzeigen",en:"Show battery levels"},title:{de:"Titel",en:"Title"},show_override:{de:"Globalen Override anzeigen",en:"Show global override"},show_variables:{de:"Variablen anzeigen",en:"Show variables"},group_by_floor:{de:"Nach Stockwerk gruppieren",en:"Group by floor"},layout:{de:"Darstellung",en:"Layout"},show_summary:{de:"Zusammenfassung anzeigen",en:"Show summary"},room:{de:"R\xE4ume (gilt f\xFCr alle)",en:"Rooms (applies to all)"},exclude_rooms:{de:"R\xE4ume ausblenden",en:"Hide rooms"}},wt=[{name:"entity",required:!0,selector:{entity:{filter:{domain:"climate",integration:"bestthermostat"}}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"compact",selector:{boolean:{}}},{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}},{name:"show_battery",selector:{boolean:{}}}]}],$t=[{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}},{name:"show_battery",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}}];function kt(n){return[{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"box",options:[{value:"list",label:n?"Liste (Raum zum Aufklappen)":"List (tap to expand)"},{value:"tiles",label:n?"Kacheln (alle R\xE4ume offen)":"Tiles (all rooms open)"}]}}},{type:"grid",name:"",schema:[{name:"show_summary",selector:{boolean:{}}},{name:"show_override",selector:{boolean:{}}},{name:"show_variables",selector:{boolean:{}}},{name:"group_by_floor",selector:{boolean:{}}}]},{type:"expandable",name:"room",title:n?"R\xE4ume (gilt f\xFCr alle)":"Rooms (applies to all)",schema:[{type:"grid",name:"",schema:$t}]},{name:"exclude_rooms",selector:{entity:{multiple:!0,filter:{domain:"climate",integration:"bestthermostat"}}}}]}var ne=class extends v{constructor(){super(...arguments);this._label=e=>{let t=(this.hass?.locale?.language||this.hass?.language||"en").startsWith("de")?"de":"en";return yt[e.name]?.[t]??e.name}}setConfig(e){let t=this.defaults,s=e;this._config={...t,...s,...t.room?{room:{...t.room,...s.room??{}}}:{}}}_changed(e){let t=e.detail.value;this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?l:o`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};ne.properties={hass:{attribute:!1},_config:{state:!0}};var Pe=class extends ne{constructor(){super(...arguments);this.defaults={compact:!1,show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0,show_battery:!0}}get schema(){return wt}},Te=class extends ne{constructor(){super(...arguments);this.defaults={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,group_by_floor:!0,room:{show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_battery:!0,show_editor:!0,compact:!1}}}get schema(){let e=this.hass?.locale?.language||this.hass?.language||"en";return kt(e.startsWith("de"))}};customElements.define("bestthermostat-card-editor",Pe);customElements.define("bestthermostat-overview-card-editor",Te);var St={show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_editor:!0,show_battery:!0,compact:!1},j=class extends v{constructor(){super(...arguments);this._ovOpen=!1;this._varsOpen=!1;this._cardConfigs=new Map}static getConfigElement(){return document.createElement("bestthermostat-overview-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,show_periods:!0,group_by_floor:!0,...e,room:{...St,...e.show_periods===!1?{show_periods:!1}:{},...e.room??{}}},this._cardConfigs.clear()}_cardConfig(e,t){let s=`${e.entry_id}:${t}`,r=this._cardConfigs.get(s);return r||(r={type:"custom:bestthermostat-card",entity:e.climate_entity_id??e.entry_id,embedded:!0,show_header:t,show_floor:!this._config.group_by_floor,...this._config.room},this._cardConfigs.set(s,r)),r}getCardSize(){return 2+(this._snap?.rooms.length??2)}connectedCallback(){super.connectedCallback(),this.hass&&(this._unsub=Y(this.hass,e=>this._snap=e))}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&(this._unsub=Y(this.hass,t=>this._snap=t))}async _call(e,t){try{this._error=void 0,await D(this.hass,e,t)}catch(s){this._error=s?.message??String(s)}}_floorIconNo(e){return e==null?"0":e<0?"negative-1":e>3?"3":String(e)}_heatingCount(e){return e.filter(t=>t.hvac_action==="heating").length}_renderTile(e){return o`<div class="tile">
      <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!0)}></bestthermostat-card>
    </div>`}_groups(e){if(!this._config?.group_by_floor||!e.some(s=>s.floor))return[{floor:null,rooms:e}];let t=new Map;for(let s of e){let r=s.floor?.id??"";t.has(r)||t.set(r,{floor:s.floor,rooms:[]}),t.get(r).rooms.push(s)}return[...t.values()].sort((s,r)=>{if(!s.floor)return 1;if(!r.floor)return-1;let a=s.floor.level??999,d=r.floor.level??999;return a!==d?a-d:s.floor.name.localeCompare(r.floor.name)})}render(){if(!this._config||!this.hass)return l;let e=b(this.hass),t=this._snap;if(!t)return o`<ha-card><div class="pad">${e.loading}</div></ha-card>`;let s=t.rooms.filter(m=>m.hvac_action==="heating").length,r=t.rooms.map(m=>m.current_temperature).filter(m=>m!=null),a=r.length?r.reduce((m,y)=>m+y,0)/r.length:null,d=new Set(this._config.exclude_rooms??[]),c=t.rooms.filter(m=>!d.has(m.climate_entity_id??"")&&!d.has(m.entry_id)),h=this._groups(c),p=h.length>1||h[0]?.floor,u=this._config.layout==="tiles",g=this._config.title??e.rooms;return o`<ha-card>
      <div class="pad col">
        ${g||this._config.show_summary?o`<div>
              ${g?o`<div class="title">${g}</div>`:l}
              ${this._config.show_summary?o`<div class="muted summary">
                    ${s} ${e.of} ${t.rooms.length} ${e.rooms_word} ${e.heating_summary}${a!=null?o` · Ø ${f(a)}`:l}
                  </div>`:l}
            </div>`:l}
        <div class="top">
          ${this._config.show_override?this._renderOverride():l}
          ${this._config.show_variables&&t.variables.length?this._renderVariables():l}
        </div>
        <div class="rooms">
          ${h.map(m=>o`${p?o`<div class="floor">
                    <ha-icon icon=${m.floor?.icon||"mdi:home-floor-"+this._floorIconNo(m.floor?.level)}></ha-icon>
                    <span>${m.floor?.name??e.other_floor}</span>
                    ${this._heatingCount(m.rooms)?o`<span class="floor-heat">· ${this._heatingCount(m.rooms)} ${e.heating_summary}</span>`:l}
                  </div>`:l}
              <div class="grid ${u?"tiles":""}">
                ${m.rooms.map(y=>u?this._renderTile(y):this._renderRoom(y))}
              </div>`)}
        </div>
        ${this._error?o`<div class="error">${this._error}</div>`:l}
      </div>
    </ha-card>`}_renderOverride(){let e=b(this.hass),t=this._snap.override,s=this._ovOpen,r=a=>this._call("override/set",{temperature:Math.min(30,Math.max(5,(t.value??16)+a))});return o`<div class="box ${t.active?"on":""}">
      <div class="box-head">
        <span class="box-label">
          <ha-icon icon="mdi:home-export-outline"></ha-icon>
          <span>${e.override}</span>
        </span>
        <button class="value-btn ${s?"open":""}" @click=${()=>this._ovOpen=!this._ovOpen}
          aria-expanded=${s}>
          ${f(t.value)}
          <ha-icon icon=${s?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        <button class="switch ${t.active?"on":""}" role="switch" aria-checked=${t.active}
          aria-label=${e.override} @click=${()=>this._call("override/set",{active:!t.active})}>
          <span></span>
        </button>
      </div>
      ${s?o`<div class="box-body">
            <div class="stepper">
              <button class="round small" @click=${()=>r(-.5)}>−</button>
              <span class="val">${f(t.value)}</span>
              <button class="round small" @click=${()=>r(.5)}>+</button>
            </div>
            <div class="also">
              <span class="muted">${e.override_also}</span>
              ${[["include_manual",t.include_manual,e.heat],["include_off",t.include_off,e.off]].map(([a,d,c])=>o`<button class="mini ${d?"on":""}"
                  @click=${()=>this._call("override/set",{[a]:!d})}>${c}</button>`)}
            </div>
          </div>`:l}
    </div>`}_renderVariables(){let e=b(this.hass),t=this._snap.variables;return o`<div>
      <button class="vars-line" @click=${()=>this._varsOpen=!this._varsOpen}>
        <span class="vars-text">
          ${t.map((s,r)=>o`${r?o`<span class="sep">·</span>`:l}<span>${s.name}
                <b>${f(s.value,!1)}°</b></span>`)}
        </span>
        <ha-icon icon=${this._varsOpen?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>
      </button>
      ${this._varsOpen?o`<div class="var-list">
            ${t.map(s=>o`<div class="var-row">
                <span class="dot" style="background:${A(s.value)}"></span>
                <span class="grow">${s.name}</span>
                <button class="round small" @click=${()=>this._call("variable/update",{variable_id:s.id,value:Math.max(5,s.value-.5)})}>−</button>
                <span class="val">${f(s.value)}</span>
                <button class="round small" @click=${()=>this._call("variable/update",{variable_id:s.id,value:Math.min(30,s.value+.5)})}>+</button>
              </div>`)}
            <div class="muted hint">${e.variables_note}</div>
          </div>`:l}
    </div>`}_renderRoom(e){let t=b(this.hass),s=this.hass,r=e.hvac_action==="heating",a=this._open===e.entry_id,d=this._config?.room?.show_periods?ee(e)[0]:void 0;return o`<div class="room-block ${a?"open":""}">
      <button class="room" @click=${()=>this._open=a?void 0:e.entry_id}>
        <span class="icon ${r?"heating":""}"><ha-icon icon=${ue(e)}></ha-icon></span>
        <span class="grow left">
          <span class="name">${e.name}${this._config?.room?.show_battery&&fe(e)?.low?o`<ha-icon class="bat-low" icon="mdi:battery-alert-variant-outline"
                title=${t.battery_low}></ha-icon>`:l}</span>
          <span class="muted sub">${me(e,t,s)}</span>
          ${d?o`<span class="muted sub planned">
                <ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${d.title} · ${t.period_from}
                ${w(d.start,s)}
              </span>`:l}
        </span>
        <span class="temps">
          <span class="cur">${f(e.current_temperature,!1)}°</span>
          <span class="muted tgt">→ ${f(e.target_temperature,!1)}°</span>
        </span>
      </button>
      ${a?o`<div class="detail">
            <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!1)}></bestthermostat-card>
          </div>`:l}
    </div>`}};j.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_error:{state:!0},_open:{state:!0},_ovOpen:{state:!0},_varsOpen:{state:!0}},j.styles=[z,$`
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
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 4px 0 8px;
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
      }
      .floor ha-icon {
        --mdc-icon-size: 16px;
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
    `];var At="0.6.0";customElements.get("bestthermostat-card")||customElements.define("bestthermostat-card",I);customElements.get("bestthermostat-overview-card")||customElements.define("bestthermostat-overview-card",j);var _e=window;_e.customCards=_e.customCards||[];var Ne=(document.documentElement.lang||navigator.language||"").startsWith("de"),Et=[{type:"bestthermostat-card",name:"Best Thermostat",description:Ne?"Raumthermostat mit Zeitpl\xE4nen und Wocheneditor":"Room thermostat with schedules and weekly editor",preview:!0,documentationURL:"https://github.com/zitroaen/bestthermostat"},{type:"bestthermostat-overview-card",name:Ne?"Best Thermostat \xDCbersicht":"Best Thermostat Overview",description:Ne?"Alle R\xE4ume, globaler Override und Variablen":"All rooms, global override and variables",preview:!0}];for(let n of Et)_e.customCards.some(i=>i?.type===n.type)||_e.customCards.push(n);console.info(`%c BEST-THERMOSTAT %c ${At} `,"background:#ff8100;color:#fff","");
