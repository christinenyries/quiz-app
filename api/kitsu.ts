export interface Anime {
  id: string;
  attributes: {
    synopsis: string;
    startDate: string;
    posterImage: {
      medium: string;
    };
  };
  relationships: {
    genres: {
      links: {
        related: string;
      };
    };
  };
}

export interface Genre {
  id: string;
  attributes: {
    name: string;
  };
}

export interface Collection<T> {
  data: T[];
}
