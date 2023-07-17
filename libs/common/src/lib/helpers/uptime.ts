import os from 'node:os'

const getSeconds = (uptime: number): number => {
  return Math.floor(uptime % 60)
}

const getMinutes = (uptime: number): number => {
  return Math.floor((uptime / 60) % 60)
}

const getHours = (uptime: number): number => {
  return Math.floor((uptime / (60 * 60)) % 24)
}

const getDays = (uptime: number): number => {
  return Math.floor(uptime / (60 * 60 * 24))
}

const getSecondsDisplay = (seconds: number): string => {
  return seconds > 0 ? `${seconds} seconds` : ''
}

const getMinutesDisplay = (minutes: number): string => {
  return minutes > 0 ? `${minutes} minutes` : ''
}

const getHoursDisplay = (hours: number): string => {
  return hours > 0 ? `${hours} hours` : ''
}

const getDaysDisplay = (days: number): string => {
  return days > 0 ? `${days} days` : ''
}

export const getUptime = (): string => {
  const uptime = os.uptime()
  const seconds = getSeconds(uptime)
  const minutes = getMinutes(uptime)
  const hours = getHours(uptime)
  const days = getDays(uptime)

  const secondsDisplay = getSecondsDisplay(seconds)
  const minutesDisplay = getMinutesDisplay(minutes)
  const hoursDisplay = getHoursDisplay(hours)
  const daysDisplay = getDaysDisplay(days)

  return String(
    `${daysDisplay} ${hoursDisplay} ${minutesDisplay} ${secondsDisplay}`,
  ).trim()
}
