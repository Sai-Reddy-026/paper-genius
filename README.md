# Paper Genius

AI Question Paper Analyzer - ChatGPT Style Frontend

Create a single-page modern AI web interface that looks and feels like ChatGPT.

Important

Generate only the frontend UI.

Do not generate backend, Python, APIs, Flask, FastAPI, machine learning, or database code.

Focus only on creating a premium user interface.

The frontend will later connect to my Python AI backend.

Project

This application is an AI Question Paper Analyzer.

Users can upload:

Previous Question Papers (PDF)

Notes (PDF/DOCX/TXT)

Textbooks

Images of Question Papers (JPG/PNG)

The AI will analyze uploaded documents and answer questions based only on those documents.

Design Inspiration

The UI should closely resemble:

ChatGPT

Google NotebookLM

Claude AI

Perplexity AI

Use a clean, premium AI SaaS design.

Layout

Build only one page.

The layout should have three sections.

Left Sidebar

The sidebar should be collapsible.

Include:

Project Logo

New Chat

Recent Chats

Uploaded Documents

Search Chats

Settings

User Profile

Main Chat Area

Display the title:

AI Question Paper Analyzer

Subtitle:

"Upload previous question papers, notes, and textbooks. Ask questions and receive AI-powered answers based only on your uploaded documents."

The chat interface should look almost identical to ChatGPT.

Display:

User messages on the right

AI messages on the left

Each AI answer should include placeholder sections for:

Answer

Confidence Score

Source Document

Page Number

Retrieved Context

Timestamp

Include buttons:

Copy

Regenerate

Like

Dislike

Support Markdown formatting and code blocks.

Bottom Input Area

Keep the input fixed at the bottom like ChatGPT.

Include:

Large text input

Send button

Upload Documents button

Upload Image button

Microphone button (UI only)

Placeholder:

"Ask anything about your uploaded question papers..."

Document Upload

Create a beautiful drag-and-drop upload area.

Support:

PDF

DOCX

TXT

PNG

JPG

JPEG

After upload, display each document as a beautiful card with:

File icon

File name

File type

Upload time

Number of pages (placeholder)

Delete button

Image Upload

Allow users to upload photos of handwritten or printed question papers.

Display uploaded images as preview cards.

Question Paper Analyzer Panel

Create a collapsible side panel.

Display placeholder information such as:

Total Uploaded Papers

Total Questions

Frequently Asked Topics

Most Repeated Questions

Subject Distribution

Exam Year Distribution

Include beautiful charts using placeholder data.

Empty State

Before any document is uploaded, display a centered illustration with the message:

"Upload question papers or notes to begin asking AI-powered questions."

Include a large "Upload Documents" button.

Loading State

When the AI is generating an answer, display:

Typing animation

Loading dots

Skeleton chat bubbles

Theme

Create a premium AI interface.

Use:

Glassmorphism

Rounded corners

Blue and Purple gradients

Soft shadows

Professional typography

Dark Mode by default

Light Mode toggle

Fully responsive layout

Animations

Include smooth animations for:

Sidebar

Chat messages

File uploads

Buttons

Hover effects

Loading indicators

Components

Create reusable components for:

Sidebar

Chat Message

Upload Card

Image Preview Card

Citation Card

Source Card

Typing Indicator

Loading Spinner

Empty State

Navbar

Toast Notifications

Goal

The final UI should look like a real AI assistant similar to ChatGPT, but specifically designed for an AI Question Paper Analyzer. It should be elegant, modern, responsive, and provide a premium user experience while remaining ready to connect to a Python-based RAG backend in the future.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ed846027-1839-482d-bbdb-6fe6bafd6912).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
