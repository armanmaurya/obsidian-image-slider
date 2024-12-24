import { useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosPause } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";

export const ImageSlider = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const ref = useRef<HTMLImageElement>(null);

    const next = () => {
        if (currentIndex < images.length - 1) {
            if (ref.current) {
                if (ref.current.parentElement) {
                    const allImages = ref.current.parentElement.querySelectorAll('img');
                    allImages.forEach((image, i) => {
                        // console.log(image);
                        image.style.transform = `translateX(-${ (currentIndex + 1) * 100}%)`;
                    })
                }
                
            }
            setCurrentIndex(currentIndex + 1);
        }
    }

    const prev = () => {
        if (currentIndex >= 0) {
            if (ref.current) {
                if (ref.current.parentElement) {
                    const allImages = ref.current.parentElement.querySelectorAll('img');
                    allImages.forEach((image, i) => {
                        // console.log(image);
                        image.style.transform = `translateX(-${(currentIndex - 1) * 100}%)`;
                    })
                }
                
            }
            setCurrentIndex(currentIndex - 1);
        }
    }


    return (
        <div style={{ position: 'relative', userSelect: "none"}}>
            <div className="hover:cursor-pointer" style={{ position: "absolute", alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', bottom: 0, gap: '20px', backgroundColor: 'rgba(5, 5, 5, 0.5)', zIndex: 10}}>
                <IoIosArrowForward size={28} onClick={prev} color="black" style={{transform: 'rotate(180deg)'}}/>
                <IoIosArrowForward size={28} onClick={next} className="hover:cursor-pointer"  color="black"/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'hidden'}}>
                {images.map((image, i) => {
                    return <img key={i} ref={ref} src={image} style={{ maxWidth: '100%', transition: "transform 0.5s ease-in-out", borderRadius: "10px"}} />
                })}
            </div>
        </div>
    )
}

