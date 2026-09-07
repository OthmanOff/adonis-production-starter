import { test } from '@japa/runner'
import User from '#models/user'
import Project from '#models/project'

test.group('Projects', (group) => {
  group.each.setup(async () => {
    await Project.query().delete()
    await User.query().delete()
  })

  test('rejects unauthenticated users', async ({ client }) => {
    const response = await client.get('/api/v1/projects')

    response.assertStatus(401)
  })

  test('creates a project for the authenticated user', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    })

    const response = await client.post('/api/v1/projects').loginAs(user).json({
      name: 'My project',
      description: 'Project description',
    })

    response.assertStatus(201)

    const project = await Project.query()
      .where('ownerId', user.id)
      .where('name', 'My project')
      .first()

    assert.exists(project)
    assert.equal(project?.description, 'Project description')
  })

  test('rejects invalid project payload', async ({ client }) => {
    const user = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    })

    const response = await client.post('/api/v1/projects').loginAs(user).json({
      name: '',
    })

    response.assertStatus(422)
  })

  test('returns only projects owned by authenticated user', async ({ client }) => {
    const userA = await User.create({
      fullName: 'User A',
      email: 'a@example.com',
      password: 'secret123',
    })

    const userB = await User.create({
      fullName: 'User B',
      email: 'b@example.com',
      password: 'secret123',
    })

    await Project.create({
      name: 'Project A',
      ownerId: userA.id,
      status: 'active',
    })

    await Project.create({
      name: 'Project B',
      ownerId: userB.id,
      status: 'active',
    })

    const response = await client.get('/api/v1/projects').loginAs(userA)

    response.assertStatus(200)

    response.assertBodyContains([
      {
        name: 'Project A',
      },
    ])
  })

  test('cannot access another user project', async ({ client }) => {
    const userA = await User.create({
      fullName: 'User A',
      email: 'a@example.com',
      password: 'secret123',
    })

    const userB = await User.create({
      fullName: 'User B',
      email: 'b@example.com',
      password: 'secret123',
    })

    const project = await Project.create({
      name: 'Private project',
      ownerId: userB.id,
      status: 'active',
    })

    const response = await client.get(`/api/v1/projects/${project.id}`).loginAs(userA)

    response.assertStatus(404)
  })

  test('updates own project', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    })

    const project = await Project.create({
      name: 'Old name',
      ownerId: user.id,
      status: 'active',
    })

    const response = await client.patch(`/api/v1/projects/${project.id}`).loginAs(user).json({
      name: 'New name',
    })

    response.assertStatus(200)

    await project.refresh()

    assert.equal(project.name, 'New name')
  })

  test('cannot update another user project', async ({ client }) => {
    const userA = await User.create({
      fullName: 'User A',
      email: 'a@example.com',
      password: 'secret123',
    })

    const userB = await User.create({
      fullName: 'User B',
      email: 'b@example.com',
      password: 'secret123',
    })

    const project = await Project.create({
      name: 'Project B',
      ownerId: userB.id,
      status: 'active',
    })

    const response = await client.patch(`/api/v1/projects/${project.id}`).loginAs(userA).json({
      name: 'Hacked name',
    })

    response.assertStatus(404)
  })

  test('deletes own project', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    })

    const project = await Project.create({
      name: 'Project to delete',
      ownerId: user.id,
      status: 'active',
    })

    const response = await client.delete(`/api/v1/projects/${project.id}`).loginAs(user)

    response.assertStatus(204)

    const deletedProject = await Project.find(project.id)

    assert.isNull(deletedProject)
  })
})
