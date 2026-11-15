# Student Management System for Schools

**A web-based student management system by Crownix.**

The Student Management System for Schools helps teachers move away from maintaining multiple Excel workbooks for student records, subject selections, examinations, marks, rankings, and reports. Instead of repeatedly editing and reconciling separate spreadsheets whenever information changes, the school can manage its information in one place and generate the required views and Excel exports when they are needed.

Teachers still enter student information and examination marks, but they no longer need to maintain a collection of interconnected spreadsheets to keep student details, subject selections, results, and rankings up to date.

> **Manage student and academic information in one system, then generate the Excel files and reports you need.**

## Features

### Student and academic data management

- Add, view, search, and manage student records and personal details.
- Organise students across academic years, batches, grades, and classes.
- Manage subjects, examination records, teachers, and teaching assignments.
- Record each student's selected subjects and track their enrolments over time.
- Assign teachers to the relevant classes and subjects.
- Manage the academic structure centrally instead of repeatedly updating multiple spreadsheets.

### Examinations and marks

- Create and manage examinations.
- Enter marks using an interface designed to make spreadsheet-style mark entry straightforward.
- Review and correct marks when necessary.
- Keep examination results connected to the relevant students, subjects, classes, and academic records.

### Results and rankings

- View examination results at student, class, and grade level.
- Review student, class, and subject rankings where applicable.
- Identify top-performing students and compare results across classes and grades.
- Generate result views from current records rather than manually maintaining separate ranking spreadsheets.

### Student progress and insights

- Review a student's academic records across years and examinations.
- Track subject and examination performance over time.
- Use graphs to explore student progress by examination and subject.
- Find student information for a selected year, batch, grade, or class.

### Excel exports

- Export student details and lists to Excel.
- Export examination results and rankings.
- Export class student lists.
- Generate updated spreadsheets from the information currently stored in the system.
- Keep exported files available for the school's existing reporting and record-keeping processes.

### Designed for school-scale data

- Intended to handle large collections of students, subjects, classes, and teachers.
- Designed for school use across Grades 6–13.
- Keeps related academic information organised in one application.

## Deployment and access

The web edition is the pure Next.js application. It is designed to be deployed as a web application on cloud infrastructure and accessed through a domain using a browser.

### Cloud deployment

A school or organisation can deploy the Next.js application to a suitable cloud hosting environment and make it available through its own domain. Teachers can then access the system through a web browser without installing the desktop application on their computers.

The application includes an authentication system designed for web deployment. Its production security configuration should be enabled and configured for the deployment environment, including the use of HTTPS, appropriate cookie settings, and the required environment variables. Some security settings are adjusted or disabled in local-development configurations because local access may use HTTP and loopback or private-network addresses. Those development settings should not be carried into a public cloud deployment without review.


### Which edition should be used for local school installations?

For a school that wants to run the system on its own computer or local network, use **Student Management System for Schools Desktop**. The desktop edition is specifically designed to manage a local Next.js server and its database, and it includes desktop-side features for server operation, backups, recovery, migrations, and updates.

Although the underlying Next.js application can be run on local infrastructure independently, doing so does not provide the Electron desktop manager and its integrated local server and storage-management features. For the supported local-school experience, use the desktop edition rather than deploying this web repository independently on a school computer.

## Relationship to the desktop edition

**Student Management System for Schools Desktop is a desktop wrapper around this web application, not a separate implementation of the student management system.**

This repository contains the actual Next.js application: its pages, user interface, business logic, server-side operations, authentication implementation, Prisma schema, and database migrations. The desktop repository contains the Electron shell and the local-management functionality needed to distribute and operate that same application on a school's computer or LAN.

The desktop edition packages a production build of this Next.js application and runs it locally using a bundled Node.js runtime. Electron provides the desktop window and management interface. In local desktop operation, the application is configured for the local environment; it does not use the cloud deployment configuration by default.

Choose the editions according to the deployment you need:

| Requirement | Recommended edition |
|---|---|
| Deploy the web application to cloud infrastructure and access it through a domain | **Web version (this repository)** |
| Run the system on one school computer with a desktop application window | **Desktop version** |
| Run the system on a central school computer and let other computers access it over the LAN using browsers | **Desktop version** |

The desktop edition has two local operating modes:

- **Client mode:** runs the application on the same computer and opens it in an Electron window. It is intended for single-computer use.
- **Server mode:** runs the application on a central computer and makes it available to other computers on the school's local network through their web browsers. The Electron Server Manager provides local server and data-management controls.

## Security and configuration

The application is intended to support web deployment with domain-based access. Before deploying it publicly:

- Use HTTPS.
- Configure the production authentication and cookie settings for the deployment domain.
- Set strong, unique secrets and all required production environment variables.
- Do not carry local-development security exceptions into a public deployment.
- Restrict access to the database and any exported student information.
- Use a reliable backup strategy for the deployed database.

## Project proposal

The initial project proposal was prepared by **Crownix** for **Lumbini College, Colombo 5**, dated **4 October 2026**.

## Development

This repository contains the Next.js web application. The development workflow uses pnpm.

Typical local setup:

1. Install a Node.js version supported by the project and install pnpm.
2. Clone this repository.
3. Install dependencies with `pnpm install`.
4. Configure the environment variables required by the project, using the repository's environment example or setup documentation.
5. Apply the development database migrations using the project's Prisma configuration.
6. Start the Next.js development server using the `dev` script in `package.json`.

Use the repository's current Prisma schema, migration history, environment configuration, and package scripts as the source of truth for development and deployment.

## Technology

| Area | Technology |
|---|---|
| Application | Next.js |
| Database | SQLite (can change to PostgreSQL or MySQL)|
| Database access and migrations | Prisma ORM |
| Interface components | shadcn/ui and Base UI |
| Authentication and signed sessions | `jose` |
| Input validation | Zod |
| Desktop distribution for local installations | Electron wrapper maintained in a separate repository |

# Crownix - Where Elegance Meets Logic