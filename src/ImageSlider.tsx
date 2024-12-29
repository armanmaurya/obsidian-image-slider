import { useEffect, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosPause } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";

export const ImageSlider = ({
	images,
	borderRadius,
}: {
	images: string[];
	borderRadius: string | number | undefined;
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const imageRef = useRef<HTMLImageElement>(null);

	const ImageContainerRef = useRef<HTMLDivElement>(null);

	const next = () => {
		if (currentIndex < images.length - 1) {
			if (imageRef.current) {
				if (imageRef.current.parentElement) {
					const allImages =
						imageRef.current.parentElement.querySelectorAll("img");
					allImages.forEach((image, i) => {
						// console.log(image);
						image.style.transform = `translateX(-${
							(currentIndex + 1) * 100
						}%)`;
					});
				}
			}
			setCurrentIndex(currentIndex + 1);
		}
	};

	const prev = () => {
		if (currentIndex >= 0) {
			if (imageRef.current) {
				if (imageRef.current.parentElement) {
					const allImages =
						imageRef.current.parentElement.querySelectorAll("img");
					allImages.forEach((image, i) => {
						// console.log(image);
						image.style.transform = `translateX(-${
							(currentIndex - 1) * 100
						}%)`;
					});
				}
			}
			setCurrentIndex(currentIndex - 1);
		}
	};

	useEffect(() => {
		if (ImageContainerRef.current) {
			ImageContainerRef.current.style.borderRadius = `${borderRadius}px`;
		}
	}, []);

	return (
		<div className="image-slider-container" ref={ImageContainerRef}>
			<div
				className="image-slider-image-container"
			>
				{images.map((image, i) => {
					return (
						<img
							className="image-slider-image"
							key={i}
							ref={imageRef}
							src={image}
						/>
					);
				})}
			</div>
            <div className="image-slider-nav-buttons-container">
				<IoIosArrowForward
					className="image-slider-nav-button-reverse image-slider-nav-button"
					size={28}
					onClick={prev}
					color="black"
				/>
				<IoIosArrowForward
					size={28}
					onClick={next}
					className="image-slider-nav-button"
					color="black"
				/>
			</div>
		</div>
	);
};
