const fs = require('fs')
const Bluebird = require('bluebird')
const {
  green,
  yellowBright,
  bold,
  greenBright,
  yellow,
  dim,
} = require('colorette')
const path = require('path')
const axios = require('axios')

const baseURL = 'http://midacloud/api'

const client = axios.create({
  baseURL,
})

const CREDENCIALS = {
  email: 'admin@midacloud.com',
  password: 'admin',
}

const signin = async ({ email, password } = CREDENCIALS) => {
  const url = '/auth/signin'

  console.info(yellowBright(`POST ${url}`))

  await client
    .post(url, {
      email,
      password,
    })
    .then((response) => {
      console.info(response.data)
      const { accessToken, refreshToken } = response.data

      client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      client.defaults.headers.common['X-Refresh-Token'] = refreshToken
    })
    .catch((error) => {
      console.error(error.response.data)
      process.exit(1)
    })

  console.log(dim('-'.repeat(50)))
}

const refreshToken = async () => {
  const url = '/auth/refresh-token'

  console.info(yellowBright(`PATCH ${url}`))

  await client
    .patch(url)
    .then((response) => {
      console.info(response.data)
    })
    .catch((error) => {
      console.error(error.response.data)
      process.exit(1)
    })

  console.log(dim('-'.repeat(50)))
}

const run = async () => {
  await signin()
  await Bluebird.delay(1000)
  await refreshToken()
  await Bluebird.delay(1000)

  console.info(greenBright(bold('completed!')))

  const answer = await Bluebird.promisify((cb) => {
    process.stdout.write(
      bold('\n[ PRESS ANY KEY TO CONTINUE OR "N" TO EXIT ]\n'),
    )
    process.stdin.on('data', (data) => {
      cb(null, data.toString().trim())
    })

    process.stdin.on('error', (error) => {
      cb(error)
    })
  })()

  if (answer === 'N' || answer === 'n') {
    process.exit(0)
  }

  console.clear()
  return run()
}

run()
