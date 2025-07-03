[Back to README](../../README.md)

# Hotfix Process Description

## General Note

With great power comes great responsibility. The hotfix process is reserved for edge-case scenarios when production requires an update, but changes in "lower" branches are not suitable for deployment. For example, "lower" branches might contain work-in-progress features or bugs that should not be pushed to production using the typical development-to-staging-to-production process. In such cases, we need to deploy a hotfix to production as quickly as possible.

## Facts

- The GitHub "gaia-gateway" repository has a "prod/hotfix/\*" branch protection rule that requires pull requests.
- The "prod" GitHub environment has the following branches set for deployment:
  - `main`
  - `prod/hotfix/*`
- The "prod" GitHub environment has "Required Reviewers" set to [modifiable by GitHub administrators]:
  - `dawid-ciarach-ext`
  - `maximilian-kimmel-ext`

With the above information in mind, the hotfix process involves the following steps:

1. Create a new hotfix branch from the **last deployed "main" branch**, ensuring the name does not yet match the "prod/hotfix/\*" pattern.
2. Create a new branch that follows the "prod/hotfix/\*" pattern from the **last deployed "main" branch**. For example, name it "prod/hotfix/2024-05-22\_**short meaningful description**" (e.g., on GitHub at https://github.siemens.cloud/OpenAIatDI/gaia-gateway/branches).
3. Make the necessary changes on the **hotfix branch** (not the "prod/hotfix/\*" branch).
4. Thoroughly test the changes.
5. Create a pull request (PR) from your hotfix branch to the "prod/hotfix/\*" branch.
6. Wait for approval and complete the PR.
7. Go to the deployment workflow at https://github.siemens.cloud/OpenAIatDI/gaia-gateway/actions/workflows/deploy.yml and select "Run workflow"; choose the "prod/hotfix/\*" branch you just finished a PR for.
8. A workflow run will be created, **but it will not run** until it receives approval from one of the "Required Reviewers."
9. Consider merging the same hotfix into the default branch, ensuring the next regular release process (following the "develop" -> "release" -> "main" pattern) will include the hotfix. This is because next typical release ("develop" -> "release" -> "main" branches) will overwrite the deployed "prod/hotfix/\*" branch.

**Important Note:** If multiple hotfixes need to be deployed in a single sprint, each subsequent hotfix must be based on the **last deployed branch** to production. For the first hotfix, this will typically be the "main" branch (as per steps 1 & 2). For the second hotfix, it will likely be "prod/hotfix/1st_hotfix" (or a similar name). For the third hotfix, it will likely be "prod/hotfix/2nd_hotfix" (or a similar name), and so on.
