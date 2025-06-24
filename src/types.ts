export interface Artist {
  id: string;
  name: string;
  description: string;
  website: string;
  image: string;
  flip_image: string;
  all_images: string[];
  house_number: number;
}

export interface Course {
  artist_ids: string | string[];
  name: string;
  link: string;
  start_month?: number;
  end_month?: number;
  content: string;
  house_number: number;
}

export interface AgendaItem {
  title: string;
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  event_link: string;
  content: string;
}

export interface Exposition {
  title: string;
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  location: string;
  address: string;
  curator: string;
  /**
   * Time of the opening event (one-off, always on the first day)
   */
  opening_event_time?: string;
  /**
   * Description for the opening event
   */
  opening_event_description?: string;
  /**
   * Artist ids (should match artists in content/artists)
   * Can be a single string, comma-separated string, or array of strings
   */
  artist_ids: string | string[];
  /**
   * Link to more information about the exposition
   */
  link?: string;
  content: string;
}
