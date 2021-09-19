import { MyBot } from './lib/discordBot';

const nozomi = new MyBot();
export const client = nozomi.client;

(async () => {
  await nozomi.loadCogs();
  await nozomi.login();
})();
