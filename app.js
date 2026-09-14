'use strict';
const $=id=>document.getElementById(id), escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={owner:'車主手冊',media:'車載系統手冊'};
const scenes={
 '充電與電池':{image:'illustration-charge.webp',alt:'藍色電動車在家用充電樁旁的情境插畫',label:'充電與電池'},
 '電源與車鎖':{image:'illustration-screen.webp',alt:'小助手介紹車輛設定的情境插畫',label:'電源與車鎖'},
 '空調與露營':{image:'illustration-comfort.webp',alt:'藍色電動車停在遮陽棚下的情境插畫',label:'空調與露營'},
 '車機與連線':{image:'illustration-screen.webp',alt:'小助手介紹車機設定的情境插畫',label:'車機與連線'}
};
const icons=['▦','ϟ','◉','❄','△','▤','⚙'];
let pages=[],pageMap=new Map(),query='',category='全部重點',view='topics',doc='all',limit=30,readerKey='owner-1',readerMode='image',loaded=false;
const topics=TOPICS.map(t=>({id:t[0],category:t[1],title:t[2],summary:t[3],steps:t[4],note:t[5],refs:t[6],keywords:t[7],featured:!!t[8]}));
const normalize=s=>String(s).toLowerCase().normalize('NFKC').replace(/[\s\-／/，。？?、：:]/g,'');
function terms(){let q=query.trim().toLowerCase();q=q.replace(/低電壓學習/g,'低電量學習').replace(/露螢/g,'露營').replace(/儀表/g,'儀錶').replace(/wifi/g,'wi-fi').replace(/tbox/g,'t-box');return q.split(/\s+/).map(normalize).filter(Boolean)}
function highlight(s){const original=String(s);if(!query.trim())return escapeHTML(original);let candidates=[query.trim(),...query.trim().split(/\s+/)].filter(Boolean).sort((a,b)=>b.length-a.length);const rx=new RegExp(candidates.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gi');let out='',pos=0;for(const m of original.matchAll(rx)){out+=escapeHTML(original.slice(pos,m.index))+'<mark>'+escapeHTML(m[0])+'</mark>';pos=m.index+m[0].length}return out+escapeHTML(original.slice(pos))}
function refsLabel(refs){return refs.slice(0,2).map(id=>{const p=pageMap.get(id);return p?`${names[p.doc]} ${p.label}`:names[id.split('-')[0]]}).join('・')+(refs.length>2?' 等':'')}
function topicMatch(t,ts){const text=normalize([t.title,t.summary,t.steps.join(''),t.note,t.keywords].join(''));return ts.every(term=>text.includes(term))}
function renderNav(){const nav=$('categories');nav.innerHTML=CATEGORIES.map((c,i)=>`<button data-cat="${escapeHTML(c)}" class="${category===c&&view==='topics'?'active':''}" aria-pressed="${category===c&&view==='topics'}"><span class="navicon" aria-hidden="true">${icons[i]}</span>${c}<em>${c==='全部重點'?topics.length:topics.filter(t=>t.category===c).length}</em></button>`).join('');nav.querySelectorAll('button').forEach(b=>b.onclick=()=>{category=b.dataset.cat;view='topics';limit=30;render()})}
function setView(v){view=v;limit=30;render()}
function render(){renderNav();$('tabTopics').setAttribute('aria-selected',String(view==='topics'));$('tabFull').setAttribute('aria-selected',String(view==='full'));$('clearSearch').hidden=!query;$('results').className='cards'+(view==='full'?' fulltext':'');$('more').hidden=true;const ts=terms();
 if(view==='topics'){
  let found=topics.filter(t=>(category==='全部重點'||t.category===category)&&(doc==='all'||t.refs.some(r=>r.startsWith(doc+'-')))&&topicMatch(t,ts));
  if(ts.length)found.sort((a,b)=>Number(ts.some(q=>normalize(b.title).includes(q)))-Number(ts.some(q=>normalize(a.title).includes(q))));
  else if(category==='警示與救援')found.sort((a,b)=>Number(b.id==='alllights')-Number(a.id==='alllights'));
  $('resultTitle').textContent=query?'符合的操作重點':category==='全部重點'?'車主重要資訊':category;$('resultCount').textContent=`${found.length} 項重點`;
  $('results').innerHTML=found.map(t=>`<button class="card ${t.featured?'featured':''}" data-topic="${t.id}"><div class="cardtop"><span class="tag">${t.category}</span>${t.featured?'<span class="priority">常用重點</span>':''}</div>${topicPreview(t)}<h3>${highlight(t.title)}</h3><p>${highlight(t.summary)}</p><div class="cardbottom"><span>${escapeHTML(refsLabel(t.refs))}</span><b aria-hidden="true">↗</b></div></button>`).join('');
  if(!found.length){$('results').innerHTML='<div class="empty"><b>這個條件沒有找到操作重點</b>可以改用簡短關鍵字，或搜尋完整手冊。<br><button id="searchFull">搜尋手冊全文</button> <button id="resetFilters">清除所有條件</button></div>';$('searchFull').onclick=()=>setView('full');$('resetFilters').onclick=reset}
  $('results').querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>openTopic(b.dataset.topic));
 }else{
  if(!loaded){$('resultTitle').textContent='手冊全文';$('resultCount').textContent='載入中…';$('results').innerHTML='';return}
  const found=pages.filter(p=>(doc==='all'||p.doc===doc)&&ts.every(t=>normalize(p.text).includes(t)));
  $('resultTitle').textContent=query?'全文搜尋結果':'瀏覽原始手冊';$('resultCount').textContent=`${found.length} 頁`;
  $('results').innerHTML=found.slice(0,limit).map(p=>{let clean=p.text.replace(/\n/g,' ').replace(/\s+/g,' ').trim();let start=0;const term=query.trim().toLowerCase();if(term){const i=clean.toLowerCase().indexOf(term);if(i>=0)start=Math.max(0,i-45)}const excerpt=(start?'…':'')+clean.slice(start,start+180)+(clean.length>start+180?'…':'');return `<button class="card" data-page="${p.id}"><img class="page-thumb" src="${p.image}" alt="" loading="lazy"><div class="cardtop"><span class="tag">${names[p.doc]}</span><span>手冊 ${escapeHTML(p.label)}・PDF 第 ${p.page} 頁</span></div><h3>${highlight(p.title)}</h3><p>${highlight(excerpt||'此頁沒有可擷取的文字，可開啟原始頁面查看。')}</p><div class="cardbottom"><span>查看原始頁面與文字</span><b aria-hidden="true">↗</b></div></button>`}).join('');
  $('results').querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>openReader(b.dataset.page));$('more').hidden=found.length<=limit;
  if(!found.length){$('results').innerHTML='<div class="empty"><b>手冊內沒有找到相符文字</b>試試「空調」、「電源」等關鍵字；全文比對以 PDF 可擷取文字為範圍。<br><button id="resetFilters">清除所有條件</button></div>';$('resetFilters').onclick=reset}
 }
}
function reset(){query='';category='全部重點';doc='all';limit=30;$('search').value='';$('docfilter').value='all';render()}
function openTopic(id){
 const t=topics.find(x=>x.id===id);if(!t)return;activeTopic=t;stepMode=false;stepIndex=0;
 $('detailCategory').textContent=t.category+' / 操作教學';$('lessonNav').hidden=false;
 const visualKeys=TOPIC_FIGURES[t.id]||[];
 const gallery=visualKeys.length?visualKeys.map(k=>({...FIGURES[k],key:k})):t.refs.slice(0,2).map(id=>({key:'page:'+id,image:pageMap.get(id)?.image||'pages/'+id+'.webp',ref:id,title:names[id.split('-')[0]]+' '+(pageMap.get(id)?.label||''),caption:'點圖放大，核對完整條件與原文圖示。'}));
 const related=topics.filter(x=>x.id!==t.id&&x.category===t.category).slice(0,3);
 $('detailBody').innerHTML=`<div class="lesson-kicker">操作教學 <span>${t.steps.length} 個重點步驟</span></div><h2 id="topicTitle">${escapeHTML(t.title)}</h2><div class="lead" id="lessonStart">${escapeHTML(t.summary)}</div>${topicScene(t)}<div class="note"><b>操作前先確認</b>${escapeHTML(t.note)}</div>${visualSummary(t)}<section id="lessonSteps" class="steps-section" aria-labelledby="stepsTitle"><div class="step-header"><h3 id="stepsTitle">操作步驟</h3><button id="stepMode" aria-pressed="false">逐步閱讀</button></div><div id="stepCards"></div><div id="stepNavigation" hidden><button id="stepPrev">上一個步驟</button><span id="stepProgress" role="status" aria-live="polite"></span><button id="stepNext">下一個步驟</button></div></section><section id="lessonImages" class="lesson-images"><div class="lesson-section-title"><span>圖解對照</span><h3>找到對應按鈕與位置</h3></div><section class="guide-gallery" aria-label="手冊圖文說明">${gallery.map(g=>`<figure><button class="figure-preview" data-figure="${g.key}" aria-label="放大：${escapeHTML(g.title)}"><img src="${g.image}" alt="${escapeHTML(g.title)}" loading="lazy"><span class="magnify-hint">＋ 點圖放大</span></button><figcaption><b>${escapeHTML(g.title)}</b><p>${escapeHTML(g.caption)}</p><button class="inline-source" data-ref="${g.ref}">${escapeHTML(refsLabel([g.ref]))} ↗</button></figcaption></figure>`).join('')}</section></section><div id="lessonSources" class="sourcetitle">依據手冊整理・點選查看完整原頁</div><div class="sources">${t.refs.map(id=>{const p=pageMap.get(id);return `<button data-ref="${id}">${names[id.split('-')[0]]} ${p?escapeHTML(p.label):''} ↗</button>`}).join('')}</div>${related.length?`<section class="related"><h3>也可以接著查</h3>${related.map(r=>`<button data-related="${r.id}">${escapeHTML(r.title)}<span aria-hidden="true">›</span></button>`).join('')}</section>`:''}`;
 $('detailBody').querySelectorAll('[data-ref]').forEach(b=>b.onclick=()=>openReader(b.dataset.ref));
 $('detailBody').querySelectorAll('[data-figure]').forEach(b=>b.onclick=()=>openFigure(b.dataset.figure));
 $('detailBody').querySelectorAll('[data-related]').forEach(b=>b.onclick=()=>openTopic(b.dataset.related));
 $('stepMode').onclick=()=>{stepMode=!stepMode;stepDirection='forward';renderSteps()};$('stepPrev').onclick=()=>{stepDirection='back';stepIndex=Math.max(0,stepIndex-1);renderSteps()};$('stepNext').onclick=()=>advanceStep();renderSteps();
 $('detailBody').querySelectorAll('[data-start-lesson]').forEach(b=>b.onclick=()=>jumpToStep(0,true));
 if(t.id.startsWith('lamp-')){ $('lessonSteps').insertAdjacentHTML('afterend','<button class="lamp-back" id="backToLamps">回到全部 43 項燈號</button>');$('backToLamps').onclick=()=>openTopic('alllights'); }
 if(t.id==='alllights'){
  $('lessonSteps').innerHTML='<h3>全部燈號，一次對照</h3><p class="lamp-scope">依車主手冊 O-16～O-17：17 項警告燈＋26 項指示燈。同一燈號的不同狀態合併說明，圖示取自手冊原頁。</p><div class="lamp-filters"><label>搜尋燈號<input id="lampSearch" type="search" placeholder="名稱、ABS、紅色、閃爍…"></label><label>類型<select id="lampKind"><option value="">全部 43 項</option><option>警告燈</option><option>指示燈</option></select></label></div><p id="lampCount" role="status" aria-live="polite"></p><div id="lampCatalog" class="lamp-catalog"></div>';
  $('lampSearch').oninput=renderLampCatalog;$('lampKind').onchange=renderLampCatalog;renderLampCatalog();
 }
 if(!$('detail').open)$('detail').showModal();$('detail').scrollTop=0;
}
function openReader(id){if(!loaded){alert('手冊正在載入，請稍後再開啟。');return}if(!pageMap.has(id))return;readerKey=id;readerMode='image';updateReader();if(!$('reader').open)$('reader').showModal()}
function updateReader(){const p=pageMap.get(readerKey);if(!p)return;$('readerTitle').textContent=names[p.doc]+'・原始手冊';$('readerDoc').value=p.doc;$('pageInput').value=p.page;const max=p.doc==='owner'?320:112;$('pageInput').max=max;$('pageMax').textContent='/ '+max;$('prevPage').disabled=p.page===1;$('nextPage').disabled=p.page===max;$('printedLabel').textContent='手冊標示 '+p.label+'｜PDF 第 '+p.page+' 頁';$('pageImage').alt=`${names[p.doc]}，手冊 ${p.label}，PDF 第 ${p.page} 頁`;$('imageError').hidden=true;$('pageImage').src=p.image;$('largePage').href=p.image;$('pageText').textContent=p.text||'此頁沒有可擷取文字，請查看原始頁面。';toggleReaderMode();$('reader').scrollTop=0}
function toggleReaderMode(){$('pageImage').hidden=readerMode!=='image';$('pageText').hidden=readerMode!=='text';$('imageTab').setAttribute('aria-pressed',String(readerMode==='image'));$('textTab').setAttribute('aria-pressed',String(readerMode==='text'))}
function turnPage(delta){const p=pageMap.get(readerKey);if(pageMap.has(`${p.doc}-${p.page+delta}`)){readerKey=`${p.doc}-${p.page+delta}`;updateReader()}}
$('search').addEventListener('input',e=>{query=e.target.value;limit=30;render()});$('clearSearch').onclick=()=>{query='';$('search').value='';render();$('search').focus()};
 $('lampAllShortcut').onclick=()=>openTopic('alllights');
document.querySelectorAll('[data-query]').forEach(b=>b.onclick=()=>{query=b.dataset.query;category='全部重點';doc='all';view='topics';$('search').value=query;$('docfilter').value='all';render()});
$('tabTopics').onclick=()=>setView('topics');$('tabFull').onclick=()=>setView('full');$('docfilter').onchange=e=>{doc=e.target.value;limit=30;render()};$('more').onclick=()=>{limit+=30;render()};
$('closeDetail').onclick=()=>$('detail').close();$('closeReader').onclick=()=>$('reader').close();$('manualOpen').onclick=()=>openReader('owner-1');
$('readerDoc').onchange=e=>{readerKey=e.target.value+'-1';updateReader()};$('pageInput').onchange=e=>{const p=pageMap.get(readerKey),n=Math.min(p.doc==='owner'?320:112,Math.max(1,Math.floor(Number(e.target.value)||1)));readerKey=`${p.doc}-${n}`;updateReader()};$('prevPage').onclick=()=>turnPage(-1);$('nextPage').onclick=()=>turnPage(1);$('imageTab').onclick=()=>{readerMode='image';toggleReaderMode()};$('textTab').onclick=()=>{readerMode='text';toggleReaderMode()};$('pageImage').onerror=()=>$('imageError').hidden=false;
$('about').onclick=()=>{$('lessonNav').hidden=true;$('detailCategory').textContent='資料來源';$('detailBody').innerHTML='<h2 id="topicTitle">兩份原始官方手冊</h2><p class="reader-note">本網站依你於 2026 年 9 月提供的兩份 PDF 整理：車主手冊 V1.3（202606）、車載系統手冊 V1.2（202606），包含逐頁文字與原始頁面影像。操作重點為摘要，原頁保留完整警告、條件及圖示。</p><div class="sources"><button data-ref="owner-1">車主使用手冊・320 頁 ↗</button><button data-ref="media-1">車載系統手冊・112 頁 ↗</button><button data-ref="owner-320">車主手冊版本頁 ↗</button><button data-ref="media-112">車載系統手冊版本頁 ↗</button></div><div class="note"><b>版本與適用範圍</b>手冊包含不同配備等級及選用功能，並非每項都保證搭載於 Emerge。軟體更新後的實車畫面可能不同。本網站不會自動取得新版手冊或即時公告。</div><p class="reader-note">手冊全文是 PDF 文字擷取，表格欄位或多欄段落的順序可能不同；遇到表格、警示圖示及操作位置，請以原始頁面為準。手冊頁碼（如 EV-5）與 PDF 頁次（如第 36 頁）分別標示。</p>';$('detailBody').querySelectorAll('[data-ref]').forEach(b=>b.onclick=()=>openReader(b.dataset.ref));$('detail').showModal()};
for(const id of ['detail','reader','figure','topicMenu'])$(id).addEventListener('click',e=>{if(e.target===$(id)){const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close()}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$('reader').open&&!$('detail').open&&!$('figure').open){e.preventDefault();$('search').focus()}if($('reader').open&&!$('figure').open&&!/INPUT|SELECT/.test(document.activeElement.tagName)){if(e.key==='ArrowLeft'){e.preventDefault();turnPage(-1)}if(e.key==='ArrowRight'){e.preventDefault();turnPage(1)}}});

let activeTopic=null,stepMode=false,stepIndex=0,stepDirection='forward',completedSteps=new Set(),figureKey=null,figureZoom=1;
function topicPreview(t){
 const lamp=LAMPS.find(l=>l.id===t.id);if(lamp)return `<div class="lamp-preview"><img src="${lamp.image}" alt="${escapeHTML(lamp.title)}原始圖示" loading="lazy"><span>${escapeHTML(lamp.state)}</span></div>`;
 const key=(TOPIC_FIGURES[t.id]||[])[0];
 if(key){const f=FIGURES[key];return `<div class="card-visual"><img src="${f.image}" alt="${escapeHTML(f.title)}" loading="lazy"><span>手冊圖解</span></div>`}
 const scene=scenes[t.category];if(scene)return `<div class="card-visual card-scene"><img src="${scene.image}" alt="" loading="lazy"><span>情境插畫</span></div>`;
 const metrics={learn:[['≤15%','開始電量'],['1.5 h','至少靜置'],['100%','完成滿充']],newcar:[['2,000 km','新車提醒'],['20%','避免低於']],silent:[['OFF','靜默補電'],['12 V','小電瓶']],park:[['≤3 個月','停放超過 7 天'],['30–50%','建議停放電量']],weekly:[['100%','每週 AC 滿充']],rescue:[['0800','585880']],'12vcharge':[['負極接頭','接車輛搭鐵']]};
 if(t.id==='charge-led')return '<div class="card-metrics led-preview"><span><i class="lamp blue-lamp"></i><small>等待</small></span><span><i class="lamp green-lamp"></i><small>充電</small></span><span><i class="lamp red-lamp"></i><small>異常</small></span></div>';
 const m=metrics[t.id]||[['手冊原頁',t.refs.length+' 頁參考']];return `<div class="card-metrics">${m.map(v=>`<span><b>${escapeHTML(v[0])}</b><small>${escapeHTML(v[1])}</small></span>`).join('')}</div>`;
}
function topicScene(t){const scene=scenes[t.category];return scene?`<figure class="lesson-scene"><button class="scene-launch" data-start-lesson aria-label="開始${escapeHTML(t.title)}的逐步教學"><img src="${scene.image}" alt="${scene.alt}" loading="lazy"><span>▶ 點我開始逐步教學</span></button><figcaption><b>${scene.label}小助手</b><span>情境插畫僅供閱讀引導，並非 CAVIRA 實車或操作畫面；按鈕與細節請核對下方手冊原圖。</span></figcaption></figure>`:''}
function jumpToStep(index,scroll=false){
 if(!activeTopic||!Number.isInteger(index)||index<0||index>=activeTopic.steps.length)return;
 stepDirection=index<stepIndex?'back':'forward';stepIndex=index;stepMode=true;renderSteps();
 const selected=$('stepCards').querySelector(`[data-jump-step="${index}"]`);selected?.focus({preventScroll:true});
 if(scroll)$('lessonSteps').scrollIntoView({block:'start',behavior:'auto'});
}
function visualSummary(t){
 const lamp=LAMPS.find(l=>l.id===t.id);if(lamp)return `<figure class="lamp-detail"><img src="${lamp.image}" alt="${escapeHTML(lamp.title)}手冊原始圖示"><figcaption><b>${escapeHTML(lamp.state)}</b><span>${lamp.kind}・手冊總覽圖示</span><p>處理方式：${escapeHTML(lamp.action)}</p></figcaption></figure>`;
 if(t.id==='learn')return '<div class="learning-flow" aria-label="低電量學習流程">'+[['≤15%','安全停車'],['OFF','上鎖靜置'],['≥1.5 h','之後進 READY'],['充電','可原地插槍'],['100%','完成學習']].map((v,i)=>`<div><span>0${i+1}</span><b>${v[0]}</b><small>${v[1]}</small></div>`).join('')+'</div>';
 if(t.id==='charge-led')return '<section class="visual-table"><h3>先看顏色，再看恆亮或閃爍</h3><table><thead><tr><th>充電燈號</th><th>代表狀態</th></tr></thead><tbody>'+[['white','恆亮','系統待機'],['blue','慢速閃爍','等待預約充電'],['blue','恆亮','車輛與設備通訊中'],['green','慢速閃爍','充電中'],['green','恆亮','滿充或正常停止'],['red','慢速閃爍','異常充電'],['red','恆亮','異常停止充電']].map(([color,state,label])=>`<tr><td><i class="lamp ${color}-lamp ${state==='慢速閃爍'?'slow-blink':''}" aria-hidden="true"></i>${({white:'白色',blue:'藍色',green:'綠色',red:'紅色'})[color]}${state}</td><td>${label}</td></tr>`).join('')+'</tbody></table><p>此表為充電狀態；V2L 供電的燈號定義請看原頁。</p></section>';
 if(t.id==='maintain')return '<section class="visual-table"><h3>三種模式快速比較</h3><table><thead><tr><th>模式</th><th>螢幕與操作</th></tr></thead><tbody><tr><td>維持</td><td>OFF 後螢幕關閉，空調持續</td></tr><tr><td>寵物</td><td>OFF 後顯示寵物模式，空調持續</td></tr><tr><td>露營</td><td>空調控制介面可完整操作</td></tr></tbody></table><p>共同條件：ON、P 檔、電量高於 15%；30% 警示，15% 停止空調。</p></section>';
 return '';
}
function renderSteps(){
 if(!activeTopic)return;const all=activeTopic.steps,items=stepMode?[[all[stepIndex],stepIndex]]:all.map((v,i)=>[v,i]);
 $('stepMode').textContent=stepMode?'顯示全部步驟':'逐步閱讀';$('stepMode').setAttribute('aria-pressed',String(stepMode));
 const doneCount=[...completedSteps].filter(k=>k.startsWith(activeTopic.id+':')).length;
 const progress=stepMode?Math.round(((stepIndex+1)/all.length)*100):Math.round((doneCount/all.length)*100);
 $('stepCards').innerHTML=`<div class="step-progress" aria-label="教學進度 ${progress}%"><div class="step-progress-label"><span>${stepMode?'目前進度':'完成進度'}</span><b>${progress}%</b></div><div class="step-progress-track"><i style="width:${progress}%"></i></div></div><ol class="step-cards ${stepMode?'single-step direction-'+stepDirection:''}" start="${stepMode?stepIndex+1:1}">${items.map(([text,i])=>{const key=activeTopic.id+':'+i,done=completedSteps.has(key);return `<li class="${done?'is-complete':''}" style="--step-order:${i}" value="${i+1}"><button class="step-check" data-step-check="${i}" aria-pressed="${done}" aria-label="${done?'取消完成':'標記完成'}第 ${i+1} 步"><span aria-hidden="true">${done?'✓':''}</span></button><span class="step-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span class="step-copy">${escapeHTML(text)}<small>${done?'已完成':'完成後點一下打勾'}</small></span></li>`}).join('')}</ol>${doneCount===all.length?'<div class="lesson-complete" role="status"><span class="complete-ring" aria-hidden="true">✓</span><div><b>這項操作已完成</b><small>需要再次確認時，可隨時取消勾選或查看手冊原頁。</small></div><i></i><i></i><i></i></div>':''}`;
 $('stepCards').insertAdjacentHTML('afterbegin',`<nav class="step-jumps" aria-label="選擇教學步驟">${all.map((_,i)=>{const done=completedSteps.has(activeTopic.id+':'+i);return `<button data-jump-step="${i}" ${stepMode&&stepIndex===i?'aria-current="step"':''} aria-label="第 ${i+1} 步${done?'，已完成':''}"><span aria-hidden="true">${done?'✓':String(i+1).padStart(2,'0')}</span>第 ${i+1} 步</button>`}).join('')}</nav>`);
 $('stepCards').querySelectorAll('[data-jump-step]').forEach(b=>b.onclick=()=>jumpToStep(Number(b.dataset.jumpStep)));
 $('stepCards').querySelectorAll('[data-step-check]').forEach(b=>b.onclick=()=>{toggleStepComplete(Number(b.dataset.stepCheck));$('stepCards').querySelector(`[data-step-check="${b.dataset.stepCheck}"]`)?.focus({preventScroll:true})});
 $('stepNavigation').hidden=!stepMode;$('stepPrev').disabled=stepIndex===0;$('stepNext').disabled=false;$('stepNext').textContent=stepIndex===all.length-1?'完成教學':'完成並繼續';$('stepProgress').innerHTML=`<span>步驟</span><b>${stepIndex+1}</b><span>/ ${all.length}</span>`;
}
function renderLampCatalog(){
 const q=normalize($('lampSearch').value),kind=$('lampKind').value;
 const list=LAMPS.filter(l=>(!kind||l.kind===kind)&&normalize(l.title+l.state+l.meaning+l.action).includes(q));
 $('lampCount').textContent=`顯示 ${list.length}／43 項`;
 $('lampCatalog').innerHTML=list.length?list.map(l=>`<button class="lamp-entry" data-lamp="${l.id}"><img src="${l.image}" alt="" loading="lazy"><div><small>${l.kind}・${escapeHTML(l.state)}</small><h4>${escapeHTML(l.title)}</h4><p>${escapeHTML(l.meaning)}</p><p class="lamp-action"><b>處理方式</b> ${escapeHTML(l.action)}</p><span class="lamp-ref">${escapeHTML(refsLabel(l.refs))} · 點選詳讀與原圖</span></div></button>`).join(''):'<p>沒有符合的燈號，請換個關鍵字或選擇全部類型。</p>';
 $('lampCatalog').querySelectorAll('[data-lamp]').forEach(b=>b.onclick=()=>openTopic(b.dataset.lamp));
}
function toggleStepComplete(i){
 const key=activeTopic.id+':'+i;if(completedSteps.has(key))completedSteps.delete(key);else completedSteps.add(key);renderSteps();
 const card=$('stepCards').querySelector(`[data-step-check="${i}"]`)?.closest('li');if(card)card.classList.add('just-toggled');
}
function advanceStep(){
 if(!activeTopic)return;completedSteps.add(activeTopic.id+':'+stepIndex);stepDirection='forward';
 if(stepIndex<activeTopic.steps.length-1){stepIndex++;renderSteps();return}
 stepMode=false;renderSteps();$('stepCards').querySelector('.lesson-complete')?.scrollIntoView({block:'center',behavior:'auto'});
}
function openFigure(key){
 let f=FIGURES[key];if(!f&&key.startsWith('page:')){const p=pageMap.get(key.slice(5));if(p)f={image:p.image,ref:p.id,title:names[p.doc]+' '+p.label,caption:'完整手冊原頁。可放大閱讀文字與圖示。'}}if(!f)return;
 figureKey=f;figureZoom=1;$('figureTitle').textContent=f.title;$('figureImage').src=f.image;$('figureImage').alt=f.title;$('figureCaption').textContent=f.caption+'｜'+refsLabel([f.ref]);setFigureZoom(1);$('figureViewport').scrollTop=0;$('figureViewport').scrollLeft=0;if(!$('figure').open)$('figure').showModal();
}
function setFigureZoom(value){figureZoom=Math.max(1,Math.min(3,value));$('figureImage').style.width=(figureZoom*100)+'%';$('zoomReset').textContent=Math.round(figureZoom*100)+'%';$('zoomOut').disabled=figureZoom<=1;$('zoomIn').disabled=figureZoom>=3}
$('closeFigure').onclick=()=>$('figure').close();$('zoomIn').onclick=()=>setFigureZoom(figureZoom+.25);$('zoomOut').onclick=()=>setFigureZoom(figureZoom-.25);$('zoomReset').onclick=()=>setFigureZoom(1);$('figureSource').onclick=()=>{const ref=figureKey?.ref;$('figure').close();if(ref)openReader(ref)};

function returnToResults(){const el=$('resultTitle');el.scrollIntoView({block:'start',behavior:'auto'})}
function chooseMobileCategory(c){category=c;view='topics';limit=30;query='';doc='all';$('search').value='';$('docfilter').value='all';render();$('topicMenu').close();returnToResults()}
$('mobileCategories').onclick=()=>{$('topicMenuItems').innerHTML=CATEGORIES.map(c=>`<button data-mobile-cat="${escapeHTML(c)}" aria-pressed="${category===c}"><span>${escapeHTML(c)}</span><small>${c==='全部重點'?topics.length:topics.filter(t=>t.category===c).length} 項</small></button>`).join('');$('topicMenuItems').querySelectorAll('button').forEach(b=>b.onclick=()=>chooseMobileCategory(b.dataset.mobileCat));$('topicMenu').showModal()};
$('closeTopicMenu').onclick=()=>$('topicMenu').close();$('mobileSearch').onclick=()=>{$('search').scrollIntoView({block:'center',behavior:'auto'});$('search').focus({preventScroll:true})};$('mobileManual').onclick=()=>openReader('owner-1');
$('lessonNav').querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{const el=$(b.dataset.jump);if(el)el.scrollIntoView({block:'start',behavior:'auto'})});
$('topicTotal').textContent=topics.length;render();fetch('pages.json').then(r=>{if(!r.ok)throw Error('load');return r.json()}).then(data=>{pages=data;pageMap=new Map(data.map(p=>[p.id,p]));loaded=true;render()}).catch(()=>{$('loadError').hidden=false;$('resultCount').textContent='原文載入失敗'});
