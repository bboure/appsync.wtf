---
sidebar_position: 2
sidebar_label: Data Sources and Resolvers
---

# 2. Defining Data Sources and Resolvers

We now have a deployed API, but it does not do anything yet. In this section we will create our DynamoDB tables and allow our API to interact with them.

## 2.1. DynamoDB Tables

As our primary data store, we will use DynamoDB. DynamoDB is a fully managed key-value store with single digit latency.

Open the `definitions/dynamodb.ts` file and add the following code under _`// 2.1. Define the DynamoDB tables`_

```tsx showLineNumbers
Tasks: {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: '${self:service}-${sls:stage}-tasks',
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
      {
        AttributeName: 'projectId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'createdAt',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'byProject',
        KeySchema: [
          {
            AttributeName: 'projectId',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'createdAt',
            KeyType: 'RANGE',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
      },
    ],
  },
},
Projects: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: '${self:service}-${sls:stage}-projects',
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH',
        },
      ],
    },
},
ProjectUsers: {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: '${self:service}-${sls:stage}-project-users',
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      {
        AttributeName: 'projectId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'username',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'projectId',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'username',
        KeyType: 'RANGE',
      },
    ],
  },
},
```

This codes defines three DynamoDB tables.

The first one `Tasks` will store the tasks of our application. `Projects` will keep track of projects, and `ProjectUsers` will store the relation between projects and users.

Note that we don’t have a `Users` table. Users live in Cognito, and we won’t need to store them in DynamoDB in this project.

## 2.2 Data Sources

We now have our data stores defined, but we still need to link them to out GraphQL API.

To do so, AWS AppSync uses Data Sources. Data Sources are like adapters that connect to the different data stores. Since we have three DynamoDB tables, we will need 3 data source definitions of type `AMAZON_DYNAMODB`. Each references its corresponding DynamoDB table that we defined in the previous section.

Open `definitions/appsync.ts` and inside `dataSources`, add the following code:

```tsx showLineNumbers
tasks: {
  type: 'AMAZON_DYNAMODB',
  config: {
    tableName: { Ref: 'Tasks' },
  },
},
projects: {
  type: 'AMAZON_DYNAMODB',
  config: {
    tableName: { Ref: 'Projects' },
  },
},
projectUsers: {
  type: 'AMAZON_DYNAMODB',
  config: {
    tableName: { Ref: 'ProjectUsers' },
  },
},
```

For more details about Data Source definitions, check the [documentation](https://github.com/sid88in/serverless-appsync-plugin/blob/master/doc/dataSources.md).

## 2.3. Resolvers

Data sources define how our API can access the data stores, but we still need to define how the data connects to the GraphQL schema. For that, GraphQL (and AWS AppSync) use resolvers. Resolvers are like functions that are executed in order to generate the data source request on one hand, and handle their responses on the other hand.

Open the `definitions/appsync.ts` file and add the following code inside `resolvers`.

```tsx showLineNumbers
// Tasks
'Query.getTask': {
  dataSource: 'tasks',
  kind: 'UNIT',
  code: 'src/resolvers/Query.getTask.ts',
},
'Query.listTasks': {
  dataSource: 'tasks',
  kind: 'UNIT',
  code: 'src/resolvers/Query.listTasks.ts',
},
'Mutation.createTask': {
  dataSource: 'tasks',
  kind: 'UNIT',
  code: 'src/resolvers/Mutation.createTask.ts',
},
'Mutation.updateTask': {
  dataSource: 'tasks',
  kind: 'UNIT',
  code: 'src/resolvers/Mutation.updateTask.ts',
},
'Mutation.deleteTask': {
  dataSource: 'tasks',
  kind: 'UNIT',
  code: 'src/resolvers/Mutation.deleteTask.ts',
},
'Task.project': {
  dataSource: 'projects',
  kind: 'UNIT',
  code: 'src/resolvers/Task.project.ts',
},
// Projects
'Query.getProject': {
  dataSource: 'projects',
  kind: 'UNIT',
  code: 'src/resolvers/Query.getProject.ts',
},
'Mutation.createProject': {
  dataSource: 'projects',
  kind: 'UNIT',
  code: 'src/resolvers/Mutation.createProject.ts',
},
'Mutation.updateProject': {
  dataSource: 'projects',
  kind: 'UNIT',
  code: 'src/resolvers/Mutation.updateProject.ts',
},
'Mutation.deleteProject': {
  dataSource: 'projects',
  kind: 'UNIT',
  code: 'src/resolvers/Mutation.deleteProject.ts',
},
'Mutation.addUserToProject': {
  dataSource: 'projectUsers',
  kind: 'UNIT',
  code: 'src/resolvers/Mutation.addUserToProject.ts',
},
```

`resolvers` is a key-value pair object that represents resolver definitions.

The key specifies the GraphQL type and field that the resolver is attached to. For example, for `Query.getTask` , it means that the resolver is attached to the `getTask` field of the `Query` type. `Query` and `Mutation` are two special types in GraphQL that correspond to queries and mutations, respectively.

Note that you can attach a resolver to custom types too. For example, `Task.project` (lines 27-31) defines the resolver for a tasks’s Project.

The value represents the definition of the resolver.

- `dataSource` is a reference to the data source name where the data lives. This is the data source that the resolver will invoke after generating the request.
- `kind`: There are two kinds of resolvers: `UNIT` and `PIPELINE`. We will learn about pipeline resolvers later in this workshop. For now, we will use the simpler `UNIT` kind.
- `code` is the path to the resolver code. Resolvers are written in TypeScript. We will get to know them better in a minute.

For more details about resolver definitions, check the [documentation](https://github.com/sid88in/serverless-appsync-plugin/blob/master/doc/resolvers.md).

## 2.4. Deploy

We can now deploy our API again to make the latest changes effective.

```shell
npx sls deploy
```

While the changes are being deployed, let’s have a look at the resolvers code and understand them.

## 2.5. Resolvers

To make things smoother for you, I have already written all the necessary resolvers. Let’s have a look and understand how they work.

For example, let’s take `getTask` (`src/resolvers/Query.getTask.ts`)

```tsx showLineNumbers
import { Context, util } from '@aws-appsync/utils';
import { get } from '@aws-appsync/utils/dynamodb';
import { QueryGetTaskArgs } from '../types/schema';
import { DBTask } from '../types/db';

export const request = (ctx: Context<QueryGetTaskArgs>) => {
  return get<DBTask>({
    key: {
      id: ctx.args.id,
    },
  });
};

export const response = (ctx: Context<QueryGetTaskArgs>) => {
  if (!ctx.result) {
    util.error('Task not found', 'NotFound');
  }

  return ctx.result;
};
```

Resolvers are composed of two functions, also known as _handlers._

The _request_ handler is used to generate the request to the data source. In this case, it’s a DynamoDB request and we want to execute a `GetItem` operation.

The `@aws-appsync/utils/dynamodb` package comes with a bunch of useful functions to help us generate DynamoDB requests. Here, we are using `get` and we are passing it the `key` of the item we want to retrieve. It contains the name of the key attribute (`id`) and its value which is coming from the GraphQL query as an argument. `ctx.args` is an object that corresponds to the GraphQL arguments as defined in the schema.

```graphql
type Query {
  getTask(id: ID!): Task!
}
```

For more information about all the DynamoDB helpers, check the [documentation](https://docs.aws.amazon.com/appsync/latest/devguide/built-in-modules-js.html#built-in-ddb-modules).

The _response_ handler receives the data from the data source. This is where you can transform it and map it to the GraphQL schema. Here we just return the data received from DynamoDB in `crx.result`. Before that, we check that the item exists, and if it does not we return an error with `util.error()`.

Both the _request_ and _response_ handlers receive an object as first argument (called the context). The `context` object contains information about the incoming request (input arguments, identity, etc.) as well as the interaction with the data source (e.g. the result, errors that might have ocurred, etc) (only in _response_). You can learn more about it in the [documentation](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-context-reference-js.html).

## 2.6. TypeScript in Resolvers

As we commented earlier in this workshop, we wrote resolvers in TypeScript. We also learned about GraphQL codegen, and we generated TypeScript types from our GraphQL schema. Keen eyes might have spotted that we used those types in our resolvers. For example:

```tsx
export const request = (ctx: Context<QueryGetTaskArgs>) => {
  // ...
};
```

`QueryGetTaskArgs` is an auto-generated type that represents the input arguments of the `getTask` Query.

You might also have noticed the `DBTask` type in the same resolver. This is a custom type that I created and represents the DynamoDb `Task` entity. This is because data source entities and GraphQL types don’t always have a one to one correspondence. For example, the `Task` type in GraphQL has a `project` field which represents the Project the task belongs to. Project has its own entity and data store, so it is excluded from the `DBTask` type. Similarly, `DBTask` has a `projectId` which is not present in the schema.

If you look in the schema (`schema/schema.graphql`), you will notice that I used `interface`s. For example, `ITask`.

```graphql
interface ITask {
  id: ID!
  title: String!
  description: String!
  priority: Int!
  status: Status!
  assignees: [ID!]!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

The interface defines basic scalar types only that both the schema and the database have. Later, I use this interface in the definition of the `Task` type where I define additional complex fields (e.g. `project`).

```graphql
type Task implements ITask {
  id: ID!
  title: String!
  description: String!
  priority: Int!
  status: Status!
  project: Project!
  assignees: [ID!]!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

I did the same when defining the database entity type.

```ts
export type DBTask = ITask & {
  projectId: string;
};
```

I will now let you explore the remaining resolvers. Observe the usage of the dynamodb helpers, how the requests are generated and responses are handled, and how the generated TypeScript types are used. When you are done, come back here and continue.
