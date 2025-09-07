export default function gallery(){
  const images = [
    '/images/IMG_2505.JPG',
    '/images/IMG_2508.jpeg',
    '/images/IMG_2504.PNG',
    '/images/IMG_2513.jpg',
    '/images/IMG_2507.jpg',
  ];

  const columnsCount = 4;
  const columns = Array.from({ length: columnsCount }, () => []);

  images.forEach((src, i) => {
    columns[i % columnsCount].push(src);
  });

  return (
    <div className="m-5 grid grid-cols-2 md:grid-cols-4 gap-4">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="grid gap-4">
          {col.map((src, idx) => (
            <div key={idx}>
              <img
                className="h-auto max-w-full rounded-lg"
                src={src}
                alt={`gallery-${colIdx}-${idx}`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}