# SharePoint site URL
$siteUrl = "https://sites.ey.com/sites/test-ohmx"

# Build the solution
Write-Host "Building solution..." -ForegroundColor Green
gulp bundle
gulp package-solution

# Create the SiteAssets folder if it doesn't exist
Write-Host "Creating SiteAssets folder..." -ForegroundColor Green
Connect-PnPOnline -Url $siteUrl -Interactive
$folderUrl = "$siteUrl/SiteAssets/financial-tracker"
$folder = New-Object Microsoft.SharePoint.Client.Folder
$folder.EnsureFolder($siteUrl, "SiteAssets/financial-tracker")

# Upload the package
Write-Host "Uploading package..." -ForegroundColor Green
$packagePath = "sharepoint/solution/financial-tracker.sppkg"
$web = Get-PnPWeb
$folder = $web.GetFolderByServerRelativeUrl("SiteAssets/financial-tracker")
$folder.UploadFile("financial-tracker.sppkg", $packagePath, $true)

Write-Host "Deployment completed!" -ForegroundColor Green 