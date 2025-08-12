import { hashSync, genSaltSync, compareSync } from 'bcryptjs'

export const hashPassword = (password: string): string => hashSync(password, genSaltSync())

export const verifyPassword = (password: string, hash: string): boolean => compareSync(password, hash)
