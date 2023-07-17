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
      console.info(response?.data)
      const { accessToken, refreshToken } = response?.data || {}

      client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      client.defaults.headers.common['X-Refresh-Token'] = refreshToken
    })
    .catch((error) => {
      console.error(error?.response?.data)
      process.exit(1)
    })

  console.info(dim('-'.repeat(50)))
}

const refreshToken = async () => {
  const url = '/auth/refresh-token'

  console.info(yellowBright(`POST ${url}`))

  await client
    .post(url)
    .then((response) => {
      console.info(response?.data)
    })
    .catch((error) => {
      console.error(error?.response?.data)
      process.exit(1)
    })

  console.info(dim('-'.repeat(50)))
}

const forgotPassword = async ({ email }) => {
  const url = '/auth/forgot-password'

  console.info(yellowBright(`POST ${url}`))

  await client
    .post(url, { email })
    .then((response) => {
      console.info(response?.data)
      const { accessToken, refreshToken } = response?.data || {}

      client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      client.defaults.headers.common['X-Refresh-Token'] = refreshToken
    })
    .catch((error) => {
      console.error(error.response.data)
      process.exit(1)
    })
}

const run = async () => {
  await signin()
  await Bluebird.delay(100)
  await refreshToken()
  await Bluebird.delay(100)

  const promises = []

  for (let i = 0; i < 1000; i++) {
    promises.push(
      forgotPassword({
        email: CREDENCIALS.email,
      }),
    )
  }

  await Bluebird.all(promises)

  // return run()
}

run()
