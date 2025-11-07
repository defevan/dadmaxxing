(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function i(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=i(o);fetch(o.href,s)}})();window.requestIdleCallback=window.requestIdleCallback||function(e){var t=Date.now();return setTimeout(function(){e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-t))}})},1)};window.cancelIdleCallback=window.cancelIdleCallback||function(e){clearTimeout(e)};var Un=Object.defineProperty,x=(e,t)=>Un(e,"name",{value:t,configurable:!0}),oe=class{type=3;name="";prefix="";value="";suffix="";modifier=3;constructor(t,i,r,o,s,n){this.type=t,this.name=i,this.prefix=r,this.value=o,this.suffix=s,this.modifier=n}hasCustomName(){return this.name!==""&&typeof this.name!="number"}};x(oe,"Part");var Hn=/[$_\p{ID_Start}]/u,Wn=/[$_\u200C\u200D\p{ID_Continue}]/u,ji=".*";function Bo(e,t){return(t?/^[\x00-\xFF]*$/:/^[\x00-\x7F]*$/).test(e)}x(Bo,"isASCII");function sr(e,t=!1){let i=[],r=0;for(;r<e.length;){let o=e[r],s=x(function(n){if(!t)throw new TypeError(n);i.push({type:"INVALID_CHAR",index:r,value:e[r++]})},"ErrorOrInvalid");if(o==="*"){i.push({type:"ASTERISK",index:r,value:e[r++]});continue}if(o==="+"||o==="?"){i.push({type:"OTHER_MODIFIER",index:r,value:e[r++]});continue}if(o==="\\"){i.push({type:"ESCAPED_CHAR",index:r++,value:e[r++]});continue}if(o==="{"){i.push({type:"OPEN",index:r,value:e[r++]});continue}if(o==="}"){i.push({type:"CLOSE",index:r,value:e[r++]});continue}if(o===":"){let n="",a=r+1;for(;a<e.length;){let l=e.substr(a,1);if(a===r+1&&Hn.test(l)||a!==r+1&&Wn.test(l)){n+=e[a++];continue}break}if(!n){s(`Missing parameter name at ${r}`);continue}i.push({type:"NAME",index:r,value:n}),r=a;continue}if(o==="("){let n=1,a="",l=r+1,c=!1;if(e[l]==="?"){s(`Pattern cannot start with "?" at ${l}`);continue}for(;l<e.length;){if(!Bo(e[l],!1)){s(`Invalid character '${e[l]}' at ${l}.`),c=!0;break}if(e[l]==="\\"){a+=e[l++]+e[l++];continue}if(e[l]===")"){if(n--,n===0){l++;break}}else if(e[l]==="("&&(n++,e[l+1]!=="?")){s(`Capturing groups are not allowed at ${l}`),c=!0;break}a+=e[l++]}if(c)continue;if(n){s(`Unbalanced pattern at ${r}`);continue}if(!a){s(`Missing pattern at ${r}`);continue}i.push({type:"REGEX",index:r,value:a}),r=l;continue}i.push({type:"CHAR",index:r,value:e[r++]})}return i.push({type:"END",index:r,value:""}),i}x(sr,"lexer");function nr(e,t={}){let i=sr(e);t.delimiter??="/#?",t.prefixes??="./";let r=`[^${K(t.delimiter)}]+?`,o=[],s=0,n=0,a=new Set,l=x(w=>{if(n<i.length&&i[n].type===w)return i[n++].value},"tryConsume"),c=x(()=>l("OTHER_MODIFIER")??l("ASTERISK"),"tryConsumeModifier"),h=x(w=>{let $=l(w);if($!==void 0)return $;let{type:C,index:E}=i[n];throw new TypeError(`Unexpected ${C} at ${E}, expected ${w}`)},"mustConsume"),d=x(()=>{let w="",$;for(;$=l("CHAR")??l("ESCAPED_CHAR");)w+=$;return w},"consumeText"),p=x(w=>w,"DefaultEncodePart"),u=t.encodePart||p,m="",b=x(w=>{m+=w},"appendToPendingFixedValue"),_=x(()=>{m.length&&(o.push(new oe(3,"","",u(m),"",3)),m="")},"maybeAddPartFromPendingFixedValue"),v=x((w,$,C,E,O)=>{let z=3;switch(O){case"?":z=1;break;case"*":z=0;break;case"+":z=2;break}if(!$&&!C&&z===3){b(w);return}if(_(),!$&&!C){if(!w)return;o.push(new oe(3,"","",u(w),"",z));return}let L;C?C==="*"?L=ji:L=C:L=r;let N=2;L===r?(N=1,L=""):L===ji&&(N=0,L="");let T;if($?T=$:C&&(T=s++),a.has(T))throw new TypeError(`Duplicate name '${T}'.`);a.add(T),o.push(new oe(N,T,u(w),L,u(E),z))},"addPart");for(;n<i.length;){let w=l("CHAR"),$=l("NAME"),C=l("REGEX");if(!$&&!C&&(C=l("ASTERISK")),$||C){let O=w??"";t.prefixes.indexOf(O)===-1&&(b(O),O=""),_();let z=c();v(O,$,C,"",z);continue}let E=w??l("ESCAPED_CHAR");if(E){b(E);continue}if(l("OPEN")){let O=d(),z=l("NAME"),L=l("REGEX");!z&&!L&&(L=l("ASTERISK"));let N=d();h("CLOSE");let T=c();v(O,z,L,N,T);continue}_(),h("END")}return o}x(nr,"parse");function K(e){return e.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}x(K,"escapeString");function Fi(e){return e&&e.ignoreCase?"ui":"u"}x(Fi,"flags");function No(e,t,i){return ar(nr(e,i),t,i)}x(No,"stringToRegexp");function Vt(e){switch(e){case 0:return"*";case 1:return"?";case 2:return"+";case 3:return""}}x(Vt,"modifierToString");function ar(e,t,i={}){i.delimiter??="/#?",i.prefixes??="./",i.sensitive??=!1,i.strict??=!1,i.end??=!0,i.start??=!0,i.endsWith="";let r=i.start?"^":"";for(let a of e){if(a.type===3){a.modifier===3?r+=K(a.value):r+=`(?:${K(a.value)})${Vt(a.modifier)}`;continue}t&&t.push(a.name);let l=`[^${K(i.delimiter)}]+?`,c=a.value;if(a.type===1?c=l:a.type===0&&(c=ji),!a.prefix.length&&!a.suffix.length){a.modifier===3||a.modifier===1?r+=`(${c})${Vt(a.modifier)}`:r+=`((?:${c})${Vt(a.modifier)})`;continue}if(a.modifier===3||a.modifier===1){r+=`(?:${K(a.prefix)}(${c})${K(a.suffix)})`,r+=Vt(a.modifier);continue}r+=`(?:${K(a.prefix)}`,r+=`((?:${c})(?:`,r+=K(a.suffix),r+=K(a.prefix),r+=`(?:${c}))*)${K(a.suffix)})`,a.modifier===0&&(r+="?")}let o=`[${K(i.endsWith)}]|$`,s=`[${K(i.delimiter)}]`;if(i.end)return i.strict||(r+=`${s}?`),i.endsWith.length?r+=`(?=${o})`:r+="$",new RegExp(r,Fi(i));i.strict||(r+=`(?:${s}(?=${o}))?`);let n=!1;if(e.length){let a=e[e.length-1];a.type===3&&a.modifier===3&&(n=i.delimiter.indexOf(a)>-1)}return n||(r+=`(?=${s}|${o})`),new RegExp(r,Fi(i))}x(ar,"partsToRegexp");var xt={delimiter:"",prefixes:"",sensitive:!0,strict:!0},qn={delimiter:".",prefixes:"",sensitive:!0,strict:!0},Gn={delimiter:"/",prefixes:"/",sensitive:!0,strict:!0};function jo(e,t){return e.length?e[0]==="/"?!0:!t||e.length<2?!1:(e[0]=="\\"||e[0]=="{")&&e[1]=="/":!1}x(jo,"isAbsolutePathname");function lr(e,t){return e.startsWith(t)?e.substring(t.length,e.length):e}x(lr,"maybeStripPrefix");function Fo(e,t){return e.endsWith(t)?e.substr(0,e.length-t.length):e}x(Fo,"maybeStripSuffix");function cr(e){return!e||e.length<2?!1:e[0]==="["||(e[0]==="\\"||e[0]==="{")&&e[1]==="["}x(cr,"treatAsIPv6Hostname");var Uo=["ftp","file","http","https","ws","wss"];function hr(e){if(!e)return!0;for(let t of Uo)if(e.test(t))return!0;return!1}x(hr,"isSpecialScheme");function Ho(e,t){if(e=lr(e,"#"),t||e==="")return e;let i=new URL("https://example.com");return i.hash=e,i.hash?i.hash.substring(1,i.hash.length):""}x(Ho,"canonicalizeHash");function Wo(e,t){if(e=lr(e,"?"),t||e==="")return e;let i=new URL("https://example.com");return i.search=e,i.search?i.search.substring(1,i.search.length):""}x(Wo,"canonicalizeSearch");function qo(e,t){return t||e===""?e:cr(e)?fr(e):dr(e)}x(qo,"canonicalizeHostname");function Go(e,t){if(t||e==="")return e;let i=new URL("https://example.com");return i.password=e,i.password}x(Go,"canonicalizePassword");function Ko(e,t){if(t||e==="")return e;let i=new URL("https://example.com");return i.username=e,i.username}x(Ko,"canonicalizeUsername");function Yo(e,t,i){if(i||e==="")return e;if(t&&!Uo.includes(t))return new URL(`${t}:${e}`).pathname;let r=e[0]=="/";return e=new URL(r?e:"/-"+e,"https://example.com").pathname,r||(e=e.substring(2,e.length)),e}x(Yo,"canonicalizePathname");function Zo(e,t,i){return ur(t)===e&&(e=""),i||e===""?e:pr(e)}x(Zo,"canonicalizePort");function Xo(e,t){return e=Fo(e,":"),t||e===""?e:pi(e)}x(Xo,"canonicalizeProtocol");function ur(e){switch(e){case"ws":case"http":return"80";case"wws":case"https":return"443";case"ftp":return"21";default:return""}}x(ur,"defaultPortForProtocol");function pi(e){if(e==="")return e;if(/^[-+.A-Za-z0-9]*$/.test(e))return e.toLowerCase();throw new TypeError(`Invalid protocol '${e}'.`)}x(pi,"protocolEncodeCallback");function Jo(e){if(e==="")return e;let t=new URL("https://example.com");return t.username=e,t.username}x(Jo,"usernameEncodeCallback");function Qo(e){if(e==="")return e;let t=new URL("https://example.com");return t.password=e,t.password}x(Qo,"passwordEncodeCallback");function dr(e){if(e==="")return e;if(/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e))throw new TypeError(`Invalid hostname '${e}'`);let t=new URL("https://example.com");return t.hostname=e,t.hostname}x(dr,"hostnameEncodeCallback");function fr(e){if(e==="")return e;if(/[^0-9a-fA-F[\]:]/g.test(e))throw new TypeError(`Invalid IPv6 hostname '${e}'`);return e.toLowerCase()}x(fr,"ipv6HostnameEncodeCallback");function pr(e){if(e===""||/^[0-9]*$/.test(e)&&parseInt(e)<=65535)return e;throw new TypeError(`Invalid port '${e}'.`)}x(pr,"portEncodeCallback");function ts(e){if(e==="")return e;let t=new URL("https://example.com");return t.pathname=e[0]!=="/"?"/-"+e:e,e[0]!=="/"?t.pathname.substring(2,t.pathname.length):t.pathname}x(ts,"standardURLPathnameEncodeCallback");function es(e){return e===""?e:new URL(`data:${e}`).pathname}x(es,"pathURLPathnameEncodeCallback");function is(e){if(e==="")return e;let t=new URL("https://example.com");return t.search=e,t.search.substring(1,t.search.length)}x(is,"searchEncodeCallback");function rs(e){if(e==="")return e;let t=new URL("https://example.com");return t.hash=e,t.hash.substring(1,t.hash.length)}x(rs,"hashEncodeCallback");var os=class{#e;#o=[];#i={};#t=0;#s=1;#c=0;#a=0;#f=0;#p=0;#m=!1;constructor(t){this.#e=t}get result(){return this.#i}parse(){for(this.#o=sr(this.#e,!0);this.#t<this.#o.length;this.#t+=this.#s){if(this.#s=1,this.#o[this.#t].type==="END"){if(this.#a===0){this.#y(),this.#h()?this.#r(9,1):this.#u()?this.#r(8,1):this.#r(7,0);continue}else if(this.#a===2){this.#d(5);continue}this.#r(10,0);break}if(this.#f>0)if(this.#E())this.#f-=1;else continue;if(this.#C()){this.#f+=1;continue}switch(this.#a){case 0:this.#_()&&this.#d(1);break;case 1:if(this.#_()){this.#z();let t=7,i=1;this.#x()?(t=2,i=3):this.#m&&(t=2),this.#r(t,i)}break;case 2:this.#b()?this.#d(3):(this.#v()||this.#u()||this.#h())&&this.#d(5);break;case 3:this.#$()?this.#r(4,1):this.#b()&&this.#r(5,1);break;case 4:this.#b()&&this.#r(5,1);break;case 5:this.#k()?this.#p+=1:this.#A()&&(this.#p-=1),this.#S()&&!this.#p?this.#r(6,1):this.#v()?this.#r(7,0):this.#u()?this.#r(8,1):this.#h()&&this.#r(9,1);break;case 6:this.#v()?this.#r(7,0):this.#u()?this.#r(8,1):this.#h()&&this.#r(9,1);break;case 7:this.#u()?this.#r(8,1):this.#h()&&this.#r(9,1);break;case 8:this.#h()&&this.#r(9,1);break}}this.#i.hostname!==void 0&&this.#i.port===void 0&&(this.#i.port="")}#r(t,i){switch(this.#a){case 0:break;case 1:this.#i.protocol=this.#l();break;case 2:break;case 3:this.#i.username=this.#l();break;case 4:this.#i.password=this.#l();break;case 5:this.#i.hostname=this.#l();break;case 6:this.#i.port=this.#l();break;case 7:this.#i.pathname=this.#l();break;case 8:this.#i.search=this.#l();break;case 9:this.#i.hash=this.#l();break}this.#a!==0&&t!==10&&([1,2,3,4].includes(this.#a)&&[6,7,8,9].includes(t)&&(this.#i.hostname??=""),[1,2,3,4,5,6].includes(this.#a)&&[8,9].includes(t)&&(this.#i.pathname??=this.#m?"/":""),[1,2,3,4,5,6,7].includes(this.#a)&&t===9&&(this.#i.search??="")),this.#w(t,i)}#w(t,i){this.#a=t,this.#c=this.#t+i,this.#t+=i,this.#s=0}#y(){this.#t=this.#c,this.#s=0}#d(t){this.#y(),this.#a=t}#g(t){return t<0&&(t=this.#o.length-t),t<this.#o.length?this.#o[t]:this.#o[this.#o.length-1]}#n(t,i){let r=this.#g(t);return r.value===i&&(r.type==="CHAR"||r.type==="ESCAPED_CHAR"||r.type==="INVALID_CHAR")}#_(){return this.#n(this.#t,":")}#x(){return this.#n(this.#t+1,"/")&&this.#n(this.#t+2,"/")}#b(){return this.#n(this.#t,"@")}#$(){return this.#n(this.#t,":")}#S(){return this.#n(this.#t,":")}#v(){return this.#n(this.#t,"/")}#u(){if(this.#n(this.#t,"?"))return!0;if(this.#o[this.#t].value!=="?")return!1;let t=this.#g(this.#t-1);return t.type!=="NAME"&&t.type!=="REGEX"&&t.type!=="CLOSE"&&t.type!=="ASTERISK"}#h(){return this.#n(this.#t,"#")}#C(){return this.#o[this.#t].type=="OPEN"}#E(){return this.#o[this.#t].type=="CLOSE"}#k(){return this.#n(this.#t,"[")}#A(){return this.#n(this.#t,"]")}#l(){let t=this.#o[this.#t],i=this.#g(this.#c).index;return this.#e.substring(i,t.index)}#z(){let t={};Object.assign(t,xt),t.encodePart=pi;let i=No(this.#l(),void 0,t);this.#m=hr(i)}};x(os,"Parser");var Pi=["protocol","username","password","hostname","port","pathname","search","hash"],wt="*";function Ui(e,t){if(typeof e!="string")throw new TypeError("parameter 1 is not of type 'string'.");let i=new URL(e,t);return{protocol:i.protocol.substring(0,i.protocol.length-1),username:i.username,password:i.password,hostname:i.hostname,port:i.port,pathname:i.pathname,search:i.search!==""?i.search.substring(1,i.search.length):void 0,hash:i.hash!==""?i.hash.substring(1,i.hash.length):void 0}}x(Ui,"extractValues");function lt(e,t){return t?ee(e):e}x(lt,"processBaseURLString");function Qt(e,t,i){let r;if(typeof t.baseURL=="string")try{r=new URL(t.baseURL),t.protocol===void 0&&(e.protocol=lt(r.protocol.substring(0,r.protocol.length-1),i)),!i&&t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.username===void 0&&(e.username=lt(r.username,i)),!i&&t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.username===void 0&&t.password===void 0&&(e.password=lt(r.password,i)),t.protocol===void 0&&t.hostname===void 0&&(e.hostname=lt(r.hostname,i)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&(e.port=lt(r.port,i)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.pathname===void 0&&(e.pathname=lt(r.pathname,i)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.pathname===void 0&&t.search===void 0&&(e.search=lt(r.search.substring(1,r.search.length),i)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.pathname===void 0&&t.search===void 0&&t.hash===void 0&&(e.hash=lt(r.hash.substring(1,r.hash.length),i))}catch{throw new TypeError(`invalid baseURL '${t.baseURL}'.`)}if(typeof t.protocol=="string"&&(e.protocol=Xo(t.protocol,i)),typeof t.username=="string"&&(e.username=Ko(t.username,i)),typeof t.password=="string"&&(e.password=Go(t.password,i)),typeof t.hostname=="string"&&(e.hostname=qo(t.hostname,i)),typeof t.port=="string"&&(e.port=Zo(t.port,e.protocol,i)),typeof t.pathname=="string"){if(e.pathname=t.pathname,r&&!jo(e.pathname,i)){let o=r.pathname.lastIndexOf("/");o>=0&&(e.pathname=lt(r.pathname.substring(0,o+1),i)+e.pathname)}e.pathname=Yo(e.pathname,e.protocol,i)}return typeof t.search=="string"&&(e.search=Wo(t.search,i)),typeof t.hash=="string"&&(e.hash=Ho(t.hash,i)),e}x(Qt,"applyInit");function ee(e){return e.replace(/([+*?:{}()\\])/g,"\\$1")}x(ee,"escapePatternString");function ss(e){return e.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}x(ss,"escapeRegexpString");function ns(e,t){t.delimiter??="/#?",t.prefixes??="./",t.sensitive??=!1,t.strict??=!1,t.end??=!0,t.start??=!0,t.endsWith="";let i=".*",r=`[^${ss(t.delimiter)}]+?`,o=/[$_\u200C\u200D\p{ID_Continue}]/u,s="";for(let n=0;n<e.length;++n){let a=e[n];if(a.type===3){if(a.modifier===3){s+=ee(a.value);continue}s+=`{${ee(a.value)}}${Vt(a.modifier)}`;continue}let l=a.hasCustomName(),c=!!a.suffix.length||!!a.prefix.length&&(a.prefix.length!==1||!t.prefixes.includes(a.prefix)),h=n>0?e[n-1]:null,d=n<e.length-1?e[n+1]:null;if(!c&&l&&a.type===1&&a.modifier===3&&d&&!d.prefix.length&&!d.suffix.length)if(d.type===3){let p=d.value.length>0?d.value[0]:"";c=o.test(p)}else c=!d.hasCustomName();if(!c&&!a.prefix.length&&h&&h.type===3){let p=h.value[h.value.length-1];c=t.prefixes.includes(p)}c&&(s+="{"),s+=ee(a.prefix),l&&(s+=`:${a.name}`),a.type===2?s+=`(${a.value})`:a.type===1?l||(s+=`(${r})`):a.type===0&&(!l&&(!h||h.type===3||h.modifier!==3||c||a.prefix!=="")?s+="*":s+=`(${i})`),a.type===1&&l&&a.suffix.length&&o.test(a.suffix[0])&&(s+="\\"),s+=ee(a.suffix),c&&(s+="}"),a.modifier!==3&&(s+=Vt(a.modifier))}return s}x(ns,"partsToPattern");var as=class{#e;#o={};#i={};#t={};#s={};#c=!1;constructor(e={},t,i){try{let r;if(typeof t=="string"?r=t:i=t,typeof e=="string"){let a=new os(e);if(a.parse(),e=a.result,r===void 0&&typeof e.protocol!="string")throw new TypeError("A base URL must be provided for a relative constructor string.");e.baseURL=r}else{if(!e||typeof e!="object")throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");if(r)throw new TypeError("parameter 1 is not of type 'string'.")}typeof i>"u"&&(i={ignoreCase:!1});let o={ignoreCase:i.ignoreCase===!0},s={pathname:wt,protocol:wt,username:wt,password:wt,hostname:wt,port:wt,search:wt,hash:wt};this.#e=Qt(s,e,!0),ur(this.#e.protocol)===this.#e.port&&(this.#e.port="");let n;for(n of Pi){if(!(n in this.#e))continue;let a={},l=this.#e[n];switch(this.#i[n]=[],n){case"protocol":Object.assign(a,xt),a.encodePart=pi;break;case"username":Object.assign(a,xt),a.encodePart=Jo;break;case"password":Object.assign(a,xt),a.encodePart=Qo;break;case"hostname":Object.assign(a,qn),cr(l)?a.encodePart=fr:a.encodePart=dr;break;case"port":Object.assign(a,xt),a.encodePart=pr;break;case"pathname":hr(this.#o.protocol)?(Object.assign(a,Gn,o),a.encodePart=ts):(Object.assign(a,xt,o),a.encodePart=es);break;case"search":Object.assign(a,xt,o),a.encodePart=is;break;case"hash":Object.assign(a,xt,o),a.encodePart=rs;break}try{this.#s[n]=nr(l,a),this.#o[n]=ar(this.#s[n],this.#i[n],a),this.#t[n]=ns(this.#s[n],a),this.#c=this.#c||this.#s[n].some(c=>c.type===2)}catch{throw new TypeError(`invalid ${n} pattern '${this.#e[n]}'.`)}}}catch(r){throw new TypeError(`Failed to construct 'URLPattern': ${r.message}`)}}get[Symbol.toStringTag](){return"URLPattern"}test(e={},t){let i={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof e!="string"&&t)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof e>"u")return!1;try{typeof e=="object"?i=Qt(i,e,!1):i=Qt(i,Ui(e,t),!1)}catch{return!1}let r;for(r of Pi)if(!this.#o[r].exec(i[r]))return!1;return!0}exec(e={},t){let i={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof e!="string"&&t)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof e>"u")return;try{typeof e=="object"?i=Qt(i,e,!1):i=Qt(i,Ui(e,t),!1)}catch{return null}let r={};t?r.inputs=[e,t]:r.inputs=[e];let o;for(o of Pi){let s=this.#o[o].exec(i[o]);if(!s)return null;let n={};for(let[a,l]of this.#i[o].entries())if(typeof l=="string"||typeof l=="number"){let c=s[a+1];n[l]=c}r[o]={input:i[o]??"",groups:n}}return r}static compareComponent(e,t,i){let r=x((a,l)=>{for(let c of["type","modifier","prefix","value","suffix"]){if(a[c]<l[c])return-1;if(a[c]!==l[c])return 1}return 0},"comparePart"),o=new oe(3,"","","","",3),s=new oe(0,"","","","",3),n=x((a,l)=>{let c=0;for(;c<Math.min(a.length,l.length);++c){let h=r(a[c],l[c]);if(h)return h}return a.length===l.length?0:r(a[c]??o,l[c]??o)},"comparePartList");return!t.#t[e]&&!i.#t[e]?0:t.#t[e]&&!i.#t[e]?n(t.#s[e],[s]):!t.#t[e]&&i.#t[e]?n([s],i.#s[e]):n(t.#s[e],i.#s[e])}get protocol(){return this.#t.protocol}get username(){return this.#t.username}get password(){return this.#t.password}get hostname(){return this.#t.hostname}get port(){return this.#t.port}get pathname(){return this.#t.pathname}get search(){return this.#t.search}get hash(){return this.#t.hash}get hasRegExpGroups(){return this.#c}};x(as,"URLPattern");globalThis.URLPattern||(globalThis.URLPattern=as);const Hi=new Set,ie=new Map;let Dt,mr="ltr",gr="en";const ls=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(ls){const e=new MutationObserver(hs);mr=document.documentElement.dir||"ltr",gr=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function cs(...e){e.map(t=>{const i=t.$code.toLowerCase();ie.has(i)?ie.set(i,Object.assign(Object.assign({},ie.get(i)),t)):ie.set(i,t),Dt||(Dt=t)}),hs()}function hs(){ls&&(mr=document.documentElement.dir||"ltr",gr=document.documentElement.lang||navigator.language),[...Hi.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let Kn=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){Hi.add(this.host)}hostDisconnected(){Hi.delete(this.host)}dir(){return`${this.host.dir||mr}`.toLowerCase()}lang(){return`${this.host.lang||gr}`.toLowerCase()}getTranslationData(t){var i,r;const o=new Intl.Locale(t.replace(/_/g,"-")),s=o?.language.toLowerCase(),n=(r=(i=o?.region)===null||i===void 0?void 0:i.toLowerCase())!==null&&r!==void 0?r:"",a=ie.get(`${s}-${n}`),l=ie.get(s);return{locale:o,language:s,region:n,primary:a,secondary:l}}exists(t,i){var r;const{primary:o,secondary:s}=this.getTranslationData((r=i.lang)!==null&&r!==void 0?r:this.lang());return i=Object.assign({includeFallback:!1},i),!!(o&&o[t]||s&&s[t]||i.includeFallback&&Dt&&Dt[t])}term(t,...i){const{primary:r,secondary:o}=this.getTranslationData(this.lang());let s;if(r&&r[t])s=r[t];else if(o&&o[t])s=o[t];else if(Dt&&Dt[t])s=Dt[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof s=="function"?s(...i):s}date(t,i){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),i).format(t)}number(t,i){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),i).format(t)}relativeTime(t,i,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,i)}};var us={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};cs(us);var Yn=us,qt=class extends Kn{};cs(Yn);var ds=Object.defineProperty,Zn=Object.defineProperties,Xn=Object.getOwnPropertyDescriptor,Jn=Object.getOwnPropertyDescriptors,Nr=Object.getOwnPropertySymbols,Qn=Object.prototype.hasOwnProperty,ta=Object.prototype.propertyIsEnumerable,fs=e=>{throw TypeError(e)},jr=(e,t,i)=>t in e?ds(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,Gt=(e,t)=>{for(var i in t||(t={}))Qn.call(t,i)&&jr(e,i,t[i]);if(Nr)for(var i of Nr(t))ta.call(t,i)&&jr(e,i,t[i]);return e},mi=(e,t)=>Zn(e,Jn(t)),f=(e,t,i,r)=>{for(var o=r>1?void 0:r?Xn(t,i):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(o=(r?n(t,i,o):n(o))||o);return r&&o&&ds(t,i,o),o},ps=(e,t,i)=>t.has(e)||fs("Cannot "+i),ea=(e,t,i)=>(ps(e,t,"read from private field"),t.get(e)),ia=(e,t,i)=>t.has(e)?fs("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),ra=(e,t,i,r)=>(ps(e,t,"write to private field"),t.set(e,i),i);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ze=globalThis,br=Ze.ShadowRoot&&(Ze.ShadyCSS===void 0||Ze.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,vr=Symbol(),Fr=new WeakMap;let ms=class{constructor(t,i,r){if(this._$cssResult$=!0,r!==vr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(br&&t===void 0){const r=i!==void 0&&i.length===1;r&&(t=Fr.get(i)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Fr.set(i,t))}return t}toString(){return this.cssText}};const oa=e=>new ms(typeof e=="string"?e:e+"",void 0,vr),Q=(e,...t)=>{const i=e.length===1?e[0]:t.reduce(((r,o,s)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[s+1]),e[0]);return new ms(i,e,vr)},sa=(e,t)=>{if(br)e.adoptedStyleSheets=t.map((i=>i instanceof CSSStyleSheet?i:i.styleSheet));else for(const i of t){const r=document.createElement("style"),o=Ze.litNonce;o!==void 0&&r.setAttribute("nonce",o),r.textContent=i.cssText,e.appendChild(r)}},Ur=br?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const r of t.cssRules)i+=r.cssText;return oa(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:na,defineProperty:aa,getOwnPropertyDescriptor:la,getOwnPropertyNames:ca,getOwnPropertySymbols:ha,getPrototypeOf:ua}=Object,gi=globalThis,Hr=gi.trustedTypes,da=Hr?Hr.emptyScript:"",fa=gi.reactiveElementPolyfillSupport,Ae=(e,t)=>e,le={toAttribute(e,t){switch(t){case Boolean:e=e?da:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},yr=(e,t)=>!na(e,t),Wr={attribute:!0,type:String,converter:le,reflect:!1,useDefault:!1,hasChanged:yr};Symbol.metadata??=Symbol("metadata"),gi.litPropertyMetadata??=new WeakMap;let te=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Wr){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const r=Symbol(),o=this.getPropertyDescriptor(t,r,i);o!==void 0&&aa(this.prototype,t,o)}}static getPropertyDescriptor(t,i,r){const{get:o,set:s}=la(this.prototype,t)??{get(){return this[i]},set(n){this[i]=n}};return{get:o,set(n){const a=o?.call(this);s?.call(this,n),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Wr}static _$Ei(){if(this.hasOwnProperty(Ae("elementProperties")))return;const t=ua(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ae("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ae("properties"))){const i=this.properties,r=[...ca(i),...ha(i)];for(const o of r)this.createProperty(o,i[o])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[r,o]of i)this.elementProperties.set(r,o)}this._$Eh=new Map;for(const[i,r]of this.elementProperties){const o=this._$Eu(i,r);o!==void 0&&this._$Eh.set(o,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const o of r)i.unshift(Ur(o))}else t!==void 0&&i.push(Ur(t));return i}static _$Eu(t,i){const r=i.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const r of i.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return sa(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,i,r){this._$AK(t,r)}_$ET(t,i){const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){const s=(r.converter?.toAttribute!==void 0?r.converter:le).toAttribute(i,r.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,i){const r=this.constructor,o=r._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const s=r.getPropertyOptions(o),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:le;this._$Em=o;const a=n.fromAttribute(i,s.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,i,r){if(t!==void 0){const o=this.constructor,s=this[t];if(r??=o.getPropertyOptions(t),!((r.hasChanged??yr)(s,i)||r.useDefault&&r.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,i,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,i,{useDefault:r,reflect:o,wrapped:s},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??i??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(i=void 0),this._$AL.set(t,i)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,s]of r){const{wrapped:n}=s,a=this[o];n!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,s,a)}}let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this._$EO?.forEach((r=>r.hostUpdate?.())),this.update(i)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(i)}willUpdate(t){}_$AE(t){this._$EO?.forEach((i=>i.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((i=>this._$ET(i,this[i]))),this._$EM()}updated(t){}firstUpdated(t){}};te.elementStyles=[],te.shadowRootOptions={mode:"open"},te[Ae("elementProperties")]=new Map,te[Ae("finalized")]=new Map,fa?.({ReactiveElement:te}),(gi.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _r=globalThis,ii=_r.trustedTypes,qr=ii?ii.createPolicy("lit-html",{createHTML:e=>e}):void 0,gs="$lit$",$t=`lit$${Math.random().toFixed(9).slice(2)}$`,bs="?"+$t,pa=`<${bs}>`,Ft=document,Pe=()=>Ft.createComment(""),Oe=e=>e===null||typeof e!="object"&&typeof e!="function",wr=Array.isArray,ma=e=>wr(e)||typeof e?.[Symbol.iterator]=="function",Oi=`[ 	
\f\r]`,xe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Gr=/-->/g,Kr=/>/g,Tt=RegExp(`>|${Oi}(?:([^\\s"'>=/]+)(${Oi}*=${Oi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yr=/'/g,Zr=/"/g,vs=/^(?:script|style|textarea|title)$/i,ga=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),k=ga(1),q=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),Xr=new WeakMap,Bt=Ft.createTreeWalker(Ft,129);function ys(e,t){if(!wr(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return qr!==void 0?qr.createHTML(t):t}const ba=(e,t)=>{const i=e.length-1,r=[];let o,s=t===2?"<svg>":t===3?"<math>":"",n=xe;for(let a=0;a<i;a++){const l=e[a];let c,h,d=-1,p=0;for(;p<l.length&&(n.lastIndex=p,h=n.exec(l),h!==null);)p=n.lastIndex,n===xe?h[1]==="!--"?n=Gr:h[1]!==void 0?n=Kr:h[2]!==void 0?(vs.test(h[2])&&(o=RegExp("</"+h[2],"g")),n=Tt):h[3]!==void 0&&(n=Tt):n===Tt?h[0]===">"?(n=o??xe,d=-1):h[1]===void 0?d=-2:(d=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?Tt:h[3]==='"'?Zr:Yr):n===Zr||n===Yr?n=Tt:n===Gr||n===Kr?n=xe:(n=Tt,o=void 0);const u=n===Tt&&e[a+1].startsWith("/>")?" ":"";s+=n===xe?l+pa:d>=0?(r.push(c),l.slice(0,d)+gs+l.slice(d)+$t+u):l+$t+(d===-2?a:u)}return[ys(e,s+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class Me{constructor({strings:t,_$litType$:i},r){let o;this.parts=[];let s=0,n=0;const a=t.length-1,l=this.parts,[c,h]=ba(t,i);if(this.el=Me.createElement(c,r),Bt.currentNode=this.el.content,i===2||i===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(o=Bt.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(const d of o.getAttributeNames())if(d.endsWith(gs)){const p=h[n++],u=o.getAttribute(d).split($t),m=/([.?@])?(.*)/.exec(p);l.push({type:1,index:s,name:m[2],strings:u,ctor:m[1]==="."?ya:m[1]==="?"?_a:m[1]==="@"?wa:bi}),o.removeAttribute(d)}else d.startsWith($t)&&(l.push({type:6,index:s}),o.removeAttribute(d));if(vs.test(o.tagName)){const d=o.textContent.split($t),p=d.length-1;if(p>0){o.textContent=ii?ii.emptyScript:"";for(let u=0;u<p;u++)o.append(d[u],Pe()),Bt.nextNode(),l.push({type:2,index:++s});o.append(d[p],Pe())}}}else if(o.nodeType===8)if(o.data===bs)l.push({type:2,index:s});else{let d=-1;for(;(d=o.data.indexOf($t,d+1))!==-1;)l.push({type:7,index:s}),d+=$t.length-1}s++}}static createElement(t,i){const r=Ft.createElement("template");return r.innerHTML=t,r}}function ce(e,t,i=e,r){if(t===q)return t;let o=r!==void 0?i._$Co?.[r]:i._$Cl;const s=Oe(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(e),o._$AT(e,i,r)),r!==void 0?(i._$Co??=[])[r]=o:i._$Cl=o),o!==void 0&&(t=ce(e,o._$AS(e,t.values),o,r)),t}let va=class{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:r}=this._$AD,o=(t?.creationScope??Ft).importNode(i,!0);Bt.currentNode=o;let s=Bt.nextNode(),n=0,a=0,l=r[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new me(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new xa(s,this,t)),this._$AV.push(c),l=r[++a]}n!==l?.index&&(s=Bt.nextNode(),n++)}return Bt.currentNode=Ft,o}p(t){let i=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,i),i+=r.strings.length-2):r._$AI(t[i])),i++}};class me{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,r,o){this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&t?.nodeType===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=ce(this,t,i),Oe(t)?t===M||t==null||t===""?(this._$AH!==M&&this._$AR(),this._$AH=M):t!==this._$AH&&t!==q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ma(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==M&&Oe(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ft.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Me.createElement(ys(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(i);else{const s=new va(o,this),n=s.u(this.options);s.p(i),this.T(n),this._$AH=s}}_$AC(t){let i=Xr.get(t.strings);return i===void 0&&Xr.set(t.strings,i=new Me(t)),i}k(t){wr(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let r,o=0;for(const s of t)o===i.length?i.push(r=new me(this.O(Pe()),this.O(Pe()),this,this.options)):r=i[o],r._$AI(s),o++;o<i.length&&(this._$AR(r&&r._$AB.nextSibling,o),i.length=o)}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class bi{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,r,o,s){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=M}_$AI(t,i=this,r,o){const s=this.strings;let n=!1;if(s===void 0)t=ce(this,t,i,0),n=!Oe(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const a=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=ce(this,a[r+l],i,l),c===q&&(c=this._$AH[l]),n||=!Oe(c)||c!==this._$AH[l],c===M?t=M:t!==M&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!o&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ya extends bi{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}}class _a extends bi{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==M)}}class wa extends bi{constructor(t,i,r,o,s){super(t,i,r,o,s),this.type=5}_$AI(t,i=this){if((t=ce(this,t,i,0)??M)===q)return;const r=this._$AH,o=t===M&&r!==M||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==M&&(r===M||o);o&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class xa{constructor(t,i,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ce(this,t)}}const $a={I:me},Sa=_r.litHtmlPolyfillSupport;Sa?.(Me,me),(_r.litHtmlVersions??=[]).push("3.3.1");const _s=(e,t,i)=>{const r=i?.renderBefore??t;let o=r._$litPart$;if(o===void 0){const s=i?.renderBefore??null;r._$litPart$=o=new me(t.insertBefore(Pe(),s),s,void 0,i??{})}return o._$AI(e),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xr=globalThis;let se=class extends te{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=_s(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};se._$litElement$=!0,se.finalized=!0,xr.litElementHydrateSupport?.({LitElement:se});const Ca=xr.litElementPolyfillSupport;Ca?.({LitElement:se});(xr.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const De=e=>(t,i)=>{i!==void 0?i.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ea={attribute:!0,type:String,converter:le,reflect:!1,hasChanged:yr},ka=(e=Ea,t,i)=>{const{kind:r,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(s===void 0&&globalThis.litPropertyMetadata.set(o,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),r==="accessor"){const{name:n}=i;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,e)},init(a){return a!==void 0&&this.C(n,void 0,e,a),a}}}if(r==="setter"){const{name:n}=i;return function(a){const l=this[n];t.call(this,a),this.requestUpdate(n,l,e)}}throw Error("Unsupported decorator location: "+r)};function g(e){return(t,i)=>typeof i=="object"?ka(e,t,i):((r,o,s)=>{const n=o.hasOwnProperty(s);return o.constructor.createProperty(s,r),n?Object.getOwnPropertyDescriptor(o,s):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Kt(e){return g({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Aa=(e,t,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,i),i);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function tt(e,t){return(i,r,o)=>{const s=n=>n.renderRoot?.querySelector(e)??null;return Aa(i,r,{get(){return s(this)}})}}var Xe,W=class extends se{constructor(){super(),ia(this,Xe,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){const i=new CustomEvent(e,Gt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(i),i}static define(e,t=this,i={}){const r=customElements.get(e);if(!r){try{customElements.define(e,t,i)}catch{customElements.define(e,class extends t{},i)}return}let o=" (unknown version)",s=o;"version"in t&&t.version&&(o=" v"+t.version),"version"in r&&r.version&&(s=" v"+r.version),!(o&&s&&o===s)&&console.warn(`Attempted to register <${e}>${o}, but <${e}>${s} has already been registered.`)}attributeChangedCallback(e,t,i){ea(this,Xe)||(this.constructor.elementProperties.forEach((r,o)=>{r.reflect&&this[o]!=null&&this.initialReflectedProperties.set(o,this[o])}),ra(this,Xe,!0)),super.attributeChangedCallback(e,t,i)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,i)=>{e.has(i)&&this[i]==null&&(this[i]=t)})}};Xe=new WeakMap;W.version="2.20.1";W.dependencies={};f([g()],W.prototype,"dir",2);f([g()],W.prototype,"lang",2);var X=class extends W{constructor(){super(...arguments),this.localize=new qt(this),this.date=new Date,this.hourFormat="auto"}render(){const e=new Date(this.date),t=this.hourFormat==="auto"?void 0:this.hourFormat==="12";if(!isNaN(e.getMilliseconds()))return k`
      <time datetime=${e.toISOString()}>
        ${this.localize.date(e,{weekday:this.weekday,era:this.era,year:this.year,month:this.month,day:this.day,hour:this.hour,minute:this.minute,second:this.second,timeZoneName:this.timeZoneName,timeZone:this.timeZone,hour12:t})}
      </time>
    `}};f([g()],X.prototype,"date",2);f([g()],X.prototype,"weekday",2);f([g()],X.prototype,"era",2);f([g()],X.prototype,"year",2);f([g()],X.prototype,"month",2);f([g()],X.prototype,"day",2);f([g()],X.prototype,"hour",2);f([g()],X.prototype,"minute",2);f([g()],X.prototype,"second",2);f([g({attribute:"time-zone-name"})],X.prototype,"timeZoneName",2);f([g({attribute:"time-zone"})],X.prototype,"timeZone",2);f([g({attribute:"hour-format"})],X.prototype,"hourFormat",2);X.define("sl-format-date");var za=Q`
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
`,$r=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=i=>{const r=i.target;(this.slotNames.includes("[default]")&&!r.name||r.name&&this.slotNames.includes(r.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return[...this.host.childNodes].some(e=>{if(e.nodeType===e.TEXT_NODE&&e.textContent.trim()!=="")return!0;if(e.nodeType===e.ELEMENT_NODE){const t=e;if(t.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!t.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(e){return this.host.querySelector(`:scope > [slot="${e}"]`)!==null}test(e){return e==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}},ft=Q`
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
 */const rt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},ge=e=>(...t)=>({_$litDirective$:e,values:t});let Ve=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,r){this._$Ct=t,this._$AM=i,this._$Ci=r}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=ge(class extends Ve{constructor(e){if(super(e),e.type!==rt.ATTRIBUTE||e.name!=="class"||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter((r=>r!==""))));for(const r in t)t[r]&&!this.nt?.has(r)&&this.st.add(r);return this.render(t)}const i=e.element.classList;for(const r of this.st)r in t||(i.remove(r),this.st.delete(r));for(const r in t){const o=!!t[r];o===this.st.has(r)||this.nt?.has(r)||(o?(i.add(r),this.st.add(r)):(i.remove(r),this.st.delete(r)))}return q}});var ws=class extends W{constructor(){super(...arguments),this.hasSlotController=new $r(this,"footer","header","image")}render(){return k`
      <div
        part="base"
        class=${ht({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `}};ws.styles=[ft,za];ws.define("sl-card");var Pa=Q`
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
`,xs=class extends W{constructor(){super(...arguments),this.localize=new qt(this)}render(){return k`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};xs.styles=[ft,Pa];var $e=new WeakMap,Se=new WeakMap,Ce=new WeakMap,Mi=new WeakSet,Ue=new WeakMap,$s=class{constructor(e,t){this.handleFormData=i=>{const r=this.options.disabled(this.host),o=this.options.name(this.host),s=this.options.value(this.host),n=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!r&&!n&&typeof o=="string"&&o.length>0&&typeof s<"u"&&(Array.isArray(s)?s.forEach(a=>{i.formData.append(o,a.toString())}):i.formData.append(o,s.toString()))},this.handleFormSubmit=i=>{var r;const o=this.options.disabled(this.host),s=this.options.reportValidity;this.form&&!this.form.noValidate&&((r=$e.get(this.form))==null||r.forEach(n=>{this.setUserInteracted(n,!0)})),this.form&&!this.form.noValidate&&!o&&!s(this.host)&&(i.preventDefault(),i.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),Ue.set(this.host,[])},this.handleInteraction=i=>{const r=Ue.get(this.host);r.includes(i.type)||r.push(i.type),r.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const i=this.form.querySelectorAll("*");for(const r of i)if(typeof r.checkValidity=="function"&&!r.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const i=this.form.querySelectorAll("*");for(const r of i)if(typeof r.reportValidity=="function"&&!r.reportValidity())return!1}return!0},(this.host=e).addController(this),this.options=Gt({form:i=>{const r=i.form;if(r){const s=i.getRootNode().querySelector(`#${r}`);if(s)return s}return i.closest("form")},name:i=>i.name,value:i=>i.value,defaultValue:i=>i.defaultValue,disabled:i=>{var r;return(r=i.disabled)!=null?r:!1},reportValidity:i=>typeof i.reportValidity=="function"?i.reportValidity():!0,checkValidity:i=>typeof i.checkValidity=="function"?i.checkValidity():!0,setValue:(i,r)=>i.value=r,assumeInteractionOn:["sl-input"]},t)}hostConnected(){const e=this.options.form(this.host);e&&this.attachForm(e),Ue.set(this.host,[]),this.options.assumeInteractionOn.forEach(t=>{this.host.addEventListener(t,this.handleInteraction)})}hostDisconnected(){this.detachForm(),Ue.delete(this.host),this.options.assumeInteractionOn.forEach(e=>{this.host.removeEventListener(e,this.handleInteraction)})}hostUpdated(){const e=this.options.form(this.host);e||this.detachForm(),e&&this.form!==e&&(this.detachForm(),this.attachForm(e)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(e){e?(this.form=e,$e.has(this.form)?$e.get(this.form).add(this.host):$e.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),Se.has(this.form)||(Se.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Ce.has(this.form)||(Ce.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const e=$e.get(this.form);e&&(e.delete(this.host),e.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),Se.has(this.form)&&(this.form.reportValidity=Se.get(this.form),Se.delete(this.form)),Ce.has(this.form)&&(this.form.checkValidity=Ce.get(this.form),Ce.delete(this.form)),this.form=void 0))}setUserInteracted(e,t){t?Mi.add(e):Mi.delete(e),e.requestUpdate()}doAction(e,t){if(this.form){const i=document.createElement("button");i.type=e,i.style.position="absolute",i.style.width="0",i.style.height="0",i.style.clipPath="inset(50%)",i.style.overflow="hidden",i.style.whiteSpace="nowrap",t&&(i.name=t.name,i.value=t.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(r=>{t.hasAttribute(r)&&i.setAttribute(r,t.getAttribute(r))})),this.form.append(i),i.click(),i.remove()}}getForm(){var e;return(e=this.form)!=null?e:null}reset(e){this.doAction("reset",e)}submit(e){this.doAction("submit",e)}setValidity(e){const t=this.host,i=!!Mi.has(t),r=!!t.required;t.toggleAttribute("data-required",r),t.toggleAttribute("data-optional",!r),t.toggleAttribute("data-invalid",!e),t.toggleAttribute("data-valid",e),t.toggleAttribute("data-user-invalid",!e&&i),t.toggleAttribute("data-user-valid",e&&i)}updateValidity(){const e=this.host;this.setValidity(e.validity.valid)}emitInvalidEvent(e){const t=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});e||t.preventDefault(),this.host.dispatchEvent(t)||e?.preventDefault()}},Sr=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(mi(Gt({},Sr),{valid:!1,valueMissing:!0}));Object.freeze(mi(Gt({},Sr),{valid:!1,customError:!0}));var Oa=Q`
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
`,Wi="";function Jr(e){Wi=e}function Ma(e=""){if(!Wi){const t=[...document.getElementsByTagName("script")],i=t.find(r=>r.hasAttribute("data-shoelace"));if(i)Jr(i.getAttribute("data-shoelace"));else{const r=t.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));let o="";r&&(o=r.getAttribute("src")),Jr(o.split("/").slice(0,-1).join("/"))}}return Wi.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var La={name:"default",resolver:e=>Ma(`assets/icons/${e}.svg`)},Ra=La,Qr={caret:`
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
  `},Ta={name:"system",resolver:e=>e in Qr?`data:image/svg+xml,${encodeURIComponent(Qr[e])}`:""},Ia=Ta,Da=[Ra,Ia],qi=[];function Va(e){qi.push(e)}function Ba(e){qi=qi.filter(t=>t!==e)}function to(e){return Da.find(t=>t.name===e)}var Na=Q`
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
`;function zt(e,t){const i=Gt({waitUntilFirstUpdate:!1},t);return(r,o)=>{const{update:s}=r,n=Array.isArray(e)?e:[e];r.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const h=a.get(c),d=this[c];h!==d&&(!i.waitUntilFirstUpdate||this.hasUpdated)&&this[o](h,d)}}),s.call(this,a)}}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:ja}=$a,Fa=(e,t)=>e?._$litType$!==void 0,Ss=e=>e.strings===void 0,eo=()=>document.createComment(""),Ee=(e,t,i)=>{const r=e._$AA.parentNode,o=t===void 0?e._$AB:t._$AA;if(i===void 0){const s=r.insertBefore(eo(),o),n=r.insertBefore(eo(),o);i=new ja(s,n,e,e.options)}else{const s=i._$AB.nextSibling,n=i._$AM,a=n!==e;if(a){let l;i._$AQ?.(e),i._$AM=e,i._$AP!==void 0&&(l=e._$AU)!==n._$AU&&i._$AP(l)}if(s!==o||a){let l=i._$AA;for(;l!==s;){const c=l.nextSibling;r.insertBefore(l,o),l=c}}}return i},It=(e,t,i=e)=>(e._$AI(t,i),e),Ua={},Cs=(e,t=Ua)=>e._$AH=t,Ha=e=>e._$AH,Li=e=>{e._$AR(),e._$AA.remove()};var ke=Symbol(),He=Symbol(),Ri,Ti=new Map,nt=class extends W{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(e,t){var i;let r;if(t?.spriteSheet)return this.svg=k`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(r=await fetch(e,{mode:"cors"}),!r.ok)return r.status===410?ke:He}catch{return He}try{const o=document.createElement("div");o.innerHTML=await r.text();const s=o.firstElementChild;if(((i=s?.tagName)==null?void 0:i.toLowerCase())!=="svg")return ke;Ri||(Ri=new DOMParser);const a=Ri.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):ke}catch{return ke}}connectedCallback(){super.connectedCallback(),Va(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Ba(this)}getIconSource(){const e=to(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const{url:t,fromLibrary:i}=this.getIconSource(),r=i?to(this.library):void 0;if(!t){this.svg=null;return}let o=Ti.get(t);if(o||(o=this.resolveIcon(t,r),Ti.set(t,o)),!this.initialRender)return;const s=await o;if(s===He&&Ti.delete(t),t===this.getIconSource().url){if(Fa(s)){if(this.svg=s,r){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof r.mutator=="function"&&n&&r.mutator(n)}return}switch(s){case He:case ke:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(e=r?.mutator)==null||e.call(r,this.svg),this.emit("sl-load")}}}render(){return this.svg}};nt.styles=[ft,Na];f([Kt()],nt.prototype,"svg",2);f([g({reflect:!0})],nt.prototype,"name",2);f([g()],nt.prototype,"src",2);f([g()],nt.prototype,"label",2);f([g({reflect:!0})],nt.prototype,"library",2);f([zt("label")],nt.prototype,"handleLabelChange",1);f([zt(["name","src","library"])],nt.prototype,"setIcon",1);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Es=Symbol.for(""),Wa=e=>{if(e?.r===Es)return e?._$litStatic$},ri=(e,...t)=>({_$litStatic$:t.reduce(((i,r,o)=>i+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(r)+e[o+1]),e[0]),r:Es}),io=new Map,qa=e=>(t,...i)=>{const r=i.length;let o,s;const n=[],a=[];let l,c=0,h=!1;for(;c<r;){for(l=t[c];c<r&&(s=i[c],(o=Wa(s))!==void 0);)l+=o+t[++c],h=!0;c!==r&&a.push(s),n.push(l),c++}if(c===r&&n.push(t[r]),h){const d=n.join("$$lit$$");(t=io.get(d))===void 0&&(n.raw=n,io.set(d,t=n)),i=a}return e(t,...i)},Je=qa(k);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const D=e=>e??M;var A=class extends W{constructor(){super(...arguments),this.formControlController=new $s(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new $r(this,"[default]","prefix","suffix"),this.localize=new qt(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:Sr}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(e){this.isButton()&&(this.button.setCustomValidity(e),this.formControlController.updateValidity())}render(){const e=this.isLink(),t=e?ri`a`:ri`button`;return Je`
      <${t}
        part="base"
        class=${ht({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${D(e?void 0:this.disabled)}
        type=${D(e?void 0:this.type)}
        title=${this.title}
        name=${D(e?void 0:this.name)}
        value=${D(e?void 0:this.value)}
        href=${D(e&&!this.disabled?this.href:void 0)}
        target=${D(e?this.target:void 0)}
        download=${D(e?this.download:void 0)}
        rel=${D(e?this.rel:void 0)}
        role=${D(e?void 0:"button")}
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
        ${this.caret?Je` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?Je`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${t}>
    `}};A.styles=[ft,Oa];A.dependencies={"sl-icon":nt,"sl-spinner":xs};f([tt(".button")],A.prototype,"button",2);f([Kt()],A.prototype,"hasFocus",2);f([Kt()],A.prototype,"invalid",2);f([g()],A.prototype,"title",2);f([g({reflect:!0})],A.prototype,"variant",2);f([g({reflect:!0})],A.prototype,"size",2);f([g({type:Boolean,reflect:!0})],A.prototype,"caret",2);f([g({type:Boolean,reflect:!0})],A.prototype,"disabled",2);f([g({type:Boolean,reflect:!0})],A.prototype,"loading",2);f([g({type:Boolean,reflect:!0})],A.prototype,"outline",2);f([g({type:Boolean,reflect:!0})],A.prototype,"pill",2);f([g({type:Boolean,reflect:!0})],A.prototype,"circle",2);f([g()],A.prototype,"type",2);f([g()],A.prototype,"name",2);f([g()],A.prototype,"value",2);f([g()],A.prototype,"href",2);f([g()],A.prototype,"target",2);f([g()],A.prototype,"rel",2);f([g()],A.prototype,"download",2);f([g()],A.prototype,"form",2);f([g({attribute:"formaction"})],A.prototype,"formAction",2);f([g({attribute:"formenctype"})],A.prototype,"formEnctype",2);f([g({attribute:"formmethod"})],A.prototype,"formMethod",2);f([g({attribute:"formnovalidate",type:Boolean})],A.prototype,"formNoValidate",2);f([g({attribute:"formtarget"})],A.prototype,"formTarget",2);f([zt("disabled",{waitUntilFirstUpdate:!0})],A.prototype,"handleDisabledChange",1);A.define("sl-button");var Ga=Q`
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
`,Ka=Q`
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
`,J=class extends W{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){const e=!!this.href,t=e?ri`a`:ri`button`;return Je`
      <${t}
        part="base"
        class=${ht({"icon-button":!0,"icon-button--disabled":!e&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${D(e?void 0:this.disabled)}
        type=${D(e?void 0:"button")}
        href=${D(e?this.href:void 0)}
        target=${D(e?this.target:void 0)}
        download=${D(e?this.download:void 0)}
        rel=${D(e&&this.target?"noreferrer noopener":void 0)}
        role=${D(e?void 0:"button")}
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
      </${t}>
    `}};J.styles=[ft,Ka];J.dependencies={"sl-icon":nt};f([tt(".icon-button")],J.prototype,"button",2);f([Kt()],J.prototype,"hasFocus",2);f([g()],J.prototype,"name",2);f([g()],J.prototype,"library",2);f([g()],J.prototype,"src",2);f([g()],J.prototype,"href",2);f([g()],J.prototype,"target",2);f([g()],J.prototype,"download",2);f([g()],J.prototype,"label",2);f([g({type:Boolean,reflect:!0})],J.prototype,"disabled",2);var Yt=class extends W{constructor(){super(...arguments),this.localize=new qt(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return k`
      <span
        part="base"
        class=${ht({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
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
    `}};Yt.styles=[ft,Ga];Yt.dependencies={"sl-icon-button":J};f([g({reflect:!0})],Yt.prototype,"variant",2);f([g({reflect:!0})],Yt.prototype,"size",2);f([g({type:Boolean,reflect:!0})],Yt.prototype,"pill",2);f([g({type:Boolean})],Yt.prototype,"removable",2);Yt.define("sl-tag");var Ya=Q`
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
`,Za=(e="value")=>(t,i)=>{const r=t.constructor,o=r.prototype.attributeChangedCallback;r.prototype.attributeChangedCallback=function(s,n,a){var l;const c=r.getPropertyOptions(e),h=typeof c.attribute=="string"?c.attribute:e;if(s===h){const d=c.converter||le,u=(typeof d=="function"?d:(l=d?.fromAttribute)!=null?l:le.fromAttribute)(a,c.type);this[e]!==u&&(this[i]=u)}o.call(this,s,n,a)}},Xa=Q`
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
 */const Ja=ge(class extends Ve{constructor(e){if(super(e),e.type!==rt.PROPERTY&&e.type!==rt.ATTRIBUTE&&e.type!==rt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Ss(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===q||t===M)return t;const i=e.element,r=e.name;if(e.type===rt.PROPERTY){if(t===i[r])return q}else if(e.type===rt.BOOLEAN_ATTRIBUTE){if(!!t===i.hasAttribute(r))return q}else if(e.type===rt.ATTRIBUTE&&i.getAttribute(r)===t+"")return q;return Cs(e),t}});var U=class extends W{constructor(){super(...arguments),this.formControlController=new $s(this,{value:e=>e.checked?e.value||"on":void 0,defaultValue:e=>e.defaultChecked,setValue:(e,t)=>e.checked=t}),this.hasSlotController=new $r(this,"help-text"),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.defaultChecked=!1,this.form="",this.required=!1,this.helpText=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}handleClick(){this.checked=!this.checked,this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleKeyDown(e){e.key==="ArrowLeft"&&(e.preventDefault(),this.checked=!1,this.emit("sl-change"),this.emit("sl-input")),e.key==="ArrowRight"&&(e.preventDefault(),this.checked=!0,this.emit("sl-change"),this.emit("sl-input"))}handleCheckedChange(){this.input.checked=this.checked,this.formControlController.updateValidity()}handleDisabledChange(){this.formControlController.setValidity(!0)}click(){this.input.click()}focus(e){this.input.focus(e)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){const e=this.hasSlotController.test("help-text"),t=this.helpText?!0:!!e;return k`
      <div
        class=${ht({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-help-text":t})}
      >
        <label
          part="base"
          class=${ht({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus,"switch--small":this.size==="small","switch--medium":this.size==="medium","switch--large":this.size==="large"})}
        >
          <input
            class="switch__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${D(this.value)}
            .checked=${Ja(this.checked)}
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
          aria-hidden=${t?"false":"true"}
          class="form-control__help-text"
          id="help-text"
          part="form-control-help-text"
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};U.styles=[ft,Xa,Ya];f([tt('input[type="checkbox"]')],U.prototype,"input",2);f([Kt()],U.prototype,"hasFocus",2);f([g()],U.prototype,"title",2);f([g()],U.prototype,"name",2);f([g()],U.prototype,"value",2);f([g({reflect:!0})],U.prototype,"size",2);f([g({type:Boolean,reflect:!0})],U.prototype,"disabled",2);f([g({type:Boolean,reflect:!0})],U.prototype,"checked",2);f([Za("checked")],U.prototype,"defaultChecked",2);f([g({reflect:!0})],U.prototype,"form",2);f([g({type:Boolean,reflect:!0})],U.prototype,"required",2);f([g({attribute:"help-text"})],U.prototype,"helpText",2);f([zt("checked",{waitUntilFirstUpdate:!0})],U.prototype,"handleCheckedChange",1);f([zt("disabled",{waitUntilFirstUpdate:!0})],U.prototype,"handleDisabledChange",1);U.define("sl-switch");var Qa=Q`
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
`,tl=Q`
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
`;const Ct=Math.min,Y=Math.max,oi=Math.round,We=Math.floor,ct=e=>({x:e,y:e}),el={left:"right",right:"left",bottom:"top",top:"bottom"},il={start:"end",end:"start"};function Gi(e,t,i){return Y(e,Ct(t,i))}function be(e,t){return typeof e=="function"?e(t):e}function Et(e){return e.split("-")[0]}function ve(e){return e.split("-")[1]}function ks(e){return e==="x"?"y":"x"}function Cr(e){return e==="y"?"height":"width"}const rl=new Set(["top","bottom"]);function bt(e){return rl.has(Et(e))?"y":"x"}function Er(e){return ks(bt(e))}function ol(e,t,i){i===void 0&&(i=!1);const r=ve(e),o=Er(e),s=Cr(o);let n=o==="x"?r===(i?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(n=si(n)),[n,si(n)]}function sl(e){const t=si(e);return[Ki(e),t,Ki(t)]}function Ki(e){return e.replace(/start|end/g,t=>il[t])}const ro=["left","right"],oo=["right","left"],nl=["top","bottom"],al=["bottom","top"];function ll(e,t,i){switch(e){case"top":case"bottom":return i?t?oo:ro:t?ro:oo;case"left":case"right":return t?nl:al;default:return[]}}function cl(e,t,i,r){const o=ve(e);let s=ll(Et(e),i==="start",r);return o&&(s=s.map(n=>n+"-"+o),t&&(s=s.concat(s.map(Ki)))),s}function si(e){return e.replace(/left|right|bottom|top/g,t=>el[t])}function hl(e){return{top:0,right:0,bottom:0,left:0,...e}}function As(e){return typeof e!="number"?hl(e):{top:e,right:e,bottom:e,left:e}}function ni(e){const{x:t,y:i,width:r,height:o}=e;return{width:r,height:o,top:i,left:t,right:t+r,bottom:i+o,x:t,y:i}}function so(e,t,i){let{reference:r,floating:o}=e;const s=bt(t),n=Er(t),a=Cr(n),l=Et(t),c=s==="y",h=r.x+r.width/2-o.width/2,d=r.y+r.height/2-o.height/2,p=r[a]/2-o[a]/2;let u;switch(l){case"top":u={x:h,y:r.y-o.height};break;case"bottom":u={x:h,y:r.y+r.height};break;case"right":u={x:r.x+r.width,y:d};break;case"left":u={x:r.x-o.width,y:d};break;default:u={x:r.x,y:r.y}}switch(ve(t)){case"start":u[n]-=p*(i&&c?-1:1);break;case"end":u[n]+=p*(i&&c?-1:1);break}return u}const ul=async(e,t,i)=>{const{placement:r="bottom",strategy:o="absolute",middleware:s=[],platform:n}=i,a=s.filter(Boolean),l=await(n.isRTL==null?void 0:n.isRTL(t));let c=await n.getElementRects({reference:e,floating:t,strategy:o}),{x:h,y:d}=so(c,r,l),p=r,u={},m=0;for(let b=0;b<a.length;b++){const{name:_,fn:v}=a[b],{x:w,y:$,data:C,reset:E}=await v({x:h,y:d,initialPlacement:r,placement:p,strategy:o,middlewareData:u,rects:c,platform:n,elements:{reference:e,floating:t}});h=w??h,d=$??d,u={...u,[_]:{...u[_],...C}},E&&m<=50&&(m++,typeof E=="object"&&(E.placement&&(p=E.placement),E.rects&&(c=E.rects===!0?await n.getElementRects({reference:e,floating:t,strategy:o}):E.rects),{x:h,y:d}=so(c,p,l)),b=-1)}return{x:h,y:d,placement:p,strategy:o,middlewareData:u}};async function kr(e,t){var i;t===void 0&&(t={});const{x:r,y:o,platform:s,rects:n,elements:a,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:d="floating",altBoundary:p=!1,padding:u=0}=be(t,e),m=As(u),_=a[p?d==="floating"?"reference":"floating":d],v=ni(await s.getClippingRect({element:(i=await(s.isElement==null?void 0:s.isElement(_)))==null||i?_:_.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:c,rootBoundary:h,strategy:l})),w=d==="floating"?{x:r,y:o,width:n.floating.width,height:n.floating.height}:n.reference,$=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),C=await(s.isElement==null?void 0:s.isElement($))?await(s.getScale==null?void 0:s.getScale($))||{x:1,y:1}:{x:1,y:1},E=ni(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:w,offsetParent:$,strategy:l}):w);return{top:(v.top-E.top+m.top)/C.y,bottom:(E.bottom-v.bottom+m.bottom)/C.y,left:(v.left-E.left+m.left)/C.x,right:(E.right-v.right+m.right)/C.x}}const dl=e=>({name:"arrow",options:e,async fn(t){const{x:i,y:r,placement:o,rects:s,platform:n,elements:a,middlewareData:l}=t,{element:c,padding:h=0}=be(e,t)||{};if(c==null)return{};const d=As(h),p={x:i,y:r},u=Er(o),m=Cr(u),b=await n.getDimensions(c),_=u==="y",v=_?"top":"left",w=_?"bottom":"right",$=_?"clientHeight":"clientWidth",C=s.reference[m]+s.reference[u]-p[u]-s.floating[m],E=p[u]-s.reference[u],O=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let z=O?O[$]:0;(!z||!await(n.isElement==null?void 0:n.isElement(O)))&&(z=a.floating[$]||s.floating[m]);const L=C/2-E/2,N=z/2-b[m]/2-1,T=Ct(d[v],N),vt=Ct(d[w],N),at=T,yt=z-b[m]-vt,H=z/2-b[m]/2+L,Rt=Gi(at,H,yt),gt=!l.arrow&&ve(o)!=null&&H!==Rt&&s.reference[m]/2-(H<at?T:vt)-b[m]/2<0,et=gt?H<at?H-at:H-yt:0;return{[u]:p[u]+et,data:{[u]:Rt,centerOffset:H-Rt-et,...gt&&{alignmentOffset:et}},reset:gt}}}),fl=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var i,r;const{placement:o,middlewareData:s,rects:n,initialPlacement:a,platform:l,elements:c}=t,{mainAxis:h=!0,crossAxis:d=!0,fallbackPlacements:p,fallbackStrategy:u="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:b=!0,..._}=be(e,t);if((i=s.arrow)!=null&&i.alignmentOffset)return{};const v=Et(o),w=bt(a),$=Et(a)===a,C=await(l.isRTL==null?void 0:l.isRTL(c.floating)),E=p||($||!b?[si(a)]:sl(a)),O=m!=="none";!p&&O&&E.push(...cl(a,b,m,C));const z=[a,...E],L=await kr(t,_),N=[];let T=((r=s.flip)==null?void 0:r.overflows)||[];if(h&&N.push(L[v]),d){const H=ol(o,n,C);N.push(L[H[0]],L[H[1]])}if(T=[...T,{placement:o,overflows:N}],!N.every(H=>H<=0)){var vt,at;const H=(((vt=s.flip)==null?void 0:vt.index)||0)+1,Rt=z[H];if(Rt&&(!(d==="alignment"?w!==bt(Rt):!1)||T.every(it=>bt(it.placement)===w?it.overflows[0]>0:!0)))return{data:{index:H,overflows:T},reset:{placement:Rt}};let gt=(at=T.filter(et=>et.overflows[0]<=0).sort((et,it)=>et.overflows[1]-it.overflows[1])[0])==null?void 0:at.placement;if(!gt)switch(u){case"bestFit":{var yt;const et=(yt=T.filter(it=>{if(O){const _t=bt(it.placement);return _t===w||_t==="y"}return!0}).map(it=>[it.placement,it.overflows.filter(_t=>_t>0).reduce((_t,Fn)=>_t+Fn,0)]).sort((it,_t)=>it[1]-_t[1])[0])==null?void 0:yt[0];et&&(gt=et);break}case"initialPlacement":gt=a;break}if(o!==gt)return{reset:{placement:gt}}}return{}}}},pl=new Set(["left","top"]);async function ml(e,t){const{placement:i,platform:r,elements:o}=e,s=await(r.isRTL==null?void 0:r.isRTL(o.floating)),n=Et(i),a=ve(i),l=bt(i)==="y",c=pl.has(n)?-1:1,h=s&&l?-1:1,d=be(t,e);let{mainAxis:p,crossAxis:u,alignmentAxis:m}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return a&&typeof m=="number"&&(u=a==="end"?m*-1:m),l?{x:u*h,y:p*c}:{x:p*c,y:u*h}}const gl=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var i,r;const{x:o,y:s,placement:n,middlewareData:a}=t,l=await ml(t,e);return n===((i=a.offset)==null?void 0:i.placement)&&(r=a.arrow)!=null&&r.alignmentOffset?{}:{x:o+l.x,y:s+l.y,data:{...l,placement:n}}}}},bl=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:i,y:r,placement:o}=t,{mainAxis:s=!0,crossAxis:n=!1,limiter:a={fn:_=>{let{x:v,y:w}=_;return{x:v,y:w}}},...l}=be(e,t),c={x:i,y:r},h=await kr(t,l),d=bt(Et(o)),p=ks(d);let u=c[p],m=c[d];if(s){const _=p==="y"?"top":"left",v=p==="y"?"bottom":"right",w=u+h[_],$=u-h[v];u=Gi(w,u,$)}if(n){const _=d==="y"?"top":"left",v=d==="y"?"bottom":"right",w=m+h[_],$=m-h[v];m=Gi(w,m,$)}const b=a.fn({...t,[p]:u,[d]:m});return{...b,data:{x:b.x-i,y:b.y-r,enabled:{[p]:s,[d]:n}}}}}},vl=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var i,r;const{placement:o,rects:s,platform:n,elements:a}=t,{apply:l=()=>{},...c}=be(e,t),h=await kr(t,c),d=Et(o),p=ve(o),u=bt(o)==="y",{width:m,height:b}=s.floating;let _,v;d==="top"||d==="bottom"?(_=d,v=p===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):(v=d,_=p==="end"?"top":"bottom");const w=b-h.top-h.bottom,$=m-h.left-h.right,C=Ct(b-h[_],w),E=Ct(m-h[v],$),O=!t.middlewareData.shift;let z=C,L=E;if((i=t.middlewareData.shift)!=null&&i.enabled.x&&(L=$),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(z=w),O&&!p){const T=Y(h.left,0),vt=Y(h.right,0),at=Y(h.top,0),yt=Y(h.bottom,0);u?L=m-2*(T!==0||vt!==0?T+vt:Y(h.left,h.right)):z=b-2*(at!==0||yt!==0?at+yt:Y(h.top,h.bottom))}await l({...t,availableWidth:L,availableHeight:z});const N=await n.getDimensions(a.floating);return m!==N.width||b!==N.height?{reset:{rects:!0}}:{}}}};function vi(){return typeof window<"u"}function ye(e){return zs(e)?(e.nodeName||"").toLowerCase():"#document"}function Z(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function pt(e){var t;return(t=(zs(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function zs(e){return vi()?e instanceof Node||e instanceof Z(e).Node:!1}function ot(e){return vi()?e instanceof Element||e instanceof Z(e).Element:!1}function ut(e){return vi()?e instanceof HTMLElement||e instanceof Z(e).HTMLElement:!1}function no(e){return!vi()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof Z(e).ShadowRoot}const yl=new Set(["inline","contents"]);function Be(e){const{overflow:t,overflowX:i,overflowY:r,display:o}=st(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+i)&&!yl.has(o)}const _l=new Set(["table","td","th"]);function wl(e){return _l.has(ye(e))}const xl=[":popover-open",":modal"];function yi(e){return xl.some(t=>{try{return e.matches(t)}catch{return!1}})}const $l=["transform","translate","scale","rotate","perspective"],Sl=["transform","translate","scale","rotate","perspective","filter"],Cl=["paint","layout","strict","content"];function _i(e){const t=Ar(),i=ot(e)?st(e):e;return $l.some(r=>i[r]?i[r]!=="none":!1)||(i.containerType?i.containerType!=="normal":!1)||!t&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!t&&(i.filter?i.filter!=="none":!1)||Sl.some(r=>(i.willChange||"").includes(r))||Cl.some(r=>(i.contain||"").includes(r))}function El(e){let t=kt(e);for(;ut(t)&&!he(t);){if(_i(t))return t;if(yi(t))return null;t=kt(t)}return null}function Ar(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const kl=new Set(["html","body","#document"]);function he(e){return kl.has(ye(e))}function st(e){return Z(e).getComputedStyle(e)}function wi(e){return ot(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function kt(e){if(ye(e)==="html")return e;const t=e.assignedSlot||e.parentNode||no(e)&&e.host||pt(e);return no(t)?t.host:t}function Ps(e){const t=kt(e);return he(t)?e.ownerDocument?e.ownerDocument.body:e.body:ut(t)&&Be(t)?t:Ps(t)}function Le(e,t,i){var r;t===void 0&&(t=[]),i===void 0&&(i=!0);const o=Ps(e),s=o===((r=e.ownerDocument)==null?void 0:r.body),n=Z(o);if(s){const a=Yi(n);return t.concat(n,n.visualViewport||[],Be(o)?o:[],a&&i?Le(a):[])}return t.concat(o,Le(o,[],i))}function Yi(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Os(e){const t=st(e);let i=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const o=ut(e),s=o?e.offsetWidth:i,n=o?e.offsetHeight:r,a=oi(i)!==s||oi(r)!==n;return a&&(i=s,r=n),{width:i,height:r,$:a}}function zr(e){return ot(e)?e:e.contextElement}function ne(e){const t=zr(e);if(!ut(t))return ct(1);const i=t.getBoundingClientRect(),{width:r,height:o,$:s}=Os(t);let n=(s?oi(i.width):i.width)/r,a=(s?oi(i.height):i.height)/o;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const Al=ct(0);function Ms(e){const t=Z(e);return!Ar()||!t.visualViewport?Al:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function zl(e,t,i){return t===void 0&&(t=!1),!i||t&&i!==Z(e)?!1:t}function Ut(e,t,i,r){t===void 0&&(t=!1),i===void 0&&(i=!1);const o=e.getBoundingClientRect(),s=zr(e);let n=ct(1);t&&(r?ot(r)&&(n=ne(r)):n=ne(e));const a=zl(s,i,r)?Ms(s):ct(0);let l=(o.left+a.x)/n.x,c=(o.top+a.y)/n.y,h=o.width/n.x,d=o.height/n.y;if(s){const p=Z(s),u=r&&ot(r)?Z(r):r;let m=p,b=Yi(m);for(;b&&r&&u!==m;){const _=ne(b),v=b.getBoundingClientRect(),w=st(b),$=v.left+(b.clientLeft+parseFloat(w.paddingLeft))*_.x,C=v.top+(b.clientTop+parseFloat(w.paddingTop))*_.y;l*=_.x,c*=_.y,h*=_.x,d*=_.y,l+=$,c+=C,m=Z(b),b=Yi(m)}}return ni({width:h,height:d,x:l,y:c})}function xi(e,t){const i=wi(e).scrollLeft;return t?t.left+i:Ut(pt(e)).left+i}function Ls(e,t){const i=e.getBoundingClientRect(),r=i.left+t.scrollLeft-xi(e,i),o=i.top+t.scrollTop;return{x:r,y:o}}function Pl(e){let{elements:t,rect:i,offsetParent:r,strategy:o}=e;const s=o==="fixed",n=pt(r),a=t?yi(t.floating):!1;if(r===n||a&&s)return i;let l={scrollLeft:0,scrollTop:0},c=ct(1);const h=ct(0),d=ut(r);if((d||!d&&!s)&&((ye(r)!=="body"||Be(n))&&(l=wi(r)),ut(r))){const u=Ut(r);c=ne(r),h.x=u.x+r.clientLeft,h.y=u.y+r.clientTop}const p=n&&!d&&!s?Ls(n,l):ct(0);return{width:i.width*c.x,height:i.height*c.y,x:i.x*c.x-l.scrollLeft*c.x+h.x+p.x,y:i.y*c.y-l.scrollTop*c.y+h.y+p.y}}function Ol(e){return Array.from(e.getClientRects())}function Ml(e){const t=pt(e),i=wi(e),r=e.ownerDocument.body,o=Y(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),s=Y(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let n=-i.scrollLeft+xi(e);const a=-i.scrollTop;return st(r).direction==="rtl"&&(n+=Y(t.clientWidth,r.clientWidth)-o),{width:o,height:s,x:n,y:a}}const ao=25;function Ll(e,t){const i=Z(e),r=pt(e),o=i.visualViewport;let s=r.clientWidth,n=r.clientHeight,a=0,l=0;if(o){s=o.width,n=o.height;const h=Ar();(!h||h&&t==="fixed")&&(a=o.offsetLeft,l=o.offsetTop)}const c=xi(r);if(c<=0){const h=r.ownerDocument,d=h.body,p=getComputedStyle(d),u=h.compatMode==="CSS1Compat"&&parseFloat(p.marginLeft)+parseFloat(p.marginRight)||0,m=Math.abs(r.clientWidth-d.clientWidth-u);m<=ao&&(s-=m)}else c<=ao&&(s+=c);return{width:s,height:n,x:a,y:l}}const Rl=new Set(["absolute","fixed"]);function Tl(e,t){const i=Ut(e,!0,t==="fixed"),r=i.top+e.clientTop,o=i.left+e.clientLeft,s=ut(e)?ne(e):ct(1),n=e.clientWidth*s.x,a=e.clientHeight*s.y,l=o*s.x,c=r*s.y;return{width:n,height:a,x:l,y:c}}function lo(e,t,i){let r;if(t==="viewport")r=Ll(e,i);else if(t==="document")r=Ml(pt(e));else if(ot(t))r=Tl(t,i);else{const o=Ms(e);r={x:t.x-o.x,y:t.y-o.y,width:t.width,height:t.height}}return ni(r)}function Rs(e,t){const i=kt(e);return i===t||!ot(i)||he(i)?!1:st(i).position==="fixed"||Rs(i,t)}function Il(e,t){const i=t.get(e);if(i)return i;let r=Le(e,[],!1).filter(a=>ot(a)&&ye(a)!=="body"),o=null;const s=st(e).position==="fixed";let n=s?kt(e):e;for(;ot(n)&&!he(n);){const a=st(n),l=_i(n);!l&&a.position==="fixed"&&(o=null),(s?!l&&!o:!l&&a.position==="static"&&!!o&&Rl.has(o.position)||Be(n)&&!l&&Rs(e,n))?r=r.filter(h=>h!==n):o=a,n=kt(n)}return t.set(e,r),r}function Dl(e){let{element:t,boundary:i,rootBoundary:r,strategy:o}=e;const n=[...i==="clippingAncestors"?yi(t)?[]:Il(t,this._c):[].concat(i),r],a=n[0],l=n.reduce((c,h)=>{const d=lo(t,h,o);return c.top=Y(d.top,c.top),c.right=Ct(d.right,c.right),c.bottom=Ct(d.bottom,c.bottom),c.left=Y(d.left,c.left),c},lo(t,a,o));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function Vl(e){const{width:t,height:i}=Os(e);return{width:t,height:i}}function Bl(e,t,i){const r=ut(t),o=pt(t),s=i==="fixed",n=Ut(e,!0,s,t);let a={scrollLeft:0,scrollTop:0};const l=ct(0);function c(){l.x=xi(o)}if(r||!r&&!s)if((ye(t)!=="body"||Be(o))&&(a=wi(t)),r){const u=Ut(t,!0,s,t);l.x=u.x+t.clientLeft,l.y=u.y+t.clientTop}else o&&c();s&&!r&&o&&c();const h=o&&!r&&!s?Ls(o,a):ct(0),d=n.left+a.scrollLeft-l.x-h.x,p=n.top+a.scrollTop-l.y-h.y;return{x:d,y:p,width:n.width,height:n.height}}function Ii(e){return st(e).position==="static"}function co(e,t){if(!ut(e)||st(e).position==="fixed")return null;if(t)return t(e);let i=e.offsetParent;return pt(e)===i&&(i=i.ownerDocument.body),i}function Ts(e,t){const i=Z(e);if(yi(e))return i;if(!ut(e)){let o=kt(e);for(;o&&!he(o);){if(ot(o)&&!Ii(o))return o;o=kt(o)}return i}let r=co(e,t);for(;r&&wl(r)&&Ii(r);)r=co(r,t);return r&&he(r)&&Ii(r)&&!_i(r)?i:r||El(e)||i}const Nl=async function(e){const t=this.getOffsetParent||Ts,i=this.getDimensions,r=await i(e.floating);return{reference:Bl(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function jl(e){return st(e).direction==="rtl"}const Qe={convertOffsetParentRelativeRectToViewportRelativeRect:Pl,getDocumentElement:pt,getClippingRect:Dl,getOffsetParent:Ts,getElementRects:Nl,getClientRects:Ol,getDimensions:Vl,getScale:ne,isElement:ot,isRTL:jl};function Is(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Fl(e,t){let i=null,r;const o=pt(e);function s(){var a;clearTimeout(r),(a=i)==null||a.disconnect(),i=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),s();const c=e.getBoundingClientRect(),{left:h,top:d,width:p,height:u}=c;if(a||t(),!p||!u)return;const m=We(d),b=We(o.clientWidth-(h+p)),_=We(o.clientHeight-(d+u)),v=We(h),$={rootMargin:-m+"px "+-b+"px "+-_+"px "+-v+"px",threshold:Y(0,Ct(1,l))||1};let C=!0;function E(O){const z=O[0].intersectionRatio;if(z!==l){if(!C)return n();z?n(!1,z):r=setTimeout(()=>{n(!1,1e-7)},1e3)}z===1&&!Is(c,e.getBoundingClientRect())&&n(),C=!1}try{i=new IntersectionObserver(E,{...$,root:o.ownerDocument})}catch{i=new IntersectionObserver(E,$)}i.observe(e)}return n(!0),s}function Ul(e,t,i,r){r===void 0&&(r={});const{ancestorScroll:o=!0,ancestorResize:s=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,c=zr(e),h=o||s?[...c?Le(c):[],...Le(t)]:[];h.forEach(v=>{o&&v.addEventListener("scroll",i,{passive:!0}),s&&v.addEventListener("resize",i)});const d=c&&a?Fl(c,i):null;let p=-1,u=null;n&&(u=new ResizeObserver(v=>{let[w]=v;w&&w.target===c&&u&&(u.unobserve(t),cancelAnimationFrame(p),p=requestAnimationFrame(()=>{var $;($=u)==null||$.observe(t)})),i()}),c&&!l&&u.observe(c),u.observe(t));let m,b=l?Ut(e):null;l&&_();function _(){const v=Ut(e);b&&!Is(b,v)&&i(),b=v,m=requestAnimationFrame(_)}return i(),()=>{var v;h.forEach(w=>{o&&w.removeEventListener("scroll",i),s&&w.removeEventListener("resize",i)}),d?.(),(v=u)==null||v.disconnect(),u=null,l&&cancelAnimationFrame(m)}}const Hl=gl,Wl=bl,ql=fl,ho=vl,Gl=dl,Kl=(e,t,i)=>{const r=new Map,o={platform:Qe,...i},s={...o.platform,_c:r};return ul(e,t,{...o,platform:s})};function Yl(e){return Zl(e)}function Di(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Zl(e){for(let t=e;t;t=Di(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=Di(e);t;t=Di(t)){if(!(t instanceof Element))continue;const i=getComputedStyle(t);if(i.display!=="contents"&&(i.position!=="static"||_i(i)||t.tagName==="BODY"))return t}return null}function Xl(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var P=class extends W{constructor(){super(...arguments),this.localize=new qt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),i=this.placement.includes("top")||this.placement.includes("bottom");let r=0,o=0,s=0,n=0,a=0,l=0,c=0,h=0;i?e.top<t.top?(r=e.left,o=e.bottom,s=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,h=t.top):(r=t.left,o=t.bottom,s=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,h=e.top):e.left<t.left?(r=e.right,o=e.top,s=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,h=t.bottom):(r=t.right,o=t.top,s=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,h=e.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${r}px`),this.style.setProperty("--hover-bridge-top-left-y",`${o}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${h}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchor instanceof Element||Xl(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Ul(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;const e=[Hl({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(ho({apply:({rects:i})=>{const r=this.sync==="width"||this.sync==="both",o=this.sync==="height"||this.sync==="both";this.popup.style.width=r?`${i.reference.width}px`:"",this.popup.style.height=o?`${i.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(ql({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(Wl({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(ho({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:i,availableHeight:r})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${r}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${i}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(Gl({element:this.arrowEl,padding:this.arrowPadding}));const t=this.strategy==="absolute"?i=>Qe.getOffsetParent(i,Yl):Qe.getOffsetParent;Kl(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:mi(Gt({},Qe),{getOffsetParent:t})}).then(({x:i,y:r,middlewareData:o,placement:s})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${i}px`,top:`${r}px`}),this.arrow){const l=o.arrow.x,c=o.arrow.y;let h="",d="",p="",u="";if(this.arrowPlacement==="start"){const m=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",d=n?m:"",u=n?"":m}else if(this.arrowPlacement==="end"){const m=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=n?"":m,u=n?m:"",p=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(u=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",h=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(u=typeof l=="number"?`${l}px`:"",h=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:h,right:d,bottom:p,left:u,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return k`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${ht({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${ht({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?k`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};P.styles=[ft,tl];f([tt(".popup")],P.prototype,"popup",2);f([tt(".popup__arrow")],P.prototype,"arrowEl",2);f([g()],P.prototype,"anchor",2);f([g({type:Boolean,reflect:!0})],P.prototype,"active",2);f([g({reflect:!0})],P.prototype,"placement",2);f([g({reflect:!0})],P.prototype,"strategy",2);f([g({type:Number})],P.prototype,"distance",2);f([g({type:Number})],P.prototype,"skidding",2);f([g({type:Boolean})],P.prototype,"arrow",2);f([g({attribute:"arrow-placement"})],P.prototype,"arrowPlacement",2);f([g({attribute:"arrow-padding",type:Number})],P.prototype,"arrowPadding",2);f([g({type:Boolean})],P.prototype,"flip",2);f([g({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],P.prototype,"flipFallbackPlacements",2);f([g({attribute:"flip-fallback-strategy"})],P.prototype,"flipFallbackStrategy",2);f([g({type:Object})],P.prototype,"flipBoundary",2);f([g({attribute:"flip-padding",type:Number})],P.prototype,"flipPadding",2);f([g({type:Boolean})],P.prototype,"shift",2);f([g({type:Object})],P.prototype,"shiftBoundary",2);f([g({attribute:"shift-padding",type:Number})],P.prototype,"shiftPadding",2);f([g({attribute:"auto-size"})],P.prototype,"autoSize",2);f([g()],P.prototype,"sync",2);f([g({type:Object})],P.prototype,"autoSizeBoundary",2);f([g({attribute:"auto-size-padding",type:Number})],P.prototype,"autoSizePadding",2);f([g({attribute:"hover-bridge",type:Boolean})],P.prototype,"hoverBridge",2);var Ds=new Map,Jl=new WeakMap;function Ql(e){return e??{keyframes:[],options:{duration:0}}}function uo(e,t){return t.toLowerCase()==="rtl"?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function $i(e,t){Ds.set(e,Ql(t))}function ai(e,t,i){const r=Jl.get(e);if(r?.[t])return uo(r[t],i.dir);const o=Ds.get(t);return o?uo(o,i.dir):{keyframes:[],options:{duration:0}}}function fo(e,t){return new Promise(i=>{function r(o){o.target===e&&(e.removeEventListener(t,r),i())}e.addEventListener(t,r)})}function po(e,t,i){return new Promise(r=>{if(i?.duration===1/0)throw new Error("Promise-based animations must be finite.");const o=e.animate(t,mi(Gt({},i),{duration:tc()?0:i.duration}));o.addEventListener("cancel",r,{once:!0}),o.addEventListener("finish",r,{once:!0})})}function mo(e){return e=e.toString().toLowerCase(),e.indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?parseFloat(e)*1e3:parseFloat(e)}function tc(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function go(e){return Promise.all(e.getAnimations().map(t=>new Promise(i=>{t.cancel(),requestAnimationFrame(i)})))}var B=class extends W{constructor(){super(),this.localize=new qt(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{e.key==="Escape"&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const e=mo(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const e=mo(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await go(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:i,options:r}=ai(this,"tooltip.show",{dir:this.localize.dir()});await po(this.popup.popup,i,r),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await go(this.body);const{keyframes:i,options:r}=ai(this,"tooltip.hide",{dir:this.localize.dir()});await po(this.popup.popup,i,r),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,fo(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,fo(this,"sl-after-hide")}render(){return k`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${ht({tooltip:!0,"tooltip--open":this.open})}
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
    `}};B.styles=[ft,Qa];B.dependencies={"sl-popup":P};f([tt("slot:not([name])")],B.prototype,"defaultSlot",2);f([tt(".tooltip__body")],B.prototype,"body",2);f([tt("sl-popup")],B.prototype,"popup",2);f([g()],B.prototype,"content",2);f([g()],B.prototype,"placement",2);f([g({type:Boolean,reflect:!0})],B.prototype,"disabled",2);f([g({type:Number})],B.prototype,"distance",2);f([g({type:Boolean,reflect:!0})],B.prototype,"open",2);f([g({type:Number})],B.prototype,"skidding",2);f([g()],B.prototype,"trigger",2);f([g({type:Boolean})],B.prototype,"hoist",2);f([zt("open",{waitUntilFirstUpdate:!0})],B.prototype,"handleOpenChange",1);f([zt(["content","distance","hoist","placement","skidding"])],B.prototype,"handleOptionsChange",1);f([zt("disabled")],B.prototype,"handleDisabledChange",1);$i("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}});$i("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});var ec=Q`
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
`,V=class extends W{constructor(){super(...arguments),this.localize=new qt(this),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let e=this.value;if(this.from){const t=this.getRootNode(),i=this.from.includes("."),r=this.from.includes("[")&&this.from.includes("]");let o=this.from,s="";i?[o,s]=this.from.trim().split("."):r&&([o,s]=this.from.trim().replace(/\]$/,"").split("["));const n="getElementById"in t?t.getElementById(o):null;n?r?e=n.getAttribute(s)||"":i?e=n[s]||"":e=n.textContent||"":(this.showStatus("error"),this.emit("sl-error"))}if(!e)this.showStatus("error"),this.emit("sl-error");else try{await navigator.clipboard.writeText(e),this.showStatus("success"),this.emit("sl-copy",{detail:{value:e}})}catch{this.showStatus("error"),this.emit("sl-error")}}async showStatus(e){const t=this.copyLabel||this.localize.term("copy"),i=this.successLabel||this.localize.term("copied"),r=this.errorLabel||this.localize.term("error"),o=e==="success"?this.successIcon:this.errorIcon,s=ai(this,"copy.in",{dir:"ltr"}),n=ai(this,"copy.out",{dir:"ltr"});this.tooltip.content=e==="success"?i:r,await this.copyIcon.animate(n.keyframes,n.options).finished,this.copyIcon.hidden=!0,this.status=e,o.hidden=!1,await o.animate(s.keyframes,s.options).finished,setTimeout(async()=>{await o.animate(n.keyframes,n.options).finished,o.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(s.keyframes,s.options).finished,this.tooltip.content=t,this.isCopying=!1},this.feedbackDuration)}render(){const e=this.copyLabel||this.localize.term("copy");return k`
      <sl-tooltip
        class=${ht({"copy-button":!0,"copy-button--success":this.status==="success","copy-button--error":this.status==="error"})}
        content=${e}
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
    `}};V.styles=[ft,ec];V.dependencies={"sl-icon":nt,"sl-tooltip":B};f([tt('slot[name="copy-icon"]')],V.prototype,"copyIcon",2);f([tt('slot[name="success-icon"]')],V.prototype,"successIcon",2);f([tt('slot[name="error-icon"]')],V.prototype,"errorIcon",2);f([tt("sl-tooltip")],V.prototype,"tooltip",2);f([Kt()],V.prototype,"isCopying",2);f([Kt()],V.prototype,"status",2);f([g()],V.prototype,"value",2);f([g()],V.prototype,"from",2);f([g({type:Boolean,reflect:!0})],V.prototype,"disabled",2);f([g({attribute:"copy-label"})],V.prototype,"copyLabel",2);f([g({attribute:"success-label"})],V.prototype,"successLabel",2);f([g({attribute:"error-label"})],V.prototype,"errorLabel",2);f([g({attribute:"feedback-duration",type:Number})],V.prototype,"feedbackDuration",2);f([g({attribute:"tooltip-placement"})],V.prototype,"tooltipPlacement",2);f([g({type:Boolean})],V.prototype,"hoist",2);$i("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}});$i("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}});V.define("sl-copy-button");/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Vs=class extends Event{constructor(t,i,r,o){super("context-request",{bubbles:!0,composed:!0}),this.context=t,this.contextTarget=i,this.callback=r,this.subscribe=o??!1}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let bo=class{constructor(t,i,r,o){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(s,n)=>{this.unsubscribe&&(this.unsubscribe!==n&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=s,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(s,n)),this.unsubscribe=n},this.host=t,i.context!==void 0){const s=i;this.context=s.context,this.callback=s.callback,this.subscribe=s.subscribe??!1}else this.context=i,this.callback=r,this.subscribe=o??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new Vs(this.context,this.host,this.t,this.subscribe))}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ic=class{get value(){return this.o}set value(t){this.setValue(t)}setValue(t,i=!1){const r=i||!Object.is(t,this.o);this.o=t,r&&this.updateObservers()}constructor(t){this.subscriptions=new Map,this.updateObservers=()=>{for(const[i,{disposer:r}]of this.subscriptions)i(this.o,r)},t!==void 0&&(this.value=t)}addCallback(t,i,r){if(!r)return void t(this.value);this.subscriptions.has(t)||this.subscriptions.set(t,{disposer:()=>{this.subscriptions.delete(t)},consumerHost:i});const{disposer:o}=this.subscriptions.get(t);t(this.value,o)}clearCallbacks(){this.subscriptions.clear()}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let rc=class extends Event{constructor(t,i){super("context-provider",{bubbles:!0,composed:!0}),this.context=t,this.contextTarget=i}},vo=class extends ic{constructor(t,i,r){super(i.context!==void 0?i.initialValue:r),this.onContextRequest=o=>{if(o.context!==this.context)return;const s=o.contextTarget??o.composedPath()[0];s!==this.host&&(o.stopPropagation(),this.addCallback(o.callback,s,o.subscribe))},this.onProviderRequest=o=>{if(o.context!==this.context||(o.contextTarget??o.composedPath()[0])===this.host)return;const s=new Set;for(const[n,{consumerHost:a}]of this.subscriptions)s.has(n)||(s.add(n),a.dispatchEvent(new Vs(this.context,a,n,!0)));o.stopPropagation()},this.host=t,i.context!==void 0?this.context=i.context:this.context=i,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new rc(this.context,this.host))}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Pr({context:e}){return(t,i)=>{const r=new WeakMap;if(typeof i=="object")return{get(){return t.get.call(this)},set(o){return r.get(this).setValue(o),t.set.call(this,o)},init(o){return r.set(this,new vo(this,{context:e,initialValue:o})),o}};{t.constructor.addInitializer((n=>{r.set(n,new vo(n,{context:e}))}));const o=Object.getOwnPropertyDescriptor(t,i);let s;if(o===void 0){const n=new WeakMap;s={get(){return n.get(this)},set(a){r.get(this).setValue(a),n.set(this,a)},configurable:!0,enumerable:!0}}else{const n=o.set;s={...o,set(a){r.get(this).setValue(a),n?.call(this,a)}}}return void Object.defineProperty(t,i,s)}}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _e({context:e,subscribe:t}){return(i,r)=>{typeof r=="object"?r.addInitializer((function(){new bo(this,{context:e,callback:o=>{i.set.call(this,o)},subscribe:t})})):i.constructor.addInitializer((o=>{new bo(o,{context:e,callback:s=>{o[r]=s},subscribe:t})}))}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ze=(e,t)=>{const i=e._$AN;if(i===void 0)return!1;for(const r of i)r._$AO?.(t,!1),ze(r,t);return!0},li=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while(i?.size===0)},Bs=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),nc(t)}};function oc(e){this._$AN!==void 0?(li(this),this._$AM=e,Bs(this)):this._$AM=e}function sc(e,t=!1,i=0){const r=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(t)if(Array.isArray(r))for(let s=i;s<r.length;s++)ze(r[s],!1),li(r[s]);else r!=null&&(ze(r,!1),li(r));else ze(this,e)}const nc=e=>{e.type==rt.CHILD&&(e._$AP??=sc,e._$AQ??=oc)};class Ns extends Ve{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,r){super._$AT(t,i,r),Bs(this),this.isConnected=t._$AU}_$AO(t,i=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),i&&(ze(this,t),li(this))}setValue(t){if(Ss(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ac=()=>new lc;class lc{}const Vi=new WeakMap,Jt=ge(class extends Ns{render(e){return M}update(e,[t]){const i=t!==this.G;return i&&this.G!==void 0&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),M}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let i=Vi.get(t);i===void 0&&(i=new WeakMap,Vi.set(t,i)),i.get(this.G)!==void 0&&this.G.call(this.ht,void 0),i.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?Vi.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function I(e){return typeof e=="function"}function cc(e){return I(e?.lift)}function Pt(e){return function(t){if(cc(t))return t.lift(function(i){try{return e(i,this)}catch(r){this.error(r)}});throw new TypeError("Unable to lift unknown Observable type")}}var Zi=function(e,t){return Zi=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,r){i.__proto__=r}||function(i,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(i[o]=r[o])},Zi(e,t)};function Zt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Zi(e,t);function i(){this.constructor=e}e.prototype=t===null?Object.create(t):(i.prototype=t.prototype,new i)}var ci=function(){return ci=Object.assign||function(t){for(var i,r=1,o=arguments.length;r<o;r++){i=arguments[r];for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&(t[s]=i[s])}return t},ci.apply(this,arguments)};function hc(e,t){var i={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(i[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(i[r[o]]=e[r[o]]);return i}function uc(e,t,i,r){function o(s){return s instanceof i?s:new i(function(n){n(s)})}return new(i||(i=Promise))(function(s,n){function a(h){try{c(r.next(h))}catch(d){n(d)}}function l(h){try{c(r.throw(h))}catch(d){n(d)}}function c(h){h.done?s(h.value):o(h.value).then(a,l)}c((r=r.apply(e,t||[])).next())})}function js(e,t){var i={label:0,sent:function(){if(s[0]&1)throw s[1];return s[1]},trys:[],ops:[]},r,o,s,n=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return n.next=a(0),n.throw=a(1),n.return=a(2),typeof Symbol=="function"&&(n[Symbol.iterator]=function(){return this}),n;function a(c){return function(h){return l([c,h])}}function l(c){if(r)throw new TypeError("Generator is already executing.");for(;n&&(n=0,c[0]&&(i=0)),i;)try{if(r=1,o&&(s=c[0]&2?o.return:c[0]?o.throw||((s=o.return)&&s.call(o),0):o.next)&&!(s=s.call(o,c[1])).done)return s;switch(o=0,s&&(c=[c[0]&2,s.value]),c[0]){case 0:case 1:s=c;break;case 4:return i.label++,{value:c[1],done:!1};case 5:i.label++,o=c[1],c=[0];continue;case 7:c=i.ops.pop(),i.trys.pop();continue;default:if(s=i.trys,!(s=s.length>0&&s[s.length-1])&&(c[0]===6||c[0]===2)){i=0;continue}if(c[0]===3&&(!s||c[1]>s[0]&&c[1]<s[3])){i.label=c[1];break}if(c[0]===6&&i.label<s[1]){i.label=s[1],s=c;break}if(s&&i.label<s[2]){i.label=s[2],i.ops.push(c);break}s[2]&&i.ops.pop(),i.trys.pop();continue}c=t.call(e,i)}catch(h){c=[6,h],o=0}finally{r=s=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}}function ue(e){var t=typeof Symbol=="function"&&Symbol.iterator,i=t&&e[t],r=0;if(i)return i.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function Re(e,t){var i=typeof Symbol=="function"&&e[Symbol.iterator];if(!i)return e;var r=i.call(e),o,s=[],n;try{for(;(t===void 0||t-- >0)&&!(o=r.next()).done;)s.push(o.value)}catch(a){n={error:a}}finally{try{o&&!o.done&&(i=r.return)&&i.call(r)}finally{if(n)throw n.error}}return s}function Te(e,t,i){if(i||arguments.length===2)for(var r=0,o=t.length,s;r<o;r++)(s||!(r in t))&&(s||(s=Array.prototype.slice.call(t,0,r)),s[r]=t[r]);return e.concat(s||Array.prototype.slice.call(t))}function ae(e){return this instanceof ae?(this.v=e,this):new ae(e)}function dc(e,t,i){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r=i.apply(e,t||[]),o,s=[];return o=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",n),o[Symbol.asyncIterator]=function(){return this},o;function n(u){return function(m){return Promise.resolve(m).then(u,d)}}function a(u,m){r[u]&&(o[u]=function(b){return new Promise(function(_,v){s.push([u,b,_,v])>1||l(u,b)})},m&&(o[u]=m(o[u])))}function l(u,m){try{c(r[u](m))}catch(b){p(s[0][3],b)}}function c(u){u.value instanceof ae?Promise.resolve(u.value.v).then(h,d):p(s[0][2],u)}function h(u){l("next",u)}function d(u){l("throw",u)}function p(u,m){u(m),s.shift(),s.length&&l(s[0][0],s[0][1])}}function fc(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.asyncIterator],i;return t?t.call(e):(e=typeof ue=="function"?ue(e):e[Symbol.iterator](),i={},r("next"),r("throw"),r("return"),i[Symbol.asyncIterator]=function(){return this},i);function r(s){i[s]=e[s]&&function(n){return new Promise(function(a,l){n=e[s](n),o(a,l,n.done,n.value)})}}function o(s,n,a,l){Promise.resolve(l).then(function(c){s({value:c,done:a})},n)}}var Fs=(function(e){return e&&typeof e.length=="number"&&typeof e!="function"});function Us(e){return I(e?.then)}function Hs(e){var t=function(r){Error.call(r),r.stack=new Error().stack},i=e(t);return i.prototype=Object.create(Error.prototype),i.prototype.constructor=i,i}var Bi=Hs(function(e){return function(i){e(this),this.message=i?i.length+` errors occurred during unsubscription:
`+i.map(function(r,o){return o+1+") "+r.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=i}});function Xi(e,t){if(e){var i=e.indexOf(t);0<=i&&e.splice(i,1)}}var Si=(function(){function e(t){this.initialTeardown=t,this.closed=!1,this._parentage=null,this._finalizers=null}return e.prototype.unsubscribe=function(){var t,i,r,o,s;if(!this.closed){this.closed=!0;var n=this._parentage;if(n)if(this._parentage=null,Array.isArray(n))try{for(var a=ue(n),l=a.next();!l.done;l=a.next()){var c=l.value;c.remove(this)}}catch(b){t={error:b}}finally{try{l&&!l.done&&(i=a.return)&&i.call(a)}finally{if(t)throw t.error}}else n.remove(this);var h=this.initialTeardown;if(I(h))try{h()}catch(b){s=b instanceof Bi?b.errors:[b]}var d=this._finalizers;if(d){this._finalizers=null;try{for(var p=ue(d),u=p.next();!u.done;u=p.next()){var m=u.value;try{yo(m)}catch(b){s=s??[],b instanceof Bi?s=Te(Te([],Re(s)),Re(b.errors)):s.push(b)}}}catch(b){r={error:b}}finally{try{u&&!u.done&&(o=p.return)&&o.call(p)}finally{if(r)throw r.error}}}if(s)throw new Bi(s)}},e.prototype.add=function(t){var i;if(t&&t!==this)if(this.closed)yo(t);else{if(t instanceof e){if(t.closed||t._hasParent(this))return;t._addParent(this)}(this._finalizers=(i=this._finalizers)!==null&&i!==void 0?i:[]).push(t)}},e.prototype._hasParent=function(t){var i=this._parentage;return i===t||Array.isArray(i)&&i.includes(t)},e.prototype._addParent=function(t){var i=this._parentage;this._parentage=Array.isArray(i)?(i.push(t),i):i?[i,t]:t},e.prototype._removeParent=function(t){var i=this._parentage;i===t?this._parentage=null:Array.isArray(i)&&Xi(i,t)},e.prototype.remove=function(t){var i=this._finalizers;i&&Xi(i,t),t instanceof e&&t._removeParent(this)},e.EMPTY=(function(){var t=new e;return t.closed=!0,t})(),e})(),Ws=Si.EMPTY;function qs(e){return e instanceof Si||e&&"closed"in e&&I(e.remove)&&I(e.add)&&I(e.unsubscribe)}function yo(e){I(e)?e():e.unsubscribe()}var pc={Promise:void 0},mc={setTimeout:function(e,t){for(var i=[],r=2;r<arguments.length;r++)i[r-2]=arguments[r];return setTimeout.apply(void 0,Te([e,t],Re(i)))},clearTimeout:function(e){return clearTimeout(e)},delegate:void 0};function Gs(e){mc.setTimeout(function(){throw e})}function _o(){}function ti(e){e()}var Or=(function(e){Zt(t,e);function t(i){var r=e.call(this)||this;return r.isStopped=!1,i?(r.destination=i,qs(i)&&i.add(r)):r.destination=vc,r}return t.create=function(i,r,o){return new Ie(i,r,o)},t.prototype.next=function(i){this.isStopped||this._next(i)},t.prototype.error=function(i){this.isStopped||(this.isStopped=!0,this._error(i))},t.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},t.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,e.prototype.unsubscribe.call(this),this.destination=null)},t.prototype._next=function(i){this.destination.next(i)},t.prototype._error=function(i){try{this.destination.error(i)}finally{this.unsubscribe()}},t.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},t})(Si),gc=(function(){function e(t){this.partialObserver=t}return e.prototype.next=function(t){var i=this.partialObserver;if(i.next)try{i.next(t)}catch(r){qe(r)}},e.prototype.error=function(t){var i=this.partialObserver;if(i.error)try{i.error(t)}catch(r){qe(r)}else qe(t)},e.prototype.complete=function(){var t=this.partialObserver;if(t.complete)try{t.complete()}catch(i){qe(i)}},e})(),Ie=(function(e){Zt(t,e);function t(i,r,o){var s=e.call(this)||this,n;return I(i)||!i?n={next:i??void 0,error:r??void 0,complete:o??void 0}:n=i,s.destination=new gc(n),s}return t})(Or);function qe(e){Gs(e)}function bc(e){throw e}var vc={closed:!0,next:_o,error:bc,complete:_o},Mr=(function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"})();function Ci(e){return e}function yc(e){return e.length===0?Ci:e.length===1?e[0]:function(i){return e.reduce(function(r,o){return o(r)},i)}}var j=(function(){function e(t){t&&(this._subscribe=t)}return e.prototype.lift=function(t){var i=new e;return i.source=this,i.operator=t,i},e.prototype.subscribe=function(t,i,r){var o=this,s=wc(t)?t:new Ie(t,i,r);return ti(function(){var n=o,a=n.operator,l=n.source;s.add(a?a.call(s,l):l?o._subscribe(s):o._trySubscribe(s))}),s},e.prototype._trySubscribe=function(t){try{return this._subscribe(t)}catch(i){t.error(i)}},e.prototype.forEach=function(t,i){var r=this;return i=wo(i),new i(function(o,s){var n=new Ie({next:function(a){try{t(a)}catch(l){s(l),n.unsubscribe()}},error:s,complete:o});r.subscribe(n)})},e.prototype._subscribe=function(t){var i;return(i=this.source)===null||i===void 0?void 0:i.subscribe(t)},e.prototype[Mr]=function(){return this},e.prototype.pipe=function(){for(var t=[],i=0;i<arguments.length;i++)t[i]=arguments[i];return yc(t)(this)},e.prototype.toPromise=function(t){var i=this;return t=wo(t),new t(function(r,o){var s;i.subscribe(function(n){return s=n},function(n){return o(n)},function(){return r(s)})})},e.create=function(t){return new e(t)},e})();function wo(e){var t;return(t=e??pc.Promise)!==null&&t!==void 0?t:Promise}function _c(e){return e&&I(e.next)&&I(e.error)&&I(e.complete)}function wc(e){return e&&e instanceof Or||_c(e)&&qs(e)}function Ks(e){return I(e[Mr])}function Ys(e){return Symbol.asyncIterator&&I(e?.[Symbol.asyncIterator])}function Zs(e){return new TypeError("You provided "+(e!==null&&typeof e=="object"?"an invalid object":"'"+e+"'")+" where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.")}function xc(){return typeof Symbol!="function"||!Symbol.iterator?"@@iterator":Symbol.iterator}var Xs=xc();function Js(e){return I(e?.[Xs])}function Qs(e){return dc(this,arguments,function(){var i,r,o,s;return js(this,function(n){switch(n.label){case 0:i=e.getReader(),n.label=1;case 1:n.trys.push([1,,9,10]),n.label=2;case 2:return[4,ae(i.read())];case 3:return r=n.sent(),o=r.value,s=r.done,s?[4,ae(void 0)]:[3,5];case 4:return[2,n.sent()];case 5:return[4,ae(o)];case 6:return[4,n.sent()];case 7:return n.sent(),[3,2];case 8:return[3,10];case 9:return i.releaseLock(),[7];case 10:return[2]}})})}function tn(e){return I(e?.getReader)}function mt(e){if(e instanceof j)return e;if(e!=null){if(Ks(e))return $c(e);if(Fs(e))return Sc(e);if(Us(e))return Cc(e);if(Ys(e))return en(e);if(Js(e))return Ec(e);if(tn(e))return kc(e)}throw Zs(e)}function $c(e){return new j(function(t){var i=e[Mr]();if(I(i.subscribe))return i.subscribe(t);throw new TypeError("Provided object does not correctly implement Symbol.observable")})}function Sc(e){return new j(function(t){for(var i=0;i<e.length&&!t.closed;i++)t.next(e[i]);t.complete()})}function Cc(e){return new j(function(t){e.then(function(i){t.closed||(t.next(i),t.complete())},function(i){return t.error(i)}).then(null,Gs)})}function Ec(e){return new j(function(t){var i,r;try{for(var o=ue(e),s=o.next();!s.done;s=o.next()){var n=s.value;if(t.next(n),t.closed)return}}catch(a){i={error:a}}finally{try{s&&!s.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}t.complete()})}function en(e){return new j(function(t){Ac(e,t).catch(function(i){return t.error(i)})})}function kc(e){return en(Qs(e))}function Ac(e,t){var i,r,o,s;return uc(this,void 0,void 0,function(){var n,a;return js(this,function(l){switch(l.label){case 0:l.trys.push([0,5,6,11]),i=fc(e),l.label=1;case 1:return[4,i.next()];case 2:if(r=l.sent(),!!r.done)return[3,4];if(n=r.value,t.next(n),t.closed)return[2];l.label=3;case 3:return[3,1];case 4:return[3,11];case 5:return a=l.sent(),o={error:a},[3,11];case 6:return l.trys.push([6,,9,10]),r&&!r.done&&(s=i.return)?[4,s.call(i)]:[3,8];case 7:l.sent(),l.label=8;case 8:return[3,10];case 9:if(o)throw o.error;return[7];case 10:return[7];case 11:return t.complete(),[2]}})})}function dt(e,t,i,r,o){return new zc(e,t,i,r,o)}var zc=(function(e){Zt(t,e);function t(i,r,o,s,n,a){var l=e.call(this,i)||this;return l.onFinalize=n,l.shouldUnsubscribe=a,l._next=r?function(c){try{r(c)}catch(h){i.error(h)}}:e.prototype._next,l._error=s?function(c){try{s(c)}catch(h){i.error(h)}finally{this.unsubscribe()}}:e.prototype._error,l._complete=o?function(){try{o()}catch(c){i.error(c)}finally{this.unsubscribe()}}:e.prototype._complete,l}return t.prototype.unsubscribe=function(){var i;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var r=this.closed;e.prototype.unsubscribe.call(this),!r&&((i=this.onFinalize)===null||i===void 0||i.call(this))}},t})(Or),rn={now:function(){return(rn.delegate||Date).now()},delegate:void 0};function Pc(e){return e&&I(e.schedule)}function on(e){return e[e.length-1]}function Oc(e){return I(on(e))?e.pop():void 0}function Mc(e){return Pc(on(e))?e.pop():void 0}function St(e,t,i,r,o){r===void 0&&(r=0),o===void 0&&(o=!1);var s=t.schedule(function(){i(),o?e.add(this.schedule(null,r)):this.unsubscribe()},r);if(e.add(s),!o)return s}var Lc=Array.isArray,Rc=Object.getPrototypeOf,Tc=Object.prototype,Ic=Object.keys;function Dc(e){if(e.length===1){var t=e[0];if(Lc(t))return{args:t,keys:null};if(Vc(t)){var i=Ic(t);return{args:i.map(function(r){return t[r]}),keys:i}}}return{args:e,keys:null}}function Vc(e){return e&&typeof e=="object"&&Rc(e)===Tc}function sn(e,t){return t===void 0&&(t=0),Pt(function(i,r){i.subscribe(dt(r,function(o){return St(r,e,function(){return r.next(o)},t)},function(){return St(r,e,function(){return r.complete()},t)},function(o){return St(r,e,function(){return r.error(o)},t)}))})}function nn(e,t){return t===void 0&&(t=0),Pt(function(i,r){r.add(e.schedule(function(){return i.subscribe(r)},t))})}function Bc(e,t){return mt(e).pipe(nn(t),sn(t))}function Nc(e,t){return mt(e).pipe(nn(t),sn(t))}function jc(e,t){return new j(function(i){var r=0;return t.schedule(function(){r===e.length?i.complete():(i.next(e[r++]),i.closed||this.schedule())})})}function Fc(e,t){return new j(function(i){var r;return St(i,t,function(){r=e[Xs](),St(i,t,function(){var o,s,n;try{o=r.next(),s=o.value,n=o.done}catch(a){i.error(a);return}n?i.complete():i.next(s)},0,!0)}),function(){return I(r?.return)&&r.return()}})}function an(e,t){if(!e)throw new Error("Iterable cannot be null");return new j(function(i){St(i,t,function(){var r=e[Symbol.asyncIterator]();St(i,t,function(){r.next().then(function(o){o.done?i.complete():i.next(o.value)})},0,!0)})})}function Uc(e,t){return an(Qs(e),t)}function Hc(e,t){if(e!=null){if(Ks(e))return Bc(e,t);if(Fs(e))return jc(e,t);if(Us(e))return Nc(e,t);if(Ys(e))return an(e,t);if(Js(e))return Fc(e,t);if(tn(e))return Uc(e,t)}throw Zs(e)}function ln(e,t){return t?Hc(e,t):mt(e)}function Lr(e,t){return Pt(function(i,r){var o=0;i.subscribe(dt(r,function(s){r.next(e.call(t,s,o++))}))})}var Wc=Array.isArray;function qc(e,t){return Wc(t)?e.apply(void 0,Te([],Re(t))):e(t)}function Gc(e){return Lr(function(t){return qc(e,t)})}function Kc(e,t){return e.reduce(function(i,r,o){return i[r]=t[o],i},{})}function Yc(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var i=Mc(e),r=Oc(e),o=Dc(e),s=o.args,n=o.keys;if(s.length===0)return ln([],i);var a=new j(Zc(s,i,n?function(l){return Kc(n,l)}:Ci));return r?a.pipe(Gc(r)):a}function Zc(e,t,i){return i===void 0&&(i=Ci),function(r){xo(t,function(){for(var o=e.length,s=new Array(o),n=o,a=o,l=function(h){xo(t,function(){var d=ln(e[h],t),p=!1;d.subscribe(dt(r,function(u){s[h]=u,p||(p=!0,a--),a||r.next(i(s.slice()))},function(){--n||r.complete()}))},r)},c=0;c<o;c++)l(c)},r)}}function xo(e,t,i){e?St(i,e,t):t()}function Xc(e,t,i,r,o,s,n,a){var l=[],c=0,h=0,d=!1,p=function(){d&&!l.length&&!c&&t.complete()},u=function(b){return c<r?m(b):l.push(b)},m=function(b){c++;var _=!1;mt(i(b,h++)).subscribe(dt(t,function(v){t.next(v)},function(){_=!0},void 0,function(){if(_)try{c--;for(var v=function(){var w=l.shift();n||m(w)};l.length&&c<r;)v();p()}catch(w){t.error(w)}}))};return e.subscribe(dt(t,u,function(){d=!0,p()})),function(){}}function cn(e,t,i){return i===void 0&&(i=1/0),I(t)?cn(function(r,o){return Lr(function(s,n){return t(r,s,o,n)})(mt(e(r,o)))},i):(typeof t=="number"&&(i=t),Pt(function(r,o){return Xc(r,o,e,i)}))}var Jc=Hs(function(e){return function(){e(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}}),Ne=(function(e){Zt(t,e);function t(){var i=e.call(this)||this;return i.closed=!1,i.currentObservers=null,i.observers=[],i.isStopped=!1,i.hasError=!1,i.thrownError=null,i}return t.prototype.lift=function(i){var r=new $o(this,this);return r.operator=i,r},t.prototype._throwIfClosed=function(){if(this.closed)throw new Jc},t.prototype.next=function(i){var r=this;ti(function(){var o,s;if(r._throwIfClosed(),!r.isStopped){r.currentObservers||(r.currentObservers=Array.from(r.observers));try{for(var n=ue(r.currentObservers),a=n.next();!a.done;a=n.next()){var l=a.value;l.next(i)}}catch(c){o={error:c}}finally{try{a&&!a.done&&(s=n.return)&&s.call(n)}finally{if(o)throw o.error}}}})},t.prototype.error=function(i){var r=this;ti(function(){if(r._throwIfClosed(),!r.isStopped){r.hasError=r.isStopped=!0,r.thrownError=i;for(var o=r.observers;o.length;)o.shift().error(i)}})},t.prototype.complete=function(){var i=this;ti(function(){if(i._throwIfClosed(),!i.isStopped){i.isStopped=!0;for(var r=i.observers;r.length;)r.shift().complete()}})},t.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(t.prototype,"observed",{get:function(){var i;return((i=this.observers)===null||i===void 0?void 0:i.length)>0},enumerable:!1,configurable:!0}),t.prototype._trySubscribe=function(i){return this._throwIfClosed(),e.prototype._trySubscribe.call(this,i)},t.prototype._subscribe=function(i){return this._throwIfClosed(),this._checkFinalizedStatuses(i),this._innerSubscribe(i)},t.prototype._innerSubscribe=function(i){var r=this,o=this,s=o.hasError,n=o.isStopped,a=o.observers;return s||n?Ws:(this.currentObservers=null,a.push(i),new Si(function(){r.currentObservers=null,Xi(a,i)}))},t.prototype._checkFinalizedStatuses=function(i){var r=this,o=r.hasError,s=r.thrownError,n=r.isStopped;o?i.error(s):n&&i.complete()},t.prototype.asObservable=function(){var i=new j;return i.source=this,i},t.create=function(i,r){return new $o(i,r)},t})(j),$o=(function(e){Zt(t,e);function t(i,r){var o=e.call(this)||this;return o.destination=i,o.source=r,o}return t.prototype.next=function(i){var r,o;(o=(r=this.destination)===null||r===void 0?void 0:r.next)===null||o===void 0||o.call(r,i)},t.prototype.error=function(i){var r,o;(o=(r=this.destination)===null||r===void 0?void 0:r.error)===null||o===void 0||o.call(r,i)},t.prototype.complete=function(){var i,r;(r=(i=this.destination)===null||i===void 0?void 0:i.complete)===null||r===void 0||r.call(i)},t.prototype._subscribe=function(i){var r,o;return(o=(r=this.source)===null||r===void 0?void 0:r.subscribe(i))!==null&&o!==void 0?o:Ws},t})(Ne),Qc=new j(function(e){return e.complete()});function th(e){return e<=0?function(){return Qc}:Pt(function(t,i){var r=0;t.subscribe(dt(i,function(o){++r<=e&&(i.next(o),e<=r&&i.complete())}))})}function eh(e){return Lr(function(){return e})}function ih(e,t){return cn(function(i,r){return mt(e(i,r)).pipe(th(1),eh(i))})}var rh=(function(e){Zt(t,e);function t(i){var r=e.call(this)||this;return r._value=i,r}return Object.defineProperty(t.prototype,"value",{get:function(){return this.getValue()},enumerable:!1,configurable:!0}),t.prototype._subscribe=function(i){var r=e.prototype._subscribe.call(this,i);return!r.closed&&i.next(this._value),r},t.prototype.getValue=function(){var i=this,r=i.hasError,o=i.thrownError,s=i._value;if(r)throw o;return this._throwIfClosed(),s},t.prototype.next=function(i){e.prototype.next.call(this,this._value=i)},t})(Ne),oh=(function(e){Zt(t,e);function t(i,r,o){i===void 0&&(i=1/0),r===void 0&&(r=1/0),o===void 0&&(o=rn);var s=e.call(this)||this;return s._bufferSize=i,s._windowTime=r,s._timestampProvider=o,s._buffer=[],s._infiniteTimeWindow=!0,s._infiniteTimeWindow=r===1/0,s._bufferSize=Math.max(1,i),s._windowTime=Math.max(1,r),s}return t.prototype.next=function(i){var r=this,o=r.isStopped,s=r._buffer,n=r._infiniteTimeWindow,a=r._timestampProvider,l=r._windowTime;o||(s.push(i),!n&&s.push(a.now()+l)),this._trimBuffer(),e.prototype.next.call(this,i)},t.prototype._subscribe=function(i){this._throwIfClosed(),this._trimBuffer();for(var r=this._innerSubscribe(i),o=this,s=o._infiniteTimeWindow,n=o._buffer,a=n.slice(),l=0;l<a.length&&!i.closed;l+=s?1:2)i.next(a[l]);return this._checkFinalizedStatuses(i),r},t.prototype._trimBuffer=function(){var i=this,r=i._bufferSize,o=i._timestampProvider,s=i._buffer,n=i._infiniteTimeWindow,a=(n?1:2)*r;if(r<1/0&&a<s.length&&s.splice(0,s.length-a),!n){for(var l=o.now(),c=0,h=1;h<s.length&&s[h]<=l;h+=2)c=h;c&&s.splice(0,c+1)}},t})(Ne);function sh(e){e===void 0&&(e={});var t=e.connector,i=t===void 0?function(){return new Ne}:t,r=e.resetOnError,o=r===void 0?!0:r,s=e.resetOnComplete,n=s===void 0?!0:s,a=e.resetOnRefCountZero,l=a===void 0?!0:a;return function(c){var h,d,p,u=0,m=!1,b=!1,_=function(){d?.unsubscribe(),d=void 0},v=function(){_(),h=p=void 0,m=b=!1},w=function(){var $=h;v(),$?.unsubscribe()};return Pt(function($,C){u++,!b&&!m&&_();var E=p=p??i();C.add(function(){u--,u===0&&!b&&!m&&(d=Ni(w,l))}),E.subscribe(C),!h&&u>0&&(h=new Ie({next:function(O){return E.next(O)},error:function(O){b=!0,_(),d=Ni(v,o,O),E.error(O)},complete:function(){m=!0,_(),d=Ni(v,n),E.complete()}}),mt($).subscribe(h))})(c)}}function Ni(e,t){for(var i=[],r=2;r<arguments.length;r++)i[r-2]=arguments[r];if(t===!0){e();return}if(t!==!1){var o=new Ie({next:function(){o.unsubscribe(),e()}});return mt(t.apply(void 0,Te([],Re(i)))).subscribe(o)}}function So(e,t,i){var r,o,s,n,a=!1;return e&&typeof e=="object"?(r=e.bufferSize,n=r===void 0?1/0:r,o=e.windowTime,t=o===void 0?1/0:o,s=e.refCount,a=s===void 0?!1:s,i=e.scheduler):n=e??1/0,sh({connector:function(){return new oh(n,t,i)},resetOnError:!0,resetOnComplete:!1,resetOnRefCountZero:a})}function Co(e,t){return Pt(function(i,r){var o=null,s=0,n=!1,a=function(){return n&&!o&&r.complete()};i.subscribe(dt(r,function(l){o?.unsubscribe();var c=0,h=s++;mt(e(l,h)).subscribe(o=dt(r,function(d){return r.next(t?t(l,d,h,c++):d)},function(){o=null,a()}))},function(){n=!0,a()}))})}function Rr(e,t,i){var r=I(e)||t||i?{next:e,error:t,complete:i}:e;return r?Pt(function(o,s){var n;(n=r.subscribe)===null||n===void 0||n.call(r);var a=!0;o.subscribe(dt(s,function(l){var c;(c=r.next)===null||c===void 0||c.call(r,l),s.next(l)},function(){var l;a=!1,(l=r.complete)===null||l===void 0||l.call(r),s.complete()},function(l){var c;a=!1,(c=r.error)===null||c===void 0||c.call(r,l),s.error(l)},function(){var l,c;a&&((l=r.unsubscribe)===null||l===void 0||l.call(r)),(c=r.finalize)===null||c===void 0||c.call(r)}))}):Ci}function nh(e){return typeof e=="number"}function ah(e){return typeof e=="string"}function lh(e){return typeof e=="bigint"}function hn(e){return!!e&&Object.prototype.toString.call(e)==="[object Date]"&&!isNaN(e)}function un(e){return e!=null&&typeof e=="object"&&Object.prototype.toString.call(e)==="[object Object]"}var ch=Symbol.for("decoders.kAnnotationRegistry"),dn=globalThis[ch]??=new WeakSet;function je(e){return dn.add(e),e}function fn(e,t){return je({type:"object",fields:e,text:t})}function hh(e,t){return je({type:"array",items:e,text:t})}function Ge(e,t){return je({type:"opaque",value:e,text:t})}function uh(e,t){return je({type:"scalar",value:e,text:t})}function pn(e,t){return t!==void 0?je({...e,text:t}):e}function mn(e,t){const i=new Map([...e.fields,...t]);return fn(i,e.text)}function gn(e){return dn.has(e)}function dh(e,t,i){i.add(e);const r=[];for(const o of e)r.push(Tr(o,void 0,i));return hh(r,t)}function bn(e,t,i){i.add(e);const r=new Map;for(const o of Object.keys(e)){const s=e[o];r.set(o,Tr(s,void 0,i))}return fn(r,t)}function Tr(e,t,i){return e==null||typeof e=="string"||typeof e=="number"||typeof e=="boolean"||typeof e=="symbol"||typeof e.getMonth=="function"?uh(e,t):gn(e)?pn(e,t):Array.isArray(e)?i.has(e)?Ge("<circular ref>",t):dh(e,t,i):un(e)?i.has(e)?Ge("<circular ref>",t):bn(e,t,i):Ge(typeof e=="function"?"<function>":"???",t)}function Nt(e,t){return Tr(e,t,new WeakSet)}function vn(e,t){return bn(e,t,new WeakSet)}var jt="  ";function Ji(e){return e.includes(`
`)}function Ir(e,t=jt){return Ji(e)?e.split(`
`).map(i=>`${t}${i}`).join(`
`):`${t}${e}`}var fh=/'/g;function de(e){return typeof e=="string"?"'"+e.replace(fh,"\\'")+"'":e===void 0?"undefined":JSON.stringify(e)}function hi(e,t=[]){const i=[];if(e.type==="array"){const s=e.items;let n=0;for(const a of s)for(const l of hi(a,[...t,n++]))i.push(l)}else if(e.type==="object"){const s=e.fields;for(const[n,a]of s)for(const l of hi(a,[...t,n]))i.push(l)}const r=e.text;if(!r)return i;let o;return t.length===0?o="":t.length===1?o=typeof t[0]=="number"?`Value at index ${t[0]}: `:`Value at key ${de(t[0])}: `:o=`Value at keypath ${de(t.map(String).join("."))}: `,[...i,`${o}${r}`]}function ph(e,t=80){let i=JSON.stringify(e);if(i.length<=t)return i;const r=`${e.substring(0,t-15)}...`;return i=`${JSON.stringify(r)} [truncated]`,i}function mh(e,t){const{items:i}=e;if(i.length===0)return"[]";const r=[];for(const o of i){const[s,n]=Dr(o,`${t}${jt}`);r.push(`${t}${jt}${s},`),n!==void 0&&r.push(Ir(n,`${t}${jt}`))}return["[",...r,`${t}]`].join(`
`)}function gh(e,t){const{fields:i}=e;if(i.size===0)return"{}";const r=[];for(const[o,s]of i){const n=yn(o),a=`${t}${jt}${" ".repeat(n.length+2)}`,[l,c]=Dr(s,`${t}${jt}`);r.push(`${t}${jt}${n}: ${l},`),c!==void 0&&r.push(Ir(c,a))}return["{",...r,`${t}}`].join(`
`)}function yn(e){return typeof e=="string"?ph(e):typeof e=="number"||typeof e=="boolean"||typeof e=="symbol"?e.toString():e===null?"null":e===void 0?"undefined":hn(e)?`new Date(${de(e.toISOString())})`:e instanceof Date?"(Invalid Date)":"(unserializable)"}function Dr(e,t=""){let i;e.type==="array"?i=mh(e,t):e.type==="object"?i=gh(e,t):e.type==="scalar"?i=yn(e.value):i=e.value;const r=e.text;if(r!==void 0){const o="^".repeat(Ji(i)?1:i.length);return[i,[o,r].join(Ji(r)?`
`:" ")]}else return[i,void 0]}function bh(e){const[t,i]=Dr(e);return i!==void 0?`${t}
${i}`:t}function vh(e){return hi(e,[]).join(`
`)}function*Qi(e,t){switch(e.text&&(t.length>0?yield{message:e.text,path:[...t]}:yield{message:e.text}),e.type){case"array":{let i=0;for(const r of e.items)t.push(i++),yield*Qi(r,t),t.pop();break}case"object":{for(const[i,r]of e.fields)t.push(i),yield*Qi(r,t),t.pop();break}}}function yh(e){return Array.from(Qi(e,[]))}function _n(e){return{ok:!0,value:e,error:void 0}}function wn(e){return{ok:!1,value:void 0,error:e}}function _h(e){return t=>{try{const i=e(t);return _n(i)}catch(i){return wn(Nt(t,i instanceof Error?i.message:String(i)))}}}function wh(e,t){const i=t(e);if(typeof i=="string"){const r=new Error(`
${i}`);return r.name="Decoding error",r}else return i}function F(e){function t(u){return e(u,_n,b=>wn(gn(b)?b:Nt(u,b)))}function i(u,m=bh){const b=t(u);if(b.ok)return b.value;throw wh(b.error,m)}function r(u){return t(u).value}function o(u){return a(_h(u))}function s(u,m){return c(b=>u(b)?null:m)}function n(){return p}function a(u){return F((m,b,_)=>{const v=t(m);if(!v.ok)return v;const w=Eo(u)?u:u(v.value,b,_);return Eo(w)?w.decode(v.value):w})}function l(u){return a(u)}function c(u){return a((m,b,_)=>{const v=u(m);return v===null?b(m):_(typeof v=="string"?Nt(m,v):v)})}function h(u){return F((m,b,_)=>{const v=t(m);return v.ok?v:_(Nt(v.error,u))})}const p=$h({verify:i,value:r,decode:t,transform:o,refine:s,refineType:n,reject:c,describe:h,then:a,pipe:l,"~standard":{version:1,vendor:"decoders",validate:u=>{const m=t(u);return m.ok?{value:m.value}:{issues:yh(m.error)}}}});return p}var xh=Symbol.for("decoders.kDecoderRegistry"),xn=globalThis[xh]??=new WeakSet;function $h(e){return xn.add(e),e}function Eo(e){return xn.has(e)}var Sh=F((e,t,i)=>Array.isArray(e)?t(e):i("Must be an array"));function Ht(e){const t=e.decode;return Sh.then((i,r,o)=>{const s=[];for(let n=0;n<i.length;++n){const a=i[n],l=t(a);if(l.ok)s.push(l.value);else{s.length=0;const c=l.error,h=i.slice();return h.splice(n,1,Nt(c,c.text?`${c.text} (at index ${n})`:`index ${n}`)),o(Nt(h))}}return r(s)})}function Ch(e){return F((t,i,r)=>t instanceof e?i(t):r(`Must be ${e.name} instance`))}function $n(e){return F(t=>e().decode(t))}function Eh(e,t){const i=new Set;for(const r of e)t.has(r)||i.add(r);return i}var Sn=F((e,t,i)=>un(e)?t(e):i("Must be an object"));function G(e){const t=new Set(Object.keys(e));return Sn.then((i,r,o)=>{const s=new Set(Object.keys(i)),n=Eh(t,s),a={};let l=null;for(const c of Object.keys(e)){const h=e[c],d=i[c],p=h.decode(d);if(p.ok){const u=p.value;u!==void 0&&(a[c]=u),n.delete(c)}else{const u=p.error;d===void 0?n.add(c):(l??=new Map,l.set(c,u))}}if(l||n.size>0){let c=vn(i);if(l&&(c=mn(c,l)),n.size>0){const h=Array.from(n).map(de).join(", "),d=n.size>1?"keys":"key";c=pn(c,`Missing ${d}: ${h}`)}return o(c)}return r(a)})}var tr=`Either:
`;function kh(e){return`-${Ir(e).substring(1)}`}function Ah(e){return e.startsWith(tr)?e.substring(tr.length):kh(e)}function fe(...e){if(e.length===0)throw new Error("Pass at least one decoder to either()");return F((t,i,r)=>{const o=[];for(const n of e){const a=n.decode(t);if(a.ok)return a;o.push(a.error)}const s=tr+o.map(n=>Ah(hi(n).join(`
`))).join(`
`);return r(s)})}var er=ui(null);ui(void 0);F((e,t,i)=>e==null?t(e):i("Must be undefined or null"));function ui(e){return F((t,i,r)=>t===e?i(e):r(`Must be ${typeof e=="symbol"?String(e):de(e)}`))}var zh=F((e,t,i)=>t(e)),Cn=zh,S=F((e,t,i)=>typeof e=="boolean"?t(e):i("Must be boolean"));F((e,t,i)=>t(!!e));function En(e,t){const i=t!==void 0?e:void 0,r=t??e;return Sn.then((o,s,n)=>{let a={};const l=new Map;for(const c of Object.keys(o)){const h=o[c],d=i?.decode(c);if(d?.ok===!1)return n(Nt(o,`Invalid key ${de(c)}: ${vh(d.error)}`));const p=d?.value??c,u=r.decode(h);u.ok?l.size===0&&(a[p]=u.value):(l.set(c,u.error),a={})}return l.size>0?n(mn(vn(o),l)):s(a)})}var Ph=/^([A-Za-z]{2,12}(?:[+][A-Za-z]{2,12})?):\/\/(?:([^@:]*:?(?:[^@]+)?)@)?(?:([A-Za-z0-9.-]+)(?::([0-9]{2,5}))?)(\/(?:[-+~%/.,\w]*)?(?:\?[-+=&;%@.,/\w]*)?(?:#[.,!/\w]*)?)?$/,y=F((e,t,i)=>ah(e)?t(e):i("Must be string"));Ot(/\S/,"Must be non-empty string");function Ot(e,t){return y.refine(i=>e.test(i),t)}Ot(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Must be email");var Oh=fe(Ot(Ph,"Must be URL").transform(e=>new URL(e)),Ch(URL));Oh.refine(e=>e.protocol==="https:","Must be an HTTPS URL");Ot(/^[a-z_][a-z0-9_]*$/i,"Must be valid identifier");var kn=Ot(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,"Must be uuid");kn.refine(e=>e[14]==="1","Must be uuidv1");kn.refine(e=>e[14]==="4","Must be uuidv4");var Mh=Ot(/^[0-9]+$/,"Must only contain digits");Ot(/^[0-9a-f]+$/i,"Must only contain hexadecimal digits");Mh.transform(Number);var Lh=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.]\d+)?(?:Z|[+-]\d{2}:?\d{2})$/,Rh=F((e,t,i)=>hn(e)?t(e):i("Must be a Date")),Th=Ot(Lh,"Must be ISO8601 format").refine(e=>!isNaN(new Date(e).getTime()),"Must be valid date/time value"),Ih=Th.transform(e=>new Date(e));fe(Rh,Ih).describe("Must be a Date or date string");var Dh=F((e,t,i)=>nh(e)?t(e):i("Must be number")),R=Dh.refine(e=>Number.isFinite(e),"Number must be finite"),Vh=R.refine(e=>Number.isInteger(e),"Number must be an integer");R.refine(e=>e>=0&&!Object.is(e,-0),"Number must be positive");Vh.refine(e=>e>=0&&!Object.is(e,-0),"Number must be positive");F((e,t,i)=>lh(e)?t(e):i("Must be bigint"));var Bh=$n(()=>En(An)),Nh=$n(()=>Ht(An)),An=fe(er,y,R,S,Bh,Nh).describe("Must be valid JSON value");const jh=["family","climbing"],Fh=G({width:R,height:R,url:y,accessories:Ht(Cn)}),zn=G({header_full_width:R,header_full_height:R,avatar_shape:y,background_color:y,body_font:y,header_bounds:y,header_image:y,header_image_focused:y,header_image_poster:y,header_image_scaled:y,header_stretch:S,link_color:y,show_avatar:S,show_description:S,show_header_image:S,show_title:S,title_color:y,title_font:y,title_font_weight:y}),Pn=G({admin:S,ask:S,ask_anon:S,ask_page_title:y,asks_allow_media:S,avatar:Ht(Fh),can_chat:S,can_send_fan_mail:S,can_subscribe:S,description:y,drafts:R,facebook:y,facebook_opengraph_enabled:y,followed:S,followers:R,is_blocked_from_primary:S,is_nsfw:S,messages:R,name:y,posts:R,primary:S,queue:R,share_likes:S,subscribed:S,theme_id:R,theme:zn,title:y,total_posts:R,tweet:y,twitter_enabled:S,twitter_send:S,type:y,updated:R,url:y,uuid:y}),Uh=G({name:y,title:y,description:y,url:y,uuid:y,updated:R,tumblrmart_accessories:En(y,Cn),can_show_badges:S}),Hh=G({comment:y,tree_html:y}),Wh=G({blog:G({name:y,active:S,theme:zn,share_likes:S,share_following:S,can_be_followed:S}),post:G({id:y}),content_raw:y,content:y,is_current_item:S,is_root_item:S}),qh=G({type:y,is_blocks_post_format:S,blog_name:y,blog:Uh,id:y,id_string:y,is_blazed:S,is_blaze_pending:S,can_ignite:S,can_blaze:S,post_url:y,slug:y,date:y,timestamp:R,state:y,format:y,reblog_key:y,tags:Ht(y),short_url:y,summary:y,should_open_in_legacy:S,recommended_source:fe(y,er),recommended_color:fe(y,er),followed:S,liked:S,note_count:R,title:y,body:y,reblog:Hh,trail:Ht(Wh),can_like:S,interactability_reblog:y,interactability_blaze:y,can_reblog:S,can_send_in_message:S,muted:S,mute_end_timestamp:R,can_mute:S,can_reply:S,display_avatar:S}),Gh=G({blog:Pn,posts:Ht(qh),total_posts:R});G({blog:G({blog:Pn}),posts:Gh});G({avatar:y,updated:R,title:y,description:y});G({id:y,date:R,body:y,tags:Ht(y)});class Fe extends se{createRenderRoot(){return this}}function Kh(){return new j(e=>{const t=requestIdleCallback(()=>e.next());return()=>cancelIdleCallback(t)})}function Mt(e){return function(t,i){let r;const o=t.connectedCallback,s=t.disconnectedCallback;t.connectedCallback=function(){o.call(this),r=e(this).subscribe(n=>{this[i]=n,this.requestUpdate()})},t.disconnectedCallback=function(){r?.unsubscribe(),s.call(this)}}}function ko(e,t){t===void 0&&(t={});var i=t.selector,r=hc(t,["selector"]);return new j(function(o){var s=new AbortController,n=s.signal,a=!0,l=r.signal;if(l)if(l.aborted)s.abort();else{var c=function(){n.aborted||s.abort()};l.addEventListener("abort",c),o.add(function(){return l.removeEventListener("abort",c)})}var h=ci(ci({},r),{signal:n}),d=function(p){a=!1,o.error(p)};return fetch(e,h).then(function(p){i?mt(i(p)).subscribe(dt(o,void 0,function(){a=!1,o.complete()},d)):(a=!1,o.next(p),o.complete())}).catch(d),function(){a&&s.abort()}})}const Ei="blog";class Yh{constructor(){this.meta$=ko("/dadmaxxing/meta.json").pipe(Co(t=>t.json()),So({bufferSize:1,refCount:!0})),this.posts$=ko("/dadmaxxing/posts.json").pipe(Co(t=>t.json()),So({bufferSize:1,refCount:!0})),Yc([this.meta$,this.posts$]).subscribe({error:t=>console.warn("failed to load tumblr data",t)})}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ao=new WeakMap,zo=e=>{if((i=>i.pattern!==void 0)(e))return e.pattern;let t=Ao.get(e);return t===void 0&&Ao.set(e,t=new URLPattern({pathname:e.path})),t};let Zh=class{constructor(t,i,r){this.routes=[],this.o=[],this.t={},this.i=o=>{if(o.routes===this)return;const s=o.routes;this.o.push(s),s.h=this,o.stopImmediatePropagation(),o.onDisconnect=()=>{this.o?.splice(this.o.indexOf(s)>>>0,1)};const n=Po(this.t);n!==void 0&&s.goto(n)},(this.l=t).addController(this),this.routes=[...i],this.fallback=r?.fallback}link(t){if(t?.startsWith("/"))return t;if(t?.startsWith("."))throw Error("Not implemented");return t??=this.u,(this.h?.link()??"")+t}async goto(t){let i;if(this.routes.length===0&&this.fallback===void 0)i=t,this.u="",this.t={0:i};else{const r=this.p(t);if(r===void 0)throw Error("No route found for "+t);const o=zo(r).exec({pathname:t}),s=o?.pathname.groups??{};if(i=Po(s),typeof r.enter=="function"&&await r.enter(s)===!1)return;this.v=r,this.t=s,this.u=i===void 0?t:t.substring(0,t.length-i.length)}if(i!==void 0)for(const r of this.o)r.goto(i);this.l.requestUpdate()}outlet(){return this.v?.render?.(this.t)}get params(){return this.t}p(t){const i=this.routes.find((r=>zo(r).test({pathname:t})));return i||this.fallback===void 0?i:this.fallback?{...this.fallback,path:"/*"}:void 0}hostConnected(){this.l.addEventListener(ir.eventName,this.i);const t=new ir(this);this.l.dispatchEvent(t),this._=t.onDisconnect}hostDisconnected(){this._?.(),this.h=void 0}};const Po=e=>{let t;for(const i of Object.keys(e))/\d+/.test(i)&&(t===void 0||i>t)&&(t=i);return t&&e[t]};let ir=class On extends Event{constructor(t){super(On.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.routes=t}};ir.eventName="lit-routes-connected";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xh=location.origin||location.protocol+"//"+location.host;class Jh extends Zh{constructor(){super(...arguments),this.m=t=>{const i=t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey;if(t.defaultPrevented||i)return;const r=t.composedPath().find((n=>n.tagName==="A"));if(r===void 0||r.target!==""||r.hasAttribute("download")||r.getAttribute("rel")==="external")return;const o=r.href;if(o===""||o.startsWith("mailto:"))return;const s=window.location;r.origin===Xh&&(t.preventDefault(),o!==s.href&&(window.history.pushState({},"",o),this.goto(r.pathname)))},this.R=t=>{this.goto(window.location.pathname)}}hostConnected(){super.hostConnected(),window.addEventListener("click",this.m),window.addEventListener("popstate",this.R),this.goto(window.location.pathname)}hostDisconnected(){super.hostDisconnected(),window.removeEventListener("click",this.m),window.removeEventListener("popstate",this.R)}}const Vr="router";class Qh extends Jh{constructor(){super(...arguments),this.#e=new Ne,this.pathname$=this.#e.asObservable()}#e;async goto(t){const i=t.replace(/\/$/,"");await super.goto(i),this.#e.next(i)}}const Mn="theme",Ln="app-theme",tu=fe(ui("light"),ui("dark"));function eu(){return tu.value(localStorage.getItem(Ln))}function iu(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}class ru{constructor(){this.#e=new rh(eu()??iu()),this.theme$=this.#e.asObservable(),this.theme$.subscribe({next:t=>{localStorage.setItem(Ln,t),t==="dark"?document.documentElement.classList.add("sl-theme-dark"):document.documentElement.classList.remove("sl-theme-dark")},error:t=>console.warn("failed to apply theme",{err:t})})}#e;toggle(){this.#e.next(this.#e.getValue()==="dark"?"light":"dark")}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Oo{constructor(t){this._map=new Map,this._roundAverageSize=!1,this.totalSize=0,t?.roundAverageSize===!0&&(this._roundAverageSize=!0)}set(t,i){const r=this._map.get(t)||0;this._map.set(t,i),this.totalSize+=i-r}get averageSize(){if(this._map.size>0){const t=this.totalSize/this._map.size;return this._roundAverageSize?Math.round(t):t}return 0}getSize(t){return this._map.get(t)}clear(){this._map.clear(),this.totalSize=0}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Rn(e){return e==="horizontal"?"width":"height"}class ou{_getDefaultConfig(){return{direction:"vertical"}}constructor(t,i){this._latestCoords={left:0,top:0},this._direction=null,this._viewportSize={width:0,height:0},this.totalScrollSize={width:0,height:0},this.offsetWithinScroller={left:0,top:0},this._pendingReflow=!1,this._pendingLayoutUpdate=!1,this._pin=null,this._firstVisible=0,this._lastVisible=0,this._physicalMin=0,this._physicalMax=0,this._first=-1,this._last=-1,this._sizeDim="height",this._secondarySizeDim="width",this._positionDim="top",this._secondaryPositionDim="left",this._scrollPosition=0,this._scrollError=0,this._items=[],this._scrollSize=1,this._overhang=1e3,this._hostSink=t,Promise.resolve().then(()=>this.config=i||this._getDefaultConfig())}set config(t){Object.assign(this,Object.assign({},this._getDefaultConfig(),t))}get config(){return{direction:this.direction}}get items(){return this._items}set items(t){this._setItems(t)}_setItems(t){t!==this._items&&(this._items=t,this._scheduleReflow())}get direction(){return this._direction}set direction(t){t=t==="horizontal"?t:"vertical",t!==this._direction&&(this._direction=t,this._sizeDim=t==="horizontal"?"width":"height",this._secondarySizeDim=t==="horizontal"?"height":"width",this._positionDim=t==="horizontal"?"left":"top",this._secondaryPositionDim=t==="horizontal"?"top":"left",this._triggerReflow())}get viewportSize(){return this._viewportSize}set viewportSize(t){const{_viewDim1:i,_viewDim2:r}=this;Object.assign(this._viewportSize,t),r!==this._viewDim2?this._scheduleLayoutUpdate():i!==this._viewDim1&&this._checkThresholds()}get viewportScroll(){return this._latestCoords}set viewportScroll(t){Object.assign(this._latestCoords,t);const i=this._scrollPosition;this._scrollPosition=this._latestCoords[this._positionDim],Math.abs(i-this._scrollPosition)>=1&&this._checkThresholds()}reflowIfNeeded(t=!1){(t||this._pendingReflow)&&(this._pendingReflow=!1,this._reflow())}set pin(t){this._pin=t,this._triggerReflow()}get pin(){if(this._pin!==null){const{index:t,block:i}=this._pin;return{index:Math.max(0,Math.min(t,this.items.length-1)),block:i}}return null}_clampScrollPosition(t){return Math.max(-this.offsetWithinScroller[this._positionDim],Math.min(t,this.totalScrollSize[Rn(this.direction)]-this._viewDim1))}unpin(){this._pin!==null&&(this._sendUnpinnedMessage(),this._pin=null)}_updateLayout(){}get _viewDim1(){return this._viewportSize[this._sizeDim]}get _viewDim2(){return this._viewportSize[this._secondarySizeDim]}_scheduleReflow(){this._pendingReflow=!0}_scheduleLayoutUpdate(){this._pendingLayoutUpdate=!0,this._scheduleReflow()}_triggerReflow(){this._scheduleLayoutUpdate(),Promise.resolve().then(()=>this.reflowIfNeeded())}_reflow(){this._pendingLayoutUpdate&&(this._updateLayout(),this._pendingLayoutUpdate=!1),this._updateScrollSize(),this._setPositionFromPin(),this._getActiveItems(),this._updateVisibleIndices(),this._sendStateChangedMessage()}_setPositionFromPin(){if(this.pin!==null){const t=this._scrollPosition,{index:i,block:r}=this.pin;this._scrollPosition=this._calculateScrollIntoViewPosition({index:i,block:r||"start"})-this.offsetWithinScroller[this._positionDim],this._scrollError=t-this._scrollPosition}}_calculateScrollIntoViewPosition(t){const{block:i}=t,r=Math.min(this.items.length,Math.max(0,t.index)),o=this._getItemPosition(r)[this._positionDim];let s=o;if(i!=="start"){const n=this._getItemSize(r)[this._sizeDim];if(i==="center")s=o-.5*this._viewDim1+.5*n;else{const a=o-this._viewDim1+n;if(i==="end")s=a;else{const l=this._scrollPosition;s=Math.abs(l-o)<Math.abs(l-a)?o:a}}}return s+=this.offsetWithinScroller[this._positionDim],this._clampScrollPosition(s)}getScrollIntoViewCoordinates(t){return{[this._positionDim]:this._calculateScrollIntoViewPosition(t)}}_sendUnpinnedMessage(){this._hostSink({type:"unpinned"})}_sendVisibilityChangedMessage(){this._hostSink({type:"visibilityChanged",firstVisible:this._firstVisible,lastVisible:this._lastVisible})}_sendStateChangedMessage(){const t=new Map;if(this._first!==-1&&this._last!==-1)for(let r=this._first;r<=this._last;r++)t.set(r,this._getItemPosition(r));const i={type:"stateChanged",scrollSize:{[this._sizeDim]:this._scrollSize,[this._secondarySizeDim]:null},range:{first:this._first,last:this._last,firstVisible:this._firstVisible,lastVisible:this._lastVisible},childPositions:t};this._scrollError&&(i.scrollError={[this._positionDim]:this._scrollError,[this._secondaryPositionDim]:0},this._scrollError=0),this._hostSink(i)}get _num(){return this._first===-1||this._last===-1?0:this._last-this._first+1}_checkThresholds(){if(this._viewDim1===0&&this._num>0||this._pin!==null)this._scheduleReflow();else{const t=Math.max(0,this._scrollPosition-this._overhang),i=Math.min(this._scrollSize,this._scrollPosition+this._viewDim1+this._overhang);this._physicalMin>t||this._physicalMax<i?this._scheduleReflow():this._updateVisibleIndices({emit:!0})}}_updateVisibleIndices(t){if(this._first===-1||this._last===-1)return;let i=this._first;for(;i<this._last&&Math.round(this._getItemPosition(i)[this._positionDim]+this._getItemSize(i)[this._sizeDim])<=Math.round(this._scrollPosition);)i++;let r=this._last;for(;r>this._first&&Math.round(this._getItemPosition(r)[this._positionDim])>=Math.round(this._scrollPosition+this._viewDim1);)r--;(i!==this._firstVisible||r!==this._lastVisible)&&(this._firstVisible=i,this._lastVisible=r,t&&t.emit&&this._sendVisibilityChangedMessage())}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tn=e=>Object.assign({type:In},e);function Mo(e){return e==="horizontal"?"marginLeft":"marginTop"}function su(e){return e==="horizontal"?"marginRight":"marginBottom"}function nu(e){return e==="horizontal"?"xOffset":"yOffset"}function au(e,t){const i=[e,t].sort();return i[1]<=0?Math.min(...i):i[0]>=0?Math.max(...i):i[0]+i[1]}class lu{constructor(){this._childSizeCache=new Oo,this._marginSizeCache=new Oo,this._metricsCache=new Map}update(t,i){const r=new Set;Object.keys(t).forEach(o=>{const s=Number(o);this._metricsCache.set(s,t[s]),this._childSizeCache.set(s,t[s][Rn(i)]),r.add(s),r.add(s+1)});for(const o of r){const s=this._metricsCache.get(o)?.[Mo(i)]||0,n=this._metricsCache.get(o-1)?.[su(i)]||0;this._marginSizeCache.set(o,au(s,n))}}get averageChildSize(){return this._childSizeCache.averageSize}get totalChildSize(){return this._childSizeCache.totalSize}get averageMarginSize(){return this._marginSizeCache.averageSize}get totalMarginSize(){return this._marginSizeCache.totalSize}getLeadingMarginValue(t,i){return this._metricsCache.get(t)?.[Mo(i)]||0}getChildSize(t){return this._childSizeCache.getSize(t)}getMarginSize(t){return this._marginSizeCache.getSize(t)}clear(){this._childSizeCache.clear(),this._marginSizeCache.clear(),this._metricsCache.clear()}}class In extends ou{constructor(){super(...arguments),this._itemSize={width:100,height:100},this._physicalItems=new Map,this._newPhysicalItems=new Map,this._metricsCache=new lu,this._anchorIdx=null,this._anchorPos=null,this._stable=!0,this._measureChildren=!0,this._estimate=!0}get measureChildren(){return this._measureChildren}updateItemSizes(t){this._metricsCache.update(t,this.direction),this._scheduleReflow()}_getPhysicalItem(t){return this._newPhysicalItems.get(t)??this._physicalItems.get(t)}_getSize(t){return this._getPhysicalItem(t)&&this._metricsCache.getChildSize(t)}_getAverageSize(){return this._metricsCache.averageChildSize||this._itemSize[this._sizeDim]}_estimatePosition(t){const i=this._metricsCache;if(this._first===-1||this._last===-1)return i.averageMarginSize+t*(i.averageMarginSize+this._getAverageSize());if(t<this._first){const r=this._first-t;return this._getPhysicalItem(this._first).pos-(i.getMarginSize(this._first-1)||i.averageMarginSize)-(r*i.averageChildSize+(r-1)*i.averageMarginSize)}else{const r=t-this._last;return this._getPhysicalItem(this._last).pos+(i.getChildSize(this._last)||i.averageChildSize)+(i.getMarginSize(this._last)||i.averageMarginSize)+r*(i.averageChildSize+i.averageMarginSize)}}_getPosition(t){const i=this._getPhysicalItem(t),{averageMarginSize:r}=this._metricsCache;return t===0?this._metricsCache.getMarginSize(0)??r:i?i.pos:this._estimatePosition(t)}_calculateAnchor(t,i){return t<=0?0:i>this._scrollSize-this._viewDim1?this.items.length-1:Math.max(0,Math.min(this.items.length-1,Math.floor((t+i)/2/this._delta)))}_getAnchor(t,i){if(this._physicalItems.size===0)return this._calculateAnchor(t,i);if(this._first<0)return this._calculateAnchor(t,i);if(this._last<0)return this._calculateAnchor(t,i);const r=this._getPhysicalItem(this._first),o=this._getPhysicalItem(this._last),s=r.pos;if(o.pos+this._metricsCache.getChildSize(this._last)<t)return this._calculateAnchor(t,i);if(s>i)return this._calculateAnchor(t,i);let l=this._firstVisible-1,c=-1/0;for(;c<t;)c=this._getPhysicalItem(++l).pos+this._metricsCache.getChildSize(l);return l}_getActiveItems(){this._viewDim1===0||this.items.length===0?this._clearItems():this._getItems()}_clearItems(){this._first=-1,this._last=-1,this._physicalMin=0,this._physicalMax=0;const t=this._newPhysicalItems;this._newPhysicalItems=this._physicalItems,this._newPhysicalItems.clear(),this._physicalItems=t,this._stable=!0}_getItems(){const t=this._newPhysicalItems;this._stable=!0;let i,r;if(this.pin!==null){const{index:c}=this.pin;this._anchorIdx=c,this._anchorPos=this._getPosition(c)}if(i=this._scrollPosition-this._overhang,r=this._scrollPosition+this._viewDim1+this._overhang,r<0||i>this._scrollSize){this._clearItems();return}(this._anchorIdx===null||this._anchorPos===null)&&(this._anchorIdx=this._getAnchor(i,r),this._anchorPos=this._getPosition(this._anchorIdx));let o=this._getSize(this._anchorIdx);o===void 0&&(this._stable=!1,o=this._getAverageSize());const s=this._metricsCache.getMarginSize(this._anchorIdx)??this._metricsCache.averageMarginSize,n=this._metricsCache.getMarginSize(this._anchorIdx+1)??this._metricsCache.averageMarginSize;this._anchorIdx===0&&(this._anchorPos=s),this._anchorIdx===this.items.length-1&&(this._anchorPos=this._scrollSize-n-o);let a=0;for(this._anchorPos+o+n<i&&(a=i-(this._anchorPos+o+n)),this._anchorPos-s>r&&(a=r-(this._anchorPos-s)),a&&(this._scrollPosition-=a,i-=a,r-=a,this._scrollError+=a),t.set(this._anchorIdx,{pos:this._anchorPos,size:o}),this._first=this._last=this._anchorIdx,this._physicalMin=this._anchorPos-s,this._physicalMax=this._anchorPos+o+n;this._physicalMin>i&&this._first>0;){let c=this._getSize(--this._first);c===void 0&&(this._stable=!1,c=this._getAverageSize());let h=this._metricsCache.getMarginSize(this._first);h===void 0&&(this._stable=!1,h=this._metricsCache.averageMarginSize),this._physicalMin-=c;const d=this._physicalMin;if(t.set(this._first,{pos:d,size:c}),this._physicalMin-=h,this._stable===!1&&this._estimate===!1)break}for(;this._physicalMax<r&&this._last<this.items.length-1;){let c=this._getSize(++this._last);c===void 0&&(this._stable=!1,c=this._getAverageSize());let h=this._metricsCache.getMarginSize(this._last);h===void 0&&(this._stable=!1,h=this._metricsCache.averageMarginSize);const d=this._physicalMax;if(t.set(this._last,{pos:d,size:c}),this._physicalMax+=c+h,!this._stable&&!this._estimate)break}const l=this._calculateError();l&&(this._physicalMin-=l,this._physicalMax-=l,this._anchorPos-=l,this._scrollPosition-=l,t.forEach(c=>c.pos-=l),this._scrollError+=l),this._stable&&(this._newPhysicalItems=this._physicalItems,this._newPhysicalItems.clear(),this._physicalItems=t)}_calculateError(){return this._first===0?this._physicalMin:this._physicalMin<=0?this._physicalMin-this._first*this._delta:this._last===this.items.length-1?this._physicalMax-this._scrollSize:this._physicalMax>=this._scrollSize?this._physicalMax-this._scrollSize+(this.items.length-1-this._last)*this._delta:0}_reflow(){const{_first:t,_last:i}=this;super._reflow(),(this._first===-1&&this._last==-1||this._first===t&&this._last===i)&&this._resetReflowState()}_resetReflowState(){this._anchorIdx=null,this._anchorPos=null,this._stable=!0}_updateScrollSize(){const{averageMarginSize:t}=this._metricsCache;this._scrollSize=Math.max(1,this.items.length*(t+this._getAverageSize())+t)}get _delta(){const{averageMarginSize:t}=this._metricsCache;return this._getAverageSize()+t}_getItemPosition(t){return{[this._positionDim]:this._getPosition(t),[this._secondaryPositionDim]:0,[nu(this.direction)]:-(this._metricsCache.getLeadingMarginValue(t,this.direction)??this._metricsCache.averageMarginSize)}}_getItemSize(t){return{[this._sizeDim]:this._getSize(t)||this._getAverageSize(),[this._secondarySizeDim]:this._itemSize[this._secondarySizeDim]}}_viewDim2Changed(){this._metricsCache.clear(),this._scheduleReflow()}}const cu=Object.freeze(Object.defineProperty({__proto__:null,FlowLayout:In,flow:Tn},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lo=(e,t,i)=>{const r=new Map;for(let o=t;o<=i;o++)r.set(e[o],o);return r},hu=ge(class extends Ve{constructor(e){if(super(e),e.type!==rt.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let r;i===void 0?i=t:t!==void 0&&(r=t);const o=[],s=[];let n=0;for(const a of e)o[n]=r?r(a,n):n,s[n]=i(a,n),n++;return{values:s,keys:o}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,r]){const o=Ha(e),{values:s,keys:n}=this.dt(t,i,r);if(!Array.isArray(o))return this.ut=n,s;const a=this.ut??=[],l=[];let c,h,d=0,p=o.length-1,u=0,m=s.length-1;for(;d<=p&&u<=m;)if(o[d]===null)d++;else if(o[p]===null)p--;else if(a[d]===n[u])l[u]=It(o[d],s[u]),d++,u++;else if(a[p]===n[m])l[m]=It(o[p],s[m]),p--,m--;else if(a[d]===n[m])l[m]=It(o[d],s[m]),Ee(e,l[m+1],o[d]),d++,m--;else if(a[p]===n[u])l[u]=It(o[p],s[u]),Ee(e,o[d],o[p]),p--,u++;else if(c===void 0&&(c=Lo(n,u,m),h=Lo(a,d,p)),c.has(a[d]))if(c.has(a[p])){const b=h.get(n[u]),_=b!==void 0?o[b]:null;if(_===null){const v=Ee(e,o[d]);It(v,s[u]),l[u]=v}else l[u]=It(_,s[u]),Ee(e,o[d],_),o[b]=null;u++}else Li(o[p]),p--;else Li(o[d]),d++;for(;u<=m;){const b=Ee(e,l[m+1]);It(b,s[u]),l[u++]=b}for(;d<=p;){const b=o[d++];b!==null&&Li(b)}return this.ut=n,Cs(e,l),q}}),uu="modulepreload",du=function(e){return"/dadmaxxing/"+e},Ro={},fu=function(t,i,r){let o=Promise.resolve();if(i&&i.length>0){let c=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var n=c;document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),l=a?.nonce||a?.getAttribute("nonce");o=c(i.map(h=>{if(h=du(h),h in Ro)return;Ro[h]=!0;const d=h.endsWith(".css"),p=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${p}`))return;const u=document.createElement("link");if(u.rel=d?"stylesheet":uu,d||(u.as="script"),u.crossOrigin="",u.href=h,l&&u.setAttribute("nonce",l),document.head.appendChild(u),d)return new Promise((m,b)=>{u.addEventListener("load",m),u.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return o.then(a=>{for(const l of a||[])l.status==="rejected"&&s(l.reason);return t().catch(s)})};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ki extends Event{constructor(t){super(ki.eventName,{bubbles:!1}),this.first=t.first,this.last=t.last}}ki.eventName="rangeChanged";class Ai extends Event{constructor(t){super(Ai.eventName,{bubbles:!1}),this.first=t.first,this.last=t.last}}Ai.eventName="visibilityChanged";class zi extends Event{constructor(){super(zi.eventName,{bubbles:!1})}}zi.eventName="unpinned";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class pu{constructor(t){this._element=null;const i=t??window;this._node=i,t&&(this._element=t)}get element(){return this._element||document.scrollingElement||document.documentElement}get scrollTop(){return this.element.scrollTop||window.scrollY}get scrollLeft(){return this.element.scrollLeft||window.scrollX}get scrollHeight(){return this.element.scrollHeight}get scrollWidth(){return this.element.scrollWidth}get viewportHeight(){return this._element?this._element.getBoundingClientRect().height:window.innerHeight}get viewportWidth(){return this._element?this._element.getBoundingClientRect().width:window.innerWidth}get maxScrollTop(){return this.scrollHeight-this.viewportHeight}get maxScrollLeft(){return this.scrollWidth-this.viewportWidth}}class mu extends pu{constructor(t,i){super(i),this._clients=new Set,this._retarget=null,this._end=null,this.__destination=null,this.correctingScrollError=!1,this._checkForArrival=this._checkForArrival.bind(this),this._updateManagedScrollTo=this._updateManagedScrollTo.bind(this),this.scrollTo=this.scrollTo.bind(this),this.scrollBy=this.scrollBy.bind(this);const r=this._node;this._originalScrollTo=r.scrollTo,this._originalScrollBy=r.scrollBy,this._originalScroll=r.scroll,this._attach(t)}get _destination(){return this.__destination}get scrolling(){return this._destination!==null}scrollTo(t,i){const r=typeof t=="number"&&typeof i=="number"?{left:t,top:i}:t;this._scrollTo(r)}scrollBy(t,i){const r=typeof t=="number"&&typeof i=="number"?{left:t,top:i}:t;r.top!==void 0&&(r.top+=this.scrollTop),r.left!==void 0&&(r.left+=this.scrollLeft),this._scrollTo(r)}_nativeScrollTo(t){this._originalScrollTo.bind(this._element||window)(t)}_scrollTo(t,i=null,r=null){this._end!==null&&this._end(),t.behavior==="smooth"?(this._setDestination(t),this._retarget=i,this._end=r):this._resetScrollState(),this._nativeScrollTo(t)}_setDestination(t){let{top:i,left:r}=t;return i=i===void 0?void 0:Math.max(0,Math.min(i,this.maxScrollTop)),r=r===void 0?void 0:Math.max(0,Math.min(r,this.maxScrollLeft)),this._destination!==null&&r===this._destination.left&&i===this._destination.top?!1:(this.__destination={top:i,left:r,behavior:"smooth"},!0)}_resetScrollState(){this.__destination=null,this._retarget=null,this._end=null}_updateManagedScrollTo(t){this._destination&&this._setDestination(t)&&this._nativeScrollTo(this._destination)}managedScrollTo(t,i,r){return this._scrollTo(t,i,r),this._updateManagedScrollTo}correctScrollError(t){this.correctingScrollError=!0,requestAnimationFrame(()=>requestAnimationFrame(()=>this.correctingScrollError=!1)),this._nativeScrollTo(t),this._retarget&&this._setDestination(this._retarget()),this._destination&&this._nativeScrollTo(this._destination)}_checkForArrival(){if(this._destination!==null){const{scrollTop:t,scrollLeft:i}=this;let{top:r,left:o}=this._destination;r=Math.min(r||0,this.maxScrollTop),o=Math.min(o||0,this.maxScrollLeft);const s=Math.abs(r-t),n=Math.abs(o-i);s<1&&n<1&&(this._end&&this._end(),this._resetScrollState())}}detach(t){return this._clients.delete(t),this._clients.size===0&&(this._node.scrollTo=this._originalScrollTo,this._node.scrollBy=this._originalScrollBy,this._node.scroll=this._originalScroll,this._node.removeEventListener("scroll",this._checkForArrival)),null}_attach(t){this._clients.add(t),this._clients.size===1&&(this._node.scrollTo=this.scrollTo,this._node.scrollBy=this.scrollBy,this._node.scroll=this.scrollTo,this._node.addEventListener("scroll",this._checkForArrival))}}let To=typeof window<"u"?window.ResizeObserver:void 0;const Dn=Symbol("virtualizerRef"),Ke="virtualizer-sizer";let Io;class gu{constructor(t){if(this._benchmarkStart=null,this._layout=null,this._clippingAncestors=[],this._scrollSize=null,this._scrollError=null,this._childrenPos=null,this._childMeasurements=null,this._toBeMeasured=new Map,this._rangeChanged=!0,this._itemsChanged=!0,this._visibilityChanged=!0,this._scrollerController=null,this._isScroller=!1,this._sizer=null,this._hostElementRO=null,this._childrenRO=null,this._mutationObserver=null,this._scrollEventListeners=[],this._scrollEventListenerOptions={passive:!0},this._loadListener=this._childLoaded.bind(this),this._scrollIntoViewTarget=null,this._updateScrollIntoViewCoordinates=null,this._items=[],this._first=-1,this._last=-1,this._firstVisible=-1,this._lastVisible=-1,this._scheduled=new WeakSet,this._measureCallback=null,this._measureChildOverride=null,this._layoutCompletePromise=null,this._layoutCompleteResolver=null,this._layoutCompleteRejecter=null,this._pendingLayoutComplete=null,this._layoutInitialized=null,this._connected=!1,!t)throw new Error("Virtualizer constructor requires a configuration object");if(t.hostElement)this._init(t);else throw new Error('Virtualizer configuration requires the "hostElement" property')}set items(t){Array.isArray(t)&&t!==this._items&&(this._itemsChanged=!0,this._items=t,this._schedule(this._updateLayout))}_init(t){this._isScroller=!!t.scroller,this._initHostElement(t);const i=t.layout||{};this._layoutInitialized=this._initLayout(i)}_initObservers(){this._mutationObserver=new MutationObserver(this._finishDOMUpdate.bind(this)),this._hostElementRO=new To(()=>this._hostElementSizeChanged()),this._childrenRO=new To(this._childrenSizeChanged.bind(this))}_initHostElement(t){const i=this._hostElement=t.hostElement;this._applyVirtualizerStyles(),i[Dn]=this}connected(){this._initObservers();const t=this._isScroller;this._clippingAncestors=yu(this._hostElement,t),this._scrollerController=new mu(this,this._clippingAncestors[0]),this._schedule(this._updateLayout),this._observeAndListen(),this._connected=!0}_observeAndListen(){this._mutationObserver.observe(this._hostElement,{childList:!0}),this._hostElementRO.observe(this._hostElement),this._scrollEventListeners.push(window),window.addEventListener("scroll",this,this._scrollEventListenerOptions),this._clippingAncestors.forEach(t=>{t.addEventListener("scroll",this,this._scrollEventListenerOptions),this._scrollEventListeners.push(t),this._hostElementRO.observe(t)}),this._hostElementRO.observe(this._scrollerController.element),this._children.forEach(t=>this._childrenRO.observe(t)),this._scrollEventListeners.forEach(t=>t.addEventListener("scroll",this,this._scrollEventListenerOptions))}disconnected(){this._scrollEventListeners.forEach(t=>t.removeEventListener("scroll",this,this._scrollEventListenerOptions)),this._scrollEventListeners=[],this._clippingAncestors=[],this._scrollerController?.detach(this),this._scrollerController=null,this._mutationObserver?.disconnect(),this._mutationObserver=null,this._hostElementRO?.disconnect(),this._hostElementRO=null,this._childrenRO?.disconnect(),this._childrenRO=null,this._rejectLayoutCompletePromise("disconnected"),this._connected=!1}_applyVirtualizerStyles(){const i=this._hostElement.style;i.display=i.display||"block",i.position=i.position||"relative",i.contain=i.contain||"size layout",this._isScroller&&(i.overflow=i.overflow||"auto",i.minHeight=i.minHeight||"150px")}_getSizer(){const t=this._hostElement;if(!this._sizer){let i=t.querySelector(`[${Ke}]`);i||(i=document.createElement("div"),i.setAttribute(Ke,""),t.appendChild(i)),Object.assign(i.style,{position:"absolute",margin:"-2px 0 0 0",padding:0,visibility:"hidden",fontSize:"2px"}),i.textContent="&nbsp;",i.setAttribute(Ke,""),this._sizer=i}return this._sizer}async updateLayoutConfig(t){await this._layoutInitialized;const i=t.type||Io;if(typeof i=="function"&&this._layout instanceof i){const r={...t};return delete r.type,this._layout.config=r,!0}return!1}async _initLayout(t){let i,r;if(typeof t.type=="function"){r=t.type;const o={...t};delete o.type,i=o}else i=t;r===void 0&&(Io=r=(await fu(()=>Promise.resolve().then(()=>cu),void 0)).FlowLayout),this._layout=new r(o=>this._handleLayoutMessage(o),i),this._layout.measureChildren&&typeof this._layout.updateItemSizes=="function"&&(typeof this._layout.measureChildren=="function"&&(this._measureChildOverride=this._layout.measureChildren),this._measureCallback=this._layout.updateItemSizes.bind(this._layout)),this._layout.listenForChildLoadEvents&&this._hostElement.addEventListener("load",this._loadListener,!0),this._schedule(this._updateLayout)}startBenchmarking(){this._benchmarkStart===null&&(this._benchmarkStart=window.performance.now())}stopBenchmarking(){if(this._benchmarkStart!==null){const t=window.performance.now(),i=t-this._benchmarkStart,o=performance.getEntriesByName("uv-virtualizing","measure").filter(s=>s.startTime>=this._benchmarkStart&&s.startTime<t).reduce((s,n)=>s+n.duration,0);return this._benchmarkStart=null,{timeElapsed:i,virtualizationTime:o}}return null}_measureChildren(){const t={},i=this._children,r=this._measureChildOverride||this._measureChild;for(let o=0;o<i.length;o++){const s=i[o],n=this._first+o;(this._itemsChanged||this._toBeMeasured.has(s))&&(t[n]=r.call(this,s,this._items[n]))}this._childMeasurements=t,this._schedule(this._updateLayout),this._toBeMeasured.clear()}_measureChild(t){const{width:i,height:r}=t.getBoundingClientRect();return Object.assign({width:i,height:r},bu(t))}async _schedule(t){this._scheduled.has(t)||(this._scheduled.add(t),await Promise.resolve(),this._scheduled.delete(t),t.call(this))}async _updateDOM(t){this._scrollSize=t.scrollSize,this._adjustRange(t.range),this._childrenPos=t.childPositions,this._scrollError=t.scrollError||null;const{_rangeChanged:i,_itemsChanged:r}=this;this._visibilityChanged&&(this._notifyVisibility(),this._visibilityChanged=!1),(i||r)&&(this._notifyRange(),this._rangeChanged=!1),this._finishDOMUpdate()}_finishDOMUpdate(){this._connected&&(this._children.forEach(t=>this._childrenRO.observe(t)),this._checkScrollIntoViewTarget(this._childrenPos),this._positionChildren(this._childrenPos),this._sizeHostElement(this._scrollSize),this._correctScrollError(),this._benchmarkStart&&"mark"in window.performance&&window.performance.mark("uv-end"))}_updateLayout(){this._layout&&this._connected&&(this._layout.items=this._items,this._updateView(),this._childMeasurements!==null&&(this._measureCallback&&this._measureCallback(this._childMeasurements),this._childMeasurements=null),this._layout.reflowIfNeeded(),this._benchmarkStart&&"mark"in window.performance&&window.performance.mark("uv-end"))}_handleScrollEvent(){if(this._benchmarkStart&&"mark"in window.performance){try{window.performance.measure("uv-virtualizing","uv-start","uv-end")}catch(t){console.warn("Error measuring performance data: ",t)}window.performance.mark("uv-start")}this._scrollerController.correctingScrollError===!1&&this._layout?.unpin(),this._schedule(this._updateLayout)}handleEvent(t){switch(t.type){case"scroll":(t.currentTarget===window||this._clippingAncestors.includes(t.currentTarget))&&this._handleScrollEvent();break;default:console.warn("event not handled",t)}}_handleLayoutMessage(t){t.type==="stateChanged"?this._updateDOM(t):t.type==="visibilityChanged"?(this._firstVisible=t.firstVisible,this._lastVisible=t.lastVisible,this._notifyVisibility()):t.type==="unpinned"&&this._hostElement.dispatchEvent(new zi)}get _children(){const t=[];let i=this._hostElement.firstElementChild;for(;i;)i.hasAttribute(Ke)||t.push(i),i=i.nextElementSibling;return t}_updateView(){const t=this._hostElement,i=this._scrollerController?.element,r=this._layout;if(t&&i&&r){let o,s,n,a;const l=t.getBoundingClientRect();o=0,s=0,n=window.innerHeight,a=window.innerWidth;const c=this._clippingAncestors.map(v=>v.getBoundingClientRect());c.unshift(l);for(const v of c)o=Math.max(o,v.top),s=Math.max(s,v.left),n=Math.min(n,v.bottom),a=Math.min(a,v.right);const h=i.getBoundingClientRect(),d={left:l.left-h.left,top:l.top-h.top},p={width:i.scrollWidth,height:i.scrollHeight},u=o-l.top+t.scrollTop,m=s-l.left+t.scrollLeft,b=Math.max(0,n-o),_=Math.max(0,a-s);r.viewportSize={width:_,height:b},r.viewportScroll={top:u,left:m},r.totalScrollSize=p,r.offsetWithinScroller=d}}_sizeHostElement(t){const r=t&&t.width!==null?Math.min(82e5,t.width):0,o=t&&t.height!==null?Math.min(82e5,t.height):0;if(this._isScroller)this._getSizer().style.transform=`translate(${r}px, ${o}px)`;else{const s=this._hostElement.style;s.minWidth=r?`${r}px`:"100%",s.minHeight=o?`${o}px`:"100%"}}_positionChildren(t){t&&t.forEach(({top:i,left:r,width:o,height:s,xOffset:n,yOffset:a},l)=>{const c=this._children[l-this._first];c&&(c.style.position="absolute",c.style.boxSizing="border-box",c.style.transform=`translate(${r}px, ${i}px)`,o!==void 0&&(c.style.width=o+"px"),s!==void 0&&(c.style.height=s+"px"),c.style.left=n===void 0?null:n+"px",c.style.top=a===void 0?null:a+"px")})}async _adjustRange(t){const{_first:i,_last:r,_firstVisible:o,_lastVisible:s}=this;this._first=t.first,this._last=t.last,this._firstVisible=t.firstVisible,this._lastVisible=t.lastVisible,this._rangeChanged=this._rangeChanged||this._first!==i||this._last!==r,this._visibilityChanged=this._visibilityChanged||this._firstVisible!==o||this._lastVisible!==s}_correctScrollError(){if(this._scrollError){const{scrollTop:t,scrollLeft:i}=this._scrollerController,{top:r,left:o}=this._scrollError;this._scrollError=null,this._scrollerController.correctScrollError({top:t-r,left:i-o})}}element(t){return t===1/0&&(t=this._items.length-1),this._items?.[t]===void 0?void 0:{scrollIntoView:(i={})=>this._scrollElementIntoView({...i,index:t})}}_scrollElementIntoView(t){if(t.index>=this._first&&t.index<=this._last)this._children[t.index-this._first].scrollIntoView(t);else if(t.index=Math.min(t.index,this._items.length-1),t.behavior==="smooth"){const i=this._layout.getScrollIntoViewCoordinates(t),{behavior:r}=t;this._updateScrollIntoViewCoordinates=this._scrollerController.managedScrollTo(Object.assign(i,{behavior:r}),()=>this._layout.getScrollIntoViewCoordinates(t),()=>this._scrollIntoViewTarget=null),this._scrollIntoViewTarget=t}else this._layout.pin=t}_checkScrollIntoViewTarget(t){const{index:i}=this._scrollIntoViewTarget||{};i&&t?.has(i)&&this._updateScrollIntoViewCoordinates(this._layout.getScrollIntoViewCoordinates(this._scrollIntoViewTarget))}_notifyRange(){this._hostElement.dispatchEvent(new ki({first:this._first,last:this._last}))}_notifyVisibility(){this._hostElement.dispatchEvent(new Ai({first:this._firstVisible,last:this._lastVisible}))}get layoutComplete(){return this._layoutCompletePromise||(this._layoutCompletePromise=new Promise((t,i)=>{this._layoutCompleteResolver=t,this._layoutCompleteRejecter=i})),this._layoutCompletePromise}_rejectLayoutCompletePromise(t){this._layoutCompleteRejecter!==null&&this._layoutCompleteRejecter(t),this._resetLayoutCompleteState()}_scheduleLayoutComplete(){this._layoutCompletePromise&&this._pendingLayoutComplete===null&&(this._pendingLayoutComplete=requestAnimationFrame(()=>requestAnimationFrame(()=>this._resolveLayoutCompletePromise())))}_resolveLayoutCompletePromise(){this._layoutCompleteResolver!==null&&this._layoutCompleteResolver(),this._resetLayoutCompleteState()}_resetLayoutCompleteState(){this._layoutCompletePromise=null,this._layoutCompleteResolver=null,this._layoutCompleteRejecter=null,this._pendingLayoutComplete=null}_hostElementSizeChanged(){this._schedule(this._updateLayout)}_childLoaded(){}_childrenSizeChanged(t){if(this._layout?.measureChildren){for(const i of t)this._toBeMeasured.set(i.target,i.contentRect);this._measureChildren()}this._scheduleLayoutComplete(),this._itemsChanged=!1,this._rangeChanged=!1}}function bu(e){const t=window.getComputedStyle(e);return{marginTop:Ye(t.marginTop),marginRight:Ye(t.marginRight),marginBottom:Ye(t.marginBottom),marginLeft:Ye(t.marginLeft)}}function Ye(e){const t=e?parseFloat(e):NaN;return Number.isNaN(t)?0:t}function Do(e){if(e.assignedSlot!==null)return e.assignedSlot;if(e.parentElement!==null)return e.parentElement;const t=e.parentNode;return t&&t.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&t.host||null}function vu(e,t=!1){const i=[];let r=t?e:Do(e);for(;r!==null;)i.push(r),r=Do(r);return i}function yu(e,t=!1){let i=!1;return vu(e,t).filter(r=>{if(i)return!1;const o=getComputedStyle(r);return i=o.position==="fixed",o.overflow!=="visible"})}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _u=e=>e,wu=(e,t)=>k`${t}: ${JSON.stringify(e,null,2)}`;class xu extends Ns{constructor(t){if(super(t),this._virtualizer=null,this._first=0,this._last=-1,this._renderItem=(i,r)=>wu(i,r+this._first),this._keyFunction=(i,r)=>_u(i,r+this._first),this._items=[],t.type!==rt.CHILD)throw new Error("The virtualize directive can only be used in child expressions")}render(t){t&&this._setFunctions(t);const i=[];if(this._first>=0&&this._last>=this._first)for(let r=this._first;r<=this._last;r++)i.push(this._items[r]);return hu(i,this._keyFunction,this._renderItem)}update(t,[i]){this._setFunctions(i);const r=this._items!==i.items;return this._items=i.items||[],this._virtualizer?this._updateVirtualizerConfig(t,i):this._initialize(t,i),r?q:this.render()}async _updateVirtualizerConfig(t,i){if(!await this._virtualizer.updateLayoutConfig(i.layout||{})){const o=t.parentNode;this._makeVirtualizer(o,i)}this._virtualizer.items=this._items}_setFunctions(t){const{renderItem:i,keyFunction:r}=t;i&&(this._renderItem=(o,s)=>i(o,s+this._first)),r&&(this._keyFunction=(o,s)=>r(o,s+this._first))}_makeVirtualizer(t,i){this._virtualizer&&this._virtualizer.disconnected();const{layout:r,scroller:o,items:s}=i;this._virtualizer=new gu({hostElement:t,layout:r,scroller:o}),this._virtualizer.items=s,this._virtualizer.connected()}_initialize(t,i){const r=t.parentNode;r&&r.nodeType===1&&(r.addEventListener("rangeChanged",o=>{this._first=o.first,this._last=o.last,this.setValue(this.render())}),this._makeVirtualizer(r,i))}disconnected(){this._virtualizer?.disconnected()}reconnected(){this._virtualizer?.connected()}}const $u=ge(xu);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class rr extends Ve{constructor(t){if(super(t),this.it=M,t.type!==rt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===M||t==null)return this._t=void 0,this.it=t;if(t===q)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const i=[t];return i.raw=i,this._t={_$litType$:this.constructor.resultType,strings:i,values:[]}}}rr.directiveName="unsafeHTML",rr.resultType=1;const Vn=ge(rr);function Su(e){return new j(t=>{const i=new MutationObserver(()=>t.next());return i.observe(e,{childList:!0,subtree:!0}),()=>i.disconnect()})}var Cu=Object.defineProperty,Eu=Object.getOwnPropertyDescriptor,Bn=e=>{throw TypeError(e)},Lt=(e,t,i,r)=>{for(var o=r>1?void 0:r?Eu(t,i):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(o=(r?n(t,i,o):n(o))||o);return r&&o&&Cu(t,i,o),o},ku=(e,t,i)=>t.has(e)||Bn("Cannot "+i),Au=(e,t,i)=>t.has(e)?Bn("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),ei=(e,t,i)=>(ku(e,t,"access private method"),i),Vo,re,or,Nn,jn;let di=class extends Fe{constructor(){super(...arguments),this.body=""}render(){return k` <section>${Vn(this.body)}</section> `}};Lt([g()],di.prototype,"body",2);Lt([Mt(e=>Su(e).pipe(Rr(()=>{const t=[...e.querySelectorAll("figure")].flatMap(i=>{const r=parseFloat(i.getAttribute("data-orig-height")??""),o=parseFloat(i.getAttribute("data-orig-width")??"");return[...i.querySelectorAll("img"),...i.querySelectorAll("video")].map(n=>({media:n,h:r,w:o}))});for(const{media:i,h:r,w:o}of t){if(isNaN(r)||isNaN(o)){console.warn("failed to set img/video aspect ratio");continue}i.style.aspectRatio=`${o} / ${r}`}})))],di.prototype,"node",2);di=Lt([De("app-post-body")],di);let pe=class extends(Vo=Fe,Vo){constructor(){super(...arguments),Au(this,re),this.tags=[]}scrollToPost(e){const t=ei(this,re,or).call(this).findIndex(i=>i.id===e);this[Dn]?.element(t)?.scrollIntoView()}render(){const e=ei(this,re,or).call(this);return e.length<1&&Array.isArray(this.posts)?k` <div class="empty">(⁎˃ᆺ˂) 404</div> `:$u({layout:Tn({direction:"vertical"}),items:e,keyFunction:t=>t.id,renderItem:t=>ei(this,re,Nn).call(this,t)})}};re=new WeakSet;or=function(){return this.posts?this.posts.filter(e=>e.tags.some(t=>this.tags.includes(t))):[]};Nn=function(e){const t=new Date(e.date),i=`${location.origin}${location.pathname}#${e.id}`;return k`
      <div class="card-container">
        <sl-card id=${e.id} tabindex="0">
          <div slot="header">
            <sl-format-date
              month="long"
              day="numeric"
              year="numeric"
              date=${t.toISOString()}
            ></sl-format-date>
            <a href=${`#${e.id}`}>
              <sl-copy-button value=${i}></sl-copy-button>
            </a>
          </div>
          <slot>
            <app-post-body body=${e.body}></app-post-body>
          </slot>
          <div slot="footer">
            ${e.tags.map(r=>ei(this,re,jn).call(this,r))}
          </div>
        </sl-card>
      </div>
    `};jn=function(e){const t=`/dadmaxxing/${e}`,i=`#${e}`;return k`
      <a href=${t}>
        <sl-tag pill>${i}</sl-tag>
      </a>
    `};Lt([_e({context:Ei})],pe.prototype,"blog",2);Lt([_e({context:Vr})],pe.prototype,"router",2);Lt([Mt(e=>e.blog.posts$)],pe.prototype,"posts",2);Lt([g()],pe.prototype,"tags",2);pe=Lt([De("app-post-list")],pe);var zu=Object.defineProperty,Pu=Object.getOwnPropertyDescriptor,we=(e,t,i,r)=>{for(var o=r>1?void 0:r?Pu(t,i):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(o=(r?n(t,i,o):n(o))||o);return r&&o&&zu(t,i,o),o};let Wt=class extends Fe{constructor(){super(...arguments),this.list=ac(),this.router=new Qh(this,[{path:"/dadmaxxing{/}?",render:()=>k`
        <app-post-list ${Jt(this.list)} tags=${jh}></app-post-list>
      `},{path:"/dadmaxxing/family{/}?",render:()=>k`
        <app-post-list ${Jt(this.list)} tags=${["family"]}></app-post-list>
      `},{path:"/dadmaxxing/climbing{/}?",render:()=>k`
        <app-post-list ${Jt(this.list)} tags=${["climbing"]}></app-post-list>
      `},{path:"/dadmaxxing/gaming{/}?",render:()=>k`
        <app-post-list ${Jt(this.list)} tags=${["gaming"]}></app-post-list>
      `},{path:"/dadmaxxing/anime{/}?",render:()=>k`
        <app-post-list ${Jt(this.list)} tags=${["anime"]}></app-post-list>
      `},{path:"/dadmaxxing/*",render:()=>k`
        <app-post-list ${Jt(this.list)} tags=${[]}></app-post-list>
      `}]),this.theme=new ru,this.blog=new Yh}render(){return k`
      <main>
        <div>
          <app-header></app-header>
          ${this.router.outlet()}
        </div>
        <app-footer></app-footer>
      </main>
    `}};we([Pr({context:Vr})],Wt.prototype,"router",2);we([Pr({context:Mn})],Wt.prototype,"theme",2);we([Pr({context:Ei})],Wt.prototype,"blog",2);we([Mt(e=>e.blog.meta$.pipe(Rr(t=>{document.title=t.title,_s(k`<link rel="icon" type="image/png" href=${t.avatar}></link>`,document.head)})))],Wt.prototype,"meta",2);we([Mt(e=>e.router.pathname$.pipe(ih(()=>Kh()),Rr(()=>{const t=location.hash.replace(/^#/,"");e.list.value?.scrollToPost(t)})))],Wt.prototype,"fragmentScroll",2);Wt=we([De("app-root")],Wt);var Ou=Object.defineProperty,Mu=Object.getOwnPropertyDescriptor,Br=(e,t,i,r)=>{for(var o=r>1?void 0:r?Mu(t,i):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(o=(r?n(t,i,o):n(o))||o);return r&&o&&Ou(t,i,o),o};let fi=class extends Fe{render(){const e=this.meta?.updated??0,t=new Date(e*1e3).toISOString();return k`
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
          <sl-button @click=${()=>window.scrollTo(0,0)}>scroll up</sl-button>
        </div>
      </footer>
    `}};Br([_e({context:Ei})],fi.prototype,"blog",2);Br([Mt(e=>e.blog.meta$)],fi.prototype,"meta",2);fi=Br([De("app-footer")],fi);var Lu=Object.defineProperty,Ru=Object.getOwnPropertyDescriptor,Xt=(e,t,i,r)=>{for(var o=r>1?void 0:r?Ru(t,i):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(o=(r?n(t,i,o):n(o))||o);return r&&o&&Lu(t,i,o),o};const Tu=[{label:"Home",href:"/dadmaxxing"},{label:"Family",href:"/dadmaxxing/family"},{label:"Climbing",href:"/dadmaxxing/climbing"},{label:"Gaming",href:"/dadmaxxing/gaming"},{label:"Anime",href:"/dadmaxxing/anime"},{label:"Source",href:"https://github.com/defevan/dadmaxxing"}];let At=class extends Fe{render(){const e=this.meta?k`<p>${this.meta.description}</p>`:k`<p>${Vn("&nbsp;")}</p>`;return k`
      <header>
        <div>
          <h1>${this.meta?.title??"..."}</h1>
          ${e}
        </div>
        <div>
          <nav>${Tu.map(t=>this.renderLink(t))}</nav>
          <div class="switch-container">
            <sl-switch
              ?checked=${this.activeTheme==="dark"}
              @sl-change=${()=>this.theme.toggle()}
              >dark mode</sl-switch
            >
          </div>
        </div>
      </header>
    `}renderLink({href:e,label:t}){if(e.includes("https://"))return k`<a href=${e}>${t}</a>`;const i=this.pathname===e;return k`<a href=${e} ?active=${i}>${t}</a>`}};Xt([_e({context:Ei})],At.prototype,"blog",2);Xt([_e({context:Vr})],At.prototype,"router",2);Xt([_e({context:Mn})],At.prototype,"theme",2);Xt([Mt(e=>e.blog.meta$)],At.prototype,"meta",2);Xt([Mt(e=>e.router.pathname$)],At.prototype,"pathname",2);Xt([Mt(e=>e.theme.theme$)],At.prototype,"activeTheme",2);At=Xt([De("app-header")],At);
