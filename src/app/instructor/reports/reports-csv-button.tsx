'use client';

type QuestionRow={lesson:string;question:string;answered:number;answerCorrect:string;reasonCorrect:string;jointCorrect:string;averageResponse:string};
type ConceptRow={concept:string;jointCorrect:string;attempts:number};

const cell=(value:string|number)=>`"${String(value).replaceAll('"','""')}"`;

export default function ReportsCsvButton({questions,concepts}:{questions:QuestionRow[];concepts:ConceptRow[]}){
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
    const blob=new Blob([lines.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=`physense-instructor-report-${new Date().toISOString().slice(0,10)}.csv`;link.click();URL.revokeObjectURL(url);
  };
  return <button type="button" onClick={download}>Download CSV</button>;
}
