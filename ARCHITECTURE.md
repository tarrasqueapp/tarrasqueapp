# Architecture

Tarrasque App is a web app built with the following technologies:

- [Next.js](https://nextjs.org/): A framework for building server-rendered React applications.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.

The app uses [MUI](https://mui.com/) for the interface, and the following packages for form management and schema validation:

- [react-hook-form](https://react-hook-form.com/): A performance-focused library for managing forms in React.
- [zod](https://www.npmjs.com/package/zod): A TypeScript-first schema declaration and validation library.

HTTP requests are handled with the following packages:

- [@tanstack/react-query](https://tanstack.com/query): A React hook for fetching, caching, and updating data.

State management is handled with the following packages:

- [zustand](https://zustand.surge.sh/): A small, fast and scalable bearbones state-management solution.

File uploads are supported through the following packages:

- [react-dropzone](https://react-dropzone.js.org/): A React component for creating drag-and-drop areas for file uploads.
- [Uppy](https://uppy.io/): A file uploading library that uses [Tus](https://tus.io/) for the actual uploading process.

The app also includes a rendering engine built with the following packages:

- [PixiJS](https://pixijs.com/): A fast, lightweight 2D rendering engine for the web.

Database, authentication, and realtime communication is handled by [Supabase](https://supabase.com/), an open-source Firebase alternative built on top of PostgreSQL.
