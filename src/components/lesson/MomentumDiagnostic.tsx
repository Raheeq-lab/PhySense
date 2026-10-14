'use client';
import KinematicsDiagnostic from './KinematicsDiagnostic';
import {momentumDiagnostic} from '@/data/momentumDiagnostic';
export default function MomentumDiagnostic(){return <KinematicsDiagnostic items={momentumDiagnostic} lessonId="block-1/1-5" storageSlug="lesson1.5" simulationFilename="momentum"/>}
