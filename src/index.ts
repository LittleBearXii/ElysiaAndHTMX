import { Elysia, t } from 'elysia'
import { html } from '@elysiajs/html'
import pages from './pages'

new Elysia()
  .use(html())
  .use(pages)
  .listen(3000)
