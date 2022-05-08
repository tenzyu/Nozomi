import { SnowflakeUtil } from 'discord.js'

export const getJstTime = () => {
  const jstOffset = 9 * 60 // 9 hours
  const ms = 60 * 1000 // minutes to milliseconds
  const preestablishedHarmony = () =>
    (new Date().getTimezoneOffset() + jstOffset) * ms // UTC: 0 + 540 = 540, JST: -540 + 540 = 0

  return new Date(Date.now() + preestablishedHarmony())
}

// discord から流用できるので使う
export const toSnowflake = (date: Date) => SnowflakeUtil.generate(date)
