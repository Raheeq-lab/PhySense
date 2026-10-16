'use client';
import KinematicsDiagnostic from './KinematicsDiagnostic';
import {electrodynamicsDiagnostic} from '@/data/electrodynamicsDiagnostic';

export default function ElectrodynamicsDiagnostic(){return <KinematicsDiagnostic items={electrodynamicsDiagnostic} lessonId="block-4/4-2" storageSlug="lesson4.2" simulationFilename="electrodynamics"/>}
