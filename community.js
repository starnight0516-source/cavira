/* Public media / community troubleshooting supplements.
   These entries are intentionally separated from official-manual topics. */
(()=>{
  const CAT='車友實測與排除';
  if(!CATEGORIES.includes(CAT)) CATEGORIES.push(CAT);

  const COMMUNITY=[
    ['community-nav-black','車友實測與排除','儀錶導航突然黑屏，先怎麼處理？','公開媒體試駕曾遇到儀錶導航地圖黑屏。先把車停妥，再用官方允許的 FoxtronLink 重啟方式排除；若重複發生，記錄軟體版本與發生情境並回報服務中心。',['安全停車並切至 P 檔，不要一邊行駛一邊嘗試重啟。','長按方向盤左側首頁鍵約 5 秒，依官方車機手冊執行 FoxtronLink 重新啟動。','重新啟動後確認導航、儀錶與其他警示是否恢復正常。','如果再次發生，拍下畫面並記錄日期、SOC、手機連線方式、導航 App 與車機版本，提供服務中心判讀。'],'這是媒體試駕觀察，不代表所有量產車都有相同問題。若同時出現重要行車警示、儀錶資訊缺失或重啟後仍異常，不要自行反覆操作，應聯絡服務中心。',['media-13'],'黑屏 儀表 儀錶 導航 地圖 CarPlay 當機 重啟 reboot TechNews',true],
    ['community-bsv-freeze','車友實測與排除','打方向燈後盲點視野畫面卡住／不顯示','至少兩家公開媒體在試駕期間提到盲點視野輔助偶發當機或異常，因此可列為「多來源媒體觀察」，但仍不能直接視為量產通病。',['先以後視鏡、回頭確認與實際路況為主，不要依賴卡住的影像。','安全停車後確認鏡頭表面是否有雨水、污垢或遮擋。','若只是畫面軟體異常，可在停妥後嘗試重啟 FoxtronLink。','若經常重現，記錄左右側、車速、天候與版本，交由服務中心檢查。'],'盲點視野輔助是輔助功能，畫面異常時仍應依後視鏡與直接目視判斷；不要因影像消失而持續變換車道。',['owner-239','media-62'],'盲點 視野 BSV 側鏡頭 當機 卡住 方向燈 U-CAR UDN',true],
    ['community-split-black','車友實測與排除','車機分割畫面其中一格變黑','公開媒體試駕曾短暫遇到分割畫面其中一面呈現黑畫面。可先以軟體顯示異常方式處理，不要直接判定硬體故障。',['安全停車後先切換到首頁或其他頁面，再返回原功能確認是否恢復。','若仍黑屏，停妥並切 P 檔後依手冊重新啟動 FoxtronLink。','重啟後若恢復，仍建議記錄當時使用的 CarPlay／Android Auto、App 與分割畫面組合。','重複發生或伴隨觸控失效、警告訊息時，回服務中心檢查。'],'目前屬媒體試駕案例；軟體版本可能已更新，判斷時要連同發生日期與版本一起看。',['media-13'],'分割畫面 黑屏 車機 中控 CarPlay Android Auto UDN'],
    ['community-reverse-delay','車友實測與排除','R 檔後倒車影像切換比較慢？','公開媒體試駕曾描述 D 檔切 R 檔後，環景／倒車畫面約需接近 1 秒才出現。若你的車也出現明顯延遲，應以實際周遭環境為主，不要等畫面才開始確認安全。',['切入 R 檔後先確認車輛確實進入倒車狀態，並以後視鏡及直接目視確認周遭。','等待環景畫面完整出現後再把它當作額外輔助資訊。','若延遲突然比平常更久、畫面不出現或持續卡住，先安全停車再重新啟動車機。','可錄下切檔到畫面出現的時間，若經常異常就提供服務中心判讀。'],'倒車影像及雷達都是輔助系統；畫面延遲時不可把人車安全判斷交給螢幕。',['media-92','media-107'],'倒車 顯影 R檔 延遲 環景 AR View 雷達 UDN'],
    ['community-wireless-charge','車友實測與排除','手機無線充電忽充忽停／不穩定','公開媒體試駕曾遇到無線充電不穩。單一試駕案例不足以判定通病，但可以保留為排查項目。',['先重新放正手機位置，確認手機確實支援 Qi 無線充電。','移除可能影響感應的厚保護殼、磁吸環或金屬物後再次測試。','若手機過熱，先停止無線充電並改用 USB-C 有線充電，待溫度下降再試。','多支相容手機都會反覆中斷時，記錄狀況並請服務中心檢查充電座。'],'此項目前主要來自媒體試駕觀察；不同手機、保護殼、溫度及擺放位置都可能影響結果。',['media-17'],'無線充電 Qi 手機 充電板 忽充忽停 過熱 UDN'],
    ['community-charge-door','車友實測與排除','充電口蓋按了沒反應，是故障嗎？','公開論壇曾出現「以為充電口蓋打不開」的討論。CAVIRA 的開啟方式其實會隨 OFF／ON／READY 狀態不同，先核對官方條件再判定是否故障。',['先確認車輛目前是 OFF、ON 還是 READY。','ON 狀態可由車機「行李廂／充電口」或外蓋開關開啟；OFF 可使用外蓋開關。','READY 狀態外蓋開關不可用，應使用車機操作；車輛解鎖時也可依手冊使用遙控器方式。','照官方方式仍無反應，再重新上鎖／解鎖一次；持續異常則聯絡服務中心。'],'這一題最容易把「操作條件不符」誤認成故障。論壇說法只當案例提示，實際操作條件以官方手冊為準。',['owner-43','owner-44'],'充電口 充電門 護蓋 打不開 長按 READY OFF ON Mobile01',true],
    ['community-ota-fail','車友實測與排除','OTA 更新很久、失敗或更新後怪怪的怎麼辦？','CAVIRA 原廠支援整車 OTA；官方車機手冊也提醒軟體安裝可能需要數小時，安裝期間車輛功能可能受限，且更新失敗時不應駕駛。',['開始更新前確認車輛已停妥，並依畫面提示滿足更新條件。','安裝期間不要嘗試駕駛，也不要因為時間比預期久就任意中斷程序。','如果系統明確顯示更新失敗，依手冊指示不要駕駛並聯絡服務中心。','更新完成後若出現新的重複性異常，記錄版本號、時間與症狀，方便原廠追查。'],'論壇對 OTA 速度與成熟度有不少主觀討論，但不能直接套用到特定 CAVIRA 軟體版本；本頁處置仍以官方手冊為主。',['media-68'],'OTA 更新 失敗 軟體 安裝 版本 Debug Mobile01',true],
    ['community-adas-weather','車友實測與排除','下雨、鏡頭髒污時 ADAS 變得不靈？','網路討論常把雨天辨識能力描述成故障；官方手冊本來就提醒攝影機與駕駛輔助會受到惡劣天候、髒污、道路標線與環境條件影響。',['雨勢大、起霧或視線差時降低對 ADAS 的依賴，主動控制車速與車距。','確認前擋攝影機、環景鏡頭與感知器區域沒有泥水、霧氣或遮擋。','若儀錶顯示功能暫停或不可用，依警示內容駕駛，不要強迫系統介入。','天候恢復且鏡頭清潔後仍持續異常，再交由服務中心檢查。'],'這類情境要區分「系統設計限制」與「真正故障」。單一論壇抱怨不足以證明車輛異常。',['owner-211','media-5'],'下雨 大雨 ADAS 鏡頭 雷達 感知器 車道 ACC AEB Mobile01']
  ];

  const existing=new Set(TOPICS.map(t=>t[0]));
  COMMUNITY.forEach(t=>{ if(!existing.has(t[0])) TOPICS.push(t); });

  window.CAVIRA_COMMUNITY_META={
    'community-nav-black':{level:'媒體實測',tone:'green',status:'已確認有公開案例；非量產通病',checked:'2026-09-14',sources:[
      {name:'TechNews｜CAVIRA 第一手試駕',url:'https://technews.tw/2026/06/12/foxtron-cavira-first-test-drive/',note:'試駕期間遇到儀錶導航地圖黑屏'}]},
    'community-bsv-freeze':{level:'多來源媒體實測',tone:'green',status:'兩個獨立媒體提到類似現象',checked:'2026-09-14',sources:[
      {name:'U-CAR｜Foxtron Cavira 試駕',url:'https://newcar.u-car.com.tw/Foxtron/Cavira/7220/article/351120',note:'盲點視野輔助偶爾當機'},
      {name:'聯合新聞網｜CAVIRA 試駕',url:'https://autos.udn.com/autos/story/7828/9565312',note:'試駕遇到盲點視野輔助偶發異常'}]},
    'community-split-black':{level:'媒體實測',tone:'green',status:'已有公開案例；版本差異需持續追蹤',checked:'2026-09-14',sources:[
      {name:'聯合新聞網｜CAVIRA 試駕',url:'https://autos.udn.com/autos/story/7828/9565312',note:'分割畫面曾短暫出現單一區塊黑屏'}]},
    'community-reverse-delay':{level:'媒體實測',tone:'green',status:'試駕車曾被觀察到切換延遲',checked:'2026-09-14',sources:[
      {name:'聯合新聞網｜CAVIRA 試駕',url:'https://autos.udn.com/autos/story/7828/9565312',note:'D 檔切 R 檔後倒車畫面約接近 1 秒出現'}]},
    'community-wireless-charge':{level:'媒體實測',tone:'yellow',status:'單一媒體案例，待更多量產車回報',checked:'2026-09-14',sources:[
      {name:'聯合新聞網｜CAVIRA 試駕',url:'https://autos.udn.com/autos/story/7828/9565312',note:'試駕期間遇到無線充電不穩'}]},
    'community-charge-door':{level:'論壇單一討論',tone:'orange',status:'先視為操作疑問，不視為通病',checked:'2026-09-14',sources:[
      {name:'Mobile01｜CAVIRA 上市討論',url:'https://www.mobile01.com/topicdetail.php?f=1562&p=2&t=7271165',note:'網友提及試駕時對充電口蓋開啟方式產生疑問'}]},
    'community-ota-fail':{level:'官方規範＋社群關注',tone:'blue',status:'處置方式以官方手冊為準',checked:'2026-09-14',sources:[
      {name:'FOXTRON／鴻華先進｜CAVIRA OTA 說明',url:'https://www.foxconn.com.tw/zh-tw/press-center/press-releases/latest-news/2020',note:'官方說明 CAVIRA 支援車聯網與整車 OTA 更新'},
      {name:'Mobile01｜CAVIRA OTA 討論',url:'https://www.mobile01.com/topicdetail.php?f=294&t=7263303',note:'社群對 OTA 更新成熟度與速度的討論；屬意見性資料'}]},
    'community-adas-weather':{level:'官方限制＋論壇討論',tone:'blue',status:'天候影響屬已知系統限制；不等於故障',checked:'2026-09-14',sources:[
      {name:'Mobile01｜CAVIRA 上市討論',url:'https://www.mobile01.com/topicdetail.php?f=1562&p=2&t=7271165',note:'社群有人質疑雨天辨識；網站以官方手冊限制條件校正解讀'}]}
  };
})();
