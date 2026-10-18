import type {Metadata} from 'next';
import {getInstructor} from '@/lib/instructor-auth';
import AccessDenied from './access-denied';
import InstructorPrototype from './prototype';

export const metadata:Metadata={title:'Instructor workspace | PhySense',description:'Create and manage pseudonymous PhySense classes.'};
export default async function InstructorPage(){const instructor=await getInstructor();return instructor?<InstructorPrototype email={instructor.email} fullName={instructor.fullName} university={instructor.university}/>:<AccessDenied/>}
