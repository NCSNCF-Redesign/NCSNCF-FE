(() => {
'use strict';
const categories = [
['Vision','Adjust colors, text size, and visibility.',[
['largeText','Larger text','Increase the base text size.'],['extraLargeText','Extra-large text','Increase the base text size further.'],['smallText','Smaller text','Use a more compact base text size.'],['highContrast','High contrast','Use stronger black-and-white contrast.'],['darkMode','Dark background','Use a darker page background.'],['grayscale','Grayscale','Remove color from the page.'],['saturate','Stronger colors','Increase color saturation.'],['invert','Invert colors','Invert page colors.'],['zoom110','Page zoom 110%','Enlarge the page layout.'],['zoom125','Page zoom 125%','Enlarge the page layout further.']]],
['Reading','Make written content easier to follow.',[
['underlineLinks','Underline links','Show link underlines.'],['boldLinks','Bold links','Emphasize linked text.'],['highlightLinks','Outline links','Add an outline around links.'],['readableFont','Simple sans-serif font','Use Verdana and Arial.'],['serifFont','Serif font','Use Georgia.'],['monoFont','Monospace font','Use fixed-width lettering.'],['lineSpacing','Extra line spacing','Increase line height.'],['letterSpacing','Extra letter spacing','Spread letters apart.'],['wordSpacing','Extra word spacing','Spread words apart.'],['leftAlign','Left-align text','Align headings and paragraphs left.'],['limitWidth','Narrower reading lines','Limit paragraph line length.']]],
['Focus & Attention','Reduce visual distractions.',[
['hideImages','Hide images','Hide page images while retaining layout.'],['hideDecorations','Remove shadows','Remove decorative shadows.'],['hideBackgroundImages','Remove background images','Simplify visual backgrounds.'],['highlightHeadings','Mark headings','Add a colored line to headings.'],['highlightParagraphs','Mark paragraphs','Add a subtle reading guide.']]],
['Navigation','Make interactive elements easier to find.',[
['largeCursor','Crosshair cursor','Use a distinctive pointer over the page.'],['strongFocus','Strong keyboard focus','Emphasize focused controls.'],['highlightButtons','Outline buttons','Make buttons stand out.'],['showSkipLink','Keyboard navigation hint','Show a navigation tip at page top.']]],
['Cognitive Support','Simplify the page presentation.',[
['reducedTransparency','Reduce transparency','Remove header and navigation blur.'],['simpleLayout','Simpler page backgrounds','Remove background imagery.'],['readingGuide','Paragraph guides','Add visual guides beside paragraphs.'],['clearHeadings','Heading markers','Visually identify headings.']]],
['Forms & Inputs','Make form controls easier to use.',[
['largeControls','Larger controls','Increase the minimum height of controls.'],['inputBorders','Strong input borders','Make input fields more visible.'],['formSpacing','Extra form spacing','Increase spacing around form fields.'],['formFocus','Visible form focus','Emphasize keyboard focus.']]],
['Motion & Media','Reduce unwanted motion and effects.',[
['reduceMotion','Reduce motion','Minimize animations and transitions.'],['hideAnimations','Hide embedded media','Hide videos and embedded frames.'],['noBackgrounds','No background imagery','Remove decorative background images.'],['noShadows','No visual shadows','Remove box and text shadows.']]],
['Personal Preferences','Fine-tune your preferred view.',[
['comfortableReading','Comfortable reading','Increase line spacing and limit line width.'],['minimalView','Minimal view','Remove shadows and background images.'],['emphasizeActions','Emphasize actions','Highlight links and buttons.'],['keyboardFriendly','Keyboard-friendly focus','Use stronger focus indicators.']]]
];
const alias = {simpleLayout:['hideBackgroundImages'],readingGuide:['highlightParagraphs'],clearHeadings:['highlightHeadings'],formFocus:['strongFocus'],noBackgrounds:['hideBackgroundImages'],noShadows:['hideDecorations'],comfortableReading:['lineSpacing','limitWidth'],minimalView:['hideDecorations','hideBackgroundImages'],emphasizeActions:['highlightLinks','highlightButtons'],keyboardFriendly:['strongFocus']};
const key='ncsncfAccessibilityHubV1';
const dialog=document.getElementById('accessibilityDialog');
if(!dialog || dialog.dataset.hubReady) return;
dialog.dataset.hubReady='true';
const all=categories.flatMap(c=>c[2]);
const defaults=Object.fromEntries(all.map(([id])=>[id,false]));
const read=()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{return {...defaults}}};
let saved=read(), state={...saved}, active=0;
const tabs=document.getElementById('a11yCategories'), grid=document.getElementById('a11ySettings');
const title=document.getElementById('a11ySectionTitle'),desc=document.getElementById('a11ySectionDescription');
const count=document.getElementById('a11yCount');
count.textContent=`${all.length} preferences • saved on this device`;
function apply(){
  const flags={};
  for(const [id,val] of Object.entries(state)) if(val) (alias[id]||[id]).forEach(k=>flags[k]=true);
  for(const [id] of all) if(!flags[id]) flags[id]=false;
  for(const [id] of all){const attr='data-a11y-'+id.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());if(flags[id])document.documentElement.setAttribute(attr,'true');else document.documentElement.removeAttribute(attr)}
  // The old 3-setting implementation used body datasets; clear them so settings do not conflict.
  ['highContrast','underlineLinks','reduceMotion'].forEach(k=>{if(document.body) delete document.body.dataset[k]});
}
function render(){
  tabs.replaceChildren();
  categories.forEach(([name],i)=>{const b=document.createElement('button');b.type='button';b.className='a11y-tab';b.textContent=name;b.setAttribute('aria-selected',String(active===i));b.onclick=()=>{active=i;render()};tabs.append(b)});
  const [name,description,items]=categories[active];title.textContent=name;desc.textContent=description;grid.replaceChildren();
  for(const [id,label,description] of items){
    const card=document.createElement('label');card.className='a11y-setting';
    const copy=document.createElement('span');copy.className='a11y-setting-copy';
    const strong=document.createElement('strong');strong.textContent=label;
    const small=document.createElement('small');small.textContent=description;
    copy.append(strong,small);
    const input=document.createElement('input');input.type='checkbox';input.checked=!!state[id];input.setAttribute('aria-label',label);
    input.onchange=()=>{state[id]=input.checked;apply()};
    card.append(copy,input);grid.append(card);
  }
}
const open=()=>{render();if(typeof dialog.showModal==='function'&&!dialog.open)dialog.showModal();else dialog.setAttribute('open','')};
document.querySelectorAll('[data-open-accessibility]').forEach(b=>{b.addEventListener('click',e=>{e.preventDefault();open()})});
document.getElementById('closeAccessibility')?.addEventListener('click',()=>dialog.close());
document.getElementById('saveAccessibility')?.addEventListener('click',()=>{saved={...state};try{localStorage.setItem(key,JSON.stringify(saved))}catch{}dialog.close()});
document.getElementById('resetAccessibility')?.addEventListener('click',()=>{state={...defaults};saved={...state};try{localStorage.removeItem(key)}catch{}apply();render()});
dialog.addEventListener('cancel',()=>{state={...saved};apply()});
dialog.addEventListener('click',e=>{if(e.target===dialog){state={...saved};apply();dialog.close()}});
apply();render();
})();
