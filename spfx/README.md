# Financial Tracker Web Part

A SharePoint Framework web part that allows users to track their financial transactions.

## Features

- Add financial transactions (income and expenses)
- View transaction history
- Track transaction types
- Modern UI using Fluent UI components
- Multi-page navigation

## Prerequisites

- Node.js version 16.13.0 or later
- SharePoint Framework development environment
- SharePoint site (https://sites.ey.com/sites/test-ohmx)

## Local Development Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   gulp serve
   ```

4. The web part will be available at:
   - https://localhost:4321/workbench

## Building for Production

1. Run the build script:
   ```powershell
   .\build.ps1
   ```

2. This will create a package at:
   - `sharepoint/solution/financial-tracker.sppkg`

## Manual Deployment Steps

1. Create the required SharePoint list:
   - Go to your SharePoint site (https://sites.ey.com/sites/test-ohmx)
   - Click on "New" and select "List"
   - Name it "FinancialTransactions"
   - Add these columns:
     - Title (Single line of text)
     - Amount (Number)
     - TransactionType (Choice: "income", "expense")
     - Date (Date and Time)

2. Upload the package:
   - Go to your SharePoint site
   - Navigate to the App Catalog
   - Click "New" and select "App"
   - Upload the `financial-tracker.sppkg` file from the `sharepoint/solution` folder
   - Click "Deploy"

3. Add the web part to a page:
   - Go to any page where you want to add the web part
   - Click the "+" button to add a new web part
   - Search for "Financial Tracker"
   - Add it to your page
   - Save and publish the page

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Clear the build cache:
   ```bash
   gulp clean
   ```

3. Rebuild the solution:
   ```bash
   gulp bundle
   gulp package-solution
   ```

## Contributing

Feel free to submit issues and enhancement requests! 