import type { Collection, Message, Role, TextChannel } from 'discord.js'
import { MessageEmbed } from 'discord.js'

import { client } from '..'
import { ID_CHANNEL_ASSIGN_LIST, ID_GUILD_MAIN } from '../constant'
import { fetchTextChannel } from '../lib/discordUtils'

const embedName = 'Assign List'

const createAssignList = (roles: Collection<string, Role>): string => {
  const ignoreRoleIds = [
    '921807626122190899',
    '927501472046940190',
    '950635933772947497'
  ]
  const targetRoles = roles
    .filter(({ managed, id }) => !(managed || ignoreRoleIds.includes(id)))
    .sort((a, b) => a.name.localeCompare(b.name, 'ja-JP'))
  const membersList = targetRoles.map(
    (role) => `${role}\n${role.members.map(String).join('\n')}`
  )

  return membersList.join('\n\n')
}

const createAssignListEmbed = (assignList: string): MessageEmbed => {
  const embed = new MessageEmbed()
    .setColor(0xff4596)
    .setTitle(embedName)
    .setDescription(assignList)
    .setAuthor({ name: '希' })
    .setFooter({ text: 'きゃ～' })
    .setTimestamp(new Date())

  const url = client.user?.avatarURL()
  if (typeof url === 'string') embed.setThumbnail(url)

  return embed
}

const fetchAssignListMessage = async (
  channel: TextChannel
): Promise<Message | null> => {
  const messages = await channel.messages.fetch()
  const isAssignListMessage = (message: Message) =>
    message.author === client.user &&
    message.embeds.some((embed) => embed.title === embedName)

  return messages.find(isAssignListMessage) ?? null
}

const updateAssignListEmbed = async (
  embed: MessageEmbed,
  message: Message | null
) => {
  if (message === null) {
    const channel = await fetchTextChannel(ID_CHANNEL_ASSIGN_LIST)
    await channel.send({ embeds: [embed] })
    return
  }

  await message.edit({ embeds: [embed] })
}

const sendAssignListEmbed = async () => {
  const targetGuild = client.guilds.resolve(ID_GUILD_MAIN)
  const roles = await targetGuild?.roles.fetch()
  if (roles === undefined) return

  const assignList = createAssignList(roles)
  const embed = createAssignListEmbed(assignList)
  const channel = await fetchTextChannel(ID_CHANNEL_ASSIGN_LIST)
  const message = await fetchAssignListMessage(channel)

  await updateAssignListEmbed(embed, message)
}

////////////////////////////////////////////////////////////////////////////////

client.on('ready', () => sendAssignListEmbed())

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (newMember.guild.id !== ID_GUILD_MAIN) return
  if (oldMember.roles.cache.size === newMember.roles.cache.size) return

  await sendAssignListEmbed()
})
