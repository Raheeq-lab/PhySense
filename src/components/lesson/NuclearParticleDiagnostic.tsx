'use client';
import KinematicsDiagnostic from './KinematicsDiagnostic';
import {nuclearParticleDiagnostic} from '@/data/nuclearParticleDiagnostic';

export default function NuclearParticleDiagnostic(){return <KinematicsDiagnostic items={nuclearParticleDiagnostic} lessonId="block-4/4-6" storageSlug="lesson4.6" simulationFilename="nuclear-particle"/>}
