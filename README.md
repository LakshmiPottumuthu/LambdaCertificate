# LambdaTest Playwright Assignment – Final Submission

This repository contains the completed solution for the LambdaTest Playwright Certification Assignment.  
The project is fully configured to run Playwright tests on LambdaTest Cloud Grid using CDP WebSocket, execute in multiple OS/browser combinations, enable full logging, update session metadata dynamically, and run inside a Gitpod cloud development environment.

---

## Project Highlights

- Playwright tests executed on **LambdaTest Cloud Grid**
- Two OS/browser combinations:
  - **Windows 11 + Chrome**
  - **macOS Monterey + Playwright Firefox**
- Network logs, console logs, screenshots, video recording enabled
- Dynamic session name update using test title
- Dynamic session status update (pass/fail)
- Single build per execution
- Fully automated **Gitpod one-click development** environment
- Clean folder structure and complete configuration files
- Ready for submission as a **Private GitHub Repository** shared with LambdaTest

---

## Project Structure

```
├── tests/
│   ├── example.spec.ts
│   └── helpers/
│       ├── session.helper.ts
│       └── lambda.helper.ts
├── playwright.config.ts
├── package.json
├── .gitpod.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Running Tests in Gitpod

This repository supports a fully automated Gitpod cloud development environment.

To launch the workspace:

```
https://gitpod.io/#<YOUR-REPO-URL>
```

When Gitpod starts:

```
npx playwright test
```

---

## Environment Variables

Create a `.env` file in the project root:

```
LT_USERNAME=your_lambdatest_username
LT_ACCESS_KEY=your_lambdatest_access_key
```

Do not commit the `.env` file.

---

## Running Tests Locally

```
npm install
npx playwright install chromium
npx playwright test
```

---

## LambdaTest Configuration

This project uses LambdaTest CDP WebSocket with the following capabilities:

- `browserName`: chrome / pw-firefox  
- `platform`: Windows 11 / macOS Monterey  
- `build`: Playwright Assignment Build  
- `name`: Playwright Session  
- Logging enabled:  
  - `network: true`  
  - `console: true`  
  - `video: true`  
  - `screenshot: true`  
  - `visual: true`  

Test name and status are updated automatically using the LambdaTest Automation REST API.

---

## Test Scenario Covered

The sample test automates the **Simple Form Demo** from LambdaTest Selenium Playground:

- Navigate to Selenium Playground
- Open Simple Form Demo
- Enter a message
- Validate that the output matches the input
- Update test result metadata on LambdaTest
