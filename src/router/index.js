import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthQuery, useLogout } from '@/stores/auth'
import { until } from '@vueuse/core'

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
        props: route => ({
          next: () => router.push(route.query.next)
        })
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
          setGrupoId: (grupoId) => grupoId && router.push({
            name: 'configurar-grupo',
            params: { grupoId }
          }),
          flows: {
            crear: {
              active: route.query.crear === 'true',
              go: () => router.replace({ query: { crear: 'true' } }),
              back: () => router.replace({ query: { crear: undefined } }),
              forward: (grupoId) => router.push({
                name: 'configurar-grupo',
                params: { grupoId }
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
                props: (route) => ({
                  grupoId: parseInt(route.params.grupoId),
                  back: () => router.push({ name: 'configurar-grupo' })
                })
              },
              {
                path: 'eliminar',
                name: 'configurar-grupo-eliminar',
                component: () => import('@/views/configurar/grupos/[id]/eliminar.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.grupoId),
                  forward: () => router.push({ name: 'configurar-grupos' }),
                  back: () => router.push({ name: 'configurar-grupo' }),
                })
              },
              {
                path: 'hijos/crear',
                name: 'configurar-grupo-hijos-crear',
                component: () => import('@/views/configurar/grupos/[id]/hijos/crear.vue'),
                props: route => ({
                  padreId: parseInt(route.params.grupoId),
                  back: () => router.push({ name: 'configurar-grupo' })
                })
              },
              {
                path: 'hijos/:hijoId/eliminar',
                name: 'configurar-grupo-hijo-eliminar',
                component: () => import('@/views/configurar/grupos/[id]/hijos/[id]/eliminar.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.hijoId),
                  back: () => router.push({ name: 'configurar-grupo' }),
                })
              },
              {
                path: 'hijos/:hijoId/editar',
                name: 'configurar-grupo-hijo-editar',
                component: () => import('@/views/configurar/grupos/[id]/hijos/[id]/editar.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.hijoId),
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
                  suscriptorId: parseInt(route.params.suscriptorId),
                  back: () => router.push({ name: 'configurar-grupo' })
                })
              },
              {
                path: 'suscriptores/:suscriptorId/eliminar',
                name: 'configurar-grupo-suscriptor-eliminar',
                component: () => import('@/views/configurar/grupos/[id]/suscriptores/[id]/eliminar.vue'),
                props: route => ({
                  suscriptorId: parseInt(route.params.suscriptorId),
                  back: () => router.push({ name: 'configurar-grupo' }),
                })
              },
              {
                path: 'notificados/editar',
                name: 'configurar-grupo-notificados-editar',
                component: () => import('@/views/configurar/grupos/[id]/notificados/editar.vue'),
                props: route => ({
                  grupoId: parseInt(route.params.grupoId),
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
          suscriptorId: route.params.suscriptorId ? parseInt(route.params.suscriptorId) : null,
          setSuscriptorId: (suscriptorId) => suscriptorId && router.push({
            name: 'configurar-suscriptor',
            params: { suscriptorId }
          }),
          flows: {
            crear: {
              active: route.query.crear === 'true',
              go: () => router.replace({ query: { crear: 'true' } }),
              back: () => router.replace({ query: { crear: undefined } }),
              forward: (suscriptorId) => router.push({
                name: 'configurar-suscriptor',
                params: { suscriptorId }
              })
            }
          }
        }),
        children: [
          {
            path: ':suscriptorId',
            name: 'configurar-suscriptor',
            component: () => import('@/views/configurar/suscriptores/[id]/index.vue'),
            props: route => ({
              suscriptorId: parseInt(route.params.suscriptorId),
            }),
            children: [
              {
                path: 'editar',
                name: 'configurar-suscriptor-editar',
                component: () => import('@/views/configurar/suscriptores/[id]/editar.vue'),
                props: (route) => ({
                  suscriptorId: parseInt(route.params.suscriptorId),
                  back: () => router.push({ name: 'configurar-suscriptor' })
                })
              },
              {
                path: 'eliminar',
                name: 'configurar-suscriptor-eliminar',
                component: () => import('@/views/configurar/suscriptores/[id]/eliminar.vue'),
                props: route => ({
                  suscriptorId: parseInt(route.params.suscriptorId),
                  forward: () => router.push({ name: 'configurar-suscriptores' }),
                  back: () => router.push({ name: 'configurar-suscriptor' }),
                })
              },
            ]
          },
        ]
      },
      {
        path: 'usuarios',
        name: 'configurar-usuarios',
        component: () => import('@/views/configurar/usuarios/index.vue'),
        props: route => ({
          usuarioId: route.params.usuarioId ? parseInt(route.params.usuarioId) : null,
          setUsuarioId: (usuarioId) => usuarioId && router.push({
            name: 'configurar-usuario',
            params: { usuarioId }
          }),
          flows: {
            crear: {
              active: route.query.crear === 'true',
              go: () => router.replace({ query: { crear: 'true' } }),
              back: () => router.replace({ query: { crear: undefined } }),
              forward: (usuarioId) => router.push({
                name: 'configurar-usuario',
                params: { usuarioId }
              })
            }
          }
        }),
        children: [
          {
            path: ':usuarioId',
            name: 'configurar-usuario',
            component: () => import('@/views/configurar/usuarios/[id]/index.vue'),
            props: route => ({
              usuarioId: parseInt(route.params.usuarioId),
            }),
            children: [
              {
                path: 'editar',
                name: 'configurar-usuario-editar',
                component: () => import('@/views/configurar/usuarios/[id]/editar.vue'),
                props: (route) => ({
                  usuarioId: parseInt(route.params.usuarioId),
                  back: () => router.push({ name: 'configurar-usuario' })
                })
              },
              {
                path: 'eliminar',
                name: 'configurar-usuario-eliminar',
                component: () => import('@/views/configurar/usuarios/[id]/eliminar.vue'),
                props: route => ({
                  usuarioId: parseInt(route.params.usuarioId),
                  forward: () => router.push({ name: 'configurar-usuarios' }),
                  back: () => router.push({ name: 'configurar-usuario' }),
                })
              },
              {
                path: 'roles/editar',
                name: 'configurar-usuario-grupos-editar',
                component: () => import('@/views/configurar/usuarios/[id]/grupos/editar.vue'),
                props: route => ({
                  usuarioId: parseInt(route.params.usuarioId),
                  back: () => router.push({ name: 'configurar-usuario' }),
                })
              },
            ]
          }
        ]
      },
      {
        path: 'plantillas',
        name: 'configurar-plantillas',
        component: () => import('@/views/configurar/plantillas/index.vue'),
        props: route => ({
          flows: {
            crear: {
              active: route.query.crear === 'true',
              go: () => router.replace({ query: { crear: 'true' } }),
              back: () => router.replace({ query: { crear: undefined } })
            }
          }
        }),
        children: [
          {
            path: ':plantillaId',
            name: 'configurar-plantilla',
            component: () => import('@/views/configurar/plantillas/[id]/index.vue'),
            props: (route) => ({
              plantillaId: parseInt(route.params.plantillaId),
            }),
            children: [
              {
                path: 'editar',
                name: 'configurar-plantilla-editar',
                component: () => import('@/views/configurar/plantillas/[id]/editar.vue'),
                props: (route) => ({
                  plantillaId: parseInt(route.params.plantillaId),
                  back: () => router.push({ name: 'configurar-plantillas' })
                })
              },
              {
                path: 'eliminar',
                name: 'configurar-plantilla-eliminar',
                component: () => import('@/views/configurar/plantillas/[id]/eliminar.vue'),
                props: route => ({
                  plantillaId: parseInt(route.params.plantillaId),
                  back: () => router.push({ name: 'configurar-plantillas' }),
                })
              },
            ],
          }
        ]
      },
    ]
  }
]

const routesMensajes = [
  {
    path: '/sms',
    name: 'sms',
    component: () => import('@/views/mensaje/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'sms-home',
        component: () => import('@/views/mensaje/home.vue')
      },
      {
        path: 'continuar/:mensajePrevioId',
        name: 'sms-continuar',
        component: () => import('@/views/mensaje/continuar/index.vue'),
        props: (route) => ({
          mensajePrevioId: parseInt(route.params.mensajePrevioId),
          componer: () => router.push({ name: 'sms-componer' })
        }),
      },
      {
        path: 'componer',
        name: 'sms-componer',
        component: () => import('@/views/mensaje/componer/index.vue'),
        children: [
          {
            path: 'origenes',
            name: 'sms-componer-origenes',
            component: () => import('@/views/mensaje/componer/origenes.vue'),
            props: () => ({
              back: () => router.push({ name: 'sms-componer' })
            })
          }
        ]
      },
      {
        path: 'coleccion',
        name: 'sms-coleccion',
        component: () => import('@/views/mensaje/coleccion.vue')
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
    ...routesMensajes,
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
  const { authUser } = useAuthQuery()
  const { mutate: logout } = useLogout()
  if (to.matched.some((record) => record.meta.logout) && authUser.value)
    logout()
})

router.beforeEach(async (to, from) => {
  const { authUser, isPending } = useAuthQuery()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    await until(isPending).toBe(false) // browser initial navigation
    if (!authUser.value) return { name: 'auth-login', query: { next: to.fullPath } }
  }
})

const replaceQuery = (to, query, value) => {
  if (!to.query[query]) return { path: to.path, query: { ...to.query, [query]: value } }
}
