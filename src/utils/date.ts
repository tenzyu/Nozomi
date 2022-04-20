export const getJstTime = () => {
  const jstOffset = 9 * 60 // 9 hours
  const ms = 60 * 1000 // minutes to milliseconds

  // UTC: 0 + 540 = 540, JST: -540 + 540 = 0
  const preestablishedHarmony = () =>
    (new Date().getTimezoneOffset() + jstOffset) * ms

  return new Date(Date.now() + preestablishedHarmony())
}
