# auto-merge-action

![@latest](https://img.shields.io/github/package-json/v/Leadformance/auto-merge-action?label=%40latest)

GitHub Action that merge a pull request if all conditions are valid.

## Supported events

- `pull_request`
- `pull_request_target`

## Inputs

### `token` (required)

A GitHub personal access token.

### `mergeMethod`

Strategy for merging the pull request, can be `merge`, `squash` or `rebase`.  
**Default:** `rebase`

### `enableApproval`

Add a positive review on the pull request.  
**Default:** `false`

### `enableReadyForReview`

Marks the pull request ready for review.  
**Default:** `false`

> Draft pull requests cannot be merged

### `title`

A text or regular expression that must match the title of the pull request.  
**Default:** ignored

#### Examples

```yaml
title: automerge
title: '\[automerge]$'
title: '/\[automerge]$/'
title: '/\[automerge]$/i'
```

### `labels`

The list of required labels.  
**Default:** ignored

#### Examples

```yaml
labels: automerge
labels: |
  automerge
  bug
```

### `users`

The list of authorized usernames for auto-merge.  
**Default:** ignored

#### Examples

```yaml
users: octocat
users: |
  octocat
  octodog
```

### `teams`

The list of authorized teams for auto-merge.  
**Default:** ignored

> pattern must match: `@<org>/<teamSlug>`

#### Examples

```yaml
teams: '@github/team-a'
teams: |
  @github/team-a
  @github/team-b
```

## Outputs

### `merged`

Returns `true` if the pull request merged, `false` otherwise.

### `reason`

Reason that the auto-merge is not enabled.

## Workflow example

```yaml
name: Auto-merge

on: pull_request

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - name: Auto-merge
        id: automerge
        uses: Leadformance/auto-merge-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          mergeMethod: rebase
          enableApproval: true
          enableReadyForReview: true
          labels: automerge
          teams: '@github/team'

      - if: ${{ steps.automerge.outputs.merged == 'true' }}
        run: echo "Automerge has merged the pull request"

      - if: ${{ steps.automerge.outputs.merged == 'false' }}
        run: |
          echo "Auto-merge could not merged the pull request"
          echo "Reason: ${{ steps.automerge.outputs.reason }}"
```
