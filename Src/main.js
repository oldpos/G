import * as THREE from 'three';
import { World } from './engine/world.js';
import { Player } from './engine/player.js';
import { MobileControls } from './engine/controls.js';
import { PuzzleEngine } from './systems/puzzle-engine.js';
import { SaveSystem } from './systems/save-system.js';
import { Interface } from './ui/interface.js';
import { GAME_CONFIG } from './config.js';

const canvas=document.getElementById('game-canvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:!('ontouchstart'in window),powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.1,70);
const world=new World(renderer);const player=new Player(camera,world.scene,canvas);const mobileControls=new MobileControls(player);const ui=new Interface();const puzzle=new PuzzleEngine();const saves=new SaveSystem();
const flashlight=new THREE.SpotLight(0xd8e5ed,32,17,Math.PI/7,.42,1.5);flashlight.position.set(0,0,0);flashlight.target.position.set(0,0,-1);camera.add(flashlight);camera.add(flashlight.target);world.scene.add(camera);
let battery=100,lightOn=true,gameStarted=false,paused=false,completed=false,currentTarget=null,lastTime=performance.now();
const raycaster=new THREE.Raycaster();const center=new THREE.Vector2(0,0);
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.8));}
window.addEventListener('resize',resize);
function save(){saves.save({position:{x:player.position.x,z:player.position.z},yaw:player.yaw,battery,lightOn,stage:puzzle.stage,solved:puzzle.solved,completed});}
function startGame(continueSave=false){if(continueSave){const s=saves.load();if(s){player.restore(s.position,s.yaw);battery=s.battery??100;lightOn=s.lightOn??true;puzzle.restore(s.stage,s.solved);completed=!!s.completed;if(completed){showCompletion();return;}}}else{saves.clear();player.restore({x:0,z:2.5},Math.PI);battery=100;lightOn=true;puzzle.restore(1,false);completed=false;}gameStarted=true;paused=false;ui.hide('main-menu');ui.hide('completion-screen');ui.show('hud');ui.hide('pause-modal');ui.setBattery(battery);ui.setObjective(puzzle.solved?'Exit through the open door.':'Find a way out.');document.getElementById('mobile-controls').classList.toggle('hidden',!player.isMobile);save();}
function showCompletion(){gameStarted=false;completed=true;ui.hide('hud');ui.hide('pause-modal');ui.show('completion-screen');save();}
function openPuzzle(){if(puzzle.solved){ui.toast('The terminal is already unlocked.');return;}ui.showPuzzle(puzzle.getView());}
function interact(target){if(!target)return;if(target.kind==='terminal'){openPuzzle();return;}if(target.kind==='note'){ui.toast('NOTE FOUND: “CLOCK → MIRROR → EXIT. READ THE MARKS IN ORDER.”');document.getElementById('clue-list').innerHTML='<li>Sequence on terminal: 02 / 04 / 08 / 16 / ?</li><li>Desk note: CLOCK → MIRROR → EXIT.</li><li>The wall clock is marked with the digits 4, 1, 7 in that order.</li>';save();return;}if(target.kind==='clock'){ui.toast('The clock face is scratched: 4 — 1 — 7.');document.getElementById('clue-list').innerHTML='<li>Sequence on terminal: 02 / 04 / 08 / 16 / ?</li><li>Desk note: CLOCK → MIRROR → EXIT.</li><li>Wall clock marks: 4 — 1 — 7.</li>';return;}if(target.kind==='door'){if(puzzle.solved){showCompletion();}else ui.toast('LOCKED. The terminal controls this door.');}}
function findTarget(){raycaster.setFromCamera(center,camera);const hits=raycaster.intersectObjects(world.interactables.map(o=>o.mesh).concat([world.door]),false);if(!hits.length){currentTarget=null;ui.setPrompt(false);return;}const mesh=hits[0].object;let t=world.interactables.find(o=>o.mesh===mesh);if(mesh===world.door)t={kind:'door',name:'Exit door'};if(hits[0].distance>3.1)t=null;currentTarget=t;ui.setPrompt(!!t,t?.kind==='terminal'?'[ E ] ACCESS TERMINAL':t?.kind==='door'?'[ E ] OPEN EXIT': '[ E ] INSPECT');}
function toggleLight(){if(battery<=0){ui.toast('Flashlight battery depleted.');return;}lightOn=!lightOn;flashlight.visible=lightOn;ui.toast(lightOn?'Flashlight on.':'Flashlight off.');}
function submitPuzzle(e){e.preventDefault();const result=puzzle.submit(document.getElementById('puzzle-answer').value);ui.feedback(result.message,result.correct);if(result.correct&&!result.complete){setTimeout(()=>ui.showPuzzle(puzzle.getView()),650);save();}if(result.complete){world.openDoor();ui.setObjective('The exit is open. Get out.');save();setTimeout(()=>{ui.hide('puzzle-modal');ui.toast('A heavy lock releases somewhere in the dark.');},650);}}
document.getElementById('puzzle-form').addEventListener('submit',submitPuzzle);
document.getElementById('new-game').addEventListener('click',()=>startGame(false));document.getElementById('continue-game').addEventListener('click',()=>startGame(true));document.getElementById('continue-game').disabled=!saves.hasSave();document.getElementById('continue-game').style.opacity=saves.hasSave()?'1':'.4';
document.getElementById('how-to-play').addEventListener('click',()=>ui.show('howto-modal'));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>ui.hide(b.dataset.close)));
document.getElementById('flashlight-btn').addEventListener('click',toggleLight);document.getElementById('mobile-light').addEventListener('click',toggleLight);document.getElementById('notebook-btn').addEventListener('click',()=>ui.show('notebook-modal'));document.getElementById('pause-btn').addEventListener('click',()=>{paused=true;ui.show('pause-modal');});document.getElementById('resume-game').addEventListener('click',()=>{paused=false;ui.hide('pause-modal');});document.getElementById('save-menu').addEventListener('click',()=>{save();paused=false;gameStarted=false;ui.hide('hud');ui.hide('pause-modal');ui.show('main-menu');document.getElementById('continue-game').disabled=false;document.getElementById('continue-game').style.opacity='1';});document.getElementById('return-menu').addEventListener('click',()=>{ui.hide('completion-screen');ui.show('main-menu');document.getElementById('continue-game').disabled=false;});
document.getElementById('mobile-interact').addEventListener('click',()=>interact(currentTarget));
window.addEventListener('keydown',e=>{if(!gameStarted)return;if(e.code==='KeyE')interact(currentTarget);if(e.code==='KeyF')toggleLight();if(e.code==='KeyN')ui.show('notebook-modal');if(e.code==='Escape'&&!document.querySelector('.modal:not(.hidden)')){paused=true;ui.show('pause-modal');}});
canvas.addEventListener('pointerdown',()=>{if(gameStarted&&!player.isMobile&&currentTarget)interact(currentTarget);});
function update(dt){if(!gameStarted||paused||completed)return;player.update(dt);findTarget();if(lightOn){battery=Math.max(0,battery-GAME_CONFIG.batteryDrainPerSecond*dt);ui.setBattery(battery);if(battery===0){lightOn=false;flashlight.visible=false;ui.toast('The flashlight dies.');}}if(puzzle.solved&&player.position.z>4.05&&Math.abs(player.position.x)<1.5)showCompletion();}
function loop(now){const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;update(dt);renderer.render(world.scene,camera);requestAnimationFrame(loop);}requestAnimationFrame(loop);
// A short startup delay lets the first WebGL frame appear before hiding the loading layer.
setTimeout(()=>{const l=document.getElementById('loading');l.style.opacity='0';setTimeout(()=>l.remove(),650);},450);
// Restore puzzle/door state in a continued session.
const existing=saves.load();if(existing?.solved){puzzle.restore(existing.stage,true);world.openDoor();}
// Keep state durable if the tab is closed mid-session.
window.addEventListener('beforeunload',()=>{if(gameStarted)save();});
