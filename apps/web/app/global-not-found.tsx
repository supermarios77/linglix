export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-svh items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Not Found</h1>
            <p className="text-sm text-muted-foreground">
              The page you are looking for does not exist.
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}
