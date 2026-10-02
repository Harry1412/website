import ice23 from '../images/2023_iceland.jpg'
import paris24 from '../images/2024_paris.jpg'
import sta25 from '../images/2025_st_andrews.jpg'
import morz26 from '../images/2026_morzine.jpg'

const GALLERY = [
  { src: morz26, caption: '2026 • Morzine' },
  { src: sta25, caption: '2025 • St. Andrews' },
  { src: paris24, caption: '2024 • Paris' },
  { src: ice23, caption: '2023 • Iceland' },
]

export default function GalleryPage() {
  return (
    <section className="gallery">
      <h1>Gallery</h1>
      <p>A selection of photos from my time on this earth.</p>
      <div className="gallery-grid">
        {GALLERY.map((item) => (
          <figure className="gallery-item" key={item.src}>
            <img src={item.src} alt={item.caption} loading="lazy" />
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}