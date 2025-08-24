import React, { useEffect, useMemo, useState } from "react";

// ====================================================================
// Oxford Vocab Trainer — bundled JSON (sabit public yollar)
// ====================================================================

const OXFORD_3000_DEMO = [
  { id: "3000:achieve", word: "achieve", list: "3000", level: "A2", pos: "v.", meaningTr: "başarmak, elde etmek", exampleEn: "She worked hard to achieve her goals.", exampleTr: "Hedeflerine ulaşmak için çok çalıştı." },
  { id: "3000:affect", word: "affect", list: "3000", level: "A2", pos: "v.", meaningTr: "etkilemek", exampleEn: "The new policy will affect small businesses.", exampleTr: "Yeni politika küçük işletmeleri etkileyecek." },
  { id: "3000:analysis", word: "analysis", list: "3000", level: "B1", pos: "n.", meaningTr: "analiz, çözümleme", exampleEn: "The analysis shows a clear trend in the data.", exampleTr: "Analiz verilerde belirgin bir eğilim gösteriyor." },
  { id: "3000:approach", word: "approach", list: "3000", level: "B2", pos: "n./v.", meaningTr: "yaklaşım; yaklaşmak", exampleEn: "We need a different approach to solve this problem.", exampleTr: "Bu problemi çözmek için farklı bir yaklaşıma ihtiyacımız var." },
  { id: "3000:assess", word: "assess", list: "3000", level: "B2", pos: "v.", meaningTr: "değerlendirmek", exampleEn: "The manager will assess the team's performance.", exampleTr: "Yönetici ekibin performansını değerlendirecek." },
  { id: "3000:assume", word: "assume", list: "3000", level: "B2", pos: "v.", meaningTr: "varsaymak", exampleEn: "Don't assume everyone knows the details.", exampleTr: "Herkesin ayrıntıları bildiğini varsayma." },
  { id: "3000:available", word: "available", list: "3000", level: "A2", pos: "adj.", meaningTr: "mevcut, erişilebilir", exampleEn: "The report is available online.", exampleTr: "Rapor çevrimiçi olarak mevcut." },
  { id: "3000:benefit", word: "benefit", list: "3000", level: "A2", pos: "n./v.", meaningTr: "fayda; fayda sağlamak", exampleEn: "Regular exercise has many health benefits.", exampleTr: "Düzenli egzersizin birçok sağlık faydası vardır." },
  { id: "3000:challenge", word: "challenge", list: "3000", level: "B1", pos: "n.", meaningTr: "zorluk; meydan okuma", exampleEn: "Learning a new language is a big challenge.", exampleTr: "Yeni bir dil öğrenmek büyük bir zorluktur." },
  { id: "3000:develop", word: "develop", list: "3000", level: "A2", pos: "v.", meaningTr: "geliştirmek; gelişmek", exampleEn: "The company plans to develop new software.", exampleTr: "Şirket yeni yazılım geliştirmeyi planlıyor." },
];

const OXFORD_5000_DEMO = [
  { id: "5000:abolish", word: "abolish", list: "5000", level: "C1", pos: "v.", meaningTr: "yürürlükten kaldırmak", exampleEn: "They voted to abolish the outdated law.", exampleTr: "Eski yasayı yürürlükten kaldırmaya oy verdiler." },
  { id: "5000:advocate", word: "advocate", list: "5000", level: "C1", pos: "n./v.", meaningTr: "savunucu; savunmak", exampleEn: "She is an advocate for equal education.", exampleTr: "Eşit eğitim için bir savunucudur." },
  { id: "5000:allocate", word: "allocate", list: "5000", level: "C1", pos: "v.", meaningTr: "tahsis etmek, ayırmak", exampleEn: "The budget allocates more funds to research.", exampleTr: "Bütçe araştırmaya daha fazla kaynak ayırıyor." },
  { id: "5000:assert", word: "assert", list: "5000", level: "C1", pos: "v.", meaningTr: "ileri sürmek, iddia etmek", exampleEn: "The study asserts that diet affects sleep quality.", exampleTr: "Çalışma, beslenmenin uyku kalitesini etkilediğini ileri sürüyor." },
  { id: "5000:authentic", word: "authentic", list: "5000", level: "C1", pos: "adj.", meaningTr: "gerçek, sahici", exampleEn: "The museum displays authentic artifacts.", exampleTr: "Müze gerçek eserler sergiliyor." },
  { id: "5000:autonomy", word: "autonomy", list: "5000", level: "C1", pos: "n.", meaningTr: "özerklik", exampleEn: "The region was granted greater autonomy.", exampleTr: "Bölgeye daha fazla özerklik verildi." },
  { id: "5000:clarify", word: "clarify", list: "5000", level: "B2", pos: "v.", meaningTr: "açıklığa kavuşturmak", exampleEn: "Could you clarify what you mean by that term?", exampleTr: "Bu terimle ne demek istediğinizi açıklığa kavuşturabilir misiniz?" },
  { id: "5000:controversial", word: "controversial", list: "5000", level: "B2", pos: "adj.", meaningTr: "tartışmalı", exampleEn: "It is a controversial proposal within the community.", exampleTr: "Topluluk içinde tartışmalı bir öneridir." },
  { id: "5000:compile", word: "compile", list: "5000", level: "C1", pos: "v.", meaningTr: "derlemek, bir araya getirmek", exampleEn: "Researchers compiled data from multiple sources.", exampleTr: "Araştırmacılar çeşitli kaynaklardan verileri derledi." },
  { id: "5000:comply", word: "comply", list: "5000", level: "C1", pos: "v.", meaningTr: "uymak, yerine getirmek", exampleEn: "All devices must comply with safety standards.", exampleTr: "Tüm cihazlar güvenlik standartlarına uymalıdır." },
];

const DEMO_WORDS = [...OXFORD_3000_DEMO, ...OXFORD_5000_DEMO];

const LS_KNOWN = "ovt_known";
const LS_UNKNOWN = "ovt_unknown";
const LS_WORDS_AUTO = "ovt_words_auto";

function loadSet(key){ try { const raw = localStorage.getItem(key); return new Set(raw ? JSON.parse(raw) : []); } catch { return new Set(); } }
function saveSet(key, set){ try { localStorage.setItem(key, JSON.stringify(Array.from(set))); } catch {} }
function loadAuto(){ try{ const raw = localStorage.getItem(LS_WORDS_AUTO); return raw? JSON.parse(raw): []; } catch { return []; } }
function saveAuto(arr){ try{ localStorage.setItem(LS_WORDS_AUTO, JSON.stringify(arr)); } catch{} }

function classNames(...xs){ return xs.filter(Boolean).join(" "); }
function uniqueById(arr){ const m=new Map(); arr.forEach(w=> w && w.id && m.set(w.id, w)); return Array.from(m.values()); }
function isWordItemLike(w){ return w && typeof w.word==="string" && typeof w.list==="string" && typeof w.level==="string"; }

async function tryFetchJson(url){
  try{
    const res = await fetch(url, { cache: "force-cache" });
    if(!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if(Array.isArray(data)) return data.filter(isWordItemLike);
  }catch{}
  return null;
}

const URL_3000 = "/ovt_oxford_3000_clean.json";
const URL_5000 = "/ovt_oxford_5000_clean.json";

function VocabCard({ w, isKnown, isUnknown, onKnown, onUnknown }){
  return (
    <div className="p-3 rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{w.word} <span className="text-xs text-slate-500">({w.level})</span></h3>
          <div className="text-sm text-slate-600">{w.meaningTr}</div>
        </div>
        <div className="flex gap-1">
          <button onClick={onUnknown} className={classNames("px-2 py-1 text-xs rounded border", isUnknown?"bg-rose-100":"")} >❌</button>
          <button onClick={onKnown} className={classNames("px-2 py-1 text-xs rounded border", isKnown?"bg-emerald-100":"")} >✅</button>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [known, setKnown] = useState(() => loadSet(LS_KNOWN));
  const [unknown, setUnknown] = useState(() => loadSet(LS_UNKNOWN));
  const [words, setWords] = useState(() => uniqueById([...DEMO_WORDS, ...loadAuto()]));
  const [autoInfo, setAutoInfo] = useState({ tried:false, loaded:false, c3000:0, c5000:0 });

  useEffect(() => saveSet(LS_KNOWN, known), [known]);
  useEffect(() => saveSet(LS_UNKNOWN, unknown), [unknown]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const d3000 = await tryFetchJson(URL_3000);
      const d5000 = await tryFetchJson(URL_5000);
      if(cancelled) return;
      const pieces = [];
      let c3000 = 0, c5000 = 0;
      if(d3000){ pieces.push(...d3000); c3000 = d3000.length; }
      if(d5000){ pieces.push(...d5000); c5000 = d5000.length; }
      if(pieces.length){
        const merged = uniqueById([...DEMO_WORDS, ...pieces]);
        setWords(merged);
        saveAuto(pieces);
        setAutoInfo({ tried:true, loaded:true, c3000, c5000 });
      } else {
        setAutoInfo({ tried:true, loaded:false, c3000, c5000 });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    console.assert(Array.isArray(DEMO_WORDS) && DEMO_WORDS.length >= 10, "Test A: demo words present");
    const w0 = DEMO_WORDS[0];
    console.assert(typeof w0.word === "string" && w0.list && w0.level, "Test B: word shape ok");
    const cached = loadAuto();
    console.assert(Array.isArray(cached), "Test C: autoload cache array");
  }, []);

  function toggleKnown(id){ setKnown(s=>{const ns=new Set(s); ns.has(id)?ns.delete(id):ns.add(id); return ns;}); }
  function toggleUnknown(id){ setUnknown(s=>{const ns=new Set(s); ns.has(id)?ns.delete(id):ns.add(id); return ns;}); }

  const preview = useMemo(() => words.slice(0, 60), [words]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Oxford Vocab Trainer</h1>
        <div className="flex items-center gap-2 text-xs">
          {autoInfo.tried ? (
            autoInfo.loaded ? (
              <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Gömülü JSON yüklendi ✓ (3000: {autoInfo.c3000}, 5000: {autoInfo.c5000})</span>
            ) : (
              <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">public dosyaları bulunamadı — demo gösteriliyor</span>
            )
          ) : (
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 border">Yükleniyor…</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {preview.map((w)=> (
          <VocabCard key={w.id} w={w} isKnown={known.has(w.id)} isUnknown={unknown.has(w.id)} onKnown={()=>toggleKnown(w.id)} onUnknown={()=>toggleUnknown(w.id)} />
        ))}
      </div>

      {!preview.length && (
        <div className="mt-6 text-sm text-slate-600">Gösterilecek kelime bulunamadı.</div>
      )}

      <div className="mt-6 text-xs text-slate-500">Toplam yüklü kelime: {words.length}. Veri kaynağı: public/ovt_oxford_3000_clean.json + public/ovt_oxford_5000_clean.json (varsa) — yoksa demo.</div>
    </div>
  );
}
