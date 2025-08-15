# Slate (In Development)

**Slate** was initially intended to be a closed-source project, but I figured—why not open-source it? That way, others can learn, contribute, or build on top of it.

It's a **Notion-like note-taking app**, but not just for notes—Slate is designed for **content writing, script drafting, blogging, journaling**, and more.

![Landing](/public/site/landing.png)

## Preview of current build

| ![Dashboard](/public/site/demo-dash.png) | ![Folder](/public/site/demo-folder.png) |
|------------------------------------|------------------------------------|
| ![Document](/public/document-page.png) | ![AI Chat](/public/site/demo-ai.png) |

[▶️ Watch Demo](https://www.kapwing.com/e/68971253494d74d1a712ef3b)

## 🚀 Features

Initially, I thought—why not build something inspired by Notion, rather than replicating it entirely? So while some features may feel familiar, the goal isn't to make a one-to-one copy.

* **Folders**
  File system-style document management
* **Documents**
  Pages where you write and structure your content
* **Create document with AI**
  Create a document using AI
* **AI for Everything**
  AI that writes, creates, fixes, and enhances your content
* **Realtime Updates**
  Creating or editing folders/documents reflects live in the UI wherever relevant
* **Search Across Workspaces**
  Quickly find any document, regardless of where it's stored
* **Document Sharing**
  Share documents securely with others
* **Rich Text Editor**
  Fully-featured editor with formatting, embeds, and more
* **AI Autocomplete** *(like Copilot)*
  Inline suggestions while you're typing
* **And more...**
  Expect continuous improvements and new features


## 🧱 Tech Stack

* **Next.js**
* **tRPC**
  Type-safe API layer — a powerful alternative to REST/fetch
* **Postgres (via Xata)**
  [xata.io](https://lite.xata.io) — free plan includes 15GB of storage
* **Drizzle ORM**
* **AI SDK**
  For streaming responses, context-aware AI, etc.
* **Nodemailer**
  Used for email notifications
* **Tailwind CSS**
  Utility-first styling
* **shadcn/ui**
  Component system for consistent UI
* **Polar SDK**
  A Stripe wrapper built for developers — handles programmatic payments
* **Better Auth**
  Auth system compatible with Polar SDK


## 🛠️ Setup Locally

To run the project locally, you'll need to configure a few things in your **Google Cloud Console** and **GitHub Apps**:

1. **Create a Google Cloud Project** *(skip if you already have one)*
2. **Create an OAuth client** in Google Cloud
3. **Create a GitHub App**

Once done, copy the values into your local `.env` file:

* Use `.env.example` as a reference
* Rename it to `.env` and fill in the required variables

## 📝 Self deploy

For self-hosting, there's a dedicated branch where I've removed all payment integrations (Stripe/Polar) so you can access all features without restrictions.

* [Self-hosting branch](https://github.com/r2hu1/slate/tree/without-payments-for-selfhost)

## ▶️ Run the Project

After setting up your environment variables, install the dependencies:

```bash
pnpm install
# or
npm install
```

Then start the development server:

```bash
pnpm run dev
# or
npm run dev
```

Once running, open [http://localhost:3000](http://localhost:3000) in your browser 🚀


## 🤝 Contribution

We welcome contributions from everyone!

1. **Fork** this repository
2. **Clone** your fork
3. **Fix a bug** or **add a new feature**
4. **Create a pull request** – I’ll review and merge it!


## 📄 License

Slate is **free for personal use**.
However, **monetization is not allowed** without prior written consent.
If you're interested in using Slate commercially, please connect with me for discussion.
