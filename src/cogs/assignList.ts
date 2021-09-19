import { client } from '../index';
import { mainGuildId, channelAssignList } from '../constant';
import { Collection, Message, Role, TextChannel } from 'discord.js';
import { getTextChannelById } from '../lib/discordBotUtils';

const embedName = 'Assign List';

const newAssignList = (roles: Collection<string, Role>): string => {
  const assignList = roles
    .map((role) => `${role.toString()}\n${role.members.map(String).join('\n')}`)
    .join('\n\n');
  return assignList;
};

const createAssignListEmbed = (assignList: string) => {
  const assignListEmbed = {
    color: 0xff4596,
    title: embedName,
    description: assignList,
    author: {
      name: '希'
    },
    thumbnail: {
      url: client.user?.avatarURL
    },
    timestamp: new Date(),
    footer: {
      text: 'きゃ～'
    }
  };
  return assignListEmbed;
};

const findAssignListMessage = (channel?: TextChannel): Message | null => {
  const message = channel?.lastMessage;
  if (message === undefined || message === null) {
    return null;
  }

  if (message.author == client.user && message.embeds) {
    for (const embed of message.embeds) {
      if (embed.title === embedName) {
        return message;
      }
    }
  }
  return null;
};

const updateAssignListEmbed = async (embed: any, message: Message | null) => {
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
  const message = findAssignListMessage(getTextChannelById(channelAssignList));
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
