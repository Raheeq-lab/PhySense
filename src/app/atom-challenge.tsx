'use client';

import { useState } from 'react';
import styles from './atom-challenge.module.css';

type Question = {
  scenario:string;
  tier1:string;
  tier1Options:string[];
  tier1Correct:number;
  tier2:string;
  tier2Options:string[];
  both:string;
  answerOnly:string;
  incorrect:string;
};

const questions:Question[]=[
  {
    scenario:'Imagine you have two protons sitting next to each other in empty space.',
    tier1:'What happens between them?',
    tier1Options:['They push each other away.','They pull each other together.','Nothing happens — they ignore each other.','They swap places.'],tier1Correct:0,
    tier2:'Why does this happen?',
    tier2Options:['Because protons have positive charge, and same charges push apart.','Because protons are heavy and gravity pulls them.','Because they are the same size.','I guessed.'],
    both:'Correct. Same charges push apart. This is the rule that makes the nucleus need neutrons to stay together.',
    answerOnly:"Right answer, but check your reasoning. The answer is 'positive charge pushes away other positives.' That's the rule.",
    incorrect:'Not quite. Protons have positive charge. Same charges push apart. This is why two protons alone would fly apart — and why neutrons are needed to hold them together.',
  },
  {
    scenario:'Now imagine you have one neutron sitting in empty space. A proton floats toward it.',
    tier1:'What happens when the proton gets close to the neutron?',
    tier1Options:['The neutron pushes the proton away.','The neutron pulls the proton closer.','The neutron ignores the proton — no push, no pull.','The neutron turns into a proton.'],tier1Correct:2,
    tier2:'Why does this happen?',
    tier2Options:["Because the neutron has no electric charge, so it doesn't push or pull on anything.",'Because the neutron is too small to affect the proton.','Because the proton is moving too fast.','I guessed.'],
    both:"Correct. Neutrons have no charge — no push, no pull. They just sit there and add weight. That's what makes them 'neutral.'",
    answerOnly:'Right answer. The reason is that neutrons have zero electric charge. No charge = no electric force.',
    incorrect:"Neutrons are neutral. They don't push or pull on other particles electrically. They're invisible to electric forces. But they still have mass, which helps hold the nucleus together.",
  },
  {
    scenario:'An electron floats near a proton.',
    tier1:'What happens?',
    tier1Options:['The electron pushes the proton away.','The electron pulls the proton closer.','Nothing happens.','The electron orbits the proton forever without touching it.'],tier1Correct:1,
    tier2:'Why does this happen?',
    tier2Options:['Because electrons are negative and protons are positive, and opposite charges pull together.','Because the electron is lighter than the proton.','Because the electron is moving fast.','I guessed.'],
    both:'Correct. Opposite charges pull together. This is the rule that keeps electrons around the nucleus.',
    answerOnly:'Right answer. The reason is that opposite charges attract. Electron is negative, proton is positive.',
    incorrect:"The electron is negative. The proton is positive. Opposite charges pull together. That's why the electron is attracted to the nucleus.",
  },
];

type Answer={tier1:number|null;tier2:number|null;locked:boolean};
const blank=():Answer=>({tier1:null,tier2:null,locked:false});

export default function AtomChallenge(){
  const [answers,setAnswers]=useState<Answer[]>(questions.map(blank));
  const completed=answers.filter(answer=>answer.locked).length;
  const choose=(question:number,tier:'tier1'|'tier2',option:number)=>setAnswers(current=>current.map((answer,index)=>index===question&&!answer.locked?{...answer,[tier]:option}:answer));
  const check=(question:number)=>setAnswers(current=>current.map((answer,index)=>index===question&&answer.tier1!==null&&answer.tier2!==null?{...answer,locked:true}:answer));
  const restart=(question:number)=>setAnswers(current=>current.map((answer,index)=>index===question?blank():answer));
  const feedback=(question:Question,answer:Answer)=>answer.tier1===question.tier1Correct&&answer.tier2===0?question.both:answer.tier1===question.tier1Correct?question.answerOnly:question.incorrect;

  return <section className={styles.challenge} aria-labelledby="atom-challenge-title">
    <div className={styles.inner}>
      <header><h2 id="atom-challenge-title">Challenge: Do you understand the atom?</h2><p>Three questions. No pressure. Just checking.</p></header>
      <div className={styles.progress} aria-label={`${completed} of 3 questions completed`}><div><span>{completed} / 3 completed</span><i style={{width:`${completed/3*100}%`}}/></div></div>
      <div className={styles.questions}>{questions.map((question,index)=>{const answer=answers[index];return <article className={styles.card} key={question.scenario}>
        <span className={styles.number}>Question {index+1}</span><p className={styles.scenario}>{question.scenario}</p>
        <QuestionTier title={question.tier1} options={question.tier1Options} selected={answer.tier1} disabled={answer.locked} onSelect={option=>choose(index,'tier1',option)}/>
        <QuestionTier title={question.tier2} options={question.tier2Options} selected={answer.tier2} disabled={answer.locked} onSelect={option=>choose(index,'tier2',option)}/>
        {!answer.locked&&answer.tier1!==null&&answer.tier2!==null&&<button className={styles.check} type="button" onClick={()=>check(index)}>Check answer</button>}
        {answer.locked&&<><div className={styles.feedback} role="status">{feedback(question,answer)}</div><button className={styles.restart} type="button" onClick={()=>restart(index)}>Restart</button></>}
      </article>})}</div>
    </div>
  </section>;
}

function QuestionTier({title,options,selected,disabled,onSelect}:{title:string;options:string[];selected:number|null;disabled:boolean;onSelect:(option:number)=>void}){
  return <fieldset className={styles.tier} disabled={disabled}><legend>{title}</legend>{options.map((option,index)=><button type="button" key={option} aria-pressed={selected===index} className={selected===index?styles.selected:''} onClick={()=>onSelect(index)}><b>{String.fromCharCode(65+index)}.</b><span>{option}</span></button>)}</fieldset>;
}
