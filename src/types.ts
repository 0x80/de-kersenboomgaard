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
  artist_id: string;
  name: string;
  link: string;
  start_month?: number;
  end_month?: number;
  content: string;
  artist_name: string;
  house_number: number;
  additional_artist_id?: string;
  additional_artist_name?: string;
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
