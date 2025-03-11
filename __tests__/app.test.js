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
  test.skip("200: Responds with an object detailing the documentation for each endpoint", () => {
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
      expect(Array.isArray(topics)).toBe(true)
      body.topics.forEach((topic) =>{
        expect(typeof topic.slug).toBe('string')
        expect(typeof topic.description).toBe('string')

      
      //expect(topics[0]).toBe("slug": "football")
      //expect(topics[1].toBe(description: "Footie!")
      
      }) 
    })
  })
})