
# myRetail RESTful service #

myRetail is a rapidly growing company with HQ in Richmond, VA and over 200 stores across the east coast. myRetail wants to make its internal data available to any number of client devices, from myRetail.com to native mobile apps. The goal for this exercise is to create an end-to-end Proof-of-Concept for a products API, which will aggregate product data from multiple sources and return it as JSON to the caller. Your goal is to create a RESTful service that can retrieve product and price details by ID. The URL structure is up to you to define, but try to follow some sort of logical convention.Build an application that performs the following actions: 

* Responds to an HTTP GET request at /products/{id} and delivers product data as JSON (where {id} will be a number. 

* Example product IDs: 15117729, 16483589, 16696652, 16752456, 15643793) 

* Example response: {"id":13860428,"name":"The Big Lebowski (Blu-ray) (Widescreen)","current_price":{"value": 13.49,"currency_code":"USD"}}

* Performs an HTTP GET to retrieve the product name from an external API. (For this exercise the data will come from redsky.target.com, but let’s just pretend this is an internal resource hosted by myRetail) 

* Example: http://redsky.target.com/v2/pdp/tcin/13860428?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics

* Reads pricing information from a NoSQL data store and combinesit with the product id and name from the HTTP request into a single response. 

* BONUS: Accepts an HTTP PUT request at the same path (/products/{id}), containing a JSON request body similar to the GET response, and updates the product’s price in the data store.

- - - -

## Hosted production instance of MyRetail ##
### Heroku may need to way up. The first time the server is hit it may need a few seconds 🚀⏲🚀  ###

* GET https://my-retail9000.herokuapp.com/products/{id}

Where {id} is the product id number of an existing product

* POST https://my-retail9000.herokuapp.com/products

Requires JSON body of the shape:
~~~
}
    id: String,
    value: Number,
    currency_code: String,
}
~~~
Example post:
~~~
{
	"id":"13860421",
	"value": 13.49,
	"currency_code": "USD"
}
~~~
* PUT https://my-retail9000.herokuapp.com/products/{id}

Where {id} is the product id number of an existing product

Requires JSON body of the shape:
~~~
}
    value: Number
}
~~~

Example put:
~~~
{
    "value": 13.33
}
~~~
* DELETE https://my-retail9000.herokuapp.com/products/{id}

Where {id} is the product id number of an existing product

- - - -

## installing local development version of myRetail ##

1. install node.js https://nodejs.org/en/

2. clone this repo 

3. install npm dependencies `npm install`

4. create `.env` file and add environment variables

5. MongoDB Atlas should be whitelisted for all IP addresses

6. for testing run `npm run test`

7. to start the server run `npm run start:dev`

8. local devevelopment endpoints are the same as the above Heroku endpoints except they are http://localhost:4000/products/
or http://localhost:4000/products/{id}

Where {id} is the product id number of an existing product
- - - -
## Seeded data ##

Both development and production have their own data store and test is running on a mock db unless told otherwise

### example seeds ###
~~~
{
  "id": 13860428,
  "name": "The Big Lebowski (Blu-ray)",
  "current_price": {
    "value": 13.43,
    "currency_code": "USD"
  }
}

{
  "id": 13860421,
  "name": "Revolutionary Girl Utena: Apocalypse Saga Collection (DVD)",
  "current_price": {
    "value": 9.99,
    "currency_code": "USD"
  }
}
~~~

- - - -

## Authentication ##

JWT Webtoken available but auth middleware is not in place on any route. `VeryifyToken` can be placed in any route to secure it. Due to testing concerns and demonstrating other functionality of the api I chose to leave them off.

~~~
router.post("/", async, verifyToken, (req, res)=>{
  // secure route
})
~~~

To register a new user 

http://localhost:4000/auth/register


http://localhost:4000/auth/login


