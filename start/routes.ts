/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
const ProjectsController = () => import('#controllers/projects_controller')
import openapi from '../docs/openapi.ts'

router.get('/openapi.json', async () => {
  return openapi
})

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')

router
  .group(() => {
    router.get('/projects', [ProjectsController, 'index'])
    router.post('/projects', [ProjectsController, 'store'])
    router.get('/projects/:id', [ProjectsController, 'show'])
    router.patch('/projects/:id', [ProjectsController, 'update'])
    router.delete('/projects/:id', [ProjectsController, 'destroy'])
  })
  .use(middleware.auth())
  .prefix('/api/v1')

router.get('/health', async ({ response }) => {
  return response.ok({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

router.get('/docs', async ({ response }) => {
  response.header('Content-Type', 'text/html')

  return `
    <!doctype html>
    <html>
      <head>
        <title>Adonis Production Starter API</title>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </head>

      <body>
        <script
          id="api-reference"
          data-url="/openapi.json"
        ></script>

        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `
})
