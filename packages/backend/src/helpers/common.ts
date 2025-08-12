import slugify from 'slugify'

export const slugifyString = (str: string): string => slugify(str, {
  lower: true,
  strict: true,
})

export const generateISBN = (): string => {
  const prefix = '978'
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000)
  return `${prefix}${randomNumber}`
}