
# Hello! Picboard

Built as a spiritual successor to [Hello! Online's Picboard](https://www.hello-online.org/index.php?app=picapp), it is a website built in Next.js as a place to view, upload, and share pictures of Japanese idols. It is intended for any and all Japanese idols and Japanese idol fans, however feel free to fork and create a more niche version if you so choose.


## Tech Stack

**Client:** [React](https://react.dev/), [Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)

**Server:** [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/), [Backblaze B2](https://www.backblaze.com/cloud-storage), [Vercel](https://vercel.com/), [Hetzner VPS](https://www.hetzner.com/), [Resend](https://resend.com/), [Amazon SES](https://aws.amazon.com/ses/), [Docker](https://www.docker.com/)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Radix UI](https://img.shields.io/badge/radix%20ui-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
## Run Locally

Clone the project

```bash
  git clone https://github.com/davidguy3237/hello-picboard.git
```

Go to the project directory

```bash
  cd hello-picboard
```

Install dependencies

```bash
  npm install
```
Make a copy of the `env.example` file and fill out the necessary environment variables

Use Prisma to set up tables in PostgreSQL database

```bash
npx prisma generate
npx prisma db push
```

Run the development server

```bash
  npm run dev
```

