export interface Wish {
	id: string;
	userId: string;
	friendId: string;

	title: string;
	content: string;
	date: Date;
	time: string;
	opened: boolean;
	deleted: boolean;
	reaction: Reaction;
	town?: string;
}

export interface WishCreateDTO {
  friendId: string
  title: string
  content: string
  date: Date
  time: string
  town?: string
}

export interface WishUpdateDTO {
  title: string
  content: string
  town?: string
}

export enum Reaction {
  NOTHING = 'NOTHING',
  DISLIKE = 'DISLIKE',
  LIKE = 'LIKE',
  LOVE = 'LOVE',
}
