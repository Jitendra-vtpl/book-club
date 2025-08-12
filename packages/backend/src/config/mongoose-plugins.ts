import mongoose, { Schema, Query, Aggregate, Document, Model, Types } from 'mongoose'

// function snakeTimestampsPlugin(schema: Schema) {
//   const timestampsSetting = schema.get('timestamps')
//   if (timestampsSetting !== false) {
//     schema.set('timestamps', { createdAt: 'created_at', updatedAt: 'updated_at' })
//   }
// }

export function softDeletePlugin(schema: Schema) {
  schema.add({
    deleted_at: { type: Date, default: null, index: true },
  })

  schema.pre(/^find/, function (next) {
    const query = this as Query<unknown, unknown>
    const getOptions = (query as unknown as { getOptions?: () => unknown }).getOptions
    const options = typeof getOptions === 'function' ? (getOptions.call(query) as Record<string, unknown>) : {}
    const withDeleted = Boolean((options as Record<string, unknown>).withDeleted)    

    if (!withDeleted) {
      query.where({ deleted_at: null })
    }

    next()
  })

  schema.pre('aggregate', function (next) {
    const agg = this as Aggregate<unknown[]>
    const hasPipelineFn = (agg as unknown as { pipeline?: () => unknown[] }).pipeline
    const pipeline = typeof hasPipelineFn === 'function' ? (hasPipelineFn.call(agg) as unknown[]) : []

    const firstStage = (pipeline[0] ?? {}) as Record<string, unknown>
    const hasExplicitDeletedMatch = Boolean(
      (firstStage.$match as Record<string, unknown> | undefined) &&
        Object.prototype.hasOwnProperty.call(firstStage.$match, 'deleted_at'),
    )

    if (!hasExplicitDeletedMatch) {
      ;(pipeline as Array<Record<string, unknown>>).unshift({ $match: { deleted_at: null } })
    }

    next()
  })

  ;(schema.query as Record<string, unknown>)['withDeleted'] = function (this: Query<unknown, unknown>) {
    return this.setOptions({ withDeleted: true })
  }

  ;(schema.methods as Record<string, unknown>)['softDelete'] = function (
    this: Document & { deleted_at: Date | null },
  ) {
    this.set('deleted_at', new Date())
    return this.save()
  }

  ;(schema.statics as Record<string, unknown>)['softDeleteById'] = function (
    this: Model<unknown>,
    id: Types.ObjectId | string,
  ) {
    return this.updateOne(
      { _id: id, deleted_at: null },
      { $set: { deleted_at: new Date() } },
    )
  }  
}

export function registerGlobalMongoosePlugins() {
  // mongoose.plugin(snakeTimestampsPlugin)
  mongoose.plugin(softDeletePlugin)
}

