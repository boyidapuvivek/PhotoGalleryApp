import { GalleryImage } from './gallery';

export type RootStackParamList = {
  Home: undefined;
  ImageViewer: {
    images: GalleryImage[];
    initialIndex: number;
  };
  Favorites: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Gallery: undefined;
  Favorites: undefined;
  Settings: undefined;
};