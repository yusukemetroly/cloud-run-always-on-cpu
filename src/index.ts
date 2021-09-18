import express from 'express'
import bodyParser from 'body-parser'
import moment from 'moment'
import { publish } from './publish'

// const express = require('express')
const app = express()
const port = Number(process.env.PORT) || 3000
app.use(bodyParser.json())

app.get('', (req, res) => {
  res.send('ok')
})

app.post('', (req, res) => {
  console.log('---------------------')
  const buffer = Buffer.from(req.body.message.data, 'base64')
  const data = JSON.parse(buffer.toString('utf-8'))
  // console.log(data)

  const now = new Date().getTime()
  const publishedAt = new Date(req.body.message.publishTime).getTime()
  console.log(`---- ${Math.floor((now - publishedAt) / 1000)} seconds delay ---- ${data.priority} `)
  // console.log(req.body.message.messageId)
  // console.log(req.body.message.orderingKey)
  // console.log(req.body.message.publishTime)
  res.sendStatus(200)
  // res.sendStatus(429)
})


app.listen(port, () => {
  console.log(`listening at port ${port}`)
})


publish()
