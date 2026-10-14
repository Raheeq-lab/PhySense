'use client';

import KinematicsDiagnostic from './KinematicsDiagnostic';
import {circularMotionDiagnostic} from '@/data/circularMotionDiagnostic';

export default function CircularMotionDiagnostic(){return <KinematicsDiagnostic items={circularMotionDiagnostic} lessonId="block-1/1-3" storageSlug="lesson1.3" simulationFilename="circular-motion"/>}
