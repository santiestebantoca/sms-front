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
          id: route.params.id ? parseInt(route.params.id) : null,
          setId: id => id && router.push({ name: 'configurar-grupo', params: { id } }),
          crear: () => router.replace({ query: { crear: 'true' } }),
          flows: {
            crear: route.query.crear === 'true',
            back: () => router.replace({ query: { crear: undefined } }),
            forward: id => router.push({ name: 'configurar-grupo', params: { id } })
          }
        }),
        children: [
          {
            path: ':id',
            name: 'configurar-grupo',
            redirect: { name: 'configurar-grupo-detalles' },
            component: () => import('@/views/configurar/grupos/[id]/index.vue'),
            props: route => ({
              id: parseInt(route.params.id),
            }),
            children: [
              {
                path: '',
                name: 'configurar-grupo-detalles',
                component: () => import('@/views/configurar/grupos/[id]/detalles/index.vue'),
                children: [
                  {
                    path: 'editar',
                    name: 'configurar-grupo-detalles-editar',
                    component: () => import('@/views/configurar/grupos/[id]/detalles/editar.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-grupo' })
                    })
                  },
                  {
                    path: 'eliminar',
                    name: 'configurar-grupo-detalles-eliminar',
                    component: () => import('@/views/configurar/grupos/[id]/detalles/eliminar.vue'),
                    props: () => ({
                      forward: () => router.push({ name: 'configurar-grupos' }),
                      back: () => router.push({ name: 'configurar-grupo' }),
                    })
                  },
                  {
                    path: 'hijos/crear',
                    name: 'configurar-grupo-detalles-hijos-crear',
                    component: () => import('@/views/configurar/grupos/[id]/detalles/hijos/crear.vue'),
                    props: route => ({
                      pertenece: parseInt(route.params.id),
                      back: () => router.push({ name: 'configurar-grupo' })
                    })
                  },
                  {
                    path: 'hijos/:hijo?/eliminar',
                    name: 'configurar-grupo-detalles-hijo-eliminar',
                    component: () => import('@/views/configurar/grupos/[id]/detalles/hijos/[id]/eliminar.vue'),
                    props: route => ({
                      id: parseInt(route.params.hijo),
                      back: () => router.push({ name: 'configurar-grupo' }),
                    })
                  },
                  {
                    path: 'hijos/:hijo?/editar',
                    name: 'configurar-grupo-detalles-hijo-editar',
                    component: () => import('@/views/configurar/grupos/[id]/detalles/hijos/[id]/editar.vue'),
                    props: route => ({
                      id: parseInt(route.params.hijo),
                      back: () => router.push({ name: 'configurar-grupo' }),
                    })
                  },
                  {
                    path: 'suscriptores/crear',
                    name: 'configurar-grupo-detalles-suscriptores-crear',
                    component: () => import('@/views/configurar/grupos/[id]/detalles/suscriptores/crear.vue'),
                    props: route => ({
                      grupo: parseInt(route.params.id),
                      back: () => router.push({ name: 'configurar-grupo' })
                    })
                  },
                  {
                    path: 'suscriptor/:suscriptor?/editar',
                    name: 'configurar-grupo-detalles-suscriptor-editar',
                    component: () => import('@/views/configurar/grupos/[id]/detalles/suscriptores/[id]/editar.vue'),
                    props: route => ({
                      id: parseInt(route.params.suscriptor),
                      back: () => router.push({ name: 'configurar-grupo' })
                    })
                  },
                  {
                    path: 'suscriptor/:suscriptor?/eliminar',
                    name: 'configurar-grupo-detalles-suscriptor-eliminar',
                    component: () => import('@/views/configurar/grupos/[id]/detalles/suscriptores/[id]/eliminar.vue'),
                    props: route => ({
                      id: parseInt(route.params.suscriptor),
                      back: () => router.push({ name: 'configurar-grupo' }),
                    })
                  },
                  {
                    path: 'notifica/seleccionar',
                    name: 'configurar-grupo-detalles-notifica-seleccionar',
                    component: () => import('@/views/configurar/grupos/[id]/detalles/notifica/seleccionar.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-grupo' }),
                    })
                  }
                ]
              },
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
