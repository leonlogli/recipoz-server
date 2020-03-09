import Joi from '@hapi/joi'

import { errorMessages } from '../constants'
import { checkAndSendValidationErrors } from '../utils'
import { notificationTypes, notificationCodes } from '../models'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const customJoi = Joi.extend(require('joi-phone-number'))

const userSchemaObject = {
  displayName: Joi.string()
    .min(3)
    .max(100),
  email: Joi.string().email(),
  phoneNumber: customJoi.string().phoneNumber({ format: 'e164' }),
  password: Joi.string()
    .min(6)
    .max(50),
  photoURL: Joi.string().uri(),
  emailVerified: Joi.boolean()
}

const userSchema = Joi.object({
  ...userSchemaObject
})
  .with('email', 'password')
  .with('phoneNumber', 'password')
  .or('phoneNumber', 'email')

const notificationSettingSchema = Joi.object({
  type: Joi.string().valid(...notificationTypes),
  code: Joi.array()
    .items(
      Joi.string()
        .valid(...notificationCodes)
        .required()
    )
    .unique()
})

const accountSchema = Joi.object({
  user: Joi.object({
    ...userSchemaObject,
    location: Joi.string()
      .min(3)
      .max(100),
    aboutMe: Joi.string()
      .min(20)
      .max(280),
    coverImage: Joi.string().uri(),
    website: Joi.string().uri(),
    disabled: Joi.boolean(),
    languages: Joi.array()
      .items(Joi.string().required())
      .unique(),
    theme: Joi.string()
      .min(3)
      .max(50),
    gender: Joi.string().valid('M', 'F'),
    birthday: Joi.date()
      .min('1-1-1900')
      .max('1-1-2010')
      .iso(),
    facebook: Joi.string().uri(),
    pinterest: Joi.string().uri(),
    twitter: Joi.string().uri()
  }),
  settings: Joi.object({
    notifications: Joi.array()
      .items(notificationSettingSchema)
      .unique()
  })
})

const validateUser = (user: any) => {
  const { error, value } = userSchema.validate(user, { abortEarly: false })

  checkAndSendValidationErrors(error, errorMessages.account.invalid)

  return value
}

const validateAccount = (account: any) => {
  const { error, value } = accountSchema.validate(account, {
    abortEarly: false
  })

  checkAndSendValidationErrors(error, errorMessages.account.invalid)

  return value
}

export { validateUser, validateAccount }
