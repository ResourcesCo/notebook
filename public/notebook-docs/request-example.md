# Create a branch and PR

## Form [👾][form]

### Project Path

This is the path to a project. For example, the path for
`https://gitlab.com/gitlab-org/gitlab-svgs` is `gitlab-org/gitlab-svgs`.

```yaml
name: project_id
valid:
  match: /[^\]+\/[^\]+/
transform: urlEncode
```

### GitLab Token

```yaml
name: GITLAB_TOKEN
valid:
  minLength: 16
```

### Branch Name

```yaml
name: branch
default: main
valid:
  minLength: 1
```

### Base Branch

This is the base branch. If this is not given, it will use the default branch.

```yaml
name: baseBranch
valid: /S{1,}}/
```

### New Files

```yaml
name: newFiles
type: array
itemFieldType: commitFile
itemTransform:
  merge:
    action: create
```

### Updated Files

```yaml
name: updatedFiles
type: array
itemFieldType: commitFile
itemTransform:
  merge:
    action: update
```

### Files to Move/Rename

```yaml
name: filesToMove
type: array
itemFieldType: moveAction
```

### Files to Delete

```yaml
name: filesToDelete
type: array
itemFieldType: path
```

### Actions

```yaml
name: actions
concat:
  - ${newFiles}
  - ${updatedFiles}
  - ${filesToMove}
  - ${filesToDelete}
valid:
  minLength: 1
  message: At least one file to create, update, move/rename, or delete must be given.
```

## Commit File [👾][field-type]

```yaml
name: commitFile
transform:
  renameKeys:
    name: content
    path: file_path
```

### Path

```yaml
name: path
type: path
```

### Content

```yaml
name: data
type: string
input: pasteOrUpload
allowBase64: true
```

### Encoding

```yaml
name: encoding
choices:
- text
- base64
```

## Move Action [👾][field-type]

```yaml
name: moveAction
```

### Previous Path

```yaml
name: previous_file_path
type: path
```

### Path

```yaml
name: file_path
type: path
```

## Output [👾][form]

### Merge Request

```yaml
name: mergeRequestUrl
bind: createMergeRequest.response.web_url
readonly: true
```

## Data [👾][data]

```yaml
name: bat/test
branch: testing
newFiles:
- path: /hello.js
```

`newFiles/0/data`

```js
console.log('Hello, world.')
```

## Create Branch [👾][request]

### Request

```yaml
url: https://gitlab.com/api/v4/projects/${projectId}/repository/branches
method: POST
```

#### Headers

```yaml
Authorization: Bearer ${GITLAB_TOKEN}
Content-Type: application/json
Accept: application/json
```

#### Body

```yaml
branch: true  # gets it from the field with the same name
ref:
  field: baseBranch
```

## Create Commit [👾][request]

```yaml
name: createCommit
```

### Request

```yaml
url: https://gitlab.com/api/v4/projects/${projectId}/repository/commits
method: POST
```

#### Headers

```yaml
Authorization: Bearer ${GITLAB_TOKEN}
Content-Type: application/json
Accept: application/json
```

#### Body

```yaml
branch: true
actions: true
```

## Create Merge Request [👾][request]

```yaml
name: createMergeRequest
```

### Request

```yaml
url: https://gitlab.com/api/v4/projects/${projectId}/repository/merge_requests
method: POST
```

#### Headers

```yaml
Authorization: Bearer ${GITLAB_TOKEN}
Content-Type: application/json
Accept: application/json
```

#### Body

```yaml
source_branch:
  field:
    branch
target_branch:
  field:
    baseBranch
actions: true
```

[form]: https://nanocodes.dev/request@0.0.1/form
[data]: https://nanocodes.dev/request@0.0.1/data
[request]: https://nanocodes.dev@0.0.1/request
[field-type]: https://nanocodes.dev/request@0.0.1/field-type
