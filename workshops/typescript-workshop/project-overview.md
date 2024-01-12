---
sidebar_position: 3
---

# Project Overview

## Workspace Structure

The working directory should look like this.

```bash
├── codegen.ts
├── definitions
│   ├── appsync.ts
│   ├── cognito.ts
│   └── dynamodb.ts
├── schema
│   └── schema.graphql
├── serverless.ts
└── src
    ├── resolvers
    │   └── Query.getTask.ts
    ├── types
    │   ├── db.ts
    │   └── schema.ts
    └── utils.ts
```

- `codegen.ts` contains GraphQL codegen configuration.
- `definitions` is a directory containing files with Serverless Framework definitions.
- `schema` is a directory containing the schema for our API.
- `serverless.ts` is the entry point of our Serverless Framework definitions.
- `src` will contain the business logic for our API as well as some TypeScript types.

## The GraphQL schema

Open `schema/schema.graphql`. It contains a basic schema for our API, including several types (e.g. `Task` and `Project`), some queries (e.g. `getTask`) and mutations (`createTask`).

If you want to learn more about types, fields and GraphQL schemas, go to the [GraphQL docs](https://graphql.org/learn/schema/#object-types-and-fields).

## TypeScript

AWS AppSync allows us to write resolvers in JavaScript. However, in order to have better auto-complete capabilities, as well as safeguarding us from making mistakes, we can also use TypeScript.

By default, AWS AppSync does not support TypeScript. Instead, it supports a [limited flavour of JavaScript](https://blog.graphbolt.dev/everything-you-should-know-about-the-appsync-javascript-pipeline-resolvers). Luckily, the serverless-appsync-plugin automatically [transpiles and bundles TypeScript into AppSync-compatible Javascript](https://github.com/sid88in/serverless-appsync-plugin/blob/master/doc/general-config.md#Esbuild) code for you, out of the box.

## Eslint

In our project, we installed and configured eslint (`.eslintrc.json`). This gives us linting capabilities about good practices when writing code in TypeScript. However, AppSync does not support all of “standard” JavaScript/TypeScript features.

Luckily, the AppSync provides an useful eslint plugin that we can use and will warn us about invalid usages: `@aws-appsync/eslint-plugin`

We are using the plugin in this project, but because we only want it to be active inside resolvers code, we use an additional eslint config file that we placed in `src/resolvers/.eslintrc.json`. This way, those special rules will only apply to resolvers, and not the rest of our codebase (for example, Lambda functions).

```json
{
  "extends": ["plugin:@aws-appsync/base"]
}
```

## Codegen

[GraphQL Codegen](https://the-guild.dev/graphql/codegen) is an open-source library that provides tools to generate code from GraphQL schemas. In this project, we will use it in order to generate the TypeScript types of our API.

It uses the definition in `codegen.ts`

Try running the following command

```bash
npm run codegen
```

Now have a look at `src/types/schema.ts`. You should see a set of TypeScript types that match our schema. We will use them later to build our API.
