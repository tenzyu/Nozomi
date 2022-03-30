import { RecurrenceRule, scheduleJob } from 'node-schedule';
import { client } from '../index';
import * as constant from '../constant';
import { getTextChannelById } from '../lib/discordBotUtils';
import { Message } from 'discord.js';

const EMOJI_SET_TASK = '\uD83D\uDCCC'; // Pushpin
const EMOJI_UNSET_TASK = '\uD83D\uDC4D'; // Thumbs Up

const setTask = async (message: Message) => {
  await message.pin();
  await message.reply(
    'タスクを登録したよ！\nタスクが完了したら :thumbsup: を付けよう！'
  );
};

const unsetTask = async (message: Message) => {
  await message.unpin();
  await message.reply(':tada: タスク完了おめでとう！ :tada:');
  await message.reactions.removeAll();
};

client.on('messageReactionAdd', async (reaction, user) => {
  const fixedReaction = reaction.partial ? await reaction.fetch() : reaction;
  const fixedUser = user.partial ? await user.fetch() : user;
  const fixedMessage = fixedReaction.message.partial
    ? await fixedReaction.message.fetch()
    : fixedReaction.message;
  const emoji = fixedReaction.emoji.toString();

  if (
    fixedMessage.channel.id !== constant.channelTaskManager ||
    fixedMessage.author.id !== fixedUser.id ||
    ![EMOJI_SET_TASK, EMOJI_UNSET_TASK].includes(emoji)
  ) {
    return;
  }

  if (emoji === EMOJI_SET_TASK || fixedMessage.content.startsWith('。')) {
    await setTask(fixedMessage);
  } else if (emoji === EMOJI_UNSET_TASK) {
    await unsetTask(fixedMessage);
  }
});

const schedule = new RecurrenceRule();
schedule.hour = 9; // it means 18:00 in JST
schedule.minute = 0;

scheduleJob(schedule, async () => {
  const channel = getTextChannelById(constant.channelTaskManager);
  const tasks = await channel?.messages.fetchPinned();
  if (!tasks || tasks.size === 0) return;

  const taskAuthorMentions = Array.from(
    new Set(tasks.map((task) => task.author.toString()))
  );

  const taskReminderMessage =
    taskAuthorMentions.join(' ') +
    '\n未完了のタスクがあります！' +
    '\n未完了のタスクはピン留めされています！';

  await channel?.send(taskReminderMessage);
});
