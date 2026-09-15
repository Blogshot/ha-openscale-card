/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(i,t,s)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:r,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,f=m?m.emptyScript:"",y=u.reactiveElementPolyfillSupport,$=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},g=(t,e)=>!r(t,e),b={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:g};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);o?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:_).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=i;const n=o.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const n=this.constructor;if(!1===i&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??g)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[$("elementProperties")]=new Map,v[$("finalized")]=new Map,y?.({ReactiveElement:v}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=t=>t,x=w.trustedTypes,E=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+C,M=`<${k}>`,P=document,O=()=>P.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,H="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,D=/>/g,B=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,L=/"/g,I=/^(?:script|style|textarea|title)$/i,z=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),F=z(1),W=z(2),q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),G=new WeakMap,X=P.createTreeWalker(P,129);function Y(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let o,n=2===e?"<svg>":3===e?"<math>":"",a=R;for(let e=0;e<s;e++){const s=t[e];let r,l,c=-1,h=0;for(;h<s.length&&(a.lastIndex=h,l=a.exec(s),null!==l);)h=a.lastIndex,a===R?"!--"===l[1]?a=N:void 0!==l[1]?a=D:void 0!==l[2]?(I.test(l[2])&&(o=RegExp("</"+l[2],"g")),a=B):void 0!==l[3]&&(a=B):a===B?">"===l[0]?(a=o??R,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?B:'"'===l[3]?L:j):a===L||a===j?a=B:a===N||a===D?a=R:(a=B,o=void 0);const d=a===B&&t[e+1].startsWith("/>")?" ":"";n+=a===R?s+M:c>=0?(i.push(r),s.slice(0,c)+S+s.slice(c)+C+d):s+C+(-2===c?e:d)}return[Y(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const a=t.length-1,r=this.parts,[l,c]=J(t,e);if(this.el=K.createElement(l,s),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=X.nextNode())&&r.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[n++],s=i.getAttribute(t).split(C),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:o,name:a[2],strings:s,ctor:"."===a[1]?st:"?"===a[1]?it:"@"===a[1]?ot:et}),i.removeAttribute(t)}else t.startsWith(C)&&(r.push({type:6,index:o}),i.removeAttribute(t));if(I.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),X.nextNode(),r.push({type:2,index:++o});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===k)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)r.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===q)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=U(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Z(t,o._$AS(t,e.values),o,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);X.currentNode=i;let o=X.nextNode(),n=0,a=0,r=s[0];for(;void 0!==r;){if(n===r.index){let e;2===r.type?e=new tt(o,o.nextSibling,this,t):1===r.type?e=new r.ctor(o,r.name,r.strings,this,t):6===r.type&&(e=new nt(o,this,t)),this._$AV.push(e),r=s[++a]}n!==r?.index&&(o=X.nextNode(),n++)}return X.currentNode=P,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),U(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(Y(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new K(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new tt(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(void 0===o)t=Z(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const i=t;let a,r;for(t=o[0],a=0;a<o.length-1;a++)r=Z(this,i[s+a],e,a),r===q&&(r=this._$AH[a]),n||=!U(r)||r!==this._$AH[a],r===V?t=V:t!==V&&(t+=(r??"")+o[a+1]),this._$AH[a]=r}n&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class ot extends et{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??V)===q)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(K,tt),(w.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new tt(e.insertBefore(O(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:lt});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:lt}),(rt.litElementVersions??=[]).push("4.2.2");const ht={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9},dt={weight:"Weight",body_fat:"Body Fat",water:"Water",muscle_mass:"Muscle Mass",bone_mass:"Bone Mass",visceral_fat:"Visceral Fat",waist:"Waist",hip:"Hip",bmi:"BMI",lbm:"LBM",fat_mass:"Fat Mass",muscle_mass_kg:"Muscle Mass",water_mass_kg:"Water Mass",bmr:"BMR",tdee:"TDEE"},pt={bmi:"Body Mass Index — weight relative to height (weight ÷ height²).",lbm:"Lean Body Mass — total weight minus fat mass.",bmr:"Basal Metabolic Rate — calories your body burns at complete rest.",tdee:"Total Daily Energy Expenditure — BMR scaled by your activity level."},ut={bmi:"",lbm:"kg",fat_mass:"kg",muscle_mass_kg:"kg",water_mass_kg:"kg",bmr:"kcal",tdee:"kcal"},mt={bmi:1,lbm:1,fat_mass:1,muscle_mass_kg:1,water_mass_kg:1,bmr:0,tdee:0},ft=[{name:"title",selector:{text:{}}},{name:"gender",label:"Gender",selector:{select:{mode:"dropdown",options:[{value:"male",label:"Male"},{value:"female",label:"Female"}]}}},{name:"display_mode",label:"Display mode",selector:{select:{mode:"dropdown",options:[{value:"grid",label:"Grid"},{value:"callouts",label:"Callouts"},{value:"donut",label:"Donut (needs body fat %, water % and muscle mass %)"}]}}},{name:"height_cm",label:"Height in cm (only needed for BMI)",selector:{number:{min:50,max:250,mode:"box"}}},{name:"activity_level",label:"Activity level (only needed for TDEE)",selector:{select:{mode:"dropdown",options:Object.keys(ht).map(t=>({value:t,label:t.split("_").map(t=>t[0].toUpperCase()+t.slice(1)).join(" ")}))}}}],yt=[{key:"weight",field:"weight_entity",label:"Weight"},{key:"body_fat",field:"body_fat_entity",label:"Body fat"},{key:"muscle_mass",field:"muscle_mass_entity",label:"Muscle mass"},{key:"water",field:"water_entity",label:"Water"},{key:"bone_mass",field:"bone_mass_entity",label:"Bone mass (not published by openScale-sync)"},{key:"visceral_fat",field:"visceral_fat_entity",label:"Visceral fat (not published by openScale-sync)"},{key:"waist",field:"waist_entity",label:"Waist (not published by openScale-sync)"},{key:"hip",field:"hip_entity",label:"Hip (not published by openScale-sync)"}],$t=yt.map(({field:t,label:e})=>({name:t,label:e,selector:{entity:{domain:"sensor"}}})),_t=[{key:"bmi",field:"show_bmi",label:"BMI"},{key:"lbm",field:"show_lbm",label:"Lean body mass"},{key:"fat_mass",field:"show_fat_mass",label:"Fat mass (kg)"},{key:"muscle_mass_kg",field:"show_muscle_mass_kg",label:"Muscle mass (kg)"},{key:"water_mass_kg",field:"show_water_mass_kg",label:"Water mass (kg)"},{key:"bmr",field:"show_bmr",label:"BMR"},{key:"tdee",field:"show_tdee",label:"TDEE"}],gt=_t.map(({field:t,label:e})=>({name:t,label:e,selector:{boolean:{}}}));class bt extends lt{constructor(){super(...arguments),this._computeLabel=t=>t.label??t.name,this._generalChanged=t=>{if(!this.config)return;const e=t.detail.value;this._fireConfigChanged({...this.config,title:e.title||void 0,gender:e.gender,display_mode:e.display_mode,height_cm:e.height_cm,activity_level:e.activity_level})},this._entityMetricsChanged=t=>{if(!this.config)return;const e=t.detail.value,s={...this.config.metrics};for(const{key:t,field:i}of yt){const o=e[i];o?s[t]={...s[t],entity:o}:delete s[t]}this._fireConfigChanged({...this.config,metrics:s})},this._computedMetricsChanged=t=>{if(!this.config)return;const e=t.detail.value,s={...this.config.metrics};for(const{key:t,field:i}of _t)e[i]?s[t]=s[t]??{}:delete s[t];this._fireConfigChanged({...this.config,metrics:s})}}setConfig(t){this.config=t}set hass(t){this.hassObj=t,this.requestUpdate()}get _generalData(){const t=this.config;return{title:t.title??"",gender:t.gender??"male",display_mode:t.display_mode??"grid",height_cm:t.height_cm,activity_level:t.activity_level}}get _entityMetricsData(){const t=this.config.metrics,e={};for(const{key:s,field:i}of yt)e[i]=t[s]?.entity;return e}get _computedMetricsData(){const t=this.config.metrics,e={};for(const{key:s,field:i}of _t)e[i]=!!t[s];return e}_fireConfigChanged(t){this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return this.config&&this.hassObj?F`
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
        .schema=${$t}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._entityMetricsChanged}
      ></ha-form>

      <div class="section-title">Computed metrics</div>
      <ha-form
        .hass=${this.hassObj}
        .data=${this._computedMetricsData}
        .schema=${gt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._computedMetricsChanged}
      ></ha-form>
    `:F``}}function vt(t,e){return t*(e/100)}function wt(t){return 370+21.6*t}function At(t,e,s){const i=e[s]?.entity;if(!i)return;const o=t.states[i];if(!o)return;const n=parseFloat(o.state);return Number.isFinite(n)?n:void 0}function xt(t,e,s,i){const o=At(e,s,"weight"),n=At(e,s,"body_fat"),a=void 0!==o&&void 0!==n?(r=o)-vt(r,n):void 0;var r,l,c;switch(t){case"fat_mass":return void 0!==o&&void 0!==n?vt(o,n):void 0;case"muscle_mass_kg":{const t=At(e,s,"muscle_mass");return void 0!==o&&void 0!==t?function(t,e){return t*(e/100)}(o,t):void 0}case"water_mass_kg":{const t=At(e,s,"water");return void 0!==o&&void 0!==t?function(t,e){return t*(e/100)}(o,t):void 0}case"lbm":return a;case"bmi":return void 0!==o&&i.height_cm?function(t,e){const s=e/100;return t/(s*s)}(o,i.height_cm):void 0;case"bmr":return void 0!==a?wt(a):void 0;case"tdee":{const t=void 0!==a?wt(a):void 0;return void 0!==t&&i.activity_level?(l=t,c=i.activity_level,l*ht[c]):void 0}default:return}}bt.styles=n`
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
  `,customElements.define("openscale-card-editor",bt);function Et(t,e="var(--secondary-text-color, #8892a6)"){const s=function(t){return"female"===t?{headCx:110,headCy:27,headR:15,facets:[{points:"110,85 86,52 134,52",opacity:1},{points:"110,85 134,52 124,94",opacity:.85},{points:"110,85 124,94 140,122",opacity:1},{points:"110,85 140,122 80,122",opacity:.7},{points:"110,85 80,122 96,94",opacity:.85},{points:"110,85 96,94 86,52",opacity:.7},{points:"86,58 60,98 92,72",opacity:.85},{points:"60,98 70,107 92,72",opacity:1},{points:"134,58 160,98 128,72",opacity:.85},{points:"160,98 150,107 128,72",opacity:1},{points:"80,122 101,122 99,166",opacity:1},{points:"80,122 99,166 82,216",opacity:.7},{points:"101,122 99,166 100,216",opacity:.85},{points:"99,166 100,216 82,216",opacity:.7},{points:"140,122 119,122 121,166",opacity:1},{points:"140,122 121,166 138,216",opacity:.7},{points:"119,122 121,166 120,216",opacity:.85},{points:"121,166 120,216 138,216",opacity:.7}]}:{headCx:110,headCy:27,headR:16,facets:[{points:"110,90 79,54 141,54",opacity:1},{points:"110,90 141,54 129,94",opacity:.85},{points:"110,90 129,94 134,122",opacity:1},{points:"110,90 134,122 86,122",opacity:.7},{points:"110,90 86,122 91,94",opacity:.85},{points:"110,90 91,94 79,54",opacity:.7},{points:"79,60 50,100 88,72",opacity:.85},{points:"50,100 60,109 88,72",opacity:1},{points:"141,60 170,100 132,72",opacity:.85},{points:"170,100 160,109 132,72",opacity:1},{points:"86,122 103,122 100,168",opacity:1},{points:"86,122 100,168 80,216",opacity:.7},{points:"103,122 100,168 100,216",opacity:.85},{points:"100,168 100,216 80,216",opacity:.7},{points:"134,122 117,122 120,168",opacity:1},{points:"134,122 120,168 140,216",opacity:.7},{points:"117,122 120,168 120,216",opacity:.85},{points:"120,168 120,216 140,216",opacity:.7}]}}(t);return W`
    <g fill=${e}>
      <circle cx=${s.headCx} cy=${s.headCy} r=${s.headR}></circle>
      ${s.facets.map(t=>W`<polygon points=${t.points} fill-opacity=${t.opacity}></polygon>`)}
    </g>
  `}function St(t){return t?F`<span class="hint-icon" title=${t}>ⓘ</span>`:""}class Ct{constructor(t){this.previous=new Map,this.seeding=new Set,this.onSeeded=t}update(t,e,s){const i=this.previous.get(t);if(void 0===i&&this.trySeedFromHistory(t,e,s),this.previous.set(t,e),void 0===i)return;const o=e-i;return Math.abs(o)<1e-6?"flat":o>0?"up":"down"}trySeedFromHistory(t,e,s){s?.entityId&&!this.seeding.has(t)&&(this.seeding.add(t),async function(t,e){try{const s=`history/period/${new Date(Date.now()-2592e6).toISOString()}?filter_entity_id=${encodeURIComponent(e)}&minimal_response`,i=await t.callApi("GET",s),o=Array.isArray(i)?i[0]:void 0;if(!Array.isArray(o)||o.length<2)return;for(let t=o.length-2;t>=0;t--){const e=parseFloat(o[t]?.state??"");if(Number.isFinite(e))return e}return}catch{return}}(s.hass,s.entityId).then(s=>{void 0!==s&&this.previous.get(t)===e&&(this.previous.set(t,s),this.onSeeded?.())}))}}const kt={up:"↑",down:"↓",flat:"→"};function Mt(t){return t?F`<span class="trend trend-${t}">${kt[t]}</span>`:V}const Pt=2*Math.PI*82,Ot=230,Ut=115,Tt="#5b8def",Ht="#5bd18b",Rt="#e6b85b",Nt="#e05b5b",Dt="#8892a6",Bt=new Set(["water","water_mass_kg","body_fat","fat_mass","muscle_mass","muscle_mass_kg","bone_mass"]);function jt(t,e){return t.find(t=>t.key===e)}function Lt(t){const e=jt(t,"water"),s=jt(t,"body_fat"),i=jt(t,"muscle_mass"),o=jt(t,"bone_mass"),n=function(t){const e=jt(t,"bone_mass");if(!e)return 0;if("%"===e.unit)return e.value;const s=jt(t,"weight");return s&&s.value>0?e.value/s.value*100:0}(t),a=function(t,e,s,i=0){const o=t+e+s+i;if(o<=100)return{water:t,muscle:e,fat:s,bone:i,other:100-o};const n=100/o;return{water:t*n,muscle:e*n,fat:s*n,bone:i*n,other:0}}(e.value,i.value,s.value,n);return[{key:"water",label:"Water",pct:e.value,arcPct:a.water,color:Tt,trend:e.trend},{key:"muscle",label:"Muscle",pct:i.value,arcPct:a.muscle,color:Ht,trend:i.trend},{key:"fat",label:"Fat",pct:s.value,arcPct:a.fat,color:Rt,trend:s.trend},{key:"bone",label:"Bone",pct:n,arcPct:a.bone,color:Nt,trend:o?.trend},{key:"other",label:"Other",pct:a.other,arcPct:a.other,color:Dt}].filter(t=>t.arcPct>.05)}function It(t,e){const s=t*Math.PI/180;return{x:Ot+e*Math.sin(s),y:Ut-e*Math.cos(s)}}const zt=620;class Ft extends lt{constructor(){super(...arguments),this.trendTracker=new Ct}setConfig(t){if(!t||!t.metrics)throw new Error('Invalid configuration: "metrics" is required.');this.config={...t,display_mode:t.display_mode??"grid",gender:t.gender??"male"},this.trendTracker=new Ct(()=>this.requestUpdate())}set hass(t){this.hassObj=t,this.requestUpdate()}getCardSize(){switch(this.config?.display_mode){case"callouts":case"donut":return 6;default:return 4}}static getConfigElement(){return document.createElement("openscale-card-editor")}static getStubConfig(){return{type:"custom:openscale-card",gender:"male",display_mode:"grid",metrics:{weight:{},body_fat:{},muscle_mass:{},water:{}}}}render(){if(!this.config||!this.hassObj)return F``;const t=this.config,e=t.gender??"male",s=function(t,e,s){const i=Object.entries(e.metrics),o=[];for(const[n,a]of i){if(!a)continue;let i,r,l;if(a.entity){const e=t.states[a.entity],s=e?parseFloat(e.state):NaN;if(!e||!Number.isFinite(s))continue;i=s,r=e.state,l=e.attributes?.unit_of_measurement??""}else{const s=xt(n,t,e.metrics,e);if(void 0===s)continue;i=s,r=s.toFixed(mt[n]??1),l=ut[n]??""}o.push({key:n,label:dt[n],value:i,formatted:r,unit:l,trend:a.entity&&"function"==typeof t.callApi?s.update(n,i,{hass:{callApi:t.callApi.bind(t)},entityId:a.entity}):s.update(n,i),hint:pt[n]})}return o}(this.hassObj,t,this.trendTracker),i=t.display_mode??"grid",o="donut"===i&&function(t){return!!jt(t,"water")&&!!jt(t,"body_fat")&&!!jt(t,"muscle_mass")}(s)?function(t,e){const s=Lt(t);let i=0;const o=s.map(t=>{const e=t.arcPct/100,s=Math.max(0,e*Pt-4),o=-i,n=(i/Pt*360+180*e)%360;return i+=e*Pt,{segment:t,length:s,dashoffset:o,angle:n,point:It(n,100)}}),n=o.filter(t=>t.point.x<Ot).sort((t,e)=>t.point.y-e.point.y),a=o.filter(t=>t.point.x>=Ot).sort((t,e)=>t.point.y-e.point.y),r=Math.max(n.length,a.length,1),l=Math.max(243,40+32*r+20),c=(t,e)=>e<=1?l/2:40+t*(l-40-20)/(e-1),h=n.map((t,e)=>({...t,labelY:c(e,n.length)})),d=a.map((t,e)=>({...t,labelY:c(e,a.length)})),p=t.filter(t=>!Bt.has(t.key));return F`
    <div class="donut-mode">
      <svg class="donut-ring" viewBox="0 0 ${460} ${l}">
        <g transform="translate(${Ot}, ${Ut}) rotate(-90)">
          ${o.map(({segment:t,length:e,dashoffset:s})=>W`
              <circle
                r=${82}
                fill="none"
                stroke=${t.color}
                stroke-width=${16}
                stroke-dasharray="${e} ${Pt}"
                stroke-dashoffset=${s}
              ></circle>
            `)}
        </g>
        <g transform="translate(${Ot}, ${Ut}) scale(0.55) translate(-110, -115)">
          ${Et(e)}
        </g>
        ${h.map(({segment:t,point:e,labelY:s})=>W`
            <line x1=${e.x} y1=${e.y} x2=${95} y2=${s} class="callout-line"></line>
            <circle cx=${e.x} cy=${e.y} r="3" fill=${t.color}></circle>
            <text x=${85} y=${s-4} class="callout-label" text-anchor="end">${t.label}</text>
            <text x=${85} y=${s+13} class="callout-value" text-anchor="end">
              ${t.pct.toFixed(1)}%${t.trend?` ${kt[t.trend]}`:""}
            </text>
          `)}
        ${d.map(({segment:t,point:e,labelY:s})=>W`
            <line x1=${e.x} y1=${e.y} x2=${365} y2=${s} class="callout-line"></line>
            <circle cx=${e.x} cy=${e.y} r="3" fill=${t.color}></circle>
            <text x=${375} y=${s-4} class="callout-label" text-anchor="start">${t.label}</text>
            <text x=${375} y=${s+13} class="callout-value" text-anchor="start">
              ${t.pct.toFixed(1)}%${t.trend?` ${kt[t.trend]}`:""}
            </text>
          `)}
      </svg>
      ${p.length?F`
            <div class="donut-extra">
              ${p.map(t=>F`
                  <div class="row">
                    <span class="label">${t.label}${St(t.hint)}</span>
                    <span class="value">${t.formatted} ${t.unit} ${Mt(t.trend)}</span>
                  </div>
                `)}
            </div>
          `:""}
    </div>
  `}(s,e):"callouts"===i?function(t,e){const s=t.filter((t,e)=>e%2==0),i=t.filter((t,e)=>e%2==1),o=Math.max(s.length,i.length,1),n=Math.max(240,55+34*o+20),a=(t,e)=>e<=1?n/2:55+t*(n-55-20)/(e-1),r=s.map((t,e)=>({row:t,y:a(e,s.length),anchorX:270})),l=i.map((t,e)=>({row:t,y:a(e,i.length),anchorX:350}));return F`
    <svg class="callouts-mode" viewBox="0 0 ${zt} ${n}">
      ${r.map(({y:t,anchorX:e})=>W`
          <line x1=${e} y1=${t} x2=${95} y2=${t} class="callout-line"></line>
        `)}
      ${l.map(({y:t,anchorX:e})=>W`
          <line x1=${e} y1=${t} x2=${525} y2=${t} class="callout-line"></line>
        `)}
      <g transform="translate(${200}, 0)">${Et(e)}</g>
      ${r.map(({row:t,y:e})=>W`
          <text
            x=${85} y=${e-6}
            class="callout-label ${t.hint?"has-hint":""}"
            text-anchor="end"
          >
            ${t.label}${t.hint?W`<title>${t.hint}</title>`:""}
          </text>
          <text x=${85} y=${e+12} class="callout-value" text-anchor="end">
            ${t.formatted} ${t.unit}${t.trend?` ${kt[t.trend]}`:""}
          </text>
        `)}
      ${l.map(({row:t,y:e})=>W`
          <text
            x=${535} y=${e-6}
            class="callout-label ${t.hint?"has-hint":""}"
            text-anchor="start"
          >
            ${t.label}${t.hint?W`<title>${t.hint}</title>`:""}
          </text>
          <text x=${535} y=${e+12} class="callout-value" text-anchor="start">
            ${t.formatted} ${t.unit}${t.trend?` ${kt[t.trend]}`:""}
          </text>
        `)}
    </svg>
  `}(s,e):function(t,e){return F`
    <div class="grid-mode">
      <svg class="grid-silhouette" viewBox=${"0 0 220 230"}>${Et(e)}</svg>
      <div class="grid-rows">
        ${t.map(t=>F`
            <div class="row">
              <span class="label">${t.label}${St(t.hint)}</span>
              <span class="value">
                ${t.formatted} ${t.unit}
                ${Mt(t.trend)}
              </span>
            </div>
          `)}
      </div>
    </div>
  `}(s,e);return F`
      <ha-card .header=${t.title??"OpenScale"}>
        <div class="content">${o}</div>
      </ha-card>
    `}}Ft.styles=n`
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
      width: 100%;
      height: auto;
    }
    .donut-extra {
      width: 100%;
      margin-top: 8px;
    }
  `,customElements.define("openscale-card",Ft);const Wt=window;Wt.customCards=Wt.customCards||[],Wt.customCards.push({type:"openscale-card",name:"OpenScale Card",description:"Displays openScale-sync body composition data as a schematic body silhouette."});export{Ft as OpenscaleCard};
