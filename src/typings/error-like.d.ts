type ErrorLike = {
  name ?: string
  code ?: number
  title ?: string
  message: string = ''
  position ?: string
  level ?: number
  data ?: unknown
  redirect ?: any
  type ?: string
  muted ?: boolean
  instance ?: unknown
  feCodeError ?: boolean
  [otherProps: string]: any
};

export default ErrorLike;
