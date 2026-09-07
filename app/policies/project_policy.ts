import type User from '#models/user'
import type Project from '#models/project'
import { BasePolicy, AuthorizationResponse } from '@adonisjs/bouncer'

export default class ProjectPolicy extends BasePolicy {
  before(user: User | null) {
    if (user?.role === 'admin') {
      return true
    }
  }

  view(user: User, project: Project) {
    if (user.id === project.ownerId) {
      return true
    }

    return AuthorizationResponse.deny('Project not found', 404)
  }

  update(user: User, project: Project) {
    if (user.id === project.ownerId) {
      return true
    }

    return AuthorizationResponse.deny('Project not found', 404)
  }

  delete(user: User, project: Project) {
    if (user.id === project.ownerId) {
      return true
    }

    return AuthorizationResponse.deny('Project not found', 404)
  }
}
