/* ═══════════════════════════════════════
   BALAJI CHITRARASU — PORTFOLIO SCRIPT
   2025 Ultra Modern Edition
═══════════════════════════════════════ */

/* ── PAGE TRANSITION ── */
(function(){
  document.body.classList.add('page-loading');
  window.addEventListener('load',function(){
    setTimeout(function(){
      document.body.classList.remove('page-loading');
      if(window.location.hash){
        var id=window.location.hash.slice(1);
        setTimeout(function(){
          var t=document.getElementById(id);
          if(t) window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-68,behavior:'smooth'});
        },250);
      }
    },80);
  });
  document.addEventListener('click',function(e){
    var a=e.target.closest('a');
    if(!a)return;
    var href=a.getAttribute('href');
    if(!href)return;
    if(a.target==='_blank'||href.indexOf('://')!==-1||href==='resume.pdf'||href.startsWith('mailto:')||href.startsWith('tel:'))return;
    if(href.startsWith('#')){
      e.preventDefault();
      var id=href.slice(1);
      if(!id)return;
      var nm=document.getElementById('navMenu'),tg=document.getElementById('navToggle');
      if(nm)nm.classList.remove('open');
      if(tg){tg.classList.remove('open');tg.setAttribute('aria-expanded','false');}
      setTimeout(function(){
        var t=document.getElementById(id);
        if(t) window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-68,behavior:'smooth'});
      },window.innerWidth<=820?300:0);
      return;
    }
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(function(){window.location.href=href;},450);
  });
})();

/* ── MAIN ── */
window.addEventListener('load',function(){

  /* Email link — Cloudflare safe */
  var ec=document.getElementById('emailCard');
  if(ec){var u='balajihck20',d='gmail.com';ec.href='mailto:'+u+'@'+d;}

  /* ── TYPING EFFECT ── */
  var el=document.getElementById('typing');
  if(el){
    var txt='Balaji Chitrarasu',i=0;
    setTimeout(function(){
      el.classList.add('typing-active');
      (function type(){
        if(i<txt.length){el.innerHTML+=txt[i++];setTimeout(type,80);}
        else{el.classList.remove('typing-active');el.classList.add('done');}
      })();
    },400);
  }

  /* ── PARTICLES ── */
  if(typeof particlesJS!=='undefined'){
    particlesJS('particles-js',{
      particles:{
        number:{value:40,density:{enable:true,value_area:900}},
        color:{value:'#00ffcc'},shape:{type:'circle'},
        opacity:{value:.1,random:true,anim:{enable:true,speed:.5,opacity_min:.03,sync:false}},
        size:{value:2,random:true},
        line_linked:{enable:true,distance:140,color:'#1a2535',opacity:.18,width:1},
        move:{enable:true,speed:.55,random:true,out_mode:'out',attract:{enable:false}}
      },
      interactivity:{
        detect_on:'canvas',
        events:{onhover:{enable:true,mode:'grab'},onclick:{enable:true,mode:'push'},resize:true},
        modes:{grab:{distance:150,line_linked:{opacity:.35}},push:{particles_nb:2}}
      },
      retina_detect:true
    });
  }

  /* ── CURSOR GLOW ── */
  var glow=document.getElementById('cursor-glow');
  if(glow&&window.innerWidth>820){
    glow.style.display='block';
    var glowX=0,glowY=0,targetX=0,targetY=0;
    document.addEventListener('mousemove',function(e){targetX=e.clientX;targetY=e.clientY;});
    (function animGlow(){
      glowX+=(targetX-glowX)*.08;
      glowY+=(targetY-glowY)*.08;
      glow.style.left=glowX+'px';
      glow.style.top=glowY+'px';
      requestAnimationFrame(animGlow);
    })();
    /* expand on hoverable elements */
    document.querySelectorAll('a,button,.proj-card,.cert-row,.ach-row,.ccard').forEach(function(el){
      el.addEventListener('mouseenter',function(){glow.style.width='600px';glow.style.height='600px'});
      el.addEventListener('mouseleave',function(){glow.style.width='400px';glow.style.height='400px'});
    });
  }

  /* ── NAV SCROLL ── */
  var navbar=document.getElementById('navbar'),lastY=0;
  if(navbar){
    window.addEventListener('scroll',function(){
      var y=window.scrollY;
      navbar.classList.toggle('hidden',y>lastY&&y>100);
      navbar.classList.toggle('scrolled',y>20);
      lastY=y<0?0:y;
    },{passive:true});
  }

  /* ── ACTIVE NAV LINK ── */
  if('IntersectionObserver' in window){
    var links=document.querySelectorAll('.navbar ul li a');
    document.querySelectorAll('section[id],header[id]').forEach(function(s){
      new IntersectionObserver(function(ents){
        ents.forEach(function(e){
          if(e.isIntersecting){
            links.forEach(function(a){a.classList.remove('active');});
            var l=document.querySelector('.navbar ul li a[href="#'+e.target.id+'"]');
            if(l)l.classList.add('active');
          }
        });
      },{threshold:0.3}).observe(s);
    });
  }

  /* ── FADE IN + SKILL BARS ── */
  function revealBars(){
    document.querySelectorAll('.sfill').forEach(function(f){
      var w=f.getAttribute('data-w');if(w)f.style.width=w+'%';
    });
  }
  setTimeout(revealBars,900);
  var fEls=document.querySelectorAll('.fade-in');
  var fallback=setTimeout(function(){fEls.forEach(function(e){e.classList.add('visible');});revealBars();},1600);
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}
      });
      if(!document.querySelector('.fade-in:not(.visible)'))clearTimeout(fallback);
    },{threshold:0.07,rootMargin:'0px 0px -15px 0px'});
    fEls.forEach(function(e){obs.observe(e);});
  }

  /* ── STATS COUNTER ── */
  var counted=false;
  function runCounters(){
    if(counted)return;counted=true;
    document.querySelectorAll('.stat-num').forEach(function(el){
      var target=parseInt(el.getAttribute('data-target'),10);
      var steps=Math.min(target,60),interval=Math.round(1200/steps),inc=target/steps,frame=0;
      var timer=setInterval(function(){
        frame++;
        el.textContent=frame<steps?Math.round(inc*frame):target;
        if(frame>=steps)clearInterval(timer);
      },interval);
    });
  }
  var statsEl=document.getElementById('stats');
  if(statsEl&&'IntersectionObserver' in window){
    new IntersectionObserver(function(ents){if(ents[0].isIntersecting)runCounters();},{threshold:0.3}).observe(statsEl);
  }else{setTimeout(runCounters,1200);}

  /* ── HAMBURGER ── */
  var toggle=document.getElementById('navToggle'),navMenu=document.getElementById('navMenu');
  if(toggle&&navMenu){
    toggle.addEventListener('click',function(e){
      e.stopPropagation();
      var isOpen=navMenu.classList.toggle('open');
      toggle.classList.toggle('open',isOpen);
      toggle.setAttribute('aria-expanded',isOpen?'true':'false');
      toggle.setAttribute('aria-label',isOpen?'Close menu':'Open menu');
    });
    document.addEventListener('click',function(e){
      if(navbar&&!navbar.contains(e.target)){
        navMenu.classList.remove('open');toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  /* ── POPUP BINDINGS ── */
  function bindClose(id,fn){var b=document.getElementById(id);if(b)b.addEventListener('click',function(e){e.stopPropagation();fn();});}
  function bindBack(id,fn){var el=document.getElementById(id);if(el)el.addEventListener('click',function(e){if(e.target===this)fn();});}
  bindClose('aboutClose',closeAbout);bindBack('aboutPopup',closeAbout);
  bindClose('popupClose',closePopup);bindBack('popup',closePopup);
  bindClose('certClose',closeCertPopup);bindBack('certPopup',closeCertPopup);
  bindClose('achClose',closeAch);bindBack('achPopup',closeAch);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAbout();closePopup();closeCertPopup();closeAch();}});

  /* ── CONTACT FORM ── */
  var sendBtn=document.getElementById('sendBtn'),formMsg=document.getElementById('formMsg');
  function showMsg(type,text){
    if(!formMsg)return;
    formMsg.className='form-msg '+type;formMsg.textContent=text;formMsg.style.display='block';
    setTimeout(function(){formMsg.style.display='none';},5000);
  }
  if(sendBtn){
    sendBtn.addEventListener('click',function(){
      var name=(document.getElementById('cName').value||'').trim();
      var email=(document.getElementById('cEmail').value||'').trim();
      var msg=(document.getElementById('cMsg').value||'').trim();
      if(!name){showMsg('err','Please enter your name.');return;}
      if(!email){showMsg('err','Please enter your email address.');return;}
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showMsg('err','Please enter a valid email address.');return;}
      if(!msg){showMsg('err','Please enter a message.');return;}
      var u='balajihck20',d='gmail.com';
      var body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\n\nMessage:\n'+msg);
      var sub=encodeURIComponent('Portfolio Message from '+name);
      window.location.href='mailto:'+u+'@'+d+'?subject='+sub+'&body='+body;
      showMsg('ok','Mail app opened! You can also call +91 76396 83223.');
    });
  }

  /* ── SCROLL TO TOP BUTTON ── */
  var topBtn=document.getElementById('scrollTop');
  if(topBtn){
    window.addEventListener('scroll',function(){topBtn.classList.toggle('show',window.scrollY>400);},{passive:true});
    topBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  }

});/* end load */

/* ── POPUP FUNCTIONS ── */
function openAbout(){var e=document.getElementById('aboutPopup');if(e){e.classList.add('open');document.body.style.overflow='hidden';}}
function closeAbout(){var e=document.getElementById('aboutPopup');if(e)e.classList.remove('open');document.body.style.overflow='';}
function openPopup(t,tx){
  var e=document.getElementById('popup');if(!e)return;
  document.getElementById('ptitle').innerText=t;
  document.getElementById('pbody').innerText=tx;
  e.classList.add('open');document.body.style.overflow='hidden';
}
function closePopup(){var e=document.getElementById('popup');if(e)e.classList.remove('open');document.body.style.overflow='';}
function openCert(title,issuer,statusHTML,desc,orgShort,statusLabel,medal){
  var e=document.getElementById('certPopup');if(!e)return;
  var m=document.getElementById('cMedal'),o=document.getElementById('cOrg'),s=document.getElementById('cStatus'),t=document.getElementById('cTitle'),i=document.getElementById('cIssuer'),d=document.getElementById('cBody');
  if(m)m.innerHTML=medal||'&#127885;';if(o)o.innerText=orgShort||'';if(s)s.innerHTML=statusHTML||'';if(t)t.innerText=title;if(i)i.innerText=issuer;if(d)d.innerText=desc;
  e.classList.add('open');document.body.style.overflow='hidden';
}
function closeCertPopup(){var e=document.getElementById('certPopup');if(e)e.classList.remove('open');document.body.style.overflow='';}
function openAch(title,subtitle,where,desc,icon,colorClass){
  var e=document.getElementById('achPopup');if(!e)return;
  var iconEl=document.getElementById('achIcon'),tEl=document.getElementById('achTitle'),sEl=document.getElementById('achSub'),wEl=document.getElementById('achWhere'),dEl=document.getElementById('achBody');
  if(iconEl){iconEl.innerHTML=icon||'&#127941;';iconEl.className='picon';}
  if(tEl)tEl.innerText=title;if(sEl)sEl.innerHTML=subtitle;if(wEl)wEl.innerHTML=where;if(dEl)dEl.innerText=desc;
  e.classList.add('open');document.body.style.overflow='hidden';
}
function closeAch(){var e=document.getElementById('achPopup');if(e)e.classList.remove('open');document.body.style.overflow='';}
