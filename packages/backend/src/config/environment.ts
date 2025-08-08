import { config } from 'dotenv'
config()

const environment: Record<string, string> = {}
Object.keys(process.env).forEach(key => {
  const object = process.env
  environment[key] = object[key] as string
})

export default environment
