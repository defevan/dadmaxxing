(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function r(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(s){if(s.ep)return;s.ep=!0;const i=r(s);fetch(s.href,i)}})();window.requestIdleCallback=window.requestIdleCallback||function(t){var e=Date.now();return setTimeout(function(){t({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-e))}})},1)};window.cancelIdleCallback=window.cancelIdleCallback||function(t){clearTimeout(t)};var ji=Object.defineProperty,C=(t,e)=>ji(t,"name",{value:e,configurable:!0}),Jt=class{type=3;name="";prefix="";value="";suffix="";modifier=3;constructor(e,r,o,s,i,n){this.type=e,this.name=r,this.prefix=o,this.value=s,this.suffix=i,this.modifier=n}hasCustomName(){return this.name!==""&&typeof this.name!="number"}};C(Jt,"Part");var Wi=/[$_\p{ID_Start}]/u,Hi=/[$_\u200C\u200D\p{ID_Continue}]/u,xr=".*";function us(t,e){return(e?/^[\x00-\xFF]*$/:/^[\x00-\x7F]*$/).test(t)}C(us,"isASCII");function qr(t,e=!1){let r=[],o=0;for(;o<t.length;){let s=t[o],i=C(function(n){if(!e)throw new TypeError(n);r.push({type:"INVALID_CHAR",index:o,value:t[o++]})},"ErrorOrInvalid");if(s==="*"){r.push({type:"ASTERISK",index:o,value:t[o++]});continue}if(s==="+"||s==="?"){r.push({type:"OTHER_MODIFIER",index:o,value:t[o++]});continue}if(s==="\\"){r.push({type:"ESCAPED_CHAR",index:o++,value:t[o++]});continue}if(s==="{"){r.push({type:"OPEN",index:o,value:t[o++]});continue}if(s==="}"){r.push({type:"CLOSE",index:o,value:t[o++]});continue}if(s===":"){let n="",a=o+1;for(;a<t.length;){let l=t.substr(a,1);if(a===o+1&&Wi.test(l)||a!==o+1&&Hi.test(l)){n+=t[a++];continue}break}if(!n){i(`Missing parameter name at ${o}`);continue}r.push({type:"NAME",index:o,value:n}),o=a;continue}if(s==="("){let n=1,a="",l=o+1,c=!1;if(t[l]==="?"){i(`Pattern cannot start with "?" at ${l}`);continue}for(;l<t.length;){if(!us(t[l],!1)){i(`Invalid character '${t[l]}' at ${l}.`),c=!0;break}if(t[l]==="\\"){a+=t[l++]+t[l++];continue}if(t[l]===")"){if(n--,n===0){l++;break}}else if(t[l]==="("&&(n++,t[l+1]!=="?")){i(`Capturing groups are not allowed at ${l}`),c=!0;break}a+=t[l++]}if(c)continue;if(n){i(`Unbalanced pattern at ${o}`);continue}if(!a){i(`Missing pattern at ${o}`);continue}r.push({type:"REGEX",index:o,value:a}),o=l;continue}r.push({type:"CHAR",index:o,value:t[o++]})}return r.push({type:"END",index:o,value:""}),r}C(qr,"lexer");function Kr(t,e={}){let r=qr(t);e.delimiter??="/#?",e.prefixes??="./";let o=`[^${G(e.delimiter)}]+?`,s=[],i=0,n=0,a=new Set,l=C(x=>{if(n<r.length&&r[n].type===x)return r[n++].value},"tryConsume"),c=C(()=>l("OTHER_MODIFIER")??l("ASTERISK"),"tryConsumeModifier"),d=C(x=>{let v=l(x);if(v!==void 0)return v;let{type:_,index:y}=r[n];throw new TypeError(`Unexpected ${_} at ${y}, expected ${x}`)},"mustConsume"),u=C(()=>{let x="",v;for(;v=l("CHAR")??l("ESCAPED_CHAR");)x+=v;return x},"consumeText"),m=C(x=>x,"DefaultEncodePart"),h=e.encodePart||m,g="",b=C(x=>{g+=x},"appendToPendingFixedValue"),E=C(()=>{g.length&&(s.push(new Jt(3,"","",h(g),"",3)),g="")},"maybeAddPartFromPendingFixedValue"),$=C((x,v,_,y,A)=>{let P=3;switch(A){case"?":P=1;break;case"*":P=0;break;case"+":P=2;break}if(!v&&!_&&P===3){b(x);return}if(E(),!v&&!_){if(!x)return;s.push(new Jt(3,"","",h(x),"",P));return}let R;_?_==="*"?R=xr:R=_:R=o;let B=2;R===o?(B=1,R=""):R===xr&&(B=0,R="");let N;if(v?N=v:_&&(N=i++),a.has(N))throw new TypeError(`Duplicate name '${N}'.`);a.add(N),s.push(new Jt(B,N,h(x),R,h(y),P))},"addPart");for(;n<r.length;){let x=l("CHAR"),v=l("NAME"),_=l("REGEX");if(!v&&!_&&(_=l("ASTERISK")),v||_){let A=x??"";e.prefixes.indexOf(A)===-1&&(b(A),A=""),E();let P=c();$(A,v,_,"",P);continue}let y=x??l("ESCAPED_CHAR");if(y){b(y);continue}if(l("OPEN")){let A=u(),P=l("NAME"),R=l("REGEX");!P&&!R&&(R=l("ASTERISK"));let B=u();d("CLOSE");let N=c();$(A,P,R,B,N);continue}E(),d("END")}return s}C(Kr,"parse");function G(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}C(G,"escapeString");function Cr(t){return t&&t.ignoreCase?"ui":"u"}C(Cr,"flags");function hs(t,e,r){return Gr(Kr(t,r),e,r)}C(hs,"stringToRegexp");function zt(t){switch(t){case 0:return"*";case 1:return"?";case 2:return"+";case 3:return""}}C(zt,"modifierToString");function Gr(t,e,r={}){r.delimiter??="/#?",r.prefixes??="./",r.sensitive??=!1,r.strict??=!1,r.end??=!0,r.start??=!0,r.endsWith="";let o=r.start?"^":"";for(let a of t){if(a.type===3){a.modifier===3?o+=G(a.value):o+=`(?:${G(a.value)})${zt(a.modifier)}`;continue}e&&e.push(a.name);let l=`[^${G(r.delimiter)}]+?`,c=a.value;if(a.type===1?c=l:a.type===0&&(c=xr),!a.prefix.length&&!a.suffix.length){a.modifier===3||a.modifier===1?o+=`(${c})${zt(a.modifier)}`:o+=`((?:${c})${zt(a.modifier)})`;continue}if(a.modifier===3||a.modifier===1){o+=`(?:${G(a.prefix)}(${c})${G(a.suffix)})`,o+=zt(a.modifier);continue}o+=`(?:${G(a.prefix)}`,o+=`((?:${c})(?:`,o+=G(a.suffix),o+=G(a.prefix),o+=`(?:${c}))*)${G(a.suffix)})`,a.modifier===0&&(o+="?")}let s=`[${G(r.endsWith)}]|$`,i=`[${G(r.delimiter)}]`;if(r.end)return r.strict||(o+=`${i}?`),r.endsWith.length?o+=`(?=${s})`:o+="$",new RegExp(o,Cr(r));r.strict||(o+=`(?:${i}(?=${s}))?`);let n=!1;if(t.length){let a=t[t.length-1];a.type===3&&a.modifier===3&&(n=r.delimiter.indexOf(a)>-1)}return n||(o+=`(?=${i}|${s})`),new RegExp(o,Cr(r))}C(Gr,"partsToRegexp");var $t={delimiter:"",prefixes:"",sensitive:!0,strict:!0},qi={delimiter:".",prefixes:"",sensitive:!0,strict:!0},Ki={delimiter:"/",prefixes:"/",sensitive:!0,strict:!0};function ds(t,e){return t.length?t[0]==="/"?!0:!e||t.length<2?!1:(t[0]=="\\"||t[0]=="{")&&t[1]=="/":!1}C(ds,"isAbsolutePathname");function Zr(t,e){return t.startsWith(e)?t.substring(e.length,t.length):t}C(Zr,"maybeStripPrefix");function ps(t,e){return t.endsWith(e)?t.substr(0,t.length-e.length):t}C(ps,"maybeStripSuffix");function Xr(t){return!t||t.length<2?!1:t[0]==="["||(t[0]==="\\"||t[0]==="{")&&t[1]==="["}C(Xr,"treatAsIPv6Hostname");var fs=["ftp","file","http","https","ws","wss"];function Jr(t){if(!t)return!0;for(let e of fs)if(t.test(e))return!0;return!1}C(Jr,"isSpecialScheme");function ms(t,e){if(t=Zr(t,"#"),e||t==="")return t;let r=new URL("https://example.com");return r.hash=t,r.hash?r.hash.substring(1,r.hash.length):""}C(ms,"canonicalizeHash");function gs(t,e){if(t=Zr(t,"?"),e||t==="")return t;let r=new URL("https://example.com");return r.search=t,r.search?r.search.substring(1,r.search.length):""}C(gs,"canonicalizeSearch");function bs(t,e){return e||t===""?t:Xr(t)?to(t):Qr(t)}C(bs,"canonicalizeHostname");function vs(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.password=t,r.password}C(vs,"canonicalizePassword");function ys(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.username=t,r.username}C(ys,"canonicalizeUsername");function ws(t,e,r){if(r||t==="")return t;if(e&&!fs.includes(e))return new URL(`${e}:${t}`).pathname;let o=t[0]=="/";return t=new URL(o?t:"/-"+t,"https://example.com").pathname,o||(t=t.substring(2,t.length)),t}C(ws,"canonicalizePathname");function _s(t,e,r){return Yr(e)===t&&(t=""),r||t===""?t:eo(t)}C(_s,"canonicalizePort");function $s(t,e){return t=ps(t,":"),e||t===""?t:Je(t)}C($s,"canonicalizeProtocol");function Yr(t){switch(t){case"ws":case"http":return"80";case"wws":case"https":return"443";case"ftp":return"21";default:return""}}C(Yr,"defaultPortForProtocol");function Je(t){if(t==="")return t;if(/^[-+.A-Za-z0-9]*$/.test(t))return t.toLowerCase();throw new TypeError(`Invalid protocol '${t}'.`)}C(Je,"protocolEncodeCallback");function xs(t){if(t==="")return t;let e=new URL("https://example.com");return e.username=t,e.username}C(xs,"usernameEncodeCallback");function Cs(t){if(t==="")return t;let e=new URL("https://example.com");return e.password=t,e.password}C(Cs,"passwordEncodeCallback");function Qr(t){if(t==="")return t;if(/[\t\n\r #%/:<>?@[\]^\\|]/g.test(t))throw new TypeError(`Invalid hostname '${t}'`);let e=new URL("https://example.com");return e.hostname=t,e.hostname}C(Qr,"hostnameEncodeCallback");function to(t){if(t==="")return t;if(/[^0-9a-fA-F[\]:]/g.test(t))throw new TypeError(`Invalid IPv6 hostname '${t}'`);return t.toLowerCase()}C(to,"ipv6HostnameEncodeCallback");function eo(t){if(t===""||/^[0-9]*$/.test(t)&&parseInt(t)<=65535)return t;throw new TypeError(`Invalid port '${t}'.`)}C(eo,"portEncodeCallback");function Es(t){if(t==="")return t;let e=new URL("https://example.com");return e.pathname=t[0]!=="/"?"/-"+t:t,t[0]!=="/"?e.pathname.substring(2,e.pathname.length):e.pathname}C(Es,"standardURLPathnameEncodeCallback");function Ss(t){return t===""?t:new URL(`data:${t}`).pathname}C(Ss,"pathURLPathnameEncodeCallback");function ks(t){if(t==="")return t;let e=new URL("https://example.com");return e.search=t,e.search.substring(1,e.search.length)}C(ks,"searchEncodeCallback");function As(t){if(t==="")return t;let e=new URL("https://example.com");return e.hash=t,e.hash.substring(1,e.hash.length)}C(As,"hashEncodeCallback");var Ps=class{#s;#r=[];#o={};#t=0;#e=1;#l=0;#a=0;#p=0;#f=0;#m=!1;constructor(e){this.#s=e}get result(){return this.#o}parse(){for(this.#r=qr(this.#s,!0);this.#t<this.#r.length;this.#t+=this.#e){if(this.#e=1,this.#r[this.#t].type==="END"){if(this.#a===0){this.#y(),this.#u()?this.#i(9,1):this.#h()?this.#i(8,1):this.#i(7,0);continue}else if(this.#a===2){this.#d(5);continue}this.#i(10,0);break}if(this.#p>0)if(this.#S())this.#p-=1;else continue;if(this.#E()){this.#p+=1;continue}switch(this.#a){case 0:this.#w()&&this.#d(1);break;case 1:if(this.#w()){this.#P();let e=7,r=1;this.#$()?(e=2,r=3):this.#m&&(e=2),this.#i(e,r)}break;case 2:this.#b()?this.#d(3):(this.#v()||this.#h()||this.#u())&&this.#d(5);break;case 3:this.#x()?this.#i(4,1):this.#b()&&this.#i(5,1);break;case 4:this.#b()&&this.#i(5,1);break;case 5:this.#k()?this.#f+=1:this.#A()&&(this.#f-=1),this.#C()&&!this.#f?this.#i(6,1):this.#v()?this.#i(7,0):this.#h()?this.#i(8,1):this.#u()&&this.#i(9,1);break;case 6:this.#v()?this.#i(7,0):this.#h()?this.#i(8,1):this.#u()&&this.#i(9,1);break;case 7:this.#h()?this.#i(8,1):this.#u()&&this.#i(9,1);break;case 8:this.#u()&&this.#i(9,1);break}}this.#o.hostname!==void 0&&this.#o.port===void 0&&(this.#o.port="")}#i(e,r){switch(this.#a){case 0:break;case 1:this.#o.protocol=this.#c();break;case 2:break;case 3:this.#o.username=this.#c();break;case 4:this.#o.password=this.#c();break;case 5:this.#o.hostname=this.#c();break;case 6:this.#o.port=this.#c();break;case 7:this.#o.pathname=this.#c();break;case 8:this.#o.search=this.#c();break;case 9:this.#o.hash=this.#c();break}this.#a!==0&&e!==10&&([1,2,3,4].includes(this.#a)&&[6,7,8,9].includes(e)&&(this.#o.hostname??=""),[1,2,3,4,5,6].includes(this.#a)&&[8,9].includes(e)&&(this.#o.pathname??=this.#m?"/":""),[1,2,3,4,5,6,7].includes(this.#a)&&e===9&&(this.#o.search??="")),this.#_(e,r)}#_(e,r){this.#a=e,this.#l=this.#t+r,this.#t+=r,this.#e=0}#y(){this.#t=this.#l,this.#e=0}#d(e){this.#y(),this.#a=e}#g(e){return e<0&&(e=this.#r.length-e),e<this.#r.length?this.#r[e]:this.#r[this.#r.length-1]}#n(e,r){let o=this.#g(e);return o.value===r&&(o.type==="CHAR"||o.type==="ESCAPED_CHAR"||o.type==="INVALID_CHAR")}#w(){return this.#n(this.#t,":")}#$(){return this.#n(this.#t+1,"/")&&this.#n(this.#t+2,"/")}#b(){return this.#n(this.#t,"@")}#x(){return this.#n(this.#t,":")}#C(){return this.#n(this.#t,":")}#v(){return this.#n(this.#t,"/")}#h(){if(this.#n(this.#t,"?"))return!0;if(this.#r[this.#t].value!=="?")return!1;let e=this.#g(this.#t-1);return e.type!=="NAME"&&e.type!=="REGEX"&&e.type!=="CLOSE"&&e.type!=="ASTERISK"}#u(){return this.#n(this.#t,"#")}#E(){return this.#r[this.#t].type=="OPEN"}#S(){return this.#r[this.#t].type=="CLOSE"}#k(){return this.#n(this.#t,"[")}#A(){return this.#n(this.#t,"]")}#c(){let e=this.#r[this.#t],r=this.#g(this.#l).index;return this.#s.substring(r,e.index)}#P(){let e={};Object.assign(e,$t),e.encodePart=Je;let r=hs(this.#c(),void 0,e);this.#m=Jr(r)}};C(Ps,"Parser");var hr=["protocol","username","password","hostname","port","pathname","search","hash"],_t="*";function Er(t,e){if(typeof t!="string")throw new TypeError("parameter 1 is not of type 'string'.");let r=new URL(t,e);return{protocol:r.protocol.substring(0,r.protocol.length-1),username:r.username,password:r.password,hostname:r.hostname,port:r.port,pathname:r.pathname,search:r.search!==""?r.search.substring(1,r.search.length):void 0,hash:r.hash!==""?r.hash.substring(1,r.hash.length):void 0}}C(Er,"extractValues");function lt(t,e){return e?Gt(t):t}C(lt,"processBaseURLString");function qt(t,e,r){let o;if(typeof e.baseURL=="string")try{o=new URL(e.baseURL),e.protocol===void 0&&(t.protocol=lt(o.protocol.substring(0,o.protocol.length-1),r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&(t.username=lt(o.username,r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&e.password===void 0&&(t.password=lt(o.password,r)),e.protocol===void 0&&e.hostname===void 0&&(t.hostname=lt(o.hostname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&(t.port=lt(o.port,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&(t.pathname=lt(o.pathname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&(t.search=lt(o.search.substring(1,o.search.length),r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&e.hash===void 0&&(t.hash=lt(o.hash.substring(1,o.hash.length),r))}catch{throw new TypeError(`invalid baseURL '${e.baseURL}'.`)}if(typeof e.protocol=="string"&&(t.protocol=$s(e.protocol,r)),typeof e.username=="string"&&(t.username=ys(e.username,r)),typeof e.password=="string"&&(t.password=vs(e.password,r)),typeof e.hostname=="string"&&(t.hostname=bs(e.hostname,r)),typeof e.port=="string"&&(t.port=_s(e.port,t.protocol,r)),typeof e.pathname=="string"){if(t.pathname=e.pathname,o&&!ds(t.pathname,r)){let s=o.pathname.lastIndexOf("/");s>=0&&(t.pathname=lt(o.pathname.substring(0,s+1),r)+t.pathname)}t.pathname=ws(t.pathname,t.protocol,r)}return typeof e.search=="string"&&(t.search=gs(e.search,r)),typeof e.hash=="string"&&(t.hash=ms(e.hash,r)),t}C(qt,"applyInit");function Gt(t){return t.replace(/([+*?:{}()\\])/g,"\\$1")}C(Gt,"escapePatternString");function Os(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}C(Os,"escapeRegexpString");function Ts(t,e){e.delimiter??="/#?",e.prefixes??="./",e.sensitive??=!1,e.strict??=!1,e.end??=!0,e.start??=!0,e.endsWith="";let r=".*",o=`[^${Os(e.delimiter)}]+?`,s=/[$_\u200C\u200D\p{ID_Continue}]/u,i="";for(let n=0;n<t.length;++n){let a=t[n];if(a.type===3){if(a.modifier===3){i+=Gt(a.value);continue}i+=`{${Gt(a.value)}}${zt(a.modifier)}`;continue}let l=a.hasCustomName(),c=!!a.suffix.length||!!a.prefix.length&&(a.prefix.length!==1||!e.prefixes.includes(a.prefix)),d=n>0?t[n-1]:null,u=n<t.length-1?t[n+1]:null;if(!c&&l&&a.type===1&&a.modifier===3&&u&&!u.prefix.length&&!u.suffix.length)if(u.type===3){let m=u.value.length>0?u.value[0]:"";c=s.test(m)}else c=!u.hasCustomName();if(!c&&!a.prefix.length&&d&&d.type===3){let m=d.value[d.value.length-1];c=e.prefixes.includes(m)}c&&(i+="{"),i+=Gt(a.prefix),l&&(i+=`:${a.name}`),a.type===2?i+=`(${a.value})`:a.type===1?l||(i+=`(${o})`):a.type===0&&(!l&&(!d||d.type===3||d.modifier!==3||c||a.prefix!=="")?i+="*":i+=`(${r})`),a.type===1&&l&&a.suffix.length&&s.test(a.suffix[0])&&(i+="\\"),i+=Gt(a.suffix),c&&(i+="}"),a.modifier!==3&&(i+=zt(a.modifier))}return i}C(Ts,"partsToPattern");var Rs=class{#s;#r={};#o={};#t={};#e={};#l=!1;constructor(t={},e,r){try{let o;if(typeof e=="string"?o=e:r=e,typeof t=="string"){let a=new Ps(t);if(a.parse(),t=a.result,o===void 0&&typeof t.protocol!="string")throw new TypeError("A base URL must be provided for a relative constructor string.");t.baseURL=o}else{if(!t||typeof t!="object")throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");if(o)throw new TypeError("parameter 1 is not of type 'string'.")}typeof r>"u"&&(r={ignoreCase:!1});let s={ignoreCase:r.ignoreCase===!0},i={pathname:_t,protocol:_t,username:_t,password:_t,hostname:_t,port:_t,search:_t,hash:_t};this.#s=qt(i,t,!0),Yr(this.#s.protocol)===this.#s.port&&(this.#s.port="");let n;for(n of hr){if(!(n in this.#s))continue;let a={},l=this.#s[n];switch(this.#o[n]=[],n){case"protocol":Object.assign(a,$t),a.encodePart=Je;break;case"username":Object.assign(a,$t),a.encodePart=xs;break;case"password":Object.assign(a,$t),a.encodePart=Cs;break;case"hostname":Object.assign(a,qi),Xr(l)?a.encodePart=to:a.encodePart=Qr;break;case"port":Object.assign(a,$t),a.encodePart=eo;break;case"pathname":Jr(this.#r.protocol)?(Object.assign(a,Ki,s),a.encodePart=Es):(Object.assign(a,$t,s),a.encodePart=Ss);break;case"search":Object.assign(a,$t,s),a.encodePart=ks;break;case"hash":Object.assign(a,$t,s),a.encodePart=As;break}try{this.#e[n]=Kr(l,a),this.#r[n]=Gr(this.#e[n],this.#o[n],a),this.#t[n]=Ts(this.#e[n],a),this.#l=this.#l||this.#e[n].some(c=>c.type===2)}catch{throw new TypeError(`invalid ${n} pattern '${this.#s[n]}'.`)}}}catch(o){throw new TypeError(`Failed to construct 'URLPattern': ${o.message}`)}}get[Symbol.toStringTag](){return"URLPattern"}test(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return!1;try{typeof t=="object"?r=qt(r,t,!1):r=qt(r,Er(t,e),!1)}catch{return!1}let o;for(o of hr)if(!this.#r[o].exec(r[o]))return!1;return!0}exec(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return;try{typeof t=="object"?r=qt(r,t,!1):r=qt(r,Er(t,e),!1)}catch{return null}let o={};e?o.inputs=[t,e]:o.inputs=[t];let s;for(s of hr){let i=this.#r[s].exec(r[s]);if(!i)return null;let n={};for(let[a,l]of this.#o[s].entries())if(typeof l=="string"||typeof l=="number"){let c=i[a+1];n[l]=c}o[s]={input:r[s]??"",groups:n}}return o}static compareComponent(t,e,r){let o=C((a,l)=>{for(let c of["type","modifier","prefix","value","suffix"]){if(a[c]<l[c])return-1;if(a[c]!==l[c])return 1}return 0},"comparePart"),s=new Jt(3,"","","","",3),i=new Jt(0,"","","","",3),n=C((a,l)=>{let c=0;for(;c<Math.min(a.length,l.length);++c){let d=o(a[c],l[c]);if(d)return d}return a.length===l.length?0:o(a[c]??s,l[c]??s)},"comparePartList");return!e.#t[t]&&!r.#t[t]?0:e.#t[t]&&!r.#t[t]?n(e.#e[t],[i]):!e.#t[t]&&r.#t[t]?n([i],r.#e[t]):n(e.#e[t],r.#e[t])}get protocol(){return this.#t.protocol}get username(){return this.#t.username}get password(){return this.#t.password}get hostname(){return this.#t.hostname}get port(){return this.#t.port}get pathname(){return this.#t.pathname}get search(){return this.#t.search}get hash(){return this.#t.hash}get hasRegExpGroups(){return this.#l}};C(Rs,"URLPattern");globalThis.URLPattern||(globalThis.URLPattern=Rs);const Sr=new Set,Zt=new Map;let Lt,ro="ltr",oo="en";const Ls=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Ls){const t=new MutationObserver(Ns);ro=document.documentElement.dir||"ltr",oo=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function zs(...t){t.map(e=>{const r=e.$code.toLowerCase();Zt.has(r)?Zt.set(r,Object.assign(Object.assign({},Zt.get(r)),e)):Zt.set(r,e),Lt||(Lt=e)}),Ns()}function Ns(){Ls&&(ro=document.documentElement.dir||"ltr",oo=document.documentElement.lang||navigator.language),[...Sr.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}let Gi=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Sr.add(this.host)}hostDisconnected(){Sr.delete(this.host)}dir(){return`${this.host.dir||ro}`.toLowerCase()}lang(){return`${this.host.lang||oo}`.toLowerCase()}getTranslationData(e){var r,o;const s=new Intl.Locale(e.replace(/_/g,"-")),i=s?.language.toLowerCase(),n=(o=(r=s?.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",a=Zt.get(`${i}-${n}`),l=Zt.get(i);return{locale:s,language:i,region:n,primary:a,secondary:l}}exists(e,r){var o;const{primary:s,secondary:i}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(s&&s[e]||i&&i[e]||r.includeFallback&&Lt&&Lt[e])}term(e,...r){const{primary:o,secondary:s}=this.getTranslationData(this.lang());let i;if(o&&o[e])i=o[e];else if(s&&s[e])i=s[e];else if(Lt&&Lt[e])i=Lt[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i=="function"?i(...r):i}date(e,r){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),r).format(e)}number(e,r){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),r).format(e)}relativeTime(e,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,r)}};var Ds={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};zs(Ds);var Zi=Ds,Vt=class extends Gi{};zs(Zi);var Is=Object.defineProperty,Xi=Object.defineProperties,Ji=Object.getOwnPropertyDescriptor,Yi=Object.getOwnPropertyDescriptors,Co=Object.getOwnPropertySymbols,Qi=Object.prototype.hasOwnProperty,tn=Object.prototype.propertyIsEnumerable,Ms=t=>{throw TypeError(t)},Eo=(t,e,r)=>e in t?Is(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Ut=(t,e)=>{for(var r in e||(e={}))Qi.call(e,r)&&Eo(t,r,e[r]);if(Co)for(var r of Co(e))tn.call(e,r)&&Eo(t,r,e[r]);return t},Ye=(t,e)=>Xi(t,Yi(e)),p=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ji(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Is(e,r,s),s},Bs=(t,e,r)=>e.has(t)||Ms("Cannot "+r),en=(t,e,r)=>(Bs(t,e,"read from private field"),e.get(t)),rn=(t,e,r)=>e.has(t)?Ms("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),on=(t,e,r,o)=>(Bs(t,e,"write to private field"),e.set(t,r),r);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ne=globalThis,so=Ne.ShadowRoot&&(Ne.ShadyCSS===void 0||Ne.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,io=Symbol(),So=new WeakMap;let Vs=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==io)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(so&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=So.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&So.set(r,e))}return e}toString(){return this.cssText}};const sn=t=>new Vs(typeof t=="string"?t:t+"",void 0,io),tt=(t,...e)=>{const r=t.length===1?t[0]:e.reduce(((o,s,i)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new Vs(r,t,io)},nn=(t,e)=>{if(so)t.adoptedStyleSheets=e.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of e){const o=document.createElement("style"),s=Ne.litNonce;s!==void 0&&o.setAttribute("nonce",s),o.textContent=r.cssText,t.appendChild(o)}},ko=so?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return sn(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:an,defineProperty:ln,getOwnPropertyDescriptor:cn,getOwnPropertyNames:un,getOwnPropertySymbols:hn,getPrototypeOf:dn}=Object,Qe=globalThis,Ao=Qe.trustedTypes,pn=Ao?Ao.emptyScript:"",fn=Qe.reactiveElementPolyfillSupport,be=(t,e)=>t,te={toAttribute(t,e){switch(e){case Boolean:t=t?pn:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},no=(t,e)=>!an(t,e),Po={attribute:!0,type:String,converter:te,reflect:!1,useDefault:!1,hasChanged:no};Symbol.metadata??=Symbol("metadata"),Qe.litPropertyMetadata??=new WeakMap;let Kt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Po){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(e,o,r);s!==void 0&&ln(this.prototype,e,s)}}static getPropertyDescriptor(e,r,o){const{get:s,set:i}=cn(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:s,set(n){const a=s?.call(this);i?.call(this,n),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Po}static _$Ei(){if(this.hasOwnProperty(be("elementProperties")))return;const e=dn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(be("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(be("properties"))){const r=this.properties,o=[...un(r),...hn(r)];for(const s of o)this.createProperty(s,r[s])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,s]of r)this.elementProperties.set(o,s)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const s=this._$Eu(r,o);s!==void 0&&this._$Eh.set(s,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const s of o)r.unshift(ko(s))}else e!==void 0&&r.push(ko(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nn(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){const o=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,o);if(s!==void 0&&o.reflect===!0){const i=(o.converter?.toAttribute!==void 0?o.converter:te).toAttribute(r,o.type);this._$Em=e,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,r){const o=this.constructor,s=o._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const i=o.getPropertyOptions(s),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:te;this._$Em=s;const a=n.fromAttribute(r,i.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,r,o){if(e!==void 0){const s=this.constructor,i=this[e];if(o??=s.getPropertyOptions(e),!((o.hasChanged??no)(i,r)||o.useDefault&&o.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:s,wrapped:i},n){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??r??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[s,i]of o){const{wrapped:n}=i,a=this[s];n!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,i,a)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),this._$EO?.forEach((o=>o.hostUpdate?.())),this.update(r)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(r)}willUpdate(e){}_$AE(e){this._$EO?.forEach((r=>r.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};Kt.elementStyles=[],Kt.shadowRootOptions={mode:"open"},Kt[be("elementProperties")]=new Map,Kt[be("finalized")]=new Map,fn?.({ReactiveElement:Kt}),(Qe.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ao=globalThis,Ve=ao.trustedTypes,Oo=Ve?Ve.createPolicy("lit-html",{createHTML:t=>t}):void 0,Us="$lit$",xt=`lit$${Math.random().toFixed(9).slice(2)}$`,Fs="?"+xt,mn=`<${Fs}>`,Mt=document,we=()=>Mt.createComment(""),_e=t=>t===null||typeof t!="object"&&typeof t!="function",lo=Array.isArray,gn=t=>lo(t)||typeof t?.[Symbol.iterator]=="function",dr=`[ 	
\f\r]`,he=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,To=/-->/g,Ro=/>/g,Tt=RegExp(`>|${dr}(?:([^\\s"'>=/]+)(${dr}*=${dr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Lo=/'/g,zo=/"/g,js=/^(?:script|style|textarea|title)$/i,bn=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),k=bn(1),X=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),No=new WeakMap,Nt=Mt.createTreeWalker(Mt,129);function Ws(t,e){if(!lo(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Oo!==void 0?Oo.createHTML(e):e}const vn=(t,e)=>{const r=t.length-1,o=[];let s,i=e===2?"<svg>":e===3?"<math>":"",n=he;for(let a=0;a<r;a++){const l=t[a];let c,d,u=-1,m=0;for(;m<l.length&&(n.lastIndex=m,d=n.exec(l),d!==null);)m=n.lastIndex,n===he?d[1]==="!--"?n=To:d[1]!==void 0?n=Ro:d[2]!==void 0?(js.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=Tt):d[3]!==void 0&&(n=Tt):n===Tt?d[0]===">"?(n=s??he,u=-1):d[1]===void 0?u=-2:(u=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?Tt:d[3]==='"'?zo:Lo):n===zo||n===Lo?n=Tt:n===To||n===Ro?n=he:(n=Tt,s=void 0);const h=n===Tt&&t[a+1].startsWith("/>")?" ":"";i+=n===he?l+mn:u>=0?(o.push(c),l.slice(0,u)+Us+l.slice(u)+xt+h):l+xt+(u===-2?a:h)}return[Ws(t,i+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class $e{constructor({strings:e,_$litType$:r},o){let s;this.parts=[];let i=0,n=0;const a=e.length-1,l=this.parts,[c,d]=vn(e,r);if(this.el=$e.createElement(c,o),Nt.currentNode=this.el.content,r===2||r===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=Nt.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Us)){const m=d[n++],h=s.getAttribute(u).split(xt),g=/([.?@])?(.*)/.exec(m);l.push({type:1,index:i,name:g[2],strings:h,ctor:g[1]==="."?wn:g[1]==="?"?_n:g[1]==="@"?$n:tr}),s.removeAttribute(u)}else u.startsWith(xt)&&(l.push({type:6,index:i}),s.removeAttribute(u));if(js.test(s.tagName)){const u=s.textContent.split(xt),m=u.length-1;if(m>0){s.textContent=Ve?Ve.emptyScript:"";for(let h=0;h<m;h++)s.append(u[h],we()),Nt.nextNode(),l.push({type:2,index:++i});s.append(u[m],we())}}}else if(s.nodeType===8)if(s.data===Fs)l.push({type:2,index:i});else{let u=-1;for(;(u=s.data.indexOf(xt,u+1))!==-1;)l.push({type:7,index:i}),u+=xt.length-1}i++}}static createElement(e,r){const o=Mt.createElement("template");return o.innerHTML=e,o}}function ee(t,e,r=t,o){if(e===X)return e;let s=o!==void 0?r._$Co?.[o]:r._$Cl;const i=_e(e)?void 0:e._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(t),s._$AT(t,r,o)),o!==void 0?(r._$Co??=[])[o]=s:r._$Cl=s),s!==void 0&&(e=ee(t,s._$AS(t,e.values),s,o)),e}let yn=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,s=(e?.creationScope??Mt).importNode(r,!0);Nt.currentNode=s;let i=Nt.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new ae(i,i.nextSibling,this,e):l.type===1?c=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(c=new xn(i,this,e)),this._$AV.push(c),l=o[++a]}n!==l?.index&&(i=Nt.nextNode(),n++)}return Nt.currentNode=Mt,s}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}};class ae{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,r,o,s){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=ee(this,e,r),_e(e)?e===z||e==null||e===""?(this._$AH!==z&&this._$AR(),this._$AH=z):e!==this._$AH&&e!==X&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):gn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==z&&_e(this._$AH)?this._$AA.nextSibling.data=e:this.T(Mt.createTextNode(e)),this._$AH=e}$(e){const{values:r,_$litType$:o}=e,s=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=$e.createElement(Ws(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===s)this._$AH.p(r);else{const i=new yn(s,this),n=i.u(this.options);i.p(r),this.T(n),this._$AH=i}}_$AC(e){let r=No.get(e.strings);return r===void 0&&No.set(e.strings,r=new $e(e)),r}k(e){lo(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,s=0;for(const i of e)s===r.length?r.push(o=new ae(this.O(we()),this.O(we()),this,this.options)):o=r[s],o._$AI(i),s++;s<r.length&&(this._$AR(o&&o._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);e!==this._$AB;){const o=e.nextSibling;e.remove(),e=o}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class tr{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,s,i){this.type=1,this._$AH=z,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=z}_$AI(e,r=this,o,s){const i=this.strings;let n=!1;if(i===void 0)e=ee(this,e,r,0),n=!_e(e)||e!==this._$AH&&e!==X,n&&(this._$AH=e);else{const a=e;let l,c;for(e=i[0],l=0;l<i.length-1;l++)c=ee(this,a[o+l],r,l),c===X&&(c=this._$AH[l]),n||=!_e(c)||c!==this._$AH[l],c===z?e=z:e!==z&&(e+=(c??"")+i[l+1]),this._$AH[l]=c}n&&!s&&this.j(e)}j(e){e===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class wn extends tr{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===z?void 0:e}}class _n extends tr{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==z)}}class $n extends tr{constructor(e,r,o,s,i){super(e,r,o,s,i),this.type=5}_$AI(e,r=this){if((e=ee(this,e,r,0)??z)===X)return;const o=this._$AH,s=e===z&&o!==z||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==z&&(o===z||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class xn{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ee(this,e)}}const Cn={I:ae},En=ao.litHtmlPolyfillSupport;En?.($e,ae),(ao.litHtmlVersions??=[]).push("3.3.1");const Hs=(t,e,r)=>{const o=r?.renderBefore??e;let s=o._$litPart$;if(s===void 0){const i=r?.renderBefore??null;o._$litPart$=s=new ae(e.insertBefore(we(),i),i,void 0,r??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const co=globalThis;let Yt=class extends Kt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Hs(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return X}};Yt._$litElement$=!0,Yt.finalized=!0,co.litElementHydrateSupport?.({LitElement:Yt});const Sn=co.litElementPolyfillSupport;Sn?.({LitElement:Yt});(co.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ft=t=>(e,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kn={attribute:!0,type:String,converter:te,reflect:!1,hasChanged:no},An=(t=kn,e,r)=>{const{kind:o,metadata:s}=r;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),o==="accessor"){const{name:n}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t)}}throw Error("Unsupported decorator location: "+o)};function f(t){return(e,r)=>typeof r=="object"?An(t,e,r):((o,s,i)=>{const n=s.hasOwnProperty(i);return s.constructor.createProperty(i,o),n?Object.getOwnPropertyDescriptor(s,i):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function At(t){return f({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pn=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function et(t,e){return(r,o,s)=>{const i=n=>n.renderRoot?.querySelector(t)??null;return Pn(r,o,{get(){return i(this)}})}}var De,q=class extends Yt{constructor(){super(),rn(this,De,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){const r=new CustomEvent(t,Ut({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(r),r}static define(t,e=this,r={}){const o=customElements.get(t);if(!o){try{customElements.define(t,e,r)}catch{customElements.define(t,class extends e{},r)}return}let s=" (unknown version)",i=s;"version"in e&&e.version&&(s=" v"+e.version),"version"in o&&o.version&&(i=" v"+o.version),!(s&&i&&s===i)&&console.warn(`Attempted to register <${t}>${s}, but <${t}>${i} has already been registered.`)}attributeChangedCallback(t,e,r){en(this,De)||(this.constructor.elementProperties.forEach((o,s)=>{o.reflect&&this[s]!=null&&this.initialReflectedProperties.set(s,this[s])}),on(this,De,!0)),super.attributeChangedCallback(t,e,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,r)=>{t.has(r)&&this[r]==null&&(this[r]=e)})}};De=new WeakMap;q.version="2.20.1";q.dependencies={};p([f()],q.prototype,"dir",2);p([f()],q.prototype,"lang",2);var Y=class extends q{constructor(){super(...arguments),this.localize=new Vt(this),this.date=new Date,this.hourFormat="auto"}render(){const t=new Date(this.date),e=this.hourFormat==="auto"?void 0:this.hourFormat==="12";if(!isNaN(t.getMilliseconds()))return k`
      <time datetime=${t.toISOString()}>
        ${this.localize.date(t,{weekday:this.weekday,era:this.era,year:this.year,month:this.month,day:this.day,hour:this.hour,minute:this.minute,second:this.second,timeZoneName:this.timeZoneName,timeZone:this.timeZone,hour12:e})}
      </time>
    `}};p([f()],Y.prototype,"date",2);p([f()],Y.prototype,"weekday",2);p([f()],Y.prototype,"era",2);p([f()],Y.prototype,"year",2);p([f()],Y.prototype,"month",2);p([f()],Y.prototype,"day",2);p([f()],Y.prototype,"hour",2);p([f()],Y.prototype,"minute",2);p([f()],Y.prototype,"second",2);p([f({attribute:"time-zone-name"})],Y.prototype,"timeZoneName",2);p([f({attribute:"time-zone"})],Y.prototype,"timeZone",2);p([f({attribute:"hour-format"})],Y.prototype,"hourFormat",2);Y.define("sl-format-date");var On=tt`
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
`;function bt(t,e){const r=Ut({waitUntilFirstUpdate:!1},e);return(o,s)=>{const{update:i}=o,n=Array.isArray(t)?t:[t];o.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const d=a.get(c),u=this[c];d!==u&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[s](d,u)}}),i.call(this,a)}}}var dt=tt`
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
`,er=class extends q{constructor(){super(...arguments),this.vertical=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","separator")}handleVerticalChange(){this.setAttribute("aria-orientation",this.vertical?"vertical":"horizontal")}};er.styles=[dt,On];p([f({type:Boolean,reflect:!0})],er.prototype,"vertical",2);p([bt("vertical")],er.prototype,"handleVerticalChange",1);er.define("sl-divider");var Tn=tt`
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
`,qs=class extends q{constructor(){super(...arguments),this.localize=new Vt(this)}render(){return k`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};qs.styles=[dt,Tn];var de=new WeakMap,pe=new WeakMap,fe=new WeakMap,pr=new WeakSet,Oe=new WeakMap,Ks=class{constructor(t,e){this.handleFormData=r=>{const o=this.options.disabled(this.host),s=this.options.name(this.host),i=this.options.value(this.host),n=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!o&&!n&&typeof s=="string"&&s.length>0&&typeof i<"u"&&(Array.isArray(i)?i.forEach(a=>{r.formData.append(s,a.toString())}):r.formData.append(s,i.toString()))},this.handleFormSubmit=r=>{var o;const s=this.options.disabled(this.host),i=this.options.reportValidity;this.form&&!this.form.noValidate&&((o=de.get(this.form))==null||o.forEach(n=>{this.setUserInteracted(n,!0)})),this.form&&!this.form.noValidate&&!s&&!i(this.host)&&(r.preventDefault(),r.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),Oe.set(this.host,[])},this.handleInteraction=r=>{const o=Oe.get(this.host);o.includes(r.type)||o.push(r.type),o.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.checkValidity=="function"&&!o.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.reportValidity=="function"&&!o.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=Ut({form:r=>{const o=r.form;if(o){const i=r.getRootNode().querySelector(`#${o}`);if(i)return i}return r.closest("form")},name:r=>r.name,value:r=>r.value,defaultValue:r=>r.defaultValue,disabled:r=>{var o;return(o=r.disabled)!=null?o:!1},reportValidity:r=>typeof r.reportValidity=="function"?r.reportValidity():!0,checkValidity:r=>typeof r.checkValidity=="function"?r.checkValidity():!0,setValue:(r,o)=>r.value=o,assumeInteractionOn:["sl-input"]},e)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),Oe.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),Oe.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,de.has(this.form)?de.get(this.form).add(this.host):de.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),pe.has(this.form)||(pe.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),fe.has(this.form)||(fe.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const t=de.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),pe.has(this.form)&&(this.form.reportValidity=pe.get(this.form),pe.delete(this.form)),fe.has(this.form)&&(this.form.checkValidity=fe.get(this.form),fe.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?pr.add(t):pr.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const r=document.createElement("button");r.type=t,r.style.position="absolute",r.style.width="0",r.style.height="0",r.style.clipPath="inset(50%)",r.style.overflow="hidden",r.style.whiteSpace="nowrap",e&&(r.name=e.name,r.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(o=>{e.hasAttribute(o)&&r.setAttribute(o,e.getAttribute(o))})),this.form.append(r),r.click(),r.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,r=!!pr.has(e),o=!!e.required;e.toggleAttribute("data-required",o),e.toggleAttribute("data-optional",!o),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&r),e.toggleAttribute("data-user-valid",t&&r)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},uo=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(Ye(Ut({},uo),{valid:!1,valueMissing:!0}));Object.freeze(Ye(Ut({},uo),{valid:!1,customError:!0}));var Rn=tt`
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
`,Gs=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=r=>{const o=r.target;(this.slotNames.includes("[default]")&&!o.name||o.name&&this.slotNames.includes(o.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}},kr="";function Do(t){kr=t}function Ln(t=""){if(!kr){const e=[...document.getElementsByTagName("script")],r=e.find(o=>o.hasAttribute("data-shoelace"));if(r)Do(r.getAttribute("data-shoelace"));else{const o=e.find(i=>/shoelace(\.min)?\.js($|\?)/.test(i.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(i.src));let s="";o&&(s=o.getAttribute("src")),Do(s.split("/").slice(0,-1).join("/"))}}return kr.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var zn={name:"default",resolver:t=>Ln(`assets/icons/${t}.svg`)},Nn=zn,Io={caret:`
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
  `},Dn={name:"system",resolver:t=>t in Io?`data:image/svg+xml,${encodeURIComponent(Io[t])}`:""},In=Dn,Mn=[Nn,In],Ar=[];function Bn(t){Ar.push(t)}function Vn(t){Ar=Ar.filter(e=>e!==t)}function Mo(t){return Mn.find(e=>e.name===t)}var Un=tt`
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
 */const{I:Fn}=Cn,jn=(t,e)=>t?._$litType$!==void 0,Zs=t=>t.strings===void 0,Bo=()=>document.createComment(""),me=(t,e,r)=>{const o=t._$AA.parentNode,s=e===void 0?t._$AB:e._$AA;if(r===void 0){const i=o.insertBefore(Bo(),s),n=o.insertBefore(Bo(),s);r=new Fn(i,n,t,t.options)}else{const i=r._$AB.nextSibling,n=r._$AM,a=n!==t;if(a){let l;r._$AQ?.(t),r._$AM=t,r._$AP!==void 0&&(l=t._$AU)!==n._$AU&&r._$AP(l)}if(i!==s||a){let l=r._$AA;for(;l!==i;){const c=l.nextSibling;o.insertBefore(l,s),l=c}}}return r},Rt=(t,e,r=t)=>(t._$AI(e,r),t),Wn={},Xs=(t,e=Wn)=>t._$AH=e,Hn=t=>t._$AH,fr=t=>{t._$AR(),t._$AA.remove()};var ge=Symbol(),Te=Symbol(),mr,gr=new Map,nt=class extends q{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var r;let o;if(e?.spriteSheet)return this.svg=k`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(o=await fetch(t,{mode:"cors"}),!o.ok)return o.status===410?ge:Te}catch{return Te}try{const s=document.createElement("div");s.innerHTML=await o.text();const i=s.firstElementChild;if(((r=i?.tagName)==null?void 0:r.toLowerCase())!=="svg")return ge;mr||(mr=new DOMParser);const a=mr.parseFromString(i.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):ge}catch{return ge}}connectedCallback(){super.connectedCallback(),Bn(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Vn(this)}getIconSource(){const t=Mo(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const{url:e,fromLibrary:r}=this.getIconSource(),o=r?Mo(this.library):void 0;if(!e){this.svg=null;return}let s=gr.get(e);if(s||(s=this.resolveIcon(e,o),gr.set(e,s)),!this.initialRender)return;const i=await s;if(i===Te&&gr.delete(e),e===this.getIconSource().url){if(jn(i)){if(this.svg=i,o){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&n&&o.mutator(n)}return}switch(i){case Te:case ge:this.svg=null,this.emit("sl-error");break;default:this.svg=i.cloneNode(!0),(t=o?.mutator)==null||t.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};nt.styles=[dt,Un];p([At()],nt.prototype,"svg",2);p([f({reflect:!0})],nt.prototype,"name",2);p([f()],nt.prototype,"src",2);p([f()],nt.prototype,"label",2);p([f({reflect:!0})],nt.prototype,"library",2);p([bt("label")],nt.prototype,"handleLabelChange",1);p([bt(["name","src","library"])],nt.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ct={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},Ee=t=>(...e)=>({_$litDirective$:t,values:e});let Se=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=Ee(class extends Se{constructor(t){if(super(t),t.type!==ct.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((o=>o!==""))));for(const o in e)e[o]&&!this.nt?.has(o)&&this.st.add(o);return this.render(e)}const r=t.element.classList;for(const o of this.st)o in e||(r.remove(o),this.st.delete(o));for(const o in e){const s=!!e[o];s===this.st.has(o)||this.nt?.has(o)||(s?(r.add(o),this.st.add(o)):(r.remove(o),this.st.delete(o)))}return X}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Js=Symbol.for(""),qn=t=>{if(t?.r===Js)return t?._$litStatic$},Ue=(t,...e)=>({_$litStatic$:e.reduce(((r,o,s)=>r+(i=>{if(i._$litStatic$!==void 0)return i._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${i}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[s+1]),t[0]),r:Js}),Vo=new Map,Kn=t=>(e,...r)=>{const o=r.length;let s,i;const n=[],a=[];let l,c=0,d=!1;for(;c<o;){for(l=e[c];c<o&&(i=r[c],(s=qn(i))!==void 0);)l+=s+e[++c],d=!0;c!==o&&a.push(i),n.push(l),c++}if(c===o&&n.push(e[o]),d){const u=n.join("$$lit$$");(e=Vo.get(u))===void 0&&(n.raw=n,Vo.set(u,e=n)),r=a}return t(e,...r)},Ie=Kn(k);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=t=>t??z;var O=class extends q{constructor(){super(...arguments),this.formControlController=new Ks(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new Gs(this,"[default]","prefix","suffix"),this.localize=new Vt(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:uo}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){const t=this.isLink(),e=t?Ue`a`:Ue`button`;return Ie`
      <${e}
        part="base"
        class=${gt({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
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
        ${this.caret?Ie` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?Ie`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${e}>
    `}};O.styles=[dt,Rn];O.dependencies={"sl-icon":nt,"sl-spinner":qs};p([et(".button")],O.prototype,"button",2);p([At()],O.prototype,"hasFocus",2);p([At()],O.prototype,"invalid",2);p([f()],O.prototype,"title",2);p([f({reflect:!0})],O.prototype,"variant",2);p([f({reflect:!0})],O.prototype,"size",2);p([f({type:Boolean,reflect:!0})],O.prototype,"caret",2);p([f({type:Boolean,reflect:!0})],O.prototype,"disabled",2);p([f({type:Boolean,reflect:!0})],O.prototype,"loading",2);p([f({type:Boolean,reflect:!0})],O.prototype,"outline",2);p([f({type:Boolean,reflect:!0})],O.prototype,"pill",2);p([f({type:Boolean,reflect:!0})],O.prototype,"circle",2);p([f()],O.prototype,"type",2);p([f()],O.prototype,"name",2);p([f()],O.prototype,"value",2);p([f()],O.prototype,"href",2);p([f()],O.prototype,"target",2);p([f()],O.prototype,"rel",2);p([f()],O.prototype,"download",2);p([f()],O.prototype,"form",2);p([f({attribute:"formaction"})],O.prototype,"formAction",2);p([f({attribute:"formenctype"})],O.prototype,"formEnctype",2);p([f({attribute:"formmethod"})],O.prototype,"formMethod",2);p([f({attribute:"formnovalidate",type:Boolean})],O.prototype,"formNoValidate",2);p([f({attribute:"formtarget"})],O.prototype,"formTarget",2);p([bt("disabled",{waitUntilFirstUpdate:!0})],O.prototype,"handleDisabledChange",1);O.define("sl-button");var Gn=tt`
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
`,Zn=tt`
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
`,Q=class extends q{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?Ue`a`:Ue`button`;return Ie`
      <${e}
        part="base"
        class=${gt({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
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
    `}};Q.styles=[dt,Zn];Q.dependencies={"sl-icon":nt};p([et(".icon-button")],Q.prototype,"button",2);p([At()],Q.prototype,"hasFocus",2);p([f()],Q.prototype,"name",2);p([f()],Q.prototype,"library",2);p([f()],Q.prototype,"src",2);p([f()],Q.prototype,"href",2);p([f()],Q.prototype,"target",2);p([f()],Q.prototype,"download",2);p([f()],Q.prototype,"label",2);p([f({type:Boolean,reflect:!0})],Q.prototype,"disabled",2);var jt=class extends q{constructor(){super(...arguments),this.localize=new Vt(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return k`
      <span
        part="base"
        class=${gt({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?k`
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
    `}};jt.styles=[dt,Gn];jt.dependencies={"sl-icon-button":Q};p([f({reflect:!0})],jt.prototype,"variant",2);p([f({reflect:!0})],jt.prototype,"size",2);p([f({type:Boolean,reflect:!0})],jt.prototype,"pill",2);p([f({type:Boolean})],jt.prototype,"removable",2);jt.define("sl-tag");var Xn=tt`
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
`,Jn=(t="value")=>(e,r)=>{const o=e.constructor,s=o.prototype.attributeChangedCallback;o.prototype.attributeChangedCallback=function(i,n,a){var l;const c=o.getPropertyOptions(t),d=typeof c.attribute=="string"?c.attribute:t;if(i===d){const u=c.converter||te,h=(typeof u=="function"?u:(l=u?.fromAttribute)!=null?l:te.fromAttribute)(a,c.type);this[t]!==h&&(this[r]=h)}s.call(this,i,n,a)}},Yn=tt`
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
 */const Qn=Ee(class extends Se{constructor(t){if(super(t),t.type!==ct.PROPERTY&&t.type!==ct.ATTRIBUTE&&t.type!==ct.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Zs(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===X||e===z)return e;const r=t.element,o=t.name;if(t.type===ct.PROPERTY){if(e===r[o])return X}else if(t.type===ct.BOOLEAN_ATTRIBUTE){if(!!e===r.hasAttribute(o))return X}else if(t.type===ct.ATTRIBUTE&&r.getAttribute(o)===e+"")return X;return Xs(t),e}});var W=class extends q{constructor(){super(...arguments),this.formControlController=new Ks(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new Gs(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleClick(){this.checked=!this.checked,this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleKeyDown(t){t.key==="ArrowLeft"&&(t.preventDefault(),this.checked=!1,this.emit("sl-change"),this.emit("sl-input")),t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!0,this.emit("sl-change"),this.emit("sl-input"))}handleCheckedChange(){this.input.checked=this.checked,this.formControlController.updateValidity()}handleDisabledChange(){this.formControlController.setValidity(!0)}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){const t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return k`
      <div
        class=${gt({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-help-text":e})}
      >
        <label
          part="base"
          class=${gt({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus,"switch--small":this.size==="small","switch--medium":this.size==="medium","switch--large":this.size==="large"})}
        >
          <input
            class="switch__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${I(this.value)}
            .checked=${Qn(this.checked)}
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
    `}};W.styles=[dt,Yn,Xn];p([et('input[type="checkbox"]')],W.prototype,"input",2);p([At()],W.prototype,"hasFocus",2);p([f()],W.prototype,"title",2);p([f()],W.prototype,"name",2);p([f()],W.prototype,"value",2);p([f({reflect:!0})],W.prototype,"size",2);p([f({type:Boolean,reflect:!0})],W.prototype,"disabled",2);p([f({type:Boolean,reflect:!0})],W.prototype,"checked",2);p([Jn("checked")],W.prototype,"defaultChecked",2);p([f({reflect:!0})],W.prototype,"form",2);p([f({type:Boolean,reflect:!0})],W.prototype,"required",2);p([f({attribute:"help-text"})],W.prototype,"helpText",2);p([bt("checked",{waitUntilFirstUpdate:!0})],W.prototype,"handleCheckedChange",1);p([bt("disabled",{waitUntilFirstUpdate:!0})],W.prototype,"handleDisabledChange",1);W.define("sl-switch");var ta=tt`
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
`,ea=tt`
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
`;const Ct=Math.min,Z=Math.max,Fe=Math.round,Re=Math.floor,ut=t=>({x:t,y:t}),ra={left:"right",right:"left",bottom:"top",top:"bottom"},oa={start:"end",end:"start"};function Pr(t,e,r){return Z(t,Ct(e,r))}function le(t,e){return typeof t=="function"?t(e):t}function Et(t){return t.split("-")[0]}function ce(t){return t.split("-")[1]}function Ys(t){return t==="x"?"y":"x"}function ho(t){return t==="y"?"height":"width"}const sa=new Set(["top","bottom"]);function mt(t){return sa.has(Et(t))?"y":"x"}function po(t){return Ys(mt(t))}function ia(t,e,r){r===void 0&&(r=!1);const o=ce(t),s=po(t),i=ho(s);let n=s==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[i]>e.floating[i]&&(n=je(n)),[n,je(n)]}function na(t){const e=je(t);return[Or(t),e,Or(e)]}function Or(t){return t.replace(/start|end/g,e=>oa[e])}const Uo=["left","right"],Fo=["right","left"],aa=["top","bottom"],la=["bottom","top"];function ca(t,e,r){switch(t){case"top":case"bottom":return r?e?Fo:Uo:e?Uo:Fo;case"left":case"right":return e?aa:la;default:return[]}}function ua(t,e,r,o){const s=ce(t);let i=ca(Et(t),r==="start",o);return s&&(i=i.map(n=>n+"-"+s),e&&(i=i.concat(i.map(Or)))),i}function je(t){return t.replace(/left|right|bottom|top/g,e=>ra[e])}function ha(t){return{top:0,right:0,bottom:0,left:0,...t}}function Qs(t){return typeof t!="number"?ha(t):{top:t,right:t,bottom:t,left:t}}function We(t){const{x:e,y:r,width:o,height:s}=t;return{width:o,height:s,top:r,left:e,right:e+o,bottom:r+s,x:e,y:r}}function jo(t,e,r){let{reference:o,floating:s}=t;const i=mt(e),n=po(e),a=ho(n),l=Et(e),c=i==="y",d=o.x+o.width/2-s.width/2,u=o.y+o.height/2-s.height/2,m=o[a]/2-s[a]/2;let h;switch(l){case"top":h={x:d,y:o.y-s.height};break;case"bottom":h={x:d,y:o.y+o.height};break;case"right":h={x:o.x+o.width,y:u};break;case"left":h={x:o.x-s.width,y:u};break;default:h={x:o.x,y:o.y}}switch(ce(e)){case"start":h[n]-=m*(r&&c?-1:1);break;case"end":h[n]+=m*(r&&c?-1:1);break}return h}const da=async(t,e,r)=>{const{placement:o="bottom",strategy:s="absolute",middleware:i=[],platform:n}=r,a=i.filter(Boolean),l=await(n.isRTL==null?void 0:n.isRTL(e));let c=await n.getElementRects({reference:t,floating:e,strategy:s}),{x:d,y:u}=jo(c,o,l),m=o,h={},g=0;for(let b=0;b<a.length;b++){const{name:E,fn:$}=a[b],{x,y:v,data:_,reset:y}=await $({x:d,y:u,initialPlacement:o,placement:m,strategy:s,middlewareData:h,rects:c,platform:n,elements:{reference:t,floating:e}});d=x??d,u=v??u,h={...h,[E]:{...h[E],..._}},y&&g<=50&&(g++,typeof y=="object"&&(y.placement&&(m=y.placement),y.rects&&(c=y.rects===!0?await n.getElementRects({reference:t,floating:e,strategy:s}):y.rects),{x:d,y:u}=jo(c,m,l)),b=-1)}return{x:d,y:u,placement:m,strategy:s,middlewareData:h}};async function fo(t,e){var r;e===void 0&&(e={});const{x:o,y:s,platform:i,rects:n,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:u="floating",altBoundary:m=!1,padding:h=0}=le(e,t),g=Qs(h),E=a[m?u==="floating"?"reference":"floating":u],$=We(await i.getClippingRect({element:(r=await(i.isElement==null?void 0:i.isElement(E)))==null||r?E:E.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(a.floating)),boundary:c,rootBoundary:d,strategy:l})),x=u==="floating"?{x:o,y:s,width:n.floating.width,height:n.floating.height}:n.reference,v=await(i.getOffsetParent==null?void 0:i.getOffsetParent(a.floating)),_=await(i.isElement==null?void 0:i.isElement(v))?await(i.getScale==null?void 0:i.getScale(v))||{x:1,y:1}:{x:1,y:1},y=We(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:x,offsetParent:v,strategy:l}):x);return{top:($.top-y.top+g.top)/_.y,bottom:(y.bottom-$.bottom+g.bottom)/_.y,left:($.left-y.left+g.left)/_.x,right:(y.right-$.right+g.right)/_.x}}const pa=t=>({name:"arrow",options:t,async fn(e){const{x:r,y:o,placement:s,rects:i,platform:n,elements:a,middlewareData:l}=e,{element:c,padding:d=0}=le(t,e)||{};if(c==null)return{};const u=Qs(d),m={x:r,y:o},h=po(s),g=ho(h),b=await n.getDimensions(c),E=h==="y",$=E?"top":"left",x=E?"bottom":"right",v=E?"clientHeight":"clientWidth",_=i.reference[g]+i.reference[h]-m[h]-i.floating[g],y=m[h]-i.reference[h],A=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let P=A?A[v]:0;(!P||!await(n.isElement==null?void 0:n.isElement(A)))&&(P=a.floating[v]||i.floating[g]);const R=_/2-y/2,B=P/2-b[g]/2-1,N=Ct(u[$],B),vt=Ct(u[x],B),at=N,yt=P-b[g]-vt,H=P/2-b[g]/2+R,Ot=Pr(at,H,yt),ft=!l.arrow&&ce(s)!=null&&H!==Ot&&i.reference[g]/2-(H<at?N:vt)-b[g]/2<0,rt=ft?H<at?H-at:H-yt:0;return{[h]:m[h]+rt,data:{[h]:Ot,centerOffset:H-Ot-rt,...ft&&{alignmentOffset:rt}},reset:ft}}}),fa=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var r,o;const{placement:s,middlewareData:i,rects:n,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:d=!0,crossAxis:u=!0,fallbackPlacements:m,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:b=!0,...E}=le(t,e);if((r=i.arrow)!=null&&r.alignmentOffset)return{};const $=Et(s),x=mt(a),v=Et(a)===a,_=await(l.isRTL==null?void 0:l.isRTL(c.floating)),y=m||(v||!b?[je(a)]:na(a)),A=g!=="none";!m&&A&&y.push(...ua(a,b,g,_));const P=[a,...y],R=await fo(e,E),B=[];let N=((o=i.flip)==null?void 0:o.overflows)||[];if(d&&B.push(R[$]),u){const H=ia(s,n,_);B.push(R[H[0]],R[H[1]])}if(N=[...N,{placement:s,overflows:B}],!B.every(H=>H<=0)){var vt,at;const H=(((vt=i.flip)==null?void 0:vt.index)||0)+1,Ot=P[H];if(Ot&&(!(u==="alignment"?x!==mt(Ot):!1)||N.every(ot=>mt(ot.placement)===x?ot.overflows[0]>0:!0)))return{data:{index:H,overflows:N},reset:{placement:Ot}};let ft=(at=N.filter(rt=>rt.overflows[0]<=0).sort((rt,ot)=>rt.overflows[1]-ot.overflows[1])[0])==null?void 0:at.placement;if(!ft)switch(h){case"bestFit":{var yt;const rt=(yt=N.filter(ot=>{if(A){const wt=mt(ot.placement);return wt===x||wt==="y"}return!0}).map(ot=>[ot.placement,ot.overflows.filter(wt=>wt>0).reduce((wt,Fi)=>wt+Fi,0)]).sort((ot,wt)=>ot[1]-wt[1])[0])==null?void 0:yt[0];rt&&(ft=rt);break}case"initialPlacement":ft=a;break}if(s!==ft)return{reset:{placement:ft}}}return{}}}},ma=new Set(["left","top"]);async function ga(t,e){const{placement:r,platform:o,elements:s}=t,i=await(o.isRTL==null?void 0:o.isRTL(s.floating)),n=Et(r),a=ce(r),l=mt(r)==="y",c=ma.has(n)?-1:1,d=i&&l?-1:1,u=le(e,t);let{mainAxis:m,crossAxis:h,alignmentAxis:g}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:u.mainAxis||0,crossAxis:u.crossAxis||0,alignmentAxis:u.alignmentAxis};return a&&typeof g=="number"&&(h=a==="end"?g*-1:g),l?{x:h*d,y:m*c}:{x:m*c,y:h*d}}const ba=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var r,o;const{x:s,y:i,placement:n,middlewareData:a}=e,l=await ga(e,t);return n===((r=a.offset)==null?void 0:r.placement)&&(o=a.arrow)!=null&&o.alignmentOffset?{}:{x:s+l.x,y:i+l.y,data:{...l,placement:n}}}}},va=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:o,placement:s}=e,{mainAxis:i=!0,crossAxis:n=!1,limiter:a={fn:E=>{let{x:$,y:x}=E;return{x:$,y:x}}},...l}=le(t,e),c={x:r,y:o},d=await fo(e,l),u=mt(Et(s)),m=Ys(u);let h=c[m],g=c[u];if(i){const E=m==="y"?"top":"left",$=m==="y"?"bottom":"right",x=h+d[E],v=h-d[$];h=Pr(x,h,v)}if(n){const E=u==="y"?"top":"left",$=u==="y"?"bottom":"right",x=g+d[E],v=g-d[$];g=Pr(x,g,v)}const b=a.fn({...e,[m]:h,[u]:g});return{...b,data:{x:b.x-r,y:b.y-o,enabled:{[m]:i,[u]:n}}}}}},ya=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var r,o;const{placement:s,rects:i,platform:n,elements:a}=e,{apply:l=()=>{},...c}=le(t,e),d=await fo(e,c),u=Et(s),m=ce(s),h=mt(s)==="y",{width:g,height:b}=i.floating;let E,$;u==="top"||u==="bottom"?(E=u,$=m===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):($=u,E=m==="end"?"top":"bottom");const x=b-d.top-d.bottom,v=g-d.left-d.right,_=Ct(b-d[E],x),y=Ct(g-d[$],v),A=!e.middlewareData.shift;let P=_,R=y;if((r=e.middlewareData.shift)!=null&&r.enabled.x&&(R=v),(o=e.middlewareData.shift)!=null&&o.enabled.y&&(P=x),A&&!m){const N=Z(d.left,0),vt=Z(d.right,0),at=Z(d.top,0),yt=Z(d.bottom,0);h?R=g-2*(N!==0||vt!==0?N+vt:Z(d.left,d.right)):P=b-2*(at!==0||yt!==0?at+yt:Z(d.top,d.bottom))}await l({...e,availableWidth:R,availableHeight:P});const B=await n.getDimensions(a.floating);return g!==B.width||b!==B.height?{reset:{rects:!0}}:{}}}};function rr(){return typeof window<"u"}function ue(t){return ti(t)?(t.nodeName||"").toLowerCase():"#document"}function J(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function pt(t){var e;return(e=(ti(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function ti(t){return rr()?t instanceof Node||t instanceof J(t).Node:!1}function st(t){return rr()?t instanceof Element||t instanceof J(t).Element:!1}function ht(t){return rr()?t instanceof HTMLElement||t instanceof J(t).HTMLElement:!1}function Wo(t){return!rr()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof J(t).ShadowRoot}const wa=new Set(["inline","contents"]);function ke(t){const{overflow:e,overflowX:r,overflowY:o,display:s}=it(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+r)&&!wa.has(s)}const _a=new Set(["table","td","th"]);function $a(t){return _a.has(ue(t))}const xa=[":popover-open",":modal"];function or(t){return xa.some(e=>{try{return t.matches(e)}catch{return!1}})}const Ca=["transform","translate","scale","rotate","perspective"],Ea=["transform","translate","scale","rotate","perspective","filter"],Sa=["paint","layout","strict","content"];function sr(t){const e=mo(),r=st(t)?it(t):t;return Ca.some(o=>r[o]?r[o]!=="none":!1)||(r.containerType?r.containerType!=="normal":!1)||!e&&(r.backdropFilter?r.backdropFilter!=="none":!1)||!e&&(r.filter?r.filter!=="none":!1)||Ea.some(o=>(r.willChange||"").includes(o))||Sa.some(o=>(r.contain||"").includes(o))}function ka(t){let e=St(t);for(;ht(e)&&!re(e);){if(sr(e))return e;if(or(e))return null;e=St(e)}return null}function mo(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const Aa=new Set(["html","body","#document"]);function re(t){return Aa.has(ue(t))}function it(t){return J(t).getComputedStyle(t)}function ir(t){return st(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function St(t){if(ue(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Wo(t)&&t.host||pt(t);return Wo(e)?e.host:e}function ei(t){const e=St(t);return re(e)?t.ownerDocument?t.ownerDocument.body:t.body:ht(e)&&ke(e)?e:ei(e)}function xe(t,e,r){var o;e===void 0&&(e=[]),r===void 0&&(r=!0);const s=ei(t),i=s===((o=t.ownerDocument)==null?void 0:o.body),n=J(s);if(i){const a=Tr(n);return e.concat(n,n.visualViewport||[],ke(s)?s:[],a&&r?xe(a):[])}return e.concat(s,xe(s,[],r))}function Tr(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function ri(t){const e=it(t);let r=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const s=ht(t),i=s?t.offsetWidth:r,n=s?t.offsetHeight:o,a=Fe(r)!==i||Fe(o)!==n;return a&&(r=i,o=n),{width:r,height:o,$:a}}function go(t){return st(t)?t:t.contextElement}function Qt(t){const e=go(t);if(!ht(e))return ut(1);const r=e.getBoundingClientRect(),{width:o,height:s,$:i}=ri(e);let n=(i?Fe(r.width):r.width)/o,a=(i?Fe(r.height):r.height)/s;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const Pa=ut(0);function oi(t){const e=J(t);return!mo()||!e.visualViewport?Pa:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Oa(t,e,r){return e===void 0&&(e=!1),!r||e&&r!==J(t)?!1:e}function Bt(t,e,r,o){e===void 0&&(e=!1),r===void 0&&(r=!1);const s=t.getBoundingClientRect(),i=go(t);let n=ut(1);e&&(o?st(o)&&(n=Qt(o)):n=Qt(t));const a=Oa(i,r,o)?oi(i):ut(0);let l=(s.left+a.x)/n.x,c=(s.top+a.y)/n.y,d=s.width/n.x,u=s.height/n.y;if(i){const m=J(i),h=o&&st(o)?J(o):o;let g=m,b=Tr(g);for(;b&&o&&h!==g;){const E=Qt(b),$=b.getBoundingClientRect(),x=it(b),v=$.left+(b.clientLeft+parseFloat(x.paddingLeft))*E.x,_=$.top+(b.clientTop+parseFloat(x.paddingTop))*E.y;l*=E.x,c*=E.y,d*=E.x,u*=E.y,l+=v,c+=_,g=J(b),b=Tr(g)}}return We({width:d,height:u,x:l,y:c})}function nr(t,e){const r=ir(t).scrollLeft;return e?e.left+r:Bt(pt(t)).left+r}function si(t,e){const r=t.getBoundingClientRect(),o=r.left+e.scrollLeft-nr(t,r),s=r.top+e.scrollTop;return{x:o,y:s}}function Ta(t){let{elements:e,rect:r,offsetParent:o,strategy:s}=t;const i=s==="fixed",n=pt(o),a=e?or(e.floating):!1;if(o===n||a&&i)return r;let l={scrollLeft:0,scrollTop:0},c=ut(1);const d=ut(0),u=ht(o);if((u||!u&&!i)&&((ue(o)!=="body"||ke(n))&&(l=ir(o)),ht(o))){const h=Bt(o);c=Qt(o),d.x=h.x+o.clientLeft,d.y=h.y+o.clientTop}const m=n&&!u&&!i?si(n,l):ut(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+d.x+m.x,y:r.y*c.y-l.scrollTop*c.y+d.y+m.y}}function Ra(t){return Array.from(t.getClientRects())}function La(t){const e=pt(t),r=ir(t),o=t.ownerDocument.body,s=Z(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),i=Z(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let n=-r.scrollLeft+nr(t);const a=-r.scrollTop;return it(o).direction==="rtl"&&(n+=Z(e.clientWidth,o.clientWidth)-s),{width:s,height:i,x:n,y:a}}const Ho=25;function za(t,e){const r=J(t),o=pt(t),s=r.visualViewport;let i=o.clientWidth,n=o.clientHeight,a=0,l=0;if(s){i=s.width,n=s.height;const d=mo();(!d||d&&e==="fixed")&&(a=s.offsetLeft,l=s.offsetTop)}const c=nr(o);if(c<=0){const d=o.ownerDocument,u=d.body,m=getComputedStyle(u),h=d.compatMode==="CSS1Compat"&&parseFloat(m.marginLeft)+parseFloat(m.marginRight)||0,g=Math.abs(o.clientWidth-u.clientWidth-h);g<=Ho&&(i-=g)}else c<=Ho&&(i+=c);return{width:i,height:n,x:a,y:l}}const Na=new Set(["absolute","fixed"]);function Da(t,e){const r=Bt(t,!0,e==="fixed"),o=r.top+t.clientTop,s=r.left+t.clientLeft,i=ht(t)?Qt(t):ut(1),n=t.clientWidth*i.x,a=t.clientHeight*i.y,l=s*i.x,c=o*i.y;return{width:n,height:a,x:l,y:c}}function qo(t,e,r){let o;if(e==="viewport")o=za(t,r);else if(e==="document")o=La(pt(t));else if(st(e))o=Da(e,r);else{const s=oi(t);o={x:e.x-s.x,y:e.y-s.y,width:e.width,height:e.height}}return We(o)}function ii(t,e){const r=St(t);return r===e||!st(r)||re(r)?!1:it(r).position==="fixed"||ii(r,e)}function Ia(t,e){const r=e.get(t);if(r)return r;let o=xe(t,[],!1).filter(a=>st(a)&&ue(a)!=="body"),s=null;const i=it(t).position==="fixed";let n=i?St(t):t;for(;st(n)&&!re(n);){const a=it(n),l=sr(n);!l&&a.position==="fixed"&&(s=null),(i?!l&&!s:!l&&a.position==="static"&&!!s&&Na.has(s.position)||ke(n)&&!l&&ii(t,n))?o=o.filter(d=>d!==n):s=a,n=St(n)}return e.set(t,o),o}function Ma(t){let{element:e,boundary:r,rootBoundary:o,strategy:s}=t;const n=[...r==="clippingAncestors"?or(e)?[]:Ia(e,this._c):[].concat(r),o],a=n[0],l=n.reduce((c,d)=>{const u=qo(e,d,s);return c.top=Z(u.top,c.top),c.right=Ct(u.right,c.right),c.bottom=Ct(u.bottom,c.bottom),c.left=Z(u.left,c.left),c},qo(e,a,s));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function Ba(t){const{width:e,height:r}=ri(t);return{width:e,height:r}}function Va(t,e,r){const o=ht(e),s=pt(e),i=r==="fixed",n=Bt(t,!0,i,e);let a={scrollLeft:0,scrollTop:0};const l=ut(0);function c(){l.x=nr(s)}if(o||!o&&!i)if((ue(e)!=="body"||ke(s))&&(a=ir(e)),o){const h=Bt(e,!0,i,e);l.x=h.x+e.clientLeft,l.y=h.y+e.clientTop}else s&&c();i&&!o&&s&&c();const d=s&&!o&&!i?si(s,a):ut(0),u=n.left+a.scrollLeft-l.x-d.x,m=n.top+a.scrollTop-l.y-d.y;return{x:u,y:m,width:n.width,height:n.height}}function br(t){return it(t).position==="static"}function Ko(t,e){if(!ht(t)||it(t).position==="fixed")return null;if(e)return e(t);let r=t.offsetParent;return pt(t)===r&&(r=r.ownerDocument.body),r}function ni(t,e){const r=J(t);if(or(t))return r;if(!ht(t)){let s=St(t);for(;s&&!re(s);){if(st(s)&&!br(s))return s;s=St(s)}return r}let o=Ko(t,e);for(;o&&$a(o)&&br(o);)o=Ko(o,e);return o&&re(o)&&br(o)&&!sr(o)?r:o||ka(t)||r}const Ua=async function(t){const e=this.getOffsetParent||ni,r=this.getDimensions,o=await r(t.floating);return{reference:Va(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function Fa(t){return it(t).direction==="rtl"}const Me={convertOffsetParentRelativeRectToViewportRelativeRect:Ta,getDocumentElement:pt,getClippingRect:Ma,getOffsetParent:ni,getElementRects:Ua,getClientRects:Ra,getDimensions:Ba,getScale:Qt,isElement:st,isRTL:Fa};function ai(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function ja(t,e){let r=null,o;const s=pt(t);function i(){var a;clearTimeout(o),(a=r)==null||a.disconnect(),r=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),i();const c=t.getBoundingClientRect(),{left:d,top:u,width:m,height:h}=c;if(a||e(),!m||!h)return;const g=Re(u),b=Re(s.clientWidth-(d+m)),E=Re(s.clientHeight-(u+h)),$=Re(d),v={rootMargin:-g+"px "+-b+"px "+-E+"px "+-$+"px",threshold:Z(0,Ct(1,l))||1};let _=!0;function y(A){const P=A[0].intersectionRatio;if(P!==l){if(!_)return n();P?n(!1,P):o=setTimeout(()=>{n(!1,1e-7)},1e3)}P===1&&!ai(c,t.getBoundingClientRect())&&n(),_=!1}try{r=new IntersectionObserver(y,{...v,root:s.ownerDocument})}catch{r=new IntersectionObserver(y,v)}r.observe(t)}return n(!0),i}function Wa(t,e,r,o){o===void 0&&(o={});const{ancestorScroll:s=!0,ancestorResize:i=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=go(t),d=s||i?[...c?xe(c):[],...xe(e)]:[];d.forEach($=>{s&&$.addEventListener("scroll",r,{passive:!0}),i&&$.addEventListener("resize",r)});const u=c&&a?ja(c,r):null;let m=-1,h=null;n&&(h=new ResizeObserver($=>{let[x]=$;x&&x.target===c&&h&&(h.unobserve(e),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var v;(v=h)==null||v.observe(e)})),r()}),c&&!l&&h.observe(c),h.observe(e));let g,b=l?Bt(t):null;l&&E();function E(){const $=Bt(t);b&&!ai(b,$)&&r(),b=$,g=requestAnimationFrame(E)}return r(),()=>{var $;d.forEach(x=>{s&&x.removeEventListener("scroll",r),i&&x.removeEventListener("resize",r)}),u?.(),($=h)==null||$.disconnect(),h=null,l&&cancelAnimationFrame(g)}}const Ha=ba,qa=va,Ka=fa,Go=ya,Ga=pa,Za=(t,e,r)=>{const o=new Map,s={platform:Me,...r},i={...s.platform,_c:o};return da(t,e,{...s,platform:i})};function Xa(t){return Ja(t)}function vr(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Ja(t){for(let e=t;e;e=vr(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=vr(t);e;e=vr(e)){if(!(e instanceof Element))continue;const r=getComputedStyle(e);if(r.display!=="contents"&&(r.position!=="static"||sr(r)||e.tagName==="BODY"))return e}return null}function Ya(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var T=class extends q{constructor(){super(...arguments),this.localize=new Vt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,s=0,i=0,n=0,a=0,l=0,c=0,d=0;r?t.top<e.top?(o=t.left,s=t.bottom,i=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,d=e.top):(o=e.left,s=e.bottom,i=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,d=t.top):t.left<e.left?(o=t.right,s=t.top,i=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,d=e.bottom):(o=e.right,s=e.top,i=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,d=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${s}px`),this.style.setProperty("--hover-bridge-top-right-x",`${i}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${d}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Ya(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Wa(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[Ha({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Go({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",s=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=s?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Ka({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(qa({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Go({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Ga({element:this.arrowEl,padding:this.arrowPadding}));const e=this.strategy==="absolute"?r=>Me.getOffsetParent(r,Xa):Me.getOffsetParent;Za(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:Ye(Ut({},Me),{getOffsetParent:e})}).then(({x:r,y:o,middlewareData:s,placement:i})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=s.arrow.x,c=s.arrow.y;let d="",u="",m="",h="";if(this.arrowPlacement==="start"){const g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",u=n?g:"",h=n?"":g}else if(this.arrowPlacement==="end"){const g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";u=n?"":g,h=n?g:"",m=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(h=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",d=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(h=typeof l=="number"?`${l}px`:"",d=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:d,right:u,bottom:m,left:h,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return k`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${gt({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${gt({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?k`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};T.styles=[dt,ea];p([et(".popup")],T.prototype,"popup",2);p([et(".popup__arrow")],T.prototype,"arrowEl",2);p([f()],T.prototype,"anchor",2);p([f({type:Boolean,reflect:!0})],T.prototype,"active",2);p([f({reflect:!0})],T.prototype,"placement",2);p([f({reflect:!0})],T.prototype,"strategy",2);p([f({type:Number})],T.prototype,"distance",2);p([f({type:Number})],T.prototype,"skidding",2);p([f({type:Boolean})],T.prototype,"arrow",2);p([f({attribute:"arrow-placement"})],T.prototype,"arrowPlacement",2);p([f({attribute:"arrow-padding",type:Number})],T.prototype,"arrowPadding",2);p([f({type:Boolean})],T.prototype,"flip",2);p([f({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],T.prototype,"flipFallbackPlacements",2);p([f({attribute:"flip-fallback-strategy"})],T.prototype,"flipFallbackStrategy",2);p([f({type:Object})],T.prototype,"flipBoundary",2);p([f({attribute:"flip-padding",type:Number})],T.prototype,"flipPadding",2);p([f({type:Boolean})],T.prototype,"shift",2);p([f({type:Object})],T.prototype,"shiftBoundary",2);p([f({attribute:"shift-padding",type:Number})],T.prototype,"shiftPadding",2);p([f({attribute:"auto-size"})],T.prototype,"autoSize",2);p([f()],T.prototype,"sync",2);p([f({type:Object})],T.prototype,"autoSizeBoundary",2);p([f({attribute:"auto-size-padding",type:Number})],T.prototype,"autoSizePadding",2);p([f({attribute:"hover-bridge",type:Boolean})],T.prototype,"hoverBridge",2);var li=new Map,Qa=new WeakMap;function tl(t){return t??{keyframes:[],options:{duration:0}}}function Zo(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function ar(t,e){li.set(t,tl(e))}function He(t,e,r){const o=Qa.get(t);if(o?.[e])return Zo(o[e],r.dir);const s=li.get(e);return s?Zo(s,r.dir):{keyframes:[],options:{duration:0}}}function Xo(t,e){return new Promise(r=>{function o(s){s.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}function Jo(t,e,r){return new Promise(o=>{if(r?.duration===1/0)throw new Error("Promise-based animations must be finite.");const s=t.animate(e,Ye(Ut({},r),{duration:el()?0:r.duration}));s.addEventListener("cancel",o,{once:!0}),s.addEventListener("finish",o,{once:!0})})}function Yo(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function el(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Qo(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{e.cancel(),requestAnimationFrame(r)})))}var F=class extends q{constructor(){super(),this.localize=new Vt(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=Yo(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=Yo(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Qo(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=He(this,"tooltip.show",{dir:this.localize.dir()});await Jo(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Qo(this.body);const{keyframes:r,options:o}=He(this,"tooltip.hide",{dir:this.localize.dir()});await Jo(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Xo(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Xo(this,"sl-after-hide")}render(){return k`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${gt({tooltip:!0,"tooltip--open":this.open})}
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
    `}};F.styles=[dt,ta];F.dependencies={"sl-popup":T};p([et("slot:not([name])")],F.prototype,"defaultSlot",2);p([et(".tooltip__body")],F.prototype,"body",2);p([et("sl-popup")],F.prototype,"popup",2);p([f()],F.prototype,"content",2);p([f()],F.prototype,"placement",2);p([f({type:Boolean,reflect:!0})],F.prototype,"disabled",2);p([f({type:Number})],F.prototype,"distance",2);p([f({type:Boolean,reflect:!0})],F.prototype,"open",2);p([f({type:Number})],F.prototype,"skidding",2);p([f()],F.prototype,"trigger",2);p([f({type:Boolean})],F.prototype,"hoist",2);p([bt("open",{waitUntilFirstUpdate:!0})],F.prototype,"handleOpenChange",1);p([bt(["content","distance","hoist","placement","skidding"])],F.prototype,"handleOptionsChange",1);p([bt("disabled")],F.prototype,"handleDisabledChange",1);ar("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}});ar("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});var rl=tt`
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
`,V=class extends q{constructor(){super(...arguments),this.localize=new Vt(this),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let t=this.value;if(this.from){const e=this.getRootNode(),r=this.from.includes("."),o=this.from.includes("[")&&this.from.includes("]");let s=this.from,i="";r?[s,i]=this.from.trim().split("."):o&&([s,i]=this.from.trim().replace(/\]$/,"").split("["));const n="getElementById"in e?e.getElementById(s):null;n?o?t=n.getAttribute(i)||"":r?t=n[i]||"":t=n.textContent||"":(this.showStatus("error"),this.emit("sl-error"))}if(!t)this.showStatus("error"),this.emit("sl-error");else try{await navigator.clipboard.writeText(t),this.showStatus("success"),this.emit("sl-copy",{detail:{value:t}})}catch{this.showStatus("error"),this.emit("sl-error")}}async showStatus(t){const e=this.copyLabel||this.localize.term("copy"),r=this.successLabel||this.localize.term("copied"),o=this.errorLabel||this.localize.term("error"),s=t==="success"?this.successIcon:this.errorIcon,i=He(this,"copy.in",{dir:"ltr"}),n=He(this,"copy.out",{dir:"ltr"});this.tooltip.content=t==="success"?r:o,await this.copyIcon.animate(n.keyframes,n.options).finished,this.copyIcon.hidden=!0,this.status=t,s.hidden=!1,await s.animate(i.keyframes,i.options).finished,setTimeout(async()=>{await s.animate(n.keyframes,n.options).finished,s.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(i.keyframes,i.options).finished,this.tooltip.content=e,this.isCopying=!1},this.feedbackDuration)}render(){const t=this.copyLabel||this.localize.term("copy");return k`
      <sl-tooltip
        class=${gt({"copy-button":!0,"copy-button--success":this.status==="success","copy-button--error":this.status==="error"})}
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
    `}};V.styles=[dt,rl];V.dependencies={"sl-icon":nt,"sl-tooltip":F};p([et('slot[name="copy-icon"]')],V.prototype,"copyIcon",2);p([et('slot[name="success-icon"]')],V.prototype,"successIcon",2);p([et('slot[name="error-icon"]')],V.prototype,"errorIcon",2);p([et("sl-tooltip")],V.prototype,"tooltip",2);p([At()],V.prototype,"isCopying",2);p([At()],V.prototype,"status",2);p([f()],V.prototype,"value",2);p([f()],V.prototype,"from",2);p([f({type:Boolean,reflect:!0})],V.prototype,"disabled",2);p([f({attribute:"copy-label"})],V.prototype,"copyLabel",2);p([f({attribute:"success-label"})],V.prototype,"successLabel",2);p([f({attribute:"error-label"})],V.prototype,"errorLabel",2);p([f({attribute:"feedback-duration",type:Number})],V.prototype,"feedbackDuration",2);p([f({attribute:"tooltip-placement"})],V.prototype,"tooltipPlacement",2);p([f({type:Boolean})],V.prototype,"hoist",2);ar("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}});ar("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}});V.define("sl-copy-button");var ol=Object.defineProperty,sl=(t,e,r)=>e in t?ol(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,yr=(t,e,r)=>(sl(t,typeof e!="symbol"?e+"":e,r),r),il=(t,e,r)=>{if(!e.has(t))throw TypeError("Cannot "+r)},wr=(t,e)=>{if(Object(e)!==e)throw TypeError('Cannot use the "in" operator on this value');return t.has(e)},Le=(t,e,r)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,r)},ts=(t,e,r)=>(il(t,e,"access private method"),r);/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function ci(t,e){return Object.is(t,e)}/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */let D=null,ve=!1,Be=1;const qe=Symbol("SIGNAL");function Xt(t){const e=D;return D=t,e}function nl(){return D}function al(){return ve}const bo={version:0,lastCleanEpoch:0,dirty:!1,producerNode:void 0,producerLastReadVersion:void 0,producerIndexOfThis:void 0,nextProducerIndex:0,liveConsumerNode:void 0,liveConsumerIndexOfThis:void 0,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function lr(t){if(ve)throw new Error(typeof ngDevMode<"u"&&ngDevMode?"Assertion error: signal read during notification phase":"");if(D===null)return;D.consumerOnSignalRead(t);const e=D.nextProducerIndex++;if(oe(D),e<D.producerNode.length&&D.producerNode[e]!==t&&Rr(D)){const r=D.producerNode[e];cr(r,D.producerIndexOfThis[e])}D.producerNode[e]!==t&&(D.producerNode[e]=t,D.producerIndexOfThis[e]=Rr(D)?di(t,D,e):0),D.producerLastReadVersion[e]=t.version}function ll(){Be++}function ui(t){if(!(!t.dirty&&t.lastCleanEpoch===Be)){if(!t.producerMustRecompute(t)&&!pl(t)){t.dirty=!1,t.lastCleanEpoch=Be;return}t.producerRecomputeValue(t),t.dirty=!1,t.lastCleanEpoch=Be}}function hi(t){if(t.liveConsumerNode===void 0)return;const e=ve;ve=!0;try{for(const r of t.liveConsumerNode)r.dirty||ul(r)}finally{ve=e}}function cl(){return D?.consumerAllowSignalWrites!==!1}function ul(t){var e;t.dirty=!0,hi(t),(e=t.consumerMarkedDirty)==null||e.call(t.wrapper??t)}function hl(t){return t&&(t.nextProducerIndex=0),Xt(t)}function dl(t,e){if(Xt(e),!(!t||t.producerNode===void 0||t.producerIndexOfThis===void 0||t.producerLastReadVersion===void 0)){if(Rr(t))for(let r=t.nextProducerIndex;r<t.producerNode.length;r++)cr(t.producerNode[r],t.producerIndexOfThis[r]);for(;t.producerNode.length>t.nextProducerIndex;)t.producerNode.pop(),t.producerLastReadVersion.pop(),t.producerIndexOfThis.pop()}}function pl(t){oe(t);for(let e=0;e<t.producerNode.length;e++){const r=t.producerNode[e],o=t.producerLastReadVersion[e];if(o!==r.version||(ui(r),o!==r.version))return!0}return!1}function di(t,e,r){var o;if(vo(t),oe(t),t.liveConsumerNode.length===0){(o=t.watched)==null||o.call(t.wrapper);for(let s=0;s<t.producerNode.length;s++)t.producerIndexOfThis[s]=di(t.producerNode[s],t,s)}return t.liveConsumerIndexOfThis.push(r),t.liveConsumerNode.push(e)-1}function cr(t,e){var r;if(vo(t),oe(t),typeof ngDevMode<"u"&&ngDevMode&&e>=t.liveConsumerNode.length)throw new Error(`Assertion error: active consumer index ${e} is out of bounds of ${t.liveConsumerNode.length} consumers)`);if(t.liveConsumerNode.length===1){(r=t.unwatched)==null||r.call(t.wrapper);for(let s=0;s<t.producerNode.length;s++)cr(t.producerNode[s],t.producerIndexOfThis[s])}const o=t.liveConsumerNode.length-1;if(t.liveConsumerNode[e]=t.liveConsumerNode[o],t.liveConsumerIndexOfThis[e]=t.liveConsumerIndexOfThis[o],t.liveConsumerNode.length--,t.liveConsumerIndexOfThis.length--,e<t.liveConsumerNode.length){const s=t.liveConsumerIndexOfThis[e],i=t.liveConsumerNode[e];oe(i),i.producerIndexOfThis[s]=e}}function Rr(t){var e;return t.consumerIsAlwaysLive||(((e=t?.liveConsumerNode)==null?void 0:e.length)??0)>0}function oe(t){t.producerNode??(t.producerNode=[]),t.producerIndexOfThis??(t.producerIndexOfThis=[]),t.producerLastReadVersion??(t.producerLastReadVersion=[])}function vo(t){t.liveConsumerNode??(t.liveConsumerNode=[]),t.liveConsumerIndexOfThis??(t.liveConsumerIndexOfThis=[])}/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function pi(t){if(ui(t),lr(t),t.value===Lr)throw t.error;return t.value}function fl(t){const e=Object.create(ml);e.computation=t;const r=()=>pi(e);return r[qe]=e,r}const _r=Symbol("UNSET"),$r=Symbol("COMPUTING"),Lr=Symbol("ERRORED"),ml={...bo,value:_r,dirty:!0,error:null,equal:ci,producerMustRecompute(t){return t.value===_r||t.value===$r},producerRecomputeValue(t){if(t.value===$r)throw new Error("Detected cycle in computations.");const e=t.value;t.value=$r;const r=hl(t);let o,s=!1;try{o=t.computation.call(t.wrapper),s=e!==_r&&e!==Lr&&t.equal.call(t.wrapper,e,o)}catch(i){o=Lr,t.error=i}finally{dl(t,r)}if(s){t.value=e;return}t.value=o,t.version++}};/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function gl(){throw new Error}let bl=gl;function vl(){bl()}/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function yl(t){const e=Object.create($l);e.value=t;const r=()=>(lr(e),e.value);return r[qe]=e,r}function wl(){return lr(this),this.value}function _l(t,e){cl()||vl(),t.equal.call(t.wrapper,t.value,e)||(t.value=e,xl(t))}const $l={...bo,equal:ci,value:void 0};function xl(t){t.version++,ll(),hi(t)}/**
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
 */const U=Symbol("node");var M;(t=>{var e,r,o,s;class i{constructor(l,c={}){Le(this,r),yr(this,e);const u=yl(l)[qe];if(this[U]=u,u.wrapper=this,c){const m=c.equals;m&&(u.equal=m),u.watched=c[t.subtle.watched],u.unwatched=c[t.subtle.unwatched]}}get(){if(!(0,t.isState)(this))throw new TypeError("Wrong receiver type for Signal.State.prototype.get");return wl.call(this[U])}set(l){if(!(0,t.isState)(this))throw new TypeError("Wrong receiver type for Signal.State.prototype.set");if(al())throw new Error("Writes to signals not permitted during Watcher callback");const c=this[U];_l(c,l)}}e=U,r=new WeakSet,t.isState=a=>typeof a=="object"&&wr(r,a),t.State=i;class n{constructor(l,c){Le(this,s),yr(this,o);const u=fl(l)[qe];if(u.consumerAllowSignalWrites=!0,this[U]=u,u.wrapper=this,c){const m=c.equals;m&&(u.equal=m),u.watched=c[t.subtle.watched],u.unwatched=c[t.subtle.unwatched]}}get(){if(!(0,t.isComputed)(this))throw new TypeError("Wrong receiver type for Signal.Computed.prototype.get");return pi(this[U])}}o=U,s=new WeakSet,t.isComputed=a=>typeof a=="object"&&wr(s,a),t.Computed=n,(a=>{var l,c,d,u;function m(v){let _,y=null;try{y=Xt(null),_=v()}finally{Xt(y)}return _}a.untrack=m;function h(v){var _;if(!(0,t.isComputed)(v)&&!(0,t.isWatcher)(v))throw new TypeError("Called introspectSources without a Computed or Watcher argument");return((_=v[U].producerNode)==null?void 0:_.map(y=>y.wrapper))??[]}a.introspectSources=h;function g(v){var _;if(!(0,t.isComputed)(v)&&!(0,t.isState)(v))throw new TypeError("Called introspectSinks without a Signal argument");return((_=v[U].liveConsumerNode)==null?void 0:_.map(y=>y.wrapper))??[]}a.introspectSinks=g;function b(v){if(!(0,t.isComputed)(v)&&!(0,t.isState)(v))throw new TypeError("Called hasSinks without a Signal argument");const _=v[U].liveConsumerNode;return _?_.length>0:!1}a.hasSinks=b;function E(v){if(!(0,t.isComputed)(v)&&!(0,t.isWatcher)(v))throw new TypeError("Called hasSources without a Computed or Watcher argument");const _=v[U].producerNode;return _?_.length>0:!1}a.hasSources=E;class ${constructor(_){Le(this,c),Le(this,d),yr(this,l);let y=Object.create(bo);y.wrapper=this,y.consumerMarkedDirty=_,y.consumerIsAlwaysLive=!0,y.consumerAllowSignalWrites=!1,y.producerNode=[],this[U]=y}watch(..._){if(!(0,t.isWatcher)(this))throw new TypeError("Called unwatch without Watcher receiver");ts(this,d,u).call(this,_);const y=this[U];y.dirty=!1;const A=Xt(y);for(const P of _)lr(P[U]);Xt(A)}unwatch(..._){if(!(0,t.isWatcher)(this))throw new TypeError("Called unwatch without Watcher receiver");ts(this,d,u).call(this,_);const y=this[U];oe(y);for(let A=y.producerNode.length-1;A>=0;A--)if(_.includes(y.producerNode[A].wrapper)){cr(y.producerNode[A],y.producerIndexOfThis[A]);const P=y.producerNode.length-1;if(y.producerNode[A]=y.producerNode[P],y.producerIndexOfThis[A]=y.producerIndexOfThis[P],y.producerNode.length--,y.producerIndexOfThis.length--,y.nextProducerIndex--,A<y.producerNode.length){const R=y.producerIndexOfThis[A],B=y.producerNode[A];vo(B),B.liveConsumerIndexOfThis[R]=A}}}getPending(){if(!(0,t.isWatcher)(this))throw new TypeError("Called getPending without Watcher receiver");return this[U].producerNode.filter(y=>y.dirty).map(y=>y.wrapper)}}l=U,c=new WeakSet,d=new WeakSet,u=function(v){for(const _ of v)if(!(0,t.isComputed)(_)&&!(0,t.isState)(_))throw new TypeError("Called watch/unwatch without a Computed or State argument")},t.isWatcher=v=>wr(c,v),a.Watcher=$;function x(){var v;return(v=nl())==null?void 0:v.wrapper}a.currentComputed=x,a.watched=Symbol("watched"),a.unwatched=Symbol("unwatched")})(t.subtle||(t.subtle={}))})(M||(M={}));/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Cl=Symbol("SignalWatcherBrand"),El=new FinalizationRegistry((({watcher:t,signal:e})=>{t.unwatch(e)})),es=new WeakMap;function Wt(t){return t[Cl]===!0?(console.warn("SignalWatcher should not be applied to the same class more than once."),t):class extends t{constructor(){super(...arguments),this._$St=new M.State(0),this._$Si=!1,this._$So=!0,this._$Sh=new Set}_$Sl(){if(this._$Su!==void 0)return;this._$Sv=new M.Computed((()=>{this._$St.get(),super.performUpdate()}));const e=this._$Su=new M.subtle.Watcher((function(){const r=es.get(this);r!==void 0&&(r._$Si===!1&&r.requestUpdate(),this.watch())}));es.set(e,this),El.register(this,{watcher:e,signal:this._$Sv}),e.watch(this._$Sv)}_$Sp(){this._$Su!==void 0&&(this._$Su.unwatch(this._$Sv),this._$Sv=void 0,this._$Su=void 0)}performUpdate(){this.isUpdatePending&&(this._$Sl(),this._$Si=!0,this._$St.set(this._$St.get()+1),this._$Si=!1,this._$Sv.get())}update(e){try{this._$So?(this._$So=!1,super.update(e)):this._$Sh.forEach((r=>r.commit()))}finally{this.isUpdatePending=!1,this._$Sh.clear()}}requestUpdate(e,r,o){this._$So=!0,super.requestUpdate(e,r,o)}connectedCallback(){super.connectedCallback(),this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),queueMicrotask((()=>{this.isConnected===!1&&this._$Sp()}))}_(e){this._$Sh.add(e);const r=this._$So;this.requestUpdate(),this._$So=r}m(e){this._$Sh.delete(e)}}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ye=(t,e)=>{const r=t._$AN;if(r===void 0)return!1;for(const o of r)o._$AO?.(e,!1),ye(o,e);return!0},Ke=t=>{let e,r;do{if((e=t._$AM)===void 0)break;r=e._$AN,r.delete(t),t=e}while(r?.size===0)},fi=t=>{for(let e;e=t._$AM;t=e){let r=e._$AN;if(r===void 0)e._$AN=r=new Set;else if(r.has(t))break;r.add(t),Al(e)}};function Sl(t){this._$AN!==void 0?(Ke(this),this._$AM=t,fi(this)):this._$AM=t}function kl(t,e=!1,r=0){const o=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(e)if(Array.isArray(o))for(let i=r;i<o.length;i++)ye(o[i],!1),Ke(o[i]);else o!=null&&(ye(o,!1),Ke(o));else ye(this,t)}const Al=t=>{t.type==ct.CHILD&&(t._$AP??=kl,t._$AQ??=Sl)};class Pl extends Se{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,r,o){super._$AT(e,r,o),fi(this),this.isConnected=e._$AU}_$AO(e,r=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),r&&(ye(this,e),Ke(this))}setValue(e){if(Zs(this._$Ct))this._$Ct._$AI(e,this);else{const r=[...this._$Ct._$AH];r[this._$Ci]=e,this._$Ct._$AI(r,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Ol extends Pl{_$Sl(){if(this._$Su!==void 0)return;this._$SW=new M.Computed((()=>{var r;return(r=this._$Sj)===null||r===void 0?void 0:r.get()}));const e=this._$Su=new M.subtle.Watcher((()=>{var r;(r=this._$SO)===null||r===void 0||r._(this),e.watch()}));e.watch(this._$SW)}_$Sp(){var e;this._$Su!==void 0&&(this._$Su.unwatch(this._$SW),this._$SW=void 0,this._$Su=void 0,(e=this._$SO)===null||e===void 0||e.m(this))}commit(){this.setValue(M.subtle.untrack((()=>{var e;return(e=this._$SW)===null||e===void 0?void 0:e.get()})))}render(e){return M.subtle.untrack((()=>e.get()))}update(e,[r]){var o,s;return(o=this._$SO)!==null&&o!==void 0||(this._$SO=(s=e.options)===null||s===void 0?void 0:s.host),r!==this._$Sj&&this._$Sj!==void 0&&this._$Sp(),this._$Sj=r,this._$Sl(),M.subtle.untrack((()=>this._$SW.get()))}disconnected(){this._$Sp()}reconnected(){this._$Sl()}}const Tl=Ee(Ol);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rl=t=>(e,...r)=>t(e,...r.map((o=>o instanceof M.State||o instanceof M.Computed?Tl(o):o))),Ll=Rl(k);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */M.State;M.Computed;const zr=(t,e)=>new M.State(t,e);class Ht extends Yt{createRenderRoot(){return this}}function zl(t){return typeof t=="number"}function Nl(t){return typeof t=="string"}function Dl(t){return typeof t=="bigint"}function mi(t){return!!t&&Object.prototype.toString.call(t)==="[object Date]"&&!isNaN(t)}function gi(t){return t!=null&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"}var Il=Symbol.for("decoders.kAnnotationRegistry"),bi=globalThis[Il]??=new WeakSet;function Ae(t){return bi.add(t),t}function vi(t,e){return Ae({type:"object",fields:t,text:e})}function Ml(t,e){return Ae({type:"array",items:t,text:e})}function ze(t,e){return Ae({type:"opaque",value:t,text:e})}function Bl(t,e){return Ae({type:"scalar",value:t,text:e})}function yi(t,e){return e!==void 0?Ae({...t,text:e}):t}function wi(t,e){const r=new Map([...t.fields,...e]);return vi(r,t.text)}function _i(t){return bi.has(t)}function Vl(t,e,r){r.add(t);const o=[];for(const s of t)o.push(yo(s,void 0,r));return Ml(o,e)}function $i(t,e,r){r.add(t);const o=new Map;for(const s of Object.keys(t)){const i=t[s];o.set(s,yo(i,void 0,r))}return vi(o,e)}function yo(t,e,r){return t==null||typeof t=="string"||typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"||typeof t.getMonth=="function"?Bl(t,e):_i(t)?yi(t,e):Array.isArray(t)?r.has(t)?ze("<circular ref>",e):Vl(t,e,r):gi(t)?r.has(t)?ze("<circular ref>",e):$i(t,e,r):ze(typeof t=="function"?"<function>":"???",e)}function Dt(t,e){return yo(t,e,new WeakSet)}function xi(t,e){return $i(t,e,new WeakSet)}var It="  ";function Nr(t){return t.includes(`
`)}function wo(t,e=It){return Nr(t)?t.split(`
`).map(r=>`${e}${r}`).join(`
`):`${e}${t}`}var Ul=/'/g;function se(t){return typeof t=="string"?"'"+t.replace(Ul,"\\'")+"'":t===void 0?"undefined":JSON.stringify(t)}function Ge(t,e=[]){const r=[];if(t.type==="array"){const i=t.items;let n=0;for(const a of i)for(const l of Ge(a,[...e,n++]))r.push(l)}else if(t.type==="object"){const i=t.fields;for(const[n,a]of i)for(const l of Ge(a,[...e,n]))r.push(l)}const o=t.text;if(!o)return r;let s;return e.length===0?s="":e.length===1?s=typeof e[0]=="number"?`Value at index ${e[0]}: `:`Value at key ${se(e[0])}: `:s=`Value at keypath ${se(e.map(String).join("."))}: `,[...r,`${s}${o}`]}function Fl(t,e=80){let r=JSON.stringify(t);if(r.length<=e)return r;const o=`${t.substring(0,e-15)}...`;return r=`${JSON.stringify(o)} [truncated]`,r}function jl(t,e){const{items:r}=t;if(r.length===0)return"[]";const o=[];for(const s of r){const[i,n]=_o(s,`${e}${It}`);o.push(`${e}${It}${i},`),n!==void 0&&o.push(wo(n,`${e}${It}`))}return["[",...o,`${e}]`].join(`
`)}function Wl(t,e){const{fields:r}=t;if(r.size===0)return"{}";const o=[];for(const[s,i]of r){const n=Ci(s),a=`${e}${It}${" ".repeat(n.length+2)}`,[l,c]=_o(i,`${e}${It}`);o.push(`${e}${It}${n}: ${l},`),c!==void 0&&o.push(wo(c,a))}return["{",...o,`${e}}`].join(`
`)}function Ci(t){return typeof t=="string"?Fl(t):typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"?t.toString():t===null?"null":t===void 0?"undefined":mi(t)?`new Date(${se(t.toISOString())})`:t instanceof Date?"(Invalid Date)":"(unserializable)"}function _o(t,e=""){let r;t.type==="array"?r=jl(t,e):t.type==="object"?r=Wl(t,e):t.type==="scalar"?r=Ci(t.value):r=t.value;const o=t.text;if(o!==void 0){const s="^".repeat(Nr(r)?1:r.length);return[r,[s,o].join(Nr(o)?`
`:" ")]}else return[r,void 0]}function Hl(t){const[e,r]=_o(t);return r!==void 0?`${e}
${r}`:e}function ql(t){return Ge(t,[]).join(`
`)}function*Dr(t,e){switch(t.text&&(e.length>0?yield{message:t.text,path:[...e]}:yield{message:t.text}),t.type){case"array":{let r=0;for(const o of t.items)e.push(r++),yield*Dr(o,e),e.pop();break}case"object":{for(const[r,o]of t.fields)e.push(r),yield*Dr(o,e),e.pop();break}}}function Kl(t){return Array.from(Dr(t,[]))}function Ei(t){return{ok:!0,value:t,error:void 0}}function Si(t){return{ok:!1,value:void 0,error:t}}function Gl(t){return e=>{try{const r=t(e);return Ei(r)}catch(r){return Si(Dt(e,r instanceof Error?r.message:String(r)))}}}function Zl(t,e){const r=e(t);if(typeof r=="string"){const o=new Error(`
${r}`);return o.name="Decoding error",o}else return r}function j(t){function e(h){return t(h,Ei,b=>Si(_i(b)?b:Dt(h,b)))}function r(h,g=Hl){const b=e(h);if(b.ok)return b.value;throw Zl(b.error,g)}function o(h){return e(h).value}function s(h){return a(Gl(h))}function i(h,g){return c(b=>h(b)?null:g)}function n(){return m}function a(h){return j((g,b,E)=>{const $=e(g);if(!$.ok)return $;const x=rs(h)?h:h($.value,b,E);return rs(x)?x.decode($.value):x})}function l(h){return a(h)}function c(h){return a((g,b,E)=>{const $=h(g);return $===null?b(g):E(typeof $=="string"?Dt(g,$):$)})}function d(h){return j((g,b,E)=>{const $=e(g);return $.ok?$:E(Dt($.error,h))})}const m=Jl({verify:r,value:o,decode:e,transform:s,refine:i,refineType:n,reject:c,describe:d,then:a,pipe:l,"~standard":{version:1,vendor:"decoders",validate:h=>{const g=e(h);return g.ok?{value:g.value}:{issues:Kl(g.error)}}}});return m}var Xl=Symbol.for("decoders.kDecoderRegistry"),ki=globalThis[Xl]??=new WeakSet;function Jl(t){return ki.add(t),t}function rs(t){return ki.has(t)}var Yl=j((t,e,r)=>Array.isArray(t)?e(t):r("Must be an array"));function kt(t){const e=t.decode;return Yl.then((r,o,s)=>{const i=[];for(let n=0;n<r.length;++n){const a=r[n],l=e(a);if(l.ok)i.push(l.value);else{i.length=0;const c=l.error,d=r.slice();return d.splice(n,1,Dt(c,c.text?`${c.text} (at index ${n})`:`index ${n}`)),s(Dt(d))}}return o(i)})}function Ql(t){return j((e,r,o)=>e instanceof t?r(e):o(`Must be ${t.name} instance`))}function Ai(t){return j(e=>t().decode(e))}function tc(t,e){const r=new Set;for(const o of t)e.has(o)||r.add(o);return r}var Pi=j((t,e,r)=>gi(t)?e(t):r("Must be an object"));function K(t){const e=new Set(Object.keys(t));return Pi.then((r,o,s)=>{const i=new Set(Object.keys(r)),n=tc(e,i),a={};let l=null;for(const c of Object.keys(t)){const d=t[c],u=r[c],m=d.decode(u);if(m.ok){const h=m.value;h!==void 0&&(a[c]=h),n.delete(c)}else{const h=m.error;u===void 0?n.add(c):(l??=new Map,l.set(c,h))}}if(l||n.size>0){let c=xi(r);if(l&&(c=wi(c,l)),n.size>0){const d=Array.from(n).map(se).join(", "),u=n.size>1?"keys":"key";c=yi(c,`Missing ${u}: ${d}`)}return s(c)}return o(a)})}var Ir=`Either:
`;function ec(t){return`-${wo(t).substring(1)}`}function rc(t){return t.startsWith(Ir)?t.substring(Ir.length):ec(t)}function ie(...t){if(t.length===0)throw new Error("Pass at least one decoder to either()");return j((e,r,o)=>{const s=[];for(const n of t){const a=n.decode(e);if(a.ok)return a;s.push(a.error)}const i=Ir+s.map(n=>rc(Ge(n).join(`
`))).join(`
`);return o(i)})}var Mr=Ze(null);Ze(void 0);j((t,e,r)=>t==null?e(t):r("Must be undefined or null"));function Ze(t){return j((e,r,o)=>e===t?r(t):o(`Must be ${typeof t=="symbol"?String(t):se(t)}`))}var oc=j((t,e,r)=>e(t)),Oi=oc,S=j((t,e,r)=>typeof t=="boolean"?e(t):r("Must be boolean"));j((t,e,r)=>e(!!t));function Ti(t,e){const r=e!==void 0?t:void 0,o=e??t;return Pi.then((s,i,n)=>{let a={};const l=new Map;for(const c of Object.keys(s)){const d=s[c],u=r?.decode(c);if(u?.ok===!1)return n(Dt(s,`Invalid key ${se(c)}: ${ql(u.error)}`));const m=u?.value??c,h=o.decode(d);h.ok?l.size===0&&(a[m]=h.value):(l.set(c,h.error),a={})}return l.size>0?n(wi(xi(s),l)):i(a)})}var sc=/^([A-Za-z]{2,12}(?:[+][A-Za-z]{2,12})?):\/\/(?:([^@:]*:?(?:[^@]+)?)@)?(?:([A-Za-z0-9.-]+)(?::([0-9]{2,5}))?)(\/(?:[-+~%/.,\w]*)?(?:\?[-+=&;%@.,/\w]*)?(?:#[.,!/\w]*)?)?$/,w=j((t,e,r)=>Nl(t)?e(t):r("Must be string"));Pt(/\S/,"Must be non-empty string");function Pt(t,e){return w.refine(r=>t.test(r),e)}Pt(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Must be email");var ic=ie(Pt(sc,"Must be URL").transform(t=>new URL(t)),Ql(URL));ic.refine(t=>t.protocol==="https:","Must be an HTTPS URL");Pt(/^[a-z_][a-z0-9_]*$/i,"Must be valid identifier");var Ri=Pt(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,"Must be uuid");Ri.refine(t=>t[14]==="1","Must be uuidv1");Ri.refine(t=>t[14]==="4","Must be uuidv4");var nc=Pt(/^[0-9]+$/,"Must only contain digits");Pt(/^[0-9a-f]+$/i,"Must only contain hexadecimal digits");nc.transform(Number);var ac=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.]\d+)?(?:Z|[+-]\d{2}:?\d{2})$/,lc=j((t,e,r)=>mi(t)?e(t):r("Must be a Date")),cc=Pt(ac,"Must be ISO8601 format").refine(t=>!isNaN(new Date(t).getTime()),"Must be valid date/time value"),uc=cc.transform(t=>new Date(t));ie(lc,uc).describe("Must be a Date or date string");var hc=j((t,e,r)=>zl(t)?e(t):r("Must be number")),L=hc.refine(t=>Number.isFinite(t),"Number must be finite"),dc=L.refine(t=>Number.isInteger(t),"Number must be an integer");L.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");dc.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");j((t,e,r)=>Dl(t)?e(t):r("Must be bigint"));var pc=Ai(()=>Ti(Li)),fc=Ai(()=>kt(Li)),Li=ie(Mr,w,L,S,pc,fc).describe("Must be valid JSON value");const mc=["PENDING"];class $o{#s=new M.State(mc);#r;constructor(e){if(this.constructor!==$o)throw new Error("tracked-async-data cannot be subclassed");if(!os(e)){this.#s.set(["RESOLVED",e]),this.#r=Promise.resolve(e);return}this.#r=e,this.#r.then(r=>{this.#s.set(["RESOLVED",r])},r=>{this.#s.set(["REJECTED",r])})}then=(e,r)=>{if(os(this.#r))return this.#r.then(e).catch(r);if(this.state==="RESOLVED")return e(this.value);if(this.state==="REJECTED"&&r)return r(this.error);throw new Error("Value was not resolveable")};get state(){return this.#s.get()[0]}get value(){let e=this.#s.get();return e[0]==="RESOLVED"?e[1]:null}get error(){let e=this.#s.get();return e[0]==="REJECTED"?e[1]:null}get isPending(){return this.state==="PENDING"}get isResolved(){return this.state==="RESOLVED"}get isRejected(){return this.state==="REJECTED"}toJSON(){const{isPending:e,isResolved:r,isRejected:o}=this;return e?{isPending:e,isResolved:r,isRejected:o}:r?{isPending:e,isResolved:r,value:this.value,isRejected:o}:{isPending:e,isResolved:r,isRejected:o,error:this.error}}toString(){return JSON.stringify(this.toJSON(),null,2)}}function gc(t,e){return t in e}function os(t){return typeof t=="object"&&t!==null&&gc("then",t)&&typeof t.then=="function"}function ss(t){if(arguments.length===1){if(typeof t!="function")throw new Error("signalFunction must be called with a function passed");return new bc(t)}throw new Error("Unknown arity: signalFunction must be called with 1 argument")}class bc{#s=new M.State(null);get data(){return this.#e.get(),this.#s.get()}#r=new M.State(void 0);get promise(){return this.#e.get(),this.#r.get()}#o=new M.State(void 0);get caughtError(){return this.#e.get(),this.#o.get()}#t;#e;constructor(e){this.#t=e,this.#e=new M.Computed(()=>(this.retry(),this))}get state(){return this.#e.get(),this.data?.state??"UNSTARTED"}get isPending(){return this.#e.get(),this.data?this.data.isPending??!1:!0}get isFinished(){return this.#e.get(),this.isResolved||this.isRejected}get isSettled(){return this.#e.get(),this.isFinished}get isLoading(){return this.#e.get(),this.isPending}get isResolved(){return this.#e.get(),this.data?.isResolved??!1}get isError(){return this.#e.get(),this.isRejected}get isRejected(){return this.#e.get(),this.data?.isRejected??!!this.caughtError??!1}get value(){return this.#e.get(),this.data?.isResolved?this.data.value:null}get error(){return this.#e.get(),this.state==="UNSTARTED"&&this.caughtError?this.caughtError:this.data?.state!=="REJECTED"?null:this.caughtError?this.caughtError:this.data?.error??null}retry=async()=>{try{await this.#l()}catch(e){this.#o.set(e)}};async#l(){return this.#s.set(null),this.#r.set(this.#t()),await Promise.resolve(),this.#o.set(null),this.#s.set(new $o(this.promise)),this.promise}}const vc=K({width:L,height:L,url:w,accessories:kt(Oi)}),zi=K({header_full_width:L,header_full_height:L,avatar_shape:w,background_color:w,body_font:w,header_bounds:w,header_image:w,header_image_focused:w,header_image_poster:w,header_image_scaled:w,header_stretch:S,link_color:w,show_avatar:S,show_description:S,show_header_image:S,show_title:S,title_color:w,title_font:w,title_font_weight:w}),Ni=K({admin:S,ask:S,ask_anon:S,ask_page_title:w,asks_allow_media:S,avatar:kt(vc),can_chat:S,can_send_fan_mail:S,can_subscribe:S,description:w,drafts:L,facebook:w,facebook_opengraph_enabled:w,followed:S,followers:L,is_blocked_from_primary:S,is_nsfw:S,messages:L,name:w,posts:L,primary:S,queue:L,share_likes:S,subscribed:S,theme_id:L,theme:zi,title:w,total_posts:L,tweet:w,twitter_enabled:S,twitter_send:S,type:w,updated:L,url:w,uuid:w}),yc=K({name:w,title:w,description:w,url:w,uuid:w,updated:L,tumblrmart_accessories:Ti(w,Oi),can_show_badges:S}),wc=K({comment:w,tree_html:w}),_c=K({blog:K({name:w,active:S,theme:zi,share_likes:S,share_following:S,can_be_followed:S}),post:K({id:w}),content_raw:w,content:w,is_current_item:S,is_root_item:S}),$c=K({type:w,is_blocks_post_format:S,blog_name:w,blog:yc,id:w,id_string:w,is_blazed:S,is_blaze_pending:S,can_ignite:S,can_blaze:S,post_url:w,slug:w,date:w,timestamp:L,state:w,format:w,reblog_key:w,tags:kt(w),short_url:w,summary:w,should_open_in_legacy:S,recommended_source:ie(w,Mr),recommended_color:ie(w,Mr),followed:S,liked:S,note_count:L,title:w,body:w,reblog:wc,trail:kt(_c),can_like:S,interactability_reblog:w,interactability_blaze:w,can_reblog:S,can_send_in_message:S,muted:S,mute_end_timestamp:L,can_mute:S,can_reply:S,display_avatar:S}),xc=K({blog:Ni,posts:kt($c),total_posts:L});K({blog:K({blog:Ni}),posts:xc});const Cc=K({avatar:w,updated:L,title:w,description:w}),Ec=K({id:w,date:L,body:w,tags:kt(w)});class Sc{constructor(){this.meta=ss(async()=>{const r=await(await fetch("/meta.json")).json();return Cc.verify(r)}),this.posts=ss(async()=>{const r=await(await fetch("/posts.json")).json();return kt(Ec).verify(r)})}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const is=new WeakMap,ns=t=>{if((r=>r.pattern!==void 0)(t))return t.pattern;let e=is.get(t);return e===void 0&&is.set(t,e=new URLPattern({pathname:t.path})),e};let kc=class{constructor(e,r,o){this.routes=[],this.o=[],this.t={},this.i=s=>{if(s.routes===this)return;const i=s.routes;this.o.push(i),i.h=this,s.stopImmediatePropagation(),s.onDisconnect=()=>{this.o?.splice(this.o.indexOf(i)>>>0,1)};const n=as(this.t);n!==void 0&&i.goto(n)},(this.l=e).addController(this),this.routes=[...r],this.fallback=o?.fallback}link(e){if(e?.startsWith("/"))return e;if(e?.startsWith("."))throw Error("Not implemented");return e??=this.u,(this.h?.link()??"")+e}async goto(e){let r;if(this.routes.length===0&&this.fallback===void 0)r=e,this.u="",this.t={0:r};else{const o=this.p(e);if(o===void 0)throw Error("No route found for "+e);const s=ns(o).exec({pathname:e}),i=s?.pathname.groups??{};if(r=as(i),typeof o.enter=="function"&&await o.enter(i)===!1)return;this.v=o,this.t=i,this.u=r===void 0?e:e.substring(0,e.length-r.length)}if(r!==void 0)for(const o of this.o)o.goto(r);this.l.requestUpdate()}outlet(){return this.v?.render?.(this.t)}get params(){return this.t}p(e){const r=this.routes.find((o=>ns(o).test({pathname:e})));return r||this.fallback===void 0?r:this.fallback?{...this.fallback,path:"/*"}:void 0}hostConnected(){this.l.addEventListener(Br.eventName,this.i);const e=new Br(this);this.l.dispatchEvent(e),this._=e.onDisconnect}hostDisconnected(){this._?.(),this.h=void 0}};const as=t=>{let e;for(const r of Object.keys(t))/\d+/.test(r)&&(e===void 0||r>e)&&(e=r);return e&&t[e]};let Br=class Di extends Event{constructor(e){super(Di.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.routes=e}};Br.eventName="lit-routes-connected";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ac=location.origin||location.protocol+"//"+location.host;class Pc extends kc{constructor(){super(...arguments),this.m=e=>{const r=e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey;if(e.defaultPrevented||r)return;const o=e.composedPath().find((n=>n.tagName==="A"));if(o===void 0||o.target!==""||o.hasAttribute("download")||o.getAttribute("rel")==="external")return;const s=o.href;if(s===""||s.startsWith("mailto:"))return;const i=window.location;o.origin===Ac&&(e.preventDefault(),s!==i.href&&(window.history.pushState({},"",s),this.goto(o.pathname)))},this.R=e=>{this.goto(window.location.pathname)}}hostConnected(){super.hostConnected(),window.addEventListener("click",this.m),window.addEventListener("popstate",this.R),this.goto(window.location.pathname)}hostDisconnected(){super.hostDisconnected(),window.removeEventListener("click",this.m),window.removeEventListener("popstate",this.R)}}class Oc extends Pc{constructor(){super(...arguments),this.pathname=zr(void 0),this.fragment=zr(void 0)}async goto(e){const r=e.replace(/\/$/,"");await super.goto(r),this.pathname.set(r),this.fragment.set(location.hash.replace(/^#/,""))}}const Ii="app-theme",Tc=ie(Ze("light"),Ze("dark"));function Rc(){return Tc.value(localStorage.getItem(Ii))}function Lc(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}class zc{constructor(){this.activeTheme=zr(Rc()??Lc()),this.toggle=()=>{const e=this.activeTheme.get()==="dark"?"light":"dark";this.activeTheme.set(e),localStorage.setItem(Ii,e)}}}var Nc=Object.getOwnPropertyDescriptor,Dc=(t,e,r,o)=>{for(var s=o>1?void 0:o?Nc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=n(s)||s);return s};let ls=class extends Wt(Ht){constructor(){super(...arguments),this.theme=new zc,this.blog=new Sc,this.router=new Oc(this,[{path:"{/}?",render:()=>k`
        <app-post-list
          .tags=${["family","climbing","gaming","anime"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `},{path:"/family{/}?",render:()=>k`
        <app-post-list
          .tags=${["family"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `},{path:"/climbing{/}?",render:()=>k`
        <app-post-list
          .tags=${["climbing"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `},{path:"/gaming{/}?",render:()=>k`
        <app-post-list
          .tags=${["gaming"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `},{path:"/anime{/}?",render:()=>k`
        <app-post-list
          .tags=${["anime"]}
          .posts=${this.blog.posts}
        ></app-post-list>
      `},{path:"/*",render:()=>k`
        <app-post-list .tags=${[]} .posts=${this.blog.posts}></app-post-list>
      `}])}render(){const{pathname:t,fragment:e}=this.router,{meta:r}=this.blog,{activeTheme:o,toggle:s}=this.theme;return k`
      <main>
        <div>
          <app-header
            .pathname=${t}
            .meta=${r}
            .activeTheme=${o}
            .toggleTheme=${s}
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
    `}};ls=Dc([Ft("app-root")],ls);var Ic=Object.defineProperty,Mc=Object.getOwnPropertyDescriptor,Mi=(t,e,r,o)=>{for(var s=o>1?void 0:o?Mc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Ic(e,r,s),s};let Vr=class extends Wt(Ht){updated(){switch(this.meta?.state){case"REJECTED":{document.title="error";return}case"RESOLVED":{document.title=this.meta.value?.title??"",Hs(k`<link rel="icon" type="image/png" href=${this.meta.value?.avatar??""}></link>`,document.head);return}}}};Mi([f({attribute:!1})],Vr.prototype,"meta",2);Vr=Mi([Ft("app-document")],Vr);var Bc=Object.defineProperty,Vc=Object.getOwnPropertyDescriptor,Bi=(t,e,r,o)=>{for(var s=o>1?void 0:o?Vc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Bc(e,r,s),s};let Ur=class extends Wt(Ht){render(){switch(this.meta?.state){case"RESOLVED":{const t=this.meta?.value?.updated??0,e=new Date(t*1e3).toISOString();return k`
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
              <sl-button @click=${()=>window.scrollTo(0,0)}
                >scroll up</sl-button
              >
            </div>
          </footer>
        `}default:return k`
          <footer>
            <div></div>
            <div>
              <sl-button @click=${()=>window.scrollTo(0,0)}
                >scroll up</sl-button
              >
            </div>
          </footer>
        `}}};Bi([f({attribute:!1})],Ur.prototype,"meta",2);Ur=Bi([Ft("app-footer")],Ur);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const cs=(t,e,r)=>{const o=new Map;for(let s=e;s<=r;s++)o.set(t[s],s);return o},Fr=Ee(class extends Se{constructor(t){if(super(t),t.type!==ct.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,e,r){let o;r===void 0?r=e:e!==void 0&&(o=e);const s=[],i=[];let n=0;for(const a of t)s[n]=o?o(a,n):n,i[n]=r(a,n),n++;return{values:i,keys:s}}render(t,e,r){return this.dt(t,e,r).values}update(t,[e,r,o]){const s=Hn(t),{values:i,keys:n}=this.dt(e,r,o);if(!Array.isArray(s))return this.ut=n,i;const a=this.ut??=[],l=[];let c,d,u=0,m=s.length-1,h=0,g=i.length-1;for(;u<=m&&h<=g;)if(s[u]===null)u++;else if(s[m]===null)m--;else if(a[u]===n[h])l[h]=Rt(s[u],i[h]),u++,h++;else if(a[m]===n[g])l[g]=Rt(s[m],i[g]),m--,g--;else if(a[u]===n[g])l[g]=Rt(s[u],i[g]),me(t,l[g+1],s[u]),u++,g--;else if(a[m]===n[h])l[h]=Rt(s[m],i[h]),me(t,s[u],s[m]),m--,h++;else if(c===void 0&&(c=cs(n,h,g),d=cs(a,u,m)),c.has(a[u]))if(c.has(a[m])){const b=d.get(n[h]),E=b!==void 0?s[b]:null;if(E===null){const $=me(t,s[u]);Rt($,i[h]),l[h]=$}else l[h]=Rt(E,i[h]),me(t,s[u],E),s[b]=null;h++}else fr(s[m]),m--;else fr(s[u]),u++;for(;h<=g;){const b=me(t,l[g+1]);Rt(b,i[h]),l[h++]=b}for(;u<=m;){const b=s[u++];b!==null&&fr(b)}return this.ut=n,Xs(t,l),X}});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class jr extends Se{constructor(e){if(super(e),this.it=z,e.type!==ct.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===z||e==null)return this._t=void 0,this.it=e;if(e===X)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}}jr.directiveName="unsafeHTML",jr.resultType=1;const Wr=Ee(jr);var Uc=Object.defineProperty,Fc=Object.getOwnPropertyDescriptor,Pe=(t,e,r,o)=>{for(var s=o>1?void 0:o?Fc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Uc(e,r,s),s};const jc=[{label:"Home",href:"/"},{label:"Family",href:"/family"},{label:"Climbing",href:"/climbing"},{label:"Gaming",href:"/gaming"},{label:"Anime",href:"/anime"},{label:"Source",href:"https://github.com/defevan/dadmaxxing"}];let ne=class extends Wt(Ht){typographyElements(){switch(this.meta?.state){case"REJECTED":{const t=k`<h1>error</h1>`,e=k`<p>uh, big issue, failed to get the blog meta data</p>`;return{h1:t,p:e}}default:{const t=this.meta?.value?k`<h1>${this.meta.value.title}</h1>`:k`<h1>${Wr("&nbsp;")}</h1>`,e=this.meta?.value?k`<p>${this.meta.value.description}</p>`:k`<p>${Wr("&nbsp;")}</p>`;return{h1:t,p:e}}}}render(){const{h1:t,p:e}=this.typographyElements(),r=Fr(jc,o=>o.href,o=>this.renderLink(o));return k`
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
    `}renderLink({href:t,label:e}){if(t.includes("https://"))return k`<a href=${t}>${e}</a>`;const r=(this.pathname?.get()||"/")===t;return k`<a href=${t} ?active=${r}>${e}</a>`}};Pe([f({attribute:!1})],ne.prototype,"pathname",2);Pe([f({attribute:!1})],ne.prototype,"meta",2);Pe([f({attribute:!1})],ne.prototype,"activeTheme",2);Pe([f({attribute:!1})],ne.prototype,"toggleTheme",2);ne=Pe([Ft("app-header")],ne);var Wc=Object.defineProperty,Hc=Object.getOwnPropertyDescriptor,xo=(t,e,r,o)=>{for(var s=o>1?void 0:o?Hc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Wc(e,r,s),s};class Vi extends CustomEvent{constructor(e,r={bubbles:!0,composed:!0}){super("cards",{...r,detail:e})}}let Xe=class extends Wt(Ht){updated(){const t=this.querySelectorAll("div.card");this.dispatchEvent(new Vi(t))}render(){switch(this.posts?.state){case"RESOLVED":{const e=(this.posts.value??[]).filter(r=>r.tags.some(o=>this.tags?.includes(o)));return e.length<1?k`
            <div class="msg">¯\\_(ツ)_/¯ 404 i couldn't find the thing</div>
          `:Fr(e,r=>r.id,(r,o)=>this.renderPost(r,e.length-1===o))}case"REJECTED":return k`
          <div class="msg">(x_x) 500 something went horribly wrong</div>
        `;default:return null}}renderPost(t,e){const r=new Date(t.date),o=`${location.origin}${location.pathname}#${t.id}`;return k`
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
      ${e?null:k`<sl-divider></sl-divider>`}
    `}renderTags(t){return Fr(t,e=>e,e=>{const r=`/${e}`,o=`#${e}`;return k`
          <a href=${r}>
            <sl-tag pill>${o}</sl-tag>
          </a>
        `})}renderPostBody(t){const r=new DOMParser().parseFromString(t,"text/html");for(const o of r.querySelectorAll("figure")){const s=parseFloat(o.getAttribute("data-orig-height")??""),i=parseFloat(o.getAttribute("data-orig-width")??"");if(isNaN(s)||isNaN(i)){console.warn("failed to set img/video aspect ratio");continue}const n=[...o.querySelectorAll("img"),...o.querySelectorAll("video")];for(const a of n)a.style.aspectRatio=`${i} / ${s}`,a.style.backgroundColor="rgba(128, 128, 128, 0.1)"}return Wr(r.body.innerHTML)}};xo([f({attribute:!1})],Xe.prototype,"tags",2);xo([f({attribute:!1})],Xe.prototype,"posts",2);Xe=xo([Ft("app-post-list")],Xe);var qc=Object.defineProperty,Kc=Object.getOwnPropertyDescriptor,ur=(t,e,r,o)=>{for(var s=o>1?void 0:o?Kc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&qc(e,r,s),s};let Ce=class extends Wt(Ht){handleCards(t){t instanceof Vi&&(this.cards=t.detail)}connectedCallback(){super.connectedCallback(),this.addEventListener("cards",this.handleCards)}disconnectedCallback(){this.removeEventListener("cards",this.handleCards),super.disconnectedCallback()}async updated(){const t=this.fragment?.get(),e=this.cards;if(!e||e.length<1)return;const r=Array.from(e).find(o=>o.id===t);await new Promise(o=>requestIdleCallback(o)),r?r.scrollIntoView({behavior:"auto",block:"start",inline:"nearest"}):window.scrollTo(0,0)}render(){return Ll`<slot></slot>`}};ur([f({attribute:!1})],Ce.prototype,"pathname",2);ur([f({attribute:!1})],Ce.prototype,"fragment",2);ur([At()],Ce.prototype,"cards",2);Ce=ur([Ft("app-scroller")],Ce);var Gc=Object.defineProperty,Zc=Object.getOwnPropertyDescriptor,Ui=(t,e,r,o)=>{for(var s=o>1?void 0:o?Zc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Gc(e,r,s),s};let Hr=class extends Wt(Ht){updated(){this.activeTheme?.get()==="dark"?document.documentElement.classList.add("sl-theme-dark"):document.documentElement.classList.remove("sl-theme-dark")}};Ui([f({attribute:!1})],Hr.prototype,"activeTheme",2);Hr=Ui([Ft("app-theme")],Hr);
