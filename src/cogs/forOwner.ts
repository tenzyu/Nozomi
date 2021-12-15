import { RecurrenceRule, scheduleJob } from 'node-schedule';
import { client } from '../index';
import { getTextChannelById } from '../lib/discordBotUtils';
import * as constant from '../constant';
import outdent from 'outdent';
import { TextChannel } from 'discord.js';

let channelReminder: TextChannel | undefined;
client.on('ready', () => {
  // init
  channelReminder = getTextChannelById('920072102537732136');

  const channel = getTextChannelById(constant.channelLogBotActivity);
  channel?.send('Logged in');
});

const melatonin = new RecurrenceRule();
// it means 00:00 PM (JST)
melatonin.hour = 15;
melatonin.minute = 0;

scheduleJob(melatonin, async () => {
  const reminderMessage = outdent`
  <@608242236546613259>
  まだ寝ていないならメラトニンを飲め
  `;
  await channelReminder?.send(reminderMessage);
});

const reviewNotes = new RecurrenceRule();
// it means 15:00, 00:00 PM (JST)
reviewNotes.hour = [6, 15];
reviewNotes.minute = 0;

scheduleJob(reviewNotes, async () => {
  const reminderMessage = outdent`
  <@608242236546613259>
  ノートを見ろ
  `;
  await channelReminder?.send(reminderMessage);
});

// 不完全な実装
