import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

// config
export const discordBotToken = process.env.DISCORD_BOT_TOKEN;
export const mainGuildId = '888738059036798986';
export const channelTaskManager = '888745950649155604';
export const channelAssignList = '889097552912334909';
export const channelLogBotActivity = '920073333117186068';
