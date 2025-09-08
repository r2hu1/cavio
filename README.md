# Slate (In Development)

**Slate** was initially intended to be a closed-source project, but I figured—why not open-source it? That way, others can learn, contribute, or build on top of it.

It's a **Notion-like note-taking app**, but not just for notes—Slate is designed for **content writing, script drafting, blogging, journaling**, and more.

## Preview

![](/public/dash.png)

![](/public/folder.png)

![](/public/doc.png)

![](/public/doc-ai.png)

## 🛠️ Setup and Deploy

To run the project locally, you'll need to have api/secret keys of the following:

1. **Google Cloud Project** *(skip if you already have one)*
2. **OAuth client** in Google Cloud
3. **GitHub App**
4. **Postgress database**
5. **Gemini ai**

Once done, copy the values into your local `.env` file:

* Use `.env.example` as a reference
* Rename it to `.env` and fill in the required variables

After setting up the environment variables, you can install the dependencies and start the development server by running:

```bash
npm install or pnpm install
npm run dev or pnpm run dev
```

Now you are ready to deploy the project on cloud platforms like Vercel.

## 📝 Deploy on Vercel

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/r2hu1/slate/tree/without-payments-for-selfhost)

# Contributions

Fix, add or enhance something and make a pull request, i will review and merge it :)
