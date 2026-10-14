'use client';

import KinematicsDiagnostic from './KinematicsDiagnostic';
import {forcesDiagnostic} from '@/data/forcesDiagnostic';

export default function ForcesDiagnostic(){return <KinematicsDiagnostic items={forcesDiagnostic} lessonId="block-1/1-2" storageSlug="lesson1.2" simulationFilename="forces"/>}
