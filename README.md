<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="./public/kaipo.png" width="120" alt="Nest Logo" /></a>
</p>

# 📊 Kaipo – Electronic Medical Records (EMR) System

**Kaipo** is a comprehensive Electronic Medical Records (EMR) solution tailored for hospitals and clinics. It streamlines patient data management, encompassing medical histories, diagnoses, medications, lab results, and more.

🌐 [Live Demo](https://www.kaipo.my.id)

---

## 📌 Features

- **Patient Management**: Maintain detailed records of patient demographics and medical histories.
- **Clinical Documentation**: Record diagnoses, treatments, and progress notes efficiently.
- **Medication Tracking**: Monitor prescriptions and medication histories.
- **Laboratory Integration**: Manage lab test orders and results seamlessly.
- **User Roles & Permissions**: Define access levels for administrators, doctors, nurses, and staff.
- **Secure Authentication**: Implement robust login systems to protect sensitive data.

---

## 🛠️ Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) (TypeScript)
- **Frontend**: [React](https://reactjs.org/) (JavaScript)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Containerization**: [Docker](https://www.docker.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/andreeewill/Kaipo.git
   cd Kaipo
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment variables:**

   - Copy the example environment file and modify as needed:

     ```bash
     cp .env.example .env
     ```

4. **Run the application:**

   - Using Docker:

     ```bash
     docker-compose up --build
     ```

   - Without Docker:

     ```bash
     pnpm run start:dev
     ```

---

## 📂 Project Structure

```
Kaipo/
├── .github/           # GitHub workflows and configurations
├── .vscode/           # VSCode settings
├── public/            # Static assets
├── src/               # Source code
├── .env.example       # Sample environment variables
├── Dockerfile         # Docker configuration
├── package.json       # Project metadata and scripts
└── tsconfig.json      # TypeScript configuration
```

---

## 🧪 Testing

To run tests:

```bash
pnpm run test
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

## 📬 Contact

For questions or support, please open an [issue](https://github.com/andreeewill/Kaipo/issues) on GitHub.
