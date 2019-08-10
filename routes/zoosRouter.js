const knex = require('knex')

const router = require('express').Router();

const Zoos = require('../data/zoos-model.js')

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.db3'
  },
  useNullAsDefault: true,
  debug: true
}

const db = knex(knexConfig)


router.get('/', async (req, res) => {
  try {
    const allZoos = await Zoos.find()
    res.send(allZoos)
  } catch (error) {
    console.log(error)
  }
});

router.get('/:id', (req, res) => {
  Zoos.findById(req.params.id)
    .then(zoos => {
      if(zoos) {
        res.status(200).json(zoos)
      } else {
        res.status(404).json({message: "Not found"})
      }
      
    })
    .catch(error => {
      res.status(500).json(error)
    })
});

router.post('/', (req, res) => {
  db('zoos').insert(req.body, 'id').then(ids => {
    res.status(201).json(ids)
  }).catch(error => {
    res.status(500).json(error)
  })
});

router.put('/:id', (req, res) => {
  const changes = req.body
  db('zoos').where({ id: req.params.id }).update(changes).then(count => {
    if(count > 0) {
      res.status(200).json({ message: `${count} records updated`})
    } else {
      res.status(404).json({ message: "Role not found" })
    }
  }).catch(error =>{
    console.log(error)
    res.status(500).json(error)
  })
});

router.delete('/:id', (req, res) => {
  db('zoos').where({ id: req.params.id }).delete().then(count => {
    if(count > 0) {
      res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record' } deleted`})
    } else {
      res.status(404).json({ message: "Role not found" })
    }
  }).catch(error =>{
    console.log(error)
    res.status(500).json(error)
  })
});

module.exports = router;
