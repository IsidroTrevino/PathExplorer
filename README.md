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

# Relevant documents for the project:

- [1. Aplicación Metodología y Gestión de Proyectos (M1)](https://docs.google.com/document/d/1k4qt1-oRiVhxn8KCUAqT681CQAm-wcVU6Z_YOXJ5pVg/edit?usp=sharing)
- [2. Documentación Diseño (M2)](https://docs.google.com/document/d/1o2gsJ9U6kPW8ORKvdNlwiWgD_5Z9ae1WsLE_UEc0Eyc/edit?usp=sharing)
- [3. Producto Funcional y Código (M3, M4, Reto, Socio)](https://docs.google.com/document/d/1rZUaRJPfYL9Gl9PoQIKOFZ7CMw2vbSeWjUq6lXHUg4k/edit?usp=sharing)
- [4. Calidad (M5)](https://docs.google.com/document/d/1lY6jHUYQik5bRBD7Ba5PdRVR0DG9Y29ZmkiEUrNZipE/edit?usp=sharing)
- [5. Deployment (M3, Reto)](https://docs.google.com/document/d/1vyA4SSe63BlCRh0GomhPLrLd9Q-vhQyaNfBsOC4zAQM/edit?usp=sharing)
- [6. Presentaciones al Socio, Seguimiento Reto (Reto)](https://docs.google.com/document/d/1eE2vjbvI1vnnhzRA1-zQ8OK0jiAPbloZFVVC4dbn8wc/edit?usp=sharing)
- [7. Arquitecture design diagram](https://www.plantuml.com/plantuml/png/TLJ1aXir4BtFLtJv4cz1s2gEhh0Ls-l0XAt5UE8Jow6jQO-LrKXJaiOi1NnIJhbnzO-XriZnoC35blfrwxr-QirRvz7wlbL5X-8P6uB9jeJfEskq9rtVJE2F0k2NHthnttnqCE-wNm4TyFvz5H1XsiveqXucrG7hvIDiooVz5Nn0gNwJkbvMrOGB1Z0ls10A3pyOy-oufAesCJM6yyobCdszLsW9jfqoM3_ffP81YWKND0Qvje0a4Lw_lalaUIoovA7hSs06VMI3MbeItXH_5HUR7awV6oaGQWfdD4P80zD504UklKFdv-iIAh97ij6u5ChRc_V-49EaeDWH1_AKhIERfN0WJrbRyp6epB9Ix8gkpCdAbMwafYlB3vWVnO71sTG3UvQKPg6eB0yb6NdqGfo7cIXpUb0XZOFLYoUhZHly5NnVsN1ilhqjsr3ZhkU2LvUAxwcLMa8WVDBJSWuKZyMRM3M0kHa_uluP8nfNyERDllUzDNTtcT05Ek9vk4T_rbYZnns79slZV6Ef-laXaAwjr49sg0RE-qMMkg5Q1lae3XJXk1-JyZM48hOhWJCGd0uAVoSBqo7pXjMzWgNHz2B3ZuFkp4kk64t-sVuPyEzcLNsuVL_zz5XSlmXElhRrtw_aVA-SdUnaVKQxNdbqKCwBE5qNk1ZTVx9u1dGCZCPTcibRGLZS5pn-NCGEnYUIrcdWqZRH3UjNi5Am6nugEACCe6fHa4RORXxSrw0DIEt9el2dlv5rZrfc3TUcv0wIFfu-nREW9WLenK4UJL5eumciR0uUpFw_lbdRpCLGx6e24L4AyFcJF2R0Bvs4XCN_zbHmcFcJYftnthGi8teTQYlfFBKOIB_Otg5bX9n0XJkfP8qrnAl0qNcA6juC9uRqFx-3wlIftR46Nij6oxqKM8SjmwCf3flb-OdnQ2hKX7LY1jbsYje0eP2dppenfqFYEmx_boy3fI_3RO9Oug2jU1j--bRz0m00)
![WhatsApp Image 2025-06-08 at 20 42 35_97491d80](https://github.com/user-attachments/assets/51a42c8c-146e-4f8e-aef2-0733f02bb784)




