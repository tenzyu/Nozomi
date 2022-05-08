import { client } from '..'
import { ID_CHANNEL_LOG_BOT_ACTIVITY } from '../constant'
import { fetchTextChannel } from '../lib/discordUtils'

client.on('ready', async () => {
  const channel = await fetchTextChannel(ID_CHANNEL_LOG_BOT_ACTIVITY)

  console.log('Bot is ready.')
  await channel.send('Logged in.')
})
