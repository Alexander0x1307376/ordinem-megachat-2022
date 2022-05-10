export interface Image {
  uuid?: string,
  name?: string,
  description?: string,
  imageUrl: string
}

export interface ImagePostData {
  name?: string,
  description?: string,
  path?: string
}