var de=globalThis,le=de.ShadowRoot&&(de.ShadyCSS===void 0||de.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,we=Symbol(),We=new WeakMap,K=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==we)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(le&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=We.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&We.set(e,n))}return n}toString(){return this.cssText}},Ie=r=>new K(typeof r=="string"?r:r+"",void 0,we),$=(r,...n)=>{let e=r.length===1?r[0]:n.reduce((t,i,s)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[s+1],r[0]);return new K(e,r,we)},je=(r,n)=>{if(le)r.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=de.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,r.appendChild(t)}},ye=le?r=>r:r=>r instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return Ie(e)})(r):r;var{is:mt,defineProperty:_t,getOwnPropertyDescriptor:ft,getOwnPropertyNames:gt,getOwnPropertySymbols:bt,getPrototypeOf:vt}=Object,ce=globalThis,Be=ce.trustedTypes,xt=Be?Be.emptyScript:"",wt=ce.reactiveElementPolyfillSupport,F=(r,n)=>r,$e={toAttribute(r,n){switch(n){case Boolean:r=r?xt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,n){let e=r;switch(n){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Fe=(r,n)=>!mt(r,n),Ke={attribute:!0,type:String,converter:$e,reflect:!1,useDefault:!1,hasChanged:Fe};Symbol.metadata??=Symbol("metadata"),ce.litPropertyMetadata??=new WeakMap;var C=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Ke){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&_t(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:s}=ft(this.prototype,n)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let o=i?.call(this);s?.call(this,a),this.requestUpdate(n,o,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Ke}static _$Ei(){if(this.hasOwnProperty(F("elementProperties")))return;let n=vt(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(F("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F("properties"))){let e=this.properties,t=[...gt(e),...bt(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(ye(i))}else n!==void 0&&e.push(ye(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return je(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let s=(t.converter?.toAttribute!==void 0?t.converter:$e).toAttribute(e,t.type);this._$Em=n,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let s=t.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:$e;this._$Em=i;let o=a.fromAttribute(e,s.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(n,e,t,i=!1,s){if(n!==void 0){let a=this.constructor;if(i===!1&&(s=this[n]),t??=a.getPropertyOptions(n),!((t.hasChanged??Fe)(s,e)||t.useDefault&&t.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(a._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:s},a){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,a??e??this[n]),s!==!0||a!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,s]of t){let{wrapped:a}=s,o=this[i];a!==!0||this._$AL.has(i)||o===void 0||this.C(i,void 0,s,o)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[F("elementProperties")]=new Map,C[F("finalized")]=new Map,wt?.({ReactiveElement:C}),(ce.reactiveElementVersions??=[]).push("2.1.2");var ze=globalThis,Ze=r=>r,pe=ze.trustedTypes,qe=pe?pe.createPolicy("lit-html",{createHTML:r=>r}):void 0,et="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,tt="?"+z,yt=`<${tt}>`,N=document,q=()=>N.createComment(""),G=r=>r===null||typeof r!="object"&&typeof r!="function",Re=Array.isArray,$t=r=>Re(r)||typeof r?.[Symbol.iterator]=="function",ke=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ge=/-->/g,Je=/>/g,M=RegExp(`>|${ke}(?:([^\\s"'>=/]+)(${ke}*=${ke}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Xe=/"/g,it=/^(?:script|style|textarea|title)$/i,Pe=r=>(n,...e)=>({_$litType$:r,strings:n,values:e}),d=Pe(1),Vt=Pe(2),Wt=Pe(3),O=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),Qe=new WeakMap,T=N.createTreeWalker(N,129);function nt(r,n){if(!Re(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(n):n}var kt=(r,n)=>{let e=r.length-1,t=[],i,s=n===2?"<svg>":n===3?"<math>":"",a=Z;for(let o=0;o<e;o++){let c=r[o],h,p,u=-1,g=0;for(;g<c.length&&(a.lastIndex=g,p=a.exec(c),p!==null);)g=a.lastIndex,a===Z?p[1]==="!--"?a=Ge:p[1]!==void 0?a=Je:p[2]!==void 0?(it.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=M):p[3]!==void 0&&(a=M):a===M?p[0]===">"?(a=i??Z,u=-1):p[1]===void 0?u=-2:(u=a.lastIndex-p[2].length,h=p[1],a=p[3]===void 0?M:p[3]==='"'?Xe:Ye):a===Xe||a===Ye?a=M:a===Ge||a===Je?a=Z:(a=M,i=void 0);let m=a===M&&r[o+1].startsWith("/>")?" ":"";s+=a===Z?c+yt:u>=0?(t.push(h),c.slice(0,u)+et+c.slice(u)+z+m):c+z+(u===-2?o:m)}return[nt(r,s+(r[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},J=class r{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let s=0,a=0,o=n.length-1,c=this.parts,[h,p]=kt(n,e);if(this.el=r.createElement(h,t),T.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=T.nextNode())!==null&&c.length<o;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(et)){let g=p[a++],m=i.getAttribute(u).split(z),y=/([.?@])?(.*)/.exec(g);c.push({type:1,index:s,name:y[2],strings:m,ctor:y[1]==="."?Ee:y[1]==="?"?Ae:y[1]==="@"?Ce:V}),i.removeAttribute(u)}else u.startsWith(z)&&(c.push({type:6,index:s}),i.removeAttribute(u));if(it.test(i.tagName)){let u=i.textContent.split(z),g=u.length-1;if(g>0){i.textContent=pe?pe.emptyScript:"";for(let m=0;m<g;m++)i.append(u[m],q()),T.nextNode(),c.push({type:2,index:++s});i.append(u[g],q())}}}else if(i.nodeType===8)if(i.data===tt)c.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(z,u+1))!==-1;)c.push({type:7,index:s}),u+=z.length-1}s++}}static createElement(n,e){let t=N.createElement("template");return t.innerHTML=n,t}};function U(r,n,e=r,t){if(n===O)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,s=G(n)?void 0:n._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(r),i._$AT(r,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=U(r,i._$AS(r,n.values),i,t)),n}var Se=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??N).importNode(e,!0);T.currentNode=i;let s=T.nextNode(),a=0,o=0,c=t[0];for(;c!==void 0;){if(a===c.index){let h;c.type===2?h=new Y(s,s.nextSibling,this,n):c.type===1?h=new c.ctor(s,c.name,c.strings,this,n):c.type===6&&(h=new De(s,this,n)),this._$AV.push(h),c=t[++o]}a!==c?.index&&(s=T.nextNode(),a++)}return T.currentNode=N,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Y=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=U(this,n,e),G(n)?n===l||n==null||n===""?(this._$AH!==l&&this._$AR(),this._$AH=l):n!==this._$AH&&n!==O&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):$t(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==l&&G(this._$AH)?this._$AA.nextSibling.data=n:this.T(N.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=J.createElement(nt(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new Se(i,this),a=s.u(this.options);s.p(e),this.T(a),this._$AH=s}}_$AC(n){let e=Qe.get(n.strings);return e===void 0&&Qe.set(n.strings,e=new J(n)),e}k(n){Re(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let s of n)i===e.length?e.push(t=new r(this.O(q()),this.O(q()),this,this.options)):t=e[i],t._$AI(s),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=Ze(n).nextSibling;Ze(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},V=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,s){this.type=1,this._$AH=l,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=s,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=l}_$AI(n,e=this,t,i){let s=this.strings,a=!1;if(s===void 0)n=U(this,n,e,0),a=!G(n)||n!==this._$AH&&n!==O,a&&(this._$AH=n);else{let o=n,c,h;for(n=s[0],c=0;c<s.length-1;c++)h=U(this,o[t+c],e,c),h===O&&(h=this._$AH[c]),a||=!G(h)||h!==this._$AH[c],h===l?n=l:n!==l&&(n+=(h??"")+s[c+1]),this._$AH[c]=h}a&&!i&&this.j(n)}j(n){n===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Ee=class extends V{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===l?void 0:n}},Ae=class extends V{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==l)}},Ce=class extends V{constructor(n,e,t,i,s){super(n,e,t,i,s),this.type=5}_$AI(n,e=this){if((n=U(this,n,e,0)??l)===O)return;let t=this._$AH,i=n===l&&t!==l||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,s=n!==l&&(t===l||i);i&&this.element.removeEventListener(this.name,this,t),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},De=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){U(this,n)}};var St=ze.litHtmlPolyfillSupport;St?.(J,Y),(ze.litHtmlVersions??=[]).push("3.3.3");var st=(r,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let s=e?.renderBefore??null;t._$litPart$=i=new Y(n.insertBefore(q(),s),s,void 0,e??{})}return i._$AI(r),i};var Me=globalThis,v=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=st(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return O}};v._$litElement$=!0,v.finalized=!0,Me.litElementHydrateSupport?.({LitElement:v});var Et=Me.litElementPolyfillSupport;Et?.({LitElement:v});(Me.litElementVersions??=[]).push("4.2.2");var at="bestthermostat",f=["mon","tue","wed","thu","fri","sat","sun"],he,W,rt,ue=new Set;function X(r,n){return ue.add(n),he&&n(he),(!W||rt!==r.connection)&&(rt=r.connection,W=r.connection.subscribeMessage(e=>{he=e,ue.forEach(t=>t(e))},{type:`${at}/subscribe`}).catch(e=>(console.error("Best Thermostat: subscription failed",e),W=void 0,()=>{}))),()=>{if(ue.delete(n),ue.size===0&&W){let e=W;W=void 0,he=void 0,e.then(t=>t())}}}function D(r,n,e={}){return r.callWS({type:`${at}/${n}`,...e})}function ot(r,n){if(!(!r||!n))return r.rooms.find(e=>e.climate_entity_id===n||e.entry_id===n)}var R=$`
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
`;var k=15,x=1440;function P(r){let[n,e]=r.split(":").map(Number);return n*60+e}function S(r){let n=Math.floor(r/60),e=r%60;return`${String(n).padStart(2,"0")}:${String(e).padStart(2,"0")}`}function Te(r){return Math.round(r/k)*k}function H(r,n){return r.variable!==void 0?n.find(e=>e.id===r.variable)?.value:r.temperature}function Q(r,n){if(r.variable!==void 0){let e=n.find(t=>t.id===r.variable);return e?e.name:r.variable}return _(r.temperature)}function _(r,n=!0){if(r==null||Number.isNaN(r))return"\u2013";let e=(Math.round(r*2)/2).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1});return n?`${e} \xB0C`:e}var L=[[12,[90,140,220]],[16,[120,180,235]],[18,[150,210,200]],[19.5,[250,215,110]],[21,[255,175,85]],[23,[250,125,70]],[26,[225,75,60]]];function E(r){if(r===void 0)return"var(--disabled-color, #9e9e9e)";if(r<=L[0][0])return`rgb(${L[0][1].join(",")})`;for(let n=1;n<L.length;n++){let[e,t]=L[n];if(r<=e){let[i,s]=L[n-1],a=(r-i)/(e-i);return`rgb(${s.map((o,c)=>Math.round(o+(t[c]-o)*a)).join(",")})`}}return`rgb(${L[L.length-1][1].join(",")})`}function ee(r){return JSON.parse(JSON.stringify(r))}function Ne(r,n){return JSON.stringify(r)===JSON.stringify(n)}function I(r){return r.map((n,e)=>({start:P(n.start),end:e+1<r.length?P(r[e+1].start):x,slot:n}))}function me(){let r=new Date;return r.getHours()*60+r.getMinutes()}function _e(){return f[(new Date().getDay()+6)%7]}function w(r,n){if(!r)return"";let e=new Date(r),t=n.locale?.language||n.language,i=new Date,s=e.toLocaleTimeString(t,{hour:"2-digit",minute:"2-digit"});return e.toDateString()===i.toDateString()?s:`${e.toLocaleDateString(t,{weekday:"short"})} ${s}`}var dt={de:{auto:"Auto",heat:"Manuell",off:"Aus",schedule:"Zeitplan",schedules:"Zeitpl\xE4ne",edit:"Wochenplan bearbeiten",schedule_paused:"pausiert",period:"Zeitraum",period_until:"bis",period_open:"bis auf Weiteres",period_planned:"Geplant",period_from:"ab",period_end:"Beenden",period_delete:"L\xF6schen",period_plan:"Zeitraum planen",period_edit:"Zeitraum bearbeiten",period_less:"weniger anzeigen",period_what:"Was soll gelten?",period_start:"Beginn",period_end_label:"Ende",period_now:"Jetzt",period_at:"Zeitpunkt",period_title:"Titel",period_title_hint:"z. B. Besuch von Oma",period_invalid:"Bitte g\xFCltigen Beginn und ein Ende in der Zukunft nach dem Beginn w\xE4hlen.",period_more:"weitere geplant",optional:"optional",prio_title:"Priorit\xE4ten",prio_short:"Priorit\xE4t",week_plan:"Wochenplan",then:"dann",copy_to_rooms:"In andere R\xE4ume kopieren",copy_rooms_hint:"\u201E{name}\u201C wird in die gew\xE4hlten R\xE4ume kopiert. Gibt es dort schon einen gleichnamigen Zeitplan, wird er ersetzt.",will_replace:"wird ersetzt",will_create:"wird neu angelegt",all_rooms:"Alle R\xE4ume",copied_to:"Kopiert nach:",copy_unsaved:"Es wird der gespeicherte Stand kopiert, nicht deine ungespeicherten \xC4nderungen. Fortfahren?",battery:"Batterie",battery_low:"schwach",battery_ok:"OK",more:"Mehr",not_active:"Dieser Zeitplan ist gerade nicht aktiv.",unsaved_short:"Ungespeicherte \xC4nderungen",manage_variables:"Variablen verwalten",delete_schedule:"Zeitplan l\xF6schen",edit_short:"Bearbeiten",from:"Von",to:"Bis",days_long:["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],weekend:"Wochenende",copy_day_short:"Tag kopieren",add:"Hinzuf\xFCgen",cancel:"Abbrechen",ok:"OK",swipe_hint:"Zum \xC4ndern waagerecht wischen",today:"Heute",period_plural:"Zeitr\xE4ume",period_planned_n:"geplant",heating_summary:"heizen",of:"von",rooms_word:"R\xE4umen",other_floor:"Weitere",open_details:"Details",prio_hand:"\xC4nderung von Hand",prio_room:"Raum",prio_inactive:"aus",prio_none:"keine",until:"bis",next:"N\xE4chster Wechsel",src_override:"Globaler Override",src_off:"Frostschutz",src_manual:"Manuell",src_hand:"Ge\xE4ndert",src_schedule:"Zeitplan",heating:"Heizt",idle:"Bereit",save:"Speichern",discard:"Verwerfen",close:"Schlie\xDFen",new_schedule:"Neuer Zeitplan",rename:"Umbenennen",duplicate:"Duplizieren",delete:"L\xF6schen",activate:"Aktivieren",active:"Aktiv",split:"Teilen",copy_day:"Tag kopieren auf \u2026",copy:"Kopieren",workdays:"Mo\u2013Fr",all_days:"Alle",fixed:"Fest",variables:"Variablen",add_variable:"Variable hinzuf\xFCgen",name:"Name",value:"Wert",unsaved:"Ungespeicherte \xC4nderungen verwerfen?",confirm_delete:"Zeitplan wirklich l\xF6schen?",tap_hint:"Abschnitt antippen zum Bearbeiten, Grenzen ziehen zum Verschieben.",days:["Mo","Di","Mi","Do","Fr","Sa","So"],not_found:"Raum nicht gefunden. Bitte in der Kartenkonfiguration einen Best-Thermostat-Raum w\xE4hlen.",loading:"Lade \u2026",override:"Globaler Override",override_also:"Gilt auch f\xFCr",override_not_applied:"Override gilt hier nicht",rooms:"R\xE4ume",variables_note:"Variablen gelten f\xFCr alle R\xE4ume und werden sofort gespeichert."},en:{auto:"Auto",heat:"Manual",off:"Off",schedule:"Schedule",schedules:"Schedules",edit:"Edit weekly plan",schedule_paused:"paused",period:"Period",period_until:"until",period_open:"until cancelled",period_planned:"Planned",period_from:"from",period_end:"End",period_delete:"Delete",period_plan:"Plan period",period_edit:"Edit period",period_less:"show less",period_what:"What should apply?",period_start:"Start",period_end_label:"End",period_now:"Now",period_at:"At",period_title:"Title",period_title_hint:"e.g. Grandma visiting",period_invalid:"Please choose a valid start and an end in the future after the start.",period_more:"more planned",optional:"optional",prio_title:"Priorities",prio_short:"Priority",week_plan:"Weekly plan",then:"then",copy_to_rooms:"Copy to other rooms",copy_rooms_hint:'"{name}" is copied to the selected rooms. An existing schedule with the same name is replaced.',will_replace:"will be replaced",will_create:"will be created",all_rooms:"All rooms",copied_to:"Copied to:",copy_unsaved:"The saved version is copied, not your unsaved changes. Continue?",battery:"Battery",battery_low:"low",battery_ok:"OK",more:"More",not_active:"This schedule is currently not active.",unsaved_short:"Unsaved changes",manage_variables:"Manage variables",delete_schedule:"Delete schedule",edit_short:"Edit",from:"From",to:"To",days_long:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],weekend:"Weekend",copy_day_short:"Copy day",add:"Add",cancel:"Cancel",ok:"OK",swipe_hint:"Swipe horizontally to change",today:"Today",period_plural:"Periods",period_planned_n:"planned",heating_summary:"heating",of:"of",rooms_word:"rooms",other_floor:"Other",open_details:"Details",prio_hand:"Hand change",prio_room:"Room",prio_inactive:"off",prio_none:"none",until:"until",next:"Next change",src_override:"Global override",src_off:"Frost protection",src_manual:"Manual",src_hand:"Changed",src_schedule:"Schedule",heating:"Heating",idle:"Idle",save:"Save",discard:"Discard",close:"Close",new_schedule:"New schedule",rename:"Rename",duplicate:"Duplicate",delete:"Delete",activate:"Activate",active:"Active",split:"Split",copy_day:"Copy day to \u2026",copy:"Copy",workdays:"Mon\u2013Fri",all_days:"All",fixed:"Fixed",variables:"Variables",add_variable:"Add variable",name:"Name",value:"Value",unsaved:"Discard unsaved changes?",confirm_delete:"Really delete this schedule?",tap_hint:"Tap a block to edit it, drag the borders to move them.",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],not_found:"Room not found. Please select a Best Thermostat room in the card configuration.",loading:"Loading \u2026",override:"Global override",override_also:"Also applies to",override_not_applied:"override not applied here",rooms:"Rooms",variables_note:"Variables apply to all rooms and are saved immediately."}};function b(r){return(r?.locale?.language||r?.language||"en").slice(0,2)==="de"?dt.de:dt.en}function A(r,n){customElements.get(r)||customElements.define(r,n)}function lt(r,n){return r.schedules.find(e=>e.id===n)?.name??n}function fe(r){return r.area?.icon?r.area.icon:r.override_active?"mdi:home-export-outline":r.period?"mdi:calendar-star":r.mode==="off"?"mdi:radiator-off":r.mode==="heat"||r.target_source==="hand"?"mdi:hand-back-right":"mdi:radiator"}function Oe(r){return r.target_source==="schedule"&&!r.period&&!r.override_active}function ct(r){let n=r.filter(i=>Oe(i)&&i.next_change);if(n.length<2)return;let e=n[0];return n.every(i=>i.next_change===e.next_change&&i.next_temperature===e.next_temperature)?{time:e.next_change,temp:e.next_temperature}:void 0}function ge(r,n,e,t=!1){if(r.override_active)return n.src_override;if(r.target_source==="hand"&&r.hand_until)return`${n.src_hand} \xB7 ${n.until} ${w(r.hand_until,e)}`;if(r.period){let s=r.period.end?`${n.period_until} ${w(r.period.end,e)}`:n.period_open;return`${r.period.title} \xB7 ${s}`}if(r.mode==="off")return n.src_off;if(r.mode==="heat")return n.src_manual;let i=lt(r,r.active_schedule);return r.next_change&&!t?`${i} \xB7 ${w(r.next_change,e)} \u2192 ${_(r.next_temperature)}`:i}function pt(r,n,e,t){let i=n.override,s=r.override_active?1:r.target_source==="hand"?2:r.period?3:4,a=r.base_mode==="off"?`${e.src_off} \xB7 ${_(r.frost_temperature)}`:r.base_mode==="heat"?`${e.heat} \xB7 ${_(r.base_manual_temperature)}`:`${e.auto} \xB7 ${lt(r,r.base_schedule)}`;return{layers:[{n:1,icon:"mdi:home-export-outline",name:e.override,value:i.active?r.override_active?_(i.value):`${_(i.value)} \xB7 ${e.override_not_applied}`:e.prio_inactive},{n:2,icon:"mdi:hand-back-right",name:e.prio_hand,value:r.target_source==="hand"&&r.hand_until?`${_(r.target_temperature)} \xB7 ${e.until} ${w(r.hand_until,t)}`:e.prio_none},{n:3,icon:"mdi:calendar-star",name:e.period,value:r.period?`${r.period.title} \xB7 ${r.period.end?`${e.period_until} ${w(r.period.end,t)}`:e.period_open}`:e.prio_none},{n:4,icon:"mdi:radiator",name:e.prio_room,value:a}],winner:s}}function te(r){let n=Date.now();return(r.periods??[]).filter(e=>new Date(e.start).getTime()>n).sort((e,t)=>new Date(e.start).getTime()-new Date(t.start).getTime())}function ie(r){let n=r.batteries??[];if(!n.length)return;let e=n.filter(s=>s.level!=null),t=n.some(s=>s.low);return{level:e.length?Math.min(...e.map(s=>s.level)):null,low:t}}function Le(r,n){return r==null?n?"mdi:battery-alert-variant-outline":"mdi:battery":r<=10?"mdi:battery-alert-variant-outline":r>=95?"mdi:battery":`mdi:battery-${Math.max(10,Math.floor(r/10)*10)}`}var ne=class extends v{constructor(){super(...arguments);this._vars=!1;this._menu=!1;this._busy=!1;this._newVarName="";this._newVarValue=20;this._nameValue="";this._onKey=e=>{e.key==="Escape"&&this._close()};this._onWindowMove=e=>{this._drag&&(e.preventDefault(),this._dragMove(e))};this._onWindowUp=()=>{this._dragEnd(),window.removeEventListener("pointermove",this._onWindowMove),window.removeEventListener("pointerup",this._onWindowUp),window.removeEventListener("pointercancel",this._onWindowUp)}}get _t(){return b(this.hass)}get _server(){return this.room?.schedules.find(e=>e.id===this._sid)?.week}get _dirty(){return!!this._draft&&!!this._server&&!Ne(this._draft,this._server)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey),document.documentElement.style.overflow="hidden"}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey),document.documentElement.style.overflow=""}willUpdate(e){this.room&&(this._sid||(this._sid=this.room.active_schedule),(e.has("room")||!this._draft)&&this._server&&(!this._draft||!this._dirtyAgainst(e))&&(this._draft=ee(this._server)))}_dirtyAgainst(e){let i=e.get("room")?.schedules.find(s=>s.id===this._sid)?.week;return!!i&&!!this._draft&&!Ne(this._draft,i)}_close(){this._dirty&&!confirm(this._t.unsaved)||this.dispatchEvent(new CustomEvent("close"))}async _call(e,t){if(this.hass){this._busy=!0,this._error=void 0;try{return await D(this.hass,e,t)}catch(i){this._error=i?.message??String(i);return}finally{this._busy=!1}}}_selectSchedule(e){e!==this._sid&&(this._dirty&&!confirm(this._t.unsaved)||(this._sid=e,this._draft=this._server?ee(this._server):void 0,this._sel=void 0,this._copy=void 0))}_startName(e){let t=this.room?.schedules.find(i=>i.id===this._sid)?.name??"";this._sel=void 0,this._vars=!1,this._error=void 0,this._nameAction=e,this._nameValue=e==="rename"?t:e==="duplicate"?`${t} 2`:""}async _submitName(){let e=this._nameValue.trim();if(!e||!this.room||!this._nameAction)return;let t=this.room.entry_id;if(this._nameAction==="rename")await this._call("schedule/rename",{entry_id:t,schedule_id:this._sid,name:e});else{let i=await this._call("schedule/create",{entry_id:t,name:e,copy_from:this._sid});i&&(this._sid=i.id,this._draft=void 0)}this._error||(this._nameAction=void 0)}async _delete(){if(!this.room||!confirm(this._t.confirm_delete))return;await this._call("schedule/delete",{entry_id:this.room.entry_id,schedule_id:this._sid})&&(this._sid=this.room.active_schedule,this._draft=void 0)}_activate(){this.room&&this._call("schedule/activate",{entry_id:this.room.entry_id,schedule_id:this._sid})}async _save(){if(!this.room||!this._draft)return;await this._call("schedule/save",{entry_id:this.room.entry_id,schedule_id:this._sid,week:this._draft})&&(this._sel=void 0)}_discard(){this._server&&(this._draft=ee(this._server)),this._sel=void 0,this._copy=void 0}_mutate(e){if(!this._draft)return;let t=ee(this._draft);e(t),this._draft=t}_slot(e){return this._draft?.[f[e.day]]?.[e.idx]}_setTemp(e){let t=this._sel;if(!t)return;let i=this.snap?.variables??[];this._mutate(s=>{let a=s[f[t.day]][t.idx],o=H(a,i)??20,c=Math.min(30,Math.max(5,Math.round((o+e)*2)/2));s[f[t.day]][t.idx]={start:a.start,temperature:c}})}_setVariable(e){let t=this._sel;if(!t)return;let i=this.snap?.variables??[];this._mutate(s=>{let a=s[f[t.day]][t.idx];s[f[t.day]][t.idx]=e===void 0?{start:a.start,temperature:H(a,i)??20}:{start:a.start,variable:e}})}_split(){let e=this._sel;if(!e||!this._draft)return;let t=I(this._draft[f[e.day]])[e.idx],i=Te((t.start+t.end)/2);i<=t.start||i>=t.end||(this._mutate(s=>{let a=s[f[e.day]];a.splice(e.idx+1,0,{...a[e.idx],start:S(i)})}),this._sel={day:e.day,idx:e.idx+1})}_remove(){let e=this._sel;!e||!this._draft||this._draft[f[e.day]].length<2||(this._mutate(i=>{let s=i[f[e.day]];e.idx===0?(s.splice(1,1,{...s[1],start:"00:00"}),s.splice(0,1)):s.splice(e.idx,1)}),this._sel={day:e.day,idx:Math.max(0,e.idx-1)})}_toggleCopy(e){let t=new Set(this._copy);t.has(e)?t.delete(e):t.add(e),this._copy=t}_applyCopy(){let e=this._sel;if(!e||!this._copy)return;let t=[...this._copy].filter(i=>i!==e.day);this._mutate(i=>{for(let s of t)i[f[s]]=JSON.parse(JSON.stringify(i[f[e.day]]))}),this._copy=void 0}_dragStart(e,t,i){e.preventDefault(),e.stopPropagation();let s=e.currentTarget;try{s.setPointerCapture(e.pointerId)}catch{}this._drag={day:t,idx:i,bar:s.parentElement},window.addEventListener("pointermove",this._onWindowMove),window.addEventListener("pointerup",this._onWindowUp),window.addEventListener("pointercancel",this._onWindowUp)}_dragMove(e){let t=this._drag;if(!t||!this._draft)return;let i=t.bar.getBoundingClientRect(),s=(e.clientX-i.left)/i.width*x,a=this._draft[f[t.day]],o=P(a[t.idx-1].start)+k,c=(t.idx+1<a.length?P(a[t.idx+1].start):x)-k,h=S(Math.min(c,Math.max(o,Te(s))));h!==a[t.idx].start&&this._mutate(p=>{p[f[t.day]][t.idx]={...p[f[t.day]][t.idx],start:h}})}_dragEnd(){this._drag=void 0}_varStep(e,t,i){let s=Math.min(30,Math.max(5,Math.round((t+i)*2)/2));this._call("variable/update",{variable_id:e,value:s})}async _addVar(){let e=this._newVarName.trim();if(!e)return;await this._call("variable/create",{name:e,value:this._newVarValue})&&(this._newVarName="",this.requestUpdate())}_deleteVar(e){this._call("variable/delete",{variable_id:e})}_shift(e,t){let i=this._sel;if(!i||!this._draft)return;let s=this._draft[f[i.day]],a=e==="start"?i.idx:i.idx+1;if(a<=0||a>=s.length)return;let o=P(s[a-1].start)+k,c=(a+1<s.length?P(s[a+1].start):x)-k,h=Math.min(c,Math.max(o,P(s[a].start)+t));S(h)!==s[a].start&&this._mutate(p=>{p[f[i.day]][a]={...p[f[i.day]][a],start:S(h)}})}_select(e,t){this._sel={day:e,idx:t},this._copy=void 0,this._menu=!1}render(){if(!this.room||!this._draft)return l;let e=this._t,t=this.room,i=t.schedules.find(o=>o.id===this._sid),s=i?.id===t.active_schedule,a=!!this._sel||this._vars||!!this._nameAction||!!this._copyRooms;return d`
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
            ${t.schedules.map(o=>d`<button role="tab" aria-selected=${o.id===this._sid}
                @click=${()=>this._selectSchedule(o.id)}>
                ${o.name}${o.id===t.active_schedule?d`<i class="active-dot"></i>`:l}
              </button>`)}
            <button class="plus" aria-label=${e.new_schedule} @click=${()=>this._startName("new")}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>

          ${i&&!s?d`<div class="notice">
                <span>${e.not_active}</span>
                <button class="text-btn" @click=${this._activate}>${e.activate}</button>
              </div>`:l}

          <div class="week">
            <div class="ruler muted">
              <span></span>
              <div>${[0,6,12,18,24].map(o=>d`<span style="left:${o/24*100}%">${o}</span>`)}</div>
            </div>
            ${f.map((o,c)=>this._renderDay(o,c))}
          </div>
          ${this._renderLegend()}
          <div class="muted hint">${e.tap_hint}</div>
          ${this._error?d`<div class="error">${this._error}</div>`:l}
        </div>

        ${this._sel?this._renderSlotSheet(this._sel):l}
        ${this._vars?this._renderVariablesSheet():l}
        ${this._nameAction?this._renderNameSheet():l}
        ${this._copyRooms?this._renderCopyRoomsSheet():l}

        ${this._dirty&&!a?d`<div class="savebar">
              <span class="grow">${e.unsaved_short}</span>
              <button class="text-btn light" ?disabled=${this._busy} @click=${this._discard}>
                ${e.discard}
              </button>
              <button class="primary-btn" ?disabled=${this._busy} @click=${this._save}>${e.save}</button>
            </div>`:l}
      </div>
    `}_renderMenu(e){let t=this._t,i=this._sid!==e.base_schedule&&e.schedules.length>1,s=(a,o,c,h="",p=!1)=>d`<button class="menu-item ${h}" ?disabled=${p} @click=${()=>{this._menu=!1,c()}}><ha-icon icon=${a}></ha-icon>${o}</button>`;return d`<div class="menu" role="menu">
      ${s("mdi:pencil-outline",t.rename,()=>this._startName("rename"))}
      ${s("mdi:content-copy",t.duplicate,()=>this._startName("duplicate"))}
      ${s("mdi:home-export-outline",t.copy_to_rooms,()=>{this._sel=void 0,this._vars=!1,this._info=void 0,this._copyRooms=new Set},"",(this.snap?.rooms.length??0)<2)}
      ${s("mdi:thermometer-lines",t.manage_variables,()=>{this._sel=void 0,this._vars=!0})}
      <div class="menu-sep"></div>
      ${s("mdi:delete-outline",t.delete_schedule,()=>this._delete(),"danger",!i)}
    </div>`}_renderLegend(){let e=this._t,t=this.snap?.variables??[],i=new Set;for(let a of Object.values(this._draft??{}))for(let o of a)o.variable&&i.add(o.variable);let s=t.filter(a=>i.has(a.id));return d`<div class="legend">
      ${(s.length?s:t).map(a=>d`<span><i class="sw" style="background:${E(a.value)}"></i>${a.name}
          <b>${_(a.value,!1)}°</b></span>`)}
      <button class="text-btn small" @click=${()=>{this._sel=void 0,this._vars=!0}}>${e.edit_short}</button>
    </div>`}_renderDay(e,t){let i=this.snap?.variables??[],s=I(this._draft[e]),a=e===_e();return d`<div class="day ${this._sel?.day===t?"active":""}">
      <span class="day-label ${a?"today":""}">${this._t.days[t]}</span>
      <div class="bar">
        ${s.map((o,c)=>{let h=H(o.slot,i),p=(o.end-o.start)/x*100,u=this._sel?.day===t&&this._sel.idx===c;return d`<button class="seg-b ${u?"selected":""} ${o.slot.variable?"var":""}"
            style="left:${o.start/x*100}%;width:${p}%;background:${E(h)}"
            title="${S(o.start)}–${S(o.end%x)} · ${Q(o.slot,i)}"
            @click=${g=>{g.stopPropagation(),this._select(t,c)}}>
            ${p>8?d`<span>${o.slot.variable?Q(o.slot,i):`${_(h,!1)}\xB0`}</span>`:l}
          </button>`})}
        <div class="hours"></div>
        ${a?d`<div class="now" style="left:${me()/x*100}%"></div>`:l}
        ${s.slice(1).map((o,c)=>{let h=this._drag?.day===t&&this._drag.idx===c+1;return d`<div class="handle ${h?"dragging":""}"
            style="left:${o.start/x*100}%"
            @pointerdown=${p=>this._dragStart(p,t,c+1)}>
            <span></span><i class="knob"></i>
            ${h?d`<div class="time-tip">${S(o.start)}</div>`:l}
          </div>`})}
      </div>
    </div>`}_sheet(e,t,i){return d`<div class="scrim" @click=${i}></div>
      <div class="sheet" role="dialog">
        <div class="grab"></div>
        <div class="sheet-head">
          <span class="sheet-title">${e}</span>
          <button class="icon-btn small" aria-label=${this._t.close} @click=${i}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        ${t}
      </div>`}_renderSlotSheet(e){let t=this._t,i=this.snap?.variables??[],s=this._slot(e);if(!s)return l;let a=this._draft[f[e.day]],o=I(a)[e.idx],c=H(s,i),h=(u,g,m,y)=>d`<div class="time ${y?"":"fixed"}">
        <div><small>${u}</small><b>${g}</b></div>
        ${y?d`<div class="st">
              <button class="round tiny" @click=${()=>this._shift(m,-k)}>−</button>
              <button class="round tiny" @click=${()=>this._shift(m,k)}>+</button>
            </div>`:l}
      </div>`,p=d`
      <div class="times">
        ${h(t.from,S(o.start),"start",e.idx>0)}
        ${h(t.to,o.end===x?"24:00":S(o.end),"end",e.idx+1<a.length)}
      </div>
      <div class="chips">
        <button class="chip" aria-pressed=${s.variable===void 0}
          @click=${()=>this._setVariable(void 0)}>${t.fixed}</button>
        ${i.map(u=>d`<button class="chip" aria-pressed=${s.variable===u.id}
            @click=${()=>this._setVariable(u.id)}>
            <i class="sw" style="background:${E(u.value)}"></i>${u.name}
          </button>`)}
      </div>
      <div class="temp-row">
        <button class="round" @click=${()=>this._setTemp(-.5)}>−</button>
        <span class="temp-val">${_(c)}</span>
        <button class="round" @click=${()=>this._setTemp(.5)}>+</button>
      </div>
      ${this._copy?d`<div class="copy">
            <div class="muted small-text">${t.copy_day}</div>
            <div class="chips">
              ${t.days.map((u,g)=>d`<button class="chip" ?disabled=${g===e.day}
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
        <button ?disabled=${o.end-o.start<2*k} @click=${this._split}>
          <ha-icon icon="mdi:call-split"></ha-icon>${t.split}
        </button>
        <button aria-pressed=${!!this._copy} @click=${()=>this._copy=this._copy?void 0:new Set}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t.copy_day_short}
        </button>
        <button ?disabled=${a.length<2} @click=${this._remove}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${t.delete}
        </button>
      </div>`;return this._sheet(t.days_long[e.day],p,()=>{this._sel=void 0,this._copy=void 0})}_renderVariablesSheet(){let e=this._t,t=this.snap?.variables??[],i=d`
      <div class="var-list">
        ${t.map(s=>d`<div class="var-row">
            <i class="sw" style="background:${E(s.value)}"></i>
            <span class="grow">${s.name}</span>
            <button class="round tiny" @click=${()=>this._varStep(s.id,s.value,-.5)}>−</button>
            <span class="var-val">${_(s.value)}</span>
            <button class="round tiny" @click=${()=>this._varStep(s.id,s.value,.5)}>+</button>
            <button class="icon-btn small" aria-label=${e.delete} @click=${()=>this._deleteVar(s.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>`)}
      </div>
      <div class="var-add">
        <input type="text" placeholder=${e.name} .value=${this._newVarName}
          @input=${s=>this._newVarName=s.target.value} />
        <input type="number" class="num" min="5" max="30" step="0.5" .value=${String(this._newVarValue)}
          @input=${s=>this._newVarValue=Number(s.target.value)} />
        <button class="primary-btn" @click=${this._addVar}>${e.add}</button>
      </div>
      <div class="muted small-text">${e.variables_note}</div>
      ${this._error?d`<div class="error">${this._error}</div>`:l}`;return this._sheet(e.variables,i,()=>this._vars=!1)}async _copyToRooms(){if(!this.room||!this._copyRooms?.size||this._dirty&&!confirm(this._t.copy_unsaved))return;let e=await this._call("schedule/copy_to_rooms",{entry_id:this.room.entry_id,schedule_id:this._sid,targets:[...this._copyRooms]});if(e){let t=[...e.created??[],...e.replaced??[]].join(", ");this._info=`${this._t.copied_to} ${t}`,this._copyRooms=new Set}}_renderCopyRoomsSheet(){let e=this._t,t=this.room?.schedules.find(o=>o.id===this._sid)?.name??"",i=(this.snap?.rooms??[]).filter(o=>o.entry_id!==this.room?.entry_id),s=o=>{let c=new Set(this._copyRooms);c.has(o)?c.delete(o):c.add(o),this._copyRooms=c},a=d`
      <div class="muted small-text">${e.copy_rooms_hint.replace("{name}",t)}</div>
      <div class="room-list">
        ${i.map(o=>{let c=this._copyRooms.has(o.entry_id),h=o.schedules.some(p=>p.name.toLowerCase()===t.toLowerCase());return d`<button class="room-pick ${c?"on":""}" @click=${()=>s(o.entry_id)}>
            <ha-icon icon=${c?"mdi:checkbox-marked":"mdi:checkbox-blank-outline"}></ha-icon>
            <span class="grow">${o.name}${o.floor?d` <span class="muted">· ${o.floor.name}</span>`:l}</span>
            <span class="muted small-text">${h?e.will_replace:e.will_create}</span>
          </button>`})}
      </div>
      ${this._info?d`<div class="info">${this._info}</div>`:l}
      ${this._error?d`<div class="error">${this._error}</div>`:l}
      <div class="sheet-actions">
        <button class="text-btn" @click=${()=>this._copyRooms=new Set(i.map(o=>o.entry_id))}>
          ${e.all_rooms}
        </button>
        <span class="grow"></span>
        <button class="primary-btn" ?disabled=${!this._copyRooms.size||this._busy} @click=${this._copyToRooms}>
          ${e.copy}
        </button>
      </div>`;return this._sheet(`${e.copy_to_rooms}: ${t}`,a,()=>{this._copyRooms=void 0,this._info=void 0})}_renderNameSheet(){let e=this._t,t=this._nameAction==="rename"?e.rename:this._nameAction==="duplicate"?e.duplicate:e.new_schedule,i=d`
      <input type="text" .value=${this._nameValue} placeholder=${e.name} aria-label=${t}
        @input=${s=>this._nameValue=s.target.value}
        @keydown=${s=>s.key==="Enter"&&this._submitName()} />
      ${this._error?d`<div class="error">${this._error}</div>`:l}
      <div class="sheet-actions">
        <button class="text-btn" @click=${()=>this._nameAction=void 0}>${e.cancel}</button>
        <button class="primary-btn" ?disabled=${!this._nameValue.trim()||this._busy} @click=${this._submitName}>
          ${e.ok}
        </button>
      </div>`;return this._sheet(t,i,()=>this._nameAction=void 0)}};ne.properties={hass:{attribute:!1},snap:{attribute:!1},room:{attribute:!1},_sid:{state:!0},_draft:{state:!0},_sel:{state:!0},_copy:{state:!0},_vars:{state:!0},_error:{state:!0},_nameAction:{state:!0},_busy:{state:!0},_drag:{state:!0},_menu:{state:!0},_copyRooms:{state:!0},_info:{state:!0}},ne.styles=[R,$`
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
    `];A("bt-week-editor",ne);function se(r){let n=e=>String(e).padStart(2,"0");return`${r.getFullYear()}-${n(r.getMonth()+1)}-${n(r.getDate())}T${n(r.getHours())}:${n(r.getMinutes())}`}function ht(r){let n=new Date;return n.setMinutes(0,0,0),n.setHours(n.getHours()+r),n}var re=class extends v{constructor(){super(...arguments);this._initialized=!1;this._temp=21;this._startNow=!1;this._start=se(ht(1));this._openEnd=!1;this._end=se(ht(25));this._title="";this._busy=!1;this._onKey=e=>{e.key==="Escape"&&this._close()}}get _t(){return b(this.hass)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKey)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKey)}willUpdate(){if(!this._initialized&&this.room&&this.period){this._initialized=!0;let e=this.period;e.schedule?this._what={kind:"schedule",id:e.schedule}:this._what={kind:"mode",mode:e.mode??"off"},e.temperature!=null&&(this._temp=e.temperature),this._startNow=!1,this._start=se(new Date(e.start)),this._openEnd=!e.end,e.end&&(this._end=se(new Date(e.end))),this._title=e.summary??""}if(!this._what&&this.room){let e=this.room.schedules.find(t=>t.id!==this.room.base_schedule);this._what=e?{kind:"schedule",id:e.id}:{kind:"mode",mode:"off"},this._temp=Math.round((this.room.target_temperature??21)*2)/2}}_close(){this.dispatchEvent(new CustomEvent("close"))}get _valid(){let e=this._t,t=this._startNow?new Date:new Date(this._start);if(!this._startNow&&Number.isNaN(t.getTime()))return e.period_invalid;if(!this._openEnd){let i=new Date(this._end);if(Number.isNaN(i.getTime())||i<=t||i<=new Date)return e.period_invalid}}async _save(){if(!this.hass||!this.room||!this._what)return;let e={entry_id:this.room.entry_id};this._what.kind==="schedule"?e.schedule_id=this._what.id:(e.mode=this._what.mode,this._what.mode==="heat"&&(e.temperature=this._temp));let t=!!this.period;this._startNow?t&&(e.start=se(new Date)):e.start=this._start,this._openEnd?t&&(e.open_end=!0):e.end=this._end,t?(e.period_id=this.period.id,e.summary=this._title.trim()):this._title.trim()&&(e.summary=this._title.trim()),this._busy=!0,this._error=void 0;try{await D(this.hass,t?"period/update":"period/add",e),this._close()}catch(i){this._error=i?.message??String(i)}finally{this._busy=!1}}async _delete(){if(!(!this.hass||!this.room||!this.period)){this._busy=!0;try{await D(this.hass,"period/cancel",{entry_id:this.room.entry_id,period_id:this.period.id}),this._close()}catch(e){this._error=e?.message??String(e)}finally{this._busy=!1}}}_isWhat(e){let t=this._what;return!t||t.kind!==e.kind?!1:t.kind==="schedule"?t.id===e.id:t.mode===e.mode}render(){if(!this.room)return l;let e=this._t,t=this.room,i=this._valid,s=[["heat",e.heat],["off",e.off]];return d`
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
              ${s.map(([a,o])=>d`<button class="chip" aria-pressed=${this._isWhat({kind:"mode",mode:a})}
                  @click=${()=>this._what={kind:"mode",mode:a}}>
                  <ha-icon icon=${a==="off"?"mdi:snowflake":"mdi:hand-back-right"}></ha-icon>${o}
                </button>`)}
            </div>
            ${this._what?.kind==="mode"&&this._what.mode==="heat"?d`<div class="temp-row">
                  <button class="round" @click=${()=>this._temp=Math.max(5,this._temp-.5)}>−</button>
                  <span class="temp-val">${_(this._temp)}</span>
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
            ${this._startNow?l:d`<input type="datetime-local" step="900" .value=${this._start}
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
            ${this._openEnd?l:d`<input type="datetime-local" step="900" .value=${this._end}
                  @input=${a=>this._end=a.target.value} />`}
          </section>

          <section>
            <div class="label">${e.period_title} <span class="muted">(${e.optional})</span></div>
            <input type="text" .value=${this._title} placeholder=${e.period_title_hint}
              @input=${a=>this._title=a.target.value} />
          </section>
          ${this._error?d`<div class="error">${this._error}</div>`:l}
          ${i&&!this._error?d`<div class="muted small">${i}</div>`:l}
        </div>
        <footer>
          ${this.period?d`<button class="text-btn danger" ?disabled=${this._busy} @click=${this._delete}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>${this.period&&this.room?.period?.id===this.period.id?e.period_end:e.period_delete}
              </button>`:l}
          <span class="spacer"></span>
          <button class="text-btn" @click=${this._close}>${e.close}</button>
          <button class="primary-btn" ?disabled=${!!i||this._busy} @click=${this._save}>
            ${this.period?e.save:e.period_plan}
          </button>
        </footer>
      </div>
    `}};re.properties={hass:{attribute:!1},room:{attribute:!1},period:{attribute:!1},_what:{state:!0},_temp:{state:!0},_startNow:{state:!0},_start:{state:!0},_openEnd:{state:!0},_end:{state:!0},_title:{state:!0},_error:{state:!0},_busy:{state:!0}},re.styles=[R,$`
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
    `];A("bt-period-dialog",re);var At=24,j=class extends v{constructor(){super(...arguments);this._editing=!1;this._planning=!1;this._allPeriods=!1;this._batOpen=!1}static getConfigElement(){return document.createElement("bestthermostat-card-editor")}static getStubConfig(e){return{entity:Object.values(e.states).find(i=>i.entity_id.startsWith("climate.")&&i.attributes.room_id)?.entity_id??""}}setConfig(e){this._config={show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0,show_battery:!0,show_header:!0,...e}}set config(e){this.setConfig(e)}getCardSize(){return this._config?.compact?3:6}getGridOptions(){return this._config?.compact?{columns:6,rows:4,min_columns:4,min_rows:3}:{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),this._tick=window.setInterval(()=>this.requestUpdate(),6e4),this.hass&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,window.clearInterval(this._tick),this._editor?.remove(),this._editor=void 0,this._editing=!1,this._planner?.remove(),this._planner=void 0,this._planning=!1}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&this._subscribe()}updated(){let e=this._room;this._editing&&e&&this.hass?(this._editor||(this._editor=document.createElement("bt-week-editor"),this._editor.addEventListener("close",()=>this._editing=!1),document.body.appendChild(this._editor)),this._editor.hass=this.hass,this._editor.snap=this._snap,this._editor.room=e):this._editor&&(this._editor.remove(),this._editor=void 0),this._planning&&e&&this.hass?(this._planner||(this._planner=document.createElement("bt-period-dialog"),this._planner.addEventListener("close",()=>{this._planning=!1,this._editPeriod=void 0}),document.body.appendChild(this._planner)),this._planner.hass=this.hass,this._planner.room=e,this._planner.period=this._editPeriod):this._planner&&(this._planner.remove(),this._planner=void 0)}_subscribe(){this.hass&&(this._unsub=X(this.hass,e=>this._snap=e))}get _room(){return ot(this._snap,this._config?.entity)}async _call(e,t){if(this.hass)try{this._error=void 0,await D(this.hass,e,t)}catch(i){this._error=i?.message??String(i)}}_clampTemp(e,t){return Math.min(e.max_temp,Math.max(e.min_temp,Math.round(t*2)/2))}_swipeStart(e,t){e.pointerType==="mouse"&&e.button!==0||(this._swipe={x:e.clientX,start:this._pending??t.target_temperature??20,moved:!1,id:e.pointerId})}_swipeMove(e,t){let i=this._swipe;if(!i||i.id!==e.pointerId)return;let s=e.clientX-i.x;if(!i.moved){if(Math.abs(s)<10)return;i.moved=!0,e.currentTarget.setPointerCapture(e.pointerId),this.requestUpdate()}let a=this._clampTemp(t,i.start+Math.round(s/At)*.5);a!==this._pending&&(this._pending=a,window.clearTimeout(this._debounce),navigator.vibrate?.(5))}_swipeEnd(e,t){let i=this._swipe;this._swipe=void 0,!(!i||!i.moved||i.id!==e.pointerId)&&(this._pending!==void 0&&this._pending!==t.target_temperature?this._step(t,0):this._pending=void 0)}_step(e,t){let i=this._pending??e.target_temperature??20,s=this._clampTemp(e,i+t);this._pending=s,window.clearTimeout(this._debounce),this._debounce=window.setTimeout(async()=>{await this._call("room/temperature",{entry_id:e.entry_id,temperature:s}),this._pending=void 0},700)}_mode(e,t){this._call("room/mode",{entry_id:e.entry_id,mode:t})}_schedule(e,t){this._call("schedule/activate",{entry_id:e.entry_id,schedule_id:t})}_moreInfo(e){e.climate_entity_id&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e.climate_entity_id},bubbles:!0,composed:!0}))}_openPeriod(e){this._editPeriod=e,this._planning=!0}_toggle(e){this._section=this._section===e?void 0:e}render(){if(!this._config||!this.hass)return l;let e=b(this.hass);if(!this._snap)return d`<ha-card><div class="msg">${e.loading}</div></ha-card>`;let t=this._room;if(!t)return d`<ha-card><div class="msg">${e.not_found}</div></ha-card>`;let i=this._config,s=t.hvac_action==="heating",a=this._pending??t.target_temperature,o=i.name||t.name,c=[i.show_floor===!1?"":t.floor?.name,ge(t,e,this.hass),s?e.heating:""].filter(Boolean).join(" \xB7 ");return d`
      <ha-card class="${i.compact?"compact":""} ${i.embedded?"embedded":""}">
        ${i.show_header===!1?l:d`<div class="head">
          <button class="icon ${s?"heating":""} ${t.mode==="off"?"off":""}"
            @click=${()=>this._moreInfo(t)}
            aria-label=${o}>
            <ha-icon icon=${fe(t)}></ha-icon>
          </button>
          <div class="title">
            <div class="name">${o}</div>
            <div class="sub muted">${c}</div>
          </div>
          ${i.show_battery?this._batteryChip(t):l}
          ${i.show_editor&&!(i.show_timeline&&!i.compact)?this._pencil():l}
        </div>`}
        ${i.show_header===!1&&i.show_battery&&ie(t)?d`<div class="bat-line">${this._batteryChip(t)}</div>`:l}
        ${this._batOpen&&i.show_battery?this._batteryPanel(t):l}

        <div class="hero">
          <div class="current">
            <span class="big">${_(t.current_temperature,!1)}</span><span class="unit">°C</span>
          </div>
          <div class="ctl">
            <button class="round" @click=${()=>this._step(t,-.5)} aria-label="-0.5">−</button>
            <div class="target ${this._swipe?.moved?"swiping":""}" title=${e.swipe_hint}
              @pointerdown=${h=>this._swipeStart(h,t)}
              @pointermove=${h=>this._swipeMove(h,t)}
              @pointerup=${h=>this._swipeEnd(h,t)}
              @pointercancel=${()=>this._swipe=void 0}>
              <div class="tv" style="--c:${E(a??void 0)}">${_(a,!1)}°</div>
              <div class="muted src">${[t.target_variable,e[`src_${t.target_source}`]].filter(Boolean).join(" \xB7 ")}</div>
            </div>
            <button class="round" @click=${()=>this._step(t,.5)} aria-label="+0.5">+</button>
          </div>
        </div>

        ${i.show_modes?this._renderModes(t):l}
        ${i.show_timeline&&!i.compact?this._renderTimeline(t):l}
        ${i.show_schedules&&t.schedules.length>1?this._renderScheduleChoice(t):l}
        ${i.compact?l:this._renderList(t)}
        ${this._error?d`<div class="error">${this._error}</div>`:l}
      </ha-card>
    `}_batteryChip(e){let t=e.batteries??[],i=ie(e);if(!i)return l;let s=t.filter(c=>c.level!=null).map(c=>Math.round(c.level)),a=s.length?s.length<=3?`${s.join(" \xB7 ")} %`:`${Math.min(...s)} %`:"",o=b(this.hass);return d`<button class="bat-chip ${i.low?"low":""}" aria-expanded=${this._batOpen}
      title=${o.battery} @click=${()=>this._batOpen=!this._batOpen}>
      <ha-icon icon=${Le(i.level,i.low)}></ha-icon>${a}
    </button>`}_batteryPanel(e){let t=b(this.hass);return d`<div class="bat-panel">
      ${(e.batteries??[]).map(i=>d`<button class="bat ${i.low?"low":""}" ?disabled=${!i.device_id}
          @click=${()=>i.device_id&&this._navigate(`/config/devices/device/${i.device_id}`)}>
          <ha-icon icon=${Le(i.level,i.low)}></ha-icon>
          <span class="grow">${i.name}</span>
          <span class="bat-val">${i.level!=null?`${Math.round(i.level)} %`:i.low?t.battery_low:t.battery_ok}</span>
          ${i.device_id?d`<ha-icon class="go" icon="mdi:chevron-right"></ha-icon>`:l}
        </button>`)}
    </div>`}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_pencil(){let e=b(this.hass);return d`<button class="pencil" title=${e.edit} aria-label=${e.edit}
      @click=${()=>this._editing=!0}>
      <ha-icon icon="mdi:pencil"></ha-icon>
    </button>`}_renderModes(e){let t=b(this.hass),i=[["auto",t.auto],["heat",t.heat],["off",t.off]];return d`<div class="seg accent" role="tablist">
      ${i.map(([s,a])=>d`<button role="tab" aria-selected=${e.mode===s}
          @click=${()=>this._mode(e,s)}>${a}</button>`)}
    </div>`}_renderScheduleChoice(e){return d`<div class="seg" role="tablist">
      ${e.schedules.map(t=>d`<button role="tab" aria-selected=${t.id===e.active_schedule}
          @click=${()=>this._schedule(e,t.id)}>${t.name}</button>`)}
    </div>`}_renderTimeline(e){let t=b(this.hass),i=e.schedules.find(p=>p.id===e.active_schedule);if(!i)return l;let s=this._snap.variables,a=i.week?.[_e()]??i.week?.[f[0]];if(!a?.length)return l;let o=I(a),c=me(),h=e.mode!=="auto"||e.override_active;return d`<div class="timeline ${h?"paused":""}">
      <div class="cap muted">
        <span>${t.today} · ${i.name}${h?` \xB7 ${t.schedule_paused}`:""}</span>
        ${this._config.show_editor?this._pencil():l}
      </div>
      <div class="bar">
        ${o.map(p=>{let u=H(p.slot,s);return d`<div class="seg-t"
            title="${Q(p.slot,s)}"
            style="left:${p.start/x*100}%;width:${(p.end-p.start)/x*100}%;background:${E(u)}"></div>`})}
        <div class="now" style="left:${c/x*100}%"></div>
      </div>
      <div class="ticks muted"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
    </div>`}_row(e,t,i,s,a){let o=s!==void 0&&this._section===s,c=s!==void 0||a!==void 0;return d`<button class="row ${o?"open":""}" ?disabled=${!c}
      @click=${()=>s?this._toggle(s):a?.()}>
      <ha-icon icon=${e}></ha-icon>
      <span class="row-label">${t}</span>
      <span class="row-value">${i}</span>
      ${c?d`<ha-icon class="chev" icon=${o?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>`:l}
    </button>`}_renderList(e){let t=this._config,i=b(this.hass),s=this.hass,a=te(e),o=e.period?e.period.title:a.length?`${a.length} ${i.period_planned_n}`:i.prio_none,c=pt(e,this._snap,i,s),h=c.layers.find(p=>p.n===c.winner);return d`<div class="list">
      ${t.show_periods?d`${this._row("mdi:calendar-star",i.period_plural,o,"periods")}
          ${this._section==="periods"?d`<div class="detail">${this._renderPeriods(e)}</div>`:l}`:l}
      ${t.show_priorities?d`${this._row("mdi:layers-triple-outline",i.prio_short,h.name,"prio")}
          ${this._section==="prio"?d`<div class="detail">${this._renderPriorities(c)}</div>`:l}`:l}
    </div>`}_renderPriorities(e){return d`<div class="prio">
      ${e.layers.map(t=>d`<div class="prio-row ${t.n===e.winner?"win":t.n<e.winner?"idle":"below"}">
          <span class="prio-n">${t.n}</span>
          <span class="prio-name">${t.name}</span>
          <span class="prio-val">${t.value}</span>
        </div>`)}
    </div>`}_renderPeriods(e){let t=b(this.hass),i=this.hass,s=e.period,a=te(e),o=this._allPeriods?a:a.slice(0,3),c=p=>`${w(p.start,i)} \u2013 ${p.end?w(p.end,i):t.period_open}`,h=(p,u)=>d`<div class="period ${u?"active":""}">
      <button class="period-text" @click=${()=>this._openPeriod(p)}>
        <span class="period-title">${p.title}</span>
        <span class="muted period-when">${u?p.end?`${t.period_until} ${w(p.end,i)}`:t.period_open:c(p)}</span>
      </button>
      <button class="text-btn small" @click=${()=>this._call("period/cancel",{entry_id:e.entry_id,period_id:p.id})}>
        ${u?t.period_end:t.period_delete}
      </button>
    </div>`;return d`<div class="periods">
      ${s?h(s,!0):l}
      ${o.map(p=>h(p,!1))}
      ${a.length>3?d`<button class="text-btn small" @click=${()=>this._allPeriods=!this._allPeriods}>
            ${this._allPeriods?t.period_less:`+${a.length-o.length} ${t.period_more}`}
          </button>`:l}
      <button class="text-btn plan" @click=${()=>{this._editPeriod=void 0,this._planning=!0}}>
        <ha-icon icon="mdi:calendar-plus"></ha-icon> ${t.period_plan}
      </button>
    </div>`}};j.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_pending:{state:!0},_editing:{state:!0},_planning:{state:!0},_editPeriod:{state:!0},_allPeriods:{state:!0},_section:{state:!0},_batOpen:{state:!0},_swipe:{state:!0},_error:{state:!0}},j.styles=[R,$`
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
    `];var Ct={entity:{de:"Raum",en:"Room"},name:{de:"Name (optional)",en:"Name (optional)"},compact:{de:"Kompaktmodus (Wanddisplay)",en:"Compact mode (wall display)"},show_modes:{de:"Modi anzeigen",en:"Show modes"},show_schedules:{de:"Zeitpl\xE4ne anzeigen",en:"Show schedules"},show_timeline:{de:"Zeitleiste heute anzeigen",en:"Show today's timeline"},show_editor:{de:"Stift f\xFCr Wocheneditor",en:"Pencil for weekly editor"},show_periods:{de:"Zeitr\xE4ume anzeigen und planen",en:"Show and plan periods"},show_priorities:{de:"Priorit\xE4ten anzeigen",en:"Show priorities"},show_battery:{de:"Batteriesymbol anzeigen",en:"Show battery indicator"},title:{de:"Titel",en:"Title"},show_override:{de:"Globalen Override anzeigen",en:"Show global override"},show_variables:{de:"Variablen anzeigen",en:"Show variables"},group_by_floor:{de:"Nach Stockwerk gruppieren",en:"Group by floor"},layout:{de:"Darstellung",en:"Layout"},show_summary:{de:"Zusammenfassung anzeigen",en:"Show summary"},room:{de:"R\xE4ume (gilt f\xFCr alle)",en:"Rooms (applies to all)"},exclude_rooms:{de:"R\xE4ume ausblenden",en:"Hide rooms"}},Dt=[{name:"entity",required:!0,selector:{entity:{filter:{domain:"climate",integration:"bestthermostat"}}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"compact",selector:{boolean:{}}},{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}},{name:"show_battery",selector:{boolean:{}}}]}],zt=[{name:"show_modes",selector:{boolean:{}}},{name:"show_schedules",selector:{boolean:{}}},{name:"show_timeline",selector:{boolean:{}}},{name:"show_periods",selector:{boolean:{}}},{name:"show_priorities",selector:{boolean:{}}},{name:"show_battery",selector:{boolean:{}}},{name:"show_editor",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}}];function Rt(r){return[{name:"title",selector:{text:{}}},{name:"layout",selector:{select:{mode:"box",options:[{value:"list",label:r?"Liste (Raum zum Aufklappen)":"List (tap to expand)"},{value:"tiles",label:r?"Kacheln (alle R\xE4ume offen)":"Tiles (all rooms open)"}]}}},{type:"grid",name:"",schema:[{name:"show_summary",selector:{boolean:{}}},{name:"show_override",selector:{boolean:{}}},{name:"show_variables",selector:{boolean:{}}},{name:"group_by_floor",selector:{boolean:{}}}]},{type:"expandable",name:"room",title:r?"R\xE4ume (gilt f\xFCr alle)":"Rooms (applies to all)",schema:[{type:"grid",name:"",schema:zt}]},{name:"exclude_rooms",selector:{entity:{multiple:!0,filter:{domain:"climate",integration:"bestthermostat"}}}}]}var ae=class extends v{constructor(){super(...arguments);this._label=e=>{let t=(this.hass?.locale?.language||this.hass?.language||"en").startsWith("de")?"de":"en";return Ct[e.name]?.[t]??e.name}}setConfig(e){let t=this.defaults,i=e;this._config={...t,...i,...t.room?{room:{...t.room,...i.room??{}}}:{}}}_changed(e){let t=e.detail.value;this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?l:d`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};ae.properties={hass:{attribute:!1},_config:{state:!0}};var He=class extends ae{constructor(){super(...arguments);this.defaults={compact:!1,show_modes:!0,show_schedules:!0,show_timeline:!0,show_editor:!0,show_periods:!0,show_priorities:!0,show_battery:!0}}get schema(){return Dt}},Ue=class extends ae{constructor(){super(...arguments);this.defaults={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,group_by_floor:!0,room:{show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_battery:!0,show_editor:!0,compact:!1}}}get schema(){let e=this.hass?.locale?.language||this.hass?.language||"en";return Rt(e.startsWith("de"))}};A("bestthermostat-card-editor",He);A("bestthermostat-overview-card-editor",Ue);var ut="bestthermostat.collapsedFloors",Pt=24,Mt={show_modes:!0,show_schedules:!0,show_timeline:!0,show_periods:!0,show_priorities:!0,show_editor:!0,show_battery:!0,compact:!1},B=class extends v{constructor(){super(...arguments);this._ovOpen=!1;this._varsOpen=!1;this._cardConfigs=new Map;this._collapsed=this._loadCollapsed();this._pending=new Map;this._timers=new Map;this._swipeConsumed=!1;this._onSwipeMove=e=>{let t=this._swipe;if(!t||t.id!==e.pointerId)return;let i=e.clientX-t.x;if(!t.moved){if(Math.abs(i)<10)return;t.moved=!0}e.preventDefault();let s=Math.min(t.max,Math.max(t.min,Math.round((t.start+Math.round(i/Pt)*.5)*2)/2));s!==this._pending.get(t.key)&&(this._pending.set(t.key,s),window.clearTimeout(this._timers.get(t.key)),navigator.vibrate?.(5)),this.requestUpdate()};this._onSwipeEnd=async e=>{let t=this._swipe;if(this._removeSwipeListeners(),this._swipe=void 0,!t||t.id!==e.pointerId||!t.moved)return;this._swipeConsumed=!0,window.setTimeout(()=>this._swipeConsumed=!1,0);let i=this._pending.get(t.key);i!==void 0&&(await t.commit(i),this._pending.delete(t.key),this.requestUpdate())};this._onSwipeCancel=()=>{this._swipe&&this._pending.delete(this._swipe.key),this._swipe=void 0,this._removeSwipeListeners(),this.requestUpdate()}}static getConfigElement(){return document.createElement("bestthermostat-overview-card-editor")}static getStubConfig(){return{}}setConfig(e){this._config={layout:"list",show_summary:!0,show_override:!0,show_variables:!0,show_periods:!0,group_by_floor:!0,...e,room:{...Mt,...e.show_periods===!1?{show_periods:!1}:{},...e.room??{}}},this._cardConfigs.clear()}_cardConfig(e,t){let i=`${e.entry_id}:${t}`,s=this._cardConfigs.get(i);return s||(s={type:"custom:bestthermostat-card",entity:e.climate_entity_id??e.entry_id,embedded:!0,show_header:t,show_floor:!this._config.group_by_floor,...this._config.room},this._cardConfigs.set(i,s)),s}getCardSize(){return 2+(this._snap?.rooms.length??2)}connectedCallback(){super.connectedCallback(),this.hass&&(this._unsub=X(this.hass,e=>this._snap=e))}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}willUpdate(e){e.has("hass")&&this.hass&&!this._unsub&&this.isConnected&&(this._unsub=X(this.hass,t=>this._snap=t))}async _call(e,t){try{this._error=void 0,await D(this.hass,e,t)}catch(i){this._error=i?.message??String(i)}}_stepPending(e,t,i){let s=Math.min(30,Math.max(5,Math.round(t*2)/2));this._pending.set(e,s),this.requestUpdate(),window.clearTimeout(this._timers.get(e)),this._timers.set(e,window.setTimeout(async()=>{await i(s),this._pending.delete(e),this.requestUpdate()},600))}_swipeStart(e,t,i,s,a,o){e.pointerType==="mouse"&&e.button!==0||(this._swipe={key:t,x:e.clientX,start:this._pending.get(t)??i,min:s,max:a,moved:!1,id:e.pointerId,commit:o},window.addEventListener("pointermove",this._onSwipeMove),window.addEventListener("pointerup",this._onSwipeEnd),window.addEventListener("pointercancel",this._onSwipeCancel))}_swipeOverride(e,t){this._swipeStart(e,"override",t??16,5,30,i=>this._call("override/set",{temperature:i}))}_removeSwipeListeners(){window.removeEventListener("pointermove",this._onSwipeMove),window.removeEventListener("pointerup",this._onSwipeEnd),window.removeEventListener("pointercancel",this._onSwipeCancel)}_consumeSwipe(){let e=this._swipeConsumed;return this._swipeConsumed=!1,e}_varStep(e,t,i){let s=`var:${e}`;this._stepPending(s,(this._pending.get(s)??t)+i,a=>this._call("variable/update",{variable_id:e,value:a}))}_loadCollapsed(){try{return new Set(JSON.parse(localStorage.getItem(ut)||"[]"))}catch{return new Set}}_toggleFloor(e){let t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t;try{localStorage.setItem(ut,JSON.stringify([...t]))}catch{}this.requestUpdate()}_floorIconNo(e){return e==null?"0":e<0?"negative-1":e>3?"3":String(e)}_heatingCount(e){return e.filter(t=>t.hvac_action==="heating").length}_renderTile(e){return d`<div class="tile">
      <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!0)}></bestthermostat-card>
    </div>`}_groups(e){if(!this._config?.group_by_floor||!e.some(i=>i.floor))return[{floor:null,rooms:e}];let t=new Map;for(let i of e){let s=i.floor?.id??"";t.has(s)||t.set(s,{floor:i.floor,rooms:[]}),t.get(s).rooms.push(i)}return[...t.values()].sort((i,s)=>{if(!i.floor)return 1;if(!s.floor)return-1;let a=i.floor.level??999,o=s.floor.level??999;return a!==o?a-o:i.floor.name.localeCompare(s.floor.name)})}render(){if(!this._config||!this.hass)return l;let e=b(this.hass),t=this._snap;if(!t)return d`<ha-card><div class="pad">${e.loading}</div></ha-card>`;let i=t.rooms.filter(m=>m.hvac_action==="heating").length,s=t.rooms.map(m=>m.current_temperature).filter(m=>m!=null),a=s.length?s.reduce((m,y)=>m+y,0)/s.length:null,o=new Set(this._config.exclude_rooms??[]),c=t.rooms.filter(m=>!o.has(m.climate_entity_id??"")&&!o.has(m.entry_id)),h=this._groups(c),p=h.length>1||h[0]?.floor,u=this._config.layout==="tiles",g=this._config.title??e.rooms;return d`<ha-card>
      <div class="pad col">
        ${g||this._config.show_summary?d`<div>
              ${g?d`<div class="title">${g}</div>`:l}
              ${this._config.show_summary?d`<div class="muted summary">
                    ${i} ${e.of} ${t.rooms.length} ${e.rooms_word} ${e.heating_summary}${a!=null?d` · Ø ${_(a)}`:l}
                  </div>`:l}
            </div>`:l}
        <div class="top">
          ${this._config.show_override?this._renderOverride():l}
          ${this._config.show_variables&&t.variables.length?this._renderVariables():l}
        </div>
        <div class="rooms">
          ${h.map(m=>{let y=m.floor?.id??"_other",ve=p&&this._collapsed.has(y),oe=p?ct(m.rooms):void 0;return d`${p?d`<button class="floor" aria-expanded=${!ve} @click=${()=>this._toggleFloor(y)}>
                      <ha-icon icon=${m.floor?.icon||"mdi:home-floor-"+this._floorIconNo(m.floor?.level)}></ha-icon>
                      <span>${m.floor?.name??e.other_floor}</span>
                      ${this._heatingCount(m.rooms)?d`<span class="floor-heat">· ${this._heatingCount(m.rooms)} ${e.heating_summary}</span>`:l}
                      <span class="floor-next">${oe?`${e.until} ${w(oe.time,this.hass)}, ${e.then} ${_(oe.temp,!1)}\xB0`:""}</span>
                      <ha-icon class="floor-chev" icon=${ve?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>
                    </button>`:l}
                ${ve?l:d`<div class="grid ${u?"tiles":""}">
                      ${m.rooms.map(xe=>u?this._renderTile(xe):this._renderRoom(xe,!!oe&&Oe(xe)))}
                    </div>`}`})}
        </div>
        ${this._error?d`<div class="error">${this._error}</div>`:l}
      </div>
    </ha-card>`}_renderOverride(){let e=b(this.hass),t=this._snap.override,i=this._ovOpen,s=this._pending.get("override")??t.value,a=o=>this._stepPending("override",(s??16)+o,c=>this._call("override/set",{temperature:c}));return d`<div class="box ${t.active?"on":""}">
      <div class="box-head">
        <span class="box-label">
          <ha-icon icon="mdi:home-export-outline"></ha-icon>
          <span>${e.override}</span>
        </span>
        <button class="value-btn swipeable ${i?"open":""} ${this._swipe?.key==="override"&&this._swipe.moved?"swiping":""}"
          title=${e.swipe_hint}
          @pointerdown=${o=>this._swipeOverride(o,s)}
          @click=${()=>{this._consumeSwipe()||(this._ovOpen=!this._ovOpen)}}
          aria-expanded=${i}>
          ${_(s)}
          <ha-icon icon=${i?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
        </button>
        <button class="switch ${t.active?"on":""}" role="switch" aria-checked=${t.active}
          aria-label=${e.override} @click=${()=>this._call("override/set",{active:!t.active})}>
          <span></span>
        </button>
      </div>
      ${i?d`<div class="box-body">
            <div class="stepper">
              <button class="round small" @click=${()=>a(-.5)}>−</button>
              <span class="val swipeable ${this._swipe?.key==="override"&&this._swipe.moved?"swiping":""}"
                title=${e.swipe_hint}
                @pointerdown=${o=>this._swipeOverride(o,s)}>${_(s)}</span>
              <button class="round small" @click=${()=>a(.5)}>+</button>
            </div>
            <div class="also">
              <span class="muted">${e.override_also}</span>
              ${[["include_manual",t.include_manual,e.heat],["include_off",t.include_off,e.off]].map(([o,c,h])=>d`<button class="mini ${c?"on":""}"
                  @click=${()=>this._call("override/set",{[o]:!c})}>${h}</button>`)}
            </div>
          </div>`:l}
    </div>`}_renderVariables(){let e=b(this.hass),t=this._snap.variables;return d`<div>
      <button class="vars-line" @click=${()=>this._varsOpen=!this._varsOpen}>
        <span class="vars-text">
          ${t.map((i,s)=>d`${s?d`<span class="sep">·</span>`:l}<span>${i.name}
                <b>${_(i.value,!1)}°</b></span>`)}
        </span>
        <ha-icon icon=${this._varsOpen?"mdi:chevron-up":"mdi:chevron-right"}></ha-icon>
      </button>
      ${this._varsOpen?d`<div class="var-list">
            ${t.map(i=>d`<div class="var-row">
                <span class="dot" style="background:${E(i.value)}"></span>
                <span class="grow">${i.name}</span>
                <button class="round small" @click=${()=>this._varStep(i.id,i.value,-.5)}>−</button>
                <span class="val">${_(this._pending.get(`var:${i.id}`)??i.value)}</span>
                <button class="round small" @click=${()=>this._varStep(i.id,i.value,.5)}>+</button>
              </div>`)}
            <div class="muted hint">${e.variables_note}</div>
          </div>`:l}
    </div>`}_renderRoom(e,t=!1){let i=b(this.hass),s=this.hass,a=e.hvac_action==="heating",o=this._open===e.entry_id,c=this._config?.room?.show_periods?te(e)[0]:void 0;return d`<div class="room-block ${o?"open":""}">
      <button class="room" @click=${()=>{this._consumeSwipe()||(this._open=o?void 0:e.entry_id)}}>
        <span class="icon ${a?"heating":""} ${e.mode==="off"?"off":""}">
          <ha-icon icon=${fe(e)}></ha-icon>
        </span>
        <span class="grow left">
          <span class="name">${e.name}${this._config?.room?.show_battery&&ie(e)?.low?d`<ha-icon class="bat-low" icon="mdi:battery-alert-variant-outline"
                title=${i.battery_low}></ha-icon>`:l}</span>
          <span class="muted sub">${ge(e,i,s,t)}</span>
          ${c?d`<span class="muted sub planned">
                <ha-icon icon="mdi:calendar-clock-outline"></ha-icon>${c.title} · ${i.period_from}
                ${w(c.start,s)}
              </span>`:l}
        </span>
        <span class="temps swipeable ${this._swipe?.key===`room:${e.entry_id}`&&this._swipe.moved?"swiping":""}"
          title=${i.swipe_hint}
          @pointerdown=${h=>this._swipeStart(h,`room:${e.entry_id}`,e.target_temperature??20,e.min_temp,e.max_temp,p=>this._call("room/temperature",{entry_id:e.entry_id,temperature:p}))}>
          <span class="cur">${_(e.current_temperature,!1)}°</span>
          ${this._pending.has(`room:${e.entry_id}`)?d`<span class="tgt live">→ ${_(this._pending.get(`room:${e.entry_id}`),!1)}°</span>`:e.current_temperature==null||e.target_temperature==null||Math.abs(e.current_temperature-e.target_temperature)>=.5?d`<span class="muted tgt">→ ${_(e.target_temperature,!1)}°</span>`:l}
        </span>
      </button>
      ${o?d`<div class="detail">
            <bestthermostat-card .hass=${this.hass} .config=${this._cardConfig(e,!1)}></bestthermostat-card>
          </div>`:l}
    </div>`}};B.properties={hass:{attribute:!1},_config:{state:!0},_snap:{state:!0},_error:{state:!0},_open:{state:!0},_ovOpen:{state:!0},_varsOpen:{state:!0}},B.styles=[R,$`
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
    `];var Tt="0.7.3";A("bestthermostat-card",j);A("bestthermostat-overview-card",B);var be=window;be.customCards=be.customCards||[];var Ve=(document.documentElement.lang||navigator.language||"").startsWith("de"),Nt=[{type:"bestthermostat-card",name:"Best Thermostat",description:Ve?"Raumthermostat mit Zeitpl\xE4nen und Wocheneditor":"Room thermostat with schedules and weekly editor",preview:!0,documentationURL:"https://github.com/zitroaen/bestthermostat"},{type:"bestthermostat-overview-card",name:Ve?"Best Thermostat \xDCbersicht":"Best Thermostat Overview",description:Ve?"Alle R\xE4ume, globaler Override und Variablen":"All rooms, global override and variables",preview:!0}];for(let r of Nt)be.customCards.some(n=>n?.type===r.type)||be.customCards.push(r);console.info(`%c BEST-THERMOSTAT %c ${Tt} `,"background:#ff8100;color:#fff","");
