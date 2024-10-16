var F=Object.defineProperty;var M=(e,t,n)=>t in e?F(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var A=(e,t,n)=>M(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();function v(){}function R(e){return e()}function S(){return Object.create(null)}function x(e){e.forEach(R)}function U(e){return typeof e=="function"}function z(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function V(e){return Object.keys(e).length===0}function p(e,t){e.appendChild(t)}function D(e,t,n){e.insertBefore(t,n||null)}function q(e){e.parentNode&&e.parentNode.removeChild(e)}function b(e){return document.createElement(e)}function B(e){return document.createTextNode(e)}function E(){return B(" ")}function N(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function g(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function H(e){return Array.from(e.childNodes)}function K(e,t){t=""+t,e.data!==t&&(e.data=t)}let C;function w(e){C=e}const y=[],O=[];let $=[];const j=[],T=Promise.resolve();let P=!1;function G(){P||(P=!0,T.then(I))}function k(e){$.push(e)}const L=new Set;let m=0;function I(){if(m!==0)return;const e=C;do{try{for(;m<y.length;){const t=y[m];m++,w(t),J(t.$$)}}catch(t){throw y.length=0,m=0,t}for(w(null),y.length=0,m=0;O.length;)O.pop()();for(let t=0;t<$.length;t+=1){const n=$[t];L.has(n)||(L.add(n),n())}$.length=0}while(y.length);for(;j.length;)j.pop()();P=!1,L.clear(),w(e)}function J(e){if(e.fragment!==null){e.update(),x(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(k)}}function Q(e){const t=[],n=[];$.forEach(o=>e.indexOf(o)===-1?t.push(o):n.push(o)),n.forEach(o=>o()),$=t}const W=new Set;function X(e,t){e&&e.i&&(W.delete(e),e.i(t))}function Y(e,t,n){const{fragment:o,after_update:r}=e.$$;o&&o.m(t,n),k(()=>{const i=e.$$.on_mount.map(R).filter(U);e.$$.on_destroy?e.$$.on_destroy.push(...i):x(i),e.$$.on_mount=[]}),r.forEach(k)}function Z(e,t){const n=e.$$;n.fragment!==null&&(Q(n.after_update),x(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ee(e,t){e.$$.dirty[0]===-1&&(y.push(e),G(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function te(e,t,n,o,r,i,s=null,f=[-1]){const l=C;w(e);const c=e.$$={fragment:null,ctx:[],props:i,update:v,not_equal:r,bound:S(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(l?l.$$.context:[])),callbacks:S(),dirty:f,skip_bound:!1,root:t.target||l.$$.root};s&&s(c.root);let a=!1;if(c.ctx=n?n(e,t.props||{},(u,_,...d)=>{const h=d.length?d[0]:_;return c.ctx&&r(c.ctx[u],c.ctx[u]=h)&&(!c.skip_bound&&c.bound[u]&&c.bound[u](h),a&&ee(e,u)),_}):[],c.update(),a=!0,x(c.before_update),c.fragment=o?o(c.ctx):!1,t.target){if(t.hydrate){const u=H(t.target);c.fragment&&c.fragment.l(u),u.forEach(q)}else c.fragment&&c.fragment.c();t.intro&&X(e.$$.fragment),Y(e,t.target,t.anchor),I()}w(l)}class ne{constructor(){A(this,"$$");A(this,"$$set")}$destroy(){Z(this,1),this.$destroy=v}$on(t,n){if(!U(n))return v;const o=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return o.push(n),()=>{const r=o.indexOf(n);r!==-1&&o.splice(r,1)}}$set(t){this.$$set&&!V(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const re="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(re);function oe(e){let t,n,o,r,i,s,f=e[1]?"Pause":"Play",l,c,a,u,_;return{c(){t=b("main"),n=b("h1"),n.textContent="Music Visualizer",o=E(),r=b("input"),i=E(),s=b("button"),l=B(f),c=E(),a=b("canvas"),g(r,"type","file"),g(r,"accept","audio/*"),g(s,"class","svelte-btpcvp"),g(a,"width","800"),g(a,"height","400"),g(a,"class","svelte-btpcvp"),g(t,"class","svelte-btpcvp")},m(d,h){D(d,t,h),p(t,n),p(t,o),p(t,r),e[4](r),p(t,i),p(t,s),p(s,l),p(t,c),p(t,a),u||(_=[N(r,"change",e[3]),N(s,"click",e[2])],u=!0)},p(d,[h]){h&2&&f!==(f=d[1]?"Pause":"Play")&&K(l,f)},i:v,o:v,d(d){d&&q(t),e[4](null),u=!1,x(_)}}}function ie(e){const t=document.querySelector("canvas"),n=t.getContext("2d"),o=e.frequencyBinCount,r=new Uint8Array(o);function i(){requestAnimationFrame(i),e.getByteFrequencyData(r),n.clearRect(0,0,t.width,t.height),r.forEach((s,f)=>{const l=s/2;n.fillStyle="hsl("+f/o*360+", 100%, 50%)",n.fillRect(f*3,t.height-l,2,l)})}i()}function ce(e,t,n){let o,r,i,s=!1;function f(){s?r.pause():(o.resume(),r.play()),n(1,s=!s)}function l(a){const u=a.target.files[0],_=URL.createObjectURL(u);r=new Audio(_),o=new(window.AudioContext||window.webkitAudioContext);const d=o.createMediaElementSource(r),h=o.createAnalyser();d.connect(h),h.connect(o.destination),ie(h)}function c(a){O[a?"unshift":"push"](()=>{i=a,n(0,i)})}return[i,s,f,l,c]}class se extends ne{constructor(t){super(),te(this,t,ce,oe,z,{})}}new se({target:document.getElementById("app")});