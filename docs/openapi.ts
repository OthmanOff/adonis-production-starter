const openapi = {
  openapi: '3.1.0',

  info: {
    title: 'Adonis Production Starter',
    version: '1.0.0',
    description:
      'Production-ready REST API starter built with AdonisJS, PostgreSQL, authentication, authorization, Docker and automated tests.',
  },

  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Local development server',
    },
  ],

  tags: [
    {
      name: 'Health',
      description: 'Application health',
    },
    {
      name: 'Projects',
      description: 'Project management',
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Access Token',
      },
    },

    schemas: {
      Project: {
        type: 'object',

        properties: {
          id: {
            type: 'integer',
            example: 1,
          },

          ownerId: {
            type: 'integer',
            example: 1,
          },

          name: {
            type: 'string',
            example: 'My project',
          },

          description: {
            type: ['string', 'null'],
            example: 'Project description',
          },

          status: {
            type: 'string',
            enum: ['active', 'completed', 'archived'],
            example: 'active',
          },

          createdAt: {
            type: 'string',
            format: 'date-time',
          },

          updatedAt: {
            type: ['string', 'null'],
            format: 'date-time',
          },
        },

        required: ['id', 'ownerId', 'name', 'status', 'createdAt'],
      },

      CreateProject: {
        type: 'object',

        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 255,
            example: 'My project',
          },

          description: {
            type: 'string',
            maxLength: 2000,
            example: 'Project description',
          },

          status: {
            type: 'string',
            enum: ['active', 'completed', 'archived'],
            default: 'active',
          },
        },

        required: ['name'],
      },

      UpdateProject: {
        type: 'object',

        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 255,
          },

          description: {
            type: ['string', 'null'],
            maxLength: 2000,
          },

          status: {
            type: 'string',
            enum: ['active', 'completed', 'archived'],
          },
        },
      },

      Error: {
        type: 'object',

        properties: {
          message: {
            type: 'string',
          },
        },

        required: ['message'],
      },
    },
  },

  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Application health check',

        responses: {
          '200': {
            description: 'Application is healthy',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },

                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List projects',
        security: [{ bearerAuth: [] }],

        responses: {
          '200': {
            description: 'Projects',

            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Project',
                  },
                },
              },
            },
          },

          '401': {
            description: 'Unauthenticated',
          },
        },
      },

      post: {
        tags: ['Projects'],
        summary: 'Create project',
        security: [{ bearerAuth: [] }],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateProject',
              },
            },
          },
        },

        responses: {
          '201': {
            description: 'Project created',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project',
                },
              },
            },
          },

          '401': {
            description: 'Unauthenticated',
          },

          '422': {
            description: 'Validation error',
          },
        },
      },
    },

    '/api/v1/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Get project',
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],

        responses: {
          '200': {
            description: 'Project',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project',
                },
              },
            },
          },

          '401': {
            description: 'Unauthenticated',
          },

          '404': {
            description: 'Project not found',
          },
        },
      },

      patch: {
        tags: ['Projects'],
        summary: 'Update project',
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateProject',
              },
            },
          },
        },

        responses: {
          '200': {
            description: 'Project updated',

            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project',
                },
              },
            },
          },

          '401': {
            description: 'Unauthenticated',
          },

          '404': {
            description: 'Project not found',
          },

          '422': {
            description: 'Validation error',
          },
        },
      },

      delete: {
        tags: ['Projects'],
        summary: 'Delete project',
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],

        responses: {
          '204': {
            description: 'Project deleted',
          },

          '401': {
            description: 'Unauthenticated',
          },

          '404': {
            description: 'Project not found',
          },
        },
      },
    },
  },
} as const

export default openapi
