'use client';

import {useEffect,useState} from 'react';
import styles from './roster.module.css';

type RosterRow={studentEmail:string;personalToken:string;hasCompleted:boolean};
const extractEmails=(value:string)=>value.split(/\r?\n/).map(line=>line.split(/[,;]/)[0].trim().replace(/^['"]|['"]$/g,'')).filter(value=>value&&value.toLowerCase()!=='email'&&value.toLowerCase()!=='student_email');

export default function RosterManager({classId}:{classId:string}){
  const [input,setInput]=useState('');
  const [roster,setRoster]=useState<RosterRow[]>([]);
  const [origin,setOrigin]=useState('');
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  useEffect(()=>{queueMicrotask(()=>{setOrigin(location.origin);void fetch(`/api/classes/roster/?classId=${encodeURIComponent(classId)}`,{cache:'no-store'}).then(async response=>{const body=await response.json() as {roster?:RosterRow[]};if(response.ok&&body.roster)setRoster(body.roster)})})},[classId]);
  const upload=async(event:React.ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];if(file)setInput(extractEmails(await file.text()).join('\n'));event.target.value=''};
  const generate=async()=>{const emails=extractEmails(input);if(!emails.length){setStatus('Paste or upload at least one student email.');return}setBusy(true);setStatus('');try{const response=await fetch('/api/classes/roster/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({classId,emails})});const body=await response.json() as {roster?:RosterRow[];error?:string};if(!response.ok||!body.roster)throw new Error(body.error||'Invitations could not be generated.');setRoster(body.roster);setInput('');setStatus(`${emails.length} invitation${emails.length===1?'':'s'} processed.`)}catch(error){setStatus(error instanceof Error?error.message:'Invitations could not be generated.')}finally{setBusy(false)}};
  const link=(token:string)=>`${origin}/join?token=${token}`;
  const copyAll=async()=>{await navigator.clipboard.writeText(roster.map(row=>`${row.studentEmail},${link(row.personalToken)}`).join('\n'));setStatus('All invitation links copied.')};
  return <section className={styles.roster} data-roster><div className={styles.heading}><div><span data-roster-eyebrow>STUDENT ROSTER</span><h3>Upload Student Roster</h3><p data-roster-copy>Paste one email per line or upload a CSV whose first column contains email addresses.</p></div>{roster.length>0&&<button type="button" onClick={()=>void copyAll()}>Copy All</button>}</div><textarea aria-label="Student emails" placeholder={'student1@example.edu\nstudent2@example.edu'} value={input} onChange={event=>setInput(event.target.value)}/><div className={styles.controls}><label data-roster-upload>Upload CSV<input type="file" accept=".csv,text/csv" onChange={event=>void upload(event)}/></label><button type="button" disabled={busy} onClick={()=>void generate()}>{busy?'Generating…':'Generate Invitations'}</button></div>{status&&<p className={styles.status} data-roster-status role="status">{status}</p>}{roster.length>0&&<div className={styles.tableWrap} data-roster-table><table><thead><tr><th>Student</th><th>Personal link</th><th>Status</th></tr></thead><tbody>{roster.map(row=><tr key={row.personalToken}><td>{row.studentEmail}</td><td><a href={`/join?token=${row.personalToken}`}>{link(row.personalToken)}</a></td><td>{row.hasCompleted?'Completed':'Invited'}</td></tr>)}</tbody></table></div>}</section>;
}
