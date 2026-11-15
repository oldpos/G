export class Interface {
  constructor(){this.el=id=>document.getElementById(id);this.toastTimer=null;}
  show(id){this.el(id).classList.remove('hidden');}
  hide(id){this.el(id).classList.add('hidden');}
  toast(message){const t=this.el('toast');t.textContent=message;t.classList.remove('hidden');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>t.classList.add('hidden'),2400);}
  setObjective(text){this.el('objective').textContent=text;}
  setBattery(value){this.el('battery-level').textContent=`${Math.round(value)}%`;}
  setPrompt(on,text='[ E ] INTERACT'){const p=this.el('interaction-prompt');p.textContent=text;p.classList.toggle('hidden',!on);}
  showPuzzle(view){this.el('puzzle-title').textContent=view.title;this.el('puzzle-description').textContent=view.description;this.el('answer-label').textContent=view.label;this.el('puzzle-answer').placeholder=view.placeholder;this.el('puzzle-stage').innerHTML=`<div class="stage-label">TERMINAL DISPLAY</div><div class="sequence">${view.visual}</div><div class="microcopy">${view.hint}</div>`;this.el('puzzle-feedback').textContent='';this.el('puzzle-feedback').className='feedback';this.el('puzzle-answer').value='';this.show('puzzle-modal');setTimeout(()=>this.el('puzzle-answer').focus(),50);}
  feedback(message,good=false){const f=this.el('puzzle-feedback');f.textContent=message;f.className=`feedback${good?' good':''}`;}
}
