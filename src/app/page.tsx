import { PhysicsHub } from './physics-hub';
import AtomChallenge from './atom-challenge';
import styles from './home.module.css';

export default function HomePage() {
  return <div className={styles.homePage}><PhysicsHub home><AtomChallenge /></PhysicsHub></div>;
}
