import { graphql } from '@octokit/graphql';

export abstract class AbstractGraphQLService {
  protected readonly graphql: typeof graphql;

  constructor(token: string) {
    this.graphql = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });
  }
}
