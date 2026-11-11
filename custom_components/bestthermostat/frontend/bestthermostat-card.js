var re=globalThis,ae=re.ShadowRoot&&(re.ShadyCSS===void 0||re.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),ze=new WeakMap,j=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(ae&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=ze.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&ze.set(e,i))}return i}toString(){return this.cssText}},Me=n=>new j(typeof n=="string"?n:n+"",void 0,me),y=(n,...i)=>{let e=n.length===1?n[0]:i.reduce((t,s,r)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new j(e,n,me)},Te=(n,i)=>{if(ae)n.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),s=re.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,n.appendChild(t)}},_e=ae?n=>n:n=>n instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return Me(e)})(n):n;var{is:rt,defineProperty:at,getOwnPropertyDescriptor:ot,getOwnPropertyNames:dt,getOwnPropertySymbols:lt,getPrototypeOf:ct}=Object,oe=globalThis,Ne=oe.trustedTypes,pt=Ne?Ne.emptyScript:"",ht=oe.reactiveElementPolyfillSupport,B=(n,i)=>n,fe={toAttribute(n,i){switch(i){case Boolean:n=n?pt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,i){let e=n;switch(i){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Oe=(n,i)=>!rt(n,i),He={attribute:!0,type:String,converter:fe,reflect:!1,useDefault:!1,hasChanged:Oe};Symbol.metadata??=Symbol("metadata"),oe.litPropertyMetadata??=new WeakMap;var k=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=He){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(i,t,e);s!==void 0&&at(this.prototype,i,s)}}static getPropertyDescriptor(i,e,t){let{get:s,set:r}=ot(this.prototype,i)??{get(){return this[e]},set(a){this[e]=a}};return{get:s,set(a){let l=s?.call(this);r?.call(this,a),this.requestUpdate(i,l,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??He}static _$Ei(){if(this.hasOwnProperty(B("elementProperties")))return;let i=ct(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(B("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(B("properties"))){let e=this.properties,t=[...dt(e),...lt(e)];for(let s of t)this.createProperty(s,e[s])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let s of t)e.unshift(_e(s))}else i!==void 0&&e.push(_e(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Te(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,t);if(s!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:fe).toAttribute(e,t.type);this._$Em=i,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(i,e){let t=this.constructor,s=t._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let r=t.getPropertyOptions(s),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:fe;this._$Em=s;let l=a.fromAttribute(e,r.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(i,e,t,s=!1,r){if(i!==void 0){let a=this.constructor;if(s===!1&&(r=this[i]),t??=a.getPropertyOptions(i),!((t.hasChanged??Oe)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(i)&&!this.hasAttribute(a._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:s,wrapped:r},a){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,a??e??this[i]),r!==!0||a!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,r]of t){let{wrapped:a}=r,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,r,l)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[B("elementProperties")]=new Map,k[B("finalized")]=new Map,ht?.({ReactiveElement:k}),(oe.reactiveElementVersions??=[]).push("2.1.2");var we=globalThis,Le=n=>n,de=we.trustedTypes,Ve=de?de.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ge="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,Ke="?"+E,ut=`<${Ke}>`,z=document,K=()=>z.createComment(""),F=n=>n===null||typeof n!="object"&&typeof n!="function",ke=Array.isArray,mt=n=>ke(n)||typeof n?.[Symbol.iterator]=="function",ge=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ue=/-->/g,Ie=/>/g,R=RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),We=/'/g,je=/"/g,Fe=/^(?:script|style|textarea|title)$/i,Se=n=>(i,...e)=>({_$litType$:n,strings:i,values:e}),o=Se(1),Rt=Se(2),Pt=Se(3),M=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Be=new WeakMap,P=z.createTreeWalker(z,129);function Ze(n,i){if(!ke(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ve!==void 0?Ve.createHTML(i):i}var _t=(n,i)=>{let e=n.length-1,t=[],s,r=i===2?"<svg>":i===3?"<math>":"",a=G;for(let l=0;l<e;l++){let c=n[l],p,h,u=-1,v=0;for(;v<c.length&&(a.lastIndex=v,h=a.exec(c),h!==null);)v=a.lastIndex,a===G?h[1]==="!--"?a=Ue:h[1]!==void 0?a=Ie:h[2]!==void 0?(Fe.test(h[2])&&(s=RegExp("</"+h[2],"g")),a=R):h[3]!==void 0&&(a=R):a===R?h[0]===">"?(a=s??G,u=-1):h[1]===void 0?u=-2:(u=a.lastIndex-h[2].length,p=h[1],a=h[3]===void 0?R:h[3]==='"'?je:We):a===je||a===We?a=R:a===Ue||a===Ie?a=G:(a=R,s=void 0);let m=a===R&&n[l+1].startsWith("/>")?" ":"";r+=a===G?c+ut:u>=0?(t.push(p),c.slice(0,u)+Ge+c.slice(u)+E+m):c+E+(u===-2?l:m)}return[Ze(n,r+(n[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},Z=class n{constructor({strings:i,_$litType$:e},t){let s;this.parts=[];let r=0,a=0,l=i.length-1,c=this.parts,[p,h]=_t(i,e);if(this.el=n.createElement(p,t),P.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=P.nextNode())!==null&&c.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(Ge)){let v=h[a++],m=s.getAttribute(u).split(E),w=/([.?@])?(.*)/.exec(v);c.push({type:1,index:r,name:w[2],strings:m,ctor:w[1]==="."?ve:w[1]==="?"?xe:w[1]==="@"?$e:O}),s.removeAttribute(u)}else u.startsWith(E)&&(c.push({type:6,index:r}),s.removeAttribute(u));if(Fe.test(s.tagName)){let u=s.textContent.split(E),v=u.length-1;if(v>0){s.textContent=de?de.emptyScript:"";for(let m=0;m<v;m++)s.append(u[m],K()),P.nextNode(),c.push({type:2,index:++r});s.append(u[v],K())}}}else if(s.nodeType===8)if(s.data===Ke)c.push({type:2,index:r});else{let u=-1;for(;(u=s.data.indexOf(E,u+1))!==-1;)c.push({type:7,index:r}),u+=E.length-1}r++}}static createElement(i,e){let t=z.createElement("template");return t.innerHTML=i,t}};function H(n,i,e=n,t){if(i===M)return i;let s=t!==void 0?e._$Co?.[t]:e._$Cl,r=F(i)?void 0:i._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(i=H(n,s._$AS(n,i.values),s,t)),i}var be=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,s=(i?.creationScope??z).importNode(e,!0);P.currentNode=s;let r=P.nextNode(),a=0,l=0,c=t[0];for(;c!==void 0;){if(a===c.index){let p;c.type===2?p=new q(r,r.nextSibling,this,i):c.type===1?p=new c.ctor(r,c.name,c.strings,this,i):c.type===6&&(p=new ye(r,this,i)),this._$AV.push(p),c=t[++l]}a!==c?.index&&(r=P.nextNode(),a++)}return P.currentNode=z,s}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},q=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=H(this,i,e),F(i)?i===d||i==null||i===""?(this._$AH!==d&&this._$AR(),this._$AH=d):i!==this._$AH&&i!==M&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):mt(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==d&&F(this._$AH)?this._$AA.nextSibling.data=i:this.T(z.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,s=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=Z.createElement(Ze(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new be(s,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(i){let e=Be.get(i.strings);return e===void 0&&Be.set(i.strings,e=new Z(i)),e}k(i){ke(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let r of i)s===e.length?e.push(t=new n(this.O(K()),this.O(K()),this,this.options)):t=e[s],t._$AI(r),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=Le(i).nextSibling;Le(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,s,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=i,this.name=e,this._$AM=s,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=d}_$AI(i,e=this,t,s){let r=this.strings,a=!1;if(r===void 0)i=H(this,i,e,0),a=!F(i)||i!==this._$AH&&i!==M,a&&(this._$AH=i);else{let l=i,c,p;for(i=r[0],c=0;c<r.length-1;c++)p=H(this,l[t+c],e,c),p===M&&(p=this._$AH[c]),a||=!F(p)||p!==this._$AH[c],p===d?i=d:i!==d&&(i+=(p??"")+r[c+1]),this._$AH[c]=p}a&&!s&&this.j(i)}j(i){i===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},ve=class extends O{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===d?void 0:i}},xe=class extends O{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==d)}},$e=class extends O{constructor(i,e,t,s,r){super(i,e,t,s,r),this.type=5}_$AI(i,e=this){if((i=H(this,i,e,0)??d)===M)return;let t=this._$AH,s=i===d&&t!==d||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,r=i!==d&&(t===d||s);s&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},ye=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){H(this,i)}};var ft=we.litHtmlPolyfillSupport;ft?.(Z,q),(we.litHtmlVersions??=[]).push("3.3.3");var qe=(n,i,e)=>{let t=e?.renderBefore??i,s=t._$litPart$;if(s===void 0){let r=e?.renderBefore??null;t._$litPart$=s=new q(i.insertBefore(K(),r),r,void 0,e??{})}return s._$AI(n),s};var Ae=globalThis,g=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=qe(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};g._$litElement$=!0,g.finalized=!0,Ae.litElementHydrateSupport?.({LitElement:g});var gt=Ae.litElementPolyfillSupport;gt?.({LitElement:g});(Ae.litElementVersions??=[]).push("4.2.2");var Ye="bestthermostat",f=["mon","tue","wed","thu","fri","sat","sun"],le,L,Je,ce=new Set;function J(n,i){return ce.add(i),le&&i(le),(!L||Je!==n.connection)&&(Je=n.connection,L=n.connection.subscribeMessage(e=>{le=e,ce.forEach(t=>t(e))},{type:`${Ye}/subscribe`}).catch(e=>(console.error("Best Thermostat: subscription failed",e),L=void 0,()=>{}))),()=>{if(ce.delete(i),ce.size===0&&L){let e=L;L=void 0,le=void 0,e.then(t=>t())}}}function S(n,i,e={}){return n.callWS({type:`${Ye}/${i}`,...e})}function Xe(n,i){if(!(!n||!i))return n.rooms.find(e=>e.climate_entity_id===i||e.entry_id===i)}var C=y`
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
`;var V=15,x=1440;function Y(n){let[i,e]=n.split(":").map(Number);return i*60+e}function D(n){let i=Math.floor(n/60),e=n%60;return`${String(i).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function Ee(n){return Math.round(n/V)*V}function N(n,i){return n.variable!==void 0?i.find(e=>e.id===n.variable)?.value:n.temperature}function X(n,i){if(n.variable!==void 0){let e=i.find(t=>t.id===n.variable);return e?e.name:n.variable}return _(n.temperature)}function _(n,i=!0){if(n==null||Number.isNaN(n))return"\u2013";let e=(Math.round(n*2)/2).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1});return i?`${e} \xB0C`:e}var T=[[12,[90,140,220]],[16,[120,180,235]],[18,[150,210,200]],[19.5,[250,215,110]],[21,[255,175,85]],[23,[250,125,70]],[26,[225,75,60]]];function A(n){if(n===void 0)return"var(--disabled-color, #9e9e9e)";if(n<=T[0][0])return`rgb(${T[0][1].join(",")})`;for(let i=1;i<T.length;i++){let[e,t]=T[i];if(n<=e){let[s,r]=T[i-1],a=(n-s)/(e-s);return`rgb(${r.map((l,c)=>Math.round(l+(t[c]-l)*a)).join(",")})`}}return`rgb(${T[T.length-1][1].join(",")})`}function Q(n){return JSON.parse(JSON.stringify(n))}function Ce(n,i){return JSON.stringify(n)===JSON.stringify(i)}function U(n){return n.map((i,e)=>({start:Y(i.start),end:e+1<n.length?Y(n[e+1].start):x,slot:i}))}function et(){let n=new Date;return n.getHours()*60+n.getMinutes()}function tt(){return f[(new Date().getDay()+6)%7]}function $(n,i){if(!n)return"";let e=new Date(n),t=i.locale?.language||i.language,s=new Date,r=e.toLocaleTimeString(t,{hour:"2-digit",minute:"2-digit"});return e.toDateString()===s.toDateString()?r:`${e.toLocaleDateString(t,{weekday:"short"})} ${r}`}var Qe={de:{auto:"Auto",heat:"Manuell",off:"Aus",schedule:"Zeitplan",schedules:"Zeitpl\xE4ne",edit:"Wochenplan bearbeiten",schedule_paused:"pausiert",period:"Zeitraum",period_until:"bis",period_open:"bis auf Weiteres",period_planned:"Geplant",period_from:"ab",period_end:"Beenden",period_delete:"L\xF6schen",period_plan:"Zeitraum planen",period_edit:"Zeitraum bearbeiten",period_less:"weniger anzeigen",period_what:"Was soll gelten?",period_start:"Beginn",period_end_label:"Ende",period_now:"Jetzt",period_at:"Zeitpunkt",period_title:"Titel",period_title_hint:"z. B. Besuch von Oma",period_invalid:"Bitte g\xFCltigen Beginn und ein Ende in der Zukunft nach dem Beginn w\xE4hlen.",period_more:"weitere geplant",optional:"optional",prio_title:"Priorit\xE4ten",prio_short:"Priorit\xE4t",swipe_hint:"Zum \xC4ndern waagerecht wischen",today:"Heute",period_plural:"Zeitr\xE4ume",period_planned_n:"geplant",heating_summary:"heizen",of:"von",rooms_word:"R\xE4umen",other_floor:"Weitere",open_details:"Details",prio_hand:"\xC4nderung von Hand",prio_room:"Raum",prio_inactive:"aus",prio_none:"keine",until:"bis",next:"N\xE4chster Wechsel",src_override:"Globaler Override",src_off:"Frostschutz",src_manual:"Manuell",src_hand:"Ge\xE4ndert",src_schedule:"Zeitplan",heating:"Heizt",idle:"Bereit",save:"Speichern",discard:"Verwerfen",close:"Schlie\xDFen",new_schedule:"Neuer Zeitplan",rename:"Umbenennen",duplicate:"Duplizieren",delete:"L\xF6schen",activate:"Aktivieren",active:"Aktiv",split:"Teilen",copy_day:"Tag kopieren auf \u2026",copy:"Kopieren",workdays:"Mo\u2013Fr",all_days:"Alle",fixed:"Fest",variables:"Variablen",add_variable:"Variable hinzuf\xFCgen",name:"Name",value:"Wert",unsaved:"Ungespeicherte \xC4nderungen verwerfen?",confirm_delete:"Zeitplan wirklich l\xF6schen?",tap_hint:"Tippe auf einen Abschnitt zum Bearbeiten, ziehe die Grenzen zum Verschieben.",days:["Mo","Di","Mi","Do","Fr","Sa","So"],not_found:"Raum nicht gefunden. Bitte in der Kartenkonfiguration einen Best-Thermostat-Raum w\xE4hlen.",loading:"Lade \u2026",override:"Globaler Override",override_also:"Gilt auch f\xFCr",override_not_applied:"Override gilt hier nicht",rooms:"R\xE4ume",variables_note:"Variablen gelten f\xFCr alle R\xE4ume und werden sofort gespeichert."},en:{auto:"Auto",heat:"Manual",off:"Off",schedule:"Schedule",schedules:"Schedules",edit:"Edit weekly plan",schedule_paused:"paused",period:"Period",period_until:"until",period_open:"until cancelled",period_planned:"Planned",period_from:"from",period_end:"End",period_delete:"Delete",period_plan:"Plan period",period_edit:"Edit period",period_less:"show less",period_what:"What should apply?",period_start:"Start",period_end_label:"End",period_now:"Now",period_at:"At",period_title:"Title",period_title_hint:"e.g. Grandma visiting",period_invalid:"Please choose a valid start and an end in the future after the start.",period_more:"more planned",optional:"optional",prio_title:"Priorities",prio_short:"Priority",swipe_hint:"Swipe horizontally to change",today:"Today",period_plural:"Periods",period_planned_n:"planned",heating_summary:"heating",of:"of",rooms_word:"rooms",other_floor:"Other",open_details:"Details",prio_hand:"Hand change",prio_room:"Room",prio_inactive:"off",prio_none:"none",until:"until",next:"Next change",src_override:"Global override",src_off:"Frost protection",src_manual:"Manual",src_hand:"Changed",src_schedule:"Schedule",heating:"Heating",idle:"Idle",save:"Save",discard:"Discard",close:"Close",new_schedule:"New schedule",rename:"Rename",duplicate:"Duplicate",delete:"Delete",activate:"Activate",active:"Active",split:"Split",copy_day:"Copy day to \u2026",copy:"Copy",workdays:"Mon\u2013Fri",all_days:"All",fixed:"Fixed",variables:"Variables",add_variable:"Add variable",name:"Name",value:"Value",unsaved:"Discard unsaved changes?",confirm_delete:"Really delete this schedule?",tap_hint:"Tap a block to edit it, drag the borders to move them.",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],not_found:"Room not found. Please select a Best Thermostat room in the card configuration.",loading:"Loading \u2026",override:"Global override",override_also:"Also applies to",override_not_applied:"override not applied here",rooms:"Rooms",variables_note:"Variables apply to all rooms and are saved immediately."}};function b(n){return(n?.locale?.language||n?.language||"en").slice(0,2)==="de"?Qe.de:Qe.en}function it(n,i){return n.schedules.find(e=>e.id===i)?.name??i}function pe(n){return n.override_active?"mdi:home-export-outline":n.period?"mdi:calendar-star":n.mode==="off"?"mdi:radiator-off":n.mode==="heat"||n.target_source==="hand"?"mdi:hand-back-right":"mdi:radiator"}function he(n,i,e){if(n.override_active)return i.src_override;if(n.target_source==="hand"&&n.hand_until)return`${i.src_hand} \xB7 ${i.until} ${$(n.hand_until,e)}`;if(n.period){let s=n.period.end?`${i.period_until} ${$(n.period.end,e)}`:i.period_open;return`${n.period.title} \xB7 ${s}`}if(n.mode==="off")return i.src_off;if(n.mode==="heat")return i.src_manual;let t=it(n,n.active_schedule);return n.next_change?`${t} \xB7 ${$(n.next_change,e)} \u2192 ${_(n.next_temperature)}`:t}function st(n,i,e,t){let s=i.override,r=n.override_active?1:n.target_source==="hand"?2:n.period?3:4,a=n.base_mode==="off"?`${e.src_off} \xB7 ${_(n.frost_temperature)}`:n.base_mode==="heat"?`${e.heat} \xB7 ${_(n.base_manual_temperature)}`:`${e.auto} \xB7 ${it(n,n.base_schedule)}`;return{layers:[{n:1,icon:"mdi:home-export-outline",name:e.override,value:s.active?n.override_active?_(s.value):`${_(s.value)} \xB7 ${e.override_not_applied}`:e.prio_inactive},{n:2,icon:"mdi:hand-back-right",name:e.prio_hand,value:n.target_source==="hand"&&n.hand_until?`${_(n.target_temperature)} \xB7 ${e.until} ${$(n.hand_until,t)}`:e.prio_none},{n:3,icon:"mdi:calendar-star",name:e.period,value:n.period?`${n.period.title} \xB7 ${n.period.end?`${e.period_until} ${$(n.period.end,t)}`:e.period_open}`:e.prio_none},{n:4,icon:"mdi:radiator",name:e.prio_room,value:a}],winner:r}}function ee(n){let i=Date.now();return(n.periods??[]).filter(e=>new Date(e.start).getTime()>i).sort((e,t)=>new Date(e.start).getTime()-new Date(t.start).getTime())}var te=class extends g{constructor(){super(...arguments);this._vars=!1;this._busy=!1;this._newVarName="";this._newVarValue=20;this._nameValue="";this._onKey=e=>{e.key==="Escape"&&this._close()}}get _t(){return b(this.hass)}get _server(){return this.room?.schedules.find(e=>e.id===this._sid)?.week}get _dirty(){return!!this._draft&&!!this._server&&!Ce(this._draft,this._server)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey),document.documentElement.style.overflow="hidden"}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey),document.documentElement.style.overflow=""}willUpdate(e){this.room&&(this._sid||(this._sid=this.room.active_schedule),(e.has("room")||!this._draft)&&this._server&&(!this._draft||!this._dirtyAgainst(e))&&(this._draft=Q(this._server)))}_dirtyAgainst(e){let s=e.get("room")?.schedules.find(r=>r.id===this._sid)?.week;return!!s&&!!this._draft&&!Ce(this._draft,s)}_close(){this._dirty&&!confirm(this._t.unsaved)||this.dispatchEvent(new CustomEvent("close"))}async _call(e,t){if(this.hass){this._busy=!0,this._error=void 0;try{return await S(this.hass,e,t)}catch(s){this._error=s?.message??String(s);return}finally{this._busy=!1}}}_selectSchedule(e){e!==this._sid&&(this._dirty&&!confirm(this._t.unsaved)||(this._sid=e,this._draft=this._server?Q(this._server):void 0,this._sel=void 0,this._copy=void 0))}_startName(e){let t=this.room?.schedules.find(s=>s.id===this._sid)?.name??"";this._nameAction=e,this._nameValue=e==="rename"?t:e==="duplicate"?`${t} 2`:""}async _submitName(){let e=this._nameValue.trim();if(!e||!this.room||!this._nameAction)return;let t=this.room.entry_id;if(this._nameAction==="rename")await this._call("schedule/rename",{entry_id:t,schedule_id:this._sid,name:e});else{let s=await this._call("schedule/create",{entry_id:t,name:e,copy_from:this._sid});s&&(this._sid=s.id,this._draft=void 0)}this._error||(this._nameAction=void 0)}async _delete(){if(!this.room||!confirm(this._t.confirm_delete))return;await this._call("schedule/delete",{entry_id:this.room.entry_id,schedule_id:this._sid})&&(this._sid=this.room.active_schedule,this._draft=void 0)}_activate(){this.room&&this._call("schedule/activate",{entry_id:this.room.entry_id,schedule_id:this._sid})}async _save(){if(!this.room||!this._draft)return;await this._call("schedule/save",{entry_id:this.room.entry_id,schedule_id:this._sid,week:this._draft})&&(this._sel=void 0)}_discard(){this._server&&(this._draft=Q(this._server)),this._sel=void 0,this._copy=void 0}_mutate(e){if(!this._draft)return;let t=Q(this._draft);e(t),this._draft=t}_slot(e){return this._draft?.[f[e.day]]?.[e.idx]}_setTemp(e){let t=this._sel;if(!t)return;let s=this.snap?.variables??[];this._mutate(r=>{let a=r[f[t.day]][t.idx],l=N(a,s)??20,c=Math.min(30,Math.max(5,Math.round((l+e)*2)/2));r[f[t.day]][t.idx]={start:a.start,temperature:c}})}_setVariable(e){let t=this._sel;if(!t)return;let s=this.snap?.variables??[];this._mutate(r=>{let a=r[f[t.day]][t.idx];r[f[t.day]][t.idx]=e===void 0?{start:a.start,temperature:N(a,s)??20}:{start:a.start,variable:e}})}_split(){let e=this._sel;if(!e||!this._draft)return;let t=U(this._draft[f[e.day]])[e.idx],s=Ee((t.start+t.end)/2);s<=t.start||s>=t.end||(this._mutate(r=>{let a=r[f[e.day]];a.splice(e.idx+1,0,{...a[e.idx],start:D(s)})}),this._sel={day:e.day,idx:e.idx+1})}_remove(){let e=this._sel;!e||!this._draft||this._draft[f[e.day]].length<2||(this._mutate(s=>{let r=s[f[e.day]];e.idx===0?(r.splice(1,1,{...r[1],start:"00:00"}),r.splice(0,1)):r.splice(e.idx,1)}),this._sel={day:e.day,idx:Math.max(0,e.idx-1)})}_toggleCopy(e){let t=new Set(this._copy);t.has(e)?t.delete(e):t.add(e),this._copy=t}_applyCopy(){let e=this._sel;if(!e||!this._copy)return;let t=[...this._copy].filter(s=>s!==e.day);this._mutate(s=>{for(let r of t)s[f[r]]=JSON.parse(JSON.stringify(s[f[e.day]]))}),this._copy=void 0}_dragStart(e,t,s){e.preventDefault(),e.stopPropagation();let r=e.currentTarget;r.setPointerCapture(e.pointerId),this._drag={day:t,idx:s,bar:r.parentElement}}_dragMove(e){let t=this._drag;if(!t||!this._draft)return;let s=t.bar.getBoundingClientRect(),r=(e.clientX-s.left)/s.width*x,a=this._draft[f[t.day]],l=Y(a[t.idx-1].start)+V,c=(t.idx+1<a.length?Y(a[t.idx+1].start):x)-V,p=D(Math.min(c,Math.max(l,Ee(r))));p!==a[t.idx].start&&this._mutate(h=>{h[f[t.day]][t.idx]={...h[f[t.day]][t.idx],start:p}})}_dragEnd(){this._drag=void 0}_varStep(e,t,s){let r=Math.min(30,Math.max(5,Math.round((t+s)*2)/2));this._call("variable/update",{variable_id:e,value:r})}async _addVar(){let e=this._newVarName.trim();if(!e)return;await this._call("variable/create",{name:e,value:this._newVarValue})&&(this._newVarName="",this.requestUpdate())}_deleteVar(e){this._call("variable/delete",{variable_id:e})}render(){if(!this.room||!this._draft)return d;let e=this._t,t=this.room,s=t.schedules.find(r=>r.id===this._sid);return o`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          <button class="round small" @click=${this._close} aria-label=${e.close}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <div class="h-title">
            <div class="h-name">${t.name}</div>
            <div class="muted h-sub">${e.schedules}</div>
          </div>
          <button class="chip" aria-pressed=${this._vars} @click=${()=>this._vars=!this._vars}>
            <ha-icon icon="mdi:variable"></ha-icon>${e.variables}
          </button>
        </header>

        <div class="content">
          <div class="chips scroll">
            ${t.schedules.map(r=>o`<button class="chip" aria-pressed=${r.id===this._sid}
                @click=${()=>this._selectSchedule(r.id)}>
                ${r.id===t.active_schedule?o`<ha-icon icon="mdi:check-circle"></ha-icon>`:d}
                ${r.name}
              </button>`)}
            <button class="chip" @click=${()=>this._startName("new")} aria-label=${e.new_schedule}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>

          <div class="chips actions">
            ${s?.id!==t.active_schedule?o`<button class="text-btn" @click=${this._activate}>${e.activate}</button>`:o`<span class="badge">${e.active}</span>`}
            <button class="text-btn" @click=${()=>this._startName("rename")}>${e.rename}</button>
            <button class="text-btn" @click=${()=>this._startName("duplicate")}>${e.duplicate}</button>
            <button class="text-btn" ?disabled=${s?.id===t.active_schedule}
              @click=${this._delete}>${e.delete}</button>
          </div>

          ${this._nameAction?this._renderNameInput():d}
          ${this._vars?this._renderVariables():d}

          <div class="week">
            <div class="ruler muted">
              <span></span>
              <div>${[0,3,6,9,12,15,18,21,24].map(r=>o`<span style="left:${r/24*100}%">${r}</span>`)}</div>
            </div>
            ${f.map((r,a)=>this._renderDay(r,a))}
          </div>
          <div class="muted hint">${e.tap_hint}</div>
          ${this._sel?this._renderSlotPanel(this._sel):d}
          ${this._error?o`<div class="error">${this._error}</div>`:d}
        </div>

        <footer>
          <button class="text-btn close-btn" @click=${this._close}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>${e.close}
          </button>
          <span class="spacer"></span>
          <button class="text-btn" ?disabled=${!this._dirty||this._busy} @click=${this._discard}>
            ${e.discard}
          </button>
          <button class="primary-btn" ?disabled=${!this._dirty||this._busy} @click=${this._save}>
            ${e.save}
          </button>
        </footer>
      </div>
    `}_renderNameInput(){let e=this._t,t=this._nameAction==="rename"?e.rename:this._nameAction==="duplicate"?e.duplicate:e.new_schedule;return o`<div class="panel name-panel">
      <input type="text" .value=${this._nameValue} placeholder=${t} aria-label=${t}
        @input=${s=>this._nameValue=s.target.value}
        @keydown=${s=>s.key==="Enter"&&this._submitName()} />
      <button class="text-btn" @click=${()=>this._nameAction=void 0}>${e.close}</button>
      <button class="primary-btn" @click=${this._submitName}>${t}</button>
    </div>`}_renderVariables(){let e=this._t,t=this.snap?.variables??[];return o`<div class="panel vars">
      <div class="muted small-text">${e.variables_note}</div>
      ${t.map(s=>o`<div class="var-row">
          <span class="swatch" style="background:${A(s.value)}"></span>
          <span class="var-name">${s.name}</span>
          <button class="round small" @click=${()=>this._varStep(s.id,s.value,-.5)}>−</button>
          <span class="var-val">${_(s.value)}</span>
          <button class="round small" @click=${()=>this._varStep(s.id,s.value,.5)}>+</button>
          <button class="round small" @click=${()=>this._deleteVar(s.id)} aria-label=${e.delete}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>`)}
      <div class="var-row">
        <input type="text" placeholder=${e.name} .value=${this._newVarName}
          @input=${s=>this._newVarName=s.target.value} />
        <input type="number" class="num" min="5" max="30" step="0.5" .value=${String(this._newVarValue)}
          @input=${s=>this._newVarValue=Number(s.target.value)} />
        <button class="primary-btn" @click=${this._addVar}>${e.add_variable}</button>
      </div>
    </div>`}_renderDay(e,t){let s=this.snap?.variables??[],r=U(this._draft[e]),a=this._copy!==void 0;return o`<div class="day ${this._sel?.day===t?"active":""}">
      <span class="day-label">${this._t.days[t]}</span>
      <div class="bar" @pointermove=${this._dragMove} @pointerup=${this._dragEnd}
        @pointercancel=${this._dragEnd}>
        ${r.map((l,c)=>{let p=N(l.slot,s),h=(l.end-l.start)/x*100,u=this._sel?.day===t&&this._sel.idx===c;return o`<button class="seg ${u?"selected":""} ${l.slot.variable?"var":""}"
            style="left:${l.start/x*100}%;width:${h}%;background:${A(p)}"
            title="${D(l.start)}–${D(l.end%x)} · ${X(l.slot,s)}"
            @click=${()=>{this._sel={day:t,idx:c},a||(this._copy=void 0)}}>
            ${h>7?o`<span>${l.slot.variable?X(l.slot,s):_(p,!1)}</span>`:d}
          </button>`})}
        ${r.slice(1).map((l,c)=>{let p=this._drag?.day===t&&this._drag.idx===c+1;return o`<div class="handle ${p?"dragging":""}"
              style="left:${l.start/x*100}%"
              @pointerdown=${h=>this._dragStart(h,t,c+1)}>
              <span></span>
              ${p?o`<div class="time-tip">${D(l.start)}</div>`:d}
            </div>`})}
      </div>
    </div>`}_renderSlotPanel(e){let t=this._t,s=this.snap?.variables??[],r=this._slot(e);if(!r)return d;let a=U(this._draft[f[e.day]])[e.idx],l=N(r,s),c=this._draft[f[e.day]].length;return o`<div class="panel">
      <div class="panel-head">
        <span class="swatch" style="background:${A(l)}"></span>
        <strong>${t.days[e.day]} ${D(a.start)}–${D(a.end===x?0:a.end)}</strong>
        <span class="spacer"></span>
        <button class="round small" @click=${()=>this._sel=void 0} aria-label=${t.close}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="temp-row">
        <button class="round" @click=${()=>this._setTemp(-.5)}>−</button>
        <span class="temp-val">${_(l)}</span>
        <button class="round" @click=${()=>this._setTemp(.5)}>+</button>
      </div>
      <div class="chips">
        <button class="chip" aria-pressed=${r.variable===void 0}
          @click=${()=>this._setVariable(void 0)}>${t.fixed}</button>
        ${s.map(p=>o`<button class="chip" aria-pressed=${r.variable===p.id}
            @click=${()=>this._setVariable(p.id)}>${p.name} · ${_(p.value)}</button>`)}
      </div>
      <div class="chips actions">
        <button class="text-btn" ?disabled=${a.end-a.start<2*V} @click=${this._split}>
          <ha-icon icon="mdi:call-split"></ha-icon>${t.split}
        </button>
        <button class="text-btn" ?disabled=${c<2} @click=${this._remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
        </button>
        <button class="text-btn" @click=${()=>this._copy=this._copy?void 0:new Set}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t.copy_day}
        </button>
      </div>
      ${this._copy?o`<div class="chips">
            ${t.days.map((p,h)=>o`<button class="chip" ?disabled=${h===e.day}
                aria-pressed=${this._copy.has(h)} @click=${()=>this._toggleCopy(h)}>${p}</button>`)}
            <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4])}>${t.workdays}</button>
            <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4,5,6])}>${t.all_days}</button>
            <button class="primary-btn" ?disabled=${![...this._copy].some(p=>p!==e.day)}
              @click=${this._applyCopy}>${t.copy}</button>
          </div>`:d}
    </div>`}};te.properties={hass:{attribute:!1},snap:{attribute:!1},room:{attribute:!1},_sid:{state:!0},_draft:{state:!0},_sel:{state:!0},_copy:{state:!0},_vars:{state:!0},_error:{state:!0},_nameAction:{state:!0},_busy:{state:!0},_drag:{state:!0}},te.styles=[C,y`
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
        width: min(900px, 100vw);
        height: min(820px, 100dvh);
        background: var(--card-background-color, var(--primary-background-color));
        border-radius: var(--bt-radius);
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
      header,
      footer {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
      }
      header {
        border-bottom: 1px solid var(--divider-color);
        padding-top: max(12px, env(safe-area-inset-top));
      }
      header,
      footer,
      .content {
        padding-left: max(16px, env(safe-area-inset-left));
        padding-right: max(16px, env(safe-area-inset-right));
      }
      footer {
        justify-content: flex-end;
        border-top: 1px solid var(--divider-color);
        padding-bottom: max(12px, env(safe-area-inset-bottom));
      }
      .h-title {
        flex: 1;
        min-width: 0;
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
        gap: 12px;
      }
      .content > * {
        flex-shrink: 0;
      }
      .round.small {
        width: 36px;
        height: 36px;
        font-size: 20px;
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
      .actions {
        gap: 0;
        margin: -8px -8px 0;
        align-items: center;
      }
      .badge {
        padding: 0 14px;
        font-size: 13px;
        color: var(--bt-muted);
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
        grid-template-columns: 34px 1fr;
        gap: 8px;
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
      .day.active .day-label {
        color: var(--bt-accent);
      }
      .bar {
        position: relative;
        height: 44px;
        border-radius: 10px;
        background: var(--bt-surface);
        touch-action: pan-y;
      }
      .seg {
        position: absolute;
        top: 0;
        bottom: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        font-size: 12px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.72);
        border-right: 1px solid var(--card-background-color, #fff);
        box-sizing: border-box;
      }
      .seg:first-of-type {
        border-radius: 10px 0 0 10px;
      }
      .seg:last-of-type {
        border-radius: 0 10px 10px 0;
        border-right: none;
      }
      .seg span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 4px;
      }
      .seg.var span {
        font-style: italic;
      }
      .seg.selected {
        box-shadow: inset 0 0 0 3px var(--primary-text-color);
        z-index: 1;
      }
      .handle {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 28px;
        margin-left: -14px;
        z-index: 2;
        cursor: ew-resize;
        touch-action: none;
        display: flex;
        justify-content: center;
      }
      .handle span {
        width: 4px;
        height: 100%;
        border-radius: 2px;
        background: var(--primary-text-color);
        opacity: 0.55;
      }
      .handle:hover span,
      .handle:active span,
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
        z-index: 3;
      }
      .time-tip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border: 5px solid transparent;
        border-top-color: var(--primary-text-color);
      }
      .hint,
      .small-text {
        font-size: 12px;
      }
      .panel {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 14px;
        border-radius: var(--bt-radius);
        background: var(--bt-surface);
      }
      .panel .chip {
        background: var(--card-background-color, #fff);
      }
      .panel .chip[aria-pressed="true"] {
        background: var(--bt-accent);
      }
      .panel .round {
        background: var(--card-background-color, #fff);
      }
      .panel-head {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .spacer {
        flex: 1;
      }
      .swatch {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        flex: none;
      }
      .temp-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
      }
      .temp-val {
        font-size: 28px;
        min-width: 110px;
        text-align: center;
      }
      .name-panel {
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }
      .name-panel input {
        flex: 1;
        min-width: 160px;
      }
      .var-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .var-name {
        flex: 1;
        min-width: 80px;
        font-weight: 500;
      }
      .var-val {
        min-width: 64px;
        text-align: center;
      }
      .var-row input[type="text"] {
        flex: 1;
        min-width: 120px;
      }
      .var-row input.num {
        width: 90px;
      }
    `];customElements.define("bt-week-editor",te);function ie(n){let i=e=>String(e).padStart(2,"0");return`${n.getFullYear()}-${i(n.getMonth()+1)}-${i(n.getDate())}T${i(n.getHours())}:${i(n.getMinutes())}`}function nt(n){let i=new Date;return i.setMinutes(0,0,0),i.setHours(i.getHours()+n),i}var se=class extends g{constructor(){super(...arguments);this._initialized=!1;this._temp=21;this._startNow=!1;this._start=ie(nt(1));this._openEnd=!1;this._end=ie(nt(25));this._title="";this._busy=!1;this._onKey=e=>{e.key==="Escape"&&this._close()}}get _t(){return b(this.hass)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey)}willUpdate(){if(!this._initialized&&this.room&&this.period){this._initialized=!0;let e=this.period;e.schedule?this._what={kind:"schedule",id:e.schedule}:this._what={kind:"mode",mode:e.mode??"off"},e.temperature!=null&&(this._temp=e.temperature),this._startNow=!1,this._start=ie(new Date(e.start)),this._openEnd=!e.end,e.end&&(this._end=ie(new Date(e.end))),this._title=e.summary??""}if(!this._what&&this.room){let e=this.room.schedules.find(t=>t.id!==this.room.base_schedule);this._what=e?{kind:"schedule",id:e.id}:{kind:"mode",mode:"off"},this._temp=Math.round((this.room.target_temperature??21)*2)/2}}_close(){this.dispatchEvent(new CustomEvent("close"))}get _valid(){let e=this._t,t=this._startNow?new Date:new Date(this._start);if(!this._startNow&&Number.isNaN(t.getTime()))return e.period_invalid;if(!this._openEnd){let s=new Date(this._end);if(Number.isNaN(s.getTime())||s<=t||s<=new Date)return e.period_invalid}}async _save(){if(!this.hass||!this.room||!this._what)return;let e={entry_id:this.room.entry_id};this._what.kind==="schedule"?e.schedule_id=this._what.id:(e.mode=this._what.mode,this._what.mode==="heat"&&(e.temperature=this._temp));let t=!!this.period;this._startNow?t&&(e.start=ie(new Date)):e.start=this._start,this._openEnd?t&&(e.open_end=!0):e.end=this._end,t?(e.period_id=this.period.id,e.summary=this._title.trim()):this._title.trim()&&(e.summary=this._title.trim()),this._busy=!0,this._error=void 0;try{await S(this.hass,t?"period/update":"period/add",e),this._close()}catch(s){this._error=s?.message??String(s)}finally{this._busy=!1}}async _delete(){if(!(!this.hass||!this.room||!this.period)){this._busy=!0;try{await S(this.hass,"period/cancel",{entry_id:this.room.entry_id,period_id:this.period.id}),this._close()}catch(e){this._error=e?.message??String(e)}finally{this._busy=!1}}}_isWhat(e){let t=this._what;return!t||t.kind!==e.kind?!1:t.kind==="schedule"?t.id===e.id:t.mode===e.mode}render(){if(!this.room)return d;let e=this._t,t=this.room,s=this._valid,r=[["heat",e.heat],["off",e.off]];return o`
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
              ${r.map(([a,l])=>o`<button class="chip" aria-pressed=${this._isWhat({kind:"mode",mode:a})}
                  @click=${()=>this._what={kind:"mode",mode:a}}>
                  <ha-icon icon=${a==="off"?"mdi:snowflake":"mdi:hand-back-right"}></ha-icon>${l}
                </button>`)}
            </div>
            ${this._what?.kind==="mode"&&this._what.mode==="heat"?o`<div class="temp-row">
                  <button class="round" @click=${()=>this._temp=Math.max(5,this._temp-.5)}>−</button>
                  <span class="temp-val">${_(this._temp)}</span>
                  <button class="round" @click=${()=>this._temp=Math.min(30,this._temp+.5)}>+</button>
                </div>`:d}
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
            ${this._startNow?d:o`<input type="datetime-local" step="900" .value=${this._start}
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
            ${this._openEnd?d:o`<input type="datetime-local" step="900" .value=${this._end}
                  @input=${a=>this._end=a.target.value} />`}
          </section>

          <section>
            <div class="label">${e.period_title} <span class="muted">(${e.optional})</span></div>
            <input type="text" .value=${this._title} placeholder=${e.period_title_hint}
              @input=${a=>this._title=a.target.value} />
          </section>
          ${this._error?o`<div class="error">${this._error}</div>`:d}
          ${s&&!this._error?o`<div class="muted small">${s}</div>`:d}
        </div>
        <footer>
          ${this.period?o`<button class="text-btn danger" ?disabled=${this._busy} @click=${this._delete}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>${this.period&&this.room?.period?.id===this.period.id?e.period_end:e.period_delete}
              </button>`:d}
          <span class="spacer"></span>
          <button class="text-btn" @click=${this._close}>${e.close}</button>
          <button class="primary-btn" ?disabled=${!!s||this._busy} @click=${this._save}>
            ${this.period?e.save:e.period_plan}
          </button>
        </footer>
      </div>
    `}};se.properties={hass:{attribute:!1},room:{attribute:!1},period:{attribute:!1},_what:{state:!0},_temp:{state:!0},_startNow:{state:!0},_start:{state:!0},_openEnd:{state:!0},_end:{state:!0},_title:{state:!0},_error:{state:!0},_busy:{state:!0}},se.styles=[C,y`
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
    `];customElements.define("bt-period-dialog",se);var bt=24,I=class extends g{constructor(){super(...arguments);this._editing=!1;this._planning=!1;this._allPeriods=!1}static getConfigElement(){return document.createElement("bestthermostat-card-editor")}static getStubConfig(e){return{entity:Object.values(e.states).find(s=>s.entity_id.startsWith("climate.")&&s.attributes.room_id)?.entity_id??""}}setConfig(e){this._config={show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0,show_header:!0,...e}}set config(e){this.setConfig(e)}getCardSize(){return this._config?.compact?3:6}getGridOptions(){return this._config?.compact?{columns:6,rows:4,min_columns:4,min_rows:3}:{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),this._tick=window.setInterval(()=>this.requestUpdate(),6e4),this.hass&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,window.clearInterval(this._tick),this._editor?.remove(),this._editor=void 0,this._editing=!1,this._planner?.remove(),this._planner=void 0,this._planning=!1}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&this._subscribe()}updated(){let e=this._room;this._editing&&e&&this.hass?(this._editor||(this._editor=document.createElement("bt-week-editor"),this._editor.addEventListener("close",()=>this._editing=!1),document.body.appendChild(this._editor)),this._editor.hass=this.hass,this._editor.snap=this._snap,this._editor.room=e):this._editor&&(this._editor.remove(),this._editor=void 0),this._planning&&e&&this.hass?(this._planner||(this._planner=document.createElement("bt-period-dialog"),this._planner.addEventListener("close",()=>{this._planning=!1,this._editPeriod=void 0}),document.body.appendChild(this._planner)),this._planner.hass=this.hass,this._planner.room=e,this._planner.period=this._editPeriod):this._planner&&(this._planner.remove(),this._planner=void 0)}_subscribe(){this.hass&&(this._unsub=J(this.hass,e=>this._snap=e))}get _room(){return Xe(this._snap,this._config?.entity)}async _call(e,t){if(this.hass)try{this._error=void 0,await S(this.hass,e,t)}catch(s){this._error=s?.message??String(s)}}_clampTemp(e,t){return Math.min(e.max_temp,Math.max(e.min_temp,Math.round(t*2)/2))}_swipeStart(e,t){e.pointerType==="mouse"&&e.button!==0||(this._swipe={x:e.clientX,start:this._pending??t.target_temperature??20,moved:!1,id:e.pointerId})}_swipeMove(e,t){let s=this._swipe;if(!s||s.id!==e.pointerId)return;let r=e.clientX-s.x;if(!s.moved){if(Math.abs(r)<10)return;s.moved=!0,e.currentTarget.setPointerCapture(e.pointerId),this.requestUpdate()}let a=this._clampTemp(t,s.start+Math.round(r/bt)*.5);a!==this._pending&&(this._pending=a,window.clearTimeout(this._debounce),navigator.vibrate?.(5))}_swipeEnd(e,t){let s=this._swipe;this._swipe=void 0,!(!s||!s.moved||s.id!==e.pointerId)&&(this._pending!==void 0&&this._pending!==t.target_temperature?this._step(t,0):this._pending=void 0)}_step(e,t){let s=this._pending??e.target_temperature??20,r=this._clampTemp(e,s+t);this._pending=r,window.clearTimeout(this._debounce),this._debounce=window.setTimeout(async()=>{await this._call("room/temperature",{entry_id:e.entry_id,temperature:r}),this._pending=void 0},700)}_mode(e,t){this._call("room/mode",{entry_id:e.entry_id,mode:t})}_schedule(e,t){this._call("schedule/activate",{entry_id:e.entry_id,schedule_id:t})}_moreInfo(e){e.climate_entity_id&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.climate_entity_id},bubbles:!0,composed:!0}))}_openPeriod(e){this._editPeriod=e,this._planning=!0}_toggle(e){this._section=this._section===e?void 0:e}render(){if(!this._config||!this.hass)return d;let e=b(this.hass);if(!this._snap)return o`<ha-card><div class="msg">${e.loading}</div></ha-card>`;let t=this._room;if(!t)return o`<ha-card><div class="msg">${e.not_found}</div></ha-card>`;let s=this._config,r=t.hvac_action==="heating",a=this._pending??t.target_temperature,l=s.name||t.name,c=[s.show_floor===!1?"":t.floor?.name,he(t,e,this.hass),r?e.heating:""].filter(Boolean).join(" \xB7 ");return o`
      <ha-card class="${s.compact?"compact":""} ${s.embedded?"embedded":""}">
        ${s.show_header===!1?d:o`<div class="head">
          <button class="icon ${r?"heating":""}" @click=${()=>this._moreInfo(t)}
            aria-label=${l}>
            <ha-icon icon=${pe(t)}></ha-icon>
          </button>
          <div class="title">
            <div class="name">${l}</div>
            <div class="sub muted">${c}</div>
          </div>
        </div>`}

        <div class="hero">
          <div class="current">
            <span class="big">${_(t.current_temperature,!1)}</span><span class="unit">°C</span>
          </div>
          <div class="ctl">
            <button class="round" @click=${()=>this._step(t,-.5)} aria-label="-0.5">−</button>
            <div class="target ${this._swipe?.moved?"swiping":""}" title=${e.swipe_hint}
              @pointerdown=${p=>this._swipeStart(p,t)}
              @pointermove=${p=>this._swipeMove(p,t)}
              @pointerup=${p=>this._swipeEnd(p,t)}
              @pointercancel=${()=>this._swipe=void 0}>
              <div class="tv" style="--c:${A(a??void 0)}">${_(a,!1)}°</div>
              <div class="muted src">${[t.target_variable,e[`src_${t.target_source}`]].filter(Boolean).join(" \xB7 ")}</div>
            </div>
            <button class="round" @click=${()=>this._step(t,.5)} aria-label="+0.5">+</button>
          </div>
        </div>

        ${s.show_modes?this._renderModes(t):d}
        ${s.show_timeline&&!s.compact?this._renderTimeline(t):d}
        ${s.show_schedules&&t.schedules.length>1?this._renderScheduleChoice(t):d}
        ${s.compact?d:this._renderList(t)}
        ${this._error?o`<div class="error">${this._error}</div>`:d}
      </ha-card>
    `}_renderModes(e){let t=b(this.hass),s=[["auto",t.auto],["heat",t.heat],["off",t.off]];return o`<div class="seg accent" role="tablist">
      ${s.map(([r,a])=>o`<button role="tab" aria-selected=${e.mode===r}
          @click=${()=>this._mode(e,r)}>${a}</button>`)}
    </div>`}_renderScheduleChoice(e){return o`<div class="seg" role="tablist">
      ${e.schedules.map(t=>o`<button role="tab" aria-selected=${t.id===e.active_schedule}
          @click=${()=>this._schedule(e,t.id)}>${t.name}</button>`)}
    </div>`}_renderTimeline(e){let t=b(this.hass),s=e.schedules.find(h=>h.id===e.active_schedule);if(!s)return d;let r=this._snap.variables,a=s.week?.[tt()]??s.week?.[f[0]];if(!a?.length)return d;let l=U(a),c=et(),p=e.mode!=="auto"||e.override_active;return o`<div class="timeline ${p?"paused":""}">
      <div class="cap muted">${t.today} · ${s.name}${p?` \xB7 ${t.schedule_paused}`:""}</div>
      <div class="bar">
        ${l.map(h=>{let u=N(h.slot,r);return o`<div class="seg-t"
            title="${X(h.slot,r)}"
            style="left:${h.start/x*100}%;width:${(h.end-h.start)/x*100}%;background:${A(u)}"></div>`})}
        <div class="now" style="left:${c/x*100}%"></div>
      </div>
      <div class="ticks muted"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`}_row(e,t,s,r,a){let l=r!==void 0&&this._section===r,c=r!==void 0||a!==void 0;return o`<button class="row ${l?"open":""}" ?disabled=${!c}
      @click=${()=>r?this._toggle(r):a?.()}>
      <ha-icon icon=${e}></ha-icon>
      <span class="row-label">${t}</span>
      <span class="row-value">${s}</span>
      ${c?o`<ha-icon class="chev" icon=${l?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>`:d}
    </button>`}_renderList(e){let t=this._config,s=b(this.hass),r=this.hass,a=ee(e),l=e.period?e.period.title:a.length?`${a.length} ${s.period_planned_n}`:s.prio_none,c=st(e,this._snap,s,r),p=c.layers.find(h=>h.n===c.winner);return o`<div class="list">
      ${t.show_periods?o`${this._row("mdi:calendar-star",s.period_plural,l,"periods")}
          ${this._section==="periods"?o`<div class="detail">${this._renderPeriods(e)}</div>`:d}`:d}
      ${t.show_priorities?o`${this._row("mdi:layers-triple-outline",s.prio_short,p.name,"prio")}
          ${this._section==="prio"?o`<div class="detail">${this._renderPriorities(c)}</div>`:d}`:d}
      ${t.show_editor?this._row("mdi:calendar-edit",s.edit,"",void 0,()=>this._editing=!0):d}
    </div>`}_renderPriorities(e){return o`<div class="prio">
      ${e.layers.map(t=>o`<div class="prio-row ${t.n===e.winner?"win":t.n<e.winner?"idle":"below"}">
          <span class="prio-n">${t.n}</span>
          <span class="prio-name">${t.name}</span>
          <span class="prio-val">${t.value}</span>
        </div>`)}
    </div>`}_renderPeriods(e){let t=b(this.hass),s=this.hass,r=e.period,a=ee(e),l=this._allPeriods?a:a.slice(0,3),c=h=>`${$(h.start,s)} \u2013 ${h.end?$(h.end,s):t.period_open}`,p=(h,u)=>o`<div class="period ${u?"active":""}">
      <button class="period-text" @click=${()=>this._openPeriod(h)}>
        <span class="period-title">${h.title}</span>
        <span class="muted period-when">${u?h.end?`${t.period_until} ${$(h.end,s)}`:t.period_open:c(h)}</span>
      </button>
      <button class="text-btn small" @click=${()=>this._call("period/cancel",{entry_id:e.entry_id,period_id:h.id})}>
        ${u?t.period_end:t.period_delete}
      </button>
    </div>`;return o`<div class="periods">
      ${r?p(r,!0):d}
      ${l.map(h=>p(h,!1))}
      ${a.length>3?o`<button class="text-btn small" @click=${()=>this._allPeriods=!this._allPeriods}>
            ${this._allPeriods?t.period_less:`+${a.length-l.length} ${t.period_more}`}
          </button>`:d}
      <button class="text-btn plan" @click=${()=>{this._editPeriod=void 0,this._planning=!0}}>
        <ha-icon icon="mdi:calendar-plus"></ha-icon> ${t.period_plan}
      </button>
    </div>`}};I.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_pending:{state:!0},_editing:{state:!0},_planning:{state:!0},_editPeriod:{state:!0},_allPeriods:{state:!0},_section:{state:!0},_swipe:{state:!0},_error:{state:!0}},I.styles=[C,y`
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
        font-size: 12px;
        margin-bottom: 6px;
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
    `];var vt={entity:{de:"Raum",en:"Room"},name:{de:"Name (optional)",en:"Name (optional)"},compact:{de:"Kompaktmodus (Wanddisplay)",en:"Compact mode (wall display)"},show_modes:{de:"Modi anzeigen",en:"Show modes"},show_schedules:{de:"Zeitpl\xE4ne anzeigen",en:"Show schedules"},show_timeline:{de:"Zeitleiste heute anzeigen",en:"Show today's timeline"},show_editor:{de:"Button f\xFCr Wocheneditor",en:"Weekly editor button"},show_periods:{de:"Zeitr\xE4ume anzeigen und planen",en:"Show and plan periods"},show_priorities:{de:"Priorit\xE4ten anzeigen",en:"Show priorities"},title:{de:"Titel",en:"Title"},show_override:{de:"Globalen Override anzeigen",en:"Show global override"},show_variables:{de:"Variablen anzeigen",en:"Show variables"},group_by_floor:{de:"Nach Stockwerk gruppieren",en:"Group by floor"},layout:{de:"Darstellung",en:"Layout"},show_summary:{de:"Zusammenfassung anzeigen",en:"Show summary"},room:{de:"R\xE4ume (gilt f\xFCr alle)",en:"Rooms (applies to all)"},exclude_rooms:{de:"R\xE4ume ausblenden",en:"Hide rooms"}},xt=[{name:"entity",required:!0,selector:{entity:{filter:{domain:"climate",integration:"bestthermostat"}}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"compact",selector:{boolean:{}}},{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}}]}],$t=[{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}}];function yt(n){return[{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"box",options:[{value:"list",label:n?"Liste (Raum zum Aufklappen)":"List (tap to expand)"},{value:"tiles",label:n?"Kacheln (alle R\xE4ume offen)":"Tiles (all rooms open)"}]}}},{type:"grid",name:"",schema:[{name:"show_summary",selector:{boolean:{}}},{name:"show_override",selector:{boolean:{}}},{name:"show_variables",selector:{boolean:{}}},{name:"group_by_floor",selector:{boolean:{}}}]},{type:"expandable",name:"room",title:n?"R\xE4ume (gilt f\xFCr alle)":"Rooms (applies to all)",schema:[{type:"grid",name:"",schema:$t}]},{name:"exclude_rooms",selector:{entity:{multiple:!0,filter:{domain:"climate",integration:"bestthermostat"}}}}]}var ne=class extends g{constructor(){super(...arguments);this._label=e=>{let t=(this.hass?.locale?.language||this.hass?.language||"en").startsWith("de")?"de":"en";return vt[e.name]?.[t]??e.name}}setConfig(e){let t=this.defaults,s=e;this._config={...t,...s,...t.room?{room:{...t.room,...s.room??{}}}:{}}}_changed(e){let t=e.detail.value;this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?d:o`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};ne.properties={hass:{attribute:!1},_config:{state:!0}};var De=class extends ne{constructor(){super(...arguments);this.defaults={compact:!1,show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0}}get schema(){return xt}},Re=class extends ne{constructor(){super(...arguments);this.defaults={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,group_by_floor:!0,room:{show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_editor:!0,compact:!1}}}get schema(){let e=this.hass?.locale?.language||this.hass?.language||"en";return yt(e.startsWith("de"))}};customElements.define("bestthermostat-card-editor",De);customElements.define("bestthermostat-overview-card-editor",Re);var wt={show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_editor:!0,compact:!1},W=class extends g{constructor(){super(...arguments);this._ovOpen=!1;this._varsOpen=!1;this._cardConfigs=new Map}static getConfigElement(){return document.createElement("bestthermostat-overview-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,show_periods:!0,group_by_floor:!0,...e,room:{...wt,...e.show_periods===!1?{show_periods:!1}:{},...e.room??{}}},this._cardConfigs.clear()}_cardConfig(e,t){let s=`${e.entry_id}:${t}`,r=this._cardConfigs.get(s);return r||(r={type:"custom:bestthermostat-card",entity:e.climate_entity_id??e.entry_id,embedded:!0,show_header:t,show_floor:!this._config.group_by_floor,...this._config.room},this._cardConfigs.set(s,r)),r}getCardSize(){return 2+(this._snap?.rooms.length??2)}connectedCallback(){super.connectedCallback(),this.hass&&(this._unsub=J(this.hass,e=>this._snap=e))}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&(this._unsub=J(this.hass,t=>this._snap=t))}async _call(e,t){try{this._error=void 0,await S(this.hass,e,t)}catch(s){this._error=s?.message??String(s)}}_floorIconNo(e){return e==null?"0":e<0?"negative-1":e>3?"3":String(e)}_heatingCount(e){return e.filter(t=>t.hvac_action==="heating").length}_renderTile(e){return o`<div class="tile">
      <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!0)}></bestthermostat-card>
    </div>`}_groups(e){if(!this._config?.group_by_floor||!e.some(s=>s.floor))return[{floor:null,rooms:e}];let t=new Map;for(let s of e){let r=s.floor?.id??"";t.has(r)||t.set(r,{floor:s.floor,rooms:[]}),t.get(r).rooms.push(s)}return[...t.values()].sort((s,r)=>{if(!s.floor)return 1;if(!r.floor)return-1;let a=s.floor.level??999,l=r.floor.level??999;return a!==l?a-l:s.floor.name.localeCompare(r.floor.name)})}render(){if(!this._config||!this.hass)return d;let e=b(this.hass),t=this._snap;if(!t)return o`<ha-card><div class="pad">${e.loading}</div></ha-card>`;let s=t.rooms.filter(m=>m.hvac_action==="heating").length,r=t.rooms.map(m=>m.current_temperature).filter(m=>m!=null),a=r.length?r.reduce((m,w)=>m+w,0)/r.length:null,l=new Set(this._config.exclude_rooms??[]),c=t.rooms.filter(m=>!l.has(m.climate_entity_id??"")&&!l.has(m.entry_id)),p=this._groups(c),h=p.length>1||p[0]?.floor,u=this._config.layout==="tiles",v=this._config.title??e.rooms;return o`<ha-card>
      <div class="pad col">
        ${v||this._config.show_summary?o`<div>
              ${v?o`<div class="title">${v}</div>`:d}
              ${this._config.show_summary?o`<div class="muted summary">
                    ${s} ${e.of} ${t.rooms.length} ${e.rooms_word} ${e.heating_summary}${a!=null?o` · Ø ${_(a)}`:d}
                  </div>`:d}
            </div>`:d}
        <div class="top">
          ${this._config.show_override?this._renderOverride():d}
          ${this._config.show_variables&&t.variables.length?this._renderVariables():d}
        </div>
        <div class="rooms">
          ${p.map(m=>o`${h?o`<div class="floor">
                    <ha-icon icon=${m.floor?.icon||"mdi:home-floor-"+this._floorIconNo(m.floor?.level)}></ha-icon>
                    <span>${m.floor?.name??e.other_floor}</span>
                    ${this._heatingCount(m.rooms)?o`<span class="floor-heat">· ${this._heatingCount(m.rooms)} ${e.heating_summary}</span>`:d}
                  </div>`:d}
              <div class="grid ${u?"tiles":""}">
                ${m.rooms.map(w=>u?this._renderTile(w):this._renderRoom(w))}
              </div>`)}
        </div>
        ${this._error?o`<div class="error">${this._error}</div>`:d}
      </div>
    </ha-card>`}_renderOverride(){let e=b(this.hass),t=this._snap.override,s=this._ovOpen,r=a=>this._call("override/set",{temperature:Math.min(30,Math.max(5,(t.value??16)+a))});return o`<div class="box ${t.active?"on":""}">
      <div class="box-head">
        <span class="box-label">
          <ha-icon icon="mdi:home-export-outline"></ha-icon>
          <span>${e.override}</span>
        </span>
        <button class="value-btn ${s?"open":""}" @click=${()=>this._ovOpen=!this._ovOpen}
          aria-expanded=${s}>
          ${_(t.value)}
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
              <span class="val">${_(t.value)}</span>
              <button class="round small" @click=${()=>r(.5)}>+</button>
            </div>
            <div class="also">
              <span class="muted">${e.override_also}</span>
              ${[["include_manual",t.include_manual,e.heat],["include_off",t.include_off,e.off]].map(([a,l,c])=>o`<button class="mini ${l?"on":""}"
                  @click=${()=>this._call("override/set",{[a]:!l})}>${c}</button>`)}
            </div>
          </div>`:d}
    </div>`}_renderVariables(){let e=b(this.hass),t=this._snap.variables;return o`<div>
      <button class="vars-line" @click=${()=>this._varsOpen=!this._varsOpen}>
        <span class="vars-text">
          ${t.map((s,r)=>o`${r?o`<span class="sep">·</span>`:d}<span>${s.name}
                <b>${_(s.value,!1)}°</b></span>`)}
        </span>
        <ha-icon icon=${this._varsOpen?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>
      </button>
      ${this._varsOpen?o`<div class="var-list">
            ${t.map(s=>o`<div class="var-row">
                <span class="dot" style="background:${A(s.value)}"></span>
                <span class="grow">${s.name}</span>
                <button class="round small" @click=${()=>this._call("variable/update",{variable_id:s.id,value:Math.max(5,s.value-.5)})}>−</button>
                <span class="val">${_(s.value)}</span>
                <button class="round small" @click=${()=>this._call("variable/update",{variable_id:s.id,value:Math.min(30,s.value+.5)})}>+</button>
              </div>`)}
            <div class="muted hint">${e.variables_note}</div>
          </div>`:d}
    </div>`}_renderRoom(e){let t=b(this.hass),s=this.hass,r=e.hvac_action==="heating",a=this._open===e.entry_id,l=this._config?.room?.show_periods?ee(e)[0]:void 0;return o`<div class="room-block ${a?"open":""}">
      <button class="room" @click=${()=>this._open=a?void 0:e.entry_id}>
        <span class="icon ${r?"heating":""}"><ha-icon icon=${pe(e)}></ha-icon></span>
        <span class="grow left">
          <span class="name">${e.name}</span>
          <span class="muted sub">${he(e,t,s)}</span>
          ${l?o`<span class="muted sub planned">
                <ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${l.title} · ${t.period_from}
                ${$(l.start,s)}
              </span>`:d}
        </span>
        <span class="temps">
          <span class="cur">${_(e.current_temperature,!1)}°</span>
          <span class="muted tgt">→ ${_(e.target_temperature,!1)}°</span>
        </span>
      </button>
      ${a?o`<div class="detail">
            <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!1)}></bestthermostat-card>
          </div>`:d}
    </div>`}};W.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_error:{state:!0},_open:{state:!0},_ovOpen:{state:!0},_varsOpen:{state:!0}},W.styles=[C,y`
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
    `];var kt="0.4.0";customElements.get("bestthermostat-card")||customElements.define("bestthermostat-card",I);customElements.get("bestthermostat-overview-card")||customElements.define("bestthermostat-overview-card",W);var ue=window;ue.customCards=ue.customCards||[];var Pe=(document.documentElement.lang||navigator.language||"").startsWith("de"),St=[{type:"bestthermostat-card",name:"Best Thermostat",description:Pe?"Raumthermostat mit Zeitpl\xE4nen und Wocheneditor":"Room thermostat with schedules and weekly editor",preview:!0,documentationURL:"https://github.com/zitroaen/bestthermostat"},{type:"bestthermostat-overview-card",name:Pe?"Best Thermostat \xDCbersicht":"Best Thermostat Overview",description:Pe?"Alle R\xE4ume, globaler Override und Variablen":"All rooms, global override and variables",preview:!0}];for(let n of St)ue.customCards.some(i=>i?.type===n.type)||ue.customCards.push(n);console.info(`%c BEST-THERMOSTAT %c ${kt} `,"background:#ff8100;color:#fff","");
