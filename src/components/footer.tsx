export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://www.abraham.lat/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 transition-colors duration-150 hover:text-primary"
            >
              AbrahamX3
            </a>
            . Source code available on{" "}
            <a
              href="https://github.com/AbrahamX3/the-watchlist"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 transition-colors duration-150 hover:text-primary"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 text-center align-middle text-sm leading-loose text-muted-foreground">
          <p className="font-semibold">Powered by </p>
          <a rel="noopener" target="_blank" href="https://www.themoviedb.org/">
            <svg
              className="h-12 w-12 grayscale transition-all duration-150 hover:grayscale-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 190.24 81.52"
            >
              <defs>
                <linearGradient
                  id="a"
                  x2="190.24"
                  y1="40.76"
                  y2="40.76"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#90cea1" />
                  <stop offset=".56" stopColor="#3cbec9" />
                  <stop offset="1" stopColor="#00b3e5" />
                </linearGradient>
              </defs>
              <g data-name="Layer 2">
                <path
                  fill="url(#a)"
                  d="M105.67 36.06h66.9a17.67 17.67 0 0 0 17.67-17.66A17.67 17.67 0 0 0 172.57.73h-66.9A17.67 17.67 0 0 0 88 18.4a17.67 17.67 0 0 0 17.67 17.66Zm-88 45h76.9a17.67 17.67 0 0 0 17.67-17.66 17.67 17.67 0 0 0-17.67-17.67h-76.9A17.67 17.67 0 0 0 0 63.4a17.67 17.67 0 0 0 17.67 17.66Zm-7.26-45.64h7.8V6.92h10.1V0h-28v6.9h10.1Zm28.1 0h7.8V8.25h.1l9 27.15h6l9.3-27.15h.1V35.4h7.8V0H66.76l-8.2 23.1h-.1L50.31 0h-11.8Zm113.92 20.25a15.07 15.07 0 0 0-4.52-5.52 18.57 18.57 0 0 0-6.68-3.08 33.54 33.54 0 0 0-8.07-1h-11.7v35.4h12.75a24.58 24.58 0 0 0 7.55-1.15 19.34 19.34 0 0 0 6.35-3.32 16.27 16.27 0 0 0 4.37-5.5 16.91 16.91 0 0 0 1.63-7.58 18.5 18.5 0 0 0-1.68-8.25ZM145 68.6a8.8 8.8 0 0 1-2.64 3.4 10.7 10.7 0 0 1-4 1.82 21.57 21.57 0 0 1-5 .55h-4.05v-21h4.6a17 17 0 0 1 4.67.63 11.66 11.66 0 0 1 3.88 1.87A9.14 9.14 0 0 1 145 59a9.87 9.87 0 0 1 1 4.52 11.89 11.89 0 0 1-1 5.08Zm44.63-.13a8 8 0 0 0-1.58-2.62 8.38 8.38 0 0 0-2.42-1.85 10.31 10.31 0 0 0-3.17-1v-.1a9.22 9.22 0 0 0 4.42-2.82 7.43 7.43 0 0 0 1.68-5 8.42 8.42 0 0 0-1.15-4.65 8.09 8.09 0 0 0-3-2.72 12.56 12.56 0 0 0-4.18-1.3 32.84 32.84 0 0 0-4.62-.33h-13.2v35.4h14.5a22.41 22.41 0 0 0 4.72-.5 13.53 13.53 0 0 0 4.28-1.65 9.42 9.42 0 0 0 3.1-3 8.52 8.52 0 0 0 1.2-4.68 9.39 9.39 0 0 0-.55-3.18Zm-19.42-15.75h5.3a10 10 0 0 1 1.85.18 6.18 6.18 0 0 1 1.7.57 3.39 3.39 0 0 1 1.22 1.13 3.22 3.22 0 0 1 .48 1.82 3.63 3.63 0 0 1-.43 1.8 3.4 3.4 0 0 1-1.12 1.2 4.92 4.92 0 0 1-1.58.65 7.51 7.51 0 0 1-1.77.2h-5.65Zm11.72 20a3.9 3.9 0 0 1-1.22 1.3 4.64 4.64 0 0 1-1.68.7 8.18 8.18 0 0 1-1.82.2h-7v-8h5.9a15.35 15.35 0 0 1 2 .15 8.47 8.47 0 0 1 2.05.55 4 4 0 0 1 1.57 1.18 3.11 3.11 0 0 1 .63 2 3.71 3.71 0 0 1-.43 1.92Z"
                  data-name="Layer 1"
                />
              </g>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
