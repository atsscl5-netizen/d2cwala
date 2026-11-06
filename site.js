(function(){
  // Mobile menu
  var burger=document.querySelector('.burger'),menu=document.querySelector('.menu');
  if(burger&&menu){
    burger.addEventListener('click',function(){
      var open=menu.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
  }
  // Dropdown toggle (click / tap)
  document.querySelectorAll('.has-drop > button').forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      var li=b.parentElement,open=li.classList.toggle('open');
      b.setAttribute('aria-expanded',open?'true':'false');
    });
  });
  document.addEventListener('click',function(e){
    document.querySelectorAll('.has-drop.open').forEach(function(li){
      if(!li.contains(e.target)){li.classList.remove('open');li.querySelector('button').setAttribute('aria-expanded','false');}
    });
  });

  // "On this page" highlight
  var links=[].slice.call(document.querySelectorAll('.onpage a[href^="#"]'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          links.forEach(function(a){a.classList.remove('on');});
          var a=map[en.target.id];if(a){a.classList.add('on');a.scrollIntoView({block:'nearest',inline:'center'});}
        }
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s);});
  }

  // Copy email
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var t=b.getAttribute('data-copy');
      var done=function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o;},1600);};
      if(navigator.clipboard){navigator.clipboard.writeText(t).then(done,function(){});}
    });
  });

  // Enquiry form -> opens the visitor's email app with the details filled in
  var f=document.getElementById('enquiry');
  if(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var v=function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
      var needs=[].slice.call(f.querySelectorAll('input[name="need"]:checked')).map(function(i){return i.value;});
      var body=[
        'Name: '+v('f-name'),
        'Brand: '+v('f-brand'),
        'Website: '+v('f-site'),
        'Monthly revenue: '+v('f-rev'),
        'Looking for: '+(needs.join(', ')||'Not sure yet'),
        '',
        v('f-msg')
      ].join('\n');
      var subject='Growth call request: '+(v('f-brand')||v('f-name')||'New brand');
      window.location.href='mailto:admin@d2cwala.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      var note=document.getElementById('form-note');
      if(note){note.textContent='Your email app should open with this message ready to send. If it doesn’t, email us at admin@d2cwala.com.';}
    });
  }
})();

/* ===== Animations ===== */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal
  var groups=[
    ['.sec-head',''],['.feature .f-copy','from-l'],['.feature .f-art','from-r'],
    ['.step',''],['.j',''],['.scen-card',''],['.card',''],['.table-wrap','zoom'],
    ['.qa details',''],['.cta','zoom'],['.prose p',''],['.channels span',''],
    ['.enq',''],['.side-box',''],['.chart',''],['.ad-grid',''],['.mp','']
  ];
  var els=[];
  groups.forEach(function(g){
    document.querySelectorAll(g[0]).forEach(function(el,i){
      if(el.closest('.hero'))return;
      el.classList.add('reveal');if(g[1])el.classList.add(g[1]);
      var sib=el.parentElement?[].indexOf.call(el.parentElement.children,el):i;
      el.style.setProperty('--d',(Math.min(sib,6)*0.08)+'s');
      els.push(el);
    });
  });
  // Hero art (chart, bars etc.) should play immediately
  document.querySelectorAll('.hero .f-art').forEach(function(el){el.classList.add('in');});
  if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});}
  else{
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.15,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(e){io.observe(e);});
    // Feature art containers also need .in for inner animations
    document.querySelectorAll('.f-art').forEach(function(e){io.observe(e);});
  }
  if(reduce)return;

  // Rotating headline word
  document.querySelectorAll('.rot[data-words]').forEach(function(el){
    var w=el.getAttribute('data-words').split('|'),i=0;
    setInterval(function(){
      el.classList.add('out');
      setTimeout(function(){
        i=(i+1)%w.length;el.textContent=w[i];
        el.classList.remove('out');el.classList.add('pre');
        void el.offsetWidth;el.classList.remove('pre');
      },350);
    },2400);
  });

  // Cycle shade swatches
  document.querySelectorAll('.s-swatches').forEach(function(s){
    var k=s.children,i=0;if(!k.length)return;
    k[0].classList.add('on');
    setInterval(function(){k[i].classList.remove('on');i=(i+1)%k.length;k[i].classList.add('on');},1400);
  });

  // Light hub nodes one by one
  document.querySelectorAll('.hub').forEach(function(h){
    var n=h.querySelectorAll('.hub-node'),i=0;if(!n.length)return;
    setInterval(function(){n.forEach(function(x){x.classList.remove('lit');});n[i].classList.add('lit');i=(i+1)%n.length;},1100);
  });

  // Walk the shopper journey
  document.querySelectorAll('.journey').forEach(function(j){
    var s=j.querySelectorAll('.j'),i=0;
    setInterval(function(){
      if(i===0)s.forEach(function(x){x.classList.remove('lit');});
      s[i].classList.add('lit');i=(i+1)%s.length;
    },900);
  });
})();

/* Quiz option cycling */
(function(){
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-cycle]').forEach(function(box){
    var o=box.children,i=0;if(!o.length)return;
    setInterval(function(){[].forEach.call(o,function(x){x.classList.remove('pick');});o[i].classList.add('pick');i=(i+1)%o.length;},1300);
  });
})();

/* Highlight spot rows in turn */
(function(){
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('.spot ul').forEach(function(u){
    var l=u.children,i=0;if(!l.length)return;
    setInterval(function(){[].forEach.call(l,function(x){x.classList.remove('glow');});l[i].classList.add('glow');i=(i+1)%l.length;},1500);
  });
})();
