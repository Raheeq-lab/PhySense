'use client';
import KinematicsDiagnostic from './KinematicsDiagnostic';
import {analyticalMechanicsDiagnostic} from '@/data/analyticalMechanicsDiagnostic';

export default function AnalyticalMechanicsDiagnostic(){return <KinematicsDiagnostic items={analyticalMechanicsDiagnostic} lessonId="block-4/4-1" storageSlug="lesson4.1" simulationFilename="analytical-mechanics"/>}
