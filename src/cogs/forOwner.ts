import { RecurrenceRule, scheduleJob } from 'node-schedule';
import { client } from '../index';
import { getTextChannelById } from '../lib/discordBotUtils';
import * as constant from '../constant';

const schedule = new RecurrenceRule();
schedule.hour = 13; // it means 22:00 PM (JST)
schedule.minute = 0;

scheduleJob(schedule, async () => {
  const channel = getTextChannelById('920072102537732136');
  const reminderMessage = '<@608242236546613259> メラトニンを飲め';

  await channel?.send(reminderMessage);
});

client.on('ready', () => {
  const channel = getTextChannelById(constant.channelLogBotActivity);
  channel?.send('Logged in');
});
