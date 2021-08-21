const todosGetOpt = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            site: { type: 'string' },
            domain: { type: 'string' },
            url: { type: 'string' },
            commission: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' }
          }
        }
      }
    }
  }
}
const todoGetOpt = {
  schema: {
    querystring: {
      id: { type: 'string' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          site: { type: 'string' },
          domain: { type: 'string' },
          url: { type: 'string' },
          commission: { type: 'string' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' }
        }
      }
    }
  }
}
const todoPostOpts = {
  schema: {
    body: {
      site: { type: 'string' },
      domain: { type: 'string' },
      origin: { type: 'string' },
      commission: { type: 'string' },
      urls: {
        type: 'object',
        prices: { type: 'string' },
        overstock: { type: 'string' },
        unavailable: { type: 'string' },
        high_demand: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          site: { type: 'string' },
          domain: { type: 'string' },
          origin: { type: 'string' },
          commission: { type: 'string' },
          urls: {
            type: 'object',
            prices: { type: 'string' },
            overstock: { type: 'string' },
            unavailable: { type: 'string' },
            high_demand: { type: 'string' }
          },
          created_at: { type: 'string' },
          updated_at: { type: 'string' }
        }
      }
    }
  }
}
const buildGetOpt = {
  schema: {
    querystring: {
      site_1: { type: 'string' },
      site_2: { type: 'string' }
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          item: {
            name: { type: 'string' },
            price_1: { type: 'string' },
            price_2: { type: 'string' },
            difference: { type: 'string' },
            availability_1: { type: 'string' },
            availability_2: { type: 'string' },
            status_1: { type: 'string', enum: ['unavailable', 'overstock', 'high demand'] },
            status_2: { type: 'string', enum: ['unavailable', 'overstock', 'high demand'] }
          }
        }
      }
    }
  }
}
const settingsGetOpt = {
  schema: {
    params: {
      site: { type: 'string' }
    },
    response: {
      200: {
        type: 'array',
        properties: {
          _id: { type: 'string' },
          site: { type: 'string' },
          domain: { type: 'string' },
          origin: { type: 'string' },
          urls: {
            type: 'object',
            prices: {
              type: 'object',
              method: { type: 'string' },
              url: { type: 'string' },
              format: { type: 'string' },
              settings: { type: 'object' },
              actions: { type: 'array' }
            },
            overstock: {
              type: 'object',
              method: { type: 'string' },
              url: { type: 'string' },
              format: { type: 'string' },
              settings: { type: 'object' },
              actions: { type: 'array' }
            },
            unavailable: {
              type: 'object',
              method: { type: 'string' },
              url: { type: 'string' },
              format: { type: 'string' },
              settings: { type: 'object' },
              actions: { type: 'array' }
            },
            highDemand: {
              type: 'object',
              method: { type: 'string' },
              url: { type: 'string' },
              format: { type: 'string' },
              settings: { type: 'object' },
              actions: { type: 'array' }
            }
          },
          commission: { type: 'string' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' }
        }
      }
    }
  }
}
const settingsPostOpt = {
  schema: {
    querystring: {
      site: { type: 'string' },
      domain: { type: 'string' },
      origin: { type: 'string' },
      urls: {
        type: 'object',
        prices: {
          type: 'object',
          method: { type: 'string' },
          url: { type: 'string' },
          format: { type: 'string' },
          settings: { type: 'object' },
          actions: { type: 'array' }
        },
        overstock: {
          type: 'object',
          method: { type: 'string' },
          url: { type: 'string' },
          format: { type: 'string' },
          settings: { type: 'object' },
          actions: { type: 'array' }
        },
        unavailable: {
          type: 'object',
          method: { type: 'string' },
          url: { type: 'string' },
          format: { type: 'string' },
          settings: { type: 'object' },
          actions: { type: 'array' }
        },
        highDemand: {
          type: 'object',
          method: { type: 'string' },
          url: { type: 'string' },
          format: { type: 'string' },
          settings: { type: 'object' },
          actions: { type: 'array' }
        }
      },
      commission: { type: 'string' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          site: { type: 'string' },
          domain: { type: 'string' },
          origin: { type: 'string' },
          urls: {
            type: 'object',
            prices: {
              type: 'object',
              method: { type: 'string' },
              url: { type: 'string' },
              format: { type: 'string' },
              actions: { type: 'array' }
            },
            overstock: {
              type: 'object',
              method: { type: 'string' },
              url: { type: 'string' },
              format: { type: 'string' },
              actions: { type: 'array' }
            },
            unavailable: {
              type: 'object',
              method: { type: 'string' },
              url: { type: 'string' },
              format: { type: 'string' },
              actions: { type: 'array' }
            },
            highDemand: {
              type: 'object',
              method: { type: 'string' },
              url: { type: 'string' },
              format: { type: 'string' },
              actions: { type: 'array' }
            }
          },
          commission: { type: 'string' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' }
        }
      }
    }
  }
}
const pricesGetOpt = {
  schema: {
    params: {
      site: { type: 'string' }
    },
    required: ['site'],
    response: {
      200: {
        type: 'array',
        properties: {
          _id: { type: 'string' },
          prices: { type: 'array' },
          overstock: { type: 'array' },
          unavailable: { type: 'array' },
          high_demand: { type: 'array' },
          created_at: { type: 'string' }
        }
      }
    }
  }
}
const pricesPostOpt = {
  schema: {
    querystring: {
      site: { type: 'string' },
      prices: { type: 'array' },
      overstock: { type: 'array' },
      unavailable: { type: 'array' },
      highDemand: { type: 'array' }
    },
    required: ['site', 'prices', 'overstock', 'unavailable', 'highDemand'],
    response: {
      200: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          prices: { type: 'array' },
          overstock: { type: 'array' },
          unavailable: { type: 'array' },
          highDemand: { type: 'array' },
          created_at: { type: 'string' }
        }
      }
    }
  }
}

module.exports = {
  todosGetOpt,
  todoGetOpt,
  todoPostOpts,
  buildGetOpt,
  settingsGetOpt,
  settingsPostOpt,
  pricesGetOpt,
  pricesPostOpt
}
