---
sidebar_position: 1
---

# Introduction

Welcome! In this workshop, you will learn how to build a fully functional GraphQL API from scratch utilizing serverless technology such as AWS AppSync, Amazon DynamoDB and Amazon Cognito. We will cover aspects like authentication, authorization and real-time pub/sub.

To accomplish this, we will use TypeScript as our main programming language.

The full workshop should take you around x hours to complete.

## What will we build?

We will create a collaborative task management system where users can create, assign, and update tasks and receive notifications and updates in real-time. We will use AWS AppSync to build a GraphQL API with pub/sub capabilities, and the built-in authentication and authorization features to control which operations users can do. Our data store will be Amazon DynamoDB.

## GraphQL vs REST

GraphQL is an open-source data query and manipulation language for APIs and a query runtime engine. It was created by Facebook in 2012 before being made publicly available in 2015.

GraphQL and REST two ways to create APIs, however they differ in a few ways.

**Reads and Writes**

REST uses verbs to communicate which operation the client wants to perform (e.g. `GET` for reads, and `PUT`, `POST`, `DELETE` for writes).

GraphQL uses _Queries_ for read operations and _Mutations_ for writes. It also disposes of _Subscriptions_ for real-time communication.

**Real-time**

REST does not have any real-time capability. If you need pub/sub for your API, you will need to rely on Websockets and build a completely new API in parallel.

GraphQL supports three types of operations:

- **Queries**: Used to read or fetch data from the data sources. Queries are analogous to HTTP `GET` requests in RESTful APIs.
- **Mutations:** Used to write or update data. They are equivalent to `PUT`, `POST` and `DELETE` operations in REST.
- **Subscriptions:** Used for real-time pub/sub communication with the backend.

**Underfetching and Overfetching**

In REST, **underfetching** occurs when multiple requests are needed to gather all required data. For example, if you need to fetch a user and his/her last 10 orders, you might need to send the following two requests: `GET /user/123`and `GET /orders?userId=123&limit=10&order=DESC`

Sometimes, those requests might even need to be consecutive (i.e. if the second request requires a value coming from the first one). This leads to increased latency and network overhead.

REST APIs also often send more data than necessary. In our previous example, you might only need the `name` , `avatar` and `email` of the user, but not the `address` and `biography`. REST will usually return all those fields. This is called **overfetching** and it increases the payload size unnecessarily.

GraphQL tries to solve those two issues as it allows the client to query the all the necessary data in a single query, and omit what is does not need.

Here is what a GraphQL request looks like

```graphql
query {
  # Get A user
  getUser(id: "123") {
    name
    avatar
    email
    # order from the user
    orders(limit: 10, order: "DESC") {
      id
      date
    }
  }
}
```

## What is AWS AppSync?

AppSync is a fully-managed and serverless service from AWS that allows developers to build scalable GraphQL APIs in no time without having to worry about maintaining servers. AWS AppSync seamlessly integrates with other AWS services such as Amazon DynamoDB, AWS Lambda, Amazon EventBridge, Amazon Aurora, Amazon OpenSearch and Amazon Cognito.

## Will it cost me anything?

This workshop involves deploying several resources into your own AWS account. While most of those services have a generous free tier, and are inexpensive after that, you might incur some charges.

When this workshop is finished, we will also learn how to clean up and remove all the created resources to suppress any possible charges.
