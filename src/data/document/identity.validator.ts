import * as Joi from 'joi'
import { DocumentType } from './identity.schema'

export const IdentityValidator = Joi.object({
  type: Joi.string().required().valid(...Object.values(DocumentType)),
  documentNumber: Joi.string()
})