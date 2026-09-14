/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,f=m?m.emptyScript:"",_=p.reactiveElementPolyfillSupport,g=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,e)=>!a(t,e),v={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);n?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const o=n.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const o=this.constructor;if(!1===i&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??y)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[g("elementProperties")]=new Map,b[g("finalized")]=new Map,_?.({ReactiveElement:b}),(p.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=t=>t,x=w.trustedTypes,E=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+S,k=`<${M}>`,L=document,O=()=>L.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,R="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,N=/>/g,B=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,j=/"/g,z=/^(?:script|style|textarea|title)$/i,I=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),W=I(1),F=I(2),Z=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),V=new WeakMap,G=L.createTreeWalker(L,129);function X(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=T;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,h=0;for(;h<s.length&&(r.lastIndex=h,l=r.exec(s),null!==l);)h=r.lastIndex,r===T?"!--"===l[1]?r=H:void 0!==l[1]?r=N:void 0!==l[2]?(z.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=B):void 0!==l[3]&&(r=B):r===B?">"===l[0]?(r=n??T,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?B:'"'===l[3]?j:D):r===j||r===D?r=B:r===H||r===N?r=T:(r=B,n=void 0);const d=r===B&&t[e+1].startsWith("/>")?" ":"";o+=r===T?s+k:c>=0?(i.push(a),s.slice(0,c)+C+s.slice(c)+S+d):s+S+(-2===c?e:d)}return[X(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=K.createElement(l,s),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=G.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[o++],s=i.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:s,ctor:"."===r[1]?st:"?"===r[1]?it:"@"===r[1]?nt:et}),i.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(z.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),G.nextNode(),a.push({type:2,index:++n});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===M)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const s=L.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===Z)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const o=P(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=Q(t,n._$AS(t,e.values),n,i)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??L).importNode(e,!0);G.currentNode=i;let n=G.nextNode(),o=0,r=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new tt(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new ot(n,this,t)),this._$AV.push(e),a=s[++r]}o!==a?.index&&(n=G.nextNode(),o++)}return G.currentNode=L,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),P(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==Z&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(X(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Y(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new K(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new tt(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(void 0===n)t=Q(this,t,e,0),o=!P(t)||t!==this._$AH&&t!==Z,o&&(this._$AH=t);else{const i=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Q(this,i[s+r],e,r),a===Z&&(a=this._$AH[r]),o||=!P(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!i&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class nt extends et{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??q)===Z)return;const s=this._$AH,i=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(K,tt),(w.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new tt(e.insertBefore(O(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ht={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9},dt={weight:"Weight",body_fat:"Body Fat",water:"Water",muscle_mass:"Muscle Mass",bone_mass:"Bone Mass",visceral_fat:"Visceral Fat",waist:"Waist",hip:"Hip",bmi:"BMI",lbm:"LBM",fat_mass:"Fat Mass",muscle_mass_kg:"Muscle Mass",water_mass_kg:"Water Mass",bmr:"BMR",tdee:"TDEE"},ut={bmi:"Body Mass Index — weight relative to height (weight ÷ height²).",lbm:"Lean Body Mass — total weight minus fat mass.",bmr:"Basal Metabolic Rate — calories your body burns at complete rest.",tdee:"Total Daily Energy Expenditure — BMR scaled by your activity level."},pt={bmi:"",lbm:"kg",fat_mass:"kg",muscle_mass_kg:"kg",water_mass_kg:"kg",bmr:"kcal",tdee:"kcal"},mt={bmi:1,lbm:1,fat_mass:1,muscle_mass_kg:1,water_mass_kg:1,bmr:0,tdee:0},ft=[{name:"title",selector:{text:{}}},{name:"gender",label:"Gender",selector:{select:{mode:"dropdown",options:[{value:"male",label:"Male"},{value:"female",label:"Female"}]}}},{name:"display_mode",label:"Display mode",selector:{select:{mode:"dropdown",options:[{value:"grid",label:"Grid"},{value:"callouts",label:"Callouts"},{value:"donut",label:"Donut (needs body fat % and water %)"}]}}},{name:"height_cm",label:"Height in cm (only needed for BMI)",selector:{number:{min:50,max:250,mode:"box"}}},{name:"activity_level",label:"Activity level (only needed for TDEE)",selector:{select:{mode:"dropdown",options:Object.keys(ht).map(t=>({value:t,label:t.split("_").map(t=>t[0].toUpperCase()+t.slice(1)).join(" ")}))}}}],_t=[{key:"weight",field:"weight_entity",label:"Weight"},{key:"body_fat",field:"body_fat_entity",label:"Body fat"},{key:"muscle_mass",field:"muscle_mass_entity",label:"Muscle mass"},{key:"water",field:"water_entity",label:"Water"},{key:"bone_mass",field:"bone_mass_entity",label:"Bone mass (not published by openScale-sync)"},{key:"visceral_fat",field:"visceral_fat_entity",label:"Visceral fat (not published by openScale-sync)"},{key:"waist",field:"waist_entity",label:"Waist (not published by openScale-sync)"},{key:"hip",field:"hip_entity",label:"Hip (not published by openScale-sync)"}],gt=_t.map(({field:t,label:e})=>({name:t,label:e,selector:{entity:{domain:"sensor"}}})),$t=[{key:"bmi",field:"show_bmi",label:"BMI"},{key:"lbm",field:"show_lbm",label:"Lean body mass"},{key:"fat_mass",field:"show_fat_mass",label:"Fat mass (kg)"},{key:"muscle_mass_kg",field:"show_muscle_mass_kg",label:"Muscle mass (kg)"},{key:"water_mass_kg",field:"show_water_mass_kg",label:"Water mass (kg)"},{key:"bmr",field:"show_bmr",label:"BMR"},{key:"tdee",field:"show_tdee",label:"TDEE"}],yt=$t.map(({field:t,label:e})=>({name:t,label:e,selector:{boolean:{}}}));class vt extends lt{constructor(){super(...arguments),this._computeLabel=t=>t.label??t.name,this._generalChanged=t=>{if(!this.config)return;const e=t.detail.value;this._fireConfigChanged({...this.config,title:e.title||void 0,gender:e.gender,display_mode:e.display_mode,height_cm:e.height_cm,activity_level:e.activity_level})},this._entityMetricsChanged=t=>{if(!this.config)return;const e=t.detail.value,s={...this.config.metrics};for(const{key:t,field:i}of _t){const n=e[i];n?s[t]={...s[t],entity:n}:delete s[t]}this._fireConfigChanged({...this.config,metrics:s})},this._computedMetricsChanged=t=>{if(!this.config)return;const e=t.detail.value,s={...this.config.metrics};for(const{key:t,field:i}of $t)e[i]?s[t]=s[t]??{}:delete s[t];this._fireConfigChanged({...this.config,metrics:s})}}setConfig(t){this.config=t}set hass(t){this.hassObj=t,this.requestUpdate()}get _generalData(){const t=this.config;return{title:t.title??"",gender:t.gender??"male",display_mode:t.display_mode??"grid",height_cm:t.height_cm,activity_level:t.activity_level}}get _entityMetricsData(){const t=this.config.metrics,e={};for(const{key:s,field:i}of _t)e[i]=t[s]?.entity;return e}get _computedMetricsData(){const t=this.config.metrics,e={};for(const{key:s,field:i}of $t)e[i]=!!t[s];return e}_fireConfigChanged(t){this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return this.config&&this.hassObj?W`
      <div class="section-title">General</div>
      <ha-form
        .hass=${this.hassObj}
        .data=${this._generalData}
        .schema=${ft}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._generalChanged}
      ></ha-form>

      <div class="section-title">Raw openScale-sync sensors</div>
      <ha-form
        .hass=${this.hassObj}
        .data=${this._entityMetricsData}
        .schema=${gt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._entityMetricsChanged}
      ></ha-form>

      <div class="section-title">Computed metrics</div>
      <ha-form
        .hass=${this.hassObj}
        .data=${this._computedMetricsData}
        .schema=${yt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._computedMetricsChanged}
      ></ha-form>
    `:W``}}function bt(t,e){return t*(e/100)}function wt(t){return 370+21.6*t}function At(t,e,s){const i=e[s]?.entity;if(!i)return;const n=t.states[i];if(!n)return;const o=parseFloat(n.state);return Number.isFinite(o)?o:void 0}function xt(t,e,s,i){const n=At(e,s,"weight"),o=At(e,s,"body_fat"),r=void 0!==n&&void 0!==o?(a=n)-bt(a,o):void 0;var a,l,c;switch(t){case"fat_mass":return void 0!==n&&void 0!==o?bt(n,o):void 0;case"muscle_mass_kg":{const t=At(e,s,"muscle_mass");return void 0!==n&&void 0!==t?function(t,e){return t*(e/100)}(n,t):void 0}case"water_mass_kg":{const t=At(e,s,"water");return void 0!==n&&void 0!==t?function(t,e){return t*(e/100)}(n,t):void 0}case"lbm":return r;case"bmi":return void 0!==n&&i.height_cm?function(t,e){const s=e/100;return t/(s*s)}(n,i.height_cm):void 0;case"bmr":return void 0!==r?wt(r):void 0;case"tdee":{const t=void 0!==r?wt(r):void 0;return void 0!==t&&i.activity_level?(l=t,c=i.activity_level,l*ht[c]):void 0}default:return}}vt.styles=o`
    .section-title {
      font-weight: 600;
      margin: 20px 0 8px;
    }
    .section-title:first-child {
      margin-top: 0;
    }
    ha-form {
      display: block;
      margin-bottom: 8px;
    }
  `,customElements.define("openscale-card-editor",vt);function Et(t,e="var(--secondary-text-color, #8892a6)"){const s=function(t){return"female"===t?{headCx:110,headCy:27,headR:15,torso:"M86 50 Q110 42 134 50 L124 94 L140 122 L80 122 L96 94 Z",armLeft:"M86 56 L60 98 L70 107 L92 72 Z",armRight:"M134 56 L158 98 L148 107 L128 72 Z",legLeft:"M80 122 L85 216 L100 216 L104 130 Z",legRight:"M140 122 L135 216 L118 216 L116 130 Z"}:{headCx:110,headCy:27,headR:16,torso:"M79 52 Q110 41 141 52 L129 94 L134 122 L86 122 L91 94 Z",armLeft:"M79 58 L50 100 L60 109 L88 72 Z",armRight:"M141 58 L170 100 L160 109 L132 72 Z",legLeft:"M86 122 L80 216 L100 216 L107 128 Z",legRight:"M134 122 L140 216 L120 216 L113 128 Z"}}(t);return F`
    <g fill=${e}>
      <circle cx=${s.headCx} cy=${s.headCy} r=${s.headR}></circle>
      <path d=${s.torso}></path>
      <path d=${s.armLeft}></path>
      <path d=${s.armRight}></path>
      <path d=${s.legLeft}></path>
      <path d=${s.legRight}></path>
    </g>
  `}function Ct(t){return t?W`<span class="hint-icon" title=${t}>ⓘ</span>`:""}class St{constructor(){this.previous=new Map}update(t,e){const s=this.previous.get(t);if(this.previous.set(t,e),void 0===s)return;const i=e-s;return Math.abs(i)<1e-6?"flat":i>0?"up":"down"}}const Mt={up:"↑",down:"↓",flat:"→"};function kt(t){return t?W`<span class="trend trend-${t}">${Mt[t]}</span>`:q}const Lt=2*Math.PI*82,Ot="#5b8def",Pt="#5bd18b",Ut="#e6b85b",Rt="#e05b5b",Tt=new Set(["water","water_mass_kg","body_fat","fat_mass","muscle_mass","muscle_mass_kg","bone_mass"]);function Ht(t,e){return t.find(t=>t.key===e)}function Nt(t){const e=Ht(t,"water").value,s=Ht(t,"body_fat").value,i=function(t){const e=Ht(t,"bone_mass");if(!e)return 0;if("%"===e.unit)return e.value;const s=Ht(t,"weight");return s&&s.value>0?e.value/s.value*100:0}(t),n=function(t,e,s=0){return{water:t,fat:e,bone:s,other:Math.max(0,100-t-e-s)}}(e,s,i),o=[{label:"Water",pct:n.water,color:Ot},{label:"Other lean mass",pct:n.other,color:Pt},{label:"Fat",pct:n.fat,color:Ut}];return n.bone>0&&o.push({label:"Bone",pct:n.bone,color:Rt}),o.filter(t=>t.pct>0)}class Bt extends lt{constructor(){super(...arguments),this.trendTracker=new St}setConfig(t){if(!t||!t.metrics)throw new Error('Invalid configuration: "metrics" is required.');this.config={...t,display_mode:t.display_mode??"grid",gender:t.gender??"male"}}set hass(t){this.hassObj=t,this.requestUpdate()}getCardSize(){switch(this.config?.display_mode){case"callouts":case"donut":return 6;default:return 4}}static getConfigElement(){return document.createElement("openscale-card-editor")}static getStubConfig(){return{type:"custom:openscale-card",gender:"male",display_mode:"grid",metrics:{weight:{},body_fat:{},muscle_mass:{},water:{}}}}render(){if(!this.config||!this.hassObj)return W``;const t=this.config,e=t.gender??"male",s=function(t,e,s){const i=Object.entries(e.metrics),n=[];for(const[o,r]of i){if(!r)continue;let i,a,l;if(r.entity){const e=t.states[r.entity],s=e?parseFloat(e.state):NaN;if(!e||!Number.isFinite(s))continue;i=s,a=e.state,l=e.attributes?.unit_of_measurement??""}else{const s=xt(o,t,e.metrics,e);if(void 0===s)continue;i=s,a=s.toFixed(mt[o]??1),l=pt[o]??""}n.push({key:o,label:dt[o],value:i,formatted:a,unit:l,trend:s.update(o,i),hint:ut[o]})}return n}(this.hassObj,t,this.trendTracker),i=t.display_mode??"grid",n="donut"===i&&function(t){return!!Ht(t,"water")&&!!Ht(t,"body_fat")}(s)?function(t,e){const s=Nt(t);let i=0;const n=s.map(t=>{const e=Math.max(0,t.pct/100*Lt-4),s=-i;return i+=t.pct/100*Lt,F`
      <circle
        r=${82}
        fill="none"
        stroke=${t.color}
        stroke-width="16"
        stroke-dasharray="${e} ${Lt}"
        stroke-dashoffset=${s}
      ></circle>
    `}),o=t.filter(t=>!Tt.has(t.key));return W`
    <div class="donut-mode">
      <svg class="donut-ring" viewBox="0 0 200 200">
        <g transform="translate(100, 100) rotate(-90)">${n}</g>
        <g transform="translate(100, 100) scale(0.55) translate(-110, -115)">${Et(e)}</g>
      </svg>
      <div class="donut-legend">
        ${s.map(t=>W`
            <div class="legend-row">
              <span class="dot" style="background:${t.color}"></span>
              <span class="label">${t.label}</span>
              <span class="value">${t.pct.toFixed(1)}%</span>
            </div>
          `)}
      </div>
      ${o.length?W`
            <div class="donut-extra">
              ${o.map(t=>W`
                  <div class="row">
                    <span class="label">${t.label}${Ct(t.hint)}</span>
                    <span class="value">${t.formatted} ${t.unit} ${kt(t.trend)}</span>
                  </div>
                `)}
            </div>
          `:""}
    </div>
  `}(s,e):"callouts"===i?function(t,e){const s=t.filter((t,e)=>e%2==0),i=t.filter((t,e)=>e%2==1),n=Math.max(s.length,i.length,1),o=Math.max(240,55+34*n+20),r=(t,e)=>e<=1?o/2:55+t*(o-55-20)/(e-1),a=s.map((t,e)=>({row:t,y:r(e,s.length),anchorX:190})),l=i.map((t,e)=>({row:t,y:r(e,i.length),anchorX:270}));return W`
    <svg class="callouts-mode" viewBox="0 0 460 ${o}">
      ${a.map(({y:t,anchorX:e})=>F`
          <line x1=${e} y1=${t} x2="30" y2=${t} class="callout-line"></line>
        `)}
      ${l.map(({y:t,anchorX:e})=>F`
          <line x1=${e} y1=${t} x2="430" y2=${t} class="callout-line"></line>
        `)}
      <g transform="translate(${120}, 0)">${Et(e)}</g>
      ${a.map(({row:t,y:e})=>F`
          <text
            x="20" y=${e-6}
            class="callout-label ${t.hint?"has-hint":""}"
            text-anchor="end"
          >
            ${t.label}${t.hint?F`<title>${t.hint}</title>`:""}
          </text>
          <text x="20" y=${e+12} class="callout-value" text-anchor="end">
            ${t.formatted} ${t.unit}${t.trend?` ${Mt[t.trend]}`:""}
          </text>
        `)}
      ${l.map(({row:t,y:e})=>F`
          <text
            x="440" y=${e-6}
            class="callout-label ${t.hint?"has-hint":""}"
            text-anchor="start"
          >
            ${t.label}${t.hint?F`<title>${t.hint}</title>`:""}
          </text>
          <text x="440" y=${e+12} class="callout-value" text-anchor="start">
            ${t.formatted} ${t.unit}${t.trend?` ${Mt[t.trend]}`:""}
          </text>
        `)}
    </svg>
  `}(s,e):function(t,e){return W`
    <div class="grid-mode">
      <svg class="grid-silhouette" viewBox=${"0 0 220 230"}>${Et(e)}</svg>
      <div class="grid-rows">
        ${t.map(t=>W`
            <div class="row">
              <span class="label">${t.label}${Ct(t.hint)}</span>
              <span class="value">
                ${t.formatted} ${t.unit}
                ${kt(t.trend)}
              </span>
            </div>
          `)}
      </div>
    </div>
  `}(s,e);return W`
      <ha-card .header=${t.title??"OpenScale"}>
        <div class="content">${n}</div>
      </ha-card>
    `}}Bt.styles=o`
    .content {
      padding: 16px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color, #eee);
    }
    .row:last-child {
      border-bottom: none;
    }
    .label {
      color: var(--secondary-text-color, #888);
    }
    .hint-icon {
      margin-left: 3px;
      cursor: help;
      opacity: 0.65;
      font-size: 0.85em;
    }
    .value {
      font-weight: 600;
    }
    .trend {
      margin-left: 4px;
      font-weight: 400;
    }
    .trend-up {
      color: var(--error-color, #db4437);
    }
    .trend-down {
      color: var(--success-color, #43a047);
    }
    .trend-flat {
      color: var(--secondary-text-color, #888);
    }

    /* Grid mode */
    .grid-mode {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .grid-silhouette {
      width: 90px;
      height: auto;
      flex-shrink: 0;
    }
    .grid-rows {
      flex: 1;
      min-width: 0;
    }

    /* Callouts mode */
    .callouts-mode {
      width: 100%;
      height: auto;
    }
    .callout-line {
      stroke: var(--divider-color, #bbb);
      stroke-width: 1;
    }
    .callout-label {
      font-size: 11px;
      fill: var(--secondary-text-color, #888);
    }
    .callout-label.has-hint {
      text-decoration: underline dotted;
      cursor: help;
    }
    .callout-value {
      font-size: 13px;
      font-weight: 600;
      fill: var(--primary-text-color, #222);
    }

    /* Donut mode */
    .donut-mode {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .donut-ring {
      width: 160px;
      height: 160px;
    }
    .donut-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px 14px;
    }
    .legend-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--secondary-text-color, #888);
    }
    .legend-row .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .legend-row .value {
      color: var(--primary-text-color, #222);
    }
    .donut-extra {
      width: 100%;
      margin-top: 8px;
    }
  `,customElements.define("openscale-card",Bt);const Dt=window;Dt.customCards=Dt.customCards||[],Dt.customCards.push({type:"openscale-card",name:"OpenScale Card",description:"Displays openScale-sync body composition data as a schematic body silhouette."});export{Bt as OpenscaleCard};
