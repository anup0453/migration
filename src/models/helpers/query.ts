import { Query } from 'mongoose'

import { logger } from '../../utils'

export function setArchived<DocType, Model>(
  this: Query<DocType, Model>,
  query = {},
) {
  const currentQuery = this.getQuery()
  if (!JSON.stringify(currentQuery).includes('isArchived')) {
    this.where({ isArchived: { $ne: true }, ...query })
      .clone()
      .then(null, (err) => {
        logger.error(err)
      })
  }
}
