import { client } from '..'
import { ID_ROLE_EVERYONE2 } from '../constant'

client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) return

  await member.roles.add(ID_ROLE_EVERYONE2)
})
