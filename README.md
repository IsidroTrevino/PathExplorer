# PathExplorer &nbsp;  
_Interactive Career Path Guidance Platform_

[![MIT License](https://img.shields.io/github/license/IsidroTrevino/PathExplorer?color=green)](LICENSE)  
![Deployment](https://img.shields.io/website-up-down-green-red/https/pathexplorer-kohl.vercel.app.svg?label=Deployment)  
![Next.js](https://img.shields.io/badge/Next.js-13-000000?logo=nextdotjs&logoColor=white)  
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white)
![FastApi](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=FastAPI&labelColor=555&logoColor=white)
![React](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react)


**PathExplorer** is a full-stack web application that helps users explore and plan their career journeys by providing curated insights from real professionals and guiding them through the certifications and skills needed for various career paths.  
A live demo is deployed on Vercel here: **[pathexplorer-kohl.vercel.app](https://pathexplorer-kohl.vercel.app)**.

---

## Key Features

- **Professional Insights** – Based on previous roles in the company, consult feedback given by managers to improve your career. 
- **Certifications & Learning Resources** – A dedicated page lists recommended certifications, courses, or learning resources based on you professional path and goals.  
- **User Authentication & Personalization** – Sign-up/login enables saving favorites, bookmarks, or progress tracking.  
- **Responsive & Dynamic UI** – Interactive components and smooth transitions for a polished experience.  
- **Data-Driven Content** – Easily update or expand the dataset; the UI adapts automatically.

---

## Technology Stack

| Layer            | Tech / Tools                                         | Why it’s used                                         |
|------------------|------------------------------------------------------|-------------------------------------------------------|
| **Frontend**     | **Next.js 13** (React 18), **TypeScript**            | Hybrid SSR/SPA, fast dev experience, type safety      |
| **Styling / UI** | Tailwind CSS / CSS-in-JS, Shadcn / Radix components  | Consistent design, accessibility, rapid theming       |
| **Backend**      | **FastApi** + **Python** (SQL Alchemy)            | Minimal, modular REST API with shared types           |
| **Database**     | SQL (PostgreSQL) | Flexible, easy schema evolution                       |
| **Auth**         | JWT / session cookies                                | Secure user sessions                                  |
| **Testing**      | Jest, React Testing Library, Puppeteer          | Unit & integration reliability                        |
| **CI/CD**        | GitHub Actions + **Vercel**                          | Auto-tests on PRs, instant production deploys         |
| **Design**       | **Figma**                                            | High-fidelity prototypes & hand-off                   |

---

## Architecture and Design Choices

- **Client–Server separation** for scalability; the API can later power mobile apps or additional front-ends.  
- **Monorepo** layout with isolated `backend/` and `pathexplorer/` folders plus shared TypeScript types.  
- **Next.js hybrid SSR** gives fast first paint and SEO while retaining SPA interactivity.  
- **RESTful routing** (`/api/careers`, `/api/careers/:id/insights`, etc.) keeps the API intuitive and extendable.  
- **Token-based auth** secures personalized actions; passwords are hashed server-side.  
- **Component-driven UI** ensures reusability and accessibility across the app.  
- **Automated tests & CI** catch regressions early; every push triggers the full test matrix before deploy.  

---

## Installation and Local Development

> **Prerequisites:** Node.js 18+ and npm installed.

1. **Clone the repo**  
   ```bash
   git clone https://github.com/IsidroTrevino/PathExplorer.git
   cd PathExplorer
   ```
2. **Install dependencies**
```bash
# Backend
cd backend
pip install requirements.txt

# Frontend
cd ../pathexplorer
npm install --legacy-peer-deps
```

3. **Configure environment variables**
- Use .env in each project and fill in necessary data (Not available for public)

4. **Start the servers**
```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd ../pathexplorer
npm run dev
```

5. **Open the app**
- Visit http://localhost:3000 and explore!

6. **Run Tests**
```bash
# Frontend unit tests
cd ../pathexplorer
npm run test

# Frontend e2e tests
cd ../pathexplorer
npm run test:e2e
```

# UI/UX Design
A complete Figma prototype details layout, components, and brand styling:
[View the PathExplorer design in Figma](https://www.figma.com/design/byTE0ryuL3qkYx6dQSUo5A/Accenture-PathExplorer-Mockup)

Using Figma ensured visual fidelity and consistency across breakpoints, and accelerated developer hand-off.

# Project Structure
```bash
PathExplorer/
├── backend/            # FastApi API (Python)
│   ├── routers/
│   └── vercel.json
├── pathexplorer/       # Next.js client (TypeScript)
│   ├── src/
│   │   ├── app/
│   │   │  ├── api/
│   │   │  ├── auth/
│   │   │  ├── user/
│   │   │  │  ├── basic-info/
│   │   │  │  ├── certifications/
│   │   │  │  ├── curriculum/
│   │   │  │  ├── dashboard/
│   │   │  │  ├── employees/
│   │   │  │  ├── professional-path/
│   │   │  │  ├── projects/
│   │   │  │  ├── role-assignment/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── features/
│   │   ├── lib/
│   │   ├── schemas/
│   │   ├── tests/
│   ├── public/
│   └── package.json
├── .github/workflows/  # CI pipelines
├── LICENSE
└── README.md
```
This structure highlights the division between front-end and back-end. For instance, all UI code resides in the pathexplorer directory, while all server logic is in the backend directory

The presence of .github/workflows indicates that automated workflows are set up, such as running tests on push. The root might contain configuration for tools like ESLint, Prettier, or a monorepo workspace setup.

# License
This project is open source and is available under the MIT License

This means you are free to use, modify, and distribute the code as long as you include the original license notice in any copy of the software/source. [See the LICENSE file for the full license text.](https://github.com/IsidroTrevino/PathExplorer#:~:text=License)

## Diseño en Figma

Puedes ver el diseño de la aplicación web en Figma haciendo click en el siguiente enlace:

[Ver diseño en Figma](https://www.figma.com/design/byTE0ryuL3qkYx6dQSUo5A/Accenture-PathExplorer---Mockup?node-id=0-1&t=DwVqdPADIm37NC6W-1)

