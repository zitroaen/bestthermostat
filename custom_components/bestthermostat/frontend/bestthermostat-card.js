var pe=globalThis,he=pe.ShadowRoot&&(pe.ShadyCSS===void 0||pe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ee=Symbol(),Ke=new WeakMap,G=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==Ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(he&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=Ke.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&Ke.set(e,i))}return i}toString(){return this.cssText}},Fe=s=>new G(typeof s=="string"?s:s+"",void 0,Ee),k=(s,...i)=>{let e=s.length===1?s[0]:i.reduce((t,n,r)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[r+1],s[0]);return new G(e,s,Ee)},Ge=(s,i)=>{if(he)s.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),n=pe.litNonce;n!==void 0&&t.setAttribute("nonce",n),t.textContent=e.cssText,s.appendChild(t)}},Ae=he?s=>s:s=>s instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return Fe(e)})(s):s;var{is:xt,defineProperty:wt,getOwnPropertyDescriptor:yt,getOwnPropertyNames:$t,getOwnPropertySymbols:kt,getPrototypeOf:St}=Object,ue=globalThis,Ze=ue.trustedTypes,Et=Ze?Ze.emptyScript:"",At=ue.reactiveElementPolyfillSupport,Z=(s,i)=>s,Ce={toAttribute(s,i){switch(i){case Boolean:s=s?Et:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,i){let e=s;switch(i){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Je=(s,i)=>!xt(s,i),Ye={attribute:!0,type:String,converter:Ce,reflect:!1,useDefault:!1,hasChanged:Je};Symbol.metadata??=Symbol("metadata"),ue.litPropertyMetadata??=new WeakMap;var C=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=Ye){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),n=this.getPropertyDescriptor(i,t,e);n!==void 0&&wt(this.prototype,i,n)}}static getPropertyDescriptor(i,e,t){let{get:n,set:r}=yt(this.prototype,i)??{get(){return this[e]},set(a){this[e]=a}};return{get:n,set(a){let o=n?.call(this);r?.call(this,a),this.requestUpdate(i,o,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??Ye}static _$Ei(){if(this.hasOwnProperty(Z("elementProperties")))return;let i=St(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(Z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Z("properties"))){let e=this.properties,t=[...$t(e),...kt(e)];for(let n of t)this.createProperty(n,e[n])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,n]of e)this.elementProperties.set(t,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let n of t)e.unshift(Ae(n))}else i!==void 0&&e.push(Ae(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ge(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),n=this.constructor._$Eu(i,t);if(n!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:Ce).toAttribute(e,t.type);this._$Em=i,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(i,e){let t=this.constructor,n=t._$Eh.get(i);if(n!==void 0&&this._$Em!==n){let r=t.getPropertyOptions(n),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Ce;this._$Em=n;let o=a.fromAttribute(e,r.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(i,e,t,n=!1,r){if(i!==void 0){let a=this.constructor;if(n===!1&&(r=this[i]),t??=a.getPropertyOptions(i),!((t.hasChanged??Je)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(i)&&!this.hasAttribute(a._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:n,wrapped:r},a){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,a??e??this[i]),r!==!0||a!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),n===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[n,r]of t){let{wrapped:a}=r,o=this[n];a!==!0||this._$AL.has(n)||o===void 0||this.C(n,void 0,r,o)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[Z("elementProperties")]=new Map,C[Z("finalized")]=new Map,At?.({ReactiveElement:C}),(ue.reactiveElementVersions??=[]).push("2.1.2");var Oe=globalThis,Xe=s=>s,me=Oe.trustedTypes,Qe=me?me.createPolicy("lit-html",{createHTML:s=>s}):void 0,rt="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,at="?"+z,Ct=`<${at}>`,N=document,J=()=>N.createComment(""),X=s=>s===null||typeof s!="object"&&typeof s!="function",Ne=Array.isArray,Dt=s=>Ne(s)||typeof s?.[Symbol.iterator]=="function",De=`[ 	
\f\r]`,Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,et=/-->/g,tt=/>/g,P=RegExp(`>|${De}(?:([^\\s"'>=/]+)(${De}*=${De}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),it=/'/g,nt=/"/g,ot=/^(?:script|style|textarea|title)$/i,He=s=>(i,...e)=>({_$litType$:s,strings:i,values:e}),d=He(1),qt=He(2),Kt=He(3),H=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),st=new WeakMap,O=N.createTreeWalker(N,129);function dt(s,i){if(!Ne(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Qe!==void 0?Qe.createHTML(i):i}var Rt=(s,i)=>{let e=s.length-1,t=[],n,r=i===2?"<svg>":i===3?"<math>":"",a=Y;for(let o=0;o<e;o++){let l=s[o],p,h,u=-1,_=0;for(;_<l.length&&(a.lastIndex=_,h=a.exec(l),h!==null);)_=a.lastIndex,a===Y?h[1]==="!--"?a=et:h[1]!==void 0?a=tt:h[2]!==void 0?(ot.test(h[2])&&(n=RegExp("</"+h[2],"g")),a=P):h[3]!==void 0&&(a=P):a===P?h[0]===">"?(a=n??Y,u=-1):h[1]===void 0?u=-2:(u=a.lastIndex-h[2].length,p=h[1],a=h[3]===void 0?P:h[3]==='"'?nt:it):a===nt||a===it?a=P:a===et||a===tt?a=Y:(a=P,n=void 0);let m=a===P&&s[o+1].startsWith("/>")?" ":"";r+=a===Y?l+Ct:u>=0?(t.push(p),l.slice(0,u)+rt+l.slice(u)+z+m):l+z+(u===-2?o:m)}return[dt(s,r+(s[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},Q=class s{constructor({strings:i,_$litType$:e},t){let n;this.parts=[];let r=0,a=0,o=i.length-1,l=this.parts,[p,h]=Rt(i,e);if(this.el=s.createElement(p,t),O.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=O.nextNode())!==null&&l.length<o;){if(n.nodeType===1){if(n.hasAttributes())for(let u of n.getAttributeNames())if(u.endsWith(rt)){let _=h[a++],m=n.getAttribute(u).split(z),v=/([.?@])?(.*)/.exec(_);l.push({type:1,index:r,name:v[2],strings:m,ctor:v[1]==="."?ze:v[1]==="?"?Te:v[1]==="@"?Me:I}),n.removeAttribute(u)}else u.startsWith(z)&&(l.push({type:6,index:r}),n.removeAttribute(u));if(ot.test(n.tagName)){let u=n.textContent.split(z),_=u.length-1;if(_>0){n.textContent=me?me.emptyScript:"";for(let m=0;m<_;m++)n.append(u[m],J()),O.nextNode(),l.push({type:2,index:++r});n.append(u[_],J())}}}else if(n.nodeType===8)if(n.data===at)l.push({type:2,index:r});else{let u=-1;for(;(u=n.data.indexOf(z,u+1))!==-1;)l.push({type:7,index:r}),u+=z.length-1}r++}}static createElement(i,e){let t=N.createElement("template");return t.innerHTML=i,t}};function W(s,i,e=s,t){if(i===H)return i;let n=t!==void 0?e._$Co?.[t]:e._$Cl,r=X(i)?void 0:i._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(s),n._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=n:e._$Cl=n),n!==void 0&&(i=W(s,n._$AS(s,i.values),n,t)),i}var Re=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,n=(i?.creationScope??N).importNode(e,!0);O.currentNode=n;let r=O.nextNode(),a=0,o=0,l=t[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new ee(r,r.nextSibling,this,i):l.type===1?p=new l.ctor(r,l.name,l.strings,this,i):l.type===6&&(p=new Pe(r,this,i)),this._$AV.push(p),l=t[++o]}a!==l?.index&&(r=O.nextNode(),a++)}return O.currentNode=N,n}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},ee=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,n){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=W(this,i,e),X(i)?i===c||i==null||i===""?(this._$AH!==c&&this._$AR(),this._$AH=c):i!==this._$AH&&i!==H&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):Dt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==c&&X(this._$AH)?this._$AA.nextSibling.data=i:this.T(N.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,n=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=Q.createElement(dt(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===n)this._$AH.p(e);else{let r=new Re(n,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(i){let e=st.get(i.strings);return e===void 0&&st.set(i.strings,e=new Q(i)),e}k(i){Ne(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,n=0;for(let r of i)n===e.length?e.push(t=new s(this.O(J()),this.O(J()),this,this.options)):t=e[n],t._$AI(r),n++;n<e.length&&(this._$AR(t&&t._$AB.nextSibling,n),e.length=n)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=Xe(i).nextSibling;Xe(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,n,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=i,this.name=e,this._$AM=n,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(i,e=this,t,n){let r=this.strings,a=!1;if(r===void 0)i=W(this,i,e,0),a=!X(i)||i!==this._$AH&&i!==H,a&&(this._$AH=i);else{let o=i,l,p;for(i=r[0],l=0;l<r.length-1;l++)p=W(this,o[t+l],e,l),p===H&&(p=this._$AH[l]),a||=!X(p)||p!==this._$AH[l],p===c?i=c:i!==c&&(i+=(p??"")+r[l+1]),this._$AH[l]=p}a&&!n&&this.j(i)}j(i){i===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},ze=class extends I{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===c?void 0:i}},Te=class extends I{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==c)}},Me=class extends I{constructor(i,e,t,n,r){super(i,e,t,n,r),this.type=5}_$AI(i,e=this){if((i=W(this,i,e,0)??c)===H)return;let t=this._$AH,n=i===c&&t!==c||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,r=i!==c&&(t===c||n);n&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Pe=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){W(this,i)}};var zt=Oe.litHtmlPolyfillSupport;zt?.(Q,ee),(Oe.litHtmlVersions??=[]).push("3.3.3");var lt=(s,i,e)=>{let t=e?.renderBefore??i,n=t._$litPart$;if(n===void 0){let r=e?.renderBefore??null;t._$litPart$=n=new ee(i.insertBefore(J(),r),r,void 0,e??{})}return n._$AI(s),n};var Le=globalThis,x=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=lt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};x._$litElement$=!0,x.finalized=!0,Le.litElementHydrateSupport?.({LitElement:x});var Tt=Le.litElementPolyfillSupport;Tt?.({LitElement:x});(Le.litElementVersions??=[]).push("4.2.2");var pt="bestthermostat",g=["mon","tue","wed","thu","fri","sat","sun"],fe,j,ct,_e=new Set;function te(s,i){return _e.add(i),fe&&i(fe),(!j||ct!==s.connection)&&(ct=s.connection,j=s.connection.subscribeMessage(e=>{fe=e,_e.forEach(t=>t(e))},{type:`${pt}/subscribe`}).catch(e=>(console.error("Best Thermostat: subscription failed",e),j=void 0,()=>{}))),()=>{if(_e.delete(i),_e.size===0&&j){let e=j;j=void 0,fe=void 0,e.then(t=>t())}}}function D(s,i,e={}){return s.callWS({type:`${pt}/${i}`,...e})}function ht(s,i){if(!(!s||!i))return s.rooms.find(e=>e.climate_entity_id===i||e.entry_id===i)}var T=k`
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
`;var S=15,w=1440;function M(s){let[i,e]=s.split(":").map(Number);return i*60+e}function E(s){let i=Math.floor(s/60),e=s%60;return`${String(i).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function Ue(s){return Math.round(s/S)*S}function U(s,i){return s.variable!==void 0?i.find(e=>e.id===s.variable)?.value:s.temperature}function ie(s,i){if(s.variable!==void 0){let e=i.find(t=>t.id===s.variable);return e?e.name:s.variable}return f(s.temperature)}function f(s,i=!0){if(s==null||Number.isNaN(s))return"\u2013";let e=(Math.round(s*2)/2).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1});return i?`${e} \xB0C`:e}var L=[[12,[90,140,220]],[16,[120,180,235]],[18,[150,210,200]],[19.5,[250,215,110]],[21,[255,175,85]],[23,[250,125,70]],[26,[225,75,60]]];function $(s){if(s===void 0)return"var(--disabled-color, #9e9e9e)";if(s<=L[0][0])return`rgb(${L[0][1].join(",")})`;for(let i=1;i<L.length;i++){let[e,t]=L[i];if(s<=e){let[n,r]=L[i-1],a=(s-n)/(e-n);return`rgb(${r.map((o,l)=>Math.round(o+(t[l]-o)*a)).join(",")})`}}return`rgb(${L[L.length-1][1].join(",")})`}function ne(s){return JSON.parse(JSON.stringify(s))}function Ve(s,i){return JSON.stringify(s)===JSON.stringify(i)}function B(s){return s.map((i,e)=>({start:M(i.start),end:e+1<s.length?M(s[e+1].start):w,slot:i}))}function ge(){let s=new Date;return s.getHours()*60+s.getMinutes()}function be(){return g[(new Date().getDay()+6)%7]}function y(s,i){if(!s)return"";let e=new Date(s),t=i.locale?.language||i.language,n=new Date,r=e.toLocaleTimeString(t,{hour:"2-digit",minute:"2-digit"});return e.toDateString()===n.toDateString()?r:`${e.toLocaleDateString(t,{weekday:"short"})} ${r}`}var ut={de:{auto:"Auto",heat:"Manuell",off:"Aus",schedule:"Zeitplan",schedules:"Zeitpl\xE4ne",edit:"Wochenplan bearbeiten",schedule_paused:"pausiert",period:"Zeitraum",period_until:"bis",period_open:"bis auf Weiteres",period_planned:"Geplant",period_from:"ab",period_end:"Beenden",period_delete:"L\xF6schen",period_plan:"Zeitraum planen",period_edit:"Zeitraum bearbeiten",period_less:"weniger anzeigen",period_what:"Was soll gelten?",period_start:"Beginn",period_end_label:"Ende",period_now:"Jetzt",period_at:"Zeitpunkt",period_title:"Titel",period_title_hint:"z. B. Besuch von Oma",period_invalid:"Bitte g\xFCltigen Beginn und ein Ende in der Zukunft nach dem Beginn w\xE4hlen.",period_more:"weitere geplant",optional:"optional",prio_title:"Priorit\xE4ten",prio_short:"Priorit\xE4t",week_plan:"Wochenplan",new_version:"Neue Version der Karte verf\xFCgbar.",reload:"Neu laden",then:"dann",copy_to_rooms:"In andere R\xE4ume kopieren",copy_rooms_hint:"\u201E{name}\u201C wird in die gew\xE4hlten R\xE4ume kopiert. Gibt es dort schon einen gleichnamigen Zeitplan, wird er ersetzt.",will_replace:"wird ersetzt",will_create:"wird neu angelegt",all_rooms:"Alle R\xE4ume",copied_to:"Kopiert nach:",copy_unsaved:"Es wird der gespeicherte Stand kopiert, nicht deine ungespeicherten \xC4nderungen. Fortfahren?",battery:"Batterie",battery_low:"schwach",battery_ok:"OK",more:"Mehr",not_active:"Dieser Zeitplan ist gerade nicht aktiv.",unsaved_short:"Ungespeicherte \xC4nderungen",manage_variables:"Variablen verwalten",delete_schedule:"Zeitplan l\xF6schen",edit_short:"Bearbeiten",from:"Von",to:"Bis",days_long:["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],weekend:"Wochenende",copy_day_short:"Tag kopieren",add:"Hinzuf\xFCgen",cancel:"Abbrechen",ok:"OK",swipe_hint:"Zum \xC4ndern waagerecht wischen",today:"Heute",period_plural:"Zeitr\xE4ume",period_planned_n:"geplant",heating_summary:"heizen",of:"von",rooms_word:"R\xE4umen",other_floor:"Weitere",open_details:"Details",prio_hand:"\xC4nderung von Hand",prio_room:"Raum",prio_inactive:"aus",prio_none:"keine",until:"bis",next:"N\xE4chster Wechsel",src_override:"Globaler Override",src_off:"Frostschutz",src_manual:"Manuell",src_hand:"Ge\xE4ndert",src_schedule:"Zeitplan",heating:"Heizt",idle:"Bereit",save:"Speichern",discard:"Verwerfen",close:"Schlie\xDFen",new_schedule:"Neuer Zeitplan",rename:"Umbenennen",duplicate:"Duplizieren",delete:"L\xF6schen",activate:"Aktivieren",active:"Aktiv",split:"Teilen",copy_day:"Tag kopieren auf \u2026",copy:"Kopieren",workdays:"Mo\u2013Fr",all_days:"Alle",fixed:"Fest",variables:"Variablen",add_variable:"Variable hinzuf\xFCgen",name:"Name",value:"Wert",unsaved:"Ungespeicherte \xC4nderungen verwerfen?",confirm_delete:"Zeitplan wirklich l\xF6schen?",tap_hint:"Abschnitt antippen zum Bearbeiten, Grenzen ziehen zum Verschieben.",days:["Mo","Di","Mi","Do","Fr","Sa","So"],not_found:"Raum nicht gefunden. Bitte in der Kartenkonfiguration einen Best-Thermostat-Raum w\xE4hlen.",loading:"Lade \u2026",override:"Globaler Override",override_also:"Gilt auch f\xFCr",override_not_applied:"Override gilt hier nicht",rooms:"R\xE4ume",variables_note:"Variablen gelten f\xFCr alle R\xE4ume und werden sofort gespeichert."},en:{auto:"Auto",heat:"Manual",off:"Off",schedule:"Schedule",schedules:"Schedules",edit:"Edit weekly plan",schedule_paused:"paused",period:"Period",period_until:"until",period_open:"until cancelled",period_planned:"Planned",period_from:"from",period_end:"End",period_delete:"Delete",period_plan:"Plan period",period_edit:"Edit period",period_less:"show less",period_what:"What should apply?",period_start:"Start",period_end_label:"End",period_now:"Now",period_at:"At",period_title:"Title",period_title_hint:"e.g. Grandma visiting",period_invalid:"Please choose a valid start and an end in the future after the start.",period_more:"more planned",optional:"optional",prio_title:"Priorities",prio_short:"Priority",week_plan:"Weekly plan",new_version:"A new version of the card is available.",reload:"Reload",then:"then",copy_to_rooms:"Copy to other rooms",copy_rooms_hint:'"{name}" is copied to the selected rooms. An existing schedule with the same name is replaced.',will_replace:"will be replaced",will_create:"will be created",all_rooms:"All rooms",copied_to:"Copied to:",copy_unsaved:"The saved version is copied, not your unsaved changes. Continue?",battery:"Battery",battery_low:"low",battery_ok:"OK",more:"More",not_active:"This schedule is currently not active.",unsaved_short:"Unsaved changes",manage_variables:"Manage variables",delete_schedule:"Delete schedule",edit_short:"Edit",from:"From",to:"To",days_long:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],weekend:"Weekend",copy_day_short:"Copy day",add:"Add",cancel:"Cancel",ok:"OK",swipe_hint:"Swipe horizontally to change",today:"Today",period_plural:"Periods",period_planned_n:"planned",heating_summary:"heating",of:"of",rooms_word:"rooms",other_floor:"Other",open_details:"Details",prio_hand:"Hand change",prio_room:"Room",prio_inactive:"off",prio_none:"none",until:"until",next:"Next change",src_override:"Global override",src_off:"Frost protection",src_manual:"Manual",src_hand:"Changed",src_schedule:"Schedule",heating:"Heating",idle:"Idle",save:"Save",discard:"Discard",close:"Close",new_schedule:"New schedule",rename:"Rename",duplicate:"Duplicate",delete:"Delete",activate:"Activate",active:"Active",split:"Split",copy_day:"Copy day to \u2026",copy:"Copy",workdays:"Mon\u2013Fri",all_days:"All",fixed:"Fixed",variables:"Variables",add_variable:"Add variable",name:"Name",value:"Value",unsaved:"Discard unsaved changes?",confirm_delete:"Really delete this schedule?",tap_hint:"Tap a block to edit it, drag the borders to move them.",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],not_found:"Room not found. Please select a Best Thermostat room in the card configuration.",loading:"Loading \u2026",override:"Global override",override_also:"Also applies to",override_not_applied:"override not applied here",rooms:"Rooms",variables_note:"Variables apply to all rooms and are saved immediately."}};function b(s){return(s?.locale?.language||s?.language||"en").slice(0,2)==="de"?ut.de:ut.en}function A(s,i){customElements.get(s)||customElements.define(s,i)}function ve(s,i,e){if(!(!s||s===i))return{text:e.new_version,action:e.reload}}function mt(s,i){let e=[];for(let t=s;t<=i;t+=1)e.push(`${$(t)} ${((t-s)/(i-s)*100).toFixed(1)}%`);return`linear-gradient(to right, ${e.join(", ")})`}function ft(s,i){return s.schedules.find(e=>e.id===i)?.name??i}function xe(s){return s.area?.icon?s.area.icon:s.override_active?"mdi:home-export-outline":s.period?"mdi:calendar-star":s.mode==="off"?"mdi:radiator-off":s.mode==="heat"||s.target_source==="hand"?"mdi:hand-back-right":"mdi:radiator"}function We(s){return s.target_source==="schedule"&&!s.period&&!s.override_active}function _t(s){let i=s.filter(n=>We(n)&&n.next_change);if(i.length<2)return;let e=i[0];return i.every(n=>n.next_change===e.next_change&&n.next_temperature===e.next_temperature)?{time:e.next_change,temp:e.next_temperature}:void 0}function we(s,i,e,t=!1){if(s.override_active)return i.src_override;if(s.target_source==="hand"&&s.hand_until)return`${i.src_hand} \xB7 ${i.until} ${y(s.hand_until,e)}`;if(s.period){let r=s.period.end?`${i.period_until} ${y(s.period.end,e)}`:i.period_open;return`${s.period.title} \xB7 ${r}`}if(s.mode==="off")return i.src_off;if(s.mode==="heat")return i.src_manual;let n=ft(s,s.active_schedule);return s.next_change&&!t?`${n} \xB7 ${y(s.next_change,e)} \u2192 ${f(s.next_temperature)}`:n}function gt(s,i,e,t){let n=i.override,r=s.override_active?1:s.target_source==="hand"?2:s.period?3:4,a=s.base_mode==="off"?`${e.src_off} \xB7 ${f(s.frost_temperature)}`:s.base_mode==="heat"?`${e.heat} \xB7 ${f(s.base_manual_temperature)}`:`${e.auto} \xB7 ${ft(s,s.base_schedule)}`;return{layers:[{n:1,icon:"mdi:home-export-outline",name:e.override,value:n.active?s.override_active?f(n.value):`${f(n.value)} \xB7 ${e.override_not_applied}`:e.prio_inactive},{n:2,icon:"mdi:hand-back-right",name:e.prio_hand,value:s.target_source==="hand"&&s.hand_until?`${f(s.target_temperature)} \xB7 ${e.until} ${y(s.hand_until,t)}`:Mt(s,e,t)||e.prio_none},{n:3,icon:"mdi:calendar-star",name:e.period,value:s.period?`${s.period.title} \xB7 ${s.period.end?`${e.period_until} ${y(s.period.end,t)}`:e.period_open}`:e.prio_none},{n:4,icon:"mdi:radiator",name:e.prio_room,value:a}],winner:r}}function se(s){let i=Date.now();return(s.periods??[]).filter(e=>new Date(e.start).getTime()>i).sort((e,t)=>new Date(e.start).getTime()-new Date(t.start).getTime())}function re(s){let i=s.batteries??[];if(!i.length)return;let e=i.filter(r=>r.level!=null),t=i.some(r=>r.low);return{level:e.length?Math.min(...e.map(r=>r.level)):null,low:t}}function Ie(s,i){return s==null?i?"mdi:battery-alert-variant-outline":"mdi:battery":s<=10?"mdi:battery-alert-variant-outline":s>=95?"mdi:battery":`mdi:battery-${Math.max(10,Math.floor(s/10)*10)}`}function Mt(s,i,e){return(s.trv_deviations??[]).map(t=>[t.name,f(t.temperature),t.until?`${i.until} ${y(t.until,e)}`:""].filter(Boolean).join(" \xB7 ")).join(", ")}function ye(s,i){if("touches"in s){Pt(s,i);return}if(s.pointerType==="touch"||s.pointerType==="mouse"&&s.button!==0)return;let e=s.clientX,t=s.pointerId,n=!1,r=0,a=p=>{if(p.pointerId!==t)return;let h=p.clientX-e;if(!n&&Math.abs(h)<10)return;n=!0,p.preventDefault();let u=Math.round(h/24);u!==r?(r=u,i.onStep(u)):u===0&&i.onStep(0)},o=p=>{p.pointerId===t&&(l(),i.onEnd(n))},l=()=>{window.removeEventListener("pointermove",a),window.removeEventListener("pointerup",o),window.removeEventListener("pointercancel",o)};window.addEventListener("pointermove",a),window.addEventListener("pointerup",o),window.addEventListener("pointercancel",o)}function Pt(s,i){let e=s.changedTouches[0];if(!e)return;let t=e.identifier,n=e.clientX,r=e.clientY,a="undecided",o=0,l=_=>Array.from(_.changedTouches).find(m=>m.identifier===t),p=_=>{let m=l(_);if(!m)return;let v=m.clientX-n,V=m.clientY-r;if(a==="undecided"){if(Math.abs(v)<10&&Math.abs(V)<10)return;if(a=Math.abs(v)>Math.abs(V)?"swipe":"scroll",a==="scroll"){u();return}i.onStep(0)}_.preventDefault();let R=Math.round(v/24);R!==o&&(o=R,i.onStep(R))},h=_=>{l(_)&&(u(),a!=="scroll"&&i.onEnd(a==="swipe"))},u=()=>{window.removeEventListener("touchmove",p),window.removeEventListener("touchend",h),window.removeEventListener("touchcancel",h)};window.addEventListener("touchmove",p,{passive:!1}),window.addEventListener("touchend",h),window.addEventListener("touchcancel",h)}var q="0.8.0";var ae=class extends x{constructor(){super(...arguments);this._vars=!1;this._menu=!1;this._busy=!1;this._newVarName="";this._newVarValue=20;this._nameValue="";this._onKey=e=>{e.key==="Escape"&&this._close()};this._onWindowMove=e=>{this._drag&&(e.preventDefault(),this._dragMove(e))};this._onWindowUp=()=>{this._dragEnd(),window.removeEventListener("pointermove",this._onWindowMove),window.removeEventListener("pointerup",this._onWindowUp),window.removeEventListener("pointercancel",this._onWindowUp)}}get _t(){return b(this.hass)}get _server(){return this.room?.schedules.find(e=>e.id===this._sid)?.week}get _dirty(){return!!this._draft&&!!this._server&&!Ve(this._draft,this._server)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey),document.documentElement.style.overflow="hidden"}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey),document.documentElement.style.overflow=""}willUpdate(e){this.room&&(this._sid||(this._sid=this.room.active_schedule),(e.has("room")||!this._draft)&&this._server&&(!this._draft||!this._dirtyAgainst(e))&&(this._draft=ne(this._server)))}_dirtyAgainst(e){let n=e.get("room")?.schedules.find(r=>r.id===this._sid)?.week;return!!n&&!!this._draft&&!Ve(this._draft,n)}_close(){this._dirty&&!confirm(this._t.unsaved)||this.dispatchEvent(new CustomEvent("close"))}async _call(e,t){if(this.hass){this._busy=!0,this._error=void 0;try{return await D(this.hass,e,t)}catch(n){this._error=n?.message??String(n);return}finally{this._busy=!1}}}_selectSchedule(e){e!==this._sid&&(this._dirty&&!confirm(this._t.unsaved)||(this._sid=e,this._draft=this._server?ne(this._server):void 0,this._sel=void 0,this._copy=void 0))}_startName(e){let t=this.room?.schedules.find(n=>n.id===this._sid)?.name??"";this._sel=void 0,this._vars=!1,this._error=void 0,this._nameAction=e,this._nameValue=e==="rename"?t:e==="duplicate"?`${t} 2`:""}async _submitName(){let e=this._nameValue.trim();if(!e||!this.room||!this._nameAction)return;let t=this.room.entry_id;if(this._nameAction==="rename")await this._call("schedule/rename",{entry_id:t,schedule_id:this._sid,name:e});else{let n=await this._call("schedule/create",{entry_id:t,name:e,copy_from:this._sid});n&&(this._sid=n.id,this._draft=void 0)}this._error||(this._nameAction=void 0)}async _delete(){if(!this.room||!confirm(this._t.confirm_delete))return;await this._call("schedule/delete",{entry_id:this.room.entry_id,schedule_id:this._sid})&&(this._sid=this.room.active_schedule,this._draft=void 0)}_activate(){this.room&&this._call("schedule/activate",{entry_id:this.room.entry_id,schedule_id:this._sid})}async _save(){if(!this.room||!this._draft)return;await this._call("schedule/save",{entry_id:this.room.entry_id,schedule_id:this._sid,week:this._draft})&&(this._sel=void 0)}_discard(){this._server&&(this._draft=ne(this._server)),this._sel=void 0,this._copy=void 0}_mutate(e){if(!this._draft)return;let t=ne(this._draft);e(t),this._draft=t}_slot(e){return this._draft?.[g[e.day]]?.[e.idx]}_setTemp(e){let t=this._sel;if(!t)return;let n=this.snap?.variables??[];this._mutate(r=>{let a=r[g[t.day]][t.idx],o=U(a,n)??20,l=Math.min(30,Math.max(5,Math.round((o+e)*2)/2));r[g[t.day]][t.idx]={start:a.start,temperature:l}})}_setVariable(e){let t=this._sel;if(!t)return;let n=this.snap?.variables??[];this._mutate(r=>{let a=r[g[t.day]][t.idx];r[g[t.day]][t.idx]=e===void 0?{start:a.start,temperature:U(a,n)??20}:{start:a.start,variable:e}})}_split(){let e=this._sel;if(!e||!this._draft)return;let t=B(this._draft[g[e.day]])[e.idx],n=Ue((t.start+t.end)/2);n<=t.start||n>=t.end||(this._mutate(r=>{let a=r[g[e.day]];a.splice(e.idx+1,0,{...a[e.idx],start:E(n)})}),this._sel={day:e.day,idx:e.idx+1})}_remove(){let e=this._sel;!e||!this._draft||this._draft[g[e.day]].length<2||(this._mutate(n=>{let r=n[g[e.day]];e.idx===0?(r.splice(1,1,{...r[1],start:"00:00"}),r.splice(0,1)):r.splice(e.idx,1)}),this._sel={day:e.day,idx:Math.max(0,e.idx-1)})}_toggleCopy(e){let t=new Set(this._copy);t.has(e)?t.delete(e):t.add(e),this._copy=t}_applyCopy(){let e=this._sel;if(!e||!this._copy)return;let t=[...this._copy].filter(n=>n!==e.day);this._mutate(n=>{for(let r of t)n[g[r]]=JSON.parse(JSON.stringify(n[g[e.day]]))}),this._copy=void 0}_dragStart(e,t,n){e.preventDefault(),e.stopPropagation();let r=e.currentTarget;try{r.setPointerCapture(e.pointerId)}catch{}this._drag={day:t,idx:n,bar:r.parentElement},window.addEventListener("pointermove",this._onWindowMove),window.addEventListener("pointerup",this._onWindowUp),window.addEventListener("pointercancel",this._onWindowUp)}_dragMove(e){let t=this._drag;if(!t||!this._draft)return;let n=t.bar.getBoundingClientRect(),r=(e.clientX-n.left)/n.width*w,a=this._draft[g[t.day]],o=M(a[t.idx-1].start)+S,l=(t.idx+1<a.length?M(a[t.idx+1].start):w)-S,p=E(Math.min(l,Math.max(o,Ue(r))));p!==a[t.idx].start&&this._mutate(h=>{h[g[t.day]][t.idx]={...h[g[t.day]][t.idx],start:p}})}_dragEnd(){this._drag=void 0}_varStep(e,t,n){let r=Math.min(30,Math.max(5,Math.round((t+n)*2)/2));this._call("variable/update",{variable_id:e,value:r})}async _addVar(){let e=this._newVarName.trim();if(!e)return;await this._call("variable/create",{name:e,value:this._newVarValue})&&(this._newVarName="",this.requestUpdate())}_deleteVar(e){this._call("variable/delete",{variable_id:e})}_shift(e,t){let n=this._sel;if(!n||!this._draft)return;let r=this._draft[g[n.day]],a=e==="start"?n.idx:n.idx+1;if(a<=0||a>=r.length)return;let o=M(r[a-1].start)+S,l=(a+1<r.length?M(r[a+1].start):w)-S,p=Math.min(l,Math.max(o,M(r[a].start)+t));E(p)!==r[a].start&&this._mutate(h=>{h[g[n.day]][a]={...h[g[n.day]][a],start:E(p)}})}_select(e,t){this._sel={day:e,idx:t},this._copy=void 0,this._menu=!1}render(){if(!this.room||!this._draft)return c;let e=this._t,t=this.room,n=t.schedules.find(o=>o.id===this._sid),r=n?.id===t.active_schedule,a=!!this._sel||this._vars||!!this._nameAction||!!this._copyRooms;return d`
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
          ${this._menu?this._renderMenu(t):c}
        </header>

        <div class="content ${a?"sheet-open":""} ${this._dirty?"dirty":""}"
          @click=${()=>this._menu=!1}>
          <div class="seg" role="tablist">
            ${t.schedules.map(o=>d`<button role="tab" aria-selected=${o.id===this._sid}
                @click=${()=>this._selectSchedule(o.id)}>
                ${o.name}${o.id===t.active_schedule?d`<i class="active-dot"></i>`:c}
              </button>`)}
            <button class="plus" aria-label=${e.new_schedule} @click=${()=>this._startName("new")}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>

          ${n&&!r?d`<div class="notice">
                <span>${e.not_active}</span>
                <button class="text-btn" @click=${this._activate}>${e.activate}</button>
              </div>`:c}

          <div class="week">
            <div class="ruler muted">
              <span></span>
              <div>${[0,6,12,18,24].map(o=>d`<span style="left:${o/24*100}%">${o}</span>`)}</div>
            </div>
            ${g.map((o,l)=>this._renderDay(o,l))}
          </div>
          ${this._renderLegend()}
          <div class="muted hint">${e.tap_hint}</div>
          ${this._error?d`<div class="error">${this._error}</div>`:c}
        </div>

        ${this._sel?this._renderSlotSheet(this._sel):c}
        ${this._vars?this._renderVariablesSheet():c}
        ${this._nameAction?this._renderNameSheet():c}
        ${this._copyRooms?this._renderCopyRoomsSheet():c}

        ${this._dirty&&!a?d`<div class="savebar">
              <span class="grow">${e.unsaved_short}</span>
              <button class="text-btn light" ?disabled=${this._busy} @click=${this._discard}>
                ${e.discard}
              </button>
              <button class="primary-btn" ?disabled=${this._busy} @click=${this._save}>${e.save}</button>
            </div>`:c}
      </div>
    `}_renderMenu(e){let t=this._t,n=this._sid!==e.base_schedule&&e.schedules.length>1,r=(a,o,l,p="",h=!1)=>d`<button class="menu-item ${p}" ?disabled=${h} @click=${()=>{this._menu=!1,l()}}><ha-icon icon=${a}></ha-icon>${o}</button>`;return d`<div class="menu" role="menu">
      ${r("mdi:pencil-outline",t.rename,()=>this._startName("rename"))}
      ${r("mdi:content-copy",t.duplicate,()=>this._startName("duplicate"))}
      ${r("mdi:home-export-outline",t.copy_to_rooms,()=>{this._sel=void 0,this._vars=!1,this._info=void 0,this._copyRooms=new Set},"",(this.snap?.rooms.length??0)<2)}
      ${r("mdi:thermometer-lines",t.manage_variables,()=>{this._sel=void 0,this._vars=!0})}
      <div class="menu-sep"></div>
      ${r("mdi:delete-outline",t.delete_schedule,()=>this._delete(),"danger",!n)}
    </div>`}_renderLegend(){let e=this._t,t=this.snap?.variables??[],n=new Set;for(let a of Object.values(this._draft??{}))for(let o of a)o.variable&&n.add(o.variable);let r=t.filter(a=>n.has(a.id));return d`<div class="legend">
      ${(r.length?r:t).map(a=>d`<span><i class="sw" style="background:${$(a.value)}"></i>${a.name}
          <b>${f(a.value,!1)}°</b></span>`)}
      <button class="text-btn small" @click=${()=>{this._sel=void 0,this._vars=!0}}>${e.edit_short}</button>
    </div>`}_renderDay(e,t){let n=this.snap?.variables??[],r=B(this._draft[e]),a=e===be();return d`<div class="day ${this._sel?.day===t?"active":""}">
      <span class="day-label ${a?"today":""}">${this._t.days[t]}</span>
      <div class="bar">
        ${r.map((o,l)=>{let p=U(o.slot,n),h=(o.end-o.start)/w*100,u=this._sel?.day===t&&this._sel.idx===l;return d`<button class="seg-b ${u?"selected":""} ${o.slot.variable?"var":""}"
            style="left:${o.start/w*100}%;width:${h}%;background:${$(p)}"
            title="${E(o.start)}–${E(o.end%w)} · ${ie(o.slot,n)}"
            @click=${_=>{_.stopPropagation(),this._select(t,l)}}>
            ${h>8?d`<span>${o.slot.variable?ie(o.slot,n):`${f(p,!1)}\xB0`}</span>`:c}
          </button>`})}
        <div class="hours"></div>
        ${a?d`<div class="now" style="left:${ge()/w*100}%"></div>`:c}
        ${r.slice(1).map((o,l)=>{let p=this._drag?.day===t&&this._drag.idx===l+1;return d`<div class="handle ${p?"dragging":""}"
            style="left:${o.start/w*100}%"
            @pointerdown=${h=>this._dragStart(h,t,l+1)}>
            <span></span><i class="knob"></i>
            ${p?d`<div class="time-tip">${E(o.start)}</div>`:c}
          </div>`})}
      </div>
    </div>`}_sheet(e,t,n){return d`<div class="scrim" @click=${n}></div>
      <div class="sheet" role="dialog">
        <div class="grab"></div>
        <div class="sheet-head">
          <span class="sheet-title">${e}</span>
          <button class="icon-btn small" aria-label=${this._t.close} @click=${n}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${t}
      </div>`}_renderSlotSheet(e){let t=this._t,n=this.snap?.variables??[],r=this._slot(e);if(!r)return c;let a=this._draft[g[e.day]],o=B(a)[e.idx],l=U(r,n),p=(u,_,m,v)=>d`<div class="time ${v?"":"fixed"}">
        <div><small>${u}</small><b>${_}</b></div>
        ${v?d`<div class="st">
              <button class="round tiny" @click=${()=>this._shift(m,-S)}>−</button>
              <button class="round tiny" @click=${()=>this._shift(m,S)}>+</button>
            </div>`:c}
      </div>`,h=d`
      <div class="times">
        ${p(t.from,E(o.start),"start",e.idx>0)}
        ${p(t.to,o.end===w?"24:00":E(o.end),"end",e.idx+1<a.length)}
      </div>
      <div class="chips">
        <button class="chip" aria-pressed=${r.variable===void 0}
          @click=${()=>this._setVariable(void 0)}>${t.fixed}</button>
        ${n.map(u=>d`<button class="chip" aria-pressed=${r.variable===u.id}
            @click=${()=>this._setVariable(u.id)}>
            <i class="sw" style="background:${$(u.value)}"></i>${u.name}
          </button>`)}
      </div>
      <div class="temp-row">
        <button class="round" @click=${()=>this._setTemp(-.5)}>−</button>
        <span class="temp-val">${f(l)}</span>
        <button class="round" @click=${()=>this._setTemp(.5)}>+</button>
      </div>
      ${this._copy?d`<div class="copy">
            <div class="muted small-text">${t.copy_day}</div>
            <div class="chips">
              ${t.days.map((u,_)=>d`<button class="chip" ?disabled=${_===e.day}
                  aria-pressed=${this._copy.has(_)} @click=${()=>this._toggleCopy(_)}>${u}</button>`)}
            </div>
            <div class="chips">
              <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4])}>${t.workdays}</button>
              <button class="chip" @click=${()=>this._copy=new Set([5,6])}>${t.weekend}</button>
              <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4,5,6])}>${t.all_days}</button>
              <span class="grow"></span>
              <button class="primary-btn" ?disabled=${![...this._copy].some(u=>u!==e.day)}
                @click=${this._applyCopy}>${t.copy}</button>
            </div>
          </div>`:c}
      <div class="acts">
        <button ?disabled=${o.end-o.start<2*S} @click=${this._split}>
          <ha-icon icon="mdi:call-split"></ha-icon>${t.split}
        </button>
        <button aria-pressed=${!!this._copy} @click=${()=>this._copy=this._copy?void 0:new Set}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t.copy_day_short}
        </button>
        <button ?disabled=${a.length<2} @click=${this._remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
        </button>
      </div>`;return this._sheet(t.days_long[e.day],h,()=>{this._sel=void 0,this._copy=void 0})}_renderVariablesSheet(){let e=this._t,t=this.snap?.variables??[],n=d`
      <div class="var-list">
        ${t.map(r=>d`<div class="var-row">
            <i class="sw" style="background:${$(r.value)}"></i>
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
      ${this._error?d`<div class="error">${this._error}</div>`:c}`;return this._sheet(e.variables,n,()=>this._vars=!1)}async _copyToRooms(){if(!this.room||!this._copyRooms?.size||this._dirty&&!confirm(this._t.copy_unsaved))return;let e=await this._call("schedule/copy_to_rooms",{entry_id:this.room.entry_id,schedule_id:this._sid,targets:[...this._copyRooms]});if(e){let t=[...e.created??[],...e.replaced??[]].join(", ");this._info=`${this._t.copied_to} ${t}`,this._copyRooms=new Set}}_renderCopyRoomsSheet(){let e=this._t,t=this.room?.schedules.find(o=>o.id===this._sid)?.name??"",n=(this.snap?.rooms??[]).filter(o=>o.entry_id!==this.room?.entry_id),r=o=>{let l=new Set(this._copyRooms);l.has(o)?l.delete(o):l.add(o),this._copyRooms=l},a=d`
      <div class="muted small-text">${e.copy_rooms_hint.replace("{name}",t)}</div>
      <div class="room-list">
        ${n.map(o=>{let l=this._copyRooms.has(o.entry_id),p=o.schedules.some(h=>h.name.toLowerCase()===t.toLowerCase());return d`<button class="room-pick ${l?"on":""}" @click=${()=>r(o.entry_id)}>
            <ha-icon icon=${l?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
            <span class="grow">${o.name}${o.floor?d` <span class="muted">· ${o.floor.name}</span>`:c}</span>
            <span class="muted small-text">${p?e.will_replace:e.will_create}</span>
          </button>`})}
      </div>
      ${this._info?d`<div class="info">${this._info}</div>`:c}
      ${this._error?d`<div class="error">${this._error}</div>`:c}
      <div class="sheet-actions">
        <button class="text-btn" @click=${()=>this._copyRooms=new Set(n.map(o=>o.entry_id))}>
          ${e.all_rooms}
        </button>
        <span class="grow"></span>
        <button class="primary-btn" ?disabled=${!this._copyRooms.size||this._busy} @click=${this._copyToRooms}>
          ${e.copy}
        </button>
      </div>`;return this._sheet(`${e.copy_to_rooms}: ${t}`,a,()=>{this._copyRooms=void 0,this._info=void 0})}_renderNameSheet(){let e=this._t,t=this._nameAction==="rename"?e.rename:this._nameAction==="duplicate"?e.duplicate:e.new_schedule,n=d`
      <input type="text" .value=${this._nameValue} placeholder=${e.name} aria-label=${t}
        @input=${r=>this._nameValue=r.target.value}
        @keydown=${r=>r.key==="Enter"&&this._submitName()} />
      ${this._error?d`<div class="error">${this._error}</div>`:c}
      <div class="sheet-actions">
        <button class="text-btn" @click=${()=>this._nameAction=void 0}>${e.cancel}</button>
        <button class="primary-btn" ?disabled=${!this._nameValue.trim()||this._busy} @click=${this._submitName}>
          ${e.ok}
        </button>
      </div>`;return this._sheet(t,n,()=>this._nameAction=void 0)}};ae.properties={hass:{attribute:!1},snap:{attribute:!1},room:{attribute:!1},_sid:{state:!0},_draft:{state:!0},_sel:{state:!0},_copy:{state:!0},_vars:{state:!0},_error:{state:!0},_nameAction:{state:!0},_busy:{state:!0},_drag:{state:!0},_menu:{state:!0},_copyRooms:{state:!0},_info:{state:!0}},ae.styles=[T,k`
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
    `];A("bt-week-editor",ae);function oe(s){let i=e=>String(e).padStart(2,"0");return`${s.getFullYear()}-${i(s.getMonth()+1)}-${i(s.getDate())}T${i(s.getHours())}:${i(s.getMinutes())}`}function bt(s){let i=new Date;return i.setMinutes(0,0,0),i.setHours(i.getHours()+s),i}var de=class extends x{constructor(){super(...arguments);this._initialized=!1;this._temp=21;this._startNow=!1;this._start=oe(bt(1));this._openEnd=!1;this._end=oe(bt(25));this._title="";this._busy=!1;this._onKey=e=>{e.key==="Escape"&&this._close()}}get _t(){return b(this.hass)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey)}willUpdate(){if(!this._initialized&&this.room&&this.period){this._initialized=!0;let e=this.period;e.schedule?this._what={kind:"schedule",id:e.schedule}:this._what={kind:"mode",mode:e.mode??"off"},e.temperature!=null&&(this._temp=e.temperature),this._startNow=!1,this._start=oe(new Date(e.start)),this._openEnd=!e.end,e.end&&(this._end=oe(new Date(e.end))),this._title=e.summary??""}if(!this._what&&this.room){let e=this.room.schedules.find(t=>t.id!==this.room.base_schedule);this._what=e?{kind:"schedule",id:e.id}:{kind:"mode",mode:"off"},this._temp=Math.round((this.room.target_temperature??21)*2)/2}}_close(){this.dispatchEvent(new CustomEvent("close"))}get _valid(){let e=this._t,t=this._startNow?new Date:new Date(this._start);if(!this._startNow&&Number.isNaN(t.getTime()))return e.period_invalid;if(!this._openEnd){let n=new Date(this._end);if(Number.isNaN(n.getTime())||n<=t||n<=new Date)return e.period_invalid}}async _save(){if(!this.hass||!this.room||!this._what)return;let e={entry_id:this.room.entry_id};this._what.kind==="schedule"?e.schedule_id=this._what.id:(e.mode=this._what.mode,this._what.mode==="heat"&&(e.temperature=this._temp));let t=!!this.period;this._startNow?t&&(e.start=oe(new Date)):e.start=this._start,this._openEnd?t&&(e.open_end=!0):e.end=this._end,t?(e.period_id=this.period.id,e.summary=this._title.trim()):this._title.trim()&&(e.summary=this._title.trim()),this._busy=!0,this._error=void 0;try{await D(this.hass,t?"period/update":"period/add",e),this._close()}catch(n){this._error=n?.message??String(n)}finally{this._busy=!1}}async _delete(){if(!(!this.hass||!this.room||!this.period)){this._busy=!0;try{await D(this.hass,"period/cancel",{entry_id:this.room.entry_id,period_id:this.period.id}),this._close()}catch(e){this._error=e?.message??String(e)}finally{this._busy=!1}}}_isWhat(e){let t=this._what;return!t||t.kind!==e.kind?!1:t.kind==="schedule"?t.id===e.id:t.mode===e.mode}render(){if(!this.room)return c;let e=this._t,t=this.room,n=this._valid,r=[["heat",e.heat],["off",e.off]];return d`
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
              ${t.schedules.map(a=>d`<button class="chip" aria-pressed=${this._isWhat({kind:"schedule",id:a.id})}
                  @click=${()=>this._what={kind:"schedule",id:a.id}}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${a.name}
                </button>`)}
              ${r.map(([a,o])=>d`<button class="chip" aria-pressed=${this._isWhat({kind:"mode",mode:a})}
                  @click=${()=>this._what={kind:"mode",mode:a}}>
                  <ha-icon icon=${a==="off"?"mdi:snowflake":"mdi:hand-back-right"}></ha-icon>${o}
                </button>`)}
            </div>
            ${this._what?.kind==="mode"&&this._what.mode==="heat"?d`<div class="temp-row">
                  <button class="round" @click=${()=>this._temp=Math.max(5,this._temp-.5)}>−</button>
                  <span class="temp-val">${f(this._temp)}</span>
                  <button class="round" @click=${()=>this._temp=Math.min(30,this._temp+.5)}>+</button>
                </div>`:c}
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
            ${this._startNow?c:d`<input type="datetime-local" step="900" .value=${this._start}
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
            ${this._openEnd?c:d`<input type="datetime-local" step="900" .value=${this._end}
                  @input=${a=>this._end=a.target.value} />`}
          </section>

          <section>
            <div class="label">${e.period_title} <span class="muted">(${e.optional})</span></div>
            <input type="text" .value=${this._title} placeholder=${e.period_title_hint}
              @input=${a=>this._title=a.target.value} />
          </section>
          ${this._error?d`<div class="error">${this._error}</div>`:c}
          ${n&&!this._error?d`<div class="muted small">${n}</div>`:c}
        </div>
        <footer>
          ${this.period?d`<button class="text-btn danger" ?disabled=${this._busy} @click=${this._delete}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>${this.period&&this.room?.period?.id===this.period.id?e.period_end:e.period_delete}
              </button>`:c}
          <span class="spacer"></span>
          <button class="text-btn" @click=${this._close}>${e.close}</button>
          <button class="primary-btn" ?disabled=${!!n||this._busy} @click=${this._save}>
            ${this.period?e.save:e.period_plan}
          </button>
        </footer>
      </div>
    `}};de.properties={hass:{attribute:!1},room:{attribute:!1},period:{attribute:!1},_what:{state:!0},_temp:{state:!0},_startNow:{state:!0},_start:{state:!0},_openEnd:{state:!0},_end:{state:!0},_title:{state:!0},_error:{state:!0},_busy:{state:!0}},de.styles=[T,k`
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
    `];A("bt-period-dialog",de);var K=class extends x{constructor(){super(...arguments);this._editing=!1;this._planning=!1;this._allPeriods=!1;this._batOpen=!1}static getConfigElement(){return document.createElement("bestthermostat-card-editor")}static getStubConfig(e){return{entity:Object.values(e.states).find(n=>n.entity_id.startsWith("climate.")&&n.attributes.room_id)?.entity_id??""}}setConfig(e){this._config={show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0,show_battery:!0,show_header:!0,...e}}set config(e){this.setConfig(e)}getCardSize(){return this._config?.compact?3:6}getGridOptions(){return this._config?.compact?{columns:6,rows:4,min_columns:4,min_rows:3}:{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),this._tick=window.setInterval(()=>this.requestUpdate(),6e4),this.hass&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,window.clearInterval(this._tick),this._editor?.remove(),this._editor=void 0,this._editing=!1,this._planner?.remove(),this._planner=void 0,this._planning=!1}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&this._subscribe()}updated(){let e=this._room;this._editing&&e&&this.hass?(this._editor||(this._editor=document.createElement("bt-week-editor"),this._editor.addEventListener("close",()=>this._editing=!1),document.body.appendChild(this._editor)),this._editor.hass=this.hass,this._editor.snap=this._snap,this._editor.room=e):this._editor&&(this._editor.remove(),this._editor=void 0),this._planning&&e&&this.hass?(this._planner||(this._planner=document.createElement("bt-period-dialog"),this._planner.addEventListener("close",()=>{this._planning=!1,this._editPeriod=void 0}),document.body.appendChild(this._planner)),this._planner.hass=this.hass,this._planner.room=e,this._planner.period=this._editPeriod):this._planner&&(this._planner.remove(),this._planner=void 0)}_subscribe(){this.hass&&(this._unsub=te(this.hass,e=>this._snap=e))}get _room(){return ht(this._snap,this._config?.entity)}async _call(e,t){if(this.hass)try{this._error=void 0,await D(this.hass,e,t)}catch(n){this._error=n?.message??String(n)}}_clampTemp(e,t){return Math.min(e.max_temp,Math.max(e.min_temp,Math.round(t*2)/2))}_swipeStart(e,t){let n=this._pending??t.target_temperature??20;ye(e,{onStep:r=>{this._swipe||(this._swipe={moved:!0});let a=this._clampTemp(t,n+r*.5);a!==this._pending&&(this._pending=a,window.clearTimeout(this._debounce),navigator.vibrate?.(5))},onEnd:r=>{this._swipe=void 0,r&&(this._pending!==void 0&&this._pending!==t.target_temperature?this._step(t,0):this._pending=void 0)}})}_step(e,t){let n=this._pending??e.target_temperature??20,r=this._clampTemp(e,n+t);this._pending=r,window.clearTimeout(this._debounce),this._debounce=window.setTimeout(async()=>{await this._call("room/temperature",{entry_id:e.entry_id,temperature:r}),this._pending=void 0},700)}_mode(e,t){this._call("room/mode",{entry_id:e.entry_id,mode:t})}_schedule(e,t){this._call("schedule/activate",{entry_id:e.entry_id,schedule_id:t})}_moreInfo(e){e.climate_entity_id&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.climate_entity_id},bubbles:!0,composed:!0}))}_openPeriod(e){this._editPeriod=e,this._planning=!0}_toggle(e){this._section=this._section===e?void 0:e}_renderUpdate(){let e=ve(this._snap?.version,q,b(this.hass));return e?d`<div class="update"><span>${e.text}</span>
          <button class="text-btn" @click=${()=>location.reload()}>${e.action}</button></div>`:c}render(){if(!this._config||!this.hass)return c;let e=b(this.hass);if(!this._snap)return d`<ha-card><div class="msg">${e.loading}</div></ha-card>`;let t=this._room;if(!t)return d`<ha-card><div class="msg">${e.not_found}</div></ha-card>`;let n=this._config,r=t.hvac_action==="heating",a=this._pending??t.target_temperature,o=n.name||t.name,l=[n.show_floor===!1?"":t.floor?.name,we(t,e,this.hass),r?e.heating:""].filter(Boolean).join(" \xB7 ");return d`
      <ha-card class="${n.compact?"compact":""} ${n.embedded?"embedded":""}">
        ${n.embedded?c:this._renderUpdate()}
        ${n.show_header===!1?c:d`<div class="head">
          <button class="icon ${r?"heating":""} ${t.mode==="off"?"off":""}"
            @click=${()=>this._moreInfo(t)}
            aria-label=${o}>
            <ha-icon icon=${xe(t)}></ha-icon>
          </button>
          <div class="title">
            <div class="name">${o}</div>
            <div class="sub muted">${l}</div>
          </div>
          ${n.show_battery?this._batteryChip(t):c}
          ${n.show_editor&&!(n.show_timeline&&!n.compact)?this._pencil():c}
        </div>`}
        ${n.show_header===!1&&n.show_battery&&re(t)?d`<div class="bat-line">${this._batteryChip(t)}</div>`:c}
        ${this._batOpen&&n.show_battery?this._batteryPanel(t):c}

        <div class="hero">
          <div class="current">
            <span class="big">${f(t.current_temperature,!1)}</span><span class="unit">°C</span>
          </div>
          <div class="ctl">
            <button class="round" @click=${()=>this._step(t,-.5)} aria-label="-0.5">−</button>
            <div class="target ${this._swipe?.moved?"swiping":""}" title=${e.swipe_hint}
              @pointerdown=${p=>this._swipeStart(p,t)}
              @touchstart=${p=>this._swipeStart(p,t)}>
              <div class="tv" style="--c:${$(a??void 0)}">${f(a,!1)}°</div>
              <div class="muted src">${[t.target_variable,e[`src_${t.target_source}`]].filter(Boolean).join(" \xB7 ")}</div>
            </div>
            <button class="round" @click=${()=>this._step(t,.5)} aria-label="+0.5">+</button>
          </div>
        </div>

        ${n.show_modes?this._renderModes(t):c}
        ${n.show_timeline&&!n.compact?this._renderTimeline(t):c}
        ${n.show_schedules&&t.schedules.length>1?this._renderScheduleChoice(t):c}
        ${n.compact?c:this._renderList(t)}
        ${this._error?d`<div class="error">${this._error}</div>`:c}
      </ha-card>
    `}_batteryChip(e){let t=e.batteries??[],n=re(e);if(!n)return c;let r=t.filter(l=>l.level!=null).map(l=>Math.round(l.level)),a=r.length?r.length<=3?`${r.join(" \xB7 ")} %`:`${Math.min(...r)} %`:"",o=b(this.hass);return d`<button class="bat-chip ${n.low?"low":""}" aria-expanded=${this._batOpen}
      title=${o.battery} @click=${()=>this._batOpen=!this._batOpen}>
      <ha-icon icon=${Ie(n.level,n.low)}></ha-icon>${a}
    </button>`}_batteryPanel(e){let t=b(this.hass);return d`<div class="bat-panel">
      ${(e.batteries??[]).map(n=>d`<button class="bat ${n.low?"low":""}" ?disabled=${!n.device_id}
          @click=${()=>n.device_id&&this._navigate(`/config/devices/device/${n.device_id}`)}>
          <ha-icon icon=${Ie(n.level,n.low)}></ha-icon>
          <span class="grow">${n.name}</span>
          <span class="bat-val">${n.level!=null?`${Math.round(n.level)} %`:n.low?t.battery_low:t.battery_ok}</span>
          ${n.device_id?d`<ha-icon class="go" icon="mdi:chevron-right"></ha-icon>`:c}
        </button>`)}
    </div>`}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_pencil(){let e=b(this.hass);return d`<button class="pencil" title=${e.edit} aria-label=${e.edit}
      @click=${()=>this._editing=!0}>
      <ha-icon icon="mdi:pencil"></ha-icon>
    </button>`}_renderModes(e){let t=b(this.hass),n=[["auto",t.auto],["heat",t.heat],["off",t.off]];return d`<div class="seg accent" role="tablist">
      ${n.map(([r,a])=>d`<button role="tab" aria-selected=${e.mode===r}
          @click=${()=>this._mode(e,r)}>${a}</button>`)}
    </div>`}_renderScheduleChoice(e){return d`<div class="seg" role="tablist">
      ${e.schedules.map(t=>d`<button role="tab" aria-selected=${t.id===e.active_schedule}
          @click=${()=>this._schedule(e,t.id)}>${t.name}</button>`)}
    </div>`}_renderTimeline(e){let t=b(this.hass),n=e.schedules.find(h=>h.id===e.active_schedule);if(!n)return c;let r=this._snap.variables,a=n.week?.[be()]??n.week?.[g[0]];if(!a?.length)return c;let o=B(a),l=ge(),p=e.mode!=="auto"||e.override_active;return d`<div class="timeline ${p?"paused":""}">
      <div class="cap muted">
        <span>${t.today} · ${n.name}${p?` \xB7 ${t.schedule_paused}`:""}</span>
        ${this._config.show_editor?this._pencil():c}
      </div>
      <div class="bar">
        ${o.map(h=>{let u=U(h.slot,r);return d`<div class="seg-t"
            title="${ie(h.slot,r)}"
            style="left:${h.start/w*100}%;width:${(h.end-h.start)/w*100}%;background:${$(u)}"></div>`})}
        <div class="now" style="left:${l/w*100}%"></div>
      </div>
      <div class="ticks muted"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`}_row(e,t,n,r,a){let o=r!==void 0&&this._section===r,l=r!==void 0||a!==void 0;return d`<button class="row ${o?"open":""}" ?disabled=${!l}
      @click=${()=>r?this._toggle(r):a?.()}>
      <ha-icon icon=${e}></ha-icon>
      <span class="row-label">${t}</span>
      <span class="row-value">${n}</span>
      ${l?d`<ha-icon class="chev" icon=${o?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>`:c}
    </button>`}_renderList(e){let t=this._config,n=b(this.hass),r=this.hass,a=se(e),o=e.period?e.period.title:a.length?`${a.length} ${n.period_planned_n}`:n.prio_none,l=gt(e,this._snap,n,r),p=l.layers.find(h=>h.n===l.winner);return d`<div class="list">
      ${t.show_periods?d`${this._row("mdi:calendar-star",n.period_plural,o,"periods")}
          ${this._section==="periods"?d`<div class="detail">${this._renderPeriods(e)}</div>`:c}`:c}
      ${t.show_priorities?d`${this._row("mdi:layers-triple-outline",n.prio_short,p.name,"prio")}
          ${this._section==="prio"?d`<div class="detail">${this._renderPriorities(l)}</div>`:c}`:c}
    </div>`}_renderPriorities(e){return d`<div class="prio">
      ${e.layers.map(t=>d`<div class="prio-row ${t.n===e.winner?"win":t.n<e.winner?"idle":"below"}">
          <span class="prio-n">${t.n}</span>
          <span class="prio-name">${t.name}</span>
          <span class="prio-val">${t.value}</span>
        </div>`)}
    </div>`}_renderPeriods(e){let t=b(this.hass),n=this.hass,r=e.period,a=se(e),o=this._allPeriods?a:a.slice(0,3),l=h=>`${y(h.start,n)} \u2013 ${h.end?y(h.end,n):t.period_open}`,p=(h,u)=>d`<div class="period ${u?"active":""}">
      <button class="period-text" @click=${()=>this._openPeriod(h)}>
        <span class="period-title">${h.title}</span>
        <span class="muted period-when">${u?h.end?`${t.period_until} ${y(h.end,n)}`:t.period_open:l(h)}</span>
      </button>
      <button class="text-btn small" @click=${()=>this._call("period/cancel",{entry_id:e.entry_id,period_id:h.id})}>
        ${u?t.period_end:t.period_delete}
      </button>
    </div>`;return d`<div class="periods">
      ${r?p(r,!0):c}
      ${o.map(h=>p(h,!1))}
      ${a.length>3?d`<button class="text-btn small" @click=${()=>this._allPeriods=!this._allPeriods}>
            ${this._allPeriods?t.period_less:`+${a.length-o.length} ${t.period_more}`}
          </button>`:c}
      <button class="text-btn plan" @click=${()=>{this._editPeriod=void 0,this._planning=!0}}>
        <ha-icon icon="mdi:calendar-plus"></ha-icon> ${t.period_plan}
      </button>
    </div>`}};K.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_pending:{state:!0},_editing:{state:!0},_planning:{state:!0},_editPeriod:{state:!0},_allPeriods:{state:!0},_section:{state:!0},_batOpen:{state:!0},_swipe:{state:!0},_error:{state:!0}},K.styles=[T,k`
      ha-card {
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
    `];var Ot={entity:{de:"Raum",en:"Room"},name:{de:"Name (optional)",en:"Name (optional)"},compact:{de:"Kompaktmodus (Wanddisplay)",en:"Compact mode (wall display)"},show_modes:{de:"Modi anzeigen",en:"Show modes"},show_schedules:{de:"Zeitpl\xE4ne anzeigen",en:"Show schedules"},show_timeline:{de:"Zeitleiste heute anzeigen",en:"Show today's timeline"},show_editor:{de:"Stift f\xFCr Wocheneditor",en:"Pencil for weekly editor"},show_periods:{de:"Zeitr\xE4ume anzeigen und planen",en:"Show and plan periods"},show_priorities:{de:"Priorit\xE4ten anzeigen",en:"Show priorities"},show_battery:{de:"Batteriesymbol anzeigen",en:"Show battery indicator"},title:{de:"Titel",en:"Title"},show_override:{de:"Globalen Override anzeigen",en:"Show global override"},show_variables:{de:"Variablen anzeigen",en:"Show variables"},group_by_floor:{de:"Nach Stockwerk gruppieren",en:"Group by floor"},layout:{de:"Darstellung",en:"Layout"},show_summary:{de:"Zusammenfassung anzeigen",en:"Show summary"},room:{de:"R\xE4ume (gilt f\xFCr alle)",en:"Rooms (applies to all)"},exclude_rooms:{de:"R\xE4ume ausblenden",en:"Hide rooms"}},Nt=[{name:"entity",required:!0,selector:{entity:{filter:{domain:"climate",integration:"bestthermostat"}}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"compact",selector:{boolean:{}}},{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}},{name:"show_battery",selector:{boolean:{}}}]}],Ht=[{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}},{name:"show_battery",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}}];function Lt(s){return[{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"box",options:[{value:"list",label:s?"Liste (Raum zum Aufklappen)":"List (tap to expand)"},{value:"tiles",label:s?"Kacheln (alle R\xE4ume offen)":"Tiles (all rooms open)"}]}}},{type:"grid",name:"",schema:[{name:"show_summary",selector:{boolean:{}}},{name:"show_override",selector:{boolean:{}}},{name:"show_variables",selector:{boolean:{}}},{name:"group_by_floor",selector:{boolean:{}}}]},{type:"expandable",name:"room",title:s?"R\xE4ume (gilt f\xFCr alle)":"Rooms (applies to all)",schema:[{type:"grid",name:"",schema:Ht}]},{name:"exclude_rooms",selector:{entity:{multiple:!0,filter:{domain:"climate",integration:"bestthermostat"}}}}]}var le=class extends x{constructor(){super(...arguments);this._label=e=>{let t=(this.hass?.locale?.language||this.hass?.language||"en").startsWith("de")?"de":"en";return Ot[e.name]?.[t]??e.name}}setConfig(e){let t=this.defaults,n=e;this._config={...t,...n,...t.room?{room:{...t.room,...n.room??{}}}:{}}}_changed(e){let t=e.detail.value;this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?c:d`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};le.properties={hass:{attribute:!1},_config:{state:!0}};var je=class extends le{constructor(){super(...arguments);this.defaults={compact:!1,show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0,show_battery:!0}}get schema(){return Nt}},Be=class extends le{constructor(){super(...arguments);this.defaults={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,group_by_floor:!0,room:{show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_battery:!0,show_editor:!0,compact:!1}}}get schema(){let e=this.hass?.locale?.language||this.hass?.language||"en";return Lt(e.startsWith("de"))}};A("bestthermostat-card-editor",je);A("bestthermostat-overview-card-editor",Be);var vt="bestthermostat.collapsedFloors",ce=5,$e=30,Ut={show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_editor:!0,show_battery:!0,compact:!1},F=class extends x{constructor(){super(...arguments);this._ovOpen=!1;this._varsOpen=!1;this._cardConfigs=new Map;this._collapsed=this._loadCollapsed();this._pending=new Map;this._timers=new Map;this._swipeConsumed=!1}static getConfigElement(){return document.createElement("bestthermostat-overview-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,show_periods:!0,group_by_floor:!0,...e,room:{...Ut,...e.show_periods===!1?{show_periods:!1}:{},...e.room??{}}},this._cardConfigs.clear()}_cardConfig(e,t){let n=`${e.entry_id}:${t}`,r=this._cardConfigs.get(n);return r||(r={type:"custom:bestthermostat-card",entity:e.climate_entity_id??e.entry_id,embedded:!0,show_header:t,show_floor:!this._config.group_by_floor,...this._config.room},this._cardConfigs.set(n,r)),r}getCardSize(){return 2+(this._snap?.rooms.length??2)}connectedCallback(){super.connectedCallback(),this.hass&&(this._unsub=te(this.hass,e=>this._snap=e))}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&(this._unsub=te(this.hass,t=>this._snap=t))}async _call(e,t){try{this._error=void 0,await D(this.hass,e,t)}catch(n){this._error=n?.message??String(n)}}_stepPending(e,t,n){let r=Math.min(30,Math.max(5,Math.round(t*2)/2));this._pending.set(e,r),this.requestUpdate(),window.clearTimeout(this._timers.get(e)),this._timers.set(e,window.setTimeout(async()=>{await n(r),this._pending.delete(e),this.requestUpdate()},600))}_swipeStart(e,t,n,r,a,o){let l=this._pending.get(t)??n;ye(e,{onStep:p=>{this._swipe={key:t,moved:!0};let h=Math.min(a,Math.max(r,Math.round((l+p*.5)*2)/2));h!==this._pending.get(t)&&(this._pending.set(t,h),window.clearTimeout(this._timers.get(t)),navigator.vibrate?.(5)),this.requestUpdate()},onEnd:async p=>{if(this._swipe=void 0,!p)return;this._swipeConsumed=!0,window.setTimeout(()=>this._swipeConsumed=!1,0);let h=this._pending.get(t);this.requestUpdate(),h!==void 0&&(await o(h),this._pending.delete(t),this.requestUpdate())}})}_swipeRoom(e,t){this._swipeStart(e,`room:${t.entry_id}`,t.target_temperature??20,t.min_temp,t.max_temp,n=>this._call("room/temperature",{entry_id:t.entry_id,temperature:n}))}_swipeOverride(e,t){this._swipeStart(e,"override",t??16,5,30,n=>this._call("override/set",{temperature:n}))}_consumeSwipe(){let e=this._swipeConsumed;return this._swipeConsumed=!1,e}_varStep(e,t,n){let r=`var:${e}`;this._stepPending(r,(this._pending.get(r)??t)+n,a=>this._call("variable/update",{variable_id:e,value:a}))}_loadCollapsed(){try{return new Set(JSON.parse(localStorage.getItem(vt)||"[]"))}catch{return new Set}}_toggleFloor(e){let t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t;try{localStorage.setItem(vt,JSON.stringify([...t]))}catch{}this.requestUpdate()}_floorIconNo(e){return e==null?"0":e<0?"negative-1":e>3?"3":String(e)}_heatingCount(e){return e.filter(t=>t.hvac_action==="heating").length}_renderTile(e){return d`<div class="tile">
      <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!0)}></bestthermostat-card>
    </div>`}_groups(e){if(!this._config?.group_by_floor||!e.some(n=>n.floor))return[{floor:null,rooms:e}];let t=new Map;for(let n of e){let r=n.floor?.id??"";t.has(r)||t.set(r,{floor:n.floor,rooms:[]}),t.get(r).rooms.push(n)}return[...t.values()].sort((n,r)=>{if(!n.floor)return 1;if(!r.floor)return-1;let a=n.floor.level??999,o=r.floor.level??999;return a!==o?a-o:n.floor.name.localeCompare(r.floor.name)})}_renderUpdate(){let e=ve(this._snap?.version,q,b(this.hass));return e?d`<div class="update"><span>${e.text}</span>
          <button class="text-btn" @click=${()=>location.reload()}>${e.action}</button></div>`:c}render(){if(!this._config||!this.hass)return c;let e=b(this.hass),t=this._snap;if(!t)return d`<ha-card><div class="pad">${e.loading}</div></ha-card>`;let n=t.rooms.filter(m=>m.hvac_action==="heating").length,r=t.rooms.map(m=>m.current_temperature).filter(m=>m!=null),a=r.length?r.reduce((m,v)=>m+v,0)/r.length:null,o=new Set(this._config.exclude_rooms??[]),l=t.rooms.filter(m=>!o.has(m.climate_entity_id??"")&&!o.has(m.entry_id)),p=this._groups(l),h=p.length>1||p[0]?.floor,u=this._config.layout==="tiles",_=this._config.title??e.rooms;return d`<ha-card>
      <div class="pad col">
        ${this._renderUpdate()}
        ${_||this._config.show_summary?d`<div>
              ${_?d`<div class="title">${_}</div>`:c}
              ${this._config.show_summary?d`<div class="muted summary">
                    ${n} ${e.of} ${t.rooms.length} ${e.rooms_word} ${e.heating_summary}${a!=null?d` · Ø ${f(a)}`:c}
                  </div>`:c}
            </div>`:c}
        <div class="top">
          ${this._config.show_override?this._renderOverride():c}
          ${this._config.show_variables&&t.variables.length?this._renderVariables():c}
        </div>
        <div class="rooms">
          ${p.map(m=>{let v=m.floor?.id??"_other",V=h&&this._collapsed.has(v),R=h?_t(m.rooms):void 0;return d`${h?d`<button class="floor" aria-expanded=${!V} @click=${()=>this._toggleFloor(v)}>
                      <ha-icon icon=${m.floor?.icon||"mdi:home-floor-"+this._floorIconNo(m.floor?.level)}></ha-icon>
                      <span>${m.floor?.name??e.other_floor}</span>
                      ${this._heatingCount(m.rooms)?d`<span class="floor-heat">· ${this._heatingCount(m.rooms)} ${e.heating_summary}</span>`:c}
                      <span class="floor-next">${R?`${e.until} ${y(R.time,this.hass)}, ${e.then} ${f(R.temp,!1)}\xB0`:""}</span>
                      <ha-icon class="floor-chev" icon=${V?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>
                    </button>`:c}
                ${V?c:d`<div class="grid ${u?"tiles":""}">
                      ${m.rooms.map(Se=>u?this._renderTile(Se):this._renderRoom(Se,!!R&&We(Se)))}
                    </div>`}`})}
        </div>
        ${this._error?d`<div class="error">${this._error}</div>`:c}
      </div>
    </ha-card>`}_renderOverride(){let e=b(this.hass),t=this._snap.override,n=this._ovOpen,r=this._pending.get("override")??t.value,a=o=>this._stepPending("override",(r??16)+o,l=>this._call("override/set",{temperature:l}));return d`<div class="box ${t.active?"on":""}">
      <div class="box-head">
        <span class="box-label">
          <ha-icon icon="mdi:home-export-outline"></ha-icon>
          <span>${e.override}</span>
        </span>
        <button class="value-btn swipeable ${n?"open":""} ${this._swipe?.key==="override"&&this._swipe.moved?"swiping":""}"
          title=${e.swipe_hint}
          @pointerdown=${o=>this._swipeOverride(o,r)}
          @touchstart=${o=>this._swipeOverride(o,r)}
          @click=${()=>{this._consumeSwipe()||(this._ovOpen=!this._ovOpen)}}
          aria-expanded=${n}>
          ${f(r)}
          <ha-icon icon=${n?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        <button class="switch ${t.active?"on":""}" role="switch" aria-checked=${t.active}
          aria-label=${e.override} @click=${()=>this._call("override/set",{active:!t.active})}>
          <span></span>
        </button>
      </div>
      ${n?d`<div class="box-body">
            ${this._renderOverrideSlider(r,a)}
            <div class="also">
              <span class="muted">${e.override_also}</span>
              ${[["include_manual",t.include_manual,e.heat],["include_off",t.include_off,e.off]].map(([o,l,p])=>d`<button class="mini ${l?"on":""}"
                  @click=${()=>this._call("override/set",{[o]:!l})}>${p}</button>`)}
            </div>
          </div>`:c}
    </div>`}_renderOverrideSlider(e,t){let n=b(this.hass),r=this._snap.override,a=[...this._snap.variables].sort((p,h)=>p.value-h.value),o=e??16,l=p=>(Math.min($e,Math.max(ce,p))-ce)/($e-ce)*100;return d`<div class="ov-slider" style="--thumb:${$(o)}">
      <div class="ov-value">
        <button class="round small" aria-label="-0.5" @click=${()=>t(-.5)}>−</button>
        <span class="big-val swipeable ${this._swipe?.key==="override"&&this._swipe.moved?"swiping":""}"
          title=${n.swipe_hint}
          @pointerdown=${p=>this._swipeOverride(p,e)}
          @touchstart=${p=>this._swipeOverride(p,e)}>
          ${f(o,!1)}<small>°C</small>
        </span>
        <button class="round small" aria-label="+0.5" @click=${()=>t(.5)}>+</button>
      </div>
      <div class="track">
        <input type="range" min=${ce} max=${$e} step="0.5" .value=${String(o)}
          aria-label=${n.override}
          style="background:${mt(ce,$e)}"
          @input=${p=>{this._pending.set("override",Number(p.target.value)),window.clearTimeout(this._timers.get("override")),this.requestUpdate()}}
          @change=${async p=>{let h=Number(p.target.value);await this._call("override/set",{temperature:h}),this._pending.delete("override"),this.requestUpdate()}} />
        ${a.map(p=>d`<i class="tick" style="left:${l(p.value)}%" title=${p.name}></i>`)}
      </div>
      <div class="scale muted">${[5,10,15,20,25,30].map(p=>d`<span>${p}°</span>`)}</div>
      ${a.length?d`<div class="quick">
            ${a.map(p=>d`<button class="mini q ${r.variable===p.id?"on":""}"
                @click=${()=>this._call("override/set",{variable:p.id})}>
                <span class="dot" style="background:${$(p.value)}"></span>${p.name}
                <b>${f(p.value,!1)}°</b>
              </button>`)}
          </div>`:c}
    </div>`}_renderVariables(){let e=b(this.hass),t=this._snap.variables;return d`<div>
      <button class="vars-line" @click=${()=>this._varsOpen=!this._varsOpen}>
        <span class="vars-text">
          ${t.map((n,r)=>d`${r?d`<span class="sep">·</span>`:c}<span>${n.name}
                <b>${f(n.value,!1)}°</b></span>`)}
        </span>
        <ha-icon icon=${this._varsOpen?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>
      </button>
      ${this._varsOpen?d`<div class="var-list">
            ${t.map(n=>d`<div class="var-row">
                <span class="dot" style="background:${$(n.value)}"></span>
                <span class="grow">${n.name}</span>
                <button class="round small" @click=${()=>this._varStep(n.id,n.value,-.5)}>−</button>
                <span class="val">${f(this._pending.get(`var:${n.id}`)??n.value)}</span>
                <button class="round small" @click=${()=>this._varStep(n.id,n.value,.5)}>+</button>
              </div>`)}
            <div class="muted hint">${e.variables_note}</div>
          </div>`:c}
    </div>`}_renderRoom(e,t=!1){let n=b(this.hass),r=this.hass,a=e.hvac_action==="heating",o=this._open===e.entry_id,l=this._config?.room?.show_periods?se(e)[0]:void 0;return d`<div class="room-block ${o?"open":""}">
      <button class="room" @click=${()=>{this._consumeSwipe()||(this._open=o?void 0:e.entry_id)}}>
        <span class="icon ${a?"heating":""} ${e.mode==="off"?"off":""}">
          <ha-icon icon=${xe(e)}></ha-icon>
        </span>
        <span class="grow left">
          <span class="name">${e.name}${this._config?.room?.show_battery&&re(e)?.low?d`<ha-icon class="bat-low" icon="mdi:battery-alert-variant-outline"
                title=${n.battery_low}></ha-icon>`:c}</span>
          <span class="muted sub">${we(e,n,r,t)}</span>
          ${l?d`<span class="muted sub planned">
                <ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${l.title} · ${n.period_from}
                ${y(l.start,r)}
              </span>`:c}
        </span>
        <span class="temps swipeable ${this._swipe?.key===`room:${e.entry_id}`&&this._swipe.moved?"swiping":""}"
          title=${n.swipe_hint}
          @pointerdown=${p=>this._swipeRoom(p,e)}
          @touchstart=${p=>this._swipeRoom(p,e)}>
          <span class="cur">${f(e.current_temperature,!1)}°</span>
          ${this._pending.has(`room:${e.entry_id}`)?d`<span class="tgt live">→ ${f(this._pending.get(`room:${e.entry_id}`),!1)}°</span>`:e.current_temperature==null||e.target_temperature==null||Math.abs(e.current_temperature-e.target_temperature)>=.5?d`<span class="muted tgt">→ ${f(e.target_temperature,!1)}°</span>`:c}
        </span>
      </button>
      ${o?d`<div class="detail">
            <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!1)}></bestthermostat-card>
          </div>`:c}
    </div>`}};F.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_error:{state:!0},_open:{state:!0},_ovOpen:{state:!0},_varsOpen:{state:!0}},F.styles=[T,k`
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
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        padding: 0 2px;
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
    `];A("bestthermostat-card",K);A("bestthermostat-overview-card",F);var ke=window;ke.customCards=ke.customCards||[];var qe=(document.documentElement.lang||navigator.language||"").startsWith("de"),Vt=[{type:"bestthermostat-card",name:"Best Thermostat",description:qe?"Raumthermostat mit Zeitpl\xE4nen und Wocheneditor":"Room thermostat with schedules and weekly editor",preview:!0,documentationURL:"https://github.com/zitroaen/bestthermostat"},{type:"bestthermostat-overview-card",name:qe?"Best Thermostat \xDCbersicht":"Best Thermostat Overview",description:qe?"Alle R\xE4ume, globaler Override und Variablen":"All rooms, global override and variables",preview:!0}];for(let s of Vt)ke.customCards.some(i=>i?.type===s.type)||ke.customCards.push(s);console.info(`%c BEST-THERMOSTAT %c ${q} `,"background:#ff8100;color:#fff","");
