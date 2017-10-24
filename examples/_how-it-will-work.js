'use strict'

const MongoClient = require('mongodb').MongoClient

// [LIB] Event store for MongoDB.
const MongoEventStore = require('../lib')

/**
 * Default (callback) usage
 */
MongoClient.connect('mongodb://...', { w: 1 }, (err, db) => {
  if (err) {
    console.error(err)
    return
  }

  MongoEventStore.makeAndInitialize(db, (err, es) => {
    if (err) {
      console.error(err)
      return
    }

    // process
    // es.*() ...
  })
})

/**
 * Promise usage (with 'bluebird' module)
 */
const Promise = require('bluebird')
;(async () => {
  try {
    const db = await MongoClient.connect('mongodb://...', { w: 1 })
    const es = new MongoEventStore(db, {
      prefix: 'es',
      keys: {
        topic: 'topic',
        revision: 'revision',
        sequence: 'sequence'
      }
    })

    // OR
    // MongoEventStore
    //   .withPrefix('es')
    //   .withConstants({
    //     TOPIC_KEY: 'topic',
    //     REVISION_KEY: 'revision',
    //     SEQUENCE_KEY: 'sequence'
    //   })

    Promise.promisifyAll(es)
    await es.initializeAsync()

    // process
    // es.*() ...
  } catch (err) {
    console.error(err)
  } finally {
    db.close()
  }
})()
