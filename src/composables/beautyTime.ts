import { date } from 'quasar'
import { useI18nOutsideSetup } from 'boot/i18n'

type BTAgeFormat = 'short' | 'long'

const { t } = useI18nOutsideSetup()
const SPACE = ' '

export function beautyAge ( time: string | Date, format: BTAgeFormat = 'short' ) {
  if (typeof time === 'string') {
    time = new Date(time)
  }

  const now = new Date()
  const diff = explainedDateDiff(time, now) as any
  let age = ''

  Object.keys(diff).filter(key => diff[key] > 0).forEach(key => {
    age += t(`btAge.${format}.${key}`, diff[key]) + SPACE
  })

  if (!age) {
    age = t(`btAge.${format}.now`)
  }

  return age.trim()
}

function explainedDateDiff ( first: Date | number | string, second: Date | number | string ) {
  return {
    days: date.getDateDiff(first, second, 'days'),
    hours: date.getDateDiff(first, second, 'hours') % 24,
    minutes: date.getDateDiff(first, second, 'minutes') % 60,
    seconds: date.getDateDiff(first, second, 'seconds') % 60
  }
}
