import { initFederation } from '@agorapulse/native-federation';

initFederation()
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
