# Image Optimization Tool

A powerful Next.js-based web application for optimizing and processing images with advanced compression and resizing capabilities.

## Features

- 🖼️ **Image Upload**: Support for multiple image formats
- 🔧 **Optimization Controls**: Adjust compression quality and settings
- 📏 **Resize Controls**: Flexible image resizing options
- 📊 **Processing Progress**: Real-time progress tracking
- 💾 **Download Manager**: Easy download of optimized images
- 🔒 **Privacy Banner**: User privacy information
- ⚡ **Web Workers**: Efficient image processing using web workers
- 🎨 **Modern UI**: Built with Tailwind CSS for a responsive design

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Processing**: Custom compression and utilities
- **Build Tool**: Next.js built-in tooling

## Project Structure

```
image-optimization-main/
├── app/                    # Next.js app directory
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/             # React components
│   ├── DownloadManager.tsx
│   ├── ImagePreview.tsx
│   ├── ImageUploader.tsx
│   ├── OptimizationControls.tsx
│   ├── PrivacyBanner.tsx
│   ├── ProcessingProgress.tsx
│   └── ResizeControls.tsx
├── lib/                    # Utility libraries
│   ├── compression.ts
│   ├── image-utils.ts
│   ├── utils.ts
│   └── zip-utils.ts
├── types/                  # TypeScript type definitions
│   ├── image.types.ts
│   └── upng-js.d.ts
├── workers/                # Web Workers
│   └── image-processor.worker.ts
└── public/                 # Static assets

```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rgolusuTR/image-optimization-main.git
cd image-optimization-main
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Upload Images**: Click or drag-and-drop images to upload
2. **Configure Settings**: Adjust optimization and resize settings
3. **Process Images**: Click to start the optimization process
4. **Download Results**: Download individual images or all as a ZIP file

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

The project uses:
- **ESLint**: For code linting (`eslint.config.mjs`)
- **Tailwind CSS**: For styling (`tailwind.config.ts`)
- **TypeScript**: For type safety (`tsconfig.json`)
- **PostCSS**: For CSS processing (`postcss.config.mjs`)

## Deployment

### Deploy on Vercel

The easiest way to deploy this Next.js app is using the [Vercel Platform](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rgolusuTR/image-optimization-main)

### Other Platforms

This application can be deployed on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- And more...

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Learn More

To learn more about Next.js and the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using Next.js