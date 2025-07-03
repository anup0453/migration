[Back to README](../../README.md)

In very general our infrastructure is defined as IaC bicep scripts that are saved in this repo:
https://github.siemens.cloud/OpenAIatDI/gaia-infrastructure

Restoring it is just a metter of recreating infrastructure using bicep scripts. **Bicep scripts should be maintained frequently!**. If something will not be inside bicep scripts, simply it will be missing after recreating it from scratch.

After restoring infrastructure:

1. Please update GH secrets per each environment; with new resources there is a high chances that Access Keys are different; please refer to Gateway and Worker Readmes for most up-to-date information (or .env.template file); GH cli is handy for bulk update:

```
gh secret set SYSTEM_APIKEY -e dev --repo OpenAIatDI/gaia-worker --body __REAL_SECRET_VALUE__
gh secret set SYSTEM_APIKEY -e dev --repo OpenAIatDI/gaia-gateway --body __REAL_SECRET_VALUE__
gh secret set SYSTEM_APIKEY -e stage --repo OpenAIatDI/gaia-worker --body __REAL_SECRET_VALUE__
gh secret set SYSTEM_APIKEY -e stage --repo OpenAIatDI/gaia-gateway --body __REAL_SECRET_VALUE__
gh secret set SYSTEM_APIKEY -e prod --repo OpenAIatDI/gaia-worker --body __REAL_SECRET_VALUE__
gh secret set SYSTEM_APIKEY -e prod --repo OpenAIatDI/gaia-gateway --body __REAL_SECRET_VALUE__
...
```

2. After GH secrets were updated, please run Github Workflows to deploy application code (both: Worker and Gateway), as infrastructure deployment is not restoring Code that were running there before
3. With Worker code in place now - watch out indexes in AI Search; these have to be rebuild from scratch if AI search was lost;
