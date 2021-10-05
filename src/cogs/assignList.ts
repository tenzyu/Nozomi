import { client } from '../index';
import { mainGuildId, channelAssignList } from '../constant';
import { Collection, Message, MessageEmbed, Role, TextChannel } from 'discord.js';
import { getTextChannelById } from '../lib/discordBotUtils';

const embedName = 'Assign List';

const newAssignList = (roles: Collection<string, Role>): string => {
  const assignList = roles
    .filter((role) => role.name.endsWith("班") || role.name === "進捗警察")
    .map((role) => `${role.toString()}\n${role.members.map(String).join('\n')}`)
    .join('\n\n');
  return assignList;
};

const createAssignListEmbed = (assignList: string): MessageEmbed => {
  const embed = new MessageEmbed({
    color: 0xff4596,
    title: embedName,
    description: assignList,
    author: {
      name: '希'
    },
    timestamp: new Date(),
    footer: {
      text: 'きゃ～'
    }
  })
  const url = client.user?.avatarURL()
  if (typeof url === "string"){
    embed.setThumbnail(url)
  }
  return embed;
};

const findAssignListMessage = async (channel?: TextChannel): Promise<Message | null> => {
  const messages = await channel?.messages.fetch();
  return messages?.find((message) =>
      message.author === client.user
      && message.embeds.some((embed)=> embed.title === embedName)
  ) ?? null;
};

const updateAssignListEmbed = async (embed: MessageEmbed, message: Message | null) => {
  if (message === null) {
    await getTextChannelById(channelAssignList)?.send({ embeds: [embed] });
    return;
  }
  await message.edit({ embeds: [embed] });
};

const sendAssignListEmbed = async () => {
  const targetGuild = client.guilds.resolve(mainGuildId);
  const roles = await targetGuild?.roles.fetch();
  if (roles === undefined) {
    return;
  }
  const assignList = newAssignList(roles);
  const embed = createAssignListEmbed(assignList);
  const message = await findAssignListMessage(getTextChannelById(channelAssignList));
  await updateAssignListEmbed(embed, message);
};

client.on('ready', async () => {
  await sendAssignListEmbed();
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (newMember.guild.id !== mainGuildId) {
    return;
  }

  if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    await sendAssignListEmbed();
  }
});
