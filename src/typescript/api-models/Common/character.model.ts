import { JikanEntity } from './entity.model'
import type { JikanPerson } from './person.model'

export interface CommonCharacter {
	character: JikanEntity & { name: string }
	role: CharacterRole
}

export interface CharacterVoiceActor {
	person: JikanPerson
	language: string
}

export type CharacterRole = 'Main' | 'Supporting'
