import Lottie from 'lottie-react';
import animationData from '../../../public/animation/loadingSeoEditor.json'; // adjust path to match your JSON file location

export default function LottieLoader() {
    return (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 flex flex-col items-center justify-center z-50">
            <div className="w-96 h-96">
                <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                />
            </div>
        </div>
    );
}
