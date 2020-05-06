import { gql } from 'apollo-server-express'

export default gql`
  input NotificationSettingsInput {
    email: [NotificationCode!]
    push: [NotificationCode!]
  }

  input HouseholdInput {
    adults: PositiveInt
    children: PositiveInt
  }

  input MealTimesInput {
    breakfastTime: PositiveInt
    lunchTime: PositiveInt
    dinnerTime: PositiveInt
    timezoneOffset: Int
  }

  input AddAccountInput {
    "Firebase existing user idToken"
    idToken: String!
    clientMutationId: String
  }

  input UpdateAccountInput {
    user: UserInput
    notificationSettings: NotificationSettingsInput
    allergies: [Allergy!]
    dislikedIngredients: [String!]
    cookingExperience: CookingExperience
    household: HouseholdInput
    mealTimes: MealTimesInput
    clientMutationId: String
  }

  input DeleteAccountInput {
    """
    ID of the account to delete. Reserved only for admin.
    So do not specify it if a user want to delete its owns account
    """
    id: ID
    clientMutationId: String
  }

  input AddRegistrationTokenInput {
    registrationToken: String!
    clientMutationId: String
  }

  input RegisterInput {
    email: String
    password: String
    phoneNumber: String
    displayName: String
    clientMutationId: String
  }
`
