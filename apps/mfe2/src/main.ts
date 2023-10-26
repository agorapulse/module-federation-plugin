import { initFederation } from '@agorapulse/native-federation';

initFederation('/assets/federation.manifest.json')
  .catch((err) => console.error(err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
