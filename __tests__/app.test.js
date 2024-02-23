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

describe('GET /api/topics', () => {
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

describe('GET /api/articles/:article_id', () => {
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
            expect(response.body.msg).toBe('Request not found')
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

describe('GET /api/articles', () => {
    test('GET:200 Should respond with an articles array of article objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body)).toBe(true)
            expect(typeof response.body).toBe('object') && (response.body).toHaveLength(5)
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
            expect(articles).toBeSortedBy("created_at", 
            { descending: true})
        })
    })
    test('GET:404 Should respond with an appropiate status and error message when given a valid but not existant endpoint', () => {
        return request(app)
        .get('/api/invalid-endpoint')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Unable to find article')
        })
    })
})

 describe('GET /api/articles/:article_id/comments', () => {
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
            expect(comment.article_id).toBe(1)
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
        .get('/api/articles/2/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('No comments found for this article')
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

 describe('POST /api/articles/:article_id/comments', () => {
    test('GET:201 Should respond with the new posted comment', () => {
        const newComment = {
            "username": 'lurker',
            "body": 'This article is sensational',
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .set('accept', 'application/json')
        .expect(201)
        .then((response) => {
            expect(response.body).toHaveProperty('body')
            expect(response.body.body).toBe('This article is sensational')
        })
    })
    test('GET:404 Should respond with appropiate error message if passed in non existant article_id', () => {
        const newComment = {
            "username": 'lurker',
            "body": 'This article is sensational',
        }
        return request(app)
        .post('/api/articles/999/comments')
        .send(newComment)
        .set('accept', 'application/json')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Request not found')
        })
    })
    test('GET:400 Should respond with appropiate error message if passed in invalid article_id', () => {
        const newComment = {
            "username": 'lurker',
            "body": 'This article is sensational',
        }
        return request(app)
        .post('/api/articles/pizza/comments')
        .send(newComment)
        .set('accept', 'application/json')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request')
        })
    })
    test('GET:404 Should respond with appropiate error message if object does not have username property', () => {
        const newComment = {
            "body": 'Meh, could be better'
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .set('accept', 'application/json')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request')
        })
    })
    test('GET:404 Should respond with appropiate error message if object does not have body property', () => {
        const newComment = {
            "username": 'butter_bridge'
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .set('accept', 'application/json')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request')
        })
    })
    test('GET:404 Should respond with appropiate error message if user does not exist', () => {
        const newComment = {
            "username": 'Kratos',
            "body": 'This article is sensational',
        }
        return request(app)
        .post('/api/articles/999/comments')
        .send(newComment)
        .set('accept', 'application/json')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Request not found')
        })
    })
})
describe('PATCH /api/articles/:article_id', () => {
    test('GET:201 Should update an article by article_id', () => {
        const votes = { 'inc_votes': 10}
        return request(app)
        .patch('/api/articles/1')
        .send(votes)
        .set('accept', 'application/json')
        .expect(201)
        .then((response) => {
            const article = response.body.article
            expect(article.votes).toBe(110)
        })
    })
    test('GET:201 Should decrease article vote when given a negative number', () => {
        const votes = { 'inc_votes': -100}
        return request(app)
        .patch('/api/articles/1')
        .send(votes)
        .set('accept', 'application/json')
        .expect(201)
        .then((response) => {
            const article = response.body.article
            expect(article.votes).toBe(0)
        })
    })
    test('GET:400 Should response with bad request if article_id is invalid', () => {
        const votes = { 'inc_votes': 5}
        return request(app)
        .patch('/api/articles/invalid-id')
        .send(votes)
        .set('accept', 'application/json')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request')
        })
    })
    test('GET:404 Should response with bad request if article_id is valid but non-existant', () => {
        const votes = { 'inc_votes': 5}
        return request(app)
        .patch('/api/articles/999')
        .send(votes)
        .set('accept', 'application/json')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Article not found')
        })
    })
    test('GET:400 Should response with bad request if newVote has no value', () => {
        const votes = { 'inc_votes': ''}
        return request(app)
        .patch('/api/articles/invalid-id')
        .send(votes)
        .set('accept', 'application/json')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request')
        })
    })
})

describe('DELETE /api/comments/:comment_id', () => {
    test('GET:204 Should delete given comment by commentID', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then((response) => {
            expect(response.body).toEqual({})
        })
    })
    test('GET:404 Should return an appropiate error message if comment does not exist', () => {
        return request(app)
        .delete('/api/comments/99')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Comment not found')
        })
    })
    test('GET:404 Should return an appropiate error message if comment id is invalid', () => {
        return request(app)
        .delete('/api/comments/invalid-id')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request')
        })
    })
})