/* UI support for expanded manual categories */
(()=>{
  const categoryIcons=['▦','ϟ','◉','♢','◇','☀','❄','◈','◎','△','▤','♪','◫','⚙','ⓘ'];
  if(typeof icons!=='undefined') icons.splice(0,icons.length,...categoryIcons);
  if(typeof scenes!=='undefined'){
    Object.assign(scenes,{
      '座椅與安全':{image:'illustration-comfort.webp',alt:'CAVIRA 車主安全操作情境插畫',label:'座椅與安全'},
      '車身與便利':{image:'illustration-screen.webp',alt:'CAVIRA 車輛便利功能情境插畫',label:'車身與便利'},
      '儀表與燈光':{image:'illustration-screen.webp',alt:'CAVIRA 儀表與燈光操作情境插畫',label:'儀表與燈光'},
      '駕駛與煞車':{image:'illustration-comfort.webp',alt:'CAVIRA 駕駛操作情境插畫',label:'駕駛與煞車'},
      'ADAS 駕駛輔助':{image:'illustration-screen.webp',alt:'CAVIRA 駕駛輔助功能情境插畫',label:'ADAS 駕駛輔助'},
      '影音與電話':{image:'illustration-screen.webp',alt:'CAVIRA 影音與電話功能情境插畫',label:'影音與電話'},
      '停車與環景':{image:'illustration-screen.webp',alt:'CAVIRA 停車與環景功能情境插畫',label:'停車與環景'},
      '規格與保固':{image:'illustration-charge.webp',alt:'CAVIRA 規格與保固資訊情境插畫',label:'規格與保固'}
    });
  }
  if(typeof render==='function') render();
})();
