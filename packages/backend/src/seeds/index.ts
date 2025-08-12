import mongoose from 'mongoose'
import logger from '../helpers/logger'
import { connectDB } from '../config/database'
import seedRoles from './role'
import seedCategories from './category'
import seedUsers from './user'
import seedBooks from './book'

async function run() {
  await connectDB()
  await seedRoles()
  await seedCategories()
  await seedUsers()
  await seedBooks()
}

run()
  .then(async () => {
    logger.info('Seeds completed')
    await mongoose.disconnect()
    process.exit(0)
  })
  .catch(async err => {
    logger.error('Seeds failed', err)
    await mongoose.disconnect()
    process.exit(1)
  }) 