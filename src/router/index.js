import { createRouter, createWebHashHistory } from 'vue-router'
import useAuthStore from '@/stores/auth'

const routesAuth = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/index.vue'),
    children: [
      {
        path: 'login',
        name: 'auth-login',
        component: () => import('@/views/auth/login.vue'),
        meta: { logout: true },
        props: route => ({
          next: () => router.push(route.query.next || '/home')
        })
      },
      {
        path: 'impersonate',
        name: 'auth-impersonate',
        component: () => import('@/views/auth/impersonate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'logout',
        name: 'auth-logout',
        component: () => import('@/views/auth/logout.vue'),
        meta: { logout: true }
      },
      {
        path: 'expired',
        name: 'auth-expired',
        component: () => import('@/views/auth/expired.vue'),
        meta: { logout: true },
        beforeEnter: (to, from) => replaceQuery(to, 'next', from ? from.fullPath : '/'),
        props: route => ({ next: route.query.next })
      }
    ]
  }
]

const routesConfigurar = [
  {
    path: '/configurar',
    name: 'configurar',
    component: () => import('@/views/configurar/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'configurar-home',
        component: () => import('@/views/configurar/home.vue')
      },
      {
        path: 'grupos',
        name: 'configurar-grupos',
        component: () => import('@/views/configurar/grupos/index.vue'),
        props: route => ({
          grupoId: route.params.grupoId ? parseInt(route.params.grupoId) : null,
          setGrupoId: (id) => id && router.push({
            name: 'configurar-grupo',
            params: { grupoId: id }
          }),
          flows: {
            crear: {
              active: route.query.crear === 'true',
              go: () => router.replace({ query: { crear: 'true' } }),
              back: () => router.replace({ query: { crear: undefined } }),
              forward: (id) => router.push({
                name: 'configurar-grupo',
                params: { grupoId: id }
              })
            }
          }
        }),
        children: [
          {
            path: ':grupoId',
            name: 'configurar-grupo',
            component: () => import('@/views/configurar/grupos/[id]/index.vue'),
            props: route => ({
              grupoId: parseInt(route.params.grupoId),
            }),
            children: [
              {
                path: 'editar',
                name: 'configurar-grupo-editar',
                component: () => import('@/views/configurar/grupos/[id]/editar.vue'),
                props: () => ({
                  back: () => router.push({ name: 'configurar-grupo' })
                })
              },
              {
                path: 'eliminar',
                name: 'configurar-grupo-eliminar',
                component: () => import('@/views/configurar/grupos/[id]/eliminar.vue'),
                props: () => ({
                  forward: () => router.push({ name: 'configurar-grupos' }),
                  back: () => router.push({ name: 'configurar-grupo' }),
                })
              },
              {
                path: 'hijos/crear',
                name: 'configurar-grupo-hijos-crear',
                component: () => import('@/views/configurar/grupos/[id]/hijos/crear.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.grupoId),
                  back: () => router.push({ name: 'configurar-grupo' })
                })
              },
              {
                path: 'hijos/:hijoId/eliminar',
                name: 'configurar-grupo-hijo-eliminar',
                component: () => import('@/views/configurar/grupos/[id]/hijos/[id]/eliminar.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.grupoId),
                  hijoId: parseInt(route.params.hijoId),
                  back: () => router.push({ name: 'configurar-grupo' }),
                })
              },
              {
                path: 'hijos/:hijoId/editar',
                name: 'configurar-grupo-hijo-editar',
                component: () => import('@/views/configurar/grupos/[id]/hijos/[id]/editar.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.grupoId),
                  hijoId: parseInt(route.params.hijoId),
                  back: () => router.push({ name: 'configurar-grupo' }),
                })
              },
              {
                path: 'suscriptores/crear',
                name: 'configurar-grupo-suscriptores-crear',
                component: () => import('@/views/configurar/grupos/[id]/suscriptores/crear.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.grupoId),
                  back: () => router.push({ name: 'configurar-grupo' })
                })
              },
              {
                path: 'suscriptores/:suscriptorId/editar',
                name: 'configurar-grupo-suscriptor-editar',
                component: () => import('@/views/configurar/grupos/[id]/suscriptores/[id]/editar.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.grupoId),
                  suscriptorId: parseInt(route.params.suscriptorId),
                  back: () => router.push({ name: 'configurar-grupo' })
                })
              },
              {
                path: 'suscriptores/:suscriptorId/eliminar',
                name: 'configurar-grupo-suscriptor-eliminar',
                component: () => import('@/views/configurar/grupos/[id]/suscriptores/[id]/eliminar.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.grupoId),
                  suscriptorId: parseInt(route.params.suscriptorId),
                  back: () => router.push({ name: 'configurar-grupo' }),
                })
              },
              {
                path: 'notifica/seleccionar',
                name: 'configurar-grupo-notifica-seleccionar',
                component: () => import('@/views/configurar/grupos/[id]/notifica/seleccionar.vue'),
                props: () => ({
                  back: () => router.push({ name: 'configurar-grupo' }),
                })
              }
            ]
          },
        ]
      },
      {
        path: 'suscriptores',
        name: 'configurar-suscriptores',
        component: () => import('@/views/configurar/suscriptores/index.vue'),
        props: route => ({
          id: route.params.id ? parseInt(route.params.id) : null,
          setId: id => router.push({ name: 'configurar-suscriptor', params: { id } }),
          compose: {
            new: route.query.compose === 'new',
            back: () => router.replace({
              query: {
                compose: undefined,
              }
            })
          }
        }),
        children: [
          {
            path: ':id',
            name: 'configurar-suscriptor',
            redirect: { name: 'configurar-suscriptor-data' },
            component: () => import('@/views/configurar/suscriptores/Suscriptor.vue'),
            props: route => ({
              id: parseInt(route.params.id),
            }),
            children: [
              {
                path: '',
                name: 'configurar-suscriptor-data',
                component: () => import('@/views/configurar/suscriptores/SuscriptorData.vue'),
                children: [
                  {
                    path: 'edit',
                    name: 'configurar-suscriptor-edit',
                    component: () => import('@/views/configurar/suscriptores/SuscriptorEdit.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-suscriptor' })
                    })
                  },
                  {
                    path: 'del',
                    name: 'configurar-suscriptor-del',
                    component: () => import('@/views/configurar/suscriptores/SuscriptorDel.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-suscriptores' }),
                      cancel: () => router.push({ name: 'configurar-suscriptor' }),
                    })
                  },
                ]
              },
            ]
          },
        ]
      },
      {
        path: 'users',
        name: 'configurar-users',
        component: () => import('@/views/configurar/user/Users.vue'),
        props: route => ({
          id: route.params.id ? parseInt(route.params.id) : null,
          setId: id => router.push({ name: 'configurar-user', params: { id } }),
          compose: {
            new: route.query.compose === 'new',
            back: () => router.replace({
              query: {
                compose: undefined,
              }
            })
          }
        }),
        children: [
          {
            path: ':id',
            name: 'configurar-user',
            redirect: { name: 'configurar-user-data' },
            component: () => import('@/views/configurar/user/User.vue'),
            props: route => ({ id: parseInt(route.params.id) }),
            children: [
              {
                path: '',
                name: 'configurar-user-data',
                component: () => import('@/views/configurar/user/UserData.vue'),
                children: [
                  {
                    path: 'edit',
                    name: 'configurar-user-edit',
                    component: () => import('@/views/configurar/user/UserEdit.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-user' })
                    })
                  },
                  {
                    path: 'membership',
                    name: 'configurar-user-membership',
                    component: () => import('@/views/configurar/user/UserMembership.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-user' }),
                    })
                  },
                  {
                    path: 'del',
                    name: 'configurar-user-del',
                    component: () => import('@/views/configurar/user/UserDel.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-users' }),
                      cancel: () => router.push({ name: 'configurar-user' }),
                    })
                  }
                ]
              },
            ]
          }
        ]
      },
      {
        path: 'plantillas',
        name: 'configurar-plantillas',
        component: () => import('@/views/configurar/plantilla/Plantillas.vue'),
        props: route => ({
          // id: route.params.id ? parseInt(route.params.id) : null,
          // setId: id => router.push({ name: 'configurar-plantilla', params: { id } }),
          compose: {
            new: route.query.compose === 'new',
            back: () => router.replace({
              query: {
                compose: undefined,
              }
            })
          }
        }),
        children: [
          {
            path: ':id/edit',
            name: 'configurar-plantilla-edit',
            component: () => import('@/views/configurar/plantilla/PlantillaEdit.vue'),
            props: route => ({
              id: route.params.id ? parseInt(route.params.id) : null,
              back: () => router.push({ name: 'configurar-plantillas' })
            })
          },
          {
            path: ':id/del',
            name: 'configurar-plantilla-del',
            component: () => import('@/views/configurar/plantilla/PlantillaDel.vue'),
            props: route => ({
              id: route.params.id ? parseInt(route.params.id) : null,
              back: () => router.push({ name: 'configurar-plantillas' }),
            })
          }
        ]
      },
    ]
  }
]

const routesSms = [
  {
    path: '/sms',
    name: 'sms',
    component: () => import('@/views/sms/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'sms-home',
        component: () => import('@/views/sms/home.vue')
      },
      {
        path: 'componer',
        name: 'sms-componer',
        component: () => import('@/views/sms/componer/index.vue'),
        props: route => ({
          previo: {
            id: route.query.previo ? parseInt(route.query.previo) : null,
            back: () => router.replace({ query: { previo: undefined } })
          }
        }),
        children: [
          {
            path: 'origen',
            name: 'sms-componer-origen',
            component: () => import('@/views/sms/componer/origen.vue'),
            props: () => ({
              back: () => router.push({ name: 'sms-componer' })
            })
          },
          {
            path: 'notificados',
            name: 'sms-componer-notificados',
            component: () => import('@/views/sms/componer/notificados.vue'),
            props: () => ({
              back: () => router.push({ name: 'sms-componer' })
            })
          },
          {
            path: 'suscriptores',
            name: 'sms-componer-suscriptores',
            component: () => import('@/views/sms/componer/suscriptores.vue'),
            props: () => ({
              back: () => router.push({ name: 'sms-componer' })
            })
          }
        ]
      },
      {
        path: 'coleccion',
        name: 'sms-coleccion',
        component: () => import('@/views/sms/coleccion.vue')
      }
    ]
  }
]

const routesApp = [
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/app/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'app-home',
        component: () => import('@/views/app/home.vue')
      }
    ]
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...routesAuth,
    ...routesConfigurar,
    ...routesSms,
    ...routesApp,
    {
      path: '/home',
      name: 'home',
      alias: ['/'],
      redirect: '/index' // landing page
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/not_found.vue')
    }
  ]
})

router.afterEach((to) => {
  const auth = useAuthStore()
  if (to.matched.some((record) => record.meta.logout)) auth.auth && auth.logout()
})

router.beforeEach(async (to, from) => {
  const auth = useAuthStore()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (auth.auth === null) // browser navigation (initial state)
      await auth.getAuthUser()
    if (!auth.auth) return { name: 'auth-login', query: { next: to.fullPath } }
  }
})

const replaceQuery = (to, query, value) => {
  if (!to.query[query]) return { path: to.path, query: { ...to.query, [query]: value } }
}
