(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function r(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(s){if(s.ep)return;s.ep=!0;const i=r(s);fetch(s.href,i)}})();var Vi=Object.defineProperty,C=(t,e)=>Vi(t,"name",{value:e,configurable:!0}),Yt=class{type=3;name="";prefix="";value="";suffix="";modifier=3;constructor(e,r,o,s,i,n){this.type=e,this.name=r,this.prefix=o,this.value=s,this.suffix=i,this.modifier=n}hasCustomName(){return this.name!==""&&typeof this.name!="number"}};C(Yt,"Part");var Ui=/[$_\p{ID_Start}]/u,Fi=/[$_\u200C\u200D\p{ID_Continue}]/u,xr=".*";function cs(t,e){return(e?/^[\x00-\xFF]*$/:/^[\x00-\x7F]*$/).test(t)}C(cs,"isASCII");function Wr(t,e=!1){let r=[],o=0;for(;o<t.length;){let s=t[o],i=C(function(n){if(!e)throw new TypeError(n);r.push({type:"INVALID_CHAR",index:o,value:t[o++]})},"ErrorOrInvalid");if(s==="*"){r.push({type:"ASTERISK",index:o,value:t[o++]});continue}if(s==="+"||s==="?"){r.push({type:"OTHER_MODIFIER",index:o,value:t[o++]});continue}if(s==="\\"){r.push({type:"ESCAPED_CHAR",index:o++,value:t[o++]});continue}if(s==="{"){r.push({type:"OPEN",index:o,value:t[o++]});continue}if(s==="}"){r.push({type:"CLOSE",index:o,value:t[o++]});continue}if(s===":"){let n="",a=o+1;for(;a<t.length;){let l=t.substr(a,1);if(a===o+1&&Ui.test(l)||a!==o+1&&Fi.test(l)){n+=t[a++];continue}break}if(!n){i(`Missing parameter name at ${o}`);continue}r.push({type:"NAME",index:o,value:n}),o=a;continue}if(s==="("){let n=1,a="",l=o+1,c=!1;if(t[l]==="?"){i(`Pattern cannot start with "?" at ${l}`);continue}for(;l<t.length;){if(!cs(t[l],!1)){i(`Invalid character '${t[l]}' at ${l}.`),c=!0;break}if(t[l]==="\\"){a+=t[l++]+t[l++];continue}if(t[l]===")"){if(n--,n===0){l++;break}}else if(t[l]==="("&&(n++,t[l+1]!=="?")){i(`Capturing groups are not allowed at ${l}`),c=!0;break}a+=t[l++]}if(c)continue;if(n){i(`Unbalanced pattern at ${o}`);continue}if(!a){i(`Missing pattern at ${o}`);continue}r.push({type:"REGEX",index:o,value:a}),o=l;continue}r.push({type:"CHAR",index:o,value:t[o++]})}return r.push({type:"END",index:o,value:""}),r}C(Wr,"lexer");function qr(t,e={}){let r=Wr(t);e.delimiter??="/#?",e.prefixes??="./";let o=`[^${K(e.delimiter)}]+?`,s=[],i=0,n=0,a=new Set,l=C(x=>{if(n<r.length&&r[n].type===x)return r[n++].value},"tryConsume"),c=C(()=>l("OTHER_MODIFIER")??l("ASTERISK"),"tryConsumeModifier"),d=C(x=>{let v=l(x);if(v!==void 0)return v;let{type:_,index:y}=r[n];throw new TypeError(`Unexpected ${_} at ${y}, expected ${x}`)},"mustConsume"),u=C(()=>{let x="",v;for(;v=l("CHAR")??l("ESCAPED_CHAR");)x+=v;return x},"consumeText"),m=C(x=>x,"DefaultEncodePart"),h=e.encodePart||m,g="",b=C(x=>{g+=x},"appendToPendingFixedValue"),E=C(()=>{g.length&&(s.push(new Yt(3,"","",h(g),"",3)),g="")},"maybeAddPartFromPendingFixedValue"),$=C((x,v,_,y,A)=>{let P=3;switch(A){case"?":P=1;break;case"*":P=0;break;case"+":P=2;break}if(!v&&!_&&P===3){b(x);return}if(E(),!v&&!_){if(!x)return;s.push(new Yt(3,"","",h(x),"",P));return}let R;_?_==="*"?R=xr:R=_:R=o;let I=2;R===o?(I=1,R=""):R===xr&&(I=0,R="");let N;if(v?N=v:_&&(N=i++),a.has(N))throw new TypeError(`Duplicate name '${N}'.`);a.add(N),s.push(new Yt(I,N,h(x),R,h(y),P))},"addPart");for(;n<r.length;){let x=l("CHAR"),v=l("NAME"),_=l("REGEX");if(!v&&!_&&(_=l("ASTERISK")),v||_){let A=x??"";e.prefixes.indexOf(A)===-1&&(b(A),A=""),E();let P=c();$(A,v,_,"",P);continue}let y=x??l("ESCAPED_CHAR");if(y){b(y);continue}if(l("OPEN")){let A=u(),P=l("NAME"),R=l("REGEX");!P&&!R&&(R=l("ASTERISK"));let I=u();d("CLOSE");let N=c();$(A,P,R,I,N);continue}E(),d("END")}return s}C(qr,"parse");function K(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}C(K,"escapeString");function Cr(t){return t&&t.ignoreCase?"ui":"u"}C(Cr,"flags");function us(t,e,r){return Kr(qr(t,r),e,r)}C(us,"stringToRegexp");function Lt(t){switch(t){case 0:return"*";case 1:return"?";case 2:return"+";case 3:return""}}C(Lt,"modifierToString");function Kr(t,e,r={}){r.delimiter??="/#?",r.prefixes??="./",r.sensitive??=!1,r.strict??=!1,r.end??=!0,r.start??=!0,r.endsWith="";let o=r.start?"^":"";for(let a of t){if(a.type===3){a.modifier===3?o+=K(a.value):o+=`(?:${K(a.value)})${Lt(a.modifier)}`;continue}e&&e.push(a.name);let l=`[^${K(r.delimiter)}]+?`,c=a.value;if(a.type===1?c=l:a.type===0&&(c=xr),!a.prefix.length&&!a.suffix.length){a.modifier===3||a.modifier===1?o+=`(${c})${Lt(a.modifier)}`:o+=`((?:${c})${Lt(a.modifier)})`;continue}if(a.modifier===3||a.modifier===1){o+=`(?:${K(a.prefix)}(${c})${K(a.suffix)})`,o+=Lt(a.modifier);continue}o+=`(?:${K(a.prefix)}`,o+=`((?:${c})(?:`,o+=K(a.suffix),o+=K(a.prefix),o+=`(?:${c}))*)${K(a.suffix)})`,a.modifier===0&&(o+="?")}let s=`[${K(r.endsWith)}]|$`,i=`[${K(r.delimiter)}]`;if(r.end)return r.strict||(o+=`${i}?`),r.endsWith.length?o+=`(?=${s})`:o+="$",new RegExp(o,Cr(r));r.strict||(o+=`(?:${i}(?=${s}))?`);let n=!1;if(t.length){let a=t[t.length-1];a.type===3&&a.modifier===3&&(n=r.delimiter.indexOf(a)>-1)}return n||(o+=`(?=${i}|${s})`),new RegExp(o,Cr(r))}C(Kr,"partsToRegexp");var $t={delimiter:"",prefixes:"",sensitive:!0,strict:!0},ji={delimiter:".",prefixes:"",sensitive:!0,strict:!0},Hi={delimiter:"/",prefixes:"/",sensitive:!0,strict:!0};function hs(t,e){return t.length?t[0]==="/"?!0:!e||t.length<2?!1:(t[0]=="\\"||t[0]=="{")&&t[1]=="/":!1}C(hs,"isAbsolutePathname");function Gr(t,e){return t.startsWith(e)?t.substring(e.length,t.length):t}C(Gr,"maybeStripPrefix");function ds(t,e){return t.endsWith(e)?t.substr(0,t.length-e.length):t}C(ds,"maybeStripSuffix");function Zr(t){return!t||t.length<2?!1:t[0]==="["||(t[0]==="\\"||t[0]==="{")&&t[1]==="["}C(Zr,"treatAsIPv6Hostname");var ps=["ftp","file","http","https","ws","wss"];function Xr(t){if(!t)return!0;for(let e of ps)if(t.test(e))return!0;return!1}C(Xr,"isSpecialScheme");function fs(t,e){if(t=Gr(t,"#"),e||t==="")return t;let r=new URL("https://example.com");return r.hash=t,r.hash?r.hash.substring(1,r.hash.length):""}C(fs,"canonicalizeHash");function ms(t,e){if(t=Gr(t,"?"),e||t==="")return t;let r=new URL("https://example.com");return r.search=t,r.search?r.search.substring(1,r.search.length):""}C(ms,"canonicalizeSearch");function gs(t,e){return e||t===""?t:Zr(t)?Qr(t):Yr(t)}C(gs,"canonicalizeHostname");function bs(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.password=t,r.password}C(bs,"canonicalizePassword");function vs(t,e){if(e||t==="")return t;let r=new URL("https://example.com");return r.username=t,r.username}C(vs,"canonicalizeUsername");function ys(t,e,r){if(r||t==="")return t;if(e&&!ps.includes(e))return new URL(`${e}:${t}`).pathname;let o=t[0]=="/";return t=new URL(o?t:"/-"+t,"https://example.com").pathname,o||(t=t.substring(2,t.length)),t}C(ys,"canonicalizePathname");function ws(t,e,r){return Jr(e)===t&&(t=""),r||t===""?t:to(t)}C(ws,"canonicalizePort");function _s(t,e){return t=ds(t,":"),e||t===""?t:Ze(t)}C(_s,"canonicalizeProtocol");function Jr(t){switch(t){case"ws":case"http":return"80";case"wws":case"https":return"443";case"ftp":return"21";default:return""}}C(Jr,"defaultPortForProtocol");function Ze(t){if(t==="")return t;if(/^[-+.A-Za-z0-9]*$/.test(t))return t.toLowerCase();throw new TypeError(`Invalid protocol '${t}'.`)}C(Ze,"protocolEncodeCallback");function $s(t){if(t==="")return t;let e=new URL("https://example.com");return e.username=t,e.username}C($s,"usernameEncodeCallback");function xs(t){if(t==="")return t;let e=new URL("https://example.com");return e.password=t,e.password}C(xs,"passwordEncodeCallback");function Yr(t){if(t==="")return t;if(/[\t\n\r #%/:<>?@[\]^\\|]/g.test(t))throw new TypeError(`Invalid hostname '${t}'`);let e=new URL("https://example.com");return e.hostname=t,e.hostname}C(Yr,"hostnameEncodeCallback");function Qr(t){if(t==="")return t;if(/[^0-9a-fA-F[\]:]/g.test(t))throw new TypeError(`Invalid IPv6 hostname '${t}'`);return t.toLowerCase()}C(Qr,"ipv6HostnameEncodeCallback");function to(t){if(t===""||/^[0-9]*$/.test(t)&&parseInt(t)<=65535)return t;throw new TypeError(`Invalid port '${t}'.`)}C(to,"portEncodeCallback");function Cs(t){if(t==="")return t;let e=new URL("https://example.com");return e.pathname=t[0]!=="/"?"/-"+t:t,t[0]!=="/"?e.pathname.substring(2,e.pathname.length):e.pathname}C(Cs,"standardURLPathnameEncodeCallback");function Es(t){return t===""?t:new URL(`data:${t}`).pathname}C(Es,"pathURLPathnameEncodeCallback");function ks(t){if(t==="")return t;let e=new URL("https://example.com");return e.search=t,e.search.substring(1,e.search.length)}C(ks,"searchEncodeCallback");function Ss(t){if(t==="")return t;let e=new URL("https://example.com");return e.hash=t,e.hash.substring(1,e.hash.length)}C(Ss,"hashEncodeCallback");var As=class{#s;#r=[];#o={};#t=0;#e=1;#l=0;#a=0;#p=0;#f=0;#m=!1;constructor(e){this.#s=e}get result(){return this.#o}parse(){for(this.#r=Wr(this.#s,!0);this.#t<this.#r.length;this.#t+=this.#e){if(this.#e=1,this.#r[this.#t].type==="END"){if(this.#a===0){this.#y(),this.#u()?this.#i(9,1):this.#h()?this.#i(8,1):this.#i(7,0);continue}else if(this.#a===2){this.#d(5);continue}this.#i(10,0);break}if(this.#p>0)if(this.#k())this.#p-=1;else continue;if(this.#E()){this.#p+=1;continue}switch(this.#a){case 0:this.#w()&&this.#d(1);break;case 1:if(this.#w()){this.#P();let e=7,r=1;this.#$()?(e=2,r=3):this.#m&&(e=2),this.#i(e,r)}break;case 2:this.#b()?this.#d(3):(this.#v()||this.#h()||this.#u())&&this.#d(5);break;case 3:this.#x()?this.#i(4,1):this.#b()&&this.#i(5,1);break;case 4:this.#b()&&this.#i(5,1);break;case 5:this.#S()?this.#f+=1:this.#A()&&(this.#f-=1),this.#C()&&!this.#f?this.#i(6,1):this.#v()?this.#i(7,0):this.#h()?this.#i(8,1):this.#u()&&this.#i(9,1);break;case 6:this.#v()?this.#i(7,0):this.#h()?this.#i(8,1):this.#u()&&this.#i(9,1);break;case 7:this.#h()?this.#i(8,1):this.#u()&&this.#i(9,1);break;case 8:this.#u()&&this.#i(9,1);break}}this.#o.hostname!==void 0&&this.#o.port===void 0&&(this.#o.port="")}#i(e,r){switch(this.#a){case 0:break;case 1:this.#o.protocol=this.#c();break;case 2:break;case 3:this.#o.username=this.#c();break;case 4:this.#o.password=this.#c();break;case 5:this.#o.hostname=this.#c();break;case 6:this.#o.port=this.#c();break;case 7:this.#o.pathname=this.#c();break;case 8:this.#o.search=this.#c();break;case 9:this.#o.hash=this.#c();break}this.#a!==0&&e!==10&&([1,2,3,4].includes(this.#a)&&[6,7,8,9].includes(e)&&(this.#o.hostname??=""),[1,2,3,4,5,6].includes(this.#a)&&[8,9].includes(e)&&(this.#o.pathname??=this.#m?"/":""),[1,2,3,4,5,6,7].includes(this.#a)&&e===9&&(this.#o.search??="")),this.#_(e,r)}#_(e,r){this.#a=e,this.#l=this.#t+r,this.#t+=r,this.#e=0}#y(){this.#t=this.#l,this.#e=0}#d(e){this.#y(),this.#a=e}#g(e){return e<0&&(e=this.#r.length-e),e<this.#r.length?this.#r[e]:this.#r[this.#r.length-1]}#n(e,r){let o=this.#g(e);return o.value===r&&(o.type==="CHAR"||o.type==="ESCAPED_CHAR"||o.type==="INVALID_CHAR")}#w(){return this.#n(this.#t,":")}#$(){return this.#n(this.#t+1,"/")&&this.#n(this.#t+2,"/")}#b(){return this.#n(this.#t,"@")}#x(){return this.#n(this.#t,":")}#C(){return this.#n(this.#t,":")}#v(){return this.#n(this.#t,"/")}#h(){if(this.#n(this.#t,"?"))return!0;if(this.#r[this.#t].value!=="?")return!1;let e=this.#g(this.#t-1);return e.type!=="NAME"&&e.type!=="REGEX"&&e.type!=="CLOSE"&&e.type!=="ASTERISK"}#u(){return this.#n(this.#t,"#")}#E(){return this.#r[this.#t].type=="OPEN"}#k(){return this.#r[this.#t].type=="CLOSE"}#S(){return this.#n(this.#t,"[")}#A(){return this.#n(this.#t,"]")}#c(){let e=this.#r[this.#t],r=this.#g(this.#l).index;return this.#s.substring(r,e.index)}#P(){let e={};Object.assign(e,$t),e.encodePart=Ze;let r=us(this.#c(),void 0,e);this.#m=Xr(r)}};C(As,"Parser");var hr=["protocol","username","password","hostname","port","pathname","search","hash"],_t="*";function Er(t,e){if(typeof t!="string")throw new TypeError("parameter 1 is not of type 'string'.");let r=new URL(t,e);return{protocol:r.protocol.substring(0,r.protocol.length-1),username:r.username,password:r.password,hostname:r.hostname,port:r.port,pathname:r.pathname,search:r.search!==""?r.search.substring(1,r.search.length):void 0,hash:r.hash!==""?r.hash.substring(1,r.hash.length):void 0}}C(Er,"extractValues");function lt(t,e){return e?Zt(t):t}C(lt,"processBaseURLString");function Kt(t,e,r){let o;if(typeof e.baseURL=="string")try{o=new URL(e.baseURL),e.protocol===void 0&&(t.protocol=lt(o.protocol.substring(0,o.protocol.length-1),r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&(t.username=lt(o.username,r)),!r&&e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.username===void 0&&e.password===void 0&&(t.password=lt(o.password,r)),e.protocol===void 0&&e.hostname===void 0&&(t.hostname=lt(o.hostname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&(t.port=lt(o.port,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&(t.pathname=lt(o.pathname,r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&(t.search=lt(o.search.substring(1,o.search.length),r)),e.protocol===void 0&&e.hostname===void 0&&e.port===void 0&&e.pathname===void 0&&e.search===void 0&&e.hash===void 0&&(t.hash=lt(o.hash.substring(1,o.hash.length),r))}catch{throw new TypeError(`invalid baseURL '${e.baseURL}'.`)}if(typeof e.protocol=="string"&&(t.protocol=_s(e.protocol,r)),typeof e.username=="string"&&(t.username=vs(e.username,r)),typeof e.password=="string"&&(t.password=bs(e.password,r)),typeof e.hostname=="string"&&(t.hostname=gs(e.hostname,r)),typeof e.port=="string"&&(t.port=ws(e.port,t.protocol,r)),typeof e.pathname=="string"){if(t.pathname=e.pathname,o&&!hs(t.pathname,r)){let s=o.pathname.lastIndexOf("/");s>=0&&(t.pathname=lt(o.pathname.substring(0,s+1),r)+t.pathname)}t.pathname=ys(t.pathname,t.protocol,r)}return typeof e.search=="string"&&(t.search=ms(e.search,r)),typeof e.hash=="string"&&(t.hash=fs(e.hash,r)),t}C(Kt,"applyInit");function Zt(t){return t.replace(/([+*?:{}()\\])/g,"\\$1")}C(Zt,"escapePatternString");function Ps(t){return t.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}C(Ps,"escapeRegexpString");function Os(t,e){e.delimiter??="/#?",e.prefixes??="./",e.sensitive??=!1,e.strict??=!1,e.end??=!0,e.start??=!0,e.endsWith="";let r=".*",o=`[^${Ps(e.delimiter)}]+?`,s=/[$_\u200C\u200D\p{ID_Continue}]/u,i="";for(let n=0;n<t.length;++n){let a=t[n];if(a.type===3){if(a.modifier===3){i+=Zt(a.value);continue}i+=`{${Zt(a.value)}}${Lt(a.modifier)}`;continue}let l=a.hasCustomName(),c=!!a.suffix.length||!!a.prefix.length&&(a.prefix.length!==1||!e.prefixes.includes(a.prefix)),d=n>0?t[n-1]:null,u=n<t.length-1?t[n+1]:null;if(!c&&l&&a.type===1&&a.modifier===3&&u&&!u.prefix.length&&!u.suffix.length)if(u.type===3){let m=u.value.length>0?u.value[0]:"";c=s.test(m)}else c=!u.hasCustomName();if(!c&&!a.prefix.length&&d&&d.type===3){let m=d.value[d.value.length-1];c=e.prefixes.includes(m)}c&&(i+="{"),i+=Zt(a.prefix),l&&(i+=`:${a.name}`),a.type===2?i+=`(${a.value})`:a.type===1?l||(i+=`(${o})`):a.type===0&&(!l&&(!d||d.type===3||d.modifier!==3||c||a.prefix!=="")?i+="*":i+=`(${r})`),a.type===1&&l&&a.suffix.length&&s.test(a.suffix[0])&&(i+="\\"),i+=Zt(a.suffix),c&&(i+="}"),a.modifier!==3&&(i+=Lt(a.modifier))}return i}C(Os,"partsToPattern");var Ts=class{#s;#r={};#o={};#t={};#e={};#l=!1;constructor(t={},e,r){try{let o;if(typeof e=="string"?o=e:r=e,typeof t=="string"){let a=new As(t);if(a.parse(),t=a.result,o===void 0&&typeof t.protocol!="string")throw new TypeError("A base URL must be provided for a relative constructor string.");t.baseURL=o}else{if(!t||typeof t!="object")throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");if(o)throw new TypeError("parameter 1 is not of type 'string'.")}typeof r>"u"&&(r={ignoreCase:!1});let s={ignoreCase:r.ignoreCase===!0},i={pathname:_t,protocol:_t,username:_t,password:_t,hostname:_t,port:_t,search:_t,hash:_t};this.#s=Kt(i,t,!0),Jr(this.#s.protocol)===this.#s.port&&(this.#s.port="");let n;for(n of hr){if(!(n in this.#s))continue;let a={},l=this.#s[n];switch(this.#o[n]=[],n){case"protocol":Object.assign(a,$t),a.encodePart=Ze;break;case"username":Object.assign(a,$t),a.encodePart=$s;break;case"password":Object.assign(a,$t),a.encodePart=xs;break;case"hostname":Object.assign(a,ji),Zr(l)?a.encodePart=Qr:a.encodePart=Yr;break;case"port":Object.assign(a,$t),a.encodePart=to;break;case"pathname":Xr(this.#r.protocol)?(Object.assign(a,Hi,s),a.encodePart=Cs):(Object.assign(a,$t,s),a.encodePart=Es);break;case"search":Object.assign(a,$t,s),a.encodePart=ks;break;case"hash":Object.assign(a,$t,s),a.encodePart=Ss;break}try{this.#e[n]=qr(l,a),this.#r[n]=Kr(this.#e[n],this.#o[n],a),this.#t[n]=Os(this.#e[n],a),this.#l=this.#l||this.#e[n].some(c=>c.type===2)}catch{throw new TypeError(`invalid ${n} pattern '${this.#s[n]}'.`)}}}catch(o){throw new TypeError(`Failed to construct 'URLPattern': ${o.message}`)}}get[Symbol.toStringTag](){return"URLPattern"}test(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return!1;try{typeof t=="object"?r=Kt(r,t,!1):r=Kt(r,Er(t,e),!1)}catch{return!1}let o;for(o of hr)if(!this.#r[o].exec(r[o]))return!1;return!0}exec(t={},e){let r={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&e)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return;try{typeof t=="object"?r=Kt(r,t,!1):r=Kt(r,Er(t,e),!1)}catch{return null}let o={};e?o.inputs=[t,e]:o.inputs=[t];let s;for(s of hr){let i=this.#r[s].exec(r[s]);if(!i)return null;let n={};for(let[a,l]of this.#o[s].entries())if(typeof l=="string"||typeof l=="number"){let c=i[a+1];n[l]=c}o[s]={input:r[s]??"",groups:n}}return o}static compareComponent(t,e,r){let o=C((a,l)=>{for(let c of["type","modifier","prefix","value","suffix"]){if(a[c]<l[c])return-1;if(a[c]!==l[c])return 1}return 0},"comparePart"),s=new Yt(3,"","","","",3),i=new Yt(0,"","","","",3),n=C((a,l)=>{let c=0;for(;c<Math.min(a.length,l.length);++c){let d=o(a[c],l[c]);if(d)return d}return a.length===l.length?0:o(a[c]??s,l[c]??s)},"comparePartList");return!e.#t[t]&&!r.#t[t]?0:e.#t[t]&&!r.#t[t]?n(e.#e[t],[i]):!e.#t[t]&&r.#t[t]?n([i],r.#e[t]):n(e.#e[t],r.#e[t])}get protocol(){return this.#t.protocol}get username(){return this.#t.username}get password(){return this.#t.password}get hostname(){return this.#t.hostname}get port(){return this.#t.port}get pathname(){return this.#t.pathname}get search(){return this.#t.search}get hash(){return this.#t.hash}get hasRegExpGroups(){return this.#l}};C(Ts,"URLPattern");globalThis.URLPattern||(globalThis.URLPattern=Ts);const kr=new Set,Xt=new Map;let Rt,eo="ltr",ro="en";const Rs=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Rs){const t=new MutationObserver(zs);eo=document.documentElement.dir||"ltr",ro=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Ls(...t){t.map(e=>{const r=e.$code.toLowerCase();Xt.has(r)?Xt.set(r,Object.assign(Object.assign({},Xt.get(r)),e)):Xt.set(r,e),Rt||(Rt=e)}),zs()}function zs(){Rs&&(eo=document.documentElement.dir||"ltr",ro=document.documentElement.lang||navigator.language),[...kr.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}let Wi=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){kr.add(this.host)}hostDisconnected(){kr.delete(this.host)}dir(){return`${this.host.dir||eo}`.toLowerCase()}lang(){return`${this.host.lang||ro}`.toLowerCase()}getTranslationData(e){var r,o;const s=new Intl.Locale(e.replace(/_/g,"-")),i=s?.language.toLowerCase(),n=(o=(r=s?.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",a=Xt.get(`${i}-${n}`),l=Xt.get(i);return{locale:s,language:i,region:n,primary:a,secondary:l}}exists(e,r){var o;const{primary:s,secondary:i}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(s&&s[e]||i&&i[e]||r.includeFallback&&Rt&&Rt[e])}term(e,...r){const{primary:o,secondary:s}=this.getTranslationData(this.lang());let i;if(o&&o[e])i=o[e];else if(s&&s[e])i=s[e];else if(Rt&&Rt[e])i=Rt[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i=="function"?i(...r):i}date(e,r){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),r).format(e)}number(e,r){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),r).format(e)}relativeTime(e,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,r)}};var Ns={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};Ls(Ns);var qi=Ns,Bt=class extends Wi{};Ls(qi);var Ds=Object.defineProperty,Ki=Object.defineProperties,Gi=Object.getOwnPropertyDescriptor,Zi=Object.getOwnPropertyDescriptors,xo=Object.getOwnPropertySymbols,Xi=Object.prototype.hasOwnProperty,Ji=Object.prototype.propertyIsEnumerable,Ms=t=>{throw TypeError(t)},Co=(t,e,r)=>e in t?Ds(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Vt=(t,e)=>{for(var r in e||(e={}))Xi.call(e,r)&&Co(t,r,e[r]);if(xo)for(var r of xo(e))Ji.call(e,r)&&Co(t,r,e[r]);return t},Xe=(t,e)=>Ki(t,Zi(e)),p=(t,e,r,o)=>{for(var s=o>1?void 0:o?Gi(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Ds(e,r,s),s},Is=(t,e,r)=>e.has(t)||Ms("Cannot "+r),Yi=(t,e,r)=>(Is(t,e,"read from private field"),e.get(t)),Qi=(t,e,r)=>e.has(t)?Ms("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),tn=(t,e,r,o)=>(Is(t,e,"write to private field"),e.set(t,r),r);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Le=globalThis,oo=Le.ShadowRoot&&(Le.ShadyCSS===void 0||Le.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,so=Symbol(),Eo=new WeakMap;let Bs=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==so)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(oo&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=Eo.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&Eo.set(r,e))}return e}toString(){return this.cssText}};const en=t=>new Bs(typeof t=="string"?t:t+"",void 0,so),tt=(t,...e)=>{const r=t.length===1?t[0]:e.reduce(((o,s,i)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new Bs(r,t,so)},rn=(t,e)=>{if(oo)t.adoptedStyleSheets=e.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of e){const o=document.createElement("style"),s=Le.litNonce;s!==void 0&&o.setAttribute("nonce",s),o.textContent=r.cssText,t.appendChild(o)}},ko=oo?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return en(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:on,defineProperty:sn,getOwnPropertyDescriptor:nn,getOwnPropertyNames:an,getOwnPropertySymbols:ln,getPrototypeOf:cn}=Object,Je=globalThis,So=Je.trustedTypes,un=So?So.emptyScript:"",hn=Je.reactiveElementPolyfillSupport,ve=(t,e)=>t,ee={toAttribute(t,e){switch(e){case Boolean:t=t?un:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},io=(t,e)=>!on(t,e),Ao={attribute:!0,type:String,converter:ee,reflect:!1,useDefault:!1,hasChanged:io};Symbol.metadata??=Symbol("metadata"),Je.litPropertyMetadata??=new WeakMap;let Gt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Ao){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(e,o,r);s!==void 0&&sn(this.prototype,e,s)}}static getPropertyDescriptor(e,r,o){const{get:s,set:i}=nn(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:s,set(n){const a=s?.call(this);i?.call(this,n),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ao}static _$Ei(){if(this.hasOwnProperty(ve("elementProperties")))return;const e=cn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ve("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ve("properties"))){const r=this.properties,o=[...an(r),...ln(r)];for(const s of o)this.createProperty(s,r[s])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,s]of r)this.elementProperties.set(o,s)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const s=this._$Eu(r,o);s!==void 0&&this._$Eh.set(s,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const s of o)r.unshift(ko(s))}else e!==void 0&&r.push(ko(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rn(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){const o=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,o);if(s!==void 0&&o.reflect===!0){const i=(o.converter?.toAttribute!==void 0?o.converter:ee).toAttribute(r,o.type);this._$Em=e,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,r){const o=this.constructor,s=o._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const i=o.getPropertyOptions(s),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:ee;this._$Em=s;const a=n.fromAttribute(r,i.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,r,o){if(e!==void 0){const s=this.constructor,i=this[e];if(o??=s.getPropertyOptions(e),!((o.hasChanged??io)(i,r)||o.useDefault&&o.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:s,wrapped:i},n){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??r??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[s,i]of o){const{wrapped:n}=i,a=this[s];n!==!0||this._$AL.has(s)||a===void 0||this.C(s,void 0,i,a)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),this._$EO?.forEach((o=>o.hostUpdate?.())),this.update(r)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(r)}willUpdate(e){}_$AE(e){this._$EO?.forEach((r=>r.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};Gt.elementStyles=[],Gt.shadowRootOptions={mode:"open"},Gt[ve("elementProperties")]=new Map,Gt[ve("finalized")]=new Map,hn?.({ReactiveElement:Gt}),(Je.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const no=globalThis,Ie=no.trustedTypes,Po=Ie?Ie.createPolicy("lit-html",{createHTML:t=>t}):void 0,Vs="$lit$",xt=`lit$${Math.random().toFixed(9).slice(2)}$`,Us="?"+xt,dn=`<${Us}>`,Mt=document,we=()=>Mt.createComment(""),_e=t=>t===null||typeof t!="object"&&typeof t!="function",ao=Array.isArray,pn=t=>ao(t)||typeof t?.[Symbol.iterator]=="function",dr=`[ 	
\f\r]`,de=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Oo=/-->/g,To=/>/g,Ot=RegExp(`>|${dr}(?:([^\\s"'>=/]+)(${dr}*=${dr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ro=/'/g,Lo=/"/g,Fs=/^(?:script|style|textarea|title)$/i,fn=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),S=fn(1),Z=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),zo=new WeakMap,zt=Mt.createTreeWalker(Mt,129);function js(t,e){if(!ao(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Po!==void 0?Po.createHTML(e):e}const mn=(t,e)=>{const r=t.length-1,o=[];let s,i=e===2?"<svg>":e===3?"<math>":"",n=de;for(let a=0;a<r;a++){const l=t[a];let c,d,u=-1,m=0;for(;m<l.length&&(n.lastIndex=m,d=n.exec(l),d!==null);)m=n.lastIndex,n===de?d[1]==="!--"?n=Oo:d[1]!==void 0?n=To:d[2]!==void 0?(Fs.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=Ot):d[3]!==void 0&&(n=Ot):n===Ot?d[0]===">"?(n=s??de,u=-1):d[1]===void 0?u=-2:(u=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?Ot:d[3]==='"'?Lo:Ro):n===Lo||n===Ro?n=Ot:n===Oo||n===To?n=de:(n=Ot,s=void 0);const h=n===Ot&&t[a+1].startsWith("/>")?" ":"";i+=n===de?l+dn:u>=0?(o.push(c),l.slice(0,u)+Vs+l.slice(u)+xt+h):l+xt+(u===-2?a:h)}return[js(t,i+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class $e{constructor({strings:e,_$litType$:r},o){let s;this.parts=[];let i=0,n=0;const a=e.length-1,l=this.parts,[c,d]=mn(e,r);if(this.el=$e.createElement(c,o),zt.currentNode=this.el.content,r===2||r===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=zt.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Vs)){const m=d[n++],h=s.getAttribute(u).split(xt),g=/([.?@])?(.*)/.exec(m);l.push({type:1,index:i,name:g[2],strings:h,ctor:g[1]==="."?bn:g[1]==="?"?vn:g[1]==="@"?yn:Ye}),s.removeAttribute(u)}else u.startsWith(xt)&&(l.push({type:6,index:i}),s.removeAttribute(u));if(Fs.test(s.tagName)){const u=s.textContent.split(xt),m=u.length-1;if(m>0){s.textContent=Ie?Ie.emptyScript:"";for(let h=0;h<m;h++)s.append(u[h],we()),zt.nextNode(),l.push({type:2,index:++i});s.append(u[m],we())}}}else if(s.nodeType===8)if(s.data===Us)l.push({type:2,index:i});else{let u=-1;for(;(u=s.data.indexOf(xt,u+1))!==-1;)l.push({type:7,index:i}),u+=xt.length-1}i++}}static createElement(e,r){const o=Mt.createElement("template");return o.innerHTML=e,o}}function re(t,e,r=t,o){if(e===Z)return e;let s=o!==void 0?r._$Co?.[o]:r._$Cl;const i=_e(e)?void 0:e._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(t),s._$AT(t,r,o)),o!==void 0?(r._$Co??=[])[o]=s:r._$Cl=s),s!==void 0&&(e=re(t,s._$AS(t,e.values),s,o)),e}let gn=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,s=(e?.creationScope??Mt).importNode(r,!0);zt.currentNode=s;let i=zt.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new le(i,i.nextSibling,this,e):l.type===1?c=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(c=new wn(i,this,e)),this._$AV.push(c),l=o[++a]}n!==l?.index&&(i=zt.nextNode(),n++)}return zt.currentNode=Mt,s}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}};class le{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,r,o,s){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=re(this,e,r),_e(e)?e===z||e==null||e===""?(this._$AH!==z&&this._$AR(),this._$AH=z):e!==this._$AH&&e!==Z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):pn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==z&&_e(this._$AH)?this._$AA.nextSibling.data=e:this.T(Mt.createTextNode(e)),this._$AH=e}$(e){const{values:r,_$litType$:o}=e,s=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=$e.createElement(js(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===s)this._$AH.p(r);else{const i=new gn(s,this),n=i.u(this.options);i.p(r),this.T(n),this._$AH=i}}_$AC(e){let r=zo.get(e.strings);return r===void 0&&zo.set(e.strings,r=new $e(e)),r}k(e){ao(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,s=0;for(const i of e)s===r.length?r.push(o=new le(this.O(we()),this.O(we()),this,this.options)):o=r[s],o._$AI(i),s++;s<r.length&&(this._$AR(o&&o._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);e!==this._$AB;){const o=e.nextSibling;e.remove(),e=o}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class Ye{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,s,i){this.type=1,this._$AH=z,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=z}_$AI(e,r=this,o,s){const i=this.strings;let n=!1;if(i===void 0)e=re(this,e,r,0),n=!_e(e)||e!==this._$AH&&e!==Z,n&&(this._$AH=e);else{const a=e;let l,c;for(e=i[0],l=0;l<i.length-1;l++)c=re(this,a[o+l],r,l),c===Z&&(c=this._$AH[l]),n||=!_e(c)||c!==this._$AH[l],c===z?e=z:e!==z&&(e+=(c??"")+i[l+1]),this._$AH[l]=c}n&&!s&&this.j(e)}j(e){e===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class bn extends Ye{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===z?void 0:e}}class vn extends Ye{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==z)}}class yn extends Ye{constructor(e,r,o,s,i){super(e,r,o,s,i),this.type=5}_$AI(e,r=this){if((e=re(this,e,r,0)??z)===Z)return;const o=this._$AH,s=e===z&&o!==z||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==z&&(o===z||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class wn{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){re(this,e)}}const _n={I:le},$n=no.litHtmlPolyfillSupport;$n?.($e,le),(no.litHtmlVersions??=[]).push("3.3.1");const Hs=(t,e,r)=>{const o=r?.renderBefore??e;let s=o._$litPart$;if(s===void 0){const i=r?.renderBefore??null;o._$litPart$=s=new le(e.insertBefore(we(),i),i,void 0,r??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lo=globalThis;let Qt=class extends Gt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Hs(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}};Qt._$litElement$=!0,Qt.finalized=!0,lo.litElementHydrateSupport?.({LitElement:Qt});const xn=lo.litElementPolyfillSupport;xn?.({LitElement:Qt});(lo.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=t=>(e,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Cn={attribute:!0,type:String,converter:ee,reflect:!1,hasChanged:io},En=(t=Cn,e,r)=>{const{kind:o,metadata:s}=r;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),o==="accessor"){const{name:n}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t)}}throw Error("Unsupported decorator location: "+o)};function f(t){return(e,r)=>typeof r=="object"?En(t,e,r):((o,s,i)=>{const n=s.hasOwnProperty(i);return s.constructor.createProperty(i,o),n?Object.getOwnPropertyDescriptor(s,i):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ft(t){return f({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kn=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function et(t,e){return(r,o,s)=>{const i=n=>n.renderRoot?.querySelector(t)??null;return kn(r,o,{get(){return i(this)}})}}var ze,W=class extends Qt{constructor(){super(),Qi(this,ze,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){const r=new CustomEvent(t,Vt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(r),r}static define(t,e=this,r={}){const o=customElements.get(t);if(!o){try{customElements.define(t,e,r)}catch{customElements.define(t,class extends e{},r)}return}let s=" (unknown version)",i=s;"version"in e&&e.version&&(s=" v"+e.version),"version"in o&&o.version&&(i=" v"+o.version),!(s&&i&&s===i)&&console.warn(`Attempted to register <${t}>${s}, but <${t}>${i} has already been registered.`)}attributeChangedCallback(t,e,r){Yi(this,ze)||(this.constructor.elementProperties.forEach((o,s)=>{o.reflect&&this[s]!=null&&this.initialReflectedProperties.set(s,this[s])}),tn(this,ze,!0)),super.attributeChangedCallback(t,e,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,r)=>{t.has(r)&&this[r]==null&&(this[r]=e)})}};ze=new WeakMap;W.version="2.20.1";W.dependencies={};p([f()],W.prototype,"dir",2);p([f()],W.prototype,"lang",2);var Y=class extends W{constructor(){super(...arguments),this.localize=new Bt(this),this.date=new Date,this.hourFormat="auto"}render(){const t=new Date(this.date),e=this.hourFormat==="auto"?void 0:this.hourFormat==="12";if(!isNaN(t.getMilliseconds()))return S`
      <time datetime=${t.toISOString()}>
        ${this.localize.date(t,{weekday:this.weekday,era:this.era,year:this.year,month:this.month,day:this.day,hour:this.hour,minute:this.minute,second:this.second,timeZoneName:this.timeZoneName,timeZone:this.timeZone,hour12:e})}
      </time>
    `}};p([f()],Y.prototype,"date",2);p([f()],Y.prototype,"weekday",2);p([f()],Y.prototype,"era",2);p([f()],Y.prototype,"year",2);p([f()],Y.prototype,"month",2);p([f()],Y.prototype,"day",2);p([f()],Y.prototype,"hour",2);p([f()],Y.prototype,"minute",2);p([f()],Y.prototype,"second",2);p([f({attribute:"time-zone-name"})],Y.prototype,"timeZoneName",2);p([f({attribute:"time-zone"})],Y.prototype,"timeZone",2);p([f({attribute:"hour-format"})],Y.prototype,"hourFormat",2);Y.define("sl-format-date");var Sn=tt`
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
`;function bt(t,e){const r=Vt({waitUntilFirstUpdate:!1},e);return(o,s)=>{const{update:i}=o,n=Array.isArray(t)?t:[t];o.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const d=a.get(c),u=this[c];d!==u&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[s](d,u)}}),i.call(this,a)}}}var ht=tt`
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
`,Qe=class extends W{constructor(){super(...arguments),this.vertical=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","separator")}handleVerticalChange(){this.setAttribute("aria-orientation",this.vertical?"vertical":"horizontal")}};Qe.styles=[ht,Sn];p([f({type:Boolean,reflect:!0})],Qe.prototype,"vertical",2);p([bt("vertical")],Qe.prototype,"handleVerticalChange",1);Qe.define("sl-divider");var An=tt`
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
`,Ws=class extends W{constructor(){super(...arguments),this.localize=new Bt(this)}render(){return S`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};Ws.styles=[ht,An];var pe=new WeakMap,fe=new WeakMap,me=new WeakMap,pr=new WeakSet,Ae=new WeakMap,qs=class{constructor(t,e){this.handleFormData=r=>{const o=this.options.disabled(this.host),s=this.options.name(this.host),i=this.options.value(this.host),n=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!o&&!n&&typeof s=="string"&&s.length>0&&typeof i<"u"&&(Array.isArray(i)?i.forEach(a=>{r.formData.append(s,a.toString())}):r.formData.append(s,i.toString()))},this.handleFormSubmit=r=>{var o;const s=this.options.disabled(this.host),i=this.options.reportValidity;this.form&&!this.form.noValidate&&((o=pe.get(this.form))==null||o.forEach(n=>{this.setUserInteracted(n,!0)})),this.form&&!this.form.noValidate&&!s&&!i(this.host)&&(r.preventDefault(),r.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),Ae.set(this.host,[])},this.handleInteraction=r=>{const o=Ae.get(this.host);o.includes(r.type)||o.push(r.type),o.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.checkValidity=="function"&&!o.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.reportValidity=="function"&&!o.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=Vt({form:r=>{const o=r.form;if(o){const i=r.getRootNode().querySelector(`#${o}`);if(i)return i}return r.closest("form")},name:r=>r.name,value:r=>r.value,defaultValue:r=>r.defaultValue,disabled:r=>{var o;return(o=r.disabled)!=null?o:!1},reportValidity:r=>typeof r.reportValidity=="function"?r.reportValidity():!0,checkValidity:r=>typeof r.checkValidity=="function"?r.checkValidity():!0,setValue:(r,o)=>r.value=o,assumeInteractionOn:["sl-input"]},e)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),Ae.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),Ae.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,pe.has(this.form)?pe.get(this.form).add(this.host):pe.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),fe.has(this.form)||(fe.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),me.has(this.form)||(me.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const t=pe.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),fe.has(this.form)&&(this.form.reportValidity=fe.get(this.form),fe.delete(this.form)),me.has(this.form)&&(this.form.checkValidity=me.get(this.form),me.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?pr.add(t):pr.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const r=document.createElement("button");r.type=t,r.style.position="absolute",r.style.width="0",r.style.height="0",r.style.clipPath="inset(50%)",r.style.overflow="hidden",r.style.whiteSpace="nowrap",e&&(r.name=e.name,r.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(o=>{e.hasAttribute(o)&&r.setAttribute(o,e.getAttribute(o))})),this.form.append(r),r.click(),r.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,r=!!pr.has(e),o=!!e.required;e.toggleAttribute("data-required",o),e.toggleAttribute("data-optional",!o),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&r),e.toggleAttribute("data-user-valid",t&&r)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},co=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(Xe(Vt({},co),{valid:!1,valueMissing:!0}));Object.freeze(Xe(Vt({},co),{valid:!1,customError:!0}));var Pn=tt`
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
`,Ks=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=r=>{const o=r.target;(this.slotNames.includes("[default]")&&!o.name||o.name&&this.slotNames.includes(o.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}},Sr="";function No(t){Sr=t}function On(t=""){if(!Sr){const e=[...document.getElementsByTagName("script")],r=e.find(o=>o.hasAttribute("data-shoelace"));if(r)No(r.getAttribute("data-shoelace"));else{const o=e.find(i=>/shoelace(\.min)?\.js($|\?)/.test(i.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(i.src));let s="";o&&(s=o.getAttribute("src")),No(s.split("/").slice(0,-1).join("/"))}}return Sr.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Tn={name:"default",resolver:t=>On(`assets/icons/${t}.svg`)},Rn=Tn,Do={caret:`
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
  `},Ln={name:"system",resolver:t=>t in Do?`data:image/svg+xml,${encodeURIComponent(Do[t])}`:""},zn=Ln,Nn=[Rn,zn],Ar=[];function Dn(t){Ar.push(t)}function Mn(t){Ar=Ar.filter(e=>e!==t)}function Mo(t){return Nn.find(e=>e.name===t)}var In=tt`
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
 */const{I:Bn}=_n,Vn=(t,e)=>t?._$litType$!==void 0,Un=t=>t.strings===void 0,Io=()=>document.createComment(""),ge=(t,e,r)=>{const o=t._$AA.parentNode,s=e===void 0?t._$AB:e._$AA;if(r===void 0){const i=o.insertBefore(Io(),s),n=o.insertBefore(Io(),s);r=new Bn(i,n,t,t.options)}else{const i=r._$AB.nextSibling,n=r._$AM,a=n!==t;if(a){let l;r._$AQ?.(t),r._$AM=t,r._$AP!==void 0&&(l=t._$AU)!==n._$AU&&r._$AP(l)}if(i!==s||a){let l=r._$AA;for(;l!==i;){const c=l.nextSibling;o.insertBefore(l,s),l=c}}}return r},Tt=(t,e,r=t)=>(t._$AI(e,r),t),Fn={},Gs=(t,e=Fn)=>t._$AH=e,jn=t=>t._$AH,fr=t=>{t._$AR(),t._$AA.remove()};var be=Symbol(),Pe=Symbol(),mr,gr=new Map,nt=class extends W{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var r;let o;if(e?.spriteSheet)return this.svg=S`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(o=await fetch(t,{mode:"cors"}),!o.ok)return o.status===410?be:Pe}catch{return Pe}try{const s=document.createElement("div");s.innerHTML=await o.text();const i=s.firstElementChild;if(((r=i?.tagName)==null?void 0:r.toLowerCase())!=="svg")return be;mr||(mr=new DOMParser);const a=mr.parseFromString(i.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):be}catch{return be}}connectedCallback(){super.connectedCallback(),Dn(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Mn(this)}getIconSource(){const t=Mo(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const{url:e,fromLibrary:r}=this.getIconSource(),o=r?Mo(this.library):void 0;if(!e){this.svg=null;return}let s=gr.get(e);if(s||(s=this.resolveIcon(e,o),gr.set(e,s)),!this.initialRender)return;const i=await s;if(i===Pe&&gr.delete(e),e===this.getIconSource().url){if(Vn(i)){if(this.svg=i,o){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&n&&o.mutator(n)}return}switch(i){case Pe:case be:this.svg=null,this.emit("sl-error");break;default:this.svg=i.cloneNode(!0),(t=o?.mutator)==null||t.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};nt.styles=[ht,In];p([Ft()],nt.prototype,"svg",2);p([f({reflect:!0})],nt.prototype,"name",2);p([f()],nt.prototype,"src",2);p([f()],nt.prototype,"label",2);p([f({reflect:!0})],nt.prototype,"library",2);p([bt("label")],nt.prototype,"handleLabelChange",1);p([bt(["name","src","library"])],nt.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},tr=t=>(...e)=>({_$litDirective$:t,values:e});let er=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=tr(class extends er{constructor(t){if(super(t),t.type!==ft.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((o=>o!==""))));for(const o in e)e[o]&&!this.nt?.has(o)&&this.st.add(o);return this.render(e)}const r=t.element.classList;for(const o of this.st)o in e||(r.remove(o),this.st.delete(o));for(const o in e){const s=!!e[o];s===this.st.has(o)||this.nt?.has(o)||(s?(r.add(o),this.st.add(o)):(r.remove(o),this.st.delete(o)))}return Z}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zs=Symbol.for(""),Hn=t=>{if(t?.r===Zs)return t?._$litStatic$},Be=(t,...e)=>({_$litStatic$:e.reduce(((r,o,s)=>r+(i=>{if(i._$litStatic$!==void 0)return i._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${i}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[s+1]),t[0]),r:Zs}),Bo=new Map,Wn=t=>(e,...r)=>{const o=r.length;let s,i;const n=[],a=[];let l,c=0,d=!1;for(;c<o;){for(l=e[c];c<o&&(i=r[c],(s=Hn(i))!==void 0);)l+=s+e[++c],d=!0;c!==o&&a.push(i),n.push(l),c++}if(c===o&&n.push(e[o]),d){const u=n.join("$$lit$$");(e=Bo.get(u))===void 0&&(n.raw=n,Bo.set(u,e=n)),r=a}return t(e,...r)},Ne=Wn(S);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const M=t=>t??z;var O=class extends W{constructor(){super(...arguments),this.formControlController=new qs(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new Ks(this,"[default]","prefix","suffix"),this.localize=new Bt(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:co}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){const t=this.isLink(),e=t?Be`a`:Be`button`;return Ne`
      <${e}
        part="base"
        class=${gt({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
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
        ${this.caret?Ne` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?Ne`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${e}>
    `}};O.styles=[ht,Pn];O.dependencies={"sl-icon":nt,"sl-spinner":Ws};p([et(".button")],O.prototype,"button",2);p([Ft()],O.prototype,"hasFocus",2);p([Ft()],O.prototype,"invalid",2);p([f()],O.prototype,"title",2);p([f({reflect:!0})],O.prototype,"variant",2);p([f({reflect:!0})],O.prototype,"size",2);p([f({type:Boolean,reflect:!0})],O.prototype,"caret",2);p([f({type:Boolean,reflect:!0})],O.prototype,"disabled",2);p([f({type:Boolean,reflect:!0})],O.prototype,"loading",2);p([f({type:Boolean,reflect:!0})],O.prototype,"outline",2);p([f({type:Boolean,reflect:!0})],O.prototype,"pill",2);p([f({type:Boolean,reflect:!0})],O.prototype,"circle",2);p([f()],O.prototype,"type",2);p([f()],O.prototype,"name",2);p([f()],O.prototype,"value",2);p([f()],O.prototype,"href",2);p([f()],O.prototype,"target",2);p([f()],O.prototype,"rel",2);p([f()],O.prototype,"download",2);p([f()],O.prototype,"form",2);p([f({attribute:"formaction"})],O.prototype,"formAction",2);p([f({attribute:"formenctype"})],O.prototype,"formEnctype",2);p([f({attribute:"formmethod"})],O.prototype,"formMethod",2);p([f({attribute:"formnovalidate",type:Boolean})],O.prototype,"formNoValidate",2);p([f({attribute:"formtarget"})],O.prototype,"formTarget",2);p([bt("disabled",{waitUntilFirstUpdate:!0})],O.prototype,"handleDisabledChange",1);O.define("sl-button");var qn=tt`
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
`,Kn=tt`
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
`,Q=class extends W{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?Be`a`:Be`button`;return Ne`
      <${e}
        part="base"
        class=${gt({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
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
    `}};Q.styles=[ht,Kn];Q.dependencies={"sl-icon":nt};p([et(".icon-button")],Q.prototype,"button",2);p([Ft()],Q.prototype,"hasFocus",2);p([f()],Q.prototype,"name",2);p([f()],Q.prototype,"library",2);p([f()],Q.prototype,"src",2);p([f()],Q.prototype,"href",2);p([f()],Q.prototype,"target",2);p([f()],Q.prototype,"download",2);p([f()],Q.prototype,"label",2);p([f({type:Boolean,reflect:!0})],Q.prototype,"disabled",2);var jt=class extends W{constructor(){super(...arguments),this.localize=new Bt(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return S`
      <span
        part="base"
        class=${gt({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?S`
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
    `}};jt.styles=[ht,qn];jt.dependencies={"sl-icon-button":Q};p([f({reflect:!0})],jt.prototype,"variant",2);p([f({reflect:!0})],jt.prototype,"size",2);p([f({type:Boolean,reflect:!0})],jt.prototype,"pill",2);p([f({type:Boolean})],jt.prototype,"removable",2);jt.define("sl-tag");var Gn=tt`
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
`,Zn=(t="value")=>(e,r)=>{const o=e.constructor,s=o.prototype.attributeChangedCallback;o.prototype.attributeChangedCallback=function(i,n,a){var l;const c=o.getPropertyOptions(t),d=typeof c.attribute=="string"?c.attribute:t;if(i===d){const u=c.converter||ee,h=(typeof u=="function"?u:(l=u?.fromAttribute)!=null?l:ee.fromAttribute)(a,c.type);this[t]!==h&&(this[r]=h)}s.call(this,i,n,a)}},Xn=tt`
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
 */const Jn=tr(class extends er{constructor(t){if(super(t),t.type!==ft.PROPERTY&&t.type!==ft.ATTRIBUTE&&t.type!==ft.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Un(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===Z||e===z)return e;const r=t.element,o=t.name;if(t.type===ft.PROPERTY){if(e===r[o])return Z}else if(t.type===ft.BOOLEAN_ATTRIBUTE){if(!!e===r.hasAttribute(o))return Z}else if(t.type===ft.ATTRIBUTE&&r.getAttribute(o)===e+"")return Z;return Gs(t),e}});var j=class extends W{constructor(){super(...arguments),this.formControlController=new qs(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,e)=>t.checked=e}),this.hasSlotController=new Ks(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleClick(){this.checked=!this.checked,this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleKeyDown(t){t.key==="ArrowLeft"&&(t.preventDefault(),this.checked=!1,this.emit("sl-change"),this.emit("sl-input")),t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!0,this.emit("sl-change"),this.emit("sl-input"))}handleCheckedChange(){this.input.checked=this.checked,this.formControlController.updateValidity()}handleDisabledChange(){this.formControlController.setValidity(!0)}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){const t=this.hasSlotController.test("help-text"),e=this.helpText?!0:!!t;return S`
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
            value=${M(this.value)}
            .checked=${Jn(this.checked)}
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
    `}};j.styles=[ht,Xn,Gn];p([et('input[type="checkbox"]')],j.prototype,"input",2);p([Ft()],j.prototype,"hasFocus",2);p([f()],j.prototype,"title",2);p([f()],j.prototype,"name",2);p([f()],j.prototype,"value",2);p([f({reflect:!0})],j.prototype,"size",2);p([f({type:Boolean,reflect:!0})],j.prototype,"disabled",2);p([f({type:Boolean,reflect:!0})],j.prototype,"checked",2);p([Zn("checked")],j.prototype,"defaultChecked",2);p([f({reflect:!0})],j.prototype,"form",2);p([f({type:Boolean,reflect:!0})],j.prototype,"required",2);p([f({attribute:"help-text"})],j.prototype,"helpText",2);p([bt("checked",{waitUntilFirstUpdate:!0})],j.prototype,"handleCheckedChange",1);p([bt("disabled",{waitUntilFirstUpdate:!0})],j.prototype,"handleDisabledChange",1);j.define("sl-switch");var Yn=tt`
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
`,Qn=tt`
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
`;const Ct=Math.min,G=Math.max,Ve=Math.round,Oe=Math.floor,ct=t=>({x:t,y:t}),ta={left:"right",right:"left",bottom:"top",top:"bottom"},ea={start:"end",end:"start"};function Pr(t,e,r){return G(t,Ct(e,r))}function ce(t,e){return typeof t=="function"?t(e):t}function Et(t){return t.split("-")[0]}function ue(t){return t.split("-")[1]}function Xs(t){return t==="x"?"y":"x"}function uo(t){return t==="y"?"height":"width"}const ra=new Set(["top","bottom"]);function mt(t){return ra.has(Et(t))?"y":"x"}function ho(t){return Xs(mt(t))}function oa(t,e,r){r===void 0&&(r=!1);const o=ue(t),s=ho(t),i=uo(s);let n=s==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[i]>e.floating[i]&&(n=Ue(n)),[n,Ue(n)]}function sa(t){const e=Ue(t);return[Or(t),e,Or(e)]}function Or(t){return t.replace(/start|end/g,e=>ea[e])}const Vo=["left","right"],Uo=["right","left"],ia=["top","bottom"],na=["bottom","top"];function aa(t,e,r){switch(t){case"top":case"bottom":return r?e?Uo:Vo:e?Vo:Uo;case"left":case"right":return e?ia:na;default:return[]}}function la(t,e,r,o){const s=ue(t);let i=aa(Et(t),r==="start",o);return s&&(i=i.map(n=>n+"-"+s),e&&(i=i.concat(i.map(Or)))),i}function Ue(t){return t.replace(/left|right|bottom|top/g,e=>ta[e])}function ca(t){return{top:0,right:0,bottom:0,left:0,...t}}function Js(t){return typeof t!="number"?ca(t):{top:t,right:t,bottom:t,left:t}}function Fe(t){const{x:e,y:r,width:o,height:s}=t;return{width:o,height:s,top:r,left:e,right:e+o,bottom:r+s,x:e,y:r}}function Fo(t,e,r){let{reference:o,floating:s}=t;const i=mt(e),n=ho(e),a=uo(n),l=Et(e),c=i==="y",d=o.x+o.width/2-s.width/2,u=o.y+o.height/2-s.height/2,m=o[a]/2-s[a]/2;let h;switch(l){case"top":h={x:d,y:o.y-s.height};break;case"bottom":h={x:d,y:o.y+o.height};break;case"right":h={x:o.x+o.width,y:u};break;case"left":h={x:o.x-s.width,y:u};break;default:h={x:o.x,y:o.y}}switch(ue(e)){case"start":h[n]-=m*(r&&c?-1:1);break;case"end":h[n]+=m*(r&&c?-1:1);break}return h}const ua=async(t,e,r)=>{const{placement:o="bottom",strategy:s="absolute",middleware:i=[],platform:n}=r,a=i.filter(Boolean),l=await(n.isRTL==null?void 0:n.isRTL(e));let c=await n.getElementRects({reference:t,floating:e,strategy:s}),{x:d,y:u}=Fo(c,o,l),m=o,h={},g=0;for(let b=0;b<a.length;b++){const{name:E,fn:$}=a[b],{x,y:v,data:_,reset:y}=await $({x:d,y:u,initialPlacement:o,placement:m,strategy:s,middlewareData:h,rects:c,platform:n,elements:{reference:t,floating:e}});d=x??d,u=v??u,h={...h,[E]:{...h[E],..._}},y&&g<=50&&(g++,typeof y=="object"&&(y.placement&&(m=y.placement),y.rects&&(c=y.rects===!0?await n.getElementRects({reference:t,floating:e,strategy:s}):y.rects),{x:d,y:u}=Fo(c,m,l)),b=-1)}return{x:d,y:u,placement:m,strategy:s,middlewareData:h}};async function po(t,e){var r;e===void 0&&(e={});const{x:o,y:s,platform:i,rects:n,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:u="floating",altBoundary:m=!1,padding:h=0}=ce(e,t),g=Js(h),E=a[m?u==="floating"?"reference":"floating":u],$=Fe(await i.getClippingRect({element:(r=await(i.isElement==null?void 0:i.isElement(E)))==null||r?E:E.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(a.floating)),boundary:c,rootBoundary:d,strategy:l})),x=u==="floating"?{x:o,y:s,width:n.floating.width,height:n.floating.height}:n.reference,v=await(i.getOffsetParent==null?void 0:i.getOffsetParent(a.floating)),_=await(i.isElement==null?void 0:i.isElement(v))?await(i.getScale==null?void 0:i.getScale(v))||{x:1,y:1}:{x:1,y:1},y=Fe(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:x,offsetParent:v,strategy:l}):x);return{top:($.top-y.top+g.top)/_.y,bottom:(y.bottom-$.bottom+g.bottom)/_.y,left:($.left-y.left+g.left)/_.x,right:(y.right-$.right+g.right)/_.x}}const ha=t=>({name:"arrow",options:t,async fn(e){const{x:r,y:o,placement:s,rects:i,platform:n,elements:a,middlewareData:l}=e,{element:c,padding:d=0}=ce(t,e)||{};if(c==null)return{};const u=Js(d),m={x:r,y:o},h=ho(s),g=uo(h),b=await n.getDimensions(c),E=h==="y",$=E?"top":"left",x=E?"bottom":"right",v=E?"clientHeight":"clientWidth",_=i.reference[g]+i.reference[h]-m[h]-i.floating[g],y=m[h]-i.reference[h],A=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let P=A?A[v]:0;(!P||!await(n.isElement==null?void 0:n.isElement(A)))&&(P=a.floating[v]||i.floating[g]);const R=_/2-y/2,I=P/2-b[g]/2-1,N=Ct(u[$],I),vt=Ct(u[x],I),at=N,yt=P-b[g]-vt,H=P/2-b[g]/2+R,Pt=Pr(at,H,yt),pt=!l.arrow&&ue(s)!=null&&H!==Pt&&i.reference[g]/2-(H<at?N:vt)-b[g]/2<0,rt=pt?H<at?H-at:H-yt:0;return{[h]:m[h]+rt,data:{[h]:Pt,centerOffset:H-Pt-rt,...pt&&{alignmentOffset:rt}},reset:pt}}}),da=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var r,o;const{placement:s,middlewareData:i,rects:n,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:d=!0,crossAxis:u=!0,fallbackPlacements:m,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:b=!0,...E}=ce(t,e);if((r=i.arrow)!=null&&r.alignmentOffset)return{};const $=Et(s),x=mt(a),v=Et(a)===a,_=await(l.isRTL==null?void 0:l.isRTL(c.floating)),y=m||(v||!b?[Ue(a)]:sa(a)),A=g!=="none";!m&&A&&y.push(...la(a,b,g,_));const P=[a,...y],R=await po(e,E),I=[];let N=((o=i.flip)==null?void 0:o.overflows)||[];if(d&&I.push(R[$]),u){const H=oa(s,n,_);I.push(R[H[0]],R[H[1]])}if(N=[...N,{placement:s,overflows:I}],!I.every(H=>H<=0)){var vt,at;const H=(((vt=i.flip)==null?void 0:vt.index)||0)+1,Pt=P[H];if(Pt&&(!(u==="alignment"?x!==mt(Pt):!1)||N.every(ot=>mt(ot.placement)===x?ot.overflows[0]>0:!0)))return{data:{index:H,overflows:N},reset:{placement:Pt}};let pt=(at=N.filter(rt=>rt.overflows[0]<=0).sort((rt,ot)=>rt.overflows[1]-ot.overflows[1])[0])==null?void 0:at.placement;if(!pt)switch(h){case"bestFit":{var yt;const rt=(yt=N.filter(ot=>{if(A){const wt=mt(ot.placement);return wt===x||wt==="y"}return!0}).map(ot=>[ot.placement,ot.overflows.filter(wt=>wt>0).reduce((wt,Bi)=>wt+Bi,0)]).sort((ot,wt)=>ot[1]-wt[1])[0])==null?void 0:yt[0];rt&&(pt=rt);break}case"initialPlacement":pt=a;break}if(s!==pt)return{reset:{placement:pt}}}return{}}}},pa=new Set(["left","top"]);async function fa(t,e){const{placement:r,platform:o,elements:s}=t,i=await(o.isRTL==null?void 0:o.isRTL(s.floating)),n=Et(r),a=ue(r),l=mt(r)==="y",c=pa.has(n)?-1:1,d=i&&l?-1:1,u=ce(e,t);let{mainAxis:m,crossAxis:h,alignmentAxis:g}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:u.mainAxis||0,crossAxis:u.crossAxis||0,alignmentAxis:u.alignmentAxis};return a&&typeof g=="number"&&(h=a==="end"?g*-1:g),l?{x:h*d,y:m*c}:{x:m*c,y:h*d}}const ma=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var r,o;const{x:s,y:i,placement:n,middlewareData:a}=e,l=await fa(e,t);return n===((r=a.offset)==null?void 0:r.placement)&&(o=a.arrow)!=null&&o.alignmentOffset?{}:{x:s+l.x,y:i+l.y,data:{...l,placement:n}}}}},ga=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:o,placement:s}=e,{mainAxis:i=!0,crossAxis:n=!1,limiter:a={fn:E=>{let{x:$,y:x}=E;return{x:$,y:x}}},...l}=ce(t,e),c={x:r,y:o},d=await po(e,l),u=mt(Et(s)),m=Xs(u);let h=c[m],g=c[u];if(i){const E=m==="y"?"top":"left",$=m==="y"?"bottom":"right",x=h+d[E],v=h-d[$];h=Pr(x,h,v)}if(n){const E=u==="y"?"top":"left",$=u==="y"?"bottom":"right",x=g+d[E],v=g-d[$];g=Pr(x,g,v)}const b=a.fn({...e,[m]:h,[u]:g});return{...b,data:{x:b.x-r,y:b.y-o,enabled:{[m]:i,[u]:n}}}}}},ba=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var r,o;const{placement:s,rects:i,platform:n,elements:a}=e,{apply:l=()=>{},...c}=ce(t,e),d=await po(e,c),u=Et(s),m=ue(s),h=mt(s)==="y",{width:g,height:b}=i.floating;let E,$;u==="top"||u==="bottom"?(E=u,$=m===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):($=u,E=m==="end"?"top":"bottom");const x=b-d.top-d.bottom,v=g-d.left-d.right,_=Ct(b-d[E],x),y=Ct(g-d[$],v),A=!e.middlewareData.shift;let P=_,R=y;if((r=e.middlewareData.shift)!=null&&r.enabled.x&&(R=v),(o=e.middlewareData.shift)!=null&&o.enabled.y&&(P=x),A&&!m){const N=G(d.left,0),vt=G(d.right,0),at=G(d.top,0),yt=G(d.bottom,0);h?R=g-2*(N!==0||vt!==0?N+vt:G(d.left,d.right)):P=b-2*(at!==0||yt!==0?at+yt:G(d.top,d.bottom))}await l({...e,availableWidth:R,availableHeight:P});const I=await n.getDimensions(a.floating);return g!==I.width||b!==I.height?{reset:{rects:!0}}:{}}}};function rr(){return typeof window<"u"}function he(t){return Ys(t)?(t.nodeName||"").toLowerCase():"#document"}function J(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function dt(t){var e;return(e=(Ys(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Ys(t){return rr()?t instanceof Node||t instanceof J(t).Node:!1}function st(t){return rr()?t instanceof Element||t instanceof J(t).Element:!1}function ut(t){return rr()?t instanceof HTMLElement||t instanceof J(t).HTMLElement:!1}function jo(t){return!rr()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof J(t).ShadowRoot}const va=new Set(["inline","contents"]);function Ee(t){const{overflow:e,overflowX:r,overflowY:o,display:s}=it(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+r)&&!va.has(s)}const ya=new Set(["table","td","th"]);function wa(t){return ya.has(he(t))}const _a=[":popover-open",":modal"];function or(t){return _a.some(e=>{try{return t.matches(e)}catch{return!1}})}const $a=["transform","translate","scale","rotate","perspective"],xa=["transform","translate","scale","rotate","perspective","filter"],Ca=["paint","layout","strict","content"];function sr(t){const e=fo(),r=st(t)?it(t):t;return $a.some(o=>r[o]?r[o]!=="none":!1)||(r.containerType?r.containerType!=="normal":!1)||!e&&(r.backdropFilter?r.backdropFilter!=="none":!1)||!e&&(r.filter?r.filter!=="none":!1)||xa.some(o=>(r.willChange||"").includes(o))||Ca.some(o=>(r.contain||"").includes(o))}function Ea(t){let e=kt(t);for(;ut(e)&&!oe(e);){if(sr(e))return e;if(or(e))return null;e=kt(e)}return null}function fo(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const ka=new Set(["html","body","#document"]);function oe(t){return ka.has(he(t))}function it(t){return J(t).getComputedStyle(t)}function ir(t){return st(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function kt(t){if(he(t)==="html")return t;const e=t.assignedSlot||t.parentNode||jo(t)&&t.host||dt(t);return jo(e)?e.host:e}function Qs(t){const e=kt(t);return oe(e)?t.ownerDocument?t.ownerDocument.body:t.body:ut(e)&&Ee(e)?e:Qs(e)}function xe(t,e,r){var o;e===void 0&&(e=[]),r===void 0&&(r=!0);const s=Qs(t),i=s===((o=t.ownerDocument)==null?void 0:o.body),n=J(s);if(i){const a=Tr(n);return e.concat(n,n.visualViewport||[],Ee(s)?s:[],a&&r?xe(a):[])}return e.concat(s,xe(s,[],r))}function Tr(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function ti(t){const e=it(t);let r=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const s=ut(t),i=s?t.offsetWidth:r,n=s?t.offsetHeight:o,a=Ve(r)!==i||Ve(o)!==n;return a&&(r=i,o=n),{width:r,height:o,$:a}}function mo(t){return st(t)?t:t.contextElement}function te(t){const e=mo(t);if(!ut(e))return ct(1);const r=e.getBoundingClientRect(),{width:o,height:s,$:i}=ti(e);let n=(i?Ve(r.width):r.width)/o,a=(i?Ve(r.height):r.height)/s;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const Sa=ct(0);function ei(t){const e=J(t);return!fo()||!e.visualViewport?Sa:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Aa(t,e,r){return e===void 0&&(e=!1),!r||e&&r!==J(t)?!1:e}function It(t,e,r,o){e===void 0&&(e=!1),r===void 0&&(r=!1);const s=t.getBoundingClientRect(),i=mo(t);let n=ct(1);e&&(o?st(o)&&(n=te(o)):n=te(t));const a=Aa(i,r,o)?ei(i):ct(0);let l=(s.left+a.x)/n.x,c=(s.top+a.y)/n.y,d=s.width/n.x,u=s.height/n.y;if(i){const m=J(i),h=o&&st(o)?J(o):o;let g=m,b=Tr(g);for(;b&&o&&h!==g;){const E=te(b),$=b.getBoundingClientRect(),x=it(b),v=$.left+(b.clientLeft+parseFloat(x.paddingLeft))*E.x,_=$.top+(b.clientTop+parseFloat(x.paddingTop))*E.y;l*=E.x,c*=E.y,d*=E.x,u*=E.y,l+=v,c+=_,g=J(b),b=Tr(g)}}return Fe({width:d,height:u,x:l,y:c})}function nr(t,e){const r=ir(t).scrollLeft;return e?e.left+r:It(dt(t)).left+r}function ri(t,e){const r=t.getBoundingClientRect(),o=r.left+e.scrollLeft-nr(t,r),s=r.top+e.scrollTop;return{x:o,y:s}}function Pa(t){let{elements:e,rect:r,offsetParent:o,strategy:s}=t;const i=s==="fixed",n=dt(o),a=e?or(e.floating):!1;if(o===n||a&&i)return r;let l={scrollLeft:0,scrollTop:0},c=ct(1);const d=ct(0),u=ut(o);if((u||!u&&!i)&&((he(o)!=="body"||Ee(n))&&(l=ir(o)),ut(o))){const h=It(o);c=te(o),d.x=h.x+o.clientLeft,d.y=h.y+o.clientTop}const m=n&&!u&&!i?ri(n,l):ct(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+d.x+m.x,y:r.y*c.y-l.scrollTop*c.y+d.y+m.y}}function Oa(t){return Array.from(t.getClientRects())}function Ta(t){const e=dt(t),r=ir(t),o=t.ownerDocument.body,s=G(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),i=G(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let n=-r.scrollLeft+nr(t);const a=-r.scrollTop;return it(o).direction==="rtl"&&(n+=G(e.clientWidth,o.clientWidth)-s),{width:s,height:i,x:n,y:a}}const Ho=25;function Ra(t,e){const r=J(t),o=dt(t),s=r.visualViewport;let i=o.clientWidth,n=o.clientHeight,a=0,l=0;if(s){i=s.width,n=s.height;const d=fo();(!d||d&&e==="fixed")&&(a=s.offsetLeft,l=s.offsetTop)}const c=nr(o);if(c<=0){const d=o.ownerDocument,u=d.body,m=getComputedStyle(u),h=d.compatMode==="CSS1Compat"&&parseFloat(m.marginLeft)+parseFloat(m.marginRight)||0,g=Math.abs(o.clientWidth-u.clientWidth-h);g<=Ho&&(i-=g)}else c<=Ho&&(i+=c);return{width:i,height:n,x:a,y:l}}const La=new Set(["absolute","fixed"]);function za(t,e){const r=It(t,!0,e==="fixed"),o=r.top+t.clientTop,s=r.left+t.clientLeft,i=ut(t)?te(t):ct(1),n=t.clientWidth*i.x,a=t.clientHeight*i.y,l=s*i.x,c=o*i.y;return{width:n,height:a,x:l,y:c}}function Wo(t,e,r){let o;if(e==="viewport")o=Ra(t,r);else if(e==="document")o=Ta(dt(t));else if(st(e))o=za(e,r);else{const s=ei(t);o={x:e.x-s.x,y:e.y-s.y,width:e.width,height:e.height}}return Fe(o)}function oi(t,e){const r=kt(t);return r===e||!st(r)||oe(r)?!1:it(r).position==="fixed"||oi(r,e)}function Na(t,e){const r=e.get(t);if(r)return r;let o=xe(t,[],!1).filter(a=>st(a)&&he(a)!=="body"),s=null;const i=it(t).position==="fixed";let n=i?kt(t):t;for(;st(n)&&!oe(n);){const a=it(n),l=sr(n);!l&&a.position==="fixed"&&(s=null),(i?!l&&!s:!l&&a.position==="static"&&!!s&&La.has(s.position)||Ee(n)&&!l&&oi(t,n))?o=o.filter(d=>d!==n):s=a,n=kt(n)}return e.set(t,o),o}function Da(t){let{element:e,boundary:r,rootBoundary:o,strategy:s}=t;const n=[...r==="clippingAncestors"?or(e)?[]:Na(e,this._c):[].concat(r),o],a=n[0],l=n.reduce((c,d)=>{const u=Wo(e,d,s);return c.top=G(u.top,c.top),c.right=Ct(u.right,c.right),c.bottom=Ct(u.bottom,c.bottom),c.left=G(u.left,c.left),c},Wo(e,a,s));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function Ma(t){const{width:e,height:r}=ti(t);return{width:e,height:r}}function Ia(t,e,r){const o=ut(e),s=dt(e),i=r==="fixed",n=It(t,!0,i,e);let a={scrollLeft:0,scrollTop:0};const l=ct(0);function c(){l.x=nr(s)}if(o||!o&&!i)if((he(e)!=="body"||Ee(s))&&(a=ir(e)),o){const h=It(e,!0,i,e);l.x=h.x+e.clientLeft,l.y=h.y+e.clientTop}else s&&c();i&&!o&&s&&c();const d=s&&!o&&!i?ri(s,a):ct(0),u=n.left+a.scrollLeft-l.x-d.x,m=n.top+a.scrollTop-l.y-d.y;return{x:u,y:m,width:n.width,height:n.height}}function br(t){return it(t).position==="static"}function qo(t,e){if(!ut(t)||it(t).position==="fixed")return null;if(e)return e(t);let r=t.offsetParent;return dt(t)===r&&(r=r.ownerDocument.body),r}function si(t,e){const r=J(t);if(or(t))return r;if(!ut(t)){let s=kt(t);for(;s&&!oe(s);){if(st(s)&&!br(s))return s;s=kt(s)}return r}let o=qo(t,e);for(;o&&wa(o)&&br(o);)o=qo(o,e);return o&&oe(o)&&br(o)&&!sr(o)?r:o||Ea(t)||r}const Ba=async function(t){const e=this.getOffsetParent||si,r=this.getDimensions,o=await r(t.floating);return{reference:Ia(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function Va(t){return it(t).direction==="rtl"}const De={convertOffsetParentRelativeRectToViewportRelativeRect:Pa,getDocumentElement:dt,getClippingRect:Da,getOffsetParent:si,getElementRects:Ba,getClientRects:Oa,getDimensions:Ma,getScale:te,isElement:st,isRTL:Va};function ii(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function Ua(t,e){let r=null,o;const s=dt(t);function i(){var a;clearTimeout(o),(a=r)==null||a.disconnect(),r=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),i();const c=t.getBoundingClientRect(),{left:d,top:u,width:m,height:h}=c;if(a||e(),!m||!h)return;const g=Oe(u),b=Oe(s.clientWidth-(d+m)),E=Oe(s.clientHeight-(u+h)),$=Oe(d),v={rootMargin:-g+"px "+-b+"px "+-E+"px "+-$+"px",threshold:G(0,Ct(1,l))||1};let _=!0;function y(A){const P=A[0].intersectionRatio;if(P!==l){if(!_)return n();P?n(!1,P):o=setTimeout(()=>{n(!1,1e-7)},1e3)}P===1&&!ii(c,t.getBoundingClientRect())&&n(),_=!1}try{r=new IntersectionObserver(y,{...v,root:s.ownerDocument})}catch{r=new IntersectionObserver(y,v)}r.observe(t)}return n(!0),i}function Fa(t,e,r,o){o===void 0&&(o={});const{ancestorScroll:s=!0,ancestorResize:i=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=mo(t),d=s||i?[...c?xe(c):[],...xe(e)]:[];d.forEach($=>{s&&$.addEventListener("scroll",r,{passive:!0}),i&&$.addEventListener("resize",r)});const u=c&&a?Ua(c,r):null;let m=-1,h=null;n&&(h=new ResizeObserver($=>{let[x]=$;x&&x.target===c&&h&&(h.unobserve(e),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var v;(v=h)==null||v.observe(e)})),r()}),c&&!l&&h.observe(c),h.observe(e));let g,b=l?It(t):null;l&&E();function E(){const $=It(t);b&&!ii(b,$)&&r(),b=$,g=requestAnimationFrame(E)}return r(),()=>{var $;d.forEach(x=>{s&&x.removeEventListener("scroll",r),i&&x.removeEventListener("resize",r)}),u?.(),($=h)==null||$.disconnect(),h=null,l&&cancelAnimationFrame(g)}}const ja=ma,Ha=ga,Wa=da,Ko=ba,qa=ha,Ka=(t,e,r)=>{const o=new Map,s={platform:De,...r},i={...s.platform,_c:o};return ua(t,e,{...s,platform:i})};function Ga(t){return Za(t)}function vr(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Za(t){for(let e=t;e;e=vr(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=vr(t);e;e=vr(e)){if(!(e instanceof Element))continue;const r=getComputedStyle(e);if(r.display!=="contents"&&(r.position!=="static"||sr(r)||e.tagName==="BODY"))return e}return null}function Xa(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var T=class extends W{constructor(){super(...arguments),this.localize=new Bt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,s=0,i=0,n=0,a=0,l=0,c=0,d=0;r?t.top<e.top?(o=t.left,s=t.bottom,i=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,d=e.top):(o=e.left,s=e.bottom,i=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,d=t.top):t.left<e.left?(o=t.right,s=t.top,i=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,d=e.bottom):(o=e.right,s=e.top,i=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,d=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${s}px`),this.style.setProperty("--hover-bridge-top-right-x",`${i}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${d}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Xa(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Fa(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[ja({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Ko({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",s=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=s?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Wa({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Ha({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Ko({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(qa({element:this.arrowEl,padding:this.arrowPadding}));const e=this.strategy==="absolute"?r=>De.getOffsetParent(r,Ga):De.getOffsetParent;Ka(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:Xe(Vt({},De),{getOffsetParent:e})}).then(({x:r,y:o,middlewareData:s,placement:i})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=s.arrow.x,c=s.arrow.y;let d="",u="",m="",h="";if(this.arrowPlacement==="start"){const g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",u=n?g:"",h=n?"":g}else if(this.arrowPlacement==="end"){const g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";u=n?"":g,h=n?g:"",m=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(h=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",d=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(h=typeof l=="number"?`${l}px`:"",d=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:d,right:u,bottom:m,left:h,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return S`
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
        ${this.arrow?S`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};T.styles=[ht,Qn];p([et(".popup")],T.prototype,"popup",2);p([et(".popup__arrow")],T.prototype,"arrowEl",2);p([f()],T.prototype,"anchor",2);p([f({type:Boolean,reflect:!0})],T.prototype,"active",2);p([f({reflect:!0})],T.prototype,"placement",2);p([f({reflect:!0})],T.prototype,"strategy",2);p([f({type:Number})],T.prototype,"distance",2);p([f({type:Number})],T.prototype,"skidding",2);p([f({type:Boolean})],T.prototype,"arrow",2);p([f({attribute:"arrow-placement"})],T.prototype,"arrowPlacement",2);p([f({attribute:"arrow-padding",type:Number})],T.prototype,"arrowPadding",2);p([f({type:Boolean})],T.prototype,"flip",2);p([f({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],T.prototype,"flipFallbackPlacements",2);p([f({attribute:"flip-fallback-strategy"})],T.prototype,"flipFallbackStrategy",2);p([f({type:Object})],T.prototype,"flipBoundary",2);p([f({attribute:"flip-padding",type:Number})],T.prototype,"flipPadding",2);p([f({type:Boolean})],T.prototype,"shift",2);p([f({type:Object})],T.prototype,"shiftBoundary",2);p([f({attribute:"shift-padding",type:Number})],T.prototype,"shiftPadding",2);p([f({attribute:"auto-size"})],T.prototype,"autoSize",2);p([f()],T.prototype,"sync",2);p([f({type:Object})],T.prototype,"autoSizeBoundary",2);p([f({attribute:"auto-size-padding",type:Number})],T.prototype,"autoSizePadding",2);p([f({attribute:"hover-bridge",type:Boolean})],T.prototype,"hoverBridge",2);var ni=new Map,Ja=new WeakMap;function Ya(t){return t??{keyframes:[],options:{duration:0}}}function Go(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function ar(t,e){ni.set(t,Ya(e))}function je(t,e,r){const o=Ja.get(t);if(o?.[e])return Go(o[e],r.dir);const s=ni.get(e);return s?Go(s,r.dir):{keyframes:[],options:{duration:0}}}function Zo(t,e){return new Promise(r=>{function o(s){s.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}function Xo(t,e,r){return new Promise(o=>{if(r?.duration===1/0)throw new Error("Promise-based animations must be finite.");const s=t.animate(e,Xe(Vt({},r),{duration:Qa()?0:r.duration}));s.addEventListener("cancel",o,{once:!0}),s.addEventListener("finish",o,{once:!0})})}function Jo(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function Qa(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Yo(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{e.cancel(),requestAnimationFrame(r)})))}var U=class extends W{constructor(){super(),this.localize=new Bt(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=Jo(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=Jo(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Yo(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=je(this,"tooltip.show",{dir:this.localize.dir()});await Xo(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Yo(this.body);const{keyframes:r,options:o}=je(this,"tooltip.hide",{dir:this.localize.dir()});await Xo(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Zo(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Zo(this,"sl-after-hide")}render(){return S`
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
    `}};U.styles=[ht,Yn];U.dependencies={"sl-popup":T};p([et("slot:not([name])")],U.prototype,"defaultSlot",2);p([et(".tooltip__body")],U.prototype,"body",2);p([et("sl-popup")],U.prototype,"popup",2);p([f()],U.prototype,"content",2);p([f()],U.prototype,"placement",2);p([f({type:Boolean,reflect:!0})],U.prototype,"disabled",2);p([f({type:Number})],U.prototype,"distance",2);p([f({type:Boolean,reflect:!0})],U.prototype,"open",2);p([f({type:Number})],U.prototype,"skidding",2);p([f()],U.prototype,"trigger",2);p([f({type:Boolean})],U.prototype,"hoist",2);p([bt("open",{waitUntilFirstUpdate:!0})],U.prototype,"handleOpenChange",1);p([bt(["content","distance","hoist","placement","skidding"])],U.prototype,"handleOptionsChange",1);p([bt("disabled")],U.prototype,"handleDisabledChange",1);ar("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}});ar("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});var tl=tt`
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
`,B=class extends W{constructor(){super(...arguments),this.localize=new Bt(this),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let t=this.value;if(this.from){const e=this.getRootNode(),r=this.from.includes("."),o=this.from.includes("[")&&this.from.includes("]");let s=this.from,i="";r?[s,i]=this.from.trim().split("."):o&&([s,i]=this.from.trim().replace(/\]$/,"").split("["));const n="getElementById"in e?e.getElementById(s):null;n?o?t=n.getAttribute(i)||"":r?t=n[i]||"":t=n.textContent||"":(this.showStatus("error"),this.emit("sl-error"))}if(!t)this.showStatus("error"),this.emit("sl-error");else try{await navigator.clipboard.writeText(t),this.showStatus("success"),this.emit("sl-copy",{detail:{value:t}})}catch{this.showStatus("error"),this.emit("sl-error")}}async showStatus(t){const e=this.copyLabel||this.localize.term("copy"),r=this.successLabel||this.localize.term("copied"),o=this.errorLabel||this.localize.term("error"),s=t==="success"?this.successIcon:this.errorIcon,i=je(this,"copy.in",{dir:"ltr"}),n=je(this,"copy.out",{dir:"ltr"});this.tooltip.content=t==="success"?r:o,await this.copyIcon.animate(n.keyframes,n.options).finished,this.copyIcon.hidden=!0,this.status=t,s.hidden=!1,await s.animate(i.keyframes,i.options).finished,setTimeout(async()=>{await s.animate(n.keyframes,n.options).finished,s.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(i.keyframes,i.options).finished,this.tooltip.content=e,this.isCopying=!1},this.feedbackDuration)}render(){const t=this.copyLabel||this.localize.term("copy");return S`
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
    `}};B.styles=[ht,tl];B.dependencies={"sl-icon":nt,"sl-tooltip":U};p([et('slot[name="copy-icon"]')],B.prototype,"copyIcon",2);p([et('slot[name="success-icon"]')],B.prototype,"successIcon",2);p([et('slot[name="error-icon"]')],B.prototype,"errorIcon",2);p([et("sl-tooltip")],B.prototype,"tooltip",2);p([Ft()],B.prototype,"isCopying",2);p([Ft()],B.prototype,"status",2);p([f()],B.prototype,"value",2);p([f()],B.prototype,"from",2);p([f({type:Boolean,reflect:!0})],B.prototype,"disabled",2);p([f({attribute:"copy-label"})],B.prototype,"copyLabel",2);p([f({attribute:"success-label"})],B.prototype,"successLabel",2);p([f({attribute:"error-label"})],B.prototype,"errorLabel",2);p([f({attribute:"feedback-duration",type:Number})],B.prototype,"feedbackDuration",2);p([f({attribute:"tooltip-placement"})],B.prototype,"tooltipPlacement",2);p([f({type:Boolean})],B.prototype,"hoist",2);ar("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}});ar("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}});B.define("sl-copy-button");var el=Object.defineProperty,rl=(t,e,r)=>e in t?el(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,yr=(t,e,r)=>(rl(t,typeof e!="symbol"?e+"":e,r),r),ol=(t,e,r)=>{if(!e.has(t))throw TypeError("Cannot "+r)},wr=(t,e)=>{if(Object(e)!==e)throw TypeError('Cannot use the "in" operator on this value');return t.has(e)},Te=(t,e,r)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,r)},Qo=(t,e,r)=>(ol(t,e,"access private method"),r);/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function ai(t,e){return Object.is(t,e)}/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */let D=null,ye=!1,Me=1;const He=Symbol("SIGNAL");function Jt(t){const e=D;return D=t,e}function sl(){return D}function il(){return ye}const go={version:0,lastCleanEpoch:0,dirty:!1,producerNode:void 0,producerLastReadVersion:void 0,producerIndexOfThis:void 0,nextProducerIndex:0,liveConsumerNode:void 0,liveConsumerIndexOfThis:void 0,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function lr(t){if(ye)throw new Error(typeof ngDevMode<"u"&&ngDevMode?"Assertion error: signal read during notification phase":"");if(D===null)return;D.consumerOnSignalRead(t);const e=D.nextProducerIndex++;if(se(D),e<D.producerNode.length&&D.producerNode[e]!==t&&Rr(D)){const r=D.producerNode[e];cr(r,D.producerIndexOfThis[e])}D.producerNode[e]!==t&&(D.producerNode[e]=t,D.producerIndexOfThis[e]=Rr(D)?ui(t,D,e):0),D.producerLastReadVersion[e]=t.version}function nl(){Me++}function li(t){if(!(!t.dirty&&t.lastCleanEpoch===Me)){if(!t.producerMustRecompute(t)&&!hl(t)){t.dirty=!1,t.lastCleanEpoch=Me;return}t.producerRecomputeValue(t),t.dirty=!1,t.lastCleanEpoch=Me}}function ci(t){if(t.liveConsumerNode===void 0)return;const e=ye;ye=!0;try{for(const r of t.liveConsumerNode)r.dirty||ll(r)}finally{ye=e}}function al(){return D?.consumerAllowSignalWrites!==!1}function ll(t){var e;t.dirty=!0,ci(t),(e=t.consumerMarkedDirty)==null||e.call(t.wrapper??t)}function cl(t){return t&&(t.nextProducerIndex=0),Jt(t)}function ul(t,e){if(Jt(e),!(!t||t.producerNode===void 0||t.producerIndexOfThis===void 0||t.producerLastReadVersion===void 0)){if(Rr(t))for(let r=t.nextProducerIndex;r<t.producerNode.length;r++)cr(t.producerNode[r],t.producerIndexOfThis[r]);for(;t.producerNode.length>t.nextProducerIndex;)t.producerNode.pop(),t.producerLastReadVersion.pop(),t.producerIndexOfThis.pop()}}function hl(t){se(t);for(let e=0;e<t.producerNode.length;e++){const r=t.producerNode[e],o=t.producerLastReadVersion[e];if(o!==r.version||(li(r),o!==r.version))return!0}return!1}function ui(t,e,r){var o;if(bo(t),se(t),t.liveConsumerNode.length===0){(o=t.watched)==null||o.call(t.wrapper);for(let s=0;s<t.producerNode.length;s++)t.producerIndexOfThis[s]=ui(t.producerNode[s],t,s)}return t.liveConsumerIndexOfThis.push(r),t.liveConsumerNode.push(e)-1}function cr(t,e){var r;if(bo(t),se(t),typeof ngDevMode<"u"&&ngDevMode&&e>=t.liveConsumerNode.length)throw new Error(`Assertion error: active consumer index ${e} is out of bounds of ${t.liveConsumerNode.length} consumers)`);if(t.liveConsumerNode.length===1){(r=t.unwatched)==null||r.call(t.wrapper);for(let s=0;s<t.producerNode.length;s++)cr(t.producerNode[s],t.producerIndexOfThis[s])}const o=t.liveConsumerNode.length-1;if(t.liveConsumerNode[e]=t.liveConsumerNode[o],t.liveConsumerIndexOfThis[e]=t.liveConsumerIndexOfThis[o],t.liveConsumerNode.length--,t.liveConsumerIndexOfThis.length--,e<t.liveConsumerNode.length){const s=t.liveConsumerIndexOfThis[e],i=t.liveConsumerNode[e];se(i),i.producerIndexOfThis[s]=e}}function Rr(t){var e;return t.consumerIsAlwaysLive||(((e=t?.liveConsumerNode)==null?void 0:e.length)??0)>0}function se(t){t.producerNode??(t.producerNode=[]),t.producerIndexOfThis??(t.producerIndexOfThis=[]),t.producerLastReadVersion??(t.producerLastReadVersion=[])}function bo(t){t.liveConsumerNode??(t.liveConsumerNode=[]),t.liveConsumerIndexOfThis??(t.liveConsumerIndexOfThis=[])}/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function hi(t){if(li(t),lr(t),t.value===Lr)throw t.error;return t.value}function dl(t){const e=Object.create(pl);e.computation=t;const r=()=>hi(e);return r[He]=e,r}const _r=Symbol("UNSET"),$r=Symbol("COMPUTING"),Lr=Symbol("ERRORED"),pl={...go,value:_r,dirty:!0,error:null,equal:ai,producerMustRecompute(t){return t.value===_r||t.value===$r},producerRecomputeValue(t){if(t.value===$r)throw new Error("Detected cycle in computations.");const e=t.value;t.value=$r;const r=cl(t);let o,s=!1;try{o=t.computation.call(t.wrapper),s=e!==_r&&e!==Lr&&t.equal.call(t.wrapper,e,o)}catch(i){o=Lr,t.error=i}finally{ul(t,r)}if(s){t.value=e;return}t.value=o,t.version++}};/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function fl(){throw new Error}let ml=fl;function gl(){ml()}/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */function bl(t){const e=Object.create(wl);e.value=t;const r=()=>(lr(e),e.value);return r[He]=e,r}function vl(){return lr(this),this.value}function yl(t,e){al()||gl(),t.equal.call(t.wrapper,t.value,e)||(t.value=e,_l(t))}const wl={...go,equal:ai,value:void 0};function _l(t){t.version++,nl(),ci(t)}/**
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
 */const V=Symbol("node");var X;(t=>{var e,r,o,s;class i{constructor(l,c={}){Te(this,r),yr(this,e);const u=bl(l)[He];if(this[V]=u,u.wrapper=this,c){const m=c.equals;m&&(u.equal=m),u.watched=c[t.subtle.watched],u.unwatched=c[t.subtle.unwatched]}}get(){if(!(0,t.isState)(this))throw new TypeError("Wrong receiver type for Signal.State.prototype.get");return vl.call(this[V])}set(l){if(!(0,t.isState)(this))throw new TypeError("Wrong receiver type for Signal.State.prototype.set");if(il())throw new Error("Writes to signals not permitted during Watcher callback");const c=this[V];yl(c,l)}}e=V,r=new WeakSet,t.isState=a=>typeof a=="object"&&wr(r,a),t.State=i;class n{constructor(l,c){Te(this,s),yr(this,o);const u=dl(l)[He];if(u.consumerAllowSignalWrites=!0,this[V]=u,u.wrapper=this,c){const m=c.equals;m&&(u.equal=m),u.watched=c[t.subtle.watched],u.unwatched=c[t.subtle.unwatched]}}get(){if(!(0,t.isComputed)(this))throw new TypeError("Wrong receiver type for Signal.Computed.prototype.get");return hi(this[V])}}o=V,s=new WeakSet,t.isComputed=a=>typeof a=="object"&&wr(s,a),t.Computed=n,(a=>{var l,c,d,u;function m(v){let _,y=null;try{y=Jt(null),_=v()}finally{Jt(y)}return _}a.untrack=m;function h(v){var _;if(!(0,t.isComputed)(v)&&!(0,t.isWatcher)(v))throw new TypeError("Called introspectSources without a Computed or Watcher argument");return((_=v[V].producerNode)==null?void 0:_.map(y=>y.wrapper))??[]}a.introspectSources=h;function g(v){var _;if(!(0,t.isComputed)(v)&&!(0,t.isState)(v))throw new TypeError("Called introspectSinks without a Signal argument");return((_=v[V].liveConsumerNode)==null?void 0:_.map(y=>y.wrapper))??[]}a.introspectSinks=g;function b(v){if(!(0,t.isComputed)(v)&&!(0,t.isState)(v))throw new TypeError("Called hasSinks without a Signal argument");const _=v[V].liveConsumerNode;return _?_.length>0:!1}a.hasSinks=b;function E(v){if(!(0,t.isComputed)(v)&&!(0,t.isWatcher)(v))throw new TypeError("Called hasSources without a Computed or Watcher argument");const _=v[V].producerNode;return _?_.length>0:!1}a.hasSources=E;class ${constructor(_){Te(this,c),Te(this,d),yr(this,l);let y=Object.create(go);y.wrapper=this,y.consumerMarkedDirty=_,y.consumerIsAlwaysLive=!0,y.consumerAllowSignalWrites=!1,y.producerNode=[],this[V]=y}watch(..._){if(!(0,t.isWatcher)(this))throw new TypeError("Called unwatch without Watcher receiver");Qo(this,d,u).call(this,_);const y=this[V];y.dirty=!1;const A=Jt(y);for(const P of _)lr(P[V]);Jt(A)}unwatch(..._){if(!(0,t.isWatcher)(this))throw new TypeError("Called unwatch without Watcher receiver");Qo(this,d,u).call(this,_);const y=this[V];se(y);for(let A=y.producerNode.length-1;A>=0;A--)if(_.includes(y.producerNode[A].wrapper)){cr(y.producerNode[A],y.producerIndexOfThis[A]);const P=y.producerNode.length-1;if(y.producerNode[A]=y.producerNode[P],y.producerIndexOfThis[A]=y.producerIndexOfThis[P],y.producerNode.length--,y.producerIndexOfThis.length--,y.nextProducerIndex--,A<y.producerNode.length){const R=y.producerIndexOfThis[A],I=y.producerNode[A];bo(I),I.liveConsumerIndexOfThis[R]=A}}}getPending(){if(!(0,t.isWatcher)(this))throw new TypeError("Called getPending without Watcher receiver");return this[V].producerNode.filter(y=>y.dirty).map(y=>y.wrapper)}}l=V,c=new WeakSet,d=new WeakSet,u=function(v){for(const _ of v)if(!(0,t.isComputed)(_)&&!(0,t.isState)(_))throw new TypeError("Called watch/unwatch without a Computed or State argument")},t.isWatcher=v=>wr(c,v),a.Watcher=$;function x(){var v;return(v=sl())==null?void 0:v.wrapper}a.currentComputed=x,a.watched=Symbol("watched"),a.unwatched=Symbol("unwatched")})(t.subtle||(t.subtle={}))})(X||(X={}));/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $l=Symbol("SignalWatcherBrand"),xl=new FinalizationRegistry((({watcher:t,signal:e})=>{t.unwatch(e)})),ts=new WeakMap;function Ht(t){return t[$l]===!0?(console.warn("SignalWatcher should not be applied to the same class more than once."),t):class extends t{constructor(){super(...arguments),this._$St=new X.State(0),this._$Si=!1,this._$So=!0,this._$Sh=new Set}_$Sl(){if(this._$Su!==void 0)return;this._$Sv=new X.Computed((()=>{this._$St.get(),super.performUpdate()}));const e=this._$Su=new X.subtle.Watcher((function(){const r=ts.get(this);r!==void 0&&(r._$Si===!1&&r.requestUpdate(),this.watch())}));ts.set(e,this),xl.register(this,{watcher:e,signal:this._$Sv}),e.watch(this._$Sv)}_$Sp(){this._$Su!==void 0&&(this._$Su.unwatch(this._$Sv),this._$Sv=void 0,this._$Su=void 0)}performUpdate(){this.isUpdatePending&&(this._$Sl(),this._$Si=!0,this._$St.set(this._$St.get()+1),this._$Si=!1,this._$Sv.get())}update(e){try{this._$So?(this._$So=!1,super.update(e)):this._$Sh.forEach((r=>r.commit()))}finally{this.isUpdatePending=!1,this._$Sh.clear()}}requestUpdate(e,r,o){this._$So=!0,super.requestUpdate(e,r,o)}connectedCallback(){super.connectedCallback(),this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),queueMicrotask((()=>{this.isConnected===!1&&this._$Sp()}))}_(e){this._$Sh.add(e);const r=this._$So;this.requestUpdate(),this._$So=r}m(e){this._$Sh.delete(e)}}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */X.State;X.Computed;const We=(t,e)=>new X.State(t,e);function Cl(t){return typeof t=="number"}function El(t){return typeof t=="string"}function kl(t){return typeof t=="bigint"}function di(t){return!!t&&Object.prototype.toString.call(t)==="[object Date]"&&!isNaN(t)}function pi(t){return t!=null&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"}var Sl=Symbol.for("decoders.kAnnotationRegistry"),fi=globalThis[Sl]??=new WeakSet;function ke(t){return fi.add(t),t}function mi(t,e){return ke({type:"object",fields:t,text:e})}function Al(t,e){return ke({type:"array",items:t,text:e})}function Re(t,e){return ke({type:"opaque",value:t,text:e})}function Pl(t,e){return ke({type:"scalar",value:t,text:e})}function gi(t,e){return e!==void 0?ke({...t,text:e}):t}function bi(t,e){const r=new Map([...t.fields,...e]);return mi(r,t.text)}function vi(t){return fi.has(t)}function Ol(t,e,r){r.add(t);const o=[];for(const s of t)o.push(vo(s,void 0,r));return Al(o,e)}function yi(t,e,r){r.add(t);const o=new Map;for(const s of Object.keys(t)){const i=t[s];o.set(s,vo(i,void 0,r))}return mi(o,e)}function vo(t,e,r){return t==null||typeof t=="string"||typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"||typeof t.getMonth=="function"?Pl(t,e):vi(t)?gi(t,e):Array.isArray(t)?r.has(t)?Re("<circular ref>",e):Ol(t,e,r):pi(t)?r.has(t)?Re("<circular ref>",e):yi(t,e,r):Re(typeof t=="function"?"<function>":"???",e)}function Nt(t,e){return vo(t,e,new WeakSet)}function wi(t,e){return yi(t,e,new WeakSet)}var Dt="  ";function zr(t){return t.includes(`
`)}function yo(t,e=Dt){return zr(t)?t.split(`
`).map(r=>`${e}${r}`).join(`
`):`${e}${t}`}var Tl=/'/g;function ie(t){return typeof t=="string"?"'"+t.replace(Tl,"\\'")+"'":t===void 0?"undefined":JSON.stringify(t)}function qe(t,e=[]){const r=[];if(t.type==="array"){const i=t.items;let n=0;for(const a of i)for(const l of qe(a,[...e,n++]))r.push(l)}else if(t.type==="object"){const i=t.fields;for(const[n,a]of i)for(const l of qe(a,[...e,n]))r.push(l)}const o=t.text;if(!o)return r;let s;return e.length===0?s="":e.length===1?s=typeof e[0]=="number"?`Value at index ${e[0]}: `:`Value at key ${ie(e[0])}: `:s=`Value at keypath ${ie(e.map(String).join("."))}: `,[...r,`${s}${o}`]}function Rl(t,e=80){let r=JSON.stringify(t);if(r.length<=e)return r;const o=`${t.substring(0,e-15)}...`;return r=`${JSON.stringify(o)} [truncated]`,r}function Ll(t,e){const{items:r}=t;if(r.length===0)return"[]";const o=[];for(const s of r){const[i,n]=wo(s,`${e}${Dt}`);o.push(`${e}${Dt}${i},`),n!==void 0&&o.push(yo(n,`${e}${Dt}`))}return["[",...o,`${e}]`].join(`
`)}function zl(t,e){const{fields:r}=t;if(r.size===0)return"{}";const o=[];for(const[s,i]of r){const n=_i(s),a=`${e}${Dt}${" ".repeat(n.length+2)}`,[l,c]=wo(i,`${e}${Dt}`);o.push(`${e}${Dt}${n}: ${l},`),c!==void 0&&o.push(yo(c,a))}return["{",...o,`${e}}`].join(`
`)}function _i(t){return typeof t=="string"?Rl(t):typeof t=="number"||typeof t=="boolean"||typeof t=="symbol"?t.toString():t===null?"null":t===void 0?"undefined":di(t)?`new Date(${ie(t.toISOString())})`:t instanceof Date?"(Invalid Date)":"(unserializable)"}function wo(t,e=""){let r;t.type==="array"?r=Ll(t,e):t.type==="object"?r=zl(t,e):t.type==="scalar"?r=_i(t.value):r=t.value;const o=t.text;if(o!==void 0){const s="^".repeat(zr(r)?1:r.length);return[r,[s,o].join(zr(o)?`
`:" ")]}else return[r,void 0]}function Nl(t){const[e,r]=wo(t);return r!==void 0?`${e}
${r}`:e}function Dl(t){return qe(t,[]).join(`
`)}function*Nr(t,e){switch(t.text&&(e.length>0?yield{message:t.text,path:[...e]}:yield{message:t.text}),t.type){case"array":{let r=0;for(const o of t.items)e.push(r++),yield*Nr(o,e),e.pop();break}case"object":{for(const[r,o]of t.fields)e.push(r),yield*Nr(o,e),e.pop();break}}}function Ml(t){return Array.from(Nr(t,[]))}function $i(t){return{ok:!0,value:t,error:void 0}}function xi(t){return{ok:!1,value:void 0,error:t}}function Il(t){return e=>{try{const r=t(e);return $i(r)}catch(r){return xi(Nt(e,r instanceof Error?r.message:String(r)))}}}function Bl(t,e){const r=e(t);if(typeof r=="string"){const o=new Error(`
${r}`);return o.name="Decoding error",o}else return r}function F(t){function e(h){return t(h,$i,b=>xi(vi(b)?b:Nt(h,b)))}function r(h,g=Nl){const b=e(h);if(b.ok)return b.value;throw Bl(b.error,g)}function o(h){return e(h).value}function s(h){return a(Il(h))}function i(h,g){return c(b=>h(b)?null:g)}function n(){return m}function a(h){return F((g,b,E)=>{const $=e(g);if(!$.ok)return $;const x=es(h)?h:h($.value,b,E);return es(x)?x.decode($.value):x})}function l(h){return a(h)}function c(h){return a((g,b,E)=>{const $=h(g);return $===null?b(g):E(typeof $=="string"?Nt(g,$):$)})}function d(h){return F((g,b,E)=>{const $=e(g);return $.ok?$:E(Nt($.error,h))})}const m=Ul({verify:r,value:o,decode:e,transform:s,refine:i,refineType:n,reject:c,describe:d,then:a,pipe:l,"~standard":{version:1,vendor:"decoders",validate:h=>{const g=e(h);return g.ok?{value:g.value}:{issues:Ml(g.error)}}}});return m}var Vl=Symbol.for("decoders.kDecoderRegistry"),Ci=globalThis[Vl]??=new WeakSet;function Ul(t){return Ci.add(t),t}function es(t){return Ci.has(t)}var Fl=F((t,e,r)=>Array.isArray(t)?e(t):r("Must be an array"));function St(t){const e=t.decode;return Fl.then((r,o,s)=>{const i=[];for(let n=0;n<r.length;++n){const a=r[n],l=e(a);if(l.ok)i.push(l.value);else{i.length=0;const c=l.error,d=r.slice();return d.splice(n,1,Nt(c,c.text?`${c.text} (at index ${n})`:`index ${n}`)),s(Nt(d))}}return o(i)})}function jl(t){return F((e,r,o)=>e instanceof t?r(e):o(`Must be ${t.name} instance`))}function Ei(t){return F(e=>t().decode(e))}function Hl(t,e){const r=new Set;for(const o of t)e.has(o)||r.add(o);return r}var ki=F((t,e,r)=>pi(t)?e(t):r("Must be an object"));function q(t){const e=new Set(Object.keys(t));return ki.then((r,o,s)=>{const i=new Set(Object.keys(r)),n=Hl(e,i),a={};let l=null;for(const c of Object.keys(t)){const d=t[c],u=r[c],m=d.decode(u);if(m.ok){const h=m.value;h!==void 0&&(a[c]=h),n.delete(c)}else{const h=m.error;u===void 0?n.add(c):(l??=new Map,l.set(c,h))}}if(l||n.size>0){let c=wi(r);if(l&&(c=bi(c,l)),n.size>0){const d=Array.from(n).map(ie).join(", "),u=n.size>1?"keys":"key";c=gi(c,`Missing ${u}: ${d}`)}return s(c)}return o(a)})}var Dr=`Either:
`;function Wl(t){return`-${yo(t).substring(1)}`}function ql(t){return t.startsWith(Dr)?t.substring(Dr.length):Wl(t)}function ne(...t){if(t.length===0)throw new Error("Pass at least one decoder to either()");return F((e,r,o)=>{const s=[];for(const n of t){const a=n.decode(e);if(a.ok)return a;s.push(a.error)}const i=Dr+s.map(n=>ql(qe(n).join(`
`))).join(`
`);return o(i)})}var Mr=Ke(null);Ke(void 0);F((t,e,r)=>t==null?e(t):r("Must be undefined or null"));function Ke(t){return F((e,r,o)=>e===t?r(t):o(`Must be ${typeof t=="symbol"?String(t):ie(t)}`))}var Kl=F((t,e,r)=>e(t)),Si=Kl,k=F((t,e,r)=>typeof t=="boolean"?e(t):r("Must be boolean"));F((t,e,r)=>e(!!t));function Ai(t,e){const r=e!==void 0?t:void 0,o=e??t;return ki.then((s,i,n)=>{let a={};const l=new Map;for(const c of Object.keys(s)){const d=s[c],u=r?.decode(c);if(u?.ok===!1)return n(Nt(s,`Invalid key ${ie(c)}: ${Dl(u.error)}`));const m=u?.value??c,h=o.decode(d);h.ok?l.size===0&&(a[m]=h.value):(l.set(c,h.error),a={})}return l.size>0?n(bi(wi(s),l)):i(a)})}var Gl=/^([A-Za-z]{2,12}(?:[+][A-Za-z]{2,12})?):\/\/(?:([^@:]*:?(?:[^@]+)?)@)?(?:([A-Za-z0-9.-]+)(?::([0-9]{2,5}))?)(\/(?:[-+~%/.,\w]*)?(?:\?[-+=&;%@.,/\w]*)?(?:#[.,!/\w]*)?)?$/,w=F((t,e,r)=>El(t)?e(t):r("Must be string"));At(/\S/,"Must be non-empty string");function At(t,e){return w.refine(r=>t.test(r),e)}At(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Must be email");var Zl=ne(At(Gl,"Must be URL").transform(t=>new URL(t)),jl(URL));Zl.refine(t=>t.protocol==="https:","Must be an HTTPS URL");At(/^[a-z_][a-z0-9_]*$/i,"Must be valid identifier");var Pi=At(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,"Must be uuid");Pi.refine(t=>t[14]==="1","Must be uuidv1");Pi.refine(t=>t[14]==="4","Must be uuidv4");var Xl=At(/^[0-9]+$/,"Must only contain digits");At(/^[0-9a-f]+$/i,"Must only contain hexadecimal digits");Xl.transform(Number);var Jl=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.]\d+)?(?:Z|[+-]\d{2}:?\d{2})$/,Yl=F((t,e,r)=>di(t)?e(t):r("Must be a Date")),Ql=At(Jl,"Must be ISO8601 format").refine(t=>!isNaN(new Date(t).getTime()),"Must be valid date/time value"),tc=Ql.transform(t=>new Date(t));ne(Yl,tc).describe("Must be a Date or date string");var ec=F((t,e,r)=>Cl(t)?e(t):r("Must be number")),L=ec.refine(t=>Number.isFinite(t),"Number must be finite"),rc=L.refine(t=>Number.isInteger(t),"Number must be an integer");L.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");rc.refine(t=>t>=0&&!Object.is(t,-0),"Number must be positive");F((t,e,r)=>kl(t)?e(t):r("Must be bigint"));var oc=Ei(()=>Ai(Oi)),sc=Ei(()=>St(Oi)),Oi=ne(Mr,w,L,k,oc,sc).describe("Must be valid JSON value");const ic=["family","climbing"],nc=q({width:L,height:L,url:w,accessories:St(Si)}),Ti=q({header_full_width:L,header_full_height:L,avatar_shape:w,background_color:w,body_font:w,header_bounds:w,header_image:w,header_image_focused:w,header_image_poster:w,header_image_scaled:w,header_stretch:k,link_color:w,show_avatar:k,show_description:k,show_header_image:k,show_title:k,title_color:w,title_font:w,title_font_weight:w}),Ri=q({admin:k,ask:k,ask_anon:k,ask_page_title:w,asks_allow_media:k,avatar:St(nc),can_chat:k,can_send_fan_mail:k,can_subscribe:k,description:w,drafts:L,facebook:w,facebook_opengraph_enabled:w,followed:k,followers:L,is_blocked_from_primary:k,is_nsfw:k,messages:L,name:w,posts:L,primary:k,queue:L,share_likes:k,subscribed:k,theme_id:L,theme:Ti,title:w,total_posts:L,tweet:w,twitter_enabled:k,twitter_send:k,type:w,updated:L,url:w,uuid:w}),ac=q({name:w,title:w,description:w,url:w,uuid:w,updated:L,tumblrmart_accessories:Ai(w,Si),can_show_badges:k}),lc=q({comment:w,tree_html:w}),cc=q({blog:q({name:w,active:k,theme:Ti,share_likes:k,share_following:k,can_be_followed:k}),post:q({id:w}),content_raw:w,content:w,is_current_item:k,is_root_item:k}),uc=q({type:w,is_blocks_post_format:k,blog_name:w,blog:ac,id:w,id_string:w,is_blazed:k,is_blaze_pending:k,can_ignite:k,can_blaze:k,post_url:w,slug:w,date:w,timestamp:L,state:w,format:w,reblog_key:w,tags:St(w),short_url:w,summary:w,should_open_in_legacy:k,recommended_source:ne(w,Mr),recommended_color:ne(w,Mr),followed:k,liked:k,note_count:L,title:w,body:w,reblog:lc,trail:St(cc),can_like:k,interactability_reblog:w,interactability_blaze:w,can_reblog:k,can_send_in_message:k,muted:k,mute_end_timestamp:L,can_mute:k,can_reply:k,display_avatar:k}),hc=q({blog:Ri,posts:St(uc),total_posts:L});q({blog:q({blog:Ri}),posts:hc});const dc=q({avatar:w,updated:L,title:w,description:w}),pc=q({id:w,date:L,body:w,tags:St(w)});class Wt extends Qt{createRenderRoot(){return this}}const fc=["PENDING"];class _o{#s=new X.State(fc);#r;constructor(e){if(this.constructor!==_o)throw new Error("tracked-async-data cannot be subclassed");if(!rs(e)){this.#s.set(["RESOLVED",e]),this.#r=Promise.resolve(e);return}this.#r=e,this.#r.then(r=>{this.#s.set(["RESOLVED",r])},r=>{this.#s.set(["REJECTED",r])})}then=(e,r)=>{if(rs(this.#r))return this.#r.then(e).catch(r);if(this.state==="RESOLVED")return e(this.value);if(this.state==="REJECTED"&&r)return r(this.error);throw new Error("Value was not resolveable")};get state(){return this.#s.get()[0]}get value(){let e=this.#s.get();return e[0]==="RESOLVED"?e[1]:null}get error(){let e=this.#s.get();return e[0]==="REJECTED"?e[1]:null}get isPending(){return this.state==="PENDING"}get isResolved(){return this.state==="RESOLVED"}get isRejected(){return this.state==="REJECTED"}toJSON(){const{isPending:e,isResolved:r,isRejected:o}=this;return e?{isPending:e,isResolved:r,isRejected:o}:r?{isPending:e,isResolved:r,value:this.value,isRejected:o}:{isPending:e,isResolved:r,isRejected:o,error:this.error}}toString(){return JSON.stringify(this.toJSON(),null,2)}}function mc(t,e){return t in e}function rs(t){return typeof t=="object"&&t!==null&&mc("then",t)&&typeof t.then=="function"}function os(t){if(arguments.length===1){if(typeof t!="function")throw new Error("signalFunction must be called with a function passed");return new gc(t)}throw new Error("Unknown arity: signalFunction must be called with 1 argument")}class gc{#s=new X.State(null);get data(){return this.#e.get(),this.#s.get()}#r=new X.State(void 0);get promise(){return this.#e.get(),this.#r.get()}#o=new X.State(void 0);get caughtError(){return this.#e.get(),this.#o.get()}#t;#e;constructor(e){this.#t=e,this.#e=new X.Computed(()=>(this.retry(),this))}get state(){return this.#e.get(),this.data?.state??"UNSTARTED"}get isPending(){return this.#e.get(),this.data?this.data.isPending??!1:!0}get isFinished(){return this.#e.get(),this.isResolved||this.isRejected}get isSettled(){return this.#e.get(),this.isFinished}get isLoading(){return this.#e.get(),this.isPending}get isResolved(){return this.#e.get(),this.data?.isResolved??!1}get isError(){return this.#e.get(),this.isRejected}get isRejected(){return this.#e.get(),this.data?.isRejected??!!this.caughtError??!1}get value(){return this.#e.get(),this.data?.isResolved?this.data.value:null}get error(){return this.#e.get(),this.state==="UNSTARTED"&&this.caughtError?this.caughtError:this.data?.state!=="REJECTED"?null:this.caughtError?this.caughtError:this.data?.error??null}retry=async()=>{try{await this.#l()}catch(e){this.#o.set(e)}};async#l(){return this.#s.set(null),this.#r.set(this.#t()),await Promise.resolve(),this.#o.set(null),this.#s.set(new _o(this.promise)),this.promise}}class bc{constructor(){this.meta=os(async()=>{const r=await(await fetch("/dadmaxxing/meta.json")).json();return dc.verify(r)}),this.posts=os(async()=>{const r=await(await fetch("/dadmaxxing/posts.json")).json();return St(pc).verify(r)})}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ss=new WeakMap,is=t=>{if((r=>r.pattern!==void 0)(t))return t.pattern;let e=ss.get(t);return e===void 0&&ss.set(t,e=new URLPattern({pathname:t.path})),e};let vc=class{constructor(e,r,o){this.routes=[],this.o=[],this.t={},this.i=s=>{if(s.routes===this)return;const i=s.routes;this.o.push(i),i.h=this,s.stopImmediatePropagation(),s.onDisconnect=()=>{this.o?.splice(this.o.indexOf(i)>>>0,1)};const n=ns(this.t);n!==void 0&&i.goto(n)},(this.l=e).addController(this),this.routes=[...r],this.fallback=o?.fallback}link(e){if(e?.startsWith("/"))return e;if(e?.startsWith("."))throw Error("Not implemented");return e??=this.u,(this.h?.link()??"")+e}async goto(e){let r;if(this.routes.length===0&&this.fallback===void 0)r=e,this.u="",this.t={0:r};else{const o=this.p(e);if(o===void 0)throw Error("No route found for "+e);const s=is(o).exec({pathname:e}),i=s?.pathname.groups??{};if(r=ns(i),typeof o.enter=="function"&&await o.enter(i)===!1)return;this.v=o,this.t=i,this.u=r===void 0?e:e.substring(0,e.length-r.length)}if(r!==void 0)for(const o of this.o)o.goto(r);this.l.requestUpdate()}outlet(){return this.v?.render?.(this.t)}get params(){return this.t}p(e){const r=this.routes.find((o=>is(o).test({pathname:e})));return r||this.fallback===void 0?r:this.fallback?{...this.fallback,path:"/*"}:void 0}hostConnected(){this.l.addEventListener(Ir.eventName,this.i);const e=new Ir(this);this.l.dispatchEvent(e),this._=e.onDisconnect}hostDisconnected(){this._?.(),this.h=void 0}};const ns=t=>{let e;for(const r of Object.keys(t))/\d+/.test(r)&&(e===void 0||r>e)&&(e=r);return e&&t[e]};let Ir=class Li extends Event{constructor(e){super(Li.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.routes=e}};Ir.eventName="lit-routes-connected";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yc=location.origin||location.protocol+"//"+location.host;class wc extends vc{constructor(){super(...arguments),this.m=e=>{const r=e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey;if(e.defaultPrevented||r)return;const o=e.composedPath().find((n=>n.tagName==="A"));if(o===void 0||o.target!==""||o.hasAttribute("download")||o.getAttribute("rel")==="external")return;const s=o.href;if(s===""||s.startsWith("mailto:"))return;const i=window.location;o.origin===yc&&(e.preventDefault(),s!==i.href&&(window.history.pushState({},"",s),this.goto(o.pathname)))},this.R=e=>{this.goto(window.location.pathname)}}hostConnected(){super.hostConnected(),window.addEventListener("click",this.m),window.addEventListener("popstate",this.R),this.goto(window.location.pathname)}hostDisconnected(){super.hostDisconnected(),window.removeEventListener("click",this.m),window.removeEventListener("popstate",this.R)}}class _c extends wc{constructor(){super(...arguments),this.pathname=We(void 0),this.fragment=We(void 0)}async goto(e){const r=e.replace(/\/$/,"");await super.goto(r),this.pathname.set(r),this.fragment.set(location.hash.replace(/^#/,""))}}const zi="app-theme",$c=ne(Ke("light"),Ke("dark"));function xc(){return $c.value(localStorage.getItem(zi))}function Cc(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}class Ec{constructor(){this.activeTheme=We(xc()??Cc()),this.toggle=()=>{const e=this.activeTheme.get()==="dark"?"light":"dark";this.activeTheme.set(e),localStorage.setItem(zi,e)}}}var kc=Object.defineProperty,Sc=Object.getOwnPropertyDescriptor,Ni=(t,e,r,o)=>{for(var s=o>1?void 0:o?Sc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&kc(e,r,s),s};function Ac({meta:t}){return S`<app-document .meta=${t}></app-document>`}let Br=class extends Ht(Wt){updated(){switch(this.meta?.state){case"REJECTED":{document.title="error";return}case"RESOLVED":{document.title=this.meta.value?.title??"",Hs(S`<link rel="icon" type="image/png" href=${this.meta.value?.avatar}></link>`,document.head);return}}}};Ni([f()],Br.prototype,"meta",2);Br=Ni([Ut("app-document")],Br);var Pc=Object.defineProperty,Oc=Object.getOwnPropertyDescriptor,Di=(t,e,r,o)=>{for(var s=o>1?void 0:o?Oc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Pc(e,r,s),s};function Tc({meta:t}){return S` <app-footer .meta=${t}></app-footer> `}let Vr=class extends Ht(Wt){render(){switch(this.meta?.state){case"RESOLVED":{const t=this.meta?.value?.updated??0,e=new Date(t*1e3).toISOString();return S`
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
        `}default:return S`
          <footer>
            <div></div>
            <div>
              <sl-button @click=${()=>window.scrollTo(0,0)}
                >scroll up</sl-button
              >
            </div>
          </footer>
        `}}};Di([f()],Vr.prototype,"meta",2);Vr=Di([Ut("app-footer")],Vr);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const as=(t,e,r)=>{const o=new Map;for(let s=e;s<=r;s++)o.set(t[s],s);return o},Ur=tr(class extends er{constructor(t){if(super(t),t.type!==ft.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,e,r){let o;r===void 0?r=e:e!==void 0&&(o=e);const s=[],i=[];let n=0;for(const a of t)s[n]=o?o(a,n):n,i[n]=r(a,n),n++;return{values:i,keys:s}}render(t,e,r){return this.dt(t,e,r).values}update(t,[e,r,o]){const s=jn(t),{values:i,keys:n}=this.dt(e,r,o);if(!Array.isArray(s))return this.ut=n,i;const a=this.ut??=[],l=[];let c,d,u=0,m=s.length-1,h=0,g=i.length-1;for(;u<=m&&h<=g;)if(s[u]===null)u++;else if(s[m]===null)m--;else if(a[u]===n[h])l[h]=Tt(s[u],i[h]),u++,h++;else if(a[m]===n[g])l[g]=Tt(s[m],i[g]),m--,g--;else if(a[u]===n[g])l[g]=Tt(s[u],i[g]),ge(t,l[g+1],s[u]),u++,g--;else if(a[m]===n[h])l[h]=Tt(s[m],i[h]),ge(t,s[u],s[m]),m--,h++;else if(c===void 0&&(c=as(n,h,g),d=as(a,u,m)),c.has(a[u]))if(c.has(a[m])){const b=d.get(n[h]),E=b!==void 0?s[b]:null;if(E===null){const $=ge(t,s[u]);Tt($,i[h]),l[h]=$}else l[h]=Tt(E,i[h]),ge(t,s[u],E),s[b]=null;h++}else fr(s[m]),m--;else fr(s[u]),u++;for(;h<=g;){const b=ge(t,l[g+1]);Tt(b,i[h]),l[h++]=b}for(;u<=m;){const b=s[u++];b!==null&&fr(b)}return this.ut=n,Gs(t,l),Z}});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Fr extends er{constructor(e){if(super(e),this.it=z,e.type!==ft.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===z||e==null)return this._t=void 0,this.it=e;if(e===Z)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}}Fr.directiveName="unsafeHTML",Fr.resultType=1;const jr=tr(Fr);var Rc=Object.defineProperty,Lc=Object.getOwnPropertyDescriptor,Se=(t,e,r,o)=>{for(var s=o>1?void 0:o?Lc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Rc(e,r,s),s};const zc=[{label:"Home",href:"/dadmaxxing"},{label:"Family",href:"/dadmaxxing/family"},{label:"Climbing",href:"/dadmaxxing/climbing"},{label:"Gaming",href:"/dadmaxxing/gaming"},{label:"Anime",href:"/dadmaxxing/anime"},{label:"Source",href:"https://github.com/defevan/dadmaxxing"}];function Nc({pathname:t,meta:e,activeTheme:r,toggleTheme:o}){return S`
    <app-header
      .pathname=${t}
      .meta=${e}
      .activeTheme=${r}
      .toggleTheme=${o}
    ></app-header>
  `}let ae=class extends Ht(Wt){typographyElements(){switch(this.meta?.state){case"REJECTED":{const t=S`<h1>error</h1>`,e=S`<p>uh, big issue, failed to get the blog meta data</p>`;return{h1:t,p:e}}default:{const t=this.meta?.value?S`<h1>${this.meta.value.title}</h1>`:S`<h1>${jr("&nbsp;")}</h1>`,e=this.meta?.value?S`<p>${this.meta.value.description}</p>`:S`<p>${jr("&nbsp;")}</p>`;return{h1:t,p:e}}}}render(){const{h1:t,p:e}=this.typographyElements(),r=Ur(zc,o=>o.href,o=>this.renderLink(o));return S`
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
    `}renderLink({href:t,label:e}){if(t.includes("https://"))return S`<a href=${t}>${e}</a>`;const r=this.pathname?.get()===t;return S`<a href=${t} ?active=${r}>${e}</a>`}};Se([f()],ae.prototype,"pathname",2);Se([f()],ae.prototype,"meta",2);Se([f()],ae.prototype,"activeTheme",2);Se([f()],ae.prototype,"toggleTheme",2);ae=Se([Ut("app-header")],ae);var Dc=Object.defineProperty,Mc=Object.getOwnPropertyDescriptor,$o=(t,e,r,o)=>{for(var s=o>1?void 0:o?Mc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Dc(e,r,s),s};class Mi extends CustomEvent{constructor(e){super("cards",{detail:e})}}function qt({tags:t,posts:e,handleCards:r}){function o(s){if(!(s instanceof Mi)){console.warn("received unknown event",s);return}r(s)}return S`
    <app-post-list
      .tags=${t}
      .posts=${e}
      @cards=${o}
    ></app-post-list>
  `}let Ge=class extends Ht(Wt){updated(){const t=this.querySelectorAll("div.card");this.dispatchEvent(new Mi(t))}render(){switch(this.posts?.state){case"RESOLVED":{const e=(this.posts.value??[]).filter(o=>o.tags.some(s=>this.tags?.includes(s)));if(e.length<1)return S`
            <div class="msg">¯\\_(ツ)_/¯ 404 i couldn't find the thing</div>
          `;const r=Ur(e,o=>o.id,o=>this.renderPost(o));return S`
          ${r}
          <sl-divider></sl-divider>
        `}case"REJECTED":return S`
          <div class="msg">(x_x) 500 something went horribly wrong</div>
        `;default:return null}}renderPost(t){const e=new Date(t.date),r=`${location.origin}${location.pathname}#${t.id}`;return S`
      <sl-divider></sl-divider>
      <div class="card-container">
        <div id=${t.id} class="card" tabindex="0">
          <div class="card-header">
            <sl-format-date
              month="long"
              day="numeric"
              year="numeric"
              date=${e.toISOString()}
            ></sl-format-date>
            <a href=${`#${t.id}`} class="copy-link">
              <sl-copy-button value=${r}></sl-copy-button>
            </a>
          </div>
          <div class="card-body">${this.renderPostBody(t.body)}</div>
          <div class="card-footer">${this.renderTags(t.tags)}</div>
        </div>
      </div>
    `}renderTags(t){return Ur(t,e=>e,e=>{const r=`/dadmaxxing/${e}`,o=`#${e}`;return S`
          <a href=${r}>
            <sl-tag pill>${o}</sl-tag>
          </a>
        `})}renderPostBody(t){const r=new DOMParser().parseFromString(t,"text/html");for(const o of r.querySelectorAll("figure")){const s=parseFloat(o.getAttribute("data-orig-height")??""),i=parseFloat(o.getAttribute("data-orig-width")??"");if(isNaN(s)||isNaN(i)){console.warn("failed to set img/video aspect ratio");continue}const n=[...o.querySelectorAll("img"),...o.querySelectorAll("video")];for(const a of n)a.style.aspectRatio=`${i} / ${s}`,a.style.backgroundColor="rgba(128, 128, 128, 0.1)"}return jr(r.body.innerHTML)}};$o([f()],Ge.prototype,"tags",2);$o([f()],Ge.prototype,"posts",2);Ge=$o([Ut("app-post-list")],Ge);var Ic=Object.defineProperty,Bc=Object.getOwnPropertyDescriptor,ur=(t,e,r,o)=>{for(var s=o>1?void 0:o?Bc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Ic(e,r,s),s};function Vc({pathname:t,fragment:e,cards:r}){return S`
    <app-scroller
      .pathname=${t}
      .fragment=${e}
      .cards=${r}
    ></app-scroller>
  `}let Ce=class extends Ht(Wt){async updated(){const t=this.fragment?.get(),e=this.cards?.get();if(!e||e.length<1)return;const r=Array.from(e).find(o=>o.id===t);await new Promise(requestAnimationFrame),r?r.scrollIntoView({behavior:"auto",block:"start",inline:"nearest"}):window.scrollTo(0,0)}};ur([f()],Ce.prototype,"pathname",2);ur([f()],Ce.prototype,"fragment",2);ur([f()],Ce.prototype,"cards",2);Ce=ur([Ut("app-scroller")],Ce);var Uc=Object.defineProperty,Fc=Object.getOwnPropertyDescriptor,Ii=(t,e,r,o)=>{for(var s=o>1?void 0:o?Fc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Uc(e,r,s),s};function jc({activeTheme:t}){return S` <app-theme .activeTheme=${t}></app-theme> `}let Hr=class extends Ht(Wt){updated(){this.activeTheme?.get()==="dark"?document.documentElement.classList.add("sl-theme-dark"):document.documentElement.classList.remove("sl-theme-dark")}};Ii([f()],Hr.prototype,"activeTheme",2);Hr=Ii([Ut("app-theme")],Hr);var Hc=Object.getOwnPropertyDescriptor,Wc=(t,e,r,o)=>{for(var s=o>1?void 0:o?Hc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=n(s)||s);return s};let ls=class extends Ht(Wt){constructor(){super(...arguments),this.theme=new Ec,this.blog=new bc,this.cards=We(void 0),this.router=new _c(this,[{path:"/dadmaxxing{/}?",render:()=>qt({tags:ic,posts:this.blog.posts,handleCards:t=>this.cards.set(t.detail)})},{path:"/dadmaxxing/family{/}?",render:()=>qt({tags:["family"],posts:this.blog.posts,handleCards:t=>this.cards.set(t.detail)})},{path:"/dadmaxxing/climbing{/}?",render:()=>qt({tags:["climbing"],posts:this.blog.posts,handleCards:t=>this.cards.set(t.detail)})},{path:"/dadmaxxing/gaming{/}?",render:()=>qt({tags:["gaming"],posts:this.blog.posts,handleCards:t=>this.cards.set(t.detail)})},{path:"/dadmaxxing/anime{/}?",render:()=>qt({tags:["anime"],posts:this.blog.posts,handleCards:t=>this.cards.set(t.detail)})},{path:"/dadmaxxing/*",render:()=>qt({tags:[],posts:this.blog.posts,handleCards:t=>this.cards.set(t.detail)})}])}render(){const{pathname:t,fragment:e}=this.router,{meta:r}=this.blog,{activeTheme:o,toggle:s}=this.theme,{cards:i}=this;return S`
      <main>
        <div>
          ${Nc({pathname:t,meta:r,activeTheme:o,toggleTheme:s})}
          ${this.router.outlet()}
        </div>
        ${Tc({meta:r})}
      </main>
      ${Vc({pathname:t,fragment:e,cards:i})}
      ${Ac({meta:r})} ${jc({activeTheme:o})}
    `}};ls=Wc([Ut("app-root")],ls);
