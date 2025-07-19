import { Genre } from "@/models"
import { getResource } from "./api.client"
import { GenresEndpoints } from "./endpoints/genres.endpoints"

export const getAnimeGenres = () => {
    return getResource<Genre[]>({
        endpoint: GenresEndpoints.animeGenres
    })
}
export const getMangaGenres = () => {
    return getResource<Genre[]>({
        endpoint: GenresEndpoints.mangaGenres
    })
}