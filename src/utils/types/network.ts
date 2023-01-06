export interface ResponseSuccess<T> {
    data?: T | null
    message?: string
    Message?: string
    Data?: T | null
    Rows?: number
  }
  
  export interface ResponseFail {
    error?: Error | string
  }
  
  export interface NetworkResponse<T> extends ResponseSuccess<T>, ResponseFail {}
  
  export interface WithSearchRequest {
    search?: any
    page?: number
    limit?: number
    FilterIsActive?: boolean
    FilterIsMain?: boolean
  }
  
  export type AuthorizationType = string
  
  export interface IAuthHeader {
    Token: AuthorizationType
    // refresh_token?: AuthorizationType
  }
  
  export type TokenResponse = {
    Token: string
    // refresh_token: string
  }
  