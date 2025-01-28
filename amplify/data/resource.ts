import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    comments: a.hasMany('Comment', 'postId'),
    owner: a.string()
  }).authorization(allow => [allow.guest().to(['read']),
allow.owner()]),
   
  Comment: a.model({
    content: a.string().required(),
    postId: a.id(),
    post: a.belongsTo('Post', 'postId'),
    owner: a.string()
  }).authorization(allow => [allow.guest().to(['read']),
  allow.owner()]),

  User: a
  .model({
    bikes: a.hasMany('Bike', 'userId'),
  }).authorization(allow => [
  allow.owner()]),

  Bike: a
  .model({
    bikeNumber: a.integer(),
    brand: a.string(),
    model: a.string(),
    year: a.integer(),
    sold: a.boolean(),
    broken: a.boolean(),
    ownershipMonths: a.integer(),
    score: a.float(),
    userId: a.id(),
    user: a.belongsTo('User', 'userId'),
  }).authorization(allow => [allow.guest().to(['read', 'create']),
  allow.owner()]),

  BrandStats: a
  .model({
    brandName: a.string(),
    avgSatisScore: a.float(),
    totalNumBikes: a.integer(),
    numFirstBike: a.integer(),
    numSecondBike: a.integer(),
    numThirdPlusBike: a.integer(),
    numBroken: a.integer(),
    numSold: a.integer(),
    avgOwnership: a.float(),
  }).authorization(allow => [allow.guest(),
  allow.owner()]),

  ModelStats: a
  .model({
    modelName: a.string(),
    brandName: a.string(),
    avgSatisScore: a.float(),
    totalNumBikes: a.integer(),
    numFirstBike: a.integer(),
    numSecondBike: a.integer(),
    numThirdPlusBike: a.integer(),
    numBroken: a.integer(),
    numSold: a.integer(),
    avgOwnership: a.float(),
  }).authorization(allow => [allow.guest(),
  allow.owner()]),

  BikeStats: a
  .model({
    modelName: a.string(),
    bikeYear: a.integer(),
    bikeNum: a.integer(),
  }).authorization(allow => [allow.guest(),
  allow.owner()]),

  TotalStats: a
  .model({
    totalAvgSatisScore: a.float(),
    totalNumBikes: a.integer(),
    totalNumFirst: a.integer(),
    totalNumSecond: a.integer(),
    totalNumThird: a.integer(),
    totalNumBroken: a.integer(),
    totalNumSold: a.integer(),
    totalAvgOwnership: a.float(),
  }).authorization(allow => [allow.guest(),
  allow.owner()]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
