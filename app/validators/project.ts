import vine from '@vinejs/vine'

export const createProjectValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),

    description: vine.string().trim().maxLength(2000).optional(),

    status: vine.enum(['active', 'completed', 'archived']).optional(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),

    description: vine.string().trim().maxLength(2000).nullable().optional(),

    status: vine.enum(['active', 'completed', 'archived']).optional(),
  })
)
