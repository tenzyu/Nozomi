import { config } from 'dotenv'
import { join } from 'path'

config({ path: join(__dirname, '../.env') })

export const DAY_OF_SNOWFLAKE = 362387865600000

// config
export const TOKEN_BOT_DISCORD = process.env.DISCORD_BOT_TOKEN
export const ID_GUILD_MAIN = process.env.ID_GUILD_MAIN ?? '888738059036798986'
export const ID_CATEGORY_ACTIVE =
  process.env.ID_CATEGORY_ACTIVE ?? '921809230783209542'
export const ID_CATEGORY_INACTIVE =
  process.env.ID_CATEGORY_INACTIVE ?? '964203079287337050'
export const ID_CHANNEL_ASSIGN_LIST =
  process.env.ID_CHANNEL_ASSIGN_LIST ?? '889097552912334909'
export const ID_CHANNEL_LOG_BOT_ACTIVITY =
  process.env.ID_CHANNEL_LOG_BOT_ACTIVITY ?? '920073333117186068'
export const ID_ROLE_EVERYONE2 =
  process.env.ID_ROLE_EVERYONE2 ?? '927501472046940190'

// app
export const ID_CHANNEL_TASK_MANAGER =
  process.env.ID_CHANNEL_TASK_MANAGER ?? '888745950649155604'
export const ID_CHANNEL_REVISE =
  process.env.ID_CHANNEL_REVISE ?? '968120201604374568'
export const ID_CHANNEL_DUMP =
  process.env.ID_CHANNEL_DUMP ?? '972830221667561482'
