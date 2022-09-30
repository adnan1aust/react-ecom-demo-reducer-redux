import { CATEGORIES_ACTION_TYPE } from "./category.type";

export const setCategoriesMap = (categoriesMap) => ({type: CATEGORIES_ACTION_TYPE.SET_CATEGORIES_MAP, payload:categoriesMap})