import * as THREE from 'three';
import { GAME_CONFIG } from '../config.js';
export class Player {
  constructor(camera,scene,canvas){this.camera=camera;this.scene=scene;this.canvas=canvas;this.position=new THREE.Vector3(0,0,2.5);this.yaw=0;this.pitch=0;this.keys={};this.move={x:0,y:0};this.pointerLocked=false;this.isMobile=matchMedia(`(max-width:${GAME_CONFIG.mobileBreakpoint}px)`).matches||('ontouchstart'in window);this.setup();this.applyCamera();}
  setup(){
    window.addEventListener('keydown',e=>{this.keys[e.code]=true;if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();});window.addEventListener('keyup',e=>this.keys[e.code]=false);
    this.canvas.addEventListener('click',()=>{if(!this.isMobile&&!this.pointerLocked&&document.pointerLockElement!==this.canvas)this.canvas.requestPointerLock?.();});
    document.addEventListener('pointerlockchange',()=>{this.pointerLocked=document.pointerLockElement===this.canvas;});
    document.addEventListener('mousemove',e=>{if(this.pointerLocked){this.yaw-=e.movementX*GAME_CONFIG.lookSensitivity;this.pitch-=e.movementY*GAME_CONFIG.lookSensitivity;this.clampPitch();}});
    let touchLook=null;this.canvas.addEventListener('touchstart',e=>{if(!this.isMobile)return;const t=e.changedTouches[0];if(t.clientX>innerWidth*.38)touchLook={x:t.clientX,y:t.clientY,id:t.identifier};},{passive:true});
    this.canvas.addEventListener('touchmove',e=>{if(!touchLook)return;for(const t of e.changedTouches){if(t.identifier===touchLook.id){this.yaw-=(t.clientX-touchLook.x)*.006;this.pitch-=(t.clientY-touchLook.y)*.006;touchLook={...touchLook,x:t.clientX,y:t.clientY};this.clampPitch();}}},{passive:true});
    this.canvas.addEventListener('touchend',e=>{for(const t of e.changedTouches)if(t.identifier===touchLook?.id)touchLook=null;},{passive:true});
  }
  clampPitch(){this.pitch=Math.max(-1.35,Math.min(1.35,this.pitch));}
  applyCamera(){this.camera.position.set(this.position.x,1.68,this.position.z);this.camera.rotation.order='YXZ';this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch;}
  setMove(x,y){this.move.x=x;this.move.y=y;}
  update(dt){const forward=(this.keys.KeyW||this.keys.ArrowUp?1:0)-(this.keys.KeyS||this.keys.ArrowDown?1:0)+this.move.y;const side=(this.keys.KeyD||this.keys.ArrowRight?1:0)-(this.keys.KeyA||this.keys.ArrowLeft?1:0)+this.move.x;const v=new THREE.Vector3(side,0,-forward);if(v.lengthSq()>1)v.normalize();v.applyAxisAngle(new THREE.Vector3(0,1,0),this.yaw);this.position.addScaledVector(v,GAME_CONFIG.moveSpeed*dt);this.position.x=THREE.MathUtils.clamp(this.position.x,-5.15,5.15);this.position.z=THREE.MathUtils.clamp(this.position.z,-6.1,4.35);this.applyCamera();}
  restore(pos,yaw=0){if(pos)this.position.set(pos.x,0,pos.z);this.yaw=yaw;this.applyCamera();}
}
