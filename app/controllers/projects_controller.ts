import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import { createProjectValidator, updateProjectValidator } from '#validators/project'

export default class ProjectsController {
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

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

  async show({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const project = await Project.query().where('id', params.id).where('ownerId', user.id).first()

    if (!project) {
      return response.notFound({
        message: 'Project not found',
      })
    }

    return project
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const project = await Project.query().where('id', params.id).where('ownerId', user.id).first()

    if (!project) {
      return response.notFound({
        message: 'Project not found',
      })
    }

    const payload = await request.validateUsing(updateProjectValidator)

    project.merge(payload)
    await project.save()

    return project
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const project = await Project.query().where('id', params.id).where('ownerId', user.id).first()

    if (!project) {
      return response.notFound({
        message: 'Project not found',
      })
    }

    await project.delete()

    return response.noContent()
  }
}
