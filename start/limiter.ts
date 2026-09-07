import limiter from '@adonisjs/limiter/services/main'

export const apiThrottle = limiter.define('api', (ctx) => {
  if (ctx.auth.user) {
    return limiter.allowRequests(100).every('1 minute').usingKey(`user_${ctx.auth.user.id}`)
  }

  return limiter.allowRequests(20).every('1 minute').usingKey(`ip_${ctx.request.ip()}`)
})
