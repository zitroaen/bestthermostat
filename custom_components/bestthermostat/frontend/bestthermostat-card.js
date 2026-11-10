var ie=globalThis,se=ie.ShadowRoot&&(ie.ShadyCSS===void 0||ie.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ce=Symbol(),Ee=new WeakMap,I=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(se&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=Ee.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Ee.set(e,t))}return t}toString(){return this.cssText}},Ce=n=>new I(typeof n=="string"?n:n+"",void 0,ce),$=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((i,s,a)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[a+1],n[0]);return new I(e,n,ce)},De=(n,t)=>{if(se)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),s=ie.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,n.appendChild(i)}},le=se?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return Ce(e)})(n):n;var{is:Ye,defineProperty:Xe,getOwnPropertyDescriptor:Qe,getOwnPropertyNames:et,getOwnPropertySymbols:tt,getPrototypeOf:it}=Object,ae=globalThis,Me=ae.trustedTypes,st=Me?Me.emptyScript:"",at=ae.reactiveElementPolyfillSupport,j=(n,t)=>n,he={toAttribute(n,t){switch(t){case Boolean:n=n?st:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Te=(n,t)=>!Ye(n,t),Re={attribute:!0,type:String,converter:he,reflect:!1,useDefault:!1,hasChanged:Te};Symbol.metadata??=Symbol("metadata"),ae.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Re){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Xe(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:a}=Qe(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:s,set(r){let o=s?.call(this);a?.call(this,r),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Re}static _$Ei(){if(this.hasOwnProperty(j("elementProperties")))return;let t=it(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(j("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(j("properties"))){let e=this.properties,i=[...et(e),...tt(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(le(s))}else t!==void 0&&e.push(le(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return De(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let a=(i.converter?.toAttribute!==void 0?i.converter:he).toAttribute(e,i.type);this._$Em=t,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let a=i.getPropertyOptions(s),r=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:he;this._$Em=s;let o=r.fromAttribute(e,a.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(t!==void 0){let r=this.constructor;if(s===!1&&(a=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??Te)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),a!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,a]of i){let{wrapped:r}=a,o=this[s];r!==!0||this._$AL.has(s)||o===void 0||this.C(s,void 0,a,o)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[j("elementProperties")]=new Map,y[j("finalized")]=new Map,at?.({ReactiveElement:y}),(ae.reactiveElementVersions??=[]).push("2.1.2");var ge=globalThis,ze=n=>n,ne=ge.trustedTypes,Pe=ne?ne.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ue="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,We="?"+k,nt=`<${We}>`,C=document,G=()=>C.createComment(""),K=n=>n===null||typeof n!="object"&&typeof n!="function",ve=Array.isArray,rt=n=>ve(n)||typeof n?.[Symbol.iterator]=="function",pe=`[ 	
\f\r]`,B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ne=/-->/g,Ve=/>/g,A=RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),He=/'/g,Oe=/"/g,Ie=/^(?:script|style|textarea|title)$/i,xe=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),c=xe(1),vt=xe(2),xt=xe(3),D=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),Le=new WeakMap,E=C.createTreeWalker(C,129);function je(n,t){if(!ve(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Pe!==void 0?Pe.createHTML(t):t}var ot=(n,t)=>{let e=n.length-1,i=[],s,a=t===2?"<svg>":t===3?"<math>":"",r=B;for(let o=0;o<e;o++){let d=n[o],h,p,u=-1,x=0;for(;x<d.length&&(r.lastIndex=x,p=r.exec(d),p!==null);)x=r.lastIndex,r===B?p[1]==="!--"?r=Ne:p[1]!==void 0?r=Ve:p[2]!==void 0?(Ie.test(p[2])&&(s=RegExp("</"+p[2],"g")),r=A):p[3]!==void 0&&(r=A):r===A?p[0]===">"?(r=s??B,u=-1):p[1]===void 0?u=-2:(u=r.lastIndex-p[2].length,h=p[1],r=p[3]===void 0?A:p[3]==='"'?Oe:He):r===Oe||r===He?r=A:r===Ne||r===Ve?r=B:(r=A,s=void 0);let w=r===A&&n[o+1].startsWith("/>")?" ":"";a+=r===B?d+nt:u>=0?(i.push(h),d.slice(0,u)+Ue+d.slice(u)+k+w):d+k+(u===-2?o:w)}return[je(n,a+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},q=class n{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,r=0,o=t.length-1,d=this.parts,[h,p]=ot(t,e);if(this.el=n.createElement(h,i),E.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=E.nextNode())!==null&&d.length<o;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(Ue)){let x=p[r++],w=s.getAttribute(u).split(k),te=/([.?@])?(.*)/.exec(x);d.push({type:1,index:a,name:te[2],strings:w,ctor:te[1]==="."?me:te[1]==="?"?fe:te[1]==="@"?_e:P}),s.removeAttribute(u)}else u.startsWith(k)&&(d.push({type:6,index:a}),s.removeAttribute(u));if(Ie.test(s.tagName)){let u=s.textContent.split(k),x=u.length-1;if(x>0){s.textContent=ne?ne.emptyScript:"";for(let w=0;w<x;w++)s.append(u[w],G()),E.nextNode(),d.push({type:2,index:++a});s.append(u[x],G())}}}else if(s.nodeType===8)if(s.data===We)d.push({type:2,index:a});else{let u=-1;for(;(u=s.data.indexOf(k,u+1))!==-1;)d.push({type:7,index:a}),u+=k.length-1}a++}}static createElement(t,e){let i=C.createElement("template");return i.innerHTML=t,i}};function z(n,t,e=n,i){if(t===D)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,a=K(t)?void 0:t._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(n),s._$AT(n,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=z(n,s._$AS(n,t.values),s,i)),t}var ue=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??C).importNode(e,!0);E.currentNode=s;let a=E.nextNode(),r=0,o=0,d=i[0];for(;d!==void 0;){if(r===d.index){let h;d.type===2?h=new F(a,a.nextSibling,this,t):d.type===1?h=new d.ctor(a,d.name,d.strings,this,t):d.type===6&&(h=new be(a,this,t)),this._$AV.push(h),d=i[++o]}r!==d?.index&&(a=E.nextNode(),r++)}return E.currentNode=C,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},F=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=z(this,t,e),K(t)?t===l||t==null||t===""?(this._$AH!==l&&this._$AR(),this._$AH=l):t!==this._$AH&&t!==D&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):rt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==l&&K(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=q.createElement(je(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let a=new ue(s,this),r=a.u(this.options);a.p(e),this.T(r),this._$AH=a}}_$AC(t){let e=Le.get(t.strings);return e===void 0&&Le.set(t.strings,e=new q(t)),e}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let a of t)s===e.length?e.push(i=new n(this.O(G()),this.O(G()),this,this.options)):i=e[s],i._$AI(a),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=ze(t).nextSibling;ze(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=l,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(t,e=this,i,s){let a=this.strings,r=!1;if(a===void 0)t=z(this,t,e,0),r=!K(t)||t!==this._$AH&&t!==D,r&&(this._$AH=t);else{let o=t,d,h;for(t=a[0],d=0;d<a.length-1;d++)h=z(this,o[i+d],e,d),h===D&&(h=this._$AH[d]),r||=!K(h)||h!==this._$AH[d],h===l?t=l:t!==l&&(t+=(h??"")+a[d+1]),this._$AH[d]=h}r&&!s&&this.j(t)}j(t){t===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},me=class extends P{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===l?void 0:t}},fe=class extends P{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==l)}},_e=class extends P{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=z(this,t,e,0)??l)===D)return;let i=this._$AH,s=t===l&&i!==l||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==l&&(i===l||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},be=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){z(this,t)}};var dt=ge.litHtmlPolyfillSupport;dt?.(q,F),(ge.litHtmlVersions??=[]).push("3.3.3");var Be=(n,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let a=e?.renderBefore??null;i._$litPart$=s=new F(t.insertBefore(G(),a),a,void 0,e??{})}return s._$AI(n),s};var $e=globalThis,_=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Be(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}};_._$litElement$=!0,_.finalized=!0,$e.litElementHydrateSupport?.({LitElement:_});var ct=$e.litElementPolyfillSupport;ct?.({LitElement:_});($e.litElementVersions??=[]).push("4.2.2");var Ke="bestthermostat",m=["mon","tue","wed","thu","fri","sat","sun"],re,N,Ge,oe=new Set;function Z(n,t){return oe.add(t),re&&t(re),(!N||Ge!==n.connection)&&(Ge=n.connection,N=n.connection.subscribeMessage(e=>{re=e,oe.forEach(i=>i(e))},{type:`${Ke}/subscribe`}).catch(e=>(console.error("Best Thermostat: subscription failed",e),N=void 0,()=>{}))),()=>{if(oe.delete(t),oe.size===0&&N){let e=N;N=void 0,re=void 0,e.then(i=>i())}}}function V(n,t,e={}){return n.callWS({type:`${Ke}/${t}`,...e})}function qe(n,t){if(!(!n||!t))return n.rooms.find(e=>e.climate_entity_id===t||e.entry_id===t)}var H=$`
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
`;var O=15,b=1440;function J(n){let[t,e]=n.split(":").map(Number);return t*60+e}function S(n){let t=Math.floor(n/60),e=n%60;return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function ye(n){return Math.round(n/O)*O}function R(n,t){return n.variable!==void 0?t.find(e=>e.id===n.variable)?.value:n.temperature}function Y(n,t){if(n.variable!==void 0){let e=t.find(i=>i.id===n.variable);return e?e.name:n.variable}return f(n.temperature)}function f(n,t=!0){if(n==null||Number.isNaN(n))return"\u2013";let e=(Math.round(n*2)/2).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1});return t?`${e} \xB0C`:e}var M=[[12,[90,140,220]],[16,[120,180,235]],[18,[150,210,200]],[19.5,[250,215,110]],[21,[255,175,85]],[23,[250,125,70]],[26,[225,75,60]]];function v(n){if(n===void 0)return"var(--disabled-color, #9e9e9e)";if(n<=M[0][0])return`rgb(${M[0][1].join(",")})`;for(let t=1;t<M.length;t++){let[e,i]=M[t];if(n<=e){let[s,a]=M[t-1],r=(n-s)/(e-s);return`rgb(${a.map((o,d)=>Math.round(o+(i[d]-o)*r)).join(",")})`}}return`rgb(${M[M.length-1][1].join(",")})`}function X(n){return JSON.parse(JSON.stringify(n))}function we(n,t){return JSON.stringify(n)===JSON.stringify(t)}function L(n){return n.map((t,e)=>({start:J(t.start),end:e+1<n.length?J(n[e+1].start):b,slot:t}))}function Ze(){let n=new Date;return n.getHours()*60+n.getMinutes()}function Je(){return m[(new Date().getDay()+6)%7]}function T(n,t){if(!n)return"";let e=new Date(n),i=t.locale?.language||t.language,s=new Date,a=e.toLocaleTimeString(i,{hour:"2-digit",minute:"2-digit"});return e.toDateString()===s.toDateString()?a:`${e.toLocaleDateString(i,{weekday:"short"})} ${a}`}var Fe={de:{auto:"Auto",heat:"Manuell",off:"Aus",schedule:"Zeitplan",schedules:"Zeitpl\xE4ne",edit:"Wochenplan bearbeiten",schedule_paused:"pausiert",period:"Zeitraum",period_until:"bis",period_open:"bis auf Weiteres",period_planned:"Geplant",period_from:"ab",period_end:"Beenden",period_delete:"L\xF6schen",until:"bis",next:"N\xE4chster Wechsel",src_override:"Globaler Override",src_off:"Frostschutz",src_manual:"Manuell",src_hand:"Ge\xE4ndert",src_schedule:"Zeitplan",heating:"Heizt",idle:"Bereit",save:"Speichern",discard:"Verwerfen",close:"Schlie\xDFen",new_schedule:"Neuer Zeitplan",rename:"Umbenennen",duplicate:"Duplizieren",delete:"L\xF6schen",activate:"Aktivieren",active:"Aktiv",split:"Teilen",copy_day:"Tag kopieren auf \u2026",copy:"Kopieren",workdays:"Mo\u2013Fr",all_days:"Alle",fixed:"Fest",variables:"Variablen",add_variable:"Variable hinzuf\xFCgen",name:"Name",value:"Wert",unsaved:"Ungespeicherte \xC4nderungen verwerfen?",confirm_delete:"Zeitplan wirklich l\xF6schen?",tap_hint:"Tippe auf einen Abschnitt zum Bearbeiten, ziehe die Grenzen zum Verschieben.",days:["Mo","Di","Mi","Do","Fr","Sa","So"],not_found:"Raum nicht gefunden. Bitte in der Kartenkonfiguration einen Best-Thermostat-Raum w\xE4hlen.",loading:"Lade \u2026",override:"Globaler Override",override_also:"Gilt auch f\xFCr",override_not_applied:"Override gilt hier nicht",rooms:"R\xE4ume",variables_note:"Variablen gelten f\xFCr alle R\xE4ume und werden sofort gespeichert."},en:{auto:"Auto",heat:"Manual",off:"Off",schedule:"Schedule",schedules:"Schedules",edit:"Edit weekly plan",schedule_paused:"paused",period:"Period",period_until:"until",period_open:"until cancelled",period_planned:"Planned",period_from:"from",period_end:"End",period_delete:"Delete",until:"until",next:"Next change",src_override:"Global override",src_off:"Frost protection",src_manual:"Manual",src_hand:"Changed",src_schedule:"Schedule",heating:"Heating",idle:"Idle",save:"Save",discard:"Discard",close:"Close",new_schedule:"New schedule",rename:"Rename",duplicate:"Duplicate",delete:"Delete",activate:"Activate",active:"Active",split:"Split",copy_day:"Copy day to \u2026",copy:"Copy",workdays:"Mon\u2013Fri",all_days:"All",fixed:"Fixed",variables:"Variables",add_variable:"Add variable",name:"Name",value:"Value",unsaved:"Discard unsaved changes?",confirm_delete:"Really delete this schedule?",tap_hint:"Tap a block to edit it, drag the borders to move them.",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],not_found:"Room not found. Please select a Best Thermostat room in the card configuration.",loading:"Loading \u2026",override:"Global override",override_also:"Also applies to",override_not_applied:"override not applied here",rooms:"Rooms",variables_note:"Variables apply to all rooms and are saved immediately."}};function g(n){return(n?.locale?.language||n?.language||"en").slice(0,2)==="de"?Fe.de:Fe.en}var Q=class extends _{constructor(){super(...arguments);this._vars=!1;this._busy=!1;this._newVarName="";this._newVarValue=20;this._nameValue="";this._onKey=e=>{e.key==="Escape"&&this._close()}}get _t(){return g(this.hass)}get _server(){return this.room?.schedules.find(e=>e.id===this._sid)?.week}get _dirty(){return!!this._draft&&!!this._server&&!we(this._draft,this._server)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey),document.documentElement.style.overflow="hidden"}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey),document.documentElement.style.overflow=""}willUpdate(e){this.room&&(this._sid||(this._sid=this.room.active_schedule),(e.has("room")||!this._draft)&&this._server&&(!this._draft||!this._dirtyAgainst(e))&&(this._draft=X(this._server)))}_dirtyAgainst(e){let s=e.get("room")?.schedules.find(a=>a.id===this._sid)?.week;return!!s&&!!this._draft&&!we(this._draft,s)}_close(){this._dirty&&!confirm(this._t.unsaved)||this.dispatchEvent(new CustomEvent("close"))}async _call(e,i){if(this.hass){this._busy=!0,this._error=void 0;try{return await V(this.hass,e,i)}catch(s){this._error=s?.message??String(s);return}finally{this._busy=!1}}}_selectSchedule(e){e!==this._sid&&(this._dirty&&!confirm(this._t.unsaved)||(this._sid=e,this._draft=this._server?X(this._server):void 0,this._sel=void 0,this._copy=void 0))}_startName(e){let i=this.room?.schedules.find(s=>s.id===this._sid)?.name??"";this._nameAction=e,this._nameValue=e==="rename"?i:e==="duplicate"?`${i} 2`:""}async _submitName(){let e=this._nameValue.trim();if(!e||!this.room||!this._nameAction)return;let i=this.room.entry_id;if(this._nameAction==="rename")await this._call("schedule/rename",{entry_id:i,schedule_id:this._sid,name:e});else{let s=await this._call("schedule/create",{entry_id:i,name:e,copy_from:this._sid});s&&(this._sid=s.id,this._draft=void 0)}this._error||(this._nameAction=void 0)}async _delete(){if(!this.room||!confirm(this._t.confirm_delete))return;await this._call("schedule/delete",{entry_id:this.room.entry_id,schedule_id:this._sid})&&(this._sid=this.room.active_schedule,this._draft=void 0)}_activate(){this.room&&this._call("schedule/activate",{entry_id:this.room.entry_id,schedule_id:this._sid})}async _save(){if(!this.room||!this._draft)return;await this._call("schedule/save",{entry_id:this.room.entry_id,schedule_id:this._sid,week:this._draft})&&(this._sel=void 0)}_discard(){this._server&&(this._draft=X(this._server)),this._sel=void 0,this._copy=void 0}_mutate(e){if(!this._draft)return;let i=X(this._draft);e(i),this._draft=i}_slot(e){return this._draft?.[m[e.day]]?.[e.idx]}_setTemp(e){let i=this._sel;if(!i)return;let s=this.snap?.variables??[];this._mutate(a=>{let r=a[m[i.day]][i.idx],o=R(r,s)??20,d=Math.min(30,Math.max(5,Math.round((o+e)*2)/2));a[m[i.day]][i.idx]={start:r.start,temperature:d}})}_setVariable(e){let i=this._sel;if(!i)return;let s=this.snap?.variables??[];this._mutate(a=>{let r=a[m[i.day]][i.idx];a[m[i.day]][i.idx]=e===void 0?{start:r.start,temperature:R(r,s)??20}:{start:r.start,variable:e}})}_split(){let e=this._sel;if(!e||!this._draft)return;let i=L(this._draft[m[e.day]])[e.idx],s=ye((i.start+i.end)/2);s<=i.start||s>=i.end||(this._mutate(a=>{let r=a[m[e.day]];r.splice(e.idx+1,0,{...r[e.idx],start:S(s)})}),this._sel={day:e.day,idx:e.idx+1})}_remove(){let e=this._sel;!e||!this._draft||this._draft[m[e.day]].length<2||(this._mutate(s=>{let a=s[m[e.day]];e.idx===0?(a.splice(1,1,{...a[1],start:"00:00"}),a.splice(0,1)):a.splice(e.idx,1)}),this._sel={day:e.day,idx:Math.max(0,e.idx-1)})}_toggleCopy(e){let i=new Set(this._copy);i.has(e)?i.delete(e):i.add(e),this._copy=i}_applyCopy(){let e=this._sel;if(!e||!this._copy)return;let i=[...this._copy].filter(s=>s!==e.day);this._mutate(s=>{for(let a of i)s[m[a]]=JSON.parse(JSON.stringify(s[m[e.day]]))}),this._copy=void 0}_dragStart(e,i,s){e.preventDefault(),e.stopPropagation();let a=e.currentTarget;a.setPointerCapture(e.pointerId),this._drag={day:i,idx:s,bar:a.parentElement}}_dragMove(e){let i=this._drag;if(!i||!this._draft)return;let s=i.bar.getBoundingClientRect(),a=(e.clientX-s.left)/s.width*b,r=this._draft[m[i.day]],o=J(r[i.idx-1].start)+O,d=(i.idx+1<r.length?J(r[i.idx+1].start):b)-O,h=S(Math.min(d,Math.max(o,ye(a))));h!==r[i.idx].start&&this._mutate(p=>{p[m[i.day]][i.idx]={...p[m[i.day]][i.idx],start:h}})}_dragEnd(){this._drag=void 0}_varStep(e,i,s){let a=Math.min(30,Math.max(5,Math.round((i+s)*2)/2));this._call("variable/update",{variable_id:e,value:a})}async _addVar(){let e=this._newVarName.trim();if(!e)return;await this._call("variable/create",{name:e,value:this._newVarValue})&&(this._newVarName="",this.requestUpdate())}_deleteVar(e){this._call("variable/delete",{variable_id:e})}render(){if(!this.room||!this._draft)return l;let e=this._t,i=this.room,s=i.schedules.find(a=>a.id===this._sid);return c`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          <button class="round small" @click=${this._close} aria-label=${e.close}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <div class="h-title">
            <div class="h-name">${i.name}</div>
            <div class="muted h-sub">${e.schedules}</div>
          </div>
          <button class="chip" aria-pressed=${this._vars} @click=${()=>this._vars=!this._vars}>
            <ha-icon icon="mdi:variable"></ha-icon>${e.variables}
          </button>
        </header>

        <div class="content">
          <div class="chips scroll">
            ${i.schedules.map(a=>c`<button class="chip" aria-pressed=${a.id===this._sid}
                @click=${()=>this._selectSchedule(a.id)}>
                ${a.id===i.active_schedule?c`<ha-icon icon="mdi:check-circle"></ha-icon>`:l}
                ${a.name}
              </button>`)}
            <button class="chip" @click=${()=>this._startName("new")} aria-label=${e.new_schedule}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>

          <div class="chips actions">
            ${s?.id!==i.active_schedule?c`<button class="text-btn" @click=${this._activate}>${e.activate}</button>`:c`<span class="badge">${e.active}</span>`}
            <button class="text-btn" @click=${()=>this._startName("rename")}>${e.rename}</button>
            <button class="text-btn" @click=${()=>this._startName("duplicate")}>${e.duplicate}</button>
            <button class="text-btn" ?disabled=${s?.id===i.active_schedule}
              @click=${this._delete}>${e.delete}</button>
          </div>

          ${this._nameAction?this._renderNameInput():l}
          ${this._vars?this._renderVariables():l}

          <div class="week">
            <div class="ruler muted">
              <span></span>
              <div>${[0,3,6,9,12,15,18,21,24].map(a=>c`<span style="left:${a/24*100}%">${a}</span>`)}</div>
            </div>
            ${m.map((a,r)=>this._renderDay(a,r))}
          </div>
          <div class="muted hint">${e.tap_hint}</div>
          ${this._sel?this._renderSlotPanel(this._sel):l}
          ${this._error?c`<div class="error">${this._error}</div>`:l}
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
    `}_renderNameInput(){let e=this._t,i=this._nameAction==="rename"?e.rename:this._nameAction==="duplicate"?e.duplicate:e.new_schedule;return c`<div class="panel name-panel">
      <input type="text" .value=${this._nameValue} placeholder=${i} aria-label=${i}
        @input=${s=>this._nameValue=s.target.value}
        @keydown=${s=>s.key==="Enter"&&this._submitName()} />
      <button class="text-btn" @click=${()=>this._nameAction=void 0}>${e.close}</button>
      <button class="primary-btn" @click=${this._submitName}>${i}</button>
    </div>`}_renderVariables(){let e=this._t,i=this.snap?.variables??[];return c`<div class="panel vars">
      <div class="muted small-text">${e.variables_note}</div>
      ${i.map(s=>c`<div class="var-row">
          <span class="swatch" style="background:${v(s.value)}"></span>
          <span class="var-name">${s.name}</span>
          <button class="round small" @click=${()=>this._varStep(s.id,s.value,-.5)}>−</button>
          <span class="var-val">${f(s.value)}</span>
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
    </div>`}_renderDay(e,i){let s=this.snap?.variables??[],a=L(this._draft[e]),r=this._copy!==void 0;return c`<div class="day ${this._sel?.day===i?"active":""}">
      <span class="day-label">${this._t.days[i]}</span>
      <div class="bar" @pointermove=${this._dragMove} @pointerup=${this._dragEnd}
        @pointercancel=${this._dragEnd}>
        ${a.map((o,d)=>{let h=R(o.slot,s),p=(o.end-o.start)/b*100,u=this._sel?.day===i&&this._sel.idx===d;return c`<button class="seg ${u?"selected":""} ${o.slot.variable?"var":""}"
            style="left:${o.start/b*100}%;width:${p}%;background:${v(h)}"
            title="${S(o.start)}–${S(o.end%b)} · ${Y(o.slot,s)}"
            @click=${()=>{this._sel={day:i,idx:d},r||(this._copy=void 0)}}>
            ${p>7?c`<span>${o.slot.variable?Y(o.slot,s):f(h,!1)}</span>`:l}
          </button>`})}
        ${a.slice(1).map((o,d)=>{let h=this._drag?.day===i&&this._drag.idx===d+1;return c`<div class="handle ${h?"dragging":""}"
              style="left:${o.start/b*100}%"
              @pointerdown=${p=>this._dragStart(p,i,d+1)}>
              <span></span>
              ${h?c`<div class="time-tip">${S(o.start)}</div>`:l}
            </div>`})}
      </div>
    </div>`}_renderSlotPanel(e){let i=this._t,s=this.snap?.variables??[],a=this._slot(e);if(!a)return l;let r=L(this._draft[m[e.day]])[e.idx],o=R(a,s),d=this._draft[m[e.day]].length;return c`<div class="panel">
      <div class="panel-head">
        <span class="swatch" style="background:${v(o)}"></span>
        <strong>${i.days[e.day]} ${S(r.start)}–${S(r.end===b?0:r.end)}</strong>
        <span class="spacer"></span>
        <button class="round small" @click=${()=>this._sel=void 0} aria-label=${i.close}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="temp-row">
        <button class="round" @click=${()=>this._setTemp(-.5)}>−</button>
        <span class="temp-val">${f(o)}</span>
        <button class="round" @click=${()=>this._setTemp(.5)}>+</button>
      </div>
      <div class="chips">
        <button class="chip" aria-pressed=${a.variable===void 0}
          @click=${()=>this._setVariable(void 0)}>${i.fixed}</button>
        ${s.map(h=>c`<button class="chip" aria-pressed=${a.variable===h.id}
            @click=${()=>this._setVariable(h.id)}>${h.name} · ${f(h.value)}</button>`)}
      </div>
      <div class="chips actions">
        <button class="text-btn" ?disabled=${r.end-r.start<2*O} @click=${this._split}>
          <ha-icon icon="mdi:call-split"></ha-icon>${i.split}
        </button>
        <button class="text-btn" ?disabled=${d<2} @click=${this._remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${i.delete}
        </button>
        <button class="text-btn" @click=${()=>this._copy=this._copy?void 0:new Set}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${i.copy_day}
        </button>
      </div>
      ${this._copy?c`<div class="chips">
            ${i.days.map((h,p)=>c`<button class="chip" ?disabled=${p===e.day}
                aria-pressed=${this._copy.has(p)} @click=${()=>this._toggleCopy(p)}>${h}</button>`)}
            <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4])}>${i.workdays}</button>
            <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4,5,6])}>${i.all_days}</button>
            <button class="primary-btn" ?disabled=${![...this._copy].some(h=>h!==e.day)}
              @click=${this._applyCopy}>${i.copy}</button>
          </div>`:l}
    </div>`}};Q.properties={hass:{attribute:!1},snap:{attribute:!1},room:{attribute:!1},_sid:{state:!0},_draft:{state:!0},_sel:{state:!0},_copy:{state:!0},_vars:{state:!0},_error:{state:!0},_nameAction:{state:!0},_busy:{state:!0},_drag:{state:!0}},Q.styles=[H,$`
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
    `];customElements.define("bt-week-editor",Q);var U=class extends _{constructor(){super(...arguments);this._editing=!1}static getConfigElement(){return document.createElement("bestthermostat-card-editor")}static getStubConfig(e){return{entity:Object.values(e.states).find(s=>s.entity_id.startsWith("climate.")&&s.attributes.room_id)?.entity_id??""}}setConfig(e){this._config={show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,...e}}getCardSize(){return this._config?.compact?3:6}getGridOptions(){return this._config?.compact?{columns:6,rows:4,min_columns:4,min_rows:3}:{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),this._tick=window.setInterval(()=>this.requestUpdate(),6e4),this.hass&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,window.clearInterval(this._tick),this._editor?.remove(),this._editor=void 0,this._editing=!1}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&this._subscribe()}updated(){let e=this._room;this._editing&&e&&this.hass?(this._editor||(this._editor=document.createElement("bt-week-editor"),this._editor.addEventListener("close",()=>this._editing=!1),document.body.appendChild(this._editor)),this._editor.hass=this.hass,this._editor.snap=this._snap,this._editor.room=e):this._editor&&(this._editor.remove(),this._editor=void 0)}_subscribe(){this.hass&&(this._unsub=Z(this.hass,e=>this._snap=e))}get _room(){return qe(this._snap,this._config?.entity)}async _call(e,i){if(this.hass)try{this._error=void 0,await V(this.hass,e,i)}catch(s){this._error=s?.message??String(s)}}_step(e,i){let s=this._pending??e.target_temperature??20,a=Math.min(e.max_temp,Math.max(e.min_temp,Math.round((s+i)*2)/2));this._pending=a,window.clearTimeout(this._debounce),this._debounce=window.setTimeout(async()=>{await this._call("room/temperature",{entry_id:e.entry_id,temperature:a}),this._pending=void 0},700)}_mode(e,i){this._call("room/mode",{entry_id:e.entry_id,mode:i})}_schedule(e,i){this._call("schedule/activate",{entry_id:e.entry_id,schedule_id:i})}_moreInfo(e){e.climate_entity_id&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.climate_entity_id},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass)return l;let e=g(this.hass);if(!this._snap)return c`<ha-card><div class="msg">${e.loading}</div></ha-card>`;let i=this._room;if(!i)return c`<ha-card><div class="msg">${e.not_found}</div></ha-card>`;let s=this._config,a=i.hvac_action==="heating",r=this._pending??i.target_temperature,o=s.name||i.name,d=this._status(i);return c`
      <ha-card class=${s.compact?"compact":""}>
        <div class="head">
          <button class="icon ${a?"heating":""}" @click=${()=>this._moreInfo(i)}
            aria-label=${o}>
            <ha-icon icon=${i.mode==="off"?"mdi:radiator-off":"mdi:radiator"}></ha-icon>
          </button>
          <div class="title">
            <div class="name">${o}</div>
            <div class="sub muted">${d}</div>
          </div>
          <div class="current">
            <span class="big">${f(i.current_temperature,!1)}</span><span class="unit">°C</span>
          </div>
        </div>

        <div class="target">
          <button class="round" @click=${()=>this._step(i,-.5)} aria-label="-0.5">−</button>
          <div class="target-val" style="--c:${v(r??void 0)}">
            <span class="tv">${f(r,!1)}</span><span class="unit">°C</span>
            <div class="src muted">${e[`src_${i.target_source}`]}</div>
          </div>
          <button class="round" @click=${()=>this._step(i,.5)} aria-label="+0.5">+</button>
        </div>

        ${s.show_modes?this._renderModes(i):l}
        ${this._renderPeriod(i)}
        ${this._renderScheduleSection(i)}
        ${this._error?c`<div class="error">${this._error}</div>`:l}
        ${s.show_editor&&!s.compact?c`<div class="footer">
              <button class="text-btn" @click=${()=>this._editing=!0}>
                <ha-icon icon="mdi:calendar-edit"></ha-icon> ${e.edit}
              </button>
            </div>`:l}
      </ha-card>
    `}_status(e){let i=g(this.hass),s=e.schedules.find(r=>r.id===e.active_schedule)?.name??"",a=[];return e.override_active?a.push(i.src_override):e.period&&e.mode!=="auto"?a.push(e.period.title):e.mode==="auto"?(a.push(s),e.hand_until?a.push(`${i.until} ${T(e.hand_until,this.hass)}`):e.next_change&&a.push(`${T(e.next_change,this.hass)} \u2192 ${f(e.next_temperature)}`)):a.push(e.mode==="off"?i.src_off:i.src_manual),this._snap?.override.active&&!e.override_active&&a.push(i.override_not_applied),e.hvac_action==="heating"&&a.push(i.heating),a.filter(Boolean).join(" \xB7 ")}_renderPeriod(e){let i=g(this.hass),s=e.period,a=s?void 0:(e.periods??[]).find(d=>new Date(d.start).getTime()>Date.now()),r=s??a;if(!r)return l;let o=s?r.end?`${i.period_until} ${T(r.end,this.hass)}`:i.period_open:`${i.period_from} ${T(r.start,this.hass)}`;return c`<div class="period ${s?"active":""}">
      <ha-icon icon=${s?"mdi:calendar-star":"mdi:calendar-clock-outline"}></ha-icon>
      <div class="period-text">
        <div class="period-title">${s?"":`${i.period_planned}: `}${r.title}</div>
        <div class="muted period-when">${o}</div>
      </div>
      <button class="chip" @click=${()=>this._call("period/cancel",{entry_id:e.entry_id,period_id:r.id})}>
        ${s?i.period_end:i.period_delete}
      </button>
    </div>`}_renderModes(e){let i=g(this.hass),s=[["auto",i.auto,"mdi:calendar-clock"],["heat",i.heat,"mdi:hand-back-right"],["off",i.off,"mdi:snowflake"]];return c`<div class="chips scroll row">
      ${s.map(([a,r,o])=>c`<button class="chip" aria-pressed=${e.mode===a}
          @click=${()=>this._mode(e,a)}>
          <ha-icon icon=${o}></ha-icon>${r}
        </button>`)}
    </div>`}_renderScheduleSection(e){let i=this._config,s=i.show_schedules&&e.schedules.length>1,a=i.show_timeline&&!i.compact;if(!s&&!a)return l;let r=g(this.hass),o=e.mode!=="auto"||e.override_active;return c`<div class="sched-box ${o?"paused":""}">
      <div class="sched-head">
        <ha-icon icon="mdi:calendar-clock"></ha-icon>
        <span>${r.schedule}</span>
        ${o?c`<span class="muted sched-note">${r.schedule_paused}</span>`:l}
      </div>
      ${s?c`<div class="segmented" role="tablist">
            ${e.schedules.map(d=>c`<button role="tab" aria-selected=${d.id===e.active_schedule}
                @click=${()=>this._schedule(e,d.id)}>${d.name}</button>`)}
          </div>`:l}
      ${a?this._renderTimeline(e):l}
    </div>`}_renderTimeline(e){let i=e.schedules.find(o=>o.id===e.active_schedule);if(!i)return l;let s=this._snap.variables,a=L(i.week[Je()]??i.week[m[0]]),r=Ze();return c`<div class="timeline">
      <div class="bar">
        ${a.map(o=>{let d=R(o.slot,s),h=(o.end-o.start)/b*100;return c`<div class="seg" title="${Y(o.slot,s)}"
            style="left:${o.start/b*100}%;width:${h}%;background:${v(d)}">
            ${h>9?c`<span>${f(d,!1)}</span>`:l}
          </div>`})}
        <div class="now" style="left:${r/b*100}%"></div>
      </div>
      <div class="ticks muted"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`}};U.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_pending:{state:!0},_editing:{state:!0},_error:{state:!0}},U.styles=[H,$`
      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: var(--bt-gap);
        overflow: hidden;
        height: 100%;
        box-sizing: border-box;
      }
      .msg {
        padding: 8px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .icon {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bt-surface);
        color: var(--bt-muted);
        flex: none;
      }
      .icon.heating {
        background: color-mix(in srgb, var(--bt-heat) 20%, transparent);
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
      .current .big {
        font-size: 22px;
        font-weight: 500;
      }
      .unit {
        font-size: 13px;
        color: var(--bt-muted);
        margin-left: 2px;
      }
      .target {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 4px 0;
      }
      .target-val {
        text-align: center;
        flex: 1;
      }
      .tv {
        font-size: 44px;
        font-weight: 400;
        line-height: 1.1;
        color: var(--primary-text-color);
      }
      .target-val .unit {
        font-size: 18px;
      }
      .target-val::after {
        content: "";
        display: block;
        width: 40px;
        height: 4px;
        border-radius: 2px;
        margin: 6px auto 0;
        background: var(--c);
      }
      .src {
        font-size: 12px;
      }
      .row ha-icon {
        --mdc-icon-size: 18px;
      }
      .period {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 8px 8px 12px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .period.active {
        background: color-mix(in srgb, var(--bt-accent) 16%, transparent);
      }
      .period ha-icon {
        --mdc-icon-size: 20px;
        color: var(--bt-accent);
      }
      .period-text {
        flex: 1;
        min-width: 0;
      }
      .period-title {
        font-weight: 500;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .period-when {
        font-size: 12px;
      }
      .period .chip {
        background: var(--card-background-color, #fff);
        min-height: 32px;
      }
      .sched-box {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .sched-head {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: var(--bt-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .sched-head ha-icon {
        --mdc-icon-size: 16px;
      }
      .sched-note {
        margin-left: auto;
        font-weight: 400;
        text-transform: none;
        letter-spacing: 0;
      }
      .sched-box.paused .timeline {
        opacity: 0.55;
      }
      .segmented {
        display: flex;
        gap: 4px;
        padding: 3px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .segmented button {
        flex: 1 0 auto;
        min-height: 34px;
        padding: 0 12px;
        border-radius: 9px;
        font-size: 14px;
        font-weight: 500;
        color: var(--bt-muted);
        white-space: nowrap;
      }
      .segmented button[aria-selected="true"] {
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
      }
      .sched-box .timeline .bar {
        background: var(--card-background-color, #fff);
      }
      .timeline .bar {
        position: relative;
        height: 28px;
        border-radius: 10px;
        overflow: hidden;
        background: var(--bt-surface);
      }
      .seg {
        position: absolute;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.7);
        border-right: 1px solid var(--bt-surface);
        box-sizing: border-box;
      }
      .now {
        position: absolute;
        top: -2px;
        bottom: -2px;
        width: 3px;
        margin-left: -1px;
        background: var(--primary-text-color);
        border-radius: 2px;
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        margin-top: 4px;
      }
      .footer {
        display: flex;
        justify-content: flex-end;
        margin: -4px -8px -8px;
      }
      .footer ha-icon {
        --mdc-icon-size: 18px;
        margin-right: 4px;
      }
      /* Compact: optimised for small square wall displays */
      ha-card.compact {
        padding: 12px;
        gap: 10px;
        justify-content: space-between;
      }
      ha-card.compact .tv {
        font-size: 52px;
      }
      ha-card.compact .round {
        width: 64px;
        height: 64px;
        font-size: 32px;
      }
      ha-card.compact .chip {
        min-height: 44px;
        flex: 1;
        justify-content: center;
      }
      ha-card.compact .segmented button {
        min-height: 42px;
      }
      ha-card.compact .sched-head {
        display: none;
      }
    `];var lt={entity:{de:"Raum",en:"Room"},name:{de:"Name (optional)",en:"Name (optional)"},compact:{de:"Kompaktmodus (Wanddisplay)",en:"Compact mode (wall display)"},show_modes:{de:"Modi anzeigen",en:"Show modes"},show_schedules:{de:"Zeitpl\xE4ne anzeigen",en:"Show schedules"},show_timeline:{de:"Zeitleiste heute anzeigen",en:"Show today's timeline"},show_editor:{de:"Button f\xFCr Wocheneditor",en:"Weekly editor button"},title:{de:"Titel",en:"Title"},show_override:{de:"Globalen Override anzeigen",en:"Show global override"},show_variables:{de:"Variablen anzeigen",en:"Show variables"}},ht=[{name:"entity",required:!0,selector:{entity:{filter:{domain:"climate",integration:"bestthermostat"}}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"compact",selector:{boolean:{}}},{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}}]}],pt=[{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"show_override",selector:{boolean:{}}},{name:"show_variables",selector:{boolean:{}}}]}],ee=class extends _{constructor(){super(...arguments);this._label=e=>{let i=(this.hass?.locale?.language||this.hass?.language||"en").startsWith("de")?"de":"en";return lt[e.name]?.[i]??e.name}}setConfig(e){this._config={...this.defaults,...e}}_changed(e){let i=e.detail.value;this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?l:c`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};ee.properties={hass:{attribute:!1},_config:{state:!0}};var ke=class extends ee{constructor(){super(...arguments);this.schema=ht;this.defaults={compact:!1,show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0}}},Se=class extends ee{constructor(){super(...arguments);this.schema=pt;this.defaults={show_override:!0,show_variables:!0}}};customElements.define("bestthermostat-card-editor",ke);customElements.define("bestthermostat-overview-card-editor",Se);var W=class extends _{static getConfigElement(){return document.createElement("bestthermostat-overview-card-editor")}static getStubConfig(){return{}}setConfig(t){this._config={show_override:!0,show_variables:!0,...t}}getCardSize(){return 2+(this._snap?.rooms.length??2)}connectedCallback(){super.connectedCallback(),this.hass&&(this._unsub=Z(this.hass,t=>this._snap=t))}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}willUpdate(t){t.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&(this._unsub=Z(this.hass,e=>this._snap=e))}async _call(t,e){try{this._error=void 0,await V(this.hass,t,e)}catch(i){this._error=i?.message??String(i)}}_open(t){t.climate_entity_id&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t.climate_entity_id},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass)return l;let t=g(this.hass),e=this._snap;if(!e)return c`<ha-card><div class="pad">${t.loading}</div></ha-card>`;let i=e.override;return c`<ha-card>
      <div class="pad col">
        <div class="title">${this._config.title??t.rooms}</div>
        ${this._config.show_override?c`<div class="row override ${i.active?"on":""}">
              <ha-icon icon="mdi:home-export-outline"></ha-icon>
              <span class="grow">${t.override}</span>
              <button class="round small" @click=${()=>this._call("override/set",{temperature:Math.max(5,(i.value??16)-.5)})}>−</button>
              <span class="val">${f(i.value)}</span>
              <button class="round small" @click=${()=>this._call("override/set",{temperature:Math.min(30,(i.value??16)+.5)})}>+</button>
              <button class="chip" aria-pressed=${i.active}
                @click=${()=>this._call("override/set",{active:!i.active})}>
                ${i.active?t.active:t.off}
              </button>
            </div>
            <div class="chips sub-row">
              <span class="muted also">${t.override_also}</span>
              ${[["include_manual",i.include_manual,t.heat],["include_off",i.include_off,t.off]].map(([s,a,r])=>c`<button class="chip small" aria-pressed=${a}
                  @click=${()=>this._call("override/set",{[s]:!a})}>
                  <ha-icon icon=${a?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
                  ${r}
                </button>`)}
            </div>`:l}
        ${this._config.show_variables&&e.variables.length?c`<div class="chips">
              ${e.variables.map(s=>c`<button class="chip var" aria-pressed=${this._editVar===s.id}
                  @click=${()=>this._editVar=this._editVar===s.id?void 0:s.id}>
                  <span class="dot" style="background:${v(s.value)}"></span>
                  ${s.name} ${f(s.value)}
                </button>`)}
            </div>
            ${this._renderVarEditor()}`:l}
        ${e.rooms.map(s=>this._renderRoom(s))}
        ${this._error?c`<div class="error">${this._error}</div>`:l}
      </div>
    </ha-card>`}_renderVarEditor(){let t=this._snap?.variables.find(s=>s.id===this._editVar);if(!t)return l;let e=g(this.hass),i=s=>this._call("variable/update",{variable_id:t.id,value:Math.min(30,Math.max(5,Math.round((t.value+s)*2)/2))});return c`<div class="row var-edit">
      <span class="dot big" style="background:${v(t.value)}"></span>
      <span class="grow">${t.name}</span>
      <button class="round small" @click=${()=>i(-.5)} aria-label="-0.5">−</button>
      <span class="val">${f(t.value)}</span>
      <button class="round small" @click=${()=>i(.5)} aria-label="+0.5">+</button>
      <button class="round small" @click=${()=>this._editVar=void 0} aria-label=${e.close}>
        <ha-icon icon="mdi:check"></ha-icon>
      </button>
    </div>`}_renderRoom(t){let e=g(this.hass),i=t.hvac_action==="heating",s=t.override_active?e.src_override:t.period?`${t.period.title}${t.period.end?` \xB7 ${e.period_until} ${T(t.period.end,this.hass)}`:""}`:t.target_source==="hand"?e.src_hand:t.mode==="auto"?e.src_schedule:t.mode==="off"?e.src_off:e.src_manual,a=[["auto",e.auto],["heat",e.heat],["off",e.off]];return c`<div class="room-block">
      <button class="room" @click=${()=>this._open(t)}>
        <span class="icon ${i?"heating":""}">
          <ha-icon icon=${t.mode==="off"?"mdi:radiator-off":"mdi:radiator"}></ha-icon>
        </span>
        <span class="grow left">
          <span class="name">${t.name}</span>
          <span class="muted sub">${s}</span>
        </span>
        <span class="temps">
          <span>${f(t.current_temperature)}</span>
          <span class="muted sub">→ ${f(t.target_temperature)}</span>
        </span>
      </button>
      <div class="bubbles">
        <div class="bubble-group">
          ${a.map(([r,o])=>c`<button class="bubble" aria-pressed=${t.mode===r}
              @click=${()=>this._call("room/mode",{entry_id:t.entry_id,mode:r})}>${o}</button>`)}
        </div>
        ${t.schedules.length>1?c`<div class="bubble-group sched">
              <ha-icon icon="mdi:calendar-clock"></ha-icon>
              ${t.schedules.map(r=>c`<button class="bubble" aria-pressed=${r.id===t.active_schedule}
                  @click=${()=>this._call("schedule/activate",{entry_id:t.entry_id,schedule_id:r.id})}>
                  ${r.name}
                </button>`)}
            </div>`:l}
      </div>
    </div>`}};W.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_error:{state:!0},_editVar:{state:!0}},W.styles=[H,$`
      .pad {
        padding: 16px;
      }
      .col {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .title {
        font-size: 18px;
        font-weight: 600;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .override {
        padding: 8px 10px;
        border-radius: var(--bt-radius);
        background: var(--bt-surface);
      }
      .override.on {
        background: color-mix(in srgb, var(--bt-accent) 18%, transparent);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .round.small {
        width: 34px;
        height: 34px;
        font-size: 20px;
        background: var(--card-background-color, #fff);
      }
      .val {
        min-width: 58px;
        text-align: center;
      }
      .sub-row {
        margin-top: -4px;
        align-items: center;
      }
      .also {
        font-size: 13px;
        margin-right: 2px;
      }
      .chip.small {
        min-height: 30px;
        font-size: 13px;
      }
      .chip.small ha-icon {
        --mdc-icon-size: 18px;
      }
      .chip.var {
        min-height: 30px;
        font-size: 13px;
      }
      .var-edit {
        padding: 6px 8px 6px 12px;
        border-radius: var(--bt-radius);
        background: var(--bt-surface);
        margin-top: -4px;
      }
      .dot.big {
        width: 12px;
        height: 12px;
      }
      .room-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--divider-color);
      }
      .room-block:last-of-type {
        border-bottom: none;
        padding-bottom: 0;
      }
      .bubbles {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding-left: 54px;
      }
      .bubble-group {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 2px;
        border-radius: 14px;
        background: var(--bt-surface);
      }
      .bubble-group.sched ha-icon {
        --mdc-icon-size: 15px;
        color: var(--bt-muted);
        margin: 0 2px 0 6px;
      }
      .bubble {
        min-height: 26px;
        padding: 0 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        color: var(--bt-muted);
        white-space: nowrap;
      }
      .bubble[aria-pressed="true"] {
        background: var(--bt-accent);
        color: var(--text-primary-color, #fff);
      }
      .bubble-group.sched .bubble[aria-pressed="true"] {
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
      }
      .chip.static {
        cursor: default;
        min-height: 30px;
        font-size: 13px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .room {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 4px;
        border-radius: 12px;
        text-align: left;
        width: 100%;
      }
      .room:hover {
        background: var(--bt-surface);
      }
      .icon {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bt-surface);
        color: var(--bt-muted);
        flex: none;
      }
      .icon.heating {
        background: color-mix(in srgb, var(--bt-heat) 20%, transparent);
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
        font-size: 12px;
      }
    `];var ut="0.2.1";customElements.get("bestthermostat-card")||customElements.define("bestthermostat-card",U);customElements.get("bestthermostat-overview-card")||customElements.define("bestthermostat-overview-card",W);var de=window;de.customCards=de.customCards||[];var Ae=(document.documentElement.lang||navigator.language||"").startsWith("de"),mt=[{type:"bestthermostat-card",name:"Best Thermostat",description:Ae?"Raumthermostat mit Zeitpl\xE4nen und Wocheneditor":"Room thermostat with schedules and weekly editor",preview:!0,documentationURL:"https://github.com/zitroaen/bestthermostat"},{type:"bestthermostat-overview-card",name:Ae?"Best Thermostat \xDCbersicht":"Best Thermostat Overview",description:Ae?"Alle R\xE4ume, globaler Override und Variablen":"All rooms, global override and variables",preview:!0}];for(let n of mt)de.customCards.some(t=>t?.type===n.type)||de.customCards.push(n);console.info(`%c BEST-THERMOSTAT %c ${ut} `,"background:#ff8100;color:#fff","");
