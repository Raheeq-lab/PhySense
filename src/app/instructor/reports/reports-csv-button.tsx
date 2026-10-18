'use client';

type QuestionRow={lesson:string;question:string;answered:number;answerCorrect:string;reasonCorrect:string;jointCorrect:string;averageResponse:string};
type ConceptRow={concept:string;jointCorrect:string;attempts:number};
type RawRow={studentEmail:string;lessonId:string;phase:string;answerScore:number|string;reasonScore:number|string;jointScore:number|string;questionId:string;selectedAnswer:number;selectedReason:number;answerCorrect:boolean;reasonCorrect:boolean;jointCorrect:boolean;confidence:string};

const cell=(value:string|number|boolean)=>`"${String(value).replaceAll('"','""')}"`;
const save=(name:string,lines:Array<Array<string|number|boolean>>)=>{const blob=new Blob([lines.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();URL.revokeObjectURL(url)};

export default function ReportsCsvButton({questions,concepts,raw}:{questions:QuestionRow[];concepts:ConceptRow[];raw:RawRow[]}){
  const download=()=>{
    const lines=[
      ['Hardest Questions'],
      ['Lesson','Question','Answered','Answer correct','Reason correct','Joint correct','Average response'],
      ...questions.map(row=>[row.lesson,row.question,row.answered,row.answerCorrect,row.reasonCorrect,row.jointCorrect,row.averageResponse]),
      [],
      ['Concept Mastery'],
      ['Concept','Joint correct','Total attempts'],
      ...concepts.map(row=>[row.concept,row.jointCorrect,row.attempts]),
    ];
    save(`physense-instructor-report-${new Date().toISOString().slice(0,10)}.csv`,lines);
  };
  const downloadRaw=()=>save(`physense-raw-data-${new Date().toISOString().slice(0,10)}.csv`,[
    ['Student Email','Lesson ID','Phase','Total Answer Score','Total Reason Score','Total Joint Score','Question ID','Selected Answer Index','Selected Reason Index','Answer Correct','Reason Correct','Joint Correct','Confidence'],
    ...raw.map(row=>[row.studentEmail,row.lessonId,row.phase,row.answerScore,row.reasonScore,row.jointScore,row.questionId,row.selectedAnswer,row.selectedReason,row.answerCorrect,row.reasonCorrect,row.jointCorrect,row.confidence]),
  ]);
  return <div data-report-downloads><button type="button" onClick={download}>Download Summary (CSV)</button><button type="button" onClick={downloadRaw}>Download Raw Data (CSV)</button></div>;
}
