"use client";

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

export function CourseList({ courses }: { courses: Course[] }) {
  const handleArtistClick = (e: React.MouseEvent, artistId: string) => {
    e.preventDefault();
    const element = document.getElementById(`artist-${artistId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {courses.map((course, index) => (
        <div key={index} className="space-y-3">
          <h3 className="text-xl font-medium text-gray-900">{course.name}</h3>
          <p className="text-sm text-gray-600">
            docent{" "}
            <button
              onClick={(e) => handleArtistClick(e, course.artist_id)}
              className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
            >
              {course.artist_name}
            </button>
            {course.additional_artist_name && course.additional_artist_id && (
              <>
                {" & "}
                <button
                  onClick={(e) =>
                    handleArtistClick(e, course.additional_artist_id!)
                  }
                  className="bg-gray-100 px-1 py-0.5 text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
                >
                  {course.additional_artist_name}
                </button>
              </>
            )}
          </p>
          {course.content && (
            <p className="leading-relaxed text-gray-600">{course.content}</p>
          )}
          <a
            href={course.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-100 px-1 py-0.5 text-sm text-gray-900 hover:text-black hover:shadow-[0_3px_0_0_#374151]"
          >
            Meer info →
          </a>
        </div>
      ))}
    </div>
  );
}
