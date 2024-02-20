const app = require('../app')
const request = require('supertest')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data')
const db = require('../db/connection.js')

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
            expect(topicArr).toHaveLength(3)
            topicArr.forEach((topic) => {
            expect(topic).toHaveProperty('description')
            expect(topic).toHaveProperty('slug')
        })
        })
    })
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