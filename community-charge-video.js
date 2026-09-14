/* User-provided CAVIRA charging-gun troubleshooting video supplement. */
(()=>{
  const id='community-chargegun-video';
  const entry=[
    id,
    '車友實測與排除',
    '充電槍卡住／無法正常拔除：車友實車排除影片',
    '收錄車友實車 Shorts 示範的充電槍問題排除案例。先依官方流程停止充電與解鎖；若仍無法拔除，再查看影片示範與手冊的緊急釋放說明。',
    [
      '先確認充電已停止，充電設備也已停止供電；不要在仍供電時硬拔充電槍。',
      '依官方流程嘗試「解鎖充電埠」、遙控器解鎖或車內門鎖解鎖，再確認充電槍是否可正常取下。',
      '若一般解鎖仍無法排除，可開啟本頁下方的「車友實車排除影片」觀看實際示範；影片屬車友經驗來源，不等同原廠標準程序。',
      '仍無法處理時，依車主手冊查看充電槍緊急釋放拉繩位置與操作，勿暴力拉扯充電槍。',
      '若反覆發生、充電埠有異音／損傷、或紅色異常燈號持續出現，停止使用並聯絡 FOXTRON 服務中心。'
    ],
    '安全優先：任何車友排除法都不能取代官方充電停止、解鎖與緊急釋放程序。若不確定車輛是否仍在供電，請不要拆卸、硬拉或以工具撬動充電槍。',
    ['owner-50','owner-46','owner-17'],
    '充電槍 拔不出來 卡住 解鎖 充電埠 緊急釋放 拉繩 Shorts YouTube 車友 排除 故障',
    true
  ];
  if(typeof TOPICS!=='undefined' && !TOPICS.some(t=>t[0]===id)) TOPICS.push(entry);
  window.CAVIRA_COMMUNITY_META=window.CAVIRA_COMMUNITY_META||{};
  window.CAVIRA_COMMUNITY_META[id]={
    level:'車友實車影片',
    tone:'amber',
    status:'已收錄實車排除案例；安全流程以官方手冊為準',
    checked:'2026-09-14',
    sources:[{
      name:'YouTube Shorts｜CAVIRA 充電槍問題排除示範',
      url:'https://youtube.com/shorts/euzdpVySCQE?feature=shared',
      note:'使用者提供的 CAVIRA 充電槍實車問題排除影片；可由網站直接開啟來源觀看示範。'
    }]
  };
})();
