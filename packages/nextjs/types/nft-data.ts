export interface INftPreview {
  description: string;
  image: string;
  name: string;
  attributes: INftAttributes[];
}

export interface INftAttributes {
  trait_type: string;
  value: string;
}
