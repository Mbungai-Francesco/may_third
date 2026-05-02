export interface Wish {
  id: string
  userId: string
  friendId: string

  title: string
  content: string
  date: Date
  time: string
  opened: boolean
  deleted: boolean
  reaction: Reaction
}

export interface WishCreateDTO {
  friendId: string
  title: string
  content: string
  date: Date
  time: string
}

export interface WishUpdateDTO {
  title: string
  content: string
}

export enum Reaction {
  NOTHING = 'NOTHING',
  DISLIKE = 'DISLIKE',
  LIKE = 'LIKE',
  LOVE = 'LOVE',
}
