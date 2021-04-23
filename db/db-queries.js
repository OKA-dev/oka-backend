db.users.updateOne({email: "rider+1@email.com"}, {$set: {lastKnownLocation: {time: new Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765123]}}}})
db.users.updateOne({email: "rider+2@email.com"}, {$set: {lastKnownLocation: {time: new Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423394, 43.87933346765533]}}}})
db.users.updateOne({email: "rider+3@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+4@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+5@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+6@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+7@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+8@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+9@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+10@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+11@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+1@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})
db.users.updateOne({email: "rider+1@email.com"}, {$set: {lastKnownLocation: {time: Date(), geolocation: {type: 'Point', coordinates: [-79.45181149423294, 43.87933346765433]}}}})

db.users.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ -79.4518115555, 43.87833358595 ] }, $maxDistance: 1000 * METERS_PER_MILE } } })

db.users.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [-79.4518115555, 43.87833358595] }, $maxDistance: 1000 * METERS_PER_MILE } } })


db.users.find({ 
  'lastKnownLocation.geolocation': { 
  $nearSphere: { 
    $geometry: { 
      type: 'Point', 
      coordinates: [ -79.4518115555, 43.87833358595 ], 
    }, 
    $maxDistance: 100  * METERS_PER_MILE
    }
  },
  'lastKnownLocation.time': { 
    $gte: new Date(new Date().getTime() - 1000 * 60 * 60)
  },
  'roles': 'rider'
})
