// Auth grupos
export interface AuthGroup {
  id: number | string
  role: string
  description: string | null
}

// Usuarios
export interface UsuarioDetalle {
  id: number | string
  first_name: string
  last_name: string
  username: string
  registration_key: string | null
  grupos: AuthGroup[]
  modified_by: string | null
  modified_on: string | null
}

export interface UsuarioCreate {
  first_name: string
  last_name: string
  username: string
  grupos: (number | string)[]
}

export interface UsuarioUpdate extends UsuarioCreate {
  id: number | string
  registration_key?: string
}

// Grupos
export interface GrupoCreate {
  nombre: string
  apodo?: string
  label?: string
  descripcion?: string
  pertenece?: number | string
}

export interface GrupoUpdate extends GrupoCreate {
  id: number | string
}

// Mensajes
export interface MensajePayload {
  destinatarios: (number | string)[]
  texto: string
  continua: boolean
  previo?: number | string
}

// Plantillas
export interface PlantillaCreate {
  texto: string
}

export interface PlantillaUpdate extends PlantillaCreate {
  id: number | string
}

// Suscriptores
export interface SuscriptorCreate {
  nombre: string
  cargo?: string
  telefono?: string
  correo?: string
  grupo?: number | string
  activo?: boolean
  suplente?: number | string
}

export interface SuscriptorUpdate extends Partial<SuscriptorCreate> {
  id: number | string
}

// Notificados
export interface NotificadosUpdate {
  id: number | string
  grupo_b?: (number | string)[]
}

// Autenticación
export interface LoginCredentials {
  username: string
  password: string
}