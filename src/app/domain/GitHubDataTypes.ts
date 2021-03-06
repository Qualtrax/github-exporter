export type RepositoryIssues = {
  data: {
    repository: {
      issues: Issues,
      pullRequests: Issues
    }
  }
}

export type Issues = {
  nodes: Array<Issue>,
  pageInfo: {
    hasPreviousPage: boolean,
    hasNextPage: boolean
  },
  edges: Array<{cursor: string}>
}

export type Issue = {
  createdAt: string,
  closedAt: string,
  number: number,
  title: string,
  bodyHTML: string,
  labels: {
    nodes: Array<{name: string}>
  }
  comments: {
    nodes: Array<Comment>
  }
}

export type Comment = {
  author: {
    login: string
  },
  createdAt: string,
  bodyHTML: string
}
