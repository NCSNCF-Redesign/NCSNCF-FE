/* OCS preference experience adapted for the NCSNCF Jekyll + Flask architecture.
 * No webcam frames are transmitted or persisted by this script.
 * Original OCS reference: assets/js/user-preferences.js and
 * assets/js/pages/dashboard/preferences.js in Open Coding Society pages.
 */
(() => {
  'use strict';
  const KEY = 'ncsncfOCSPreferencesV1';
  const PRESETS = {
    'NCSNCF Default': { bg:'#ffffff', text:'#242124', accent:'#604140' },
    Midnight: {bg:'#0b1220',text:'#e6eef8',accent:'#5392f7'},
    Light: {bg:'#ffffff',text:'#9d174d',accent:'#1759ea'},
    Green: {bg:'#154734',text:'#e6f6ef',accent:'#16eba4'},
    Sepia: {bg:'#f4ecd8',text:'#8b1e1e',accent:'#924307'},
    Cyberpunk: {bg:'#0a0a0f',text:'#f0f0f0',accent:'#f84396'},
    Ocean: {bg:'#0c1929',text:'#e0f2fe',accent:'#06b6d4'},
    Sunset: {bg:'#2a1433',text:'#fbe7d4',accent:'#ff7f6b'}
  };
  const LANGUAGES = {'':'English (Original)',es:'Spanish',fr:'French',de:'German',it:'Italian',pt:'Portuguese',ru:'Russian','zh-CN':'Chinese (Simplified)','zh-TW':'Chinese (Traditional)',ja:'Japanese',ko:'Korean',ar:'Arabic',hi:'Hindi',vi:'Vietnamese',th:'Thai',nl:'Dutch',pl:'Polish',tr:'Turkish',uk:'Ukrainian',he:'Hebrew',fa:'Persian (Farsi)'};
  const defaults = {enabled:false,bg:'#ffffff',text:'#242124',accent:'#604140',selectionColor:'#146b99',font:'system-ui, sans-serif',size:16,buttonStyle:'default',language:'',ttsVoice:'',ttsRate:1,ttsPitch:1,ttsVolume:1,customThemes:{},nodSensitivity:0.45};
  const validColor = s => typeof s === 'string' && /^#[0-9a-f]{6}$/i.test(s);
  function sanitize(raw) {
    const p = {...defaults};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return p;
    p.enabled = raw.enabled === true;
    ['bg','text','accent','selectionColor'].forEach(k=>{if(validColor(raw[k]))p[k]=raw[k];});
    const fonts = ['system-ui, sans-serif','Georgia, serif','Verdana, Arial, sans-serif','monospace'];
    if(fonts.includes(raw.font)) p.font=raw.font;
    const shapes=['default','square','pill']; if(shapes.includes(raw.buttonStyle))p.buttonStyle=raw.buttonStyle;
    if(Object.prototype.hasOwnProperty.call(LANGUAGES,raw.language))p.language=raw.language;
    if(typeof raw.ttsVoice==='string')p.ttsVoice=raw.ttsVoice.slice(0,200);
    for(const [k,min,max] of [['size',12,24],['ttsRate',0.5,2],['ttsPitch',0.5,2],['ttsVolume',0,1],['nodSensitivity',0.1,0.9]]) {
      const n=Number(raw[k]); if(Number.isFinite(n)&&n>=min&&n<=max)p[k]=n;
    }
    if(raw.customThemes && typeof raw.customThemes==='object'&&!Array.isArray(raw.customThemes)){
      for(const [name,theme] of Object.entries(raw.customThemes).slice(0,24)){
        if(typeof name==='string' && name.length<=40 && validColor(theme?.bg)&&validColor(theme?.text)&&validColor(theme?.accent))p.customThemes[name]={bg:theme.bg,text:theme.text,accent:theme.accent};
      }
    }
    return p;
  }
  function getLocal(){try{return sanitize(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{return {...defaults};}}
  let saved=getLocal(), draft={...saved,customThemes:{...saved.customThemes}};
  const clone=p=>structuredClone(p);
  const root=document.documentElement;
  function apply(p=draft){
    root.classList.toggle('ncsncf-ocs-preferences-active',p.enabled);
    const names=['bg','text','accent','selectionColor'];
    for(const n of names) root.style.setProperty('--ocs-pref-'+n,p[n]);
    root.style.setProperty('--ocs-pref-font',p.font);
    root.style.setProperty('--ocs-pref-size',p.size+'px');
    root.dataset.ocsButtonStyle=p.enabled?p.buttonStyle:'default';
    // NCSNCF color tokens remain in the original theme engine; this class adds
    // OCS adjustments without altering the saved NCSNCF theme state.
    if(p.enabled){
      root.style.setProperty('--ncsncf-background',p.bg);
      root.style.setProperty('--ncsncf-text',p.text);
      root.style.setProperty('--ncsncf-accent',p.accent);
      root.style.setProperty('--ncsncf-links',p.accent);
    }
  }
  function store(){try{localStorage.setItem(KEY,JSON.stringify(saved));}catch(e){console.warn('OCS local save unavailable',e);}}
  function update(p){draft=sanitize({...draft,...p});apply();document.dispatchEvent(new Event('ncsncf-ocs-dirty'));}
  function beginPreview(){draft=clone(saved);apply();}
  function cancelPreview(){draft=clone(saved);apply();}
  function commit(){saved=clone(draft);store();apply();translate(saved.language);return clone(saved);}
  function resetPreview(){draft=clone(defaults);apply();}
  function loadFromAccount(prefs){saved=sanitize(prefs);draft=clone(saved);store();apply();translate(saved.language);}
  function getSaved(){return clone(saved);}
  function contrast(a,b){
    const luminance=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];};
    const l=[luminance(a),luminance(b)].sort((x,y)=>x-y);return (l[1]+0.05)/(l[0]+0.05);
  }
  function el(tag,opts={},text){const n=document.createElement(tag);Object.assign(n,opts);if(text!==undefined)n.textContent=text;return n;}
  function field(label,control,desc){const box=el('label',{className:'ocs-prefs-field'});box.append(el('strong',{},label),control);if(desc)box.append(el('small',{},desc));return box;}
  function select(label,options,value,change){const s=el('select',{value});for(const [v,name] of options){const o=el('option',{value:v},name);s.append(o);}s.value=value;s.addEventListener('change',()=>change(s.value));return field(label,s);}
  function color(label,key){const i=el('input',{type:'color',value:draft[key]});i.addEventListener('input',()=>{update({[key]:i.value,enabled:true});refreshContrast();});return field(label,i);}
  let contrastEl=null;
  function refreshContrast(){if(!contrastEl)return;const c=contrast(draft.bg,draft.text);contrastEl.textContent=`Text contrast: ${c.toFixed(2)}:1 — ${c>=4.5?'WCAG AA normal text':'below WCAG AA (4.5:1)'}`;contrastEl.dataset.ok=String(c>=4.5);}
  function appearance(grid){
    grid.append(select('OCS preset theme',Object.keys(PRESETS).map(n=>[n,n]),'NCSNCF Default',name=>{update({enabled:true,...PRESETS[name]});mount(grid,0);}));
    grid.append(color('Background','bg'),color('Text','text'),color('Accent','accent'),color('Selection highlight','selectionColor'));
    grid.append(select('Font',[['system-ui, sans-serif','System'],['Georgia, serif','Serif'],['Verdana, Arial, sans-serif','Readable'],['monospace','Monospace']],draft.font,v=>update({font:v,enabled:true})));
    grid.append(select('Button shape',[['default','Default'],['square','Square'],['pill','Pill']],draft.buttonStyle,v=>update({buttonStyle:v,enabled:true})));
    const size=el('input',{type:'range',min:12,max:24,step:1,value:draft.size});size.addEventListener('input',()=>update({size:Number(size.value),enabled:true}));grid.append(field('Font size (12–24 px)',size));
    contrastEl=el('p',{className:'ocs-prefs-contrast',role:'status'});grid.append(contrastEl);refreshContrast();
    const preview=el('div',{className:'ocs-prefs-preview'},'Sample text and accessible links — the website updates live as you choose settings.');grid.append(preview);
    const enable=el('input',{type:'checkbox',checked:draft.enabled});enable.addEventListener('change',()=>update({enabled:enable.checked}));grid.append(field('Apply OCS appearance on the site',enable));
    const savedThemes=Object.keys(draft.customThemes);
    if(savedThemes.length){grid.append(select('My saved themes',[['','Choose a theme'],...savedThemes.map(n=>[n,n])],'',n=>{if(n){update({enabled:true,...draft.customThemes[n]});mount(grid,0);}}));}
    const name=el('input',{type:'text',maxLength:40,placeholder:'Theme name',className:'ocs-prefs-name'});
    const add=el('button',{type:'button',className:'ocs-prefs-action'},'Save named theme');add.addEventListener('click',()=>{const n=name.value.trim();if(!n)return;if(Object.keys(draft.customThemes).length>=24&&!draft.customThemes[n])return;update({customThemes:{...draft.customThemes,[n]:{bg:draft.bg,text:draft.text,accent:draft.accent}}});name.value='';mount(grid,0);});
    const row=el('div',{className:'ocs-prefs-tools'});row.append(name,add);grid.append(row);
    const hint=el('p',{className:'ocs-prefs-note'},'Preview updates immediately. Use the main Save Preferences button to store settings and sync your signed-in account.');grid.append(hint);
  }
  // Uses the OCS Google Translate embed approach. If that service is unavailable,
  // the language remains saved but the current page may not translate.
  let translateLoaded=false;
  function translate(lang){
    root.dataset.ocsLanguage=lang;
    if(!lang){document.cookie='googtrans=;path=/;max-age=0';return;}
    document.cookie=`googtrans=/en/${encodeURIComponent(lang)};path=/;SameSite=Lax`;
    if(translateLoaded)return;
    translateLoaded=true;
    window.googleTranslateElementInit=()=>{if(window.google?.translate?.TranslateElement){new window.google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'ocs_google_translate_element');}};
    let target=document.getElementById('ocs_google_translate_element');
    if(!target){target=el('div',{id:'ocs_google_translate_element',hidden:true});document.body.append(target);}
    const script=el('script',{src:'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit',async:true});document.head.append(script);
  }
  function speak(text){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();if(!text.trim())return;const msg=new SpeechSynthesisUtterance(text);const voice=window.speechSynthesis.getVoices().find(v=>v.name===draft.ttsVoice);if(voice)msg.voice=voice;msg.rate=draft.ttsRate;msg.pitch=draft.ttsPitch;msg.volume=draft.ttsVolume;window.speechSynthesis.speak(msg);}
  function voice(grid){
    grid.append(select('Language',Object.entries(LANGUAGES),draft.language,v=>{update({language:v});}));
    const voices='speechSynthesis' in window?window.speechSynthesis.getVoices():[];
    grid.append(select('Read-aloud voice',[['','Browser default'],...voices.map(v=>[v.name,`${v.name} (${v.lang})`])],draft.ttsVoice,v=>update({ttsVoice:v})));
    for(const [key,label,min,max,step] of [['ttsRate','Speech speed',0.5,2,0.1],['ttsPitch','Speech pitch',0.5,2,0.1],['ttsVolume','Speech volume',0,1,0.1]]){
      const slider=el('input',{type:'range',min,max,step,value:draft[key]});const note=el('small',{},String(draft[key]));slider.addEventListener('input',()=>{update({[key]:Number(slider.value)});note.textContent=slider.value;});const wrap=field(label,slider);wrap.append(note);grid.append(wrap);
    }
    const read=el('button',{type:'button',className:'ocs-prefs-action'},'Read selected text');read.addEventListener('click',()=>speak(window.getSelection()?.toString()||'Select some text on the page and choose Read selected text.'));
    const stop=el('button',{type:'button',className:'ocs-prefs-action'},'Stop reading');stop.addEventListener('click',()=>window.speechSynthesis?.cancel());
    const actions=el('div',{className:'ocs-prefs-tools'});actions.append(read,stop);grid.append(actions);
    grid.append(el('p',{className:'ocs-prefs-note'},'Translation uses Google Translate when available. Read-aloud uses your browser’s installed voices; language/voice availability varies.'));
  }
  // OCS-style optional local head tracking. Webcam starts only after user action.
  const tracking={stream:null,video:null,model:null,cursor:null,raf:0,last:null,active:false,cal:null,error:''};
  function stopTracking(){tracking.active=false;if(tracking.raf)cancelAnimationFrame(tracking.raf);tracking.raf=0;if(tracking.stream){tracking.stream.getTracks().forEach(t=>t.stop());tracking.stream=null;}if(tracking.video){tracking.video.pause();tracking.video.srcObject=null;tracking.video.remove();tracking.video=null;}tracking.cursor?.remove();tracking.cursor=null;tracking.last=null;tracking.cal=null;}
  async function startTracking(){
    if(tracking.active)return;tracking.error='';
    if(!navigator.mediaDevices?.getUserMedia){tracking.error='Camera unavailable. Use HTTPS and a supported browser.';return;}
    try{
      // Same MediaPipe FaceLandmarker version and model used by OCS.
      const vision=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm');
      const fileset=await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
      tracking.model=await vision.FaceLandmarker.createFromOptions(fileset,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'},runningMode:'VIDEO',numFaces:1});
      tracking.stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480},facingMode:'user'},audio:false});
      tracking.video=el('video',{autoplay:true,muted:true,playsInline:true});tracking.video.className='ocs-head-video';tracking.video.srcObject=tracking.stream;document.body.append(tracking.video);await tracking.video.play();
      tracking.cursor=el('div',{className:'ocs-head-cursor','aria-hidden':'true'});document.body.append(tracking.cursor);
      tracking.active=true;tracking.last=null;tracking.cal=null;
      const tick=()=>{
        if(!tracking.active)return;
        if(tracking.video.readyState>=2){
          const pts=tracking.model.detectForVideo(tracking.video,performance.now())?.faceLandmarks?.[0];
          const nose=pts?.[1];
          if(nose){
            // Head-relative mapping follows OCS's nose-based pointer design.
            const nx=1-nose.x,ny=nose.y;
            if(!tracking.cal)tracking.cal={x:nx,y:ny};
            const dx=(nx-tracking.cal.x)*3,dy=(ny-tracking.cal.y)*3;
            const x=Math.max(0,Math.min(innerWidth-1,innerWidth*(0.5+dx)));
            const y=Math.max(0,Math.min(innerHeight-1,innerHeight*(0.5+dy)));
            const alpha=draft.nodSensitivity;
            if(!tracking.last)tracking.last={x,y};else{tracking.last.x+=(x-tracking.last.x)*alpha;tracking.last.y+=(y-tracking.last.y)*alpha;}
            tracking.cursor.style.transform=`translate(${tracking.last.x|0}px,${tracking.last.y|0}px)`;
            const target=document.elementFromPoint(tracking.last.x,tracking.last.y);
            const move=new MouseEvent('mousemove',{bubbles:true,clientX:tracking.last.x,clientY:tracking.last.y});target?.dispatchEvent(move);
          }
        }
        tracking.raf=requestAnimationFrame(tick);
      };
      tracking.raf=requestAnimationFrame(tick);
    }catch(err){tracking.error=err?.message||'Could not start tracking';stopTracking();}
  }
  function head(grid){
    grid.append(el('p',{className:'ocs-prefs-note'},'Use head movement to position an on-screen cursor. This does not send camera frames to the server. Click with a mouse, touchscreen, keyboard, or switch device. The camera is never started automatically.'));
    const slider=el('input',{type:'range',min:0.1,max:0.9,step:0.05,value:draft.nodSensitivity});slider.addEventListener('input',()=>update({nodSensitivity:Number(slider.value)}));grid.append(field('Pointer sensitivity',slider));
    const start=el('button',{type:'button',className:'ocs-prefs-action'},'Start camera head pointer');const stop=el('button',{type:'button',className:'ocs-prefs-action'},'Stop camera');const recenter=el('button',{type:'button',className:'ocs-prefs-action'},'Recenter head pointer');
    const status=el('p',{className:'ocs-prefs-note',role:'status'},tracking.active?'Tracking active':tracking.error||'Camera is off');
    start.addEventListener('click',async()=>{status.textContent='Requesting camera permission…';await startTracking();status.textContent=tracking.active?'Tracking active. Camera stays on until stopped or page closes.':tracking.error||'Camera could not start.';});
    stop.addEventListener('click',()=>{stopTracking();status.textContent='Camera stopped';});
    recenter.addEventListener('click',()=>{tracking.cal=null;status.textContent='Head pointer recentered';});
    const tools=el('div',{className:'ocs-prefs-tools'});tools.append(start,stop,recenter);grid.append(tools,status);
    grid.append(el('p',{className:'ocs-prefs-note'},'Note: This provides OCS-style head cursor tracking, not a nod-to-click action. On phones the camera and MediaPipe may be unavailable or slow.'));
  }
  function mount(grid,section){grid.replaceChildren();grid.classList.add('ocs-prefs-grid');contrastEl=null;if(section===0)appearance(grid);if(section===1)voice(grid);if(section===2)head(grid);}
  window.NCSNCFOCS={mount,apply,beginPreview,cancelPreview,commit,resetPreview,loadFromAccount,getSaved,stopTracking};
  apply(saved);
  document.addEventListener('DOMContentLoaded',()=>{translate(saved.language);});
  window.addEventListener('pagehide',stopTracking);
})();
