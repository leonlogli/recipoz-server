import Joi from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { notificationCodes, allergies, cookingExperiences } from '../models'
import { id, uri } from './common.validation'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const customJoi = Joi.extend(require('joi-phone-number'))

const userRegisterSchemaObject = {
  displayName: Joi.string()
    .min(3)
    .max(100),
  email: Joi.string().email(),
  phoneNumber: customJoi.string().phoneNumber({ format: 'e164' }),
  password: Joi.string()
    .min(6)
    .max(50),
  photoURL: uri
}

const userRegisterSchema = Joi.object({
  ...userRegisterSchemaObject
})
  .with('email', 'password')
  .with('phoneNumber', 'password')
  .or('phoneNumber', 'email')

const notificationSettingsSchema = Joi.object({
  email: Joi.array()
    .items(
      Joi.string()
        .valid(...notificationCodes)
        .required()
    )
    .unique(),
  push: Joi.array()
    .items(
      Joi.string()
        .valid(...notificationCodes)
        .required()
    )
    .unique()
})

const householdSchema = Joi.object({
  adults: Joi.number()
    .integer()
    .positive(),
  children: Joi.number()
    .integer()
    .positive()
})

const mealTimesSchema = Joi.object({
  breakfastTime: Joi.number()
    .integer()
    .min(0)
    .max(23),
  lunchTime: Joi.number()
    .integer()
    .min(0)
    .max(23),
  dinnerTime: Joi.number()
    .integer()
    .min(0)
    .max(23),
  timezoneOffset: Joi.number()
    .integer()
    .min(-12)
    .max(14)
})

const dislikedIngredientsSchema = Joi.array()
  .items(
    Joi.string()
      .min(3)
      .max(80)
  )
  .min(1)
  .max(1000)
  .unique()

const accountSchema = Joi.object({
  id,
  user: Joi.object({
    ...userRegisterSchemaObject,
    emailVerified: Joi.boolean(),
    location: Joi.string()
      .min(3)
      .max(100),
    aboutMe: Joi.string()
      .min(20)
      .max(280),
    coverImage: uri,
    website: uri,
    disabled: Joi.boolean(),
    languages: Joi.array()
      .items(Joi.string().required())
      .unique(),
    theme: Joi.string()
      .min(3)
      .max(50),
    gender: Joi.string().valid('M', 'F', null),
    birthday: Joi.date()
      .min('1-1-1900')
      .max('1-1-2010')
      .iso(),
    facebook: uri,
    pinterest: uri,
    instagram: uri,
    twitter: uri
  }),
  notificationSettings: notificationSettingsSchema,
  allergies: Joi.array()
    .items(Joi.string().valid(...allergies))
    .unique(),
  household: householdSchema,
  mealTimes: mealTimesSchema,
  cookingExperience: Joi.string().valid(...cookingExperiences),
  dislikedIngredients: dislikedIngredientsSchema
})

const validateUserRegister = (data: any) => {
  const { clientMutationId: _, ...user } = data
  const { error, value } = userRegisterSchema.validate(user, {
    abortEarly: false
  })

  checkAndSendValidationErrors(error)

  return value
}

const validateAccount = (data: any, isNew = true) => {
  const { clientMutationId: _, ...account } = data
  const { error, value } = accountSchema.validate(account, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validateUserRegister, validateAccount }
