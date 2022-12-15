import { ContainerContent } from "../data/Containers/data"

export function generateSrcDoc({colorScheme, scriptUrl, csp}: {colorScheme: string, scriptUrl: string, csp: string}) {
  return (
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Edit</title>
        <script>
          (function () {
            const prefersDark =
              window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches
            const setting = ${JSON.stringify(colorScheme)} || "auto"
            const dark = setting === 'auto' ? prefersDark : (setting === 'dark')
            document.documentElement.classList[dark ? 'add' : 'remove']("dark")
    
            window.firstMessageEvent = {event: null}
            function listener(e) {
              if (window.firstMessageEvent && e.data.length > 0 && e.data[0] === 'md-doc') {
                window.firstMessageEvent.event = e
              } else {
                window.removeEventListener('message', listener)
              }
            }
            window.addEventListener('message', listener)
          })()
        </script>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="${csp}" />
        <base target="_blank">
      </head>
      <body>
        <div id="app" class="flex flex-col"></div>
        <script type="module" src="${scriptUrl}"></script>
      </body>
    </html>`
  )
}