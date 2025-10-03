import { createRouter, createWebHashHistory } from 'vue-router'
import useAuthStore from '@/stores/auth'

const routesAuth = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/AuthIndex.vue'),
    children: [
      {
        path: 'login',
        name: 'auth-login',
        component: () => import('@/views/auth/login/AuthLogin.vue'),
        meta: { logout: true },
        props: route => ({
          next: () => router.push(route.query.next || '/home')
        })
      },
      {
        path: 'impersonate',
        name: 'auth-impersonate',
        component: () => import('@/views/auth/impersonate/AuthImpersonate.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'logout',
        name: 'auth-logout',
        component: () => import('@/views/auth/logout/AuthLogout.vue'),
        meta: { logout: true }
      },
      {
        path: 'expired',
        name: 'auth-expired',
        component: () => import('@/views/auth/expired/AuthExpired.vue'),
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
    component: () => import('@/views/configurar/ConfigurarIndex.vue'),
    meta: { requiresAuth: true },
    props: route => ({
      tab: route.matched.some(record => record.name === 'configurar-grupos')
        ? 'grupos'
        : route.matched.some(record => record.name === 'configurar-suscriptores')
          ? 'suscriptores'
          : route.matched.some(record => record.name === 'configurar-users')
            ? 'users'
            : ''
    }),
    children: [
      {
        path: '',
        name: 'configurar-home',
        component: () => import('@/views/configurar/home/ConfigurarHome.vue')
      },
      {
        path: 'grupos',
        name: 'configurar-grupos',
        component: () => import('@/views/configurar/grupo/Grupos.vue'),
        props: route => ({
          id: route.params.id ? parseInt(route.params.id) : null,
          setId: id => router.push({ name: 'configurar-grupo', params: { id } }),
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
            name: 'configurar-grupo',
            redirect: { name: 'configurar-grupo-data' },
            component: () => import('@/views/configurar/grupo/Grupo.vue'),
            props: route => ({
              id: parseInt(route.params.id),
            }),
            children: [
              {
                path: '',
                name: 'configurar-grupo-data',
                component: () => import('@/views/configurar/grupo/GrupoData.vue'),
                children: [
                  {
                    path: 'edit',
                    name: 'configurar-grupo-edit',
                    component: () => import('@/views/configurar/grupo/GrupoEdit.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-grupo' })
                    })
                  },
                  {
                    path: 'del',
                    name: 'configurar-grupo-del',
                    component: () => import('@/views/configurar/grupo/GrupoDel.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-grupos' }),
                      cancel: () => router.push({ name: 'configurar-grupo' }),
                    })
                  },
                  {
                    path: 'children/new',
                    name: 'configurar-grupo-children-new',
                    component: () => import('@/views/configurar/grupo/GruposNew.vue'),
                    props: route => ({
                      pertenece: parseInt(route.params.id),
                      back: () => router.push({ name: 'configurar-grupo' })
                    })
                  },
                  {
                    // Like `configurar-grupo-del` but with a background `grupo`
                    path: 'children/:child?/del',
                    name: 'configurar-grupo-child-del',
                    component: () => import('@/views/configurar/grupo/ChildDel.vue'),
                    props: route => ({
                      id: parseInt(route.params.child),
                      back: () => router.push({ name: 'configurar-grupo' }),
                    })
                  },
                  {
                    // Like `configurar-grupo-edit` but with a background `grupo`
                    path: 'children/:child?/edit',
                    name: 'configurar-grupo-child-edit',
                    component: () => import('@/views/configurar/grupo/ChildEdit.vue'),
                    props: route => ({
                      id: parseInt(route.params.child),
                      back: () => router.push({ name: 'configurar-grupo' }),
                    })
                  },
                  {
                    path: 'suscriptores/new',
                    name: 'configurar-grupo-suscriptores-new',
                    component: () => import('@/views/configurar/grupo/SuscriptoresNew.vue'),
                    props: route => ({
                      grupo: parseInt(route.params.id),
                      back: () => router.push({ name: 'configurar-grupo' })
                    })
                  },
                  {
                    path: 'suscriptor/:suscriptor?/edit',
                    name: 'configurar-grupo-suscriptor-edit',
                    component: () => import('@/views/configurar/grupo/SuscriptorEdit.vue'),
                    props: route => ({
                      id: parseInt(route.params.suscriptor),
                      back: () => router.push({ name: 'configurar-grupo' })
                    })
                  },
                  {
                    path: 'suscriptor/:suscriptor?/del',
                    name: 'configurar-grupo-suscriptor-del',
                    component: () => import('@/views/configurar/grupo/SuscriptorDel.vue'),
                    props: route => ({
                      id: parseInt(route.params.suscriptor),
                      back: () => router.push({ name: 'configurar-grupo' }),
                    })
                  },
                  {
                    path: 'notifica/sel',
                    name: 'configurar-grupo-notifica-sel',
                    component: () => import('@/views/configurar/grupo/NotificaSel.vue'),
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
        component: () => import('@/views/configurar/suscriptor/Suscriptores.vue'),
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
            component: () => import('@/views/configurar/suscriptor/Suscriptor.vue'),
            props: route => ({
              id: parseInt(route.params.id),
            }),
            children: [
              {
                path: '',
                name: 'configurar-suscriptor-data',
                component: () => import('@/views/configurar/suscriptor/SuscriptorData.vue'),
                children: [
                  {
                    path: 'edit',
                    name: 'configurar-suscriptor-edit',
                    component: () => import('@/views/configurar/suscriptor/SuscriptorEdit.vue'),
                    props: () => ({
                      back: () => router.push({ name: 'configurar-suscriptor' })
                    })
                  },
                  {
                    path: 'del',
                    name: 'configurar-suscriptor-del',
                    component: () => import('@/views/configurar/suscriptor/SuscriptorDel.vue'),
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
    component: () => import('@/views/sms/SmsIndex.vue'),
    meta: { requiresAuth: true },
    props: route => ({
      tab: route.matched.some(record => record.name === 'sms-componer')
        ? 'componer'
        : route.matched.some(record => record.name === 'sms-coleccion')
          ? 'coleccion'
          : ''
    }),
    children: [
      {
        path: '',
        name: 'sms-home',
        component: () => import('@/views/sms/home/SmsHome.vue')
      },
      {
        path: 'componer',
        name: 'sms-componer',
        component: () => import('@/views/sms/componer/Componer.vue'),
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
            component: () => import('@/views/sms/componer/ComponerOrigen.vue'),
            props: () => ({
              back: () => router.push({ name: 'sms-componer' })
            })
          },
          {
            path: 'notificados',
            name: 'sms-componer-notificados',
            component: () => import('@/views/sms/componer/ComponerNotificados.vue'),
            props: () => ({
              back: () => router.push({ name: 'sms-componer' })
            })
          },
          {
            path: 'suscriptores',
            name: 'sms-componer-suscriptores',
            component: () => import('@/views/sms/componer/ComponerSuscriptores.vue'),
            props: () => ({
              back: () => router.push({ name: 'sms-componer' })
            })
          },
          {
            path: 'previos',
            name: 'sms-componer-previos',
            component: () => import('@/views/sms/componer/ComponerPrevios.vue'),
            props: () => ({
              back: () => router.push({ name: 'sms-componer' })
            })
          }
        ]
      },
      {
        path: 'coleccion',
        name: 'sms-coleccion',
        component: () => import('@/views/sms/coleccion/Coleccion.vue')
      }
    ]
  }
]

const routesApp = [
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/app/AppIndex.vue'),
    meta: { requiresAuth: true }
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
      component: () => import('@/views/NotFound.vue')
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
