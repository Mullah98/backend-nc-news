const app = require('../app')
const request = require('supertest')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data')
const db = require('../db/connection.js')
const endpoints = require('../endpoints.json')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => db.end())

describe('/api/topics', () => {
    test('GET: 200 Should return an array of topic objects with the correct keys', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((result) => {
            const topicArr = result.body;
            expect(typeof topicArr).toBe('object')
            expect(Array.isArray(topicArr.topics)).toBe(true)
            expect(topicArr.topics).toHaveLength(3)
            topicArr.topics.forEach((topic) => {
            expect(topic).toHaveProperty('description')
            expect(topic).toHaveProperty('slug')
        })
        })
    })
})

describe('/api/*', () => {
    test('Returns 404 for path which does not exist', () => {
        return request(app)
        .get('/api/non-existant-path')
        .expect(404)
        .then((response) => {
            const msg = response.body.msg
            expect(msg).toBe('Unable to find')
        })
    })
})

describe('endpoints', () => {
    test('Respond with an object describing all the available endpoints on your API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body.endpoints).toEqual(endpoints)
        })
    })
})