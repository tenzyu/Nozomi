import { TOKEN_BOT_DISCORD, ID_GUILD_MAIN } from './constant'
import { MyBot } from './lib/discord'

const nozomi = new MyBot({
  intents: 32767,
  partials: ['MESSAGE', 'REACTION', 'USER']
})

;(async () => {
  await nozomi.loadCogs()
  await nozomi.loadCommand(ID_GUILD_MAIN)
  await nozomi.login(TOKEN_BOT_DISCORD)
})().catch(console.error)

export const client = nozomi
