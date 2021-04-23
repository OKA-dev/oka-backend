// users
db.users.createIndex({ 'phone.e164': 1 }, { unique: true })
db.users.createIndex({ 'email': 1 }, { unique: true })
db.users.createIndex({ 'lastKnownLocation.geolocation': '2dsphere'})
db.users.createIndex({ 
  'lastKnownLocation.geolocation': '2dsphere',
  'lastKnownLocation.time': 1
})
db.users.createIndex({ 
  'lastKnownLocation.geolocation': '2dsphere',
  'lastKnownLocation.time': 1,
  'roles': 1
})


// deliveries
db.deliveries.createIndex({ 'start.location': '2dsphere'})
db.deliveries.createIndex({ 'end.location': '2dsphere'})
