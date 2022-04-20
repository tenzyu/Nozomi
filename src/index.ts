import { discordBotToken, mainGuildId } from './constant'
import { MyBot } from './lib/discordBot'

const nozomi = new MyBot({
  intents: 32767,
  partials: ['MESSAGE', 'REACTION', 'USER']
})

;(async () => {
  await nozomi.loadCogs()
  await nozomi.loadCommand(mainGuildId)
  await nozomi.login(discordBotToken)
})().catch(console.error)

export const client = nozomi
