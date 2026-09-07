import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import { createProjectValidator, updateProjectValidator } from '#validators/project'
import ProjectPolicy from '#policies/project_policy'

export default class ProjectsController {
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role === 'admin') {
      return Project.query().orderBy('createdAt', 'desc')
    }

    return Project.query().where('ownerId', user.id).orderBy('createdAt', 'desc')
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createProjectValidator)

    const project = await Project.create({
      ...payload,
      ownerId: user.id,
    })

    return response.created(project)
  }

  async show({ bouncer, params }: HttpContext) {
    const project = await Project.findOrFail(params.id)

    await bouncer.with(ProjectPolicy).authorize('view', project)

    return project
  }

  async update({ bouncer, params, request }: HttpContext) {
    const project = await Project.findOrFail(params.id)

    await bouncer.with(ProjectPolicy).authorize('update', project)

    const payload = await request.validateUsing(updateProjectValidator)

    project.merge(payload)
    await project.save()

    return project
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)

    await bouncer.with(ProjectPolicy).authorize('delete', project)

    await project.delete()

    return response.noContent()
  }
}
