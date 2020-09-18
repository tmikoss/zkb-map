(this["webpackJsonpzkb-map"]=this["webpackJsonpzkb-map"]||[]).push([[0],{128:function(e,t,n){e.exports=n.p+"static/media/glow.3b6b0c75.png"},144:function(e,t,n){e.exports=n(262)},262:function(e,t,n){"use strict";n.r(t);var r,a=n(1),c=n.n(a),o=n(40),i=n.n(o),u=n(23),l=n(17),s=n(124),f=n(8),m={background:"#060606",colorMaxSec:"#66A0BC",colorMinSec:"#a1a1a1",flare:"#E60000",text:"#E6E6E6",unit:32,gapSize:8,regionFontSize:8},d=n(0),b=function(e){return{positions:new Float32Array(3*e),colors:new Float32Array(3*e),scales:new Float32Array(e)}},v=function(e,t,n,r){e.setAttribute("position",new d.BufferAttribute(t,3)),e.setAttribute("flareColor",new d.BufferAttribute(n,3)),e.setAttribute("size",new d.BufferAttribute(r,1)),e.attributes.position.needsUpdate=!0,e.attributes.flareColor.needsUpdate=!0,e.attributes.size.needsUpdate=!0},p=new d.Vector3,h=function(e,t,n){var r=e.x,a=e.y,c=e.z;p.x=r,p.y=a,p.z=c,p.toArray(t,3*n)},g=n(128),j=n.n(g),O=(new d.TextureLoader).load(j.a),E={color:{value:new d.Color},pointTexture:{value:O}},y=Object(a.forwardRef)((function(e,t){return c.a.createElement("points",Object.assign({ref:t},e),c.a.createElement("bufferGeometry",{attach:"geometry"}),c.a.createElement("shaderMaterial",{uniforms:E,vertexShader:"\n  attribute float size;\n  attribute vec3 flareColor;\n\n  varying vec3 vColor;\n\n  void main() {\n    vColor = flareColor;\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    gl_PointSize = size * (300.0 / -mvPosition.z);\n    gl_Position = projectionMatrix * mvPosition;\n  }\n",fragmentShader:"\n  uniform vec3 color;\n  uniform sampler2D pointTexture;\n\n  varying vec3 vColor;\n\n  void main() {\n    gl_FragColor = vec4(color * vColor, 1.0);\n    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );\n  }\n",blending:d.AdditiveBlending,depthTest:!1,transparent:!0,attach:"material"}))})),k=n(9),x=n(10),w=n(42),C=n(29),S=n(129),z=n.n(S),M=n(28),A=n(141),I=Object(M.a)((function(e){return{connected:!1,pingReceived:void 0,receivePing:function(){return e({connected:!0,pingReceived:new Date})},checkConnection:function(){return e((function(e){var t=e.pingReceived;return{connected:!!t&&Object(C.a)(new Date,t)<15e3}}))}}})),T=n(95),R=n.n(T),_=function(e,t){var n=t.scaledValue,r=t.receivedAt;return Object(C.a)(e,r)<45e3*n},B=function(e){return JSON.stringify({action:"sub",channel:e})},F=Object(M.a)((function(e){return{killmails:{},focused:void 0,receiveKillmail:function(t){e((function(e){return{killmails:Object(w.a)({},e.killmails,Object(x.a)({},t.id,t))}}))},trimKillmails:function(){var t=_.bind(void 0,new Date);e((function(e){var n=z()(e.killmails,t),r={killmails:n};return e.focused&&!n[e.focused.id]&&(r.focused=void 0),r}))},focus:function(t){e((function(e){return{focused:e.killmails[t]}}))},unfocus:function(t){e((function(e){return e.focused&&e.focused.id===t?{focused:void 0}:{}}))}}})),V=function(e){var t=I(Object(a.useCallback)((function(e){return e.receivePing}),[])),n=F(Object(a.useCallback)((function(e){return e.trimKillmails}),[])),r=F(Object(a.useCallback)((function(e){return e.receiveKillmail}),[])),c=Object(a.useState)(R()(e)),o=Object(k.a)(c,2),i=o[0],u=o[1];Object(a.useEffect)((function(){var e=setInterval(n,5e3);return function(){return clearInterval(e)}}),[n]),Object(a.useEffect)((function(){var n=new WebSocket(e);return n.onopen=function(){n.send(B("killstream")),n.send(B("public"))},n.onmessage=function(e){var n=JSON.parse(e.data);"killmail_id"in n?r(function(e){var t=e.killmail_id,n=e.killmail_time,r=e.victim,a=e.solar_system_id,c=e.zkb,o=r.character_id,i=r.corporation_id,u=r.alliance_id,l=r.ship_type_id,s=c.url,f=c.totalValue;return{id:t,time:Object(A.a)(n),receivedAt:new Date,characterId:o,corporationId:i,allianceId:u,shipTypeId:l,solarSystemId:a,url:s,totalValue:f,scaledValue:U(f)}}(n)):"tqStatus"in n?t():console.error(n)},n.onclose=function(t){1e3!==t.code&&setTimeout((function(){u(R()(e))}),5e3)},function(){return n.close(1e3)}}),[e,r,t,i])},D=function(e,t){return t*function(e,t){if(e<500)return d.MathUtils.smoothstep(e,0,500);var n=45e3*t,r=d.MathUtils.smoothstep(e,500,n)-1;return Math.pow(r,4)}(e,t)},U=function(e){var t=d.MathUtils.clamp(e,1e4,2e10);return d.MathUtils.mapLinear(t,1e4,2e10,1,10)},P=function(){var e=Object(f.g)().size,t=e.height,n=e.width;return Math.min(t,n)},L=function(e){var t=e.solarSystems,n=Object(a.useRef)(null),r=Object(a.useRef)(0),o=Object(a.useContext)(l.a),i=P();return Object(f.e)((function(e,a){if(r.current=(r.current+a)%36e5,n.current){for(var c=new d.Color(o.colorMaxSec),u=Object.values(t),l=u.length,s=i/70,f=b(l),m=f.positions,p=f.colors,g=f.scales,j=0;j<l;j++){var O=u[j];h(O,m,j);var E=d.MathUtils.clamp(2*Math.sin(.75*(r.current+j))-1,0,1);new d.Color(o.colorMinSec).lerp(c,O.security).addScalar(E).toArray(p,3*j),g[j]=s*O.radius}v(n.current.geometry,m,p,g)}})),c.a.createElement(y,{ref:n})},N=function(e){var t=e.solarSystems,n=e.killmails,r=Object(a.useRef)(null),o=Object(a.useContext)(l.a),i=P();return Object(f.e)((function(){if(n.current&&r.current){for(var e=n.current.length,a=new Date,c=i/8,u=new d.Color(o.flare),l=b(e),s=l.positions,f=l.colors,m=l.scales,p=0;p<n.current.length;p++){var g=n.current[p],j=g.receivedAt,O=g.solarSystemId,E=g.scaledValue,y=t[O]||{},k=Object(C.a)(a,j);m[p]=c*D(k,E),h(y,s,p),u.toArray(f,3*p)}v(r.current.geometry,s,f,m)}})),c.a.createElement(y,{ref:r})},G=n(80);!function(e){e[e.full=0]="full",e[e.follow=1]="follow"}(r||(r={}));var J=Object(M.a)((function(e){return{cameraMode:r.full,extendedTicker:!0,setCameraMode:function(t){return e({cameraMode:t})},toggleExtendedTicker:function(){return e((function(e){return{extendedTicker:!e.extendedTicker}}))}}})),K=n(56),q=n.n(K),X=Object(M.a)((function(e){return{systems:{},regions:{},loaded:!1,receive:function(t){var n=q()(t.regions,(function(e,t,n){var r=t.x,a=t.y,c=t.z,o=t.n;return e[n]={id:parseInt(n),x:r,y:c,z:a,name:o},e}),{}),r=q()(t.systems,(function(e,t,r){var a,c=t.x,o=t.y,i=t.z,u=t.n,l=t.r,s=t.s,f=t.p;return e[r]={id:parseInt(r),x:c,y:i,z:o,name:u,radius:d.MathUtils.clamp(100*l,.5,1.5),security:s,regionId:f,regionName:null===(a=n[f])||void 0===a?void 0:a.name},e}),{});e({regions:n,systems:r,loaded:!0})}}})),Y=function(e){return e.loaded},W=function(e){return e.receive};function H(){var e=Object(u.a)(["\n  grid-area: ",";\n  text-decoration: none;\n\n  > img {\n    border-radius: ","px;\n  }\n"]);return H=function(){return e},e}function Q(){var e=Object(u.a)(['\n  display: grid;\n  grid-template-areas: "ship character corporation alliance";\n  grid-auto-columns: ',"px;\n  grid-auto-rows: ","px;\n  gap: ","px;\n  padding-bottom: ","px;\n"]);return Q=function(){return e},e}function Z(){var e=Object(u.a)(["\n  overflow: hidden;\n  max-height: calc(100vh - ","px);\n  display: flex;\n  flex-flow: column;\n"]);return Z=function(){return e},e}var $=l.e.div(Z(),(function(e){return e.theme.unit})),ee=Object(l.e)(G.a.div)(Q(),(function(e){return e.theme.unit}),(function(e){return e.theme.unit}),(function(e){return e.theme.gapSize}),(function(e){return e.theme.gapSize})),te=l.e.a(H(),(function(e){return e.area}),(function(e){return e.theme.gapSize/2})),ne=function(e){var t=e.src,n=e.area,r=e.href,a=e.height,o=e.size;return c.a.createElement(te,{href:r,area:n,target:"_blank"},c.a.createElement(G.a.img,{src:"".concat(t,"?size=").concat(o),style:{height:a,width:o},alt:""}))},re=Object(a.memo)((function(e){var t=e.killmail,n=Object(a.useContext)(l.a).unit,r=t.id,o=t.characterId,i=t.corporationId,u=t.allianceId,s=t.shipTypeId,f=t.url,m=t.receivedAt,b=t.scaledValue,v=Object(G.b)((function(){return{opacity:0,height:0,paddingBottom:0}})),p=Object(k.a)(v,2),h=p[0],g=h.height,j=h.paddingBottom,O=h.opacity,E=p[1],y=Object(a.useRef)(!1),x=Object(a.useRef)(!0);Object(a.useEffect)((function(){return F.subscribe((function(e){y.current=!!e.focused&&e.focused.id===r}))})),Object(a.useEffect)((function(){var e=function(){var e,t=Object(C.a)(new Date,m),r=n,a=n/8,c=1e3;if(t<500)e=1,c=250;else{var o=D(t,b);o>.1?e=y.current?1:d.MathUtils.clamp(o,0,1):(e=0,r=0,a=0,c=250)}x.current=e>0,E({opacity:e,height:r,paddingBottom:a,config:{duration:c}})},t=setInterval(e,1e3);return e(),function(){return clearInterval(t)}}),[E,m,b,n]);var w=F(Object(a.useCallback)((function(e){return e.focus}),[])),S=F(Object(a.useCallback)((function(e){return e.unfocus}),[])),z=J(Object(a.useCallback)((function(e){return e.extendedTicker}),[])),M=Object(a.useCallback)((function(){E({opacity:1,config:{duration:50}}),x.current&&w(r)}),[w,r,E]),A=Object(a.useCallback)((function(){return S(r)}),[S,r]);return c.a.createElement(ee,{style:{opacity:O,paddingBottom:j,gridAutoRows:g},onMouseEnter:M,onMouseLeave:A},c.a.createElement(ne,{src:"https://images.evetech.net/types/".concat(s,"/render"),area:"ship",height:g,href:f,size:n}),z&&o&&c.a.createElement(ne,{src:"https://images.evetech.net/characters/".concat(o,"/portrait"),area:"character",height:g,href:"https://zkillboard.com/character/".concat(o,"/"),size:n}),z&&i&&c.a.createElement(ne,{src:"https://images.evetech.net/corporations/".concat(i,"/logo"),area:"corporation",height:g,href:"https://zkillboard.com/corporation/".concat(i,"/"),size:n}),z&&u&&c.a.createElement(ne,{src:"https://images.evetech.net/alliances/".concat(u,"/logo"),area:"alliance",height:g,href:"https://zkillboard.com/alliance/".concat(u,"/"),size:n}))})),ae=function(e){var t=e.killmails.map((function(e){return c.a.createElement(re,{killmail:e,key:e.id})}));return c.a.createElement($,null,t)},ce=n(41);n(36),n(134);function oe(){var e=Object(u.a)(["\n  color: ",";\n  display: flex;\n  flex-flow: column;\n  gap: 1vh;\n"]);return oe=function(){return e},e}l.e.div(oe(),(function(e){return e.theme.text})),(new Date).getTime();var ie,ue,le,se=n(32),fe=n(59);function me(){var e=Object(u.a)(["\n  color: ",";\n  background: transparent;\n  border: none;\n  grid-area: ",";\n  cursor: ",";\n  outline: none;\n"]);return me=function(){return e},e}function de(){var e=Object(u.a)(["\n  color: ",';\n  display: grid;\n  grid-template-areas: "fullscreen connection camera sidebar";\n  grid-auto-columns: ',"px;\n  grid-auto-rows: ","px;\n  gap: ","px;\n  direction: rtl;\n"]);return de=function(){return e},e}var be=l.e.div(de(),(function(e){return e.theme.text}),(function(e){return e.theme.unit}),(function(e){return e.theme.unit}),(function(e){return e.theme.gapSize})),ve=l.e.button(me(),(function(e){return e.theme.text}),(function(e){return e.area}),(function(e){return e.onClick?"pointer":"default"})),pe=function(e){var t=e.enabled,n=Object(se.a)(e,["enabled"]);return c.a.createElement("span",{className:"fa-layers fa-fw"},c.a.createElement(fe.a,n),!t&&c.a.createElement(fe.a,{icon:"slash"}))},he=function(){var e=Object(a.useState)(!1),t=Object(k.a)(e,2),n=t[0],r=t[1];Object(a.useEffect)((function(){var e=function(){return r(!!document.fullscreenElement)};return document.addEventListener("fullscreenchange",e),function(){return document.removeEventListener("fullscreenchange",e)}}),[r]);return c.a.createElement(ve,{type:"button",title:n?"Exit fullscreen":"Go fullscreen",onClick:function(){var e;n?document.exitFullscreen():null===(e=document.getElementById("root"))||void 0===e||e.requestFullscreen()},area:"fullscreen"},c.a.createElement(fe.a,{icon:n?"compress-arrows-alt":"expand-arrows-alt"}))},ge=function(){var e=I(Object(a.useCallback)((function(e){return e.connected}),[]));return c.a.createElement(ve,{type:"button",title:e?"Connected to live feed":"Disconnected from live feed!",area:"connection"},c.a.createElement(pe,{icon:"wifi",enabled:e}))},je=(ie={},Object(x.a)(ie,r.full,"globe"),Object(x.a)(ie,r.follow,"video"),ie),Oe=(ue={},Object(x.a)(ue,r.full,r.follow),Object(x.a)(ue,r.follow,r.full),ue),Ee=(le={},Object(x.a)(le,r.full,"Camera: whole map"),Object(x.a)(le,r.follow,"Camera: follow the action"),le),ye=function(){var e=J(Object(a.useCallback)((function(e){return e.cameraMode}),[])),t=J(Object(a.useCallback)((function(e){return e.setCameraMode}),[]));return c.a.createElement(ve,{type:"button",title:Ee[e],onClick:function(){t(Oe[e])},area:"camera"},c.a.createElement(fe.a,{icon:je[e]}))},ke=function(){var e=J(Object(a.useCallback)((function(e){return e.extendedTicker}),[])),t=J(Object(a.useCallback)((function(e){return e.toggleExtendedTicker}),[]));return c.a.createElement(ve,{type:"button",title:e?"Sidebar: full information":"Sidebar: only the ship",onClick:t,area:"sidebar"},c.a.createElement(pe,{icon:"list",enabled:e}))},xe=function(){return c.a.createElement(be,null,c.a.createElement(he,null),c.a.createElement(ge,null),c.a.createElement(ye,null),c.a.createElement(ke,null))},we=new d.Vector3(0,0,700),Ce=we.z/3,Se=c.a.memo((function(e){var t=e.solarSystems,n=e.killmails,o=J(Object(a.useCallback)((function(e){return e.cameraMode}),[])),i=Object(a.useRef)(),u=Object(a.useRef)(we);return Object(a.useEffect)((function(){var e=Object.values(t);e.length>0&&(u.current=function(e){for(var t=e.length,n=new Float32Array(3*t),r=0;r<t;r++)h(e[r],n,r);var a=new d.BufferGeometry;if(a.setAttribute("position",new d.BufferAttribute(n,3)),a.computeBoundingSphere(),a.boundingSphere){var c=a.boundingSphere,o=c.center,i=c.radius;return o.z+=Math.max(i,Ce),o}return we}(e),i.current&&i.current.position.lerp(u.current,1))}),[t]),Object(f.e)((function(){if(i.current&&u.current){var e,a,c=(null===(e=n.current)||void 0===e?void 0:e.length)||0;if(c>0&&o===r.follow){for(var l=new Date,s=-1/0,f=-1/0,m=-1/0,b=1/0,v=1/0,p=1/0,h=0,g=0,j=0,O=0,E=0;E<c;E++){var y=n.current[E],k=y.solarSystemId,x=y.scaledValue,w=y.receivedAt,S=t[k],z=S.x,M=S.y,A=S.z,I=Object(C.a)(l,w),T=D(I,x);if(T>.1){var R=T*z,_=T*M,B=T*A;s=Math.max(s,z),f=Math.max(f,M),m=Math.max(m,A),b=Math.min(b,z),v=Math.min(v,M),p=Math.min(p,A),h+=R,g+=_,j+=B,O+=T}}if(O>0){var F=h/O,V=g/O,U=j/O,P=Math.max(s-F,f-V,m-U,F-b,V-v,U-p,Ce);a=new d.Vector3(F,V,U+1.1*P)}else a=u.current.clone()}else a=u.current.clone();i.current.aspect<1&&a.multiply(new d.Vector3(1,1,1/i.current.aspect)),i.current.position.lerp(a,.01)}})),c.a.createElement(c.a.Fragment,null,c.a.createElement(ce.a,{ref:i,makeDefault:!0,near:.001,far:1e5,fov:90}))})),ze=n(140),Me=n.n(ze),Ae=n(60),Ie=Object(a.memo)((function(){var e=Object(f.g)().gl.capabilities.maxTextureSize>8192?8:0;return c.a.createElement(Ae.b,{multisampling:e},c.a.createElement(Ae.a,{luminanceThreshold:.4,luminanceSmoothing:1,intensity:2}),c.a.createElement(Ae.c,{opacity:.04}),c.a.createElement(Ae.d,{eskil:!1,offset:.1,darkness:1.1}))})),Te=n(81),Re=n.n(Te),_e=Object(a.memo)((function(){var e=X(Object(a.useCallback)((function(e){return e.systems}),[])),t=Object(a.useRef)(),n=Object(a.useRef)(),r=Object(a.useContext)(l.a),o=Object(a.useRef)(null),i=Object(a.useRef)(null),u=Object(a.useRef)(null),s=Object(f.g)().camera;Object(a.useEffect)((function(){return F.subscribe((function(r){t.current=r.focused,n.current=r.focused?e[r.focused.solarSystemId]:void 0}))}));var m=Object(a.useMemo)((function(){return new d.MeshBasicMaterial({color:r.text,depthTest:!1})}),[r.text]);return Object(f.e)((function(){var e,r=new Float32Array(0),a="",c="",l=0,f=0,b=0,v="left",p=0;if(t.current&&n.current){var h=t.current.totalValue,g=n.current,j=g.x,O=g.y,E=g.z,y=g.name,k=g.regionName,x=s.position,w=x.x,C=x.y,S=x.z-E,z=S/40,M=j>w?-z:z,A=j,I=O,T=E,R=A+5*M,_=R+5*M,B=I+3*(O>C?-z:z),F=T+3*(z/10);c="".concat(y,", ").concat(k),a=(e=h)>5e8?"".concat(Re()(e/1e9,1),"b"):e>5e5?"".concat(Re()(e/1e6,1),"m"):"".concat(Re()(e/1e3,1),"k"),l=R,f=B,b=F,v=M>0?"left":"right",p=S/30,r=new Float32Array([A,I,T,R,B,F,_,B,F])}if(o.current){var V=o.current.geometry;V.setAttribute("position",new d.BufferAttribute(r,3)),V.attributes.position.needsUpdate=!0,o.current.material=m}if(i.current&&u.current){var D=i.current;D.text=a,D.position.set(l,f,b),D.anchorX=v,D.fontSize=p;var U=u.current;U.text=c,U.position.set(l,f,b),U.anchorX=v,U.fontSize=.75*p}})),c.a.createElement("group",null,c.a.createElement("line",{ref:o},c.a.createElement("bufferGeometry",{attach:"geometry"})),c.a.createElement(ce.c,{ref:i,material:m,fontSize:0,children:"",anchorY:"top"}),c.a.createElement(ce.c,{ref:u,material:m,fontSize:0,children:"",anchorY:"bottom"}))}));function Be(){var e=Object(u.a)(["\n  position: absolute;\n  top: 1vmin;\n  right: 1vmin;\n"]);return Be=function(){return e},e}function Fe(){var e=Object(u.a)(["\n  position: absolute;\n  top: 1vmin;\n  left: 1vmin;\n"]);return Fe=function(){return e},e}function Ve(){var e=Object(u.a)(["\n  ","\n\n  #root {\n    height: 100vh;\n    background: ",";\n    overflow: hidden;\n  }\n\n  canvas {\n    outline: 0;\n  }\n"]);return Ve=function(){return e},e}var De=Object(l.c)(Ve(),s.a,(function(e){return e.theme.background})),Ue=l.e.div(Fe()),Pe=l.e.div(Be()),Le=Object(a.memo)((function(e){var t=e.solarSystems,n=e.killmails;return c.a.createElement(f.a,{onCreated:function(e){return e.gl.setClearColor(m.background)}},c.a.createElement(l.a.Provider,{value:m},c.a.createElement(L,{solarSystems:t}),c.a.createElement(N,{solarSystems:t,killmails:n}),c.a.createElement(_e,null),c.a.createElement(Se,{solarSystems:t,killmails:n}),c.a.createElement(Ie,null)))})),Ne=function(){V("wss://zkillboard.com/websocket/"),function(e){var t=X(Y),n=X(W);Object(a.useEffect)((function(){if(!t){var r=new AbortController;return fetch(e,{signal:r.signal}).then((function(e){return e.json()})).then(n),function(){return r.abort()}}}),[e,t,n])}("https://tmikoss.github.io/zkb-map/data/universe.json"),function(){var e=I(Object(a.useCallback)((function(e){return e.checkConnection}),[]));Object(a.useEffect)((function(){var t=setInterval(e,5e3);return function(){return clearInterval(t)}}),[e])}();var e=Object(a.useRef)([]),t=X(Object(a.useCallback)((function(e){return e.systems}),[])),n=F(Object(a.useCallback)((function(e){var n=q()(e.killmails,(function(e,n){return t[n.solarSystemId]&&e.push(n),e}),[]);return Me()(n,"receivedAt").reverse()}),[t]));return Object(a.useEffect)((function(){e.current=n}),[n]),c.a.createElement(l.b,{theme:m},c.a.createElement(De,null),c.a.createElement(Le,{solarSystems:t,killmails:e}),c.a.createElement(Ue,null,c.a.createElement(ae,{killmails:n})),c.a.createElement(Pe,null,c.a.createElement(xe,null),!1))},Ge=n(57),Je=n(37);Ge.b.add(Je.a,Je.b,Je.g,Je.f,Je.c,Je.d,Je.e);var Ke;Ke=Ne,i.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(Ke,null)),document.getElementById("root"))}},[[144,1,2]]]);
//# sourceMappingURL=main.a28286fc.chunk.js.map