import { PubSub } from '@google-cloud/pubsub'
import moment from 'moment'

const projectId = 'parabolic-craft-306702'
const topicName = 'ordered-topic-1'
const subscriptionName = 'ordered-topic-sub-1'
const pubsub = new PubSub({ projectId })
const priorityMap: {
  [key: string]: number
} = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
}

let messages: any[] = []

const printMessages = () => {
  console.log('---------------------------')
  messages.sort((a, b) => {
    if (a.orderingKey === b.orderingKey) {
      return a.publishTime.getTime() - b.publishTime.getTime()
    } else {
      if (a.orderingKey < b.orderingKey) {
        return -1
      }
      if (a.orderingKey > b.orderingKey) {
        return 1
      }
      return 0
    }
  })

  messages.forEach((message) => {
    console.log(
      `${message.id} - ${message.orderingKey} - ${message.data.toString(
        'utf-8'
      )}`
    )
  })
}

const main = async () => {
  const subscription = pubsub.subscription(subscriptionName)
  console.log('subscribing...')

  subscription.on('message', (message) => {
    let found = false

    // check if message is already in the array
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].id === message.id) {
        messages[i] = message
        found = true
        break
      }
    }

    if (!found) messages.push(message)

    printMessages()
  })
}

const std = () => {}

main()
std()

var stdin = process.stdin
// without this, we would only get streams once enter is pressed
stdin.setRawMode(true)

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume()

// i don't want binary, do you?
stdin.setEncoding('utf-8')

// on any data into stdin
stdin.on('data', async (key) => {
  // ctrl-c ( end of text )
  // @ts-ignore
  if (key === '\u0003') process.exit()

  if (key.toString('utf-8') === 'a' || key.toString('utf-8') === 'n') {
    if (messages.length === 0) {
      console.log('nothing in the list')
    } else {
      if (key.toString('utf-8') === 'n') {
        const message = messages.shift()
        await message.nack()
        console.log('---------------------------')

        console.log(`nacked ${message.id}`)
        printMessages()
      }
      if (key.toString('utf-8') === 'a') {
        const message = messages.shift()
        await message.ack()
        console.log('---------------------------')

        console.log(`acked ${message.id}`)
        printMessages()
      }
    }
  }

  // await lastMessage.ack()
})
