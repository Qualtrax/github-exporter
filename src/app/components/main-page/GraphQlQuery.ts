export enum IssueStatus {
  Open = 'OPEN',
  Closed = 'CLOSED'
}

export const graphQlQuery = (count: number, status: IssueStatus) =>
  `{
    repository(name: "Qualtrax", owner: "Qualtrax") {
      issues (filterBy: {states: ${status}}, last: ${count}) {
        nodes {
          createdAt,
          closedAt,
          number,
          title,
          labels (first: 5) {
            nodes {name}
          },
          comments (first: 100) {
            nodes {
              author {
                login
              },
              createdAt,
              bodyText
            }
          }
        },
        pageInfo {
          hasPreviousPage,
          hasNextPage
        },
        edges {
          cursor
        }
      }
    }
  }`;
