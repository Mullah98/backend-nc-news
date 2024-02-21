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
            expect(msg).toBe('Unable to find article')
        })
    })
})

describe('endpoints', () => {
    test('Should respond with an object describing all the available endpoints on your API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body.endpoints).toEqual(endpoints)
        })
    })
})

describe('/api/articles/:article_id', () => {
    test('GET:200 Should respond with an article object', () => {
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
    test('GET:404 Should respond with a appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/article/999')
        .expect(404)
        .then((response) => {
            expect(response.body.status).toBe(404)
            expect(response.body.msg).toBe('Unable to find article')
        })
    })
    test('GET:400 Should respond with an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/article/invalid')
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Bad request')
        })
    })
})

describe('/api/articles', () => {
    test('GET:200 Should respond with an articles array of article objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body)).toBe(true)
            expect(typeof response.body).toBe('object')
            expect(response.body).toHaveLength(13)
        })
    })
    test('GET:200 Should contain the correct property keys except the body property', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body
            articles.forEach((article) => {
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).toHaveProperty('comment_count')
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    test('GET:200 Articles should be sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body
            expect(articles[0].created_at).toContain('2020-11-03')
            expect(articles[12].created_at).toContain('2020-01-07')
        })
    })
    test('GET:404 Should respond with an appropiate status and error message when given a valid but not existant endpoint', () => {
        return request(app)
        .get('/api/articlez')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Unable to find article')
        })
    })
})

 describe('/api/articles/:article_id/comments', () => {
    test('GET:200 Should respond with an array of objects', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body)).toBe(true)
            response.body.forEach((body) => {
                expect(typeof body).toBe('object')
            })
        })
    })
    test('GET:200 Should contain the correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
        const comments = response.body
        comments.forEach((comment) => {
            expect(comment).toHaveProperty('comment_id')
            expect(comment).toHaveProperty('votes')
            expect(comment).toHaveProperty('created_at')
            expect(comment).toHaveProperty('author')
            expect(comment).toHaveProperty('body')
            expect(comment).toHaveProperty('article_id')
        })
        })
    })
    test('GET:200 Should be served with the most recent comments first', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body
            expect(comments).toBeSortedBy('created_at', {
                descending: true
            })
        })
    })
    test('GET:404 Should respond with a appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.status).toBe(404)
            expect(response.body.msg).toBe('Unable to find comments')
        })
    })
    test('GET:400 Should respond with an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/invalid/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.status).toBe(400)
            expect(response.body.msg).toBe('Bad request')
        })
    })
 })