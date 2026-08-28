'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

const API_URL = 'https://tts-gateway-790311698684.asia-east2.run.app/v1/tts';

const languages = {
  'en-GB': { label: 'English', nativeLabel: 'English (UK)', voiceName: 'Amy', placeholder: 'Thank you for calling the Sino Group Bill Enquiry Hotline. Goodbye.' },
  'cmn-CN': { label: 'Mandarin', nativeLabel: '普通话', voiceName: 'Zhiyu', placeholder: '感谢您致电信和集团账单查询热线，再见。' },
  'yue-CN': { label: 'Cantonese', nativeLabel: '廣東話', voiceName: 'Hiujin', placeholder: '感谢您致电信和集团账单查询热线，再见。' },
} as const;

type Language = keyof typeof languages;

export default function Home() {
  const [lang, setLang] = useState<Language>('en-GB');
  const [text, setText] = useState<string>(languages['en-GB'].placeholder);
  const [rate, setRate] = useState(110);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  function changeLanguage(nextLang: Language) {
    setLang(nextLang);
    setText(languages[nextLang].placeholder);
    setError('');
  }

  async function generateSpeech(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) { setError('Please enter some text first.'); return; }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), lang, rate: `${rate.toFixed(2)}%`, voiceName: languages[lang].voiceName, provider: 'aws' }),
      });
      if (!response.ok) throw new Error(`The voice service returned ${response.status}.`);
      const nextUrl = URL.createObjectURL(await response.blob());
      setAudioUrl((currentUrl) => { if (currentUrl) URL.revokeObjectURL(currentUrl); return nextUrl; });
      requestAnimationFrame(() => audioRef.current?.play().catch(() => undefined));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Audio could not be generated. Please try again.');
    } finally { setIsLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[#f4f1e9] px-4 py-4 text-[#17211c] sm:px-7 sm:py-7">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1180px] flex-col overflow-hidden rounded-[30px] border border-[#d8d5ca] bg-[#fbfaf6] shadow-[0_24px_70px_rgba(37,43,39,0.12)] sm:min-h-[calc(100vh-3.5rem)]">
        <header className="flex items-center justify-between border-b border-[#dfddd5] px-6 py-5 sm:px-10">
          <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#173d2b] text-[#f2d36b]"><SoundMark /></div><span className="text-[15px] font-semibold tracking-[-0.01em]">Sino Voice Studio</span></div>
          <span className="rounded-full border border-[#d8d5ca] bg-white px-3 py-1.5 text-xs font-medium text-[#657068]">AWS Neural Voice</span>
        </header>

        <div className="grid flex-1 lg:grid-cols-[0.93fr_1.07fr]">
          <section className="flex flex-col justify-between border-b border-[#dfddd5] bg-[#173d2b] p-7 text-white lg:border-b-0 lg:border-r lg:p-12">
            <div>
              <p className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f2d36b]"><span className="h-px w-7 bg-[#f2d36b]" /> Text to speech</p>
              <h1 className="max-w-lg text-[clamp(2.6rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.055em]">Give your words a voice.</h1>
              <p className="mt-7 max-w-md text-base leading-7 text-[#cbd7cf]">Create clear, natural audio in English, Mandarin, or Cantonese. Ready to play and download in seconds.</p>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-3 border-t border-white/15 pt-6 text-sm"><Stat value="3" label="Languages" /><Stat value="MP3" label="Audio format" /><Stat value="AWS" label="Provider" /></div>
          </section>

          <section className="flex items-center p-5 sm:p-9 lg:p-12">
            <form className="w-full" onSubmit={generateSpeech}>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7d877f]">01 / Language</p>
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-[#eceae3] p-1.5">
                  {(Object.keys(languages) as Language[]).map((code) => (
                    <button key={code} type="button" aria-pressed={lang === code} onClick={() => changeLanguage(code)} className={`rounded-xl px-2 py-3 text-left transition sm:px-4 ${lang === code ? 'bg-white text-[#173d2b] shadow-sm' : 'text-[#707a73] hover:text-[#173d2b]'}`}>
                      <span className="block text-[13px] font-semibold sm:text-sm">{languages[code].label}</span><span className="mt-0.5 block text-[10px] opacity-65 sm:text-xs">{languages[code].nativeLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-end justify-between"><label htmlFor="speech-text" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7d877f]">02 / Your script</label><span className="text-xs tabular-nums text-[#8a928c]">{text.length} characters</span></div>
                <div className="relative mt-3">
                  <textarea id="speech-text" value={text} maxLength={3000} onChange={(event) => setText(event.target.value)} rows={6} className="w-full resize-none rounded-2xl border border-[#d5d3ca] bg-white p-5 pb-12 text-[17px] leading-7 outline-none transition placeholder:text-[#a5aaa6] focus:border-[#62806f] focus:ring-4 focus:ring-[#dce7df]" placeholder="Enter the words you want to hear..." />
                  <span className="absolute bottom-4 left-5 rounded-full bg-[#edf3ef] px-2.5 py-1 text-[11px] font-medium text-[#43604f]">Voice: {languages[lang].voiceName}</span>
                </div>
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <div className="flex items-center justify-between"><label htmlFor="speech-rate" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7d877f]">03 / Speaking speed</label><output className="text-sm font-semibold tabular-nums text-[#173d2b]">{rate}%</output></div>
                  <input id="speech-rate" type="range" min="70" max="150" step="5" value={rate} onChange={(event) => setRate(Number(event.target.value))} className="mt-4 w-full accent-[#d0a900]" />
                  <div className="mt-1 flex justify-between text-[10px] text-[#8b938e]"><span>Slower</span><span>Faster</span></div>
                </div>
                <button type="submit" disabled={isLoading} className="group flex h-[54px] min-w-[190px] items-center justify-center gap-3 rounded-full bg-[#e5bd2b] px-6 text-sm font-bold text-[#17211c] shadow-[0_8px_20px_rgba(190,151,10,0.22)] transition hover:bg-[#f0cb42] disabled:cursor-wait disabled:opacity-65">{isLoading ? <Spinner /> : <PlayIcon />}{isLoading ? 'Creating audio…' : 'Generate audio'}</button>
              </div>

              <div aria-live="polite" className="mt-6 min-h-20">
                {error && <p className="rounded-xl border border-[#e4c3b8] bg-[#fff4f0] px-4 py-3 text-sm text-[#8d3f2b]">{error}</p>}
                {audioUrl && !error && <div className="flex flex-col gap-3 rounded-2xl border border-[#cad8cf] bg-[#eef5f0] p-4 sm:flex-row sm:items-center"><audio ref={audioRef} controls src={audioUrl} className="h-10 min-w-0 flex-1" /><a href={audioUrl} download={`sino-voice-${lang}.mp3`} className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#aebfb4] bg-white px-4 text-sm font-semibold text-[#254432] transition hover:border-[#627c6b]"><DownloadIcon /> Download MP3</a></div>}
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) { return <div><strong className="block text-base font-semibold text-white">{value}</strong><span className="mt-1 block text-[11px] text-[#aebfb4]">{label}</span></div>; }
function SoundMark() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 14.5v-5M9.5 17.5v-11M14 15.5v-7M18.5 13.5v-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>; }
function PlayIcon() { return <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 5 7 5-7 5V5Z" fill="currentColor" /></svg>; }
function DownloadIcon() { return <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3v9m0 0 3-3m-3 3L7 9M4 15.5h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Spinner() { return <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#17211c]/25 border-t-[#17211c]" aria-hidden="true" />; }
