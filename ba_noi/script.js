// ====== noi dung thiep ======
var CONFIG={
  to:"Bà nội",
  from:"Cháu trai",
  message:"Con chúc bà 20/10 vui vẻ ngày càng mạnh khỏe hơn để nhìn con và sóc lấy vợ nhá.\n\n"+
    "Con cảm ơn bà vì đã chăm sóc con từ nhỏ, cảm ơn bà vì luôn lo lắng cho con, luôn chiều con.\n\n"+
    "Chúc bà luôn khỏe mạnh, bình an và thật nhiều niềm vui."
};

var $=function(i){return document.getElementById(i)};
try{
  var q=new URLSearchParams(location.search);
  if(q.get("to"))CONFIG.to=q.get("to");
  if(q.get("from"))CONFIG.from=q.get("from");
  if(q.get("msg"))CONFIG.message=q.get("msg");
}catch(e){}

$("for").textContent="Gửi "+CONFIG.to;
$("greet").textContent="Gửi "+CONFIG.to+",";
$("sig").textContent=CONFIG.from?"— "+CONFIG.from:"";
CONFIG.message.split("\n\n").forEach(function(t){
  var p=document.createElement("p");p.textContent=t;$("msg").appendChild(p);
});

var cv=$("petals"),cx=cv.getContext("2d"),P=[],run=false,cols=["#FF8FB1","#EC3B77","#FFC83D","#6EE0C0"];
function size(){cv.width=innerWidth;cv.height=innerHeight}
addEventListener("resize",size);size();
function shower(n){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  for(var i=0;i<n;i++)P.push({x:Math.random()*cv.width,y:-20-Math.random()*cv.height*.5,s:6+Math.random()*8,v:1+Math.random()*1.6,w:Math.random()*6,a:Math.random()*6,c:cols[i%4]});
  if(!run){run=true;requestAnimationFrame(tick)}
}
function tick(){
  cx.clearRect(0,0,cv.width,cv.height);
  P=P.filter(function(p){return p.y<cv.height+30});
  P.forEach(function(p){
    p.y+=p.v;if(p.g){p.v+=p.g;if(p.v>1.8)p.g=0}p.w+=.03;p.a+=.02;p.x+=Math.sin(p.w)*1.1+(p.vx||0);if(p.vx)p.vx*=.95;
    cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;cx.globalAlpha=.85;
    cx.beginPath();cx.ellipse(0,0,p.s,p.s*.55,0,0,6.283);cx.fill();cx.restore();
  });
  if(P.length)requestAnimationFrame(tick);else run=false;
}

$("open").onclick=function(){
  $("open").onclick=null;
  var c=$("cover"),done=false;
  function reveal(){
    if(done)return;done=true;
    c.hidden=true;
    var l=$("letter");l.hidden=false;l.classList.add("show");
    var g=$("gallery");g.hidden=false;g.classList.add("show");
    scrollTo(0,0);shower(45);
  }
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){reveal();return}
  c.classList.add("flip");
  c.addEventListener("animationend",function(e){if(e.target===c)reveal()});
  setTimeout(reveal,1000);
};

// ===== xem anh lon =====
var tiles=[].slice.call(document.querySelectorAll(".tile")),cur=0,lastTile=null,sx=0;
function showImg(i){cur=(i+tiles.length)%tiles.length;var im=tiles[cur].querySelector("img");$("lbi").src=im.src;$("lbi").alt=im.alt;var li=$("lbi");li.style.animation="none";li.offsetWidth;li.style.animation=""}
function closeLb(){$("lb").hidden=true;document.body.style.overflow="";if(lastTile)lastTile.focus()}
tiles.forEach(function(t,i){t.onclick=function(){lastTile=t;showImg(i);$("lb").hidden=false;document.body.style.overflow="hidden";$("lbx").focus()}});
$("lbx").onclick=closeLb;
$("lbp").onclick=function(){showImg(cur-1)};
$("lbn").onclick=function(){showImg(cur+1)};
$("lb").onclick=function(e){if(e.target===this)closeLb()};
$("lb").ontouchstart=function(e){sx=e.touches[0].clientX};
$("lb").ontouchend=function(e){var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)showImg(cur+(d<0?1:-1))};
addEventListener("keydown",function(e){
  if($("lb").hidden)return;
  if(e.key==="Escape")closeLb();
  if(e.key==="ArrowLeft")showImg(cur-1);
  if(e.key==="ArrowRight")showImg(cur+1);
});

// ===== effect =====
var calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!calm&&"IntersectionObserver" in window){
  tiles.forEach(function(t){t.classList.add("pre")});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    var t=e.target;t.style.transitionDelay=(tiles.indexOf(t)%3)*110+"ms";
    t.classList.remove("pre");io.unobserve(t);
    setTimeout(function(){t.style.transitionDelay=""},1200);
  })},{threshold:.15});
  tiles.forEach(function(t){io.observe(t)});
}
var offCol=document.querySelector(".col.off"),raf=0;
function parallax(){
  raf=0;if($("gallery").hidden)return;
  var r=$("gallery").getBoundingClientRect(),y=(r.top+r.height/2-innerHeight/2)*.07;
  offCol.style.setProperty("--py",Math.max(-28,Math.min(28,y)).toFixed(1)+"px");
}
if(!calm)addEventListener("scroll",function(){if(!raf)raf=requestAnimationFrame(parallax)},{passive:true});
function burst(x,y){
  for(var i=0;i<10;i++)P.push({x:x,y:y,s:4+Math.random()*5,v:-(2+Math.random()*4),g:.12,vx:(Math.random()-.5)*7,w:Math.random()*6,a:Math.random()*6,c:cols[i%4]});
  if(!run){run=true;requestAnimationFrame(tick)}
}
addEventListener("pointerdown",function(e){if(calm||(e.target.closest&&e.target.closest(".lb")))return;burst(e.clientX,e.clientY)});
