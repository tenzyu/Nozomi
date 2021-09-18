import { MyBot } from './bot';

const nozomi = new MyBot();
export const client = nozomi.client;

(async () => {
  await nozomi.loadCogs();
  await nozomi.login();
})();
