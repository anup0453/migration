[CmdletBinding()]
param (
    [Parameter(Mandatory = $true)]
    [string]$baseUrl, # the base URL of the API endpoint

    [Parameter(Mandatory = $true)]
    [string]$token, # the Basic/Bearer token to authenticate the API call

    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "stage", "prod", "local")] 
    [string]$environment, # Select the environment to deploy the models

    [Parameter(Mandatory = $false)]
    [switch]$dry_run # Dry run mode (no API call, just print the request body)
)

$outputModelFile = "gaiaModelsTable_$environment.md"
Set-Content -path $outputModelFile -value "# Models list"
Add-Content -path $outputModelFile -value "Below table contains list of models available in **$environment** GAIA instance. This was generated on $(Get-Date)."
Add-Content -path $outputModelFile -value "|instanceName|deploymentName|region|type|"
Add-Content -path $outputModelFile -value "|-|-|-|-|"

$sw = [Diagnostics.Stopwatch]::StartNew()

# Define the URL for the API endpoint
if (-not $baseUrl) {
    Write-Output "Base URL is not provided. Please provide a base URL to make the API call."
    return
}
if (-not $token) {
    Write-Output "Token is not provided. Please provide a token to make the API call."
    return
}

# Login to Azure
az login

# Fetch all subscriptions and process each one
$subscriptions = az account list --query "[].{Name:name, SubscriptionId:id}" -o json | ConvertFrom-Json

foreach ($sub in $subscriptions) {
    $subscriptionId = $sub.SubscriptionId
    Write-Output "Processing Subscription: $($sub.Name) ($subscriptionId)"

    # Include resources with "includeInGaiaLB" tag ONLY
    $ResourcesWithTag = az resource list `
        --query "[].{InstanceName:name, ResourceGroup:resourceGroup, Kind:kind, Tag_includeInGaiaLB:tags.includeInGaiaLB}" `
        --subscription=$subscriptionId `
        --tag includeInGaiaLB -o json | ConvertFrom-Json

    foreach ($cog in $ResourcesWithTag) {
        $instanceName = $cog.InstanceName
        $resourceGroup = $cog.ResourceGroup
        $endpoint = "https://$($cog.InstanceName).openai.azure.com/"
        $kind = $cog.Kind
        $tags = $cog.Tag_includeInGaiaLB -split ','
        Write-Host $tags -ForegroundColor Green

        # Check if it's really OpenAI
        if ($kind -ne "OpenAI") {
            Write-Host "Found kind of '$kind'. Supported one is only OpenAI. Skipping.." -ForegroundColor Yellow
            continue
        } 

        # Skip enviornments that are not in search scope
        if ($environment -notin $tags) {
            Write-Host "Environment '$environment' not found in 'includeInGaiaLB' tag for '$instanceName' resource. Skipping.." -ForegroundColor Yellow
            continue
        }

        Write-Output "az cognitiveservices account keys list --subscription=$subscriptionId -g $resourceGroup -n $instanceName"
        $key = az cognitiveservices account keys list `
            --subscription=$subscriptionId `
            -g $resourceGroup `
            -n $instanceName `
            --query "key1" -o json | ConvertFrom-Json

        # Fetch deployments for the current Cognitive Services account
        $deployments = az cognitiveservices account deployment list `
            -g $resourceGroup `
            -n $instanceName `
            --subscription=$subscriptionId `
            --query "[].{DeploymentName:name, ModelName:properties.model.name, ModelVersion:properties.model.version, SkuName:sku.name}" `
            --output json | ConvertFrom-Json
        
        foreach ($deployment in $deployments) {
        
            $modelName = $deployment.ModelName
            $deploymentName = $deployment.DeploymentName
            $skuName = $deployment.SkuName
        
            if ($modelName -like "gpt*" -or $modelName -like "o*") {
                $type = "llm"
            }
            elseif ($modelName -like "text*") {
                $type = "embedding"
            }
            else {
                Write-Output "Unknown model type: $modelName"
                continue
            }

            if ($instanceName -like "*eastus*") {
                $region = "americas"
            }
            else {
                $region = "emea"
            }

            if ($skuName -like "ProvisionedManaged") {
                $isPTU = 'true'
            }
            else {
                $isPTU = 'false'
            }

            $isPTU = 'false'
            $modelVersion = $deployment.ModelVersion

            if ($modelName -like "gpt-4" -and $modelVersion -like "turbo*") {
                $modelName = "gpt-4-turbo"
            }

            $openAiVersion = "2023-12-01-preview"

            if ($modelName -like "gpt-4o*") {
                $openAiVersion = "2024-08-01-preview"
            }

            if ($modelName -like "gpt-4o-2024-08-06") {
                $openAiVersion = "2024-12-01-preview"
            }

            if ($modelName -like "o*") {
                $openAiVersion = "2025-03-01-preview"
            }

            if ($modelName -like "gpt-4.5*") {
                $openAiVersion = "2025-03-01-preview"
            }

            # Define the headers as a hashtable
            $headers = @{
                "Authorization" = $token
                "Content-Type"  = "application/json"
            }

            # Define the body as a hashtable (convert to JSON later)
            $body = @{
                "instanceName"   = $instanceName
                "endpoint"       = $endpoint
                "deploymentName" = $deploymentName
                "modelName"      = $modelName
                "modelVersion"   = $modelVersion
                "openAiVersion"  = $openAiVersion
                "isPTU"          = $isPTU
                "key"            = $key
                "region"         = $region
                "type"           = $type
            }

            # Convert the body to a JSON string
            $jsonBody = $body | ConvertTo-Json

            # Define the URL for the API endpoint
            $url = "$baseUrl/v1/admin/modelDeployment"

            # BEFORE ADDING SOMETHING to below like - ask yourself a question:
            #   Is it OKEY to PUBLICATE that information? 
            #   Things like keys SHOULD NEVER BE placed in md file as this one will be probably public in wiki.siemens.com
            Add-Content -Path $outputModelFile -value "|$instanceName|$deploymentName|$region|$type|"

            if ($dry_run) {
                Write-Host "DRY RUN ONLY! Body is: " -ForegroundColor Magenta
                $body
            } 
            else {
                try {
                    # Print request details
                    Write-Output "Request URL: $url"
                    Write-Output "Request Headers: $headers"
                    Write-Output "Request Body: $jsonBody"
                    # Make the POST request
                    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $jsonBody
                    # Output the response
                    Write-Output $response
                }
                catch {
                    Write-Output "Error: $($_.Exception.Message)"
                    continue
                }
            }
        }
    }
}


$sw.Stop()
$sw.Elapsed