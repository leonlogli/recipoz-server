/* eslint-disable quotes */
import { apolloClient as _ } from '../_.test'
import { ADD_UTENSIL } from './graph'

const knife = {
  name: { en: 'Knife', fr: 'Couteau' },
  description: {
    en:
      'This is for sure a cook’s best friend and the go-to tool for the daily kitchen tasks',
    fr:
      "C'est à coup sûr le meilleur ami d'un cuisinier et l'outil incontournable pour les tâches quotidiennes de la cuisine"
  },
  image: 'https://cloudinary.com/knife.jpg'
}

const peeler = {
  name: { en: 'Peeler', fr: 'Eplucheur' },
  description: {
    en:
      'Like the mandolin slicer, a vegetable peeler can really speed up your preparation time when you are cooking from scratch',
    fr:
      'Comme la trancheuse à mandoline, un éplucheur à légumes peut vraiment accélérer votre temps de préparation lorsque vous cuisinez à partir de zéro'
  },
  image: 'https://cloudinary.com/Peeler.jpg'
}

const spinner = {
  name: { en: 'Salad Spinner', fr: 'Essoreuse à salade' },
  description: {
    fr:
      "Une essoreuse à salade est tellement utile et importante quand il s'agit d'avoir une salade croustillante. C'est à coup sûr un outil de cuisine polyvalent",
    en:
      'A salad spinner is so useful and important when it comes to having a crispy salad. It is for sure a multi-purpose kitchen tool'
  },
  image: 'https://cloudinary.com/Onion.png'
}

const bowl = {
  name: {
    en: 'Stainless Steel Mixing Bowl',
    fr: 'Bol à mélanger en acier inoxydable'
  },
  description: {
    fr:
      "Ce bol à mélanger peut être utilisé à peu près n'importe quoi et n'absorbe pas les taches et les odeurs car il est en acier inoxydable",
    en:
      'This mixing bowl can be used to do pretty much anything and won’t absorb stains and odors because they are made of stainless steel'
  },
  image: 'https://cloudinary.com/bowl.png'
}

// helpers

const addUtensil = async (utensil: any) => {
  const m: any = await _.mutate(ADD_UTENSIL, { variables: { utensil } })

  return m.data.addUtensil.id
}

const addUtensils = () => {
  return Promise.all([peeler, spinner, knife, bowl].map(i => addUtensil(i)))
}

export { knife, peeler, spinner, bowl, addUtensils, addUtensil }
