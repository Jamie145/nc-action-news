const endpointsJson = require("../endpoints.json");

const db = require("../db/connection")
const seed=require('../db/seeds/seed')
const request = require("supertest");
const data = require("../db/data/test-data");
const app = require("../app");
/* Set up your test imports here */

beforeEach(()=> {


  return seed(data)
})
afterAll(()=> {
  return db.end()
})

/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () =>{
  test("To respond with topics ", () =>{
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body: {topics } })=> {
      expect(topics.length).toBeGreaterThan(0)
      expect(topics.length).toBe(3)
      expect(Array.isArray(topics)).toBe(true)
      topics.forEach((topic) =>{
        expect(typeof topic.slug).toBe('string')
        expect(typeof topic.description).toBe('string')
      
      }) 
    })
  })
})
describe('GET /api/articles/:article_id', () =>{
  test('Responds with an article object contaiing properties',() =>{
    return request(app)
    .get("/api/articles/3")
    .expect(200)
    .then(({body: {article}}) =>{
      expect(article).toBeDefined();
      expect(article.article_id).toBe(3)
      expect(article).toHaveProperty('author');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('article_id');
      expect(article).toHaveProperty('body');
      expect(article).toHaveProperty('topic');
      expect(article).toHaveProperty('created_at');
      expect(article).toHaveProperty('votes');
      expect(article).toHaveProperty('article_img_url');

    })
  } )
  test('responds with 404 when article is not found', () => {
    return request(app)
      .get('/api/articles/99') 
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Article not found');
      });
  });

})