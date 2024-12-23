export const ImageSlider = ({images} : {images: string[]}) => {
    
  return (
    <div>
        {images.map((image, i) => {
            return <img key={i} src={image} style={{maxWidth: '100%'}}/>
        })}
    </div>
  )
}
