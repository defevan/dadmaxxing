(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=r(n);fetch(n.href,i)}})();window.requestIdleCallback=window.requestIdleCallback||function(t){var e=Date.now();return setTimeout(function(){t({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-e))}})},1)};window.cancelIdleCallback=window.cancelIdleCallback||function(t){clearTimeout(t)};var as=Object.defineProperty,_=(t,e)=>as(t,"name",{value:e,configurable:!0}),re=class{type=3;name="";prefix="";value="";suffix="";modifier=3;constructor(e,r,o,n,i,s){this.type=e,this.name=r,this.prefix=o,this.value=n,this.suffix=i,this.modifier=s}hasCustomName(){return this.name!==""&&typeof this.name!="number"}};_(re,"Part");var ls=/[$_\p{ID_Start}]/u,cs=/[$_\u200C\u200D\p{ID_Continue}]/u,Er=".*";function mn(t,e){return(e?/^[\x00-\xFF]*$/:/^[\x00-\x7F]*$/).test(t)}_(mn,"isASCII");function qr(t,e=!1){let r=[],o=0;for(;o<t.length;){let n=t[o],i=_(function(s){if(!e)throw new TypeError(s);r.push({type:"INVALID_CHAR",index:o,value:t[o++]})},"ErrorOrInvalid");if(n==="*"){r.push({type:"ASTERISK",index:o,value:t[o++]});continue}if(n==="+"||n==="?"){r.push({type:"OTHER_MODIFIER",index:o,value:t[o++]});continue}if(n==="\\"){r.push({type:"ESCAPED_CHAR",index:o++,value:t[o++]});continue}if(n==="{"){r.push({type:"OPEN",index:o,value:t[o++]});continue}if(n==="}"){r.push({type:"CLOSE",index:o,value:t[o++]});continue}if(n===":"){let s="",a=o+1;for(;a<t.length;){let l=t.substr(a,1);if(a===o+1&&ls.test(l)||a!==o+1&&cs.test(l)){s+=t[a++];continue}break}if(!s){i(`Missing parameter name at ${o}`);continue}r.push({type:"NAME",index:o,value:s}),o=a;continue}if(n==="("){let s=1,a="",l=o+1,c=!1;if(t[l]==="?"){i(`Pattern cannot start with "?" at ${l}`);continue}for(;l<t.length;){if(!mn(t[l],!1)){i(`Invalid character '${t[l]}' at ${l}.`),c=!0;break}if(t[l]==="\\"){a+=t[l++]+t[l++];continue}if(t[l]===")"){if(s--,s===0){l++;break}}else if(t[l]==="("&&(s++,t[l+1]!=="?")){i(`Capturing groups are not allowed at ${l}`),c=!0;break}a+=t[l++]}if(c)continue;if(s){i(`Unbalanced pattern at ${o}`);continue}if(!a){i(`Missing pattern at ${o}`);continue}r.push({type:"REGEX",index:o,value:a}),o=l;continue}r.push({type:"CHAR",index:o,value:t[o++]})}return r.push({type:"END",index:o,value:""}),r}_(qr,"lexer");function Kr(t,e={}){let r=qr(t);e.delimiter??="/#?",e.prefixes??="./";let o=`[^${K(e.delimiter)}]+?`,n=[],i=0,s=0,a=new Set,l=_(w=>{if(s<r.length&&r[s].type===w)return r[s++].value},"tryConsume"),c=_(()=>l("OTHER_MODIFIER")??l("ASTERISK"),"tryConsumeModifier"),u=_(w=>{let $=l(w);if($!==void 0)return $;let{type:S,index:E}=r[s];throw new TypeError(`Unexpected ${S} at ${E}, expected ${w}`)},"mustConsume"),d=_(()=>{let w="",$;for(;$=l("CHAR")??l("ESCAPED_CHAR");)w+=$;return w},"consumeText"),m=_(w=>w,"DefaultEncodePart"),h=e.encodePart||m,b="",v=_(w=>{b+=w},"appendToPendingFixedValue"),x=_(()=>{b.length&&(n.push(new re(3,"","",h(b),"",3)),b="")},"maybeAddPartFromPendingFixedValue"),y=_((w,$,S,E,R)=>{let O=3;switch(R){case"?":O=1;break;case"*":O=0;break;case"+":O=2;break}if(!$&&!S&&O===3){v(w);return}if(x(),!$&&!S){if(!w)return;n.push(new re(3,"","",h(w),"",O));return}let T;S?S==="*"?T=Er:T=S:T=o;let U=2;T===o?(U=1,T=""):T===Er&&(U=0,T="");let I;if($?I=$:S&&(I=i++),a.has(I))throw new TypeError(`Duplicate name '${I}'.`);a.add(I),n.push(new re(U,I,h(w),T,h(E),O))},"addPart");for(;s<r.length;){let w=l("CHAR"),$=l("NAME"),S=l("REGEX");if(!$&&!S&&(S=l("ASTERISK")),$||S){let R=w??"";e.prefixes.indexOf(R)===-1&&(v(R),R=""),x();let O=c();y(R,$,S,"",O);continue}let E=w??l("ESCAPED_CHAR");if(E){v(E);continue}if(l("OPEN")){let R=d(),O=l("NAME"),T=l("REGEX");!O&&!T&&(T=l("ASTERISK"));let U=d();u("CLOSE");let I=c();y(R,O,T,U,I);continue}x(),u("END")}return n}_(Kr,"parse");function K(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}_(K,"escapeString");function Cr(t){return t&&t.ignoreCase?"ui":"u"}_(Cr,"flags");function bn(t,e,r){return Yr(Kr(t,r),e,r)}_(bn,"stringToRegexp");function jt(t){switch(t){case 0:return"*";case 1:return"?";case 2:return"+";case 3:return""}}_(jt,"modifierToString");function Yr(t,e,r={}){r.delimiter??="/#?",r.prefixes??="./",r.sensitive??=!1,r.strict??=!1,r.end??=!0,r.start??=!0,r.endsWith="";let o=r.start?"^":"";for(let a of t){if(a.type===3){a.modifier===3?o+=K(a.value):o+=`(?:${K(a.value)})${jt(a.modifier)}`;continue}e&&e.push(a.name);let l=`[^${K(r.delimiter)}]+?`,c=a.value;if(a.type===1?c=l:a.type===0&&(c=Er),!a.prefix.length&&!a.suffix.length){a.modifier===3||a.modifier===1?o+=`(${c})${jt(a.modifier)}`:o+=`((?:${c})${jt(a.modifier)})`;continue}if(a.modifier===3||a.modifier===1){o+=`(?:${K(a.prefix)}(${c})${K(a.suffix)})`,o+=jt(a.modifier);continue}o+=`(?:${K(a.prefix)}`,o+=`((?:${c})(?:`,o+=K(a.suffix),o+=K(a.prefix),o+=`(?:${c}))*)${K(a.suffix)})`,a.modifier===0&&(o+="?")}let n=`[${K(r.endsWith)}]|$`,i=`[${K(r.delimiter)}]`;if(r.end)return r.strict||(o+=`${i}?`),r.endsWith.length?o+=`(?=${n})`:o+="$",new RegExp(o,Cr(r));r.strict||(o+=`(?:${i}(?=${n}))?`);let s=!1;if(t.length){let a=t[t.length-1];a.type===3&&a.modifier===3&&(s=r.delimiter.indexOf(a)>-1)}return s||(o+=`(?=${i}|${n})`),new RegExp(o,Cr(r))}_(Yr,"partsToRegexp");var _t={delimiter:"",prefixes:"",sensitive:!0,strict:!0},us={delimiter:".",prefixes:"",sensitive:!0,strict:!0},hs={delimiter:"/",prefixes:"/",sensitive:!0,strict:!0};function vn(t,e){return t.length?t[0]==="/"?!0:!e||t.length<2?!1:(t[0]=="\\"||t[0]=="{")&&t[1]=="/":!1}_(vn,"isAbsolutePathname");function Zr(t,e){return t.startsWith(e)?t.substring(e.length,t.length):t}_(Zr,"maybeStripPrefix");function gn(t,e){return t.endsWith(e)?t.substr(0,t.length-e.length):t}_(gn,"maybeStripSuffix");function Xr(t){return!t||t.length<2?!1:t[0]==="["||(t[0]==="\\"||t[0]==="{")&&t[1]==="["}_(Xr,"treatAsIPv6Hostname");var yn=["ftp","file","http","https","ws","wss"];function Gr(t){if(!t)return!0;for(let e of yn)if(t.test(e))return!0;return!1}_(Gr,"isSpecialScheme");function wn(t,e){if(t=Zr(t,"#"),e||t==="")return t;let r=new URL("https://example.com");return r.hash=t,r.hash?r.hash.substring(1,r.hash.length):""}_(wn,"canonicalizeHash");function _n(t,e){if(t=Zr(t,"?"),e||t==="")return t;let r=new URL("https://example.com");return r.search=t,r.search?r.search.substring(1,r.search.length):""}_(_n,"canonicalizeSearch");function xn(t,e){return e||t===""?t:Xr(t)?to(t):Qr(t)}_(xn,"canonicalizeHostname");function $n(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.password=t,r.password}_($n,"canonicalizePassword");function kn(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.username=t,r.username}_(kn,"canonicalizeUsername");function Sn(t,e,r){if(r||t==="")return t;if(e&&!yn.includes(e))return new URL(`${e}:${t}`).pathname;let o=t[0]=="/";return t=new URL(o?t:"/-"+t,"https://example.com").pathname,o||(t=t.substring(2,t.length)),t}_(Sn,"canonicalizePathname");function En(t,e,r){return Jr(e)===t&&(t=""),r||t===""?t:eo(t)}_(En,"canonicalizePort");function Cn(t,e){return t=gn(t,":"),e||t===""?t:nr(t)}_(Cn,"canonicalizeProtocol");function Jr(t){switch(t){case"ws":case"http":return"80";case"wws":case"https":return"443";case"ftp":return"21";default:return""}}_(Jr,"defaultPortForProtocol");function nr(t){if(t==="")return t;if(/^[-+.A-Za-z0-9]*$/.test(t))return t.toLowerCase();throw new TypeError(`Invalid protocol '${t}'.`)}_(nr,"protocolEncodeCallback");function An(t){if(t==="")return t;let e=new URL("https://example.com");return e.username=t,e.username}_(An,"usernameEncodeCallback");function On(t){if(t==="")return t;let e=new URL("https://example.com");return e.password=t,e.password}_(On,"passwordEncodeCallback");function Qr(t){if(t==="")return t;if(/[\t\n\r #%/:<>?@[\]^\\|]/g.test(t))throw new TypeError(`Invalid hostname '${t}'`);let e=new URL("https://example.com");return e.hostname=t,e.hostname}_(Qr,"hostnameEncodeCallback");function to(t){if(t==="")return t;if(/[^0-9a-fA-F[\]:]/g.test(t))throw new TypeError(`Invalid IPv6 hostname '${t}'`);return t.toLowerCase()}_(to,"ipv6HostnameEncodeCallback");function eo(t){if(t===""||/^[0-9]*$/.test(t)&&parseInt(t)<=65535)return t;throw new TypeError(`Invalid port '${t}'.`)}_(eo,"portEncodeCallback");function Pn(t){if(t==="")return t;let e=new URL("https://example.com");return e.pathname=t[0]!=="/"?"/-"+t:t,t[0]!=="/"?e.pathname.substring(2,e.pathname.length):e.pathname}_(Pn,"standardURLPathnameEncodeCallback");function Rn(t){return t===""?t:new URL(`data:${t}`).pathname}_(Rn,"pathURLPathnameEncodeCallback");function Tn(t){if(t==="")return t;let e=new URL("https://example.com");return e.search=t,e.search.substring(1,e.search.length)}_(Tn,"searchEncodeCallback");function zn(t){if(t==="")return t;let e=new URL("https://example.com");return e.hash=t,e.hash.substring(1,e.hash.length)}_(zn,"hashEncodeCallback");var Ln=class{#i;#o=[];#e={};#t=0;#n=1;#c=0;#a=0;#p=0;#f=0;#m=!1;constructor(e){this.#i=e}get result(){return this.#e}parse(){for(this.#o=qr(this.#i,!0);this.#t<this.#o.length;this.#t+=this.#n){if(this.#n=1,this.#o[this.#t].type==="END"){if(this.#a===0){this.#y(),this.#u()?this.#r(9,1):this.#h()?this.#r(8,1):this.#r(7,0);continue}else if(this.#a===2){this.#d(5);continue}this.#r(10,0);break}if(this.#p>0)if(this.#E())this.#p-=1;else continue;if(this.#S()){this.#p+=1;continue}switch(this.#a){case 0:this.#w()&&this.#d(1);break;case 1:if(this.#w()){this.#O();let e=7,r=1;this.#x()?(e=2,r=3):this.#m&&(e=2),this.#r(e,r)}break;case 2:this.#v()?this.#d(3):(this.#g()||this.#h()||this.#u())&&this.#d(5);break;case 3:this.#$()?this.#r(4,1):this.#v()&&this.#r(5,1);break;case 4:this.#v()&&this.#r(5,1);break;case 5:this.#C()?this.#f+=1:this.#A()&&(this.#f-=1),this.#k()&&!this.#f?this.#r(6,1):this.#g()?this.#r(7,0):this.#h()?this.#r(8,1):this.#u()&&this.#r(9,1);break;case 6:this.#g()?this.#r(7,0):this.#h()?this.#r(8,1):this.#u()&&this.#r(9,1);break;case 7:this.#h()?this.#r(8,1):this.#u()&&this.#r(9,1);break;case 8:this.#u()&&this.#r(9,1);break}}this.#e.hostname!==void 0&&this.#e.port===void 0&&(this.#e.port="")}#r(e,r){switch(this.#a){case 0:break;case 1:this.#e.protocol=this.#l();break;case 2:break;case 3:this.#e.username=this.#l();break;case 4:this.#e.password=this.#l();break;case 5:this.#e.hostname=this.#l();break;case 6:this.#e.port=this.#l();break;case 7:this.#e.pathname=this.#l();break;case 8:this.#e.search=this.#l();break;case 9:this.#e.hash=this.#l();break}this.#a!==0&&e!==10&&([1,2,3,4].includes(this.#a)&&[6,7,8,9].includes(e)&&(this.#e.hostname??=""),[1,2,3,4,5,6].includes(this.#a)&&[8,9].includes(e)&&(this.#e.pathname??=this.#m?"/":""),[1,2,3,4,5,6,7].includes(this.#a)&&e===9&&(this.#e.search??="")),this.#_(e,r)}#_(e,r){this.#a=e,this.#c=this.#t+r,this.#t+=r,this.#n=0}#y(){this.#t=this.#c,this.#n=0}#d(e){this.#y(),this.#a=e}#b(e){return e<0&&(e=this.#o.length-e),e<this.#o.length?this.#o[e]:this.#o[this.#o.length-1]}#s(e,r){let o=this.#b(e);return o.value===r&&(o.type==="CHAR"||o.type==="ESCAPED_CHAR"||o.type==="INVALID_CHAR")}#w(){return this.#s(this.#t,":")}#x(){return this.#s(this.#t+1,"/")&&this.#s(this.#t+2,"/")}#v(){return this.#s(this.#t,"@")}#$(){return this.#s(this.#t,":")}#k(){return this.#s(this.#t,":")}#g(){return this.#s(this.#t,"/")}#h(){if(this.#s(this.#t,"?"))return!0;if(this.#o[this.#t].value!=="?")return!1;let e=this.#b(this.#t-1);return e.type!=="NAME"&&e.type!=="REGEX"&&e.type!=="CLOSE"&&e.type!=="ASTERISK"}#u(){return this.#s(this.#t,"#")}#S(){return this.#o[this.#t].type=="OPEN"}#E(){return this.#o[this.#t].type=="CLOSE"}#C(){return this.#s(this.#t,"[")}#A(){return this.#s(this.#t,"]")}#l(){let e=this.#o[this.#t],r=this.#b(this.#c).index;return this.#i.substring(r,e.index)}#O(){let e={};Object.assign(e,_t),e.encodePart=nr;let r=bn(this.#l(),void 0,e);this.#m=Gr(r)}};_(Ln,"Parser");var vr=["protocol","username","password","hostname","port","pathname","search","hash"],wt="*";function Ar(t,e){if(typeof t!="string")throw new TypeError("parameter 1 is not of type 'string'.");let r=new URL(t,e);return{protocol:r.protocol.substring(0,r.protocol.length-1),username:r.username,password:r.password,hostname:r.hostname,port:r.port,pathname:r.pathname,search:r.search!==""?r.search.substring(1,r.search.length):void 0,hash:r.hash!==""?r.hash.substring(1,r.hash.length):void 0}}_(Ar,"extractValues");function at(t,e){return e?te(t):t}_(at,"processBaseURLString");function Jt(t,e,r){let o;if(typeof e.baseURL=="string")try{o=new URL(e.baseURL),e.protocol===void 0&&(t.protocol=at(o.protocol.substring(0,o.protocol.length-1),r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&(t.username=at(o.username,r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&e.password===void 0&&(t.password=at(o.password,r)),e.protocol===void 0&&e.hostname===void 0&&(t.hostname=at(o.hostname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&(t.port=at(o.port,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&(t.pathname=at(o.pathname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&(t.search=at(o.search.substring(1,o.search.length),r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&e.hash===void 0&&(t.hash=at(o.hash.substring(1,o.hash.length),r))}catch{throw new TypeError(`invalid baseURL '${e.baseURL}'.`)}if(typeof e.protocol=="string"&&(t.protocol=Cn(e.protocol,r)),typeof e.username=="string"&&(t.username=kn(e.username,r)),typeof e.password=="string"&&(t.password=$n(e.password,r)),typeof e.hostname=="string"&&(t.hostname=xn(e.hostname,r)),typeof e.port=="string"&&(t.port=En(e.port,t.protocol,r)),typeof e.pathname=="string"){if(t.pathname=e.pathname,o&&!vn(t.pathname,r)){let n=o.pathname.lastIndexOf("/");n>=0&&(t.pathname=at(o.pathname.substring(0,n+1),r)+t.pathname)}t.pathname=Sn(t.pathname,t.protocol,r)}return typeof e.search=="string"&&(t.search=_n(e.search,r)),typeof e.hash=="string"&&(t.hash=wn(e.hash,r)),t}_(Jt,"applyInit");function te(t){return t.replace(/([+*?:{}()\\])/g,"\\$1")}_(te,"escapePatternString");function In(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}_(In,"escapeRegexpString");function Mn(t,e){e.delimiter??="/#?",e.prefixes??="./",e.sensitive??=!1,e.strict??=!1,e.end??=!0,e.start??=!0,e.endsWith="";let r=".*",o=`[^${In(e.delimiter)}]+?`,n=/[$_\u200C\u200D\p{ID_Continue}]/u,i="";for(let s=0;s<t.length;++s){let a=t[s];if(a.type===3){if(a.modifier===3){i+=te(a.value);continue}i+=`{${te(a.value)}}${jt(a.modifier)}`;continue}let l=a.hasCustomName(),c=!!a.suffix.length||!!a.prefix.length&&(a.prefix.length!==1||!e.prefixes.includes(a.prefix)),u=s>0?t[s-1]:null,d=s<t.length-1?t[s+1]:null;if(!c&&l&&a.type===1&&a.modifier===3&&d&&!d.prefix.length&&!d.suffix.length)if(d.type===3){let m=d.value.length>0?d.value[0]:"";c=n.test(m)}else c=!d.hasCustomName();if(!c&&!a.prefix.length&&u&&u.type===3){let m=u.value[u.value.length-1];c=e.prefixes.includes(m)}c&&(i+="{"),i+=te(a.prefix),l&&(i+=`:${a.name}`),a.type===2?i+=`(${a.value})`:a.type===1?l||(i+=`(${o})`):a.type===0&&(!l&&(!u||u.type===3||u.modifier!==3||c||a.prefix!=="")?i+="*":i+=`(${r})`),a.type===1&&l&&a.suffix.length&&n.test(a.suffix[0])&&(i+="\\"),i+=te(a.suffix),c&&(i+="}"),a.modifier!==3&&(i+=jt(a.modifier))}return i}_(Mn,"partsToPattern");var Dn=class{#i;#o={};#e={};#t={};#n={};#c=!1;constructor(t={},e,r){try{let o;if(typeof e=="string"?o=e:r=e,typeof t=="string"){let a=new Ln(t);if(a.parse(),t=a.result,o===void 0&&typeof t.protocol!="string")throw new TypeError("A base URL must be provided for a relative constructor string.");t.baseURL=o}else{if(!t||typeof t!="object")throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");if(o)throw new TypeError("parameter 1 is not of type 'string'.")}typeof r>"u"&&(r={ignoreCase:!1});let n={ignoreCase:r.ignoreCase===!0},i={pathname:wt,protocol:wt,username:wt,password:wt,hostname:wt,port:wt,search:wt,hash:wt};this.#i=Jt(i,t,!0),Jr(this.#i.protocol)===this.#i.port&&(this.#i.port="");let s;for(s of vr){if(!(s in this.#i))continue;let a={},l=this.#i[s];switch(this.#e[s]=[],s){case"protocol":Object.assign(a,_t),a.encodePart=nr;break;case"username":Object.assign(a,_t),a.encodePart=An;break;case"password":Object.assign(a,_t),a.encodePart=On;break;case"hostname":Object.assign(a,us),Xr(l)?a.encodePart=to:a.encodePart=Qr;break;case"port":Object.assign(a,_t),a.encodePart=eo;break;case"pathname":Gr(this.#o.protocol)?(Object.assign(a,hs,n),a.encodePart=Pn):(Object.assign(a,_t,n),a.encodePart=Rn);break;case"search":Object.assign(a,_t,n),a.encodePart=Tn;break;case"hash":Object.assign(a,_t,n),a.encodePart=zn;break}try{this.#n[s]=Kr(l,a),this.#o[s]=Yr(this.#n[s],this.#e[s],a),this.#t[s]=Mn(this.#n[s],a),this.#c=this.#c||this.#n[s].some(c=>c.type===2)}catch{throw new TypeError(`invalid ${s} pattern '${this.#i[s]}'.`)}}}catch(o){throw new TypeError(`Failed to construct 'URLPattern': ${o.message}`)}}get[Symbol.toStringTag](){return"URLPattern"}test(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return!1;try{typeof t=="object"?r=Jt(r,t,!1):r=Jt(r,Ar(t,e),!1)}catch{return!1}let o;for(o of vr)if(!this.#o[o].exec(r[o]))return!1;return!0}exec(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return;try{typeof t=="object"?r=Jt(r,t,!1):r=Jt(r,Ar(t,e),!1)}catch{return null}let o={};e?o.inputs=[t,e]:o.inputs=[t];let n;for(n of vr){let i=this.#o[n].exec(r[n]);if(!i)return null;let s={};for(let[a,l]of this.#e[n].entries())if(typeof l=="string"||typeof l=="number"){let c=i[a+1];s[l]=c}o[n]={input:r[n]??"",groups:s}}return o}static compareComponent(t,e,r){let o=_((a,l)=>{for(let c of["type","modifier","prefix","value","suffix"]){if(a[c]<l[c])return-1;if(a[c]!==l[c])return 1}return 0},"comparePart"),n=new re(3,"","","","",3),i=new re(0,"","","","",3),s=_((a,l)=>{let c=0;for(;c<Math.min(a.length,l.length);++c){let u=o(a[c],l[c]);if(u)return u}return a.length===l.length?0:o(a[c]??n,l[c]??n)},"comparePartList");return!e.#t[t]&&!r.#t[t]?0:e.#t[t]&&!r.#t[t]?s(e.#n[t],[i]):!e.#t[t]&&r.#t[t]?s([i],r.#n[t]):s(e.#n[t],r.#n[t])}get protocol(){return this.#t.protocol}get username(){return this.#t.username}get password(){return this.#t.password}get hostname(){return this.#t.hostname}get port(){return this.#t.port}get pathname(){return this.#t.pathname}get search(){return this.#t.search}get hash(){return this.#t.hash}get hasRegExpGroups(){return this.#c}};_(Dn,"URLPattern");globalThis.URLPattern||(globalThis.URLPattern=Dn);const Or=new Set,ee=new Map;let Dt,ro="ltr",oo="en";const jn=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(jn){const t=new MutationObserver(Un);ro=document.documentElement.dir||"ltr",oo=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Bn(...t){t.map(e=>{const r=e.$code.toLowerCase();ee.has(r)?ee.set(r,Object.assign(Object.assign({},ee.get(r)),e)):ee.set(r,e),Dt||(Dt=e)}),Un()}function Un(){jn&&(ro=document.documentElement.dir||"ltr",oo=document.documentElement.lang||navigator.language),[...Or.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}let ds=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Or.add(this.host)}hostDisconnected(){Or.delete(this.host)}dir(){return`${this.host.dir||ro}`.toLowerCase()}lang(){return`${this.host.lang||oo}`.toLowerCase()}getTranslationData(e){var r,o;const n=new Intl.Locale(e.replace(/_/g,"-")),i=n?.language.toLowerCase(),s=(o=(r=n?.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",a=ee.get(`${i}-${s}`),l=ee.get(i);return{locale:n,language:i,region:s,primary:a,secondary:l}}exists(e,r){var o;const{primary:n,secondary:i}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(n&&n[e]||i&&i[e]||r.includeFallback&&Dt&&Dt[e])}term(e,...r){const{primary:o,secondary:n}=this.getTranslationData(this.lang());let i;if(o&&o[e])i=o[e];else if(n&&n[e])i=n[e];else if(Dt&&Dt[e])i=Dt[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i=="function"?i(...r):i}date(e,r){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),r).format(e)}number(e,r){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),r).format(e)}relativeTime(e,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,r)}};var Fn={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};Bn(Fn);var ps=Fn,Wt=class extends ds{};Bn(ps);var Nn=Object.defineProperty,fs=Object.defineProperties,ms=Object.getOwnPropertyDescriptor,bs=Object.getOwnPropertyDescriptors,Ao=Object.getOwnPropertySymbols,vs=Object.prototype.hasOwnProperty,gs=Object.prototype.propertyIsEnumerable,Vn=t=>{throw TypeError(t)},Oo=(t,e,r)=>e in t?Nn(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,qt=(t,e)=>{for(var r in e||(e={}))vs.call(e,r)&&Oo(t,r,e[r]);if(Ao)for(var r of Ao(e))gs.call(e,r)&&Oo(t,r,e[r]);return t},ir=(t,e)=>fs(t,bs(e)),p=(t,e,r,o)=>{for(var n=o>1?void 0:o?ms(e,r):e,i=t.length-1,s;i>=0;i--)(s=t[i])&&(n=(o?s(e,r,n):s(n))||n);return o&&n&&Nn(e,r,n),n},Hn=(t,e,r)=>e.has(t)||Vn("Cannot "+r),ys=(t,e,r)=>(Hn(t,e,"read from private field"),e.get(t)),ws=(t,e,r)=>e.has(t)?Vn("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),_s=(t,e,r,o)=>(Hn(t,e,"write to private field"),e.set(t,r),r);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ne=globalThis,no=Ne.ShadowRoot&&(Ne.ShadyCSS===void 0||Ne.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,io=Symbol(),Po=new WeakMap;let Wn=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==io)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(no&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=Po.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&Po.set(r,e))}return e}toString(){return this.cssText}};const xs=t=>new Wn(typeof t=="string"?t:t+"",void 0,io),Q=(t,...e)=>{const r=t.length===1?t[0]:e.reduce(((o,n,i)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[i+1]),t[0]);return new Wn(r,t,io)},$s=(t,e)=>{if(no)t.adoptedStyleSheets=e.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of e){const o=document.createElement("style"),n=Ne.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=r.cssText,t.appendChild(o)}},Ro=no?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return xs(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ks,defineProperty:Ss,getOwnPropertyDescriptor:Es,getOwnPropertyNames:Cs,getOwnPropertySymbols:As,getPrototypeOf:Os}=Object,sr=globalThis,To=sr.trustedTypes,Ps=To?To.emptyScript:"",Rs=sr.reactiveElementPolyfillSupport,$e=(t,e)=>t,se={toAttribute(t,e){switch(e){case Boolean:t=t?Ps:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},so=(t,e)=>!ks(t,e),zo={attribute:!0,type:String,converter:se,reflect:!1,useDefault:!1,hasChanged:so};Symbol.metadata??=Symbol("metadata"),sr.litPropertyMetadata??=new WeakMap;let Qt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=zo){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),n=this.getPropertyDescriptor(e,o,r);n!==void 0&&Ss(this.prototype,e,n)}}static getPropertyDescriptor(e,r,o){const{get:n,set:i}=Es(this.prototype,e)??{get(){return this[r]},set(s){this[r]=s}};return{get:n,set(s){const a=n?.call(this);i?.call(this,s),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??zo}static _$Ei(){if(this.hasOwnProperty($e("elementProperties")))return;const e=Os(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty($e("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($e("properties"))){const r=this.properties,o=[...Cs(r),...As(r)];for(const n of o)this.createProperty(n,r[n])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,n]of r)this.elementProperties.set(o,n)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const n=this._$Eu(r,o);n!==void 0&&this._$Eh.set(n,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const n of o)r.unshift(Ro(n))}else e!==void 0&&r.push(Ro(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){const o=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,o);if(n!==void 0&&o.reflect===!0){const i=(o.converter?.toAttribute!==void 0?o.converter:se).toAttribute(r,o.type);this._$Em=e,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(e,r){const o=this.constructor,n=o._$Eh.get(e);if(n!==void 0&&this._$Em!==n){const i=o.getPropertyOptions(n),s=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:se;this._$Em=n;const a=s.fromAttribute(r,i.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(e,r,o){if(e!==void 0){const n=this.constructor,i=this[e];if(o??=n.getPropertyOptions(e),!((o.hasChanged??so)(i,r)||o.useDefault&&o.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:n,wrapped:i},s){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??r??this[e]),i!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[n,i]of o){const{wrapped:s}=i,a=this[n];s!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,i,a)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),this._$EO?.forEach((o=>o.hostUpdate?.())),this.update(r)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(r)}willUpdate(e){}_$AE(e){this._$EO?.forEach((r=>r.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};Qt.elementStyles=[],Qt.shadowRootOptions={mode:"open"},Qt[$e("elementProperties")]=new Map,Qt[$e("finalized")]=new Map,Rs?.({ReactiveElement:Qt}),(sr.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ao=globalThis,Ke=ao.trustedTypes,Lo=Ke?Ke.createPolicy("lit-html",{createHTML:t=>t}):void 0,qn="$lit$",$t=`lit$${Math.random().toFixed(9).slice(2)}$`,Kn="?"+$t,Ts=`<${Kn}>`,Nt=document,ke=()=>Nt.createComment(""),Se=t=>t===null||typeof t!="object"&&typeof t!="function",lo=Array.isArray,zs=t=>lo(t)||typeof t?.[Symbol.iterator]=="function",gr=`[ 	
\f\r]`,ge=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Io=/-->/g,Mo=/>/g,Mt=RegExp(`>|${gr}(?:([^\\s"'>=/]+)(${gr}*=${gr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Do=/'/g,jo=/"/g,Yn=/^(?:script|style|textarea|title)$/i,Ls=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),C=Ls(1),J=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),Bo=new WeakMap,Bt=Nt.createTreeWalker(Nt,129);function Zn(t,e){if(!lo(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Lo!==void 0?Lo.createHTML(e):e}const Is=(t,e)=>{const r=t.length-1,o=[];let n,i=e===2?"<svg>":e===3?"<math>":"",s=ge;for(let a=0;a<r;a++){const l=t[a];let c,u,d=-1,m=0;for(;m<l.length&&(s.lastIndex=m,u=s.exec(l),u!==null);)m=s.lastIndex,s===ge?u[1]==="!--"?s=Io:u[1]!==void 0?s=Mo:u[2]!==void 0?(Yn.test(u[2])&&(n=RegExp("</"+u[2],"g")),s=Mt):u[3]!==void 0&&(s=Mt):s===Mt?u[0]===">"?(s=n??ge,d=-1):u[1]===void 0?d=-2:(d=s.lastIndex-u[2].length,c=u[1],s=u[3]===void 0?Mt:u[3]==='"'?jo:Do):s===jo||s===Do?s=Mt:s===Io||s===Mo?s=ge:(s=Mt,n=void 0);const h=s===Mt&&t[a+1].startsWith("/>")?" ":"";i+=s===ge?l+Ts:d>=0?(o.push(c),l.slice(0,d)+qn+l.slice(d)+$t+h):l+$t+(d===-2?a:h)}return[Zn(t,i+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class Ee{constructor({strings:e,_$litType$:r},o){let n;this.parts=[];let i=0,s=0;const a=e.length-1,l=this.parts,[c,u]=Is(e,r);if(this.el=Ee.createElement(c,o),Bt.currentNode=this.el.content,r===2||r===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=Bt.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(const d of n.getAttributeNames())if(d.endsWith(qn)){const m=u[s++],h=n.getAttribute(d).split($t),b=/([.?@])?(.*)/.exec(m);l.push({type:1,index:i,name:b[2],strings:h,ctor:b[1]==="."?Ds:b[1]==="?"?js:b[1]==="@"?Bs:ar}),n.removeAttribute(d)}else d.startsWith($t)&&(l.push({type:6,index:i}),n.removeAttribute(d));if(Yn.test(n.tagName)){const d=n.textContent.split($t),m=d.length-1;if(m>0){n.textContent=Ke?Ke.emptyScript:"";for(let h=0;h<m;h++)n.append(d[h],ke()),Bt.nextNode(),l.push({type:2,index:++i});n.append(d[m],ke())}}}else if(n.nodeType===8)if(n.data===Kn)l.push({type:2,index:i});else{let d=-1;for(;(d=n.data.indexOf($t,d+1))!==-1;)l.push({type:7,index:i}),d+=$t.length-1}i++}}static createElement(e,r){const o=Nt.createElement("template");return o.innerHTML=e,o}}function ae(t,e,r=t,o){if(e===J)return e;let n=o!==void 0?r._$Co?.[o]:r._$Cl;const i=Se(e)?void 0:e._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(t),n._$AT(t,r,o)),o!==void 0?(r._$Co??=[])[o]=n:r._$Cl=n),n!==void 0&&(e=ae(t,n._$AS(t,e.values),n,o)),e}class Ms{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,n=(e?.creationScope??Nt).importNode(r,!0);Bt.currentNode=n;let i=Bt.nextNode(),s=0,a=0,l=o[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new Re(i,i.nextSibling,this,e):l.type===1?c=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(c=new Us(i,this,e)),this._$AV.push(c),l=o[++a]}s!==l?.index&&(i=Bt.nextNode(),s++)}return Bt.currentNode=Nt,n}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}}class Re{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,r,o,n){this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=ae(this,e,r),Se(e)?e===L||e==null||e===""?(this._$AH!==L&&this._$AR(),this._$AH=L):e!==this._$AH&&e!==J&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):zs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==L&&Se(this._$AH)?this._$AA.nextSibling.data=e:this.T(Nt.createTextNode(e)),this._$AH=e}$(e){const{values:r,_$litType$:o}=e,n=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Ee.createElement(Zn(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===n)this._$AH.p(r);else{const i=new Ms(n,this),s=i.u(this.options);i.p(r),this.T(s),this._$AH=i}}_$AC(e){let r=Bo.get(e.strings);return r===void 0&&Bo.set(e.strings,r=new Ee(e)),r}k(e){lo(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,n=0;for(const i of e)n===r.length?r.push(o=new Re(this.O(ke()),this.O(ke()),this,this.options)):o=r[n],o._$AI(i),n++;n<r.length&&(this._$AR(o&&o._$AB.nextSibling,n),r.length=n)}_$AR(e=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);e!==this._$AB;){const o=e.nextSibling;e.remove(),e=o}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class ar{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,n,i){this.type=1,this._$AH=L,this._$AN=void 0,this.element=e,this.name=r,this._$AM=n,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=L}_$AI(e,r=this,o,n){const i=this.strings;let s=!1;if(i===void 0)e=ae(this,e,r,0),s=!Se(e)||e!==this._$AH&&e!==J,s&&(this._$AH=e);else{const a=e;let l,c;for(e=i[0],l=0;l<i.length-1;l++)c=ae(this,a[o+l],r,l),c===J&&(c=this._$AH[l]),s||=!Se(c)||c!==this._$AH[l],c===L?e=L:e!==L&&(e+=(c??"")+i[l+1]),this._$AH[l]=c}s&&!n&&this.j(e)}j(e){e===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ds extends ar{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===L?void 0:e}}class js extends ar{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==L)}}class Bs extends ar{constructor(e,r,o,n,i){super(e,r,o,n,i),this.type=5}_$AI(e,r=this){if((e=ae(this,e,r,0)??L)===J)return;const o=this._$AH,n=e===L&&o!==L||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==L&&(o===L||n);n&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Us{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ae(this,e)}}const Fs=ao.litHtmlPolyfillSupport;Fs?.(Ee,Re),(ao.litHtmlVersions??=[]).push("3.3.1");const Xn=(t,e,r)=>{const o=r?.renderBefore??e;let n=o._$litPart$;if(n===void 0){const i=r?.renderBefore??null;o._$litPart$=n=new Re(e.insertBefore(ke(),i),i,void 0,r??{})}return n._$AI(t),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const co=globalThis;let oe=class extends Qt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Xn(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}};oe._$litElement$=!0,oe.finalized=!0,co.litElementHydrateSupport?.({LitElement:oe});const Ns=co.litElementPolyfillSupport;Ns?.({LitElement:oe});(co.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Te=t=>(e,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vs={attribute:!0,type:String,converter:se,reflect:!1,hasChanged:so},Hs=(t=Vs,e,r)=>{const{kind:o,metadata:n}=r;let i=globalThis.litPropertyMetadata.get(n);if(i===void 0&&globalThis.litPropertyMetadata.set(n,i=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),o==="accessor"){const{name:s}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(s,l,t)},init(a){return a!==void 0&&this.C(s,void 0,t,a),a}}}if(o==="setter"){const{name:s}=r;return function(a){const l=this[s];e.call(this,a),this.requestUpdate(s,l,t)}}throw Error("Unsupported decorator location: "+o)};function f(t){return(e,r)=>typeof r=="object"?Hs(t,e,r):((o,n,i)=>{const s=n.hasOwnProperty(i);return n.constructor.createProperty(i,o),s?Object.getOwnPropertyDescriptor(n,i):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Kt(t){return f({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ws=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function tt(t,e){return(r,o,n)=>{const i=s=>s.renderRoot?.querySelector(t)??null;return Ws(r,o,{get(){return i(this)}})}}var Ve,W=class extends oe{constructor(){super(),ws(this,Ve,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){const r=new CustomEvent(t,qt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(r),r}static define(t,e=this,r={}){const o=customElements.get(t);if(!o){try{customElements.define(t,e,r)}catch{customElements.define(t,class extends e{},r)}return}let n=" (unknown version)",i=n;"version"in e&&e.version&&(n=" v"+e.version),"version"in o&&o.version&&(i=" v"+o.version),!(n&&i&&n===i)&&console.warn(`Attempted to register <${t}>${n}, but <${t}>${i} has already been registered.`)}attributeChangedCallback(t,e,r){ys(this,Ve)||(this.constructor.elementProperties.forEach((o,n)=>{o.reflect&&this[n]!=null&&this.initialReflectedProperties.set(n,this[n])}),_s(this,Ve,!0)),super.attributeChangedCallback(t,e,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,r)=>{t.has(r)&&this[r]==null&&(this[r]=e)})}};Ve=new WeakMap;W.version="2.20.1";W.dependencies={};p([f()],W.prototype,"dir",2);p([f()],W.prototype,"lang",2);var X=class extends W{constructor(){super(...arguments),this.localize=new Wt(this),this.date=new Date,this.hourFormat="auto"}render(){const t=new Date(this.date),e=this.hourFormat==="auto"?void 0:this.hourFormat==="12";if(!isNaN(t.getMilliseconds()))return C`
      <time datetime=${t.toISOString()}>
        ${this.localize.date(t,{weekday:this.weekday,era:this.era,year:this.year,month:this.month,day:this.day,hour:this.hour,minute:this.minute,second:this.second,timeZoneName:this.timeZoneName,timeZone:this.timeZone,hour12:e})}
      </time>
    `}};p([f()],X.prototype,"date",2);p([f()],X.prototype,"weekday",2);p([f()],X.prototype,"era",2);p([f()],X.prototype,"year",2);p([f()],X.prototype,"month",2);p([f()],X.prototype,"day",2);p([f()],X.prototype,"hour",2);p([f()],X.prototype,"minute",2);p([f()],X.prototype,"second",2);p([f({attribute:"time-zone-name"})],X.prototype,"timeZoneName",2);p([f({attribute:"time-zone"})],X.prototype,"timeZone",2);p([f({attribute:"hour-format"})],X.prototype,"hourFormat",2);X.define("sl-format-date");var qs=Q`
  :host {
    --border-color: var(--sl-color-neutral-200);
    --border-radius: var(--sl-border-radius-medium);
    --border-width: 1px;
    --padding: var(--sl-spacing-large);

    display: inline-block;
  }

  .card {
    display: flex;
    flex-direction: column;
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-x-small);
    border: solid var(--border-width) var(--border-color);
    border-radius: var(--border-radius);
  }

  .card__image {
    display: flex;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    margin: calc(-1 * var(--border-width));
    overflow: hidden;
  }

  .card__image::slotted(img) {
    display: block;
    width: 100%;
  }

  .card:not(.card--has-image) .card__image {
    display: none;
  }

  .card__header {
    display: block;
    border-bottom: solid var(--border-width) var(--border-color);
    padding: calc(var(--padding) / 2) var(--padding);
  }

  .card:not(.card--has-header) .card__header {
    display: none;
  }

  .card:not(.card--has-image) .card__header {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .card__body {
    display: block;
    padding: var(--padding);
  }

  .card--has-footer .card__footer {
    display: block;
    border-top: solid var(--border-width) var(--border-color);
    padding: var(--padding);
  }

  .card:not(.card--has-footer) .card__footer {
    display: none;
  }
`,uo=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=r=>{const o=r.target;(this.slotNames.includes("[default]")&&!o.name||o.name&&this.slotNames.includes(o.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}},ht=Q`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},ho=t=>(...e)=>({_$litDirective$:t,values:e});let po=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ct=ho(class extends po{constructor(t){if(super(t),t.type!==xt.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((o=>o!==""))));for(const o in e)e[o]&&!this.nt?.has(o)&&this.st.add(o);return this.render(e)}const r=t.element.classList;for(const o of this.st)o in e||(r.remove(o),this.st.delete(o));for(const o in e){const n=!!e[o];n===this.st.has(o)||this.nt?.has(o)||(n?(r.add(o),this.st.add(o)):(r.remove(o),this.st.delete(o)))}return J}});var Gn=class extends W{constructor(){super(...arguments),this.hasSlotController=new uo(this,"footer","header","image")}render(){return C`
      <div
        part="base"
        class=${ct({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `}};Gn.styles=[ht,qs];Gn.define("sl-card");var Ks=Q`
  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--sl-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
    flex: none;
  }

  .spinner {
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 50% 50%;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.05em, 3em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.05em, 3em;
    }
  }
`,Jn=class extends W{constructor(){super(...arguments),this.localize=new Wt(this)}render(){return C`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};Jn.styles=[ht,Ks];var ye=new WeakMap,we=new WeakMap,_e=new WeakMap,yr=new WeakSet,De=new WeakMap,Qn=class{constructor(t,e){this.handleFormData=r=>{const o=this.options.disabled(this.host),n=this.options.name(this.host),i=this.options.value(this.host),s=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!o&&!s&&typeof n=="string"&&n.length>0&&typeof i<"u"&&(Array.isArray(i)?i.forEach(a=>{r.formData.append(n,a.toString())}):r.formData.append(n,i.toString()))},this.handleFormSubmit=r=>{var o;const n=this.options.disabled(this.host),i=this.options.reportValidity;this.form&&!this.form.noValidate&&((o=ye.get(this.form))==null||o.forEach(s=>{this.setUserInteracted(s,!0)})),this.form&&!this.form.noValidate&&!n&&!i(this.host)&&(r.preventDefault(),r.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),De.set(this.host,[])},this.handleInteraction=r=>{const o=De.get(this.host);o.includes(r.type)||o.push(r.type),o.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.checkValidity=="function"&&!o.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.reportValidity=="function"&&!o.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=qt({form:r=>{const o=r.form;if(o){const i=r.getRootNode().querySelector(`#${o}`);if(i)return i}return r.closest("form")},name:r=>r.name,value:r=>r.value,defaultValue:r=>r.defaultValue,disabled:r=>{var o;return(o=r.disabled)!=null?o:!1},reportValidity:r=>typeof r.reportValidity=="function"?r.reportValidity():!0,checkValidity:r=>typeof r.checkValidity=="function"?r.checkValidity():!0,setValue:(r,o)=>r.value=o,assumeInteractionOn:["sl-input"]},e)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),De.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),De.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,ye.has(this.form)?ye.get(this.form).add(this.host):ye.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),we.has(this.form)||(we.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),_e.has(this.form)||(_e.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const t=ye.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),we.has(this.form)&&(this.form.reportValidity=we.get(this.form),we.delete(this.form)),_e.has(this.form)&&(this.form.checkValidity=_e.get(this.form),_e.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?yr.add(t):yr.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const r=document.createElement("button");r.type=t,r.style.position="absolute",r.style.width="0",r.style.height="0",r.style.clipPath="inset(50%)",r.style.overflow="hidden",r.style.whiteSpace="nowrap",e&&(r.name=e.name,r.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(o=>{e.hasAttribute(o)&&r.setAttribute(o,e.getAttribute(o))})),this.form.append(r),r.click(),r.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,r=!!yr.has(e),o=!!e.required;e.toggleAttribute("data-required",o),e.toggleAttribute("data-optional",!o),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&r),e.toggleAttribute("data-user-valid",t&&r)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},fo=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(ir(qt({},fo),{valid:!1,valueMissing:!0}));Object.freeze(ir(qt({},fo),{valid:!1,customError:!0}));var Ys=Q`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--sl-input-border-width);
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--sl-transition-x-fast) background-color,
      var(--sl-transition-x-fast) color,
      var(--sl-transition-x-fast) border,
      var(--sl-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label {
    display: inline-block;
  }

  .button__label::slotted(sl-icon) {
    vertical-align: -2px;
  }

  /*
   * Standard buttons
   */

  /* Default */
  .button--standard.button--default {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-300);
    color: var(--sl-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-100);
    border-color: var(--sl-color-primary-400);
    color: var(--sl-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--sl-color-success-500);
    border-color: var(--sl-color-success-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--sl-color-neutral-500);
    border-color: var(--sl-color-neutral-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--sl-color-warning-500);
    border-color: var(--sl-color-warning-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--sl-color-danger-500);
    border-color: var(--sl-color-danger-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid 1px;
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--sl-color-success-700);
    background-color: var(--sl-color-success-700);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--outline.button--neutral {
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled),
  .button--outline.button--neutral.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--sl-color-neutral-700);
    background-color: var(--sl-color-neutral-700);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--sl-color-warning-700);
    background-color: var(--sl-color-warning-700);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--sl-color-danger-700);
    background-color: var(--sl-color-danger-700);
    color: var(--sl-color-neutral-0);
  }

  @media (forced-colors: active) {
    .button.button--outline.button--checked:not(.button--disabled) {
      outline: solid 2px transparent;
    }
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-700);
  }

  /*
   * Size modifiers
   */

  .button--small {
    height: auto;
    min-height: var(--sl-input-height-small);
    font-size: var(--sl-button-font-size-small);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
  }

  .button--medium {
    height: auto;
    min-height: var(--sl-input-height-medium);
    font-size: var(--sl-button-font-size-medium);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--sl-input-height-large);
    font-size: var(--sl-button-font-size-large);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
  }

  /*
   * Pill modifier
   */

  .button--pill.button--small {
    border-radius: var(--sl-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Circle modifier
   */

  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--sl-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--sl-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--sl-input-height-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /*
   * Caret modifier
   */

  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    height: auto;
  }

  /*
   * Loading modifier
   */

  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading sl-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /*
   * Badges
   */

  .button ::slotted(sl-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .button--rtl ::slotted(sl-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /*
   * Button spacing
   */

  .button--has-label.button--small .button__label {
    padding: 0 var(--sl-spacing-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--sl-spacing-medium);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--sl-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host([data-sl-button-group__button--first]:not([data-sl-button-group__button--last])) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-sl-button-group__button--inner]) .button {
    border-radius: 0;
  }

  :host([data-sl-button-group__button--last]:not([data-sl-button-group__button--first])) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-sl-button-group__button]:not([data-sl-button-group__button--first])) {
    margin-inline-start: calc(-1 * var(--sl-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      [data-sl-button-group__button]:not(
          [data-sl-button-group__button--first],
          [data-sl-button-group__button--radio],
          [variant='default']
        ):not(:hover)
    )
    .button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-sl-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-sl-button-group__button--focus]),
  :host([data-sl-button-group__button][checked]) {
    z-index: 2;
  }
`,Pr="";function Uo(t){Pr=t}function Zs(t=""){if(!Pr){const e=[...document.getElementsByTagName("script")],r=e.find(o=>o.hasAttribute("data-shoelace"));if(r)Uo(r.getAttribute("data-shoelace"));else{const o=e.find(i=>/shoelace(\.min)?\.js($|\?)/.test(i.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(i.src));let n="";o&&(n=o.getAttribute("src")),Uo(n.split("/").slice(0,-1).join("/"))}}return Pr.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Xs={name:"default",resolver:t=>Zs(`assets/icons/${t}.svg`)},Gs=Xs,Fo={caret:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,check:`
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"chevron-down":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,"chevron-left":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,"chevron-right":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,copy:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
    </svg>
  `,eye:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,"eye-slash":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,eyedropper:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,"grip-vertical":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,indeterminate:`
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"person-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,"play-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,"pause-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,radio:`
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,"star-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,"x-lg":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,"x-circle-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `},Js={name:"system",resolver:t=>t in Fo?`data:image/svg+xml,${encodeURIComponent(Fo[t])}`:""},Qs=Js,ta=[Gs,Qs],Rr=[];function ea(t){Rr.push(t)}function ra(t){Rr=Rr.filter(e=>e!==t)}function No(t){return ta.find(e=>e.name===t)}var oa=Q`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;function Pt(t,e){const r=qt({waitUntilFirstUpdate:!1},e);return(o,n)=>{const{update:i}=o,s=Array.isArray(t)?t:[t];o.update=function(a){s.forEach(l=>{const c=l;if(a.has(c)){const u=a.get(c),d=this[c];u!==d&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[n](u,d)}}),i.call(this,a)}}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const na=(t,e)=>t?._$litType$!==void 0,ia=t=>t.strings===void 0,sa={},aa=(t,e=sa)=>t._$AH=e;var xe=Symbol(),je=Symbol(),wr,_r=new Map,it=class extends W{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var r;let o;if(e?.spriteSheet)return this.svg=C`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(o=await fetch(t,{mode:"cors"}),!o.ok)return o.status===410?xe:je}catch{return je}try{const n=document.createElement("div");n.innerHTML=await o.text();const i=n.firstElementChild;if(((r=i?.tagName)==null?void 0:r.toLowerCase())!=="svg")return xe;wr||(wr=new DOMParser);const a=wr.parseFromString(i.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):xe}catch{return xe}}connectedCallback(){super.connectedCallback(),ea(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),ra(this)}getIconSource(){const t=No(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const{url:e,fromLibrary:r}=this.getIconSource(),o=r?No(this.library):void 0;if(!e){this.svg=null;return}let n=_r.get(e);if(n||(n=this.resolveIcon(e,o),_r.set(e,n)),!this.initialRender)return;const i=await n;if(i===je&&_r.delete(e),e===this.getIconSource().url){if(na(i)){if(this.svg=i,o){await this.updateComplete;const s=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&s&&o.mutator(s)}return}switch(i){case je:case xe:this.svg=null,this.emit("sl-error");break;default:this.svg=i.cloneNode(!0),(t=o?.mutator)==null||t.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};it.styles=[ht,oa];p([Kt()],it.prototype,"svg",2);p([f({reflect:!0})],it.prototype,"name",2);p([f()],it.prototype,"src",2);p([f()],it.prototype,"label",2);p([f({reflect:!0})],it.prototype,"library",2);p([Pt("label")],it.prototype,"handleLabelChange",1);p([Pt(["name","src","library"])],it.prototype,"setIcon",1);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ti=Symbol.for(""),la=t=>{if(t?.r===ti)return t?._$litStatic$},Ye=(t,...e)=>({_$litStatic$:e.reduce(((r,o,n)=>r+(i=>{if(i._$litStatic$!==void 0)return i._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${i}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[n+1]),t[0]),r:ti}),Vo=new Map,ca=t=>(e,...r)=>{const o=r.length;let n,i;const s=[],a=[];let l,c=0,u=!1;for(;c<o;){for(l=e[c];c<o&&(i=r[c],(n=la(i))!==void 0);)l+=n+e[++c],u=!0;c!==o&&a.push(i),s.push(l),c++}if(c===o&&s.push(e[o]),u){const d=s.join("$$lit$$");(e=Vo.get(d))===void 0&&(s.raw=s,Vo.set(d,e=s)),r=a}return t(e,...r)},He=ca(C);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const M=t=>t??L;var A=class extends W{constructor(){super(...arguments),this.formControlController=new Qn(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new uo(this,"[default]","prefix","suffix"),this.localize=new Wt(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:fo}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){const t=this.isLink(),e=t?Ye`a`:Ye`button`;return He`
      <${e}
        part="base"
        class=${ct({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${M(t?void 0:this.disabled)}
        type=${M(t?void 0:this.type)}
        title=${this.title}
        name=${M(t?void 0:this.name)}
        value=${M(t?void 0:this.value)}
        href=${M(t&&!this.disabled?this.href:void 0)}
        target=${M(t?this.target:void 0)}
        download=${M(t?this.download:void 0)}
        rel=${M(t?this.rel:void 0)}
        role=${M(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton()?this.handleInvalid:null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret?He` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?He`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${e}>
    `}};A.styles=[ht,Ys];A.dependencies={"sl-icon":it,"sl-spinner":Jn};p([tt(".button")],A.prototype,"button",2);p([Kt()],A.prototype,"hasFocus",2);p([Kt()],A.prototype,"invalid",2);p([f()],A.prototype,"title",2);p([f({reflect:!0})],A.prototype,"variant",2);p([f({reflect:!0})],A.prototype,"size",2);p([f({type:Boolean,reflect:!0})],A.prototype,"caret",2);p([f({type:Boolean,reflect:!0})],A.prototype,"disabled",2);p([f({type:Boolean,reflect:!0})],A.prototype,"loading",2);p([f({type:Boolean,reflect:!0})],A.prototype,"outline",2);p([f({type:Boolean,reflect:!0})],A.prototype,"pill",2);p([f({type:Boolean,reflect:!0})],A.prototype,"circle",2);p([f()],A.prototype,"type",2);p([f()],A.prototype,"name",2);p([f()],A.prototype,"value",2);p([f()],A.prototype,"href",2);p([f()],A.prototype,"target",2);p([f()],A.prototype,"rel",2);p([f()],A.prototype,"download",2);p([f()],A.prototype,"form",2);p([f({attribute:"formaction"})],A.prototype,"formAction",2);p([f({attribute:"formenctype"})],A.prototype,"formEnctype",2);p([f({attribute:"formmethod"})],A.prototype,"formMethod",2);p([f({attribute:"formnovalidate",type:Boolean})],A.prototype,"formNoValidate",2);p([f({attribute:"formtarget"})],A.prototype,"formTarget",2);p([Pt("disabled",{waitUntilFirstUpdate:!0})],A.prototype,"handleDisabledChange",1);A.define("sl-button");var ua=Q`
  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Variant modifiers
   */

  .tag--primary {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-200);
    color: var(--sl-color-primary-800);
  }

  .tag--primary:active > sl-icon-button {
    color: var(--sl-color-primary-600);
  }

  .tag--success {
    background-color: var(--sl-color-success-50);
    border-color: var(--sl-color-success-200);
    color: var(--sl-color-success-800);
  }

  .tag--success:active > sl-icon-button {
    color: var(--sl-color-success-600);
  }

  .tag--neutral {
    background-color: var(--sl-color-neutral-50);
    border-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-800);
  }

  .tag--neutral:active > sl-icon-button {
    color: var(--sl-color-neutral-600);
  }

  .tag--warning {
    background-color: var(--sl-color-warning-50);
    border-color: var(--sl-color-warning-200);
    color: var(--sl-color-warning-800);
  }

  .tag--warning:active > sl-icon-button {
    color: var(--sl-color-warning-600);
  }

  .tag--danger {
    background-color: var(--sl-color-danger-50);
    border-color: var(--sl-color-danger-200);
    color: var(--sl-color-danger-800);
  }

  .tag--danger:active > sl-icon-button {
    color: var(--sl-color-danger-600);
  }

  /*
   * Size modifiers
   */

  .tag--small {
    font-size: var(--sl-button-font-size-small);
    height: calc(var(--sl-input-height-small) * 0.8);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
    padding: 0 var(--sl-spacing-x-small);
  }

  .tag--medium {
    font-size: var(--sl-button-font-size-medium);
    height: calc(var(--sl-input-height-medium) * 0.8);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
    padding: 0 var(--sl-spacing-small);
  }

  .tag--large {
    font-size: var(--sl-button-font-size-large);
    height: calc(var(--sl-input-height-large) * 0.8);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
    padding: 0 var(--sl-spacing-medium);
  }

  .tag__remove {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--sl-border-radius-pill);
  }
`,ha=Q`
  :host {
    display: inline-block;
    color: var(--sl-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-x-fast) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus-visible:not(.icon-button--disabled) {
    color: var(--sl-color-primary-600);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--sl-color-primary-700);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }
`,G=class extends W{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?Ye`a`:Ye`button`;return He`
      <${e}
        part="base"
        class=${ct({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${M(t?void 0:this.disabled)}
        type=${M(t?void 0:"button")}
        href=${M(t?this.href:void 0)}
        target=${M(t?this.target:void 0)}
        download=${M(t?this.download:void 0)}
        rel=${M(t&&this.target?"noreferrer noopener":void 0)}
        role=${M(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${M(this.name)}
          library=${M(this.library)}
          src=${M(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};G.styles=[ht,ha];G.dependencies={"sl-icon":it};p([tt(".icon-button")],G.prototype,"button",2);p([Kt()],G.prototype,"hasFocus",2);p([f()],G.prototype,"name",2);p([f()],G.prototype,"library",2);p([f()],G.prototype,"src",2);p([f()],G.prototype,"href",2);p([f()],G.prototype,"target",2);p([f()],G.prototype,"download",2);p([f()],G.prototype,"label",2);p([f({type:Boolean,reflect:!0})],G.prototype,"disabled",2);var Yt=class extends W{constructor(){super(...arguments),this.localize=new Wt(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return C`
      <span
        part="base"
        class=${ct({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?C`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            `:""}
      </span>
    `}};Yt.styles=[ht,ua];Yt.dependencies={"sl-icon-button":G};p([f({reflect:!0})],Yt.prototype,"variant",2);p([f({reflect:!0})],Yt.prototype,"size",2);p([f({type:Boolean,reflect:!0})],Yt.prototype,"pill",2);p([f({type:Boolean})],Yt.prototype,"removable",2);Yt.define("sl-tag");var da=Q`
  :host {
    display: inline-block;
  }

  :host([size='small']) {
    --height: var(--sl-toggle-size-small);
    --thumb-size: calc(var(--sl-toggle-size-small) + 4px);
    --width: calc(var(--height) * 2);

    font-size: var(--sl-input-font-size-small);
  }

  :host([size='medium']) {
    --height: var(--sl-toggle-size-medium);
    --thumb-size: calc(var(--sl-toggle-size-medium) + 4px);
    --width: calc(var(--height) * 2);

    font-size: var(--sl-input-font-size-medium);
  }

  :host([size='large']) {
    --height: var(--sl-toggle-size-large);
    --thumb-size: calc(var(--sl-toggle-size-large) + 4px);
    --width: calc(var(--height) * 2);

    font-size: var(--sl-input-font-size-large);
  }

  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-input-font-family);
    font-size: inherit;
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .switch__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--sl-color-neutral-400);
    border: solid var(--sl-input-border-width) var(--sl-color-neutral-400);
    border-radius: var(--height);
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color;
  }

  .switch__control .switch__thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--sl-color-neutral-0);
    border-radius: 50%;
    border: solid var(--sl-input-border-width) var(--sl-color-neutral-400);
    translate: calc((var(--width) - var(--height)) / -2);
    transition:
      var(--sl-transition-fast) translate ease,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) box-shadow;
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover {
    background-color: var(--sl-color-neutral-400);
    border-color: var(--sl-color-neutral-400);
  }

  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-neutral-400);
  }

  /* Focus */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sl-color-neutral-400);
    border-color: var(--sl-color-neutral-400);
  }

  .switch:not(.switch--checked):not(.switch--disabled) .switch__input:focus-visible ~ .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked */
  .switch--checked .switch__control {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch--checked .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    translate: calc((var(--width) - var(--height)) / 2);
  }

  /* Checked + hover */
  .switch.switch--checked:not(.switch--disabled) .switch__control:hover {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
  }

  /* Checked + focus */
  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .switch--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .switch__label {
    display: inline-block;
    line-height: var(--height);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) .switch__label::after {
    content: var(--sl-input-required-content);
    color: var(--sl-input-required-content-color);
    margin-inline-start: var(--sl-input-required-content-offset);
  }

  @media (forced-colors: active) {
    .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb,
    .switch--checked .switch__control .switch__thumb {
      background-color: ButtonText;
    }
  }
`,pa=(t="value")=>(e,r)=>{const o=e.constructor,n=o.prototype.attributeChangedCallback;o.prototype.attributeChangedCallback=function(i,s,a){var l;const c=o.getPropertyOptions(t),u=typeof c.attribute=="string"?c.attribute:t;if(i===u){const d=c.converter||se,h=(typeof d=="function"?d:(l=d?.fromAttribute)!=null?l:se.fromAttribute)(a,c.type);this[t]!==h&&(this[r]=h)}n.call(this,i,s,a)}},fa=Q`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ma=ho(class extends po{constructor(t){if(super(t),t.type!==xt.PROPERTY&&t.type!==xt.ATTRIBUTE&&t.type!==xt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!ia(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===J||e===L)return e;const r=t.element,o=t.name;if(t.type===xt.PROPERTY){if(e===r[o])return J}else if(t.type===xt.BOOLEAN_ATTRIBUTE){if(!!e===r.hasAttribute(o))return J}else if(t.type===xt.ATTRIBUTE&&r.getAttribute(o)===e+"")return J;return aa(t),e}});var N=class extends W{constructor(){super(...arguments),this.formControlController=new Qn(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new uo(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleClick(){this.checked=!this.checked,this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleKeyDown(t){t.key==="ArrowLeft"&&(t.preventDefault(),this.checked=!1,this.emit("sl-change"),this.emit("sl-input")),t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!0,this.emit("sl-change"),this.emit("sl-input"))}handleCheckedChange(){this.input.checked=this.checked,this.formControlController.updateValidity()}handleDisabledChange(){this.formControlController.setValidity(!0)}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){const t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return C`
      <div
        class=${ct({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-help-text":e})}
      >
        <label
          part="base"
          class=${ct({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus,"switch--small":this.size==="small","switch--medium":this.size==="medium","switch--large":this.size==="large"})}
        >
          <input
            class="switch__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${M(this.value)}
            .checked=${ma(this.checked)}
            .disabled=${this.disabled}
            .required=${this.required}
            role="switch"
            aria-checked=${this.checked?"true":"false"}
            aria-describedby="help-text"
            @click=${this.handleClick}
            @input=${this.handleInput}
            @invalid=${this.handleInvalid}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
            @keydown=${this.handleKeyDown}
          />

          <span part="control" class="switch__control">
            <span part="thumb" class="switch__thumb"></span>
          </span>

          <div part="label" class="switch__label">
            <slot></slot>
          </div>
        </label>

        <div
          aria-hidden=${e?"false":"true"}
          class="form-control__help-text"
          id="help-text"
          part="form-control-help-text"
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};N.styles=[ht,fa,da];p([tt('input[type="checkbox"]')],N.prototype,"input",2);p([Kt()],N.prototype,"hasFocus",2);p([f()],N.prototype,"title",2);p([f()],N.prototype,"name",2);p([f()],N.prototype,"value",2);p([f({reflect:!0})],N.prototype,"size",2);p([f({type:Boolean,reflect:!0})],N.prototype,"disabled",2);p([f({type:Boolean,reflect:!0})],N.prototype,"checked",2);p([pa("checked")],N.prototype,"defaultChecked",2);p([f({reflect:!0})],N.prototype,"form",2);p([f({type:Boolean,reflect:!0})],N.prototype,"required",2);p([f({attribute:"help-text"})],N.prototype,"helpText",2);p([Pt("checked",{waitUntilFirstUpdate:!0})],N.prototype,"handleCheckedChange",1);p([Pt("disabled",{waitUntilFirstUpdate:!0})],N.prototype,"handleDisabledChange",1);N.define("sl-switch");var ba=Q`
  :host {
    --max-width: 20rem;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--sl-tooltip-arrow-size);
    --arrow-color: var(--sl-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: var(--sl-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--sl-tooltip-color);
    padding: var(--sl-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
`,va=Q`
  :host {
    --arrow-color: var(--sl-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`;const St=Math.min,Y=Math.max,Ze=Math.round,Be=Math.floor,lt=t=>({x:t,y:t}),ga={left:"right",right:"left",bottom:"top",top:"bottom"},ya={start:"end",end:"start"};function Tr(t,e,r){return Y(t,St(e,r))}function pe(t,e){return typeof t=="function"?t(e):t}function Et(t){return t.split("-")[0]}function fe(t){return t.split("-")[1]}function ei(t){return t==="x"?"y":"x"}function mo(t){return t==="y"?"height":"width"}const wa=new Set(["top","bottom"]);function mt(t){return wa.has(Et(t))?"y":"x"}function bo(t){return ei(mt(t))}function _a(t,e,r){r===void 0&&(r=!1);const o=fe(t),n=bo(t),i=mo(n);let s=n==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[i]>e.floating[i]&&(s=Xe(s)),[s,Xe(s)]}function xa(t){const e=Xe(t);return[zr(t),e,zr(e)]}function zr(t){return t.replace(/start|end/g,e=>ya[e])}const Ho=["left","right"],Wo=["right","left"],$a=["top","bottom"],ka=["bottom","top"];function Sa(t,e,r){switch(t){case"top":case"bottom":return r?e?Wo:Ho:e?Ho:Wo;case"left":case"right":return e?$a:ka;default:return[]}}function Ea(t,e,r,o){const n=fe(t);let i=Sa(Et(t),r==="start",o);return n&&(i=i.map(s=>s+"-"+n),e&&(i=i.concat(i.map(zr)))),i}function Xe(t){return t.replace(/left|right|bottom|top/g,e=>ga[e])}function Ca(t){return{top:0,right:0,bottom:0,left:0,...t}}function ri(t){return typeof t!="number"?Ca(t):{top:t,right:t,bottom:t,left:t}}function Ge(t){const{x:e,y:r,width:o,height:n}=t;return{width:o,height:n,top:r,left:e,right:e+o,bottom:r+n,x:e,y:r}}function qo(t,e,r){let{reference:o,floating:n}=t;const i=mt(e),s=bo(e),a=mo(s),l=Et(e),c=i==="y",u=o.x+o.width/2-n.width/2,d=o.y+o.height/2-n.height/2,m=o[a]/2-n[a]/2;let h;switch(l){case"top":h={x:u,y:o.y-n.height};break;case"bottom":h={x:u,y:o.y+o.height};break;case"right":h={x:o.x+o.width,y:d};break;case"left":h={x:o.x-n.width,y:d};break;default:h={x:o.x,y:o.y}}switch(fe(e)){case"start":h[s]-=m*(r&&c?-1:1);break;case"end":h[s]+=m*(r&&c?-1:1);break}return h}const Aa=async(t,e,r)=>{const{placement:o="bottom",strategy:n="absolute",middleware:i=[],platform:s}=r,a=i.filter(Boolean),l=await(s.isRTL==null?void 0:s.isRTL(e));let c=await s.getElementRects({reference:t,floating:e,strategy:n}),{x:u,y:d}=qo(c,o,l),m=o,h={},b=0;for(let v=0;v<a.length;v++){const{name:x,fn:y}=a[v],{x:w,y:$,data:S,reset:E}=await y({x:u,y:d,initialPlacement:o,placement:m,strategy:n,middlewareData:h,rects:c,platform:s,elements:{reference:t,floating:e}});u=w??u,d=$??d,h={...h,[x]:{...h[x],...S}},E&&b<=50&&(b++,typeof E=="object"&&(E.placement&&(m=E.placement),E.rects&&(c=E.rects===!0?await s.getElementRects({reference:t,floating:e,strategy:n}):E.rects),{x:u,y:d}=qo(c,m,l)),v=-1)}return{x:u,y:d,placement:m,strategy:n,middlewareData:h}};async function vo(t,e){var r;e===void 0&&(e={});const{x:o,y:n,platform:i,rects:s,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:m=!1,padding:h=0}=pe(e,t),b=ri(h),x=a[m?d==="floating"?"reference":"floating":d],y=Ge(await i.getClippingRect({element:(r=await(i.isElement==null?void 0:i.isElement(x)))==null||r?x:x.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(a.floating)),boundary:c,rootBoundary:u,strategy:l})),w=d==="floating"?{x:o,y:n,width:s.floating.width,height:s.floating.height}:s.reference,$=await(i.getOffsetParent==null?void 0:i.getOffsetParent(a.floating)),S=await(i.isElement==null?void 0:i.isElement($))?await(i.getScale==null?void 0:i.getScale($))||{x:1,y:1}:{x:1,y:1},E=Ge(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:w,offsetParent:$,strategy:l}):w);return{top:(y.top-E.top+b.top)/S.y,bottom:(E.bottom-y.bottom+b.bottom)/S.y,left:(y.left-E.left+b.left)/S.x,right:(E.right-y.right+b.right)/S.x}}const Oa=t=>({name:"arrow",options:t,async fn(e){const{x:r,y:o,placement:n,rects:i,platform:s,elements:a,middlewareData:l}=e,{element:c,padding:u=0}=pe(t,e)||{};if(c==null)return{};const d=ri(u),m={x:r,y:o},h=bo(n),b=mo(h),v=await s.getDimensions(c),x=h==="y",y=x?"top":"left",w=x?"bottom":"right",$=x?"clientHeight":"clientWidth",S=i.reference[b]+i.reference[h]-m[h]-i.floating[b],E=m[h]-i.reference[h],R=await(s.getOffsetParent==null?void 0:s.getOffsetParent(c));let O=R?R[$]:0;(!O||!await(s.isElement==null?void 0:s.isElement(R)))&&(O=a.floating[$]||i.floating[b]);const T=S/2-E/2,U=O/2-v[b]/2-1,I=St(d[y],U),vt=St(d[w],U),st=I,gt=O-v[b]-vt,V=O/2-v[b]/2+T,It=Tr(st,V,gt),ft=!l.arrow&&fe(n)!=null&&V!==It&&i.reference[b]/2-(V<st?I:vt)-v[b]/2<0,et=ft?V<st?V-st:V-gt:0;return{[h]:m[h]+et,data:{[h]:It,centerOffset:V-It-et,...ft&&{alignmentOffset:et}},reset:ft}}}),Pa=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var r,o;const{placement:n,middlewareData:i,rects:s,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:u=!0,crossAxis:d=!0,fallbackPlacements:m,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:b="none",flipAlignment:v=!0,...x}=pe(t,e);if((r=i.arrow)!=null&&r.alignmentOffset)return{};const y=Et(n),w=mt(a),$=Et(a)===a,S=await(l.isRTL==null?void 0:l.isRTL(c.floating)),E=m||($||!v?[Xe(a)]:xa(a)),R=b!=="none";!m&&R&&E.push(...Ea(a,v,b,S));const O=[a,...E],T=await vo(e,x),U=[];let I=((o=i.flip)==null?void 0:o.overflows)||[];if(u&&U.push(T[y]),d){const V=_a(n,s,S);U.push(T[V[0]],T[V[1]])}if(I=[...I,{placement:n,overflows:U}],!U.every(V=>V<=0)){var vt,st;const V=(((vt=i.flip)==null?void 0:vt.index)||0)+1,It=O[V];if(It&&(!(d==="alignment"?w!==mt(It):!1)||I.every(rt=>mt(rt.placement)===w?rt.overflows[0]>0:!0)))return{data:{index:V,overflows:I},reset:{placement:It}};let ft=(st=I.filter(et=>et.overflows[0]<=0).sort((et,rt)=>et.overflows[1]-rt.overflows[1])[0])==null?void 0:st.placement;if(!ft)switch(h){case"bestFit":{var gt;const et=(gt=I.filter(rt=>{if(R){const yt=mt(rt.placement);return yt===w||yt==="y"}return!0}).map(rt=>[rt.placement,rt.overflows.filter(yt=>yt>0).reduce((yt,ss)=>yt+ss,0)]).sort((rt,yt)=>rt[1]-yt[1])[0])==null?void 0:gt[0];et&&(ft=et);break}case"initialPlacement":ft=a;break}if(n!==ft)return{reset:{placement:ft}}}return{}}}},Ra=new Set(["left","top"]);async function Ta(t,e){const{placement:r,platform:o,elements:n}=t,i=await(o.isRTL==null?void 0:o.isRTL(n.floating)),s=Et(r),a=fe(r),l=mt(r)==="y",c=Ra.has(s)?-1:1,u=i&&l?-1:1,d=pe(e,t);let{mainAxis:m,crossAxis:h,alignmentAxis:b}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return a&&typeof b=="number"&&(h=a==="end"?b*-1:b),l?{x:h*u,y:m*c}:{x:m*c,y:h*u}}const za=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var r,o;const{x:n,y:i,placement:s,middlewareData:a}=e,l=await Ta(e,t);return s===((r=a.offset)==null?void 0:r.placement)&&(o=a.arrow)!=null&&o.alignmentOffset?{}:{x:n+l.x,y:i+l.y,data:{...l,placement:s}}}}},La=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:o,placement:n}=e,{mainAxis:i=!0,crossAxis:s=!1,limiter:a={fn:x=>{let{x:y,y:w}=x;return{x:y,y:w}}},...l}=pe(t,e),c={x:r,y:o},u=await vo(e,l),d=mt(Et(n)),m=ei(d);let h=c[m],b=c[d];if(i){const x=m==="y"?"top":"left",y=m==="y"?"bottom":"right",w=h+u[x],$=h-u[y];h=Tr(w,h,$)}if(s){const x=d==="y"?"top":"left",y=d==="y"?"bottom":"right",w=b+u[x],$=b-u[y];b=Tr(w,b,$)}const v=a.fn({...e,[m]:h,[d]:b});return{...v,data:{x:v.x-r,y:v.y-o,enabled:{[m]:i,[d]:s}}}}}},Ia=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var r,o;const{placement:n,rects:i,platform:s,elements:a}=e,{apply:l=()=>{},...c}=pe(t,e),u=await vo(e,c),d=Et(n),m=fe(n),h=mt(n)==="y",{width:b,height:v}=i.floating;let x,y;d==="top"||d==="bottom"?(x=d,y=m===(await(s.isRTL==null?void 0:s.isRTL(a.floating))?"start":"end")?"left":"right"):(y=d,x=m==="end"?"top":"bottom");const w=v-u.top-u.bottom,$=b-u.left-u.right,S=St(v-u[x],w),E=St(b-u[y],$),R=!e.middlewareData.shift;let O=S,T=E;if((r=e.middlewareData.shift)!=null&&r.enabled.x&&(T=$),(o=e.middlewareData.shift)!=null&&o.enabled.y&&(O=w),R&&!m){const I=Y(u.left,0),vt=Y(u.right,0),st=Y(u.top,0),gt=Y(u.bottom,0);h?T=b-2*(I!==0||vt!==0?I+vt:Y(u.left,u.right)):O=v-2*(st!==0||gt!==0?st+gt:Y(u.top,u.bottom))}await l({...e,availableWidth:T,availableHeight:O});const U=await s.getDimensions(a.floating);return b!==U.width||v!==U.height?{reset:{rects:!0}}:{}}}};function lr(){return typeof window<"u"}function me(t){return oi(t)?(t.nodeName||"").toLowerCase():"#document"}function Z(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function dt(t){var e;return(e=(oi(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function oi(t){return lr()?t instanceof Node||t instanceof Z(t).Node:!1}function ot(t){return lr()?t instanceof Element||t instanceof Z(t).Element:!1}function ut(t){return lr()?t instanceof HTMLElement||t instanceof Z(t).HTMLElement:!1}function Ko(t){return!lr()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof Z(t).ShadowRoot}const Ma=new Set(["inline","contents"]);function ze(t){const{overflow:e,overflowX:r,overflowY:o,display:n}=nt(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+r)&&!Ma.has(n)}const Da=new Set(["table","td","th"]);function ja(t){return Da.has(me(t))}const Ba=[":popover-open",":modal"];function cr(t){return Ba.some(e=>{try{return t.matches(e)}catch{return!1}})}const Ua=["transform","translate","scale","rotate","perspective"],Fa=["transform","translate","scale","rotate","perspective","filter"],Na=["paint","layout","strict","content"];function ur(t){const e=go(),r=ot(t)?nt(t):t;return Ua.some(o=>r[o]?r[o]!=="none":!1)||(r.containerType?r.containerType!=="normal":!1)||!e&&(r.backdropFilter?r.backdropFilter!=="none":!1)||!e&&(r.filter?r.filter!=="none":!1)||Fa.some(o=>(r.willChange||"").includes(o))||Na.some(o=>(r.contain||"").includes(o))}function Va(t){let e=Ct(t);for(;ut(e)&&!le(e);){if(ur(e))return e;if(cr(e))return null;e=Ct(e)}return null}function go(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const Ha=new Set(["html","body","#document"]);function le(t){return Ha.has(me(t))}function nt(t){return Z(t).getComputedStyle(t)}function hr(t){return ot(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Ct(t){if(me(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Ko(t)&&t.host||dt(t);return Ko(e)?e.host:e}function ni(t){const e=Ct(t);return le(e)?t.ownerDocument?t.ownerDocument.body:t.body:ut(e)&&ze(e)?e:ni(e)}function Ce(t,e,r){var o;e===void 0&&(e=[]),r===void 0&&(r=!0);const n=ni(t),i=n===((o=t.ownerDocument)==null?void 0:o.body),s=Z(n);if(i){const a=Lr(s);return e.concat(s,s.visualViewport||[],ze(n)?n:[],a&&r?Ce(a):[])}return e.concat(n,Ce(n,[],r))}function Lr(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function ii(t){const e=nt(t);let r=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const n=ut(t),i=n?t.offsetWidth:r,s=n?t.offsetHeight:o,a=Ze(r)!==i||Ze(o)!==s;return a&&(r=i,o=s),{width:r,height:o,$:a}}function yo(t){return ot(t)?t:t.contextElement}function ne(t){const e=yo(t);if(!ut(e))return lt(1);const r=e.getBoundingClientRect(),{width:o,height:n,$:i}=ii(e);let s=(i?Ze(r.width):r.width)/o,a=(i?Ze(r.height):r.height)/n;return(!s||!Number.isFinite(s))&&(s=1),(!a||!Number.isFinite(a))&&(a=1),{x:s,y:a}}const Wa=lt(0);function si(t){const e=Z(t);return!go()||!e.visualViewport?Wa:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function qa(t,e,r){return e===void 0&&(e=!1),!r||e&&r!==Z(t)?!1:e}function Vt(t,e,r,o){e===void 0&&(e=!1),r===void 0&&(r=!1);const n=t.getBoundingClientRect(),i=yo(t);let s=lt(1);e&&(o?ot(o)&&(s=ne(o)):s=ne(t));const a=qa(i,r,o)?si(i):lt(0);let l=(n.left+a.x)/s.x,c=(n.top+a.y)/s.y,u=n.width/s.x,d=n.height/s.y;if(i){const m=Z(i),h=o&&ot(o)?Z(o):o;let b=m,v=Lr(b);for(;v&&o&&h!==b;){const x=ne(v),y=v.getBoundingClientRect(),w=nt(v),$=y.left+(v.clientLeft+parseFloat(w.paddingLeft))*x.x,S=y.top+(v.clientTop+parseFloat(w.paddingTop))*x.y;l*=x.x,c*=x.y,u*=x.x,d*=x.y,l+=$,c+=S,b=Z(v),v=Lr(b)}}return Ge({width:u,height:d,x:l,y:c})}function dr(t,e){const r=hr(t).scrollLeft;return e?e.left+r:Vt(dt(t)).left+r}function ai(t,e){const r=t.getBoundingClientRect(),o=r.left+e.scrollLeft-dr(t,r),n=r.top+e.scrollTop;return{x:o,y:n}}function Ka(t){let{elements:e,rect:r,offsetParent:o,strategy:n}=t;const i=n==="fixed",s=dt(o),a=e?cr(e.floating):!1;if(o===s||a&&i)return r;let l={scrollLeft:0,scrollTop:0},c=lt(1);const u=lt(0),d=ut(o);if((d||!d&&!i)&&((me(o)!=="body"||ze(s))&&(l=hr(o)),ut(o))){const h=Vt(o);c=ne(o),u.x=h.x+o.clientLeft,u.y=h.y+o.clientTop}const m=s&&!d&&!i?ai(s,l):lt(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+u.x+m.x,y:r.y*c.y-l.scrollTop*c.y+u.y+m.y}}function Ya(t){return Array.from(t.getClientRects())}function Za(t){const e=dt(t),r=hr(t),o=t.ownerDocument.body,n=Y(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),i=Y(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let s=-r.scrollLeft+dr(t);const a=-r.scrollTop;return nt(o).direction==="rtl"&&(s+=Y(e.clientWidth,o.clientWidth)-n),{width:n,height:i,x:s,y:a}}const Yo=25;function Xa(t,e){const r=Z(t),o=dt(t),n=r.visualViewport;let i=o.clientWidth,s=o.clientHeight,a=0,l=0;if(n){i=n.width,s=n.height;const u=go();(!u||u&&e==="fixed")&&(a=n.offsetLeft,l=n.offsetTop)}const c=dr(o);if(c<=0){const u=o.ownerDocument,d=u.body,m=getComputedStyle(d),h=u.compatMode==="CSS1Compat"&&parseFloat(m.marginLeft)+parseFloat(m.marginRight)||0,b=Math.abs(o.clientWidth-d.clientWidth-h);b<=Yo&&(i-=b)}else c<=Yo&&(i+=c);return{width:i,height:s,x:a,y:l}}const Ga=new Set(["absolute","fixed"]);function Ja(t,e){const r=Vt(t,!0,e==="fixed"),o=r.top+t.clientTop,n=r.left+t.clientLeft,i=ut(t)?ne(t):lt(1),s=t.clientWidth*i.x,a=t.clientHeight*i.y,l=n*i.x,c=o*i.y;return{width:s,height:a,x:l,y:c}}function Zo(t,e,r){let o;if(e==="viewport")o=Xa(t,r);else if(e==="document")o=Za(dt(t));else if(ot(e))o=Ja(e,r);else{const n=si(t);o={x:e.x-n.x,y:e.y-n.y,width:e.width,height:e.height}}return Ge(o)}function li(t,e){const r=Ct(t);return r===e||!ot(r)||le(r)?!1:nt(r).position==="fixed"||li(r,e)}function Qa(t,e){const r=e.get(t);if(r)return r;let o=Ce(t,[],!1).filter(a=>ot(a)&&me(a)!=="body"),n=null;const i=nt(t).position==="fixed";let s=i?Ct(t):t;for(;ot(s)&&!le(s);){const a=nt(s),l=ur(s);!l&&a.position==="fixed"&&(n=null),(i?!l&&!n:!l&&a.position==="static"&&!!n&&Ga.has(n.position)||ze(s)&&!l&&li(t,s))?o=o.filter(u=>u!==s):n=a,s=Ct(s)}return e.set(t,o),o}function tl(t){let{element:e,boundary:r,rootBoundary:o,strategy:n}=t;const s=[...r==="clippingAncestors"?cr(e)?[]:Qa(e,this._c):[].concat(r),o],a=s[0],l=s.reduce((c,u)=>{const d=Zo(e,u,n);return c.top=Y(d.top,c.top),c.right=St(d.right,c.right),c.bottom=St(d.bottom,c.bottom),c.left=Y(d.left,c.left),c},Zo(e,a,n));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function el(t){const{width:e,height:r}=ii(t);return{width:e,height:r}}function rl(t,e,r){const o=ut(e),n=dt(e),i=r==="fixed",s=Vt(t,!0,i,e);let a={scrollLeft:0,scrollTop:0};const l=lt(0);function c(){l.x=dr(n)}if(o||!o&&!i)if((me(e)!=="body"||ze(n))&&(a=hr(e)),o){const h=Vt(e,!0,i,e);l.x=h.x+e.clientLeft,l.y=h.y+e.clientTop}else n&&c();i&&!o&&n&&c();const u=n&&!o&&!i?ai(n,a):lt(0),d=s.left+a.scrollLeft-l.x-u.x,m=s.top+a.scrollTop-l.y-u.y;return{x:d,y:m,width:s.width,height:s.height}}function xr(t){return nt(t).position==="static"}function Xo(t,e){if(!ut(t)||nt(t).position==="fixed")return null;if(e)return e(t);let r=t.offsetParent;return dt(t)===r&&(r=r.ownerDocument.body),r}function ci(t,e){const r=Z(t);if(cr(t))return r;if(!ut(t)){let n=Ct(t);for(;n&&!le(n);){if(ot(n)&&!xr(n))return n;n=Ct(n)}return r}let o=Xo(t,e);for(;o&&ja(o)&&xr(o);)o=Xo(o,e);return o&&le(o)&&xr(o)&&!ur(o)?r:o||Va(t)||r}const ol=async function(t){const e=this.getOffsetParent||ci,r=this.getDimensions,o=await r(t.floating);return{reference:rl(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function nl(t){return nt(t).direction==="rtl"}const We={convertOffsetParentRelativeRectToViewportRelativeRect:Ka,getDocumentElement:dt,getClippingRect:tl,getOffsetParent:ci,getElementRects:ol,getClientRects:Ya,getDimensions:el,getScale:ne,isElement:ot,isRTL:nl};function ui(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function il(t,e){let r=null,o;const n=dt(t);function i(){var a;clearTimeout(o),(a=r)==null||a.disconnect(),r=null}function s(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),i();const c=t.getBoundingClientRect(),{left:u,top:d,width:m,height:h}=c;if(a||e(),!m||!h)return;const b=Be(d),v=Be(n.clientWidth-(u+m)),x=Be(n.clientHeight-(d+h)),y=Be(u),$={rootMargin:-b+"px "+-v+"px "+-x+"px "+-y+"px",threshold:Y(0,St(1,l))||1};let S=!0;function E(R){const O=R[0].intersectionRatio;if(O!==l){if(!S)return s();O?s(!1,O):o=setTimeout(()=>{s(!1,1e-7)},1e3)}O===1&&!ui(c,t.getBoundingClientRect())&&s(),S=!1}try{r=new IntersectionObserver(E,{...$,root:n.ownerDocument})}catch{r=new IntersectionObserver(E,$)}r.observe(t)}return s(!0),i}function sl(t,e,r,o){o===void 0&&(o={});const{ancestorScroll:n=!0,ancestorResize:i=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=yo(t),u=n||i?[...c?Ce(c):[],...Ce(e)]:[];u.forEach(y=>{n&&y.addEventListener("scroll",r,{passive:!0}),i&&y.addEventListener("resize",r)});const d=c&&a?il(c,r):null;let m=-1,h=null;s&&(h=new ResizeObserver(y=>{let[w]=y;w&&w.target===c&&h&&(h.unobserve(e),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var $;($=h)==null||$.observe(e)})),r()}),c&&!l&&h.observe(c),h.observe(e));let b,v=l?Vt(t):null;l&&x();function x(){const y=Vt(t);v&&!ui(v,y)&&r(),v=y,b=requestAnimationFrame(x)}return r(),()=>{var y;u.forEach(w=>{n&&w.removeEventListener("scroll",r),i&&w.removeEventListener("resize",r)}),d?.(),(y=h)==null||y.disconnect(),h=null,l&&cancelAnimationFrame(b)}}const al=za,ll=La,cl=Pa,Go=Ia,ul=Oa,hl=(t,e,r)=>{const o=new Map,n={platform:We,...r},i={...n.platform,_c:o};return Aa(t,e,{...n,platform:i})};function dl(t){return pl(t)}function $r(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function pl(t){for(let e=t;e;e=$r(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=$r(t);e;e=$r(e)){if(!(e instanceof Element))continue;const r=getComputedStyle(e);if(r.display!=="contents"&&(r.position!=="static"||ur(r)||e.tagName==="BODY"))return e}return null}function fl(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var P=class extends W{constructor(){super(...arguments),this.localize=new Wt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,n=0,i=0,s=0,a=0,l=0,c=0,u=0;r?t.top<e.top?(o=t.left,n=t.bottom,i=t.right,s=t.bottom,a=e.left,l=e.top,c=e.right,u=e.top):(o=e.left,n=e.bottom,i=e.right,s=e.bottom,a=t.left,l=t.top,c=t.right,u=t.top):t.left<e.left?(o=t.right,n=t.top,i=e.left,s=e.top,a=t.right,l=t.bottom,c=e.left,u=e.bottom):(o=e.right,n=e.top,i=t.left,s=t.top,a=e.right,l=e.bottom,c=t.left,u=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${n}px`),this.style.setProperty("--hover-bridge-top-right-x",`${i}px`),this.style.setProperty("--hover-bridge-top-right-y",`${s}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${u}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||fl(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=sl(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[al({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Go({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",n=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=n?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(cl({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(ll({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Go({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(ul({element:this.arrowEl,padding:this.arrowPadding}));const e=this.strategy==="absolute"?r=>We.getOffsetParent(r,dl):We.getOffsetParent;hl(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:ir(qt({},We),{getOffsetParent:e})}).then(({x:r,y:o,middlewareData:n,placement:i})=>{const s=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=n.arrow.x,c=n.arrow.y;let u="",d="",m="",h="";if(this.arrowPlacement==="start"){const b=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";u=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",d=s?b:"",h=s?"":b}else if(this.arrowPlacement==="end"){const b=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=s?"":b,h=s?b:"",m=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(h=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",u=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(h=typeof l=="number"?`${l}px`:"",u=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:u,right:d,bottom:m,left:h,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return C`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${ct({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${ct({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?C`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};P.styles=[ht,va];p([tt(".popup")],P.prototype,"popup",2);p([tt(".popup__arrow")],P.prototype,"arrowEl",2);p([f()],P.prototype,"anchor",2);p([f({type:Boolean,reflect:!0})],P.prototype,"active",2);p([f({reflect:!0})],P.prototype,"placement",2);p([f({reflect:!0})],P.prototype,"strategy",2);p([f({type:Number})],P.prototype,"distance",2);p([f({type:Number})],P.prototype,"skidding",2);p([f({type:Boolean})],P.prototype,"arrow",2);p([f({attribute:"arrow-placement"})],P.prototype,"arrowPlacement",2);p([f({attribute:"arrow-padding",type:Number})],P.prototype,"arrowPadding",2);p([f({type:Boolean})],P.prototype,"flip",2);p([f({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],P.prototype,"flipFallbackPlacements",2);p([f({attribute:"flip-fallback-strategy"})],P.prototype,"flipFallbackStrategy",2);p([f({type:Object})],P.prototype,"flipBoundary",2);p([f({attribute:"flip-padding",type:Number})],P.prototype,"flipPadding",2);p([f({type:Boolean})],P.prototype,"shift",2);p([f({type:Object})],P.prototype,"shiftBoundary",2);p([f({attribute:"shift-padding",type:Number})],P.prototype,"shiftPadding",2);p([f({attribute:"auto-size"})],P.prototype,"autoSize",2);p([f()],P.prototype,"sync",2);p([f({type:Object})],P.prototype,"autoSizeBoundary",2);p([f({attribute:"auto-size-padding",type:Number})],P.prototype,"autoSizePadding",2);p([f({attribute:"hover-bridge",type:Boolean})],P.prototype,"hoverBridge",2);var hi=new Map,ml=new WeakMap;function bl(t){return t??{keyframes:[],options:{duration:0}}}function Jo(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function pr(t,e){hi.set(t,bl(e))}function Je(t,e,r){const o=ml.get(t);if(o?.[e])return Jo(o[e],r.dir);const n=hi.get(e);return n?Jo(n,r.dir):{keyframes:[],options:{duration:0}}}function Qo(t,e){return new Promise(r=>{function o(n){n.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}function tn(t,e,r){return new Promise(o=>{if(r?.duration===1/0)throw new Error("Promise-based animations must be finite.");const n=t.animate(e,ir(qt({},r),{duration:vl()?0:r.duration}));n.addEventListener("cancel",o,{once:!0}),n.addEventListener("finish",o,{once:!0})})}function en(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function vl(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function rn(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{e.cancel(),requestAnimationFrame(r)})))}var B=class extends W{constructor(){super(),this.localize=new Wt(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=en(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=en(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await rn(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=Je(this,"tooltip.show",{dir:this.localize.dir()});await tn(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await rn(this.body);const{keyframes:r,options:o}=Je(this,"tooltip.hide",{dir:this.localize.dir()});await tn(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Qo(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Qo(this,"sl-after-hide")}render(){return C`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${ct({tooltip:!0,"tooltip--open":this.open})}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
        hover-bridge
      >
        ${""}
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        ${""}
        <div part="body" id="tooltip" class="tooltip__body" role="tooltip" aria-live=${this.open?"polite":"off"}>
          <slot name="content">${this.content}</slot>
        </div>
      </sl-popup>
    `}};B.styles=[ht,ba];B.dependencies={"sl-popup":P};p([tt("slot:not([name])")],B.prototype,"defaultSlot",2);p([tt(".tooltip__body")],B.prototype,"body",2);p([tt("sl-popup")],B.prototype,"popup",2);p([f()],B.prototype,"content",2);p([f()],B.prototype,"placement",2);p([f({type:Boolean,reflect:!0})],B.prototype,"disabled",2);p([f({type:Number})],B.prototype,"distance",2);p([f({type:Boolean,reflect:!0})],B.prototype,"open",2);p([f({type:Number})],B.prototype,"skidding",2);p([f()],B.prototype,"trigger",2);p([f({type:Boolean})],B.prototype,"hoist",2);p([Pt("open",{waitUntilFirstUpdate:!0})],B.prototype,"handleOpenChange",1);p([Pt(["content","distance","hoist","placement","skidding"])],B.prototype,"handleOptionsChange",1);p([Pt("disabled")],B.prototype,"handleDisabledChange",1);pr("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}});pr("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});var gl=Q`
  :host {
    --error-color: var(--sl-color-danger-600);
    --success-color: var(--sl-color-success-600);

    display: inline-block;
  }

  .copy-button__button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-x-fast) color;
  }

  .copy-button--success .copy-button__button {
    color: var(--success-color);
  }

  .copy-button--error .copy-button__button {
    color: var(--error-color);
  }

  .copy-button__button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .copy-button__button[disabled] {
    opacity: 0.5;
    cursor: not-allowed !important;
  }

  slot {
    display: inline-flex;
  }
`,j=class extends W{constructor(){super(...arguments),this.localize=new Wt(this),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let t=this.value;if(this.from){const e=this.getRootNode(),r=this.from.includes("."),o=this.from.includes("[")&&this.from.includes("]");let n=this.from,i="";r?[n,i]=this.from.trim().split("."):o&&([n,i]=this.from.trim().replace(/\]$/,"").split("["));const s="getElementById"in e?e.getElementById(n):null;s?o?t=s.getAttribute(i)||"":r?t=s[i]||"":t=s.textContent||"":(this.showStatus("error"),this.emit("sl-error"))}if(!t)this.showStatus("error"),this.emit("sl-error");else try{await navigator.clipboard.writeText(t),this.showStatus("success"),this.emit("sl-copy",{detail:{value:t}})}catch{this.showStatus("error"),this.emit("sl-error")}}async showStatus(t){const e=this.copyLabel||this.localize.term("copy"),r=this.successLabel||this.localize.term("copied"),o=this.errorLabel||this.localize.term("error"),n=t==="success"?this.successIcon:this.errorIcon,i=Je(this,"copy.in",{dir:"ltr"}),s=Je(this,"copy.out",{dir:"ltr"});this.tooltip.content=t==="success"?r:o,await this.copyIcon.animate(s.keyframes,s.options).finished,this.copyIcon.hidden=!0,this.status=t,n.hidden=!1,await n.animate(i.keyframes,i.options).finished,setTimeout(async()=>{await n.animate(s.keyframes,s.options).finished,n.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(i.keyframes,i.options).finished,this.tooltip.content=e,this.isCopying=!1},this.feedbackDuration)}render(){const t=this.copyLabel||this.localize.term("copy");return C`
      <sl-tooltip
        class=${ct({"copy-button":!0,"copy-button--success":this.status==="success","copy-button--error":this.status==="error"})}
        content=${t}
        placement=${this.tooltipPlacement}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        exportparts="
          base:tooltip__base,
          base__popup:tooltip__base__popup,
          base__arrow:tooltip__base__arrow,
          body:tooltip__body
        "
      >
        <button
          class="copy-button__button"
          part="button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this.handleCopy}
        >
          <slot part="copy-icon" name="copy-icon">
            <sl-icon library="system" name="copy"></sl-icon>
          </slot>
          <slot part="success-icon" name="success-icon" hidden>
            <sl-icon library="system" name="check"></sl-icon>
          </slot>
          <slot part="error-icon" name="error-icon" hidden>
            <sl-icon library="system" name="x-lg"></sl-icon>
          </slot>
        </button>
      </sl-tooltip>
    `}};j.styles=[ht,gl];j.dependencies={"sl-icon":it,"sl-tooltip":B};p([tt('slot[name="copy-icon"]')],j.prototype,"copyIcon",2);p([tt('slot[name="success-icon"]')],j.prototype,"successIcon",2);p([tt('slot[name="error-icon"]')],j.prototype,"errorIcon",2);p([tt("sl-tooltip")],j.prototype,"tooltip",2);p([Kt()],j.prototype,"isCopying",2);p([Kt()],j.prototype,"status",2);p([f()],j.prototype,"value",2);p([f()],j.prototype,"from",2);p([f({type:Boolean,reflect:!0})],j.prototype,"disabled",2);p([f({attribute:"copy-label"})],j.prototype,"copyLabel",2);p([f({attribute:"success-label"})],j.prototype,"successLabel",2);p([f({attribute:"error-label"})],j.prototype,"errorLabel",2);p([f({attribute:"feedback-duration",type:Number})],j.prototype,"feedbackDuration",2);p([f({attribute:"tooltip-placement"})],j.prototype,"tooltipPlacement",2);p([f({type:Boolean})],j.prototype,"hoist",2);pr("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}});pr("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}});j.define("sl-copy-button");/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let di=class extends Event{constructor(e,r,o,n){super("context-request",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=r,this.callback=o,this.subscribe=n??!1}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let on=class{constructor(e,r,o,n){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(i,s)=>{this.unsubscribe&&(this.unsubscribe!==s&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=i,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(i,s)),this.unsubscribe=s},this.host=e,r.context!==void 0){const i=r;this.context=i.context,this.callback=i.callback,this.subscribe=i.subscribe??!1}else this.context=r,this.callback=o,this.subscribe=n??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new di(this.context,this.host,this.t,this.subscribe))}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let yl=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,r=!1){const o=r||!Object.is(e,this.o);this.o=e,o&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(const[r,{disposer:o}]of this.subscriptions)r(this.o,o)},e!==void 0&&(this.value=e)}addCallback(e,r,o){if(!o)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:r});const{disposer:n}=this.subscriptions.get(e);e(this.value,n)}clearCallbacks(){this.subscriptions.clear()}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let wl=class extends Event{constructor(e,r){super("context-provider",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=r}},nn=class extends yl{constructor(e,r,o){super(r.context!==void 0?r.initialValue:o),this.onContextRequest=n=>{if(n.context!==this.context)return;const i=n.contextTarget??n.composedPath()[0];i!==this.host&&(n.stopPropagation(),this.addCallback(n.callback,i,n.subscribe))},this.onProviderRequest=n=>{if(n.context!==this.context||(n.contextTarget??n.composedPath()[0])===this.host)return;const i=new Set;for(const[s,{consumerHost:a}]of this.subscriptions)i.has(s)||(i.add(s),a.dispatchEvent(new di(this.context,a,s,!0)));n.stopPropagation()},this.host=e,r.context!==void 0?this.context=r.context:this.context=r,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new wl(this.context,this.host))}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function wo({context:t}){return(e,r)=>{const o=new WeakMap;if(typeof r=="object")return{get(){return e.get.call(this)},set(n){return o.get(this).setValue(n),e.set.call(this,n)},init(n){return o.set(this,new nn(this,{context:t,initialValue:n})),n}};{e.constructor.addInitializer((s=>{o.set(s,new nn(s,{context:t}))}));const n=Object.getOwnPropertyDescriptor(e,r);let i;if(n===void 0){const s=new WeakMap;i={get(){return s.get(this)},set(a){o.get(this).setValue(a),s.set(this,a)},configurable:!0,enumerable:!0}}else{const s=n.set;i={...n,set(a){o.get(this).setValue(a),s?.call(this,a)}}}return void Object.defineProperty(e,r,i)}}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function be({context:t,subscribe:e}){return(r,o)=>{typeof o=="object"?o.addInitializer((function(){new on(this,{context:t,callback:n=>{r.set.call(this,n)},subscribe:e})})):r.constructor.addInitializer((n=>{new on(n,{context:t,callback:i=>{n[o]=i},subscribe:e})}))}}function D(t){return typeof t=="function"}function _l(t){return D(t?.lift)}function Zt(t){return function(e){if(_l(e))return e.lift(function(r){try{return t(r,this)}catch(o){this.error(o)}});throw new TypeError("Unable to lift unknown Observable type")}}var Ir=function(t,e){return Ir=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,o){r.__proto__=o}||function(r,o){for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(r[n]=o[n])},Ir(t,e)};function Xt(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");Ir(t,e);function r(){this.constructor=t}t.prototype=e===null?Object.create(e):(r.prototype=e.prototype,new r)}var Qe=function(){return Qe=Object.assign||function(e){for(var r,o=1,n=arguments.length;o<n;o++){r=arguments[o];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e},Qe.apply(this,arguments)};function xl(t,e){var r={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.indexOf(o)<0&&(r[o]=t[o]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,o=Object.getOwnPropertySymbols(t);n<o.length;n++)e.indexOf(o[n])<0&&Object.prototype.propertyIsEnumerable.call(t,o[n])&&(r[o[n]]=t[o[n]]);return r}function $l(t,e,r,o){function n(i){return i instanceof r?i:new r(function(s){s(i)})}return new(r||(r=Promise))(function(i,s){function a(u){try{c(o.next(u))}catch(d){s(d)}}function l(u){try{c(o.throw(u))}catch(d){s(d)}}function c(u){u.done?i(u.value):n(u.value).then(a,l)}c((o=o.apply(t,e||[])).next())})}function pi(t,e){var r={label:0,sent:function(){if(i[0]&1)throw i[1];return i[1]},trys:[],ops:[]},o,n,i,s=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return s.next=a(0),s.throw=a(1),s.return=a(2),typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function a(c){return function(u){return l([c,u])}}function l(c){if(o)throw new TypeError("Generator is already executing.");for(;s&&(s=0,c[0]&&(r=0)),r;)try{if(o=1,n&&(i=c[0]&2?n.return:c[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,c[1])).done)return i;switch(n=0,i&&(c=[c[0]&2,i.value]),c[0]){case 0:case 1:i=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,n=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(i=r.trys,!(i=i.length>0&&i[i.length-1])&&(c[0]===6||c[0]===2)){r=0;continue}if(c[0]===3&&(!i||c[1]>i[0]&&c[1]<i[3])){r.label=c[1];break}if(c[0]===6&&r.label<i[1]){r.label=i[1],i=c;break}if(i&&r.label<i[2]){r.label=i[2],r.ops.push(c);break}i[2]&&r.ops.pop(),r.trys.pop();continue}c=e.call(t,r)}catch(u){c=[6,u],n=0}finally{o=i=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}}function ce(t){var e=typeof Symbol=="function"&&Symbol.iterator,r=e&&t[e],o=0;if(r)return r.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function Ae(t,e){var r=typeof Symbol=="function"&&t[Symbol.iterator];if(!r)return t;var o=r.call(t),n,i=[],s;try{for(;(e===void 0||e-- >0)&&!(n=o.next()).done;)i.push(n.value)}catch(a){s={error:a}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(s)throw s.error}}return i}function Oe(t,e,r){if(r||arguments.length===2)for(var o=0,n=e.length,i;o<n;o++)(i||!(o in e))&&(i||(i=Array.prototype.slice.call(e,0,o)),i[o]=e[o]);return t.concat(i||Array.prototype.slice.call(e))}function ie(t){return this instanceof ie?(this.v=t,this):new ie(t)}function kl(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o=r.apply(t,e||[]),n,i=[];return n=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",s),n[Symbol.asyncIterator]=function(){return this},n;function s(h){return function(b){return Promise.resolve(b).then(h,d)}}function a(h,b){o[h]&&(n[h]=function(v){return new Promise(function(x,y){i.push([h,v,x,y])>1||l(h,v)})},b&&(n[h]=b(n[h])))}function l(h,b){try{c(o[h](b))}catch(v){m(i[0][3],v)}}function c(h){h.value instanceof ie?Promise.resolve(h.value.v).then(u,d):m(i[0][2],h)}function u(h){l("next",h)}function d(h){l("throw",h)}function m(h,b){h(b),i.shift(),i.length&&l(i[0][0],i[0][1])}}function Sl(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=t[Symbol.asyncIterator],r;return e?e.call(t):(t=typeof ce=="function"?ce(t):t[Symbol.iterator](),r={},o("next"),o("throw"),o("return"),r[Symbol.asyncIterator]=function(){return this},r);function o(i){r[i]=t[i]&&function(s){return new Promise(function(a,l){s=t[i](s),n(a,l,s.done,s.value)})}}function n(i,s,a,l){Promise.resolve(l).then(function(c){i({value:c,done:a})},s)}}var fi=(function(t){return t&&typeof t.length=="number"&&typeof t!="function"});function mi(t){return D(t?.then)}function bi(t){var e=function(o){Error.call(o),o.stack=new Error().stack},r=t(e);return r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r}var kr=bi(function(t){return function(r){t(this),this.message=r?r.length+` errors occurred during unsubscription:
`+r.map(function(o,n){return n+1+") "+o.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=r}});function Mr(t,e){if(t){var r=t.indexOf(e);0<=r&&t.splice(r,1)}}var fr=(function(){function t(e){this.initialTeardown=e,this.closed=!1,this._parentage=null,this._finalizers=null}return t.prototype.unsubscribe=function(){var e,r,o,n,i;if(!this.closed){this.closed=!0;var s=this._parentage;if(s)if(this._parentage=null,Array.isArray(s))try{for(var a=ce(s),l=a.next();!l.done;l=a.next()){var c=l.value;c.remove(this)}}catch(v){e={error:v}}finally{try{l&&!l.done&&(r=a.return)&&r.call(a)}finally{if(e)throw e.error}}else s.remove(this);var u=this.initialTeardown;if(D(u))try{u()}catch(v){i=v instanceof kr?v.errors:[v]}var d=this._finalizers;if(d){this._finalizers=null;try{for(var m=ce(d),h=m.next();!h.done;h=m.next()){var b=h.value;try{sn(b)}catch(v){i=i??[],v instanceof kr?i=Oe(Oe([],Ae(i)),Ae(v.errors)):i.push(v)}}}catch(v){o={error:v}}finally{try{h&&!h.done&&(n=m.return)&&n.call(m)}finally{if(o)throw o.error}}}if(i)throw new kr(i)}},t.prototype.add=function(e){var r;if(e&&e!==this)if(this.closed)sn(e);else{if(e instanceof t){if(e.closed||e._hasParent(this))return;e._addParent(this)}(this._finalizers=(r=this._finalizers)!==null&&r!==void 0?r:[]).push(e)}},t.prototype._hasParent=function(e){var r=this._parentage;return r===e||Array.isArray(r)&&r.includes(e)},t.prototype._addParent=function(e){var r=this._parentage;this._parentage=Array.isArray(r)?(r.push(e),r):r?[r,e]:e},t.prototype._removeParent=function(e){var r=this._parentage;r===e?this._parentage=null:Array.isArray(r)&&Mr(r,e)},t.prototype.remove=function(e){var r=this._finalizers;r&&Mr(r,e),e instanceof t&&e._removeParent(this)},t.EMPTY=(function(){var e=new t;return e.closed=!0,e})(),t})(),vi=fr.EMPTY;function gi(t){return t instanceof fr||t&&"closed"in t&&D(t.remove)&&D(t.add)&&D(t.unsubscribe)}function sn(t){D(t)?t():t.unsubscribe()}var El={Promise:void 0},Cl={setTimeout:function(t,e){for(var r=[],o=2;o<arguments.length;o++)r[o-2]=arguments[o];return setTimeout.apply(void 0,Oe([t,e],Ae(r)))},clearTimeout:function(t){return clearTimeout(t)},delegate:void 0};function yi(t){Cl.setTimeout(function(){throw t})}function Dr(){}function qe(t){t()}var _o=(function(t){Xt(e,t);function e(r){var o=t.call(this)||this;return o.isStopped=!1,r?(o.destination=r,gi(r)&&r.add(o)):o.destination=Pl,o}return e.create=function(r,o,n){return new Pe(r,o,n)},e.prototype.next=function(r){this.isStopped||this._next(r)},e.prototype.error=function(r){this.isStopped||(this.isStopped=!0,this._error(r))},e.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},e.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,t.prototype.unsubscribe.call(this),this.destination=null)},e.prototype._next=function(r){this.destination.next(r)},e.prototype._error=function(r){try{this.destination.error(r)}finally{this.unsubscribe()}},e.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},e})(fr),Al=(function(){function t(e){this.partialObserver=e}return t.prototype.next=function(e){var r=this.partialObserver;if(r.next)try{r.next(e)}catch(o){Ue(o)}},t.prototype.error=function(e){var r=this.partialObserver;if(r.error)try{r.error(e)}catch(o){Ue(o)}else Ue(e)},t.prototype.complete=function(){var e=this.partialObserver;if(e.complete)try{e.complete()}catch(r){Ue(r)}},t})(),Pe=(function(t){Xt(e,t);function e(r,o,n){var i=t.call(this)||this,s;return D(r)||!r?s={next:r??void 0,error:o??void 0,complete:n??void 0}:s=r,i.destination=new Al(s),i}return e})(_o);function Ue(t){yi(t)}function Ol(t){throw t}var Pl={closed:!0,next:Dr,error:Ol,complete:Dr},xo=(function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"})();function Le(t){return t}function Rl(t){return t.length===0?Le:t.length===1?t[0]:function(r){return t.reduce(function(o,n){return n(o)},r)}}var H=(function(){function t(e){e&&(this._subscribe=e)}return t.prototype.lift=function(e){var r=new t;return r.source=this,r.operator=e,r},t.prototype.subscribe=function(e,r,o){var n=this,i=zl(e)?e:new Pe(e,r,o);return qe(function(){var s=n,a=s.operator,l=s.source;i.add(a?a.call(i,l):l?n._subscribe(i):n._trySubscribe(i))}),i},t.prototype._trySubscribe=function(e){try{return this._subscribe(e)}catch(r){e.error(r)}},t.prototype.forEach=function(e,r){var o=this;return r=an(r),new r(function(n,i){var s=new Pe({next:function(a){try{e(a)}catch(l){i(l),s.unsubscribe()}},error:i,complete:n});o.subscribe(s)})},t.prototype._subscribe=function(e){var r;return(r=this.source)===null||r===void 0?void 0:r.subscribe(e)},t.prototype[xo]=function(){return this},t.prototype.pipe=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return Rl(e)(this)},t.prototype.toPromise=function(e){var r=this;return e=an(e),new e(function(o,n){var i;r.subscribe(function(s){return i=s},function(s){return n(s)},function(){return o(i)})})},t.create=function(e){return new t(e)},t})();function an(t){var e;return(e=t??El.Promise)!==null&&e!==void 0?e:Promise}function Tl(t){return t&&D(t.next)&&D(t.error)&&D(t.complete)}function zl(t){return t&&t instanceof _o||Tl(t)&&gi(t)}function wi(t){return D(t[xo])}function _i(t){return Symbol.asyncIterator&&D(t?.[Symbol.asyncIterator])}function xi(t){return new TypeError("You provided "+(t!==null&&typeof t=="object"?"an invalid object":"'"+t+"'")+" where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.")}function Ll(){return typeof Symbol!="function"||!Symbol.iterator?"@@iterator":Symbol.iterator}var $i=Ll();function ki(t){return D(t?.[$i])}function Si(t){return kl(this,arguments,function(){var r,o,n,i;return pi(this,function(s){switch(s.label){case 0:r=t.getReader(),s.label=1;case 1:s.trys.push([1,,9,10]),s.label=2;case 2:return[4,ie(r.read())];case 3:return o=s.sent(),n=o.value,i=o.done,i?[4,ie(void 0)]:[3,5];case 4:return[2,s.sent()];case 5:return[4,ie(n)];case 6:return[4,s.sent()];case 7:return s.sent(),[3,2];case 8:return[3,10];case 9:return r.releaseLock(),[7];case 10:return[2]}})})}function Ei(t){return D(t?.getReader)}function Rt(t){if(t instanceof H)return t;if(t!=null){if(wi(t))return Il(t);if(fi(t))return Ml(t);if(mi(t))return Dl(t);if(_i(t))return Ci(t);if(ki(t))return jl(t);if(Ei(t))return Bl(t)}throw xi(t)}function Il(t){return new H(function(e){var r=t[xo]();if(D(r.subscribe))return r.subscribe(e);throw new TypeError("Provided object does not correctly implement Symbol.observable")})}function Ml(t){return new H(function(e){for(var r=0;r<t.length&&!e.closed;r++)e.next(t[r]);e.complete()})}function Dl(t){return new H(function(e){t.then(function(r){e.closed||(e.next(r),e.complete())},function(r){return e.error(r)}).then(null,yi)})}function jl(t){return new H(function(e){var r,o;try{for(var n=ce(t),i=n.next();!i.done;i=n.next()){var s=i.value;if(e.next(s),e.closed)return}}catch(a){r={error:a}}finally{try{i&&!i.done&&(o=n.return)&&o.call(n)}finally{if(r)throw r.error}}e.complete()})}function Ci(t){return new H(function(e){Ul(t,e).catch(function(r){return e.error(r)})})}function Bl(t){return Ci(Si(t))}function Ul(t,e){var r,o,n,i;return $l(this,void 0,void 0,function(){var s,a;return pi(this,function(l){switch(l.label){case 0:l.trys.push([0,5,6,11]),r=Sl(t),l.label=1;case 1:return[4,r.next()];case 2:if(o=l.sent(),!!o.done)return[3,4];if(s=o.value,e.next(s),e.closed)return[2];l.label=3;case 3:return[3,1];case 4:return[3,11];case 5:return a=l.sent(),n={error:a},[3,11];case 6:return l.trys.push([6,,9,10]),o&&!o.done&&(i=r.return)?[4,i.call(r)]:[3,8];case 7:l.sent(),l.label=8;case 8:return[3,10];case 9:if(n)throw n.error;return[7];case 10:return[7];case 11:return e.complete(),[2]}})})}function At(t,e,r,o,n){return new Fl(t,e,r,o,n)}var Fl=(function(t){Xt(e,t);function e(r,o,n,i,s,a){var l=t.call(this,r)||this;return l.onFinalize=s,l.shouldUnsubscribe=a,l._next=o?function(c){try{o(c)}catch(u){r.error(u)}}:t.prototype._next,l._error=i?function(c){try{i(c)}catch(u){r.error(u)}finally{this.unsubscribe()}}:t.prototype._error,l._complete=n?function(){try{n()}catch(c){r.error(c)}finally{this.unsubscribe()}}:t.prototype._complete,l}return e.prototype.unsubscribe=function(){var r;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var o=this.closed;t.prototype.unsubscribe.call(this),!o&&((r=this.onFinalize)===null||r===void 0||r.call(this))}},e})(_o),Ai={now:function(){return(Ai.delegate||Date).now()},delegate:void 0};function Nl(t){return t&&D(t.schedule)}function Oi(t){return t[t.length-1]}function Vl(t){return D(Oi(t))?t.pop():void 0}function Hl(t){return Nl(Oi(t))?t.pop():void 0}function kt(t,e,r,o,n){o===void 0&&(o=0),n===void 0&&(n=!1);var i=e.schedule(function(){r(),n?t.add(this.schedule(null,o)):this.unsubscribe()},o);if(t.add(i),!n)return i}var Wl=Array.isArray,ql=Object.getPrototypeOf,Kl=Object.prototype,Yl=Object.keys;function Zl(t){if(t.length===1){var e=t[0];if(Wl(e))return{args:e,keys:null};if(Xl(e)){var r=Yl(e);return{args:r.map(function(o){return e[o]}),keys:r}}}return{args:t,keys:null}}function Xl(t){return t&&typeof t=="object"&&ql(t)===Kl}function Pi(t,e){return e===void 0&&(e=0),Zt(function(r,o){r.subscribe(At(o,function(n){return kt(o,t,function(){return o.next(n)},e)},function(){return kt(o,t,function(){return o.complete()},e)},function(n){return kt(o,t,function(){return o.error(n)},e)}))})}function Ri(t,e){return e===void 0&&(e=0),Zt(function(r,o){o.add(t.schedule(function(){return r.subscribe(o)},e))})}function Gl(t,e){return Rt(t).pipe(Ri(e),Pi(e))}function Jl(t,e){return Rt(t).pipe(Ri(e),Pi(e))}function Ql(t,e){return new H(function(r){var o=0;return e.schedule(function(){o===t.length?r.complete():(r.next(t[o++]),r.closed||this.schedule())})})}function tc(t,e){return new H(function(r){var o;return kt(r,e,function(){o=t[$i](),kt(r,e,function(){var n,i,s;try{n=o.next(),i=n.value,s=n.done}catch(a){r.error(a);return}s?r.complete():r.next(i)},0,!0)}),function(){return D(o?.return)&&o.return()}})}function Ti(t,e){if(!t)throw new Error("Iterable cannot be null");return new H(function(r){kt(r,e,function(){var o=t[Symbol.asyncIterator]();kt(r,e,function(){o.next().then(function(n){n.done?r.complete():r.next(n.value)})},0,!0)})})}function ec(t,e){return Ti(Si(t),e)}function rc(t,e){if(t!=null){if(wi(t))return Gl(t,e);if(fi(t))return Ql(t,e);if(mi(t))return Jl(t,e);if(_i(t))return Ti(t,e);if(ki(t))return tc(t,e);if(Ei(t))return ec(t,e)}throw xi(t)}function zi(t,e){return e?rc(t,e):Rt(t)}function Li(t,e){return Zt(function(r,o){var n=0;r.subscribe(At(o,function(i){o.next(t.call(e,i,n++))}))})}var oc=Array.isArray;function nc(t,e){return oc(e)?t.apply(void 0,Oe([],Ae(e))):t(e)}function ic(t){return Li(function(e){return nc(t,e)})}function sc(t,e){return t.reduce(function(r,o,n){return r[o]=e[n],r},{})}function ac(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=Hl(t),o=Vl(t),n=Zl(t),i=n.args,s=n.keys;if(i.length===0)return zi([],r);var a=new H(lc(i,r,s?function(l){return sc(s,l)}:Le));return o?a.pipe(ic(o)):a}function lc(t,e,r){return r===void 0&&(r=Le),function(o){ln(e,function(){for(var n=t.length,i=new Array(n),s=n,a=n,l=function(u){ln(e,function(){var d=zi(t[u],e),m=!1;d.subscribe(At(o,function(h){i[u]=h,m||(m=!0,a--),a||o.next(r(i.slice()))},function(){--s||o.complete()}))},o)},c=0;c<n;c++)l(c)},o)}}function ln(t,e,r){t?kt(r,t,e):e()}var cc=bi(function(t){return function(){t(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}}),ve=(function(t){Xt(e,t);function e(){var r=t.call(this)||this;return r.closed=!1,r.currentObservers=null,r.observers=[],r.isStopped=!1,r.hasError=!1,r.thrownError=null,r}return e.prototype.lift=function(r){var o=new cn(this,this);return o.operator=r,o},e.prototype._throwIfClosed=function(){if(this.closed)throw new cc},e.prototype.next=function(r){var o=this;qe(function(){var n,i;if(o._throwIfClosed(),!o.isStopped){o.currentObservers||(o.currentObservers=Array.from(o.observers));try{for(var s=ce(o.currentObservers),a=s.next();!a.done;a=s.next()){var l=a.value;l.next(r)}}catch(c){n={error:c}}finally{try{a&&!a.done&&(i=s.return)&&i.call(s)}finally{if(n)throw n.error}}}})},e.prototype.error=function(r){var o=this;qe(function(){if(o._throwIfClosed(),!o.isStopped){o.hasError=o.isStopped=!0,o.thrownError=r;for(var n=o.observers;n.length;)n.shift().error(r)}})},e.prototype.complete=function(){var r=this;qe(function(){if(r._throwIfClosed(),!r.isStopped){r.isStopped=!0;for(var o=r.observers;o.length;)o.shift().complete()}})},e.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(e.prototype,"observed",{get:function(){var r;return((r=this.observers)===null||r===void 0?void 0:r.length)>0},enumerable:!1,configurable:!0}),e.prototype._trySubscribe=function(r){return this._throwIfClosed(),t.prototype._trySubscribe.call(this,r)},e.prototype._subscribe=function(r){return this._throwIfClosed(),this._checkFinalizedStatuses(r),this._innerSubscribe(r)},e.prototype._innerSubscribe=function(r){var o=this,n=this,i=n.hasError,s=n.isStopped,a=n.observers;return i||s?vi:(this.currentObservers=null,a.push(r),new fr(function(){o.currentObservers=null,Mr(a,r)}))},e.prototype._checkFinalizedStatuses=function(r){var o=this,n=o.hasError,i=o.thrownError,s=o.isStopped;n?r.error(i):s&&r.complete()},e.prototype.asObservable=function(){var r=new H;return r.source=this,r},e.create=function(r,o){return new cn(r,o)},e})(H),cn=(function(t){Xt(e,t);function e(r,o){var n=t.call(this)||this;return n.destination=r,n.source=o,n}return e.prototype.next=function(r){var o,n;(n=(o=this.destination)===null||o===void 0?void 0:o.next)===null||n===void 0||n.call(o,r)},e.prototype.error=function(r){var o,n;(n=(o=this.destination)===null||o===void 0?void 0:o.error)===null||n===void 0||n.call(o,r)},e.prototype.complete=function(){var r,o;(o=(r=this.destination)===null||r===void 0?void 0:r.complete)===null||o===void 0||o.call(r)},e.prototype._subscribe=function(r){var o,n;return(n=(o=this.source)===null||o===void 0?void 0:o.subscribe(r))!==null&&n!==void 0?n:vi},e})(ve),uc=(function(t){Xt(e,t);function e(r){var o=t.call(this)||this;return o._value=r,o}return Object.defineProperty(e.prototype,"value",{get:function(){return this.getValue()},enumerable:!1,configurable:!0}),e.prototype._subscribe=function(r){var o=t.prototype._subscribe.call(this,r);return!o.closed&&r.next(this._value),o},e.prototype.getValue=function(){var r=this,o=r.hasError,n=r.thrownError,i=r._value;if(o)throw n;return this._throwIfClosed(),i},e.prototype.next=function(r){t.prototype.next.call(this,this._value=r)},e})(ve),hc=(function(t){Xt(e,t);function e(r,o,n){r===void 0&&(r=1/0),o===void 0&&(o=1/0),n===void 0&&(n=Ai);var i=t.call(this)||this;return i._bufferSize=r,i._windowTime=o,i._timestampProvider=n,i._buffer=[],i._infiniteTimeWindow=!0,i._infiniteTimeWindow=o===1/0,i._bufferSize=Math.max(1,r),i._windowTime=Math.max(1,o),i}return e.prototype.next=function(r){var o=this,n=o.isStopped,i=o._buffer,s=o._infiniteTimeWindow,a=o._timestampProvider,l=o._windowTime;n||(i.push(r),!s&&i.push(a.now()+l)),this._trimBuffer(),t.prototype.next.call(this,r)},e.prototype._subscribe=function(r){this._throwIfClosed(),this._trimBuffer();for(var o=this._innerSubscribe(r),n=this,i=n._infiniteTimeWindow,s=n._buffer,a=s.slice(),l=0;l<a.length&&!r.closed;l+=i?1:2)r.next(a[l]);return this._checkFinalizedStatuses(r),o},e.prototype._trimBuffer=function(){var r=this,o=r._bufferSize,n=r._timestampProvider,i=r._buffer,s=r._infiniteTimeWindow,a=(s?1:2)*o;if(o<1/0&&a<i.length&&i.splice(0,i.length-a),!s){for(var l=n.now(),c=0,u=1;u<i.length&&i[u]<=l;u+=2)c=u;c&&i.splice(0,c+1)}},e})(ve);function dc(t){t===void 0&&(t={});var e=t.connector,r=e===void 0?function(){return new ve}:e,o=t.resetOnError,n=o===void 0?!0:o,i=t.resetOnComplete,s=i===void 0?!0:i,a=t.resetOnRefCountZero,l=a===void 0?!0:a;return function(c){var u,d,m,h=0,b=!1,v=!1,x=function(){d?.unsubscribe(),d=void 0},y=function(){x(),u=m=void 0,b=v=!1},w=function(){var $=u;y(),$?.unsubscribe()};return Zt(function($,S){h++,!v&&!b&&x();var E=m=m??r();S.add(function(){h--,h===0&&!v&&!b&&(d=Sr(w,l))}),E.subscribe(S),!u&&h>0&&(u=new Pe({next:function(R){return E.next(R)},error:function(R){v=!0,x(),d=Sr(y,n,R),E.error(R)},complete:function(){b=!0,x(),d=Sr(y,s),E.complete()}}),Rt($).subscribe(u))})(c)}}function Sr(t,e){for(var r=[],o=2;o<arguments.length;o++)r[o-2]=arguments[o];if(e===!0){t();return}if(e!==!1){var n=new Pe({next:function(){n.unsubscribe(),t()}});return Rt(e.apply(void 0,Oe([],Ae(r)))).subscribe(n)}}function jr(t,e,r){var o,n,i,s,a=!1;return t&&typeof t=="object"?(o=t.bufferSize,s=o===void 0?1/0:o,n=t.windowTime,e=n===void 0?1/0:n,i=t.refCount,a=i===void 0?!1:i,r=t.scheduler):s=t??1/0,dc({connector:function(){return new hc(s,e,r)},resetOnError:!0,resetOnComplete:!1,resetOnRefCountZero:a})}function Br(t,e){return Zt(function(r,o){var n=null,i=0,s=!1,a=function(){return s&&!n&&o.complete()};r.subscribe(At(o,function(l){n?.unsubscribe();var c=0,u=i++;Rt(t(l,u)).subscribe(n=At(o,function(d){return o.next(e?e(l,d,u,c++):d)},function(){n=null,a()}))},function(){s=!0,a()}))})}function pc(){return Br(Le)}function fc(t){return Zt(function(e,r){Rt(t).subscribe(At(r,function(){return r.complete()},Dr)),!r.closed&&e.subscribe(r)})}function mr(t,e,r){var o=D(t)||e||r?{next:t,error:e,complete:r}:t;return o?Zt(function(n,i){var s;(s=o.subscribe)===null||s===void 0||s.call(o);var a=!0;n.subscribe(At(i,function(l){var c;(c=o.next)===null||c===void 0||c.call(o,l),i.next(l)},function(){var l;a=!1,(l=o.complete)===null||l===void 0||l.call(o),i.complete()},function(l){var c;a=!1,(c=o.error)===null||c===void 0||c.call(o,l),i.error(l)},function(){var l,c;a&&((l=o.unsubscribe)===null||l===void 0||l.call(o)),(c=o.finalize)===null||c===void 0||c.call(o)}))}):Le}function mc(t){return typeof t=="number"}function bc(t){return typeof t=="string"}function vc(t){return typeof t=="bigint"}function Ii(t){return!!t&&Object.prototype.toString.call(t)==="[object Date]"&&!isNaN(t)}function Mi(t){return t!=null&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"}var gc=Symbol.for("decoders.kAnnotationRegistry"),Di=globalThis[gc]??=new WeakSet;function Ie(t){return Di.add(t),t}function ji(t,e){return Ie({type:"object",fields:t,text:e})}function yc(t,e){return Ie({type:"array",items:t,text:e})}function Fe(t,e){return Ie({type:"opaque",value:t,text:e})}function wc(t,e){return Ie({type:"scalar",value:t,text:e})}function Bi(t,e){return e!==void 0?Ie({...t,text:e}):t}function Ui(t,e){const r=new Map([...t.fields,...e]);return ji(r,t.text)}function Fi(t){return Di.has(t)}function _c(t,e,r){r.add(t);const o=[];for(const n of t)o.push($o(n,void 0,r));return yc(o,e)}function Ni(t,e,r){r.add(t);const o=new Map;for(const n of Object.keys(t)){const i=t[n];o.set(n,$o(i,void 0,r))}return ji(o,e)}function $o(t,e,r){return t==null||typeof t=="string"||typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"||typeof t.getMonth=="function"?wc(t,e):Fi(t)?Bi(t,e):Array.isArray(t)?r.has(t)?Fe("<circular ref>",e):_c(t,e,r):Mi(t)?r.has(t)?Fe("<circular ref>",e):Ni(t,e,r):Fe(typeof t=="function"?"<function>":"???",e)}function Ut(t,e){return $o(t,e,new WeakSet)}function Vi(t,e){return Ni(t,e,new WeakSet)}var Ft="  ";function Ur(t){return t.includes(`
`)}function ko(t,e=Ft){return Ur(t)?t.split(`
`).map(r=>`${e}${r}`).join(`
`):`${e}${t}`}var xc=/'/g;function ue(t){return typeof t=="string"?"'"+t.replace(xc,"\\'")+"'":t===void 0?"undefined":JSON.stringify(t)}function tr(t,e=[]){const r=[];if(t.type==="array"){const i=t.items;let s=0;for(const a of i)for(const l of tr(a,[...e,s++]))r.push(l)}else if(t.type==="object"){const i=t.fields;for(const[s,a]of i)for(const l of tr(a,[...e,s]))r.push(l)}const o=t.text;if(!o)return r;let n;return e.length===0?n="":e.length===1?n=typeof e[0]=="number"?`Value at index ${e[0]}: `:`Value at key ${ue(e[0])}: `:n=`Value at keypath ${ue(e.map(String).join("."))}: `,[...r,`${n}${o}`]}function $c(t,e=80){let r=JSON.stringify(t);if(r.length<=e)return r;const o=`${t.substring(0,e-15)}...`;return r=`${JSON.stringify(o)} [truncated]`,r}function kc(t,e){const{items:r}=t;if(r.length===0)return"[]";const o=[];for(const n of r){const[i,s]=So(n,`${e}${Ft}`);o.push(`${e}${Ft}${i},`),s!==void 0&&o.push(ko(s,`${e}${Ft}`))}return["[",...o,`${e}]`].join(`
`)}function Sc(t,e){const{fields:r}=t;if(r.size===0)return"{}";const o=[];for(const[n,i]of r){const s=Hi(n),a=`${e}${Ft}${" ".repeat(s.length+2)}`,[l,c]=So(i,`${e}${Ft}`);o.push(`${e}${Ft}${s}: ${l},`),c!==void 0&&o.push(ko(c,a))}return["{",...o,`${e}}`].join(`
`)}function Hi(t){return typeof t=="string"?$c(t):typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"?t.toString():t===null?"null":t===void 0?"undefined":Ii(t)?`new Date(${ue(t.toISOString())})`:t instanceof Date?"(Invalid Date)":"(unserializable)"}function So(t,e=""){let r;t.type==="array"?r=kc(t,e):t.type==="object"?r=Sc(t,e):t.type==="scalar"?r=Hi(t.value):r=t.value;const o=t.text;if(o!==void 0){const n="^".repeat(Ur(r)?1:r.length);return[r,[n,o].join(Ur(o)?`
`:" ")]}else return[r,void 0]}function Ec(t){const[e,r]=So(t);return r!==void 0?`${e}
${r}`:e}function Cc(t){return tr(t,[]).join(`
`)}function*Fr(t,e){switch(t.text&&(e.length>0?yield{message:t.text,path:[...e]}:yield{message:t.text}),t.type){case"array":{let r=0;for(const o of t.items)e.push(r++),yield*Fr(o,e),e.pop();break}case"object":{for(const[r,o]of t.fields)e.push(r),yield*Fr(o,e),e.pop();break}}}function Ac(t){return Array.from(Fr(t,[]))}function Wi(t){return{ok:!0,value:t,error:void 0}}function qi(t){return{ok:!1,value:void 0,error:t}}function Oc(t){return e=>{try{const r=t(e);return Wi(r)}catch(r){return qi(Ut(e,r instanceof Error?r.message:String(r)))}}}function Pc(t,e){const r=e(t);if(typeof r=="string"){const o=new Error(`
${r}`);return o.name="Decoding error",o}else return r}function F(t){function e(h){return t(h,Wi,v=>qi(Fi(v)?v:Ut(h,v)))}function r(h,b=Ec){const v=e(h);if(v.ok)return v.value;throw Pc(v.error,b)}function o(h){return e(h).value}function n(h){return a(Oc(h))}function i(h,b){return c(v=>h(v)?null:b)}function s(){return m}function a(h){return F((b,v,x)=>{const y=e(b);if(!y.ok)return y;const w=un(h)?h:h(y.value,v,x);return un(w)?w.decode(y.value):w})}function l(h){return a(h)}function c(h){return a((b,v,x)=>{const y=h(b);return y===null?v(b):x(typeof y=="string"?Ut(b,y):y)})}function u(h){return F((b,v,x)=>{const y=e(b);return y.ok?y:x(Ut(y.error,h))})}const m=Tc({verify:r,value:o,decode:e,transform:n,refine:i,refineType:s,reject:c,describe:u,then:a,pipe:l,"~standard":{version:1,vendor:"decoders",validate:h=>{const b=e(h);return b.ok?{value:b.value}:{issues:Ac(b.error)}}}});return m}var Rc=Symbol.for("decoders.kDecoderRegistry"),Ki=globalThis[Rc]??=new WeakSet;function Tc(t){return Ki.add(t),t}function un(t){return Ki.has(t)}var zc=F((t,e,r)=>Array.isArray(t)?e(t):r("Must be an array"));function Ht(t){const e=t.decode;return zc.then((r,o,n)=>{const i=[];for(let s=0;s<r.length;++s){const a=r[s],l=e(a);if(l.ok)i.push(l.value);else{i.length=0;const c=l.error,u=r.slice();return u.splice(s,1,Ut(c,c.text?`${c.text} (at index ${s})`:`index ${s}`)),n(Ut(u))}}return o(i)})}function Lc(t){return F((e,r,o)=>e instanceof t?r(e):o(`Must be ${t.name} instance`))}function Yi(t){return F(e=>t().decode(e))}function Ic(t,e){const r=new Set;for(const o of t)e.has(o)||r.add(o);return r}var Zi=F((t,e,r)=>Mi(t)?e(t):r("Must be an object"));function q(t){const e=new Set(Object.keys(t));return Zi.then((r,o,n)=>{const i=new Set(Object.keys(r)),s=Ic(e,i),a={};let l=null;for(const c of Object.keys(t)){const u=t[c],d=r[c],m=u.decode(d);if(m.ok){const h=m.value;h!==void 0&&(a[c]=h),s.delete(c)}else{const h=m.error;d===void 0?s.add(c):(l??=new Map,l.set(c,h))}}if(l||s.size>0){let c=Vi(r);if(l&&(c=Ui(c,l)),s.size>0){const u=Array.from(s).map(ue).join(", "),d=s.size>1?"keys":"key";c=Bi(c,`Missing ${d}: ${u}`)}return n(c)}return o(a)})}var Nr=`Either:
`;function Mc(t){return`-${ko(t).substring(1)}`}function Dc(t){return t.startsWith(Nr)?t.substring(Nr.length):Mc(t)}function he(...t){if(t.length===0)throw new Error("Pass at least one decoder to either()");return F((e,r,o)=>{const n=[];for(const s of t){const a=s.decode(e);if(a.ok)return a;n.push(a.error)}const i=Nr+n.map(s=>Dc(tr(s).join(`
`))).join(`
`);return o(i)})}var Vr=er(null);er(void 0);F((t,e,r)=>t==null?e(t):r("Must be undefined or null"));function er(t){return F((e,r,o)=>e===t?r(t):o(`Must be ${typeof t=="symbol"?String(t):ue(t)}`))}var jc=F((t,e,r)=>e(t)),Xi=jc,k=F((t,e,r)=>typeof t=="boolean"?e(t):r("Must be boolean"));F((t,e,r)=>e(!!t));function Gi(t,e){const r=e!==void 0?t:void 0,o=e??t;return Zi.then((n,i,s)=>{let a={};const l=new Map;for(const c of Object.keys(n)){const u=n[c],d=r?.decode(c);if(d?.ok===!1)return s(Ut(n,`Invalid key ${ue(c)}: ${Cc(d.error)}`));const m=d?.value??c,h=o.decode(u);h.ok?l.size===0&&(a[m]=h.value):(l.set(c,h.error),a={})}return l.size>0?s(Ui(Vi(n),l)):i(a)})}var Bc=/^([A-Za-z]{2,12}(?:[+][A-Za-z]{2,12})?):\/\/(?:([^@:]*:?(?:[^@]+)?)@)?(?:([A-Za-z0-9.-]+)(?::([0-9]{2,5}))?)(\/(?:[-+~%/.,\w]*)?(?:\?[-+=&;%@.,/\w]*)?(?:#[.,!/\w]*)?)?$/,g=F((t,e,r)=>bc(t)?e(t):r("Must be string"));Tt(/\S/,"Must be non-empty string");function Tt(t,e){return g.refine(r=>t.test(r),e)}Tt(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Must be email");var Uc=he(Tt(Bc,"Must be URL").transform(t=>new URL(t)),Lc(URL));Uc.refine(t=>t.protocol==="https:","Must be an HTTPS URL");Tt(/^[a-z_][a-z0-9_]*$/i,"Must be valid identifier");var Ji=Tt(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,"Must be uuid");Ji.refine(t=>t[14]==="1","Must be uuidv1");Ji.refine(t=>t[14]==="4","Must be uuidv4");var Fc=Tt(/^[0-9]+$/,"Must only contain digits");Tt(/^[0-9a-f]+$/i,"Must only contain hexadecimal digits");Fc.transform(Number);var Nc=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.]\d+)?(?:Z|[+-]\d{2}:?\d{2})$/,Vc=F((t,e,r)=>Ii(t)?e(t):r("Must be a Date")),Hc=Tt(Nc,"Must be ISO8601 format").refine(t=>!isNaN(new Date(t).getTime()),"Must be valid date/time value"),Wc=Hc.transform(t=>new Date(t));he(Vc,Wc).describe("Must be a Date or date string");var qc=F((t,e,r)=>mc(t)?e(t):r("Must be number")),z=qc.refine(t=>Number.isFinite(t),"Number must be finite"),Kc=z.refine(t=>Number.isInteger(t),"Number must be an integer");z.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");Kc.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");F((t,e,r)=>vc(t)?e(t):r("Must be bigint"));var Yc=Yi(()=>Gi(Qi)),Zc=Yi(()=>Ht(Qi)),Qi=he(Vr,g,z,k,Yc,Zc).describe("Must be valid JSON value");const Xc=["family","climbing"],Gc=q({width:z,height:z,url:g,accessories:Ht(Xi)}),ts=q({header_full_width:z,header_full_height:z,avatar_shape:g,background_color:g,body_font:g,header_bounds:g,header_image:g,header_image_focused:g,header_image_poster:g,header_image_scaled:g,header_stretch:k,link_color:g,show_avatar:k,show_description:k,show_header_image:k,show_title:k,title_color:g,title_font:g,title_font_weight:g}),es=q({admin:k,ask:k,ask_anon:k,ask_page_title:g,asks_allow_media:k,avatar:Ht(Gc),can_chat:k,can_send_fan_mail:k,can_subscribe:k,description:g,drafts:z,facebook:g,facebook_opengraph_enabled:g,followed:k,followers:z,is_blocked_from_primary:k,is_nsfw:k,messages:z,name:g,posts:z,primary:k,queue:z,share_likes:k,subscribed:k,theme_id:z,theme:ts,title:g,total_posts:z,tweet:g,twitter_enabled:k,twitter_send:k,type:g,updated:z,url:g,uuid:g}),Jc=q({name:g,title:g,description:g,url:g,uuid:g,updated:z,tumblrmart_accessories:Gi(g,Xi),can_show_badges:k}),Qc=q({comment:g,tree_html:g}),tu=q({blog:q({name:g,active:k,theme:ts,share_likes:k,share_following:k,can_be_followed:k}),post:q({id:g}),content_raw:g,content:g,is_current_item:k,is_root_item:k}),eu=q({type:g,is_blocks_post_format:k,blog_name:g,blog:Jc,id:g,id_string:g,is_blazed:k,is_blaze_pending:k,can_ignite:k,can_blaze:k,post_url:g,slug:g,date:g,timestamp:z,state:g,format:g,reblog_key:g,tags:Ht(g),short_url:g,summary:g,should_open_in_legacy:k,recommended_source:he(g,Vr),recommended_color:he(g,Vr),followed:k,liked:k,note_count:z,title:g,body:g,reblog:Qc,trail:Ht(tu),can_like:k,interactability_reblog:g,interactability_blaze:g,can_reblog:k,can_send_in_message:k,muted:k,mute_end_timestamp:z,can_mute:k,can_reply:k,display_avatar:k}),ru=q({blog:es,posts:Ht(eu),total_posts:z});q({blog:q({blog:es}),posts:ru});q({avatar:g,updated:z,title:g,description:g});q({id:g,date:z,body:g,tags:Ht(g)});class Me extends oe{createRenderRoot(){return this}}function pt(t){return function(e,r){const o=new ve,n=e.connectedCallback,i=e.disconnectedCallback;e.connectedCallback=function(){n.call(this),t(this).pipe(fc(o)).subscribe(s=>{this[r]=s,this.requestUpdate()})},e.disconnectedCallback=function(){i.call(this),o.next(),o.complete()}}}function hn(t,e){e===void 0&&(e={});var r=e.selector,o=xl(e,["selector"]);return new H(function(n){var i=new AbortController,s=i.signal,a=!0,l=o.signal;if(l)if(l.aborted)i.abort();else{var c=function(){s.aborted||i.abort()};l.addEventListener("abort",c),n.add(function(){return l.removeEventListener("abort",c)})}var u=Qe(Qe({},o),{signal:s}),d=function(m){a=!1,n.error(m)};return fetch(t,u).then(function(m){r?Rt(r(m)).subscribe(At(n,void 0,function(){a=!1,n.complete()},d)):(a=!1,n.next(m),n.complete())}).catch(d),function(){a&&i.abort()}})}const br="blog";class ou{constructor(){this.meta$=hn("/dadmaxxing/meta.json").pipe(Br(e=>e.json()),jr({bufferSize:1,refCount:!0})),this.posts$=hn("/dadmaxxing/posts.json").pipe(Br(e=>e.json()),jr({bufferSize:1,refCount:!0})),this.load$=ac({meta:this.meta$,posts:this.posts$})}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dn=new WeakMap,pn=t=>{if((r=>r.pattern!==void 0)(t))return t.pattern;let e=dn.get(t);return e===void 0&&dn.set(t,e=new URLPattern({pathname:t.path})),e};let nu=class{constructor(e,r,o){this.routes=[],this.o=[],this.t={},this.i=n=>{if(n.routes===this)return;const i=n.routes;this.o.push(i),i.h=this,n.stopImmediatePropagation(),n.onDisconnect=()=>{this.o?.splice(this.o.indexOf(i)>>>0,1)};const s=fn(this.t);s!==void 0&&i.goto(s)},(this.l=e).addController(this),this.routes=[...r],this.fallback=o?.fallback}link(e){if(e?.startsWith("/"))return e;if(e?.startsWith("."))throw Error("Not implemented");return e??=this.u,(this.h?.link()??"")+e}async goto(e){let r;if(this.routes.length===0&&this.fallback===void 0)r=e,this.u="",this.t={0:r};else{const o=this.p(e);if(o===void 0)throw Error("No route found for "+e);const n=pn(o).exec({pathname:e}),i=n?.pathname.groups??{};if(r=fn(i),typeof o.enter=="function"&&await o.enter(i)===!1)return;this.v=o,this.t=i,this.u=r===void 0?e:e.substring(0,e.length-r.length)}if(r!==void 0)for(const o of this.o)o.goto(r);this.l.requestUpdate()}outlet(){return this.v?.render?.(this.t)}get params(){return this.t}p(e){const r=this.routes.find((o=>pn(o).test({pathname:e})));return r||this.fallback===void 0?r:this.fallback?{...this.fallback,path:"/*"}:void 0}hostConnected(){this.l.addEventListener(Hr.eventName,this.i);const e=new Hr(this);this.l.dispatchEvent(e),this._=e.onDisconnect}hostDisconnected(){this._?.(),this.h=void 0}};const fn=t=>{let e;for(const r of Object.keys(t))/\d+/.test(r)&&(e===void 0||r>e)&&(e=r);return e&&t[e]};let Hr=class rs extends Event{constructor(e){super(rs.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.routes=e}};Hr.eventName="lit-routes-connected";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const iu=location.origin||location.protocol+"//"+location.host;class su extends nu{constructor(){super(...arguments),this.m=e=>{const r=e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey;if(e.defaultPrevented||r)return;const o=e.composedPath().find((s=>s.tagName==="A"));if(o===void 0||o.target!==""||o.hasAttribute("download")||o.getAttribute("rel")==="external")return;const n=o.href;if(n===""||n.startsWith("mailto:"))return;const i=window.location;o.origin===iu&&(e.preventDefault(),n!==i.href&&(window.history.pushState({},"",n),this.goto(o.pathname)))},this.R=e=>{this.goto(window.location.pathname)}}hostConnected(){super.hostConnected(),window.addEventListener("click",this.m),window.addEventListener("popstate",this.R),this.goto(window.location.pathname)}hostDisconnected(){super.hostDisconnected(),window.removeEventListener("click",this.m),window.removeEventListener("popstate",this.R)}}function au(){return new H(t=>{const e=requestIdleCallback(()=>t.next());return()=>cancelIdleCallback(e)})}const Eo="router";class lu extends su{constructor(){super(...arguments),this._pathname=new ve,this.pathname$=this._pathname.pipe(pc())}async goto(e){const r=e.replace(/\/$/,"");await super.goto(r),this._pathname.next(au().pipe(Li(()=>r)))}}const os="theme",ns="app-theme",cu=he(er("light"),er("dark"));function uu(){return cu.value(localStorage.getItem(ns))}function hu(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}class du{constructor(){this._theme=new uc(uu()??hu()),this.theme$=this._theme.asObservable()}toggle(){this._theme.next(this._theme.getValue()==="dark"?"light":"dark")}apply(){return this.theme$.pipe(mr(e=>{if(localStorage.setItem(ns,e),e==="light"){document.documentElement.classList.remove("sl-theme-dark");return}document.documentElement.classList.add("sl-theme-dark")}),jr({bufferSize:1,refCount:!0}))}}var pu=Object.defineProperty,fu=Object.getOwnPropertyDescriptor,zt=(t,e,r,o)=>{for(var n=o>1?void 0:o?fu(e,r):e,i=t.length-1,s;i>=0;i--)(s=t[i])&&(n=(o?s(e,r,n):s(n))||n);return o&&n&&pu(e,r,n),n};let bt=class extends Me{constructor(){super(...arguments),this.router=new lu(this,[{path:"/dadmaxxing{/}?",render:()=>C`<app-post-list tags=${Xc}></app-post-list>`},{path:"/dadmaxxing/family{/}?",render:()=>C`<app-post-list tags=${["family"]}></app-post-list>`},{path:"/dadmaxxing/climbing{/}?",render:()=>C`<app-post-list tags=${["climbing"]}></app-post-list>`},{path:"/dadmaxxing/gaming{/}?",render:()=>C`<app-post-list tags=${["gaming"]}></app-post-list>`},{path:"/dadmaxxing/anime{/}?",render:()=>C`<app-post-list tags=${["anime"]}></app-post-list>`},{path:"/dadmaxxing/*",render:()=>C`<app-post-list tags=${[]}></app-post-list>`}]),this.theme=new du,this.blog=new ou}render(){return C`
      <main>
        <div>
          <app-header></app-header>
          ${this.router.outlet()}
        </div>
        <app-footer></app-footer>
      </main>
    `}};zt([wo({context:Eo})],bt.prototype,"router",2);zt([wo({context:os})],bt.prototype,"theme",2);zt([pt(t=>t.theme.apply())],bt.prototype,"applyTheme",2);zt([wo({context:br})],bt.prototype,"blog",2);zt([pt(t=>t.blog.load$)],bt.prototype,"load",2);zt([pt(t=>t.blog.meta$.pipe(mr(e=>{document.title=e.title,Xn(C`<link rel="icon" type="image/png" href=${e.avatar}></link>`,document.head)})))],bt.prototype,"meta",2);zt([pt(t=>t.router.pathname$.pipe(mr(()=>{const e=location.hash.replace(/^#/,""),r=document.getElementById(e);r?r.scrollIntoView({behavior:"smooth"}):window.scrollTo(0,0)})))],bt.prototype,"navigation",2);bt=zt([Te("app-root")],bt);var mu=Object.defineProperty,bu=Object.getOwnPropertyDescriptor,Co=(t,e,r,o)=>{for(var n=o>1?void 0:o?bu(e,r):e,i=t.length-1,s;i>=0;i--)(s=t[i])&&(n=(o?s(e,r,n):s(n))||n);return o&&n&&mu(e,r,n),n};let rr=class extends Me{render(){const t=this.meta?.updated??0,e=new Date(t*1e3).toISOString();return C`
      <footer>
        <div>
          <span>Last updated on</span>
          <sl-format-date
            month="long"
            day="numeric"
            year="numeric"
            date=${e}
          ></sl-format-date>
        </div>
        <div>
          <sl-button @click=${()=>window.scrollTo(0,0)}>scroll up</sl-button>
        </div>
      </footer>
    `}};Co([be({context:br})],rr.prototype,"blog",2);Co([pt(t=>t.blog.meta$)],rr.prototype,"meta",2);rr=Co([Te("app-footer")],rr);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Wr extends po{constructor(e){if(super(e),this.it=L,e.type!==xt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===L||e==null)return this._t=void 0,this.it=e;if(e===J)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}}Wr.directiveName="unsafeHTML",Wr.resultType=1;const is=ho(Wr);var vu=Object.defineProperty,gu=Object.getOwnPropertyDescriptor,Gt=(t,e,r,o)=>{for(var n=o>1?void 0:o?gu(e,r):e,i=t.length-1,s;i>=0;i--)(s=t[i])&&(n=(o?s(e,r,n):s(n))||n);return o&&n&&vu(e,r,n),n};const yu=[{label:"Home",href:"/dadmaxxing"},{label:"Family",href:"/dadmaxxing/family"},{label:"Climbing",href:"/dadmaxxing/climbing"},{label:"Gaming",href:"/dadmaxxing/gaming"},{label:"Anime",href:"/dadmaxxing/anime"},{label:"Source",href:"https://github.com/defevan/dadmaxxing"}];let Ot=class extends Me{render(){const t=this.meta?C`<p>${this.meta.description}</p>`:C`<p>${is("&nbsp;")}</p>`;return C`
      <header>
        <div>
          <h1>${this.meta?.title??"..."}</h1>
          ${t}
        </div>
        <div>
          <nav>${yu.map(e=>this.renderLink(e))}</nav>
          <div class="switch-container">
            <sl-switch
              ?checked=${this.activeTheme==="dark"}
              @sl-change=${()=>this.theme.toggle()}
              >dark mode</sl-switch
            >
          </div>
        </div>
      </header>
    `}renderLink({href:t,label:e}){if(t.includes("https://"))return C`<a href=${t}>${e}</a>`;const r=this.pathname===t;return C`<a href=${t} ?active=${r}>${e}</a>`}};Gt([be({context:br})],Ot.prototype,"blog",2);Gt([be({context:Eo})],Ot.prototype,"router",2);Gt([be({context:os})],Ot.prototype,"theme",2);Gt([pt(t=>t.blog.meta$)],Ot.prototype,"meta",2);Gt([pt(t=>t.router.pathname$)],Ot.prototype,"pathname",2);Gt([pt(t=>t.theme.theme$)],Ot.prototype,"activeTheme",2);Ot=Gt([Te("app-header")],Ot);function wu(t){return new H(e=>{const r=new MutationObserver(()=>e.next());return r.observe(t,{childList:!0,subtree:!0}),()=>r.disconnect()})}var _u=Object.defineProperty,xu=Object.getOwnPropertyDescriptor,Lt=(t,e,r,o)=>{for(var n=o>1?void 0:o?xu(e,r):e,i=t.length-1,s;i>=0;i--)(s=t[i])&&(n=(o?s(e,r,n):s(n))||n);return o&&n&&_u(e,r,n),n};let or=class extends Me{constructor(){super(...arguments),this.body=""}render(){return C` <section>${is(this.body)}</section> `}};Lt([f({attribute:!0})],or.prototype,"body",2);Lt([pt(t=>wu(t).pipe(mr(()=>{const e=[...t.querySelectorAll("figure")].flatMap(r=>{const o=parseFloat(r.getAttribute("data-orig-height")??""),n=parseFloat(r.getAttribute("data-orig-width")??"");return[...r.querySelectorAll("img"),...r.querySelectorAll("video")].map(s=>({media:s,h:o,w:n}))});for(const{media:r,h:o,w:n}of e){if(isNaN(o)||isNaN(n)){console.warn("failed to set img/video aspect ratio");continue}r.style.aspectRatio=`${n} / ${o}`}})))],or.prototype,"node",2);or=Lt([Te("app-post-body")],or);let de=class extends Me{constructor(){super(...arguments),this.tags=[]}render(){const t=(this.posts??[]).filter(e=>e.tags.some(r=>this.tags.includes(r)));return t.length<1&&Array.isArray(this.posts)?C` <div class="empty">(⁎˃ᆺ˂) 404</div> `:C`
      <ul>
        ${t.map(e=>this.renderPost(e))}
      </ul>
    `}renderPost(t){const e=new Date(t.date),r=`${location.origin}${location.pathname}#${t.id}`;return C`
      <li tabindex="0" id=${t.id}>
        <sl-card>
          <div slot="header">
            <sl-format-date
              month="long"
              day="numeric"
              year="numeric"
              date=${e.toISOString()}
            ></sl-format-date>
            <a href=${`#${t.id}`}>
              <sl-copy-button value=${r}></sl-copy-button>
            </a>
          </div>
          <slot>
            <app-post-body body=${t.body}></app-post-body>
          </slot>
          <div slot="footer">
            ${t.tags.map(o=>this.renderTag(o))}
          </div>
        </sl-card>
      </li>

      <li></li>
    `}renderTag(t){const e=`/dadmaxxing/${t}`,r=`#${t}`;return C`
      <a href=${e}>
        <sl-tag pill>${r}</sl-tag>
      </a>
    `}};Lt([be({context:br})],de.prototype,"blog",2);Lt([be({context:Eo})],de.prototype,"router",2);Lt([pt(t=>t.blog.posts$)],de.prototype,"posts",2);Lt([f({attribute:!0})],de.prototype,"tags",2);de=Lt([Te("app-post-list")],de);
