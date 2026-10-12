import type {Metadata} from 'next';
import InstructorPrototype from './prototype';

export const metadata:Metadata={title:'Instructor prototype | PhySense',description:'Create and manage a pseudonymous PhySense Lesson 1.1 class.'};
export default function InstructorPage(){return <InstructorPrototype/>}
