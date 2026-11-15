import * as THREE from 'three';
export class World {
  constructor(renderer){this.renderer=renderer;this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x080b0e);this.scene.fog=new THREE.FogExp2(0x080b0e,.055);this.objects=[];this.interactables=[];this.build();}
  material(color,roughness=.9,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
  addBox(name,pos,size,mat,interactable=false,kind=''){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);mesh.position.set(...pos);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;this.scene.add(mesh);this.objects.push(mesh);if(interactable)this.interactables.push({mesh,kind,name});return mesh;}
  build(){
    const concrete=this.material(0x34393b),floorMat=this.material(0x202426),dark=this.material(0x101416),metal=this.material(0x555b5d,.48,.65),wood=this.material(0x302723),paper=this.material(0xb5a98d);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(12,14),floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=0;floor.receiveShadow=true;this.scene.add(floor);
    this.addBox('ceiling',[0,4.5,-1],[12,.25,14],dark);
    this.addBox('back-wall',[0,2,-7],[12,4, .3],concrete);this.addBox('left-wall',[-6,2,-1],[.3,4,12],concrete);this.addBox('right-wall',[6,2,-1],[.3,4,12],concrete);
    // Front wall is split around the exit.
    this.addBox('front-left',[-4.2,2,5],[3.6,4,.3],concrete);this.addBox('front-right',[4.2,2,5],[3.6,4,.3],concrete);this.addBox('front-top',[0,3.65,5],[4.8,.7,.3],concrete);
    // Door frame and door leaf
    this.door=this.addBox('exit-door',[0,1.55,4.88],[2.35,3.1,.18],this.material(0x252a2c));
    this.door.userData.open=false;
    this.doorPanel=this.addBox('door-panel',[0,1.55,4.75],[1.9,2.65,.08],wood);
    this.doorHandle=this.addBox('door-handle',[.78,1.5,4.66],[.08,.22,.08],metal);
    // terminal on the right wall
    const terminal=this.addBox('terminal',[5.78,1.65,-1.1],[.16,1.25,1.1],metal,true,'terminal');
    this.addBox('terminal-screen',[5.67,1.85,-1.1],[.04,.55,.72],this.material(0x183b3c,.25,.2));
    // desk and clue note
    this.addBox('desk',[-2.9,.95,-2.1],[2.2,.16,1.1],wood);this.addBox('desk-legs',[-2.9,.45,-2.1],[.12,.9,.12],dark);this.addBox('desk-leg2',[-1.95,.45,-2.1],[.12,.9,.12],dark);this.addBox('desk-leg3',[-3.85,.45,-2.1],[.12,.9,.12],dark);
    const note=this.addBox('desk-note',[-2.8,1.055,-2.1],[.65,.025,.42],paper,true,'note');note.rotation.y=-.12;
    // clock clue, deliberately legible through the interaction prompt/notes
    const clock=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.12,32),this.material(0x171a1c));clock.rotation.x=Math.PI/2;clock.position.set(0,2.55,-6.78);clock.castShadow=true;this.scene.add(clock);this.interactables.push({mesh:clock,kind:'clock',name:'Wall clock'});
    const face=new THREE.Mesh(new THREE.CircleGeometry(.4,32),this.material(0xb9b6a8));face.position.set(0,2.55,-6.70);this.scene.add(face);
    const hand1=new THREE.Mesh(new THREE.BoxGeometry(.025,.27,.025),this.material(0x202020));hand1.position.set(-.06,2.66,-6.66);hand1.rotation.z=-.4;this.scene.add(hand1);
    const hand2=new THREE.Mesh(new THREE.BoxGeometry(.02,.34,.02),this.material(0x202020));hand2.position.set(.08,2.52,-6.65);hand2.rotation.z=.95;this.scene.add(hand2);
    // red emergency lamps and ceiling lamp
    const lamp=new THREE.PointLight(0x8c252a,2.4,9);lamp.position.set(0,3.8,-2);this.scene.add(lamp);
    const red1=new THREE.PointLight(0x8f1d25,1.8,5);red1.position.set(-5,3.1,3);this.scene.add(red1);
    const bulb=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),new THREE.MeshBasicMaterial({color:0xc84a42}));bulb.position.set(0,4.05,-2);this.scene.add(bulb);
    // pipes and scattered debris
    for(let i=0;i<5;i++){const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,8,8),metal);pipe.rotation.z=Math.PI/2;pipe.position.set(0,3.75,-5+i*2);this.scene.add(pipe);}
    for(let i=0;i<13;i++){const shard=new THREE.Mesh(new THREE.BoxGeometry(.12+Math.random()*.2,.04,.1+Math.random()*.15),dark);shard.position.set((Math.random()-.5)*9,.04,(Math.random()-.5)*10);shard.rotation.y=Math.random()*3;this.scene.add(shard);}
    // low atmospheric fill
    const ambient=new THREE.HemisphereLight(0x667078,0x101010,.35);this.scene.add(ambient);
  }
  openDoor(){if(this.door.userData.open)return;this.door.userData.open=true;this.door.rotation.y=-Math.PI/2;this.door.position.x=-1.12;this.doorPanel.rotation.y=-Math.PI/2;this.doorPanel.position.x=-1.12;this.doorPanel.position.z=4.75;this.doorHandle.rotation.y=-Math.PI/2;this.doorHandle.position.set(-1.12,1.5,4.66);}
}
