import mongoose from 'mongoose'
import appConfig from './app'
import logger from '../helpers/logger'
// import { registerGlobalMongoosePlugins } from './mongoose-plugins'

export const connectDB = async () => {
  try {    
    await mongoose.connect(appConfig.db.uri, {
      dbName: appConfig.db.name,
    })
    // registerGlobalMongoosePlugins()
    logger.info('MongoDB connected')
  } catch (err) {
    logger.error('MongoDB connection error:', err)
    process.exit(1)
  }
}
