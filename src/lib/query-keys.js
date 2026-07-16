export const queryKeys = {
  grupos: {
    root: ['grupos'],
    listas: () => [...queryKeys.grupos.root, 'lista'],
    lista: (filtros) => [...queryKeys.grupos.listas(), { ...filtros }],
    listaNotificables: () => [...queryKeys.grupos.listas(), 'notificables'],
    listaOrigenes: () => [...queryKeys.grupos.listas(), 'origenes'],
    detalles: () => [...queryKeys.grupos.root, 'detalle'],
    detalle: (id) => [...queryKeys.grupos.detalles(), id],
    detalleExpandido: (id) => [...queryKeys.grupos.detalle(id), 'expandido'],
    // miembros: (grupoId) => [...queryKeys.grupos.detalle(grupoId), 'miembros'],
  },
  notificados: {
    root: ['notificados'],
    listas: () => [...queryKeys.notificados.root, 'lista'],
    lista: (filtros) => [...queryKeys.notificados.listas(), { ...filtros }],
    detalles: () => [...queryKeys.notificados.root, 'detalle'],
    detalle: (id) => [...queryKeys.notificados.detalles(), id],
  },
  suscriptores: {
    root: ['suscriptores'],
    listas: () => [...queryKeys.suscriptores.root, 'lista'],
    lista: (filtros) => [...queryKeys.suscriptores.listas(), { ...filtros }],
    detalles: () => [...queryKeys.suscriptores.root, 'detalle'],
    detalle: (id) => [...queryKeys.suscriptores.detalles(), id],
  },
  plantillas: {
    root: ['plantillas'],
    listas: () => [...queryKeys.plantillas.root, 'lista'],
    lista: (filtros) => [...queryKeys.plantillas.listas(), { ...filtros }],
    detalles: () => [...queryKeys.plantillas.root, 'detalle'],
    detalle: (id) => [...queryKeys.plantillas.detalles(), id],
  },
}