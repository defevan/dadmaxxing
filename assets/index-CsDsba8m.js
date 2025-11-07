(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(i){if(i.ep)return;i.ep=!0;const n=r(i);fetch(i.href,n)}})();window.requestIdleCallback=window.requestIdleCallback||function(t){var e=Date.now();return setTimeout(function(){t({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-e))}})},1)};window.cancelIdleCallback=window.cancelIdleCallback||function(t){clearTimeout(t)};var Cs=Object.defineProperty,x=(t,e)=>Cs(t,"name",{value:e,configurable:!0}),ne=class{type=3;name="";prefix="";value="";suffix="";modifier=3;constructor(e,r,o,i,n,s){this.type=e,this.name=r,this.prefix=o,this.value=i,this.suffix=n,this.modifier=s}hasCustomName(){return this.name!==""&&typeof this.name!="number"}};x(ne,"Part");var Es=/[$_\p{ID_Start}]/u,Os=/[$_\u200C\u200D\p{ID_Continue}]/u,Mr=".*";function Ci(t,e){return(e?/^[\x00-\xFF]*$/:/^[\x00-\x7F]*$/).test(t)}x(Ci,"isASCII");function to(t,e=!1){let r=[],o=0;for(;o<t.length;){let i=t[o],n=x(function(s){if(!e)throw new TypeError(s);r.push({type:"INVALID_CHAR",index:o,value:t[o++]})},"ErrorOrInvalid");if(i==="*"){r.push({type:"ASTERISK",index:o,value:t[o++]});continue}if(i==="+"||i==="?"){r.push({type:"OTHER_MODIFIER",index:o,value:t[o++]});continue}if(i==="\\"){r.push({type:"ESCAPED_CHAR",index:o++,value:t[o++]});continue}if(i==="{"){r.push({type:"OPEN",index:o,value:t[o++]});continue}if(i==="}"){r.push({type:"CLOSE",index:o,value:t[o++]});continue}if(i===":"){let s="",a=o+1;for(;a<t.length;){let l=t.substr(a,1);if(a===o+1&&Es.test(l)||a!==o+1&&Os.test(l)){s+=t[a++];continue}break}if(!s){n(`Missing parameter name at ${o}`);continue}r.push({type:"NAME",index:o,value:s}),o=a;continue}if(i==="("){let s=1,a="",l=o+1,c=!1;if(t[l]==="?"){n(`Pattern cannot start with "?" at ${l}`);continue}for(;l<t.length;){if(!Ci(t[l],!1)){n(`Invalid character '${t[l]}' at ${l}.`),c=!0;break}if(t[l]==="\\"){a+=t[l++]+t[l++];continue}if(t[l]===")"){if(s--,s===0){l++;break}}else if(t[l]==="("&&(s++,t[l+1]!=="?")){n(`Capturing groups are not allowed at ${l}`),c=!0;break}a+=t[l++]}if(c)continue;if(s){n(`Unbalanced pattern at ${o}`);continue}if(!a){n(`Missing pattern at ${o}`);continue}r.push({type:"REGEX",index:o,value:a}),o=l;continue}r.push({type:"CHAR",index:o,value:t[o++]})}return r.push({type:"END",index:o,value:""}),r}x(to,"lexer");function eo(t,e={}){let r=to(t);e.delimiter??="/#?",e.prefixes??="./";let o=`[^${G(e.delimiter)}]+?`,i=[],n=0,s=0,a=new Set,l=x(w=>{if(s<r.length&&r[s].type===w)return r[s++].value},"tryConsume"),c=x(()=>l("OTHER_MODIFIER")??l("ASTERISK"),"tryConsumeModifier"),h=x(w=>{let $=l(w);if($!==void 0)return $;let{type:A,index:S}=r[s];throw new TypeError(`Unexpected ${A} at ${S}, expected ${w}`)},"mustConsume"),d=x(()=>{let w="",$;for(;$=l("CHAR")??l("ESCAPED_CHAR");)w+=$;return w},"consumeText"),p=x(w=>w,"DefaultEncodePart"),u=e.encodePart||p,m="",v=x(w=>{m+=w},"appendToPendingFixedValue"),_=x(()=>{m.length&&(i.push(new ne(3,"","",u(m),"",3)),m="")},"maybeAddPartFromPendingFixedValue"),g=x((w,$,A,S,R)=>{let O=3;switch(R){case"?":O=1;break;case"*":O=0;break;case"+":O=2;break}if(!$&&!A&&O===3){v(w);return}if(_(),!$&&!A){if(!w)return;i.push(new ne(3,"","",u(w),"",O));return}let L;A?A==="*"?L=Mr:L=A:L=o;let B=2;L===o?(B=1,L=""):L===Mr&&(B=0,L="");let I;if($?I=$:A&&(I=n++),a.has(I))throw new TypeError(`Duplicate name '${I}'.`);a.add(I),i.push(new ne(B,I,u(w),L,u(S),O))},"addPart");for(;s<r.length;){let w=l("CHAR"),$=l("NAME"),A=l("REGEX");if(!$&&!A&&(A=l("ASTERISK")),$||A){let R=w??"";e.prefixes.indexOf(R)===-1&&(v(R),R=""),_();let O=c();g(R,$,A,"",O);continue}let S=w??l("ESCAPED_CHAR");if(S){v(S);continue}if(l("OPEN")){let R=d(),O=l("NAME"),L=l("REGEX");!O&&!L&&(L=l("ASTERISK"));let B=d();h("CLOSE");let I=c();g(R,O,L,B,I);continue}_(),h("END")}return i}x(eo,"parse");function G(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}x(G,"escapeString");function Dr(t){return t&&t.ignoreCase?"ui":"u"}x(Dr,"flags");function Ei(t,e,r){return ro(eo(t,r),e,r)}x(Ei,"stringToRegexp");function jt(t){switch(t){case 0:return"*";case 1:return"?";case 2:return"+";case 3:return""}}x(jt,"modifierToString");function ro(t,e,r={}){r.delimiter??="/#?",r.prefixes??="./",r.sensitive??=!1,r.strict??=!1,r.end??=!0,r.start??=!0,r.endsWith="";let o=r.start?"^":"";for(let a of t){if(a.type===3){a.modifier===3?o+=G(a.value):o+=`(?:${G(a.value)})${jt(a.modifier)}`;continue}e&&e.push(a.name);let l=`[^${G(r.delimiter)}]+?`,c=a.value;if(a.type===1?c=l:a.type===0&&(c=Mr),!a.prefix.length&&!a.suffix.length){a.modifier===3||a.modifier===1?o+=`(${c})${jt(a.modifier)}`:o+=`((?:${c})${jt(a.modifier)})`;continue}if(a.modifier===3||a.modifier===1){o+=`(?:${G(a.prefix)}(${c})${G(a.suffix)})`,o+=jt(a.modifier);continue}o+=`(?:${G(a.prefix)}`,o+=`((?:${c})(?:`,o+=G(a.suffix),o+=G(a.prefix),o+=`(?:${c}))*)${G(a.suffix)})`,a.modifier===0&&(o+="?")}let i=`[${G(r.endsWith)}]|$`,n=`[${G(r.delimiter)}]`;if(r.end)return r.strict||(o+=`${n}?`),r.endsWith.length?o+=`(?=${i})`:o+="$",new RegExp(o,Dr(r));r.strict||(o+=`(?:${n}(?=${i}))?`);let s=!1;if(t.length){let a=t[t.length-1];a.type===3&&a.modifier===3&&(s=r.delimiter.indexOf(a)>-1)}return s||(o+=`(?=${n}|${i})`),new RegExp(o,Dr(r))}x(ro,"partsToRegexp");var $t={delimiter:"",prefixes:"",sensitive:!0,strict:!0},Ps={delimiter:".",prefixes:"",sensitive:!0,strict:!0},Rs={delimiter:"/",prefixes:"/",sensitive:!0,strict:!0};function Oi(t,e){return t.length?t[0]==="/"?!0:!e||t.length<2?!1:(t[0]=="\\"||t[0]=="{")&&t[1]=="/":!1}x(Oi,"isAbsolutePathname");function oo(t,e){return t.startsWith(e)?t.substring(e.length,t.length):t}x(oo,"maybeStripPrefix");function Pi(t,e){return t.endsWith(e)?t.substr(0,t.length-e.length):t}x(Pi,"maybeStripSuffix");function io(t){return!t||t.length<2?!1:t[0]==="["||(t[0]==="\\"||t[0]==="{")&&t[1]==="["}x(io,"treatAsIPv6Hostname");var Ri=["ftp","file","http","https","ws","wss"];function no(t){if(!t)return!0;for(let e of Ri)if(t.test(e))return!0;return!1}x(no,"isSpecialScheme");function Ti(t,e){if(t=oo(t,"#"),e||t==="")return t;let r=new URL("https://example.com");return r.hash=t,r.hash?r.hash.substring(1,r.hash.length):""}x(Ti,"canonicalizeHash");function Li(t,e){if(t=oo(t,"?"),e||t==="")return t;let r=new URL("https://example.com");return r.search=t,r.search?r.search.substring(1,r.search.length):""}x(Li,"canonicalizeSearch");function zi(t,e){return e||t===""?t:io(t)?lo(t):ao(t)}x(zi,"canonicalizeHostname");function Ii(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.password=t,r.password}x(Ii,"canonicalizePassword");function Mi(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.username=t,r.username}x(Mi,"canonicalizeUsername");function Di(t,e,r){if(r||t==="")return t;if(e&&!Ri.includes(e))return new URL(`${e}:${t}`).pathname;let o=t[0]=="/";return t=new URL(o?t:"/-"+t,"https://example.com").pathname,o||(t=t.substring(2,t.length)),t}x(Di,"canonicalizePathname");function ji(t,e,r){return so(e)===t&&(t=""),r||t===""?t:co(t)}x(ji,"canonicalizePort");function Ni(t,e){return t=Pi(t,":"),e||t===""?t:dr(t)}x(Ni,"canonicalizeProtocol");function so(t){switch(t){case"ws":case"http":return"80";case"wws":case"https":return"443";case"ftp":return"21";default:return""}}x(so,"defaultPortForProtocol");function dr(t){if(t==="")return t;if(/^[-+.A-Za-z0-9]*$/.test(t))return t.toLowerCase();throw new TypeError(`Invalid protocol '${t}'.`)}x(dr,"protocolEncodeCallback");function Bi(t){if(t==="")return t;let e=new URL("https://example.com");return e.username=t,e.username}x(Bi,"usernameEncodeCallback");function Ui(t){if(t==="")return t;let e=new URL("https://example.com");return e.password=t,e.password}x(Ui,"passwordEncodeCallback");function ao(t){if(t==="")return t;if(/[\t\n\r #%/:<>?@[\]^\\|]/g.test(t))throw new TypeError(`Invalid hostname '${t}'`);let e=new URL("https://example.com");return e.hostname=t,e.hostname}x(ao,"hostnameEncodeCallback");function lo(t){if(t==="")return t;if(/[^0-9a-fA-F[\]:]/g.test(t))throw new TypeError(`Invalid IPv6 hostname '${t}'`);return t.toLowerCase()}x(lo,"ipv6HostnameEncodeCallback");function co(t){if(t===""||/^[0-9]*$/.test(t)&&parseInt(t)<=65535)return t;throw new TypeError(`Invalid port '${t}'.`)}x(co,"portEncodeCallback");function Fi(t){if(t==="")return t;let e=new URL("https://example.com");return e.pathname=t[0]!=="/"?"/-"+t:t,t[0]!=="/"?e.pathname.substring(2,e.pathname.length):e.pathname}x(Fi,"standardURLPathnameEncodeCallback");function Vi(t){return t===""?t:new URL(`data:${t}`).pathname}x(Vi,"pathURLPathnameEncodeCallback");function Hi(t){if(t==="")return t;let e=new URL("https://example.com");return e.search=t,e.search.substring(1,e.search.length)}x(Hi,"searchEncodeCallback");function Wi(t){if(t==="")return t;let e=new URL("https://example.com");return e.hash=t,e.hash.substring(1,e.hash.length)}x(Wi,"hashEncodeCallback");var qi=class{#e;#i=[];#r={};#t=0;#n=1;#c=0;#a=0;#f=0;#p=0;#m=!1;constructor(e){this.#e=e}get result(){return this.#r}parse(){for(this.#i=to(this.#e,!0);this.#t<this.#i.length;this.#t+=this.#n){if(this.#n=1,this.#i[this.#t].type==="END"){if(this.#a===0){this.#y(),this.#u()?this.#o(9,1):this.#h()?this.#o(8,1):this.#o(7,0);continue}else if(this.#a===2){this.#d(5);continue}this.#o(10,0);break}if(this.#f>0)if(this.#S())this.#f-=1;else continue;if(this.#A()){this.#f+=1;continue}switch(this.#a){case 0:this.#w()&&this.#d(1);break;case 1:if(this.#w()){this.#O();let e=7,r=1;this.#x()?(e=2,r=3):this.#m&&(e=2),this.#o(e,r)}break;case 2:this.#v()?this.#d(3):(this.#g()||this.#h()||this.#u())&&this.#d(5);break;case 3:this.#$()?this.#o(4,1):this.#v()&&this.#o(5,1);break;case 4:this.#v()&&this.#o(5,1);break;case 5:this.#C()?this.#p+=1:this.#E()&&(this.#p-=1),this.#k()&&!this.#p?this.#o(6,1):this.#g()?this.#o(7,0):this.#h()?this.#o(8,1):this.#u()&&this.#o(9,1);break;case 6:this.#g()?this.#o(7,0):this.#h()?this.#o(8,1):this.#u()&&this.#o(9,1);break;case 7:this.#h()?this.#o(8,1):this.#u()&&this.#o(9,1);break;case 8:this.#u()&&this.#o(9,1);break}}this.#r.hostname!==void 0&&this.#r.port===void 0&&(this.#r.port="")}#o(e,r){switch(this.#a){case 0:break;case 1:this.#r.protocol=this.#l();break;case 2:break;case 3:this.#r.username=this.#l();break;case 4:this.#r.password=this.#l();break;case 5:this.#r.hostname=this.#l();break;case 6:this.#r.port=this.#l();break;case 7:this.#r.pathname=this.#l();break;case 8:this.#r.search=this.#l();break;case 9:this.#r.hash=this.#l();break}this.#a!==0&&e!==10&&([1,2,3,4].includes(this.#a)&&[6,7,8,9].includes(e)&&(this.#r.hostname??=""),[1,2,3,4,5,6].includes(this.#a)&&[8,9].includes(e)&&(this.#r.pathname??=this.#m?"/":""),[1,2,3,4,5,6,7].includes(this.#a)&&e===9&&(this.#r.search??="")),this.#_(e,r)}#_(e,r){this.#a=e,this.#c=this.#t+r,this.#t+=r,this.#n=0}#y(){this.#t=this.#c,this.#n=0}#d(e){this.#y(),this.#a=e}#b(e){return e<0&&(e=this.#i.length-e),e<this.#i.length?this.#i[e]:this.#i[this.#i.length-1]}#s(e,r){let o=this.#b(e);return o.value===r&&(o.type==="CHAR"||o.type==="ESCAPED_CHAR"||o.type==="INVALID_CHAR")}#w(){return this.#s(this.#t,":")}#x(){return this.#s(this.#t+1,"/")&&this.#s(this.#t+2,"/")}#v(){return this.#s(this.#t,"@")}#$(){return this.#s(this.#t,":")}#k(){return this.#s(this.#t,":")}#g(){return this.#s(this.#t,"/")}#h(){if(this.#s(this.#t,"?"))return!0;if(this.#i[this.#t].value!=="?")return!1;let e=this.#b(this.#t-1);return e.type!=="NAME"&&e.type!=="REGEX"&&e.type!=="CLOSE"&&e.type!=="ASTERISK"}#u(){return this.#s(this.#t,"#")}#A(){return this.#i[this.#t].type=="OPEN"}#S(){return this.#i[this.#t].type=="CLOSE"}#C(){return this.#s(this.#t,"[")}#E(){return this.#s(this.#t,"]")}#l(){let e=this.#i[this.#t],r=this.#b(this.#c).index;return this.#e.substring(r,e.index)}#O(){let e={};Object.assign(e,$t),e.encodePart=dr;let r=Ei(this.#l(),void 0,e);this.#m=no(r)}};x(qi,"Parser");var Ar=["protocol","username","password","hostname","port","pathname","search","hash"],xt="*";function jr(t,e){if(typeof t!="string")throw new TypeError("parameter 1 is not of type 'string'.");let r=new URL(t,e);return{protocol:r.protocol.substring(0,r.protocol.length-1),username:r.username,password:r.password,hostname:r.hostname,port:r.port,pathname:r.pathname,search:r.search!==""?r.search.substring(1,r.search.length):void 0,hash:r.hash!==""?r.hash.substring(1,r.hash.length):void 0}}x(jr,"extractValues");function at(t,e){return e?re(t):t}x(at,"processBaseURLString");function te(t,e,r){let o;if(typeof e.baseURL=="string")try{o=new URL(e.baseURL),e.protocol===void 0&&(t.protocol=at(o.protocol.substring(0,o.protocol.length-1),r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&(t.username=at(o.username,r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&e.password===void 0&&(t.password=at(o.password,r)),e.protocol===void 0&&e.hostname===void 0&&(t.hostname=at(o.hostname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&(t.port=at(o.port,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&(t.pathname=at(o.pathname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&(t.search=at(o.search.substring(1,o.search.length),r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&e.hash===void 0&&(t.hash=at(o.hash.substring(1,o.hash.length),r))}catch{throw new TypeError(`invalid baseURL '${e.baseURL}'.`)}if(typeof e.protocol=="string"&&(t.protocol=Ni(e.protocol,r)),typeof e.username=="string"&&(t.username=Mi(e.username,r)),typeof e.password=="string"&&(t.password=Ii(e.password,r)),typeof e.hostname=="string"&&(t.hostname=zi(e.hostname,r)),typeof e.port=="string"&&(t.port=ji(e.port,t.protocol,r)),typeof e.pathname=="string"){if(t.pathname=e.pathname,o&&!Oi(t.pathname,r)){let i=o.pathname.lastIndexOf("/");i>=0&&(t.pathname=at(o.pathname.substring(0,i+1),r)+t.pathname)}t.pathname=Di(t.pathname,t.protocol,r)}return typeof e.search=="string"&&(t.search=Li(e.search,r)),typeof e.hash=="string"&&(t.hash=Ti(e.hash,r)),t}x(te,"applyInit");function re(t){return t.replace(/([+*?:{}()\\])/g,"\\$1")}x(re,"escapePatternString");function Gi(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}x(Gi,"escapeRegexpString");function Ki(t,e){e.delimiter??="/#?",e.prefixes??="./",e.sensitive??=!1,e.strict??=!1,e.end??=!0,e.start??=!0,e.endsWith="";let r=".*",o=`[^${Gi(e.delimiter)}]+?`,i=/[$_\u200C\u200D\p{ID_Continue}]/u,n="";for(let s=0;s<t.length;++s){let a=t[s];if(a.type===3){if(a.modifier===3){n+=re(a.value);continue}n+=`{${re(a.value)}}${jt(a.modifier)}`;continue}let l=a.hasCustomName(),c=!!a.suffix.length||!!a.prefix.length&&(a.prefix.length!==1||!e.prefixes.includes(a.prefix)),h=s>0?t[s-1]:null,d=s<t.length-1?t[s+1]:null;if(!c&&l&&a.type===1&&a.modifier===3&&d&&!d.prefix.length&&!d.suffix.length)if(d.type===3){let p=d.value.length>0?d.value[0]:"";c=i.test(p)}else c=!d.hasCustomName();if(!c&&!a.prefix.length&&h&&h.type===3){let p=h.value[h.value.length-1];c=e.prefixes.includes(p)}c&&(n+="{"),n+=re(a.prefix),l&&(n+=`:${a.name}`),a.type===2?n+=`(${a.value})`:a.type===1?l||(n+=`(${o})`):a.type===0&&(!l&&(!h||h.type===3||h.modifier!==3||c||a.prefix!=="")?n+="*":n+=`(${r})`),a.type===1&&l&&a.suffix.length&&i.test(a.suffix[0])&&(n+="\\"),n+=re(a.suffix),c&&(n+="}"),a.modifier!==3&&(n+=jt(a.modifier))}return n}x(Ki,"partsToPattern");var Yi=class{#e;#i={};#r={};#t={};#n={};#c=!1;constructor(t={},e,r){try{let o;if(typeof e=="string"?o=e:r=e,typeof t=="string"){let a=new qi(t);if(a.parse(),t=a.result,o===void 0&&typeof t.protocol!="string")throw new TypeError("A base URL must be provided for a relative constructor string.");t.baseURL=o}else{if(!t||typeof t!="object")throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");if(o)throw new TypeError("parameter 1 is not of type 'string'.")}typeof r>"u"&&(r={ignoreCase:!1});let i={ignoreCase:r.ignoreCase===!0},n={pathname:xt,protocol:xt,username:xt,password:xt,hostname:xt,port:xt,search:xt,hash:xt};this.#e=te(n,t,!0),so(this.#e.protocol)===this.#e.port&&(this.#e.port="");let s;for(s of Ar){if(!(s in this.#e))continue;let a={},l=this.#e[s];switch(this.#r[s]=[],s){case"protocol":Object.assign(a,$t),a.encodePart=dr;break;case"username":Object.assign(a,$t),a.encodePart=Bi;break;case"password":Object.assign(a,$t),a.encodePart=Ui;break;case"hostname":Object.assign(a,Ps),io(l)?a.encodePart=lo:a.encodePart=ao;break;case"port":Object.assign(a,$t),a.encodePart=co;break;case"pathname":no(this.#i.protocol)?(Object.assign(a,Rs,i),a.encodePart=Fi):(Object.assign(a,$t,i),a.encodePart=Vi);break;case"search":Object.assign(a,$t,i),a.encodePart=Hi;break;case"hash":Object.assign(a,$t,i),a.encodePart=Wi;break}try{this.#n[s]=eo(l,a),this.#i[s]=ro(this.#n[s],this.#r[s],a),this.#t[s]=Ki(this.#n[s],a),this.#c=this.#c||this.#n[s].some(c=>c.type===2)}catch{throw new TypeError(`invalid ${s} pattern '${this.#e[s]}'.`)}}}catch(o){throw new TypeError(`Failed to construct 'URLPattern': ${o.message}`)}}get[Symbol.toStringTag](){return"URLPattern"}test(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return!1;try{typeof t=="object"?r=te(r,t,!1):r=te(r,jr(t,e),!1)}catch{return!1}let o;for(o of Ar)if(!this.#i[o].exec(r[o]))return!1;return!0}exec(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return;try{typeof t=="object"?r=te(r,t,!1):r=te(r,jr(t,e),!1)}catch{return null}let o={};e?o.inputs=[t,e]:o.inputs=[t];let i;for(i of Ar){let n=this.#i[i].exec(r[i]);if(!n)return null;let s={};for(let[a,l]of this.#r[i].entries())if(typeof l=="string"||typeof l=="number"){let c=n[a+1];s[l]=c}o[i]={input:r[i]??"",groups:s}}return o}static compareComponent(t,e,r){let o=x((a,l)=>{for(let c of["type","modifier","prefix","value","suffix"]){if(a[c]<l[c])return-1;if(a[c]!==l[c])return 1}return 0},"comparePart"),i=new ne(3,"","","","",3),n=new ne(0,"","","","",3),s=x((a,l)=>{let c=0;for(;c<Math.min(a.length,l.length);++c){let h=o(a[c],l[c]);if(h)return h}return a.length===l.length?0:o(a[c]??i,l[c]??i)},"comparePartList");return!e.#t[t]&&!r.#t[t]?0:e.#t[t]&&!r.#t[t]?s(e.#n[t],[n]):!e.#t[t]&&r.#t[t]?s([n],r.#n[t]):s(e.#n[t],r.#n[t])}get protocol(){return this.#t.protocol}get username(){return this.#t.username}get password(){return this.#t.password}get hostname(){return this.#t.hostname}get port(){return this.#t.port}get pathname(){return this.#t.pathname}get search(){return this.#t.search}get hash(){return this.#t.hash}get hasRegExpGroups(){return this.#c}};x(Yi,"URLPattern");globalThis.URLPattern||(globalThis.URLPattern=Yi);const Nr=new Set,oe=new Map;let Dt,uo="ltr",ho="en";const Zi=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Zi){const t=new MutationObserver(Ji);uo=document.documentElement.dir||"ltr",ho=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Xi(...t){t.map(e=>{const r=e.$code.toLowerCase();oe.has(r)?oe.set(r,Object.assign(Object.assign({},oe.get(r)),e)):oe.set(r,e),Dt||(Dt=e)}),Ji()}function Ji(){Zi&&(uo=document.documentElement.dir||"ltr",ho=document.documentElement.lang||navigator.language),[...Nr.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}let Ts=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Nr.add(this.host)}hostDisconnected(){Nr.delete(this.host)}dir(){return`${this.host.dir||uo}`.toLowerCase()}lang(){return`${this.host.lang||ho}`.toLowerCase()}getTranslationData(e){var r,o;const i=new Intl.Locale(e.replace(/_/g,"-")),n=i?.language.toLowerCase(),s=(o=(r=i?.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",a=oe.get(`${n}-${s}`),l=oe.get(n);return{locale:i,language:n,region:s,primary:a,secondary:l}}exists(e,r){var o;const{primary:i,secondary:n}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(i&&i[e]||n&&n[e]||r.includeFallback&&Dt&&Dt[e])}term(e,...r){const{primary:o,secondary:i}=this.getTranslationData(this.lang());let n;if(o&&o[e])n=o[e];else if(i&&i[e])n=i[e];else if(Dt&&Dt[e])n=Dt[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof n=="function"?n(...r):n}date(e,r){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),r).format(e)}number(e,r){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),r).format(e)}relativeTime(e,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,r)}};var Qi={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};Xi(Qi);var Ls=Qi,Gt=class extends Ts{};Xi(Ls);var tn=Object.defineProperty,zs=Object.defineProperties,Is=Object.getOwnPropertyDescriptor,Ms=Object.getOwnPropertyDescriptors,Mo=Object.getOwnPropertySymbols,Ds=Object.prototype.hasOwnProperty,js=Object.prototype.propertyIsEnumerable,en=t=>{throw TypeError(t)},Do=(t,e,r)=>e in t?tn(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Kt=(t,e)=>{for(var r in e||(e={}))Ds.call(e,r)&&Do(t,r,e[r]);if(Mo)for(var r of Mo(e))js.call(e,r)&&Do(t,r,e[r]);return t},fr=(t,e)=>zs(t,Ms(e)),f=(t,e,r,o)=>{for(var i=o>1?void 0:o?Is(e,r):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&tn(e,r,i),i},rn=(t,e,r)=>e.has(t)||en("Cannot "+r),Ns=(t,e,r)=>(rn(t,e,"read from private field"),e.get(t)),Bs=(t,e,r)=>e.has(t)?en("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),Us=(t,e,r,o)=>(rn(t,e,"write to private field"),e.set(t,r),r);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ke=globalThis,fo=Ke.ShadowRoot&&(Ke.ShadyCSS===void 0||Ke.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,po=Symbol(),jo=new WeakMap;let on=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==po)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(fo&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=jo.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&jo.set(r,e))}return e}toString(){return this.cssText}};const Fs=t=>new on(typeof t=="string"?t:t+"",void 0,po),Q=(t,...e)=>{const r=t.length===1?t[0]:e.reduce(((o,i,n)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1]),t[0]);return new on(r,t,po)},Vs=(t,e)=>{if(fo)t.adoptedStyleSheets=e.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of e){const o=document.createElement("style"),i=Ke.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}},No=fo?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return Fs(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Hs,defineProperty:Ws,getOwnPropertyDescriptor:qs,getOwnPropertyNames:Gs,getOwnPropertySymbols:Ks,getPrototypeOf:Ys}=Object,pr=globalThis,Bo=pr.trustedTypes,Zs=Bo?Bo.emptyScript:"",Xs=pr.reactiveElementPolyfillSupport,Ce=(t,e)=>t,ce={toAttribute(t,e){switch(e){case Boolean:t=t?Zs:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},mo=(t,e)=>!Hs(t,e),Uo={attribute:!0,type:String,converter:ce,reflect:!1,useDefault:!1,hasChanged:mo};Symbol.metadata??=Symbol("metadata"),pr.litPropertyMetadata??=new WeakMap;let ee=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Uo){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,r);i!==void 0&&Ws(this.prototype,e,i)}}static getPropertyDescriptor(e,r,o){const{get:i,set:n}=qs(this.prototype,e)??{get(){return this[r]},set(s){this[r]=s}};return{get:i,set(s){const a=i?.call(this);n?.call(this,s),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Uo}static _$Ei(){if(this.hasOwnProperty(Ce("elementProperties")))return;const e=Ys(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ce("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ce("properties"))){const r=this.properties,o=[...Gs(r),...Ks(r)];for(const i of o)this.createProperty(i,r[i])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,i]of r)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const i=this._$Eu(r,o);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const i of o)r.unshift(No(i))}else e!==void 0&&r.push(No(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Vs(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(i!==void 0&&o.reflect===!0){const n=(o.converter?.toAttribute!==void 0?o.converter:ce).toAttribute(r,o.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,r){const o=this.constructor,i=o._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const n=o.getPropertyOptions(i),s=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ce;this._$Em=i;const a=s.fromAttribute(r,n.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,r,o){if(e!==void 0){const i=this.constructor,n=this[e];if(o??=i.getPropertyOptions(e),!((o.hasChanged??mo)(n,r)||o.useDefault&&o.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:i,wrapped:n},s){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??r??this[e]),n!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[i,n]of o){const{wrapped:s}=n,a=this[i];s!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,n,a)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),this._$EO?.forEach((o=>o.hostUpdate?.())),this.update(r)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(r)}willUpdate(e){}_$AE(e){this._$EO?.forEach((r=>r.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};ee.elementStyles=[],ee.shadowRootOptions={mode:"open"},ee[Ce("elementProperties")]=new Map,ee[Ce("finalized")]=new Map,Xs?.({ReactiveElement:ee}),(pr.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bo=globalThis,tr=bo.trustedTypes,Fo=tr?tr.createPolicy("lit-html",{createHTML:t=>t}):void 0,nn="$lit$",kt=`lit$${Math.random().toFixed(9).slice(2)}$`,sn="?"+kt,Js=`<${sn}>`,Ft=document,Oe=()=>Ft.createComment(""),Pe=t=>t===null||typeof t!="object"&&typeof t!="function",vo=Array.isArray,Qs=t=>vo(t)||typeof t?.[Symbol.iterator]=="function",Sr=`[ 	
\f\r]`,_e=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Vo=/-->/g,Ho=/>/g,It=RegExp(`>|${Sr}(?:([^\\s"'>=/]+)(${Sr}*=${Sr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Wo=/'/g,qo=/"/g,an=/^(?:script|style|textarea|title)$/i,ta=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),C=ta(1),Y=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),Go=new WeakMap,Nt=Ft.createTreeWalker(Ft,129);function ln(t,e){if(!vo(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fo!==void 0?Fo.createHTML(e):e}const ea=(t,e)=>{const r=t.length-1,o=[];let i,n=e===2?"<svg>":e===3?"<math>":"",s=_e;for(let a=0;a<r;a++){const l=t[a];let c,h,d=-1,p=0;for(;p<l.length&&(s.lastIndex=p,h=s.exec(l),h!==null);)p=s.lastIndex,s===_e?h[1]==="!--"?s=Vo:h[1]!==void 0?s=Ho:h[2]!==void 0?(an.test(h[2])&&(i=RegExp("</"+h[2],"g")),s=It):h[3]!==void 0&&(s=It):s===It?h[0]===">"?(s=i??_e,d=-1):h[1]===void 0?d=-2:(d=s.lastIndex-h[2].length,c=h[1],s=h[3]===void 0?It:h[3]==='"'?qo:Wo):s===qo||s===Wo?s=It:s===Vo||s===Ho?s=_e:(s=It,i=void 0);const u=s===It&&t[a+1].startsWith("/>")?" ":"";n+=s===_e?l+Js:d>=0?(o.push(c),l.slice(0,d)+nn+l.slice(d)+kt+u):l+kt+(d===-2?a:u)}return[ln(t,n+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class Re{constructor({strings:e,_$litType$:r},o){let i;this.parts=[];let n=0,s=0;const a=e.length-1,l=this.parts,[c,h]=ea(e,r);if(this.el=Re.createElement(c,o),Nt.currentNode=this.el.content,r===2||r===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=Nt.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(nn)){const p=h[s++],u=i.getAttribute(d).split(kt),m=/([.?@])?(.*)/.exec(p);l.push({type:1,index:n,name:m[2],strings:u,ctor:m[1]==="."?oa:m[1]==="?"?ia:m[1]==="@"?na:mr}),i.removeAttribute(d)}else d.startsWith(kt)&&(l.push({type:6,index:n}),i.removeAttribute(d));if(an.test(i.tagName)){const d=i.textContent.split(kt),p=d.length-1;if(p>0){i.textContent=tr?tr.emptyScript:"";for(let u=0;u<p;u++)i.append(d[u],Oe()),Nt.nextNode(),l.push({type:2,index:++n});i.append(d[p],Oe())}}}else if(i.nodeType===8)if(i.data===sn)l.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(kt,d+1))!==-1;)l.push({type:7,index:n}),d+=kt.length-1}n++}}static createElement(e,r){const o=Ft.createElement("template");return o.innerHTML=e,o}}function ue(t,e,r=t,o){if(e===Y)return e;let i=o!==void 0?r._$Co?.[o]:r._$Cl;const n=Pe(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(t),i._$AT(t,r,o)),o!==void 0?(r._$Co??=[])[o]=i:r._$Cl=i),i!==void 0&&(e=ue(t,i._$AS(t,e.values),i,o)),e}let ra=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,i=(e?.creationScope??Ft).importNode(r,!0);Nt.currentNode=i;let n=Nt.nextNode(),s=0,a=0,l=o[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new me(n,n.nextSibling,this,e):l.type===1?c=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(c=new sa(n,this,e)),this._$AV.push(c),l=o[++a]}s!==l?.index&&(n=Nt.nextNode(),s++)}return Nt.currentNode=Ft,i}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}};class me{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,r,o,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=ue(this,e,r),Pe(e)?e===T||e==null||e===""?(this._$AH!==T&&this._$AR(),this._$AH=T):e!==this._$AH&&e!==Y&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Qs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==T&&Pe(this._$AH)?this._$AA.nextSibling.data=e:this.T(Ft.createTextNode(e)),this._$AH=e}$(e){const{values:r,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Re.createElement(ln(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(r);else{const n=new ra(i,this),s=n.u(this.options);n.p(r),this.T(s),this._$AH=n}}_$AC(e){let r=Go.get(e.strings);return r===void 0&&Go.set(e.strings,r=new Re(e)),r}k(e){vo(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,i=0;for(const n of e)i===r.length?r.push(o=new me(this.O(Oe()),this.O(Oe()),this,this.options)):o=r[i],o._$AI(n),i++;i<r.length&&(this._$AR(o&&o._$AB.nextSibling,i),r.length=i)}_$AR(e=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);e!==this._$AB;){const o=e.nextSibling;e.remove(),e=o}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class mr{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,i,n){this.type=1,this._$AH=T,this._$AN=void 0,this.element=e,this.name=r,this._$AM=i,this.options=n,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=T}_$AI(e,r=this,o,i){const n=this.strings;let s=!1;if(n===void 0)e=ue(this,e,r,0),s=!Pe(e)||e!==this._$AH&&e!==Y,s&&(this._$AH=e);else{const a=e;let l,c;for(e=n[0],l=0;l<n.length-1;l++)c=ue(this,a[o+l],r,l),c===Y&&(c=this._$AH[l]),s||=!Pe(c)||c!==this._$AH[l],c===T?e=T:e!==T&&(e+=(c??"")+n[l+1]),this._$AH[l]=c}s&&!i&&this.j(e)}j(e){e===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class oa extends mr{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===T?void 0:e}}class ia extends mr{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==T)}}class na extends mr{constructor(e,r,o,i,n){super(e,r,o,i,n),this.type=5}_$AI(e,r=this){if((e=ue(this,e,r,0)??T)===Y)return;const o=this._$AH,i=e===T&&o!==T||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,n=e!==T&&(o===T||i);i&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class sa{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ue(this,e)}}const aa={I:me},la=bo.litHtmlPolyfillSupport;la?.(Re,me),(bo.litHtmlVersions??=[]).push("3.3.1");const cn=(t,e,r)=>{const o=r?.renderBefore??e;let i=o._$litPart$;if(i===void 0){const n=r?.renderBefore??null;o._$litPart$=i=new me(e.insertBefore(Oe(),n),n,void 0,r??{})}return i._$AI(t),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const go=globalThis;let se=class extends ee{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=cn(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Y}};se._$litElement$=!0,se.finalized=!0,go.litElementHydrateSupport?.({LitElement:se});const ca=go.litElementPolyfillSupport;ca?.({LitElement:se});(go.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Me=t=>(e,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ua={attribute:!0,type:String,converter:ce,reflect:!1,hasChanged:mo},ha=(t=ua,e,r)=>{const{kind:o,metadata:i}=r;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(r.name,t),o==="accessor"){const{name:s}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(s,l,t)},init(a){return a!==void 0&&this.C(s,void 0,t,a),a}}}if(o==="setter"){const{name:s}=r;return function(a){const l=this[s];e.call(this,a),this.requestUpdate(s,l,t)}}throw Error("Unsupported decorator location: "+o)};function b(t){return(e,r)=>typeof r=="object"?ha(t,e,r):((o,i,n)=>{const s=i.hasOwnProperty(n);return i.constructor.createProperty(n,o),s?Object.getOwnPropertyDescriptor(i,n):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Yt(t){return b({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const un=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function tt(t,e){return(r,o,i)=>{const n=s=>s.renderRoot?.querySelector(t)??null;return un(r,o,{get(){return n(this)}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let da;function fa(t){return(e,r)=>un(e,r,{get(){return(this.renderRoot??(da??=document.createDocumentFragment())).querySelectorAll(t)}})}var Ye,W=class extends se{constructor(){super(),Bs(this,Ye,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){const r=new CustomEvent(t,Kt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(r),r}static define(t,e=this,r={}){const o=customElements.get(t);if(!o){try{customElements.define(t,e,r)}catch{customElements.define(t,class extends e{},r)}return}let i=" (unknown version)",n=i;"version"in e&&e.version&&(i=" v"+e.version),"version"in o&&o.version&&(n=" v"+o.version),!(i&&n&&i===n)&&console.warn(`Attempted to register <${t}>${i}, but <${t}>${n} has already been registered.`)}attributeChangedCallback(t,e,r){Ns(this,Ye)||(this.constructor.elementProperties.forEach((o,i)=>{o.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),Us(this,Ye,!0)),super.attributeChangedCallback(t,e,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,r)=>{t.has(r)&&this[r]==null&&(this[r]=e)})}};Ye=new WeakMap;W.version="2.20.1";W.dependencies={};f([b()],W.prototype,"dir",2);f([b()],W.prototype,"lang",2);var X=class extends W{constructor(){super(...arguments),this.localize=new Gt(this),this.date=new Date,this.hourFormat="auto"}render(){const t=new Date(this.date),e=this.hourFormat==="auto"?void 0:this.hourFormat==="12";if(!isNaN(t.getMilliseconds()))return C`
      <time datetime=${t.toISOString()}>
        ${this.localize.date(t,{weekday:this.weekday,era:this.era,year:this.year,month:this.month,day:this.day,hour:this.hour,minute:this.minute,second:this.second,timeZoneName:this.timeZoneName,timeZone:this.timeZone,hour12:e})}
      </time>
    `}};f([b()],X.prototype,"date",2);f([b()],X.prototype,"weekday",2);f([b()],X.prototype,"era",2);f([b()],X.prototype,"year",2);f([b()],X.prototype,"month",2);f([b()],X.prototype,"day",2);f([b()],X.prototype,"hour",2);f([b()],X.prototype,"minute",2);f([b()],X.prototype,"second",2);f([b({attribute:"time-zone-name"})],X.prototype,"timeZoneName",2);f([b({attribute:"time-zone"})],X.prototype,"timeZone",2);f([b({attribute:"hour-format"})],X.prototype,"hourFormat",2);X.define("sl-format-date");var pa=Q`
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
`,yo=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=r=>{const o=r.target;(this.slotNames.includes("[default]")&&!o.name||o.name&&this.slotNames.includes(o.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}},ft=Q`
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
 */const lt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},De=t=>(...e)=>({_$litDirective$:t,values:e});let je=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ut=De(class extends je{constructor(t){if(super(t),t.type!==lt.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((o=>o!==""))));for(const o in e)e[o]&&!this.nt?.has(o)&&this.st.add(o);return this.render(e)}const r=t.element.classList;for(const o of this.st)o in e||(r.remove(o),this.st.delete(o));for(const o in e){const i=!!e[o];i===this.st.has(o)||this.nt?.has(o)||(i?(r.add(o),this.st.add(o)):(r.remove(o),this.st.delete(o)))}return Y}});var hn=class extends W{constructor(){super(...arguments),this.hasSlotController=new yo(this,"footer","header","image")}render(){return C`
      <div
        part="base"
        class=${ut({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `}};hn.styles=[ft,pa];hn.define("sl-card");var ma=Q`
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
`,dn=class extends W{constructor(){super(...arguments),this.localize=new Gt(this)}render(){return C`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};dn.styles=[ft,ma];var xe=new WeakMap,$e=new WeakMap,ke=new WeakMap,Cr=new WeakSet,Ve=new WeakMap,fn=class{constructor(t,e){this.handleFormData=r=>{const o=this.options.disabled(this.host),i=this.options.name(this.host),n=this.options.value(this.host),s=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!o&&!s&&typeof i=="string"&&i.length>0&&typeof n<"u"&&(Array.isArray(n)?n.forEach(a=>{r.formData.append(i,a.toString())}):r.formData.append(i,n.toString()))},this.handleFormSubmit=r=>{var o;const i=this.options.disabled(this.host),n=this.options.reportValidity;this.form&&!this.form.noValidate&&((o=xe.get(this.form))==null||o.forEach(s=>{this.setUserInteracted(s,!0)})),this.form&&!this.form.noValidate&&!i&&!n(this.host)&&(r.preventDefault(),r.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),Ve.set(this.host,[])},this.handleInteraction=r=>{const o=Ve.get(this.host);o.includes(r.type)||o.push(r.type),o.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.checkValidity=="function"&&!o.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.reportValidity=="function"&&!o.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=Kt({form:r=>{const o=r.form;if(o){const n=r.getRootNode().querySelector(`#${o}`);if(n)return n}return r.closest("form")},name:r=>r.name,value:r=>r.value,defaultValue:r=>r.defaultValue,disabled:r=>{var o;return(o=r.disabled)!=null?o:!1},reportValidity:r=>typeof r.reportValidity=="function"?r.reportValidity():!0,checkValidity:r=>typeof r.checkValidity=="function"?r.checkValidity():!0,setValue:(r,o)=>r.value=o,assumeInteractionOn:["sl-input"]},e)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),Ve.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),Ve.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,xe.has(this.form)?xe.get(this.form).add(this.host):xe.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),$e.has(this.form)||($e.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),ke.has(this.form)||(ke.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const t=xe.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),$e.has(this.form)&&(this.form.reportValidity=$e.get(this.form),$e.delete(this.form)),ke.has(this.form)&&(this.form.checkValidity=ke.get(this.form),ke.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?Cr.add(t):Cr.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const r=document.createElement("button");r.type=t,r.style.position="absolute",r.style.width="0",r.style.height="0",r.style.clipPath="inset(50%)",r.style.overflow="hidden",r.style.whiteSpace="nowrap",e&&(r.name=e.name,r.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(o=>{e.hasAttribute(o)&&r.setAttribute(o,e.getAttribute(o))})),this.form.append(r),r.click(),r.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,r=!!Cr.has(e),o=!!e.required;e.toggleAttribute("data-required",o),e.toggleAttribute("data-optional",!o),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&r),e.toggleAttribute("data-user-valid",t&&r)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},wo=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(fr(Kt({},wo),{valid:!1,valueMissing:!0}));Object.freeze(fr(Kt({},wo),{valid:!1,customError:!0}));var ba=Q`
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
`,Br="";function Ko(t){Br=t}function va(t=""){if(!Br){const e=[...document.getElementsByTagName("script")],r=e.find(o=>o.hasAttribute("data-shoelace"));if(r)Ko(r.getAttribute("data-shoelace"));else{const o=e.find(n=>/shoelace(\.min)?\.js($|\?)/.test(n.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(n.src));let i="";o&&(i=o.getAttribute("src")),Ko(i.split("/").slice(0,-1).join("/"))}}return Br.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var ga={name:"default",resolver:t=>va(`assets/icons/${t}.svg`)},ya=ga,Yo={caret:`
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
  `},wa={name:"system",resolver:t=>t in Yo?`data:image/svg+xml,${encodeURIComponent(Yo[t])}`:""},_a=wa,xa=[ya,_a],Ur=[];function $a(t){Ur.push(t)}function ka(t){Ur=Ur.filter(e=>e!==t)}function Zo(t){return xa.find(e=>e.name===t)}var Aa=Q`
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
`;function Pt(t,e){const r=Kt({waitUntilFirstUpdate:!1},e);return(o,i)=>{const{update:n}=o,s=Array.isArray(t)?t:[t];o.update=function(a){s.forEach(l=>{const c=l;if(a.has(c)){const h=a.get(c),d=this[c];h!==d&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[i](h,d)}}),n.call(this,a)}}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Sa}=aa,Ca=(t,e)=>t?._$litType$!==void 0,pn=t=>t.strings===void 0,Xo=()=>document.createComment(""),Ae=(t,e,r)=>{const o=t._$AA.parentNode,i=e===void 0?t._$AB:e._$AA;if(r===void 0){const n=o.insertBefore(Xo(),i),s=o.insertBefore(Xo(),i);r=new Sa(n,s,t,t.options)}else{const n=r._$AB.nextSibling,s=r._$AM,a=s!==t;if(a){let l;r._$AQ?.(t),r._$AM=t,r._$AP!==void 0&&(l=t._$AU)!==s._$AU&&r._$AP(l)}if(n!==i||a){let l=r._$AA;for(;l!==n;){const c=l.nextSibling;o.insertBefore(l,i),l=c}}}return r},Mt=(t,e,r=t)=>(t._$AI(e,r),t),Ea={},mn=(t,e=Ea)=>t._$AH=e,Oa=t=>t._$AH,Er=t=>{t._$AR(),t._$AA.remove()};var Se=Symbol(),He=Symbol(),Or,Pr=new Map,nt=class extends W{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var r;let o;if(e?.spriteSheet)return this.svg=C`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(o=await fetch(t,{mode:"cors"}),!o.ok)return o.status===410?Se:He}catch{return He}try{const i=document.createElement("div");i.innerHTML=await o.text();const n=i.firstElementChild;if(((r=n?.tagName)==null?void 0:r.toLowerCase())!=="svg")return Se;Or||(Or=new DOMParser);const a=Or.parseFromString(n.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):Se}catch{return Se}}connectedCallback(){super.connectedCallback(),$a(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),ka(this)}getIconSource(){const t=Zo(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const{url:e,fromLibrary:r}=this.getIconSource(),o=r?Zo(this.library):void 0;if(!e){this.svg=null;return}let i=Pr.get(e);if(i||(i=this.resolveIcon(e,o),Pr.set(e,i)),!this.initialRender)return;const n=await i;if(n===He&&Pr.delete(e),e===this.getIconSource().url){if(Ca(n)){if(this.svg=n,o){await this.updateComplete;const s=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&s&&o.mutator(s)}return}switch(n){case He:case Se:this.svg=null,this.emit("sl-error");break;default:this.svg=n.cloneNode(!0),(t=o?.mutator)==null||t.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};nt.styles=[ft,Aa];f([Yt()],nt.prototype,"svg",2);f([b({reflect:!0})],nt.prototype,"name",2);f([b()],nt.prototype,"src",2);f([b()],nt.prototype,"label",2);f([b({reflect:!0})],nt.prototype,"library",2);f([Pt("label")],nt.prototype,"handleLabelChange",1);f([Pt(["name","src","library"])],nt.prototype,"setIcon",1);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bn=Symbol.for(""),Pa=t=>{if(t?.r===bn)return t?._$litStatic$},er=(t,...e)=>({_$litStatic$:e.reduce(((r,o,i)=>r+(n=>{if(n._$litStatic$!==void 0)return n._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${n}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[i+1]),t[0]),r:bn}),Jo=new Map,Ra=t=>(e,...r)=>{const o=r.length;let i,n;const s=[],a=[];let l,c=0,h=!1;for(;c<o;){for(l=e[c];c<o&&(n=r[c],(i=Pa(n))!==void 0);)l+=i+e[++c],h=!0;c!==o&&a.push(n),s.push(l),c++}if(c===o&&s.push(e[o]),h){const d=s.join("$$lit$$");(e=Jo.get(d))===void 0&&(s.raw=s,Jo.set(d,e=s)),r=a}return t(e,...r)},Ze=Ra(C);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const D=t=>t??T;var E=class extends W{constructor(){super(...arguments),this.formControlController=new fn(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new yo(this,"[default]","prefix","suffix"),this.localize=new Gt(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:wo}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){const t=this.isLink(),e=t?er`a`:er`button`;return Ze`
      <${e}
        part="base"
        class=${ut({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${D(t?void 0:this.disabled)}
        type=${D(t?void 0:this.type)}
        title=${this.title}
        name=${D(t?void 0:this.name)}
        value=${D(t?void 0:this.value)}
        href=${D(t&&!this.disabled?this.href:void 0)}
        target=${D(t?this.target:void 0)}
        download=${D(t?this.download:void 0)}
        rel=${D(t?this.rel:void 0)}
        role=${D(t?void 0:"button")}
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
        ${this.caret?Ze` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?Ze`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${e}>
    `}};E.styles=[ft,ba];E.dependencies={"sl-icon":nt,"sl-spinner":dn};f([tt(".button")],E.prototype,"button",2);f([Yt()],E.prototype,"hasFocus",2);f([Yt()],E.prototype,"invalid",2);f([b()],E.prototype,"title",2);f([b({reflect:!0})],E.prototype,"variant",2);f([b({reflect:!0})],E.prototype,"size",2);f([b({type:Boolean,reflect:!0})],E.prototype,"caret",2);f([b({type:Boolean,reflect:!0})],E.prototype,"disabled",2);f([b({type:Boolean,reflect:!0})],E.prototype,"loading",2);f([b({type:Boolean,reflect:!0})],E.prototype,"outline",2);f([b({type:Boolean,reflect:!0})],E.prototype,"pill",2);f([b({type:Boolean,reflect:!0})],E.prototype,"circle",2);f([b()],E.prototype,"type",2);f([b()],E.prototype,"name",2);f([b()],E.prototype,"value",2);f([b()],E.prototype,"href",2);f([b()],E.prototype,"target",2);f([b()],E.prototype,"rel",2);f([b()],E.prototype,"download",2);f([b()],E.prototype,"form",2);f([b({attribute:"formaction"})],E.prototype,"formAction",2);f([b({attribute:"formenctype"})],E.prototype,"formEnctype",2);f([b({attribute:"formmethod"})],E.prototype,"formMethod",2);f([b({attribute:"formnovalidate",type:Boolean})],E.prototype,"formNoValidate",2);f([b({attribute:"formtarget"})],E.prototype,"formTarget",2);f([Pt("disabled",{waitUntilFirstUpdate:!0})],E.prototype,"handleDisabledChange",1);E.define("sl-button");var Ta=Q`
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
`,La=Q`
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
`,J=class extends W{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?er`a`:er`button`;return Ze`
      <${e}
        part="base"
        class=${ut({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${D(t?void 0:this.disabled)}
        type=${D(t?void 0:"button")}
        href=${D(t?this.href:void 0)}
        target=${D(t?this.target:void 0)}
        download=${D(t?this.download:void 0)}
        rel=${D(t&&this.target?"noreferrer noopener":void 0)}
        role=${D(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${D(this.name)}
          library=${D(this.library)}
          src=${D(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};J.styles=[ft,La];J.dependencies={"sl-icon":nt};f([tt(".icon-button")],J.prototype,"button",2);f([Yt()],J.prototype,"hasFocus",2);f([b()],J.prototype,"name",2);f([b()],J.prototype,"library",2);f([b()],J.prototype,"src",2);f([b()],J.prototype,"href",2);f([b()],J.prototype,"target",2);f([b()],J.prototype,"download",2);f([b()],J.prototype,"label",2);f([b({type:Boolean,reflect:!0})],J.prototype,"disabled",2);var Zt=class extends W{constructor(){super(...arguments),this.localize=new Gt(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return C`
      <span
        part="base"
        class=${ut({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
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
    `}};Zt.styles=[ft,Ta];Zt.dependencies={"sl-icon-button":J};f([b({reflect:!0})],Zt.prototype,"variant",2);f([b({reflect:!0})],Zt.prototype,"size",2);f([b({type:Boolean,reflect:!0})],Zt.prototype,"pill",2);f([b({type:Boolean})],Zt.prototype,"removable",2);Zt.define("sl-tag");var za=Q`
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
`,Ia=(t="value")=>(e,r)=>{const o=e.constructor,i=o.prototype.attributeChangedCallback;o.prototype.attributeChangedCallback=function(n,s,a){var l;const c=o.getPropertyOptions(t),h=typeof c.attribute=="string"?c.attribute:t;if(n===h){const d=c.converter||ce,u=(typeof d=="function"?d:(l=d?.fromAttribute)!=null?l:ce.fromAttribute)(a,c.type);this[t]!==u&&(this[r]=u)}i.call(this,n,s,a)}},Ma=Q`
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
 */const Da=De(class extends je{constructor(t){if(super(t),t.type!==lt.PROPERTY&&t.type!==lt.ATTRIBUTE&&t.type!==lt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!pn(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===Y||e===T)return e;const r=t.element,o=t.name;if(t.type===lt.PROPERTY){if(e===r[o])return Y}else if(t.type===lt.BOOLEAN_ATTRIBUTE){if(!!e===r.hasAttribute(o))return Y}else if(t.type===lt.ATTRIBUTE&&r.getAttribute(o)===e+"")return Y;return mn(t),e}});var V=class extends W{constructor(){super(...arguments),this.formControlController=new fn(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new yo(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleClick(){this.checked=!this.checked,this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleKeyDown(t){t.key==="ArrowLeft"&&(t.preventDefault(),this.checked=!1,this.emit("sl-change"),this.emit("sl-input")),t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!0,this.emit("sl-change"),this.emit("sl-input"))}handleCheckedChange(){this.input.checked=this.checked,this.formControlController.updateValidity()}handleDisabledChange(){this.formControlController.setValidity(!0)}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){const t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return C`
      <div
        class=${ut({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-help-text":e})}
      >
        <label
          part="base"
          class=${ut({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus,"switch--small":this.size==="small","switch--medium":this.size==="medium","switch--large":this.size==="large"})}
        >
          <input
            class="switch__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${D(this.value)}
            .checked=${Da(this.checked)}
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
    `}};V.styles=[ft,Ma,za];f([tt('input[type="checkbox"]')],V.prototype,"input",2);f([Yt()],V.prototype,"hasFocus",2);f([b()],V.prototype,"title",2);f([b()],V.prototype,"name",2);f([b()],V.prototype,"value",2);f([b({reflect:!0})],V.prototype,"size",2);f([b({type:Boolean,reflect:!0})],V.prototype,"disabled",2);f([b({type:Boolean,reflect:!0})],V.prototype,"checked",2);f([Ia("checked")],V.prototype,"defaultChecked",2);f([b({reflect:!0})],V.prototype,"form",2);f([b({type:Boolean,reflect:!0})],V.prototype,"required",2);f([b({attribute:"help-text"})],V.prototype,"helpText",2);f([Pt("checked",{waitUntilFirstUpdate:!0})],V.prototype,"handleCheckedChange",1);f([Pt("disabled",{waitUntilFirstUpdate:!0})],V.prototype,"handleDisabledChange",1);V.define("sl-switch");var ja=Q`
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
`,Na=Q`
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
`;const St=Math.min,K=Math.max,rr=Math.round,We=Math.floor,ct=t=>({x:t,y:t}),Ba={left:"right",right:"left",bottom:"top",top:"bottom"},Ua={start:"end",end:"start"};function Fr(t,e,r){return K(t,St(e,r))}function be(t,e){return typeof t=="function"?t(e):t}function Ct(t){return t.split("-")[0]}function ve(t){return t.split("-")[1]}function vn(t){return t==="x"?"y":"x"}function _o(t){return t==="y"?"height":"width"}const Fa=new Set(["top","bottom"]);function vt(t){return Fa.has(Ct(t))?"y":"x"}function xo(t){return vn(vt(t))}function Va(t,e,r){r===void 0&&(r=!1);const o=ve(t),i=xo(t),n=_o(i);let s=i==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[n]>e.floating[n]&&(s=or(s)),[s,or(s)]}function Ha(t){const e=or(t);return[Vr(t),e,Vr(e)]}function Vr(t){return t.replace(/start|end/g,e=>Ua[e])}const Qo=["left","right"],ti=["right","left"],Wa=["top","bottom"],qa=["bottom","top"];function Ga(t,e,r){switch(t){case"top":case"bottom":return r?e?ti:Qo:e?Qo:ti;case"left":case"right":return e?Wa:qa;default:return[]}}function Ka(t,e,r,o){const i=ve(t);let n=Ga(Ct(t),r==="start",o);return i&&(n=n.map(s=>s+"-"+i),e&&(n=n.concat(n.map(Vr)))),n}function or(t){return t.replace(/left|right|bottom|top/g,e=>Ba[e])}function Ya(t){return{top:0,right:0,bottom:0,left:0,...t}}function gn(t){return typeof t!="number"?Ya(t):{top:t,right:t,bottom:t,left:t}}function ir(t){const{x:e,y:r,width:o,height:i}=t;return{width:o,height:i,top:r,left:e,right:e+o,bottom:r+i,x:e,y:r}}function ei(t,e,r){let{reference:o,floating:i}=t;const n=vt(e),s=xo(e),a=_o(s),l=Ct(e),c=n==="y",h=o.x+o.width/2-i.width/2,d=o.y+o.height/2-i.height/2,p=o[a]/2-i[a]/2;let u;switch(l){case"top":u={x:h,y:o.y-i.height};break;case"bottom":u={x:h,y:o.y+o.height};break;case"right":u={x:o.x+o.width,y:d};break;case"left":u={x:o.x-i.width,y:d};break;default:u={x:o.x,y:o.y}}switch(ve(e)){case"start":u[s]-=p*(r&&c?-1:1);break;case"end":u[s]+=p*(r&&c?-1:1);break}return u}const Za=async(t,e,r)=>{const{placement:o="bottom",strategy:i="absolute",middleware:n=[],platform:s}=r,a=n.filter(Boolean),l=await(s.isRTL==null?void 0:s.isRTL(e));let c=await s.getElementRects({reference:t,floating:e,strategy:i}),{x:h,y:d}=ei(c,o,l),p=o,u={},m=0;for(let v=0;v<a.length;v++){const{name:_,fn:g}=a[v],{x:w,y:$,data:A,reset:S}=await g({x:h,y:d,initialPlacement:o,placement:p,strategy:i,middlewareData:u,rects:c,platform:s,elements:{reference:t,floating:e}});h=w??h,d=$??d,u={...u,[_]:{...u[_],...A}},S&&m<=50&&(m++,typeof S=="object"&&(S.placement&&(p=S.placement),S.rects&&(c=S.rects===!0?await s.getElementRects({reference:t,floating:e,strategy:i}):S.rects),{x:h,y:d}=ei(c,p,l)),v=-1)}return{x:h,y:d,placement:p,strategy:i,middlewareData:u}};async function $o(t,e){var r;e===void 0&&(e={});const{x:o,y:i,platform:n,rects:s,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:d="floating",altBoundary:p=!1,padding:u=0}=be(e,t),m=gn(u),_=a[p?d==="floating"?"reference":"floating":d],g=ir(await n.getClippingRect({element:(r=await(n.isElement==null?void 0:n.isElement(_)))==null||r?_:_.contextElement||await(n.getDocumentElement==null?void 0:n.getDocumentElement(a.floating)),boundary:c,rootBoundary:h,strategy:l})),w=d==="floating"?{x:o,y:i,width:s.floating.width,height:s.floating.height}:s.reference,$=await(n.getOffsetParent==null?void 0:n.getOffsetParent(a.floating)),A=await(n.isElement==null?void 0:n.isElement($))?await(n.getScale==null?void 0:n.getScale($))||{x:1,y:1}:{x:1,y:1},S=ir(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:w,offsetParent:$,strategy:l}):w);return{top:(g.top-S.top+m.top)/A.y,bottom:(S.bottom-g.bottom+m.bottom)/A.y,left:(g.left-S.left+m.left)/A.x,right:(S.right-g.right+m.right)/A.x}}const Xa=t=>({name:"arrow",options:t,async fn(e){const{x:r,y:o,placement:i,rects:n,platform:s,elements:a,middlewareData:l}=e,{element:c,padding:h=0}=be(t,e)||{};if(c==null)return{};const d=gn(h),p={x:r,y:o},u=xo(i),m=_o(u),v=await s.getDimensions(c),_=u==="y",g=_?"top":"left",w=_?"bottom":"right",$=_?"clientHeight":"clientWidth",A=n.reference[m]+n.reference[u]-p[u]-n.floating[m],S=p[u]-n.reference[u],R=await(s.getOffsetParent==null?void 0:s.getOffsetParent(c));let O=R?R[$]:0;(!O||!await(s.isElement==null?void 0:s.isElement(R)))&&(O=a.floating[$]||n.floating[m]);const L=A/2-S/2,B=O/2-v[m]/2-1,I=St(d[g],B),yt=St(d[w],B),st=I,wt=O-v[m]-yt,H=O/2-v[m]/2+L,zt=Fr(st,H,wt),bt=!l.arrow&&ve(i)!=null&&H!==zt&&n.reference[m]/2-(H<st?I:yt)-v[m]/2<0,et=bt?H<st?H-st:H-wt:0;return{[u]:p[u]+et,data:{[u]:zt,centerOffset:H-zt-et,...bt&&{alignmentOffset:et}},reset:bt}}}),Ja=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var r,o;const{placement:i,middlewareData:n,rects:s,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:h=!0,crossAxis:d=!0,fallbackPlacements:p,fallbackStrategy:u="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:v=!0,..._}=be(t,e);if((r=n.arrow)!=null&&r.alignmentOffset)return{};const g=Ct(i),w=vt(a),$=Ct(a)===a,A=await(l.isRTL==null?void 0:l.isRTL(c.floating)),S=p||($||!v?[or(a)]:Ha(a)),R=m!=="none";!p&&R&&S.push(...Ka(a,v,m,A));const O=[a,...S],L=await $o(e,_),B=[];let I=((o=n.flip)==null?void 0:o.overflows)||[];if(h&&B.push(L[g]),d){const H=Va(i,s,A);B.push(L[H[0]],L[H[1]])}if(I=[...I,{placement:i,overflows:B}],!B.every(H=>H<=0)){var yt,st;const H=(((yt=n.flip)==null?void 0:yt.index)||0)+1,zt=O[H];if(zt&&(!(d==="alignment"?w!==vt(zt):!1)||I.every(rt=>vt(rt.placement)===w?rt.overflows[0]>0:!0)))return{data:{index:H,overflows:I},reset:{placement:zt}};let bt=(st=I.filter(et=>et.overflows[0]<=0).sort((et,rt)=>et.overflows[1]-rt.overflows[1])[0])==null?void 0:st.placement;if(!bt)switch(u){case"bestFit":{var wt;const et=(wt=I.filter(rt=>{if(R){const _t=vt(rt.placement);return _t===w||_t==="y"}return!0}).map(rt=>[rt.placement,rt.overflows.filter(_t=>_t>0).reduce((_t,Ss)=>_t+Ss,0)]).sort((rt,_t)=>rt[1]-_t[1])[0])==null?void 0:wt[0];et&&(bt=et);break}case"initialPlacement":bt=a;break}if(i!==bt)return{reset:{placement:bt}}}return{}}}},Qa=new Set(["left","top"]);async function tl(t,e){const{placement:r,platform:o,elements:i}=t,n=await(o.isRTL==null?void 0:o.isRTL(i.floating)),s=Ct(r),a=ve(r),l=vt(r)==="y",c=Qa.has(s)?-1:1,h=n&&l?-1:1,d=be(e,t);let{mainAxis:p,crossAxis:u,alignmentAxis:m}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return a&&typeof m=="number"&&(u=a==="end"?m*-1:m),l?{x:u*h,y:p*c}:{x:p*c,y:u*h}}const el=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var r,o;const{x:i,y:n,placement:s,middlewareData:a}=e,l=await tl(e,t);return s===((r=a.offset)==null?void 0:r.placement)&&(o=a.arrow)!=null&&o.alignmentOffset?{}:{x:i+l.x,y:n+l.y,data:{...l,placement:s}}}}},rl=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:o,placement:i}=e,{mainAxis:n=!0,crossAxis:s=!1,limiter:a={fn:_=>{let{x:g,y:w}=_;return{x:g,y:w}}},...l}=be(t,e),c={x:r,y:o},h=await $o(e,l),d=vt(Ct(i)),p=vn(d);let u=c[p],m=c[d];if(n){const _=p==="y"?"top":"left",g=p==="y"?"bottom":"right",w=u+h[_],$=u-h[g];u=Fr(w,u,$)}if(s){const _=d==="y"?"top":"left",g=d==="y"?"bottom":"right",w=m+h[_],$=m-h[g];m=Fr(w,m,$)}const v=a.fn({...e,[p]:u,[d]:m});return{...v,data:{x:v.x-r,y:v.y-o,enabled:{[p]:n,[d]:s}}}}}},ol=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var r,o;const{placement:i,rects:n,platform:s,elements:a}=e,{apply:l=()=>{},...c}=be(t,e),h=await $o(e,c),d=Ct(i),p=ve(i),u=vt(i)==="y",{width:m,height:v}=n.floating;let _,g;d==="top"||d==="bottom"?(_=d,g=p===(await(s.isRTL==null?void 0:s.isRTL(a.floating))?"start":"end")?"left":"right"):(g=d,_=p==="end"?"top":"bottom");const w=v-h.top-h.bottom,$=m-h.left-h.right,A=St(v-h[_],w),S=St(m-h[g],$),R=!e.middlewareData.shift;let O=A,L=S;if((r=e.middlewareData.shift)!=null&&r.enabled.x&&(L=$),(o=e.middlewareData.shift)!=null&&o.enabled.y&&(O=w),R&&!p){const I=K(h.left,0),yt=K(h.right,0),st=K(h.top,0),wt=K(h.bottom,0);u?L=m-2*(I!==0||yt!==0?I+yt:K(h.left,h.right)):O=v-2*(st!==0||wt!==0?st+wt:K(h.top,h.bottom))}await l({...e,availableWidth:L,availableHeight:O});const B=await s.getDimensions(a.floating);return m!==B.width||v!==B.height?{reset:{rects:!0}}:{}}}};function br(){return typeof window<"u"}function ge(t){return yn(t)?(t.nodeName||"").toLowerCase():"#document"}function Z(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function pt(t){var e;return(e=(yn(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function yn(t){return br()?t instanceof Node||t instanceof Z(t).Node:!1}function ot(t){return br()?t instanceof Element||t instanceof Z(t).Element:!1}function ht(t){return br()?t instanceof HTMLElement||t instanceof Z(t).HTMLElement:!1}function ri(t){return!br()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof Z(t).ShadowRoot}const il=new Set(["inline","contents"]);function Ne(t){const{overflow:e,overflowX:r,overflowY:o,display:i}=it(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+r)&&!il.has(i)}const nl=new Set(["table","td","th"]);function sl(t){return nl.has(ge(t))}const al=[":popover-open",":modal"];function vr(t){return al.some(e=>{try{return t.matches(e)}catch{return!1}})}const ll=["transform","translate","scale","rotate","perspective"],cl=["transform","translate","scale","rotate","perspective","filter"],ul=["paint","layout","strict","content"];function gr(t){const e=ko(),r=ot(t)?it(t):t;return ll.some(o=>r[o]?r[o]!=="none":!1)||(r.containerType?r.containerType!=="normal":!1)||!e&&(r.backdropFilter?r.backdropFilter!=="none":!1)||!e&&(r.filter?r.filter!=="none":!1)||cl.some(o=>(r.willChange||"").includes(o))||ul.some(o=>(r.contain||"").includes(o))}function hl(t){let e=Et(t);for(;ht(e)&&!he(e);){if(gr(e))return e;if(vr(e))return null;e=Et(e)}return null}function ko(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const dl=new Set(["html","body","#document"]);function he(t){return dl.has(ge(t))}function it(t){return Z(t).getComputedStyle(t)}function yr(t){return ot(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Et(t){if(ge(t)==="html")return t;const e=t.assignedSlot||t.parentNode||ri(t)&&t.host||pt(t);return ri(e)?e.host:e}function wn(t){const e=Et(t);return he(e)?t.ownerDocument?t.ownerDocument.body:t.body:ht(e)&&Ne(e)?e:wn(e)}function Te(t,e,r){var o;e===void 0&&(e=[]),r===void 0&&(r=!0);const i=wn(t),n=i===((o=t.ownerDocument)==null?void 0:o.body),s=Z(i);if(n){const a=Hr(s);return e.concat(s,s.visualViewport||[],Ne(i)?i:[],a&&r?Te(a):[])}return e.concat(i,Te(i,[],r))}function Hr(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function _n(t){const e=it(t);let r=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const i=ht(t),n=i?t.offsetWidth:r,s=i?t.offsetHeight:o,a=rr(r)!==n||rr(o)!==s;return a&&(r=n,o=s),{width:r,height:o,$:a}}function Ao(t){return ot(t)?t:t.contextElement}function ae(t){const e=Ao(t);if(!ht(e))return ct(1);const r=e.getBoundingClientRect(),{width:o,height:i,$:n}=_n(e);let s=(n?rr(r.width):r.width)/o,a=(n?rr(r.height):r.height)/i;return(!s||!Number.isFinite(s))&&(s=1),(!a||!Number.isFinite(a))&&(a=1),{x:s,y:a}}const fl=ct(0);function xn(t){const e=Z(t);return!ko()||!e.visualViewport?fl:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function pl(t,e,r){return e===void 0&&(e=!1),!r||e&&r!==Z(t)?!1:e}function Vt(t,e,r,o){e===void 0&&(e=!1),r===void 0&&(r=!1);const i=t.getBoundingClientRect(),n=Ao(t);let s=ct(1);e&&(o?ot(o)&&(s=ae(o)):s=ae(t));const a=pl(n,r,o)?xn(n):ct(0);let l=(i.left+a.x)/s.x,c=(i.top+a.y)/s.y,h=i.width/s.x,d=i.height/s.y;if(n){const p=Z(n),u=o&&ot(o)?Z(o):o;let m=p,v=Hr(m);for(;v&&o&&u!==m;){const _=ae(v),g=v.getBoundingClientRect(),w=it(v),$=g.left+(v.clientLeft+parseFloat(w.paddingLeft))*_.x,A=g.top+(v.clientTop+parseFloat(w.paddingTop))*_.y;l*=_.x,c*=_.y,h*=_.x,d*=_.y,l+=$,c+=A,m=Z(v),v=Hr(m)}}return ir({width:h,height:d,x:l,y:c})}function wr(t,e){const r=yr(t).scrollLeft;return e?e.left+r:Vt(pt(t)).left+r}function $n(t,e){const r=t.getBoundingClientRect(),o=r.left+e.scrollLeft-wr(t,r),i=r.top+e.scrollTop;return{x:o,y:i}}function ml(t){let{elements:e,rect:r,offsetParent:o,strategy:i}=t;const n=i==="fixed",s=pt(o),a=e?vr(e.floating):!1;if(o===s||a&&n)return r;let l={scrollLeft:0,scrollTop:0},c=ct(1);const h=ct(0),d=ht(o);if((d||!d&&!n)&&((ge(o)!=="body"||Ne(s))&&(l=yr(o)),ht(o))){const u=Vt(o);c=ae(o),h.x=u.x+o.clientLeft,h.y=u.y+o.clientTop}const p=s&&!d&&!n?$n(s,l):ct(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+h.x+p.x,y:r.y*c.y-l.scrollTop*c.y+h.y+p.y}}function bl(t){return Array.from(t.getClientRects())}function vl(t){const e=pt(t),r=yr(t),o=t.ownerDocument.body,i=K(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),n=K(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let s=-r.scrollLeft+wr(t);const a=-r.scrollTop;return it(o).direction==="rtl"&&(s+=K(e.clientWidth,o.clientWidth)-i),{width:i,height:n,x:s,y:a}}const oi=25;function gl(t,e){const r=Z(t),o=pt(t),i=r.visualViewport;let n=o.clientWidth,s=o.clientHeight,a=0,l=0;if(i){n=i.width,s=i.height;const h=ko();(!h||h&&e==="fixed")&&(a=i.offsetLeft,l=i.offsetTop)}const c=wr(o);if(c<=0){const h=o.ownerDocument,d=h.body,p=getComputedStyle(d),u=h.compatMode==="CSS1Compat"&&parseFloat(p.marginLeft)+parseFloat(p.marginRight)||0,m=Math.abs(o.clientWidth-d.clientWidth-u);m<=oi&&(n-=m)}else c<=oi&&(n+=c);return{width:n,height:s,x:a,y:l}}const yl=new Set(["absolute","fixed"]);function wl(t,e){const r=Vt(t,!0,e==="fixed"),o=r.top+t.clientTop,i=r.left+t.clientLeft,n=ht(t)?ae(t):ct(1),s=t.clientWidth*n.x,a=t.clientHeight*n.y,l=i*n.x,c=o*n.y;return{width:s,height:a,x:l,y:c}}function ii(t,e,r){let o;if(e==="viewport")o=gl(t,r);else if(e==="document")o=vl(pt(t));else if(ot(e))o=wl(e,r);else{const i=xn(t);o={x:e.x-i.x,y:e.y-i.y,width:e.width,height:e.height}}return ir(o)}function kn(t,e){const r=Et(t);return r===e||!ot(r)||he(r)?!1:it(r).position==="fixed"||kn(r,e)}function _l(t,e){const r=e.get(t);if(r)return r;let o=Te(t,[],!1).filter(a=>ot(a)&&ge(a)!=="body"),i=null;const n=it(t).position==="fixed";let s=n?Et(t):t;for(;ot(s)&&!he(s);){const a=it(s),l=gr(s);!l&&a.position==="fixed"&&(i=null),(n?!l&&!i:!l&&a.position==="static"&&!!i&&yl.has(i.position)||Ne(s)&&!l&&kn(t,s))?o=o.filter(h=>h!==s):i=a,s=Et(s)}return e.set(t,o),o}function xl(t){let{element:e,boundary:r,rootBoundary:o,strategy:i}=t;const s=[...r==="clippingAncestors"?vr(e)?[]:_l(e,this._c):[].concat(r),o],a=s[0],l=s.reduce((c,h)=>{const d=ii(e,h,i);return c.top=K(d.top,c.top),c.right=St(d.right,c.right),c.bottom=St(d.bottom,c.bottom),c.left=K(d.left,c.left),c},ii(e,a,i));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function $l(t){const{width:e,height:r}=_n(t);return{width:e,height:r}}function kl(t,e,r){const o=ht(e),i=pt(e),n=r==="fixed",s=Vt(t,!0,n,e);let a={scrollLeft:0,scrollTop:0};const l=ct(0);function c(){l.x=wr(i)}if(o||!o&&!n)if((ge(e)!=="body"||Ne(i))&&(a=yr(e)),o){const u=Vt(e,!0,n,e);l.x=u.x+e.clientLeft,l.y=u.y+e.clientTop}else i&&c();n&&!o&&i&&c();const h=i&&!o&&!n?$n(i,a):ct(0),d=s.left+a.scrollLeft-l.x-h.x,p=s.top+a.scrollTop-l.y-h.y;return{x:d,y:p,width:s.width,height:s.height}}function Rr(t){return it(t).position==="static"}function ni(t,e){if(!ht(t)||it(t).position==="fixed")return null;if(e)return e(t);let r=t.offsetParent;return pt(t)===r&&(r=r.ownerDocument.body),r}function An(t,e){const r=Z(t);if(vr(t))return r;if(!ht(t)){let i=Et(t);for(;i&&!he(i);){if(ot(i)&&!Rr(i))return i;i=Et(i)}return r}let o=ni(t,e);for(;o&&sl(o)&&Rr(o);)o=ni(o,e);return o&&he(o)&&Rr(o)&&!gr(o)?r:o||hl(t)||r}const Al=async function(t){const e=this.getOffsetParent||An,r=this.getDimensions,o=await r(t.floating);return{reference:kl(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function Sl(t){return it(t).direction==="rtl"}const Xe={convertOffsetParentRelativeRectToViewportRelativeRect:ml,getDocumentElement:pt,getClippingRect:xl,getOffsetParent:An,getElementRects:Al,getClientRects:bl,getDimensions:$l,getScale:ae,isElement:ot,isRTL:Sl};function Sn(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function Cl(t,e){let r=null,o;const i=pt(t);function n(){var a;clearTimeout(o),(a=r)==null||a.disconnect(),r=null}function s(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),n();const c=t.getBoundingClientRect(),{left:h,top:d,width:p,height:u}=c;if(a||e(),!p||!u)return;const m=We(d),v=We(i.clientWidth-(h+p)),_=We(i.clientHeight-(d+u)),g=We(h),$={rootMargin:-m+"px "+-v+"px "+-_+"px "+-g+"px",threshold:K(0,St(1,l))||1};let A=!0;function S(R){const O=R[0].intersectionRatio;if(O!==l){if(!A)return s();O?s(!1,O):o=setTimeout(()=>{s(!1,1e-7)},1e3)}O===1&&!Sn(c,t.getBoundingClientRect())&&s(),A=!1}try{r=new IntersectionObserver(S,{...$,root:i.ownerDocument})}catch{r=new IntersectionObserver(S,$)}r.observe(t)}return s(!0),n}function El(t,e,r,o){o===void 0&&(o={});const{ancestorScroll:i=!0,ancestorResize:n=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=Ao(t),h=i||n?[...c?Te(c):[],...Te(e)]:[];h.forEach(g=>{i&&g.addEventListener("scroll",r,{passive:!0}),n&&g.addEventListener("resize",r)});const d=c&&a?Cl(c,r):null;let p=-1,u=null;s&&(u=new ResizeObserver(g=>{let[w]=g;w&&w.target===c&&u&&(u.unobserve(e),cancelAnimationFrame(p),p=requestAnimationFrame(()=>{var $;($=u)==null||$.observe(e)})),r()}),c&&!l&&u.observe(c),u.observe(e));let m,v=l?Vt(t):null;l&&_();function _(){const g=Vt(t);v&&!Sn(v,g)&&r(),v=g,m=requestAnimationFrame(_)}return r(),()=>{var g;h.forEach(w=>{i&&w.removeEventListener("scroll",r),n&&w.removeEventListener("resize",r)}),d?.(),(g=u)==null||g.disconnect(),u=null,l&&cancelAnimationFrame(m)}}const Ol=el,Pl=rl,Rl=Ja,si=ol,Tl=Xa,Ll=(t,e,r)=>{const o=new Map,i={platform:Xe,...r},n={...i.platform,_c:o};return Za(t,e,{...i,platform:n})};function zl(t){return Il(t)}function Tr(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Il(t){for(let e=t;e;e=Tr(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=Tr(t);e;e=Tr(e)){if(!(e instanceof Element))continue;const r=getComputedStyle(e);if(r.display!=="contents"&&(r.position!=="static"||gr(r)||e.tagName==="BODY"))return e}return null}function Ml(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var P=class extends W{constructor(){super(...arguments),this.localize=new Gt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,i=0,n=0,s=0,a=0,l=0,c=0,h=0;r?t.top<e.top?(o=t.left,i=t.bottom,n=t.right,s=t.bottom,a=e.left,l=e.top,c=e.right,h=e.top):(o=e.left,i=e.bottom,n=e.right,s=e.bottom,a=t.left,l=t.top,c=t.right,h=t.top):t.left<e.left?(o=t.right,i=t.top,n=e.left,s=e.top,a=t.right,l=t.bottom,c=e.left,h=e.bottom):(o=e.right,i=e.top,n=t.left,s=t.top,a=e.right,l=e.bottom,c=t.left,h=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${n}px`),this.style.setProperty("--hover-bridge-top-right-y",`${s}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${h}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Ml(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=El(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[Ol({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(si({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=i?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Rl({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Pl({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(si({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Tl({element:this.arrowEl,padding:this.arrowPadding}));const e=this.strategy==="absolute"?r=>Xe.getOffsetParent(r,zl):Xe.getOffsetParent;Ll(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:fr(Kt({},Xe),{getOffsetParent:e})}).then(({x:r,y:o,middlewareData:i,placement:n})=>{const s=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[n.split("-")[0]];if(this.setAttribute("data-current-placement",n),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=i.arrow.x,c=i.arrow.y;let h="",d="",p="",u="";if(this.arrowPlacement==="start"){const m=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",d=s?m:"",u=s?"":m}else if(this.arrowPlacement==="end"){const m=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=s?"":m,u=s?m:"",p=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(u=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",h=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(u=typeof l=="number"?`${l}px`:"",h=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:h,right:d,bottom:p,left:u,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return C`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${ut({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${ut({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?C`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};P.styles=[ft,Na];f([tt(".popup")],P.prototype,"popup",2);f([tt(".popup__arrow")],P.prototype,"arrowEl",2);f([b()],P.prototype,"anchor",2);f([b({type:Boolean,reflect:!0})],P.prototype,"active",2);f([b({reflect:!0})],P.prototype,"placement",2);f([b({reflect:!0})],P.prototype,"strategy",2);f([b({type:Number})],P.prototype,"distance",2);f([b({type:Number})],P.prototype,"skidding",2);f([b({type:Boolean})],P.prototype,"arrow",2);f([b({attribute:"arrow-placement"})],P.prototype,"arrowPlacement",2);f([b({attribute:"arrow-padding",type:Number})],P.prototype,"arrowPadding",2);f([b({type:Boolean})],P.prototype,"flip",2);f([b({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],P.prototype,"flipFallbackPlacements",2);f([b({attribute:"flip-fallback-strategy"})],P.prototype,"flipFallbackStrategy",2);f([b({type:Object})],P.prototype,"flipBoundary",2);f([b({attribute:"flip-padding",type:Number})],P.prototype,"flipPadding",2);f([b({type:Boolean})],P.prototype,"shift",2);f([b({type:Object})],P.prototype,"shiftBoundary",2);f([b({attribute:"shift-padding",type:Number})],P.prototype,"shiftPadding",2);f([b({attribute:"auto-size"})],P.prototype,"autoSize",2);f([b()],P.prototype,"sync",2);f([b({type:Object})],P.prototype,"autoSizeBoundary",2);f([b({attribute:"auto-size-padding",type:Number})],P.prototype,"autoSizePadding",2);f([b({attribute:"hover-bridge",type:Boolean})],P.prototype,"hoverBridge",2);var Cn=new Map,Dl=new WeakMap;function jl(t){return t??{keyframes:[],options:{duration:0}}}function ai(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function _r(t,e){Cn.set(t,jl(e))}function nr(t,e,r){const o=Dl.get(t);if(o?.[e])return ai(o[e],r.dir);const i=Cn.get(e);return i?ai(i,r.dir):{keyframes:[],options:{duration:0}}}function li(t,e){return new Promise(r=>{function o(i){i.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}function ci(t,e,r){return new Promise(o=>{if(r?.duration===1/0)throw new Error("Promise-based animations must be finite.");const i=t.animate(e,fr(Kt({},r),{duration:Nl()?0:r.duration}));i.addEventListener("cancel",o,{once:!0}),i.addEventListener("finish",o,{once:!0})})}function ui(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function Nl(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function hi(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{e.cancel(),requestAnimationFrame(r)})))}var N=class extends W{constructor(){super(),this.localize=new Gt(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=ui(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=ui(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await hi(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=nr(this,"tooltip.show",{dir:this.localize.dir()});await ci(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await hi(this.body);const{keyframes:r,options:o}=nr(this,"tooltip.hide",{dir:this.localize.dir()});await ci(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,li(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,li(this,"sl-after-hide")}render(){return C`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${ut({tooltip:!0,"tooltip--open":this.open})}
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
    `}};N.styles=[ft,ja];N.dependencies={"sl-popup":P};f([tt("slot:not([name])")],N.prototype,"defaultSlot",2);f([tt(".tooltip__body")],N.prototype,"body",2);f([tt("sl-popup")],N.prototype,"popup",2);f([b()],N.prototype,"content",2);f([b()],N.prototype,"placement",2);f([b({type:Boolean,reflect:!0})],N.prototype,"disabled",2);f([b({type:Number})],N.prototype,"distance",2);f([b({type:Boolean,reflect:!0})],N.prototype,"open",2);f([b({type:Number})],N.prototype,"skidding",2);f([b()],N.prototype,"trigger",2);f([b({type:Boolean})],N.prototype,"hoist",2);f([Pt("open",{waitUntilFirstUpdate:!0})],N.prototype,"handleOpenChange",1);f([Pt(["content","distance","hoist","placement","skidding"])],N.prototype,"handleOptionsChange",1);f([Pt("disabled")],N.prototype,"handleDisabledChange",1);_r("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}});_r("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});var Bl=Q`
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
`,j=class extends W{constructor(){super(...arguments),this.localize=new Gt(this),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let t=this.value;if(this.from){const e=this.getRootNode(),r=this.from.includes("."),o=this.from.includes("[")&&this.from.includes("]");let i=this.from,n="";r?[i,n]=this.from.trim().split("."):o&&([i,n]=this.from.trim().replace(/\]$/,"").split("["));const s="getElementById"in e?e.getElementById(i):null;s?o?t=s.getAttribute(n)||"":r?t=s[n]||"":t=s.textContent||"":(this.showStatus("error"),this.emit("sl-error"))}if(!t)this.showStatus("error"),this.emit("sl-error");else try{await navigator.clipboard.writeText(t),this.showStatus("success"),this.emit("sl-copy",{detail:{value:t}})}catch{this.showStatus("error"),this.emit("sl-error")}}async showStatus(t){const e=this.copyLabel||this.localize.term("copy"),r=this.successLabel||this.localize.term("copied"),o=this.errorLabel||this.localize.term("error"),i=t==="success"?this.successIcon:this.errorIcon,n=nr(this,"copy.in",{dir:"ltr"}),s=nr(this,"copy.out",{dir:"ltr"});this.tooltip.content=t==="success"?r:o,await this.copyIcon.animate(s.keyframes,s.options).finished,this.copyIcon.hidden=!0,this.status=t,i.hidden=!1,await i.animate(n.keyframes,n.options).finished,setTimeout(async()=>{await i.animate(s.keyframes,s.options).finished,i.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(n.keyframes,n.options).finished,this.tooltip.content=e,this.isCopying=!1},this.feedbackDuration)}render(){const t=this.copyLabel||this.localize.term("copy");return C`
      <sl-tooltip
        class=${ut({"copy-button":!0,"copy-button--success":this.status==="success","copy-button--error":this.status==="error"})}
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
    `}};j.styles=[ft,Bl];j.dependencies={"sl-icon":nt,"sl-tooltip":N};f([tt('slot[name="copy-icon"]')],j.prototype,"copyIcon",2);f([tt('slot[name="success-icon"]')],j.prototype,"successIcon",2);f([tt('slot[name="error-icon"]')],j.prototype,"errorIcon",2);f([tt("sl-tooltip")],j.prototype,"tooltip",2);f([Yt()],j.prototype,"isCopying",2);f([Yt()],j.prototype,"status",2);f([b()],j.prototype,"value",2);f([b()],j.prototype,"from",2);f([b({type:Boolean,reflect:!0})],j.prototype,"disabled",2);f([b({attribute:"copy-label"})],j.prototype,"copyLabel",2);f([b({attribute:"success-label"})],j.prototype,"successLabel",2);f([b({attribute:"error-label"})],j.prototype,"errorLabel",2);f([b({attribute:"feedback-duration",type:Number})],j.prototype,"feedbackDuration",2);f([b({attribute:"tooltip-placement"})],j.prototype,"tooltipPlacement",2);f([b({type:Boolean})],j.prototype,"hoist",2);_r("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}});_r("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}});j.define("sl-copy-button");/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let En=class extends Event{constructor(e,r,o,i){super("context-request",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=r,this.callback=o,this.subscribe=i??!1}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let di=class{constructor(e,r,o,i){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(n,s)=>{this.unsubscribe&&(this.unsubscribe!==s&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=n,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(n,s)),this.unsubscribe=s},this.host=e,r.context!==void 0){const n=r;this.context=n.context,this.callback=n.callback,this.subscribe=n.subscribe??!1}else this.context=r,this.callback=o,this.subscribe=i??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new En(this.context,this.host,this.t,this.subscribe))}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Ul=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,r=!1){const o=r||!Object.is(e,this.o);this.o=e,o&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(const[r,{disposer:o}]of this.subscriptions)r(this.o,o)},e!==void 0&&(this.value=e)}addCallback(e,r,o){if(!o)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:r});const{disposer:i}=this.subscriptions.get(e);e(this.value,i)}clearCallbacks(){this.subscriptions.clear()}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Fl=class extends Event{constructor(e,r){super("context-provider",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=r}},fi=class extends Ul{constructor(e,r,o){super(r.context!==void 0?r.initialValue:o),this.onContextRequest=i=>{if(i.context!==this.context)return;const n=i.contextTarget??i.composedPath()[0];n!==this.host&&(i.stopPropagation(),this.addCallback(i.callback,n,i.subscribe))},this.onProviderRequest=i=>{if(i.context!==this.context||(i.contextTarget??i.composedPath()[0])===this.host)return;const n=new Set;for(const[s,{consumerHost:a}]of this.subscriptions)n.has(s)||(n.add(s),a.dispatchEvent(new En(this.context,a,s,!0)));i.stopPropagation()},this.host=e,r.context!==void 0?this.context=r.context:this.context=r,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new Fl(this.context,this.host))}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function So({context:t}){return(e,r)=>{const o=new WeakMap;if(typeof r=="object")return{get(){return e.get.call(this)},set(i){return o.get(this).setValue(i),e.set.call(this,i)},init(i){return o.set(this,new fi(this,{context:t,initialValue:i})),i}};{e.constructor.addInitializer((s=>{o.set(s,new fi(s,{context:t}))}));const i=Object.getOwnPropertyDescriptor(e,r);let n;if(i===void 0){const s=new WeakMap;n={get(){return s.get(this)},set(a){o.get(this).setValue(a),s.set(this,a)},configurable:!0,enumerable:!0}}else{const s=i.set;n={...i,set(a){o.get(this).setValue(a),s?.call(this,a)}}}return void Object.defineProperty(e,r,n)}}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ye({context:t,subscribe:e}){return(r,o)=>{typeof o=="object"?o.addInitializer((function(){new di(this,{context:t,callback:i=>{r.set.call(this,i)},subscribe:e})})):r.constructor.addInitializer((i=>{new di(i,{context:t,callback:n=>{i[o]=n},subscribe:e})}))}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ee=(t,e)=>{const r=t._$AN;if(r===void 0)return!1;for(const o of r)o._$AO?.(e,!1),Ee(o,e);return!0},sr=t=>{let e,r;do{if((e=t._$AM)===void 0)break;r=e._$AN,r.delete(t),t=e}while(r?.size===0)},On=t=>{for(let e;e=t._$AM;t=e){let r=e._$AN;if(r===void 0)e._$AN=r=new Set;else if(r.has(t))break;r.add(t),Wl(e)}};function Vl(t){this._$AN!==void 0?(sr(this),this._$AM=t,On(this)):this._$AM=t}function Hl(t,e=!1,r=0){const o=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(e)if(Array.isArray(o))for(let n=r;n<o.length;n++)Ee(o[n],!1),sr(o[n]);else o!=null&&(Ee(o,!1),sr(o));else Ee(this,t)}const Wl=t=>{t.type==lt.CHILD&&(t._$AP??=Hl,t._$AQ??=Vl)};class ql extends je{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,r,o){super._$AT(e,r,o),On(this),this.isConnected=e._$AU}_$AO(e,r=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),r&&(Ee(this,e),sr(this))}setValue(e){if(pn(this._$Ct))this._$Ct._$AI(e,this);else{const r=[...this._$Ct._$AH];r[this._$Ci]=e,this._$Ct._$AI(r,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gl=()=>new Kl;class Kl{}const Lr=new WeakMap,Qt=De(class extends ql{render(t){return T}update(t,[e]){const r=e!==this.G;return r&&this.G!==void 0&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),T}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){const e=this.ht??globalThis;let r=Lr.get(e);r===void 0&&(r=new WeakMap,Lr.set(e,r)),r.get(this.G)!==void 0&&this.G.call(this.ht,void 0),r.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?Lr.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function M(t){return typeof t=="function"}function Yl(t){return M(t?.lift)}function Rt(t){return function(e){if(Yl(e))return e.lift(function(r){try{return t(r,this)}catch(o){this.error(o)}});throw new TypeError("Unable to lift unknown Observable type")}}var Wr=function(t,e){return Wr=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,o){r.__proto__=o}||function(r,o){for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[i]=o[i])},Wr(t,e)};function Xt(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");Wr(t,e);function r(){this.constructor=t}t.prototype=e===null?Object.create(e):(r.prototype=e.prototype,new r)}var ar=function(){return ar=Object.assign||function(e){for(var r,o=1,i=arguments.length;o<i;o++){r=arguments[o];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},ar.apply(this,arguments)};function Zl(t,e){var r={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.indexOf(o)<0&&(r[o]=t[o]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,o=Object.getOwnPropertySymbols(t);i<o.length;i++)e.indexOf(o[i])<0&&Object.prototype.propertyIsEnumerable.call(t,o[i])&&(r[o[i]]=t[o[i]]);return r}function Xl(t,e,r,o){function i(n){return n instanceof r?n:new r(function(s){s(n)})}return new(r||(r=Promise))(function(n,s){function a(h){try{c(o.next(h))}catch(d){s(d)}}function l(h){try{c(o.throw(h))}catch(d){s(d)}}function c(h){h.done?n(h.value):i(h.value).then(a,l)}c((o=o.apply(t,e||[])).next())})}function Pn(t,e){var r={label:0,sent:function(){if(n[0]&1)throw n[1];return n[1]},trys:[],ops:[]},o,i,n,s=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return s.next=a(0),s.throw=a(1),s.return=a(2),typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function a(c){return function(h){return l([c,h])}}function l(c){if(o)throw new TypeError("Generator is already executing.");for(;s&&(s=0,c[0]&&(r=0)),r;)try{if(o=1,i&&(n=c[0]&2?i.return:c[0]?i.throw||((n=i.return)&&n.call(i),0):i.next)&&!(n=n.call(i,c[1])).done)return n;switch(i=0,n&&(c=[c[0]&2,n.value]),c[0]){case 0:case 1:n=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,i=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(n=r.trys,!(n=n.length>0&&n[n.length-1])&&(c[0]===6||c[0]===2)){r=0;continue}if(c[0]===3&&(!n||c[1]>n[0]&&c[1]<n[3])){r.label=c[1];break}if(c[0]===6&&r.label<n[1]){r.label=n[1],n=c;break}if(n&&r.label<n[2]){r.label=n[2],r.ops.push(c);break}n[2]&&r.ops.pop(),r.trys.pop();continue}c=e.call(t,r)}catch(h){c=[6,h],i=0}finally{o=n=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}}function de(t){var e=typeof Symbol=="function"&&Symbol.iterator,r=e&&t[e],o=0;if(r)return r.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function Le(t,e){var r=typeof Symbol=="function"&&t[Symbol.iterator];if(!r)return t;var o=r.call(t),i,n=[],s;try{for(;(e===void 0||e-- >0)&&!(i=o.next()).done;)n.push(i.value)}catch(a){s={error:a}}finally{try{i&&!i.done&&(r=o.return)&&r.call(o)}finally{if(s)throw s.error}}return n}function ze(t,e,r){if(r||arguments.length===2)for(var o=0,i=e.length,n;o<i;o++)(n||!(o in e))&&(n||(n=Array.prototype.slice.call(e,0,o)),n[o]=e[o]);return t.concat(n||Array.prototype.slice.call(e))}function le(t){return this instanceof le?(this.v=t,this):new le(t)}function Jl(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o=r.apply(t,e||[]),i,n=[];return i=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",s),i[Symbol.asyncIterator]=function(){return this},i;function s(u){return function(m){return Promise.resolve(m).then(u,d)}}function a(u,m){o[u]&&(i[u]=function(v){return new Promise(function(_,g){n.push([u,v,_,g])>1||l(u,v)})},m&&(i[u]=m(i[u])))}function l(u,m){try{c(o[u](m))}catch(v){p(n[0][3],v)}}function c(u){u.value instanceof le?Promise.resolve(u.value.v).then(h,d):p(n[0][2],u)}function h(u){l("next",u)}function d(u){l("throw",u)}function p(u,m){u(m),n.shift(),n.length&&l(n[0][0],n[0][1])}}function Ql(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=t[Symbol.asyncIterator],r;return e?e.call(t):(t=typeof de=="function"?de(t):t[Symbol.iterator](),r={},o("next"),o("throw"),o("return"),r[Symbol.asyncIterator]=function(){return this},r);function o(n){r[n]=t[n]&&function(s){return new Promise(function(a,l){s=t[n](s),i(a,l,s.done,s.value)})}}function i(n,s,a,l){Promise.resolve(l).then(function(c){n({value:c,done:a})},s)}}var Rn=(function(t){return t&&typeof t.length=="number"&&typeof t!="function"});function Tn(t){return M(t?.then)}function Ln(t){var e=function(o){Error.call(o),o.stack=new Error().stack},r=t(e);return r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r}var zr=Ln(function(t){return function(r){t(this),this.message=r?r.length+` errors occurred during unsubscription:
`+r.map(function(o,i){return i+1+") "+o.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=r}});function qr(t,e){if(t){var r=t.indexOf(e);0<=r&&t.splice(r,1)}}var xr=(function(){function t(e){this.initialTeardown=e,this.closed=!1,this._parentage=null,this._finalizers=null}return t.prototype.unsubscribe=function(){var e,r,o,i,n;if(!this.closed){this.closed=!0;var s=this._parentage;if(s)if(this._parentage=null,Array.isArray(s))try{for(var a=de(s),l=a.next();!l.done;l=a.next()){var c=l.value;c.remove(this)}}catch(v){e={error:v}}finally{try{l&&!l.done&&(r=a.return)&&r.call(a)}finally{if(e)throw e.error}}else s.remove(this);var h=this.initialTeardown;if(M(h))try{h()}catch(v){n=v instanceof zr?v.errors:[v]}var d=this._finalizers;if(d){this._finalizers=null;try{for(var p=de(d),u=p.next();!u.done;u=p.next()){var m=u.value;try{pi(m)}catch(v){n=n??[],v instanceof zr?n=ze(ze([],Le(n)),Le(v.errors)):n.push(v)}}}catch(v){o={error:v}}finally{try{u&&!u.done&&(i=p.return)&&i.call(p)}finally{if(o)throw o.error}}}if(n)throw new zr(n)}},t.prototype.add=function(e){var r;if(e&&e!==this)if(this.closed)pi(e);else{if(e instanceof t){if(e.closed||e._hasParent(this))return;e._addParent(this)}(this._finalizers=(r=this._finalizers)!==null&&r!==void 0?r:[]).push(e)}},t.prototype._hasParent=function(e){var r=this._parentage;return r===e||Array.isArray(r)&&r.includes(e)},t.prototype._addParent=function(e){var r=this._parentage;this._parentage=Array.isArray(r)?(r.push(e),r):r?[r,e]:e},t.prototype._removeParent=function(e){var r=this._parentage;r===e?this._parentage=null:Array.isArray(r)&&qr(r,e)},t.prototype.remove=function(e){var r=this._finalizers;r&&qr(r,e),e instanceof t&&e._removeParent(this)},t.EMPTY=(function(){var e=new t;return e.closed=!0,e})(),t})(),zn=xr.EMPTY;function In(t){return t instanceof xr||t&&"closed"in t&&M(t.remove)&&M(t.add)&&M(t.unsubscribe)}function pi(t){M(t)?t():t.unsubscribe()}var tc={Promise:void 0},ec={setTimeout:function(t,e){for(var r=[],o=2;o<arguments.length;o++)r[o-2]=arguments[o];return setTimeout.apply(void 0,ze([t,e],Le(r)))},clearTimeout:function(t){return clearTimeout(t)},delegate:void 0};function Mn(t){ec.setTimeout(function(){throw t})}function mi(){}function Je(t){t()}var Co=(function(t){Xt(e,t);function e(r){var o=t.call(this)||this;return o.isStopped=!1,r?(o.destination=r,In(r)&&r.add(o)):o.destination=ic,o}return e.create=function(r,o,i){return new Ie(r,o,i)},e.prototype.next=function(r){this.isStopped||this._next(r)},e.prototype.error=function(r){this.isStopped||(this.isStopped=!0,this._error(r))},e.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},e.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,t.prototype.unsubscribe.call(this),this.destination=null)},e.prototype._next=function(r){this.destination.next(r)},e.prototype._error=function(r){try{this.destination.error(r)}finally{this.unsubscribe()}},e.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},e})(xr),rc=(function(){function t(e){this.partialObserver=e}return t.prototype.next=function(e){var r=this.partialObserver;if(r.next)try{r.next(e)}catch(o){qe(o)}},t.prototype.error=function(e){var r=this.partialObserver;if(r.error)try{r.error(e)}catch(o){qe(o)}else qe(e)},t.prototype.complete=function(){var e=this.partialObserver;if(e.complete)try{e.complete()}catch(r){qe(r)}},t})(),Ie=(function(t){Xt(e,t);function e(r,o,i){var n=t.call(this)||this,s;return M(r)||!r?s={next:r??void 0,error:o??void 0,complete:i??void 0}:s=r,n.destination=new rc(s),n}return e})(Co);function qe(t){Mn(t)}function oc(t){throw t}var ic={closed:!0,next:mi,error:oc,complete:mi},Eo=(function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"})();function $r(t){return t}function nc(t){return t.length===0?$r:t.length===1?t[0]:function(r){return t.reduce(function(o,i){return i(o)},r)}}var U=(function(){function t(e){e&&(this._subscribe=e)}return t.prototype.lift=function(e){var r=new t;return r.source=this,r.operator=e,r},t.prototype.subscribe=function(e,r,o){var i=this,n=ac(e)?e:new Ie(e,r,o);return Je(function(){var s=i,a=s.operator,l=s.source;n.add(a?a.call(n,l):l?i._subscribe(n):i._trySubscribe(n))}),n},t.prototype._trySubscribe=function(e){try{return this._subscribe(e)}catch(r){e.error(r)}},t.prototype.forEach=function(e,r){var o=this;return r=bi(r),new r(function(i,n){var s=new Ie({next:function(a){try{e(a)}catch(l){n(l),s.unsubscribe()}},error:n,complete:i});o.subscribe(s)})},t.prototype._subscribe=function(e){var r;return(r=this.source)===null||r===void 0?void 0:r.subscribe(e)},t.prototype[Eo]=function(){return this},t.prototype.pipe=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return nc(e)(this)},t.prototype.toPromise=function(e){var r=this;return e=bi(e),new e(function(o,i){var n;r.subscribe(function(s){return n=s},function(s){return i(s)},function(){return o(n)})})},t.create=function(e){return new t(e)},t})();function bi(t){var e;return(e=t??tc.Promise)!==null&&e!==void 0?e:Promise}function sc(t){return t&&M(t.next)&&M(t.error)&&M(t.complete)}function ac(t){return t&&t instanceof Co||sc(t)&&In(t)}function Dn(t){return M(t[Eo])}function jn(t){return Symbol.asyncIterator&&M(t?.[Symbol.asyncIterator])}function Nn(t){return new TypeError("You provided "+(t!==null&&typeof t=="object"?"an invalid object":"'"+t+"'")+" where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.")}function lc(){return typeof Symbol!="function"||!Symbol.iterator?"@@iterator":Symbol.iterator}var Bn=lc();function Un(t){return M(t?.[Bn])}function Fn(t){return Jl(this,arguments,function(){var r,o,i,n;return Pn(this,function(s){switch(s.label){case 0:r=t.getReader(),s.label=1;case 1:s.trys.push([1,,9,10]),s.label=2;case 2:return[4,le(r.read())];case 3:return o=s.sent(),i=o.value,n=o.done,n?[4,le(void 0)]:[3,5];case 4:return[2,s.sent()];case 5:return[4,le(i)];case 6:return[4,s.sent()];case 7:return s.sent(),[3,2];case 8:return[3,10];case 9:return r.releaseLock(),[7];case 10:return[2]}})})}function Vn(t){return M(t?.getReader)}function mt(t){if(t instanceof U)return t;if(t!=null){if(Dn(t))return cc(t);if(Rn(t))return uc(t);if(Tn(t))return hc(t);if(jn(t))return Hn(t);if(Un(t))return dc(t);if(Vn(t))return fc(t)}throw Nn(t)}function cc(t){return new U(function(e){var r=t[Eo]();if(M(r.subscribe))return r.subscribe(e);throw new TypeError("Provided object does not correctly implement Symbol.observable")})}function uc(t){return new U(function(e){for(var r=0;r<t.length&&!e.closed;r++)e.next(t[r]);e.complete()})}function hc(t){return new U(function(e){t.then(function(r){e.closed||(e.next(r),e.complete())},function(r){return e.error(r)}).then(null,Mn)})}function dc(t){return new U(function(e){var r,o;try{for(var i=de(t),n=i.next();!n.done;n=i.next()){var s=n.value;if(e.next(s),e.closed)return}}catch(a){r={error:a}}finally{try{n&&!n.done&&(o=i.return)&&o.call(i)}finally{if(r)throw r.error}}e.complete()})}function Hn(t){return new U(function(e){pc(t,e).catch(function(r){return e.error(r)})})}function fc(t){return Hn(Fn(t))}function pc(t,e){var r,o,i,n;return Xl(this,void 0,void 0,function(){var s,a;return Pn(this,function(l){switch(l.label){case 0:l.trys.push([0,5,6,11]),r=Ql(t),l.label=1;case 1:return[4,r.next()];case 2:if(o=l.sent(),!!o.done)return[3,4];if(s=o.value,e.next(s),e.closed)return[2];l.label=3;case 3:return[3,1];case 4:return[3,11];case 5:return a=l.sent(),i={error:a},[3,11];case 6:return l.trys.push([6,,9,10]),o&&!o.done&&(n=r.return)?[4,n.call(r)]:[3,8];case 7:l.sent(),l.label=8;case 8:return[3,10];case 9:if(i)throw i.error;return[7];case 10:return[7];case 11:return e.complete(),[2]}})})}function dt(t,e,r,o,i){return new mc(t,e,r,o,i)}var mc=(function(t){Xt(e,t);function e(r,o,i,n,s,a){var l=t.call(this,r)||this;return l.onFinalize=s,l.shouldUnsubscribe=a,l._next=o?function(c){try{o(c)}catch(h){r.error(h)}}:t.prototype._next,l._error=n?function(c){try{n(c)}catch(h){r.error(h)}finally{this.unsubscribe()}}:t.prototype._error,l._complete=i?function(){try{i()}catch(c){r.error(c)}finally{this.unsubscribe()}}:t.prototype._complete,l}return e.prototype.unsubscribe=function(){var r;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var o=this.closed;t.prototype.unsubscribe.call(this),!o&&((r=this.onFinalize)===null||r===void 0||r.call(this))}},e})(Co),Wn={now:function(){return(Wn.delegate||Date).now()},delegate:void 0};function bc(t){return t&&M(t.schedule)}function qn(t){return t[t.length-1]}function vc(t){return M(qn(t))?t.pop():void 0}function gc(t){return bc(qn(t))?t.pop():void 0}function At(t,e,r,o,i){o===void 0&&(o=0),i===void 0&&(i=!1);var n=e.schedule(function(){r(),i?t.add(this.schedule(null,o)):this.unsubscribe()},o);if(t.add(n),!i)return n}var yc=Array.isArray,wc=Object.getPrototypeOf,_c=Object.prototype,xc=Object.keys;function $c(t){if(t.length===1){var e=t[0];if(yc(e))return{args:e,keys:null};if(kc(e)){var r=xc(e);return{args:r.map(function(o){return e[o]}),keys:r}}}return{args:t,keys:null}}function kc(t){return t&&typeof t=="object"&&wc(t)===_c}function Gn(t,e){return e===void 0&&(e=0),Rt(function(r,o){r.subscribe(dt(o,function(i){return At(o,t,function(){return o.next(i)},e)},function(){return At(o,t,function(){return o.complete()},e)},function(i){return At(o,t,function(){return o.error(i)},e)}))})}function Kn(t,e){return e===void 0&&(e=0),Rt(function(r,o){o.add(t.schedule(function(){return r.subscribe(o)},e))})}function Ac(t,e){return mt(t).pipe(Kn(e),Gn(e))}function Sc(t,e){return mt(t).pipe(Kn(e),Gn(e))}function Cc(t,e){return new U(function(r){var o=0;return e.schedule(function(){o===t.length?r.complete():(r.next(t[o++]),r.closed||this.schedule())})})}function Ec(t,e){return new U(function(r){var o;return At(r,e,function(){o=t[Bn](),At(r,e,function(){var i,n,s;try{i=o.next(),n=i.value,s=i.done}catch(a){r.error(a);return}s?r.complete():r.next(n)},0,!0)}),function(){return M(o?.return)&&o.return()}})}function Yn(t,e){if(!t)throw new Error("Iterable cannot be null");return new U(function(r){At(r,e,function(){var o=t[Symbol.asyncIterator]();At(r,e,function(){o.next().then(function(i){i.done?r.complete():r.next(i.value)})},0,!0)})})}function Oc(t,e){return Yn(Fn(t),e)}function Pc(t,e){if(t!=null){if(Dn(t))return Ac(t,e);if(Rn(t))return Cc(t,e);if(Tn(t))return Sc(t,e);if(jn(t))return Yn(t,e);if(Un(t))return Ec(t,e);if(Vn(t))return Oc(t,e)}throw Nn(t)}function Zn(t,e){return e?Pc(t,e):mt(t)}function Oo(t,e){return Rt(function(r,o){var i=0;r.subscribe(dt(o,function(n){o.next(t.call(e,n,i++))}))})}var Rc=Array.isArray;function Tc(t,e){return Rc(e)?t.apply(void 0,ze([],Le(e))):t(e)}function Lc(t){return Oo(function(e){return Tc(t,e)})}function zc(t,e){return t.reduce(function(r,o,i){return r[o]=e[i],r},{})}function Ic(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=gc(t),o=vc(t),i=$c(t),n=i.args,s=i.keys;if(n.length===0)return Zn([],r);var a=new U(Mc(n,r,s?function(l){return zc(s,l)}:$r));return o?a.pipe(Lc(o)):a}function Mc(t,e,r){return r===void 0&&(r=$r),function(o){vi(e,function(){for(var i=t.length,n=new Array(i),s=i,a=i,l=function(h){vi(e,function(){var d=Zn(t[h],e),p=!1;d.subscribe(dt(o,function(u){n[h]=u,p||(p=!0,a--),a||o.next(r(n.slice()))},function(){--s||o.complete()}))},o)},c=0;c<i;c++)l(c)},o)}}function vi(t,e,r){t?At(r,t,e):e()}function Dc(t,e,r,o,i,n,s,a){var l=[],c=0,h=0,d=!1,p=function(){d&&!l.length&&!c&&e.complete()},u=function(v){return c<o?m(v):l.push(v)},m=function(v){c++;var _=!1;mt(r(v,h++)).subscribe(dt(e,function(g){e.next(g)},function(){_=!0},void 0,function(){if(_)try{c--;for(var g=function(){var w=l.shift();s||m(w)};l.length&&c<o;)g();p()}catch(w){e.error(w)}}))};return t.subscribe(dt(e,u,function(){d=!0,p()})),function(){}}function Xn(t,e,r){return r===void 0&&(r=1/0),M(e)?Xn(function(o,i){return Oo(function(n,s){return e(o,n,i,s)})(mt(t(o,i)))},r):(typeof e=="number"&&(r=e),Rt(function(o,i){return Dc(o,i,t,r)}))}var jc=Ln(function(t){return function(){t(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}}),Be=(function(t){Xt(e,t);function e(){var r=t.call(this)||this;return r.closed=!1,r.currentObservers=null,r.observers=[],r.isStopped=!1,r.hasError=!1,r.thrownError=null,r}return e.prototype.lift=function(r){var o=new gi(this,this);return o.operator=r,o},e.prototype._throwIfClosed=function(){if(this.closed)throw new jc},e.prototype.next=function(r){var o=this;Je(function(){var i,n;if(o._throwIfClosed(),!o.isStopped){o.currentObservers||(o.currentObservers=Array.from(o.observers));try{for(var s=de(o.currentObservers),a=s.next();!a.done;a=s.next()){var l=a.value;l.next(r)}}catch(c){i={error:c}}finally{try{a&&!a.done&&(n=s.return)&&n.call(s)}finally{if(i)throw i.error}}}})},e.prototype.error=function(r){var o=this;Je(function(){if(o._throwIfClosed(),!o.isStopped){o.hasError=o.isStopped=!0,o.thrownError=r;for(var i=o.observers;i.length;)i.shift().error(r)}})},e.prototype.complete=function(){var r=this;Je(function(){if(r._throwIfClosed(),!r.isStopped){r.isStopped=!0;for(var o=r.observers;o.length;)o.shift().complete()}})},e.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(e.prototype,"observed",{get:function(){var r;return((r=this.observers)===null||r===void 0?void 0:r.length)>0},enumerable:!1,configurable:!0}),e.prototype._trySubscribe=function(r){return this._throwIfClosed(),t.prototype._trySubscribe.call(this,r)},e.prototype._subscribe=function(r){return this._throwIfClosed(),this._checkFinalizedStatuses(r),this._innerSubscribe(r)},e.prototype._innerSubscribe=function(r){var o=this,i=this,n=i.hasError,s=i.isStopped,a=i.observers;return n||s?zn:(this.currentObservers=null,a.push(r),new xr(function(){o.currentObservers=null,qr(a,r)}))},e.prototype._checkFinalizedStatuses=function(r){var o=this,i=o.hasError,n=o.thrownError,s=o.isStopped;i?r.error(n):s&&r.complete()},e.prototype.asObservable=function(){var r=new U;return r.source=this,r},e.create=function(r,o){return new gi(r,o)},e})(U),gi=(function(t){Xt(e,t);function e(r,o){var i=t.call(this)||this;return i.destination=r,i.source=o,i}return e.prototype.next=function(r){var o,i;(i=(o=this.destination)===null||o===void 0?void 0:o.next)===null||i===void 0||i.call(o,r)},e.prototype.error=function(r){var o,i;(i=(o=this.destination)===null||o===void 0?void 0:o.error)===null||i===void 0||i.call(o,r)},e.prototype.complete=function(){var r,o;(o=(r=this.destination)===null||r===void 0?void 0:r.complete)===null||o===void 0||o.call(r)},e.prototype._subscribe=function(r){var o,i;return(i=(o=this.source)===null||o===void 0?void 0:o.subscribe(r))!==null&&i!==void 0?i:zn},e})(Be),Nc=new U(function(t){return t.complete()});function Bc(t){return t<=0?function(){return Nc}:Rt(function(e,r){var o=0;e.subscribe(dt(r,function(i){++o<=t&&(r.next(i),t<=o&&r.complete())}))})}function Uc(t){return Oo(function(){return t})}function Fc(t,e){return Xn(function(r,o){return mt(t(r,o)).pipe(Bc(1),Uc(r))})}var Vc=(function(t){Xt(e,t);function e(r){var o=t.call(this)||this;return o._value=r,o}return Object.defineProperty(e.prototype,"value",{get:function(){return this.getValue()},enumerable:!1,configurable:!0}),e.prototype._subscribe=function(r){var o=t.prototype._subscribe.call(this,r);return!o.closed&&r.next(this._value),o},e.prototype.getValue=function(){var r=this,o=r.hasError,i=r.thrownError,n=r._value;if(o)throw i;return this._throwIfClosed(),n},e.prototype.next=function(r){t.prototype.next.call(this,this._value=r)},e})(Be),Hc=(function(t){Xt(e,t);function e(r,o,i){r===void 0&&(r=1/0),o===void 0&&(o=1/0),i===void 0&&(i=Wn);var n=t.call(this)||this;return n._bufferSize=r,n._windowTime=o,n._timestampProvider=i,n._buffer=[],n._infiniteTimeWindow=!0,n._infiniteTimeWindow=o===1/0,n._bufferSize=Math.max(1,r),n._windowTime=Math.max(1,o),n}return e.prototype.next=function(r){var o=this,i=o.isStopped,n=o._buffer,s=o._infiniteTimeWindow,a=o._timestampProvider,l=o._windowTime;i||(n.push(r),!s&&n.push(a.now()+l)),this._trimBuffer(),t.prototype.next.call(this,r)},e.prototype._subscribe=function(r){this._throwIfClosed(),this._trimBuffer();for(var o=this._innerSubscribe(r),i=this,n=i._infiniteTimeWindow,s=i._buffer,a=s.slice(),l=0;l<a.length&&!r.closed;l+=n?1:2)r.next(a[l]);return this._checkFinalizedStatuses(r),o},e.prototype._trimBuffer=function(){var r=this,o=r._bufferSize,i=r._timestampProvider,n=r._buffer,s=r._infiniteTimeWindow,a=(s?1:2)*o;if(o<1/0&&a<n.length&&n.splice(0,n.length-a),!s){for(var l=i.now(),c=0,h=1;h<n.length&&n[h]<=l;h+=2)c=h;c&&n.splice(0,c+1)}},e})(Be);function Wc(t){t===void 0&&(t={});var e=t.connector,r=e===void 0?function(){return new Be}:e,o=t.resetOnError,i=o===void 0?!0:o,n=t.resetOnComplete,s=n===void 0?!0:n,a=t.resetOnRefCountZero,l=a===void 0?!0:a;return function(c){var h,d,p,u=0,m=!1,v=!1,_=function(){d?.unsubscribe(),d=void 0},g=function(){_(),h=p=void 0,m=v=!1},w=function(){var $=h;g(),$?.unsubscribe()};return Rt(function($,A){u++,!v&&!m&&_();var S=p=p??r();A.add(function(){u--,u===0&&!v&&!m&&(d=Ir(w,l))}),S.subscribe(A),!h&&u>0&&(h=new Ie({next:function(R){return S.next(R)},error:function(R){v=!0,_(),d=Ir(g,i,R),S.error(R)},complete:function(){m=!0,_(),d=Ir(g,s),S.complete()}}),mt($).subscribe(h))})(c)}}function Ir(t,e){for(var r=[],o=2;o<arguments.length;o++)r[o-2]=arguments[o];if(e===!0){t();return}if(e!==!1){var i=new Ie({next:function(){i.unsubscribe(),t()}});return mt(e.apply(void 0,ze([],Le(r)))).subscribe(i)}}function yi(t,e,r){var o,i,n,s,a=!1;return t&&typeof t=="object"?(o=t.bufferSize,s=o===void 0?1/0:o,i=t.windowTime,e=i===void 0?1/0:i,n=t.refCount,a=n===void 0?!1:n,r=t.scheduler):s=t??1/0,Wc({connector:function(){return new Hc(s,e,r)},resetOnError:!0,resetOnComplete:!1,resetOnRefCountZero:a})}function wi(t,e){return Rt(function(r,o){var i=null,n=0,s=!1,a=function(){return s&&!i&&o.complete()};r.subscribe(dt(o,function(l){i?.unsubscribe();var c=0,h=n++;mt(t(l,h)).subscribe(i=dt(o,function(d){return o.next(e?e(l,d,h,c++):d)},function(){i=null,a()}))},function(){s=!0,a()}))})}function Po(t,e,r){var o=M(t)||e||r?{next:t,error:e,complete:r}:t;return o?Rt(function(i,n){var s;(s=o.subscribe)===null||s===void 0||s.call(o);var a=!0;i.subscribe(dt(n,function(l){var c;(c=o.next)===null||c===void 0||c.call(o,l),n.next(l)},function(){var l;a=!1,(l=o.complete)===null||l===void 0||l.call(o),n.complete()},function(l){var c;a=!1,(c=o.error)===null||c===void 0||c.call(o,l),n.error(l)},function(){var l,c;a&&((l=o.unsubscribe)===null||l===void 0||l.call(o)),(c=o.finalize)===null||c===void 0||c.call(o)}))}):$r}function qc(t){return typeof t=="number"}function Gc(t){return typeof t=="string"}function Kc(t){return typeof t=="bigint"}function Jn(t){return!!t&&Object.prototype.toString.call(t)==="[object Date]"&&!isNaN(t)}function Qn(t){return t!=null&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"}var Yc=Symbol.for("decoders.kAnnotationRegistry"),ts=globalThis[Yc]??=new WeakSet;function Ue(t){return ts.add(t),t}function es(t,e){return Ue({type:"object",fields:t,text:e})}function Zc(t,e){return Ue({type:"array",items:t,text:e})}function Ge(t,e){return Ue({type:"opaque",value:t,text:e})}function Xc(t,e){return Ue({type:"scalar",value:t,text:e})}function rs(t,e){return e!==void 0?Ue({...t,text:e}):t}function os(t,e){const r=new Map([...t.fields,...e]);return es(r,t.text)}function is(t){return ts.has(t)}function Jc(t,e,r){r.add(t);const o=[];for(const i of t)o.push(Ro(i,void 0,r));return Zc(o,e)}function ns(t,e,r){r.add(t);const o=new Map;for(const i of Object.keys(t)){const n=t[i];o.set(i,Ro(n,void 0,r))}return es(o,e)}function Ro(t,e,r){return t==null||typeof t=="string"||typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"||typeof t.getMonth=="function"?Xc(t,e):is(t)?rs(t,e):Array.isArray(t)?r.has(t)?Ge("<circular ref>",e):Jc(t,e,r):Qn(t)?r.has(t)?Ge("<circular ref>",e):ns(t,e,r):Ge(typeof t=="function"?"<function>":"???",e)}function Bt(t,e){return Ro(t,e,new WeakSet)}function ss(t,e){return ns(t,e,new WeakSet)}var Ut="  ";function Gr(t){return t.includes(`
`)}function To(t,e=Ut){return Gr(t)?t.split(`
`).map(r=>`${e}${r}`).join(`
`):`${e}${t}`}var Qc=/'/g;function fe(t){return typeof t=="string"?"'"+t.replace(Qc,"\\'")+"'":t===void 0?"undefined":JSON.stringify(t)}function lr(t,e=[]){const r=[];if(t.type==="array"){const n=t.items;let s=0;for(const a of n)for(const l of lr(a,[...e,s++]))r.push(l)}else if(t.type==="object"){const n=t.fields;for(const[s,a]of n)for(const l of lr(a,[...e,s]))r.push(l)}const o=t.text;if(!o)return r;let i;return e.length===0?i="":e.length===1?i=typeof e[0]=="number"?`Value at index ${e[0]}: `:`Value at key ${fe(e[0])}: `:i=`Value at keypath ${fe(e.map(String).join("."))}: `,[...r,`${i}${o}`]}function tu(t,e=80){let r=JSON.stringify(t);if(r.length<=e)return r;const o=`${t.substring(0,e-15)}...`;return r=`${JSON.stringify(o)} [truncated]`,r}function eu(t,e){const{items:r}=t;if(r.length===0)return"[]";const o=[];for(const i of r){const[n,s]=Lo(i,`${e}${Ut}`);o.push(`${e}${Ut}${n},`),s!==void 0&&o.push(To(s,`${e}${Ut}`))}return["[",...o,`${e}]`].join(`
`)}function ru(t,e){const{fields:r}=t;if(r.size===0)return"{}";const o=[];for(const[i,n]of r){const s=as(i),a=`${e}${Ut}${" ".repeat(s.length+2)}`,[l,c]=Lo(n,`${e}${Ut}`);o.push(`${e}${Ut}${s}: ${l},`),c!==void 0&&o.push(To(c,a))}return["{",...o,`${e}}`].join(`
`)}function as(t){return typeof t=="string"?tu(t):typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"?t.toString():t===null?"null":t===void 0?"undefined":Jn(t)?`new Date(${fe(t.toISOString())})`:t instanceof Date?"(Invalid Date)":"(unserializable)"}function Lo(t,e=""){let r;t.type==="array"?r=eu(t,e):t.type==="object"?r=ru(t,e):t.type==="scalar"?r=as(t.value):r=t.value;const o=t.text;if(o!==void 0){const i="^".repeat(Gr(r)?1:r.length);return[r,[i,o].join(Gr(o)?`
`:" ")]}else return[r,void 0]}function ou(t){const[e,r]=Lo(t);return r!==void 0?`${e}
${r}`:e}function iu(t){return lr(t,[]).join(`
`)}function*Kr(t,e){switch(t.text&&(e.length>0?yield{message:t.text,path:[...e]}:yield{message:t.text}),t.type){case"array":{let r=0;for(const o of t.items)e.push(r++),yield*Kr(o,e),e.pop();break}case"object":{for(const[r,o]of t.fields)e.push(r),yield*Kr(o,e),e.pop();break}}}function nu(t){return Array.from(Kr(t,[]))}function ls(t){return{ok:!0,value:t,error:void 0}}function cs(t){return{ok:!1,value:void 0,error:t}}function su(t){return e=>{try{const r=t(e);return ls(r)}catch(r){return cs(Bt(e,r instanceof Error?r.message:String(r)))}}}function au(t,e){const r=e(t);if(typeof r=="string"){const o=new Error(`
${r}`);return o.name="Decoding error",o}else return r}function F(t){function e(u){return t(u,ls,v=>cs(is(v)?v:Bt(u,v)))}function r(u,m=ou){const v=e(u);if(v.ok)return v.value;throw au(v.error,m)}function o(u){return e(u).value}function i(u){return a(su(u))}function n(u,m){return c(v=>u(v)?null:m)}function s(){return p}function a(u){return F((m,v,_)=>{const g=e(m);if(!g.ok)return g;const w=_i(u)?u:u(g.value,v,_);return _i(w)?w.decode(g.value):w})}function l(u){return a(u)}function c(u){return a((m,v,_)=>{const g=u(m);return g===null?v(m):_(typeof g=="string"?Bt(m,g):g)})}function h(u){return F((m,v,_)=>{const g=e(m);return g.ok?g:_(Bt(g.error,u))})}const p=cu({verify:r,value:o,decode:e,transform:i,refine:n,refineType:s,reject:c,describe:h,then:a,pipe:l,"~standard":{version:1,vendor:"decoders",validate:u=>{const m=e(u);return m.ok?{value:m.value}:{issues:nu(m.error)}}}});return p}var lu=Symbol.for("decoders.kDecoderRegistry"),us=globalThis[lu]??=new WeakSet;function cu(t){return us.add(t),t}function _i(t){return us.has(t)}var uu=F((t,e,r)=>Array.isArray(t)?e(t):r("Must be an array"));function Ht(t){const e=t.decode;return uu.then((r,o,i)=>{const n=[];for(let s=0;s<r.length;++s){const a=r[s],l=e(a);if(l.ok)n.push(l.value);else{n.length=0;const c=l.error,h=r.slice();return h.splice(s,1,Bt(c,c.text?`${c.text} (at index ${s})`:`index ${s}`)),i(Bt(h))}}return o(n)})}function hu(t){return F((e,r,o)=>e instanceof t?r(e):o(`Must be ${t.name} instance`))}function hs(t){return F(e=>t().decode(e))}function du(t,e){const r=new Set;for(const o of t)e.has(o)||r.add(o);return r}var ds=F((t,e,r)=>Qn(t)?e(t):r("Must be an object"));function q(t){const e=new Set(Object.keys(t));return ds.then((r,o,i)=>{const n=new Set(Object.keys(r)),s=du(e,n),a={};let l=null;for(const c of Object.keys(t)){const h=t[c],d=r[c],p=h.decode(d);if(p.ok){const u=p.value;u!==void 0&&(a[c]=u),s.delete(c)}else{const u=p.error;d===void 0?s.add(c):(l??=new Map,l.set(c,u))}}if(l||s.size>0){let c=ss(r);if(l&&(c=os(c,l)),s.size>0){const h=Array.from(s).map(fe).join(", "),d=s.size>1?"keys":"key";c=rs(c,`Missing ${d}: ${h}`)}return i(c)}return o(a)})}var Yr=`Either:
`;function fu(t){return`-${To(t).substring(1)}`}function pu(t){return t.startsWith(Yr)?t.substring(Yr.length):fu(t)}function pe(...t){if(t.length===0)throw new Error("Pass at least one decoder to either()");return F((e,r,o)=>{const i=[];for(const s of t){const a=s.decode(e);if(a.ok)return a;i.push(a.error)}const n=Yr+i.map(s=>pu(lr(s).join(`
`))).join(`
`);return o(n)})}var Zr=cr(null);cr(void 0);F((t,e,r)=>t==null?e(t):r("Must be undefined or null"));function cr(t){return F((e,r,o)=>e===t?r(t):o(`Must be ${typeof t=="symbol"?String(t):fe(t)}`))}var mu=F((t,e,r)=>e(t)),fs=mu,k=F((t,e,r)=>typeof t=="boolean"?e(t):r("Must be boolean"));F((t,e,r)=>e(!!t));function ps(t,e){const r=e!==void 0?t:void 0,o=e??t;return ds.then((i,n,s)=>{let a={};const l=new Map;for(const c of Object.keys(i)){const h=i[c],d=r?.decode(c);if(d?.ok===!1)return s(Bt(i,`Invalid key ${fe(c)}: ${iu(d.error)}`));const p=d?.value??c,u=o.decode(h);u.ok?l.size===0&&(a[p]=u.value):(l.set(c,u.error),a={})}return l.size>0?s(os(ss(i),l)):n(a)})}var bu=/^([A-Za-z]{2,12}(?:[+][A-Za-z]{2,12})?):\/\/(?:([^@:]*:?(?:[^@]+)?)@)?(?:([A-Za-z0-9.-]+)(?::([0-9]{2,5}))?)(\/(?:[-+~%/.,\w]*)?(?:\?[-+=&;%@.,/\w]*)?(?:#[.,!/\w]*)?)?$/,y=F((t,e,r)=>Gc(t)?e(t):r("Must be string"));Tt(/\S/,"Must be non-empty string");function Tt(t,e){return y.refine(r=>t.test(r),e)}Tt(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Must be email");var vu=pe(Tt(bu,"Must be URL").transform(t=>new URL(t)),hu(URL));vu.refine(t=>t.protocol==="https:","Must be an HTTPS URL");Tt(/^[a-z_][a-z0-9_]*$/i,"Must be valid identifier");var ms=Tt(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,"Must be uuid");ms.refine(t=>t[14]==="1","Must be uuidv1");ms.refine(t=>t[14]==="4","Must be uuidv4");var gu=Tt(/^[0-9]+$/,"Must only contain digits");Tt(/^[0-9a-f]+$/i,"Must only contain hexadecimal digits");gu.transform(Number);var yu=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.]\d+)?(?:Z|[+-]\d{2}:?\d{2})$/,wu=F((t,e,r)=>Jn(t)?e(t):r("Must be a Date")),_u=Tt(yu,"Must be ISO8601 format").refine(t=>!isNaN(new Date(t).getTime()),"Must be valid date/time value"),xu=_u.transform(t=>new Date(t));pe(wu,xu).describe("Must be a Date or date string");var $u=F((t,e,r)=>qc(t)?e(t):r("Must be number")),z=$u.refine(t=>Number.isFinite(t),"Number must be finite"),ku=z.refine(t=>Number.isInteger(t),"Number must be an integer");z.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");ku.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");F((t,e,r)=>Kc(t)?e(t):r("Must be bigint"));var Au=hs(()=>ps(bs)),Su=hs(()=>Ht(bs)),bs=pe(Zr,y,z,k,Au,Su).describe("Must be valid JSON value");const Cu=["family","climbing"],Eu=q({width:z,height:z,url:y,accessories:Ht(fs)}),vs=q({header_full_width:z,header_full_height:z,avatar_shape:y,background_color:y,body_font:y,header_bounds:y,header_image:y,header_image_focused:y,header_image_poster:y,header_image_scaled:y,header_stretch:k,link_color:y,show_avatar:k,show_description:k,show_header_image:k,show_title:k,title_color:y,title_font:y,title_font_weight:y}),gs=q({admin:k,ask:k,ask_anon:k,ask_page_title:y,asks_allow_media:k,avatar:Ht(Eu),can_chat:k,can_send_fan_mail:k,can_subscribe:k,description:y,drafts:z,facebook:y,facebook_opengraph_enabled:y,followed:k,followers:z,is_blocked_from_primary:k,is_nsfw:k,messages:z,name:y,posts:z,primary:k,queue:z,share_likes:k,subscribed:k,theme_id:z,theme:vs,title:y,total_posts:z,tweet:y,twitter_enabled:k,twitter_send:k,type:y,updated:z,url:y,uuid:y}),Ou=q({name:y,title:y,description:y,url:y,uuid:y,updated:z,tumblrmart_accessories:ps(y,fs),can_show_badges:k}),Pu=q({comment:y,tree_html:y}),Ru=q({blog:q({name:y,active:k,theme:vs,share_likes:k,share_following:k,can_be_followed:k}),post:q({id:y}),content_raw:y,content:y,is_current_item:k,is_root_item:k}),Tu=q({type:y,is_blocks_post_format:k,blog_name:y,blog:Ou,id:y,id_string:y,is_blazed:k,is_blaze_pending:k,can_ignite:k,can_blaze:k,post_url:y,slug:y,date:y,timestamp:z,state:y,format:y,reblog_key:y,tags:Ht(y),short_url:y,summary:y,should_open_in_legacy:k,recommended_source:pe(y,Zr),recommended_color:pe(y,Zr),followed:k,liked:k,note_count:z,title:y,body:y,reblog:Pu,trail:Ht(Ru),can_like:k,interactability_reblog:y,interactability_blaze:y,can_reblog:k,can_send_in_message:k,muted:k,mute_end_timestamp:z,can_mute:k,can_reply:k,display_avatar:k}),Lu=q({blog:gs,posts:Ht(Tu),total_posts:z});q({blog:q({blog:gs}),posts:Lu});q({avatar:y,updated:z,title:y,description:y});q({id:y,date:z,body:y,tags:Ht(y)});class Fe extends se{createRenderRoot(){return this}}function zu(){return new U(t=>{const e=requestIdleCallback(()=>{t.next(),t.complete()});return()=>cancelIdleCallback(e)})}function Lt(t){return function(e,r){let o;const i=e.connectedCallback,n=e.disconnectedCallback;e.connectedCallback=function(){i.call(this),o=t(this).subscribe(s=>{this[r]=s,this.requestUpdate()})},e.disconnectedCallback=function(){o?.unsubscribe(),n.call(this)}}}function xi(t,e){e===void 0&&(e={});var r=e.selector,o=Zl(e,["selector"]);return new U(function(i){var n=new AbortController,s=n.signal,a=!0,l=o.signal;if(l)if(l.aborted)n.abort();else{var c=function(){s.aborted||n.abort()};l.addEventListener("abort",c),i.add(function(){return l.removeEventListener("abort",c)})}var h=ar(ar({},o),{signal:s}),d=function(p){a=!1,i.error(p)};return fetch(t,h).then(function(p){r?mt(r(p)).subscribe(dt(i,void 0,function(){a=!1,i.complete()},d)):(a=!1,i.next(p),i.complete())}).catch(d),function(){a&&n.abort()}})}const kr="blog";class Iu{constructor(){this.meta$=xi("/dadmaxxing/meta.json").pipe(wi(e=>e.json()),yi({bufferSize:1,refCount:!0})),this.posts$=xi("/dadmaxxing/posts.json").pipe(wi(e=>e.json()),yi({bufferSize:1,refCount:!0})),Ic([this.meta$,this.posts$]).subscribe({error:e=>console.warn("failed to load tumblr data",e)})}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $i=new WeakMap,ki=t=>{if((r=>r.pattern!==void 0)(t))return t.pattern;let e=$i.get(t);return e===void 0&&$i.set(t,e=new URLPattern({pathname:t.path})),e};let Mu=class{constructor(e,r,o){this.routes=[],this.o=[],this.t={},this.i=i=>{if(i.routes===this)return;const n=i.routes;this.o.push(n),n.h=this,i.stopImmediatePropagation(),i.onDisconnect=()=>{this.o?.splice(this.o.indexOf(n)>>>0,1)};const s=Ai(this.t);s!==void 0&&n.goto(s)},(this.l=e).addController(this),this.routes=[...r],this.fallback=o?.fallback}link(e){if(e?.startsWith("/"))return e;if(e?.startsWith("."))throw Error("Not implemented");return e??=this.u,(this.h?.link()??"")+e}async goto(e){let r;if(this.routes.length===0&&this.fallback===void 0)r=e,this.u="",this.t={0:r};else{const o=this.p(e);if(o===void 0)throw Error("No route found for "+e);const i=ki(o).exec({pathname:e}),n=i?.pathname.groups??{};if(r=Ai(n),typeof o.enter=="function"&&await o.enter(n)===!1)return;this.v=o,this.t=n,this.u=r===void 0?e:e.substring(0,e.length-r.length)}if(r!==void 0)for(const o of this.o)o.goto(r);this.l.requestUpdate()}outlet(){return this.v?.render?.(this.t)}get params(){return this.t}p(e){const r=this.routes.find((o=>ki(o).test({pathname:e})));return r||this.fallback===void 0?r:this.fallback?{...this.fallback,path:"/*"}:void 0}hostConnected(){this.l.addEventListener(Xr.eventName,this.i);const e=new Xr(this);this.l.dispatchEvent(e),this._=e.onDisconnect}hostDisconnected(){this._?.(),this.h=void 0}};const Ai=t=>{let e;for(const r of Object.keys(t))/\d+/.test(r)&&(e===void 0||r>e)&&(e=r);return e&&t[e]};let Xr=class ys extends Event{constructor(e){super(ys.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.routes=e}};Xr.eventName="lit-routes-connected";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Du=location.origin||location.protocol+"//"+location.host;class ju extends Mu{constructor(){super(...arguments),this.m=e=>{const r=e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey;if(e.defaultPrevented||r)return;const o=e.composedPath().find((s=>s.tagName==="A"));if(o===void 0||o.target!==""||o.hasAttribute("download")||o.getAttribute("rel")==="external")return;const i=o.href;if(i===""||i.startsWith("mailto:"))return;const n=window.location;o.origin===Du&&(e.preventDefault(),i!==n.href&&(window.history.pushState({},"",i),this.goto(o.pathname)))},this.R=e=>{this.goto(window.location.pathname)}}hostConnected(){super.hostConnected(),window.addEventListener("click",this.m),window.addEventListener("popstate",this.R),this.goto(window.location.pathname)}hostDisconnected(){super.hostDisconnected(),window.removeEventListener("click",this.m),window.removeEventListener("popstate",this.R)}}const zo="router";class Nu extends ju{constructor(){super(...arguments),this.#e=new Be,this.pathname$=this.#e.asObservable()}#e;async goto(e){const r=e.replace(/\/$/,"");await super.goto(r),this.#e.next(r)}}const ws="theme",_s="app-theme",Bu=pe(cr("light"),cr("dark"));function Uu(){return Bu.value(localStorage.getItem(_s))}function Fu(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}class Vu{constructor(){this.#e=new Vc(Uu()??Fu()),this.theme$=this.#e.asObservable(),this.theme$.subscribe({next:e=>{localStorage.setItem(_s,e),e==="dark"?document.documentElement.classList.add("sl-theme-dark"):document.documentElement.classList.remove("sl-theme-dark")},error:e=>console.warn("failed to apply theme",{err:e})})}#e;toggle(){this.#e.next(this.#e.getValue()==="dark"?"light":"dark")}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Si=(t,e,r)=>{const o=new Map;for(let i=e;i<=r;i++)o.set(t[i],i);return o},Hu=De(class extends je{constructor(t){if(super(t),t.type!==lt.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,e,r){let o;r===void 0?r=e:e!==void 0&&(o=e);const i=[],n=[];let s=0;for(const a of t)i[s]=o?o(a,s):s,n[s]=r(a,s),s++;return{values:n,keys:i}}render(t,e,r){return this.dt(t,e,r).values}update(t,[e,r,o]){const i=Oa(t),{values:n,keys:s}=this.dt(e,r,o);if(!Array.isArray(i))return this.ut=s,n;const a=this.ut??=[],l=[];let c,h,d=0,p=i.length-1,u=0,m=n.length-1;for(;d<=p&&u<=m;)if(i[d]===null)d++;else if(i[p]===null)p--;else if(a[d]===s[u])l[u]=Mt(i[d],n[u]),d++,u++;else if(a[p]===s[m])l[m]=Mt(i[p],n[m]),p--,m--;else if(a[d]===s[m])l[m]=Mt(i[d],n[m]),Ae(t,l[m+1],i[d]),d++,m--;else if(a[p]===s[u])l[u]=Mt(i[p],n[u]),Ae(t,i[d],i[p]),p--,u++;else if(c===void 0&&(c=Si(s,u,m),h=Si(a,d,p)),c.has(a[d]))if(c.has(a[p])){const v=h.get(s[u]),_=v!==void 0?i[v]:null;if(_===null){const g=Ae(t,i[d]);Mt(g,n[u]),l[u]=g}else l[u]=Mt(_,n[u]),Ae(t,i[d],_),i[v]=null;u++}else Er(i[p]),p--;else Er(i[d]),d++;for(;u<=m;){const v=Ae(t,l[m+1]);Mt(v,n[u]),l[u++]=v}for(;d<=p;){const v=i[d++];v!==null&&Er(v)}return this.ut=s,mn(t,l),Y}});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Jr extends je{constructor(e){if(super(e),this.it=T,e.type!==lt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===T||e==null)return this._t=void 0,this.it=e;if(e===Y)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}}Jr.directiveName="unsafeHTML",Jr.resultType=1;const xs=De(Jr);function Wu(t){return new U(e=>{const r=new MutationObserver(()=>e.next());return r.observe(t,{childList:!0,subtree:!0}),()=>r.disconnect()})}var qu=Object.defineProperty,Gu=Object.getOwnPropertyDescriptor,$s=t=>{throw TypeError(t)},gt=(t,e,r,o)=>{for(var i=o>1?void 0:o?Gu(e,r):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&qu(e,r,i),i},Ku=(t,e,r)=>e.has(t)||$s("Cannot "+r),Yu=(t,e,r)=>e.has(t)?$s("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),Qe=(t,e,r)=>(Ku(t,e,"access private method"),r),ie,Qr,ks,As;let ur=class extends Fe{constructor(){super(...arguments),this.body=""}render(){return xs(this.body)}};gt([b()],ur.prototype,"body",2);gt([Lt(t=>Wu(t).pipe(Po(()=>{const e=[...t.querySelectorAll("figure")].flatMap(r=>{const o=parseFloat(r.getAttribute("data-orig-height")??""),i=parseFloat(r.getAttribute("data-orig-width")??"");return[...r.querySelectorAll("img"),...r.querySelectorAll("video")].map(s=>({media:s,h:o,w:i}))});for(const{media:r,h:o,w:i}of e){if(isNaN(o)||isNaN(i)){console.warn("failed to set img/video aspect ratio");continue}r.style.aspectRatio=`${i} / ${o}`}})))],ur.prototype,"node",2);ur=gt([Me("app-post-body")],ur);let Wt=class extends Fe{constructor(){super(...arguments),Yu(this,ie),this.tags=[]}scrollToPost(t){const e=Qe(this,ie,Qr).call(this).findIndex(r=>r.id===t);this.cards?.item(e).scrollIntoView()}render(){const t=Qe(this,ie,Qr).call(this);return t.length<1&&Array.isArray(this.posts)?C` <div class="empty">(⁎˃ᆺ˂) 404</div> `:Hu(t,e=>e.id,e=>Qe(this,ie,ks).call(this,e))}};ie=new WeakSet;Qr=function(){return this.posts?this.posts.filter(t=>t.tags.some(e=>this.tags.includes(e))):[]};ks=function(t){const e=new Date(t.date),r=`${location.origin}${location.pathname}#${t.id}`;return C`
      <div class="card-container">
        <sl-card id=${t.id} tabindex="0">
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
            <app-post-body .body=${t.body}></app-post-body>
          </slot>
          <div slot="footer">
            ${t.tags.map(o=>Qe(this,ie,As).call(this,o))}
          </div>
        </sl-card>
      </div>
    `};As=function(t){const e=`/dadmaxxing/${t}`,r=`#${t}`;return C`
      <a href=${e}>
        <sl-tag pill>${r}</sl-tag>
      </a>
    `};gt([ye({context:kr})],Wt.prototype,"blog",2);gt([ye({context:zo})],Wt.prototype,"router",2);gt([Lt(t=>t.blog.posts$)],Wt.prototype,"posts",2);gt([b()],Wt.prototype,"tags",2);gt([fa("sl-card")],Wt.prototype,"cards",2);Wt=gt([Me("app-post-list")],Wt);var Zu=Object.defineProperty,Xu=Object.getOwnPropertyDescriptor,we=(t,e,r,o)=>{for(var i=o>1?void 0:o?Xu(e,r):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Zu(e,r,i),i};let qt=class extends Fe{constructor(){super(...arguments),this.list=Gl(),this.router=new Nu(this,[{path:"/dadmaxxing{/}?",render:()=>C`
        <app-post-list ${Qt(this.list)} .tags=${Cu}></app-post-list>
      `},{path:"/dadmaxxing/family{/}?",render:()=>C`
        <app-post-list ${Qt(this.list)} .tags=${["family"]}></app-post-list>
      `},{path:"/dadmaxxing/climbing{/}?",render:()=>C`
        <app-post-list ${Qt(this.list)} .tags=${["climbing"]}></app-post-list>
      `},{path:"/dadmaxxing/gaming{/}?",render:()=>C`
        <app-post-list ${Qt(this.list)} .tags=${["gaming"]}></app-post-list>
      `},{path:"/dadmaxxing/anime{/}?",render:()=>C`
        <app-post-list ${Qt(this.list)} .tags=${["anime"]}></app-post-list>
      `},{path:"/dadmaxxing/*",render:()=>C`
        <app-post-list ${Qt(this.list)} .tags=${[]}></app-post-list>
      `}]),this.theme=new Vu,this.blog=new Iu}render(){return C`
      <main>
        <div>
          <app-header></app-header>
          ${this.router.outlet()}
        </div>
        <app-footer></app-footer>
      </main>
    `}};we([So({context:zo})],qt.prototype,"router",2);we([So({context:ws})],qt.prototype,"theme",2);we([So({context:kr})],qt.prototype,"blog",2);we([Lt(t=>t.blog.meta$.pipe(Po(e=>{document.title=e.title,cn(C`<link rel="icon" type="image/png" href=${e.avatar}></link>`,document.head)})))],qt.prototype,"meta",2);we([Lt(t=>t.router.pathname$.pipe(Fc(()=>zu()),Po(()=>{const e=location.hash.replace(/^#/,"");e?t.list.value?.scrollToPost(e):window.scrollTo(0,0)})))],qt.prototype,"fragmentScroll",2);qt=we([Me("app-root")],qt);var Ju=Object.defineProperty,Qu=Object.getOwnPropertyDescriptor,Io=(t,e,r,o)=>{for(var i=o>1?void 0:o?Qu(e,r):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&Ju(e,r,i),i};let hr=class extends Fe{render(){const t=this.meta?.updated??0,e=new Date(t*1e3).toISOString();return C`
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
    `}};Io([ye({context:kr})],hr.prototype,"blog",2);Io([Lt(t=>t.blog.meta$)],hr.prototype,"meta",2);hr=Io([Me("app-footer")],hr);var th=Object.defineProperty,eh=Object.getOwnPropertyDescriptor,Jt=(t,e,r,o)=>{for(var i=o>1?void 0:o?eh(e,r):e,n=t.length-1,s;n>=0;n--)(s=t[n])&&(i=(o?s(e,r,i):s(i))||i);return o&&i&&th(e,r,i),i};const rh=[{label:"Home",href:"/dadmaxxing"},{label:"Family",href:"/dadmaxxing/family"},{label:"Climbing",href:"/dadmaxxing/climbing"},{label:"Gaming",href:"/dadmaxxing/gaming"},{label:"Anime",href:"/dadmaxxing/anime"},{label:"Source",href:"https://github.com/defevan/dadmaxxing"}];let Ot=class extends Fe{render(){const t=this.meta?C`<p>${this.meta.description}</p>`:C`<p>${xs("&nbsp;")}</p>`;return C`
      <header>
        <div>
          <h1>${this.meta?.title??"..."}</h1>
          ${t}
        </div>
        <div>
          <nav>${rh.map(e=>this.renderLink(e))}</nav>
          <div class="switch-container">
            <sl-switch
              ?checked=${this.activeTheme==="dark"}
              @sl-change=${()=>this.theme.toggle()}
              >dark mode</sl-switch
            >
          </div>
        </div>
      </header>
    `}renderLink({href:t,label:e}){if(t.includes("https://"))return C`<a href=${t}>${e}</a>`;const r=this.pathname===t;return C`<a href=${t} ?active=${r}>${e}</a>`}};Jt([ye({context:kr})],Ot.prototype,"blog",2);Jt([ye({context:zo})],Ot.prototype,"router",2);Jt([ye({context:ws})],Ot.prototype,"theme",2);Jt([Lt(t=>t.blog.meta$)],Ot.prototype,"meta",2);Jt([Lt(t=>t.router.pathname$)],Ot.prototype,"pathname",2);Jt([Lt(t=>t.theme.theme$)],Ot.prototype,"activeTheme",2);Ot=Jt([Me("app-header")],Ot);
