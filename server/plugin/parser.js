const WebSocket = require('ws')
const fetch = require('node-fetch')
const useragent = require('random-useragent')
const CloudflareBypasser = require('cloudflare-bypasser')

class Parser {
  constructor () {
    this.cf = new CloudflareBypasser()
  }

  async getCookie (url) {
    return await this.cf.request(url).then(res => res.headers)
  };

  merge (massive) {
    return massive.reduce(function(acc, item) {
      let obj = { ...item }
      Object.keys(obj).forEach(function(item) {
        if (acc[item]) {
          Object.assign(acc[item], obj[item]);
        } else {
          acc[item] = obj[item];
        }
      })
      return acc;
    }, {})
  }

  async load () {
    const settings = await (await fetch('http://127.0.0.1:3000/settings')).json()
    for (const setting of settings) {
      const { site, domain, origin, urls } = setting
      const result = { site }



      for (const urlsKey of Object.keys(urls)) {
        const { method, url, format, settings, actions } = urls[urlsKey]

        let req = []
        if (method === 'https') {
          req = await fetch(url).then(r => format === 'text' ? r.text() : r.json())
        } else if (method === 'websocket') {
          try {
            const headers = await this.getCookie(origin)
            headers.Origin = origin
            headers['User-Agent'] = useragent.getRandom()
            req = new WebSocket(url, [], { headers })
          } catch (error) {
            console.log(error)
          }
        } else if (method === 'graphql') {
          let { query, variables } = settings
          variables = JSON.parse(variables)
          let { page } = variables
          let start = true
          do {
            await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify({ query, variables })
            }).then(r => r.json())
              .then(data => {
                if (!data.data.loadBotInventory.result.items.length) {
                // if (page === 1) {
                  start = false
                } else {
                  req.push(...data.data.loadBotInventory.result.items)
                  variables.page = page++
                }
              })
          } while (start)
        }

        if (actions) {
          for (const key of Object.keys(actions)) {
            const { action, executor } = actions[key]
            switch (action) {
              case 'replace regexr':
              case 'replace':
                console.log('replace')
                if (action === 'replace regexr') {
                  executor[0] = new RegExp(executor[0], 'g')
                }
                if (req.length && executor.length === 2) {
                  req = req.replace(executor[0], executor[1])
                }
                break

              case 'websocket send':
                console.log('send')
                req.on('open', () => {
                  req.send(executor)
                })
                break

              case 'websocket search': {
                console.log('search')
                const promise = new Promise((resolve, reject) => {
                  req.on('message', (event) => {
                    if (event.search(executor) !== -1) {
                      resolve(event)
                    }
                  })
                })
                req = await promise
                break
              }

              default:
                console.log('No actions found')
                break
            }
          }
          console.log()
          if (typeof req !== 'object') req = JSON.parse(req)
        }
        if (domain === 'cs.money') {
          const keys = Object.keys(req)
          if (urlsKey === 'prices') {
            req = this.merge(keys.map(v => {return {[req[v].m]: req[v].a}}))
          } else if (urlsKey === 'overstock' || urlsKey === 'unavailable') {
            req = keys.map(v => req[v].market_hash_name)
          }
        } else if (domain === 'swapskins.com') {
          const keys = Object.keys(req)
          if (urlsKey === 'prices') {
            req = this.merge(keys.map(v => {return {[req[v].name]: req[v].basePrice}}))
          }
        } else if (domain === 'csgoexo.com') {
          req = req[0];
        }

        result[urlsKey] = JSON.stringify(req)
      }

      await fetch('http://127.0.0.1:3000/prices', {
        method: 'POST',
        body: JSON.stringify(result)
      })
    }

    // return { site, domain, origin, urls, commission }
  }
}

module.exports = Parser
