(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}})();window.requestIdleCallback=window.requestIdleCallback||function(t){var e=Date.now();return setTimeout(function(){t({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-e))}})},1)};window.cancelIdleCallback=window.cancelIdleCallback||function(t){clearTimeout(t)};var Ws=Object.defineProperty,C=(t,e)=>Ws(t,"name",{value:e,configurable:!0}),te=class{type=3;name="";prefix="";value="";suffix="";modifier=3;constructor(e,r,o,i,s,n){this.type=e,this.name=r,this.prefix=o,this.value=i,this.suffix=s,this.modifier=n}hasCustomName(){return this.name!==""&&typeof this.name!="number"}};C(te,"Part");var Hs=/[$_\p{ID_Start}]/u,qs=/[$_\u200C\u200D\p{ID_Continue}]/u,Cr=".*";function ui(t,e){return(e?/^[\x00-\xFF]*$/:/^[\x00-\x7F]*$/).test(t)}C(ui,"isASCII");function Gr(t,e=!1){let r=[],o=0;for(;o<t.length;){let i=t[o],s=C(function(n){if(!e)throw new TypeError(n);r.push({type:"INVALID_CHAR",index:o,value:t[o++]})},"ErrorOrInvalid");if(i==="*"){r.push({type:"ASTERISK",index:o,value:t[o++]});continue}if(i==="+"||i==="?"){r.push({type:"OTHER_MODIFIER",index:o,value:t[o++]});continue}if(i==="\\"){r.push({type:"ESCAPED_CHAR",index:o++,value:t[o++]});continue}if(i==="{"){r.push({type:"OPEN",index:o,value:t[o++]});continue}if(i==="}"){r.push({type:"CLOSE",index:o,value:t[o++]});continue}if(i===":"){let n="",a=o+1;for(;a<t.length;){let l=t.substr(a,1);if(a===o+1&&Hs.test(l)||a!==o+1&&qs.test(l)){n+=t[a++];continue}break}if(!n){s(`Missing parameter name at ${o}`);continue}r.push({type:"NAME",index:o,value:n}),o=a;continue}if(i==="("){let n=1,a="",l=o+1,c=!1;if(t[l]==="?"){s(`Pattern cannot start with "?" at ${l}`);continue}for(;l<t.length;){if(!ui(t[l],!1)){s(`Invalid character '${t[l]}' at ${l}.`),c=!0;break}if(t[l]==="\\"){a+=t[l++]+t[l++];continue}if(t[l]===")"){if(n--,n===0){l++;break}}else if(t[l]==="("&&(n++,t[l+1]!=="?")){s(`Capturing groups are not allowed at ${l}`),c=!0;break}a+=t[l++]}if(c)continue;if(n){s(`Unbalanced pattern at ${o}`);continue}if(!a){s(`Missing pattern at ${o}`);continue}r.push({type:"REGEX",index:o,value:a}),o=l;continue}r.push({type:"CHAR",index:o,value:t[o++]})}return r.push({type:"END",index:o,value:""}),r}C(Gr,"lexer");function Zr(t,e={}){let r=Gr(t);e.delimiter??="/#?",e.prefixes??="./";let o=`[^${G(e.delimiter)}]+?`,i=[],s=0,n=0,a=new Set,l=C(x=>{if(n<r.length&&r[n].type===x)return r[n++].value},"tryConsume"),c=C(()=>l("OTHER_MODIFIER")??l("ASTERISK"),"tryConsumeModifier"),d=C(x=>{let v=l(x);if(v!==void 0)return v;let{type:_,index:y}=r[n];throw new TypeError(`Unexpected ${_} at ${y}, expected ${x}`)},"mustConsume"),u=C(()=>{let x="",v;for(;v=l("CHAR")??l("ESCAPED_CHAR");)x+=v;return x},"consumeText"),m=C(x=>x,"DefaultEncodePart"),h=e.encodePart||m,g="",b=C(x=>{g+=x},"appendToPendingFixedValue"),E=C(()=>{g.length&&(i.push(new te(3,"","",h(g),"",3)),g="")},"maybeAddPartFromPendingFixedValue"),$=C((x,v,_,y,k)=>{let A=3;switch(k){case"?":A=1;break;case"*":A=0;break;case"+":A=2;break}if(!v&&!_&&A===3){b(x);return}if(E(),!v&&!_){if(!x)return;i.push(new te(3,"","",h(x),"",A));return}let R;_?_==="*"?R=Cr:R=_:R=o;let B=2;R===o?(B=1,R=""):R===Cr&&(B=0,R="");let N;if(v?N=v:_&&(N=s++),a.has(N))throw new TypeError(`Duplicate name '${N}'.`);a.add(N),i.push(new te(B,N,h(x),R,h(y),A))},"addPart");for(;n<r.length;){let x=l("CHAR"),v=l("NAME"),_=l("REGEX");if(!v&&!_&&(_=l("ASTERISK")),v||_){let k=x??"";e.prefixes.indexOf(k)===-1&&(b(k),k=""),E();let A=c();$(k,v,_,"",A);continue}let y=x??l("ESCAPED_CHAR");if(y){b(y);continue}if(l("OPEN")){let k=u(),A=l("NAME"),R=l("REGEX");!A&&!R&&(R=l("ASTERISK"));let B=u();d("CLOSE");let N=c();$(k,A,R,B,N);continue}E(),d("END")}return i}C(Zr,"parse");function G(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}C(G,"escapeString");function Er(t){return t&&t.ignoreCase?"ui":"u"}C(Er,"flags");function hi(t,e,r){return Xr(Zr(t,r),e,r)}C(hi,"stringToRegexp");function It(t){switch(t){case 0:return"*";case 1:return"?";case 2:return"+";case 3:return""}}C(It,"modifierToString");function Xr(t,e,r={}){r.delimiter??="/#?",r.prefixes??="./",r.sensitive??=!1,r.strict??=!1,r.end??=!0,r.start??=!0,r.endsWith="";let o=r.start?"^":"";for(let a of t){if(a.type===3){a.modifier===3?o+=G(a.value):o+=`(?:${G(a.value)})${It(a.modifier)}`;continue}e&&e.push(a.name);let l=`[^${G(r.delimiter)}]+?`,c=a.value;if(a.type===1?c=l:a.type===0&&(c=Cr),!a.prefix.length&&!a.suffix.length){a.modifier===3||a.modifier===1?o+=`(${c})${It(a.modifier)}`:o+=`((?:${c})${It(a.modifier)})`;continue}if(a.modifier===3||a.modifier===1){o+=`(?:${G(a.prefix)}(${c})${G(a.suffix)})`,o+=It(a.modifier);continue}o+=`(?:${G(a.prefix)}`,o+=`((?:${c})(?:`,o+=G(a.suffix),o+=G(a.prefix),o+=`(?:${c}))*)${G(a.suffix)})`,a.modifier===0&&(o+="?")}let i=`[${G(r.endsWith)}]|$`,s=`[${G(r.delimiter)}]`;if(r.end)return r.strict||(o+=`${s}?`),r.endsWith.length?o+=`(?=${i})`:o+="$",new RegExp(o,Er(r));r.strict||(o+=`(?:${s}(?=${i}))?`);let n=!1;if(t.length){let a=t[t.length-1];a.type===3&&a.modifier===3&&(n=r.delimiter.indexOf(a)>-1)}return n||(o+=`(?=${s}|${i})`),new RegExp(o,Er(r))}C(Xr,"partsToRegexp");var Et={delimiter:"",prefixes:"",sensitive:!0,strict:!0},Ks={delimiter:".",prefixes:"",sensitive:!0,strict:!0},Gs={delimiter:"/",prefixes:"/",sensitive:!0,strict:!0};function di(t,e){return t.length?t[0]==="/"?!0:!e||t.length<2?!1:(t[0]=="\\"||t[0]=="{")&&t[1]=="/":!1}C(di,"isAbsolutePathname");function Jr(t,e){return t.startsWith(e)?t.substring(e.length,t.length):t}C(Jr,"maybeStripPrefix");function pi(t,e){return t.endsWith(e)?t.substr(0,t.length-e.length):t}C(pi,"maybeStripSuffix");function Yr(t){return!t||t.length<2?!1:t[0]==="["||(t[0]==="\\"||t[0]==="{")&&t[1]==="["}C(Yr,"treatAsIPv6Hostname");var fi=["ftp","file","http","https","ws","wss"];function Qr(t){if(!t)return!0;for(let e of fi)if(t.test(e))return!0;return!1}C(Qr,"isSpecialScheme");function mi(t,e){if(t=Jr(t,"#"),e||t==="")return t;let r=new URL("https://example.com");return r.hash=t,r.hash?r.hash.substring(1,r.hash.length):""}C(mi,"canonicalizeHash");function gi(t,e){if(t=Jr(t,"?"),e||t==="")return t;let r=new URL("https://example.com");return r.search=t,r.search?r.search.substring(1,r.search.length):""}C(gi,"canonicalizeSearch");function bi(t,e){return e||t===""?t:Yr(t)?ro(t):eo(t)}C(bi,"canonicalizeHostname");function vi(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.password=t,r.password}C(vi,"canonicalizePassword");function yi(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.username=t,r.username}C(yi,"canonicalizeUsername");function wi(t,e,r){if(r||t==="")return t;if(e&&!fi.includes(e))return new URL(`${e}:${t}`).pathname;let o=t[0]=="/";return t=new URL(o?t:"/-"+t,"https://example.com").pathname,o||(t=t.substring(2,t.length)),t}C(wi,"canonicalizePathname");function _i(t,e,r){return to(e)===t&&(t=""),r||t===""?t:oo(t)}C(_i,"canonicalizePort");function $i(t,e){return t=pi(t,":"),e||t===""?t:Ye(t)}C($i,"canonicalizeProtocol");function to(t){switch(t){case"ws":case"http":return"80";case"wws":case"https":return"443";case"ftp":return"21";default:return""}}C(to,"defaultPortForProtocol");function Ye(t){if(t==="")return t;if(/^[-+.A-Za-z0-9]*$/.test(t))return t.toLowerCase();throw new TypeError(`Invalid protocol '${t}'.`)}C(Ye,"protocolEncodeCallback");function xi(t){if(t==="")return t;let e=new URL("https://example.com");return e.username=t,e.username}C(xi,"usernameEncodeCallback");function Ci(t){if(t==="")return t;let e=new URL("https://example.com");return e.password=t,e.password}C(Ci,"passwordEncodeCallback");function eo(t){if(t==="")return t;if(/[\t\n\r #%/:<>?@[\]^\\|]/g.test(t))throw new TypeError(`Invalid hostname '${t}'`);let e=new URL("https://example.com");return e.hostname=t,e.hostname}C(eo,"hostnameEncodeCallback");function ro(t){if(t==="")return t;if(/[^0-9a-fA-F[\]:]/g.test(t))throw new TypeError(`Invalid IPv6 hostname '${t}'`);return t.toLowerCase()}C(ro,"ipv6HostnameEncodeCallback");function oo(t){if(t===""||/^[0-9]*$/.test(t)&&parseInt(t)<=65535)return t;throw new TypeError(`Invalid port '${t}'.`)}C(oo,"portEncodeCallback");function Ei(t){if(t==="")return t;let e=new URL("https://example.com");return e.pathname=t[0]!=="/"?"/-"+t:t,t[0]!=="/"?e.pathname.substring(2,e.pathname.length):e.pathname}C(Ei,"standardURLPathnameEncodeCallback");function Si(t){return t===""?t:new URL(`data:${t}`).pathname}C(Si,"pathURLPathnameEncodeCallback");function ki(t){if(t==="")return t;let e=new URL("https://example.com");return e.search=t,e.search.substring(1,e.search.length)}C(ki,"searchEncodeCallback");function Ai(t){if(t==="")return t;let e=new URL("https://example.com");return e.hash=t,e.hash.substring(1,e.hash.length)}C(Ai,"hashEncodeCallback");var Pi=class{#e;#o=[];#i={};#t=0;#r=1;#l=0;#a=0;#p=0;#f=0;#m=!1;constructor(e){this.#e=e}get result(){return this.#i}parse(){for(this.#o=Gr(this.#e,!0);this.#t<this.#o.length;this.#t+=this.#r){if(this.#r=1,this.#o[this.#t].type==="END"){if(this.#a===0){this.#y(),this.#u()?this.#s(9,1):this.#h()?this.#s(8,1):this.#s(7,0);continue}else if(this.#a===2){this.#d(5);continue}this.#s(10,0);break}if(this.#p>0)if(this.#S())this.#p-=1;else continue;if(this.#E()){this.#p+=1;continue}switch(this.#a){case 0:this.#w()&&this.#d(1);break;case 1:if(this.#w()){this.#P();let e=7,r=1;this.#$()?(e=2,r=3):this.#m&&(e=2),this.#s(e,r)}break;case 2:this.#b()?this.#d(3):(this.#v()||this.#h()||this.#u())&&this.#d(5);break;case 3:this.#x()?this.#s(4,1):this.#b()&&this.#s(5,1);break;case 4:this.#b()&&this.#s(5,1);break;case 5:this.#k()?this.#f+=1:this.#A()&&(this.#f-=1),this.#C()&&!this.#f?this.#s(6,1):this.#v()?this.#s(7,0):this.#h()?this.#s(8,1):this.#u()&&this.#s(9,1);break;case 6:this.#v()?this.#s(7,0):this.#h()?this.#s(8,1):this.#u()&&this.#s(9,1);break;case 7:this.#h()?this.#s(8,1):this.#u()&&this.#s(9,1);break;case 8:this.#u()&&this.#s(9,1);break}}this.#i.hostname!==void 0&&this.#i.port===void 0&&(this.#i.port="")}#s(e,r){switch(this.#a){case 0:break;case 1:this.#i.protocol=this.#c();break;case 2:break;case 3:this.#i.username=this.#c();break;case 4:this.#i.password=this.#c();break;case 5:this.#i.hostname=this.#c();break;case 6:this.#i.port=this.#c();break;case 7:this.#i.pathname=this.#c();break;case 8:this.#i.search=this.#c();break;case 9:this.#i.hash=this.#c();break}this.#a!==0&&e!==10&&([1,2,3,4].includes(this.#a)&&[6,7,8,9].includes(e)&&(this.#i.hostname??=""),[1,2,3,4,5,6].includes(this.#a)&&[8,9].includes(e)&&(this.#i.pathname??=this.#m?"/":""),[1,2,3,4,5,6,7].includes(this.#a)&&e===9&&(this.#i.search??="")),this.#_(e,r)}#_(e,r){this.#a=e,this.#l=this.#t+r,this.#t+=r,this.#r=0}#y(){this.#t=this.#l,this.#r=0}#d(e){this.#y(),this.#a=e}#g(e){return e<0&&(e=this.#o.length-e),e<this.#o.length?this.#o[e]:this.#o[this.#o.length-1]}#n(e,r){let o=this.#g(e);return o.value===r&&(o.type==="CHAR"||o.type==="ESCAPED_CHAR"||o.type==="INVALID_CHAR")}#w(){return this.#n(this.#t,":")}#$(){return this.#n(this.#t+1,"/")&&this.#n(this.#t+2,"/")}#b(){return this.#n(this.#t,"@")}#x(){return this.#n(this.#t,":")}#C(){return this.#n(this.#t,":")}#v(){return this.#n(this.#t,"/")}#h(){if(this.#n(this.#t,"?"))return!0;if(this.#o[this.#t].value!=="?")return!1;let e=this.#g(this.#t-1);return e.type!=="NAME"&&e.type!=="REGEX"&&e.type!=="CLOSE"&&e.type!=="ASTERISK"}#u(){return this.#n(this.#t,"#")}#E(){return this.#o[this.#t].type=="OPEN"}#S(){return this.#o[this.#t].type=="CLOSE"}#k(){return this.#n(this.#t,"[")}#A(){return this.#n(this.#t,"]")}#c(){let e=this.#o[this.#t],r=this.#g(this.#l).index;return this.#e.substring(r,e.index)}#P(){let e={};Object.assign(e,Et),e.encodePart=Ye;let r=hi(this.#c(),void 0,e);this.#m=Qr(r)}};C(Pi,"Parser");var dr=["protocol","username","password","hostname","port","pathname","search","hash"],xt="*";function Sr(t,e){if(typeof t!="string")throw new TypeError("parameter 1 is not of type 'string'.");let r=new URL(t,e);return{protocol:r.protocol.substring(0,r.protocol.length-1),username:r.username,password:r.password,hostname:r.hostname,port:r.port,pathname:r.pathname,search:r.search!==""?r.search.substring(1,r.search.length):void 0,hash:r.hash!==""?r.hash.substring(1,r.hash.length):void 0}}C(Sr,"extractValues");function ct(t,e){return e?Jt(t):t}C(ct,"processBaseURLString");function Zt(t,e,r){let o;if(typeof e.baseURL=="string")try{o=new URL(e.baseURL),e.protocol===void 0&&(t.protocol=ct(o.protocol.substring(0,o.protocol.length-1),r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&(t.username=ct(o.username,r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&e.password===void 0&&(t.password=ct(o.password,r)),e.protocol===void 0&&e.hostname===void 0&&(t.hostname=ct(o.hostname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&(t.port=ct(o.port,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&(t.pathname=ct(o.pathname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&(t.search=ct(o.search.substring(1,o.search.length),r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&e.hash===void 0&&(t.hash=ct(o.hash.substring(1,o.hash.length),r))}catch{throw new TypeError(`invalid baseURL '${e.baseURL}'.`)}if(typeof e.protocol=="string"&&(t.protocol=$i(e.protocol,r)),typeof e.username=="string"&&(t.username=yi(e.username,r)),typeof e.password=="string"&&(t.password=vi(e.password,r)),typeof e.hostname=="string"&&(t.hostname=bi(e.hostname,r)),typeof e.port=="string"&&(t.port=_i(e.port,t.protocol,r)),typeof e.pathname=="string"){if(t.pathname=e.pathname,o&&!di(t.pathname,r)){let i=o.pathname.lastIndexOf("/");i>=0&&(t.pathname=ct(o.pathname.substring(0,i+1),r)+t.pathname)}t.pathname=wi(t.pathname,t.protocol,r)}return typeof e.search=="string"&&(t.search=gi(e.search,r)),typeof e.hash=="string"&&(t.hash=mi(e.hash,r)),t}C(Zt,"applyInit");function Jt(t){return t.replace(/([+*?:{}()\\])/g,"\\$1")}C(Jt,"escapePatternString");function Oi(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}C(Oi,"escapeRegexpString");function Ti(t,e){e.delimiter??="/#?",e.prefixes??="./",e.sensitive??=!1,e.strict??=!1,e.end??=!0,e.start??=!0,e.endsWith="";let r=".*",o=`[^${Oi(e.delimiter)}]+?`,i=/[$_\u200C\u200D\p{ID_Continue}]/u,s="";for(let n=0;n<t.length;++n){let a=t[n];if(a.type===3){if(a.modifier===3){s+=Jt(a.value);continue}s+=`{${Jt(a.value)}}${It(a.modifier)}`;continue}let l=a.hasCustomName(),c=!!a.suffix.length||!!a.prefix.length&&(a.prefix.length!==1||!e.prefixes.includes(a.prefix)),d=n>0?t[n-1]:null,u=n<t.length-1?t[n+1]:null;if(!c&&l&&a.type===1&&a.modifier===3&&u&&!u.prefix.length&&!u.suffix.length)if(u.type===3){let m=u.value.length>0?u.value[0]:"";c=i.test(m)}else c=!u.hasCustomName();if(!c&&!a.prefix.length&&d&&d.type===3){let m=d.value[d.value.length-1];c=e.prefixes.includes(m)}c&&(s+="{"),s+=Jt(a.prefix),l&&(s+=`:${a.name}`),a.type===2?s+=`(${a.value})`:a.type===1?l||(s+=`(${o})`):a.type===0&&(!l&&(!d||d.type===3||d.modifier!==3||c||a.prefix!=="")?s+="*":s+=`(${r})`),a.type===1&&l&&a.suffix.length&&i.test(a.suffix[0])&&(s+="\\"),s+=Jt(a.suffix),c&&(s+="}"),a.modifier!==3&&(s+=It(a.modifier))}return s}C(Ti,"partsToPattern");var Ri=class{#e;#o={};#i={};#t={};#r={};#l=!1;constructor(t={},e,r){try{let o;if(typeof e=="string"?o=e:r=e,typeof t=="string"){let a=new Pi(t);if(a.parse(),t=a.result,o===void 0&&typeof t.protocol!="string")throw new TypeError("A base URL must be provided for a relative constructor string.");t.baseURL=o}else{if(!t||typeof t!="object")throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");if(o)throw new TypeError("parameter 1 is not of type 'string'.")}typeof r>"u"&&(r={ignoreCase:!1});let i={ignoreCase:r.ignoreCase===!0},s={pathname:xt,protocol:xt,username:xt,password:xt,hostname:xt,port:xt,search:xt,hash:xt};this.#e=Zt(s,t,!0),to(this.#e.protocol)===this.#e.port&&(this.#e.port="");let n;for(n of dr){if(!(n in this.#e))continue;let a={},l=this.#e[n];switch(this.#i[n]=[],n){case"protocol":Object.assign(a,Et),a.encodePart=Ye;break;case"username":Object.assign(a,Et),a.encodePart=xi;break;case"password":Object.assign(a,Et),a.encodePart=Ci;break;case"hostname":Object.assign(a,Ks),Yr(l)?a.encodePart=ro:a.encodePart=eo;break;case"port":Object.assign(a,Et),a.encodePart=oo;break;case"pathname":Qr(this.#o.protocol)?(Object.assign(a,Gs,i),a.encodePart=Ei):(Object.assign(a,Et,i),a.encodePart=Si);break;case"search":Object.assign(a,Et,i),a.encodePart=ki;break;case"hash":Object.assign(a,Et,i),a.encodePart=Ai;break}try{this.#r[n]=Zr(l,a),this.#o[n]=Xr(this.#r[n],this.#i[n],a),this.#t[n]=Ti(this.#r[n],a),this.#l=this.#l||this.#r[n].some(c=>c.type===2)}catch{throw new TypeError(`invalid ${n} pattern '${this.#e[n]}'.`)}}}catch(o){throw new TypeError(`Failed to construct 'URLPattern': ${o.message}`)}}get[Symbol.toStringTag](){return"URLPattern"}test(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return!1;try{typeof t=="object"?r=Zt(r,t,!1):r=Zt(r,Sr(t,e),!1)}catch{return!1}let o;for(o of dr)if(!this.#o[o].exec(r[o]))return!1;return!0}exec(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return;try{typeof t=="object"?r=Zt(r,t,!1):r=Zt(r,Sr(t,e),!1)}catch{return null}let o={};e?o.inputs=[t,e]:o.inputs=[t];let i;for(i of dr){let s=this.#o[i].exec(r[i]);if(!s)return null;let n={};for(let[a,l]of this.#i[i].entries())if(typeof l=="string"||typeof l=="number"){let c=s[a+1];n[l]=c}o[i]={input:r[i]??"",groups:n}}return o}static compareComponent(t,e,r){let o=C((a,l)=>{for(let c of["type","modifier","prefix","value","suffix"]){if(a[c]<l[c])return-1;if(a[c]!==l[c])return 1}return 0},"comparePart"),i=new te(3,"","","","",3),s=new te(0,"","","","",3),n=C((a,l)=>{let c=0;for(;c<Math.min(a.length,l.length);++c){let d=o(a[c],l[c]);if(d)return d}return a.length===l.length?0:o(a[c]??i,l[c]??i)},"comparePartList");return!e.#t[t]&&!r.#t[t]?0:e.#t[t]&&!r.#t[t]?n(e.#r[t],[s]):!e.#t[t]&&r.#t[t]?n([s],r.#r[t]):n(e.#r[t],r.#r[t])}get protocol(){return this.#t.protocol}get username(){return this.#t.username}get password(){return this.#t.password}get hostname(){return this.#t.hostname}get port(){return this.#t.port}get pathname(){return this.#t.pathname}get search(){return this.#t.search}get hash(){return this.#t.hash}get hasRegExpGroups(){return this.#l}};C(Ri,"URLPattern");globalThis.URLPattern||(globalThis.URLPattern=Ri);const kr=new Set,Yt=new Map;let Dt,io="ltr",so="en";const Li=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Li){const t=new MutationObserver(Ni);io=document.documentElement.dir||"ltr",so=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function zi(...t){t.map(e=>{const r=e.$code.toLowerCase();Yt.has(r)?Yt.set(r,Object.assign(Object.assign({},Yt.get(r)),e)):Yt.set(r,e),Dt||(Dt=e)}),Ni()}function Ni(){Li&&(io=document.documentElement.dir||"ltr",so=document.documentElement.lang||navigator.language),[...kr.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}let Zs=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){kr.add(this.host)}hostDisconnected(){kr.delete(this.host)}dir(){return`${this.host.dir||io}`.toLowerCase()}lang(){return`${this.host.lang||so}`.toLowerCase()}getTranslationData(e){var r,o;const i=new Intl.Locale(e.replace(/_/g,"-")),s=i?.language.toLowerCase(),n=(o=(r=i?.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",a=Yt.get(`${s}-${n}`),l=Yt.get(s);return{locale:i,language:s,region:n,primary:a,secondary:l}}exists(e,r){var o;const{primary:i,secondary:s}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(i&&i[e]||s&&s[e]||r.includeFallback&&Dt&&Dt[e])}term(e,...r){const{primary:o,secondary:i}=this.getTranslationData(this.lang());let s;if(o&&o[e])s=o[e];else if(i&&i[e])s=i[e];else if(Dt&&Dt[e])s=Dt[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof s=="function"?s(...r):s}date(e,r){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),r).format(e)}number(e,r){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),r).format(e)}relativeTime(e,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,r)}};var Di={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};zi(Di);var Xs=Di,jt=class extends Zs{};zi(Xs);var Ii=Object.defineProperty,Js=Object.defineProperties,Ys=Object.getOwnPropertyDescriptor,Qs=Object.getOwnPropertyDescriptors,Eo=Object.getOwnPropertySymbols,tn=Object.prototype.hasOwnProperty,en=Object.prototype.propertyIsEnumerable,Mi=t=>{throw TypeError(t)},So=(t,e,r)=>e in t?Ii(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Wt=(t,e)=>{for(var r in e||(e={}))tn.call(e,r)&&So(t,r,e[r]);if(Eo)for(var r of Eo(e))en.call(e,r)&&So(t,r,e[r]);return t},Qe=(t,e)=>Js(t,Qs(e)),p=(t,e,r,o)=>{for(var i=o>1?void 0:o?Ys(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Ii(e,r,i),i},Bi=(t,e,r)=>e.has(t)||Mi("Cannot "+r),rn=(t,e,r)=>(Bi(t,e,"read from private field"),e.get(t)),on=(t,e,r)=>e.has(t)?Mi("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),sn=(t,e,r,o)=>(Bi(t,e,"write to private field"),e.set(t,r),r);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Me=globalThis,no=Me.ShadowRoot&&(Me.ShadyCSS===void 0||Me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ao=Symbol(),ko=new WeakMap;let Ui=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==ao)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(no&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=ko.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&ko.set(r,e))}return e}toString(){return this.cssText}};const nn=t=>new Ui(typeof t=="string"?t:t+"",void 0,ao),et=(t,...e)=>{const r=t.length===1?t[0]:e.reduce(((o,i,s)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new Ui(r,t,ao)},an=(t,e)=>{if(no)t.adoptedStyleSheets=e.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of e){const o=document.createElement("style"),i=Me.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}},Ao=no?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return nn(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ln,defineProperty:cn,getOwnPropertyDescriptor:un,getOwnPropertyNames:hn,getOwnPropertySymbols:dn,getPrototypeOf:pn}=Object,tr=globalThis,Po=tr.trustedTypes,fn=Po?Po.emptyScript:"",mn=tr.reactiveElementPolyfillSupport,we=(t,e)=>t,oe={toAttribute(t,e){switch(e){case Boolean:t=t?fn:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},lo=(t,e)=>!ln(t,e),Oo={attribute:!0,type:String,converter:oe,reflect:!1,useDefault:!1,hasChanged:lo};Symbol.metadata??=Symbol("metadata"),tr.litPropertyMetadata??=new WeakMap;let Xt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Oo){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,r);i!==void 0&&cn(this.prototype,e,i)}}static getPropertyDescriptor(e,r,o){const{get:i,set:s}=un(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:i,set(n){const a=i?.call(this);s?.call(this,n),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Oo}static _$Ei(){if(this.hasOwnProperty(we("elementProperties")))return;const e=pn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(we("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(we("properties"))){const r=this.properties,o=[...hn(r),...dn(r)];for(const i of o)this.createProperty(i,r[i])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,i]of r)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const i=this._$Eu(r,o);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const i of o)r.unshift(Ao(i))}else e!==void 0&&r.push(Ao(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return an(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(i!==void 0&&o.reflect===!0){const s=(o.converter?.toAttribute!==void 0?o.converter:oe).toAttribute(r,o.type);this._$Em=e,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,r){const o=this.constructor,i=o._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const s=o.getPropertyOptions(i),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:oe;this._$Em=i;const a=n.fromAttribute(r,s.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,r,o){if(e!==void 0){const i=this.constructor,s=this[e];if(o??=i.getPropertyOptions(e),!((o.hasChanged??lo)(s,r)||o.useDefault&&o.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:i,wrapped:s},n){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??r??this[e]),s!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[i,s]of o){const{wrapped:n}=s,a=this[i];n!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,s,a)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),this._$EO?.forEach((o=>o.hostUpdate?.())),this.update(r)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(r)}willUpdate(e){}_$AE(e){this._$EO?.forEach((r=>r.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};Xt.elementStyles=[],Xt.shadowRootOptions={mode:"open"},Xt[we("elementProperties")]=new Map,Xt[we("finalized")]=new Map,mn?.({ReactiveElement:Xt}),(tr.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const co=globalThis,je=co.trustedTypes,To=je?je.createPolicy("lit-html",{createHTML:t=>t}):void 0,Vi="$lit$",St=`lit$${Math.random().toFixed(9).slice(2)}$`,Fi="?"+St,gn=`<${Fi}>`,Vt=document,xe=()=>Vt.createComment(""),Ce=t=>t===null||typeof t!="object"&&typeof t!="function",uo=Array.isArray,bn=t=>uo(t)||typeof t?.[Symbol.iterator]=="function",pr=`[ 	
\f\r]`,pe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ro=/-->/g,Lo=/>/g,zt=RegExp(`>|${pr}(?:([^\\s"'>=/]+)(${pr}*=${pr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),zo=/'/g,No=/"/g,ji=/^(?:script|style|textarea|title)$/i,vn=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),P=vn(1),X=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),Do=new WeakMap,Mt=Vt.createTreeWalker(Vt,129);function Wi(t,e){if(!uo(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return To!==void 0?To.createHTML(e):e}const yn=(t,e)=>{const r=t.length-1,o=[];let i,s=e===2?"<svg>":e===3?"<math>":"",n=pe;for(let a=0;a<r;a++){const l=t[a];let c,d,u=-1,m=0;for(;m<l.length&&(n.lastIndex=m,d=n.exec(l),d!==null);)m=n.lastIndex,n===pe?d[1]==="!--"?n=Ro:d[1]!==void 0?n=Lo:d[2]!==void 0?(ji.test(d[2])&&(i=RegExp("</"+d[2],"g")),n=zt):d[3]!==void 0&&(n=zt):n===zt?d[0]===">"?(n=i??pe,u=-1):d[1]===void 0?u=-2:(u=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?zt:d[3]==='"'?No:zo):n===No||n===zo?n=zt:n===Ro||n===Lo?n=pe:(n=zt,i=void 0);const h=n===zt&&t[a+1].startsWith("/>")?" ":"";s+=n===pe?l+gn:u>=0?(o.push(c),l.slice(0,u)+Vi+l.slice(u)+St+h):l+St+(u===-2?a:h)}return[Wi(t,s+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class Ee{constructor({strings:e,_$litType$:r},o){let i;this.parts=[];let s=0,n=0;const a=e.length-1,l=this.parts,[c,d]=yn(e,r);if(this.el=Ee.createElement(c,o),Mt.currentNode=this.el.content,r===2||r===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=Mt.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Vi)){const m=d[n++],h=i.getAttribute(u).split(St),g=/([.?@])?(.*)/.exec(m);l.push({type:1,index:s,name:g[2],strings:h,ctor:g[1]==="."?_n:g[1]==="?"?$n:g[1]==="@"?xn:er}),i.removeAttribute(u)}else u.startsWith(St)&&(l.push({type:6,index:s}),i.removeAttribute(u));if(ji.test(i.tagName)){const u=i.textContent.split(St),m=u.length-1;if(m>0){i.textContent=je?je.emptyScript:"";for(let h=0;h<m;h++)i.append(u[h],xe()),Mt.nextNode(),l.push({type:2,index:++s});i.append(u[m],xe())}}}else if(i.nodeType===8)if(i.data===Fi)l.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(St,u+1))!==-1;)l.push({type:7,index:s}),u+=St.length-1}s++}}static createElement(e,r){const o=Vt.createElement("template");return o.innerHTML=e,o}}function ie(t,e,r=t,o){if(e===X)return e;let i=o!==void 0?r._$Co?.[o]:r._$Cl;const s=Ce(e)?void 0:e._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,r,o)),o!==void 0?(r._$Co??=[])[o]=i:r._$Cl=i),i!==void 0&&(e=ie(t,i._$AS(t,e.values),i,o)),e}let wn=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,i=(e?.creationScope??Vt).importNode(r,!0);Mt.currentNode=i;let s=Mt.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new ce(s,s.nextSibling,this,e):l.type===1?c=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(c=new Cn(s,this,e)),this._$AV.push(c),l=o[++a]}n!==l?.index&&(s=Mt.nextNode(),n++)}return Mt.currentNode=Vt,i}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}};class ce{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,r,o,i){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=ie(this,e,r),Ce(e)?e===z||e==null||e===""?(this._$AH!==z&&this._$AR(),this._$AH=z):e!==this._$AH&&e!==X&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):bn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==z&&Ce(this._$AH)?this._$AA.nextSibling.data=e:this.T(Vt.createTextNode(e)),this._$AH=e}$(e){const{values:r,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Ee.createElement(Wi(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(r);else{const s=new wn(i,this),n=s.u(this.options);s.p(r),this.T(n),this._$AH=s}}_$AC(e){let r=Do.get(e.strings);return r===void 0&&Do.set(e.strings,r=new Ee(e)),r}k(e){uo(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,i=0;for(const s of e)i===r.length?r.push(o=new ce(this.O(xe()),this.O(xe()),this,this.options)):o=r[i],o._$AI(s),i++;i<r.length&&(this._$AR(o&&o._$AB.nextSibling,i),r.length=i)}_$AR(e=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);e!==this._$AB;){const o=e.nextSibling;e.remove(),e=o}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class er{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,i,s){this.type=1,this._$AH=z,this._$AN=void 0,this.element=e,this.name=r,this._$AM=i,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=z}_$AI(e,r=this,o,i){const s=this.strings;let n=!1;if(s===void 0)e=ie(this,e,r,0),n=!Ce(e)||e!==this._$AH&&e!==X,n&&(this._$AH=e);else{const a=e;let l,c;for(e=s[0],l=0;l<s.length-1;l++)c=ie(this,a[o+l],r,l),c===X&&(c=this._$AH[l]),n||=!Ce(c)||c!==this._$AH[l],c===z?e=z:e!==z&&(e+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!i&&this.j(e)}j(e){e===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class _n extends er{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===z?void 0:e}}class $n extends er{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==z)}}class xn extends er{constructor(e,r,o,i,s){super(e,r,o,i,s),this.type=5}_$AI(e,r=this){if((e=ie(this,e,r,0)??z)===X)return;const o=this._$AH,i=e===z&&o!==z||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==z&&(o===z||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Cn{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ie(this,e)}}const En={I:ce},Sn=co.litHtmlPolyfillSupport;Sn?.(Ee,ce),(co.litHtmlVersions??=[]).push("3.3.1");const Hi=(t,e,r)=>{const o=r?.renderBefore??e;let i=o._$litPart$;if(i===void 0){const s=r?.renderBefore??null;o._$litPart$=i=new ce(e.insertBefore(xe(),s),s,void 0,r??{})}return i._$AI(t),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ho=globalThis;let ee=class extends Xt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Hi(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return X}};ee._$litElement$=!0,ee.finalized=!0,ho.litElementHydrateSupport?.({LitElement:ee});const kn=ho.litElementPolyfillSupport;kn?.({LitElement:ee});(ho.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ht=t=>(e,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const An={attribute:!0,type:String,converter:oe,reflect:!1,hasChanged:lo},Pn=(t=An,e,r)=>{const{kind:o,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(r.name,t),o==="accessor"){const{name:n}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t)}}throw Error("Unsupported decorator location: "+o)};function f(t){return(e,r)=>typeof r=="object"?Pn(t,e,r):((o,i,s)=>{const n=i.hasOwnProperty(s);return i.constructor.createProperty(s,o),n?Object.getOwnPropertyDescriptor(i,s):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Tt(t){return f({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const On=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function rt(t,e){return(r,o,i)=>{const s=n=>n.renderRoot?.querySelector(t)??null;return On(r,o,{get(){return s(this)}})}}var Be,K=class extends ee{constructor(){super(),on(this,Be,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){const r=new CustomEvent(t,Wt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(r),r}static define(t,e=this,r={}){const o=customElements.get(t);if(!o){try{customElements.define(t,e,r)}catch{customElements.define(t,class extends e{},r)}return}let i=" (unknown version)",s=i;"version"in e&&e.version&&(i=" v"+e.version),"version"in o&&o.version&&(s=" v"+o.version),!(i&&s&&i===s)&&console.warn(`Attempted to register <${t}>${i}, but <${t}>${s} has already been registered.`)}attributeChangedCallback(t,e,r){rn(this,Be)||(this.constructor.elementProperties.forEach((o,i)=>{o.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),sn(this,Be,!0)),super.attributeChangedCallback(t,e,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,r)=>{t.has(r)&&this[r]==null&&(this[r]=e)})}};Be=new WeakMap;K.version="2.20.1";K.dependencies={};p([f()],K.prototype,"dir",2);p([f()],K.prototype,"lang",2);var Y=class extends K{constructor(){super(...arguments),this.localize=new jt(this),this.date=new Date,this.hourFormat="auto"}render(){const t=new Date(this.date),e=this.hourFormat==="auto"?void 0:this.hourFormat==="12";if(!isNaN(t.getMilliseconds()))return P`
      <time datetime=${t.toISOString()}>
        ${this.localize.date(t,{weekday:this.weekday,era:this.era,year:this.year,month:this.month,day:this.day,hour:this.hour,minute:this.minute,second:this.second,timeZoneName:this.timeZoneName,timeZone:this.timeZone,hour12:e})}
      </time>
    `}};p([f()],Y.prototype,"date",2);p([f()],Y.prototype,"weekday",2);p([f()],Y.prototype,"era",2);p([f()],Y.prototype,"year",2);p([f()],Y.prototype,"month",2);p([f()],Y.prototype,"day",2);p([f()],Y.prototype,"hour",2);p([f()],Y.prototype,"minute",2);p([f()],Y.prototype,"second",2);p([f({attribute:"time-zone-name"})],Y.prototype,"timeZoneName",2);p([f({attribute:"time-zone"})],Y.prototype,"timeZone",2);p([f({attribute:"hour-format"})],Y.prototype,"hourFormat",2);Y.define("sl-format-date");var Tn=et`
  :host {
    --color: var(--sl-panel-border-color);
    --width: var(--sl-panel-border-width);
    --spacing: var(--sl-spacing-medium);
  }

  :host(:not([vertical])) {
    display: block;
    border-top: solid var(--width) var(--color);
    margin: var(--spacing) 0;
  }

  :host([vertical]) {
    display: inline-block;
    height: 100%;
    border-left: solid var(--width) var(--color);
    margin: 0 var(--spacing);
  }
`;function yt(t,e){const r=Wt({waitUntilFirstUpdate:!1},e);return(o,i)=>{const{update:s}=o,n=Array.isArray(t)?t:[t];o.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const d=a.get(c),u=this[c];d!==u&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[i](d,u)}}),s.call(this,a)}}}var pt=et`
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
`,rr=class extends K{constructor(){super(...arguments),this.vertical=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","separator")}handleVerticalChange(){this.setAttribute("aria-orientation",this.vertical?"vertical":"horizontal")}};rr.styles=[pt,Tn];p([f({type:Boolean,reflect:!0})],rr.prototype,"vertical",2);p([yt("vertical")],rr.prototype,"handleVerticalChange",1);rr.define("sl-divider");var Rn=et`
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
`,qi=class extends K{constructor(){super(...arguments),this.localize=new jt(this)}render(){return P`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};qi.styles=[pt,Rn];var fe=new WeakMap,me=new WeakMap,ge=new WeakMap,fr=new WeakSet,Le=new WeakMap,Ki=class{constructor(t,e){this.handleFormData=r=>{const o=this.options.disabled(this.host),i=this.options.name(this.host),s=this.options.value(this.host),n=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!o&&!n&&typeof i=="string"&&i.length>0&&typeof s<"u"&&(Array.isArray(s)?s.forEach(a=>{r.formData.append(i,a.toString())}):r.formData.append(i,s.toString()))},this.handleFormSubmit=r=>{var o;const i=this.options.disabled(this.host),s=this.options.reportValidity;this.form&&!this.form.noValidate&&((o=fe.get(this.form))==null||o.forEach(n=>{this.setUserInteracted(n,!0)})),this.form&&!this.form.noValidate&&!i&&!s(this.host)&&(r.preventDefault(),r.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),Le.set(this.host,[])},this.handleInteraction=r=>{const o=Le.get(this.host);o.includes(r.type)||o.push(r.type),o.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.checkValidity=="function"&&!o.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.reportValidity=="function"&&!o.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=Wt({form:r=>{const o=r.form;if(o){const s=r.getRootNode().querySelector(`#${o}`);if(s)return s}return r.closest("form")},name:r=>r.name,value:r=>r.value,defaultValue:r=>r.defaultValue,disabled:r=>{var o;return(o=r.disabled)!=null?o:!1},reportValidity:r=>typeof r.reportValidity=="function"?r.reportValidity():!0,checkValidity:r=>typeof r.checkValidity=="function"?r.checkValidity():!0,setValue:(r,o)=>r.value=o,assumeInteractionOn:["sl-input"]},e)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),Le.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),Le.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,fe.has(this.form)?fe.get(this.form).add(this.host):fe.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),me.has(this.form)||(me.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),ge.has(this.form)||(ge.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const t=fe.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),me.has(this.form)&&(this.form.reportValidity=me.get(this.form),me.delete(this.form)),ge.has(this.form)&&(this.form.checkValidity=ge.get(this.form),ge.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?fr.add(t):fr.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const r=document.createElement("button");r.type=t,r.style.position="absolute",r.style.width="0",r.style.height="0",r.style.clipPath="inset(50%)",r.style.overflow="hidden",r.style.whiteSpace="nowrap",e&&(r.name=e.name,r.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(o=>{e.hasAttribute(o)&&r.setAttribute(o,e.getAttribute(o))})),this.form.append(r),r.click(),r.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,r=!!fr.has(e),o=!!e.required;e.toggleAttribute("data-required",o),e.toggleAttribute("data-optional",!o),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&r),e.toggleAttribute("data-user-valid",t&&r)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},po=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(Qe(Wt({},po),{valid:!1,valueMissing:!0}));Object.freeze(Qe(Wt({},po),{valid:!1,customError:!0}));var Ln=et`
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
`,Gi=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=r=>{const o=r.target;(this.slotNames.includes("[default]")&&!o.name||o.name&&this.slotNames.includes(o.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}},Ar="";function Io(t){Ar=t}function zn(t=""){if(!Ar){const e=[...document.getElementsByTagName("script")],r=e.find(o=>o.hasAttribute("data-shoelace"));if(r)Io(r.getAttribute("data-shoelace"));else{const o=e.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));let i="";o&&(i=o.getAttribute("src")),Io(i.split("/").slice(0,-1).join("/"))}}return Ar.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Nn={name:"default",resolver:t=>zn(`assets/icons/${t}.svg`)},Dn=Nn,Mo={caret:`
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
  `},In={name:"system",resolver:t=>t in Mo?`data:image/svg+xml,${encodeURIComponent(Mo[t])}`:""},Mn=In,Bn=[Dn,Mn],Pr=[];function Un(t){Pr.push(t)}function Vn(t){Pr=Pr.filter(e=>e!==t)}function Bo(t){return Bn.find(e=>e.name===t)}var Fn=et`
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
`;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:jn}=En,Wn=(t,e)=>t?._$litType$!==void 0,Zi=t=>t.strings===void 0,Uo=()=>document.createComment(""),be=(t,e,r)=>{const o=t._$AA.parentNode,i=e===void 0?t._$AB:e._$AA;if(r===void 0){const s=o.insertBefore(Uo(),i),n=o.insertBefore(Uo(),i);r=new jn(s,n,t,t.options)}else{const s=r._$AB.nextSibling,n=r._$AM,a=n!==t;if(a){let l;r._$AQ?.(t),r._$AM=t,r._$AP!==void 0&&(l=t._$AU)!==n._$AU&&r._$AP(l)}if(s!==i||a){let l=r._$AA;for(;l!==s;){const c=l.nextSibling;o.insertBefore(l,i),l=c}}}return r},Nt=(t,e,r=t)=>(t._$AI(e,r),t),Hn={},Xi=(t,e=Hn)=>t._$AH=e,qn=t=>t._$AH,mr=t=>{t._$AR(),t._$AA.remove()};var ve=Symbol(),ze=Symbol(),gr,br=new Map,at=class extends K{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var r;let o;if(e?.spriteSheet)return this.svg=P`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(o=await fetch(t,{mode:"cors"}),!o.ok)return o.status===410?ve:ze}catch{return ze}try{const i=document.createElement("div");i.innerHTML=await o.text();const s=i.firstElementChild;if(((r=s?.tagName)==null?void 0:r.toLowerCase())!=="svg")return ve;gr||(gr=new DOMParser);const a=gr.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):ve}catch{return ve}}connectedCallback(){super.connectedCallback(),Un(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Vn(this)}getIconSource(){const t=Bo(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const{url:e,fromLibrary:r}=this.getIconSource(),o=r?Bo(this.library):void 0;if(!e){this.svg=null;return}let i=br.get(e);if(i||(i=this.resolveIcon(e,o),br.set(e,i)),!this.initialRender)return;const s=await i;if(s===ze&&br.delete(e),e===this.getIconSource().url){if(Wn(s)){if(this.svg=s,o){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&n&&o.mutator(n)}return}switch(s){case ze:case ve:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(t=o?.mutator)==null||t.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};at.styles=[pt,Fn];p([Tt()],at.prototype,"svg",2);p([f({reflect:!0})],at.prototype,"name",2);p([f()],at.prototype,"src",2);p([f()],at.prototype,"label",2);p([f({reflect:!0})],at.prototype,"library",2);p([yt("label")],at.prototype,"handleLabelChange",1);p([yt(["name","src","library"])],at.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ut={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},Ae=t=>(...e)=>({_$litDirective$:t,values:e});let Pe=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vt=Ae(class extends Pe{constructor(t){if(super(t),t.type!==ut.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((o=>o!==""))));for(const o in e)e[o]&&!this.nt?.has(o)&&this.st.add(o);return this.render(e)}const r=t.element.classList;for(const o of this.st)o in e||(r.remove(o),this.st.delete(o));for(const o in e){const i=!!e[o];i===this.st.has(o)||this.nt?.has(o)||(i?(r.add(o),this.st.add(o)):(r.remove(o),this.st.delete(o)))}return X}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ji=Symbol.for(""),Kn=t=>{if(t?.r===Ji)return t?._$litStatic$},We=(t,...e)=>({_$litStatic$:e.reduce(((r,o,i)=>r+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[i+1]),t[0]),r:Ji}),Vo=new Map,Gn=t=>(e,...r)=>{const o=r.length;let i,s;const n=[],a=[];let l,c=0,d=!1;for(;c<o;){for(l=e[c];c<o&&(s=r[c],(i=Kn(s))!==void 0);)l+=i+e[++c],d=!0;c!==o&&a.push(s),n.push(l),c++}if(c===o&&n.push(e[o]),d){const u=n.join("$$lit$$");(e=Vo.get(u))===void 0&&(n.raw=n,Vo.set(u,e=n)),r=a}return t(e,...r)},Ue=Gn(P);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=t=>t??z;var O=class extends K{constructor(){super(...arguments),this.formControlController=new Ki(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new Gi(this,"[default]","prefix","suffix"),this.localize=new jt(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:po}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){const t=this.isLink(),e=t?We`a`:We`button`;return Ue`
      <${e}
        part="base"
        class=${vt({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${I(t?void 0:this.disabled)}
        type=${I(t?void 0:this.type)}
        title=${this.title}
        name=${I(t?void 0:this.name)}
        value=${I(t?void 0:this.value)}
        href=${I(t&&!this.disabled?this.href:void 0)}
        target=${I(t?this.target:void 0)}
        download=${I(t?this.download:void 0)}
        rel=${I(t?this.rel:void 0)}
        role=${I(t?void 0:"button")}
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
        ${this.caret?Ue` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?Ue`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${e}>
    `}};O.styles=[pt,Ln];O.dependencies={"sl-icon":at,"sl-spinner":qi};p([rt(".button")],O.prototype,"button",2);p([Tt()],O.prototype,"hasFocus",2);p([Tt()],O.prototype,"invalid",2);p([f()],O.prototype,"title",2);p([f({reflect:!0})],O.prototype,"variant",2);p([f({reflect:!0})],O.prototype,"size",2);p([f({type:Boolean,reflect:!0})],O.prototype,"caret",2);p([f({type:Boolean,reflect:!0})],O.prototype,"disabled",2);p([f({type:Boolean,reflect:!0})],O.prototype,"loading",2);p([f({type:Boolean,reflect:!0})],O.prototype,"outline",2);p([f({type:Boolean,reflect:!0})],O.prototype,"pill",2);p([f({type:Boolean,reflect:!0})],O.prototype,"circle",2);p([f()],O.prototype,"type",2);p([f()],O.prototype,"name",2);p([f()],O.prototype,"value",2);p([f()],O.prototype,"href",2);p([f()],O.prototype,"target",2);p([f()],O.prototype,"rel",2);p([f()],O.prototype,"download",2);p([f()],O.prototype,"form",2);p([f({attribute:"formaction"})],O.prototype,"formAction",2);p([f({attribute:"formenctype"})],O.prototype,"formEnctype",2);p([f({attribute:"formmethod"})],O.prototype,"formMethod",2);p([f({attribute:"formnovalidate",type:Boolean})],O.prototype,"formNoValidate",2);p([f({attribute:"formtarget"})],O.prototype,"formTarget",2);p([yt("disabled",{waitUntilFirstUpdate:!0})],O.prototype,"handleDisabledChange",1);O.define("sl-button");var Zn=et`
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
`,Xn=et`
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
`,Q=class extends K{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?We`a`:We`button`;return Ue`
      <${e}
        part="base"
        class=${vt({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${I(t?void 0:this.disabled)}
        type=${I(t?void 0:"button")}
        href=${I(t?this.href:void 0)}
        target=${I(t?this.target:void 0)}
        download=${I(t?this.download:void 0)}
        rel=${I(t&&this.target?"noreferrer noopener":void 0)}
        role=${I(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${I(this.name)}
          library=${I(this.library)}
          src=${I(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};Q.styles=[pt,Xn];Q.dependencies={"sl-icon":at};p([rt(".icon-button")],Q.prototype,"button",2);p([Tt()],Q.prototype,"hasFocus",2);p([f()],Q.prototype,"name",2);p([f()],Q.prototype,"library",2);p([f()],Q.prototype,"src",2);p([f()],Q.prototype,"href",2);p([f()],Q.prototype,"target",2);p([f()],Q.prototype,"download",2);p([f()],Q.prototype,"label",2);p([f({type:Boolean,reflect:!0})],Q.prototype,"disabled",2);var qt=class extends K{constructor(){super(...arguments),this.localize=new jt(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return P`
      <span
        part="base"
        class=${vt({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?P`
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
    `}};qt.styles=[pt,Zn];qt.dependencies={"sl-icon-button":Q};p([f({reflect:!0})],qt.prototype,"variant",2);p([f({reflect:!0})],qt.prototype,"size",2);p([f({type:Boolean,reflect:!0})],qt.prototype,"pill",2);p([f({type:Boolean})],qt.prototype,"removable",2);qt.define("sl-tag");var Jn=et`
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
`,Yn=(t="value")=>(e,r)=>{const o=e.constructor,i=o.prototype.attributeChangedCallback;o.prototype.attributeChangedCallback=function(s,n,a){var l;const c=o.getPropertyOptions(t),d=typeof c.attribute=="string"?c.attribute:t;if(s===d){const u=c.converter||oe,h=(typeof u=="function"?u:(l=u?.fromAttribute)!=null?l:oe.fromAttribute)(a,c.type);this[t]!==h&&(this[r]=h)}i.call(this,s,n,a)}},Qn=et`
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
 */const ta=Ae(class extends Pe{constructor(t){if(super(t),t.type!==ut.PROPERTY&&t.type!==ut.ATTRIBUTE&&t.type!==ut.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Zi(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===X||e===z)return e;const r=t.element,o=t.name;if(t.type===ut.PROPERTY){if(e===r[o])return X}else if(t.type===ut.BOOLEAN_ATTRIBUTE){if(!!e===r.hasAttribute(o))return X}else if(t.type===ut.ATTRIBUTE&&r.getAttribute(o)===e+"")return X;return Xi(t),e}});var W=class extends K{constructor(){super(...arguments),this.formControlController=new Ki(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new Gi(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleClick(){this.checked=!this.checked,this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleKeyDown(t){t.key==="ArrowLeft"&&(t.preventDefault(),this.checked=!1,this.emit("sl-change"),this.emit("sl-input")),t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!0,this.emit("sl-change"),this.emit("sl-input"))}handleCheckedChange(){this.input.checked=this.checked,this.formControlController.updateValidity()}handleDisabledChange(){this.formControlController.setValidity(!0)}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){const t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return P`
      <div
        class=${vt({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-help-text":e})}
      >
        <label
          part="base"
          class=${vt({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus,"switch--small":this.size==="small","switch--medium":this.size==="medium","switch--large":this.size==="large"})}
        >
          <input
            class="switch__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${I(this.value)}
            .checked=${ta(this.checked)}
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
    `}};W.styles=[pt,Qn,Jn];p([rt('input[type="checkbox"]')],W.prototype,"input",2);p([Tt()],W.prototype,"hasFocus",2);p([f()],W.prototype,"title",2);p([f()],W.prototype,"name",2);p([f()],W.prototype,"value",2);p([f({reflect:!0})],W.prototype,"size",2);p([f({type:Boolean,reflect:!0})],W.prototype,"disabled",2);p([f({type:Boolean,reflect:!0})],W.prototype,"checked",2);p([Yn("checked")],W.prototype,"defaultChecked",2);p([f({reflect:!0})],W.prototype,"form",2);p([f({type:Boolean,reflect:!0})],W.prototype,"required",2);p([f({attribute:"help-text"})],W.prototype,"helpText",2);p([yt("checked",{waitUntilFirstUpdate:!0})],W.prototype,"handleCheckedChange",1);p([yt("disabled",{waitUntilFirstUpdate:!0})],W.prototype,"handleDisabledChange",1);W.define("sl-switch");var ea=et`
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
`,ra=et`
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
`;const kt=Math.min,Z=Math.max,He=Math.round,Ne=Math.floor,ht=t=>({x:t,y:t}),oa={left:"right",right:"left",bottom:"top",top:"bottom"},ia={start:"end",end:"start"};function Or(t,e,r){return Z(t,kt(e,r))}function ue(t,e){return typeof t=="function"?t(e):t}function At(t){return t.split("-")[0]}function he(t){return t.split("-")[1]}function Yi(t){return t==="x"?"y":"x"}function fo(t){return t==="y"?"height":"width"}const sa=new Set(["top","bottom"]);function bt(t){return sa.has(At(t))?"y":"x"}function mo(t){return Yi(bt(t))}function na(t,e,r){r===void 0&&(r=!1);const o=he(t),i=mo(t),s=fo(i);let n=i==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[s]>e.floating[s]&&(n=qe(n)),[n,qe(n)]}function aa(t){const e=qe(t);return[Tr(t),e,Tr(e)]}function Tr(t){return t.replace(/start|end/g,e=>ia[e])}const Fo=["left","right"],jo=["right","left"],la=["top","bottom"],ca=["bottom","top"];function ua(t,e,r){switch(t){case"top":case"bottom":return r?e?jo:Fo:e?Fo:jo;case"left":case"right":return e?la:ca;default:return[]}}function ha(t,e,r,o){const i=he(t);let s=ua(At(t),r==="start",o);return i&&(s=s.map(n=>n+"-"+i),e&&(s=s.concat(s.map(Tr)))),s}function qe(t){return t.replace(/left|right|bottom|top/g,e=>oa[e])}function da(t){return{top:0,right:0,bottom:0,left:0,...t}}function Qi(t){return typeof t!="number"?da(t):{top:t,right:t,bottom:t,left:t}}function Ke(t){const{x:e,y:r,width:o,height:i}=t;return{width:o,height:i,top:r,left:e,right:e+o,bottom:r+i,x:e,y:r}}function Wo(t,e,r){let{reference:o,floating:i}=t;const s=bt(e),n=mo(e),a=fo(n),l=At(e),c=s==="y",d=o.x+o.width/2-i.width/2,u=o.y+o.height/2-i.height/2,m=o[a]/2-i[a]/2;let h;switch(l){case"top":h={x:d,y:o.y-i.height};break;case"bottom":h={x:d,y:o.y+o.height};break;case"right":h={x:o.x+o.width,y:u};break;case"left":h={x:o.x-i.width,y:u};break;default:h={x:o.x,y:o.y}}switch(he(e)){case"start":h[n]-=m*(r&&c?-1:1);break;case"end":h[n]+=m*(r&&c?-1:1);break}return h}const pa=async(t,e,r)=>{const{placement:o="bottom",strategy:i="absolute",middleware:s=[],platform:n}=r,a=s.filter(Boolean),l=await(n.isRTL==null?void 0:n.isRTL(e));let c=await n.getElementRects({reference:t,floating:e,strategy:i}),{x:d,y:u}=Wo(c,o,l),m=o,h={},g=0;for(let b=0;b<a.length;b++){const{name:E,fn:$}=a[b],{x,y:v,data:_,reset:y}=await $({x:d,y:u,initialPlacement:o,placement:m,strategy:i,middlewareData:h,rects:c,platform:n,elements:{reference:t,floating:e}});d=x??d,u=v??u,h={...h,[E]:{...h[E],..._}},y&&g<=50&&(g++,typeof y=="object"&&(y.placement&&(m=y.placement),y.rects&&(c=y.rects===!0?await n.getElementRects({reference:t,floating:e,strategy:i}):y.rects),{x:d,y:u}=Wo(c,m,l)),b=-1)}return{x:d,y:u,placement:m,strategy:i,middlewareData:h}};async function go(t,e){var r;e===void 0&&(e={});const{x:o,y:i,platform:s,rects:n,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:u="floating",altBoundary:m=!1,padding:h=0}=ue(e,t),g=Qi(h),E=a[m?u==="floating"?"reference":"floating":u],$=Ke(await s.getClippingRect({element:(r=await(s.isElement==null?void 0:s.isElement(E)))==null||r?E:E.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:c,rootBoundary:d,strategy:l})),x=u==="floating"?{x:o,y:i,width:n.floating.width,height:n.floating.height}:n.reference,v=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),_=await(s.isElement==null?void 0:s.isElement(v))?await(s.getScale==null?void 0:s.getScale(v))||{x:1,y:1}:{x:1,y:1},y=Ke(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:x,offsetParent:v,strategy:l}):x);return{top:($.top-y.top+g.top)/_.y,bottom:(y.bottom-$.bottom+g.bottom)/_.y,left:($.left-y.left+g.left)/_.x,right:(y.right-$.right+g.right)/_.x}}const fa=t=>({name:"arrow",options:t,async fn(e){const{x:r,y:o,placement:i,rects:s,platform:n,elements:a,middlewareData:l}=e,{element:c,padding:d=0}=ue(t,e)||{};if(c==null)return{};const u=Qi(d),m={x:r,y:o},h=mo(i),g=fo(h),b=await n.getDimensions(c),E=h==="y",$=E?"top":"left",x=E?"bottom":"right",v=E?"clientHeight":"clientWidth",_=s.reference[g]+s.reference[h]-m[h]-s.floating[g],y=m[h]-s.reference[h],k=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let A=k?k[v]:0;(!A||!await(n.isElement==null?void 0:n.isElement(k)))&&(A=a.floating[v]||s.floating[g]);const R=_/2-y/2,B=A/2-b[g]/2-1,N=kt(u[$],B),wt=kt(u[x],B),lt=N,_t=A-b[g]-wt,H=A/2-b[g]/2+R,Lt=Or(lt,H,_t),mt=!l.arrow&&he(i)!=null&&H!==Lt&&s.reference[g]/2-(H<lt?N:wt)-b[g]/2<0,ot=mt?H<lt?H-lt:H-_t:0;return{[h]:m[h]+ot,data:{[h]:Lt,centerOffset:H-Lt-ot,...mt&&{alignmentOffset:ot}},reset:mt}}}),ma=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var r,o;const{placement:i,middlewareData:s,rects:n,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:d=!0,crossAxis:u=!0,fallbackPlacements:m,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:b=!0,...E}=ue(t,e);if((r=s.arrow)!=null&&r.alignmentOffset)return{};const $=At(i),x=bt(a),v=At(a)===a,_=await(l.isRTL==null?void 0:l.isRTL(c.floating)),y=m||(v||!b?[qe(a)]:aa(a)),k=g!=="none";!m&&k&&y.push(...ha(a,b,g,_));const A=[a,...y],R=await go(e,E),B=[];let N=((o=s.flip)==null?void 0:o.overflows)||[];if(d&&B.push(R[$]),u){const H=na(i,n,_);B.push(R[H[0]],R[H[1]])}if(N=[...N,{placement:i,overflows:B}],!B.every(H=>H<=0)){var wt,lt;const H=(((wt=s.flip)==null?void 0:wt.index)||0)+1,Lt=A[H];if(Lt&&(!(u==="alignment"?x!==bt(Lt):!1)||N.every(it=>bt(it.placement)===x?it.overflows[0]>0:!0)))return{data:{index:H,overflows:N},reset:{placement:Lt}};let mt=(lt=N.filter(ot=>ot.overflows[0]<=0).sort((ot,it)=>ot.overflows[1]-it.overflows[1])[0])==null?void 0:lt.placement;if(!mt)switch(h){case"bestFit":{var _t;const ot=(_t=N.filter(it=>{if(k){const $t=bt(it.placement);return $t===x||$t==="y"}return!0}).map(it=>[it.placement,it.overflows.filter($t=>$t>0).reduce(($t,js)=>$t+js,0)]).sort((it,$t)=>it[1]-$t[1])[0])==null?void 0:_t[0];ot&&(mt=ot);break}case"initialPlacement":mt=a;break}if(i!==mt)return{reset:{placement:mt}}}return{}}}},ga=new Set(["left","top"]);async function ba(t,e){const{placement:r,platform:o,elements:i}=t,s=await(o.isRTL==null?void 0:o.isRTL(i.floating)),n=At(r),a=he(r),l=bt(r)==="y",c=ga.has(n)?-1:1,d=s&&l?-1:1,u=ue(e,t);let{mainAxis:m,crossAxis:h,alignmentAxis:g}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:u.mainAxis||0,crossAxis:u.crossAxis||0,alignmentAxis:u.alignmentAxis};return a&&typeof g=="number"&&(h=a==="end"?g*-1:g),l?{x:h*d,y:m*c}:{x:m*c,y:h*d}}const va=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var r,o;const{x:i,y:s,placement:n,middlewareData:a}=e,l=await ba(e,t);return n===((r=a.offset)==null?void 0:r.placement)&&(o=a.arrow)!=null&&o.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:n}}}}},ya=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:o,placement:i}=e,{mainAxis:s=!0,crossAxis:n=!1,limiter:a={fn:E=>{let{x:$,y:x}=E;return{x:$,y:x}}},...l}=ue(t,e),c={x:r,y:o},d=await go(e,l),u=bt(At(i)),m=Yi(u);let h=c[m],g=c[u];if(s){const E=m==="y"?"top":"left",$=m==="y"?"bottom":"right",x=h+d[E],v=h-d[$];h=Or(x,h,v)}if(n){const E=u==="y"?"top":"left",$=u==="y"?"bottom":"right",x=g+d[E],v=g-d[$];g=Or(x,g,v)}const b=a.fn({...e,[m]:h,[u]:g});return{...b,data:{x:b.x-r,y:b.y-o,enabled:{[m]:s,[u]:n}}}}}},wa=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var r,o;const{placement:i,rects:s,platform:n,elements:a}=e,{apply:l=()=>{},...c}=ue(t,e),d=await go(e,c),u=At(i),m=he(i),h=bt(i)==="y",{width:g,height:b}=s.floating;let E,$;u==="top"||u==="bottom"?(E=u,$=m===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):($=u,E=m==="end"?"top":"bottom");const x=b-d.top-d.bottom,v=g-d.left-d.right,_=kt(b-d[E],x),y=kt(g-d[$],v),k=!e.middlewareData.shift;let A=_,R=y;if((r=e.middlewareData.shift)!=null&&r.enabled.x&&(R=v),(o=e.middlewareData.shift)!=null&&o.enabled.y&&(A=x),k&&!m){const N=Z(d.left,0),wt=Z(d.right,0),lt=Z(d.top,0),_t=Z(d.bottom,0);h?R=g-2*(N!==0||wt!==0?N+wt:Z(d.left,d.right)):A=b-2*(lt!==0||_t!==0?lt+_t:Z(d.top,d.bottom))}await l({...e,availableWidth:R,availableHeight:A});const B=await n.getDimensions(a.floating);return g!==B.width||b!==B.height?{reset:{rects:!0}}:{}}}};function or(){return typeof window<"u"}function de(t){return ts(t)?(t.nodeName||"").toLowerCase():"#document"}function J(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function ft(t){var e;return(e=(ts(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function ts(t){return or()?t instanceof Node||t instanceof J(t).Node:!1}function st(t){return or()?t instanceof Element||t instanceof J(t).Element:!1}function dt(t){return or()?t instanceof HTMLElement||t instanceof J(t).HTMLElement:!1}function Ho(t){return!or()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof J(t).ShadowRoot}const _a=new Set(["inline","contents"]);function Oe(t){const{overflow:e,overflowX:r,overflowY:o,display:i}=nt(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+r)&&!_a.has(i)}const $a=new Set(["table","td","th"]);function xa(t){return $a.has(de(t))}const Ca=[":popover-open",":modal"];function ir(t){return Ca.some(e=>{try{return t.matches(e)}catch{return!1}})}const Ea=["transform","translate","scale","rotate","perspective"],Sa=["transform","translate","scale","rotate","perspective","filter"],ka=["paint","layout","strict","content"];function sr(t){const e=bo(),r=st(t)?nt(t):t;return Ea.some(o=>r[o]?r[o]!=="none":!1)||(r.containerType?r.containerType!=="normal":!1)||!e&&(r.backdropFilter?r.backdropFilter!=="none":!1)||!e&&(r.filter?r.filter!=="none":!1)||Sa.some(o=>(r.willChange||"").includes(o))||ka.some(o=>(r.contain||"").includes(o))}function Aa(t){let e=Pt(t);for(;dt(e)&&!se(e);){if(sr(e))return e;if(ir(e))return null;e=Pt(e)}return null}function bo(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const Pa=new Set(["html","body","#document"]);function se(t){return Pa.has(de(t))}function nt(t){return J(t).getComputedStyle(t)}function nr(t){return st(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Pt(t){if(de(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Ho(t)&&t.host||ft(t);return Ho(e)?e.host:e}function es(t){const e=Pt(t);return se(e)?t.ownerDocument?t.ownerDocument.body:t.body:dt(e)&&Oe(e)?e:es(e)}function Se(t,e,r){var o;e===void 0&&(e=[]),r===void 0&&(r=!0);const i=es(t),s=i===((o=t.ownerDocument)==null?void 0:o.body),n=J(i);if(s){const a=Rr(n);return e.concat(n,n.visualViewport||[],Oe(i)?i:[],a&&r?Se(a):[])}return e.concat(i,Se(i,[],r))}function Rr(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function rs(t){const e=nt(t);let r=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const i=dt(t),s=i?t.offsetWidth:r,n=i?t.offsetHeight:o,a=He(r)!==s||He(o)!==n;return a&&(r=s,o=n),{width:r,height:o,$:a}}function vo(t){return st(t)?t:t.contextElement}function re(t){const e=vo(t);if(!dt(e))return ht(1);const r=e.getBoundingClientRect(),{width:o,height:i,$:s}=rs(e);let n=(s?He(r.width):r.width)/o,a=(s?He(r.height):r.height)/i;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const Oa=ht(0);function os(t){const e=J(t);return!bo()||!e.visualViewport?Oa:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Ta(t,e,r){return e===void 0&&(e=!1),!r||e&&r!==J(t)?!1:e}function Ft(t,e,r,o){e===void 0&&(e=!1),r===void 0&&(r=!1);const i=t.getBoundingClientRect(),s=vo(t);let n=ht(1);e&&(o?st(o)&&(n=re(o)):n=re(t));const a=Ta(s,r,o)?os(s):ht(0);let l=(i.left+a.x)/n.x,c=(i.top+a.y)/n.y,d=i.width/n.x,u=i.height/n.y;if(s){const m=J(s),h=o&&st(o)?J(o):o;let g=m,b=Rr(g);for(;b&&o&&h!==g;){const E=re(b),$=b.getBoundingClientRect(),x=nt(b),v=$.left+(b.clientLeft+parseFloat(x.paddingLeft))*E.x,_=$.top+(b.clientTop+parseFloat(x.paddingTop))*E.y;l*=E.x,c*=E.y,d*=E.x,u*=E.y,l+=v,c+=_,g=J(b),b=Rr(g)}}return Ke({width:d,height:u,x:l,y:c})}function ar(t,e){const r=nr(t).scrollLeft;return e?e.left+r:Ft(ft(t)).left+r}function is(t,e){const r=t.getBoundingClientRect(),o=r.left+e.scrollLeft-ar(t,r),i=r.top+e.scrollTop;return{x:o,y:i}}function Ra(t){let{elements:e,rect:r,offsetParent:o,strategy:i}=t;const s=i==="fixed",n=ft(o),a=e?ir(e.floating):!1;if(o===n||a&&s)return r;let l={scrollLeft:0,scrollTop:0},c=ht(1);const d=ht(0),u=dt(o);if((u||!u&&!s)&&((de(o)!=="body"||Oe(n))&&(l=nr(o)),dt(o))){const h=Ft(o);c=re(o),d.x=h.x+o.clientLeft,d.y=h.y+o.clientTop}const m=n&&!u&&!s?is(n,l):ht(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+d.x+m.x,y:r.y*c.y-l.scrollTop*c.y+d.y+m.y}}function La(t){return Array.from(t.getClientRects())}function za(t){const e=ft(t),r=nr(t),o=t.ownerDocument.body,i=Z(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),s=Z(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let n=-r.scrollLeft+ar(t);const a=-r.scrollTop;return nt(o).direction==="rtl"&&(n+=Z(e.clientWidth,o.clientWidth)-i),{width:i,height:s,x:n,y:a}}const qo=25;function Na(t,e){const r=J(t),o=ft(t),i=r.visualViewport;let s=o.clientWidth,n=o.clientHeight,a=0,l=0;if(i){s=i.width,n=i.height;const d=bo();(!d||d&&e==="fixed")&&(a=i.offsetLeft,l=i.offsetTop)}const c=ar(o);if(c<=0){const d=o.ownerDocument,u=d.body,m=getComputedStyle(u),h=d.compatMode==="CSS1Compat"&&parseFloat(m.marginLeft)+parseFloat(m.marginRight)||0,g=Math.abs(o.clientWidth-u.clientWidth-h);g<=qo&&(s-=g)}else c<=qo&&(s+=c);return{width:s,height:n,x:a,y:l}}const Da=new Set(["absolute","fixed"]);function Ia(t,e){const r=Ft(t,!0,e==="fixed"),o=r.top+t.clientTop,i=r.left+t.clientLeft,s=dt(t)?re(t):ht(1),n=t.clientWidth*s.x,a=t.clientHeight*s.y,l=i*s.x,c=o*s.y;return{width:n,height:a,x:l,y:c}}function Ko(t,e,r){let o;if(e==="viewport")o=Na(t,r);else if(e==="document")o=za(ft(t));else if(st(e))o=Ia(e,r);else{const i=os(t);o={x:e.x-i.x,y:e.y-i.y,width:e.width,height:e.height}}return Ke(o)}function ss(t,e){const r=Pt(t);return r===e||!st(r)||se(r)?!1:nt(r).position==="fixed"||ss(r,e)}function Ma(t,e){const r=e.get(t);if(r)return r;let o=Se(t,[],!1).filter(a=>st(a)&&de(a)!=="body"),i=null;const s=nt(t).position==="fixed";let n=s?Pt(t):t;for(;st(n)&&!se(n);){const a=nt(n),l=sr(n);!l&&a.position==="fixed"&&(i=null),(s?!l&&!i:!l&&a.position==="static"&&!!i&&Da.has(i.position)||Oe(n)&&!l&&ss(t,n))?o=o.filter(d=>d!==n):i=a,n=Pt(n)}return e.set(t,o),o}function Ba(t){let{element:e,boundary:r,rootBoundary:o,strategy:i}=t;const n=[...r==="clippingAncestors"?ir(e)?[]:Ma(e,this._c):[].concat(r),o],a=n[0],l=n.reduce((c,d)=>{const u=Ko(e,d,i);return c.top=Z(u.top,c.top),c.right=kt(u.right,c.right),c.bottom=kt(u.bottom,c.bottom),c.left=Z(u.left,c.left),c},Ko(e,a,i));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function Ua(t){const{width:e,height:r}=rs(t);return{width:e,height:r}}function Va(t,e,r){const o=dt(e),i=ft(e),s=r==="fixed",n=Ft(t,!0,s,e);let a={scrollLeft:0,scrollTop:0};const l=ht(0);function c(){l.x=ar(i)}if(o||!o&&!s)if((de(e)!=="body"||Oe(i))&&(a=nr(e)),o){const h=Ft(e,!0,s,e);l.x=h.x+e.clientLeft,l.y=h.y+e.clientTop}else i&&c();s&&!o&&i&&c();const d=i&&!o&&!s?is(i,a):ht(0),u=n.left+a.scrollLeft-l.x-d.x,m=n.top+a.scrollTop-l.y-d.y;return{x:u,y:m,width:n.width,height:n.height}}function vr(t){return nt(t).position==="static"}function Go(t,e){if(!dt(t)||nt(t).position==="fixed")return null;if(e)return e(t);let r=t.offsetParent;return ft(t)===r&&(r=r.ownerDocument.body),r}function ns(t,e){const r=J(t);if(ir(t))return r;if(!dt(t)){let i=Pt(t);for(;i&&!se(i);){if(st(i)&&!vr(i))return i;i=Pt(i)}return r}let o=Go(t,e);for(;o&&xa(o)&&vr(o);)o=Go(o,e);return o&&se(o)&&vr(o)&&!sr(o)?r:o||Aa(t)||r}const Fa=async function(t){const e=this.getOffsetParent||ns,r=this.getDimensions,o=await r(t.floating);return{reference:Va(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function ja(t){return nt(t).direction==="rtl"}const Ve={convertOffsetParentRelativeRectToViewportRelativeRect:Ra,getDocumentElement:ft,getClippingRect:Ba,getOffsetParent:ns,getElementRects:Fa,getClientRects:La,getDimensions:Ua,getScale:re,isElement:st,isRTL:ja};function as(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function Wa(t,e){let r=null,o;const i=ft(t);function s(){var a;clearTimeout(o),(a=r)==null||a.disconnect(),r=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),s();const c=t.getBoundingClientRect(),{left:d,top:u,width:m,height:h}=c;if(a||e(),!m||!h)return;const g=Ne(u),b=Ne(i.clientWidth-(d+m)),E=Ne(i.clientHeight-(u+h)),$=Ne(d),v={rootMargin:-g+"px "+-b+"px "+-E+"px "+-$+"px",threshold:Z(0,kt(1,l))||1};let _=!0;function y(k){const A=k[0].intersectionRatio;if(A!==l){if(!_)return n();A?n(!1,A):o=setTimeout(()=>{n(!1,1e-7)},1e3)}A===1&&!as(c,t.getBoundingClientRect())&&n(),_=!1}try{r=new IntersectionObserver(y,{...v,root:i.ownerDocument})}catch{r=new IntersectionObserver(y,v)}r.observe(t)}return n(!0),s}function Ha(t,e,r,o){o===void 0&&(o={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=vo(t),d=i||s?[...c?Se(c):[],...Se(e)]:[];d.forEach($=>{i&&$.addEventListener("scroll",r,{passive:!0}),s&&$.addEventListener("resize",r)});const u=c&&a?Wa(c,r):null;let m=-1,h=null;n&&(h=new ResizeObserver($=>{let[x]=$;x&&x.target===c&&h&&(h.unobserve(e),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var v;(v=h)==null||v.observe(e)})),r()}),c&&!l&&h.observe(c),h.observe(e));let g,b=l?Ft(t):null;l&&E();function E(){const $=Ft(t);b&&!as(b,$)&&r(),b=$,g=requestAnimationFrame(E)}return r(),()=>{var $;d.forEach(x=>{i&&x.removeEventListener("scroll",r),s&&x.removeEventListener("resize",r)}),u?.(),($=h)==null||$.disconnect(),h=null,l&&cancelAnimationFrame(g)}}const qa=va,Ka=ya,Ga=ma,Zo=wa,Za=fa,Xa=(t,e,r)=>{const o=new Map,i={platform:Ve,...r},s={...i.platform,_c:o};return pa(t,e,{...i,platform:s})};function Ja(t){return Ya(t)}function yr(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Ya(t){for(let e=t;e;e=yr(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=yr(t);e;e=yr(e)){if(!(e instanceof Element))continue;const r=getComputedStyle(e);if(r.display!=="contents"&&(r.position!=="static"||sr(r)||e.tagName==="BODY"))return e}return null}function Qa(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var T=class extends K{constructor(){super(...arguments),this.localize=new jt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,i=0,s=0,n=0,a=0,l=0,c=0,d=0;r?t.top<e.top?(o=t.left,i=t.bottom,s=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,d=e.top):(o=e.left,i=e.bottom,s=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,d=t.top):t.left<e.left?(o=t.right,i=t.top,s=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,d=e.bottom):(o=e.right,i=e.top,s=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,d=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${d}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Qa(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Ha(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[qa({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Zo({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=i?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Ga({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Ka({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Zo({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Za({element:this.arrowEl,padding:this.arrowPadding}));const e=this.strategy==="absolute"?r=>Ve.getOffsetParent(r,Ja):Ve.getOffsetParent;Xa(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:Qe(Wt({},Ve),{getOffsetParent:e})}).then(({x:r,y:o,middlewareData:i,placement:s})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=i.arrow.x,c=i.arrow.y;let d="",u="",m="",h="";if(this.arrowPlacement==="start"){const g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",u=n?g:"",h=n?"":g}else if(this.arrowPlacement==="end"){const g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";u=n?"":g,h=n?g:"",m=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(h=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",d=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(h=typeof l=="number"?`${l}px`:"",d=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:d,right:u,bottom:m,left:h,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return P`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${vt({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${vt({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?P`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};T.styles=[pt,ra];p([rt(".popup")],T.prototype,"popup",2);p([rt(".popup__arrow")],T.prototype,"arrowEl",2);p([f()],T.prototype,"anchor",2);p([f({type:Boolean,reflect:!0})],T.prototype,"active",2);p([f({reflect:!0})],T.prototype,"placement",2);p([f({reflect:!0})],T.prototype,"strategy",2);p([f({type:Number})],T.prototype,"distance",2);p([f({type:Number})],T.prototype,"skidding",2);p([f({type:Boolean})],T.prototype,"arrow",2);p([f({attribute:"arrow-placement"})],T.prototype,"arrowPlacement",2);p([f({attribute:"arrow-padding",type:Number})],T.prototype,"arrowPadding",2);p([f({type:Boolean})],T.prototype,"flip",2);p([f({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],T.prototype,"flipFallbackPlacements",2);p([f({attribute:"flip-fallback-strategy"})],T.prototype,"flipFallbackStrategy",2);p([f({type:Object})],T.prototype,"flipBoundary",2);p([f({attribute:"flip-padding",type:Number})],T.prototype,"flipPadding",2);p([f({type:Boolean})],T.prototype,"shift",2);p([f({type:Object})],T.prototype,"shiftBoundary",2);p([f({attribute:"shift-padding",type:Number})],T.prototype,"shiftPadding",2);p([f({attribute:"auto-size"})],T.prototype,"autoSize",2);p([f()],T.prototype,"sync",2);p([f({type:Object})],T.prototype,"autoSizeBoundary",2);p([f({attribute:"auto-size-padding",type:Number})],T.prototype,"autoSizePadding",2);p([f({attribute:"hover-bridge",type:Boolean})],T.prototype,"hoverBridge",2);var ls=new Map,tl=new WeakMap;function el(t){return t??{keyframes:[],options:{duration:0}}}function Xo(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function lr(t,e){ls.set(t,el(e))}function Ge(t,e,r){const o=tl.get(t);if(o?.[e])return Xo(o[e],r.dir);const i=ls.get(e);return i?Xo(i,r.dir):{keyframes:[],options:{duration:0}}}function Jo(t,e){return new Promise(r=>{function o(i){i.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}function Yo(t,e,r){return new Promise(o=>{if(r?.duration===1/0)throw new Error("Promise-based animations must be finite.");const i=t.animate(e,Qe(Wt({},r),{duration:rl()?0:r.duration}));i.addEventListener("cancel",o,{once:!0}),i.addEventListener("finish",o,{once:!0})})}function Qo(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function rl(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function ti(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{e.cancel(),requestAnimationFrame(r)})))}var F=class extends K{constructor(){super(),this.localize=new jt(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=Qo(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=Qo(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await ti(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=Ge(this,"tooltip.show",{dir:this.localize.dir()});await Yo(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await ti(this.body);const{keyframes:r,options:o}=Ge(this,"tooltip.hide",{dir:this.localize.dir()});await Yo(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Jo(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Jo(this,"sl-after-hide")}render(){return P`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${vt({tooltip:!0,"tooltip--open":this.open})}
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
    `}};F.styles=[pt,ea];F.dependencies={"sl-popup":T};p([rt("slot:not([name])")],F.prototype,"defaultSlot",2);p([rt(".tooltip__body")],F.prototype,"body",2);p([rt("sl-popup")],F.prototype,"popup",2);p([f()],F.prototype,"content",2);p([f()],F.prototype,"placement",2);p([f({type:Boolean,reflect:!0})],F.prototype,"disabled",2);p([f({type:Number})],F.prototype,"distance",2);p([f({type:Boolean,reflect:!0})],F.prototype,"open",2);p([f({type:Number})],F.prototype,"skidding",2);p([f()],F.prototype,"trigger",2);p([f({type:Boolean})],F.prototype,"hoist",2);p([yt("open",{waitUntilFirstUpdate:!0})],F.prototype,"handleOpenChange",1);p([yt(["content","distance","hoist","placement","skidding"])],F.prototype,"handleOptionsChange",1);p([yt("disabled")],F.prototype,"handleDisabledChange",1);lr("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}});lr("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});var ol=et`
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
`,U=class extends K{constructor(){super(...arguments),this.localize=new jt(this),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let t=this.value;if(this.from){const e=this.getRootNode(),r=this.from.includes("."),o=this.from.includes("[")&&this.from.includes("]");let i=this.from,s="";r?[i,s]=this.from.trim().split("."):o&&([i,s]=this.from.trim().replace(/\]$/,"").split("["));const n="getElementById"in e?e.getElementById(i):null;n?o?t=n.getAttribute(s)||"":r?t=n[s]||"":t=n.textContent||"":(this.showStatus("error"),this.emit("sl-error"))}if(!t)this.showStatus("error"),this.emit("sl-error");else try{await navigator.clipboard.writeText(t),this.showStatus("success"),this.emit("sl-copy",{detail:{value:t}})}catch{this.showStatus("error"),this.emit("sl-error")}}async showStatus(t){const e=this.copyLabel||this.localize.term("copy"),r=this.successLabel||this.localize.term("copied"),o=this.errorLabel||this.localize.term("error"),i=t==="success"?this.successIcon:this.errorIcon,s=Ge(this,"copy.in",{dir:"ltr"}),n=Ge(this,"copy.out",{dir:"ltr"});this.tooltip.content=t==="success"?r:o,await this.copyIcon.animate(n.keyframes,n.options).finished,this.copyIcon.hidden=!0,this.status=t,i.hidden=!1,await i.animate(s.keyframes,s.options).finished,setTimeout(async()=>{await i.animate(n.keyframes,n.options).finished,i.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(s.keyframes,s.options).finished,this.tooltip.content=e,this.isCopying=!1},this.feedbackDuration)}render(){const t=this.copyLabel||this.localize.term("copy");return P`
      <sl-tooltip
        class=${vt({"copy-button":!0,"copy-button--success":this.status==="success","copy-button--error":this.status==="error"})}
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
    `}};U.styles=[pt,ol];U.dependencies={"sl-icon":at,"sl-tooltip":F};p([rt('slot[name="copy-icon"]')],U.prototype,"copyIcon",2);p([rt('slot[name="success-icon"]')],U.prototype,"successIcon",2);p([rt('slot[name="error-icon"]')],U.prototype,"errorIcon",2);p([rt("sl-tooltip")],U.prototype,"tooltip",2);p([Tt()],U.prototype,"isCopying",2);p([Tt()],U.prototype,"status",2);p([f()],U.prototype,"value",2);p([f()],U.prototype,"from",2);p([f({type:Boolean,reflect:!0})],U.prototype,"disabled",2);p([f({attribute:"copy-label"})],U.prototype,"copyLabel",2);p([f({attribute:"success-label"})],U.prototype,"successLabel",2);p([f({attribute:"error-label"})],U.prototype,"errorLabel",2);p([f({attribute:"feedback-duration",type:Number})],U.prototype,"feedbackDuration",2);p([f({attribute:"tooltip-placement"})],U.prototype,"tooltipPlacement",2);p([f({type:Boolean})],U.prototype,"hoist",2);lr("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}});lr("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}});U.define("sl-copy-button");var il=Object.defineProperty,sl=(t,e,r)=>e in t?il(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,wr=(t,e,r)=>(sl(t,typeof e!="symbol"?e+"":e,r),r),nl=(t,e,r)=>{if(!e.has(t))throw TypeError("Cannot "+r)},_r=(t,e)=>{if(Object(e)!==e)throw TypeError('Cannot use the "in" operator on this value');return t.has(e)},De=(t,e,r)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,r)},ei=(t,e,r)=>(nl(t,e,"access private method"),r);/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function cs(t,e){return Object.is(t,e)}/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */let D=null,_e=!1,Fe=1;const Ze=Symbol("SIGNAL");function Qt(t){const e=D;return D=t,e}function al(){return D}function ll(){return _e}const yo={version:0,lastCleanEpoch:0,dirty:!1,producerNode:void 0,producerLastReadVersion:void 0,producerIndexOfThis:void 0,nextProducerIndex:0,liveConsumerNode:void 0,liveConsumerIndexOfThis:void 0,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function cr(t){if(_e)throw new Error(typeof ngDevMode<"u"&&ngDevMode?"Assertion error: signal read during notification phase":"");if(D===null)return;D.consumerOnSignalRead(t);const e=D.nextProducerIndex++;if(ne(D),e<D.producerNode.length&&D.producerNode[e]!==t&&Lr(D)){const r=D.producerNode[e];ur(r,D.producerIndexOfThis[e])}D.producerNode[e]!==t&&(D.producerNode[e]=t,D.producerIndexOfThis[e]=Lr(D)?ds(t,D,e):0),D.producerLastReadVersion[e]=t.version}function cl(){Fe++}function us(t){if(!(!t.dirty&&t.lastCleanEpoch===Fe)){if(!t.producerMustRecompute(t)&&!fl(t)){t.dirty=!1,t.lastCleanEpoch=Fe;return}t.producerRecomputeValue(t),t.dirty=!1,t.lastCleanEpoch=Fe}}function hs(t){if(t.liveConsumerNode===void 0)return;const e=_e;_e=!0;try{for(const r of t.liveConsumerNode)r.dirty||hl(r)}finally{_e=e}}function ul(){return D?.consumerAllowSignalWrites!==!1}function hl(t){var e;t.dirty=!0,hs(t),(e=t.consumerMarkedDirty)==null||e.call(t.wrapper??t)}function dl(t){return t&&(t.nextProducerIndex=0),Qt(t)}function pl(t,e){if(Qt(e),!(!t||t.producerNode===void 0||t.producerIndexOfThis===void 0||t.producerLastReadVersion===void 0)){if(Lr(t))for(let r=t.nextProducerIndex;r<t.producerNode.length;r++)ur(t.producerNode[r],t.producerIndexOfThis[r]);for(;t.producerNode.length>t.nextProducerIndex;)t.producerNode.pop(),t.producerLastReadVersion.pop(),t.producerIndexOfThis.pop()}}function fl(t){ne(t);for(let e=0;e<t.producerNode.length;e++){const r=t.producerNode[e],o=t.producerLastReadVersion[e];if(o!==r.version||(us(r),o!==r.version))return!0}return!1}function ds(t,e,r){var o;if(wo(t),ne(t),t.liveConsumerNode.length===0){(o=t.watched)==null||o.call(t.wrapper);for(let i=0;i<t.producerNode.length;i++)t.producerIndexOfThis[i]=ds(t.producerNode[i],t,i)}return t.liveConsumerIndexOfThis.push(r),t.liveConsumerNode.push(e)-1}function ur(t,e){var r;if(wo(t),ne(t),typeof ngDevMode<"u"&&ngDevMode&&e>=t.liveConsumerNode.length)throw new Error(`Assertion error: active consumer index ${e} is out of bounds of ${t.liveConsumerNode.length} consumers)`);if(t.liveConsumerNode.length===1){(r=t.unwatched)==null||r.call(t.wrapper);for(let i=0;i<t.producerNode.length;i++)ur(t.producerNode[i],t.producerIndexOfThis[i])}const o=t.liveConsumerNode.length-1;if(t.liveConsumerNode[e]=t.liveConsumerNode[o],t.liveConsumerIndexOfThis[e]=t.liveConsumerIndexOfThis[o],t.liveConsumerNode.length--,t.liveConsumerIndexOfThis.length--,e<t.liveConsumerNode.length){const i=t.liveConsumerIndexOfThis[e],s=t.liveConsumerNode[e];ne(s),s.producerIndexOfThis[i]=e}}function Lr(t){var e;return t.consumerIsAlwaysLive||(((e=t?.liveConsumerNode)==null?void 0:e.length)??0)>0}function ne(t){t.producerNode??(t.producerNode=[]),t.producerIndexOfThis??(t.producerIndexOfThis=[]),t.producerLastReadVersion??(t.producerLastReadVersion=[])}function wo(t){t.liveConsumerNode??(t.liveConsumerNode=[]),t.liveConsumerIndexOfThis??(t.liveConsumerIndexOfThis=[])}/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function ps(t){if(us(t),cr(t),t.value===zr)throw t.error;return t.value}function ml(t){const e=Object.create(gl);e.computation=t;const r=()=>ps(e);return r[Ze]=e,r}const $r=Symbol("UNSET"),xr=Symbol("COMPUTING"),zr=Symbol("ERRORED"),gl={...yo,value:$r,dirty:!0,error:null,equal:cs,producerMustRecompute(t){return t.value===$r||t.value===xr},producerRecomputeValue(t){if(t.value===xr)throw new Error("Detected cycle in computations.");const e=t.value;t.value=xr;const r=dl(t);let o,i=!1;try{o=t.computation.call(t.wrapper),i=e!==$r&&e!==zr&&t.equal.call(t.wrapper,e,o)}catch(s){o=zr,t.error=s}finally{pl(t,r)}if(i){t.value=e;return}t.value=o,t.version++}};/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function bl(){throw new Error}let vl=bl;function yl(){vl()}/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function wl(t){const e=Object.create(xl);e.value=t;const r=()=>(cr(e),e.value);return r[Ze]=e,r}function _l(){return cr(this),this.value}function $l(t,e){ul()||yl(),t.equal.call(t.wrapper,t.value,e)||(t.value=e,Cl(t))}const xl={...yo,equal:cs,value:void 0};function Cl(t){t.version++,cl(),hs(t)}/**
 * @license
 * Copyright 2024 Bloomberg Finance L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V=Symbol("node");var M;(t=>{var e,r,o,i;class s{constructor(l,c={}){De(this,r),wr(this,e);const u=wl(l)[Ze];if(this[V]=u,u.wrapper=this,c){const m=c.equals;m&&(u.equal=m),u.watched=c[t.subtle.watched],u.unwatched=c[t.subtle.unwatched]}}get(){if(!(0,t.isState)(this))throw new TypeError("Wrong receiver type for Signal.State.prototype.get");return _l.call(this[V])}set(l){if(!(0,t.isState)(this))throw new TypeError("Wrong receiver type for Signal.State.prototype.set");if(ll())throw new Error("Writes to signals not permitted during Watcher callback");const c=this[V];$l(c,l)}}e=V,r=new WeakSet,t.isState=a=>typeof a=="object"&&_r(r,a),t.State=s;class n{constructor(l,c){De(this,i),wr(this,o);const u=ml(l)[Ze];if(u.consumerAllowSignalWrites=!0,this[V]=u,u.wrapper=this,c){const m=c.equals;m&&(u.equal=m),u.watched=c[t.subtle.watched],u.unwatched=c[t.subtle.unwatched]}}get(){if(!(0,t.isComputed)(this))throw new TypeError("Wrong receiver type for Signal.Computed.prototype.get");return ps(this[V])}}o=V,i=new WeakSet,t.isComputed=a=>typeof a=="object"&&_r(i,a),t.Computed=n,(a=>{var l,c,d,u;function m(v){let _,y=null;try{y=Qt(null),_=v()}finally{Qt(y)}return _}a.untrack=m;function h(v){var _;if(!(0,t.isComputed)(v)&&!(0,t.isWatcher)(v))throw new TypeError("Called introspectSources without a Computed or Watcher argument");return((_=v[V].producerNode)==null?void 0:_.map(y=>y.wrapper))??[]}a.introspectSources=h;function g(v){var _;if(!(0,t.isComputed)(v)&&!(0,t.isState)(v))throw new TypeError("Called introspectSinks without a Signal argument");return((_=v[V].liveConsumerNode)==null?void 0:_.map(y=>y.wrapper))??[]}a.introspectSinks=g;function b(v){if(!(0,t.isComputed)(v)&&!(0,t.isState)(v))throw new TypeError("Called hasSinks without a Signal argument");const _=v[V].liveConsumerNode;return _?_.length>0:!1}a.hasSinks=b;function E(v){if(!(0,t.isComputed)(v)&&!(0,t.isWatcher)(v))throw new TypeError("Called hasSources without a Computed or Watcher argument");const _=v[V].producerNode;return _?_.length>0:!1}a.hasSources=E;class ${constructor(_){De(this,c),De(this,d),wr(this,l);let y=Object.create(yo);y.wrapper=this,y.consumerMarkedDirty=_,y.consumerIsAlwaysLive=!0,y.consumerAllowSignalWrites=!1,y.producerNode=[],this[V]=y}watch(..._){if(!(0,t.isWatcher)(this))throw new TypeError("Called unwatch without Watcher receiver");ei(this,d,u).call(this,_);const y=this[V];y.dirty=!1;const k=Qt(y);for(const A of _)cr(A[V]);Qt(k)}unwatch(..._){if(!(0,t.isWatcher)(this))throw new TypeError("Called unwatch without Watcher receiver");ei(this,d,u).call(this,_);const y=this[V];ne(y);for(let k=y.producerNode.length-1;k>=0;k--)if(_.includes(y.producerNode[k].wrapper)){ur(y.producerNode[k],y.producerIndexOfThis[k]);const A=y.producerNode.length-1;if(y.producerNode[k]=y.producerNode[A],y.producerIndexOfThis[k]=y.producerIndexOfThis[A],y.producerNode.length--,y.producerIndexOfThis.length--,y.nextProducerIndex--,k<y.producerNode.length){const R=y.producerIndexOfThis[k],B=y.producerNode[k];wo(B),B.liveConsumerIndexOfThis[R]=k}}}getPending(){if(!(0,t.isWatcher)(this))throw new TypeError("Called getPending without Watcher receiver");return this[V].producerNode.filter(y=>y.dirty).map(y=>y.wrapper)}}l=V,c=new WeakSet,d=new WeakSet,u=function(v){for(const _ of v)if(!(0,t.isComputed)(_)&&!(0,t.isState)(_))throw new TypeError("Called watch/unwatch without a Computed or State argument")},t.isWatcher=v=>_r(c,v),a.Watcher=$;function x(){var v;return(v=al())==null?void 0:v.wrapper}a.currentComputed=x,a.watched=Symbol("watched"),a.unwatched=Symbol("unwatched")})(t.subtle||(t.subtle={}))})(M||(M={}));/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const El=Symbol("SignalWatcherBrand"),Sl=new FinalizationRegistry((({watcher:t,signal:e})=>{t.unwatch(e)})),ri=new WeakMap;function Kt(t){return t[El]===!0?(console.warn("SignalWatcher should not be applied to the same class more than once."),t):class extends t{constructor(){super(...arguments),this._$St=new M.State(0),this._$Si=!1,this._$So=!0,this._$Sh=new Set}_$Sl(){if(this._$Su!==void 0)return;this._$Sv=new M.Computed((()=>{this._$St.get(),super.performUpdate()}));const e=this._$Su=new M.subtle.Watcher((function(){const r=ri.get(this);r!==void 0&&(r._$Si===!1&&r.requestUpdate(),this.watch())}));ri.set(e,this),Sl.register(this,{watcher:e,signal:this._$Sv}),e.watch(this._$Sv)}_$Sp(){this._$Su!==void 0&&(this._$Su.unwatch(this._$Sv),this._$Sv=void 0,this._$Su=void 0)}performUpdate(){this.isUpdatePending&&(this._$Sl(),this._$Si=!0,this._$St.set(this._$St.get()+1),this._$Si=!1,this._$Sv.get())}update(e){try{this._$So?(this._$So=!1,super.update(e)):this._$Sh.forEach((r=>r.commit()))}finally{this.isUpdatePending=!1,this._$Sh.clear()}}requestUpdate(e,r,o){this._$So=!0,super.requestUpdate(e,r,o)}connectedCallback(){super.connectedCallback(),this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),queueMicrotask((()=>{this.isConnected===!1&&this._$Sp()}))}_(e){this._$Sh.add(e);const r=this._$So;this.requestUpdate(),this._$So=r}m(e){this._$Sh.delete(e)}}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $e=(t,e)=>{const r=t._$AN;if(r===void 0)return!1;for(const o of r)o._$AO?.(e,!1),$e(o,e);return!0},Xe=t=>{let e,r;do{if((e=t._$AM)===void 0)break;r=e._$AN,r.delete(t),t=e}while(r?.size===0)},fs=t=>{for(let e;e=t._$AM;t=e){let r=e._$AN;if(r===void 0)e._$AN=r=new Set;else if(r.has(t))break;r.add(t),Pl(e)}};function kl(t){this._$AN!==void 0?(Xe(this),this._$AM=t,fs(this)):this._$AM=t}function Al(t,e=!1,r=0){const o=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(e)if(Array.isArray(o))for(let s=r;s<o.length;s++)$e(o[s],!1),Xe(o[s]);else o!=null&&($e(o,!1),Xe(o));else $e(this,t)}const Pl=t=>{t.type==ut.CHILD&&(t._$AP??=Al,t._$AQ??=kl)};class Ol extends Pe{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,r,o){super._$AT(e,r,o),fs(this),this.isConnected=e._$AU}_$AO(e,r=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),r&&($e(this,e),Xe(this))}setValue(e){if(Zi(this._$Ct))this._$Ct._$AI(e,this);else{const r=[...this._$Ct._$AH];r[this._$Ci]=e,this._$Ct._$AI(r,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Tl extends Ol{_$Sl(){if(this._$Su!==void 0)return;this._$SW=new M.Computed((()=>{var r;return(r=this._$Sj)===null||r===void 0?void 0:r.get()}));const e=this._$Su=new M.subtle.Watcher((()=>{var r;(r=this._$SO)===null||r===void 0||r._(this),e.watch()}));e.watch(this._$SW)}_$Sp(){var e;this._$Su!==void 0&&(this._$Su.unwatch(this._$SW),this._$SW=void 0,this._$Su=void 0,(e=this._$SO)===null||e===void 0||e.m(this))}commit(){this.setValue(M.subtle.untrack((()=>{var e;return(e=this._$SW)===null||e===void 0?void 0:e.get()})))}render(e){return M.subtle.untrack((()=>e.get()))}update(e,[r]){var o,i;return(o=this._$SO)!==null&&o!==void 0||(this._$SO=(i=e.options)===null||i===void 0?void 0:i.host),r!==this._$Sj&&this._$Sj!==void 0&&this._$Sp(),this._$Sj=r,this._$Sl(),M.subtle.untrack((()=>this._$SW.get()))}disconnected(){this._$Sp()}reconnected(){this._$Sl()}}const Rl=Ae(Tl);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ll=t=>(e,...r)=>t(e,...r.map((o=>o instanceof M.State||o instanceof M.Computed?Rl(o):o))),zl=Ll(P);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */M.State;M.Computed;const Nr=(t,e)=>new M.State(t,e);function Nl(t){return typeof t=="number"}function Dl(t){return typeof t=="string"}function Il(t){return typeof t=="bigint"}function ms(t){return!!t&&Object.prototype.toString.call(t)==="[object Date]"&&!isNaN(t)}function gs(t){return t!=null&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"}var Ml=Symbol.for("decoders.kAnnotationRegistry"),bs=globalThis[Ml]??=new WeakSet;function Te(t){return bs.add(t),t}function vs(t,e){return Te({type:"object",fields:t,text:e})}function Bl(t,e){return Te({type:"array",items:t,text:e})}function Ie(t,e){return Te({type:"opaque",value:t,text:e})}function Ul(t,e){return Te({type:"scalar",value:t,text:e})}function ys(t,e){return e!==void 0?Te({...t,text:e}):t}function ws(t,e){const r=new Map([...t.fields,...e]);return vs(r,t.text)}function _s(t){return bs.has(t)}function Vl(t,e,r){r.add(t);const o=[];for(const i of t)o.push(_o(i,void 0,r));return Bl(o,e)}function $s(t,e,r){r.add(t);const o=new Map;for(const i of Object.keys(t)){const s=t[i];o.set(i,_o(s,void 0,r))}return vs(o,e)}function _o(t,e,r){return t==null||typeof t=="string"||typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"||typeof t.getMonth=="function"?Ul(t,e):_s(t)?ys(t,e):Array.isArray(t)?r.has(t)?Ie("<circular ref>",e):Vl(t,e,r):gs(t)?r.has(t)?Ie("<circular ref>",e):$s(t,e,r):Ie(typeof t=="function"?"<function>":"???",e)}function Bt(t,e){return _o(t,e,new WeakSet)}function xs(t,e){return $s(t,e,new WeakSet)}var Ut="  ";function Dr(t){return t.includes(`
`)}function $o(t,e=Ut){return Dr(t)?t.split(`
`).map(r=>`${e}${r}`).join(`
`):`${e}${t}`}var Fl=/'/g;function ae(t){return typeof t=="string"?"'"+t.replace(Fl,"\\'")+"'":t===void 0?"undefined":JSON.stringify(t)}function Je(t,e=[]){const r=[];if(t.type==="array"){const s=t.items;let n=0;for(const a of s)for(const l of Je(a,[...e,n++]))r.push(l)}else if(t.type==="object"){const s=t.fields;for(const[n,a]of s)for(const l of Je(a,[...e,n]))r.push(l)}const o=t.text;if(!o)return r;let i;return e.length===0?i="":e.length===1?i=typeof e[0]=="number"?`Value at index ${e[0]}: `:`Value at key ${ae(e[0])}: `:i=`Value at keypath ${ae(e.map(String).join("."))}: `,[...r,`${i}${o}`]}function jl(t,e=80){let r=JSON.stringify(t);if(r.length<=e)return r;const o=`${t.substring(0,e-15)}...`;return r=`${JSON.stringify(o)} [truncated]`,r}function Wl(t,e){const{items:r}=t;if(r.length===0)return"[]";const o=[];for(const i of r){const[s,n]=xo(i,`${e}${Ut}`);o.push(`${e}${Ut}${s},`),n!==void 0&&o.push($o(n,`${e}${Ut}`))}return["[",...o,`${e}]`].join(`
`)}function Hl(t,e){const{fields:r}=t;if(r.size===0)return"{}";const o=[];for(const[i,s]of r){const n=Cs(i),a=`${e}${Ut}${" ".repeat(n.length+2)}`,[l,c]=xo(s,`${e}${Ut}`);o.push(`${e}${Ut}${n}: ${l},`),c!==void 0&&o.push($o(c,a))}return["{",...o,`${e}}`].join(`
`)}function Cs(t){return typeof t=="string"?jl(t):typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"?t.toString():t===null?"null":t===void 0?"undefined":ms(t)?`new Date(${ae(t.toISOString())})`:t instanceof Date?"(Invalid Date)":"(unserializable)"}function xo(t,e=""){let r;t.type==="array"?r=Wl(t,e):t.type==="object"?r=Hl(t,e):t.type==="scalar"?r=Cs(t.value):r=t.value;const o=t.text;if(o!==void 0){const i="^".repeat(Dr(r)?1:r.length);return[r,[i,o].join(Dr(o)?`
`:" ")]}else return[r,void 0]}function ql(t){const[e,r]=xo(t);return r!==void 0?`${e}
${r}`:e}function Kl(t){return Je(t,[]).join(`
`)}function*Ir(t,e){switch(t.text&&(e.length>0?yield{message:t.text,path:[...e]}:yield{message:t.text}),t.type){case"array":{let r=0;for(const o of t.items)e.push(r++),yield*Ir(o,e),e.pop();break}case"object":{for(const[r,o]of t.fields)e.push(r),yield*Ir(o,e),e.pop();break}}}function Gl(t){return Array.from(Ir(t,[]))}function Es(t){return{ok:!0,value:t,error:void 0}}function Ss(t){return{ok:!1,value:void 0,error:t}}function Zl(t){return e=>{try{const r=t(e);return Es(r)}catch(r){return Ss(Bt(e,r instanceof Error?r.message:String(r)))}}}function Xl(t,e){const r=e(t);if(typeof r=="string"){const o=new Error(`
${r}`);return o.name="Decoding error",o}else return r}function j(t){function e(h){return t(h,Es,b=>Ss(_s(b)?b:Bt(h,b)))}function r(h,g=ql){const b=e(h);if(b.ok)return b.value;throw Xl(b.error,g)}function o(h){return e(h).value}function i(h){return a(Zl(h))}function s(h,g){return c(b=>h(b)?null:g)}function n(){return m}function a(h){return j((g,b,E)=>{const $=e(g);if(!$.ok)return $;const x=oi(h)?h:h($.value,b,E);return oi(x)?x.decode($.value):x})}function l(h){return a(h)}function c(h){return a((g,b,E)=>{const $=h(g);return $===null?b(g):E(typeof $=="string"?Bt(g,$):$)})}function d(h){return j((g,b,E)=>{const $=e(g);return $.ok?$:E(Bt($.error,h))})}const m=Yl({verify:r,value:o,decode:e,transform:i,refine:s,refineType:n,reject:c,describe:d,then:a,pipe:l,"~standard":{version:1,vendor:"decoders",validate:h=>{const g=e(h);return g.ok?{value:g.value}:{issues:Gl(g.error)}}}});return m}var Jl=Symbol.for("decoders.kDecoderRegistry"),ks=globalThis[Jl]??=new WeakSet;function Yl(t){return ks.add(t),t}function oi(t){return ks.has(t)}var Ql=j((t,e,r)=>Array.isArray(t)?e(t):r("Must be an array"));function tt(t){const e=t.decode;return Ql.then((r,o,i)=>{const s=[];for(let n=0;n<r.length;++n){const a=r[n],l=e(a);if(l.ok)s.push(l.value);else{s.length=0;const c=l.error,d=r.slice();return d.splice(n,1,Bt(c,c.text?`${c.text} (at index ${n})`:`index ${n}`)),i(Bt(d))}}return o(s)})}function tc(t){return j((e,r,o)=>e instanceof t?r(e):o(`Must be ${t.name} instance`))}function As(t){return j(e=>t().decode(e))}function ec(t,e){const r=new Set;for(const o of t)e.has(o)||r.add(o);return r}var Ps=j((t,e,r)=>gs(t)?e(t):r("Must be an object"));function q(t){const e=new Set(Object.keys(t));return Ps.then((r,o,i)=>{const s=new Set(Object.keys(r)),n=ec(e,s),a={};let l=null;for(const c of Object.keys(t)){const d=t[c],u=r[c],m=d.decode(u);if(m.ok){const h=m.value;h!==void 0&&(a[c]=h),n.delete(c)}else{const h=m.error;u===void 0?n.add(c):(l??=new Map,l.set(c,h))}}if(l||n.size>0){let c=xs(r);if(l&&(c=ws(c,l)),n.size>0){const d=Array.from(n).map(ae).join(", "),u=n.size>1?"keys":"key";c=ys(c,`Missing ${u}: ${d}`)}return i(c)}return o(a)})}var Mr=`Either:
`;function rc(t){return`-${$o(t).substring(1)}`}function oc(t){return t.startsWith(Mr)?t.substring(Mr.length):rc(t)}function Ot(...t){if(t.length===0)throw new Error("Pass at least one decoder to either()");return j((e,r,o)=>{const i=[];for(const n of t){const a=n.decode(e);if(a.ok)return a;i.push(a.error)}const s=Mr+i.map(n=>oc(Je(n).join(`
`))).join(`
`);return o(s)})}function ic(t){return typeof t=="function"?t():t}var Br=gt(null),sc=gt(void 0);j((t,e,r)=>t==null?e(t):r("Must be undefined or null"));function nc(t,e){const r=Ot(sc,t);return arguments.length>=2?r.transform(o=>o??ic(e)):r}function gt(t){return j((e,r,o)=>e===t?r(t):o(`Must be ${typeof t=="symbol"?String(t):ae(t)}`))}var ac=j((t,e,r)=>e(t)),Os=ac,S=j((t,e,r)=>typeof t=="boolean"?e(t):r("Must be boolean"));j((t,e,r)=>e(!!t));function Ts(t,e){const r=e!==void 0?t:void 0,o=e??t;return Ps.then((i,s,n)=>{let a={};const l=new Map;for(const c of Object.keys(i)){const d=i[c],u=r?.decode(c);if(u?.ok===!1)return n(Bt(i,`Invalid key ${ae(c)}: ${Kl(u.error)}`));const m=u?.value??c,h=o.decode(d);h.ok?l.size===0&&(a[m]=h.value):(l.set(c,h.error),a={})}return l.size>0?n(ws(xs(i),l)):s(a)})}var lc=/^([A-Za-z]{2,12}(?:[+][A-Za-z]{2,12})?):\/\/(?:([^@:]*:?(?:[^@]+)?)@)?(?:([A-Za-z0-9.-]+)(?::([0-9]{2,5}))?)(\/(?:[-+~%/.,\w]*)?(?:\?[-+=&;%@.,/\w]*)?(?:#[.,!/\w]*)?)?$/,w=j((t,e,r)=>Dl(t)?e(t):r("Must be string"));Rt(/\S/,"Must be non-empty string");function Rt(t,e){return w.refine(r=>t.test(r),e)}Rt(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Must be email");var cc=Ot(Rt(lc,"Must be URL").transform(t=>new URL(t)),tc(URL));cc.refine(t=>t.protocol==="https:","Must be an HTTPS URL");Rt(/^[a-z_][a-z0-9_]*$/i,"Must be valid identifier");var Rs=Rt(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,"Must be uuid");Rs.refine(t=>t[14]==="1","Must be uuidv1");Rs.refine(t=>t[14]==="4","Must be uuidv4");var uc=Rt(/^[0-9]+$/,"Must only contain digits");Rt(/^[0-9a-f]+$/i,"Must only contain hexadecimal digits");uc.transform(Number);var hc=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.]\d+)?(?:Z|[+-]\d{2}:?\d{2})$/,dc=j((t,e,r)=>ms(t)?e(t):r("Must be a Date")),pc=Rt(hc,"Must be ISO8601 format").refine(t=>!isNaN(new Date(t).getTime()),"Must be valid date/time value"),fc=pc.transform(t=>new Date(t));Ot(dc,fc).describe("Must be a Date or date string");var mc=j((t,e,r)=>Nl(t)?e(t):r("Must be number")),L=mc.refine(t=>Number.isFinite(t),"Number must be finite"),gc=L.refine(t=>Number.isInteger(t),"Number must be an integer");L.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");gc.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");j((t,e,r)=>Il(t)?e(t):r("Must be bigint"));var bc=As(()=>Ts(Ls)),vc=As(()=>tt(Ls)),Ls=Ot(Br,w,L,S,bc,vc).describe("Must be valid JSON value");class Gt extends ee{createRenderRoot(){return this}}const yc=["PENDING"];class Co{#e=new M.State(yc);#o;constructor(e){if(this.constructor!==Co)throw new Error("tracked-async-data cannot be subclassed");if(!ii(e)){this.#e.set(["RESOLVED",e]),this.#o=Promise.resolve(e);return}this.#o=e,this.#o.then(r=>{this.#e.set(["RESOLVED",r])},r=>{this.#e.set(["REJECTED",r])})}then=(e,r)=>{if(ii(this.#o))return this.#o.then(e).catch(r);if(this.state==="RESOLVED")return e(this.value);if(this.state==="REJECTED"&&r)return r(this.error);throw new Error("Value was not resolveable")};get state(){return this.#e.get()[0]}get value(){let e=this.#e.get();return e[0]==="RESOLVED"?e[1]:null}get error(){let e=this.#e.get();return e[0]==="REJECTED"?e[1]:null}get isPending(){return this.state==="PENDING"}get isResolved(){return this.state==="RESOLVED"}get isRejected(){return this.state==="REJECTED"}toJSON(){const{isPending:e,isResolved:r,isRejected:o}=this;return e?{isPending:e,isResolved:r,isRejected:o}:r?{isPending:e,isResolved:r,value:this.value,isRejected:o}:{isPending:e,isResolved:r,isRejected:o,error:this.error}}toString(){return JSON.stringify(this.toJSON(),null,2)}}function wc(t,e){return t in e}function ii(t){return typeof t=="object"&&t!==null&&wc("then",t)&&typeof t.then=="function"}function Ct(t){if(arguments.length===1){if(typeof t!="function")throw new Error("signalFunction must be called with a function passed");return new _c(t)}throw new Error("Unknown arity: signalFunction must be called with 1 argument")}class _c{#e=new M.State(null);get data(){return this.#r.get(),this.#e.get()}#o=new M.State(void 0);get promise(){return this.#r.get(),this.#o.get()}#i=new M.State(void 0);get caughtError(){return this.#r.get(),this.#i.get()}#t;#r;constructor(e){this.#t=e,this.#r=new M.Computed(()=>(this.retry(),this))}get state(){return this.#r.get(),this.data?.state??"UNSTARTED"}get isPending(){return this.#r.get(),this.data?this.data.isPending??!1:!0}get isFinished(){return this.#r.get(),this.isResolved||this.isRejected}get isSettled(){return this.#r.get(),this.isFinished}get isLoading(){return this.#r.get(),this.isPending}get isResolved(){return this.#r.get(),this.data?.isResolved??!1}get isError(){return this.#r.get(),this.isRejected}get isRejected(){return this.#r.get(),this.data?.isRejected??!!this.caughtError??!1}get value(){return this.#r.get(),this.data?.isResolved?this.data.value:null}get error(){return this.#r.get(),this.state==="UNSTARTED"&&this.caughtError?this.caughtError:this.data?.state!=="REJECTED"?null:this.caughtError?this.caughtError:this.data?.error??null}retry=async()=>{try{await this.#l()}catch(e){this.#i.set(e)}};async#l(){return this.#e.set(null),this.#o.set(this.#t()),await Promise.resolve(),this.#i.set(null),this.#e.set(new Co(this.promise)),this.promise}}const $c=q({width:L,height:L,url:w,accessories:tt(Os)}),zs=q({header_full_width:L,header_full_height:L,avatar_shape:w,background_color:w,body_font:w,header_bounds:w,header_image:w,header_image_focused:w,header_image_poster:w,header_image_scaled:w,header_stretch:S,link_color:w,show_avatar:S,show_description:S,show_header_image:S,show_title:S,title_color:w,title_font:w,title_font_weight:w}),Ns=q({admin:S,ask:S,ask_anon:S,ask_page_title:w,asks_allow_media:S,avatar:tt($c),can_chat:S,can_send_fan_mail:S,can_subscribe:S,description:w,drafts:L,facebook:w,facebook_opengraph_enabled:w,followed:S,followers:L,is_blocked_from_primary:S,is_nsfw:S,messages:L,name:w,posts:L,primary:S,queue:L,share_likes:S,subscribed:S,theme_id:L,theme:zs,title:w,total_posts:L,tweet:w,twitter_enabled:S,twitter_send:S,type:w,updated:L,url:w,uuid:w}),xc=q({name:w,title:w,description:w,url:w,uuid:w,updated:L,tumblrmart_accessories:Ts(w,Os),can_show_badges:S}),Cc=q({comment:w,tree_html:w}),Ec=q({blog:q({name:w,active:S,theme:zs,share_likes:S,share_following:S,can_be_followed:S}),post:q({id:w}),content_raw:w,content:w,is_current_item:S,is_root_item:S}),Sc=q({type:w,is_blocks_post_format:S,blog_name:w,blog:xc,id:w,id_string:w,is_blazed:S,is_blaze_pending:S,can_ignite:S,can_blaze:S,post_url:w,slug:w,date:w,timestamp:L,state:w,format:w,reblog_key:w,tags:tt(w),short_url:w,summary:w,should_open_in_legacy:S,recommended_source:Ot(w,Br),recommended_color:Ot(w,Br),followed:S,liked:S,note_count:L,title:w,body:w,reblog:Cc,trail:tt(Ec),can_like:S,interactability_reblog:w,interactability_blaze:w,can_reblog:S,can_send_in_message:S,muted:S,mute_end_timestamp:L,can_mute:S,can_reply:S,display_avatar:S}),kc=q({blog:Ns,posts:tt(Sc),total_posts:L});q({blog:q({blog:Ns}),posts:kc});const Ac=q({avatar:w,updated:L,title:w,description:w}),ye=q({id:w,date:L,body:w,tags:tt(w)});class Pc{constructor(){this.meta=Ct(()=>this.#e("/meta.json",Ac)),this.posts={all:Ct(()=>this.#e("/posts/all.json",tt(ye))),family:Ct(()=>this.#e("/posts/family.json",tt(ye))),climbing:Ct(()=>this.#e("/posts/climbing.json",tt(ye))),gaming:Ct(()=>this.#e("/posts/gaming.json",tt(ye))),anime:Ct(()=>this.#e("/posts/anime.json",tt(ye))),none:Ct(()=>Promise.resolve([]))},this.none=Ct(()=>Promise.resolve([]))}async#e(e,r){const i=await(await fetch(e)).json();return r.verify(i)}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const si=new WeakMap,ni=t=>{if((r=>r.pattern!==void 0)(t))return t.pattern;let e=si.get(t);return e===void 0&&si.set(t,e=new URLPattern({pathname:t.path})),e};let Oc=class{constructor(e,r,o){this.routes=[],this.o=[],this.t={},this.i=i=>{if(i.routes===this)return;const s=i.routes;this.o.push(s),s.h=this,i.stopImmediatePropagation(),i.onDisconnect=()=>{this.o?.splice(this.o.indexOf(s)>>>0,1)};const n=ai(this.t);n!==void 0&&s.goto(n)},(this.l=e).addController(this),this.routes=[...r],this.fallback=o?.fallback}link(e){if(e?.startsWith("/"))return e;if(e?.startsWith("."))throw Error("Not implemented");return e??=this.u,(this.h?.link()??"")+e}async goto(e){let r;if(this.routes.length===0&&this.fallback===void 0)r=e,this.u="",this.t={0:r};else{const o=this.p(e);if(o===void 0)throw Error("No route found for "+e);const i=ni(o).exec({pathname:e}),s=i?.pathname.groups??{};if(r=ai(s),typeof o.enter=="function"&&await o.enter(s)===!1)return;this.v=o,this.t=s,this.u=r===void 0?e:e.substring(0,e.length-r.length)}if(r!==void 0)for(const o of this.o)o.goto(r);this.l.requestUpdate()}outlet(){return this.v?.render?.(this.t)}get params(){return this.t}p(e){const r=this.routes.find((o=>ni(o).test({pathname:e})));return r||this.fallback===void 0?r:this.fallback?{...this.fallback,path:"/*"}:void 0}hostConnected(){this.l.addEventListener(Ur.eventName,this.i);const e=new Ur(this);this.l.dispatchEvent(e),this._=e.onDisconnect}hostDisconnected(){this._?.(),this.h=void 0}};const ai=t=>{let e;for(const r of Object.keys(t))/\d+/.test(r)&&(e===void 0||r>e)&&(e=r);return e&&t[e]};let Ur=class Ds extends Event{constructor(e){super(Ds.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.routes=e}};Ur.eventName="lit-routes-connected";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tc=location.origin||location.protocol+"//"+location.host;class Rc extends Oc{constructor(){super(...arguments),this.m=e=>{const r=e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey;if(e.defaultPrevented||r)return;const o=e.composedPath().find((n=>n.tagName==="A"));if(o===void 0||o.target!==""||o.hasAttribute("download")||o.getAttribute("rel")==="external")return;const i=o.href;if(i===""||i.startsWith("mailto:"))return;const s=window.location;o.origin===Tc&&(e.preventDefault(),i!==s.href&&(window.history.pushState({},"",i),this.goto(o.pathname)))},this.R=e=>{this.goto(window.location.pathname)}}hostConnected(){super.hostConnected(),window.addEventListener("click",this.m),window.addEventListener("popstate",this.R),this.goto(window.location.pathname)}hostDisconnected(){super.hostDisconnected(),window.removeEventListener("click",this.m),window.removeEventListener("popstate",this.R)}}class Lc extends Rc{constructor(){super(...arguments),this.pathname=Nr(void 0),this.fragment=Nr(void 0)}async goto(e){const r=e.replace(/\/$/,"");await super.goto(r),this.pathname.set(r),this.fragment.set(location.hash.replace(/^#/,""))}}const Is="app-theme",zc=Ot(gt("light"),gt("dark"));function Nc(){return zc.value(localStorage.getItem(Is))}function Dc(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}class Ic{constructor(){this.activeTheme=Nr(Nc()??Dc()),this.toggle=()=>{const e=this.activeTheme.get()==="dark"?"light":"dark";this.activeTheme.set(e),localStorage.setItem(Is,e)}}}var Mc=Object.getOwnPropertyDescriptor,Bc=(t,e,r,o)=>{for(var i=o>1?void 0:o?Mc(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=n(i)||i);return i};let li=class extends Kt(Gt){constructor(){super(...arguments),this.theme=new Ic,this.blog=new Pc,this.router=new Lc(this,[{pattern:new URLPattern({pathname:"{/:tag}?{/}*"}),render:t=>{const o=q({tag:nc(Ot(gt("all"),gt("family"),gt("climbing"),gt("gaming"),gt("anime")))}).value(t)?.tag,i=this.blog.posts[o??"all"];return P`<app-post-list .posts=${i}></app-post-list>`}},{pattern:new URLPattern({pathname:"/*"}),render:()=>P`<app-post-list .posts=${this.blog.none}></app-post-list>`}])}render(){const{pathname:t,fragment:e}=this.router,{meta:r}=this.blog,{activeTheme:o,toggle:i}=this.theme;return P`
      <main>
        <div>
          <app-header
            .pathname=${t}
            .meta=${r}
            .activeTheme=${o}
            .toggleTheme=${i}
          ></app-header>
          <sl-divider></sl-divider>
          <app-scroller .pathname=${t} .fragment=${e}>
            ${this.router.outlet()}
          </app-scroller>
        </div>
        <sl-divider></sl-divider>
        <app-footer .meta=${r}></app-footer>
      </main>
      <app-document .meta=${r}></app-document>
      <app-theme .activeTheme=${o}></app-theme>
    `}};li=Bc([Ht("app-root")],li);var Uc=Object.defineProperty,Vc=Object.getOwnPropertyDescriptor,Ms=(t,e,r,o)=>{for(var i=o>1?void 0:o?Vc(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Uc(e,r,i),i};let Vr=class extends Kt(Gt){updated(){switch(this.meta?.state){case"REJECTED":{document.title="error";return}case"RESOLVED":{document.title=this.meta.value?.title??"",Hi(P`<link rel="icon" type="image/png" href=${this.meta.value?.avatar??""}></link>`,document.head);return}}}};Ms([f({attribute:!1})],Vr.prototype,"meta",2);Vr=Ms([Ht("app-document")],Vr);var Fc=Object.defineProperty,jc=Object.getOwnPropertyDescriptor,Bs=(t,e,r,o)=>{for(var i=o>1?void 0:o?jc(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Fc(e,r,i),i};let Fr=class extends Kt(Gt){render(){switch(this.meta?.state){case"RESOLVED":{const t=new Date(this.meta.value?.updated??0).toISOString();return P`
          <footer>
            <div>
              <span>Last updated on</span>
              <sl-format-date
                month="long"
                day="numeric"
                year="numeric"
                date=${t}
              ></sl-format-date>
            </div>
            <div>
              <sl-button @click=${()=>window.scrollTo(0,0)}
                >scroll up</sl-button
              >
            </div>
          </footer>
        `}default:return P`
          <footer>
            <div></div>
            <div>
              <sl-button @click=${()=>window.scrollTo(0,0)}
                >scroll up</sl-button
              >
            </div>
          </footer>
        `}}};Bs([f({attribute:!1})],Fr.prototype,"meta",2);Fr=Bs([Ht("app-footer")],Fr);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ci=(t,e,r)=>{const o=new Map;for(let i=e;i<=r;i++)o.set(t[i],i);return o},jr=Ae(class extends Pe{constructor(t){if(super(t),t.type!==ut.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,e,r){let o;r===void 0?r=e:e!==void 0&&(o=e);const i=[],s=[];let n=0;for(const a of t)i[n]=o?o(a,n):n,s[n]=r(a,n),n++;return{values:s,keys:i}}render(t,e,r){return this.dt(t,e,r).values}update(t,[e,r,o]){const i=qn(t),{values:s,keys:n}=this.dt(e,r,o);if(!Array.isArray(i))return this.ut=n,s;const a=this.ut??=[],l=[];let c,d,u=0,m=i.length-1,h=0,g=s.length-1;for(;u<=m&&h<=g;)if(i[u]===null)u++;else if(i[m]===null)m--;else if(a[u]===n[h])l[h]=Nt(i[u],s[h]),u++,h++;else if(a[m]===n[g])l[g]=Nt(i[m],s[g]),m--,g--;else if(a[u]===n[g])l[g]=Nt(i[u],s[g]),be(t,l[g+1],i[u]),u++,g--;else if(a[m]===n[h])l[h]=Nt(i[m],s[h]),be(t,i[u],i[m]),m--,h++;else if(c===void 0&&(c=ci(n,h,g),d=ci(a,u,m)),c.has(a[u]))if(c.has(a[m])){const b=d.get(n[h]),E=b!==void 0?i[b]:null;if(E===null){const $=be(t,i[u]);Nt($,s[h]),l[h]=$}else l[h]=Nt(E,s[h]),be(t,i[u],E),i[b]=null;h++}else mr(i[m]),m--;else mr(i[u]),u++;for(;h<=g;){const b=be(t,l[g+1]);Nt(b,s[h]),l[h++]=b}for(;u<=m;){const b=i[u++];b!==null&&mr(b)}return this.ut=n,Xi(t,l),X}});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Wr extends Pe{constructor(e){if(super(e),this.it=z,e.type!==ut.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===z||e==null)return this._t=void 0,this.it=e;if(e===X)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}}Wr.directiveName="unsafeHTML",Wr.resultType=1;const Hr=Ae(Wr);var Wc=Object.defineProperty,Hc=Object.getOwnPropertyDescriptor,Re=(t,e,r,o)=>{for(var i=o>1?void 0:o?Hc(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Wc(e,r,i),i};const qc=[{label:"Home",href:"/"},{label:"Family",href:"/family"},{label:"Climbing",href:"/climbing"},{label:"Gaming",href:"/gaming"},{label:"Anime",href:"/anime"},{label:"Source",href:"https://github.com/defevan/dadmaxxing"}];let le=class extends Kt(Gt){typographyElements(){switch(this.meta?.state){case"REJECTED":{const t=P`<h1>error</h1>`,e=P`<p>uh, big issue, failed to get the blog meta data</p>`;return{h1:t,p:e}}default:{const t=this.meta?.value?P`<h1>${this.meta.value.title}</h1>`:P`<h1>${Hr("&nbsp;")}</h1>`,e=this.meta?.value?P`<p>${this.meta.value.description}</p>`:P`<p>${Hr("&nbsp;")}</p>`;return{h1:t,p:e}}}}render(){const{h1:t,p:e}=this.typographyElements(),r=jr(qc,o=>o.href,o=>this.renderLink(o));return P`
      <header>
        <div>${t} ${e}</div>
        <div>
          <nav>${r}</nav>
          <div class="switch-container">
            <sl-switch
              ?checked=${this.activeTheme?.get()==="dark"}
              @sl-change=${()=>this.toggleTheme?.()}
              >dark mode</sl-switch
            >
          </div>
        </div>
      </header>
    `}renderLink({href:t,label:e}){if(t.includes("https://"))return P`<a href=${t}>${e}</a>`;const r=(this.pathname?.get()||"/")===t;return P`<a href=${t} ?active=${r}>${e}</a>`}};Re([f({attribute:!1})],le.prototype,"pathname",2);Re([f({attribute:!1})],le.prototype,"meta",2);Re([f({attribute:!1})],le.prototype,"activeTheme",2);Re([f({attribute:!1})],le.prototype,"toggleTheme",2);le=Re([Ht("app-header")],le);var Kc=Object.defineProperty,Gc=Object.getOwnPropertyDescriptor,Us=(t,e,r,o)=>{for(var i=o>1?void 0:o?Gc(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Kc(e,r,i),i};class Vs extends CustomEvent{constructor(e,r={bubbles:!0,composed:!0}){super("cards",{...r,detail:e})}}let qr=class extends Kt(Gt){updated(){const t=this.querySelectorAll("div.card");this.dispatchEvent(new Vs(t))}render(){switch(this.posts?.state){case"RESOLVED":{const t=this.posts.value??[];return t.length<1?P`
            <div class="msg">¯\\_(ツ)_/¯ 404 i couldn't find the thing</div>
          `:jr(t,e=>e.id,(e,r)=>this.renderPost(e,t.length-1===r))}case"REJECTED":return P`
          <div class="msg">(x_x) 500 something went horribly wrong</div>
        `;default:return null}}renderPost(t,e){const r=new Date(t.date),o=`${location.origin}${location.pathname}#${t.id}`;return P`
      <div class="card-container">
        <div id=${t.id} class="card" tabindex="0">
          <div class="card-header">
            <sl-format-date
              month="long"
              day="numeric"
              year="numeric"
              date=${r.toISOString()}
            ></sl-format-date>
            <a href=${`#${t.id}`} class="copy-link">
              <sl-copy-button value=${o}></sl-copy-button>
            </a>
          </div>
          <div class="card-body">${this.renderPostBody(t.body)}</div>
          <div class="card-footer">${this.renderTags(t.tags)}</div>
        </div>
      </div>
      ${e?null:P`<sl-divider></sl-divider>`}
    `}renderTags(t){return jr(t,e=>e,e=>{const r=`/${e}`,o=`#${e}`;return P`
          <a href=${r}>
            <sl-tag pill>${o}</sl-tag>
          </a>
        `})}renderPostBody(t){const r=new DOMParser().parseFromString(t,"text/html");for(const o of r.querySelectorAll("figure")){const i=parseFloat(o.getAttribute("data-orig-height")??""),s=parseFloat(o.getAttribute("data-orig-width")??"");if(isNaN(i)||isNaN(s)){console.warn("failed to set img/video aspect ratio");continue}const n=[...o.querySelectorAll("img"),...o.querySelectorAll("video")];for(const a of n)a.style.aspectRatio=`${s} / ${i}`,a.style.backgroundColor="rgba(128, 128, 128, 0.1)"}return Hr(r.body.innerHTML)}};Us([f({attribute:!1})],qr.prototype,"posts",2);qr=Us([Ht("app-post-list")],qr);var Zc=Object.defineProperty,Xc=Object.getOwnPropertyDescriptor,hr=(t,e,r,o)=>{for(var i=o>1?void 0:o?Xc(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Zc(e,r,i),i};let ke=class extends Kt(Gt){handleCards(t){t instanceof Vs&&(this.cards=t.detail)}connectedCallback(){super.connectedCallback(),this.addEventListener("cards",this.handleCards)}disconnectedCallback(){this.removeEventListener("cards",this.handleCards),super.disconnectedCallback()}async updated(){const t=this.fragment?.get(),e=this.cards;if(!e||e.length<1)return;const r=Array.from(e).find(o=>o.id===t);await new Promise(o=>requestIdleCallback(o)),r?r.scrollIntoView({behavior:"auto",block:"start",inline:"nearest"}):window.scrollTo(0,0)}render(){return zl`<slot></slot>`}};hr([f({attribute:!1})],ke.prototype,"pathname",2);hr([f({attribute:!1})],ke.prototype,"fragment",2);hr([Tt()],ke.prototype,"cards",2);ke=hr([Ht("app-scroller")],ke);var Jc=Object.defineProperty,Yc=Object.getOwnPropertyDescriptor,Fs=(t,e,r,o)=>{for(var i=o>1?void 0:o?Yc(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Jc(e,r,i),i};let Kr=class extends Kt(Gt){updated(){this.activeTheme?.get()==="dark"?document.documentElement.classList.add("sl-theme-dark"):document.documentElement.classList.remove("sl-theme-dark")}};Fs([f({attribute:!1})],Kr.prototype,"activeTheme",2);Kr=Fs([Ht("app-theme")],Kr);
