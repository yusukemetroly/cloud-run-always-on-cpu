import { PubSub } from '@google-cloud/pubsub'
import moment from 'moment'

const projectId = 'parabolic-craft-306702'
const topicName = 'ordered-topic-1'
const subscriptionName = 'ordered-topic-sub-1'
const pubsub = new PubSub({ projectId })

export const publish = async () => {
  const topic = pubsub.topic(topicName)
  const priorities = ['01:HIGH', '02:MEDIUM', '03:LOW']

  setInterval(async () => {
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const now = moment().format('HH:mm:ss')
    const data = JSON.stringify({ now, priority })
    const dataBuffer = Buffer.from(data)

    await topic.publishMessage({
      data: dataBuffer,
      orderingKey: priority,
    })
    console.log('publishing...')
    console.log(data)
  }, 1000)
}

publish()
