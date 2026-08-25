'use strict';

/*
  ملاحظة هامة:
  الإشعارات هنا تعمل عبر جدولة محلية داخل المتصفح (JS timers) بينما التطبيق
  مفتوح أو يعمل في الخلفية على المتصفحات التي تدعم ذلك بعد تثبيت PWA.
  لتفعيل إشعارات Push حقيقية تصل حتى لو كان التطبيق مغلقًا تمامًا، يلزم
  خادم Push خلفي (Push Server + VAPID keys) وهو خارج نطاق موقع ثابت
  HTML/CSS/JS فقط. هذا الحل هو أفضل بديل ممكن بدون Backend.
*/

const NotificationsModule = (()=>{
  let checkInterval = null;
  const firedToday = new Set();
  let firedDate = '';

  async function requestPermission(){
    if(!('Notification' in window)){
      showToast('المتصفح لا يدعم الإشعارات');
      return false;
    }
    if(Notification.permission === 'granted') return true;
    if(Notification.permission === 'denied') return false;
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }

  async function fireNotification(title, body, tag){
    if(Notification.permission !== 'granted') return;
    try{
      if('serviceWorker' in navigator){
        const reg = await navigator.serviceWorker.getRegistration();
        if(reg){
          reg.showNotification(title, {
            body,
            icon: 'icons/icon-192.png',
            badge: 'icons/icon-192.png',
            tag,
            dir: 'rtl',
            lang: 'ar'
          });
          return;
        }
      }
      new Notification(title, { body, icon: 'icons/icon-192.png', dir:'rtl', lang:'ar' });
    }catch(e){ /* silent */ }
  }

  function todayStr(){
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  }

  function nowHHMM(){
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  function buildSchedule(){
    const schedule = []; // {time:'HH:MM', title, body, tag}

    const prayerOn = localStorage.getItem('notif_prayer') === '1';
    const azkarOn = localStorage.getItem('notif_azkar') === '1';
    const hadithOn = localStorage.getItem('notif_hadith') === '1';

    if(prayerOn && PrayerModule.getTimings()){
      const t = PrayerModule.getTimings();
      const labels = PrayerModule.PRAYER_LABELS;
      ['Fajr','Dhuhr','Asr','Maghrib','Isha'].forEach(key=>{
        const time = t[key].split(' ')[0];
        schedule.push({
          time,
          title: `حان الآن وقت صلاة ${labels[key]}`,
          body: 'حي على الصلاة، حي على الفلاح',
          tag: 'prayer-' + key
        });
      });
    }

    if(azkarOn){
      schedule.push({ time:'06:30', title:'أذكار الصباح', body:'لا تنسَ أذكار الصباح اليوم 🌅', tag:'azkar-morning' });
      schedule.push({ time:'17:30', title:'أذكار المساء', body:'حان وقت أذكار المساء 🌙', tag:'azkar-evening' });
    }

    if(hadithOn){
      const idx = (()=>{
        const now = new Date();
        const start = new Date(now.getFullYear(),0,0);
        return Math.floor((now-start)/86400000) % HADITH_DATA.length;
      })();
      const h = HADITH_DATA[idx];
      schedule.push({ time:'09:00', title:'حديث اليوم', body: h.text.slice(0,80) + '…', tag:'daily-hadith' });
    }

    return schedule;
  }

  function checkTick(){
    if(todayStr() !== firedDate){
      firedDate = todayStr();
      firedToday.clear();
    }
    const schedule = buildSchedule();
    const now = nowHHMM();
    schedule.forEach(item=>{
      const key = item.tag + '-' + item.time;
      if(item.time === now && !firedToday.has(key)){
        firedToday.add(key);
        fireNotification(item.title, item.body, item.tag);
      }
    });
  }

  function refreshSchedules(){
    clearInterval(checkInterval);
    const anyOn = ['notif_prayer','notif_azkar','notif_hadith'].some(k => localStorage.getItem(k) === '1');
    if(!anyOn) return;
    if(Notification.permission !== 'granted') return;
    checkInterval = setInterval(checkTick, 20000);
    checkTick();
  }

  return { requestPermission, refreshSchedules };
})();
window.NotificationsModule = NotificationsModule;
