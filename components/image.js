import { getStrapiMedia } from "../lib/media"
import NextImage from "next/image"

const Image = ({ image, quality }) => {
  const { url, alternativeText, width, height } = image.attributes

  const loader = () => {
    return getStrapiMedia(`${url}?q=${quality || 75}`)
  }

  return (
    <NextImage
      loader={loader}
      layout="responsive"
      width={width || "100%"}
      height={height || "100%"}
      objectFit="contain"
      src={getStrapiMedia(url)}
      alt={alternativeText || ""}
    />
  )
}

export default Image
