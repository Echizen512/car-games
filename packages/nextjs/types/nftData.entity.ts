export interface INftDataSeaResponse {
  nfts: INftDataSea[];
}

export interface INftDataSea {
  identifier: string;
  metadata_url: string;
  opensea_url: string;
  image_url: string;
}

export interface INftPreview {
  image: string;
  name: string;
  description: string;
  attributes: INftAttribute[];
}

export interface INftAttribute {
  display_type: string;
  trait_type: string;
  value: string;
}
