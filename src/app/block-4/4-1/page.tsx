import AdvancedLessonPage from '@/components/lesson/AdvancedLessonPage';import {getAdvancedLesson} from '@/lib/block4';
export default function Page(){return <AdvancedLessonPage lesson={getAdvancedLesson('4-1')!}/>}
