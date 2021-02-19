(this["webpackJsonpcanvas-app"]=this["webpackJsonpcanvas-app"]||[]).push([[0],{17:function(t,e,n){},18:function(t,e,n){},19:function(t,e,n){},22:function(t,e,n){"use strict";n.r(e);var a=n(0),c=n.n(a),o=n(8),i=n.n(o),s=(n(17),n(18),n(11)),r=n(9),u=n(10),h=n(6),l=n(12),f=(n(19),n(4)),v=n(5),d=new(function(){function t(){Object(f.a)(this,t),this._history=[],this._defaultSnapshot=new Map}return Object(v.a)(t,[{key:"saveState",value:function(t){var e=new Map;t.forEach((function(t,n){e.set(n,t.getState())})),this._history.push(e)}},{key:"getRecentStates",value:function(){return this._history.pop()}},{key:"setDefaultSnapshot",value:function(t){var e=new Map;t.forEach((function(t,n){e.set(n,t.getState())})),this._defaultSnapshot=e}},{key:"defaultSnapshot",get:function(){return this._defaultSnapshot}},{key:"cleanHistory",value:function(){this._history=[]}},{key:"isHistoryEmpty",value:function(){return!this._history.length}}]),t}()),b=(n(20),n(1));var j=function(t){var e=t.items,n=Object(l.a)(t,["items"]),c=Object(a.useState)(null),o=Object(h.a)(c,2),i=o[0],f=o[1],v=Object(a.useState)([0,0]),j=Object(h.a)(v,2),y=j[0],p=j[1],_=Object(a.useState)(),O=Object(h.a)(_,2),L=O[0],w=O[1],k=Object(a.useRef)(null),g=Object(a.useCallback)((function(){var t=k.current,e=t.getContext("2d");return{canvas:t,context:e}}),[k]),m=Object(a.useCallback)((function(){var t=g(),n=t.context,a=t.canvas;n.clearRect(0,0,a.width,a.height),e.forEach((function(t){return e=t,n.beginPath(),n.fillStyle=e.color,n.fill(e.path),void n.closePath();var e}))}),[e,g]),x=Object(a.useCallback)((function(){w(window.setInterval((function(){m()}),17))}),[m]),P=Object(a.useCallback)((function(){d.saveState(e)}),[e]),S=Object(a.useCallback)((function(){var t=d.getRecentStates();e.forEach((function(e,n){var a=null===t||void 0===t?void 0:t.get(n);a&&e.restoreState(a)}))}),[e]),C=Object(a.useCallback)((function(){window.clearInterval(L),m()}),[L,m]),E=Object(a.useCallback)((function(){d.cleanHistory();var t=d.defaultSnapshot;e.forEach((function(e,n){var a=null===t||void 0===t?void 0:t.get(n);a&&e.restoreState(a)}))}),[e]),I=Object(a.useCallback)((function(){S(),m()}),[m,S]),M=Object(a.useCallback)((function(){E(),m()}),[m,E]);return Object(a.useEffect)((function(){m(),d.setDefaultSnapshot(e)}),[]),Object(a.useEffect)((function(){var t=g(),n=t.canvas,a=t.context;function c(t){i&&i.moveItem.apply(i,[t.offsetX,t.offsetY].concat(Object(u.a)(y)))}function o(t){var n,c=Object(r.a)(e);try{for(c.s();!(n=c.n()).done;){var o=n.value;if(a.isPointInPath(o.path,t.offsetX,t.offsetY)){P(),p([t.offsetX-o.xLoc,t.offsetY-o.yLoc]),f(o),x();break}}}catch(i){c.e(i)}finally{c.f()}}function s(){C(),f(null),p([0,0])}return n.addEventListener("mousedown",o),n.addEventListener("mouseup",s),n.addEventListener("mousemove",c),function(){window.clearInterval(L),n.removeEventListener("mousedown",o),n.removeEventListener("mouseup",s),n.removeEventListener("mousemove",c)}}),[e,y,m,g,L,P,i,f,x,C]),Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)("div",{className:"canvas-container",children:Object(b.jsx)("canvas",Object(s.a)({height:700,width:700,ref:k},n))}),Object(b.jsxs)("div",{className:"buttons-container",children:[Object(b.jsx)("button",{onClick:I,children:"Undo"}),Object(b.jsx)("button",{onClick:M,children:"Reset"})]})]})},y=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"black";Object(f.a)(this,t),this._xLoc=void 0,this._yLoc=void 0,this._scale=1,this._path=void 0,this._color=void 0,this._path=e,this._xLoc=n,this._yLoc=a,this._color=c,this._movePath()}return Object(v.a)(t,[{key:"color",get:function(){return this._color}},{key:"path",get:function(){return this._path}},{key:"scale",get:function(){return this._scale}},{key:"xLoc",get:function(){return this._xLoc}},{key:"yLoc",get:function(){return this._yLoc}},{key:"_movePath",value:function(t,e,n,a){var c=new DOMMatrix;c.e="undefined"!==typeof t?t-this._xLoc:this._xLoc,c.f="undefined"!==typeof e?e-this._yLoc:this._yLoc,n&&(c.e-=n),a&&(c.f-=a);var o=new Path2D;o.addPath(this._path,c),this._path=o}},{key:"moveItem",value:function(t,e,n,a){this._movePath(t,e,n,a),this._xLoc=t-n,this._yLoc=e-a}},{key:"getState",value:function(){return{xLoc:this._xLoc,yLoc:this._yLoc}}},{key:"restoreState",value:function(t){this._movePath(t.xLoc,t.yLoc),this._xLoc=t.xLoc,this._yLoc=t.yLoc}}]),t}(),p=new Path2D;p.rect(0,0,100,100);var _=new Path2D;_.arc(50,40,50,0,2*Math.PI);var O=new Path2D;O.arc(0,0,70,0,2*Math.PI);var L=new Path2D;L.arc(0,0,70,0,Math.PI);var w=new Path2D;w.ellipse(0,0,30,70,Math.PI/4,0,2*Math.PI);var k=new Path2D;k.ellipse(0,0,60,70,Math.PI/2,0,2*Math.PI);var g=[new y(p,0,0,"red"),new y(_,150,150),new y(O,200,350,"green"),new y(_,500,410,"blue"),new y(w,400,400,"orange"),new y(k,500,500,"darkcyan"),new y(L,600,10,"yellow")];var m=function(){return Object(b.jsx)("div",{className:"App",children:Object(b.jsx)(j,{items:g})})},x=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,23)).then((function(e){var n=e.getCLS,a=e.getFID,c=e.getFCP,o=e.getLCP,i=e.getTTFB;n(t),a(t),c(t),o(t),i(t)}))};i.a.render(Object(b.jsx)(c.a.StrictMode,{children:Object(b.jsx)(m,{})}),document.getElementById("root")),x()}},[[22,1,2]]]);
//# sourceMappingURL=main.8eee448b.chunk.js.map