/* UI layer for community troubleshooting + V2 quick navigation */
(()=>{
  const meta=window.CAVIRA_COMMUNITY_META||{};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  /* Scheme A: use FOXTRON's official CAVIRA launch image for every category illustration. */
  const OFFICIAL_CAVIRA_IMAGE='https://www-assets.cloud.foxtronev.com/images/home/news/cavira-launch-event-card-desktop.webp?v=20260914';

  if(typeof icons!=='undefined' && typeof CATEGORIES!=='undefined'){
    while(icons.length<CATEGORIES.length) icons.push(icons.length===CATEGORIES.length-1?'🛠':'•');
  }
  if(typeof scenes!=='undefined'){
    scenes['車友實測與排除']={image:OFFICIAL_CAVIRA_IMAGE,alt:'FOXTRON CAVIRA 官方車款圖片',label:'車友實測與排除'};
  }

  function toneLabel(tone){
    return ({green:'多來源可佐證',yellow:'已有案例・待累積',orange:'單一案例・待驗證',blue:'官方規範優先'})[tone]||'補充資訊';
  }

  function evidenceHTML(id){
    const m=meta[id]; if(!m) return '';
    const links=(m.sources||[]).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><b>${esc(s.name)}</b><span>${esc(s.note||'開啟來源')}</span><i aria-hidden="true">↗</i></a>`).join('');
    return `<section class="community-evidence" aria-label="車友與媒體案例來源">
      <div class="community-evidence-head">
        <div><span class="community-kicker">🛠 車友實測／公開案例</span><h3>這一題的可信度怎麼看？</h3></div>
        <span class="credibility ${esc(m.tone)}">${esc(toneLabel(m.tone))}</span>
      </div>
      <div class="community-facts"><p><b>資料層級</b>${esc(m.level)}</p><p><b>目前判定</b>${esc(m.status)}</p><p><b>最後核對</b>${esc(m.checked)}</p></div>
      <div class="community-warning"><b>先看這句：</b>公開案例只用來幫你快速排除問題，不代表每一台 CAVIRA 都會發生。涉及行車安全、高電壓、煞車或無法恢復的異常，仍以原廠手冊與服務中心判定為準。</div>
      <div class="community-source-title">公開來源</div><div class="community-source-grid">${links}</div>
    </section>`;
  }

  function injectEvidence(id){
    const body=document.getElementById('detailBody'); if(!body||!meta[id]) return;
    body.querySelectorAll('.community-evidence').forEach(n=>n.remove());
    const target=body.querySelector('.sourcetitle')||body.querySelector('.related');
    if(target) target.insertAdjacentHTML('beforebegin',evidenceHTML(id));
    else body.insertAdjacentHTML('beforeend',evidenceHTML(id));
    const cat=document.getElementById('detailCategory');
    if(cat) cat.textContent='車友實測與排除 / '+meta[id].level;
  }

  if(typeof openTopic==='function'){
    const originalOpenTopic=openTopic;
    openTopic=function(id){
      originalOpenTopic(id);
      injectEvidence(id);
    };
  }

  function decorateCommunityCards(){
    document.querySelectorAll('#results [data-topic^="community-"]').forEach(card=>{
      const top=card.querySelector('.cardtop');
      if(top&&!top.querySelector('.community-card-badge')) top.insertAdjacentHTML('beforeend','<span class="community-card-badge">🛠 實測排除</span>');
    });
  }

  if(typeof render==='function'){
    const originalRender=render;
    render=function(){originalRender();decorateCommunityCards()};
  }

  const intro=document.querySelector('.intro');
  if(intro&&!document.getElementById('v2Hub')){
    intro.insertAdjacentHTML('afterend',`<section id="v2Hub" class="v2-hub" aria-label="CAVIRA 知識庫快速入口">
      <div class="v2-hub-title"><span>完整知識庫 V2</span><b>先選你現在要解決的事情</b></div>
      <div class="v2-quick-grid">
        <button data-v2-query="低電量學習"><span>⚡</span><b>新車／充電必讀</b><small>低電量學習、滿充、V2L</small></button>
        <button data-v2-cat="ADAS 駕駛輔助"><span>🛡️</span><b>ADAS 駕駛輔助</b><small>ACC、LKA、AEB、盲點</small></button>
        <button data-v2-cat="車機與連線"><span>📱</span><b>車機與連線</b><small>CarPlay、OTA、Wi‑Fi</small></button>
        <button data-v2-cat="車友實測與排除"><span>🛠️</span><b>問題排除</b><small>黑屏、影像、充電口、OTA</small></button>
      </div>
      <div class="v2-legend"><span><i class="official"></i>官方手冊</span><span><i class="verified"></i>多來源實測</span><span><i class="pending"></i>單一案例待驗證</span></div>
    </section>`);
    document.querySelectorAll('[data-v2-cat]').forEach(b=>b.onclick=()=>{
      category=b.dataset.v2Cat; view='topics'; query=''; document.getElementById('search').value=''; render();
      document.getElementById('results')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
    document.querySelectorAll('[data-v2-query]').forEach(b=>b.onclick=()=>{
      query=b.dataset.v2Query; view='topics'; category='全部重點'; const s=document.getElementById('search'); if(s)s.value=query; render();
      document.getElementById('results')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  /* Scheme A: every category illustration uses the same official CAVIRA image. */
  if(typeof scenes!=='undefined'){
    Object.values(scenes).forEach(scene=>{
      if(scene&&typeof scene==='object'){
        scene.image=OFFICIAL_CAVIRA_IMAGE;
        scene.alt='FOXTRON CAVIRA 官方車款圖片';
      }
    });
  }

  if(typeof render==='function') render();
})();
