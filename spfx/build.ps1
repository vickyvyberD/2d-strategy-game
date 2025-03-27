# Build the solution
Write-Host "Building solution..." -ForegroundColor Green
gulp bundle
gulp package-solution

# Check if the package was created
$packagePath = "sharepoint/solution/financial-tracker.sppkg"
if (Test-Path $packagePath) {
    Write-Host "Package created successfully at: $packagePath" -ForegroundColor Green
    Write-Host "You can now upload this package to your SharePoint site's App Catalog" -ForegroundColor Yellow
} else {
    Write-Host "Failed to create package. Please check the build errors above." -ForegroundColor Red
} 