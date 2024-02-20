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

describe('/api/articles/:article_id', () => {
    test('GET: 200 Responds with an article object', () => {
        return request(app)
        .get('/api/article/1')
        .expect(200)
        .then((response) => {
            const article = response.body
            expect(article).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
              })
        })
    })
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/article/999')
        .expect(404)
        .then((response) => {
            expect(response.body.status).toBe(404)
            expect(response.body.msg).toBe('Article not found')
        })
    })
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/article/invalid')
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Bad request')
        })
    })
})