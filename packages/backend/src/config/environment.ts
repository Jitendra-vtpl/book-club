import { config } from 'dotenv'
config({ debug: false, quiet: false })

const environment: Record<string, string> = {}
Object.keys(process.env).forEach(key => {
  const object = process.env
  environment[key] = object[key] as string
})

export default environment
