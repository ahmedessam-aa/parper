'use strict';

const QuranModule = (()=>{
  const API_BASE = 'https://api.alquran.cloud/v1';
  let surahs = [];   // list metadata
  let currentSurah = null;
  let loadedOnce = false;

  function saveLastRead(surahNumber, surahName){
    localStorage.setItem('azkar_last_read', JSON.stringify({ n: surahNumber, name: surahName, at: Date.now() }));
    renderContinueCard();
  }

  function renderContinueCard(){
    const raw = localStorage.getItem('azkar_last_read');
    const card = document.getElementById('continueCard');
    if(!raw){ card.style.display = 'none'; return; }
    const data = JSON.parse(raw);
    document.getElementById('continueLabel').textContent = `سورة ${data.name}`;
    card.style.display = 'flex';
    document.getElementById('continueBtn').onclick = ()=> openSurah(data.n);
  }

  async function loadSurahList(){
    const container = document.getElementById('surahList');
    try{
      const res = await fetch(`${API_BASE}/surah`);
      if(!res.ok) throw new Error('failed');
      const json = await res.json();
      surahs = json.data;
      renderSurahList(surahs);
    }catch(e){
      container.innerHTML = `<div class="state-msg">تعذّر تحميل قائمة السور. تحقق من اتصال الإنترنت وحاول مرة أخرى.
        <br><button class="btn btn-outline btn-block" id="retrySurahList" style="margin-top:14px;max-width:240px;margin-inline:auto;">إعادة المحاولة</button></div>`;
      document.getElementById('retrySurahList')?.addEventListener('click', loadSurahList);
    }
  }

  function renderSurahList(list){
    const container = document.getElementById('surahList');
    if(list.length === 0){
      container.innerHTML = `<div class="state-msg">لا توجد نتائج مطابقة</div>`;
      return;
    }
    container.innerHTML = list.map(s => `
      <button class="surah-row" data-n="${s.number}">
        <div class="left">
          <div class="surah-num">${s.number}</div>
          <div class="surah-names">
            <b>${s.englishName}</b>
            <span>${s.englishNameTranslation} · ${s.numberOfAyahs} آية · ${s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
          </div>
        </div>
        <div class="ar-name">${s.name}</div>
      </button>
    `).join('');
    container.querySelectorAll('.surah-row').forEach(btn=>{
      btn.addEventListener('click', ()=> openSurah(parseInt(btn.dataset.n,10)));
    });
  }

  function filterSurahs(query){
    const q = query.trim().toLowerCase();
    if(!q){ renderSurahList(surahs); return; }
    const filtered = surahs.filter(s =>
      s.englishName.toLowerCase().includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      s.name.includes(query.trim()) ||
      String(s.number) === q
    );
    renderSurahList(filtered);
  }

  async function openSurah(number){
    document.getElementById('quranListView').style.display = 'none';
    document.getElementById('quranReaderView').style.display = 'block';
    window.scrollTo({top:0, behavior:'smooth'});

    const ayahContainer = document.getElementById('ayahContainer');
    ayahContainer.innerHTML = `<div class="state-msg"><div class="spin"></div>جارِ تحميل الآيات…</div>`;

    try{
      const res = await fetch(`${API_BASE}/surah/${number}/quran-uthmani`);
      if(!res.ok) throw new Error('failed');
      const json = await res.json();
      const data = json.data;
      currentSurah = data;

      document.getElementById('readerSurahName').textContent = `سورة ${data.name}`;
      document.getElementById('readerSurahMeta').textContent =
        `${data.englishName} — ${data.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} — ${data.numberOfAyahs} آية`;

      const bismillahEl = document.getElementById('readerBismillah');
      bismillahEl.textContent = (number !== 1 && number !== 9) ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : '';

      let html = '';
      data.ayahs.forEach(a=>{
        let text = a.text;
        // remove bismillah duplication that API sometimes includes in ayah 1
        html += `${text} <span class="ayah-num">${a.numberInSurah}</span> `;
      });
      ayahContainer.innerHTML = html;

      saveLastRead(number, data.name);
    }catch(e){
      ayahContainer.innerHTML = `<div class="state-msg">تعذّر تحميل السورة. تحقق من الاتصال وحاول مرة أخرى.</div>`;
    }
  }

  function initReaderNav(){
    document.getElementById('quranBackBtn').addEventListener('click', ()=>{
      document.getElementById('quranReaderView').style.display = 'none';
      document.getElementById('quranListView').style.display = 'block';
    });
    document.getElementById('prevSurahBtn').addEventListener('click', ()=>{
      if(currentSurah && currentSurah.number > 1) openSurah(currentSurah.number - 1);
    });
    document.getElementById('nextSurahBtn').addEventListener('click', ()=>{
      if(currentSurah && currentSurah.number < 114) openSurah(currentSurah.number + 1);
    });
  }

  function onEnter(){
    if(!loadedOnce){
      loadedOnce = true;
      loadSurahList();
      document.getElementById('surahSearch').addEventListener('input', (e)=> filterSurahs(e.target.value));
      initReaderNav();
    }
    renderContinueCard();
  }

  return { onEnter, openSurah };
})();
window.QuranModule = QuranModule;
