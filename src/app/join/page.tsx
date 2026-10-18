import type {Metadata} from 'next';
import JoinClass from './join-class';

export const metadata:Metadata={title:'Join a class | PhySense',description:'Join a PhySense class with a class code or personal invitation.'};
export default function JoinPage(){return <JoinClass/>}
