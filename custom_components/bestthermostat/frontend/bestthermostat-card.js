var et=globalThis,st=et.ShadowRoot&&(et.ShadyCSS===void 0||et.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,dt=Symbol(),At=new WeakMap,I=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==dt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(st&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=At.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&At.set(t,e))}return e}toString(){return this.cssText}},Et=n=>new I(typeof n=="string"?n:n+"",void 0,dt),v=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,a)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[a+1],n[0]);return new I(t,n,dt)},Ct=(n,e)=>{if(st)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=et.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},ct=st?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Et(t)})(n):n;var{is:Jt,defineProperty:Yt,getOwnPropertyDescriptor:Xt,getOwnPropertyNames:Qt,getOwnPropertySymbols:te,getPrototypeOf:ee}=Object,it=globalThis,Dt=it.trustedTypes,se=Dt?Dt.emptyScript:"",ie=it.reactiveElementPolyfillSupport,j=(n,e)=>n,lt={toAttribute(n,e){switch(e){case Boolean:n=n?se:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Rt=(n,e)=>!Jt(n,e),Mt={attribute:!0,type:String,converter:lt,reflect:!1,useDefault:!1,hasChanged:Rt};Symbol.metadata??=Symbol("metadata"),it.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Mt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Yt(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:a}=Xt(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:i,set(r){let o=i?.call(this);a?.call(this,r),this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Mt}static _$Ei(){if(this.hasOwnProperty(j("elementProperties")))return;let e=ee(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(j("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(j("properties"))){let t=this.properties,s=[...Qt(t),...te(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(ct(i))}else e!==void 0&&t.push(ct(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ct(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let a=(s.converter?.toAttribute!==void 0?s.converter:lt).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),r=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:lt;this._$Em=i;let o=r.fromAttribute(t,a.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(e!==void 0){let r=this.constructor;if(i===!1&&(a=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??Rt)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),a!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,a]of s){let{wrapped:r}=a,o=this[i];r!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,a,o)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[j("elementProperties")]=new Map,y[j("finalized")]=new Map,ie?.({ReactiveElement:y}),(it.reactiveElementVersions??=[]).push("2.1.2");var gt=globalThis,Tt=n=>n,nt=gt.trustedTypes,Nt=nt?nt.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ut="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,Lt="?"+S,ne=`<${Lt}>`,C=document,B=()=>C.createComment(""),q=n=>n===null||typeof n!="object"&&typeof n!="function",bt=Array.isArray,ae=n=>bt(n)||typeof n?.[Symbol.iterator]=="function",ht=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pt=/-->/g,zt=/>/g,A=RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ht=/'/g,Vt=/"/g,It=/^(?:script|style|textarea|title)$/i,vt=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),l=vt(1),be=vt(2),ve=vt(3),D=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Ot=new WeakMap,E=C.createTreeWalker(C,129);function jt(n,e){if(!bt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Nt!==void 0?Nt.createHTML(e):e}var re=(n,e)=>{let t=n.length-1,s=[],i,a=e===2?"<svg>":e===3?"<math>":"",r=W;for(let o=0;o<t;o++){let d=n[o],h,p,u=-1,b=0;for(;b<d.length&&(r.lastIndex=b,p=r.exec(d),p!==null);)b=r.lastIndex,r===W?p[1]==="!--"?r=Pt:p[1]!==void 0?r=zt:p[2]!==void 0?(It.test(p[2])&&(i=RegExp("</"+p[2],"g")),r=A):p[3]!==void 0&&(r=A):r===A?p[0]===">"?(r=i??W,u=-1):p[1]===void 0?u=-2:(u=r.lastIndex-p[2].length,h=p[1],r=p[3]===void 0?A:p[3]==='"'?Vt:Ht):r===Vt||r===Ht?r=A:r===Pt||r===zt?r=W:(r=A,i=void 0);let w=r===A&&n[o+1].startsWith("/>")?" ":"";a+=r===W?d+ne:u>=0?(s.push(h),d.slice(0,u)+Ut+d.slice(u)+S+w):d+S+(u===-2?o:w)}return[jt(n,a+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},K=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,r=0,o=e.length-1,d=this.parts,[h,p]=re(e,t);if(this.el=n.createElement(h,s),E.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=E.nextNode())!==null&&d.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Ut)){let b=p[r++],w=i.getAttribute(u).split(S),tt=/([.?@])?(.*)/.exec(b);d.push({type:1,index:a,name:tt[2],strings:w,ctor:tt[1]==="."?ut:tt[1]==="?"?mt:tt[1]==="@"?ft:N}),i.removeAttribute(u)}else u.startsWith(S)&&(d.push({type:6,index:a}),i.removeAttribute(u));if(It.test(i.tagName)){let u=i.textContent.split(S),b=u.length-1;if(b>0){i.textContent=nt?nt.emptyScript:"";for(let w=0;w<b;w++)i.append(u[w],B()),E.nextNode(),d.push({type:2,index:++a});i.append(u[b],B())}}}else if(i.nodeType===8)if(i.data===Lt)d.push({type:2,index:a});else{let u=-1;for(;(u=i.data.indexOf(S,u+1))!==-1;)d.push({type:7,index:a}),u+=S.length-1}a++}}static createElement(e,t){let s=C.createElement("template");return s.innerHTML=e,s}};function T(n,e,t=n,s){if(e===D)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,a=q(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=T(n,i._$AS(n,e.values),i,s)),e}var pt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??C).importNode(t,!0);E.currentNode=i;let a=E.nextNode(),r=0,o=0,d=s[0];for(;d!==void 0;){if(r===d.index){let h;d.type===2?h=new F(a,a.nextSibling,this,e):d.type===1?h=new d.ctor(a,d.name,d.strings,this,e):d.type===6&&(h=new _t(a,this,e)),this._$AV.push(h),d=s[++o]}r!==d?.index&&(a=E.nextNode(),r++)}return E.currentNode=C,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},F=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=T(this,e,t),q(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==D&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ae(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&q(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=K.createElement(jt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let a=new pt(i,this),r=a.u(this.options);a.p(t),this.T(r),this._$AH=a}}_$AC(e){let t=Ot.get(e.strings);return t===void 0&&Ot.set(e.strings,t=new K(e)),t}k(e){bt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let a of e)i===t.length?t.push(s=new n(this.O(B()),this.O(B()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Tt(e).nextSibling;Tt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},N=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(e,t=this,s,i){let a=this.strings,r=!1;if(a===void 0)e=T(this,e,t,0),r=!q(e)||e!==this._$AH&&e!==D,r&&(this._$AH=e);else{let o=e,d,h;for(e=a[0],d=0;d<a.length-1;d++)h=T(this,o[s+d],t,d),h===D&&(h=this._$AH[d]),r||=!q(h)||h!==this._$AH[d],h===c?e=c:e!==c&&(e+=(h??"")+a[d+1]),this._$AH[d]=h}r&&!i&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ut=class extends N{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},mt=class extends N{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},ft=class extends N{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=T(this,e,t,0)??c)===D)return;let s=this._$AH,i=e===c&&s!==c||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==c&&(s===c||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},_t=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){T(this,e)}};var oe=gt.litHtmlPolyfillSupport;oe?.(K,F),(gt.litHtmlVersions??=[]).push("3.3.3");var Wt=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let a=t?.renderBefore??null;s._$litPart$=i=new F(e.insertBefore(B(),a),a,void 0,t??{})}return i._$AI(n),i};var yt=globalThis,_=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Wt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}};_._$litElement$=!0,_.finalized=!0,yt.litElementHydrateSupport?.({LitElement:_});var de=yt.litElementPolyfillSupport;de?.({LitElement:_});(yt.litElementVersions??=[]).push("4.2.2");var qt="bestthermostat",m=["mon","tue","wed","thu","fri","sat","sun"],at,P,Bt,rt=new Set;function G(n,e){return rt.add(e),at&&e(at),(!P||Bt!==n.connection)&&(Bt=n.connection,P=n.connection.subscribeMessage(t=>{at=t,rt.forEach(s=>s(t))},{type:`${qt}/subscribe`}).catch(t=>(console.error("Best Thermostat: subscription failed",t),P=void 0,()=>{}))),()=>{if(rt.delete(e),rt.size===0&&P){let t=P;P=void 0,at=void 0,t.then(s=>s())}}}function z(n,e,t={}){return n.callWS({type:`${qt}/${e}`,...t})}function Kt(n,e){if(!(!n||!e))return n.rooms.find(t=>t.climate_entity_id===e||t.entry_id===e)}var H=v`
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
`;var V=15,g=1440;function Z(n){let[e,t]=n.split(":").map(Number);return e*60+t}function k(n){let e=Math.floor(n/60),t=n%60;return`${String(e).padStart(2,"0")}:${String(t).padStart(2,"0")}`}function xt(n){return Math.round(n/V)*V}function R(n,e){return n.variable!==void 0?e.find(t=>t.id===n.variable)?.value:n.temperature}function J(n,e){if(n.variable!==void 0){let t=e.find(s=>s.id===n.variable);return t?t.name:n.variable}return f(n.temperature)}function f(n,e=!0){if(n==null||Number.isNaN(n))return"\u2013";let t=(Math.round(n*2)/2).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1});return e?`${t} \xB0C`:t}var M=[[12,[90,140,220]],[16,[120,180,235]],[18,[150,210,200]],[19.5,[250,215,110]],[21,[255,175,85]],[23,[250,125,70]],[26,[225,75,60]]];function x(n){if(n===void 0)return"var(--disabled-color, #9e9e9e)";if(n<=M[0][0])return`rgb(${M[0][1].join(",")})`;for(let e=1;e<M.length;e++){let[t,s]=M[e];if(n<=t){let[i,a]=M[e-1],r=(n-i)/(t-i);return`rgb(${a.map((o,d)=>Math.round(o+(s[d]-o)*r)).join(",")})`}}return`rgb(${M[M.length-1][1].join(",")})`}function Y(n){return JSON.parse(JSON.stringify(n))}function $t(n,e){return JSON.stringify(n)===JSON.stringify(e)}function O(n){return n.map((e,t)=>({start:Z(e.start),end:t+1<n.length?Z(n[t+1].start):g,slot:e}))}function Gt(){let n=new Date;return n.getHours()*60+n.getMinutes()}function Zt(){return m[(new Date().getDay()+6)%7]}function wt(n,e){if(!n)return"";let t=new Date(n),s=e.locale?.language||e.language,i=new Date,a=t.toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit"});return t.toDateString()===i.toDateString()?a:`${t.toLocaleDateString(s,{weekday:"short"})} ${a}`}var Ft={de:{auto:"Auto",heat:"Manuell",off:"Aus",schedule:"Zeitplan",schedules:"Zeitpl\xE4ne",edit:"Wochenplan bearbeiten",resume:"Plan fortsetzen",until:"bis",next:"N\xE4chster Wechsel",src_override:"Globaler Override",src_off:"Frostschutz",src_manual:"Manuell",src_hand:"Ge\xE4ndert",src_schedule:"Zeitplan",heating:"Heizt",idle:"Bereit",save:"Speichern",discard:"Verwerfen",close:"Schlie\xDFen",new_schedule:"Neuer Zeitplan",rename:"Umbenennen",duplicate:"Duplizieren",delete:"L\xF6schen",activate:"Aktivieren",active:"Aktiv",split:"Teilen",copy_day:"Tag kopieren auf \u2026",copy:"Kopieren",workdays:"Mo\u2013Fr",all_days:"Alle",fixed:"Fest",variables:"Variablen",add_variable:"Variable hinzuf\xFCgen",name:"Name",value:"Wert",unsaved:"Ungespeicherte \xC4nderungen verwerfen?",confirm_delete:"Zeitplan wirklich l\xF6schen?",tap_hint:"Tippe auf einen Abschnitt zum Bearbeiten, ziehe die Grenzen zum Verschieben.",days:["Mo","Di","Mi","Do","Fr","Sa","So"],not_found:"Raum nicht gefunden. Bitte in der Kartenkonfiguration einen Best-Thermostat-Raum w\xE4hlen.",loading:"Lade \u2026",override:"Globaler Override",override_all:"auch Manuell/Aus",rooms:"R\xE4ume",variables_note:"Variablen gelten f\xFCr alle R\xE4ume und werden sofort gespeichert."},en:{auto:"Auto",heat:"Manual",off:"Off",schedule:"Schedule",schedules:"Schedules",edit:"Edit weekly plan",resume:"Resume schedule",until:"until",next:"Next change",src_override:"Global override",src_off:"Frost protection",src_manual:"Manual",src_hand:"Changed",src_schedule:"Schedule",heating:"Heating",idle:"Idle",save:"Save",discard:"Discard",close:"Close",new_schedule:"New schedule",rename:"Rename",duplicate:"Duplicate",delete:"Delete",activate:"Activate",active:"Active",split:"Split",copy_day:"Copy day to \u2026",copy:"Copy",workdays:"Mon\u2013Fri",all_days:"All",fixed:"Fixed",variables:"Variables",add_variable:"Add variable",name:"Name",value:"Value",unsaved:"Discard unsaved changes?",confirm_delete:"Really delete this schedule?",tap_hint:"Tap a block to edit it, drag the borders to move them.",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],not_found:"Room not found. Please select a Best Thermostat room in the card configuration.",loading:"Loading \u2026",override:"Global override",override_all:"also manual/off",rooms:"Rooms",variables_note:"Variables apply to all rooms and are saved immediately."}};function $(n){return(n?.locale?.language||n?.language||"en").slice(0,2)==="de"?Ft.de:Ft.en}var X=class extends _{constructor(){super(...arguments);this._vars=!1;this._busy=!1;this._newVarName="";this._newVarValue=20;this._nameValue="";this._onKey=t=>{t.key==="Escape"&&this._close()}}get _t(){return $(this.hass)}get _server(){return this.room?.schedules.find(t=>t.id===this._sid)?.week}get _dirty(){return!!this._draft&&!!this._server&&!$t(this._draft,this._server)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey),document.documentElement.style.overflow="hidden"}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey),document.documentElement.style.overflow=""}willUpdate(t){this.room&&(this._sid||(this._sid=this.room.active_schedule),(t.has("room")||!this._draft)&&this._server&&(!this._draft||!this._dirtyAgainst(t))&&(this._draft=Y(this._server)))}_dirtyAgainst(t){let i=t.get("room")?.schedules.find(a=>a.id===this._sid)?.week;return!!i&&!!this._draft&&!$t(this._draft,i)}_close(){this._dirty&&!confirm(this._t.unsaved)||this.dispatchEvent(new CustomEvent("close"))}async _call(t,s){if(this.hass){this._busy=!0,this._error=void 0;try{return await z(this.hass,t,s)}catch(i){this._error=i?.message??String(i);return}finally{this._busy=!1}}}_selectSchedule(t){t!==this._sid&&(this._dirty&&!confirm(this._t.unsaved)||(this._sid=t,this._draft=this._server?Y(this._server):void 0,this._sel=void 0,this._copy=void 0))}_startName(t){let s=this.room?.schedules.find(i=>i.id===this._sid)?.name??"";this._nameAction=t,this._nameValue=t==="rename"?s:t==="duplicate"?`${s} 2`:""}async _submitName(){let t=this._nameValue.trim();if(!t||!this.room||!this._nameAction)return;let s=this.room.entry_id;if(this._nameAction==="rename")await this._call("schedule/rename",{entry_id:s,schedule_id:this._sid,name:t});else{let i=await this._call("schedule/create",{entry_id:s,name:t,copy_from:this._sid});i&&(this._sid=i.id,this._draft=void 0)}this._error||(this._nameAction=void 0)}async _delete(){if(!this.room||!confirm(this._t.confirm_delete))return;await this._call("schedule/delete",{entry_id:this.room.entry_id,schedule_id:this._sid})&&(this._sid=this.room.active_schedule,this._draft=void 0)}_activate(){this.room&&this._call("schedule/activate",{entry_id:this.room.entry_id,schedule_id:this._sid})}async _save(){if(!this.room||!this._draft)return;await this._call("schedule/save",{entry_id:this.room.entry_id,schedule_id:this._sid,week:this._draft})&&(this._sel=void 0)}_discard(){this._server&&(this._draft=Y(this._server)),this._sel=void 0,this._copy=void 0}_mutate(t){if(!this._draft)return;let s=Y(this._draft);t(s),this._draft=s}_slot(t){return this._draft?.[m[t.day]]?.[t.idx]}_setTemp(t){let s=this._sel;if(!s)return;let i=this.snap?.variables??[];this._mutate(a=>{let r=a[m[s.day]][s.idx],o=R(r,i)??20,d=Math.min(30,Math.max(5,Math.round((o+t)*2)/2));a[m[s.day]][s.idx]={start:r.start,temperature:d}})}_setVariable(t){let s=this._sel;if(!s)return;let i=this.snap?.variables??[];this._mutate(a=>{let r=a[m[s.day]][s.idx];a[m[s.day]][s.idx]=t===void 0?{start:r.start,temperature:R(r,i)??20}:{start:r.start,variable:t}})}_split(){let t=this._sel;if(!t||!this._draft)return;let s=O(this._draft[m[t.day]])[t.idx],i=xt((s.start+s.end)/2);i<=s.start||i>=s.end||(this._mutate(a=>{let r=a[m[t.day]];r.splice(t.idx+1,0,{...r[t.idx],start:k(i)})}),this._sel={day:t.day,idx:t.idx+1})}_remove(){let t=this._sel;!t||!this._draft||this._draft[m[t.day]].length<2||(this._mutate(i=>{let a=i[m[t.day]];t.idx===0?(a.splice(1,1,{...a[1],start:"00:00"}),a.splice(0,1)):a.splice(t.idx,1)}),this._sel={day:t.day,idx:Math.max(0,t.idx-1)})}_toggleCopy(t){let s=new Set(this._copy);s.has(t)?s.delete(t):s.add(t),this._copy=s}_applyCopy(){let t=this._sel;if(!t||!this._copy)return;let s=[...this._copy].filter(i=>i!==t.day);this._mutate(i=>{for(let a of s)i[m[a]]=JSON.parse(JSON.stringify(i[m[t.day]]))}),this._copy=void 0}_dragStart(t,s,i){t.preventDefault(),t.stopPropagation();let a=t.currentTarget;a.setPointerCapture(t.pointerId),this._drag={day:s,idx:i,bar:a.parentElement}}_dragMove(t){let s=this._drag;if(!s||!this._draft)return;let i=s.bar.getBoundingClientRect(),a=(t.clientX-i.left)/i.width*g,r=this._draft[m[s.day]],o=Z(r[s.idx-1].start)+V,d=(s.idx+1<r.length?Z(r[s.idx+1].start):g)-V,h=k(Math.min(d,Math.max(o,xt(a))));h!==r[s.idx].start&&this._mutate(p=>{p[m[s.day]][s.idx]={...p[m[s.day]][s.idx],start:h}})}_dragEnd(){this._drag=void 0}_varStep(t,s,i){let a=Math.min(30,Math.max(5,Math.round((s+i)*2)/2));this._call("variable/update",{variable_id:t,value:a})}async _addVar(){let t=this._newVarName.trim();if(!t)return;await this._call("variable/create",{name:t,value:this._newVarValue})&&(this._newVarName="",this.requestUpdate())}_deleteVar(t){this._call("variable/delete",{variable_id:t})}render(){if(!this.room||!this._draft)return c;let t=this._t,s=this.room,i=s.schedules.find(a=>a.id===this._sid);return l`
      <div class="backdrop" @click=${this._close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <header>
          <button class="round small" @click=${this._close} aria-label=${t.close}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <div class="h-title">
            <div class="h-name">${s.name}</div>
            <div class="muted h-sub">${t.schedules}</div>
          </div>
          <button class="chip" aria-pressed=${this._vars} @click=${()=>this._vars=!this._vars}>
            <ha-icon icon="mdi:variable"></ha-icon>${t.variables}
          </button>
        </header>

        <div class="content">
          <div class="chips scroll">
            ${s.schedules.map(a=>l`<button class="chip" aria-pressed=${a.id===this._sid}
                @click=${()=>this._selectSchedule(a.id)}>
                ${a.id===s.active_schedule?l`<ha-icon icon="mdi:check-circle"></ha-icon>`:c}
                ${a.name}
              </button>`)}
            <button class="chip" @click=${()=>this._startName("new")} aria-label=${t.new_schedule}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>

          <div class="chips actions">
            ${i?.id!==s.active_schedule?l`<button class="text-btn" @click=${this._activate}>${t.activate}</button>`:l`<span class="badge">${t.active}</span>`}
            <button class="text-btn" @click=${()=>this._startName("rename")}>${t.rename}</button>
            <button class="text-btn" @click=${()=>this._startName("duplicate")}>${t.duplicate}</button>
            <button class="text-btn" ?disabled=${i?.id===s.active_schedule}
              @click=${this._delete}>${t.delete}</button>
          </div>

          ${this._nameAction?this._renderNameInput():c}
          ${this._vars?this._renderVariables():c}

          <div class="week">
            <div class="ruler muted">
              <span></span>
              <div>${[0,3,6,9,12,15,18,21,24].map(a=>l`<span style="left:${a/24*100}%">${a}</span>`)}</div>
            </div>
            ${m.map((a,r)=>this._renderDay(a,r))}
          </div>
          <div class="muted hint">${t.tap_hint}</div>
          ${this._sel?this._renderSlotPanel(this._sel):c}
          ${this._error?l`<div class="error">${this._error}</div>`:c}
        </div>

        <footer>
          <button class="text-btn close-btn" @click=${this._close}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>${t.close}
          </button>
          <span class="spacer"></span>
          <button class="text-btn" ?disabled=${!this._dirty||this._busy} @click=${this._discard}>
            ${t.discard}
          </button>
          <button class="primary-btn" ?disabled=${!this._dirty||this._busy} @click=${this._save}>
            ${t.save}
          </button>
        </footer>
      </div>
    `}_renderNameInput(){let t=this._t,s=this._nameAction==="rename"?t.rename:this._nameAction==="duplicate"?t.duplicate:t.new_schedule;return l`<div class="panel name-panel">
      <input type="text" .value=${this._nameValue} placeholder=${s} aria-label=${s}
        @input=${i=>this._nameValue=i.target.value}
        @keydown=${i=>i.key==="Enter"&&this._submitName()} />
      <button class="text-btn" @click=${()=>this._nameAction=void 0}>${t.close}</button>
      <button class="primary-btn" @click=${this._submitName}>${s}</button>
    </div>`}_renderVariables(){let t=this._t,s=this.snap?.variables??[];return l`<div class="panel vars">
      <div class="muted small-text">${t.variables_note}</div>
      ${s.map(i=>l`<div class="var-row">
          <span class="swatch" style="background:${x(i.value)}"></span>
          <span class="var-name">${i.name}</span>
          <button class="round small" @click=${()=>this._varStep(i.id,i.value,-.5)}>−</button>
          <span class="var-val">${f(i.value)}</span>
          <button class="round small" @click=${()=>this._varStep(i.id,i.value,.5)}>+</button>
          <button class="round small" @click=${()=>this._deleteVar(i.id)} aria-label=${t.delete}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>`)}
      <div class="var-row">
        <input type="text" placeholder=${t.name} .value=${this._newVarName}
          @input=${i=>this._newVarName=i.target.value} />
        <input type="number" class="num" min="5" max="30" step="0.5" .value=${String(this._newVarValue)}
          @input=${i=>this._newVarValue=Number(i.target.value)} />
        <button class="primary-btn" @click=${this._addVar}>${t.add_variable}</button>
      </div>
    </div>`}_renderDay(t,s){let i=this.snap?.variables??[],a=O(this._draft[t]),r=this._copy!==void 0;return l`<div class="day ${this._sel?.day===s?"active":""}">
      <span class="day-label">${this._t.days[s]}</span>
      <div class="bar" @pointermove=${this._dragMove} @pointerup=${this._dragEnd}
        @pointercancel=${this._dragEnd}>
        ${a.map((o,d)=>{let h=R(o.slot,i),p=(o.end-o.start)/g*100,u=this._sel?.day===s&&this._sel.idx===d;return l`<button class="seg ${u?"selected":""} ${o.slot.variable?"var":""}"
            style="left:${o.start/g*100}%;width:${p}%;background:${x(h)}"
            title="${k(o.start)}–${k(o.end%g)} · ${J(o.slot,i)}"
            @click=${()=>{this._sel={day:s,idx:d},r||(this._copy=void 0)}}>
            ${p>7?l`<span>${o.slot.variable?J(o.slot,i):f(h,!1)}</span>`:c}
          </button>`})}
        ${a.slice(1).map((o,d)=>{let h=this._drag?.day===s&&this._drag.idx===d+1;return l`<div class="handle ${h?"dragging":""}"
              style="left:${o.start/g*100}%"
              @pointerdown=${p=>this._dragStart(p,s,d+1)}>
              <span></span>
              ${h?l`<div class="time-tip">${k(o.start)}</div>`:c}
            </div>`})}
      </div>
    </div>`}_renderSlotPanel(t){let s=this._t,i=this.snap?.variables??[],a=this._slot(t);if(!a)return c;let r=O(this._draft[m[t.day]])[t.idx],o=R(a,i),d=this._draft[m[t.day]].length;return l`<div class="panel">
      <div class="panel-head">
        <span class="swatch" style="background:${x(o)}"></span>
        <strong>${s.days[t.day]} ${k(r.start)}–${k(r.end===g?0:r.end)}</strong>
        <span class="spacer"></span>
        <button class="round small" @click=${()=>this._sel=void 0} aria-label=${s.close}>
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
          @click=${()=>this._setVariable(void 0)}>${s.fixed}</button>
        ${i.map(h=>l`<button class="chip" aria-pressed=${a.variable===h.id}
            @click=${()=>this._setVariable(h.id)}>${h.name} · ${f(h.value)}</button>`)}
      </div>
      <div class="chips actions">
        <button class="text-btn" ?disabled=${r.end-r.start<2*V} @click=${this._split}>
          <ha-icon icon="mdi:call-split"></ha-icon>${s.split}
        </button>
        <button class="text-btn" ?disabled=${d<2} @click=${this._remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${s.delete}
        </button>
        <button class="text-btn" @click=${()=>this._copy=this._copy?void 0:new Set}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${s.copy_day}
        </button>
      </div>
      ${this._copy?l`<div class="chips">
            ${s.days.map((h,p)=>l`<button class="chip" ?disabled=${p===t.day}
                aria-pressed=${this._copy.has(p)} @click=${()=>this._toggleCopy(p)}>${h}</button>`)}
            <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4])}>${s.workdays}</button>
            <button class="chip" @click=${()=>this._copy=new Set([0,1,2,3,4,5,6])}>${s.all_days}</button>
            <button class="primary-btn" ?disabled=${![...this._copy].some(h=>h!==t.day)}
              @click=${this._applyCopy}>${s.copy}</button>
          </div>`:c}
    </div>`}};X.properties={hass:{attribute:!1},snap:{attribute:!1},room:{attribute:!1},_sid:{state:!0},_draft:{state:!0},_sel:{state:!0},_copy:{state:!0},_vars:{state:!0},_error:{state:!0},_nameAction:{state:!0},_busy:{state:!0},_drag:{state:!0}},X.styles=[H,v`
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
    `];customElements.define("bt-week-editor",X);var U=class extends _{constructor(){super(...arguments);this._editing=!1}static getConfigElement(){return document.createElement("bestthermostat-card-editor")}static getStubConfig(t){return{entity:Object.values(t.states).find(i=>i.entity_id.startsWith("climate.")&&i.attributes.room_id)?.entity_id??""}}setConfig(t){this._config={show_modes:!0,show_schedules:!0,show_timeline:!0,show_actions:!0,show_editor:!0,...t}}getCardSize(){return this._config?.compact?3:6}getGridOptions(){return this._config?.compact?{columns:6,rows:4,min_columns:4,min_rows:3}:{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),this._tick=window.setInterval(()=>this.requestUpdate(),6e4),this.hass&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,window.clearInterval(this._tick),this._editor?.remove(),this._editor=void 0,this._editing=!1}willUpdate(t){t.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&this._subscribe()}updated(){let t=this._room;this._editing&&t&&this.hass?(this._editor||(this._editor=document.createElement("bt-week-editor"),this._editor.addEventListener("close",()=>this._editing=!1),document.body.appendChild(this._editor)),this._editor.hass=this.hass,this._editor.snap=this._snap,this._editor.room=t):this._editor&&(this._editor.remove(),this._editor=void 0)}_subscribe(){this.hass&&(this._unsub=G(this.hass,t=>this._snap=t))}get _room(){return Kt(this._snap,this._config?.entity)}async _call(t,s){if(this.hass)try{this._error=void 0,await z(this.hass,t,s)}catch(i){this._error=i?.message??String(i)}}_step(t,s){let i=this._pending??t.target_temperature??20,a=Math.min(t.max_temp,Math.max(t.min_temp,Math.round((i+s)*2)/2));this._pending=a,window.clearTimeout(this._debounce),this._debounce=window.setTimeout(async()=>{await this._call("room/temperature",{entry_id:t.entry_id,temperature:a}),this._pending=void 0},700)}_mode(t,s){this._call("room/mode",{entry_id:t.entry_id,mode:s})}_schedule(t,s){this._call("schedule/activate",{entry_id:t.entry_id,schedule_id:s})}_moreInfo(t){t.climate_entity_id&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t.climate_entity_id},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass)return c;let t=$(this.hass);if(!this._snap)return l`<ha-card><div class="msg">${t.loading}</div></ha-card>`;let s=this._room;if(!s)return l`<ha-card><div class="msg">${t.not_found}</div></ha-card>`;let i=this._config,a=s.hvac_action==="heating",r=this._pending??s.target_temperature,o=i.name||s.name,d=this._status(s);return l`
      <ha-card class=${i.compact?"compact":""}>
        <div class="head">
          <button class="icon ${a?"heating":""}" @click=${()=>this._moreInfo(s)}
            aria-label=${o}>
            <ha-icon icon=${s.mode==="off"?"mdi:radiator-off":"mdi:radiator"}></ha-icon>
          </button>
          <div class="title">
            <div class="name">${o}</div>
            <div class="sub muted">${d}</div>
          </div>
          <div class="current">
            <span class="big">${f(s.current_temperature,!1)}</span><span class="unit">°C</span>
          </div>
        </div>

        <div class="target">
          <button class="round" @click=${()=>this._step(s,-.5)} aria-label="-0.5">−</button>
          <div class="target-val" style="--c:${x(r??void 0)}">
            <span class="tv">${f(r,!1)}</span><span class="unit">°C</span>
            <div class="src muted">${t[`src_${s.target_source}`]}</div>
          </div>
          <button class="round" @click=${()=>this._step(s,.5)} aria-label="+0.5">+</button>
        </div>

        ${i.show_modes?this._renderModes(s):c}
        ${i.show_schedules?this._renderSchedules(s):c}
        ${i.show_timeline&&!i.compact?this._renderTimeline(s):c}
        ${this._error?l`<div class="error">${this._error}</div>`:c}
        ${i.show_editor&&!i.compact?l`<div class="footer">
              <button class="text-btn" @click=${()=>this._editing=!0}>
                <ha-icon icon="mdi:calendar-edit"></ha-icon> ${t.edit}
              </button>
            </div>`:c}
      </ha-card>
    `}_status(t){let s=$(this.hass),i=t.schedules.find(r=>r.id===t.active_schedule)?.name??"",a=[];return t.override_active?a.push(s.src_override):t.mode==="auto"?(a.push(i),t.hand_until?a.push(`${s.until} ${wt(t.hand_until,this.hass)}`):t.next_change&&a.push(`${wt(t.next_change,this.hass)} \u2192 ${f(t.next_temperature)}`)):a.push(t.mode==="off"?s.src_off:s.src_manual),t.hvac_action==="heating"&&a.push(s.heating),a.filter(Boolean).join(" \xB7 ")}_renderModes(t){let s=$(this.hass),i=[["auto",s.auto,"mdi:calendar-clock"],["heat",s.heat,"mdi:hand-back-right"],["off",s.off,"mdi:snowflake"]];return l`<div class="chips scroll row">
      ${i.map(([a,r,o])=>l`<button class="chip" aria-pressed=${t.mode===a}
          @click=${()=>this._mode(t,a)}>
          <ha-icon icon=${o}></ha-icon>${r}
        </button>`)}
      ${this._config?.show_actions&&t.hand_until?l`<button class="chip" @click=${()=>this._mode(t,"auto")}>
            <ha-icon icon="mdi:restore"></ha-icon>${s.resume}
          </button>`:c}
    </div>`}_renderSchedules(t){return t.schedules.length<2?c:l`<div class="chips scroll row">
      ${t.schedules.map(s=>l`<button class="chip" aria-pressed=${s.id===t.active_schedule}
          @click=${()=>this._schedule(t,s.id)}>${s.name}</button>`)}
    </div>`}_renderTimeline(t){let s=t.schedules.find(o=>o.id===t.active_schedule);if(!s)return c;let i=this._snap.variables,a=O(s.week[Zt()]??s.week[m[0]]),r=Gt();return l`<div class="timeline">
      <div class="bar">
        ${a.map(o=>{let d=R(o.slot,i),h=(o.end-o.start)/g*100;return l`<div class="seg" title="${J(o.slot,i)}"
            style="left:${o.start/g*100}%;width:${h}%;background:${x(d)}">
            ${h>9?l`<span>${f(d,!1)}</span>`:c}
          </div>`})}
        <div class="now" style="left:${r/g*100}%"></div>
      </div>
      <div class="ticks muted"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`}};U.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_pending:{state:!0},_editing:{state:!0},_error:{state:!0}},U.styles=[H,v`
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
        border-right: 1px solid var(--card-background-color, #fff);
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
    `];var ce={entity:{de:"Raum",en:"Room"},name:{de:"Name (optional)",en:"Name (optional)"},compact:{de:"Kompaktmodus (Wanddisplay)",en:"Compact mode (wall display)"},show_modes:{de:"Modi anzeigen",en:"Show modes"},show_schedules:{de:"Zeitpl\xE4ne anzeigen",en:"Show schedules"},show_timeline:{de:"Zeitleiste heute anzeigen",en:"Show today's timeline"},show_actions:{de:"Schnellaktionen anzeigen",en:"Show quick actions"},show_editor:{de:"Button f\xFCr Wocheneditor",en:"Weekly editor button"},title:{de:"Titel",en:"Title"},show_override:{de:"Globalen Override anzeigen",en:"Show global override"},show_variables:{de:"Variablen anzeigen",en:"Show variables"}},le=[{name:"entity",required:!0,selector:{entity:{filter:{domain:"climate",integration:"bestthermostat"}}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"compact",selector:{boolean:{}}},{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_actions",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}}]}],he=[{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"show_override",selector:{boolean:{}}},{name:"show_variables",selector:{boolean:{}}}]}],Q=class extends _{constructor(){super(...arguments);this._label=t=>{let s=(this.hass?.locale?.language||this.hass?.language||"en").startsWith("de")?"de":"en";return ce[t.name]?.[s]??t.name}}setConfig(t){this._config={...this.defaults,...t}}_changed(t){let s=t.detail.value;this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?c:l`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};Q.properties={hass:{attribute:!1},_config:{state:!0}};var St=class extends Q{constructor(){super(...arguments);this.schema=le;this.defaults={compact:!1,show_modes:!0,show_schedules:!0,show_timeline:!0,show_actions:!0,show_editor:!0}}},kt=class extends Q{constructor(){super(...arguments);this.schema=he;this.defaults={show_override:!0,show_variables:!0}}};customElements.define("bestthermostat-card-editor",St);customElements.define("bestthermostat-overview-card-editor",kt);var L=class extends _{static getConfigElement(){return document.createElement("bestthermostat-overview-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config={show_override:!0,show_variables:!0,...e}}getCardSize(){return 2+(this._snap?.rooms.length??2)}connectedCallback(){super.connectedCallback(),this.hass&&(this._unsub=G(this.hass,e=>this._snap=e))}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&(this._unsub=G(this.hass,t=>this._snap=t))}async _call(e,t){try{this._error=void 0,await z(this.hass,e,t)}catch(s){this._error=s?.message??String(s)}}_open(e){e.climate_entity_id&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.climate_entity_id},bubbles:!0,composed:!0}))}render(){if(!this._config||!this.hass)return c;let e=$(this.hass),t=this._snap;if(!t)return l`<ha-card><div class="pad">${e.loading}</div></ha-card>`;let s=t.override;return l`<ha-card>
      <div class="pad col">
        <div class="title">${this._config.title??e.rooms}</div>
        ${this._config.show_override?l`<div class="row override ${s.active?"on":""}">
              <ha-icon icon="mdi:home-export-outline"></ha-icon>
              <span class="grow">${e.override}</span>
              <button class="round small" @click=${()=>this._call("override/set",{temperature:Math.max(5,(s.value??16)-.5)})}>−</button>
              <span class="val">${f(s.value)}</span>
              <button class="round small" @click=${()=>this._call("override/set",{temperature:Math.min(30,(s.value??16)+.5)})}>+</button>
              <button class="chip" aria-pressed=${s.active}
                @click=${()=>this._call("override/set",{active:!s.active})}>
                ${s.active?e.active:e.off}
              </button>
            </div>`:c}
        ${this._config.show_variables&&t.variables.length?l`<div class="chips">
              ${t.variables.map(i=>l`<span class="chip static">
                  <span class="dot" style="background:${x(i.value)}"></span>
                  ${i.name} ${f(i.value)}
                </span>`)}
            </div>`:c}
        ${t.rooms.map(i=>this._renderRoom(i))}
        ${this._error?l`<div class="error">${this._error}</div>`:c}
      </div>
    </ha-card>`}_renderRoom(e){let t=$(this.hass),s=e.hvac_action==="heating",i=e.schedules.find(r=>r.id===e.active_schedule)?.name,a=e.override_active?t.src_override:e.mode==="auto"?i:e.mode==="off"?t.off:t.heat;return l`<button class="room" @click=${()=>this._open(e)}>
      <span class="icon ${s?"heating":""}">
        <ha-icon icon=${e.mode==="off"?"mdi:radiator-off":"mdi:radiator"}></ha-icon>
      </span>
      <span class="grow left">
        <span class="name">${e.name}</span>
        <span class="muted sub">${a}</span>
      </span>
      <span class="temps">
        <span>${f(e.current_temperature)}</span>
        <span class="muted sub">→ ${f(e.target_temperature)}</span>
      </span>
    </button>`}};L.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_error:{state:!0}},L.styles=[H,v`
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
    `];var pe="0.1.4";customElements.get("bestthermostat-card")||customElements.define("bestthermostat-card",U);customElements.get("bestthermostat-overview-card")||customElements.define("bestthermostat-overview-card",L);var ot=window;ot.customCards=ot.customCards||[];var ue=[{type:"bestthermostat-card",name:"Best Thermostat",description:"Raumthermostat mit Zeitpl\xE4nen und Wocheneditor",preview:!0,documentationURL:"https://github.com/zitroaen/bestthermostat"},{type:"bestthermostat-overview-card",name:"Best Thermostat \xDCbersicht",description:"Alle R\xE4ume, globaler Override und Variablen",preview:!0}];for(let n of ue)ot.customCards.some(e=>e?.type===n.type)||ot.customCards.push(n);console.info(`%c BEST-THERMOSTAT %c ${pe} `,"background:#ff8100;color:#fff","");
