export interface JikanPaginationBase {
	last_visible_page: number
	has_next_page: boolean
}

export interface JikanPaginationPlus extends JikanPaginationBase{
	current_page: number
	items: JikanPaginationItems
}

export interface JikanPaginationItems {
	count: number
	total: number
	per_page: number
}

export interface JikanResponse<T, P = JikanPaginationBase> {
	data: T
	pagination?: P
}
