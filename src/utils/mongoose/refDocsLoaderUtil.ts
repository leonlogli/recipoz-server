import {
  AccountDocument,
  CommentReactionDocument,
  FollowershipDocument,
  RecipeDocument,
  SavedRecipeDocument
} from '../../models'
import { DataLoaders, getDataLoaderByModel } from '../dataLoadersHelper'
import { Page } from './pagination'

const loadRecipesFromSavedRecipes = (
  accountRecipes: Page<SavedRecipeDocument>,
  dataLoaders: DataLoaders
): Page<RecipeDocument> => {
  const { recipeLoader, savedRecipeCountLoader } = dataLoaders
  const { nodes, edges, query, totalCount: count } = accountRecipes

  const recipesNodes = nodes.map(node => recipeLoader.load(node.recipe as any))
  const recipesEdges = edges.map(edge => ({ ...edge, node: recipesNodes }))

  return {
    ...accountRecipes,
    edges: recipesEdges as any,
    nodes: recipesNodes as any,
    totalCount: count || (savedRecipeCountLoader.load(query.criteria) as any)
  }
}

const loadAccountsFromSavedRecipes = (
  accountRecipes: Page<SavedRecipeDocument>,
  dataLoaders: DataLoaders
): Page<AccountDocument> => {
  const { accountLoader, savedRecipeCountLoader } = dataLoaders
  const { nodes, edges, query, totalCount: count } = accountRecipes

  const accountsNodes = nodes.map(node =>
    accountLoader.load(node.account as any)
  )
  const accountsEdges = edges.map(edge => ({ ...edge, node: accountsNodes }))

  return {
    ...accountRecipes,
    edges: accountsEdges as any,
    nodes: accountsNodes as any,
    totalCount: count || (savedRecipeCountLoader.load(query.criteria) as any)
  }
}

const loadFollowersFromFollowerships = (
  followership: Page<FollowershipDocument>,
  dataLoaders: DataLoaders
): Page<AccountDocument> => {
  const { accountLoader, followershipCountLoader } = dataLoaders
  const { nodes, edges, query, totalCount: count } = followership

  const accountNodes = nodes.map(node =>
    accountLoader.load(node.follower as any)
  )
  const accountEdges = edges.map(edge => ({ ...edge, node: accountNodes }))

  return {
    ...followership,
    edges: accountEdges as any,
    nodes: accountNodes as any,
    totalCount: count || (followershipCountLoader.load(query.criteria) as any)
  }
}

const loadFollowingFromFollowerships = (
  followership: Page<FollowershipDocument>,
  dataLoaders: DataLoaders
): Page<FollowershipDocument['followedData']> => {
  const { followershipCountLoader } = dataLoaders
  const { nodes, edges, query, totalCount: count } = followership

  const followingNodes = nodes.map(node => {
    const loader = getDataLoaderByModel(node.followedDataType, dataLoaders)

    return loader?.load(node.followedData as any)
  })
  const followingEdges = edges.map(edge => ({ ...edge, node: followingNodes }))

  return {
    ...followership,
    edges: followingEdges as any,
    nodes: followingNodes as any,
    totalCount: count || (followershipCountLoader.load(query.criteria) as any)
  }
}

const loadAccountsFromReactions = (
  commentReactions: Page<CommentReactionDocument>,
  dataLoaders: DataLoaders
): Page<AccountDocument> => {
  const { accountLoader, commentReactionCountLoader: countLoader } = dataLoaders
  const { nodes, edges, query, totalCount: count } = commentReactions

  const accountNodes = nodes.map(node =>
    accountLoader.load(node.account as any)
  )
  const accountEdges = edges.map(edge => ({ ...edge, node: accountNodes }))

  return {
    ...commentReactions,
    edges: accountEdges as any,
    nodes: accountNodes as any,
    totalCount: count || (countLoader.load(query.criteria) as any)
  }
}

export {
  loadRecipesFromSavedRecipes,
  loadFollowersFromFollowerships,
  loadFollowingFromFollowerships,
  loadAccountsFromReactions,
  loadAccountsFromSavedRecipes
}
