---
sidebar_position: 5
sidebar_label: Subscriptions
---

# 5. Subscriptions

AWS AppSync comes with built-in real-time pub/sub capabilities. We will use it to allow our users to receive notifications when a task is updated, or assigned.

In GraphQL and AppSync, a subscription is a websocket connection that users can subscribe to and receive messages in real time. Subscriptions are triggered in response to a Mutation.

## 5.1. Task Updated

Open the schema file (`schema/schema.graphql`), and add the following code.

```graphql
type Subscription {
  onUpdateTask(id: ID!): Task @aws_subscribe(mutations: ["updateTask"])
}
```

Here, we are creating a new `Subscription` type and we introduce the `onTaskUpdated` subscription. The subscription takes an argument (`id`) which will take the id of the task to listen for changes.

We also use the AWS AppSync directive `@aws_subscribe` to specify which Mutation triggers the subscription. Here, it's `updateTask`. This means that each time a user will invoke the `updateTask` mutation on a task, any user listening for changes on it will be notified. With AWS AppSync, you do not need to do anything other than using the directive.

Let's try it. First, we need to deploy our changes.

```bash
npx sls deploy
```

When it's done, try to execute the following Subscription. Don't forget to change the task `id` to the id of one of your tasks.

```graphql
subscription OnTaskUpdated {
  onUpdateTask(id: "1c4b479e-62b2-41ca-a3ad-594cbc506604") {
    id
    title
    description
    priority
    status
    createdAt
    updatedAt
  }
}
```

Then, from another tab, invoke the following mutation

```graphql
mutation UpdateTask {
  updateTask(
    input: {
      id: "1c4b479e-62b2-41ca-a3ad-594cbc506604"
      title: "My Updated Task 1"
    }
  ) {
    id
    title
    description
    priority
    status
    createdAt
    updatedAt
  }
}
```

If you come back to the tab where the subscription is running, you should see an incoming message with the task that was updated.

## 5.2. Task Assigned Subscriptions

We just saw how to create a simple subscription. However, sometimes you need advanced use cases. AWS AppSync comes with a feature called [enhanced subscription filtering](https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-enhanced-filtering.html). It allows you to create subscriptions with advanced filters.

Let's add a new subscription to illustrate this use case. Add the `onTaskAssigned` subscription.

```graphql
type Subscription {
  onUpdateTask(id: ID!): Task @aws_subscribe(mutations: ["updateTask"])
  onTaskAssigned(minPriority: Int): Task
    @aws_subscribe(mutations: ["createTask"])
}
```

Enhanced filtering requires some custom code that we write in a resolver. However, this resolver does not need to access any data source, it is just there to configure the filtering. Luckily, AWS AppSync allows us to do so with a special kind of data source: `NONE`

Let's create a *none* data source. In `definitions/appsync.ts`, add the following code inside `dataSources`

```tsx
none: {
  type: 'NONE',
},
```

And, in `resolvers`

```tsx
'Subscription.onTaskAssigned': {
  dataSource: 'none',
  kind: 'UNIT',
  code: 'src/resolvers/Subscription.onTaskAssigned.ts',
},
```

Finally, create the `src/resolvers/Subscription.onTaskAssigned.ts` file

```tsx showLineNumbers
import {
  Context,
  SubscriptionFilterObject,
  extensions,
} from '@aws-appsync/utils';
import { SubscriptionOnTaskAssignedArgs, Task } from '../types/schema';
import { isCognitoIdentity } from '../utils';

export const request = (ctx: Context<SubscriptionOnTaskAssignedArgs>) => {
  return {};
};

export const response = (ctx: Context<SubscriptionOnTaskAssignedArgs>) => {
  if (!isCognitoIdentity(ctx.identity)) {
    util.unauthorized();
  }

  const filter: SubscriptionFilterObject<Task> = {
    assignees: {
      contains: ctx.identity.username,
    },
  };

  if (ctx.args.minPriority) {
    filter.priority = {
      ge: ctx.args.minPriority,
    };
  }

  extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter));

  return ctx.result;
};
```

Let's pause to analyze what is going on.

In the **request** handler, we are checking that the current request comes from a Cognito user (lines 14-16). This is because we want the current user to receive notifications for tasks assigned to himself. Requests coming from non-users (e.g. API keys), should not be allowed to use this subscription, and it would also not make sense.

Then, we start by creating a filter rule (18-22). The rule specifies that the task's `assignees` should contain the current user's username for it to apply.

Finally, our subscription has an optional `minProperty` argument. If the argument is present, we use it to add a rule that requires the task's priority to be of at least the specified value (line 26). Tasks with a lower priority would not invoke the subscription. This can be user by users to avoid receiving unnecessary noisy notifications.

We finish by applying the subscription filter with the `extensions.setSubscriptionFilter()` helper function on line 30.

Let's deploy again and test.

```bash
npx sls deploy
```

With your standard user (non admin), try to execute the following subscription.

```graphql
subscription OnTaskAssigned {
  onTaskAssigned(minPriority: 5) {
    id
    title
    description
    priority
    status
    createdAt
    updatedAt
  }
}
```

Then, invoke the `creteTask` Mutation with your admin user. Change the `assignees` to match your non-admin user.

```graphql
mutation CreateTask {
  createTask(
    input: {
      title: "Task 99"
      description: "My first task"
      priority: 3
      status: TODO
      projectId: "1d49e592-e489-43cc-8ce5-d7d99a731cc4"
      assignees: ["ben"]
    }
  ) {
    id
    title
    description
    priority
    status
    createdAt
    updatedAt
    assignees
  }
}
```

Try several combinations of `assignees`, `priority` . Also try to change or remove the `minPriority` argument from the subscription. Observe how and when the subscription receives the notification and make sure it behaves as expected.
