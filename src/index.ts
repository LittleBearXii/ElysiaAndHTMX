import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'

new Elysia()
  .use(html())
  .get('/', () => (
    `<html>
      <head>
        <script src="https://unpkg.com/htmx.org@1.9.2"></script>
      </head>
      <body>
        <h1>Hello from Elysia + HTMX</h1>
        <button hx-get="/time" hx-target="#otherButton">Get time</button>
        <div id="otherButton">
        </div>
      </body>
    </html>`
  ))
  .get('/time', () => (
    `<button hx-get="/time" hx-swap="outerHTML">
      Time: ${new Date().toLocaleTimeString()}
    </button>`
  ))
  .listen(3000)
