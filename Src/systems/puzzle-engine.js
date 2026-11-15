export class PuzzleEngine {
  constructor(){ this.stage = 1; this.solved = false; }
  getStage(){ return this.stage; }
  getView(){
    if(this.stage===1) return {title:'THE FIRST TEST',description:'The sequence is carved into the terminal. What number comes next?',label:'NEXT NUMBER',placeholder:'Enter the missing number',visual:'02   /   04   /   08   /   16   /   ?',hint:'Each number is multiplied by the same amount.'};
    return {title:'THE SECOND TEST',description:'The note says: “The room remembers what the clock forgets.” Find the three digits hidden in the room.',label:'THREE-DIGIT ACCESS CODE',placeholder:'Enter the 3-digit code',visual:'CLOCK  →  MIRROR  →  EXIT',hint:'Inspect the desk note and wall clock. The order is written on the note.'};
  }
  submit(value){
    const normalized=String(value).trim().toLowerCase().replace(/\s+/g,'');
    if(this.stage===1 && normalized==='32'){this.stage=2;return {correct:true,complete:false,message:'Correct. One more layer remains.'};}
    if(this.stage===2 && normalized==='417'){this.solved=true;return {correct:true,complete:true,message:'ACCESS GRANTED. THE EXIT IS UNLOCKED.'};}
    return {correct:false,complete:false,message:this.stage===1?'Not quite. Look at how the numbers change.':'Incorrect code. Re-examine the clues.'};
  }
  restore(stage,solved){this.stage=stage||1;this.solved=!!solved;}
}
