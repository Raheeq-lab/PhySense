'use client';
import KinematicsDiagnostic from './KinematicsDiagnostic';
import {statisticalMechanicsDiagnostic} from '@/data/statisticalMechanicsDiagnostic';

export default function StatisticalMechanicsDiagnostic(){return <KinematicsDiagnostic items={statisticalMechanicsDiagnostic} lessonId="block-4/4-3" storageSlug="lesson4.3" simulationFilename="statistical-mechanics"/>}
