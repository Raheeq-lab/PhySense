'use client';

import KinematicsDiagnostic from './KinematicsDiagnostic';
import {energyDiagnostic} from '@/data/energyDiagnostic';

export default function EnergyDiagnostic(){return <KinematicsDiagnostic items={energyDiagnostic} lessonId="block-1/1-4" storageSlug="lesson1.4" simulationFilename="energy"/>}
